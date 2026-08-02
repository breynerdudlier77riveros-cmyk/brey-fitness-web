// ── Índice de búsqueda — Progression Engine Handbook v1.0 ───────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que el
// Architecture Handbook y el Motor BPS Handbook.

const BREY_SEARCH_INDEX = [
  // 00
  { title: "Introducción", module: "Fundamentos", url: "modules/00-introduccion/index.html", keywords: "objetivo alcance especificación de dominio autoridad" },
  { title: "No alcance", module: "00 · Introducción", url: "modules/00-introduccion/index.html#no-alcance", keywords: "recovery knowledge base workout player fuera de este documento" },
  { title: "Cuatro etiquetas de evidencia", module: "00 · Introducción", url: "modules/00-introduccion/index.html#rol", keywords: "fuerte moderada producto hipótesis 🟢 🟡 🟠 🔴" },
  { title: "Mapa de autoridad entre handbooks", module: "00 · Introducción", url: "modules/00-introduccion/index.html#relacion", keywords: "architecture handbook motor bps handbook recovery pendiente" },

  // 01
  { title: "Filosofía", module: "Fundamentos", url: "modules/01-filosofia/index.html", keywords: "principios determinismo explicabilidad seguridad" },
  { title: "Fallo visible", module: "01 · Filosofía", url: "modules/01-filosofia/index.html#fallo-visible", keywords: "VENTANA_INSUFICIENTE P6 sostiene" },
  { title: "Seguridad antes que progreso", module: "01 · Filosofía", url: "modules/01-filosofia/index.html#seguridad-precede", keywords: "P8 recovery veredicto terminal" },
  { title: "Separación de cadencias de señal y de decisión", module: "01 · Filosofía", url: "modules/01-filosofia/index.html#cadencias", keywords: "principio propio sobre-reacción sub-reacción" },
  { title: "Precedencia entre principios", module: "01 · Filosofía", url: "modules/01-filosofia/index.html#precedencia-general", keywords: "conflicto gana seguridad honestidad" },

  // 02
  { title: "Arquitectura", module: "Fundamentos", url: "modules/02-arquitectura/index.html", keywords: "entrada procesamiento salida límites invariantes" },
  { title: "Los dos modos de procesamiento", module: "02 · Arquitectura", url: "modules/02-arquitectura/index.html#procesamiento", keywords: "micro macro cadencia" },
  { title: "Invariantes IN-P1…IN-P5", module: "02 · Arquitectura", url: "modules/02-arquitectura/index.html#invariantes", keywords: "función pura recovery terminal ventana móvil" },
  { title: "Mapa de las 7 matrices de trazabilidad", module: "02 · Arquitectura", url: "modules/02-arquitectura/index.html#matrices", keywords: "regla pipeline evento consumidor input salida error recuperación evidencia" },

  // 03
  { title: "Modelo Conceptual", module: "Modelo", url: "modules/03-modelo-conceptual/index.html", keywords: "entidades slot prescripción ventana veredicto" },
  { title: "Entidades reconocidas", module: "03 · Modelo Conceptual", url: "modules/03-modelo-conceptual/index.html#entidades", keywords: "slot cadena de progresión aparición decisión micro macro" },
  { title: "Entidades explícitamente NO reconocidas", module: "03 · Modelo Conceptual", url: "modules/03-modelo-conceptual/index.html#no-reconocidas", keywords: "ejercicio track sistema dolor fatiga sueño usuario" },

  // 04
  { title: "Contrato de Entradas", module: "Modelo", url: "modules/04-contrato-entradas/index.html", keywords: "ventana prescripción veredicto cadenas fecha" },
  { title: "Las cinco entradas", module: "04 · Contrato de Entradas", url: "modules/04-contrato-entradas/index.html#entradas", keywords: "ventana de historial prescripción vigente veredicto recovery cadenas fecha del ciclo" },
  { title: "Estados inválidos de entrada", module: "04 · Contrato de Entradas", url: "modules/04-contrato-entradas/index.html#estados-invalidos", keywords: "error invocación veredicto ausente ventana desordenada" },

  // 05
  { title: "Modelo de Decisión", module: "Modelo", url: "modules/05-modelo-decision/index.html", keywords: "precedencia explícita nunca ponderación" },
  { title: "Escalera de precedencia general", module: "05 · Modelo de Decisión", url: "modules/05-modelo-decision/index.html#niveles", keywords: "seguridad integridad estancamiento progresión preferencia niveles 1 2 3 4 5" },
  { title: "Conflictos por variable", module: "05 · Modelo de Decisión", url: "modules/05-modelo-decision/index.html#conflictos-variable", keywords: "RPE reportado vs programado micro vs macro deload preventivo" },

  // 06
  { title: "Pipeline", module: "Modelo", url: "modules/06-pipeline/index.html", keywords: "9 pasos entrada validación normalización evaluación resolución aplicación persistencia eventos salida" },
  { title: "Los 9 pasos", module: "06 · Pipeline", url: "modules/06-pipeline/index.html#pasos", keywords: "paso 1 paso 2 paso 9" },
  { title: "Matriz Regla → Pipeline", module: "06 · Pipeline", url: "modules/06-pipeline/index.html#matriz-regla-pipeline" },
  { title: "Matriz Decisión → Evidencia", module: "06 · Pipeline", url: "modules/06-pipeline/index.html#matriz-decision-evidencia" },

  // 07
  { title: "Reglas de Negocio — catálogo PE-001–PE-039", module: "Reglas", url: "modules/07-reglas-negocio/index.html", keywords: "PE-001 PE-039 catálogo completo" },
  { title: "Microprogresión PE-001–PE-012", module: "07 · Reglas de Negocio", url: "modules/07-reglas-negocio/index.html#microprogresion", keywords: "peso repeticiones series tempo descanso RPE RIR duración volumen densidad" },
  { title: "Macroprogresión PE-013–PE-018", module: "07 · Reglas de Negocio", url: "modules/07-reglas-negocio/index.html#macroprogresion", keywords: "microciclo mesociclo bloque nivel track sistema exclusión" },
  { title: "Autorregulación PE-019–PE-026", module: "07 · Reglas de Negocio", url: "modules/07-reglas-negocio/index.html#autorregulacion", keywords: "frontera recovery dolor fatiga sueño veredicto" },
  { title: "Estancamiento PE-027–PE-032", module: "07 · Reglas de Negocio", url: "modules/07-reglas-negocio/index.html#estancamiento-reglas", keywords: "detección confirmación falso positivo falso negativo escalera" },
  { title: "Deload PE-033–PE-039", module: "07 · Reglas de Negocio", url: "modules/07-reglas-negocio/index.html#deload-reglas", keywords: "programado reactivo preventivo cancelación prioridad duración reincorporación" },
  { title: "Matriz Input → Regla", module: "07 · Reglas de Negocio", url: "modules/07-reglas-negocio/index.html#matriz-input-regla" },
  { title: "Matriz Regla → Salida", module: "07 · Reglas de Negocio", url: "modules/07-reglas-negocio/index.html#matriz-regla-salida" },

  // 08
  { title: "Microprogresión", module: "Reglas", url: "modules/08-microprogresion/index.html", keywords: "10 variables prescripción vigente mecánica" },
  { title: "Diagrama de flujo — evaluación micro", module: "08 · Microprogresión", url: "modules/08-microprogresion/index.html#flujo", keywords: "RPE RIR techo repeticiones árbitro" },
  { title: "Casos límite de microprogresión", module: "08 · Microprogresión", url: "modules/08-microprogresion/index.html#casos-limite", keywords: "slot nuevo default de cadena sistema mixto" },

  // 09
  { title: "Macroprogresión", module: "Reglas", url: "modules/09-macroprogresion/index.html", keywords: "escalera microciclo mesociclo bloque nivel track sistema" },
  { title: "No alcance — Track y Sistema", module: "09 · Macroprogresión", url: "modules/09-macroprogresion/index.html#no-alcance", keywords: "frontera dura ADR-005 BPS-012 activación" },
  { title: "Tabla resumen por escalón", module: "09 · Macroprogresión", url: "modules/09-macroprogresion/index.html#tabla" },

  // 10
  { title: "Autorregulación", module: "Reglas", url: "modules/10-autorregulacion/index.html", keywords: "RPE RIR dolor fatiga sueño cumplimiento adherencia eventos inesperados" },
  { title: "Las 8 señales — quién las procesa", module: "10 · Autorregulación", url: "modules/10-autorregulacion/index.html#tabla-frontera", keywords: "frontera recovery engine procesada directamente" },
  { title: "Por qué esta frontera y no otra", module: "10 · Autorregulación", url: "modules/10-autorregulacion/index.html#por-que" },

  // 11
  { title: "Estancamiento", module: "Reglas", url: "modules/11-estancamiento/index.html", keywords: "detección confirmación máquina de estados escalera de acciones" },
  { title: "Máquina de estados por Slot", module: "11 · Estancamiento", url: "modules/11-estancamiento/index.html#estados", keywords: "normal candidato confirmado escalón" },

  // 12
  { title: "Deload", module: "Reglas", url: "modules/12-deload/index.html", keywords: "programado reactivo preventivo prioridad duración reincorporación" },
  { title: "Los tres tipos de deload", module: "12 · Deload", url: "modules/12-deload/index.html#tres-tipos", keywords: "programado reactivo preventivo evidencia" },

  // 13
  { title: "Integración", module: "Sistema", url: "modules/13-integracion/index.html", keywords: "motor bps recovery knowledge base workout generator player" },
  { title: "Puntos de integración", module: "13 · Integración", url: "modules/13-integracion/index.html#tabla-integracion" },
  { title: "Matriz Pipeline → Evento", module: "13 · Integración", url: "modules/13-integracion/index.html#matriz-pipeline-evento" },
  { title: "Matriz Evento → Consumidor", module: "13 · Integración", url: "modules/13-integracion/index.html#matriz-evento-consumidor" },

  // 14
  { title: "Observabilidad", module: "Sistema", url: "modules/14-observabilidad/index.html", keywords: "logs warnings errores eventos métricas KPIs auditorías replay" },
  { title: "Métricas y KPIs derivados", module: "14 · Observabilidad", url: "modules/14-observabilidad/index.html#metricas", keywords: "tasa de avance ventana insuficiente estancamiento deload preventivo densidad" },
  { title: "Replay", module: "14 · Observabilidad", url: "modules/14-observabilidad/index.html#replay", keywords: "determinismo reconstrucción auditoría" },
  { title: "Matriz Error → Recuperación", module: "14 · Observabilidad", url: "modules/14-observabilidad/index.html#matriz-error-recuperacion" },

  // 15
  { title: "Arquitectura de Datos", module: "Sistema", url: "modules/15-arquitectura-datos/index.html", keywords: "prescripción vigente puntero eventos persistencia" },
  { title: "Eventos — extensión requerida sobre el marco", module: "15 · Arquitectura de Datos", url: "modules/15-arquitectura-datos/index.html#eventos", keywords: "progression_events CHECK constraint gap" },

  // 16
  { title: "ADR", module: "Gobernanza", url: "modules/16-adr/index.html", keywords: "PE-ADR-01 PE-ADR-06 decisiones de arquitectura" },
  { title: "PE-ADR-01 — Precedencia explícita", module: "16 · ADR", url: "modules/16-adr/index.html#pe-adr-01" },
  { title: "PE-ADR-02 — Track/Sistema fuera de alcance", module: "16 · ADR", url: "modules/16-adr/index.html#pe-adr-02" },
  { title: "PE-ADR-03 — Frontera con Recovery", module: "16 · ADR", url: "modules/16-adr/index.html#pe-adr-03" },
  { title: "PE-ADR-04 — Deload preventivo", module: "16 · ADR", url: "modules/16-adr/index.html#pe-adr-04" },

  // 17
  { title: "Riesgos", module: "Gobernanza", url: "modules/17-riesgos/index.html", keywords: "deload preventivo umbrales calibración CHECK constraint recovery engine handbook" },

  // 18
  { title: "Roadmap", module: "Gobernanza", url: "modules/18-roadmap/index.html", keywords: "prerequisitos v1.0 v1.1 candidatos fuera de alcance" },
  { title: "Prerequisitos de implementación", module: "18 · Roadmap", url: "modules/18-roadmap/index.html#prerequisitos", keywords: "CHECK constraint recovery engine handbook bloqueante" },

  // 19
  { title: "Preguntas abiertas", module: "Gobernanza", url: "modules/19-preguntas/index.html", keywords: "sistemas de esfuerzo mixtos conservador deload preventivo umbral volumen" },

  // 20
  { title: "Glosario", module: "Gobernanza", url: "modules/20-glosario/index.html", keywords: "slot cadena prescripción vigente veredicto RPE RIR deload nivel track sistema" },
];
