---
modulo: 01
titulo: Modelo conceptual
estado: congelado
---

# 01 · Modelo conceptual

Conceptos, no atributos técnicos. Este módulo dice **qué existe** en la NKB;
qué campos tiene cada cosa se decide en el Sprint 2.

## Entidades

Doce. Ninguna más entra en v1.0 sin pasar por el roadmap (`10`).

### N-01 · Variable
La magnitud medible sobre la que existe una norma. Es el **sujeto de todo el
modelo**.

Una variable se define por lo que mide, nunca por el dominio que la usa: la NKB
no sabe si corresponde a una capacidad funcional, a un compartimento corporal o
a un analito. Esa correspondencia se resuelve fuera (NKB-ADR-01).

*Responsabilidad:* ser aquello de lo que se puede tener norma.

### N-02 · Método de medición
El procedimiento con el que se obtuvo el valor.

**No es un detalle del contexto: forma parte de la identidad de la norma.** La
misma variable medida por dos métodos distintos produce dos distribuciones
distintas, y sus normas no son intercambiables. Una norma sin método declarado
es inaplicable.

*Responsabilidad:* impedir que una norma se aplique a un valor obtenido de otra
manera.

### N-03 · Unidad
La unidad de medida en que la norma está expresada.

*Responsabilidad:* que un valor y una norma sean comparables sin conversión
implícita.

### N-04 · Población
El conjunto de personas del que procede la distribución observada, definido por
sus criterios de inclusión (`03`).

*Responsabilidad:* delimitar a quién es aplicable la norma.

### N-05 · Estrato
La subdivisión dentro de una población en la que la norma se expresa: sexo,
franja de edad, nivel, u otra que la fuente declare.

**Estrato no es lo mismo que población.** La población es de quién se tomaron
los datos; el estrato es cómo se presentan dentro de ella.

*Responsabilidad:* localizar la norma exacta que corresponde a unas
características declaradas.

### N-06 · Norma
La unidad de almacenamiento: qué dice una fuente sobre la distribución de una
variable, medida con un método, en una población, para un estrato.

*Responsabilidad:* ser el hecho primario de la NKB. Todo lo demás la describe.

### N-07 · Estadístico normativo
La forma concreta en que la norma expresa esa distribución: percentiles, media y
dispersión, puntuación tipificada, punto de corte, rango de referencia o
clasificación (`02`).

*Responsabilidad:* declarar **qué tipo de afirmación** es la norma, porque no
todas las formas afirman lo mismo.

### N-08 · Clasificación
Las categorías que **la propia fuente** define sobre la variable.

La NKB las almacena porque la fuente las publicó. **Nunca las inventa ni las
deriva**: si una fuente publica percentiles y no categorías, la NKB guarda
percentiles y ninguna categoría.

*Responsabilidad:* conservar el vocabulario de la fuente sin ampliarlo.

### N-09 · Referencia
La publicación de la que procede la norma (`04`).

*Responsabilidad:* que toda afirmación remonte a un documento localizable.

### N-10 · Calidad de evidencia
Cuánto respalda la referencia a la norma que sostiene (`05`).

*Responsabilidad:* que la fuerza de una norma viaje con ella y no se pierda al
consultarla.

### N-11 · Limitación
Declaración explícita de algo que la norma **no** permite afirmar, y su motivo.

*Responsabilidad:* que el silencio nunca se confunda con ausencia de problema.

### N-12 · Traza
El registro de cómo llegó una norma a la base: de qué referencia, quién la
incorporó, cuándo y con qué versión de criterios.

*Responsabilidad:* hacer auditable la propia biblioteca.

---

## Relaciones

```
Variable ──< Norma >── Población
   │           │            │
 Unidad      │          Estrato
             │
   Método ───┤
             │
             ├──> Estadístico normativo ──> Clasificación
             ├──> Referencia ──> Calidad de evidencia
             ├──> Limitación
             └──> Traza
```

| Relación | Cardinalidad | Nota |
|---|---|---|
| Variable → Norma | 1 a N | Una variable admite muchas normas |
| Norma → Método | N a 1 | **Obligatorio**: sin método no hay norma |
| Norma → Población | N a 1 | Obligatorio |
| Norma → Estrato | 1 a N | Una norma se expresa por estratos |
| Norma → Referencia | N a 1 | Una publicación puede aportar varias normas |
| Norma → Estadístico | 1 a 1 | Una norma es de **un** tipo, no de varios |
| Norma → Traza | 1 a 1 | Sin traza no se almacena (invariante I-04) |

**La identidad de una norma es la cuádrupla** *variable · método · población ·
estrato*. Dos normas que coincidan en las cuatro y difieran en sus valores están
en conflicto, y la NKB lo declara en vez de elegir (invariante I-08).

---

## Fronteras de responsabilidad

| La NKB es dueña de | Solo consume | Nunca toca |
|---|---|---|
| Variable, Método, Unidad | Publicaciones científicas | Sujetos y sus mediciones |
| Población, Estrato, Norma | — | Capacidades, pruebas, sistemas |
| Estadístico, Clasificación | — | Interpretaciones |
| Referencia, Calidad, Limitación, Traza | — | Recomendaciones |

---

## Qué NO es una entidad, y por qué

| Candidato descartado | Motivo |
|---|---|
| **Sujeto / Persona** | La NKB no contiene datos de nadie. Introducirlo la convertiría en un expediente y le daría acceso a información que no necesita para su función. |
| **Medición** | Un valor concreto pertenece a quien lo tomó. La NKB almacena distribuciones, no observaciones individuales. |
| **Interpretación** | Es la salida del NIE. Almacenarla aquí ataría la biblioteca a una forma concreta de leerla. |
| **Capacidad** | Concepto del PAS. Conocerlo rompería la universalidad (NKB-ADR-01). |
| **Puntuación global** | Un número que resuma varias variables exigiría ponderarlas, y esa ponderación no es una norma. |
| **Riesgo** | Un punto de corte asociado a un desenlace se almacena como estadístico (`02`). Convertirlo en entidad propia invitaría a tratarlo como pronóstico. |
| **Objetivo / Valor deseable** | Requiere saber para qué. La NKB no lo sabe y no debe suponerlo (límite L-04). |
