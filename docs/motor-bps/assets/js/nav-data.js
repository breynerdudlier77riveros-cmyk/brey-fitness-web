// ── Navegación del Motor BPS Handbook (17 módulos) ──────────────────────
const BREY_NAV = [
  {
    group: "Fundamentos",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Filosofía", path: "../01-filosofia/index.html", id: "filosofia" },
      { num: "02", title: "Arquitectura General", path: "../02-arquitectura/index.html", id: "arquitectura" },
    ],
  },
  {
    group: "Contrato de datos",
    items: [
      { num: "03", title: "Entradas", path: "../03-entradas/index.html", id: "entradas" },
      { num: "04", title: "Salidas", path: "../04-salidas/index.html", id: "salidas" },
    ],
  },
  {
    group: "Comportamiento",
    items: [
      { num: "05", title: "Máquina de Estados", path: "../05-maquina-estados/index.html", id: "maquina-estados" },
      { num: "06", title: "Regla de Activación", path: "../06-regla-activacion/index.html", id: "regla-activacion" },
      { num: "07", title: "Pipeline interno", path: "../07-pipeline/index.html", id: "pipeline" },
      { num: "08", title: "Resolución de conflictos", path: "../08-conflictos/index.html", id: "conflictos" },
    ],
  },
  {
    group: "Reglas",
    items: [
      { num: "09", title: "Reglas de negocio", path: "../09-reglas/index.html", id: "reglas" },
      { num: "10", title: "Casos límite", path: "../10-casos-limite/index.html", id: "casos-limite" },
      { num: "11", title: "Algoritmo conceptual", path: "../11-algoritmo/index.html", id: "algoritmo" },
    ],
  },
  {
    group: "Sistema",
    items: [
      { num: "12", title: "Integración", path: "../12-integracion/index.html", id: "integracion" },
      { num: "13", title: "Observabilidad", path: "../13-observabilidad/index.html", id: "observabilidad" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "14", title: "Riesgos", path: "../14-riesgos/index.html", id: "riesgos" },
      { num: "15", title: "Decisiones (ADR)", path: "../15-adr/index.html", id: "adr" },
      { num: "16", title: "Preguntas abiertas", path: "../16-preguntas/index.html", id: "preguntas" },
    ],
  },
];

const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
