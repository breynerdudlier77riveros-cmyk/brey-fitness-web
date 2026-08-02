// ── Navegación del BCS Design System Handbook (22 módulos) ──────────────
const BREY_NAV = [
  {
    group: "Fundamentos",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Filosofía visual", path: "../01-filosofia-visual/index.html", id: "filosofia-visual" },
      { num: "02", title: "Arquitectura de experiencia", path: "../02-arquitectura-experiencia/index.html", id: "arquitectura-experiencia" },
    ],
  },
  {
    group: "Sistema visual",
    items: [
      { num: "03", title: "Sistema de Layout", path: "../03-sistema-layout/index.html", id: "sistema-layout" },
      { num: "04", title: "Sistema tipográfico", path: "../04-sistema-tipografico/index.html", id: "sistema-tipografico" },
      { num: "05", title: "Sistema de color", path: "../05-sistema-color/index.html", id: "sistema-color" },
    ],
  },
  {
    group: "Componentes y pantallas",
    items: [
      { num: "06", title: "Componentes", path: "../06-componentes/index.html", id: "componentes" },
      { num: "07", title: "Dashboard del entrenador", path: "../07-dashboard-entrenador/index.html", id: "dashboard-entrenador" },
      { num: "08", title: "Vista pública del cliente", path: "../08-vista-publica-cliente/index.html", id: "vista-publica-cliente" },
    ],
  },
  {
    group: "Datos y visualización",
    items: [
      { num: "09", title: "Visualización de métricas", path: "../09-visualizacion-metricas/index.html", id: "visualizacion-metricas" },
      { num: "10", title: "Sistema de barras", path: "../10-sistema-barras/index.html", id: "sistema-barras" },
      { num: "11", title: "Sistema de gráficos", path: "../11-sistema-graficos/index.html", id: "sistema-graficos" },
      { num: "12", title: "Comparaciones", path: "../12-comparaciones/index.html", id: "comparaciones" },
    ],
  },
  {
    group: "Comportamiento",
    items: [
      { num: "13", title: "Estados", path: "../13-estados/index.html", id: "estados" },
      { num: "14", title: "Exportación", path: "../14-exportacion/index.html", id: "exportacion" },
      { num: "15", title: "Accesibilidad", path: "../15-accesibilidad/index.html", id: "accesibilidad" },
      { num: "16", title: "Motion System", path: "../16-motion-system/index.html", id: "motion-system" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "17", title: "Design Tokens", path: "../17-design-tokens/index.html", id: "design-tokens" },
      { num: "18", title: "Casos especiales", path: "../18-casos-especiales/index.html", id: "casos-especiales" },
      { num: "19", title: "Roadmap", path: "../19-roadmap/index.html", id: "roadmap" },
      { num: "20", title: "ADR", path: "../20-adr/index.html", id: "adr" },
      { num: "21", title: "Glosario", path: "../21-glosario/index.html", id: "glosario" },
    ],
  },
];

const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
