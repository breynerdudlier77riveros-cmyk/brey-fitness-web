// ── Estructura de navegación del Database Handbook v1.0 (17 módulos) ──────
// Única fuente de verdad para sidebar + breadcrumbs. layout.js la consume
// en cada página; el TOC ("en esta página") se genera aparte, escaneando
// los <h2> reales del documento, para que nunca se desincronice del
// contenido.

const BREY_NAV = [
  {
    group: "Empezar",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Filosofía de Persistencia", path: "../01-filosofia-persistencia/index.html", id: "filosofia-persistencia" },
    ],
  },
  {
    group: "Modelo",
    items: [
      { num: "02", title: "Modelo Global", path: "../02-modelo-global/index.html", id: "modelo-global" },
      { num: "03", title: "Tablas Oficiales", path: "../03-tablas-oficiales/index.html", id: "tablas-oficiales" },
      { num: "04", title: "Columnas", path: "../04-columnas/index.html", id: "columnas" },
      { num: "05", title: "Relaciones", path: "../05-relaciones/index.html", id: "relaciones" },
    ],
  },
  {
    group: "Esquema físico",
    items: [
      { num: "06", title: "Índices", path: "../06-indices/index.html", id: "indices" },
      { num: "07", title: "Constraints", path: "../07-constraints/index.html", id: "constraints" },
      { num: "08", title: "Eventos Persistidos", path: "../08-eventos-persistidos/index.html", id: "eventos-persistidos" },
      { num: "09", title: "RLS", path: "../09-rls/index.html", id: "rls" },
    ],
  },
  {
    group: "Operación",
    items: [
      { num: "10", title: "Consistencia", path: "../10-consistencia/index.html", id: "consistencia" },
      { num: "11", title: "Evolución", path: "../11-evolucion/index.html", id: "evolucion" },
      { num: "12", title: "Performance", path: "../12-performance/index.html", id: "performance" },
      { num: "13", title: "Seguridad", path: "../13-seguridad/index.html", id: "seguridad" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "14", title: "Anti-patrones", path: "../14-antipatrones/index.html", id: "antipatrones" },
      { num: "15", title: "DB-ADR", path: "../15-db-adr/index.html", id: "db-adr" },
      { num: "16", title: "Preguntas Abiertas", path: "../16-preguntas-abiertas/index.html", id: "preguntas-abiertas" },
    ],
  },
];

// Mapa plano id → { title, groupLabel } para breadcrumbs rápidos.
const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
