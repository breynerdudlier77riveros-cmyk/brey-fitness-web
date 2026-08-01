// ── Navegación del Progression Engine Handbook (21 módulos) ─────────────
const BREY_NAV = [
  {
    group: "Fundamentos",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Filosofía", path: "../01-filosofia/index.html", id: "filosofia" },
      { num: "02", title: "Arquitectura", path: "../02-arquitectura/index.html", id: "arquitectura" },
    ],
  },
  {
    group: "Modelo",
    items: [
      { num: "03", title: "Modelo Conceptual", path: "../03-modelo-conceptual/index.html", id: "modelo-conceptual" },
      { num: "04", title: "Contrato de Entradas", path: "../04-contrato-entradas/index.html", id: "contrato-entradas" },
      { num: "05", title: "Modelo de Decisión", path: "../05-modelo-decision/index.html", id: "modelo-decision" },
      { num: "06", title: "Pipeline", path: "../06-pipeline/index.html", id: "pipeline" },
    ],
  },
  {
    group: "Reglas",
    items: [
      { num: "07", title: "Reglas de Negocio", path: "../07-reglas-negocio/index.html", id: "reglas-negocio" },
      { num: "08", title: "Microprogresión", path: "../08-microprogresion/index.html", id: "microprogresion" },
      { num: "09", title: "Macroprogresión", path: "../09-macroprogresion/index.html", id: "macroprogresion" },
      { num: "10", title: "Autorregulación", path: "../10-autorregulacion/index.html", id: "autorregulacion" },
      { num: "11", title: "Estancamiento", path: "../11-estancamiento/index.html", id: "estancamiento" },
      { num: "12", title: "Deload", path: "../12-deload/index.html", id: "deload" },
    ],
  },
  {
    group: "Sistema",
    items: [
      { num: "13", title: "Integración", path: "../13-integracion/index.html", id: "integracion" },
      { num: "14", title: "Observabilidad", path: "../14-observabilidad/index.html", id: "observabilidad" },
      { num: "15", title: "Arquitectura de Datos", path: "../15-arquitectura-datos/index.html", id: "arquitectura-datos" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "16", title: "ADR", path: "../16-adr/index.html", id: "adr" },
      { num: "17", title: "Riesgos", path: "../17-riesgos/index.html", id: "riesgos" },
      { num: "18", title: "Roadmap", path: "../18-roadmap/index.html", id: "roadmap" },
      { num: "19", title: "Preguntas abiertas", path: "../19-preguntas/index.html", id: "preguntas" },
      { num: "20", title: "Glosario", path: "../20-glosario/index.html", id: "glosario" },
    ],
  },
];

const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
