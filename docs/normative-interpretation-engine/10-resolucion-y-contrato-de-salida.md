---
modulo: 10
titulo: Resolución final y contrato de salida
sprint: NIE-1.8 + NIE-1.9
---

# 10 · Resolución final y contrato de salida

## Qué significa «resolver» aquí

> **Resolver = representar estructuralmente el conjunto de resultados**, de modo
> que el consumidor pueda navegarlo sin que nadie haya decidido por él.

Resolver **no** es reducir. La palabra invita a lo contrario —resolver suena a
zanjar— y por eso conviene fijarla. En este motor:

| Resolver **sí** es | Resolver **no** es |
|---|---|
| Repartir los resultados en vistas | Elegir una norma |
| Contar cuántos hay de cada clase | Puntuar |
| Nombrar las divergencias | Deshacerlas |
| Dejar la trazabilidad a mano | Sustituir el detalle por un resumen |

## La regla estructural: toda vista es una partición

Las listas de `salida.ts` se obtienen **filtrando el mismo array y conservando su
orden**. Su unión reconstruye el original entrada por entrada, y cada resultado
está en exactamente una parte. Hay tests para ambas mitades.

> **Filtrar no es elegir, precisamente porque no se pierde nadie.** En cuanto una
> vista dejara fuera a alguien sin dejar constancia, sería una selección con otro
> nombre.

De ahí que `noComparables` exista como lista de primera clase con **356 entradas
en el caso típico**, cada una con su motivo. Es un dato incómodo y es el correcto:
la alternativa —devolver solo lo utilizable— borraría la razón por la que el
resto no lo es.

---

## Resultado individual frente a resultado del conjunto

Son dos objetos distintos y no deben confundirse:

| | Resultado individual | Resultado del conjunto |
|---|---|---|
| Qué es | `ResultadoNormativo`, uno por candidata | `SalidaNIE` |
| Qué afirma | Qué produjo **esa** norma | Cómo se reparte el total |
| Estado | `comparacion.estado` | `estadoInterpretacion` |
| Puede clasificar | No | No |

El estado del conjunto **nunca se toma de un miembro**. Se deriva así:

```
sin comparables    →  SIN_NORMA_APLICABLE
todas coinciden    →  ese estado, por unanimidad
discrepan          →  ESTADOS_DIVERGENTES
```

En la unanimidad se lee el conjunto de estados distintos, que tiene un solo
miembro; tomarlo no elige nada, porque cualquier otro daría lo mismo.

---

## Divergencia

`ESTADOS_DIVERGENTES` aparece cuando hay más de una norma comparable y no dicen
lo mismo. **Es lo habitual**, no la excepción: un TN-1 y un TN-2 aplicables al
mismo caso divergen siempre, porque uno localiza y el otro calcula.

El campo `divergencia` lleva el **reparto completo** —qué estados se dieron y
qué normas produjeron cada uno—, no un estado dominante. Un test comprueba que
el reparto cubre todas las comparables y no repite ninguna.

> Que dos normas comparables digan cosas distintas es **información**. Un empate
> se resuelve; una divergencia se lee.

### Por qué no se resuelve

Resolverla exigiría un criterio, y todos los disponibles están prohibidos por
una razón u otra: la calidad no mide aplicabilidad, la recencia no mide validez,
el tamaño muestral no mide correspondencia, y el país ya es una coordenada de
identidad. **No hay ningún criterio legítimo disponible**, y fabricar uno sería
la decisión científica que este motor no tiene autoridad para tomar.

---

## Por qué no existe «mejor norma»

Porque «mejor» exige un fin, y el fin lo pone quien consulta, no la biblioteca.

Una norma de calidad Moderada medida con otro instrumento es peor que una Baja
medida con el mismo. Una norma con n grande de otra población es peor que una con
n pequeño de la propia. **La ordenación depende de la pregunta**, y la pregunta
vive en la aplicación.

Los tests lo fijan por comportamiento, no por promesa:

- **P2** · invertir el orden de las candidatas no cambia el conjunto de
  resultados ni el estado global;
- **P3** · degradar la calidad de todas las candidatas no cambia qué sale;
- **P4** · el país actúa como discrepancia de identidad, nunca como preferencia:
  las normas del país que no corresponde siguen presentes, marcadas.

Y por estructura: `pureza.test.ts` prohíbe `.sort(`, prohíbe indexar por `[0]`
cualquier lista de **normas**, y prohíbe que exista un campo llamado
`mejorNorma`, `normaElegida`, `resultadoFinal` o `resultadoPromedio`. Las tres
comprobaciones llevan **control positivo**: se verifica que la expresión regular
encuentra una infracción de muestra, porque una prohibición negativa no puede
validarse a sí misma (hallazgo H-02, `09`).

---

## Propagación de ES-2

Una norma cuestionada **se compara igual** y lo dice. `estadoEvidencia` es un eje
propio, no un descuento sobre otro:

| Campo | Qué lleva |
|---|---|
| `evidencia.activas` / `evidencia.cuestionadas` | El reparto completo, ambas listas |
| `distinciones.cuestionadas` | Solo las **utilizables** que además están en ES-2 |
| `resultado.advertencias` | Las de la ficha, literales |

La distinción entre las dos listas importa: una ES-2 que además no corresponde a
este caso ya está contada en `noAplicables`, y contarla otra vez como
«cuestionada utilizable» sugeriría que se descartó por estar cuestionada. Se
descartó por no corresponder.

**P7** comprueba sobre varios valores que `HGS-CO-M-15` nunca desaparece.

---

## Propagación de conflictos

Los conflictos los declara la NKB; el motor **no los descubre y no los resuelve**.
`conflictos` lleva una entrada por norma con conflicto, con sus advertencias
íntegras.

El caso ENSIN recorre el camino entero: `estadoResolucion` llega a la salida como
`CONFLICTO_NO_DETERMINABLE`, la norma es `APLICABLE_CON_RESERVAS`, produce una
comparación válida —30,7 kg coincide con su P50— y sale a la vez en
`interpretables`, en `cuestionadas` y en `conflictos`.

> Una comparación válida no cancela una objeción científica. Son ejes distintos,
> y la salida los muestra a la vez porque a la vez son ciertos.

**P8** lo comprueba sobre varios valores, incluida la advertencia literal.

---

## Relación con la conversión

`salida.ts` **no importa la capa de conversión**. Recibe ya resuelto lo que la
composición decidió sobre la unidad, y se limita a registrarlo — incluido lo que
**no** se hizo:

| Estado registrado | Significa |
|---|---|
| `CONVERSION_AUTORIZADA` | Se pidió y se aplicó. Con factor y representación |
| `CONVERSION_DISPONIBLE_NO_SOLICITADA` | Se podía y nadie lo pidió. **No es un fallo** |
| `CONVERSION_NO_AUTORIZADA` | Par declarado y prohibido (kg ↔ kgf) |
| `UNIT_MISMATCH` | Par ni siquiera declarado |

Cada entrada conserva `valorOriginal`, `unidadOriginal`, `factorAplicado`,
`valorConvertido` y `representacion`.

### Una fuga cerrada en este sprint

`representacion` —el valor redondeado a los decimales del original, que NIE-1.5
calcula para poder mostrar sin inventar resolución— **no llegaba a la salida**:
`ResolucionUnidad` no lo exponía y se perdía entre NIE-1.5 y NIE-1.6. Quedó
añadido, con `null` cuando no hubo conversión.

---

## Contrato de salida · las siete distinciones

El consumidor debe poder separar siete situaciones. **No son un enum**, y no
deben serlo: no se excluyen entre sí.

| | Situación | Campo |
|---|---|---|
| A | No existe norma | `distinciones.sinNormaEnLaBase` |
| B | Existe, no es aplicable | `distinciones.noAplicables` |
| C | Existe, falta información | `distinciones.indeterminadas` |
| D | Existe y puede interpretarse | `distinciones.interpretables` |
| E | Existe, y está cuestionada | `distinciones.cuestionadas` |
| F | Varias, con resultados divergentes | `distinciones.divergentes` |
| G | Convertible, no solicitada | `distinciones.conversionDisponibleNoSolicitada` |

El caso ENSIN es **D y E a la vez**; un caso con TN-1 y TN-2 es **D y F a la
vez**. Un estado único obligaría a decidir cuál de los dos contar, que es
exactamente lo que este motor no hace. Hay un test dedicado a que D y E coexistan.

Cada campo lleva **las normas que lo sostienen**, no un booleano: una distinción
sin trazabilidad no puede auditarse. Las dos excepciones —`sinNormaEnLaBase` y
`divergentes`— son propiedades del conjunto, no de ninguna norma.

### A y B no comparten representación

Es la distinción que más fácilmente se pierde, y la que más daño hace:

```
A · candidatasEvaluadas = 0      no hay norma de esta variable en la NKB
B · candidatasEvaluadas = 356    hay 356, y ninguna corresponde a este caso
```

Colapsarlas en un `false` convertiría «no lo sabemos» en «no cumple». Hay un test
que comprueba que los dos casos difieren en ambos campos.

---

## Los ocho estados viven en cuatro tipos, y así deben seguir

Auditados en este sprint. **No forman un enum único**, y unificarlos sería
precisamente la pérdida de información que el módulo evita:

| Tipo | Estados | Responde a |
|---|---|---|
| `EstadoResolucion` | `APLICABLE` · `APLICABLE_CON_RESERVAS` · `NO_APLICABLE` · `NO_DETERMINABLE` · `CONFLICTO` · `CONFLICTO_NO_DETERMINABLE` · `SIN_NORMA_ADMISIBLE` | ¿Corresponde esta norma? |
| `EstadoInterpretacion` | `COINCIDE_CON_PERCENTIL` · `ENTRE_PERCENTILES_PUBLICADOS` · `POR_DEBAJO…` · `POR_ENCIMA…` · `CALCULADA` · `NO_COMPARABLE` · `NO_COMPARABLE_EQ3` · `ESTADOS_DIVERGENTES` · … | ¿Qué produjo? |
| `EstadoUnidad` | `MISMA_UNIDAD` · `CONVERSION_AUTORIZADA` · `CONVERSION_DISPONIBLE_NO_SOLICITADA` · `CONVERSION_NO_AUTORIZADA` · `UNIT_MISMATCH` | ¿Qué pasó con la unidad? |
| `EstadoEvidencia` | `ACTIVA` · `CUESTIONADA` | ¿Qué dice la ciencia de esa norma? |

Son cuatro preguntas independientes. Una norma puede ser aplicable, comparable,
con unidad convertida y cuestionada, todo a la vez. **Este sprint no añadió
ningún estado nuevo**: los que hacían falta ya existían.

---

## Responsabilidades

| | Responsable | Ejemplos |
|---|---|---|
| Qué normas existen y qué publican | **NKB** | Percentiles, n de celda, calidad, ES-1/ES-2, conflictos |
| Si una norma corresponde a un caso | **NIE** | Aplicabilidad, EQ-3, unidad, edad, sexo |
| Qué operación autoriza cada norma | **NIE** | TN-1 → localizar · TN-2 → z |
| Cómo se representa el conjunto | **NIE** | Particiones, divergencia, distinciones |
| **Qué norma usar** | **Aplicación** | Y debe declararlo en su código |
| **Qué significa el resultado para una persona** | **Nadie todavía** | Etapa 5, fuera del NIE |

El contrato de entrada —qué entrega la NKB al NIE— vive en el módulo `36` de la
NKB. Este es su contraparte: **qué entrega el NIE a la aplicación**.

---

## Invariantes añadidos

| # | Invariante |
|---|---|
| **I-34** | Toda vista de la salida es una partición: la unión reconstruye el total, en orden |
| **I-35** | Cada resultado aparece en exactamente una parte |
| **I-36** | Ningún campo de la salida nombra una norma como elegida |
| **I-37** | Ninguna lista de normas se indexa por posición |
| **I-38** | «No existe norma» y «existe y no aplica» no comparten representación |
| **I-39** | Las siete distinciones pueden solaparse; ninguna excluye a otra |

---

## Limitaciones y deudas

- **`noComparables` es enorme.** 356 entradas en el caso típico. Es honesto y es
  incómodo de consumir; paginarlo o agruparlo es trabajo de la aplicación, y
  cualquier agrupación que descarte debe declararlo.
- **El caso «Moderada + Baja aplicables a la vez» no existe en la NKB.** La
  calidad co-varía con el instrumento: la única ficha de calidad Baja —Cúcuta—
  usa Camry, en EQ-3 con todo lo demás. La propiedad se comprueba degradando la
  calidad de una candidata real **como fixture de test**, sin tocar la NKB. Si
  algún día entrara una norma Baja con instrumento compartido, el caso pasaría a
  ser construible con datos reales.
- **`ESTADOS_DIVERGENTES` no trae ninguna guía de lectura.** El motor dice que
  divergen; qué hacer con eso sigue sin respuesta, y no la tendrá desde la
  ingeniería.
- **La aplicación puede seguir eligiendo mal.** Este contrato hace la elección
  visible y auditable; no la hace correcta. Esa sigue siendo responsabilidad de
  quien la escriba.
