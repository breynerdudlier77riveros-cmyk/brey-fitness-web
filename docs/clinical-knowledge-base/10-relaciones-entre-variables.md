---
modulo: 10
titulo: Relaciones entre variables
tipo: fundacional
estado: verificado
nivel_evidencia_modulo: moderado
---

# 10 · Relaciones entre variables

Responde a la pregunta *qué variables suelen evolucionar juntas*. Es el módulo con mayor valor
directo para el futuro Knowledge Graph: cada fila de las tablas siguientes es una arista
candidata.

---

## Tipos de relación

Distinguirlos es obligatorio en esta base. Confundirlos produce afirmaciones causales
injustificadas.

| Tipo | Significado | Ejemplo |
|---|---|---|
| **Derivación** | Una se calcula a partir de la otra | Masa grasa ← peso × %graso |
| **Composición** | Una contiene a la otra | Masa libre de grasa ⊃ músculo |
| **Estructural** | Coexisten en el mismo tejido | Músculo ↔ agua intracelular |
| **Concurrente** | Se mueven juntas sin que una explique a la otra | Peso ↔ agua corporal |

Ninguna de las cuatro es causal. **Esta base no registra ninguna relación causal entre variables
de composición corporal**, porque el dato no contiene la causa (P4, módulo 01).

---

## Mapa de relaciones

### Derivación — el error se propaga

| Origen | Derivada | Nota |
|---|---|---|
| Peso, talla | IMC | Fórmula universal |
| Peso, % graso | Masa grasa | Hereda el error de ambos |
| Peso, masa grasa | Masa libre de grasa | Hereda el error acumulado |
| Cintura, cadera | WHR | Sensible al error del operador |
| Masa muscular, talla | SMI | Sin consenso de fórmula única |
| Composición estimada | Metabolismo basal | En la mayoría de dispositivos |
| Metabolismo basal, promedio poblacional | Edad metabólica | Fórmula propietaria |

**Consecuencia.** Una variable derivada nunca aporta información independiente de sus orígenes.
Si el peso está mal medido, todo lo que cuelga de él lo está.

### Composición y estructura

| Relación | Tipo |
|---|---|
| Masa libre de grasa ⊃ músculo, hueso, agua, órganos | Composición |
| Agua total = intracelular + extracelular | Composición (identidad) |
| Peso = masa grasa + masa libre de grasa | Composición (identidad) |
| Músculo ↔ agua intracelular | Estructural |
| Masa libre de grasa ↔ metabolismo basal | Estructural |

### Concurrencia observada

| Variables | Contexto | Referencia |
|---|---|---|
| ↓ peso + ↓ % graso + ↑ músculo | Recomposición | `barakat_recomposicion_2020` |
| ↓ peso + ↓ músculo + ↓ agua intracelular | Pérdida con componente magro | `barakat_recomposicion_2020` |
| ↑ peso + ↑ agua sin ↑ grasa | Hídrico o tejido magro | Módulo 09 |
| ↑ agua extracelular relativa | Estudiado en poblaciones clínicas | `ecw_tbw_hemodialisis_2023` |

---

## Advertencia sobre correlación en variables derivadas

Buena parte de las correlaciones observables entre variables de un informe de bioimpedancia son
**artefactos de derivación**, no hallazgos biológicos: el dispositivo calculó unas a partir de
otras.

Que la masa libre de grasa correlacione con el metabolismo basal no demuestra nada fisiológico
si el dispositivo calculó el segundo a partir de la primera.

**Consecuencia para el Knowledge Graph.** Las aristas de tipo `derivacion` deben marcarse
explícitamente, para que ningún consumidor las interprete como evidencia de asociación.
