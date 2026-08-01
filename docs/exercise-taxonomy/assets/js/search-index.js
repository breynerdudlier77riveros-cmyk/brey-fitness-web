// ── Índice de búsqueda — Exercise Taxonomy Handbook v1.0 ──────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  // 00
  { title: "Introducción", module: "Empezar", url: "modules/00-introduccion/index.html", keywords: "propósito alcance no alcance SSoT jerarquía documental cero clasificación nueva deuda documental derivado" },

  // 01
  { title: "Filosofía", module: "Empezar", url: "modules/01-filosofia/index.html", keywords: "TX-01 TX-08 principios vocabulario cerrado P7 P14 P15 P11 criterio humano etiquetado slug estable" },

  // 02
  { title: "Ontología del Ejercicio", module: "El ejercicio", url: "modules/02-ontologia-ejercicio/index.html", keywords: "qué es un ejercicio fronteras prescripción workout log slot plantilla movimiento entidad instancia" },

  // 03
  { title: "Identidad", module: "El ejercicio", url: "modules/03-identidad/index.html", keywords: "slug nombre nombreIngles alias identidad estable P15 inmutable renombrar identificador" },

  // 04
  { title: "Clasificación", module: "El ejercicio", url: "modules/04-clasificacion/index.html", keywords: "atributos obligatorio opcional derivado calculado nunca persistido matriz 15 atributos existentes faltantes" },

  // 05
  { title: "Patrones", module: "Ejes de clasificación", url: "modules/05-patrones/index.html", keywords: "9 patrones empuje horizontal vertical tracción dominante rodilla cadera core locomocion rotacion-potencia degradación reservado" },

  // 06
  { title: "Roles", module: "Ejes de clasificación", url: "modules/06-roles/index.html", keywords: "5 roles activacion principal accesorio core-final metabolico R-4 orden fatiga volumen productivo" },

  // 07
  { title: "Modalidades", module: "Ejes de clasificación", url: "modules/07-modalidades/index.html", keywords: "dinamico isometrico bilateral unilateral modalidad contador cronómetro reps segundos equivalencias" },

  // 08
  { title: "Equipamiento", module: "Ejes de clasificación", url: "modules/08-equipamiento/index.html", keywords: "barra mancuernas maquina peso-corporal cables kettlebell Track gym casa ambos elegible" },

  // 09
  { title: "Capacidades Físicas", module: "Ejes de clasificación", url: "modules/09-capacidades-fisicas/index.html", keywords: "capacidad prerequisito demostrable gates calistenia comoSeDemuestra capacidadesRequeridas cualidad física deuda" },

  // 10
  { title: "Training Framework", module: "Relaciones", url: "modules/10-training-framework/index.html", keywords: "15 capas slot patrón rol plantilla instancia R-1 R-2 R-3 R-4 bloque mesociclo microciclo prescripción" },

  // 11
  { title: "Workout Generator", module: "Relaciones", url: "modules/11-workout-generator/index.html", keywords: "resolverEjercicioParaSlot sustitución degradación CATALOGO_INSUFICIENTE determinismo orden estable desnormalizado" },

  // 12
  { title: "Progression Engine", module: "Relaciones", url: "modules/12-progression-engine/index.html", keywords: "cadena eslabón PE-003 PE-012 avance retroceso carga externa patrón corporal progresión regresión" },

  // 13
  { title: "Knowledge Base", module: "Relaciones", url: "modules/13-knowledge-base/index.html", keywords: "ontología instancia catálogo 5 consumidores contrato zonas riesgo validación estructural" },

  // 14
  { title: "Anti-patterns", module: "Gobernanza", url: "modules/14-anti-patterns/index.html", keywords: "TXA anti-patrón inferir del nombre parsear notas fórmula reps segundos vocabulario duplicado" },

  // 15
  { title: "ADR", module: "Gobernanza", url: "modules/15-adr/index.html", keywords: "TX-ADR decisiones arquitectura registro colisión core hombro capacidad nivel" },

  // 16
  { title: "Preguntas Abiertas", module: "Gobernanza", url: "modules/16-preguntas-abiertas/index.html", keywords: "TX-Q deuda documental sin decidir roadmap atributos inexistentes" },

  // 17
  { title: "Autoauditoría", module: "Gobernanza", url: "modules/17-autoauditoria/index.html", keywords: "métricas contradicciones vocabularios duplicados inconsistencias cobertura verificación" },
];
