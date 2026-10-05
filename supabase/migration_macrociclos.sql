-- ── Macrociclos · planificación (Sprint MAC-1) ─────────────────────────────
--
-- ⚠ ESCRITA Y NO APLICADA. Requiere autorización explícita antes de correrla.
--
-- LA CAPA QUE FALTABA
--
--   El PAS mide, `plantillas` prescribe la sesión, y entre las dos no había
--   nada que dijera qué semana va antes de cuál. Eso es un macrociclo.
--
-- UNA SOLA TABLA, Y EL DOCUMENTO EN JSONB
--
--   Mismo patrón que `plantillas`: la rejilla entera —mesociclos, filas y
--   calendario— vive en `contenido`. Normalizarla en tres tablas obligaría a
--   cuatro consultas y dos transacciones para mover un mesociclo una semana,
--   y la aplicación siempre lee el documento completo o no lee nada.
--
--   La forma del JSON la garantiza `src/lib/macrociclo/contenido.ts`, que la
--   comprueba antes de guardar y tiene sus invariantes en tests. La base
--   guarda; el núcleo valida.
--
-- LOS DÍAS APUNTAN A PLANTILLAS Y NO LAS CONTIENEN
--
--   Dentro de `contenido.dias` cada entrada lleva el `plantillaId`. NO hay
--   clave foránea, y es deliberado: está dentro de un JSONB, donde Postgres no
--   puede declararla. La consecuencia —que borrar una plantilla deje un id
--   colgando— se trata en la lectura, que pinta la celda vacía en vez de un
--   identificador crudo (`hojaMacrociclo`, probado).
--
--   La alternativa era una tabla de unión con su FK, y con ella cada cambio de
--   un día sería un DELETE + INSERT fuera del documento. El precio de la FK
--   era partir en dos algo que siempre se lee junto.

create table if not exists public.macrociclos (
  id uuid primary key default gen_random_uuid(),
  entrenador_id uuid not null references auth.users(id) on delete cascade,

  -- Atleta del PAS al que pertenece el plan. NULL = plan sin atleta asignado,
  -- que es un estado legítimo: una plantilla de macrociclo puede escribirse
  -- antes de saber para quién.
  --
  -- `on delete set null` y no `cascade`: borrar un atleta no debe destruir la
  -- planificación que se escribió para él. Nada científico se borra, se
  -- reubica — y un plan es trabajo del entrenador, no un dato del atleta.
  atleta_id uuid references public.pas_atletas(id) on delete set null,

  nombre text not null,
  objetivo text,

  -- Lunes de la semana 1. NULL = sin fecha, y la rejilla se lee por número de
  -- semana. Es lo normal en una plantilla que aún no tiene calendario.
  fecha_inicio date,

  semanas int not null default 12 check (semanas between 1 and 104),

  -- Con qué modelo se sembró. Informativo: la rejilla es libre desde el primer
  -- momento y el entrenador puede haberla cambiado entera. NO restringido a
  -- una lista: los modelos viven en el código y una lista aquí crearía un
  -- segundo sitio donde mantenerlos.
  modelo_id text,

  contenido jsonb not null default '{"mesociclos": [], "filas": [], "dias": []}'::jsonb,

  estado text not null default 'borrador'
    check (estado in ('borrador', 'publicado', 'archivado')),

  created_at timestamptz not null default now(),
  actualizado_el timestamptz not null default now()
);

create index if not exists macrociclos_entrenador_idx
  on public.macrociclos (entrenador_id, actualizado_el desc);

create index if not exists macrociclos_atleta_idx
  on public.macrociclos (atleta_id)
  where atleta_id is not null;

-- ── RLS ────────────────────────────────────────────────────────────────────
--
-- La propiedad la impone Postgres y NUNCA TypeScript (FT-01/BE-04). Las
-- acciones de servidor no vuelven a comprobar el dueño: si lo hicieran habría
-- dos sitios donde se decide quién ve qué, y acabarían discrepando.

alter table public.macrociclos enable row level security;

drop policy if exists "macrociclos: el entrenador ve los suyos" on public.macrociclos;
create policy "macrociclos: el entrenador ve los suyos"
  on public.macrociclos for select
  using (auth.uid() = entrenador_id);

drop policy if exists "macrociclos: el entrenador crea los suyos" on public.macrociclos;
create policy "macrociclos: el entrenador crea los suyos"
  on public.macrociclos for insert
  with check (auth.uid() = entrenador_id);

drop policy if exists "macrociclos: el entrenador edita los suyos" on public.macrociclos;
create policy "macrociclos: el entrenador edita los suyos"
  on public.macrociclos for update
  using (auth.uid() = entrenador_id)
  with check (auth.uid() = entrenador_id);

drop policy if exists "macrociclos: el entrenador borra los suyos" on public.macrociclos;
create policy "macrociclos: el entrenador borra los suyos"
  on public.macrociclos for delete
  using (auth.uid() = entrenador_id);

comment on table public.macrociclos is
  'Planificación por semanas. El documento (mesociclos, filas y calendario) vive en contenido; '
  'los días apuntan a plantillas de sesión por id, sin FK porque están dentro del JSONB.';

comment on column public.macrociclos.modelo_id is
  'Modelo de periodización con el que se sembró (atr, clasico, bloques, ondulatorio, conjugado). '
  'Informativo: la rejilla es editable y puede no parecerse ya al modelo.';

-- ── Verificación (ejecutar después de aplicar) ─────────────────────────────
--
--   select tablename, policyname, cmd from pg_policies
--    where tablename = 'macrociclos' order by policyname;
--   -- se esperan 4 políticas: select, insert, update, delete
--
--   select count(*) from public.macrociclos;  -- 0 en una base limpia
