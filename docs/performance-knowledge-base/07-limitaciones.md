---
modulo: 07
titulo: Limitaciones
estado: v1.0
---

# 07 · Limitaciones

Qué limita cada medición. Una limitación **no invalida** una prueba: acota lo que puede afirmarse
a partir de ella.

## Limitaciones transversales

Afectan a todas las pruebas de la base.

**L-A · La prueba es una muestra, no la capacidad.** Ninguna prueba representa una capacidad
entera. Un 1RM de sentadilla es una observación de la fuerza máxima en un patrón, un rango
articular y un día concretos.

**L-B · El resultado es del día.** Sueño, alimentación, hidratación, hora, temperatura, carga de
entrenamiento reciente y motivación intervienen. Ninguna fuente verificada cuantifica su
contribución.

**L-C · El evaluador forma parte del instrumento.** En toda prueba con juicio del observador
—FMS de forma señalada, pero también la validación de un intento de 1RM—, el resultado depende de
quién evalúa.

**L-D · El instrumento no es intercambiable.** Dinamómetros, plataformas, fotocélulas y
aplicaciones producen números distintos sobre el mismo gesto. El CMJ lo ilustra: tiempo de vuelo
e impulso-momento no dan lo mismo.

**L-E · El aprendizaje contamina la repetición.** Repetir una prueba mejora el resultado sin que
cambie la capacidad. Es especialmente marcado en Y-Balance y en tareas coordinativas.

**L-F · No hay vigencia documentada.** Ninguna fuente dice cuánto tiempo un resultado sigue
representando al atleta (`04`, deuda D-04).

## Limitaciones por prueba

| Prueba | Limitación principal | Consecuencia práctica |
|---|---|---|
| **P-01 · 1RM** | Específica del ejercicio | No comparar entre ejercicios ni extrapolar a otros patrones |
| **P-02 · IMTP** | Específica del ángulo articular | El resultado vale para esa posición, no para el recorrido |
| **P-03 · Agarre** | Edad y sexo dominan la varianza | Sin estratificar, se comparan edades y sexos |
| **P-04 · CMJ** | El método de cálculo cambia el número | Dos sistemas no son intercambiables sin comprobarlo |
| **P-05 · RSI** | El índice oculta sus componentes | Informar siempre altura y tiempo de contacto |
| **P-06 · Sit-and-reach** | Proporciones corporales | Brazos largos alcanzan más sin más extensibilidad |
| **P-07 · 20-m shuttle** | Es una estimación mediada por ecuación | Declarar siempre la ecuación empleada |
| **P-08 · Y-Balance** | Longitud de pierna y aprendizaje | Normalizar; desconfiar de la segunda medición |
| **P-09 · FMS** | Depende del evaluador; validez no establecida | No usar como criterio de decisión |
| **P-10 · Cambio de dirección** | Contiene mucha carrera lineal | El tiempo total no aísla el giro |
| **P-11 · Esprint** | Propiedades no verificadas en v1.0 | Registrar el dato, no interpretarlo |

## Variables de confusión

Las que alteran el resultado sin que cambie la capacidad evaluada:

| Confusión | Afecta a | Por qué importa |
|---|---|---|
| Aprendizaje técnico | P-01, P-02, P-05, P-08, P-10 | Las primeras mejoras pueden ser habilidad |
| Motivación y esfuerzo voluntario | P-01, P-07, P-11 | Son pruebas máximas: el resultado depende de cuánto se quiere |
| Proporciones antropométricas | P-06, P-08 | Explican varianza ajena a la capacidad |
| Instrumentación | P-04, P-10, P-11 | Cambia la escala del resultado |
| Experiencia del evaluador | P-09, P-01 | Cambia el criterio de validación |
| Edad y sexo | P-03 y en general | Dominan la varianza en muchas medidas |

## Errores frecuentes

Recogidos de las advertencias explícitas de las fuentes:

1. **Aplicar puntos de corte generales** al Y-Balance. La fuente lo desaconseja de forma expresa
   [`plisky_ybt_2021`].
2. **Informar el RSI sin sus componentes.** Igual [`rsi_metaanalisis_2021`].
3. **Usar el FMS como predictor de lesión.** Tres revisiones independientes en contra.
4. **Leer el sit-and-reach como movilidad lumbar.** Validez baja documentada.
5. **Llamar agilidad al cambio de dirección.** Constructos distintos por definición.
6. **Comparar VO2máx estimados con ecuaciones distintas.**
7. **Tratar la fiabilidad alta como aval de validez.** El error de fondo de todo el sector.

## Cómo se traducen al PAS

| Limitación PKB | Mecanismo del PAS |
|---|---|
| Población no estudiada | La correspondencia no se aplica fuera de su población (`03`) |
| Confusión no controlada | Condición de registro obligatoria (EL-05) |
| Sin vigencia documentada | `vigenciaDias: null` → limitación `vigencia_no_declarada` |
| Sin sensibilidad documentada | El Sprint PAS-4 no puede declarar cambio (`06`) |
| Validez de constructo insuficiente | La correspondencia **no entra** en el catálogo |

La última fila es la que gobierna la matriz: no basta con que una prueba se relacione con una
capacidad. Hay que poder citar quién lo estudió, en quién y cómo.
