# Performance Assessment System (PAS) v1.0 — Dominio congelado

Especificación de dominio del sistema que representa **el estado funcional, deportivo y
biomecánico de un atleta**.

Este documento **no contiene código, pseudocódigo, esquemas, contratos de API ni fórmulas**. Su
único producto es lenguaje congelado: entidades, relaciones, responsabilidades y límites.

---

## ⚠ Decisión de nombre que requiere tu confirmación

El encargo llamaba a este sistema *BREY Performance System (BPS)*. **Ese nombre ya está
ocupado.**

En el ecosistema existe, implementado y documentado:

| Ya existente | Este sistema |
|---|---|
| **Motor BPS** — «BPS / Brey Performance System» | El sistema que describe este documento |
| Orquestador del ciclo de vida del usuario | Representación del estado funcional del atleta |
| Estados: `sin_diagnostico`, `activo`, `en_pausa`, `sistema_completado`… | Capacidades, pruebas, perfil funcional |
| `src/lib/engines/bps/` · `docs/motor-bps/` (17 módulos) | Sin implementar |

Reutilizar el acrónimo haría que **tres términos centrales significaran dos cosas cada uno**:

- **BPS** → el orquestador, y también el sistema de evaluación.
- **Estado** → el estado de la máquina de estados del usuario, y también el estado físico del
  atleta.
- **Diagnóstico** → el Diagnóstico BPS (cuestionario de 7 preguntas que asigna un Sistema), y
  también la valoración funcional.

Un sprint cuyo objetivo declarado es *congelar el lenguaje* no puede entregar tres homónimos.

**Decisión adoptada, revisable por ti:**

1. El sistema se llama **Performance Assessment System (PAS)**.
2. Su salida se llama **Perfil Funcional**, nunca «diagnóstico».
3. La carpeta conserva el nombre que pediste: `docs/performance-system/`.

Ver `15-adr.md`, PAS-ADR-01. Si prefieres otro nombre, es una sustitución mecánica en estos
ficheros: ninguna decisión de dominio depende de él.

---

## Qué es y qué no es

| Es | No es |
|---|---|
| Un modelo de **estado** | Un motor de entrenamiento |
| Un catálogo de **capacidades** y **pruebas** | Una batería de tests con protocolos |
| Un sistema de **trazabilidad** de cómo se llegó a un perfil | Un sistema de puntuación |
| El insumo de otros motores | Un consumidor de otros motores |

**La pregunta que responde, y la única:** *¿cuál es el estado funcional actual del atleta?*

No responde qué entrenar, cuánto progresar, qué comer ni cuándo descansar. Esas preguntas
pertenecen a motores que aún no existen y que **consumirán** el Perfil Funcional.

---

## Cómo leer este documento

| Fichero | Contenido |
|---|---|
| `00-objetivo.md` | Objetivo, no-objetivos, límites y responsabilidades |
| `01-modelo-conceptual.md` | Entidades y relaciones |
| `02-state-model.md` | Qué es un estado: mutable, histórico, calculado, manual |
| `03-capacidades.md` | Catálogo de capacidades |
| `04-pruebas.md` | Catálogo de familias de prueba |
| `05-relaciones.md` | Prueba → capacidad → perfil → motores |
| `06-tipos-de-evaluacion.md` | Tipos de evaluación |
| `07-modelo-temporal.md` | Qué cambia, qué no, qué se versiona |
| `08-trazabilidad.md` | De dónde sale cada afirmación |
| `09-elegibilidad.md` | Cuándo una prueba puede participar |
| `10-incertidumbre.md` | Datos ausentes, viejos, contradictorios o anulados |
| `11-extensibilidad.md` | Añadir pruebas sin romper las existentes |
| `12-integracion-futura.md` | Contratos conceptuales con otros motores |
| `13-invariantes.md` | Reglas que nunca podrán romperse |
| `14-roadmap.md` | Sprints 2 a 6 |
| `15-adr.md` | Decisiones de dominio |
| `16-glosario.md` | Lenguaje congelado |

---

## Principio heredado del resto del ecosistema

> Nada que carezca de respaldo se inventa; se declara como pendiente.

Aplicado aquí tiene una consecuencia concreta y deliberada: **este documento define el mecanismo
por el que una prueba alimenta una capacidad, pero no fija ni una sola correspondencia
concreta.** Afirmar que una prueba determinada mide una capacidad determinada es una
afirmación científica, y este sprint no las produce. Esas correspondencias se decidirán en el
Sprint 3 con la Clinical Knowledge Base como autoridad — ver `05-relaciones.md` y `14-roadmap.md`.
