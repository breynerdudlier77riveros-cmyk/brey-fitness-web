---
modulo: 07
titulo: Modelo temporal
estado: congelado
---

# 07 · Modelo temporal

Qué cambia, qué no cambia nunca, qué se versiona y qué se recalcula.

## Las tres líneas de tiempo

El PAS tiene tres relojes independientes, y confundirlos es el error más caro que puede cometerse
al implementarlo.

| Línea | Qué avanza | Ritmo |
|---|---|---|
| **Del atleta** | Registros y evaluaciones acumulados | Cuando se evalúa |
| **Del catálogo** | Definiciones de capacidad, prueba y correspondencias | Cuando cambia la evidencia |
| **Del motor** | Reglas de elegibilidad, derivación y consolidación | Cuando cambia la implementación |

Un Perfil Funcional es la intersección de las tres: **un conjunto de registros, leído con una
versión de catálogo, por una versión de motor**. Alterar cualquiera de las tres puede cambiar el
perfil sin que el atleta haya hecho nada.

Esa es la razón de que el perfil no sea almacenable como verdad, y de que la traza (`08`) deba
registrar las tres coordenadas.

## Qué NUNCA cambia

- El **valor** de un Registro de Prueba.
- La **fecha** de un registro y de una evaluación.
- El **tipo** de una evaluación, una vez cerrada.
- El **hecho** de que un registro existió, incluso anulado.
- La **identidad** de un atleta dentro del PAS.

Corregir cualquiera de estos datos se hace **anulando y creando uno nuevo**, nunca editando en
sitio. Es el mismo mecanismo que el BCS aplica a sus mediciones y responde al mismo principio:
preservar qué se registró y cuándo, no solo qué se cree ahora.

## Qué se versiona

| Elemento | Por qué |
|---|---|
| Definición de Capacidad | Su redacción puede afinarse sin que cambie la dimensión |
| Definición de Prueba | Su protocolo o su vigencia pueden revisarse |
| Correspondencia prueba→capacidad | Es donde entra la evidencia nueva |
| Reglas de elegibilidad | Cambian qué registros participan |
| Motor de derivación | Cambia cómo se compone un estado |

**Regla congelada:** una versión nueva **nunca reescribe** la anterior. Los registros tomados bajo
una versión de prueba siguen refiriéndose a esa versión. Todo perfil declara contra qué versiones
se calculó, y dos perfiles calculados con versiones distintas **no son directamente
comparables**: el sistema debe poder advertirlo en lugar de dejar que se comparen en silencio.

## Qué se recalcula

Todo lo derivado —Estados de Capacidad, Perfil Funcional, Trazas y Limitaciones— siempre, en cada
consulta.

**No existe el recálculo parcial.** Un perfil se deriva entero o no se deriva: recalcular una
capacidad dejando las demás congeladas produciría un perfil internamente inconsistente, con
partes leídas bajo criterios distintos.

## Antigüedad y vigencia

Dos conceptos distintos que conviene no fundir:

- La **antigüedad** de un registro es un hecho: días transcurridos.
- La **vigencia** es una decisión de catálogo: cuánto tiempo ese resultado sigue siendo elegible.

El PAS congela que la vigencia **existe y se declara por prueba**. No congela ningún valor:
cuánto dura la vigencia de cada familia es cuestión de evidencia, pendiente del Sprint 3.

> El PAS puede declarar que un resultado ha dejado de ser elegible. **No puede decir cuándo debe
> repetirse.** Son cosas distintas, y el sistema solo hace la primera — la segunda exigiría una
> periodicidad que ninguna fuente del ecosistema documenta.
