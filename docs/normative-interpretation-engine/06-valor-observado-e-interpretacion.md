---
modulo: 06
titulo: Valor observado, tipos de norma y operaciones autorizadas
sprint: NIE-1.3.1 + NIE-1.3.2
---

# 06 · Valor observado e interpretación

## La distinción que abre este sprint

> **Valor normativo ≠ valor observado.**

| | Procede de | Entra en la NKB | Entra en `ContextoEvaluacion` | Entra en el resultado |
|---|---|---|---|---|
| **Valor normativo** | NKB | ya está | — | ✅ |
| **Valor observado** | Sujeto / entrada externa | ❌ **nunca** | ❌ **nunca** | ✅ |

```
NKB            → norma      → valor normativo
Sujeto/entrada → medición   → valor observado
NIE            → interpretación matemática
```

Nunca: `NKB ← valor observado`.

`ContextoEvaluacion` sigue sin admitir el valor, igual que antes de este
sprint: la resolución de candidatas se hace **sin mirar cuánto salió**. El valor
llega en un tipo aparte, `ValorObservado`, y solo interviene después.

---

## Modelo del valor observado

```
ValorObservado
├── variable
├── valor          número finito
├── unidad         kg · kgf · lbf
├── contexto       ContextoEvaluacion (cómo se midió)
├── procedencia    origen · fecha · registroId
└── metadatos
```

`crearValorObservado` rechaza:

| Entrada | Motivo |
|---|---|
| Valor no finito | `NaN` e `Infinity` no son mediciones |
| Contexto sin variable | Sin ella no hay nada que resolver |
| Unidad del contexto ≠ unidad del valor | Incoherencia interna: **no se arregla en silencio** |

La `fecha` se **recibe**; el motor nunca consulta el reloj.

---

## Los siete tipos de norma

La arquitectura soporta los siete. **Soportar un tipo no es tener normas de ese
tipo**: hoy la NKB solo contiene TN-1 y TN-2, y el motor no inventa las demás.

| Tipo | Normas en la NKB | Operación automática |
|---|---|---|
| **TN-1** percentiles | 308 | `LOCALIZAR_EN_PERCENTILES` |
| **TN-2** media y dispersión | 48 | `PUNTUACION_Z` |
| TN-3 · z | **0** | ninguna |
| TN-4 · T | **0** | ninguna |
| TN-5 · punto de corte | **0** | ninguna |
| TN-6 · rango de referencia | **0** | ninguna |
| TN-7 · clasificación | **0** | ninguna |

---

## Las seis preguntas antes de implementar una derivación

Cada autorización de `operaciones.ts` pasó por ellas:

1. ¿La fuente publica directamente el dato?
2. ¿La NKB autoriza derivarlo?
3. ¿Exige asumir una distribución?
4. ¿Exige interpolar?
5. ¿Exige convertir unidades?
6. ¿Cambia el significado estadístico de la norma?

Si alguna revela una operación no autorizada: **no se implementa**, y se
devuelve estado explícito.

---

## Operaciones autorizadas

### `LOCALIZAR_EN_PERCENTILES` · TN-1

Sitúa el valor observado respecto a los percentiles **publicados**. Cuatro
resultados posibles:

| Estado | Significa |
|---|---|
| `COINCIDE_CON_PERCENTIL` | El valor es exactamente un percentil publicado |
| `ENTRE_PERCENTILES_PUBLICADOS` | Cae entre dos publicados. **Se devuelven ambos** |
| `POR_DEBAJO_DEL_MENOR_PUBLICADO` | Por debajo del menor. No se extrapola |
| `POR_ENCIMA_DEL_MAYOR_PUBLICADO` | Por encima del mayor. No se extrapola |

> **No interpola.** Si el valor cae entre P25 y P50 se devuelven los dos y se
> dice exactamente eso. Afirmar «P37» sería inventar una posición que nadie
> midió: la fuente no publica nada entre ellos.

Se resuelve en **una sola pasada, sin ordenar**. El motor no contiene ningún
`.sort()`, y esa ausencia es un invariante comprobado sobre el código fuente.

### `PUNTUACION_Z` · TN-2

`z = (x − μ) / σ`, con la media y la desviación típica que publica la fuente.

**No supone ninguna forma de distribución.** Es una re-expresión del valor en
unidades de la dispersión de la norma, y eso es aritmética sobre datos
publicados.

Si σ no es finita o no es positiva → `DATOS_INSUFICIENTES`. Nunca infinitos,
nunca `NaN`.

---

## Operaciones explícitamente prohibidas

| Operación | Estado devuelto | Motivo |
|---|---|---|
| `PERCENTIL_DESDE_Z` | `OPERACION_NO_AUTORIZADA` | Exige normalidad. `HGS-CO-UNI-TN2` la **niega**; `HGS-DE-TN2` **no declara** su forma. Prohibida por evidencia en un caso y por defecto en el otro |
| `PUNTO_DE_CORTE` | `SIN_PUNTO_DE_CORTE_ADMISIBLE` | Cero normas TN-5 (`41`). Ni media − DT, ni percentiles, ni categorías de autores sirven de sustituto |
| `CLASIFICACION` | `SIN_CLASIFICACION_ADMISIBLE` | Cero normas TN-7. Las categorías publicadas por algunas fuentes fueron rechazadas (RN-03, RN-04) |
| `DERIVAR_DESDE_LMS` | `OPERACION_NO_AUTORIZADA` | Los parámetros se conservan, pero calcular con ellos un percentil no tabulado es una derivación OR-3 (`21`) |

> La regla que gobierna las cuatro: **que algo sea matemáticamente posible no lo
> hace científicamente autorizado.** Calcular z desde media y DT es trivial;
> convertirlo en percentil también lo es. La diferencia es que lo segundo exige
> un supuesto que las fuentes no sostienen.

---

## El cuarto eje

`EstadoInterpretacion` es **independiente** de los tres que ya existían:

| Eje | Responde |
|---|---|
| `EstadoAplicabilidad` | ¿Corresponde esta norma a este caso? |
| `Calidad` | ¿Cuánto respalda la evidencia a esta norma? |
| `ConflictoDeclarado` | ¿La NKB registró una objeción? |
| **`EstadoInterpretacion`** | **¿Qué se pudo hacer con el valor observado?** |

Una norma puede ser **aplicable, de calidad Baja, cuestionada** y aun así
producir un resultado matemático perfectamente definido. Mezclar los ejes
ocultaría precisamente lo que hay que ver.

Ninguno de los cuatro es un diagnóstico.

---

## Contrato de salida

Nunca un número desnudo:

```
ResultadoInterpretacion
├── observado        { valor, unidad }
├── norma            { id, fichaId, tipo, unidad }
├── operacion        LOCALIZAR_EN_PERCENTILES · PUNTUACION_Z · NINGUNA
├── resultado        unión discriminada, o null
├── estado           EstadoInterpretacion
├── aplicabilidad    ─┐
├── calidad           │ los tres ejes anteriores,
├── estadoNorma       │ transportados sin mezclarse
├── conflicto        ─┘
├── procedencia      norma → ficha → fichero → tabla → fila → referencia
├── limitaciones
├── advertencias
└── motivo           por qué el estado es el que es
```

`interpretarConjunto` devuelve **un resultado por norma utilizable**. Si hay
dos aplicables, hay dos resultados: no elige, no ordena y no consolida.

Sin candidatas utilizables devuelve un único resultado con
`SIN_NORMA_APLICABLE`, cuyo motivo dice literalmente que *describe la evidencia,
no al sujeto*.

---

## Invariantes añadidos

| # | Invariante |
|---|---|
| **I-18** | El valor observado no entra en la NKB, ni en las fichas, ni en `ContextoEvaluacion` |
| **I-19** | El valor normativo devuelto es siempre uno publicado por la fuente |
| **I-20** | Los percentiles devueltos son siempre percentiles publicados |
| **I-21** | Ninguna operación asume una distribución que la fuente no declare |
| **I-22** | Que una operación sea posible no la hace autorizada |

---

## Limitaciones reales

- **Solo dos operaciones existen**, porque solo hay dos tipos de norma en la
  base. TN-3 a TN-7 están soportados por el tipo y vacíos en la práctica.
- **La localización en percentiles no da una posición porcentual exacta** salvo
  coincidencia literal. Es lo que la evidencia permite.
- **La puntuación z no es comparable entre normas** de distinta σ, y el motor no
  lo hace.
- **Ninguna operación funciona entre unidades distintas**, y no existe capa de
  conversión.
