-- ═══════════════════════════════════════════════════════════════════════════
-- BREY Fitness — Esquema inicial de base de datos (backend v1)
-- ═══════════════════════════════════════════════════════════════════════════
-- Cómo usar: pega todo este archivo en el SQL Editor del Dashboard de
-- Supabase (o corre vía CLI si lo tienes configurado) y ejecútalo una sola
-- vez sobre un proyecto nuevo.
--
-- Después de correrlo, verifica en Table Editor que las 9 tablas muestran
-- RLS activo (sin la advertencia amarilla) — sin ENABLE ROW LEVEL SECURITY
-- las políticas de abajo nunca se evalúan y cualquiera con la anon key
-- (pública, va en el JS del navegador) puede leer y escribir todo. Es el
-- error más común y silencioso de Supabase.
--
-- Sprint 1 (persistencia) añadió 4 tablas a las 5 originales:
-- progression_events (M2) y las tres del BCS — bcs_clientes, bcs_mediciones,
-- bcs_enlaces_publicos (M3) — más 5 índices oficiales (M4). Para un proyecto
-- YA en producción, esos deltas viven en migration_progression_events.sql,
-- migration_bcs.sql y migration_indices.sql; este schema.sql los incluye
-- para que un proyecto nuevo nazca ya con el estado completo.
--
-- Alcance deliberado de esta primera versión (ver plan técnico completo):
--   · systems es un catálogo liviano — no replica cada campo del Sistema
--     rico de src/data/sistemas.ts (colores, iconos, fases/niveles/
--     ecosistema completos). Existe como destino de FK y como punto para
--     alternar disponibilidad/precio sin redeploy, no como reemplazo del
--     archivo estático.
--   · diagnoses requiere user_id — el /diagnostico público y anónimo sigue
--     funcionando exactamente igual que hoy (efímero, sin persistir);
--     conectarlo a esta tabla es la siguiente iteración, no esta.
--   · ejercicios en workouts/workout_logs es jsonb, no una tabla
--     normalizada (workout_log_exercises) — ver nota de trade-off junto a
--     esas tablas.
-- ═══════════════════════════════════════════════════════════════════════════


-- ── systems ──────────────────────────────────────────────────────────────
-- Catálogo liviano de los 5 Sistemas del BPS. Va primero porque profiles,
-- diagnoses y workouts referencian su slug.

create table public.systems (
  slug text primary key,
  nombre text not null,
  objetivo text,
  tagline text,
  descripcion text,
  duracion_semanas int,
  disponible boolean not null default false,
  precio numeric,
  modelo_precio text check (modelo_precio in ('unico', 'membresia')),
  created_at timestamptz not null default now()
);

alter table public.systems enable row level security;

-- Catálogo público — incluso usuarios anónimos pueden verlo (igual que
-- hoy la página /sistemas de marketing es pública).
create policy "systems: lectura pública"
  on public.systems for select
  using (true);

-- Sin políticas de insert/update/delete: con RLS activo y ninguna política
-- para esas operaciones, quedan bloqueadas para anon/authenticated por
-- defecto. Gestión de catálogo vía Dashboard/service role, sin UI de
-- admin en esta iteración.

-- Semilla: los mismos 5 Sistemas ya reales en src/data/sistemas.ts
-- (nombre/objetivo/tagline/duración/precio calcados; descripcion se deja
-- null a propósito — el copy largo real vive en el archivo estático, no
-- se duplica aquí).
insert into public.systems (slug, nombre, objetivo, tagline, duracion_semanas, disponible, precio, modelo_precio) values
  ('hipertrofia', 'Sistema de Hipertrofia', 'Construir masa muscular con método', 'Músculo construido con ciencia, no con ensayo y error.', 16, true, 39, 'unico'),
  ('calistenia',  'Sistema de Calistenia',  'Dominar tu peso corporal, hasta las skills', 'Domina tu cuerpo. Desde la primera dominada hasta la planche.', 24, true, 49, 'unico'),
  ('hibrido',     'Sistema Híbrido',        'Fuerza absoluta y relativa en un solo camino', 'El mejor físico funcional. Cargas y peso corporal como uno solo.', 20, true, 59, 'unico'),
  ('fuerza',      'Sistema de Fuerza',      'Levantar más — con técnica y progresión reales', 'La fuerza es la base de todo. Constrúyela con método.', null, false, null, 'unico'),
  ('elite',       'Sistema Elite',          'Acceso total + coaching directo e individualizado', 'El acceso completo. Más coaching directo.', null, false, null, 'membresia');


-- ── profiles ─────────────────────────────────────────────────────────────
-- Un perfil por usuario. Se crea automáticamente vía el trigger al final
-- de este archivo (no por código de la app) — garantizado que exista
-- antes de que cualquier sesión autenticada sea usable.
--
-- Columnas de personal/física/deportiva añadidas en Sprint 4 (Perfil
-- Persistente) — ver supabase/migration_perfil_persistente.sql, el archivo
-- que de verdad se pegó sobre el proyecto en producción; este schema.sql
-- solo se mantiene en paralelo para que un proyecto nuevo desde cero nazca
-- ya con el estado actual. sistema_actual/nivel_actual son del Diagnóstico
-- BPS, no de este Sprint — nivel_experiencia es autorreportado y una
-- columna completamente distinta, no lo confundas con nivel_actual.

create table public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text,
  nombre text,
  avatar_url text,
  sistema_actual text references public.systems(slug),
  nivel_actual text,

  -- Información personal
  edad int check (edad is null or (edad > 0 and edad < 120)),
  sexo text check (sexo in ('Masculino', 'Femenino', 'Prefiero no decirlo')),

  -- Información física
  peso_kg numeric check (peso_kg > 20),
  altura_cm numeric check (altura_cm > 80),

  -- Información deportiva (etiquetas calcadas del Diagnóstico BPS,
  -- src/lib/diagnostico/preguntas.ts, para un solo vocabulario en toda la app)
  objetivo text check (objetivo in (
    'Ganar músculo y masa', 'Perder grasa y definir', 'Ganar fuerza máxima',
    'Dominar habilidades de peso corporal', 'Transformación completa'
  )),
  nivel_experiencia text check (nivel_experiencia in ('Principiante', 'Intermedio', 'Avanzado')),
  lugar_entrenamiento text check (lugar_entrenamiento in ('Gym', 'Casa o parque', 'Ambos')),
  dias_por_semana int check (dias_por_semana between 1 and 7),
  duracion_sesion_min int check (duracion_sesion_min > 0),
  experiencia text check (experiencia in ('Menos de 1 año', '1 – 3 años', 'Más de 3 años')),
  lesiones text,
  observaciones text,

  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "profiles: el usuario ve su propio perfil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "profiles: el usuario edita su propio perfil"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);
-- LIMITACIÓN DOCUMENTADA, NO RESUELTA AHORA: esta política deja editar
-- CUALQUIER columna de la propia fila, incluidas sistema_actual/
-- nivel_actual. Hoy es inofensivo porque no hay compras ni permisos
-- atados a esos campos — el día que sí los haya, deben escribirse por un
-- camino de servidor separado (Server Action con su propia autorización),
-- no por esta política general de "el usuario edita lo suyo".

-- Política de INSERT defensiva, NO es el camino principal de creación
-- (ese es el trigger de abajo, que corre como SECURITY DEFINER y no
-- pasa por RLS). Existe solo como respaldo: si por lo que sea el trigger
-- no creó el perfil, app/app/layout.tsx intenta un upsert de emergencia
-- antes de renderizar — sin esta política, ese respaldo fallaría.
create policy "profiles: respaldo defensivo de creación propia"
  on public.profiles for insert
  with check (auth.uid() = id);

-- Mantiene updated_at honesto en cada UPDATE.
create function public.set_updated_at()
returns trigger
language plpgsql
set search_path = ''
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();


-- ── diagnoses ────────────────────────────────────────────────────────────
-- Espeja el tipo Resultado de src/lib/diagnostico/tipos.ts. Registros
-- históricos e inmutables — sin política de update/delete a propósito.

create table public.diagnoses (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  sistema_recomendado text not null references public.systems(slug),
  nivel_entrada text,
  disponible boolean not null,
  razones jsonb not null default '[]'::jsonb,
  notas jsonb not null default '[]'::jsonb,
  respuestas jsonb not null default '[]'::jsonb,
  created_at timestamptz not null default now()
);

alter table public.diagnoses enable row level security;

create policy "diagnoses: el usuario ve sus propios diagnósticos"
  on public.diagnoses for select
  using (auth.uid() = user_id);

create policy "diagnoses: el usuario crea sus propios diagnósticos"
  on public.diagnoses for insert
  with check (auth.uid() = user_id);


-- ── workouts ─────────────────────────────────────────────────────────────
-- El plan/plantilla — qué se debería entrenar. Distinto de workout_logs
-- (lo que realmente se hizo), reflejando la misma distinción que ya existe
-- en el mock (entrenamientoHoy vs. historialSesiones).
--
-- Cambio deliberado respecto al mock: los días de descanso NO se guardan
-- como fila — un día sin fila en fecha_planificada ES el descanso (más
-- normalizado que el 'descanso' explícito de EstadoDia en el mock).
-- 'hoy' tampoco se guarda nunca: se calcula comparando fecha_planificada
-- con la fecha actual en el momento de leer, no es un estado persistido.
--
-- TRADE-OFF EXPLÍCITO: ejercicios es jsonb, no una tabla normalizada
-- workout_log_exercises. Se eligió jsonb para esta iteración porque
-- el fundador pidió exactamente 5 tablas (una sexta sin pedirla sería
-- alcance no solicitado) y migrar de jsonb a una tabla relacional es
-- barato mientras no haya volumen real de datos. Si el tracking de PRs
-- (hoy dato simulado a mano en recordsRecientes del mock) se vuelve una
-- consulta real tipo "MAX(peso) agrupado por ejercicio a través del
-- tiempo", ese es el momento de normalizar.

create table public.workouts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  system_slug text references public.systems(slug),
  nombre text not null,
  semana int,
  semana_total int,
  fecha_planificada date not null,
  duracion_estimada_min int,
  ejercicios jsonb not null default '[]'::jsonb,
  estado text not null default 'planificado' check (estado in ('planificado', 'completado', 'perdido')),
  created_at timestamptz not null default now()
);

alter table public.workouts enable row level security;

-- Endurecido en Sprint 0 (AR-018 de la Architecture Review): la política
-- original "CRUD propio" (for all) permitía DELETE sobre historial de
-- entrenamiento, contradiciendo FT-09. Ver migration_rls_endurecimiento.sql
-- para el mismo cambio aplicado a un proyecto ya en producción.

create policy "workouts: el usuario ve sus propios workouts"
  on public.workouts for select
  using (auth.uid() = user_id);

create policy "workouts: el usuario crea sus propios workouts"
  on public.workouts for insert
  with check (auth.uid() = user_id);

create policy "workouts: el usuario actualiza sus propios workouts"
  on public.workouts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Sin política de DELETE, a propósito — el historial de entrenamiento
-- planificado nunca se borra (FT-09).


-- ── workout_logs ─────────────────────────────────────────────────────────
-- Lo que realmente se entrenó. workout_id es opcional (permite sesiones
-- ad-hoc no planificadas); ejercicios incluye completado por set, que es
-- donde eventualmente debe persistir el toggle de checkboxes de
-- app/app/page.tsx (hoy solo estado local de React, sin guardar — esa
-- conexión es trabajo de la siguiente iteración, no de este esquema).
--
-- NOTA DE INTEGRIDAD (no resuelta ahora): nada sincroniza automáticamente
-- workouts.estado con los logs asociados — el futuro camino de escritura
-- debe actualizar ambas tablas en una sola transacción, o se necesitará
-- un trigger de sincronización, para evitar un workouts.estado='planificado'
-- con un log completado ya guardado al lado.

create table public.workout_logs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  workout_id uuid references public.workouts(id) on delete set null,
  fecha date not null,
  duracion_real_min int,
  volumen_total_kg numeric,
  ejercicios jsonb not null default '[]'::jsonb,
  completado boolean not null default false,
  created_at timestamptz not null default now()
);

alter table public.workout_logs enable row level security;

-- Endurecido en Sprint 0 (AR-018 de la Architecture Review): la política
-- original "CRUD propio" (for all) permitía DELETE y UPDATE sobre
-- historial de ejecución, contradiciendo FT-09/I-W3 (un log cerrado es
-- inmutable). Ver migration_rls_endurecimiento.sql para el mismo cambio
-- aplicado a un proyecto ya en producción.

create policy "workout_logs: el usuario ve sus propios workout_logs"
  on public.workout_logs for select
  using (auth.uid() = user_id);

create policy "workout_logs: el usuario crea sus propios workout_logs"
  on public.workout_logs for insert
  with check (auth.uid() = user_id);

-- Sin política de UPDATE ni DELETE, a propósito — un log cerrado es
-- inmutable (Architecture Handbook, 09, I-W3); una corrección crea un
-- registro nuevo, nunca edita el existente.


-- ── progression_events ─────────────────────────────────────────────────────
-- Sprint 1 / M2. Tabla única de eventos de TODO el ecosistema (ENG-ADR-03).
-- Append-only (P3/DM-ADR-06): RLS solo select+insert propios. El CHECK de
-- `tipo` trae los 25 valores consolidados desde el día uno (DB-ADR-03).
-- `origen=coach` queda reservado sin ningún tipo asociado (AR-011).

create table public.progression_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,
  tipo text not null check (tipo in (
    'activacion', 'pausa', 'reanudacion', 'sistema_completado',
    'gate_fallado', 'transicion_estado', 'anomalia',
    'avanza', 'sostiene', 'retrocede', 'prescripcion_actualizada',
    'escalon_avanzado', 'escalon_retrocedido', 'estancamiento_confirmado',
    'estancamiento_resuelto', 'deload_aplicado', 'deload_cancelado',
    'conflicto_resuelto', 'error_invocacion',
    'descarga_reactiva', 'dolor_reportado', 'restriccion_zona',
    'semana_generada', 'descarga_programada',
    'override_usuario'
  )),
  origen text not null check (origen in (
    'motor_bps', 'progression_engine', 'recovery_engine',
    'workout_generator', 'usuario', 'coach'
  )),
  razones jsonb not null,
  contexto jsonb,
  -- On delete set null: sigue el precedente de workout_logs.workout_id
  -- (el Database Handbook 05 lo marca "No especificado"); el evento de
  -- auditoría sobrevive aunque su log fuese removido.
  workout_log_id uuid references public.workout_logs(id) on delete set null,
  created_at timestamptz not null default now()
);

alter table public.progression_events enable row level security;

create policy "progression_events: el usuario ve sus propios eventos"
  on public.progression_events for select
  using (auth.uid() = user_id);

create policy "progression_events: el usuario crea sus propios eventos"
  on public.progression_events for insert
  with check (auth.uid() = user_id);

-- Sin UPDATE ni DELETE, a propósito — append-only (DM-ADR-06, IN-20).


-- ── bcs_clientes ───────────────────────────────────────────────────────────
-- Sprint 1 / M3. Cliente presencial del Entrenador. Standalone respecto al
-- Usuario (Domain Model IN-31). On delete de entrenador_id: sin cláusula
-- (NO ACTION), porque el Database Handbook (05) lo marca "No especificado" y
-- AP-06 deja abierto el cascade del BCS. Máquina de estados: activo ⇄
-- archivado → eliminado (terminal, IN-30).

create table public.bcs_clientes (
  id uuid primary key default gen_random_uuid(),
  entrenador_id uuid not null references auth.users(id),
  nombre text not null,
  estado text not null default 'activo' check (estado in ('activo', 'archivado', 'eliminado')),
  created_at timestamptz not null default now()
);

alter table public.bcs_clientes enable row level security;

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

-- Sin DELETE: la eliminación permanente (UC-04) pasa por la lógica de
-- cascada de la capa de aplicación, nunca un DELETE directo.


-- ── bcs_mediciones ─────────────────────────────────────────────────────────
-- Sprint 1 / M3. 3 metadatos de agregado + las 25 variables (IMP-ADR-06).
-- Historial inmutable (BCS-ADR-03): RLS sin update ni delete. Ownership vía
-- el Cliente referenciado (EXISTS contra bcs_clientes, que ya está acotada
-- por su propia RLS). fecha nunca futura; ninguna masa (kg) supera el peso.

create table public.bcs_mediciones (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.bcs_clientes(id),
  estado text not null default 'vigente' check (estado in ('vigente', 'anulada')),
  altura_cm            numeric,   -- BCS-V01
  peso_kg              numeric,   -- BCS-V02
  imc                  numeric,   -- BCS-V03
  grasa_pct            numeric,   -- BCS-V04
  masa_grasa_kg        numeric,   -- BCS-V05
  masa_muscular_kg     numeric,   -- BCS-V06
  masa_libre_grasa_kg  numeric,   -- BCS-V07
  agua_total_l         numeric,   -- BCS-V08
  agua_intracelular_l  numeric,   -- BCS-V09
  agua_extracelular_l  numeric,   -- BCS-V10
  proteina_kg          numeric,   -- BCS-V11
  minerales_kg         numeric,   -- BCS-V12
  masa_osea_kg         numeric,   -- BCS-V13
  grasa_visceral_idx   numeric,   -- BCS-V14
  angulo_fase_deg      numeric,   -- BCS-V15
  bmr_kcal             numeric,   -- BCS-V16
  edad_metabolica      int,       -- BCS-V17
  smi                  numeric,   -- BCS-V18
  circ_cintura_cm      numeric,   -- BCS-V19
  circ_cadera_cm       numeric,   -- BCS-V20
  whr                  numeric,   -- BCS-V21
  impedancia_ohm       numeric,   -- BCS-V22
  fecha                date not null,   -- BCS-V23
  observaciones        text,      -- BCS-V24
  foto_url             text,      -- BCS-V25
  constraint bcs_mediciones_fecha_no_futura check (fecha <= current_date),
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

-- Los VALORES de la Medición son inmutables (BCS-ADR-03, IN-D1): no hay
-- DELETE, y el UPDATE de abajo está acotado por partida doble — la policy
-- solo permite la transición vigente→anulada, y el GRANT solo alcanza la
-- columna `estado`. Corregir una Medición sigue siendo "anular + insertar"
-- (UC-06), nunca una edición en sitio.
--
-- Sin esta policy, anularMedicion queda bloqueada por RLS y corregirMedicion
-- deja dos mediciones vigentes duplicando el histórico (Sprint BCS-1.1). En
-- un proyecto YA en producción el delta vive en
-- migration_bcs_anular_medicion.sql.
create policy "bcs_mediciones: el entrenador anula mediciones de sus clientes"
  on public.bcs_mediciones for update
  using (
    estado = 'vigente'
    and exists (
      select 1 from public.bcs_clientes c
      where c.id = cliente_id and c.entrenador_id = auth.uid()
    )
  )
  with check (
    estado = 'anulada'
    and exists (
      select 1 from public.bcs_clientes c
      where c.id = cliente_id and c.entrenador_id = auth.uid()
    )
  );

revoke update on public.bcs_mediciones from authenticated;
grant update (estado) on public.bcs_mediciones to authenticated;
revoke update on public.bcs_mediciones from anon;

-- El acceso anónimo del Cliente vía token nunca lee esta fila directamente —
-- la resolución token→Reporte vive en la capa de aplicación (BCS Handbook
-- IN-A2), fuera del alcance de la capa de persistencia.


-- ── bcs_enlaces_publicos ───────────────────────────────────────────────────
-- Sprint 1 / M3. Token de acceso público de solo lectura. Token único global
-- (BCS-ADR-02) — la longitud mínima de 21 caracteres es garantía del
-- generador de la capa de aplicación, no un CHECK de base de datos. Máquina
-- de estados: activo → revocado (terminal, IN-28).

create table public.bcs_enlaces_publicos (
  id uuid primary key default gen_random_uuid(),
  cliente_id uuid not null references public.bcs_clientes(id),
  token text not null unique,
  estado text not null default 'activo' check (estado in ('activo', 'revocado')),
  created_at timestamptz not null default now()
);

alter table public.bcs_enlaces_publicos enable row level security;

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

-- Sin DELETE: un enlace revocado se conserva como historial (IN-28); la
-- resolución token→Reporte del portador anónimo vive en la capa de
-- aplicación, no como política RLS base.


-- ═══════════════════════════════════════════════════════════════════════════
-- Índices oficiales (Sprint 1 / M4)
-- ═══════════════════════════════════════════════════════════════════════════
-- Cada uno sirve a una consulta ya especificada (Database Handbook 06), nunca
-- por anticipación. En este schema.sql (instalación fresca, tablas vacías, un
-- solo script transaccional) se crean SIN CONCURRENTLY; el archivo
-- migration_indices.sql sí los crea CONCURRENTLY, para no bloquear escrituras
-- sobre las tablas ya pobladas de un proyecto en producción.

create index idx_workouts_user_fecha_planificada
  on public.workouts (user_id, fecha_planificada);

create index idx_workout_logs_user_fecha
  on public.workout_logs (user_id, fecha desc);

create index idx_progression_events_user_created
  on public.progression_events (user_id, created_at desc);

create index idx_progression_events_user_tipo_created
  on public.progression_events (user_id, tipo, created_at desc);

create index idx_bcs_mediciones_cliente_fecha
  on public.bcs_mediciones (cliente_id, fecha desc);


-- ═══════════════════════════════════════════════════════════════════════════
-- Trigger: crear el perfil automáticamente al registrarse
-- ═══════════════════════════════════════════════════════════════════════════
-- Dispara en el INSERT de auth.users (al registrarse), no literalmente en
-- el "primer login" — pero como la verificación por correo bloquea el
-- acceso real hasta confirmar, el perfil ya existe garantizado antes de
-- que cualquier sesión autenticada sea usable, que es el espíritu del
-- pedido.
--
-- SECURITY DEFINER + search_path = '' con nombres calificados
-- (public.profiles): endurecimiento estándar actual contra secuestro de
-- search_path en funciones con privilegios elevados.
--
-- ON CONFLICT (id) DO NOTHING: el trigger debe ser idempotente y nunca
-- lanzar una excepción no controlada — si lo hace, aborta la transacción
-- COMPLETA de auth.users y el registro falla con un error opaco
-- ("Database error saving new user") sin ninguna pista de que el trigger
-- es la causa. Es uno de los footguns más reportados de Supabase.

create function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = ''
as $$
begin
  insert into public.profiles (id, email, nombre)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'nombre', split_part(new.email, '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();
