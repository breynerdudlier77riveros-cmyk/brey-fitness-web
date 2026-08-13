---
modulo: 24
titulo: Reglas de trazabilidad
estado: congelado
sprint: NKB-2.0
---

# 24 · Reglas de trazabilidad

Desarrolla `07` con las reglas que la admisión exige. Las siete de NKB-1
(TR-01…TR-07) siguen vigentes sin cambios; aquí se añaden las que protegen
decisiones de este sprint.

## Las ocho preguntas

Toda norma admitida debe poder responderlas sin salir de la base.

| # | Pregunta | Se responde con |
|---|---|---|
| 1 | ¿De dónde salió? | Referencia primaria y ubicación exacta del dato (CN-21, CN-26) |
| 2 | ¿Quién la publicó? | Autoría y publicación, tal como constan |
| 3 | ¿Qué población estudió? | Criterios de inclusión y exclusión (CN-13, CN-14) |
| 4 | ¿Qué método utilizó? | Descripción y parámetros (`18`) |
| 5 | ¿Dónde aparecen los datos? | Tabla, página o apartado concreto (CN-26) |
| 6 | ¿Qué está respaldado por la fuente? | Los campos marcados como de origen |
| 7 | ¿Qué es metadato de BREY? | Los campos marcados como añadidos |
| 8 | ¿Qué limitaciones tiene? | De la fuente y añadidas, por separado (CN-32, CN-33) |

Las preguntas **6 y 7** son la novedad de este sprint y la exigencia que más
protege a largo plazo: dentro de un año nadie recordará si una limitación la
escribió el autor del estudio o alguien de aquí.

---

## Reglas nuevas

**TR-08 · Todo campo declara su origen.**
De la fuente o añadido por BREY. Sin excepción, incluidos los que parezcan
obviamente de la fuente.
*Se rompe:* al copiar una limitación propia dentro del campo de limitaciones de
la fuente.
*Se detecta:* un campo sin marca de origen.

**TR-09 · La ubicación del dato es obligatoria.**
No basta la referencia: hace falta dónde dentro de ella.
*Se rompe:* al registrar «según Fulano (año)» sin decir en qué tabla.
*Se detecta:* una norma con referencia y sin ubicación.

**TR-10 · La cadena de procedencia se registra entera.**
Desde donde se encontró hasta la primaria (`20`).
*Se rompe:* al registrar solo la primaria, perdiendo cómo se llegó a ella.
*Se detecta:* una norma hallada por vía secundaria sin cadena.

**TR-11 · Todo dato derivado declara su origen y su supuesto.**
Qué dato explícito lo produjo, qué transformación y qué lo autoriza (`21`).
*Se rompe:* al almacenar un derivado como si fuera explícito.
*Se detecta:* un dato marcado OR-2 sin transformación declarada.

**TR-12 · Toda evaluación deja rastro, incluida la negativa.**
Qué fuente se evaluó, en qué nivel del embudo se detuvo y qué criterio falló.
*Se rompe:* al descartar una fuente sin registrarlo.
*Se detecta:* imposible desde dentro — por eso es una regla de procedimiento y
no una comprobación automática.

**TR-13 · Todo cambio de estado registra su motivo y su autor.**
*Se rompe:* al retirar una norma sin decir por qué.
*Se detecta:* una transición sin motivo.

**TR-14 · La versión de criterios aplicada se registra con la norma.**
*Se rompe:* al no anotarla, dejando imposible saber bajo qué reglas entró.
*Se detecta:* una norma sin versión de criterios.

---

## Trazabilidad de lo que no entró

Se desarrolla porque es la mitad que siempre se pierde.

Toda fuente evaluada y no admitida registra:

| Campo | Contenido |
|---|---|
| Identificación de la fuente | Suficiente para reconocerla si vuelve a aparecer |
| Nivel alcanzado | E-1 a E-4 (`13`) |
| Criterio que falló | CA-01 a CA-08 |
| Qué faltaría para admitirla | Concreto, no genérico |
| Quién y cuándo la evaluó | Igual que una admitida |

**El cuarto campo es el que convierte un rechazo en información útil.** «No
cumple» obliga a repetir todo el trabajo; «falta la descripción del método»
permite retomarlo si aparece un anexo.

## Lo que la traza NO hace

- **No interpreta** (TR-06, vigente).
- **No justifica** la norma: registra de dónde viene, no por qué es buena.
- **No valora** la fuente: eso es calidad (`16`).
- **No sustituye a la referencia**: es el camino hasta ella, no ella misma.

## Prohibiciones

Se repiten aquí porque son las que destruyen la confianza en una biblioteca
entera, y una sola vez basta:

1. Nunca se fabrica una referencia.
2. Nunca se completan autores por inferencia.
3. Nunca se inventa un identificador persistente.
4. Nunca se convierte una secundaria en primaria sin comprobarla.
5. Nunca se registra una verificación que no ocurrió.

La quinta es la más difícil de detectar desde fuera y la más grave: una traza
falsa es peor que ninguna traza, porque hace confiar.
