// ── Índice de búsqueda — Domain Model Handbook v1.0 ───────────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  // 00
  { title: "Introducción", module: "Fundamentos", url: "modules/00-introduccion/index.html", keywords: "objetivo alcance no alcance relación con otros handbooks regla de prioridad documental" },

  // 01
  { title: "Lenguaje Ubicuo", module: "Fundamentos", url: "modules/01-lenguaje-ubicuo/index.html", keywords: "LU-01 LU-21 cliente usuario entrenador diagnóstico programa sistema track nivel bloque mesociclo microciclo workout slot ejercicio serie prescripción recuperación fatiga medición reporte enlace público sinónimos términos prohibidos" },
  { title: "Programa — nota de desambiguación", module: "01 · Lenguaje Ubicuo", url: "modules/01-lenguaje-ubicuo/index.html", keywords: "LU-06 sistema instancia personalizada redirect programas" },

  // 02
  { title: "Arquitectura del Dominio", module: "Fundamentos", url: "modules/02-arquitectura-dominio/index.html", keywords: "bounded context core training recovery progression diagnostics body composition reporting identity mapa de contextos dependencias" },

  // 03
  { title: "Entidades del Core Training", module: "Entidades", url: "modules/03-entidades-core-training/index.html", keywords: "CT-01 CT-08 programa bloque mesociclo microciclo workout slot ejercicio serie identidad atributos relaciones ciclo de vida invariantes" },

  // 04
  { title: "Entidades de Diagnóstico", module: "Entidades", url: "modules/04-entidades-diagnostico/index.html", keywords: "DX-01 DX-04 diagnóstico respuesta resultadodiagnóstico perfilentrenamiento nivel_actual nivel_experiencia ADR-003" },

  // 05
  { title: "Entidades de Progresión y Recuperación", module: "Entidades", url: "modules/05-entidades-progresion-recuperacion/index.html", keywords: "PR-01 PR-06 prescripción evaluaciónprogresión eventoprogresión estadorecuperación señalfatiga descarga persistente derivado efímero IMP-ADR-01" },

  // 06
  { title: "Entidades de Composición Corporal", module: "Entidades", url: "modules/06-entidades-composicion-corporal/index.html", keywords: "BC-01 BC-05 cliente medición historialmediciones reporte enlacepúblico BCS-ADR-01" },

  // 07
  { title: "Objetos de Valor", module: "Entidades", url: "modules/07-objetos-valor/index.html", keywords: "VO-01 VO-13 peso altura porcentajegrasa masamuscular imc ángulofase rpe rir dolor fatiga tiempodescanso tempo duración representa unidades comparabilidad validación" },

  // 08
  { title: "Agregados y Ownership", module: "Estructura", url: "modules/08-agregados-ownership/index.html", keywords: "aggregate root usuario diagnóstico workout workoutlog cliente medición enlacepúblico eventoprogresión BCS-ADR-01 por qué no son raíces" },

  // 09
  { title: "Relaciones del Dominio", module: "Estructura", url: "modules/09-relaciones-dominio/index.html", keywords: "cardinalidades ownership navegación permitida prohibida trece diagramas mermaid usuario cliente sin relación" },

  // 10
  { title: "Máquinas de Estado", module: "Estructura", url: "modules/10-maquinas-estado/index.html", keywords: "diagnóstico programa workout medición enlacepúblico estados transiciones válidas inválidas recuperación estado corrupto" },

  // 11
  { title: "Eventos del Dominio", module: "Comportamiento", url: "modules/11-eventos-dominio/index.html", keywords: "35 eventos activacion avanza sostiene retrocede prescripcion_actualizada deload cliente_creado medicion_registrada enlace_creado progression_events productor consumidor payload idempotencia" },

  // 12
  { title: "Invariantes Globales", module: "Comportamiento", url: "modules/12-invariantes-globales/index.html", keywords: "IN-01 IN-31 crítica alta media medición sin cliente workout sin programa serie fuera de un slot diagnóstico completado sin resultado" },

  // 13
  { title: "Mapeo a Persistencia", module: "Implementación futura", url: "modules/13-mapeo-persistencia/index.html", keywords: "persistente derivable efímero entidad persistencia esperada sin SQL" },

  // 14
  { title: "Anti-Patrones", module: "Implementación futura", url: "modules/14-anti-patrones/index.html", keywords: "AP-01 AP-06 god client workout mutable evento como estado diagnóstico embebido en cliente métricas derivadas persistidas enlace público como permiso" },

  // 15
  { title: "ADR del Modelo de Dominio", module: "Gobernanza", url: "modules/15-adr/index.html", keywords: "DM-ADR-01 DM-ADR-08 cliente separado de usuario workout inmutable prescripción persistente recovery derivado enlace público desacoplado eventos append-only diagnóstico versionado métricas on-demand" },

  // 16
  { title: "Preguntas Abiertas", module: "Gobernanza", url: "modules/16-preguntas-abiertas/index.html", keywords: "PA-01 PA-12 múltiples entrenadores versionan programas archivan diagnósticos comparar mediciones dispositivos programas colaborativos sin resolver" },
];
