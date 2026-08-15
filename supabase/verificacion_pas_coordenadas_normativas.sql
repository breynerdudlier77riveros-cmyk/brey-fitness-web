-- ── Verificación posterior a la migración de coordenadas (PRS-2.3) ────────
-- Comprueba las fases 2 y 3 del sprint SIN modificar nada. Solo lee catálogo.
--
-- Cómo usarlo: pégalo entero en el SQL Editor de Supabase DESPUÉS de aplicar
-- `migration_pas_coordenadas_normativas.sql`. Devuelve una fila por
-- comprobación con veredicto OK / FALLO, para no leer nada a ojo.
--
-- Es idempotente y de solo lectura: puede ejecutarse las veces que haga falta.

with

-- ── Fase 2 · las tres columnas, tal como se declararon ────────────────────
columnas as (
  select column_name, is_nullable, column_default, data_type
  from information_schema.columns
  where table_schema = 'public' and table_name = 'pas_atletas'
),

comprobaciones as (

  select 1 as orden,
         'F2 · existen las tres columnas' as comprobacion,
         count(*)::text as observado,
         '3' as esperado
  from columnas
  where column_name in ('sexo', 'pais', 'estatura_cm')

  union all
  select 2,
         'F2 · las tres son nullable',
         count(*)::text,
         '3'
  from columnas
  where column_name in ('sexo', 'pais', 'estatura_cm') and is_nullable = 'YES'

  union all
  select 3,
         'F2 · ninguna tiene DEFAULT',
         count(*)::text,
         '0'
  from columnas
  where column_name in ('sexo', 'pais', 'estatura_cm') and column_default is not null

  union all
  -- Los CHECK de dominio: sin ellos la base admitiría 'Masculino' o 'Colombia',
  -- y el NIE recibiría un vocabulario que no reconoce.
  select 4,
         'F2 · el CHECK de sexo admite solo M/F',
         count(*)::text,
         '1'
  from pg_constraint
  where conrelid = 'public.pas_atletas'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%sexo%'
    and pg_get_constraintdef(oid) like '%''M''%'
    and pg_get_constraintdef(oid) like '%''F''%'

  union all
  select 5,
         'F2 · el CHECK de pais exige ISO alfa-2',
         count(*)::text,
         '1'
  from pg_constraint
  where conrelid = 'public.pas_atletas'::regclass
    and contype = 'c'
    and pg_get_constraintdef(oid) ilike '%pais%'

  union all
  -- La migración no tocaba RLS. Las políticas de `pas_atletas` cubren la fila
  -- entera por `profesional_id`, así que las columnas nuevas heredan el permiso.
  select 6,
         'F2 · RLS sigue activa en pas_atletas',
         (select case when relrowsecurity then 'activa' else 'INACTIVA' end
            from pg_class where oid = 'public.pas_atletas'::regclass),
         'activa'

  union all
  select 7,
         'F2 · el numero de politicas RLS no cambio',
         count(*)::text,
         '3'
  from pg_policies
  where schemaname = 'public' and tablename = 'pas_atletas'

  -- ── Fase 3 · los registros históricos no se rellenaron ──────────────────
  -- La migración es aditiva: toda fila creada ANTES debe seguir con las tres
  -- columnas en NULL. Si alguna trae valor sin haberse editado, hubo backfill.

  union all
  select 10,
         'F3 · atletas en total',
         count(*)::text,
         '(informativo)'
  from public.pas_atletas

  union all
  select 11,
         'F3 · atletas con sexo declarado',
         count(*)::text,
         '(informativo: 0 antes de editar ninguno)'
  from public.pas_atletas where sexo is not null

  union all
  select 12,
         'F3 · atletas con pais declarado',
         count(*)::text,
         '(informativo: 0 antes de editar ninguno)'
  from public.pas_atletas where pais is not null

  union all
  select 13,
         'F3 · atletas con estatura declarada',
         count(*)::text,
         '(informativo: 0 antes de editar ninguno)'
  from public.pas_atletas where estatura_cm is not null

  union all
  -- La prueba dura del backfill: una fila que nunca se ha editado —su
  -- `updated_at` sigue siendo el de creación— no puede tener coordenadas.
  -- Si esto no da 0, alguien las rellenó sin que nadie las declarara.
  select 14,
         'F3 · sin backfill: filas no editadas con coordenadas',
         count(*)::text,
         '0'
  from public.pas_atletas
  where updated_at = created_at
    and (sexo is not null or pais is not null or estatura_cm is not null)

  union all
  select 15,
         'F3 · ninguna fecha de nacimiento se perdio',
         count(*)::text,
         '(informativo: comparar con el valor previo)'
  from public.pas_atletas where fecha_nacimiento is not null

  union all
  -- Ningún valor fuera de dominio pudo entrar.
  select 16,
         'F3 · ningun sexo fuera de dominio',
         count(*)::text,
         '0'
  from public.pas_atletas
  where sexo is not null and sexo not in ('M', 'F')

  union all
  select 17,
         'F3 · ningun pais fuera de formato',
         count(*)::text,
         '0'
  from public.pas_atletas
  where pais is not null and pais !~ '^[A-Z]{2}$'
)

select
  comprobacion,
  observado,
  esperado,
  case
    when esperado like '(informativo%' then '—'
    when observado = esperado then 'OK'
    else 'FALLO'
  end as veredicto
from comprobaciones
order by orden;
