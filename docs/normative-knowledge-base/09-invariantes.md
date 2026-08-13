---
modulo: 09
titulo: Invariantes
estado: congelado
---

# 09 · Invariantes

Reglas que **nunca** podrán romperse, en ninguna versión, por ninguna razón de
conveniencia.

Cada una indica qué la rompería en la práctica. Ese es su valor: un principio
que no puede violarse de forma concreta es decorativo. Si alguna estorba, la
respuesta correcta es revisar la decisión de diseño que la hace estorbar — nunca
hacer una excepción.

---

**I-01 · El sujeto de una norma es una variable, nunca una capacidad.**
La NKB no conoce el dominio de quien la use.
*Lo rompería:* añadir un campo «capacidad» para que el PAS la consulte más
cómodo.
*Nace en:* `README`, NKB-ADR-01.

**I-02 · La NKB no contiene datos de ninguna persona.**
Ni sujetos, ni mediciones, ni resultados individuales.
*Lo rompería:* guardar el valor de un atleta «para poder mostrar el percentil ya
calculado».
*Nace en:* `00` (L-02).

**I-03 · Ninguna norma se almacena sin método, población y unidad.**
Son parte de su identidad, no del contexto.
*Lo rompería:* incorporar una tabla útil dejando el método «pendiente de
confirmar».
*Nace en:* `02`, `04`.

**I-04 · Sin traza no hay norma.**
*Lo rompería:* cargar un lote de normas en bloque sin registrar de dónde salió
cada una.
*Nace en:* `07` (TR-01).

**I-05 · La NKB no deriva, no interpola, no extrapola y no convierte.**
Almacena lo publicado.
*Lo rompería:* rellenar el estrato que falta promediando los dos vecinos.
*Nace en:* `00` (L-03), `03`.

**I-06 · La calidad viaja siempre con la norma.**
No existe una entrega sin nivel de evidencia, ni una vista «solo las buenas».
*Lo rompería:* un filtro por calidad al publicar, para simplificar una pantalla.
*Nace en:* `05`.

**I-07 · Ninguna norma se borra.**
Se retira, con fecha y motivo.
*Lo rompería:* purgar las retiradas para «limpiar» la base.
*Nace en:* `06`.

**I-08 · Un conflicto no se resuelve.**
Dos normas con las mismas cuatro coordenadas y valores distintos se declaran en
conflicto. Ni se elige la más reciente, ni la de mayor muestra, ni se promedian.
*Lo rompería:* una regla de desempate «porque hay que devolver una».
*Nace en:* `01`, `06`.

**I-09 · La NKB no elige qué norma aplicar.**
Publica; el NIE decide y responde por ello.
*Lo rompería:* una función que devuelva «la norma correcta» para unas
características dadas.
*Nace en:* `00` (L-01).

**I-10 · Toda norma lleva referencia localizable y verificada.**
Los campos no confirmados se omiten, nunca se completan por plausibilidad.
*Lo rompería:* aceptar una tabla sin fuente porque es la única disponible para
esa variable.
*Nace en:* `04`.

**I-11 · Las clasificaciones son las de la fuente.**
No se inventan, no se derivan y no se armonizan entre fuentes.
*Lo rompería:* unificar dos escalas que usan la misma palabra para tramos
distintos.
*Nace en:* `01`, `02`.

**I-12 · Frecuente no es sano, ni adecuado, ni deseable.**
*Lo rompería:* etiquetar un tramo central como «normal» en cualquier salida.
*Nace en:* `08`, grupo 1.

**I-13 · Una norma nunca afirma causalidad.**
Ni siquiera un punto de corte procedente de un estudio de desenlace.
*Lo rompería:* redactar un punto de corte como si el umbral provocara el
desenlace.
*Nace en:* `02`, `08`.

**I-14 · Se distingue «sin norma admisible» de «no verificado».**
La primera afirma algo sobre el mundo; la segunda, sobre nuestro trabajo.
*Lo rompería:* marcar como «sin norma» una variable que nadie ha buscado.
*Nace en:* `05`.

---

## Añadidos en NKB-2.0

Protegen decisiones nuevas. Ninguno repite lo que I-01…I-14 ya cubren.

**I-15 · El embudo no se salta.**
Una fuente atraviesa los cinco niveles en orden; no se admite nada que no haya
superado los anteriores.
*Qué se rompe:* la garantía de que toda norma publicada fue verificada.
*Por qué importa:* sin ella, «esta fuente es evidentemente buena» basta para
entrar, y el criterio deja de existir.
*Cómo se detecta:* una norma publicada sin registro de los criterios superados.

**I-16 · Todo campo declara si procede de la fuente o de BREY.**
*Qué se rompe:* la separación entre lo que dice la publicación y lo que
añadimos.
*Por qué importa:* en un año nadie recordará quién escribió cada limitación.
*Cómo se detecta:* un campo sin marca de origen (TR-08).

**I-17 · Un dato reconstruido no entra.**
Lectura de figura, interpolación, estimación o aproximación.
*Qué se rompe:* la fidelidad a la fuente.
*Por qué importa:* un valor aproximado se almacena con la misma apariencia de
exactitud que uno publicado.
*Cómo se detecta:* un dato marcado OR-3 (`21`).

**I-18 · Una derivación exige supuesto sostenido por la fuente.**
*Qué se rompe:* la frontera entre lo publicado y lo calculado.
*Por qué importa:* derivar percentiles desde media y dispersión sin conocer la
forma de la distribución produce números falsos que parecen exactos.
*Cómo se detecta:* un dato OR-2 sin supuesto declarado (TR-11).

**I-19 · Una norma es de un tipo y no cambia de tipo.**
*Qué se rompe:* la distinción entre lo que la fuente publicó y lo que alguien
calculó después.
*Por qué importa:* permitir el cambio borraría el rastro de la transformación.
*Cómo se detecta:* una norma cuyo tipo no coincide con el de su fuente.

**I-20 · La referencia de una norma es siempre su fuente primaria.**
*Qué se rompe:* la trazabilidad hasta el origen.
*Por qué importa:* es el mecanismo por el que se cuelan las tablas de origen
desconocido.
*Cómo se detecta:* una norma cuya referencia es de clase secundaria (`20`).

**I-21 · Toda evaluación deja rastro, incluida la negativa.**
*Qué se rompe:* la memoria de lo que ya se descartó.
*Por qué importa:* sin ella, la misma fuente se reevalúa cada seis meses, o
acaba entrando sin que nadie sepa que ya se rechazó.
*Cómo se detecta:* no se detecta desde dentro. Es regla de procedimiento, y por
eso se declara explícitamente (TR-12).

**I-22 · Una entrada terminal no vuelve.**
Retirada o sustituida no regresan a activa; si procede, entra una entrada nueva.
*Qué se rompe:* la posibilidad de reconstruir qué estaba vigente en una fecha.
*Por qué importa:* un consumidor que aplicó una norma hace seis meses debe poder
averiguar qué aplicó.
*Cómo se detecta:* una transición desde ES-4 o ES-5 (`23`).

**I-23 · Los criterios no se modifican para admitir una fuente concreta.**
*Qué se rompe:* la independencia de los criterios respecto del producto.
*Por qué importa:* es la única presión que puede vaciar de sentido toda esta
base, y llegará con un caso urgente y razonable.
*Cómo se detecta:* un cambio de criterios cuya justificación menciona una fuente
concreta (`26`).

---

## Los tres que más presión recibirán

No todos corren el mismo riesgo. Estos se romperán por motivos que en el momento
parecerán razonables.

| Invariante | Presión que recibirá | Por qué hay que resistirla |
|---|---|---|
| **I-23** — los criterios no se tocan por una fuente | «Este caso es especial y la norma hace mucha falta» | Es la presión que puede vaciar de sentido toda la base, y llegará con un caso urgente y razonable |
| **I-10** — referencia verificada | «Es la única norma que existe para esta variable» | Una norma sin fuente no es mejor que ninguna: es peor, porque parece utilizable |
| **I-09** — la NKB no elige | «Sería mucho más cómodo pedirle la norma que toca» | En cuanto elija, la elección queda enterrada en la biblioteca y nadie podrá auditarla |
| **I-08** — el conflicto no se resuelve | «Hay que devolver un valor» | Un desempate a ciegas es indistinguible de una decisión informada |

## Relación con el resto del ecosistema

Estos invariantes no inventan principios. Son la expresión, dentro de la NKB, de
reglas que el ecosistema ya aplica: inmutabilidad y retirada en lugar de borrado
(BCS, PAS), trazabilidad obligatoria (PIE, PPRE), rechazo de fuentes comerciales
y omisión de campos no verificados (CKB, PKB), y la negativa a resolver
ambigüedades por criterio propio (PAS-ADR-04).

Una base nueva que los contradijera obligaría a mantener dos criterios de
honestidad distintos según qué módulo se mire.
