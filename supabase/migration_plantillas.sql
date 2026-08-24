-- ── Plantillas de sesión de entrenamiento ──────────────────────────────────
--
-- ESTADO: NO APLICADA. Requiere autorización explícita antes de ejecutarse.
--
-- ── QUÉ ES ESTO Y QUÉ NO ES ────────────────────────────────────────────────
--
-- Es un EDITOR DE DOCUMENTOS, no un motor. El entrenador escribe la sesión y
-- el sistema la guarda, la maqueta y la comparte. No calcula cargas, no
-- sugiere progresiones, no valida si un RIR es apropiado. Nada de lo que aquí
-- se guarda es una afirmación del sistema: es lo que su autor escribió.
--
-- La distinción importa en este proyecto más que en otros. El BCS y el PAS se
-- niegan a clasificar sin una fuente publicada, y esa negativa solo significa
-- algo si no se contradice en la mesa de al lado. Una plantilla que
-- «recomendara» 80 kg estaría prescribiendo sin evidencia; una plantilla donde
-- el entrenador escribe 80 kg es su criterio profesional, firmado por él.
--
-- Por eso no hay ninguna columna calculada aquí, ni la habrá.
--
-- ── POR QUÉ NO ES LA TABLA `workouts` ──────────────────────────────────────
--
-- `workouts` es el programa del PROPIO usuario: RLS a `auth.uid() = user_id`,
-- sin política de DELETE (FT-09, el historial no se borra), sin enlace
-- público, y con una fecha planificada porque es una sesión concreta en un
-- calendario concreto.
--
-- Una plantilla es lo contrario en las cuatro cosas: es del entrenador PARA
-- terceros, se borra si se descarta, se comparte por enlace anónimo, y no
-- tiene fecha porque es reutilizable. Meterla en `workouts` obligaría a
-- aflojar la RLS de un historial que está endurecido a propósito.
--
-- ── EL CONTENIDO ES JSONB, Y ES EL MISMO TRADE-OFF QUE YA SE ACEPTÓ ────────
--
-- La estructura tiene cuatro niveles: día → bloque → ejercicio → serie, y las
-- series se repiten por cada semana del bloque. Normalizarlo son cuatro tablas
-- y un join de cuatro niveles para pintar una pantalla que SIEMPRE se lee
-- entera y SIEMPRE se guarda entera.
--
-- Es el mismo razonamiento que `workouts.ejercicios` ya documenta en
-- schema.sql, y aplica con más fuerza aquí: allí se contempla normalizar
-- cuando haya consultas del tipo «MAX(peso) por ejercicio a lo largo del
-- tiempo». Una plantilla no se consulta así — se abre, se edita y se imprime.
--
-- ── LOS DOS MODOS DE COMPARTIR SON UNA SOLA TABLA ─────────────────────────
--
-- `plantilla_enlaces.cliente_id IS NULL` → enlace genérico de la plantilla.
-- `plantilla_enlaces.cliente_id` puesto  → asignada a ese cliente, con sus
--                                           propios ajustes de carga.
--
-- Podrían ser dos tablas y serían dos rutas públicas, dos resoluciones de
-- token y dos sitios donde equivocarse con la seguridad. Con una sola, la
-- ruta pública resuelve el token igual en los dos casos y la diferencia se
-- reduce a si hay ajustes que aplicar encima.

begin;

-- ── plantillas ─────────────────────────────────────────────────────────────

create table if not exists public.plantillas (
  id uuid primary key default gen_random_uuid(),
  entrenador_id uuid not null references auth.users(id) on delete cascade,
  nombre text not null,
  descripcion text,
  -- Semanas del bloque. El tope de 24 no es una regla de entrenamiento: es
  -- que la rejilla del editor y la hoja impresa dejan de ser legibles mucho
  -- antes, y un número sin tope invita a un accidente de copiar y pegar.
  semanas int not null default 4 check (semanas between 1 and 24),
  contenido jsonb not null default '{"dias": []}'::jsonb,
  estado text not null default 'borrador'
    check (estado in ('borrador', 'publicada', 'archivada')),
  created_at timestamptz not null default now(),
  actualizado_el timestamptz not null default now()
);

comment on column public.plantillas.contenido is
  'Estructura completa: {"dias":[{id,nombre,notas,bloques:[{id,tipo,ejercicios:[{id,nombre,slug,notas,descansoSeg,semanas:[{series:[{reps,pesoKg,rir,notas}]}]}]}]}]}. El esquema lo impone la aplicación (src/lib/plantillas/contenido.ts), que es donde vive.';

comment on column public.plantillas.estado is
  'borrador = solo el autor la ve. publicada = puede compartirse. archivada = fuera de la lista, los enlaces existentes dejan de resolver.';

alter table public.plantillas enable row level security;

-- El autor y nadie más. No hay lectura pública POR ESTA VÍA: la ruta anónima
-- entra por `plantilla_enlaces` con el cliente admin, igual que el BCS.
create policy "plantillas: el entrenador ve las suyas"
  on public.plantillas for select
  using (auth.uid() = entrenador_id);

create policy "plantillas: el entrenador crea las suyas"
  on public.plantillas for insert
  with check (auth.uid() = entrenador_id);

create policy "plantillas: el entrenador edita las suyas"
  on public.plantillas for update
  using (auth.uid() = entrenador_id)
  with check (auth.uid() = entrenador_id);

-- CON política de DELETE, a diferencia de `workouts`. No es una excepción a
-- FT-09: una plantilla en borrador es material de trabajo, no historial de
-- nadie. Lo que no se borra es lo que un cliente ya ejecutó, y eso vive en
-- workout_logs.
create policy "plantillas: el entrenador borra las suyas"
  on public.plantillas for delete
  using (auth.uid() = entrenador_id);


-- ── plantilla_enlaces ──────────────────────────────────────────────────────
--
-- Token único global, como bcs_enlaces_publicos. La longitud mínima la
-- garantiza el generador de la capa de aplicación, no un CHECK.

create table if not exists public.plantilla_enlaces (
  id uuid primary key default gen_random_uuid(),
  plantilla_id uuid not null references public.plantillas(id) on delete cascade,
  -- null = enlace genérico. Puesto = asignada a ese cliente.
  cliente_id uuid references public.bcs_clientes(id) on delete cascade,
  token text not null unique,
  -- Solo lo que DIFIERE de la plantilla madre, por dirección de serie. Un
  -- ajuste vacío significa «este cliente sigue la plantilla tal cual», que es
  -- distinto de no tener enlace.
  ajustes jsonb not null default '{}'::jsonb,
  nota text,
  estado text not null default 'activo' check (estado in ('activo', 'revocado')),
  created_at timestamptz not null default now()
);

comment on column public.plantilla_enlaces.cliente_id is
  'null = enlace genérico de la plantilla, cualquiera con el token la ve tal cual. Puesto = asignación a un cliente del BCS, con sus propios ajustes encima.';

comment on column public.plantilla_enlaces.ajustes is
  'Mapa dirección → valores que sustituyen a los de la plantilla: {"<ejercicioId>:<semana>:<serie>": {"pesoKg": 85, "reps": "6", "rir": 1}}. Solo lo que cambia.';

-- A lo más un enlace ACTIVO por destino. Dos activos a la vez harían que
-- revocar «el» enlace dejara otro vivo sin que nadie lo viera en pantalla.
-- Dos índices porque en SQL `cliente_id is null` no se compara con `=`.
create unique index if not exists plantilla_enlaces_activo_generico
  on public.plantilla_enlaces (plantilla_id)
  where estado = 'activo' and cliente_id is null;

create unique index if not exists plantilla_enlaces_activo_cliente
  on public.plantilla_enlaces (plantilla_id, cliente_id)
  where estado = 'activo' and cliente_id is not null;

create index if not exists plantilla_enlaces_plantilla_idx
  on public.plantilla_enlaces (plantilla_id);

alter table public.plantilla_enlaces enable row level security;

-- La sesión autenticada solo alcanza los enlaces de SUS plantillas. El acceso
-- anónimo del portador del token NO pasa por aquí: va por el cliente admin en
-- la capa de aplicación, exactamente como bcs_enlaces_publicos.
create policy "plantilla_enlaces: el entrenador ve los de sus plantillas"
  on public.plantilla_enlaces for select
  using (
    exists (
      select 1 from public.plantillas p
      where p.id = plantilla_id and p.entrenador_id = auth.uid()
    )
  );

create policy "plantilla_enlaces: el entrenador crea los de sus plantillas"
  on public.plantilla_enlaces for insert
  with check (
    exists (
      select 1 from public.plantillas p
      where p.id = plantilla_id and p.entrenador_id = auth.uid()
    )
  );

create policy "plantilla_enlaces: el entrenador actualiza los de sus plantillas"
  on public.plantilla_enlaces for update
  using (
    exists (
      select 1 from public.plantillas p
      where p.id = plantilla_id and p.entrenador_id = auth.uid()
    )
  )
  with check (
    exists (
      select 1 from public.plantillas p
      where p.id = plantilla_id and p.entrenador_id = auth.uid()
    )
  );

-- Sin DELETE: un enlace se REVOCA, no se borra. Borrarlo dejaría el token
-- libre para volver a emitirse y perdería el rastro de que existió.

commit;

-- ── Verificación ───────────────────────────────────────────────────────────
--
--   select table_name, column_name, data_type
--     from information_schema.columns
--    where table_name in ('plantillas', 'plantilla_enlaces')
--    order by table_name, ordinal_position;
--
--   select tablename, policyname from pg_policies
--    where tablename in ('plantillas', 'plantilla_enlaces');
--
-- Dos tablas y siete políticas.
