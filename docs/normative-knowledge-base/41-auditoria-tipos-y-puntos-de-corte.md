---
modulo: 41
titulo: Auditoría de tipos de norma y puntos de corte
estado: v1.0
sprint: NKB-3.5
---

# 41 · Tipos y puntos de corte

---

## Parte I · Tipos presentes

`15` congela siete tipos. **Dos están en uso.**

| Tipo | Qué es | Fichas | Normas |
|---|---|---|---|
| **TN-1** | Percentiles | 13 | **308** |
| **TN-2** | Media y dispersión | 2 | **48** |
| TN-3 | Puntuación z | 0 | 0 |
| TN-4 | Puntuación T | 0 | 0 |
| **TN-5** | **Punto de corte** | **0** | **0** |
| TN-6 | Rango de referencia | 0 | 0 |
| TN-7 | Clasificación | **0** | **0** |

Cada ficha declara **exactamente un tipo**, y ninguno se derivó de otro.

### Las dos fichas TN-2 y por qué existen

`HGS-DE-TN2` y `HGS-CO-UNI-TN2` publican media y desviación típica. Ambas están
separadas de una ficha TN-1 de la misma fuente, porque **son normas distintas**:

| | Comparten | Difieren |
|---|---|---|
| `HGS-DE-TN2` ↔ `HGS-DE-TN1` | Fuente, tabla, población, método | Tipo: media+DT frente a P50 |
| `HGS-CO-UNI-TN2` ↔ `HGS-CO-UNI-TN1` | Fuente, **la misma Tabla II**, población, método | Tipo: media+DT frente a 7 percentiles |

El segundo par comparte **las cuatro coordenadas de identidad** y no está en
conflicto: no afirman lo mismo sobre lo mismo. Una dice dónde cae el P25; la
otra, cuál es la media (`40`).

---

## Parte II · Los seis usos indebidos, comprobados uno a uno

| # | Uso indebido | Resultado | Cómo se comprobó |
|---|---|---|---|
| 1 | P50 convertido en «normal» | **0** | CN-12 de las 15 fichas · `HGS-DE-TN1` lo prohíbe expresamente |
| 2 | P5/P95 convertidos en puntos de corte | **0** | Ninguna ficha declara TN-5 |
| 3 | Media ± DT convertida en categorías | **0** | Las 2 fichas TN-2 lo prohíben expresamente |
| 4 | Percentiles usados como diagnóstico | **0** | Las 15 fichas cierran con «no dicen si un valor es adecuado» o equivalente |
| 5 | Lenguaje clínico no sustentado | **0** | Ver abajo |
| 6 | Categorías inventadas por la NKB | **0** | 13 fichas: «la fuente no define ninguna categoría» |

### Sobre el punto 5

La búsqueda de vocabulario clínico —*diagnóstico*, *patológico*, *riesgo*,
*sarcopenia*, *umbral*, *punto de corte*— devuelve **tres coincidencias, y las
tres son legítimas**:

| Dónde | Qué dice | Por qué es correcto |
|---|---|---|
| `HGS-CO-UNI-TN1` · CN-14 | «diagnóstico médico de enfermedad sistémica mayor…» | Transcribe los **criterios de exclusión de la fuente**. Describe a quién no se midió, no interpreta a nadie |
| `HGS-CO-UNI-TN2` · CN-14 | Ídem | Ídem |
| `HGS-CO-UNI-TN2` · límites | «Media menos una desviación típica **no** es un punto de corte» | Es una prohibición explícita |

**Ninguna ficha afirma nada sobre la salud de nadie.**

### Las dos afirmaciones que las fichas TN-2 sí hacen

Merecen registro porque cierran la puerta a la derivación desde dos sitios
distintos:

| Ficha | Motivo por el que no pueden derivarse percentiles |
|---|---|
| `HGS-DE-TN2` | **La forma de la distribución NO CONSTA.** Prohibido por defecto (DV-03, caso CR-16) |
| `HGS-CO-UNI-TN2` | **La fuente declara que la distribución NO es normal.** Prohibido por evidencia expresa |

Es la misma prohibición por dos vías opuestas: en un caso falta información, en
el otro sobra. Ninguna de las dos autoriza a derivar.

---

## Parte III · Puntos de corte

> ## No existe actualmente punto de corte admisible en la NKB para esta variable.
>
> **Cero normas TN-5 en cinco sprints.**

No es un descuido ni una deuda de búsqueda: es el resultado de aplicar `15`,
que exige que un punto de corte tenga **criterio, población, método, desenlace o
fundamento correspondiente, valor e interpretación autorizada**, todo declarado
por la fuente.

### Los cuatro candidatos que se examinaron y no entraron

| Caso | Fuente | Qué era | Por qué no entró |
|---|---|---|---|
| **RN-02** | `steiber_hgs_alemania_2016` | Columna **literalmente titulada «risk threshold»** | Su definición publicada es **media menos 1 DT**: origen distributivo, no de desenlace |
| **RN-03** | Ídem | Dos categorías nombradas | Límites enunciados de dos formas distintas, sin correspondencia unívoca |
| **RN-04** | `bustos_viviescas_hgs_cucuta_2019` | Seis categorías de *deficiente* a *excelente* | Definición puramente distributiva, con cortes **importados de una propuesta para niños de 6 a 12 años de Arequipa, Perú** |
| **Pre-registrado** | `ramirez_velez_…_2021` | Umbral a **2 DT** bajo la media máxima del ciclo vital | Origen distributivo. Registrado **antes** de tener la fuente delante, para que su utilidad no condicione la decisión |

### El patrón

Los cuatro son **la misma operación**: tomar un estadístico de la distribución
—una desviación típica, un percentil— y bautizarlo como si describiera un
estado.

> **Una distribución dice dónde está alguien respecto a otros. Un punto de corte
> dice que a partir de cierto valor pasa algo.** La segunda afirmación necesita
> un estudio que haya seguido ese algo. Ninguna de las cuatro lo tiene.

Que una columna se titule «risk threshold», o que una tabla se titule
«categorías», no cambia su definición. **La etiqueta nunca es el criterio.**

### Consecuencia para el NIE

El NIE **no puede clasificar a nadie** con esta base. Puede situar un valor en
una distribución, con todas las advertencias del caso, y nada más.

Si alguna vez necesita decir «bajo», «adecuado» o «en riesgo», hará falta una
norma TN-5 o TN-7 admisible que **hoy no existe**, y que no se fabricará a
partir de los percentiles que sí existen.

---

## Parte IV · Nota sobre CN-11 y el estimador

`40` descubrió que el **método de estimación** determina el valor sin ser
coordenada de identidad. Se auditó CN-11 en las quince fichas:

| Estimador declarado | Fichas |
|---|---|
| **Regresión cuantílica** | `HGS-CO-TN1` |
| **LMS de Cole**, con software y versión | `HGS-CL-*`, `HGS-CO-UNI-TN1` |
| **Regresión de media y dispersión** | `HGS-BR-*` |
| Distribución empírica sobre los datos | `HGS-CO-CUC-*` |
| No aplica · media y DT observadas | `HGS-DE-TN2`, `HGS-CO-UNI-TN2` |
| **No consta la forma de la distribución** | `HGS-DE-TN2` |

**15/15 declaran cómo se obtuvo el valor.** Ninguna ficha presenta un percentil
sin decir si es observado, suavizado o proyectado — que es exactamente la
información que el par ENSIN demostró indispensable.
