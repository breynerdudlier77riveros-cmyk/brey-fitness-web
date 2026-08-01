// ── Estructura de navegación del Exercise Taxonomy Handbook v1.0 (18 módulos) ─
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
    group: "El ejercicio",
    items: [
      { num: "02", title: "Ontología del Ejercicio", path: "../02-ontologia-ejercicio/index.html", id: "ontologia-ejercicio" },
      { num: "03", title: "Identidad", path: "../03-identidad/index.html", id: "identidad" },
      { num: "04", title: "Clasificación", path: "../04-clasificacion/index.html", id: "clasificacion" },
    ],
  },
  {
    group: "Ejes de clasificación",
    items: [
      { num: "05", title: "Patrones", path: "../05-patrones/index.html", id: "patrones" },
      { num: "06", title: "Roles", path: "../06-roles/index.html", id: "roles" },
      { num: "07", title: "Modalidades", path: "../07-modalidades/index.html", id: "modalidades" },
      { num: "08", title: "Equipamiento", path: "../08-equipamiento/index.html", id: "equipamiento" },
      { num: "09", title: "Capacidades Físicas", path: "../09-capacidades-fisicas/index.html", id: "capacidades-fisicas" },
    ],
  },
  {
    group: "Relaciones",
    items: [
      { num: "10", title: "Training Framework", path: "../10-training-framework/index.html", id: "training-framework" },
      { num: "11", title: "Workout Generator", path: "../11-workout-generator/index.html", id: "workout-generator" },
      { num: "12", title: "Progression Engine", path: "../12-progression-engine/index.html", id: "progression-engine" },
      { num: "13", title: "Knowledge Base", path: "../13-knowledge-base/index.html", id: "knowledge-base" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "14", title: "Anti-patterns", path: "../14-anti-patterns/index.html", id: "anti-patterns" },
      { num: "15", title: "ADR", path: "../15-adr/index.html", id: "adr" },
      { num: "16", title: "Preguntas Abiertas", path: "../16-preguntas-abiertas/index.html", id: "preguntas-abiertas" },
      { num: "17", title: "Autoauditoría", path: "../17-autoauditoria/index.html", id: "autoauditoria" },
    ],
  },
];

// Mapa plano id → { title, groupLabel } para breadcrumbs rápidos.
const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
