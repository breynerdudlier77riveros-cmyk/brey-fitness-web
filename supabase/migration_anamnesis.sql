-- ── Anamnesis — ficha de ingreso editable e imprimible (Sprint ANAMNESIS-1) ─
--
-- ⚠ ESCRITA Y NO APLICADA. Requiere autorización explícita antes de correrla.
--
-- QUÉ ES
--
--   Una ficha por cliente, transcrita de "anamnesis mejorada.xls": datos
--   demográficos, antecedentes, PAR-Q, cuestionario AHA/ACSM, hábitos
--   alimentarios, nivel de actividad física, cuestionario de motivos de
--   ejercicio, laboratorio, escala de estrés percibido y test de
--   temperamento. El documento entero se guarda en una sola columna JSONB —
--   mismo patrón que `sistema_contenido`/`plantillas`/`macrociclos`: el
--   formulario no lo construye el usuario (es fijo), así que no hace falta
--   normalizarlo en columnas.
--
-- POR QUÉ `creado_por`, NO "un documento por usuario"
--
--   Quien usa esta ficha es SIEMPRE el admin (el entrenador), pero para
--   MUCHOS clientes distintos — no es una ficha de autoevaluación de cada
--   usuario registrado, como sí lo son las demás tablas de `/app`. Por eso
--   es una lista de registros (como `compras`), no una fila-por-usuario
--   (como `profiles`): cada fila es la ficha de UN cliente, y `creado_por`
--   es el admin que la abrió.
--
-- POR QUÉ NO HACE FALTA LA DOBLE COMPROBACIÓN DE `es_admin` EN RLS
--
--   La RLS solo exige "dueño de la fila" (`creado_por = auth.uid()`). Quien
--   puede llegar a crear una fila ya pasó `exigirAdmin()` en
--   `src/lib/anamnesis/actions.ts` — igual que `profile.es_admin` se
--   comprueba en TypeScript para `sistema_contenido` aunque la fila en sí no
--   lo repita en SQL.

create table if not exists public.anamnesis (
  id uuid primary key default gen_random_uuid(),
  creado_por uuid not null references auth.users(id) on delete cascade,
  contenido jsonb not null default '{}'::jsonb,
  creado_el timestamptz not null default now(),
  actualizado_el timestamptz not null default now()
);

alter table public.anamnesis enable row level security;

create policy "anamnesis: el admin gestiona lo que creó"
  on public.anamnesis for all
  using (auth.uid() = creado_por)
  with check (auth.uid() = creado_por);

create index if not exists anamnesis_creado_por_idx on public.anamnesis (creado_por, actualizado_el desc);

-- ── Verificación ────────────────────────────────────────────────────────
-- Esta tabla usa el mismo flag `es_admin` que ya añadió
-- `migration_cursos.sql`. Si todavía no lo aplicaste y marcaste tu cuenta,
-- hazlo antes de usar `/app/admin/anamnesis` — sin `es_admin = true` las
-- acciones del servidor devuelven NO_AUTORIZADO aunque la RLS de esta tabla
-- te deje leer tus propias filas.
