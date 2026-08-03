---
modulo: 04
titulo: Fiabilidad
estado: v1.0
---

# 04 · Fiabilidad

Cuán reproducible es una medida. **No dice si mide lo que se le atribuye** — eso es validez
(`05`), y es donde falla casi todo.

Una prueba puede tener fiabilidad excelente y validez nula. El caso de manual: una báscula
descalibrada repite el mismo peso equivocado con precisión perfecta.

## Índices

| Índice | Qué expresa | Lectura habitual |
|---|---|---|
| **ICC** | Coeficiente de correlación intraclase: consistencia relativa | < 0,50 pobre · 0,50-0,75 moderada · 0,75-0,90 buena · > 0,90 excelente |
| **CV** | Coeficiente de variación: error relativo | ≤ 5% habitualmente aceptable en pruebas de fuerza |
| **SEM** | Error típico de medida, en unidades de la prueba | Base del cambio mínimo detectable |
| **MDC** | Cambio mínimo detectable | Umbral por debajo del cual un cambio no se distingue del error |

Los cortes del ICC son **convenciones de interpretación**, no umbrales científicos. Se registran
porque las fuentes los usan, no porque tengan un fundamento propio.

## Lo verificado

| Prueba | ICC | CV | Fuente |
|---|---|---|---|
| **P-01 · 1RM** | 0,64-0,99 · mediana **0,97** · 92% ≥ 0,90 | 0,5-12,1% · mediana **4,2%** | `grgic_1rm_2020` |
| **P-02 · IMTP** | 0,73-0,99 · mediana **0,96** · 78% ≥ 0,90 | 0,7-11,1% · mediana **4,9%** | `grgic_imtp_2022` |
| **P-08 · Y-Balance** | intraevaluador **0,85-0,91** | no reportado | `plisky_ybt_2021` |
| **P-05 · RSI** | ≥ 0,8 con familiarización | ≤ 10% | `rsi_metaanalisis_2021` |
| **P-04 · CMJ** | Alta y replicada, sin revisión única verificada | — | *deuda D-02* |
| **P-03, P-06, P-07, P-09, P-10, P-11** | **No verificada** | — | — |

**Cinco de once pruebas tienen fiabilidad verificada con fuente.** Para el resto, la PKB no
afirma nada.

## Lo que la fiabilidad alta NO autoriza

El error más caro de esta sección es tratarla como aval. Un ICC de 0,97 en el 1RM significa que la
prueba **se repite bien**. No significa:

- que mida «fuerza máxima» como dimensión general;
- que un cambio en el resultado sea un cambio en la capacidad;
- que dos ejecuciones en sitios distintos sean comparables;
- que la prueba sirva para el propósito que se le quiera dar.

Buena parte de la literatura de evaluación física se detiene aquí, y buena parte de los productos
del sector presentan la fiabilidad como si fuese validez. Es la asimetría descrita en
`00-introduccion.md` y la razón de que la matriz quede tan vacía.

## Familiarización

Aparece en varias fuentes como factor determinante:

- **P-05 · RSI:** la fiabilidad exige dominio técnico y familiarización previa.
- **P-01 · 1RM:** los ICC son altos **con y sin** sesiones de familiarización [`grgic_1rm_2020`].
  Es un hallazgo específico y no debe generalizarse a otras pruebas.
- **P-08 · Y-Balance:** el aprendizaje de la tarea es un factor de confusión conocido.

Consecuencia para el PAS: la familiarización es una **condición de registro** de la prueba
(EL-05), no un detalle del protocolo.

## Implicación para la vigencia

El PAS exige declarar una vigencia por prueba (EL-02). **La PKB no puede aportar ni un solo valor
de vigencia**: ninguna fuente verificada documenta cuánto tiempo un resultado sigue representando
al atleta.

Es un vacío científico real, no una omisión de este sprint. Está registrado como deuda D-04 en
`12-roadmap.md`. Hasta que se resuelva, el catálogo del PAE debe declarar `vigenciaDias: null`,
y el motor emitirá la limitación `vigencia_no_declarada` — que es la conducta correcta.
