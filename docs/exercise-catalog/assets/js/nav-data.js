// ── Estructura de navegación del Exercise Catalog v1.0 (18 módulos) ────────
// Única fuente de verdad para sidebar + breadcrumbs. layout.js la consume en
// cada página; el TOC ("en esta página") se genera aparte, escaneando los
// <h2> reales del documento, para que nunca se desincronice del contenido.

const BREY_NAV = [
  {
    group: "Empezar",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Filosofía", path: "../01-filosofia/index.html", id: "filosofia" },
    ],
  },
  {
    group: "El contrato",
    items: [
      { num: "02", title: "Modelo de Exercise", path: "../02-modelo-exercise/index.html", id: "modelo-exercise" },
      { num: "03", title: "Identidad", path: "../03-identidad/index.html", id: "identidad" },
      { num: "04", title: "Clasificación", path: "../04-clasificacion/index.html", id: "clasificacion" },
      { num: "05", title: "Compatibilidades", path: "../05-compatibilidades/index.html", id: "compatibilidades" },
    ],
  },
  {
    group: "Relaciones",
    items: [
      { num: "06", title: "Variaciones", path: "../06-variaciones/index.html", id: "variaciones" },
      { num: "07", title: "Regresiones", path: "../07-regresiones/index.html", id: "regresiones" },
      { num: "08", title: "Progresiones", path: "../08-progresiones/index.html", id: "progresiones" },
      { num: "09", title: "Mapa de Relaciones", path: "../09-relaciones/index.html", id: "relaciones" },
    ],
  },
  {
    group: "Ciclo de vida",
    items: [
      { num: "10", title: "Integridad", path: "../10-integridad/index.html", id: "integridad" },
      { num: "11", title: "Estados", path: "../11-estados/index.html", id: "estados" },
      { num: "12", title: "Versionado", path: "../12-versionado/index.html", id: "versionado" },
      { num: "13", title: "Mantenimiento", path: "../13-mantenimiento/index.html", id: "mantenimiento" },
      { num: "14", title: "Validaciones", path: "../14-validaciones/index.html", id: "validaciones" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "15", title: "ADR", path: "../15-adr/index.html", id: "adr" },
      { num: "16", title: "Anti-patterns", path: "../16-anti-patterns/index.html", id: "anti-patterns" },
      { num: "17", title: "Roadmap y Auditoría", path: "../17-roadmap/index.html", id: "roadmap" },
    ],
  },
];

// Mapa plano id → { title, groupLabel } para breadcrumbs rápidos.
const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
