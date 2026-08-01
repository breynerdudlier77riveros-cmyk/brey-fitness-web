// ── Estructura de navegación del Content Lifecycle Handbook v1.0 (18 módulos) ─
// Única fuente de verdad para sidebar + breadcrumbs. layout.js la consume en
// cada página; el TOC ("en esta página") se genera aparte, escaneando los
// <h2> reales del documento, para que nunca se desincronice del contenido.

const BREY_NAV = [
  {
    group: "Empezar",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Filosofía", path: "../01-filosofia/index.html", id: "filosofia" },
      { num: "02", title: "Barrido Documental", path: "../02-barrido/index.html", id: "barrido" },
    ],
  },
  {
    group: "El ciclo",
    items: [
      { num: "03", title: "Nacimiento", path: "../03-nacimiento/index.html", id: "nacimiento" },
      { num: "04", title: "Validez y Vigencia", path: "../04-validez/index.html", id: "validez" },
      { num: "05", title: "Autoridad", path: "../05-autoridad/index.html", id: "autoridad" },
      { num: "06", title: "Publicación", path: "../06-publicacion/index.html", id: "publicacion" },
    ],
  },
  {
    group: "Estados y versiones",
    items: [
      { num: "07", title: "Estados", path: "../07-estados/index.html", id: "estados" },
      { num: "08", title: "Máquinas de Estado", path: "../08-fsm/index.html", id: "fsm" },
      { num: "09", title: "Versionado", path: "../09-versionado/index.html", id: "versionado" },
      { num: "10", title: "Compatibilidad Histórica", path: "../10-compatibilidad/index.html", id: "compatibilidad" },
    ],
  },
  {
    group: "Garantías",
    items: [
      { num: "11", title: "Trazabilidad y Auditoría", path: "../11-trazabilidad/index.html", id: "trazabilidad" },
      { num: "12", title: "Corrección y Rollback", path: "../12-correccion/index.html", id: "correccion" },
      { num: "13", title: "Evidencia Científica", path: "../13-evidencia-cientifica/index.html", id: "evidencia-cientifica" },
      { num: "14", title: "Impacto Aguas Abajo", path: "../14-impacto/index.html", id: "impacto" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "15", title: "Matriz del Ciclo", path: "../15-matriz/index.html", id: "matriz" },
      { num: "16", title: "ADR y Anti-patterns", path: "../16-adr-antipatterns/index.html", id: "adr-antipatterns" },
      { num: "17", title: "Deudas y Roadmap", path: "../17-deudas-roadmap/index.html", id: "deudas-roadmap" },
    ],
  },
];

// Mapa plano id → { title, groupLabel } para breadcrumbs rápidos.
const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
