// ── Estructura de navegación del Editorial Standards Handbook v1.0 (18 módulos) ─
// Única fuente de verdad para sidebar + breadcrumbs. layout.js la consume en
// cada página; el TOC ("en esta página") se genera aparte, escaneando los
// <h2> reales del documento, para que nunca se desincronice del contenido.

const BREY_NAV = [
  {
    group: "Empezar",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Filosofía Editorial", path: "../01-filosofia/index.html", id: "filosofia" },
    ],
  },
  {
    group: "Gobierno",
    items: [
      { num: "02", title: "Ciclo de Vida", path: "../02-ciclo-vida/index.html", id: "ciclo-vida" },
      { num: "03", title: "Roles Editoriales", path: "../03-roles/index.html", id: "roles" },
      { num: "04", title: "Flujo Editorial", path: "../04-flujo/index.html", id: "flujo" },
      { num: "05", title: "Autoridad", path: "../05-autoridad/index.html", id: "autoridad" },
    ],
  },
  {
    group: "Garantías",
    items: [
      { num: "06", title: "Evidencia", path: "../06-evidencia/index.html", id: "evidencia" },
      { num: "07", title: "Versionado", path: "../07-versionado/index.html", id: "versionado" },
      { num: "08", title: "Trazabilidad", path: "../08-trazabilidad/index.html", id: "trazabilidad" },
      { num: "09", title: "Control de Calidad", path: "../09-control-calidad/index.html", id: "control-calidad" },
      { num: "10", title: "Revisión", path: "../10-revision/index.html", id: "revision" },
    ],
  },
  {
    group: "Operación",
    items: [
      { num: "11", title: "Conflictos", path: "../11-conflictos/index.html", id: "conflictos" },
      { num: "12", title: "Mantenimiento", path: "../12-mantenimiento/index.html", id: "mantenimiento" },
      { num: "13", title: "Integración", path: "../13-integracion/index.html", id: "integracion" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "14", title: "ADR Editoriales", path: "../14-adr/index.html", id: "adr" },
      { num: "15", title: "Anti-patterns", path: "../15-anti-patterns/index.html", id: "anti-patterns" },
      { num: "16", title: "Deuda Editorial", path: "../16-deuda-editorial/index.html", id: "deuda-editorial" },
      { num: "17", title: "Roadmap y Auditoría", path: "../17-roadmap/index.html", id: "roadmap" },
    ],
  },
];

// Mapa plano id → { title, groupLabel } para breadcrumbs rápidos.
const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
