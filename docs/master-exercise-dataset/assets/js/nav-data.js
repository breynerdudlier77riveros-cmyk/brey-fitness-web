// ── Estructura de navegación del BREY Master Exercise Dataset v1.0 ────────
// Especificación técnica en 18 secciones. Única fuente de verdad para
// sidebar + breadcrumbs; el TOC se genera escaneando los <h2> del documento.

const BREY_NAV = [
  {
    group: "Fundamento",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Filosofía del Dataset", path: "../01-filosofia/index.html", id: "filosofia" },
      { num: "02", title: "Arquitectura", path: "../02-arquitectura/index.html", id: "arquitectura" },
    ],
  },
  {
    group: "El Exercise",
    items: [
      { num: "03", title: "Identidad", path: "../03-identidad/index.html", id: "identidad" },
      { num: "04", title: "Modelo Oficial", path: "../04-modelo/index.html", id: "modelo" },
      { num: "05", title: "Organización", path: "../05-organizacion/index.html", id: "organizacion" },
    ],
  },
  {
    group: "Estabilidad",
    items: [
      { num: "06", title: "Versionado", path: "../06-versionado/index.html", id: "versionado" },
      { num: "07", title: "Compatibilidad", path: "../07-compatibilidad/index.html", id: "compatibilidad" },
      { num: "08", title: "Convenciones de Nombres", path: "../08-convenciones-nombres/index.html", id: "convenciones-nombres" },
      { num: "09", title: "IDs Permanentes", path: "../09-ids/index.html", id: "ids" },
      { num: "10", title: "Slugs", path: "../10-slugs/index.html", id: "slugs" },
    ],
  },
  {
    group: "Relaciones",
    items: [
      { num: "11", title: "Relaciones", path: "../11-relaciones/index.html", id: "relaciones" },
      { num: "12", title: "Variantes", path: "../12-variantes/index.html", id: "variantes" },
      { num: "13", title: "Progresiones", path: "../13-progresiones/index.html", id: "progresiones" },
      { num: "14", title: "Regresiones", path: "../14-regresiones/index.html", id: "regresiones" },
    ],
  },
  {
    group: "Operación",
    items: [
      { num: "15", title: "Mantenimiento", path: "../15-mantenimiento/index.html", id: "mantenimiento" },
      { num: "16", title: "Checklist de Alta", path: "../16-checklist/index.html", id: "checklist" },
      { num: "17", title: "Roadmap", path: "../17-roadmap/index.html", id: "roadmap" },
    ],
  },
];

// Mapa plano id → { title, groupLabel } para breadcrumbs rápidos.
const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
