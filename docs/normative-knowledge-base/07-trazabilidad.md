---
modulo: 07
titulo: Trazabilidad
estado: congelado
---

# 07 · Trazabilidad

Toda norma almacenada debe poder responder, sin salir de la base, de dónde sale.

## Las seis preguntas obligatorias

| Pregunta | Responde |
|---|---|
| ¿De qué publicación procede? | La referencia, con su localizador |
| ¿Sobre qué población? | Criterios de inclusión, no solo la etiqueta |
| ¿Medida cómo? | El método, con su instrumento y procedimiento |
| ¿Qué tipo de afirmación es? | El estadístico normativo |
| ¿Cuánto la respalda? | La calidad y las dimensiones que la degradaron |
| ¿Qué no permite afirmar? | Sus limitaciones |

La sexta es la que distingue una traza real de un adorno. Registrar solo lo que
la norma permite deja al consumidor deduciendo por su cuenta lo que no; y lo que
se deduce por cuenta propia acaba siendo lo que a cada uno le conviene.

## La cadena

```
Norma
 ├── Referencia ──> localizador verificable
 ├── Población ──> criterios de inclusión
 ├── Método ──> instrumento y procedimiento
 ├── Estadístico ──> forma de la afirmación
 ├── Calidad ──> nivel + dimensiones que la degradaron
 ├── Limitaciones ──> qué no puede afirmarse
 └── Traza de incorporación
     ├── quién la incorporó
     ├── cuándo
     ├── versión de criterios aplicada
     └── estado y motivo, si fue retirada
```

## Reglas congeladas

**TR-01 · Sin traza no hay norma.** Una norma sin traza no se almacena. No es
una norma incompleta: no es una norma.

**TR-02 · La traza se crea al incorporar, nunca después.** Reconstruirla a
posteriori produciría una justificación plausible, no la real.

**TR-03 · Toda omisión lleva motivo.** Un campo ausente se declara ausente y se
dice por qué. Un hueco silencioso es indistinguible de un descuido.

**TR-04 · Toda norma lleva su referencia.** Es el eslabón que permite llegar a
la fuente y discrepar de ella.

**TR-05 · La traza es legible por una persona.** Su destinatario no es solo el
software: un profesional debe poder revisarla. Una traza que solo un programa
pueda leer no cumple su función.

**TR-06 · La traza no interpreta.** Registra de dónde viene la norma. No explica
qué significa un valor ni por qué una población se distribuye así.

**TR-07 · La traza acompaña a la norma al publicarla.** No es un registro
interno de mantenimiento: viaja con el dato hasta quien lo use. Sin ella, el NIE
recibiría un número desnudo y no podría declarar sus limitaciones.

## Qué hace posible la trazabilidad

| Capacidad de la base | Depende de |
|---|---|
| Verificar una norma contra su fuente | TR-01, TR-04 |
| Auditar por qué una norma tiene la calidad que tiene | Calidad + dimensiones |
| Advertir que dos lecturas no son comparables | Versión de base (`06`) |
| Retirar una norma sabiendo qué se apoyaba en ella | Traza de incorporación |
| Descubrir que un criterio de admisión descarta demasiado | TR-03 |

El último caso es el que más justifica el coste de mantener la traza: sin
registro de las omisiones y los rechazos, un criterio mal calibrado vaciaría la
base en silencio y nadie sabría por qué.

## Trazabilidad de lo que NO entró

Se congela porque es la parte que siempre se olvida:

**Una fuente rechazada deja rastro.** Qué se evaluó, por qué no entró y cuándo.
Sin ese registro, dentro de seis meses alguien volverá a evaluar la misma
fuente, o peor: la incorporará sin saber que ya se descartó.

Aplica también a las variables sin norma admisible. Que para una variable no
haya norma es información útil, y solo lo es si consta que se buscó.
