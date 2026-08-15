-- ── Coordenadas normativas del atleta (Sprint PRS-2.2) ────────────────────
-- Desbloquea el informe normativo: el NIE necesita sexo y población para
-- situar una medición, y `pas_atletas` solo registraba la fecha de nacimiento.
--
-- POR QUÉ AQUÍ Y NO EN OTRA TABLA. La auditoría previa buscó estas coordenadas
-- en todo el esquema:
--
--   · `profiles.sexo` y `profiles.altura_cm` existen, pero describen al
--     PROFESIONAL que evalúa, no al atleta evaluado. Tomarlos de ahí compararía
--     al atleta contra la población de quien lo mide.
--   · `bcs_mediciones.altura_cm` existe, pero cuelga de `bcs_clientes`, y no
--     hay ninguna clave que enlace esa lista con `pas_atletas`. Son dos
--     conjuntos independientes del mismo entrenador; darlos por equivalentes
--     sería una inferencia.
--   · `pais` no existía en ninguna tabla del proyecto.
--
-- Ninguna fuente canónica que reutilizar, luego las tres viven aquí.
--
-- LOS DOMINIOS SON LOS DEL NIE, A PROPÓSITO. `sexo` guarda 'M'/'F' y `pais`
-- guarda ISO-3166-1 alfa-2, que es exactamente lo que consume el motor. Guardar
-- 'Masculino' obligaría a una tabla de traducción mantenida en dos sitios, y una
-- traducción que se desincroniza es indistinguible de una inferencia. El
-- formulario muestra etiquetas legibles; la base guarda identificadores.
--
-- 'Prefiero no decirlo' NO se admite, y su ausencia es deliberada: todas las
-- normas de la NKB estratifican por sexo binario. Un tercer valor no tendría
-- norma que le corresponda, así que se registra como NULL —ausencia de dato—
-- en lugar de como un estrato que no existe. La distinción importa: NULL dice
-- «no lo sabemos», no «no encaja».

-- ── Nuevas columnas ────────────────────────────────────────────────────────
-- Las tres NULLABLE y sin valor por defecto. Los atletas ya registrados quedan
-- con NULL, que es la verdad: nadie declaró su sexo ni su población. Rellenarlas
-- con cualquier cosa —el valor más frecuente, el del profesional, el país del
-- despliegue— fabricaría datos de identidad, y el informe normativo los daría
-- por buenos sin poder distinguirlos de los declarados.

alter table public.pas_atletas
  add column if not exists sexo text
    check (sexo is null or sexo in ('M', 'F')),

  add column if not exists pais text
    check (pais is null or pais ~ '^[A-Z]{2}$'),

  -- Estatura del atleta, en centímetros. NO bloquea el informe: solo la
  -- estratifican las seis fichas brasileñas de la NKB, y exigirla dejaría sin
  -- comparación a un atleta cuyas normas no la necesitan. El NIE ya distingue
  -- «esta norma no usa la estatura» de «no sabemos la estatura».
  add column if not exists estatura_cm numeric
    check (estatura_cm is null or (estatura_cm > 80 and estatura_cm < 260));

-- El rango de `estatura_cm` replica el de `profiles.altura_cm` (> 80) y le
-- añade un techo. No es una regla científica: es una barrera contra el error de
-- tecleo, del mismo orden que el `length(nombre) <= 120` de esta misma tabla.

comment on column public.pas_atletas.sexo is
  'Sexo declarado del atleta, en el vocabulario del NIE (M/F). NULL = no consta.';
comment on column public.pas_atletas.pais is
  'Poblacion de pertenencia, ISO-3166-1 alfa-2. NULL = no consta. No es residencia.';
comment on column public.pas_atletas.estatura_cm is
  'Estatura en cm. NULL = no consta. Solo la estratifican las normas brasilenas.';

-- ── Reversión ──────────────────────────────────────────────────────────────
-- Aditiva y reversible. Deshacerla no toca ninguna fila existente:
--
--   alter table public.pas_atletas
--     drop column if exists sexo,
--     drop column if exists pais,
--     drop column if exists estatura_cm;
--
-- Las políticas RLS de `pas_atletas` no cambian: cubren la fila entera por
-- `profesional_id`, así que las columnas nuevas heredan el permiso sin tocarlas.
