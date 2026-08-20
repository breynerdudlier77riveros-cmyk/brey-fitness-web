-- ── Objetivos del atleta (Sprints PAS-8 · PAS-10) ─────────────────────────
--
-- NO APLICADA. Se entrega escrita para que se aplique cuando se decida; hasta
-- entonces el contrato `ObjetivoAtleta` funciona igual y el informe muestra
-- "sin objetivos declarados", que es la verdad.
--
-- QUÉ ES UN OBJETIVO Y QUÉ NO ES:
--
--   Un objetivo pertenece a un atleta y a una prueba del catálogo. Lo fija el
--   profesional. **No es una norma**: no describe una población, no tiene
--   evidencia detrás y nadie lo publicó.
--
--   De ahí la única regla dura de este modelo: un objetivo jamás puede
--   presentarse como una comparación normativa. "Cumpliste tu objetivo" y
--   "estás por encima de tu población" son afirmaciones distintas, y confundir
--   la primera con la segunda le daría a una meta personal la autoridad de una
--   referencia científica.

create table if not exists public.pas_objetivos (
  id              uuid primary key default gen_random_uuid(),
  atleta_id       uuid not null references public.pas_atletas(id) on delete cascade,

  -- Prueba del catálogo con la que se mide. Se guarda como texto, igual que
  -- `pas_registros.prueba_id`: el catálogo vive en el código, no en la base.
  prueba_id       text not null check (length(trim(prueba_id)) between 1 and 40),

  -- PAS-10 §13 añade `mantener`. NO es «aumentar» con otro nombre: quien pide
  -- mantener el peso entre 63 y 67 kg no está pidiendo llegar a 67, y traducir
  -- lo uno en lo otro cambiaría el objetivo sin decírselo a nadie.
  tipo            text not null
                  check (tipo in ('aumentar', 'reducir', 'alcanzar', 'mantener')),

  nombre          text not null check (length(trim(nombre)) between 1 and 120),

  -- NULLABLE a propósito. Sin punto de partida declarado no se puede expresar
  -- el avance como porcentaje, y el contrato ya devuelve `null` en ese caso.
  -- Rellenarlo con la primera medición histórica inventaría una decisión que
  -- el profesional no tomó.
  valor_inicial   numeric,

  -- PAS-10 §8: el punto de partida es un valor Y un momento. Sin fecha, «desde
  -- 100 kg» flota en el tiempo y no puede saberse si el recorrido lleva un mes
  -- o tres años — la misma cifra de avance significa cosas distintas.
  fecha_punto_partida date,

  -- NULLABLE desde PAS-10: en un objetivo de mantenimiento la meta es el rango,
  -- no un punto. El CHECK de más abajo impide que falte donde sí hace falta.
  valor_objetivo  numeric,

  -- El rango de los objetivos de mantenimiento. Ambos extremos inclusivos.
  rango_min       numeric,
  rango_max       numeric,

  -- La unidad se guarda con el objetivo, no se hereda de la prueba: si algún
  -- día una prueba cambiara de unidad sugerida, los objetivos antiguos
  -- seguirían diciendo en qué se fijaron.
  unidad          text not null check (length(trim(unidad)) between 1 and 20),

  prioridad       text not null default 'media'
                  check (prioridad in ('alta', 'media', 'baja')),

  -- Cuándo se fijó el objetivo. No es la fecha del punto de partida: un
  -- objetivo puede fijarse hoy tomando como referencia una medición de hace
  -- medio año. Sin esta fecha no puede ordenarse la lista ni decirse cuánto
  -- lleva vigente.
  fecha_inicio    date not null default current_date,

  fecha_objetivo  date,

  estado          text not null default 'activo'
                  check (estado in ('activo', 'cumplido', 'pausado', 'abandonado')),

  notas           text check (notas is null or length(notas) <= 2000),

  created_at      timestamptz not null default now(),
  updated_at      timestamptz not null default now(),

  -- ── Invariantes del modelo ──────────────────────────────────────────────
  -- Se declaran aquí y no solo en TypeScript porque los tipos protegen al
  -- código que compila hoy, y la tabla protege a todo lo que escriba en ella:
  -- una importación, una corrección manual, un script de migración futuro.

  -- Cada tipo de objetivo declara SU meta, y solo la suya.
  constraint pas_objetivos_meta_segun_tipo check (
    case
      when tipo = 'mantener' then valor_objetivo is null
      else valor_objetivo is not null and rango_min is null and rango_max is null
    end
  ),

  -- Un rango a medias no es un rango.
  constraint pas_objetivos_rango_completo check (
    (rango_min is null) = (rango_max is null)
  ),

  -- Con el mínimo por encima del máximo no hay nada dentro. Darle la vuelta
  -- supondría decidir cuál de los dos extremos se escribió mal.
  constraint pas_objetivos_rango_ordenado check (
    rango_min is null or rango_min <= rango_max
  ),

  -- Una fecha de partida sin valor de partida fecha algo que no existe.
  constraint pas_objetivos_partida_coherente check (
    fecha_punto_partida is null or valor_inicial is not null
  )
);

-- Un atleta puede tener varios objetivos, pero solo uno ACTIVO por prueba: con
-- dos activos no habría forma de saber cuál sigue el informe, y elegir por él
-- sería exactamente la clase de decisión que este sistema no toma. El índice
-- lo impide en la base en lugar de dejarlo a la capa de aplicación.
create unique index if not exists pas_objetivos_activo_unico
  on public.pas_objetivos (atleta_id, prueba_id)
  where estado = 'activo';

create index if not exists pas_objetivos_atleta_idx
  on public.pas_objetivos (atleta_id, estado);

-- ── RLS ───────────────────────────────────────────────────────────────────
-- Mismo criterio que el resto del Workspace: la propiedad se hereda del atleta
-- por pertenencia, nunca por una columna `profesional_id` duplicada. Duplicar
-- el dueño abriría la puerta a que las dos copias divergieran.

alter table public.pas_objetivos enable row level security;

drop policy if exists "pas_objetivos: el profesional ve los de sus atletas" on public.pas_objetivos;
create policy "pas_objetivos: el profesional ve los de sus atletas"
  on public.pas_objetivos for select
  using (
    exists (
      select 1 from public.pas_atletas a
      where a.id = pas_objetivos.atleta_id and a.profesional_id = auth.uid()
    )
  );

drop policy if exists "pas_objetivos: el profesional crea los de sus atletas" on public.pas_objetivos;
create policy "pas_objetivos: el profesional crea los de sus atletas"
  on public.pas_objetivos for insert
  with check (
    exists (
      select 1 from public.pas_atletas a
      where a.id = pas_objetivos.atleta_id and a.profesional_id = auth.uid()
    )
  );

drop policy if exists "pas_objetivos: el profesional edita los de sus atletas" on public.pas_objetivos;
create policy "pas_objetivos: el profesional edita los de sus atletas"
  on public.pas_objetivos for update
  using (
    exists (
      select 1 from public.pas_atletas a
      where a.id = pas_objetivos.atleta_id and a.profesional_id = auth.uid()
    )
  );

comment on table public.pas_objetivos is
  'Objetivos declarados por el profesional. NO son normas: no describen poblacion ni tienen evidencia.';
comment on column public.pas_objetivos.valor_inicial is
  'Punto de partida declarado. NULL = no consta, y entonces el avance no se expresa en porcentaje.';
comment on column public.pas_objetivos.fecha_punto_partida is
  'Cuando se midio el punto de partida. NULL = no consta.';
comment on column public.pas_objetivos.fecha_inicio is
  'Cuando se fijo el objetivo. Distinta de fecha_punto_partida.';
comment on column public.pas_objetivos.rango_min is
  'Extremo inferior del rango a mantener, inclusivo. Solo en objetivos de tipo mantener.';

-- ── Reversión ─────────────────────────────────────────────────────────────
-- Aditiva. Deshacerla no toca ninguna tabla existente:
--
--   drop table if exists public.pas_objetivos;
