---
modulo: 15
titulo: Tipos de norma
estado: congelado
sprint: NKB-2.0
---

# 15 · Tipos de norma

Las siete formas congeladas en `02`, ahora con lo que cada una **exige**,
**permite** y **prohíbe**.

Una norma es de **un** tipo. Si una fuente publica percentiles y además una
clasificación, son **dos normas** con la misma identidad y distinto tipo, no una
con dos caras.

---

## TN-1 · Percentil

**Qué es.** La proporción de la población observada que queda por debajo de un
valor.

| | |
|---|---|
| **Exige** | Valores por percentil declarado · población · método · estrato · tamaño del estrato cuando conste |
| **Permite afirmar** | «En esta población, el X% presentó valores inferiores a V» |
| **NO permite** | Que V sea bueno, malo, suficiente o esperable |
| **Error que impide** | Convertir tramos de percentil en categorías de calidad |

> **P25, P50 y P75 no son «bajo», «normal» y «alto».** Son posiciones. Solo
> existe categoría si la fuente la definió explícitamente, y entonces es una
> norma de tipo TN-7 con sus propias condiciones.

## TN-2 · Media y dispersión

**Qué es.** El valor central de la distribución y su anchura.

| | |
|---|---|
| **Exige** | Media · medida de dispersión con su tipo declarado · población · método · estrato |
| **Permite afirmar** | «La media observada fue M con una dispersión D» |
| **NO permite** | Situar un valor en la distribución sin conocer su forma |
| **Error que impide** | Suponer normalidad para derivar posiciones (`21`) |

**La forma de la distribución es lo que decide si esta norma es utilizable.** Si
la fuente no la declara, se registra como limitación y la norma queda sin
autorizar derivaciones.

## TN-3 · Puntuación z

**Qué es.** Distancia a la media en unidades de dispersión.

| | |
|---|---|
| **Exige** | Los mismos elementos que TN-2, más la constancia de que la fuente publica en esta forma |
| **Permite afirmar** | «Este valor queda a Z unidades de dispersión de la media de esta población» |
| **NO permite** | Traducir Z a percentil sin que la fuente sostenga el supuesto distribucional |
| **Error que impide** | Tratar una puntuación tipificada como si fuera una posición percentil |

Si la fuente publica media y dispersión pero no puntuaciones, la norma es TN-2.
Convertirla es derivar (`21`).

## TN-4 · Puntuación T

**Qué es.** La anterior, reescalada a otra media y dispersión convencionales.

Mismas exigencias, permisos y prohibiciones que TN-3. Se distingue porque su
escala convencional debe constar: dos convenciones distintas producen números
distintos para el mismo dato.

## TN-5 · Punto de corte

**Qué es.** Un valor a partir del cual cambia la asociación con un desenlace.

| | |
|---|---|
| **Exige** | **Desenlace declarado** · diseño del estudio · población · seguimiento cuando aplique · rendimiento del corte cuando conste |
| **Permite afirmar** | «En esta población, por encima de V la asociación con el desenlace D fue la observada» |
| **NO permite** | Que el corte cause el desenlace, ni que aplique a un individuo |
| **Error que impide** | Presentar un percentil como umbral |

> **Un punto de corte sin desenlace declarado no es un punto de corte.** Es un
> percentil disfrazado, y se rechaza (CA-07).

Es el único tipo cuya fuente **no puede ser un estudio puramente descriptivo**:
requiere un diseño que siguiera un desenlace.

## TN-6 · Rango de referencia

**Qué es.** El intervalo que contiene una proporción convenida de una población
de referencia.

| | |
|---|---|
| **Exige** | Límites · proporción convenida · población de referencia · método |
| **Permite afirmar** | «El X% de esta población de referencia se situó entre A y B» |
| **NO permite** | Que quedar fuera signifique enfermedad o anormalidad |
| **Error que impide** | Llamarlo «rango normal» |

Por construcción, una proporción de la población de referencia queda fuera sin
que le ocurra nada. El nombre «rango de normalidad» es tan frecuente como
incorrecto.

## TN-7 · Clasificación

**Qué es.** Categorías con nombre que **la fuente** define sobre la variable.

| | |
|---|---|
| **Exige** | Etiquetas literales · límites de cada categoría · criterio con que la fuente las definió · población · método |
| **Permite afirmar** | «Según esta fuente, V corresponde a la categoría E, definida como…» |
| **NO permite** | Traducir la etiqueta, armonizarla con otra fuente ni ampliarla |
| **Error que impide** | Unificar vocabularios entre publicaciones |

Si la fuente publica categorías **sin decir cómo las definió**, la norma no es
admisible como TN-7: falta el criterio. Puede seguir siendo admisible como TN-1
si publica los percentiles subyacentes.

---

## Qué exige cada tipo, en una tabla

| | Población | Método | Estrato | Forma distrib. | Desenlace | Criterio de categoría |
|---|---|---|---|---|---|---|
| TN-1 Percentil | ✔ | ✔ | ✔ | — | — | — |
| TN-2 Media/disp. | ✔ | ✔ | ✔ | Cuando conste | — | — |
| TN-3 Z | ✔ | ✔ | ✔ | ✔ | — | — |
| TN-4 T | ✔ | ✔ | ✔ | ✔ | — | — |
| TN-5 Punto de corte | ✔ | ✔ | ✔ | — | **✔** | — |
| TN-6 Rango referencia | ✔ | ✔ | ✔ | — | — | — |
| TN-7 Clasificación | ✔ | ✔ | ✔ | — | — | **✔** |

## Prohibiciones comunes a los siete

1. **Ninguno autoriza a calificar a una persona.** Describen poblaciones.
2. **Ninguno autoriza a convertirse en otro** sin pasar por `21`.
3. **Ninguno permite mezclarse con otra fuente** para «completar» tramos.
4. **Ninguno admite interpolación** entre sus valores publicados.
5. **Ninguno afirma causalidad**, incluido TN-5.

## Cambio de tipo

Una norma **no cambia de tipo**. Si de una fuente TN-2 se obtiene una posición
tipificada, el resultado es un **dato derivado** (`21`) que conserva su origen y
se marca como tal; la norma almacenada sigue siendo TN-2.

Permitir el cambio de tipo borraría la diferencia entre lo que una fuente
publicó y lo que alguien calculó después.
