// ── Estructura de navegación del BREY Anatomical Vocabulary v1.0 ──────────
// Vocabulario cerrado en 5 secciones. Única fuente de verdad para
// sidebar + breadcrumbs; el TOC se genera escaneando los <h2> del documento.

const BREY_NAV = [
  {
    group: "Fundamento",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Modelo", path: "../01-modelo/index.html", id: "modelo" },
    ],
  },
  {
    group: "Vocabulario",
    items: [
      { num: "02", title: "Catálogo", path: "../02-vocabulario/index.html", id: "vocabulario" },
      { num: "03", title: "Sinónimos", path: "../03-sinonimos/index.html", id: "sinonimos" },
    ],
  },
  {
    group: "Operación",
    items: [
      { num: "04", title: "Validación e Integración", path: "../04-validacion/index.html", id: "validacion" },
    ],
  },
];

// Índice plano id → { title, group, num } para breadcrumbs.
const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => {
  g.items.forEach((it) => {
    BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num };
  });
});
