-- ── Cierre de G-01 y G-04 (Sprint PAS-12) ─────────────────────────────────
--
-- NO APLICADA. Se entrega escrita y documentada; aplicarla es una decisión
-- humana. Hasta entonces el sistema funciona igual y declara los dos gaps.
--
-- Aditiva y reversible: dos columnas nuevas, ambas NULLABLE, sin tocar
-- ninguna columna ni restricción existente. Ninguna fila histórica cambia.
--
-- ══════════════════════════════════════════════════════════════════════════
-- G-01 · MASA CORPORAL, POR EVALUACIÓN Y NO POR ATLETA
-- ══════════════════════════════════════════════════════════════════════════
--
-- LA DECISIÓN DE DISEÑO, Y POR QUÉ NO ES OBVIA:
--
--   Lo cómodo sería `pas_atletas.peso_kg`. Sería un error, y de los que no
--   avisan: un atleta pesa 65 kg en enero y 68 en agosto, y el sistema
--   reinterpretaría la evaluación de enero con el peso de agosto. La fuerza
--   relativa saldría mal para todo el histórico, en silencio y sin que ningún
--   test lo detecte, porque el número seguiría siendo plausible.
--
--   El peso pertenece al MOMENTO DE LA MEDICIÓN. Por eso vive en la
--   evaluación, que es la que tiene fecha.
--
-- QUÉ PASA CON LAS EVALUACIONES ANTIGUAS:
--
--   Se quedan en NULL. **No se rellenan.** No hay ningún peso histórico que
--   recuperar, y estimarlo desde un peso posterior sería exactamente el error
--   que esta columna existe para impedir. Una evaluación sin peso produce
--   `NO_DETERMINABLE` en la fuerza relativa, que es la verdad.

alter table public.pas_evaluaciones
  -- El rango replica el criterio de `estatura_cm` en PRS-2.2: excluye lo
  -- imposible sin excluir lo infrecuente.
  add column if not exists peso_kg numeric
    check (peso_kg is null or (peso_kg > 20 and peso_kg < 350));

comment on column public.pas_evaluaciones.peso_kg is
  'Masa corporal EN LA FECHA DE ESTA EVALUACION. NULL = no consta. Nunca se rellena con el peso de otra fecha.';

-- ══════════════════════════════════════════════════════════════════════════
-- G-04 · COMPONENTES DE UN RESULTADO COMPUESTO
-- ══════════════════════════════════════════════════════════════════════════
--
-- El caso que lo motiva es el RSI (P-05). Es un cociente:
--
--     RSI = altura de salto / tiempo de contacto
--
--   y la propia fuente que la NKB tiene registrada DESACONSEJA informarlo sin
--   sus dos componentes. El motivo es que el índice los oculta: un RSI estable
--   puede esconder una altura que sube y un tiempo de contacto que sube con
--   ella. Quien lea solo el cociente cree que no ha pasado nada.
--
-- POR QUÉ jsonb Y NO COLUMNAS TIPADAS:
--
--   Porque el conjunto de componentes depende de la prueba, y crear
--   `altura_salto_cm` y `tiempo_contacto_ms` en `pas_registros` metería dos
--   columnas específicas de una prueba en una tabla que sirve a once. El mismo
--   criterio que ya sigue `condiciones`.
--
--   El vocabulario NO es libre: se declara en TypeScript por prueba, igual que
--   las condiciones, y lo que no esté declarado no se guarda.
--
-- QUÉ PASA CON LOS REGISTROS ANTIGUOS:
--
--   `{}`. **No se reconstruyen.** Un RSI de 1,8 no permite despejar sus dos
--   componentes: hay infinitas combinaciones que dan ese cociente. Los
--   registros antiguos conservan el índice y declaran que sus componentes no
--   constan.

alter table public.pas_registros
  add column if not exists componentes jsonb not null default '{}'::jsonb;

comment on column public.pas_registros.componentes is
  'Componentes medidos de un resultado compuesto (p. ej. altura y tiempo de contacto del RSI). Vocabulario cerrado, declarado por prueba en TypeScript. {} = no constan; jamas se reconstruyen desde el resultado.';

-- ── Reversión ─────────────────────────────────────────────────────────────
-- Aditiva. Deshacerla no toca ningún dato existente:
--
--   alter table public.pas_evaluaciones drop column if exists peso_kg;
--   alter table public.pas_registros     drop column if exists componentes;
--
-- ── Impacto sobre RLS ─────────────────────────────────────────────────────
-- Ninguno. Las dos columnas viven en tablas cuya propiedad ya se hereda del
-- atleta, y ninguna política existente enumera columnas.
