// ── Navegación del Engineering Handbook (17 módulos) ─────────────────────
const BREY_NAV = [
  {
    group: "Fundamentos",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Filosofía Técnica", path: "../01-filosofia-tecnica/index.html", id: "filosofia-tecnica" },
      { num: "02", title: "Arquitectura General", path: "../02-arquitectura-general/index.html", id: "arquitectura-general" },
    ],
  },
  {
    group: "Capas",
    items: [
      { num: "03", title: "Frontend Architecture", path: "../03-frontend-architecture/index.html", id: "frontend-architecture" },
      { num: "04", title: "Backend Architecture", path: "../04-backend-architecture/index.html", id: "backend-architecture" },
      { num: "05", title: "Database Handbook", path: "../05-database-handbook/index.html", id: "database-handbook" },
    ],
  },
  {
    group: "Contratos",
    items: [
      { num: "06", title: "API Handbook", path: "../06-api-handbook/index.html", id: "api-handbook" },
      { num: "07", title: "Domain Events", path: "../07-domain-events/index.html", id: "domain-events" },
    ],
  },
  {
    group: "Calidad y operación",
    items: [
      { num: "08", title: "Security Handbook", path: "../08-security-handbook/index.html", id: "security-handbook" },
      { num: "09", title: "Performance Handbook", path: "../09-performance-handbook/index.html", id: "performance-handbook" },
      { num: "10", title: "Testing Handbook", path: "../10-testing-handbook/index.html", id: "testing-handbook" },
      { num: "11", title: "Observability Handbook", path: "../11-observability-handbook/index.html", id: "observability-handbook" },
      { num: "12", title: "Deployment Handbook", path: "../12-deployment-handbook/index.html", id: "deployment-handbook" },
    ],
  },
  {
    group: "Estándares y gobernanza",
    items: [
      { num: "13", title: "Coding Standards", path: "../13-coding-standards/index.html", id: "coding-standards" },
      { num: "14", title: "ADR", path: "../14-adr/index.html", id: "adr" },
      { num: "15", title: "Roadmap", path: "../15-roadmap/index.html", id: "roadmap" },
      { num: "16", title: "Glosario", path: "../16-glosario/index.html", id: "glosario" },
    ],
  },
];

const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
