// ── Estructura de navegación del API Contract Handbook v1.0 (17 módulos) ──
// Única fuente de verdad para sidebar + breadcrumbs. layout.js la consume
// en cada página; el TOC ("en esta página") se genera aparte, escaneando
// los <h2> reales del documento, para que nunca se desincronice del
// contenido.

const BREY_NAV = [
  {
    group: "Empezar",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Filosofía de API", path: "../01-filosofia-api/index.html", id: "filosofia-api" },
    ],
  },
  {
    group: "Acceso",
    items: [
      { num: "02", title: "Arquitectura General", path: "../02-arquitectura-general/index.html", id: "arquitectura-general" },
      { num: "03", title: "Autenticación", path: "../03-autenticacion/index.html", id: "autenticacion" },
    ],
  },
  {
    group: "Convenciones",
    items: [
      { num: "04", title: "Convenciones HTTP", path: "../04-convenciones-http/index.html", id: "convenciones-http" },
      { num: "05", title: "Convenciones de Requests", path: "../05-convenciones-requests/index.html", id: "convenciones-requests" },
      { num: "06", title: "Convenciones de Responses", path: "../06-convenciones-responses/index.html", id: "convenciones-responses" },
    ],
  },
  {
    group: "Contrato",
    items: [
      { num: "07", title: "Catálogo de Endpoints", path: "../07-catalogo-endpoints/index.html", id: "catalogo-endpoints" },
      { num: "08", title: "DTO Oficiales", path: "../08-dto-oficiales/index.html", id: "dto-oficiales" },
    ],
  },
  {
    group: "Operación",
    items: [
      { num: "09", title: "Errores", path: "../09-errores/index.html", id: "errores" },
      { num: "10", title: "Versionado", path: "../10-versionado/index.html", id: "versionado" },
      { num: "11", title: "Idempotencia", path: "../11-idempotencia/index.html", id: "idempotencia" },
      { num: "12", title: "Rate Limiting", path: "../12-rate-limiting/index.html", id: "rate-limiting" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "13", title: "Seguridad", path: "../13-seguridad/index.html", id: "seguridad" },
      { num: "14", title: "Observabilidad", path: "../14-observabilidad/index.html", id: "observabilidad" },
      { num: "15", title: "API-ADR", path: "../15-api-adr/index.html", id: "api-adr" },
      { num: "16", title: "Preguntas Abiertas", path: "../16-preguntas-abiertas/index.html", id: "preguntas-abiertas" },
    ],
  },
];

// Mapa plano id → { title, groupLabel } para breadcrumbs rápidos.
const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
