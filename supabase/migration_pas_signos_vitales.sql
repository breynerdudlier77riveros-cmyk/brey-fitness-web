-- ── Signos vitales de la evaluación (Sprint PAS-18) ────────────────────────
--
-- ⚠ ESCRITA Y NO APLICADA. Requiere autorización explícita antes de correrla.
--
-- QUÉ AÑADE Y POR QUÉ VIVE EN LA EVALUACIÓN
--
--   Frecuencia cardiaca de reposo, saturación de oxígeno y tensión arterial.
--   Van junto a `peso_kg`, y por el mismo motivo que él (G-01): son del DÍA de
--   la medición, no del atleta. La tensión de hace seis meses no describe la
--   sesión de hoy, y arrastrarla desde la ficha produciría un dato falso con
--   aspecto de correcto.
--
-- POR QUÉ NO SON UNA PRUEBA MÁS DEL CATÁLOGO
--
--   Una prueba del catálogo se sitúa contra una norma y contribuye —o no— a
--   una capacidad. Estos tres no evalúan ninguna capacidad: son el contexto
--   fisiológico en que se midió todo lo demás, y además la condición de
--   seguridad que decide si la sesión puede siquiera empezar. El propio
--   protocolo del Senior Fitness Test excluye a quien tenga una tensión no
--   controlada de 160/100, y el del escalón de Harvard manda tomar tensión y
--   pulso en reposo antes de autorizar la prueba.
--
--   Es la misma frontera que separa F-J (antropometría, «contexto») de las
--   familias que sí evalúan capacidades.
--
-- LO QUE ESTA MIGRACIÓN NO HACE
--
--   No guarda los pulsos de recuperación del escalón de Harvard ni la
--   frecuencia cardiaca final del Rockport. Esos NO son signos vitales de la
--   sesión: son componentes del resultado de una prueba concreta y viven en
--   `registros_pas.componentes`, que existe desde PAS-14 exactamente para eso
--   (G-04). Meterlos aquí los desligaría de la prueba que los produjo.
--
-- NULL SIGNIFICA «NO CONSTA», NUNCA UN VALOR POR DEFECTO. Sin CHECK de
-- obligatoriedad: una evaluación sin tensión registrada es válida, y decir que
-- no consta es más honesto que inventar una cifra normal.

alter table public.pas_evaluaciones
  add column if not exists fc_reposo_lpm      smallint,
  add column if not exists spo2_pct           smallint,
  add column if not exists ta_sistolica_mmhg  smallint,
  add column if not exists ta_diastolica_mmhg smallint;

-- Los rangos son de PLAUSIBILIDAD FISIOLÓGICA, no de normalidad clínica.
-- Rechazan un error de tecleo —una tensión de 1400, una SpO2 de 950— y no
-- opinan sobre si la cifra es sana: eso no lo decide una restricción de la
-- base de datos.
alter table public.pas_evaluaciones
  add constraint pas_evaluaciones_fc_reposo_plausible
    check (fc_reposo_lpm is null or (fc_reposo_lpm between 20 and 250)),
  add constraint pas_evaluaciones_spo2_plausible
    check (spo2_pct is null or (spo2_pct between 50 and 100)),
  add constraint pas_evaluaciones_ta_sistolica_plausible
    check (ta_sistolica_mmhg is null or (ta_sistolica_mmhg between 50 and 300)),
  add constraint pas_evaluaciones_ta_diastolica_plausible
    check (ta_diastolica_mmhg is null or (ta_diastolica_mmhg between 30 and 200));

-- La sistólica va por encima de la diastólica. Al revés es una inversión al
-- teclear, no una fisiología rara, y dejarla pasar produciría una presión de
-- pulso negativa en cualquier lectura posterior.
alter table public.pas_evaluaciones
  add constraint pas_evaluaciones_ta_coherente
    check (
      ta_sistolica_mmhg is null
      or ta_diastolica_mmhg is null
      or ta_sistolica_mmhg > ta_diastolica_mmhg
    );

comment on column public.pas_evaluaciones.fc_reposo_lpm is
  'Frecuencia cardiaca en reposo el día de la evaluación, en lpm. NULL = no consta.';
comment on column public.pas_evaluaciones.spo2_pct is
  'Saturación periférica de oxígeno en reposo, en %. NULL = no consta.';
comment on column public.pas_evaluaciones.ta_sistolica_mmhg is
  'Tensión arterial sistólica en reposo, en mmHg. NULL = no consta.';
comment on column public.pas_evaluaciones.ta_diastolica_mmhg is
  'Tensión arterial diastólica en reposo, en mmHg. NULL = no consta.';

-- RLS: no se toca nada. Las cuatro columnas viven en `pas_evaluaciones`, que
-- ya tiene sus políticas por profesional (FT-01/BE-04), y una columna nueva
-- hereda la política de su tabla. Añadir reglas aquí crearía un segundo sitio
-- donde se decide quién ve qué.
