// ── Estructura de navegación del Exercise Tagging Handbook v1.0 (18 módulos) ─
// Única fuente de verdad para sidebar + breadcrumbs. layout.js la consume en
// cada página; el TOC ("en esta página") se genera aparte, escaneando los
// <h2> reales del documento, para que nunca se desincronice del contenido.

const BREY_NAV = [
  {
    group: "Empezar",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Filosofía del Etiquetado", path: "../01-filosofia/index.html", id: "filosofia" },
    ],
  },
  {
    group: "El proceso",
    items: [
      { num: "02", title: "Jerarquía de Reglas", path: "../02-jerarquia-reglas/index.html", id: "jerarquia-reglas" },
      { num: "03", title: "Proceso Oficial", path: "../03-proceso-oficial/index.html", id: "proceso-oficial" },
    ],
  },
  {
    group: "Reglas por atributo",
    items: [
      { num: "04", title: "Patrones", path: "../04-patrones/index.html", id: "patrones" },
      { num: "05", title: "Roles", path: "../05-roles/index.html", id: "roles" },
      { num: "06", title: "Modalidad", path: "../06-modalidad/index.html", id: "modalidad" },
      { num: "07", title: "Equipamiento", path: "../07-equipamiento/index.html", id: "equipamiento" },
      { num: "08", title: "Zonas de Riesgo", path: "../08-zonas-riesgo/index.html", id: "zonas-riesgo" },
      { num: "09", title: "Cadena", path: "../09-cadena/index.html", id: "cadena" },
      { num: "10", title: "Capacidades y Nivel", path: "../10-capacidades-nivel/index.html", id: "capacidades-nivel" },
    ],
  },
  {
    group: "Consistencia",
    items: [
      { num: "11", title: "Híbridos y Conflictos", path: "../11-hibridos-conflictos/index.html", id: "hibridos-conflictos" },
      { num: "12", title: "Matrices de Consistencia", path: "../12-matrices-consistencia/index.html", id: "matrices-consistencia" },
      { num: "13", title: "Validaciones", path: "../13-validaciones/index.html", id: "validaciones" },
      { num: "14", title: "Checklist Oficial", path: "../14-checklist/index.html", id: "checklist" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "15", title: "Anti-patterns", path: "../15-anti-patterns/index.html", id: "anti-patterns" },
      { num: "16", title: "ADR", path: "../16-adr/index.html", id: "adr" },
      { num: "17", title: "Auditoría Final", path: "../17-auditoria/index.html", id: "auditoria" },
    ],
  },
];

// Mapa plano id → { title, groupLabel } para breadcrumbs rápidos.
const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
