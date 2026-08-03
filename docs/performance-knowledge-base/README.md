# Performance Knowledge Base (PKB) v1.0

Autoridad científica del Performance Assessment System. Es al PAS lo que la Clinical Knowledge
Base es al BCS: **la única fuente autorizada** para afirmar qué mide una prueba, a qué capacidad
puede alimentar y qué no puede concluirse de ella.

La PKB **no interpreta atletas**. Documenta conocimiento científico y nada más.

---

## El resultado que importa

De las **220 correspondencias posibles** (11 pruebas documentadas × 20 capacidades), la PKB
v1.0 autoriza **7**, que cubren **6 capacidades**. Ninguna con evidencia alta.

| Estado | Correspondencias |
|---|---|
| Respaldada | **0** |
| Parcialmente respaldada | **7** |
| Insuficiente | 5 |
| No recomendada | 5 |
| Sin evidencia | 203 |

**Doce de las dieciocho capacidades activas del PAS quedan sin ninguna prueba autorizada.** No es
un fallo del trabajo: es el estado real de la evidencia una vez que se exige que cada
correspondencia cite una revisión sistemática, un metaanálisis o un documento normativo. La
alternativa —rellenar la matriz con correlaciones plausibles— es exactamente lo que esta base
existe para impedir.

Ver `09-matriz-prueba-capacidad.md`.

---

## Regla de admisión

> Ninguna afirmación entra sin referencia verificada. Si la evidencia no alcanza, se escribe
> **«Evidencia insuficiente»** y se deja así.

No se extrapola entre poblaciones. No se infiere una capacidad desde otra. No se convierte una
correlación en una equivalencia.

## Fuentes admitidas

Position stands, consensus statements, revisiones sistemáticas, metaanálisis y guías de
sociedades científicas (ACSM, NSCA, ISAK, IOC), publicados en revistas revisadas por pares.

**Nunca** blogs, canales de vídeo, páginas comerciales ni material promocional de un producto de
evaluación. La exclusión de fuentes comerciales importa especialmente aquí: buena parte del
material sobre FMS y Y-Balance Test procede de quienes venden la formación y el instrumental.

## Cómo leer esta base

| Fichero | Contenido |
|---|---|
| `00-introduccion.md` | Qué es la PKB, qué no es, cómo se usa |
| `01-capacidades.md` | Las 20 capacidades del PAS y su evidencia disponible |
| `02-pruebas.md` | Fichas de prueba: qué mide, qué no mide, límites |
| `03-poblaciones.md` | Poblaciones estudiadas y regla de no extrapolación |
| `04-fiabilidad.md` | Reproducibilidad: ICC, CV, error típico |
| `05-validez.md` | Validez de criterio, constructo y contenido |
| `06-sensibilidad.md` | Capacidad de detectar cambio real |
| `07-limitaciones.md` | Qué limita cada medición |
| `08-interpretaciones-prohibidas.md` | Lo que el PAS jamás podrá afirmar |
| `09-matriz-prueba-capacidad.md` | **El núcleo:** correspondencias con su nivel de evidencia |
| `10-calidad-evidencia.md` | Cómo se gradúa el nivel de evidencia |
| `11-contradicciones.md` | Dónde la literatura se contradice |
| `12-roadmap.md` | Qué falta y en qué orden |
| `13-adr.md` | Decisiones documentales |
| `14-glosario.md` | Lenguaje congelado |
| `_evidencia/referencias.yaml` | Registro único de referencias verificadas |

## Relación con el resto del ecosistema

| | |
|---|---|
| **Alimenta a** | El catálogo del PAE (`src/lib/pas/`), que recibe las correspondencias como dato |
| **No toca** | El motor. La PKB es documentación; el PAE no la importa |
| **Vecina de** | La Clinical Knowledge Base: comparten política de citación y la referencia `isak_estandares`, nada más |

El PAE quedó implementado en el Sprint PAS-2.0 sin ninguna correspondencia dentro, precisamente
para que llegaran de aquí. Esta base es lo que le permite dejar de devolver 20 capacidades
desconocidas — y también lo que le impide devolver más de las que la evidencia sostiene.
