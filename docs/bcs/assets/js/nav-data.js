// ── Navegación del BCS Handbook (18 módulos) ─────────────────────────────
const BREY_NAV = [
  {
    group: "Fundamentos",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Arquitectura", path: "../01-arquitectura/index.html", id: "arquitectura" },
    ],
  },
  {
    group: "Dominio y datos",
    items: [
      { num: "02", title: "Modelo del Dominio", path: "../02-modelo-dominio/index.html", id: "modelo-dominio" },
      { num: "03", title: "Modelo de Datos", path: "../03-modelo-datos/index.html", id: "modelo-datos" },
    ],
  },
  {
    group: "Reporte",
    items: [
      { num: "04", title: "Modelo del Reporte", path: "../04-modelo-reporte/index.html", id: "modelo-reporte" },
      { num: "05", title: "Modelo del Historial", path: "../05-modelo-historial/index.html", id: "modelo-historial" },
      { num: "06", title: "Modelo de Interpretación", path: "../06-modelo-interpretacion/index.html", id: "modelo-interpretacion" },
      { num: "07", title: "Modelo de Visualización", path: "../07-modelo-visualizacion/index.html", id: "modelo-visualizacion" },
    ],
  },
  {
    group: "Acceso y datos sensibles",
    items: [
      { num: "08", title: "Seguridad", path: "../08-seguridad/index.html", id: "seguridad" },
      { num: "09", title: "Compartición", path: "../09-comparticion/index.html", id: "comparticion" },
      { num: "10", title: "Links Públicos", path: "../10-links-publicos/index.html", id: "links-publicos" },
      { num: "11", title: "Privacidad", path: "../11-privacidad/index.html", id: "privacidad" },
    ],
  },
  {
    group: "Sistema y gobernanza",
    items: [
      { num: "12", title: "Escalabilidad", path: "../12-escalabilidad/index.html", id: "escalabilidad" },
      { num: "13", title: "API Interna", path: "../13-api-interna/index.html", id: "api-interna" },
      { num: "14", title: "Roadmap", path: "../14-roadmap/index.html", id: "roadmap" },
      { num: "15", title: "Glosario", path: "../15-glosario/index.html", id: "glosario" },
      { num: "16", title: "ADR", path: "../16-adr/index.html", id: "adr" },
      { num: "17", title: "Preguntas abiertas", path: "../17-preguntas/index.html", id: "preguntas" },
    ],
  },
];

const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
