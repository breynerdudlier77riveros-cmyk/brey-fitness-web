---
modulo: 08
titulo: Modelo de trazabilidad
estado: congelado
---

# 08 · Modelo de trazabilidad

Todo Estado de Capacidad debe poder responder, sin salir del sistema, cómo se llegó a él.

## Las cinco preguntas obligatorias

| Pregunta | Responde |
|---|---|
| ¿Qué pruebas lo generaron? | Los registros que contribuyeron |
| ¿Qué datos participaron? | Los valores concretos y sus condiciones de toma |
| ¿Qué se descartó y por qué? | Los registros excluidos, con su motivo |
| ¿Cuándo se calculó? | Momento de la derivación |
| ¿Qué versión del motor se usó? | Las tres coordenadas de versión (`07`) |

La tercera es la que distingue una traza real de un adorno. Registrar solo lo que se usó permite
justificar un estado, pero no permite **auditarlo**: sin saber qué se descartó, no puede
comprobarse si la exclusión fue correcta.

## Contenido de una Traza

```
Traza
├── Estado que justifica
├── Registros incluidos         → id, prueba, fecha, valor, condiciones
├── Registros excluidos         → id, prueba, fecha, MOTIVO de exclusión
├── Correspondencias aplicadas  → prueba→capacidad, con su referencia científica
├── Limitaciones aplicadas      → qué no pudo afirmarse
└── Coordenadas
    ├── momento del cálculo
    ├── versión de catálogo
    └── versión de motor
```

## Reglas congeladas

**TR-01 · Sin traza no hay estado.** Un Estado de Capacidad sin traza no se emite. No es un
estado incompleto: no es un estado.

**TR-02 · La traza se genera con el estado, nunca después.** Reconstruirla a posteriori produciría
una justificación plausible, no la real.

**TR-03 · Toda exclusión lleva motivo.** Un registro descartado sin motivo declarado es
indistinguible de un registro perdido.

**TR-04 · Toda correspondencia aplicada lleva su referencia.** Si el estado se apoya en que una
prueba informa de una capacidad, la traza debe poder citar de dónde procede esa afirmación.

**TR-05 · La traza es legible por una persona.** Su destinatario no es solo el software: un
profesional debe poder revisarla y discrepar. Una traza que solo un programa pueda leer no cumple
su función.

**TR-06 · La traza no interpreta.** Registra qué ocurrió durante la derivación. No explica por
qué el atleta está como está.

## Qué hace posible la trazabilidad

| Capacidad del sistema | Depende de |
|---|---|
| Auditar un perfil | TR-01, TR-03 |
| Reproducir un perfil antiguo | Coordenadas de versión |
| Advertir que dos perfiles no son comparables | Coordenadas de versión |
| Justificar una afirmación ante el atleta | TR-04, TR-05 |
| Descubrir que una regla de elegibilidad descarta demasiado | TR-03 |

El último caso es el que más justifica el coste de mantener la traza: sin registro de exclusiones,
una regla de elegibilidad mal calibrada vaciaría perfiles en silencio y nadie sabría por qué.
