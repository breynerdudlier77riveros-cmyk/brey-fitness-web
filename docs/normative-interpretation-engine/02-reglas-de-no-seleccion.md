---
modulo: 02
titulo: Reglas de no selección y propagación
sprint: NIE-1.3
---

# 02 · No selección

## La regla

> Si dos o más normas satisfacen las dimensiones requeridas y **no existe una
> regla científica externa que establezca prioridad**, el motor las devuelve
> todas.

No hay excepción, y no hay una vía discreta para introducirla: el motor no
contiene ningún `.sort()` sobre candidatas, y hay un test que lo comprueba
sobre el código fuente.

## Las nueve reducciones prohibidas

| Reducción | Por qué no |
|---|---|
| Quedarse con la primera | Es el orden de la NKB, no un mérito |
| Quedarse con la última | Ídem |
| La más reciente | La recencia no resuelve nada (`22`) |
| La de mayor N | No hay ponderación por tamaño muestral |
| La de mayor calidad | Calidad no es prioridad de uso |
| Usar el P50 por defecto | Elegir un percentil ya es interpretar |
| Promediar normas | Crearía un valor que nadie publicó |
| Fusionarlas | Ídem |
| Generar una «norma consolidada» | Ídem |

`conjunto.test.ts` incluye un test parametrizado que falla si el conjunto
devuelto equivale a cualquiera de estas reducciones.

---

## Los siete conjuntos que el motor distingue

| Situación | Cómo se representa |
|---|---|
| Norma única aplicable | 1 candidata `APLICABLE` |
| Múltiples aplicables | N candidatas + advertencia de que no elige |
| Aplicable pero cuestionada | `APLICABLE_CON_RESERVAS` + `estado_cuestionado` |
| Aplicable con calidad baja | `APLICABLE_CON_RESERVAS` + `calidad_baja` |
| Varias con estados distintos | Todas, cada una con el suyo |
| Ausencia de norma admisible | `SIN_NORMA_ADMISIBLE` |
| Compatible pero indeterminable | `NO_DETERMINABLE` + `camposFaltantes` |

---

## Propagación de estados

Solo se usan los estados que la NKB tiene realmente en uso. **No se inventan
ES-3, ES-4 ni ES-5.**

| Estado NKB | Efecto en el motor |
|---|---|
| **ES-1 · Activa** | Ninguno |
| **ES-2 · Cuestionada** | `APLICABLE_CON_RESERVAS` + advertencia que viaja con la candidata |

> **ES-2 nunca se convierte en NO_APLICABLE.** La objeción registrada por la
> NKB es una razón para advertir, no para descartar.

Las 29 normas en ES-2 —24 de la ficha colombiana de escolares y 5 del estrato
brasileño de varones de 1,60 a 1,70 m— siguen siendo candidatas.

---

## Propagación de calidad

**La calidad no selecciona.** Es un eje independiente de la aplicabilidad:

| | Aplicable | No aplicable |
|---|---|---|
| Calidad Moderada | `HGS-CO-UNI-*` para un universitario colombiano | Las brasileñas y alemanas para ese mismo sujeto |
| **Calidad Baja** | **`HGS-CO-CUC-*` para un adulto de 45 años** | — |

El caso de Cúcuta es el que fija la doctrina: existen normas de calidad
Moderada en la base, y **eso no autoriza a eliminar Cúcuta** si sus dimensiones
son compatibles. Sería sustituir un dato débil por ninguno, sin declararlo.

No existe puntuación compuesta. Las reservas son una lista de motivos, no un
número.

---

## Unidades

kg, kgf y lbf **no son equivalentes** y no se convierten. Un desajuste produce
`UNIT_MISMATCH` y **bloquea la aplicabilidad**.

No se aproxima, no se normaliza y no se redondea para forzar coincidencia. La
capa de conversión pertenece a otro sprint y no existe.

---

## EQ-3

Todos los pares de instrumentos de la NKB están en **EQ-3 · distintos**. El
motor impide que una norma se aplique por parecido:

| No basta con que… | Ejemplo real |
|---|---|
| ambos sean dinamómetros | Camry ≠ Takei |
| compartan marca | **Takei TKK 5101 ≠ Takei T-18 SMEDLY III** |
| compartan marca | **JAMAR PC-5030 J1 ≠ JAMAR J00105** |
| tengan nombres similares | **Smedley S ≠ TKK SMEDLY III** |
| midan la misma variable | Todos miden prensión |
| usen la misma unidad | Varios publican en kg |

Hay un test por cada colisión conocida, más uno que comprueba el caso más
tentador: misma variable, misma unidad, mismo país, misma posición… y **aun así
no aplicable**, porque el instrumento difiere.

---

## Conflictos

| El motor | |
|---|---|
| Propaga el conflicto que la NKB declara | ✅ |
| Descubre conflictos comparando valores | ❌ |
| Los resuelve | ❌ |

> **Que dos normas publiquen valores distintos NO es un conflicto.** Suele
> deberse a población, método, estrato o tipo distintos, que es lo habitual.

`describirDiferenciaDeValores` devuelve una descripción y nunca un veredicto:
si las unidades difieren dice que no son comparables; si los tipos difieren
dice que no se contraponen; y si la NKB declara conflicto, lo señala sin
resolverlo.

### El caso ENSIN

`HGS-CO-TN1` está en ES-2 con `CONFLICTO_NO_DETERMINABLE` (`40`). El motor:

- la mantiene **visible y utilizable**;
- conserva ES-2, calidad Moderada y sus valores exactos;
- propaga la advertencia;
- **no escoge otra norma** para evitar el conflicto;
- **no promedia** nada;
- **no menciona** la fuente en discordia, ni para preferirla ni para
  descartarla: no está en la NKB y el motor no la conoce.

El `estadoGlobal` reporta `CONFLICTO_NO_DETERMINABLE` aunque la candidata sea
utilizable. Sin eso, un consumidor podría usarla sin ver que hay una objeción
registrada.
