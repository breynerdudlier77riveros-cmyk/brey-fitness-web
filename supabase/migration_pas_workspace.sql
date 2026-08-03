-- ── Performance Workspace · esquema y RLS (Sprint PAS-7.0) ─────────────────
-- Cuatro tablas propias del PAS. NINGUNA toca el BCS ni el Core Product: el
-- Workspace es standalone, igual que lo es el BCS, y su repositorio nunca
-- comparte tabla con composición corporal.
--
-- Ownership: `profesional_id` en el agregado raíz (atleta). Evaluaciones y
-- registros heredan el permiso por pertenencia, nunca por columna duplicada —
-- duplicar el dueño abriría la puerta a que las dos copias divergieran.
--
-- Borrado lógico: `estado = 'eliminado'`. Nada se borra físicamente; el
-- histórico de un atleta eliminado sigue existiendo, deja de listarse.

-- ── Atletas ────────────────────────────────────────────────────────────────

create table if not exists public.pas_atletas (
  id              uuid primary key default gen_random_uuid(),
  profesional_id  uuid not null references auth.users(id) on delete cascade,
  nombre          text not null check (length(trim(nombre)) between 1 and 120),
  documento       text check (documento is null or length(trim(documento)) between 1 and 40),
  codigo_interno  text check (codigo_interno is null or length(trim(codigo_interno)) between 1 and 40),
  deporte         text check (deporte is null or length(trim(deporte)) between 1 and 60),
  fecha_nacimiento date,
  notas           text check (notas is null or length(notas) <= 2000),
  estado          text not null default 'activo'
                  check (estado in ('activo', 'archivado', 'eliminado')),
  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now()
);

create index if not exists pas_atletas_profesional_idx
  on public.pas_atletas (profesional_id, estado, created_at desc);

-- El código interno es único POR PROFESIONAL, no globalmente: dos
-- profesionales pueden usar la misma numeración sin colisionar.
create unique index if not exists pas_atletas_codigo_unico_idx
  on public.pas_atletas (profesional_id, codigo_interno)
  where codigo_interno is not null and estado <> 'eliminado';

-- ── Evaluaciones ───────────────────────────────────────────────────────────

create table if not exists public.pas_evaluaciones (
  id            uuid primary key default gen_random_uuid(),
  atleta_id     uuid not null references public.pas_atletas(id) on delete cascade,
  tipo          text not null check (tipo in ('T-01','T-02','T-03','T-04','T-05','T-06')),
  fecha         date not null,
  estado        text not null default 'borrador'
                check (estado in ('borrador','completada','anulada','compartida','archivada')),
  observaciones text check (observaciones is null or length(observaciones) <= 4000),
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),

  -- Una fecha futura es un dato imposible, no un dato pendiente. El PAE
  -- también lo detecta, pero conviene que la base no lo admita siquiera.
  constraint pas_evaluaciones_fecha_no_futura check (fecha <= current_date)
);

create index if not exists pas_evaluaciones_atleta_idx
  on public.pas_evaluaciones (atleta_id, fecha desc);

-- ── Registros de prueba ────────────────────────────────────────────────────
-- Inmutables (PAS I-01): se corrigen anulando y creando uno nuevo. El valor se
-- guarda desnormalizado por variante para que la comprobación de integridad
-- viva en la base y no solo en TypeScript.

create table if not exists public.pas_registros (
  id            uuid primary key default gen_random_uuid(),
  evaluacion_id uuid not null references public.pas_evaluaciones(id) on delete cascade,
  prueba_id     text not null check (length(trim(prueba_id)) between 1 and 40),
  fecha         date not null,
  valor_tipo    text not null check (valor_tipo in ('continuo','ordinal','binario','categorico')),
  valor_num     numeric,
  valor_texto   text,
  valor_bool    boolean,
  unidad        text,
  escala        integer check (escala is null or escala > 0),
  estado        text not null default 'vigente' check (estado in ('vigente','anulada')),
  condiciones   jsonb not null default '{}'::jsonb,
  precondiciones_cumplidas boolean,
  patron        text,
  observaciones text check (observaciones is null or length(observaciones) <= 1000),
  created_at    timestamptz not null default now(),

  constraint pas_registros_valor_coherente check (
    (valor_tipo = 'continuo'   and valor_num is not null and unidad is not null)
    or (valor_tipo = 'ordinal'    and valor_num is not null and escala is not null)
    or (valor_tipo = 'binario'    and valor_bool is not null)
    or (valor_tipo = 'categorico' and valor_texto is not null)
  )
);

create index if not exists pas_registros_evaluacion_idx
  on public.pas_registros (evaluacion_id, estado);

-- ── Enlaces públicos ───────────────────────────────────────────────────────
-- Preparado, no expuesto: este sprint no publica ninguna ruta anónima.

create table if not exists public.pas_enlaces_publicos (
  id            uuid primary key default gen_random_uuid(),
  evaluacion_id uuid not null references public.pas_evaluaciones(id) on delete cascade,
  token         text not null unique check (length(token) >= 32),
  activo        boolean not null default true,
  created_at    timestamptz not null default now(),
  revocado_at   timestamptz
);

create index if not exists pas_enlaces_evaluacion_idx
  on public.pas_enlaces_publicos (evaluacion_id, activo);

-- ── RLS ────────────────────────────────────────────────────────────────────
-- La autorización real vive aquí, no en TypeScript. Las Server Actions nunca
-- vuelven a comprobar el dueño (Engineering Handbook BE-04).

alter table public.pas_atletas          enable row level security;
alter table public.pas_evaluaciones     enable row level security;
alter table public.pas_registros        enable row level security;
alter table public.pas_enlaces_publicos enable row level security;

create policy "pas_atletas: el profesional gestiona los suyos"
  on public.pas_atletas for all
  using (profesional_id = auth.uid())
  with check (profesional_id = auth.uid());

create policy "pas_evaluaciones: pertenencia al atleta propio"
  on public.pas_evaluaciones for all
  using (exists (
    select 1 from public.pas_atletas a
    where a.id = atleta_id and a.profesional_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.pas_atletas a
    where a.id = atleta_id and a.profesional_id = auth.uid()
  ));

create policy "pas_registros: pertenencia a la evaluación propia"
  on public.pas_registros for all
  using (exists (
    select 1 from public.pas_evaluaciones e
    join public.pas_atletas a on a.id = e.atleta_id
    where e.id = evaluacion_id and a.profesional_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.pas_evaluaciones e
    join public.pas_atletas a on a.id = e.atleta_id
    where e.id = evaluacion_id and a.profesional_id = auth.uid()
  ));

create policy "pas_enlaces: pertenencia a la evaluación propia"
  on public.pas_enlaces_publicos for all
  using (exists (
    select 1 from public.pas_evaluaciones e
    join public.pas_atletas a on a.id = e.atleta_id
    where e.id = evaluacion_id and a.profesional_id = auth.uid()
  ))
  with check (exists (
    select 1 from public.pas_evaluaciones e
    join public.pas_atletas a on a.id = e.atleta_id
    where e.id = evaluacion_id and a.profesional_id = auth.uid()
  ));

-- Un registro NUNCA se edita: se anula y se crea otro (PAS I-01). Se revoca
-- el UPDATE general y se concede solo sobre `estado`, igual que hace el BCS
-- con sus mediciones.
revoke update on public.pas_registros from authenticated;
grant update (estado) on public.pas_registros to authenticated;
