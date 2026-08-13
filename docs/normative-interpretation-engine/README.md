# Normative Interpretation Engine (NIE) · v1.0

Motor que responde **una sola pregunta**:

> Dado un contexto de evaluación, ¿qué normas de la NKB podrían corresponder a
> este caso, y cuál es el estado de aplicabilidad de cada una?

Y, desde NIE-1.3.2, **qué operación estadística autoriza cada norma sobre un
valor observado**; desde NIE-1.6, **cuándo está permitido ejecutarla**.

Todavía **no** responde qué tan bueno es un atleta, si está por encima o por
debajo de nada, ni qué debería entrenar.

---

## Las cinco etapas, y dónde está la frontera

| # | Etapa | Estado |
|---|---|---|
| 1 | Existencia de una norma | ✅ NKB |
| 2 | **Candidatura** | ✅ **NIE-1.1** |
| 3 | **Aplicabilidad** | ✅ **NIE-1.2** |
| 3b | **Conjunto normativo y comparación** | ✅ **NIE-1.3 + NIE-1.4** |
| **4** | **Cálculo normativo** | ✅ **NIE-1.3.1 + NIE-1.3.2** · solo lo autorizado |
| **4b** | **Comparación controlada** | ✅ **NIE-1.6 + NIE-1.7** |
| **4c** | **Resolución final y contrato de salida** | ✅ **NIE-1.8 + NIE-1.9** |
| 5 | Interpretación clínica | ❌ No implementado, y fuera del alcance del NIE |

## Índice

| Fichero | Contenido |
|---|---|
| `01-contrato-de-resultado.md` | Qué devuelve, valores y trazabilidad completa |
| `02-reglas-de-no-seleccion.md` | Por qué no elige, y propagación de estado, calidad, unidades, EQ-3 y conflictos |
| `03-comparacion-estructurada.md` | La matriz de diferencias, sin categoría de mérito |
| `04-invariantes-y-casos.md` | 17 invariantes, casos de prueba, casos rechazados y hallazgos |
| `05-limitaciones-y-roadmap.md` | Lo que no puede hacer, y qué viene después |
| `06-valor-observado-e-interpretacion.md` | **Valor observado, los 7 TN y qué operación autoriza cada uno** |
| `07-conflicto-ensin.md` | **La determinación del conflicto ENSIN**: acceso, matriz de coordenadas y veredicto |
| `08-conversion-de-unidades.md` | **La capa de conversión**: qué se autoriza, por qué tan poco y por qué no se aplica sola |
| `09-comparacion-controlada.md` | **Cuándo se compara y cuándo no**: orden EQ-3 → unidad → operación, y el estado del conjunto |
| `10-resolucion-y-contrato-de-salida.md` | **Qué entrega el NIE a la aplicación**: particiones, divergencia, las siete distinciones y quién responde de qué |

La etapa 4 está construida **solo hasta donde la evidencia autoriza**: se sitúa
un valor entre percentiles publicados y se calcula una puntuación z, y nada más.
`pureza.test.ts` defiende el resto: comprueba sobre el código fuente que no hay
percentiles calculados, ni T, ni interpolación, ni puntuación compuesta, ni
`.sort()`, y que la conversión de unidades solo aparece en la capa de
composición, bajo la guarda que la autoriza.

---

## Arquitectura

```
src/lib/nie/
├── tipos.ts           Contratos. El contexto NO admite el valor medido
├── dimensiones.ts     NIE-1.1 · comparación coordenada a coordenada
├── aplicabilidad.ts   NIE-1.2 · veredicto multidimensional, sin puntuar
├── resolucion.ts      Orquestador
├── comparacion.ts     NIE-1.4 · matriz de diferencias
├── operaciones.ts     NIE-1.3.1 · qué autoriza cada tipo de norma
├── valor-observado.ts NIE-1.3.2 · la medición del sujeto
├── estadistica.ts     NIE-1.3.2 · motor estadístico
├── conversiones.ts    NIE-1.5 · tabla declarativa de factores
├── conversion-unidad.ts NIE-1.5 · la operación, sin acoplar
├── comparacion-normativa.ts NIE-1.6 + 1.7 · cuándo se compara
├── salida.ts          NIE-1.8 + 1.9 · el conjunto, en particiones
├── index.ts           API pública
└── nkb/
    ├── coordenadas.ts Identidad de las 15 fichas, en forma comparable
    └── cargador.ts    Lee las fichas y produce las 356 normas
```

**El motor es puro.** No toca ficheros, no consulta la fecha, no usa azar y no
conoce Supabase. Recibe las normas como dato.

**El adaptador `nkb/` no lo es**, porque lee las fichas. Por eso vive aparte y
el motor no lo importa: hay un test que lo comprueba.

### Por qué el adaptador existe

Las fichas de la NKB son documentos: sus campos CN son prosa escrita para que la
lea una persona. `coordenadas.ts` declara las mismas coordenadas en forma
comparable por una máquina.

**No es una copia de la NKB.** Son las coordenadas de identidad de 15 fichas, no
las 356 normas, y **no contiene ni un valor normativo**: los percentiles siguen
viviendo únicamente en `docs/normative-knowledge-base/fichas/`.

Cada coordenada declara de qué campo CN procede, y
`cargador.test.ts` comprueba que aparece literalmente en ese campo. Si alguien
edita una ficha y no el adaptador, el test falla.

---

## Entrada

`ContextoEvaluacion`. Todo campo es `null` cuando no consta, y `null` significa
*no se sabe* — nunca un valor por defecto silencioso.

> **No contiene el valor medido, y no debe contenerlo.** La aplicabilidad
> depende del contexto normativo, nunca de si el resultado del sujeto «encaja»
> con la norma. Que el valor no esté en el tipo lo hace imposible por
> construcción, no por disciplina.

---

## Las diez dimensiones

Cada una se compara por separado y produce su propio estado:
`MATCH` · `MISMATCH` · `NO_DETERMINABLE` · `NO_APLICA`.

| Dimensión | Regla |
|---|---|
| variable | Identidad exacta. Sin equivalencias semánticas |
| país | Identidad exacta. **La región no sustituye a la población** |
| instrumento | Todos los pares en **EQ-3**. Compartir marca no es compartir método |
| unidad | El desajuste se marca `UNIT_MISMATCH`. **Convertir es una decisión externa** (`08`) |
| definición operacional | El mejor intento y el promedio no son la misma magnitud |
| posición | Bipedestación ≠ sedestación |
| lado | Mano dominante declarada ≠ lateralidad anatómica |
| edad | La celda cubre o no cubre. **No se interpola ni se extrapola** |
| sexo | Correspondencia exacta cuando la norma estratifica |
| estatura | Solo la estratifican las seis fichas brasileñas |

---

## Aplicabilidad

Orden de decisión, y el orden importa:

1. **Cualquier `MISMATCH` excluye** → `NO_APLICABLE`. Se comprueba primero para
   que una discrepancia real no quede enmascarada por un campo que además falte.
2. **Cualquier `NO_DETERMINABLE` detiene** → `NO_DETERMINABLE`. No se asume que
   coincide ni que no coincide.
3. Todo coincide → `APLICABLE`, o `APLICABLE_CON_RESERVAS` si la norma trae
   reservas declaradas.

### Reservas

Cinco motivos, **todos procedentes de un hecho declarado en la ficha**:
`estado_cuestionado` · `calidad_baja` · `n_celda_no_consta` ·
`valores_proyectados` · `conflicto_declarado`.

No hay umbral de N, y este motor no crea ninguno. La NKB tampoco lo tiene.

> **No existe puntuación compuesta.** Las reservas son una lista, no un número.
> Calidad y aplicabilidad son ejes independientes: una norma de calidad Baja
> puede ser aplicable, y una Moderada puede no serlo.

---

## Lo que el motor nunca hace

| No hace | Por qué |
|---|---|
| Elegir la mejor norma | Es aplicar, y esa decisión debe declararse fuera |
| Ordenar por calidad, recencia o tamaño | Sería elegir con otro nombre |
| Convertir por su cuenta | La capa existe (`08`), pero exige petición explícita |
| Tratar la unidad como si arreglara el método | EQ-3 se comprueba antes (`09`) |
| Resolver la divergencia entre dos normas comparables | `ESTADOS_DIVERGENTES` (`09`) |
| Colapsar «no hay norma» y «no aplica» en un `false` | Son afirmaciones distintas (`10`) |
| Devolver solo lo utilizable | El resto explica **por qué** no lo es (`10`) |
| Resolver conflictos | `22`. Los propaga tal como los declara la NKB |
| Descartar una norma en ES-2 | La objeción viaja con la candidata |
| Recibir el valor medido | I-02 |
| Clasificar al sujeto | No hay TN-5 ni TN-7 admisibles (`41`) |

### La regla crítica

> **«No tengo norma aplicable» nunca significa «el sujeto está fuera de lo
> normal».**

`SIN_NORMA_ADMISIBLE` afirma algo sobre **nuestra evidencia**, no sobre una
persona. El caso 3 de los tests lo comprueba sobre el texto que redacta el
motor: no aparece «bajo», «alto», «normal», «anormal», «deficiente» ni
«insuficiente».

---

## Hallazgos

### NIE-1.1 · la posición corporal alemana

Al intentar comparar la posición corporal, el adaptador descubrió que **las dos
fichas alemanas no la declaran**. Su CN-33 ya lo admitía —«protocolo
incompleto»— pero el módulo `39` de la NKB afirmaba que «Alemania y Colombia
miden de pie». Era una inferencia, no un dato de la fuente, y quedó retirada.

Consecuencia: frente a una medición cuya posición sí se conoce, las normas
alemanas dan **NO_DETERMINABLE** en esa dimensión. No se confirman ni se
descartan.

> Es la regla que la NKB aplica a las fuentes, aplicada esta vez a la NKB misma:
> lo que no consta, no se rellena.

### NIE-1.6 · doce prohibiciones que no comprobaban nada

Doce expresiones regulares de `pureza.test.ts` tenían el `` escrito como
carácter de retroceso en lugar de como frontera de palabra. Como todas son
`not.toMatch`, **una expresión que no puede coincidir nunca las hacía pasar
siempre**: `fetch(`, `console.`, el vocabulario clasificatorio y los decimales
sueltos llevaban desde NIE-1.1 sin comprobarse.

Corregidas, la suite sigue en verde. No había ninguna infracción; simplemente no
se estaba buscando. Detalle en `09`.

Desde NIE-1.8, **toda prohibición negativa lleva control positivo**: se comprueba
que la expresión regular encuentra una infracción de muestra antes de confiar en
que no encuentre ninguna real.

### NIE-1.8 · `representacion` no llegaba a la salida

NIE-1.5 calcula el valor convertido redondeado a los decimales del original,
para poder mostrarlo sin afirmar una resolución que la fuente no midió.
`ResolucionUnidad` no lo exponía, y se perdía en la frontera con NIE-1.6. Cerrado.

### NIE-1.8 · un caso del sprint que la NKB no permite construir

«Una norma Moderada y otra Baja, ambas aplicables» no existe: la calidad
co-varía con el instrumento, y la única ficha Baja usa un dinamómetro que está en
EQ-3 con el resto. La propiedad se comprueba con un fixture de test, no
fabricando estado en la NKB. Detalle en `10`.

---

## Estado

| | |
|---|---|
| Normas cargadas | **356**, de 15 fichas |
| Tests del NIE | **372** |
| Suite completa | **1 425** |
| Ficheros de producción tocados fuera del NIE | **0** |
| Normas añadidas, modificadas o derivadas | **0** |
| Valores normativos codificados en el motor | **0** |
| Conversiones aplicadas a la NKB | **0** |
| Reglas de selección | **0** |
| Categorías clasificatorias emitidas por el motor | **0** |
| Infracciones en la auditoría estática | **0**, con control positivo |
