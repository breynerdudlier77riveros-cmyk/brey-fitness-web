-- ── BCS · identidad del Cliente y dispositivo de la Medición ───────────────
--
-- ESTADO: APLICADA Y VERIFICADA (2026-08-20).
--
-- Comprobado contra la base real: `bcs_clientes.sexo`, `bcs_clientes.
-- fecha_nacimiento` y `bcs_mediciones.dispositivo` responden a una consulta.
-- El fichero se conserva porque es idempotente (`add column if not exists`) y
-- porque su cabecera es el único sitio donde está escrito POR QUÉ existen
-- estas tres columnas.
--
-- ── QUÉ PROBLEMA CIERRA ────────────────────────────────────────────────────
--
-- De las 25 variables del BCS, cuatro tienen clasificación definida en el
-- handbook (06): IMC, % grasa corporal, grasa visceral y WHR. Hoy solo se
-- calcula la de IMC, y las otras tres se declaran bloqueadas:
--
--   grasa_pct           → «Requiere sexo y edad del Cliente»
--   whr                 → «Requiere sexo del Cliente»
--   grasa_visceral_idx  → «Requiere la escala del dispositivo del fabricante»
--
-- Ninguno de esos tres datos existe en el esquema. El % de grasa corporal es
-- el número por el que un cliente abre el informe, y el sistema no puede
-- situarlo.
--
-- ── POR QUÉ ESTO EXTIENDE EL MODELO DE DOMINIO, Y SE DECLARA ───────────────
--
-- El Domain Model (02) describe al Cliente como «datos identificativos
-- (nombre, contacto opcional) y su ciclo de vida propio», y su diagrama ER
-- lista exactamente `id, nombre, estado, fechaAlta`. No hay sexo ni fecha de
-- nacimiento en ninguna parte.
--
-- Pero el módulo 06 SÍ los presupone: clasifica % grasa «por sexo y edad», WHR
-- «por sexo (OMS)», y lista entre sus casos límite «Sexo no especificado en el
-- Cliente → las clasificaciones que dependen de sexo se omiten». Un caso
-- límite para un campo que el modelo nunca definió.
--
-- Es una contradicción del propio handbook, no una decisión que esta migración
-- tome por su cuenta: 06 exige el dato y 02 no lo declara. Aquí se resuelve a
-- favor de 06, que es el módulo que describe qué hace el producto.
--
-- ── LOS TRES CAMPOS SON NULLABLE, Y ES DELIBERADO ──────────────────────────
--
-- Hay cuatro clientes y seis mediciones ya registradas. Ninguna trae sexo,
-- fecha de nacimiento ni dispositivo, y no existe ningún valor por defecto
-- honesto: poner 'M' o la fecha de hoy fabricaría una identidad. `null`
-- significa «no consta», y el informe ya sabe decir exactamente qué falta.
--
-- ── FECHA DE NACIMIENTO, NO EDAD ───────────────────────────────────────────
--
-- La edad cambia; la fecha de nacimiento no. Guardar «34» obligaría a saber
-- cuándo se escribió ese 34, y produciría una clasificación calculada con la
-- edad de hoy sobre una medición de hace dos años. Es el mismo error que el
-- PAS cerró en G-01 con la masa corporal por evaluación.

begin;

-- ── bcs_clientes ───────────────────────────────────────────────────────────

alter table public.bcs_clientes
  add column if not exists sexo text
    check (sexo is null or sexo in ('M', 'F'));

comment on column public.bcs_clientes.sexo is
  'M/F o null si no consta. Requerido por las clasificaciones de % grasa y WHR (BCS Handbook 06). Nunca se infiere del nombre.';

alter table public.bcs_clientes
  add column if not exists fecha_nacimiento date;

comment on column public.bcs_clientes.fecha_nacimiento is
  'Fecha, no edad: la edad se deriva a la fecha de CADA medición, nunca a la de hoy.';

-- Una fecha de nacimiento futura no es un dato incompleto, es un dato
-- imposible, y el check lo impide en la única capa que no se puede saltar.
alter table public.bcs_clientes
  drop constraint if exists bcs_clientes_fecha_nacimiento_no_futura;
alter table public.bcs_clientes
  add constraint bcs_clientes_fecha_nacimiento_no_futura
    check (fecha_nacimiento is null or fecha_nacimiento <= current_date);

-- ── bcs_mediciones ─────────────────────────────────────────────────────────
--
-- El dispositivo va en la MEDICIÓN, no en el cliente: un mismo cliente puede
-- medirse en dos básculas distintas, y el handbook (03) advierte que «dos
-- dispositivos distintos pueden reportar valores diferentes para la misma
-- persona el mismo día». Atarlo al cliente haría que cambiar de aparato
-- reescribiera la procedencia de todo su histórico.

alter table public.bcs_mediciones
  add column if not exists dispositivo text;

comment on column public.bcs_mediciones.dispositivo is
  'Modelo del analizador BIA usado. Necesario para la escala de grasa visceral (BCS-V14) y para declarar de qué aparato viene cada serie (BCS Handbook 03).';

commit;

-- ── Verificación ───────────────────────────────────────────────────────────
--
--   select column_name, data_type, is_nullable
--     from information_schema.columns
--    where table_name in ('bcs_clientes', 'bcs_mediciones')
--      and column_name in ('sexo', 'fecha_nacimiento', 'dispositivo');
--
-- Deben salir tres filas, las tres con is_nullable = 'YES'.
