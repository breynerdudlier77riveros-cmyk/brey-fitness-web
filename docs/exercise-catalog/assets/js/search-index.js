// ── Índice de búsqueda — Exercise Catalog v1.0 ────────────────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  { title: "Introducción", module: "Empezar", url: "modules/00-introduccion/index.html", keywords: "qué es el catálogo qué no es contrato source of truth cero fichas cero ejercicios dependencias" },
  { title: "Filosofía", module: "Empezar", url: "modules/01-filosofia/index.html", keywords: "CT-01 CT-08 existencia condicional slug identidad tagging validaciones un ejercicio solo existe cuando" },
  { title: "Modelo de Exercise", module: "El contrato", url: "modules/02-modelo-exercise/index.html", keywords: "21 atributos obligatorios opcionales derivados reservados obsoletos matriz completa estatuto" },
  { title: "Identidad", module: "El contrato", url: "modules/03-identidad/index.html", keywords: "slug nombre nombreIngles alias sinónimos versionado estado identidad permanente P15 deuda" },
  { title: "Clasificación", module: "El contrato", url: "modules/04-clasificacion/index.html", keywords: "patrón rol modalidad equipamiento zonas taxonomy no redefinir referencia delegada" },
  { title: "Compatibilidades", module: "El contrato", url: "modules/05-compatibilidades/index.html", keywords: "sistema equipo nivel modalidad lesiones hemofilia espacio tiempo objetivos fases bloques deuda" },
  { title: "Variaciones", module: "Relaciones", url: "modules/06-variaciones/index.html", keywords: "variantes texto libre precursor sin estructura nunca parseado cadena relación indefinida" },
  { title: "Regresiones", module: "Relaciones", url: "modules/07-regresiones/index.html", keywords: "cadena anterior eslabón retroceso PE-031 escalón 3 dificultad decreciente" },
  { title: "Progresiones", module: "Relaciones", url: "modules/08-progresiones/index.html", keywords: "cadena siguiente eslabón avance PE-003 techo de repeticiones patrón corporal carga externa" },
  { title: "Mapa de Relaciones", module: "Relaciones", url: "modules/09-relaciones/index.html", keywords: "exercise variaciones progresiones regresiones cadena patrón jerarquía entidad-relación" },
  { title: "Integridad", module: "Ciclo de vida", url: "modules/10-integridad/index.html", keywords: "inválido rechazado sin patronPrimario ciclo integridad referencial vocabulario cerrado" },
  { title: "Estados", module: "Ciclo de vida", url: "modules/11-estados/index.html", keywords: "draft approved deprecated archived deuda documental no existe FSM Domain Model cinco entidades" },
  { title: "Versionado", module: "Ciclo de vida", url: "modules/12-versionado/index.html", keywords: "versión de catálogo BPS-023 ADR-009 R-2 inmutabilidad por ejercicio deuda deprecación" },
  { title: "Mantenimiento", module: "Ciclo de vida", url: "modules/13-mantenimiento/index.html", keywords: "P14 quién autoriza criterio de entrenador cola editorial Contenido Roadmap responsabilidad" },
  { title: "Validaciones", module: "Ciclo de vida", url: "modules/14-validaciones/index.html", keywords: "checklist publicación estructural contenido aceptar rechazar catálogo completo" },
  { title: "ADR", module: "Gobernanza", url: "modules/15-adr/index.html", keywords: "CT-ADR decisiones documentales delegación sin reglas nuevas estados versionado" },
  { title: "Anti-patterns", module: "Gobernanza", url: "modules/16-anti-patterns/index.html", keywords: "CTA errores catálogo ficha incompleta publicar sin validar duplicar vocabulario borrar ejercicio" },
  { title: "Roadmap y Auditoría", module: "Gobernanza", url: "modules/17-roadmap/index.html", keywords: "auditoría cuantitativa bloqueantes porcentaje 60% 19 ejercicios criterio editorial dependencias" },
];
