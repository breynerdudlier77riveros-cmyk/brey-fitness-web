---
modulo: 28
titulo: Registro de evaluación y matrices de cobertura
estado: v1.0
sprint: NKB-3.0
---

# 28 · Registro de evaluación

Toda fuente evaluada deja rastro, admitida o no (TR-12, I-21). Las dos matrices
que este módulo contiene son obligatorias: **el vacío también es resultado**.

---

## Matriz 1 · Embudo por fuente

> **Actualizada en NKB-3.1, 3.3 y 3.4.** En NKB-3.1, dos fuentes pendientes se
> resolvieron (`29`). En NKB-3.3 se añadieron nueve fuentes de Colombia y
> Latinoamérica (`32`). En NKB-3.4 dos fuentes subieron de E-2 y E-1 a **E-5** al
> cerrarse su deuda de acceso, y se añadió la candidata a conflicto (`34`).

| Fuente | Nivel | Resultado | Criterio fallido |
|---|---|---|---|
| `steiber_hgs_alemania_2016` | **E-5** | Admitida · 2 fichas, 56 normas | — |
| `reichenheim_hgs_brasil_2021` | **E-5** | Admitida · **6 fichas, 156 normas** | — |
| `martinez_torres_hgs_colombia_2022` | **E-5** | Admitida · 1 ficha, 24 normas | — |
| `gomez_campos_hgs_chile_2018` | **E-5** | Admitida · 2 fichas, 48 normas | — |
| `vivas_diaz_hgs_universitarios_2016` | **E-5** | Admitida · 2 fichas, 48 normas · **subió desde E-2** | — |
| `bustos_viviescas_hgs_cucuta_2019` | **E-5** | Admitida · 2 fichas, 24 normas · **subió desde E-1** | — |
| `tomkinson_normas_internacionales_2024` | **E-4** | Verificada y **no admitida** | **CA-05** |
| `ramirez_velez_hgs_colombia_6_64_2021` | **E-2** | Metadatos verificados · tablas sin copia abierta | **CA-07** · deuda de acceso |
| `ramirez_velez_hgs_fuprecol_2017` | **E-2** | Repositorio sin respuesta | **CA-07** · deuda de acceso |
| `hgs_escolares_chile_8_12_lms` | **E-1** | Sin copia abierta · deuda de acceso confirmada | — |
| `hgs_adultos_mayores_colombia_regresion_cuantilica` | E-1 | No verificada · deuda de acceso | — |
| `hgs_adultos_chile_estandarizacion` | E-1 | No verificada · deuda de acceso | — |
| `hgs_escolares_chile_discapacidad_intelectual` | E-1 | No verificada · deuda de búsqueda | — |
| `hgs_ninos_peru_altitud_moderada` | E-1 | No verificada · deuda de búsqueda | — |
| `hgs_pure_21_paises` | E-1 | No verificada · deuda de búsqueda | — |
| `pendiente_hgs_reino_unido` | E-1 | No verificada · deuda de búsqueda | — |
| `pendiente_hgs_estados_unidos` | E-1 | No verificada · deuda de acceso | — |
| `pendiente_hgs_adolescentes` | E-1 | No verificada · deuda de búsqueda | — |
| `rechazada_sitio_divulgacion_hgs` | E-1 | **Rechazada por naturaleza** | **CA-02** |

**19 fuentes evaluadas · 6 admitidas · 1 verificada y no admitida · 2 detenidas
en E-2 · 9 localizadas sin verificar · 1 rechazada por naturaleza.**

> **La clave provisional de Cúcuta desapareció del registro** al verificarse la
> fuente, que pasó a `bustos_viviescas_hgs_cucuta_2019`. Es el mismo mecanismo
> que NKB-3.1 aplicó a las dos primeras pendientes: una clave provisional no
> sobrevive a la verificación de su fuente, ni siquiera como cita histórica,
> porque dejaría una referencia colgante.

> **E-1 no significa «sin evidencia».** Significa localizada y **no verificada**
> en este sprint. Es deuda de búsqueda, no ausencia (I-14). Convertir una en
> otra sería exactamente lo que la comprobación 7 de `20` prohíbe.

> **E-2 con CA-07 tampoco significa «mala fuente».** Las dos fuentes colombianas
> detenidas ahí probablemente contienen normas admisibles; el criterio falla
> porque **no podemos leer sus tablas**, no porque no las tengan. Si aparece una
> copia legible, se reevalúan sin prejuicio.

---

## Matriz 2 · Cobertura normativa

| Variable | Método | Población | Estrato | Tipo | Normas | Fuente | Estado |
|---|---|---|---|---|---|---|---|
| Fuerza de prensión manual | Dinamometría Smedley S | Alemania 17–90, panel socioeconómico, excluido el 5% de peor salud física autopercibida | Sexo × edad (14) | TN-2 | 28 | `steiber_hgs_alemania_2016` | ES-1 Activa |
| Fuerza de prensión manual | Dinamometría Smedley S | Ídem | Sexo × edad (14) | TN-1 (solo P50) | 28 | `steiber_hgs_alemania_2016` | ES-1 Activa |
| Fuerza de prensión manual | Dinamometría JAMAR hidráulica J00105 | Brasil 65–90, envejecimiento satisfactorio | Varones > 1,70 m × edad (26) | TN-1 (13 percentiles) | 26 | `reichenheim_hgs_brasil_2021` | ES-1 Activa |
| Fuerza de prensión manual · media de ambas manos | Dinamometría digital Takei TKK 5101 | Colombia 6–17,9, civil no institucionalizada (ENSIN 2015) | Sexo × edad (12) | TN-1 (7 percentiles) | 24 | `martinez_torres_hgs_colombia_2022` | ES-1 Activa |
| Fuerza de prensión manual · mano derecha | Dinamometría JAMAR hidráulica PC-5030 J1, sedestación | Chile 6–17,9, escolares de 12 centros públicos de la Región del Maule | Sexo × edad (12) | TN-1 (9 percentiles) | 24 | `gomez_campos_hgs_chile_2018` | ES-1 Activa |
| Fuerza de prensión manual · mano izquierda | Ídem | Ídem | Sexo × edad (12) | TN-1 (9 percentiles) | 24 | `gomez_campos_hgs_chile_2018` | ES-1 Activa |
| Fuerza de prensión manual · mano dominante | Dinamometría JAMAR hidráulica J00105, sedestación | Brasil 65–90, envejecimiento satisfactorio | Varones > 1,60 y ≤ 1,70 m × edad (26) | TN-1 (13 percentiles) | 26 | `reichenheim_hgs_brasil_2021` | ES-1 · **5 en ES-2** |
| Fuerza de prensión manual · mano dominante | Ídem | Ídem | Varones ≤ 1,60 m × edad (26) | TN-1 (13 percentiles) | 26 | `reichenheim_hgs_brasil_2021` | ES-1 Activa |
| Fuerza de prensión manual · mano dominante | Ídem | Ídem | Mujeres > 1,60 m × edad (26) | TN-1 (13 percentiles) | 26 | `reichenheim_hgs_brasil_2021` | ES-1 Activa |
| Fuerza de prensión manual · mano dominante | Ídem | Ídem | Mujeres > 1,50 y ≤ 1,60 m × edad (26) | TN-1 (13 percentiles) | 26 | `reichenheim_hgs_brasil_2021` | ES-1 Activa |
| Fuerza de prensión manual · mano dominante | Ídem | Ídem | Mujeres ≤ 1,50 m × edad (26) | TN-1 (13 percentiles) | 26 | `reichenheim_hgs_brasil_2021` | ES-1 Activa |
| Fuerza de prensión manual · media de ambas manos | Dinamometría analógica Takei T-18 TKK SMEDLY III, bipedestación | Colombia 18–29, universitarios de Bogotá y Cali | Sexo × edad (12) | TN-1 (7 percentiles) | 24 | `vivas_diaz_hgs_universitarios_2016` | ES-1 Activa |
| Fuerza de prensión manual · media de ambas manos | Ídem | Ídem | Sexo × edad (12) | **TN-2** | 24 | `vivas_diaz_hgs_universitarios_2016` | ES-1 Activa |
| Fuerza de prensión manual · mano dominante | Dinamometría digital Camry, bipedestación | Colombia 10–69, aparentemente sanos de Cúcuta | Sexo × década (6) | TN-1 (7 percentiles) | 12 | `bustos_viviescas_hgs_cucuta_2019` | ES-1 Activa |
| Fuerza de prensión manual · mano no dominante | Ídem | Ídem | Sexo × década (6) | TN-1 (7 percentiles) | 12 | `bustos_viviescas_hgs_cucuta_2019` | ES-1 Activa |

**Total: 356 normas publicadas, 1 variable, 6 métodos, 6 poblaciones, 15 fichas.**

De las 356, **327 en ES-1 · Activa** y **29 en ES-2 · Cuestionada**: 5 por el
defecto de la tabla brasileña S2 (`34`, parte V) y 24 por la discrepancia del
par ENSIN (`40`).

Los dos JAMAR hidráulicos cuentan como **métodos distintos**: modelos, posición
corporal, número de intentos y forma de consolidarlos difieren. Y los dos Takei
también: el TKK 5101 es digital y el T-18 SMEDLY III es analógico, con
protocolos distintos. **Compartir marca no es compartir método** (`18`).

La tabla completa del dominio, con evidencia, aplicabilidad y limitaciones por
ficha, está en `30` y `33`. Las matrices de cobertura y aplicabilidad orientadas
a población objetivo están en `31`.

---

## Normas rechazadas dentro de una fuente admitida

Este es el resultado más informativo del sprint: **la misma publicación produjo
normas admisibles y normas rechazadas**, y el criterio discriminó entre ellas.

### RN-01 · Tablas 1 y 2 · media por edad y altura

| | |
|---|---|
| **Qué son** | Las tablas principales del artículo, tituladas «Normative Reference Values» |
| **Contenido verificado** | Columnas: edad, altura, media de prensión, «risk threshold» |
| **Nivel alcanzado** | **E-4** |
| **Criterio fallido** | **CA-07** |
| **Motivo** | La media aparece **sin medida de dispersión en ese estrato**. TN-2 exige media *y* dispersión (`15`). No corresponde a ningún tipo del catálogo |
| **Qué faltaría** | La desviación típica por celda de edad × altura |

> La desviación típica **existe en la fuente**, pero por grupo de edad, no por
> edad × altura. Combinarlas sería aplicar una dispersión de un estrato a otro
> más fino: una derivación que la fuente no autoriza (`21`, DV-03) y que además
> mezcla estratos (`19`, ST-02).

**Que la tabla se titule «valores normativos de referencia» no la convierte en
norma admisible.** Es el caso que mejor demuestra que el criterio no se deja
llevar por la etiqueta.

### RN-02 · Columna «risk threshold» como punto de corte

| | |
|---|---|
| **Qué es** | Última columna de las Tablas 1 y 2 |
| **Definición verificada** | Nota al pie: «group-specific mean value (3rd column) minus 1 age-group-specific SD» |
| **Nivel alcanzado** | **E-4** |
| **Criterio fallido** | **CA-07**, para el tipo TN-5 |
| **Motivo** | **Su origen es distributivo, no de desenlace.** Es la media menos una desviación típica. TN-5 exige un valor derivado de un estudio que siguiera un desenlace (`15`) |
| **Qué faltaría** | Que el umbral procediera del análisis de desenlace, no de la distribución |

**Matiz que se registra en vez de resolverse.** El artículo sí realiza un
análisis de supervivencia y reporta asociación con mortalidad para valores
situados entre 1 y 1,5 desviaciones típicas por debajo de la media
estandarizada. Pero:

- el umbral **tabulado** se define a 1 desviación típica exacta;
- el **rango analizado** es de 1 a 1,5;
- la correspondencia entre ambos no pudo establecerse con fidelidad desde el
  texto accesible.

Ante esa ambigüedad, la decisión conservadora es **no admitir** y dejar
constancia. Admitirla exigiría suponer una correspondencia que la fuente no
declara, y ese supuesto viajaría después como si fuera dato.

> Es la aplicación literal de «percentil ≠ punto de corte»: una columna
> **literalmente titulada «risk threshold»** no entra como punto de corte
> porque su definición publicada es distributiva.

### RN-04 · Categorías importadas de otra población *(NKB-3.4)*

| | |
|---|---|
| **Qué son** | Tablas 7 y 8 de `bustos_viviescas_hgs_cucuta_2019`: seis categorías de *deficiente* a *excelente* |
| **Nivel alcanzado** | **E-4** |
| **Criterio fallido** | **CA-07**, para el tipo TN-7 |
| **Motivo** | Definición puramente distributiva —cada categoría es un tramo de percentil— y **cortes tomados de una propuesta para niños de 6 a 12 años de Arequipa, Perú**, aplicados aquí a personas de 10 a 69 de Cúcuta |

Los percentiles de esa misma fuente **sí entran**. Detalle completo en `34`,
parte III.

### RN-03 · Categorías nombradas por la fuente

| | |
|---|---|
| **Qué son** | El artículo introduce dos etiquetas para tramos de la distribución |
| **Nivel alcanzado** | **E-4** |
| **Criterio fallido** | **CA-07**, para el tipo TN-7 |
| **Motivo** | Sus definiciones aparecen enunciadas en el texto con dos formulaciones distintas —respecto a la media de pico y respecto a la media estandarizada del grupo— y no pudo determinarse con fidelidad cuál corresponde a qué tramo tabulado |
| **Qué faltaría** | Los límites exactos de cada categoría, unívocos y localizables |

Se registran las etiquetas **como hecho de la fuente**, sin importarlas como
vocabulario de la NKB: reproducir una etiqueta sin su definición exacta sería
importar el juicio sin su condición (`12`).

---

## Conflictos

> **Actualizado en NKB-3.5.** Existe **una discrepancia real y verificada**, y
> sigue sin poder registrarse como conflicto formal entre dos normas admitidas.

`martinez_torres_hgs_colombia_2022` y `ramirez_velez_hgs_colombia_6_64_2021`
analizan **las mismas mediciones de la ENSIN-2015** y publican percentiles que
difieren hasta **4,5 kg (24%)** en el P50 de los varones de 12 años. Las cuatro
coordenadas de identidad coinciden; lo único que difiere es el estimador.

- **No se registra conflicto formal**: `22` lo define entre dos normas
  **admitidas**, y la segunda sigue detenida en E-2 · CA-07.
- **`HGS-CO-TN1` pasa a ES-2 · Cuestionada**, sus 24 normas.
- **No se ha resuelto y no se resolverá por preferencia.**

Detalle, evidencia y las 24 diferencias medidas en `40`.

El resto de pares sigue sin conflicto. El más próximo entre fuentes distintas
—Colombia y Chile— coincide en variable, rango etario, estratificación y tipo, y
**aun así no lo es** (`32`).

---

## Vacíos normativos

> Actualizado en NKB-3.3: los dos primeros vacíos se han cerrado parcialmente.
> El inventario vigente de huecos está en `31`.

| Vacío | Naturaleza |
|---|---|
| Fuerza de prensión en poblaciones distintas de la alemana | **Parcialmente cubierto** — Brasil, Colombia y Chile admitidas |
| Fuerza de prensión con dinamómetros distintos del Smedley S | **Parcialmente cubierto** — JAMAR hidráulico y Takei digital admitidos |
| Fuerza de prensión en adulto colombiano | **No verificado** · deuda de acceso, no vacío científico |
| Percentiles distintos de P50 para la población alemana | **Sin norma admisible en esa fuente**: la fuente no los publica |
| Punto de corte con desenlace para esta variable | **No verificado**: ninguna fuente evaluada lo aporta en forma admisible |
| Toda otra variable del ecosistema | **No verificado**: fuera del alcance de estos sprints |

Los dos estados se distinguen deliberadamente (I-14): «no verificado» afirma
algo sobre nuestro trabajo; «sin norma admisible» afirma algo sobre la fuente.
Ninguno afirma nada sobre la literatura mundial.

---

## Lo que la NKB todavía NO puede hacer

1. **Situar un valor individual.** Eso es del NIE, que no existe.
2. **Aplicar cada norma fuera de su población**: ni la alemana a quien quedara
   en el 5% excluido por salud física autopercibida, ni la colombiana o la
   chilena a un adulto, ni la brasileña a nadie que no sea varón de más de
   1,70 m con envejecimiento satisfactorio.
3. **Comparar normas de distinto dinamómetro**: la relación por defecto es EQ-3,
   y es la única que se ha usado en cuatro sprints.
4. **Convertir unidades.** Conviven kg, kgf y lbf, y la base no convierte.
5. **Ofrecer percentiles distintos de P50** para la población alemana.
6. **Afirmar que un valor es adecuado, saludable o suficiente.** Nunca.
