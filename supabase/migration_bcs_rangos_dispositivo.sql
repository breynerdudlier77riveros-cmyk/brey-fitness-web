-- ── BCS · rangos de referencia del dispositivo, por cliente ────────────────
--
-- ESTADO: NO APLICADA. Requiere autorización explícita antes de ejecutarse.
--
-- ── POR QUÉ VAN EN EL CLIENTE Y NO EN UNA TABLA GLOBAL ─────────────────────
--
-- Porque no existe una tabla global. Se comprobó sobre una hoja real del
-- InBody 770 (184 cm, varón, 23 años) y los rangos impresos NO son percentiles
-- de ninguna población: son una fórmula sobre la talla.
--
--   peso estándar   = IMC 22 × talla²            → 74,48 kg
--   MLG estándar    = 85 % del peso estándar     → 63,31 kg
--   cada componente = fracción fija de la MLG estándar
--   banda           = ±10 %, salvo la grasa, que es 80–160 %
--
-- Once de las doce variables impresas encajan con esa fórmula al segundo
-- decimal. Es la confirmación aritmética de lo que la propia guía de InBody
-- dice con palabras: «100% designates the ideal for individuals with the same
-- height and gender».
--
-- Consecuencia directa: dos clientes de tallas distintas tienen rangos
-- distintos, así que no hay nada que cargar una vez para todos. Lo que sí
-- puede hacerse es capturar los del cliente UNA vez —dependen solo de talla y
-- sexo, que no cambian— y reutilizarlos en todas sus mediciones.
--
-- ── POR QUÉ NO SE DERIVAN CON LA FÓRMULA ───────────────────────────────────
--
-- La fórmula se dedujo aquí; InBody no la publica. Encaja perfecto en la hoja
-- de un varón y no hay ninguna hoja de mujer con la que comprobar sus
-- constantes, que son distintas. Aplicar las masculinas a una clienta daría
-- doce rangos equivocados sin que nada fallara.
--
-- Transcribir de la hoja es exacto para los dos sexos y comprobable contra el
-- papel. Se queda documentada por si algún día hay hojas suficientes para
-- verificar ambas.
--
-- ── LA COLUMNA ES JSONB, Y ES DELIBERADO ───────────────────────────────────
--
-- Un rango por variable, y el catálogo tiene 22. Veintidós pares de columnas
-- `numeric` convertirían cada consulta en un muro y obligarían a migrar cada
-- vez que el catálogo cambie. Aquí el esquema lo impone la aplicación, que es
-- donde vive el catálogo.

begin;

alter table public.bcs_clientes
  add column if not exists rangos_dispositivo jsonb;

comment on column public.bcs_clientes.rangos_dispositivo is
  'Rangos de referencia impresos en la hoja de resultados de ESTE cliente, por variable: {"grasa_pct": {"min": 10, "max": 20}, ...}. Dependen de su talla y su sexo, no de una población. null = no capturados.';

alter table public.bcs_clientes
  add column if not exists dispositivo_referencia text;

comment on column public.bcs_clientes.dispositivo_referencia is
  'Modelo del aparato del que se transcribieron los rangos. Se nombra en cada barra: una escala de un fabricante no se compara con la de otro.';

commit;

-- ── Verificación ───────────────────────────────────────────────────────────
--
--   select column_name, data_type
--     from information_schema.columns
--    where table_name = 'bcs_clientes'
--      and column_name in ('rangos_dispositivo', 'dispositivo_referencia');
--
-- Dos filas: jsonb y text.
