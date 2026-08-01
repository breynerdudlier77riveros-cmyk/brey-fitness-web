// ── Estructura de navegación del Handbook v1.0 (15 módulos) ─────────────
// Única fuente de verdad para sidebar + breadcrumbs. layout.js la consume
// en cada página; el TOC ("en esta página") se genera aparte, escaneando
// los <h2> reales del documento, para que nunca se desincronice del
// contenido.

const BREY_NAV = [
  {
    group: "Empezar",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Principios Fundamentales", path: "../01-principios/index.html", id: "principios" },
    ],
  },
  {
    group: "Arquitectura",
    items: [
      { num: "02", title: "Arquitectura General", path: "../02-arquitectura-general/index.html", id: "arquitectura-general" },
      { num: "03", title: "Training Framework", path: "../03-training-framework/index.html", id: "training-framework" },
      { num: "04", title: "Knowledge Base", path: "../04-knowledge-base/index.html", id: "knowledge-base" },
    ],
  },
  {
    group: "Motores",
    items: [
      { num: "05", title: "Progression Engine", path: "../05-progression-engine/index.html", id: "progression-engine" },
      { num: "06", title: "Recovery Engine", path: "../06-recovery-engine/index.html", id: "recovery-engine" },
      { num: "07", title: "Motor BPS", path: "../07-motor-bps/index.html", id: "motor-bps" },
    ],
  },
  {
    group: "Ejecución",
    items: [
      { num: "08", title: "Workout Generator", path: "../08-workout-generator/index.html", id: "workout-generator" },
      { num: "09", title: "Workout Player", path: "../09-workout-player/index.html", id: "workout-player" },
    ],
  },
  {
    group: "Plataforma",
    items: [
      { num: "10", title: "Arquitectura de Datos", path: "../10-arquitectura-datos/index.html", id: "arquitectura-datos" },
      { num: "11", title: "API Interna", path: "../11-api-interna/index.html", id: "api-interna" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "12", title: "Decisiones (ADR)", path: "../12-adr/index.html", id: "adr" },
      { num: "13", title: "Roadmap", path: "../13-roadmap/index.html", id: "roadmap" },
      { num: "14", title: "Glosario", path: "../14-glosario/index.html", id: "glosario" },
    ],
  },
];

// Mapa plano id → { title, groupLabel } para breadcrumbs rápidos.
const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
