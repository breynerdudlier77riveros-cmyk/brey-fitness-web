// ── Navegación del Domain Model Handbook (17 módulos) ────────────────────
const BREY_NAV = [
  {
    group: "Fundamentos",
    items: [
      { num: "00", title: "Introducción", path: "../00-introduccion/index.html", id: "introduccion" },
      { num: "01", title: "Lenguaje Ubicuo", path: "../01-lenguaje-ubicuo/index.html", id: "lenguaje-ubicuo" },
      { num: "02", title: "Arquitectura del Dominio", path: "../02-arquitectura-dominio/index.html", id: "arquitectura-dominio" },
    ],
  },
  {
    group: "Entidades",
    items: [
      { num: "03", title: "Entidades del Core Training", path: "../03-entidades-core-training/index.html", id: "entidades-core-training" },
      { num: "04", title: "Entidades de Diagnóstico", path: "../04-entidades-diagnostico/index.html", id: "entidades-diagnostico" },
      { num: "05", title: "Entidades de Progresión y Recuperación", path: "../05-entidades-progresion-recuperacion/index.html", id: "entidades-progresion-recuperacion" },
      { num: "06", title: "Entidades de Composición Corporal", path: "../06-entidades-composicion-corporal/index.html", id: "entidades-composicion-corporal" },
      { num: "07", title: "Objetos de Valor", path: "../07-objetos-valor/index.html", id: "objetos-valor" },
    ],
  },
  {
    group: "Estructura",
    items: [
      { num: "08", title: "Agregados y Ownership", path: "../08-agregados-ownership/index.html", id: "agregados-ownership" },
      { num: "09", title: "Relaciones del Dominio", path: "../09-relaciones-dominio/index.html", id: "relaciones-dominio" },
      { num: "10", title: "Máquinas de Estado", path: "../10-maquinas-estado/index.html", id: "maquinas-estado" },
    ],
  },
  {
    group: "Comportamiento",
    items: [
      { num: "11", title: "Eventos del Dominio", path: "../11-eventos-dominio/index.html", id: "eventos-dominio" },
      { num: "12", title: "Invariantes Globales", path: "../12-invariantes-globales/index.html", id: "invariantes-globales" },
    ],
  },
  {
    group: "Implementación futura",
    items: [
      { num: "13", title: "Mapeo a Persistencia", path: "../13-mapeo-persistencia/index.html", id: "mapeo-persistencia" },
      { num: "14", title: "Anti-Patrones", path: "../14-anti-patrones/index.html", id: "anti-patrones" },
    ],
  },
  {
    group: "Gobernanza",
    items: [
      { num: "15", title: "ADR del Modelo de Dominio", path: "../15-adr/index.html", id: "adr" },
      { num: "16", title: "Preguntas Abiertas", path: "../16-preguntas-abiertas/index.html", id: "preguntas-abiertas" },
    ],
  },
];

const BREY_NAV_FLAT = {};
BREY_NAV.forEach((g) => g.items.forEach((it) => (BREY_NAV_FLAT[it.id] = { title: it.title, group: g.group, num: it.num })));
