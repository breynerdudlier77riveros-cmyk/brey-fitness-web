// ── Índice de búsqueda (v1.0, 15 módulos) ────────────────────────────────
// Estático a propósito (no fetch): el handbook abre con file:// sin
// servidor, y fetch() entre páginas falla por CORS bajo file://. Una
// entrada por módulo + una por sección real (h2) relevante.

const BREY_SEARCH_INDEX = [
  // 00
  { title: "Introducción", module: "Empezar", url: "modules/00-introduccion/index.html", keywords: "propósito alcance objetivos filosofía handbook autoridad" },
  { title: "Qué es BREY", module: "00 · Introducción", url: "modules/00-introduccion/index.html#que-es", keywords: "sistema operativo entrenamiento BPS pilares" },
  { title: "Qué NO es BREY", module: "00 · Introducción", url: "modules/00-introduccion/index.html#que-no-es", keywords: "caja negra chatbot generador aleatorio" },
  { title: "Niveles de evidencia — ciencia marcada", module: "00 · Introducción", url: "modules/00-introduccion/index.html#filosofia", keywords: "consenso sólido moderada hipótesis decisión producto badges" },

  // 01
  { title: "Principios Fundamentales", module: "Empezar", url: "modules/01-principios/index.html", keywords: "16 principios precedencia P1 P16" },
  { title: "P1 Determinismo total", module: "01 · Principios", url: "modules/01-principios/index.html#p1", keywords: "misma entrada misma salida función pura" },
  { title: "P2 Explicabilidad obligatoria", module: "01 · Principios", url: "modules/01-principios/index.html#p2", keywords: "razones trazable" },
  { title: "P3 Historial inmutable", module: "01 · Principios", url: "modules/01-principios/index.html#p3", keywords: "auditable corrección evento" },
  { title: "P5 Plantilla ≠ Instancia", module: "01 · Principios", url: "modules/01-principios/index.html#p5", keywords: "inmutabilidad desnormalización" },
  { title: "P6 Fallo visible", module: "01 · Principios", url: "modules/01-principios/index.html#p6", keywords: "catálogo insuficiente default silencioso" },
  { title: "P7 Patrón sobre ejercicio", module: "01 · Principios", url: "modules/01-principios/index.html#p7" },
  { title: "P8 Seguridad antes que progreso", module: "01 · Principios", url: "modules/01-principios/index.html#p8", keywords: "recovery precedencia" },
  { title: "P10 Recomendar, no bloquear", module: "01 · Principios", url: "modules/01-principios/index.html#p10", keywords: "autonomía override" },
  { title: "P11 Evidencia marcada", module: "01 · Principios", url: "modules/01-principios/index.html#p11", keywords: "fisiología ciencia producto" },
  { title: "P16 Solo datos verdaderos", module: "01 · Principios", url: "modules/01-principios/index.html#p16", keywords: "sin mocks estados vacíos honestos" },
  { title: "Resolución de conflictos entre principios", module: "01 · Principios", url: "modules/01-principios/index.html#conflictos" },

  // 02
  { title: "Arquitectura General", module: "Arquitectura", url: "modules/02-arquitectura-general/index.html", keywords: "capas bounded contexts dependencias flujo maestro" },
  { title: "Bounded contexts", module: "02 · Arquitectura General", url: "modules/02-arquitectura-general/index.html#contexts", keywords: "identidad diagnóstico catálogo planificación ejecución" },
  { title: "Capas — dependencias hacia adentro", module: "02 · Arquitectura General", url: "modules/02-arquitectura-general/index.html#capas", keywords: "presentación aplicación dominio datos" },
  { title: "Metodología → dueño técnico", module: "02 · Arquitectura General", url: "modules/02-arquitectura-general/index.html#pilares", keywords: "pilares BPS correspondencia" },
  { title: "Flujo maestro extremo a extremo", module: "02 · Arquitectura General", url: "modules/02-arquitectura-general/index.html#flujo-maestro" },
  { title: "Invariantes de la arquitectura", module: "02 · Arquitectura General", url: "modules/02-arquitectura-general/index.html#invariantes", keywords: "I-1 I-2 I-3 RLS" },

  // 03
  { title: "Training Framework", module: "Arquitectura", url: "modules/03-training-framework/index.html", keywords: "jerarquía 15 capas sistema track nivel bloque mesociclo microciclo sesión" },
  { title: "Las 15 capas — definición completa", module: "03 · Training Framework", url: "modules/03-training-framework/index.html#capas" },
  { title: "Track (capa 2)", module: "03 · Training Framework", url: "modules/03-training-framework/index.html#c2", keywords: "gym casa ambos equipo" },
  { title: "Bloque (capa 4)", module: "03 · Training Framework", url: "modules/03-training-framework/index.html#c4", keywords: "énfasis fases periodización" },
  { title: "Mesociclo (capa 5)", module: "03 · Training Framework", url: "modules/03-training-framework/index.html#c5", keywords: "progresión semanal descarga programada" },
  { title: "Tempo (capa 14)", module: "03 · Training Framework", url: "modules/03-training-framework/index.html#c14", keywords: "cadencia excéntrica notación 3-1-1-0" },
  { title: "Notas (capa 15)", module: "03 · Training Framework", url: "modules/03-training-framework/index.html#c15", keywords: "texto libre nunca parseado" },
  { title: "Regla de Frecuencia (R-1)", module: "03 · Training Framework", url: "modules/03-training-framework/index.html#reglas", keywords: "dias_por_semana ideal real redistribución" },
  { title: "Ejemplo — cadena de 15 capas resuelta", module: "03 · Training Framework", url: "modules/03-training-framework/index.html#ejemplo" },

  // 04
  { title: "Knowledge Base", module: "Arquitectura", url: "modules/04-knowledge-base/index.html", keywords: "ontología patrones roles etiquetas sustitución equipamiento" },
  { title: "Patrones de movimiento", module: "04 · Knowledge Base", url: "modules/04-knowledge-base/index.html#patrones", keywords: "empuje tracción rodilla cadera core degradación" },
  { title: "Roles", module: "04 · Knowledge Base", url: "modules/04-knowledge-base/index.html#roles", keywords: "principal accesorio activacion core-final metabolico slot" },
  { title: "Zonas de riesgo articular", module: "04 · Knowledge Base", url: "modules/04-knowledge-base/index.html#zonas", keywords: "rodilla hombro lumbar lesión exclusión seguridad" },
  { title: "Atributos completos de un Ejercicio", module: "04 · Knowledge Base", url: "modules/04-knowledge-base/index.html#atributos", keywords: "modalidad isométrico cadena" },
  { title: "Capacidades (gates)", module: "04 · Knowledge Base", url: "modules/04-knowledge-base/index.html#capacidades", keywords: "muscle-up prerequisito calistenia" },
  { title: "Cadenas de progresión y regresión", module: "04 · Knowledge Base", url: "modules/04-knowledge-base/index.html#progresiones" },
  { title: "Algoritmo de sustitución (5 pasos)", module: "04 · Knowledge Base", url: "modules/04-knowledge-base/index.html#sustitucion", keywords: "resolverEjercicioParaSlot catálogo insuficiente determinismo empate" },

  // 05
  { title: "Progression Engine", module: "Motores", url: "modules/05-progression-engine/index.html", keywords: "sobrecarga autorregulación RPE RIR doble progresión" },
  { title: "Micro-ajuste — doble progresión", module: "05 · Progression", url: "modules/05-progression-engine/index.html#micro", keywords: "carga reps banda rpe nivel inicial" },
  { title: "Macro-evaluación — avance/retroceso", module: "05 · Progression", url: "modules/05-progression-engine/index.html#macro", keywords: "adherencia umbrales ventana escalones" },
  { title: "Estancamiento", module: "05 · Progression", url: "modules/05-progression-engine/index.html#estancamiento", keywords: "3 apariciones variación volumen" },
  { title: "Volumen, frecuencia e intensidad — posición", module: "05 · Progression", url: "modules/05-progression-engine/index.html#volumen-frecuencia", keywords: "series semanales dosis-respuesta" },
  { title: "Máquina de estados macro", module: "05 · Progression", url: "modules/05-progression-engine/index.html#estados" },

  // 06
  { title: "Recovery Engine", module: "Motores", url: "modules/06-recovery-engine/index.html", keywords: "fatiga descarga deload readiness sueño" },
  { title: "Modelo de fatiga — señales y pesos", module: "06 · Recovery", url: "modules/06-recovery-engine/index.html#modelo", keywords: "índice 0.5 0.3 0.2 HRV wearables check-in" },
  { title: "DOMS vs. dolor", module: "06 · Recovery", url: "modules/06-recovery-engine/index.html#doms-dolor", keywords: "agujetas articular bandera roja evaluación profesional" },
  { title: "Las dos descargas", module: "06 · Recovery", url: "modules/06-recovery-engine/index.html#descargas", keywords: "programada reactiva multiplicador" },
  { title: "Pseudocódigo — exigeDescarga, reportarDolor", module: "06 · Recovery", url: "modules/06-recovery-engine/index.html#algoritmo" },

  // 07
  { title: "Motor BPS", module: "Motores", url: "modules/07-motor-bps/index.html", keywords: "orquestador activación gates estados conflictos" },
  { title: "Regla de Activación (R-M1)", module: "07 · Motor BPS", url: "modules/07-motor-bps/index.html#reglas", keywords: "compra confirmada diagnóstico recomienda gate perfil" },
  { title: "Máquina de estados del usuario", module: "07 · Motor BPS", url: "modules/07-motor-bps/index.html#estados", keywords: "pendiente_perfil activo en_pausa sistema_completado" },
  { title: "Ciclo semanal del orquestador", module: "07 · Motor BPS", url: "modules/07-motor-bps/index.html#algoritmo", keywords: "orden recovery progression generator R-M4" },
  { title: "Entradas del Motor BPS", module: "07 · Motor BPS", url: "modules/07-motor-bps/index.html#entradas", keywords: "perfil fresco nivel_experiencia nunca" },

  // 08
  { title: "Workout Generator", module: "Ejecución", url: "modules/08-workout-generator/index.html", keywords: "ensamblador instancia semana fallback plantilla" },
  { title: "Pseudocódigo — generarSemana", module: "08 · Generator", url: "modules/08-workout-generator/index.html#algoritmo", keywords: "multiplicador descarga desnormalizado" },
  { title: "Regla de Recorte por tiempo (R-G2)", module: "08 · Generator", url: "modules/08-workout-generator/index.html#reglas", keywords: "duración metabólico core-final informar" },
  { title: "Idempotencia de generación", module: "08 · Generator", url: "modules/08-workout-generator/index.html#casos", keywords: "semana ya generada invalidación" },

  // 09
  { title: "Workout Player", module: "Ejecución", url: "modules/09-workout-player/index.html", keywords: "captura serie rpe offline sincronización conflictos eventos" },
  { title: "Máquina de estados de la sesión", module: "09 · Player", url: "modules/09-workout-player/index.html#estados", keywords: "en curso pausada cerrada sincronizada expiración" },
  { title: "Eventos — modelo de captura", module: "09 · Player", url: "modules/09-workout-player/index.html#eventos", keywords: "serie_registrada dolor_reportado override cola append-only" },
  { title: "Captura por serie — interfaz del dato", module: "09 · Player", url: "modules/09-workout-player/index.html#captura", keywords: "steppers rpe obligatorio escala simplificada inicial" },
  { title: "Offline y sincronización", module: "09 · Player", url: "modules/09-workout-player/index.html#offline", keywords: "replay idempotente expiración 24h" },
  { title: "Conflictos — reglas deterministas", module: "09 · Player", url: "modules/09-workout-player/index.html#conflictos", keywords: "dos dispositivos duplicada propiedad" },

  // 10
  { title: "Arquitectura de Datos", module: "Plataforma", url: "modules/10-arquitectura-datos/index.html", keywords: "tablas campos tipos FK índices RLS migraciones jsonb" },
  { title: "Clasificación por categoría (P9)", module: "10 · Datos", url: "modules/10-arquitectura-datos/index.html#categorias", keywords: "catálogo usuario historial" },
  { title: "Tabla profiles (20 columnas)", module: "10 · Datos", url: "modules/10-arquitectura-datos/index.html#t-profiles", keywords: "peso altura zonas checks limitación rls" },
  { title: "Tabla workouts + forma jsonb", module: "10 · Datos", url: "modules/10-arquitectura-datos/index.html#t-workouts", keywords: "slots desnormalizado estado" },
  { title: "Tabla workout_logs + forma jsonb", module: "10 · Datos", url: "modules/10-arquitectura-datos/index.html#t-logs", keywords: "series reales insert al cierre endurecimiento" },
  { title: "Tabla progression_events (requerida)", module: "10 · Datos", url: "modules/10-arquitectura-datos/index.html#t-events", keywords: "tipo origen razones contexto trazabilidad" },
  { title: "Coerción PostgREST numeric→string", module: "10 · Datos", url: "modules/10-arquitectura-datos/index.html#coercion", keywords: "numOrNull mapper bug concatenación" },
  { title: "Índices requeridos", module: "10 · Datos", url: "modules/10-arquitectura-datos/index.html#indices" },
  { title: "Versionado y migraciones — política", module: "10 · Datos", url: "modules/10-arquitectura-datos/index.html#versionado", keywords: "idempotente pg_constraint schema.sql discriminador v" },

  // 11
  { title: "API Interna", module: "Plataforma", url: "modules/11-api-interna/index.html", keywords: "contratos repositorios servicios DTOs errores versionado" },
  { title: "Convenciones globales", module: "11 · API", url: "modules/11-api-interna/index.html#convenciones", keywords: "cliente parámetro resultado tipado pureza" },
  { title: "DTOs", module: "11 · API", url: "modules/11-api-interna/index.html#dtos", keywords: "PrescripcionSlot VeredictoRecovery DecisionProgresion" },
  { title: "Repositorios", module: "11 · API", url: "modules/11-api-interna/index.html#repositorios", keywords: "insertWorkouts insertWorkoutLog insertEvento" },
  { title: "Servicios", module: "11 · API", url: "modules/11-api-interna/index.html#servicios", keywords: "activarSistema cicloSemanal evaluarProgresion generarSemana" },
  { title: "Catálogo de errores de dominio", module: "11 · API", url: "modules/11-api-interna/index.html#errores", keywords: "CATALOGO_INSUFICIENTE PERFIL_INCOMPLETO SISTEMA_NO_ACTIVO tipados" },
  { title: "Versionado de contratos", module: "11 · API", url: "modules/11-api-interna/index.html#versionado", keywords: "aditivo breaking supersede" },

  // 12
  { title: "Decisiones de Arquitectura (ADR)", module: "Gobernanza", url: "modules/12-adr/index.html", keywords: "registro alternativas descartadas consecuencias" },
  { title: "ADR-001 Motores deterministas, sin IA decidiendo", module: "12 · ADR", url: "modules/12-adr/index.html#adr-001" },
  { title: "ADR-002 Activación por compra", module: "12 · ADR", url: "modules/12-adr/index.html#adr-002" },
  { title: "ADR-003 nivel_actual ≠ nivel_experiencia", module: "12 · ADR", url: "modules/12-adr/index.html#adr-003" },
  { title: "ADR-004 Patrón como unidad de programación", module: "12 · ADR", url: "modules/12-adr/index.html#adr-004" },
  { title: "ADR-005 Track = contexto/equipo", module: "12 · ADR", url: "modules/12-adr/index.html#adr-005" },
  { title: "ADR-006 Plantilla ≠ Instancia", module: "12 · ADR", url: "modules/12-adr/index.html#adr-006" },
  { title: "ADR-007 Repositorio + mapper (PostgREST)", module: "12 · ADR", url: "modules/12-adr/index.html#adr-007" },
  { title: "ADR-008 RLS como frontera de seguridad", module: "12 · ADR", url: "modules/12-adr/index.html#adr-008" },
  { title: "ADR-009 Catálogo en código versionado", module: "12 · ADR", url: "modules/12-adr/index.html#adr-009" },
  { title: "ADR-010 Dos motores con precedencia", module: "12 · ADR", url: "modules/12-adr/index.html#adr-010" },
  { title: "ADR-011 jsonb con disparador de normalización", module: "12 · ADR", url: "modules/12-adr/index.html#adr-011" },
  { title: "ADR-012 Elite fuera del Training Framework", module: "12 · ADR", url: "modules/12-adr/index.html#adr-012" },
  { title: "ADR-013 Sin bus de eventos en v1", module: "12 · ADR", url: "modules/12-adr/index.html#adr-013" },
  { title: "ADR-014 RPE por serie obligatorio", module: "12 · ADR", url: "modules/12-adr/index.html#adr-014" },

  // 13
  { title: "Roadmap", module: "Gobernanza", url: "modules/13-roadmap/index.html", keywords: "v1 v2 nunca preguntas abiertas" },
  { title: "v1 — el sistema mínimo", module: "13 · Roadmap", url: "modules/13-roadmap/index.html#v1", keywords: "bloqueantes contenido camino crítico" },
  { title: "v2 — extensiones previstas", module: "13 · Roadmap", url: "modules/13-roadmap/index.html#v2", keywords: "wearables 1rm coach panel entrenador" },
  { title: "Nunca — fuera del sistema por diseño", module: "13 · Roadmap", url: "modules/13-roadmap/index.html#nunca" },
  { title: "Preguntas abiertas consolidadas", module: "13 · Roadmap", url: "modules/13-roadmap/index.html#abiertas", keywords: "sexto sistema kettlebell calibración" },

  // 14
  { title: "Glosario", module: "Gobernanza", url: "modules/14-glosario/index.html", keywords: "términos sinónimos definiciones normativo" },
  { title: "Confusiones peligrosas — nivel, DOMS, sesión vs log", module: "14 · Glosario", url: "modules/14-glosario/index.html#confusiones", keywords: "nivel_actual nivel_experiencia dolor plantilla instancia" },
];
