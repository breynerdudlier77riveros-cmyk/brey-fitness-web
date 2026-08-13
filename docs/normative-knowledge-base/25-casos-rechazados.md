---
modulo: 25
titulo: Casos rechazados
estado: congelado
sprint: NKB-2.0
---

# 25 · Casos rechazados

Situaciones concretas que **no** producen norma admisible, con el criterio que
las detiene. Sirven de referencia para quien evalúe una fuente y no sepa dónde
encaja.

Ninguna se refiere a una fuente real: son formas, no ejemplos.

---

## Grupo A · Procedencia

| Código | Situación | Detenida por | Nivel |
|---|---|---|---|
| **CR-01** | Tabla que circula sin autor ni publicación atribuible | CA-01 | E-1 |
| **CR-02** | Valores impresos por un instrumento, sin publicación que los respalde | CA-02 | E-2 |
| **CR-03** | Norma citada por un documento cuyo original no se localiza | CA-03 | E-2 |
| **CR-04** | Documento comercial que presenta valores de referencia | CA-02 | E-2 |
| **CR-05** | Material de formación que reproduce una tabla sin citar origen | CA-03 | E-2 |
| **CR-06** | Texto generado por un modelo de lenguaje | CA-02 | E-1 |
| **CR-07** | Comunicación personal o dato no publicado | CA-01 | E-1 |
| **CR-08** | Localizador que no resuelve y sin copia verificable | CA-01 | E-1 |

**CR-02 es el que más presión recibirá.** Suele ser la única norma disponible
para una variable, viene ya calculada y aparece en el informe que el
profesional tiene delante. Sigue sin ser admisible (NKB-ADR-06). Si existe
publicación que la respalde, se evalúa **la publicación**, no el instrumento.

## Grupo B · Contenido incompleto

| Código | Situación | Detenida por | Nivel |
|---|---|---|---|
| **CR-09** | Población identificada solo por etiqueta | CA-06 | E-3 |
| **CR-10** | Método descrito por remisión a algo no recuperable | CA-05 | E-3 |
| **CR-11** | Variable nombrada sin definición operacional | CA-04 | E-3 |
| **CR-12** | Valores solo legibles en una figura | CA-07 | E-3 |
| **CR-13** | Tabla con celdas ausentes que se pretenden completar | CA-07 | E-3 |
| **CR-14** | Categorías publicadas sin el criterio que las define | CA-07 | E-3 |
| **CR-15** | Punto de corte sin desenlace declarado | CA-07 | E-3 |

**CR-15 merece atención**: es un percentil presentado como umbral. Si la fuente
publica los percentiles subyacentes, puede admitirse como TN-1; como punto de
corte, no.

**CR-14 tiene la misma salida:** admisible como TN-1 si los percentiles constan;
inadmisible como TN-7.

## Grupo C · Reconstrucción y derivación

| Código | Situación | Detenida por |
|---|---|---|
| **CR-16** | Percentiles derivados de media y dispersión sin que la fuente sostenga la forma de la distribución | `21`, DV-03 |
| **CR-17** | Celda estimada interpolando entre estratos vecinos | `19`, ST-03 |
| **CR-18** | Estrato creado fuera del rango publicado | `19`, ST-04 |
| **CR-19** | N por estrato repartido desde el total | `16` |
| **CR-20** | Valores convertidos entre métodos sin ecuación publicada | `18` |
| **CR-21** | Derivación sobre un dato ya derivado | `21` |

## Grupo D · Agregación indebida

| Código | Situación | Detenida por |
|---|---|---|
| **CR-22** | Norma construida promediando varios estudios | `17` |
| **CR-23** | Poblaciones distintas fundidas para ampliar el alcance | `17` |
| **CR-24** | Estratos colapsados en uno más amplio | `19`, ST-02 |
| **CR-25** | Normas de métodos distintos agrupadas bajo un método genérico | `18` |
| **CR-26** | Clasificaciones de fuentes distintas armonizadas en un vocabulario común | I-11 |
| **CR-27** | Conflicto resuelto eligiendo una de las dos normas | NKB-ADR-04 |

**CR-22 y CR-23 producen «la norma general»**, que es cómoda, parece más sólida
por agregar más datos, y no describe a ninguna población existente.

## Grupo E · Interpretación infiltrada

| Código | Situación | Detenida por |
|---|---|---|
| **CR-28** | Tramos de percentil etiquetados como categorías de calidad sin que la fuente las defina | `15`, TN-1 |
| **CR-29** | Rango de referencia presentado como rango de normalidad | `15`, TN-6 |
| **CR-30** | Punto de corte redactado como si el umbral causara el desenlace | I-13 |
| **CR-31** | Norma marcada como preferente o recomendada | I-09 |
| **CR-32** | Valor de una persona almacenado junto a la norma | I-02 |
| **CR-33** | Campo que indique si un valor es adecuado | `08` |

---

## Recuento

| Grupo | Casos |
|---|---|
| A · Procedencia | 8 |
| B · Contenido incompleto | 7 |
| C · Reconstrucción y derivación | 6 |
| D · Agregación indebida | 6 |
| E · Interpretación infiltrada | 6 |
| **Total** | **33** |

## Cómo se usa este módulo

Ante una fuente dudosa, se busca la forma que se le parezca. Si aparece aquí, la
respuesta ya está dada y no hace falta improvisar un criterio.

**Si no aparece, no significa que sea admisible**: significa que hay que
evaluarla contra `13`. Este módulo enumera rechazos conocidos, no agota los
posibles.

## Los tres que más volverán

| Caso | Por qué volverá | Respuesta |
|---|---|---|
| **CR-02** · norma de instrumento | Es la única disponible y está a mano | Se evalúa la publicación, nunca la marca |
| **CR-16** · percentiles desde media y dispersión | El cálculo es trivial y parece inocuo | Exige un supuesto que la fuente debe sostener |
| **CR-22** · promedio de estudios | Parece más sólido cuantos más datos | No describe a ninguna población real |
