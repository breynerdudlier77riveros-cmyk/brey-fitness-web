---
modulo: 06
titulo: Sensibilidad al cambio
estado: v1.0
---

# 06 · Sensibilidad al cambio

Si una prueba detecta un cambio **real** en el atleta y lo distingue del error de medida.

Es la propiedad que el PAS necesitará en el Sprint PAS-4 para comparar dos evaluaciones. Y es
**la peor documentada de las tres**.

## El problema

Para afirmar que un atleta ha cambiado hacen falta dos cosas:

1. El **error de medida** de la prueba (SEM), que sale de la fiabilidad.
2. El **cambio mínimo detectable** (MDC), que se deriva del anterior.

Sin ambas, la comparación entre dos evaluaciones es un ejercicio de fe: no puede saberse si la
diferencia observada es un cambio o es ruido.

## Estado real en v1.0

| Prueba | Sensibilidad | Fuente |
|---|---|---|
| P-05 · RSI | Responde al entrenamiento pliométrico | `rsi_metaanalisis_2021` |
| P-08 · Y-Balance | Responde a programas de entrenamiento (literatura SEBT) | `plisky_ybt_2021` |
| P-01, P-02, P-03, P-04, P-06, P-07, P-09, P-10, P-11 | **Evidencia insuficiente** | — |

**Ninguna fuente verificada aporta un valor de MDC o de SEM utilizable.** Dos pruebas documentan
que *responden* al entrenamiento, que es una afirmación de grupo y no un umbral individual.

## Responder al entrenamiento no es sensibilidad

La distinción decide qué puede afirmarse:

| Afirmación | Qué respalda |
|---|---|
| «El grupo entrenado mejoró más que el control» | Diseño experimental. Es lo que documentan las fuentes |
| «Este atleta ha mejorado» | Exige MDC. **No hay fuente que lo respalde** |

Un cambio de grupo estadísticamente significativo no dice nada sobre si el cambio de **un** atleta
supera el error de su propia medición.

## Consecuencia para el Sprint PAS-4

El Performance Interpretation Engine tendrá que comparar perfiles. Con la evidencia actual **no
puede declarar que un atleta ha cambiado en ninguna capacidad**.

Sus opciones honestas son dos:

1. Describir la diferencia numérica **sin calificarla** de mejora, empeoramiento ni estabilidad.
2. Declarar la limitación: no puede distinguirse el cambio del error de medida.

La tercera opción —fijar un umbral por criterio propio— está prohibida por la misma regla que
gobierna toda esta base.

**Precedente disponible:** el BCS resolvió este problema para composición corporal con umbrales de
cambio insignificante por variable. Ese criterio **no se traslada**: son otras variables, otras
pruebas y otra literatura. Lo trasladable es el enfoque, no los números.

## Deuda

Registrada como **D-03** en `12-roadmap.md`: obtener SEM y MDC por prueba y población es
requisito previo al Sprint PAS-4. Sin ello, ese sprint solo podrá construir la maquinaria de
comparación, no autorizar sus conclusiones.
