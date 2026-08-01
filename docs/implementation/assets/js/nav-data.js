// ── Navegación del Implementation Handbook (16 módulos) ──────────────────
const BREY_NAV = [
  {
    group: "Fundamentos",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Estrategia general", path: "../01-estrategia-general/index.html", id: "estrategia-general" },
      { num: "02", title: "Dependencias", path: "../02-dependencias/index.html", id: "dependencias" },
    ],
  },
  {
    group: "Planificación",
    items: [
      { num: "03", title: "Roadmap", path: "../03-roadmap/index.html", id: "roadmap" },
      { num: "04", title: "Orden de construcción", path: "../04-orden-construccion/index.html", id: "orden-construccion" },
    ],
  },
  {
    group: "Construcción",
    items: [
      { num: "05", title: "Migraciones", path: "../05-migraciones/index.html", id: "migraciones" },
      { num: "06", title: "Backend", path: "../06-backend/index.html", id: "backend" },
      { num: "07", title: "Frontend", path: "../07-frontend/index.html", id: "frontend" },
      { num: "08", title: "Motores", path: "../08-motores/index.html", id: "motores" },
      { num: "09", title: "Integración", path: "../09-integracion/index.html", id: "integracion" },
    ],
  },
  {
    group: "Calidad",
    items: [
      { num: "10", title: "Testing", path: "../10-testing/index.html", id: "testing" },
      { num: "11", title: "Observabilidad", path: "../11-observabilidad/index.html", id: "observabilidad" },
    ],
  },
  {
    group: "Checklists y gobernanza",
    items: [
      { num: "12", title: "Checklist por Feature", path: "../12-checklist-feature/index.html", id: "checklist-feature" },
      { num: "13", title: "Release Checklist", path: "../13-release-checklist/index.html", id: "release-checklist" },
      { num: "14", title: "ADR", path: "../14-adr/index.html", id: "adr" },
      { num: "15", title: "Glosario", path: "../15-glosario/index.html", id: "glosario" },
    ],
  },
];

const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
