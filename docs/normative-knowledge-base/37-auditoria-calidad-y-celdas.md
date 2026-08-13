---
modulo: 37
titulo: Auditoría de calidad y representación de celdas pequeñas
estado: v1.0
sprint: NKB-3.5
---

# 37 · Calidad y celdas

Auditoría de la calidad asignada a las 356 normas, contra los criterios
congelados en `16`. **Ningún criterio se modifica. Ningún umbral numérico se
crea.**

---

## Parte I · Reproducibilidad de la calidad

Para cada ficha se comprobó si su nivel puede **reconstruirse desde la
documentación existente**, sin conocimiento externo.

| Ficha | Calidad | Dimensiones | ¿Reproducible? |
|---|---|---|---|
| `HGS-DE-TN2` | Moderada | D-03, D-05 | ✅ |
| `HGS-DE-TN1` | Moderada | D-03, D-05 | ✅ **tras corrección** |
| `HGS-BR-TN1` ×6 | Moderada | D-02, D-05 | ✅ |
| `HGS-CO-TN1` | Moderada | D-02, D-04 | ✅ |
| `HGS-CL-TN1-D` · `-I` | Moderada | D-01, D-04 | ✅ |
| `HGS-CO-UNI-TN1` · `-TN2` | Moderada | D-01, D-04 | ✅ |
| `HGS-CO-CUC-TN1-D` · `-ND` | **Baja** | D-01, D-02 | ✅ |

**15/15 reproducibles.** Ninguna calidad se cambió en este sprint.

### El problema documental encontrado

`HGS-DE-TN1-mediana.md` **no era reproducible**: dos de sus campos remitían a la
ficha hermana en lugar de declarar su contenido.

| Campo | Decía | Problema |
|---|---|---|
| CN-30 | «D-03 y D-05, igual que `HGS-DE-TN2`; más D-05 por publicarse un solo percentil» | Herencia + D-05 citado dos veces sin distinguir sus dos motivos |
| CN-34 | «El mismo que `HGS-DE-TN2`» | Herencia pura: el alcance no constaba |

**Es el mismo defecto que la auditoría de NKB-3.2 declaró corregido en esta
misma ficha.** Se corrigió entonces la enumeración de campos por rango, pero
quedaron estas dos herencias.

**Corrección aplicada:** ambos campos se escribieron explícitamente, con el
contenido que la fuente sostiene. **No se cambió la calidad** —sigue Moderada—
ni las dimensiones —siguen D-03 y D-05—: solo se hizo legible por qué.

> Que una ficha remita a otra no es un detalle de estilo. Si alguien retira
> `HGS-DE-TN2`, el alcance de `HGS-DE-TN1` desaparece con ella. **La
> autosuficiencia documental es lo que hace auditable una norma.**

### Etiquetas de campo no canónicas

Cinco campos aparecen con etiqueta abreviada en las dos fichas más antiguas:

| Campo | Etiquetas encontradas |
|---|---|
| CN-08 | «Parámetros» / «Parámetros del protocolo» |
| CN-22 | «Identificador» / «Identificador persistente» |
| CN-23 | «Fecha» / «Fecha de publicación» |
| CN-26 | «Ubicación» / «Ubicación del dato» |
| CN-30 | «Degradada por» / «Dimensiones que la degradaron» |

**No son un defecto de contrato**: el código CN identifica el campo y el
contenido es correcto en los quince casos. Se registra como **inconsistencia
cosmética**, y solo se normalizó CN-30 porque su corrección era necesaria por
otro motivo. Renombrar las demás sería tocar fichas sin necesidad.

---

## Parte II · ES-1 y ES-2

`23` congela cinco estados. Tras este sprint hay **dos en uso**.

| Estado | Normas | Fichas |
|---|---|---|
| **ES-1 · Activa** | **327** | 13 |
| **ES-2 · Cuestionada** | **29** | `HGS-BR-TN1-M167` (5) · `HGS-CO-TN1` (24) |
| ES-3 · ES-4 · ES-5 | 0 | — |

### Las dos objeciones, y por qué son distintas

| | `HGS-BR-TN1-M167` · 5 normas | `HGS-CO-TN1` · 24 normas |
|---|---|---|
| **Naturaleza** | Defecto interno de la tabla publicada | Discrepancia entre dos análisis de los mismos datos |
| **Evidencia** | El P50 se congela en 28,06 kgf y supera al P75 de su fila | La fuente admitida publica ambos P50 y declara la diferencia |
| **¿Hay error?** | Sí, casi con certeza: el valor es imposible | **No.** Ambos estimadores son legítimos |
| **Quién lo resuelve** | Solo la fuente, publicando una corrección | Nadie: no hay nada que corregir |
| **Efecto sobre la calidad** | Ninguno. Sigue Moderada | Ninguno. Sigue Moderada |
| **Módulo** | `34`, parte V | `40` |

**Las dos están sustentadas por evidencia explícita y verificable**, que es lo
que ES-2 exige. Ninguna se marcó por sospecha.

> **ES-2 no es un nivel de calidad.** `HGS-CO-TN1` es de calidad Moderada y está
> Cuestionada a la vez, sin contradicción: la calidad valora **cuánto respalda
> la evidencia**; el estado, **si hay una objeción pendiente**. Fundirlos
> ocultaría uno de los dos.

---

## Parte III · Tamaños de celda

### Lo que la base publica

| Ficha | n mín | n máx | Celdas | n < 30 | n < 60 |
|---|---|---|---|---|---|
| `HGS-DE-TN2` · `HGS-DE-TN1` | 350 | 1 372 | 28 c/u | 0 | 0 |
| `HGS-CL-TN1-D` · `-I` | 72 | 385 | 24 c/u | 0 | 0 |
| `HGS-CO-TN1` | 52 | 252 | 24 | 0 | **4** |
| `HGS-CO-UNI-TN1` · `-TN2` | 51 | 802 | 24 c/u | 0 | **2** |
| `HGS-CO-CUC-TN1-D` · `-ND` | **10** | 82 | 12 c/u | **8** | **10** |
| Las 6 `HGS-BR-*` | **no consta** | — | — | — | — |

**200 celdas con n publicado · 16 con n < 30 · 28 con n < 60 · 156 normas sin n
por celda** (las brasileñas, cuya fuente no lo publica).

### Los 30 y los 60 de esta tabla NO son umbrales

Se congela para que nadie los lea como criterio:

> **Las columnas «n < 30» y «n < 60» son descriptivas, no normativas.** No
> existe ningún umbral de n en la NKB, ni de admisión ni de calidad. Esos dos
> números se usan aquí **solo para describir la distribución de los tamaños de
> celda** de un vistazo.
>
> Ninguna norma se admitió, se rechazó, se degradó ni se marcó por caer a un
> lado u otro de ellos.

`16` es explícito: *«la suficiencia es relativa al diseño, no absoluta»*, y
`13` incluye el tamaño muestral entre lo que **no** es criterio de admisión.

### Cómo se representa una celda pequeña

Cuatro cosas, todas obligatorias y ninguna opcional:

| Se conserva | Dónde |
|---|---|
| La norma completa | Su fila en la ficha |
| El **n exacto** de la celda | Columna `n` de la misma fila |
| La calidad asignada, con su dimensión | CN-29 y CN-30 |
| Las **consecuencias visibles** de la celda pequeña | Sección «Anomalías conservadas» |

La última es la que hace utilizable la información. Las fichas de Cúcuta no
dicen solo «n = 10»: describen qué produce ese n = 10 en los valores.

> «Mujeres de 60–69: P90 42,33 frente a P75 26,40, sobre 10 personas.»
> «Un percentil 95 estimado sobre 24 personas depende casi por completo del
> valor más alto de la muestra.»

**Ninguna celda se eliminó por parecer pequeña.** Las 24 normas de Cúcuta —ocho
de cuyas doce celdas por mano tienen menos de 30 personas— siguen en la base,
con su n, su calidad Baja y sus anomalías descritas.

### El caso opuesto: n que no consta

Las 156 normas brasileñas **no tienen n por celda porque la fuente no lo
publica**. Se registra como «no consta» y **no se estima ni se reparte**
proporcionalmente entre estratos, como `16` prohíbe expresamente.

Es la razón declarada de su D-02, y es un caso peor que el de Cúcuta: allí
sabemos que la celda es pequeña; aquí **no sabemos nada**.

| Situación | Cúcuta | Brasil |
|---|---|---|
| ¿Se conoce el n de la celda? | Sí, y es pequeño | **No** |
| ¿Puede el NIE advertirlo? | Sí, con el número | Solo que se desconoce |
| Calidad resultante | Baja | Moderada |

Que Brasil salga mejor valorada teniendo **menos** información sobre sus celdas
es consecuencia de que su muestreo es probabilístico y el de Cúcuta no. Las
dimensiones no se compensan entre sí ni se agregan en una puntuación (`16`).

---

## Parte IV · Distribución final de calidad

| Nivel | Normas | Fichas |
|---|---|---|
| **Alta** | **0** | — |
| Moderada | 332 | 13 |
| **Baja** | 24 | 2 |
| Muy baja | 0 | — |
| Insuficiente | — | *no es un nivel de norma admitida* |

**Ninguna norma alcanza calidad Alta en cinco sprints.** El motivo, comprobado
ficha a ficha, es siempre uno de estos tres y nunca falta al menos uno:

1. el muestreo no permite sostener representatividad de la población declarada;
2. el N por celda no consta;
3. los percentiles son proyecciones de un modelo, no frecuencias observadas.

*Alta* exige las tres condiciones a la vez, más que el estudio fuera diseñado
como normativo. **No es un juicio sobre la literatura de prensión manual: es el
nivel de exigencia funcionando.**

Este dato debe llegar al NIE tal cual. Un motor que presente cualquier norma de
esta base como si fuera un patrón de referencia consolidado estaría
sobreafirmando.
