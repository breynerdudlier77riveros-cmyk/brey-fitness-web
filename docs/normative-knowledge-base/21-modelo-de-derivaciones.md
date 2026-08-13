---
modulo: 21
titulo: Modelo de derivaciones
estado: congelado
sprint: NKB-2.0
---

# 21 · Modelo de derivaciones

Qué transformaciones están permitidas sobre un dato publicado, y cómo se marca
lo que no vino de la fuente.

## Los cuatro orígenes de un dato

Todo valor almacenado declara su origen (CN-35). Son excluyentes.

| Código | Origen | Definición | Admisible |
|---|---|---|---|
| **OR-1** | Explícito | Aparece publicado tal cual | Sí |
| **OR-2** | Derivado | Se obtiene por una transformación autorizada por la fuente | Sí, marcado |
| **OR-3** | Reconstruido | Se obtiene por aproximación, lectura de figura o estimación | **No** |
| **OR-4** | Faltante | No aparece y no puede obtenerse | Se declara ausente |

### La regla que gobierna el módulo

> Si un valor normativo **no aparece explícitamente** y no existe una
> transformación **matemáticamente definida y autorizada por la fuente**, no se
> introduce.

No se rellena. No se aproxima. No se estima. Se declara faltante.

---

## OR-3 · Por qué se rechaza la reconstrucción

Se congela con detalle porque es la tentación más razonable de todas: la fuente
tiene el dato, se ve en el gráfico, y solo hay que leerlo.

| Práctica | Por qué no |
|---|---|
| Leer valores de una figura | La precisión de la lectura es desconocida y no se propaga al registro |
| Estimar una celda ausente desde las vecinas | Es interpolación (`19`, ST-03) |
| Reconstruir una tabla desde un texto descriptivo | El texto redondea; la tabla no |
| Deducir el N por estrato repartiendo el total | Supone un reparto que la fuente no declara |
| Completar un percentil ausente ajustando una curva | Inventa la forma de la distribución |

**Si la fuente solo presenta una figura y no permite recuperar los valores con
fidelidad, se declara.** La norma se queda en E-3 (`13`, CA-07) y el motivo se
registra: es información útil para quien evalúe esa fuente después.

---

## Derivaciones autorizadas

Una derivación se autoriza cuando cumple **las cuatro** condiciones. Basta que
falle una para que el resultado sea OR-3.

| Código | Condición |
|---|---|
| **DV-01** | La transformación está matemáticamente definida, sin ambigüedad |
| **DV-02** | Es reproducible: otro obtiene el mismo resultado con los mismos datos |
| **DV-03** | Sus supuestos están sostenidos por la fuente, no por conveniencia |
| **DV-04** | Conserva y declara el dato original del que procede |

**DV-03 es la que rechaza casi todas.**

## El caso que más se intentará

Se congela explícitamente:

> Que una fuente publique **media y dispersión** NO autoriza a derivar
> percentiles.

Derivar una posición percentil desde media y dispersión exige suponer una forma
de distribución. Ese supuesto:

- lo tiene que sostener **la fuente**, no quien registra;
- no se cumple en muchas variables reales, que son asimétricas;
- si es falso, produce percentiles equivocados **que parecen exactos**.

| Situación | Derivación |
|---|---|
| La fuente declara que la distribución se aproxima a la normalidad | Autorizada (DV-03 se cumple) |
| La fuente no declara la forma | **No autorizada** |
| La fuente declara que la distribución es asimétrica | **No autorizada** |

Lo mismo aplica en sentido inverso: de una puntuación tipificada no se obtiene
un percentil sin el mismo supuesto.

## Derivaciones habitualmente autorizadas

Sin fijar ninguna concreta, estas familias suelen cumplir las cuatro
condiciones:

- **Conversión de unidad** dentro del mismo sistema de medida, cuando la
  equivalencia es exacta y no depende de ningún supuesto.
- **Reexpresión de una puntuación tipificada** entre convenciones de escala,
  cuando ambas están definidas.
- **Complemento de un percentil** —la proporción por encima a partir de la
  proporción por debajo—, que es aritmética directa sobre lo publicado.

Aun así, **cada una se evalúa contra DV-01 a DV-04**: pertenecer a una familia
no la autoriza automáticamente.

## Marcado y trazabilidad

Todo dato derivado registra:

1. Que es derivado (OR-2).
2. De qué dato explícito procede.
3. Qué transformación se aplicó.
4. Qué supuesto la sostiene y dónde lo declara la fuente.

**Un dato derivado nunca sustituye al original.** Ambos coexisten; el original es
el que la fuente publicó y el derivado es de BREY (`14`, separación fuente /
metadato).

## Efecto sobre la calidad

Una norma con estadísticos derivados **no puede alcanzar el nivel alto** (`16`).
La derivación es correcta y sigue siendo una capa de distancia entre la fuente y
el dato.

## Prohibiciones

1. **No se deriva para completar** un estrato, un percentil o una celda ausente.
2. **No se deriva entre métodos** sin ecuación publicada y verificada; y aun
   entonces el resultado es OR-2 y no cambia el método de la norma (`18`).
3. **No se deriva entre poblaciones.** Nunca.
4. **No se encadenan derivaciones.** Una derivación sobre un dato derivado
   multiplica supuestos sin que nadie los vea.
5. **No se deriva un tipo de norma desde otro** (`15`).

## Lo que este módulo NO decide

- **Ninguna fórmula concreta.**
- **Ningún catálogo cerrado** de transformaciones autorizadas: se autorizan por
  condiciones, no por lista.
