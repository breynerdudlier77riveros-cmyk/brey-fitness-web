---
modulo: 10
titulo: Calidad de la evidencia
estado: v1.0
---

# 10 · Calidad de la evidencia

Cómo se gradúa el nivel de evidencia de cada afirmación de esta base.

## Los cinco niveles

| Nivel | Criterio |
|---|---|
| **Alta** | Metaanálisis o revisión sistemática consistente, población claramente definida, **validez de constructo** demostrada |
| **Moderada** | Revisión sistemática o metaanálisis con limitaciones declaradas, o respaldo de fiabilidad sin validez de constructo |
| **Baja** | Estudio primario, o revisión con hallazgos heterogéneos, o validez de criterio débil |
| **Muy baja** | Evidencia indirecta, poblaciones no correspondientes, o metodología no verificable |
| **Insuficiente** | No se localizó fuente admisible, o la localizada no responde a la pregunta |

## Criterio de degradación

Una afirmación **baja de nivel** cuando:

1. La población de la fuente no corresponde a la de aplicación.
2. La fuente documenta fiabilidad y se pretende usar para validez.
3. Los estudios incluidos son heterogéneos sin explicación.
4. La medida de referencia no es un patrón oro.
5. La fuente declara sus propias reservas.

El punto 2 es el que más aplica en esta base: casi toda la literatura de evaluación física
verificada aquí es de fiabilidad.

## Distribución en v1.0

| Nivel | Correspondencias |
|---|---|
| Alta | **0** |
| Moderada | 5 — M-01, M-02, M-03, M-06, M-07 |
| Baja | 2 — M-04, M-05 |
| Muy baja | 0 |
| Insuficiente | El resto |

**Cero afirmaciones de nivel alto.** Es el dato más importante del módulo y no debe suavizarse.

## Por qué no hay nivel alto

Alcanzar «alta» exige validez de constructo demostrada. Ninguna de las once pruebas la tiene en
las fuentes verificadas:

| Prueba | Qué está demostrado | Qué falta |
|---|---|---|
| 1RM, IMTP | Que se repiten bien | Que representen «fuerza máxima» como dimensión |
| Agarre | Asociación poblacional con desenlaces de salud | Que represente fuerza de otras regiones |
| CMJ | Que se repite bien | Que la altura sea potencia |
| RSI | Asociación con rendimiento | Qué mide exactamente el índice |
| Sit-and-reach | Correlación moderada con extensibilidad isquiosural | Que represente «flexibilidad» |
| 20-m shuttle | Correlación con VO2máx | Qué ecuación usar en quién |
| Y-Balance | Que se repite bien y discrimina | Que represente «equilibrio» como capacidad |
| FMS | — | Todo |

## Sobre las fuentes admitidas

Position stands, consensus statements, revisiones sistemáticas, metaanálisis y guías de sociedades
científicas, en revistas revisadas por pares.

**Excluidas sin excepción:** blogs, canales de vídeo, páginas comerciales y material promocional
de un producto de evaluación.

La exclusión de fuentes comerciales no es una formalidad. Buena parte del material sobre FMS y
Y-Balance procede de quienes venden la formación, la certificación y el instrumental. Ese material
presenta sistemáticamente como establecido justo lo que las revisiones independientes no
sostienen — la predicción de lesión.

## Verificación

Cada entrada de `_evidencia/referencias.yaml` se localizó y comprobó antes de registrarse. Los
campos no confirmados se **omiten**.

| | |
|---|---|
| Referencias registradas | **16** |
| Con autoría completa verificada | 9 |
| Con autoría parcial o sin verificar | 4 — se omite el campo y se declara en `nota` |
| Corporativas o normativas | 3 — ACSM, ISAK |
| Con DOI o PMID | 11 |

Las cuatro entradas con autoría omitida son deliberadas. Escribir un apellido probable para que la
ficha «quede completa» es exactamente lo que esta base prohíbe.
