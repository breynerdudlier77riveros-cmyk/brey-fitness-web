---
modulo: 17
titulo: Roadmap hacia el Knowledge Graph
tipo: fundacional
estado: verificado
---

# 17 · Roadmap hacia el Knowledge Graph

Cómo esta base documental se convierte en un grafo consultable por IA. No es una hoja de ruta de
funcionalidades: es la secuencia técnica para que un motor pueda razonar sobre lo que aquí está
escrito sin volver a interpretarlo.

---

## Por qué el formato actual ya lo anticipa

Tres decisiones de la v1.0 existen exclusivamente para esta conversión:

1. **Markdown con frontmatter YAML** en lugar de micro-sitio HTML (CKB-ADR-01). El contenido es
   extraíble sin raspar presentación.
2. **Ficha homogénea de siete secciones** (`_plantilla-ficha.md`). Cada sección mapea a un tipo
   de propiedad del nodo.
3. **Referencias por clave**, nunca escritas a mano en la ficha. Cada clave es ya un
   identificador de nodo de evidencia.

---

## Modelo de grafo propuesto

### Nodos

| Tipo | Origen en la base | Propiedades clave |
|---|---|---|
| `Variable` | `variables_bcs` de cada ficha | id, unidad, catálogo BCS |
| `Concepto` | Cada ficha (`id`, `tipo`) | definición, mecanismo |
| `Patron` | Módulo 09 | combinación de direcciones |
| `Evidencia` | Cada entrada de `referencias.yaml` | tipo, organización, año, población, localizador |
| `Limitacion` | Sección *Interpretaciones NO admisibles* + módulo 12 | ámbito, motivo |
| `Poblacion` | Campo `nota` de las referencias | sana / clínica / pediátrica / atleta |

### Aristas

| Arista | Origen | Semántica |
|---|---|---|
| `DERIVA_DE` | Módulo 10, tabla de derivación | El error se propaga |
| `COMPONE` | Módulo 10, composición | Identidad aditiva |
| `COEXISTE_CON` | Módulo 10, estructural | Mismo tejido |
| `CONCURRE_CON` | Módulo 10, concurrencia | Sin causalidad |
| `RESPALDADO_POR` | `referencias` de cada ficha | Trazabilidad |
| `PROHIBE` | Interpretaciones NO admisibles | **Arista de bloqueo** |
| `APLICA_A` | Población de la referencia | Alcance |

La arista `PROHIBE` es la más importante y la que distingue este grafo de una base de
conocimiento convencional: no describe lo que se sabe, sino lo que **no puede afirmarse**. Un
motor de IA debe consultarla *antes* de generar texto, no después.

**Ninguna arista es causal.** El grafo no contendrá `CAUSA`. Es una decisión de diseño derivada
de P4 (módulo 01), no una limitación técnica.

---

## Fases

### Fase 1 · Completar la verificación bibliográfica
**Antes que cualquier trabajo técnico.** Un grafo construido sobre una base incompleta propaga
sus huecos con apariencia de completitud, que es peor que el hueco visible.

Trabajo concreto en el módulo 12 §10: cerrar las 2 fichas `pendiente` y buscar los 5 tipos de
fuente que faltan, en particular evidencia sobre población sana entrenada.

### Fase 2 · Extractor
Parser de Markdown + YAML que produzca nodos y aristas. Determinista y sin pérdida: toda
afirmación del grafo debe poder rastrearse al fichero y sección de origen.

Criterio de aceptación: la extracción es reproducible y un nodo sin `RESPALDADO_POR` no entra.

### Fase 3 · Validación del grafo
Comprobaciones análogas a las que ya hace el Analysis Engine sobre los datos:
- Toda ficha `verificado` tiene al menos una arista `RESPALDADO_POR`.
- Ninguna referencia citada falta en `referencias.yaml`.
- Toda ficha con `variables_bcs` apunta a claves reales del catálogo BCS.
- Ninguna arista `DERIVA_DE` se presenta como `CONCURRE_CON`.

### Fase 4 · Capa de consulta
API de solo lectura sobre el grafo. Contrato mínimo:
`consultar(variable | patron) → { conceptos, evidencia, poblacion, prohibiciones }`

**La respuesta incluye siempre las prohibiciones.** No es un campo opcional.

### Fase 5 · Integración con el Recommendation Engine
Hoy ese motor declara 5 ámbitos sin respaldo. El grafo permitiría convertir alguno en regla
citable — pero **solo si la Fase 1 encuentra la evidencia**. Si no la encuentra, el ámbito sigue
declarado como limitación. El grafo no crea autoridad, solo la organiza.

### Fase 6 · AI Observation Generator
Último eslabón. Un generador que redacte observaciones consultando el grafo, con dos
restricciones no negociables:
1. No puede afirmar nada que no tenga un nodo `Evidencia` alcanzable.
2. Debe consultar las aristas `PROHIBE` de toda variable implicada antes de redactar.

---

## Riesgo principal

El riesgo no es técnico. Es que la existencia del grafo genere confianza desproporcionada
respecto a la evidencia que contiene.

Una base con 13 referencias verificadas y 2 fichas abiertas, presentada como «Knowledge Graph
clínico», invita a asumir una solidez que hoy no tiene. La mitigación es que el grafo exponga
siempre `nivel_evidencia` y `poblacion` en cada respuesta, y que ningún consumidor pueda
consultarlo sin recibirlos.
