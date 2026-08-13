---
modulo: 01
titulo: Contrato de resultado
sprint: NIE-1.3
---

# 01 · Contrato de resultado

## La asimetría que ordena todo

| | Valor medido del sujeto | Valor normativo de la NKB |
|---|---|---|
| **Entrada** | ❌ Nunca | ❌ Nunca |
| **Salida** | ❌ Nunca | ✅ Sí |

El **valor normativo** entra en el resultado porque procede de la NKB y el
consumidor lo necesita. El **valor medido del sujeto** no entra en ninguna
parte: `ContextoEvaluacion` no tiene campo donde ponerlo.

> No es disciplina, es construcción. Si el contexto admitiera el valor, el
> motor podría calcular la posición normativa. Y en cuanto pudiera, alguien
> haría que lo hiciera.

## Qué se puede hacer con el valor normativo

| | |
|---|---|
| Transportarlo | ✅ |
| Crearlo | ❌ |
| Modificarlo | ❌ |
| Convertirlo | ❌ |
| Interpolarlo | ❌ |
| Promediarlo con otro | ❌ |

`conjunto.test.ts` lo comprueba estructuralmente: los valores de cada candidata
deben ser **profundamente iguales** a los de su fila en la ficha. No es una
búsqueda de vocabulario; si el motor promediara, fusionara o ajustara algo, el
test fallaría.

---

## `ValoresNormativos`

Unión discriminada, porque TN-1 y TN-2 **no son la misma cosa** y no deben
poder confundirse:

```
{ tipo: 'percentiles',      percentiles: [{ percentil, valor }, …] }
{ tipo: 'media_dispersion', media, desviacionTipica }
```

Una dice dónde cae el percentil 25. La otra, cuál es la media. Ambas pueden ser
ciertas a la vez, y ninguna se deriva de la otra.

### Parámetros del modelo

Las fichas chilenas publican L, M y S. Se conservan —son lo que hace
reproducible la norma— en un campo aparte, y **no autorizan a calcular
percentiles que la fuente no tabula**: eso sería una derivación OR-3 que `21`
no permite, y las propias fichas lo dicen.

---

## Trazabilidad

Ninguna candidata existe sin ella. `Procedencia` lleva la cadena completa:

```
norma → ficha → fichero → tabla → fila/estrato → referencia primaria
```

| Campo | Ejemplo |
|---|---|
| `normaId` | `HGS-CO-UNI-M-18` |
| `fichaId` | `HGS-CO-UNI-TN1` |
| `fichero` | `HGS-CO-UNI-TN1-percentiles.md` |
| `tabla` | `\| Id \| Edad \| n \| P3 \| P10 \| … \|` |
| `fila` | `Varones · 18 años` |
| `referencia` | `vivas_diaz_hgs_universitarios_2016` |

La `tabla` es la **cabecera literal** de la tabla de la que se leyó la fila. No
es decorativa: es lo que permite volver al documento y encontrar el número.

---

## Cómo se leen los valores sin codificarlos

Las tablas de la NKB se describen a sí mismas. El adaptador **lee la cabecera**
en lugar de fijar posiciones de columna:

| Cabecera | Se interpreta como |
|---|---|
| `P50`, `P2,5`, `P50 (kg)` | percentil |
| `2,5`, `3`, `50` *(ficha brasileña)* | percentil |
| `Media`, `Media (kg)` | media |
| `DT` | desviación típica |
| `n`, `N` | tamaño de la celda |
| `L`, `M`, `S` | parámetro del modelo |

Consecuencia buscada: **no hay ni una posición de columna ni un valor normativo
codificados en el motor**, y una columna nueva en una ficha se recogería sola.
`pureza.test.ts` comprueba que ningún fichero del motor contiene decimales.

Si una fila no aporta ni percentiles ni media con dispersión, el cargador
**lanza un error** en lugar de cargarla a medias.
