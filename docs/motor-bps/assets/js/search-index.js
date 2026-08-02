// ── Índice de búsqueda — Motor BPS Handbook v1.0 ────────────────────────
// Estático (sin fetch) para funcionar bajo file:// — misma razón que el
// Architecture Handbook.

const BREY_SEARCH_INDEX = [
  // 00
  { title: "Introducción", module: "Fundamentos", url: "modules/00-introduccion/index.html", keywords: "qué es motor bps orquestador responsabilidades" },
  { title: "Qué NO hace — no-responsabilidades", module: "00 · Introducción", url: "modules/00-introduccion/index.html#que-no-hace", keywords: "fronteras elite pagos lesiones" },
  { title: "Relación con el Architecture Handbook", module: "00 · Introducción", url: "modules/00-introduccion/index.html#relacion-arch", keywords: "marco autoridad extensiones" },
  { title: "Problemas que resuelve", module: "00 · Introducción", url: "modules/00-introduccion/index.html#por-que" },

  // 01
  { title: "Filosofía", module: "Fundamentos", url: "modules/01-filosofia/index.html", keywords: "principios ssot determinismo idempotencia" },
  { title: "Single Source of Truth", module: "01 · Filosofía", url: "modules/01-filosofia/index.html#ssot", keywords: "estado eventos puntero" },
  { title: "Determinismo — fecha explícita", module: "01 · Filosofía", url: "modules/01-filosofia/index.html#determinismo", keywords: "reloj parámetro replay" },
  { title: "No IA, no azar", module: "01 · Filosofía", url: "modules/01-filosofia/index.html#no-ia" },
  { title: "Idempotencia", module: "01 · Filosofía", url: "modules/01-filosofia/index.html#idempotencia", keywords: "reintentos webhooks dobles clics" },
  { title: "Separación decisión / ejecución", module: "01 · Filosofía", url: "modules/01-filosofia/index.html#separacion", keywords: "player offline frontera" },

  // 02
  { title: "Arquitectura General", module: "Fundamentos", url: "modules/02-arquitectura/index.html", keywords: "entradas procesamiento salidas límites invariantes" },
  { title: "Los dos modos de ejecución", module: "02 · Arquitectura", url: "modules/02-arquitectura/index.html#procesamiento", keywords: "reactivo ciclo semanal batch" },
  { title: "Invariantes IN-1…IN-7", module: "02 · Arquitectura", url: "modules/02-arquitectura/index.html#invariantes", keywords: "sistema activo gates perfil fresco recovery primero" },
  { title: "Dependencias del Motor", module: "02 · Arquitectura", url: "modules/02-arquitectura/index.html#dependencias" },

  // 03
  { title: "Entradas", module: "Contrato de datos", url: "modules/03-entradas/index.html", keywords: "inventario tipo origen obligatoria validación" },
  { title: "Grupo Diagnóstico y activación", module: "03 · Entradas", url: "modules/03-entradas/index.html#grupo-diagnostico", keywords: "resultado compra_confirmada transaccionId" },
  { title: "Grupo Perfil — gates", module: "03 · Entradas", url: "modules/03-entradas/index.html#grupo-perfil", keywords: "días lugar zonas lesiones nivel_experiencia prohibido" },
  { title: "Veredictos — no señales", module: "03 · Entradas", url: "modules/03-entradas/index.html#grupo-veredictos", keywords: "historial adherencia fatiga BPS-019" },
  { title: "Contexto del ciclo — fecha y versión", module: "03 · Entradas", url: "modules/03-entradas/index.html#grupo-contexto" },
  { title: "Validación transversal V-1 V-2 V-3", module: "03 · Entradas", url: "modules/03-entradas/index.html#validacion", keywords: "ausencia inválido entrada_invalida" },

  // 04
  { title: "Salidas", module: "Contrato de datos", url: "modules/04-salidas/index.html", keywords: "punteros eventos invocaciones errores" },
  { title: "Punteros de estado", module: "04 · Salidas", url: "modules/04-salidas/index.html#punteros", keywords: "sistema_actual nivel_actual track derivado" },
  { title: "Los 10 eventos", module: "04 · Salidas", url: "modules/04-salidas/index.html#eventos", keywords: "activacion transicion semana_generada anomalia" },
  { title: "Errores tipados", module: "04 · Salidas", url: "modules/04-salidas/index.html#errores", keywords: "PERFIL_INCOMPLETO SISTEMA_NO_ACTIVO ENTRADA_INVALIDA" },

  // 05
  { title: "Máquina de Estados", module: "Comportamiento", url: "modules/05-maquina-estados/index.html", keywords: "fsm 8 estados 15 transiciones guards" },
  { title: "Los 8 estados", module: "05 · FSM", url: "modules/05-maquina-estados/index.html#estados", keywords: "pendiente_perfil activo en_pausa sistema_completado" },
  { title: "Tabla de transiciones T1–T15", module: "05 · FSM", url: "modules/05-maquina-estados/index.html#transiciones", keywords: "evento guard efectos" },
  { title: "Estados imposibles y reparación", module: "05 · FSM", url: "modules/05-maquina-estados/index.html#imposibles", keywords: "anomalia degradación replay" },
  { title: "Replay determinista", module: "05 · FSM", url: "modules/05-maquina-estados/index.html#recuperacion", keywords: "recomputarEstado IN-5" },

  // 06
  { title: "Regla de Activación", module: "Comportamiento", url: "modules/06-regla-activacion/index.html", keywords: "compra confirmada diagnóstico recomienda" },
  { title: "Qué dispara y qué no", module: "06 · Activación", url: "modules/06-regla-activacion/index.html#dispara", keywords: "webhook re-toma reembolso login" },
  { title: "Idempotencia, reintentos y debounce", module: "06 · Activación", url: "modules/06-regla-activacion/index.html#idempotencia", keywords: "transaccionId doble compra" },
  { title: "Casos límite de activación", module: "06 · Activación", url: "modules/06-regla-activacion/index.html#casos", keywords: "sistema distinto elite expirado upgrade" },

  // 07
  { title: "Pipeline interno", module: "Comportamiento", url: "modules/07-pipeline/index.html", keywords: "onboarding ciclo semanal pasos fallos" },
  { title: "Onboarding — 8 pasos", module: "07 · Pipeline", url: "modules/07-pipeline/index.html#onboarding", keywords: "registro diagnóstico compra gates primera semana" },
  { title: "Ciclo semanal — el corazón", module: "07 · Pipeline", url: "modules/07-pipeline/index.html#ciclo", keywords: "orden fijo recovery progression generator" },
  { title: "Mapa de fallos", module: "07 · Pipeline", url: "modules/07-pipeline/index.html#fallos", keywords: "recuperación reintentos transaccional" },

  // 08
  { title: "Resolución de conflictos", module: "Comportamiento", url: "modules/08-conflictos/index.html", keywords: "precedencia quién gana" },
  { title: "El orden de precedencia (5 niveles)", module: "08 · Conflictos", url: "modules/08-conflictos/index.html#precedencia", keywords: "seguridad integridad continuidad progresión preferencia" },
  { title: "Catálogo de conflictos C-01…C-12", module: "08 · Conflictos", url: "modules/08-conflictos/index.html#tabla", keywords: "avanzar descargar objetivo disponibilidad gimnasio acceso" },
  { title: "Meta-regla: precedencia, nunca ponderación", module: "08 · Conflictos", url: "modules/08-conflictos/index.html#meta-regla" },

  // 09
  { title: "Reglas de negocio BPS-001…025", module: "Reglas", url: "modules/09-reglas/index.html", keywords: "numeradas prioridad justificación" },
  { title: "BPS-001 Activación exige compra", module: "09 · Reglas", url: "modules/09-reglas/index.html#bps-001" },
  { title: "BPS-003 Nunca nivel por defecto", module: "09 · Reglas", url: "modules/09-reglas/index.html#bps-003" },
  { title: "BPS-006 nivel_experiencia jamás decide", module: "09 · Reglas", url: "modules/09-reglas/index.html#bps-006" },
  { title: "BPS-007 Recovery precede a Progression", module: "09 · Reglas", url: "modules/09-reglas/index.html#bps-007" },
  { title: "BPS-011 Estado recomputable — eventos ganan", module: "09 · Reglas", url: "modules/09-reglas/index.html#bps-011" },
  { title: "BPS-019 Veredictos, no señales", module: "09 · Reglas", url: "modules/09-reglas/index.html#bps-019" },
  { title: "BPS-022 Fecha como entrada explícita", module: "09 · Reglas", url: "modules/09-reglas/index.html#bps-022" },
  { title: "BPS-025 Auto-pausa por inactividad", module: "09 · Reglas", url: "modules/09-reglas/index.html#bps-025", keywords: "21 días" },

  // 10
  { title: "Casos límite", module: "Reglas", url: "modules/10-casos-limite/index.html", keywords: "usuario nuevo lesionado abandona vuelve" },
  { title: "Por perfil de usuario", module: "10 · Casos límite", url: "modules/10-casos-limite/index.html#perfiles", keywords: "nuevo avanzado lesionado fatiga" },
  { title: "Por comportamiento", module: "10 · Casos límite", url: "modules/10-casos-limite/index.html#comportamiento", keywords: "abandona vuelve omite modifica pesos override" },
  { title: "Por cambios de contexto", module: "10 · Casos límite", url: "modules/10-casos-limite/index.html#cambios", keywords: "objetivo gimnasio track sistema dolor acceso" },
  { title: "Síntesis — las tres respuestas", module: "10 · Casos límite", url: "modules/10-casos-limite/index.html#sintesis" },

  // 11
  { title: "Algoritmo conceptual", module: "Reglas", url: "modules/11-algoritmo/index.html", keywords: "pseudocódigo procedimientos" },
  { title: "activarSistema", module: "11 · Algoritmo", url: "modules/11-algoritmo/index.html#activar" },
  { title: "cicloSemanal", module: "11 · Algoritmo", url: "modules/11-algoritmo/index.html#ciclo" },
  { title: "Propiedades exigibles", module: "11 · Algoritmo", url: "modules/11-algoritmo/index.html#propiedades", keywords: "determinismo idempotencia atomicidad replay pureza" },

  // 12
  { title: "Integración", module: "Sistema", url: "modules/12-integracion/index.html", keywords: "matriz conversaciones contrapartes" },
  { title: "Matriz de conversaciones", module: "12 · Integración", url: "modules/12-integracion/index.html#tabla", keywords: "diagnóstico perfil recovery progression generator player kb repositorios" },
  { title: "Secuencia de un ciclo completo", module: "12 · Integración", url: "modules/12-integracion/index.html#secuencia" },
  { title: "Reglas de acoplamiento A-1 A-2 A-3", module: "12 · Integración", url: "modules/12-integracion/index.html#acoplamiento" },

  // 13
  { title: "Observabilidad", module: "Sistema", url: "modules/13-observabilidad/index.html", keywords: "logs métricas warnings auditorías" },
  { title: "Métricas", module: "13 · Observabilidad", url: "modules/13-observabilidad/index.html#metricas", keywords: "estados funnel descargas reactivas catálogo insuficiente" },
  { title: "Auditorías ejecutables", module: "13 · Observabilidad", url: "modules/13-observabilidad/index.html#auditorias", keywords: "replay completitud pureza determinismo" },
  { title: "Plantillas de razón", module: "13 · Observabilidad", url: "modules/13-observabilidad/index.html#plantillas-razon" },

  // 14
  { title: "Riesgos", module: "Gobernanza", url: "modules/14-riesgos/index.html", keywords: "bloqueante operacional producto proceso mitigación" },
  { title: "El meta-riesgo del orquestador", module: "14 · Riesgos", url: "modules/14-riesgos/index.html#meta", keywords: "atajos frontera simple" },

  // 15
  { title: "Decisiones (ADR)", module: "Gobernanza", url: "modules/15-adr/index.html", keywords: "MBPS-ADR extensiones heredadas" },
  { title: "MBPS-ADR-01 Puntero + eventos", module: "15 · ADR", url: "modules/15-adr/index.html#madr-01" },
  { title: "MBPS-ADR-02 Auto-pausa por inactividad", module: "15 · ADR", url: "modules/15-adr/index.html#madr-02" },
  { title: "MBPS-ADR-03 Fecha como parámetro", module: "15 · ADR", url: "modules/15-adr/index.html#madr-03" },
  { title: "MBPS-ADR-04 Ciclo batch, no reactivo", module: "15 · ADR", url: "modules/15-adr/index.html#madr-04" },
  { title: "MBPS-ADR-05 Vigencia del Diagnóstico (6 meses)", module: "15 · ADR", url: "modules/15-adr/index.html#madr-05" },
  { title: "MBPS-ADR-06 Sin traducción de niveles entre Sistemas", module: "15 · ADR", url: "modules/15-adr/index.html#madr-06" },

  // 16
  { title: "Preguntas abiertas", module: "Gobernanza", url: "modules/16-preguntas/index.html", keywords: "pendientes registro Q-01" },
  { title: "Q-01 Pérdida de acceso comercial", module: "16 · Preguntas", url: "modules/16-preguntas/index.html#lista", keywords: "reembolso vencimiento desactivación" },
];
