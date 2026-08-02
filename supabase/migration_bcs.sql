-- ═══════════════════════════════════════════════════════════════════════════
-- BREY Fitness — Sprint 1 (M3): tablas del Body Composition System
-- ═══════════════════════════════════════════════════════════════════════════
-- Aplica la migración M3 del Implementation Handbook (05). Origen del diseño:
-- BCS Handbook (02, tres agregados independientes por BCS-ADR-01) +
-- Implementation Handbook (05, IMP-ADR-06 — mapeo de las 25 variables a
-- columna) + Database Handbook (04 columnas, 07 constraints, 09 RLS).
--
-- Tres agregados raíz independientes (BCS-ADR-01), cada uno referenciando a
-- su Cliente por FK — nunca contenidos uno dentro de otro:
--   bcs_clientes           — el Cliente presencial del Entrenador
--   bcs_mediciones         — captura puntual de hasta 25 variables
--   bcs_enlaces_publicos   — token de acceso público de solo lectura
--
-- BCS es standalone (BCS Handbook 00): sus tablas nunca referencian ninguna
-- tabla del Core Product; su única FK hacia afuera es entrenador_id →
-- auth.users, solo para identidad del Entrenador (Domain Model IN-31).
--
-- On delete de las tres FK del BCS: el Database Handbook (05) las marca
-- "No especificado", y AP-06 (16) deja explícitamente abierto si
-- bcs_mediciones.cliente_id debe cascadear al eliminar un Cliente. Por eso
-- se usa el default de Postgres (NO ACTION, sin cláusula) en las tres:
-- preserva la integridad referencial (IN-22, IN-26 — nunca una Medición ni
-- un Enlace sin Cliente válido) sin comprometer una decisión de cascade que
-- ningún handbook ha tomado. El teardown de UC-04 (eliminación permanente
-- con cascada de revocación) vive en la capa de aplicación (BCS Handbook
-- 10), fuera del alcance de este Sprint.
--
-- Idempotente: `create table if not exists`, `drop policy if exists` antes
-- de cada `create policy`.


-- ── bcs_clientes ───────────────────────────────────────────────────────────
-- El Cliente presencial. Standalone respecto al Usuario (Domain Model IN-31):
-- una persona real puede ser Usuario y Cliente a la vez sin que el modelo lo
-- vincule. Máquina de estados: activo ⇄ archivado → eliminado (terminal).

create table if not exists public.bcs_clientes (
  id uuid primary key default gen_random_uuid(),
  entrenador_id uuid not null references auth.users(id),
  nombre text not null,
  estado text not null default 'activo' check (estado in ('activo', 'archivado', 'eliminado')),
  created_at timestamptz not null default now()
);

alter table public.bcs_clientes enable row level security;

-- RLS: el Entrenador dueño ve/crea/edita sus propios Clientes. El archivado
-- (UC-03) es un UPDATE de estado, cubierto por la política de update. La
-- eliminación permanente (UC-04) nunca es un DELETE directo — pasa por la
-- lógica de cascada de la capa de aplicación (Database Handbook 09), así que
-- no hay política de DELETE aquí.

drop policy if exists "bcs_clientes: el entrenador ve sus propios clientes" on public.bcs_clientes;
drop policy if exists "bcs_clientes: el entrenador crea sus propios clientes" on public.bcs_clientes;
drop policy if exists "bcs_clientes: el entrenador edita sus propios clientes" on public.bcs_clientes;

create policy "bcs_clientes: el entrenador ve sus propios clientes"
  on public.bcs_clientes for select
  using (auth.uid() = entrenador_id);

create policy "bcs_clientes: el entrenador crea sus propios clientes"
  on public.bcs_clientes for insert
  with check (auth.uid() = entrenador_id);

create policy "bcs_clientes: el entrenador edita sus propios clientes"
  on public.bcs_clientes for update
  using (auth.uid() = entrenador_id)
  with check (auth.uid() = entrenador_id);


-- ── bcs_mediciones ─────────────────────────────────────────────────────────
-- Captura puntual de hasta 25 variables (Implementation Handbook 05,
-- IMP-ADR-06 — mapeo canónico). La tabla más ancha del ecosistema: 3
-- metadatos de agregado + 25 variables. Historial inmutable (BCS-ADR-03):
-- una corrección crea una fila `vigente` nueva y anula la anterior, nunca
-- edita en sitio — de ahí RLS sin update ni delete.

create table if not exists public.bcs_mediciones (
  -- Metadatos de agregado
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.bcs_clientes(id),
  estado text not null default 'vigente' check (estado in ('vigente', 'anulada')),

  -- Las 25 variables (BCS Handbook 03 → columna por IMP-ADR-06). Todas
  -- nullable salvo `fecha` (una Medición siempre tiene fecha, nunca futura).
  altura_cm            numeric,   -- BCS-V01
  peso_kg              numeric,   -- BCS-V02
  imc                  numeric,   -- BCS-V03 (derivado)
  grasa_pct            numeric,   -- BCS-V04
  masa_grasa_kg        numeric,   -- BCS-V05 (derivado)
  masa_muscular_kg     numeric,   -- BCS-V06
  masa_libre_grasa_kg  numeric,   -- BCS-V07 (derivado)
  agua_total_l         numeric,   -- BCS-V08
  agua_intracelular_l  numeric,   -- BCS-V09
  agua_extracelular_l  numeric,   -- BCS-V10
  proteina_kg          numeric,   -- BCS-V11
  minerales_kg         numeric,   -- BCS-V12
  masa_osea_kg         numeric,   -- BCS-V13
  grasa_visceral_idx   numeric,   -- BCS-V14 (índice, sin unidad física)
  angulo_fase_deg      numeric,   -- BCS-V15
  bmr_kcal             numeric,   -- BCS-V16
  edad_metabolica      int,       -- BCS-V17
  smi                  numeric,   -- BCS-V18 (derivado)
  circ_cintura_cm      numeric,   -- BCS-V19
  circ_cadera_cm       numeric,   -- BCS-V20
  whr                  numeric,   -- BCS-V21 (derivado)
  impedancia_ohm       numeric,   -- BCS-V22
  fecha                date not null,   -- BCS-V23 — nunca futura
  observaciones        text,      -- BCS-V24
  foto_url             text,      -- BCS-V25 — referencia a Storage, nunca la imagen

  -- FECHA_FUTURA (Database Handbook 07): una Medición nunca documenta el
  -- futuro. CHECK evaluado en cada escritura.
  constraint bcs_mediciones_fecha_no_futura check (fecha <= current_date),

  -- VALOR_FUERA_DE_RANGO_FISICO (Database Handbook 07 / BCS Handbook 03):
  -- ninguna variable de masa corporal (kg) puede exceder el peso total.
  -- Cada comparación pasa cuando algún operando es NULL (Postgres trata el
  -- CHECK NULL como aprobado); solo falla si ambos son no-nulos y la masa
  -- supera al peso.
  constraint bcs_mediciones_masa_no_supera_peso check (
    masa_grasa_kg       <= peso_kg and
    masa_muscular_kg    <= peso_kg and
    masa_libre_grasa_kg <= peso_kg and
    proteina_kg         <= peso_kg and
    minerales_kg        <= peso_kg and
    masa_osea_kg        <= peso_kg
  )
);

alter table public.bcs_mediciones enable row level security;

-- RLS: el Entrenador dueño del Cliente referenciado ve/crea sus Mediciones.
-- El EXISTS contra bcs_clientes se apoya en la RLS de esa tabla (el
-- Entrenador solo ve sus propios Clientes), así que la subconsulta solo
-- resuelve para Clientes propios. El acceso anónimo del Cliente (vía token
-- de enlace público) NUNCA lee esta fila directamente — su resolución
-- token→Reporte vive en la capa de aplicación (Database Handbook 09,
-- BCS Handbook IN-A2), fuera del alcance de este Sprint. Sin update ni
-- delete: la Medición es inmutable (BCS-ADR-03).

drop policy if exists "bcs_mediciones: el entrenador ve las mediciones de sus clientes" on public.bcs_mediciones;
drop policy if exists "bcs_mediciones: el entrenador registra mediciones de sus clientes" on public.bcs_mediciones;

create policy "bcs_mediciones: el entrenador ve las mediciones de sus clientes"
  on public.bcs_mediciones for select
  using (exists (
    select 1 from public.bcs_clientes c
    where c.id = cliente_id and c.entrenador_id = auth.uid()
  ));

create policy "bcs_mediciones: el entrenador registra mediciones de sus clientes"
  on public.bcs_mediciones for insert
  with check (exists (
    select 1 from public.bcs_clientes c
    where c.id = cliente_id and c.entrenador_id = auth.uid()
  ));

-- Sin política de UPDATE ni DELETE, a propósito — una Medición vigente nunca
-- se edita en sitio (BCS-ADR-03, IN-D1); la corrección crea una fila nueva y
-- marca la anterior como `anulada`, ambas cosas en la capa de aplicación.


-- ── bcs_enlaces_publicos ───────────────────────────────────────────────────
-- Token de acceso público de solo lectura al Reporte de un Cliente. Aggregate
-- root independiente (BCS-ADR-01). Token único global (BCS-ADR-02) — nunca
-- reutilizado, ni siquiera tras revocación (IN-28). La longitud mínima de 21
-- caracteres es una garantía del generador (capa de aplicación), no un CHECK
-- de base de datos. Máquina de estados: activo → revocado (terminal).

create table if not exists public.bcs_enlaces_publicos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.bcs_clientes(id),
  token text not null unique,
  estado text not null default 'activo' check (estado in ('activo', 'revocado')),
  created_at timestamptz not null default now()
);

alter table public.bcs_enlaces_publicos enable row level security;

-- RLS: el Entrenador dueño del Cliente gestiona (ve/crea/revoca) los enlaces.
-- La revocación (UC-08) es un UPDATE de estado a `revocado`, cubierto por la
-- política de update; no hay DELETE (un enlace revocado se conserva como
-- historial, nunca se borra físicamente — IN-28). La resolución token→Reporte
-- para el portador anónimo vive en la capa de aplicación (Database Handbook
-- 09), no como política RLS base.

drop policy if exists "bcs_enlaces_publicos: el entrenador ve los enlaces de sus clientes" on public.bcs_enlaces_publicos;
drop policy if exists "bcs_enlaces_publicos: el entrenador crea enlaces de sus clientes" on public.bcs_enlaces_publicos;
drop policy if exists "bcs_enlaces_publicos: el entrenador revoca enlaces de sus clientes" on public.bcs_enlaces_publicos;

create policy "bcs_enlaces_publicos: el entrenador ve los enlaces de sus clientes"
  on public.bcs_enlaces_publicos for select
  using (exists (
    select 1 from public.bcs_clientes c
    where c.id = cliente_id and c.entrenador_id = auth.uid()
  ));

create policy "bcs_enlaces_publicos: el entrenador crea enlaces de sus clientes"
  on public.bcs_enlaces_publicos for insert
  with check (exists (
    select 1 from public.bcs_clientes c
    where c.id = cliente_id and c.entrenador_id = auth.uid()
  ));

create policy "bcs_enlaces_publicos: el entrenador revoca enlaces de sus clientes"
  on public.bcs_enlaces_publicos for update
  using (exists (
    select 1 from public.bcs_clientes c
    where c.id = cliente_id and c.entrenador_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.bcs_clientes c
    where c.id = cliente_id and c.entrenador_id = auth.uid()
  ));

-- Sin política de DELETE, a propósito — un enlace revocado se conserva como
-- historial (IN-28); re-compartir crea un token nuevo, nunca reactiva ni
-- borra el anterior.
