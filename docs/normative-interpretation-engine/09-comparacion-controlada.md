---
modulo: 09
titulo: Comparación normativa controlada y salida interpretativa
sprint: NIE-1.6 + NIE-1.7
---

# 09 · Comparación controlada

## La regla que gobierna el módulo

> **Preferir `NO_COMPARABLE` antes que inventar una comparación.**

Ninguna de estas se convierte nunca en un resultado limpio: `NO_APLICABLE`,
`NO_DETERMINABLE`, `UNIT_MISMATCH`, una relación EQ-3, un conflicto declarado o
un estado ES-2. Detenerse **es** el resultado correcto cuando la evidencia no
alcanza, y viene siempre con su motivo escrito.

Este módulo responde una pregunta más estrecha de lo que parece:

> ¿Dónde se encuentra este valor observado respecto de las normas que
> **realmente pueden compararse con él**?

No responde si el valor es bueno. No lo responderá nunca: eso es la etapa 5, y
está fuera del NIE.

---

## Dónde encaja

`comparacion-normativa.ts` es la **capa de composición**. No añade capacidad
estadística —esa vive en `estadistica.ts` desde NIE-1.3.2— sino que decide
**cuándo está permitido usarla** y compone la salida que consume la aplicación.

```
resolucion.ts      →  ¿qué normas podrían corresponder?      (NIE-1.1 + 1.2)
comparacion.ts     →  ¿en qué se diferencian entre sí?       (NIE-1.4)
operaciones.ts     →  ¿qué autoriza cada tipo de norma?      (NIE-1.3.1)
estadistica.ts     →  ejecuta lo autorizado                  (NIE-1.3.2)
conversion-unidad  →  convierte si se le pide                (NIE-1.5)
        ↓
comparacion-normativa.ts  ←  este módulo                     (NIE-1.6 + 1.7)
```

Es el **único módulo del motor autorizado a llamar a la capa de conversión**, y
solo cuando el consumidor lo pide. `pureza.test.ts` comprueba las dos mitades:
que ningún otro fichero la importa, y que aquí hay exactamente **una** llamada,
precedida por la guarda que la autoriza.

---

## El orden de comprobación, y por qué ese orden

```
1 · EQ-3          →  NO_COMPARABLE_EQ3
2 · Aplicabilidad →  NO_COMPARABLE
3 · Unidad        →  UNIDAD_INCOMPATIBLE · NO_COMPARABLE
4 · Operación     →  la que el tipo de norma autorice
```

**EQ-3 se comprueba antes que la unidad.** No es un detalle de implementación:

> Una conversión cambia cómo se escribe una magnitud. No cambia el instrumento
> que la midió. **La unidad no resuelve un problema de método.**

Si se comprobara la unidad primero, un par convertible produciría un
`CONVERSION_AUTORIZADA` que sugeriría avance justo antes de bloquear. El orden
actual dice la verdad a la primera, y hay un test que lo fija: pedir
`convertirUnidad: true` sobre un par EQ-3 sigue devolviendo `NO_COMPARABLE_EQ3`.

`NO_COMPARABLE_EQ3` se nombra aparte de `NO_COMPARABLE` porque **el motivo
importa**. Aquí no falta información: la unidad puede ser convertible, la
población idéntica y la edad la misma, y sigue sin poder compararse.

---

## La unidad, nunca en silencio

Cinco estados, y ninguno convierte por su cuenta:

| Estado | Qué pasó |
|---|---|
| `MISMA_UNIDAD` | Observado y norma coinciden. Sin factor |
| `CONVERSION_DISPONIBLE_NO_SOLICITADA` | El par está autorizado y **nadie pidió convertir**. Se detiene |
| `CONVERSION_AUTORIZADA` | Se pidió, y el par lo permite |
| `CONVERSION_NO_AUTORIZADA` | El par está declarado y prohibido (kg ↔ kgf) |
| `UNIT_MISMATCH` | El par no está ni declarado. La tabla es cerrada |

El estado intermedio —**disponible pero no solicitada**— es el que sostiene la
doctrina de NIE-1.5. Sin él, «el par es convertible» y «hay que convertir» serían
lo mismo, y la capa acabaría aplicándose sola.

`convertirUnidad` está **por defecto en `false`**. Quien convierte lo escribe en
su propio código, donde puede auditarse, y no lo hereda de una biblioteca.

### Qué se convierte

**El valor observado, nunca el normativo.** Los números de la NKB no se tocan en
ningún punto, y el resultado conserva `valorOriginal`, `unidadOriginal` y
`factorAplicado` junto al valor comparado. Un test lo comprueba serializando la
ficha antes y después de comparar, y volviendo a cargarla del disco.

---

## Interpretación no es clasificación

Los estados que produce el motor son **descriptivos de la relación entre el
valor y lo publicado**, no del sujeto:

| Estado | Afirma |
|---|---|
| `COINCIDE_CON_PERCENTIL` | El valor es idéntico a un percentil publicado |
| `ENTRE_PERCENTILES_PUBLICADOS` | Cae entre dos. **No se interpola** |
| `POR_DEBAJO_DEL_MENOR_PUBLICADO` | Queda fuera del rango que la fuente publica |
| `POR_ENCIMA_DEL_MAYOR_PUBLICADO` | Ídem, por el otro extremo |
| `CALCULADA` | Se ejecutó la operación autorizada (z) |

Nótese lo que **no** dicen los dos estados de extremo. «Por debajo del menor
percentil publicado» es una afirmación sobre el alcance de la tabla, no sobre la
persona: la fuente no publica nada por debajo de P3, y eso es todo lo que se
sabe. Convertirlo en «bajo» sería extrapolar, y además clasificar.

Un valor exactamente en el punto medio aritmético de dos percentiles sigue
devolviendo el **par**, no el percentil intermedio. Que el consumidor tenga los
dos extremos publicados y decida qué hacer con ellos es correcto; que el motor
elija por él, no.

---

## Varias normas comparables

`interpretarNormativamente` devuelve **una entrada por candidata** —también por
las no comparables, con su motivo— y no elige entre las que sí lo son.

El punto delicado es el estado del conjunto. La primera versión de este módulo
tomaba `comparadas[0].comparacion.estado`, y eso **era elegir**: con una norma
TN-1 y otra TN-2 aplicables al mismo caso, los estados difieren siempre
—`COINCIDE_CON_PERCENTIL` frente a `CALCULADA`— y se quedaba el primero por
orden de fichero. Quedó corregido:

| Situación | `estadoGlobal` |
|---|---|
| Ninguna comparable | `SIN_NORMA_APLICABLE` |
| Todas coinciden | Ese estado, **por unanimidad** |
| Discrepan | `ESTADOS_DIVERGENTES` |

> Que dos normas comparables digan cosas distintas es **información**, no un
> empate que resolver.

`comparables()` filtra las que llegaron a producir un resultado. **Filtrar no es
elegir**: no descarta por calidad, ni por recencia, ni por tamaño de muestra, y
conserva el orden de la NKB.

---

## Los ejes siguen separados

Una comparación válida **no limpia nada**:

| Eje | Qué hace la comparación |
|---|---|
| Aplicabilidad | La respeta: si no es aplicable, no compara |
| Calidad | Ni ordena, ni descarta, ni pondera. Viaja en `norma.calidad` |
| Evidencia (ES-2) | `estadoEvidencia: 'CUESTIONADA'`, y se compara igual |
| Conflicto | Se propaga tal como lo declara la NKB |

El caso real que lo demuestra: `HGS-CO-M-15` está en ES-2 por el conflicto ENSIN
(`07`). Un valor de 30,7 kg coincide exactamente con su P50 — y el resultado
lleva `estadoEvidencia: CUESTIONADA`, `conflicto: CONFLICTO_NO_DETERMINABLE` y
la advertencia de la ficha intacta.

> **Que exista una comparación válida no elimina la objeción científica.** El
> motor lo dice con esas palabras, en la salida.

---

## Invariantes añadidos

| # | Invariante |
|---|---|
| **I-28** | EQ-3 se comprueba antes que la unidad, y ninguna conversión lo desbloquea |
| **I-29** | La conversión solo ocurre bajo `convertirUnidad: true` explícito |
| **I-30** | Se convierte el valor observado; los valores de la NKB nunca |
| **I-31** | Nunca se crea un percentil que la fuente no publique |
| **I-32** | `estadoGlobal` se deriva por unanimidad o divergencia, nunca del primero |
| **I-33** | Una comparación válida no altera el estado de evidencia ni el conflicto |

Comprobados sobre 80 valores por propiedad, además de los casos nominales.

---

## Un hallazgo del sprint

Al escribir la comprobación estructural de la conversión apareció que **doce
expresiones regulares de `pureza.test.ts` tenían el `\b` escrito como carácter
de retroceso** (`U+0008`) en vez de como frontera de palabra. Afectaba a
prohibiciones reales: `fetch(`, `console.`, el vocabulario clasificatorio y los
decimales sueltos.

El efecto es el peor posible en una prueba de este tipo: son todas
`not.toMatch`, y **una expresión regular que no puede coincidir nunca hace pasar
un `not.toMatch` siempre**. Doce prohibiciones llevaban desde NIE-1.1 sin
comprobar nada.

Corregidas, la suite sigue en verde: las prohibiciones se cumplían de verdad. No
se descubrió ninguna infracción, se descubrió que no se estaban buscando.

> La lección va al método, no al fichero: una prohibición expresada como
> `not.toMatch` **no puede validarse a sí misma**. Un test negativo necesita al
> menos un positivo que demuestre que la expresión regular sabe encontrar lo que
> busca.

---

## Limitaciones

- **Solo dos operaciones**: localizar en percentiles (TN-1) y puntuación z
  (TN-2). Sigue sin haber percentil desde z, punto de corte ni clasificación,
  porque ninguna norma admisible los autoriza (`41`).
- **`ESTADOS_DIVERGENTES` será lo habitual** en cuanto haya un TN-1 y un TN-2
  aplicables al mismo caso. Es correcto y es incómodo: obliga al consumidor a
  mirar cada norma. Ese es el punto.
- **La conversión autorizada es hoy inútil en la práctica**: kgf ↔ lbf conecta
  Brasil y Chile, dos poblaciones que además están en EQ-3 entre sí. La capa
  está, y no acerca ninguna norma.
- **El motor no sabe qué hacer con la divergencia.** Nadie lo sabe todavía: es
  una decisión científica pendiente, no una carencia de ingeniería.
