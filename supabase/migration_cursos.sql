-- ── Cursos vendibles sobre los Sistemas existentes (Sprint CURSO-1) ────────
--
-- ⚠ ESCRITA Y NO APLICADA. Requiere autorización explícita antes de correrla.
--
-- NO SE INVENTA UN CONCEPTO PARALELO A «SISTEMA»
--
--   `public.systems` ya es el catálogo vendible: slug, nombre, precio,
--   modelo_precio, disponible (schema.sql). «Habilitar el primer curso» es
--   ponerle CONTENIDO a un Sistema que ya existe — Calistenia, Hipertrofia o
--   Híbrido — no crear una tabla `cursos` que compita con la que ya vende.
--
-- POR QUÉ EL CONTENIDO VIVE EN UNA TABLA APARTE Y NO EN `systems`
--
--   `systems` tiene una política de lectura pública (`using (true)`) porque
--   la página de marketing /sistemas/[slug] la necesita. RLS de Postgres
--   filtra FILAS, no columnas: si el video real viviera en esa misma fila,
--   cualquiera con la anon key vería el enlace sin haber pagado. Por eso
--   `sistema_contenido` es una tabla propia, con su propia política: solo el
--   admin y quien tenga una compra activa de ESE sistema pueden leerla.
--
-- POR QUÉ LAS COMPRAS SE HACEN POR EMAIL, NO SOLO POR usuario_id
--
--   Hotmart avisa la compra ANTES de que el comprador necesariamente tenga
--   sesión iniciada en este sitio — puede que ni siquiera tenga cuenta
--   todavía. `usuario_id` empieza en NULL y se enlaza la primera vez que esa
--   persona inicia sesión con el mismo correo (`vincularComprasDelUsuario`,
--   en la capa de aplicación — no hay forma de hacerlo en SQL puro sin saber
--   de antemano qué usuario va a iniciar sesión).
--
-- POR QUÉ LOS EVENTOS CRUDOS DE HOTMART SE GUARDAN APARTE
--
--   Hotmart reintenta una notificación si no recibe 200 a tiempo. Sin un
--   registro de qué evento ya se procesó, un reintento otorgaría —o
--   revocaría— acceso dos veces sobre datos que ya estaban correctos. La
--   clave única es el id del evento/transacción que manda Hotmart, no algo
--   que este sistema invente.

-- ── profiles.es_admin ────────────────────────────────────────────────────
--
-- No existe ningún rol en el esquema todavía (Database Handbook 04: un solo
-- profile por usuario, sin distinción entrenador/admin). Gestionar el
-- contenido de un Sistema —y ver quién compró qué— es un privilegio de
-- quien dirige BREY, no de cualquiera que se registre. `false` por defecto:
-- después de correr esto, el propio dueño se marca admin a mano (abajo,
-- en VERIFICACIÓN) — nadie nace admin por accidente.

alter table public.profiles
  add column if not exists es_admin boolean not null default false;

-- ── sistema_contenido ────────────────────────────────────────────────────
--
-- Un documento por Sistema — mismo patrón que macrociclos.contenido y
-- plantillas.contenido (Sprint MAC-1 / PLS-1): la estructura entera
-- (módulos → lecciones → video/materiales) vive en un JSONB que valida
-- `src/lib/cursos/contenido.ts` antes de guardar. Tres tablas normalizadas
-- para esto obligarían a varias consultas para pintar una sola página del
-- curso, y esa página siempre se lee entera o no se lee.

create table if not exists public.sistema_contenido (
  sistema_slug text primary key references public.systems(slug) on delete cascade,
  contenido jsonb not null default '{"modulos": []}'::jsonb,
  actualizado_el timestamptz not null default now()
);

alter table public.sistema_contenido enable row level security;

drop policy if exists "sistema_contenido: el admin lee y escribe todo" on public.sistema_contenido;
create policy "sistema_contenido: el admin lee y escribe todo"
  on public.sistema_contenido for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.es_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.es_admin = true));

drop policy if exists "sistema_contenido: quien compró, lee el suyo" on public.sistema_contenido;
create policy "sistema_contenido: quien compró, lee el suyo"
  on public.sistema_contenido for select
  using (
    exists (
      select 1 from public.compras c
      where c.sistema_slug = sistema_contenido.sistema_slug
        and c.usuario_id = auth.uid()
        and c.estado = 'activa'
    )
  );

-- ── compras ──────────────────────────────────────────────────────────────
--
-- El acceso otorgado a un Sistema, venga de Hotmart o lo dé el admin a mano
-- (cortesías, soporte, pruebas). `unique(sistema_slug, email)`: la MISMA
-- persona no puede tener dos compras activas del mismo Sistema — un
-- reembolso seguido de una recompra actualiza la fila, no crea una segunda.

create table if not exists public.compras (
  id uuid primary key default gen_random_uuid(),
  sistema_slug text not null references public.systems(slug) on delete cascade,
  -- NULL hasta que el comprador inicia sesión con el mismo correo por
  -- primera vez. `on delete set null` y no `cascade`: borrar la cuenta no
  -- debe borrar el historial de la compra.
  usuario_id uuid references auth.users(id) on delete set null,
  email text not null,
  origen text not null default 'manual' check (origen in ('hotmart', 'manual')),
  hotmart_transaccion text,
  estado text not null default 'activa' check (estado in ('activa', 'reembolsada')),
  created_at timestamptz not null default now(),
  actualizado_el timestamptz not null default now(),
  unique (sistema_slug, email)
);

alter table public.compras enable row level security;

drop policy if exists "compras: el admin lee y escribe todo" on public.compras;
create policy "compras: el admin lee y escribe todo"
  on public.compras for all
  using (exists (select 1 from public.profiles p where p.id = auth.uid() and p.es_admin = true))
  with check (exists (select 1 from public.profiles p where p.id = auth.uid() and p.es_admin = true));

drop policy if exists "compras: el comprador ve la suya" on public.compras;
create policy "compras: el comprador ve la suya"
  on public.compras for select
  using (auth.uid() = usuario_id);

-- Sin política de insert/update para el comprador: otorgar o revocar acceso
-- es cosa del webhook de Hotmart y del admin, los dos vía Service Role Key
-- (`src/lib/supabase/admin.ts`), que no pasa por RLS. Un comprador nunca
-- puede escribirse a sí mismo una compra.

create index if not exists compras_usuario_idx on public.compras (usuario_id) where usuario_id is not null;
create index if not exists compras_email_idx on public.compras (lower(email));

-- ── hotmart_eventos ──────────────────────────────────────────────────────
--
-- Registro crudo, para idempotencia (un reintento de Hotmart no debe
-- procesarse dos veces) y para poder auditar qué llegó de verdad si algo no
-- cuadra. Sin política de lectura para authenticated/anon: solo el Service
-- Role Key (el webhook) lo toca, a propósito.

create table if not exists public.hotmart_eventos (
  id uuid primary key default gen_random_uuid(),
  -- Id del evento si Hotmart lo manda, si no el id de la transacción —
  -- lo que sea que identifique ESTA notificación y no otra.
  hotmart_id text not null unique,
  evento text not null,
  payload jsonb not null,
  procesado_el timestamptz not null default now()
);

alter table public.hotmart_eventos enable row level security;
-- Ninguna política: RLS activo y cero políticas bloquea todo para
-- anon/authenticated. Solo entra por el Service Role Key.

-- ── progreso_leccion ─────────────────────────────────────────────────────
--
-- Qué lecciones ya vio el comprador. `leccion_id` NO es una FK real: la
-- lección vive dentro del JSONB de `sistema_contenido`, y Postgres no puede
-- declarar una referencia dentro de un documento — mismo trade-off ya
-- aceptado en macrociclos.contenido.dias → plantillaId (migration_
-- macrociclos.sql). Una lección borrada del contenido deja una fila de
-- progreso huérfana; la capa de lectura la ignora en vez de fallar.

create table if not exists public.progreso_leccion (
  compra_id uuid not null references public.compras(id) on delete cascade,
  leccion_id text not null,
  completada_el timestamptz not null default now(),
  primary key (compra_id, leccion_id)
);

alter table public.progreso_leccion enable row level security;

drop policy if exists "progreso_leccion: el dueño de la compra lo gestiona" on public.progreso_leccion;
create policy "progreso_leccion: el dueño de la compra lo gestiona"
  on public.progreso_leccion for all
  using (
    exists (
      select 1 from public.compras c
      where c.id = progreso_leccion.compra_id and c.usuario_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.compras c
      where c.id = progreso_leccion.compra_id and c.usuario_id = auth.uid()
    )
  );

-- ── Storage: bucket para PDFs y materiales del curso ────────────────────
--
-- PRIVADO (public = false): un material no es como el catálogo de systems,
-- no se lee con solo saber la URL. La subida (admin) y la descarga (quien
-- compró) pasan por Server Actions con el Service Role Key, que comprueban
-- es_admin o la compra activa ANTES de crear la URL firmada — el mismo
-- patrón que src/lib/supabase/admin.ts ya documenta para el enlace público
-- del BCS. No se declaran políticas de storage.objects: con el bucket
-- privado y cero políticas, anon/authenticated no leen nada directo, que es
-- exactamente lo que se quiere.

insert into storage.buckets (id, name, public)
values ('sistema-recursos', 'sistema-recursos', false)
on conflict (id) do nothing;

-- ── Comentarios ──────────────────────────────────────────────────────────

comment on table public.sistema_contenido is
  'El contenido real (módulos, lecciones, video, materiales) de un Sistema vendible. Lectura: admin, o comprador con compra activa de ese sistema.';

comment on table public.compras is
  'Acceso otorgado a un Sistema — por Hotmart (webhook) o a mano (admin). unique(sistema_slug, email) evita duplicar el acceso de la misma persona.';

comment on table public.hotmart_eventos is
  'Log crudo de notificaciones de Hotmart, para idempotencia y auditoría. Solo el webhook (Service Role Key) lo toca.';

comment on table public.progreso_leccion is
  'Qué lecciones ya vio cada comprador. leccion_id referencia un id dentro de sistema_contenido.contenido (JSONB), no una fila.';

-- ── VERIFICACIÓN (ejecutar después de aplicar) ─────────────────────────────
--
--   select tablename, policyname, cmd from pg_policies
--    where tablename in ('sistema_contenido', 'compras', 'progreso_leccion')
--    order by tablename, policyname;
--
--   select id, public from storage.buckets where id = 'sistema-recursos';
--   -- se espera public = false
--
--   -- Marca tu propia cuenta como admin — cambia el correo:
--   update public.profiles set es_admin = true where email = 'TU-CORREO@EJEMPLO.COM';
--   select id, email, es_admin from public.profiles where es_admin = true;
