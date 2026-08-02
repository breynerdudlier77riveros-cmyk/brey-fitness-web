// ── Estructura de navegación del Testing Handbook v1.0 (17 módulos) ───────
// Única fuente de verdad para sidebar + breadcrumbs. layout.js la consume
// en cada página; el TOC ("en esta página") se genera aparte, escaneando
// los <h2> reales del documento, para que nunca se desincronice del
// contenido.

const BREY_NAV = [
  {
    group: "Empezar",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Filosofía de Testing", path: "../01-filosofia-testing/index.html", id: "filosofia-testing" },
    ],
  },
  {
    group: "Fundamentos",
    items: [
      { num: "02", title: "Arquitectura de Pruebas", path: "../02-arquitectura-pruebas/index.html", id: "arquitectura-pruebas" },
      { num: "03", title: "Convenciones Globales", path: "../03-convenciones-globales/index.html", id: "convenciones-globales" },
    ],
  },
  {
    group: "Niveles",
    items: [
      { num: "04", title: "Unit Testing", path: "../04-unit-testing/index.html", id: "unit-testing" },
      { num: "05", title: "Domain Testing", path: "../05-domain-testing/index.html", id: "domain-testing" },
      { num: "06", title: "Engine Testing", path: "../06-engine-testing/index.html", id: "engine-testing" },
      { num: "07", title: "FSM Testing", path: "../07-fsm-testing/index.html", id: "fsm-testing" },
      { num: "08", title: "Event Testing", path: "../08-event-testing/index.html", id: "event-testing" },
    ],
  },
  {
    group: "Superficies",
    items: [
      { num: "09", title: "Database Testing", path: "../09-database-testing/index.html", id: "database-testing" },
      { num: "10", title: "API Testing", path: "../10-api-testing/index.html", id: "api-testing" },
      { num: "11", title: "UI Testing", path: "../11-ui-testing/index.html", id: "ui-testing" },
      { num: "12", title: "Regression Testing", path: "../12-regression-testing/index.html", id: "regression-testing" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "13", title: "Coverage", path: "../13-coverage/index.html", id: "coverage" },
      { num: "14", title: "Testing ADR", path: "../14-testing-adr/index.html", id: "testing-adr" },
      { num: "15", title: "Anti-patterns", path: "../15-anti-patterns/index.html", id: "anti-patterns" },
      { num: "16", title: "Preguntas Abiertas", path: "../16-preguntas-abiertas/index.html", id: "preguntas-abiertas" },
    ],
  },
];

// Mapa plano id → { title, groupLabel } para breadcrumbs rápidos.
const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
