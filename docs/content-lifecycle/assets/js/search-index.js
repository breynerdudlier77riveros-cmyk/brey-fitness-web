// ── Índice de búsqueda — Content Lifecycle Handbook v1.0 ──────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  { title: "Introducción", module: "Empezar", url: "modules/00-introduccion/index.html", keywords: "ciclo de vida gobierno del contenido qué es qué no es 30 preguntas jerarquía documental" },
  { title: "Filosofía", module: "Empezar", url: "modules/01-filosofia/index.html", keywords: "CL-01 CL-08 reconstruir no inventar evidencia ausencia declarada P14 P3 R-2" },
  { title: "Barrido Documental", module: "Empezar", url: "modules/02-barrido/index.html", keywords: "48 términos palabra completa subcadena falsos positivos Architecture Review status HTTP History Card rollback migración" },
  { title: "Nacimiento", module: "El ciclo", url: "modules/03-nacimiento/index.html", keywords: "cómo nace cuándo existe CT-01 cuatro condiciones tagging siete pasos sin disparador" },
  { title: "Validez y Vigencia", module: "El ciclo", url: "modules/04-validez/index.html", keywords: "cuándo deja de ser válida vigente elegible completitud sin caducidad sin revisión periódica" },
  { title: "Autoridad", module: "El ciclo", url: "modules/05-autoridad/index.html", keywords: "crear modificar aprobar rechazar retirar P14 Contenido Ingeniería Documentación sin rol" },
  { title: "Publicación", module: "El ciclo", url: "modules/06-publicacion/index.html", keywords: "publicar despublicar significado checklist 23 ítems cero apariciones deuda" },
  { title: "Estados", module: "Estados y versiones", url: "modules/07-estados/index.html", keywords: "draft approved deprecated obsolete archive cero apariciones estados implícitos derivados" },
  { title: "Máquinas de Estado", module: "Estados y versiones", url: "modules/08-fsm/index.html", keywords: "FSM Domain Model cinco entidades Exercise no figura Motor BPS 15 transiciones cero para Exercise" },
  { title: "Versionado", module: "Estados y versiones", url: "modules/09-versionado/index.html", keywords: "versión de catálogo BPS-023 ADR-009 API contratos por entrada inexistente changelog" },
  { title: "Compatibilidad Histórica", module: "Estados y versiones", url: "modules/10-compatibilidad/index.html", keywords: "R-2 inmutabilidad desnormalización P5 I-G2 slug histórico reproducibilidad" },
  { title: "Trazabilidad y Auditoría", module: "Garantías", url: "modules/11-trazabilidad/index.html", keywords: "P2 P3 eventos origen razones replay determinista decisiones humanas sin registro" },
  { title: "Corrección y Rollback", module: "Garantías", url: "modules/12-correccion/index.html", keywords: "corregir rollback migración no existe mecanismo formal ADR supersede edición silenciosa" },
  { title: "Evidencia Científica", module: "Garantías", url: "modules/13-evidencia-cientifica/index.html", keywords: "cuatro badges consenso sólido evidencia moderada hipótesis decisión de producto cambio de evidencia" },
  { title: "Impacto Aguas Abajo", module: "Garantías", url: "modules/14-impacto/index.html", keywords: "Workout Generator Training Framework programas existentes R-2 no propaga siguiente generación" },
  { title: "Matriz del Ciclo", module: "Gobernanza", url: "modules/15-matriz/index.html", keywords: "proceso autoridad registro 12 pasos 36 celdas 38,9% cuantitativa" },
  { title: "ADR y Anti-patterns", module: "Gobernanza", url: "modules/16-adr-antipatterns/index.html", keywords: "CL-ADR CLA decisiones documentales contradicciones registradas no resueltas" },
  { title: "Deudas y Roadmap", module: "Gobernanza", url: "modules/17-deudas-roadmap/index.html", keywords: "deudas checklist métricas porcentajes roadmap bloqueantes estado final" },
];
