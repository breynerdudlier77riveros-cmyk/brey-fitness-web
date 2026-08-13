---
modulo: 29
titulo: Completación de evidencia y validación de conflictos
estado: v1.0
sprint: NKB-3.1
---

# 29 · Fase A · Completación y conflictos

## A1 · Las cinco fuentes pendientes

| Fuente | Antes | Ahora | Resultado |
|---|---|---|---|
| Brasil, personas mayores | E-1 | **E-5** | **Admitida** · `reichenheim_hgs_brasil_2021` |
| Normas internacionales | E-1 | **E-4** | **No admitida** · CA-05 |
| Reino Unido | E-1 | E-1 | Deuda de búsqueda |
| Estados Unidos | E-1 | E-1 | Deuda de acceso |
| Adolescentes | E-1 | E-1 | Deuda de búsqueda |

Se resolvieron dos de cinco. Las tres restantes **no se degradan a rechazo**:
siguen sin verificarse, que es una afirmación sobre nuestro trabajo y no sobre
ellas.

### Clasificación de las tres pendientes

| Fuente | Tipo de deuda | Por qué |
|---|---|---|
| Reino Unido | **Búsqueda** | No se ha localizado la publicación primaria concreta |
| Estados Unidos | **Acceso** | Publicación de acceso restringido: las tablas no son legibles |
| Adolescentes | **Búsqueda** | Localizada en repositorio abierto, no abierta en este sprint |

> La de Estados Unidos es deuda de **acceso**, no de evidencia. Puede ser una
> fuente excelente; simplemente no podemos leerla. Registrarla como «fuente
> insuficiente» sería convertir una limitación nuestra en una afirmación
> científica sobre ella.

---

## A2 · Segunda fuente y prueba del modelo

### Admitida · Brasil

`reichenheim_hgs_brasil_2021` alcanzó **E-5**. Se leyó su tabla suplementaria
S1 completa, extraída de su fichero original. Ficha:
`fichas/HGS-BR-TN1-percentiles.md`, 26 normas con 13 percentiles cada una.

### No admitida · normas internacionales

`tomkinson_normas_internacionales_2024` es el caso más instructivo del sprint.

**Qué es.** Una revisión sistemática que agrega 100 estudios observacionales
sobre 2,4 millones de personas y publica percentiles del 5 al 95 por sexo y
edad. Como metaanálisis, es **primaria para su propio agregado** (`20`), de modo
que la regla de fuente secundaria no la detiene.

**Por qué no entra.** Falla **CA-05 · método identificable**.

Los estudios incluidos usaron dinamómetros hidráulicos, electrónicos y
mecánicos, con posiciones corporales, posiciones de codo y formas de reporte
distintas. Para agregarlos, la revisión aplicó **factores de ajuste de entre el
1% y el 17%** con los que llevó todas las mediciones a un protocolo de
referencia.

El resultado es una norma cuyo método **no es un procedimiento de medición**
sino una armonización posterior. No puede determinarse qué medición concreta de
una persona correspondería a esta norma sin conocer y aplicar el factor de
ajuste de su propio protocolo — y ese emparejamiento la norma no lo aporta.

> **Lo que esta decisión NO afirma.** No dice que la revisión sea mala, ni que
> sus percentiles sean incorrectos, ni que su método sea inadecuado para su
> propósito. Dice que **la NKB no puede almacenarla como norma aplicable**
> porque su identidad de método no es reproducible (`18`).

Es exactamente el caso que NKB-ADR-03 anticipaba al hacer del método una
coordenada de identidad. Que la fuente sea grande, reciente y de excelente
factura no cambia el criterio (I-23).

---

## A3–A4 · Conflictos

**No existe ningún conflicto.** Resultado válido y declarado (`22`).

Para que hubiera conflicto, dos normas tendrían que compartir **las cuatro**
coordenadas de identidad. Comparación entre las dos fuentes admitidas:

| Coordenada | Alemania | Brasil | ¿Coincide? |
|---|---|---|---|
| **Variable** | Fuerza máxima de prensión | Fuerza máxima de prensión | Nominalmente sí |
| **Definición operacional** | Máximo de dos intentos por mano, mayor de ambas | Media de la 2.ª y 3.ª de tres repeticiones | **No** |
| **Método** | Smedley S, mecánico | JAMAR hidráulico J00105 | **No** |
| **Unidad** | kg | kgf | **No** |
| **Población** | Alemania, 17–90, panel socioeconómico | Brasil, 65–90, envejecimiento satisfactorio | **No** |
| **Estrato** | Sexo × 14 grupos de edad | Sexo × estatura × edad año a año | **No** |
| **Tipo** | TN-2 y TN-1 (solo P50) | TN-1 (13 percentiles) | Parcial |

Difieren en **cinco de las coordenadas y sus derivadas**. No es conflicto: son
normas distintas que coexisten.

### Un hallazgo sobre la propia arquitectura

Este sprint sugiere que **el conflicto normativo es estructuralmente raro**.

Para que dos publicaciones independientes compartan variable, método, población
y estrato tendrían que haber medido lo mismo, con el mismo aparato y protocolo,
en la misma población y con la misma estratificación. Eso ocurre casi solo entre
reanálisis del mismo conjunto de datos o entre ediciones sucesivas de un mismo
estudio.

**No es un defecto del modelo: es su consecuencia buscada.** Una identidad
estricta hace que la mayoría de las diferencias entre estudios se clasifiquen
como lo que son —normas distintas— en lugar de como contradicciones. El
mecanismo de conflicto queda para el caso genuino, que será infrecuente.

Consecuencia práctica: **el modelo de conflictos sigue sin ejercitarse con datos
reales**, y probablemente siga así durante varios dominios. Se mantiene como
deuda estructural, no como fallo.

---

## A5 · Diferenciación legítima

El caso que sí quedó demostrado. Las dos fuentes producen valores muy distintos
para edades solapadas, y **eso no es un conflicto**:

| Qué cambia | Efecto |
|---|---|
| **Método** | Smedley mecánico frente a JAMAR hidráulico. Relación por defecto **EQ-3 · distintos** (`18`). Sin evidencia publicada de equivalencia, no se comparan |
| **Definición operacional** | Máximo de dos intentos frente a media de la 2.ª y 3.ª de tres. Son magnitudes distintas aunque compartan nombre |
| **Unidad** | kg frente a kgf |
| **Población** | Nacionalidad, rango etario y criterios de inclusión distintos |
| **Estratificación** | Grupos de edad frente a edad año a año, y estratos de estatura |
| **Tipo** | TN-2 frente a TN-1 |

La NKB conserva ambas, sin relacionarlas y sin sugerir cuál usar. Elegir sería
aplicar, y aplicar es del NIE (I-09).

---

## A6 · Auditoría de RN-01, RN-02 y RN-03

Revisadas contra la pregunta única que permite cambiarlas: **¿ha aparecido
evidencia primaria que altere objetivamente la conclusión?**

| Caso | Estado | Revisión |
|---|---|---|
| **RN-01** · medias por edad × altura sin dispersión | **Sigue rechazada** | No ha aparecido dispersión para ese estrato. La que existe es por grupo de edad, y aplicarla a celdas de edad × altura seguiría siendo una derivación no autorizada |
| **RN-02** · columna «risk threshold» | **Sigue rechazada** | Su definición publicada continúa siendo *media menos 1 DT*: origen distributivo. No ha aparecido nada que la convierta en umbral derivado de desenlace |
| **RN-03** · categorías con límites ambiguos | **Sigue rechazada** | No se ha localizado una formulación unívoca de sus límites |

Ninguna se ha reabierto. **No se revisaron buscando una razón para admitirlas**,
que es la forma en que estos rechazos suelen deshacerse.

---

## A7 · Derivaciones

**Ninguna.** Se comprueba caso por caso:

| Derivación prohibida | ¿Ocurrió? |
|---|---|
| P50 convertido en clasificación | No |
| Percentiles derivados de media y DT | No |
| Puntos de corte derivados | No |
| Interpolación entre estratos | No |
| Estimación de estratos no publicados | No |
| Categorías ambiguas convertidas en límites | No |
| Fuentes combinadas para crear una norma | No |

Sobre los percentiles brasileños: **son proyecciones del modelo de la fuente**,
publicadas por ella junto con sus ecuaciones. Desde la NKB son **OR-1 ·
explícitos**, porque la taxonomía de origen distingue quién derivó, no si hubo
derivación. Nosotros no calculamos nada.
