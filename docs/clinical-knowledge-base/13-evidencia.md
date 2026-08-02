---
modulo: 13
titulo: Marco de evaluación de la evidencia
tipo: fundacional
estado: verificado
---

# 13 · Marco de evaluación de la evidencia

Cómo se admite, gradúa y verifica una fuente en esta base.

---

## Fuentes admitidas

| Admitida | No admitida |
|---|---|
| Revisiones sistemáticas y metaanálisis | Blogs y divulgación |
| Position stands y consensus statements | Páginas comerciales y material de fabricante |
| Guías de sociedades científicas (ISAK, ESPEN, ACSM, NSCA, EASO, The Obesity Society, WHO) | Enciclopedias colaborativas |
| Estudios observacionales, con su población declarada | Comunicaciones a congreso sin publicación |
| Preprints, **etiquetados como tales** | Opinión personal o experiencia clínica no publicada |

Los preprints se admiten con etiqueta explícita y degradación automática del nivel de
evidencia. En `referencias.yaml`, `bia_dxa_ukbiobank` es el único caso y está marcado.

---

## Escala de nivel de evidencia

| Nivel | Criterio |
|---|---|
| **alto** | Consenso de sociedad científica, o metaanálisis concordante, **en población aplicable** |
| **moderado** | Revisión sistemática o narrativa sólida, o evidencia concordante con limitaciones de población o diseño |
| **bajo** | Estudios aislados, o evidencia sólida en población no aplicable a BREY |
| **insuficiente** | No se localizó fuente admisible |

El valor `bajo_para_poblacion_brey`, usado en el módulo 05, es una variante deliberada: señala
evidencia fuerte **en su propio dominio** que no es trasladable al nuestro. Distinguir eso de
«evidencia débil» importa, porque la corrección no es buscar mejores estudios en hemodiálisis
sino buscar estudios en otra población.

---

## Procedimiento de verificación aplicado en v1.0

1. Búsqueda de la fuente por título, organización o tema.
2. Confirmación de existencia y localización de un identificador estable (DOI, PubMed, PMC, URL
   institucional).
3. Registro en `_evidencia/referencias.yaml` **solo con los campos confirmados**.
4. Los campos no confirmados se omiten. Varias entradas carecen de autoría por este motivo.
5. Registro de `verificado_el`.

**Qué no se hizo.** No se leyó el texto completo de todas las publicaciones; en varios casos la
verificación llegó al resumen y a los metadatos. Es una limitación real de esta v1.0 y está
declarada aquí en lugar de sugerir una revisión más profunda de la efectuada. El estándar ISAK,
además, es un documento normativo de pago: se verificó la existencia del estándar y de su
esquema de acreditación, no el texto íntegro.

---

## Cobertura por módulo en v1.0

| Módulo | Estado | Fichas | Nota |
|---|---|---|---|
| 00 Introducción | Completo | — | Fundacional |
| 01 Principios | Completo | 7 principios | Derivados de las fuentes verificadas |
| 02 Modelos | Completo | 1 | |
| 03 Masa muscular | Completo | 3 | |
| 04 Masa grasa | **Parcial** | 2 (1 pendiente) | Grasa visceral sin fuente admisible |
| 05 Agua corporal | **Parcial** | 3 (1 pendiente) | Relación glucógeno-agua sin cifra citable |
| 06 Bioimpedancia | Completo | 4 | Módulo con evidencia más sólida |
| 07 Metabolismo basal | Completo | 2 | |
| 08 Antropométricos | Completo | 3 | |
| 09 Patrones | Completo | 4 | |
| 10 Relaciones | Completo | Mapa | Base del futuro grafo |
| 11 Calidad | Completo | 3 | |
| 12 Limitaciones | Completo | 10 secciones | |
| 13 Evidencia | Completo | — | Este módulo |
| 14 Glosario | Completo | — | |
| 15 Referencias | Completo | 13 entradas | |
| 16 ADR | Completo | 6 decisiones | |
| 17 Roadmap | Completo | — | |

**Resumen.** 18 módulos, 13 referencias verificadas, 22 fichas de concepto, **2 declaradas
`pendiente`** por ausencia de fuente admisible.

Que dos fichas queden abiertas no es un defecto de esta entrega: es el resultado de aplicar la
política de citación en lugar de rellenarlas.
