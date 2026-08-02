// ── Índice de búsqueda — Testing Handbook v1.0 ────────────────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  // 00
  { title: "Introducción", module: "Empezar", url: "modules/00-introduccion/index.html", keywords: "propósito alcance no alcance jerarquía documental AR-024 cero funcionalidad nueva" },

  // 01
  { title: "Filosofía de Testing", module: "Empezar", url: "modules/01-filosofia-testing/index.html", keywords: "FT-08 testabilidad FT-03 determinismo pirámide de pruebas plan de pruebas ya escrito replay" },

  // 02
  { title: "Arquitectura de Pruebas", module: "Fundamentos", url: "modules/02-arquitectura-pruebas/index.html", keywords: "unit integration e2e niveles entorno de test base de datos de test aislamiento AR-022" },

  // 03
  { title: "Convenciones Globales", module: "Fundamentos", url: "modules/03-convenciones-globales/index.html", keywords: "naming organización factories fixtures mocks determinismo fecha_ciclo versión de catálogo" },

  // 04
  { title: "Unit Testing", module: "Niveles", url: "modules/04-unit-testing/index.html", keywords: "funciones puras motores validadores mappers numOrNull sin mocks sin IO" },

  // 05
  { title: "Domain Testing", module: "Niveles", url: "modules/05-domain-testing/index.html", keywords: "invariantes ownership bounded context reglas de negocio casos límite ejemplo inválido" },

  // 06
  { title: "Engine Testing", module: "Niveles", url: "modules/06-engine-testing/index.html", keywords: "motor bps progression engine recovery engine workout generator workout player suite matriz regla test recovery progression bps bcs casos" },

  // 07
  { title: "FSM Testing", module: "Niveles", url: "modules/07-fsm-testing/index.html", keywords: "máquina de estados 8 estados 15 transiciones T1 T15 cliente medición enlacepúblico guards estados imposibles" },

  // 08
  { title: "Event Testing", module: "Niveles", url: "modules/08-event-testing/index.html", keywords: "progression_events replay determinista idempotencia contexto AR-013 AR-026 evento verificación" },

  // 09
  { title: "Database Testing", module: "Superficies", url: "modules/09-database-testing/index.html", keywords: "constraints PK FK CHECK UNIQUE RLS policies violación migración idempotente tabla restricciones" },

  // 10
  { title: "API Testing", module: "Superficies", url: "modules/10-api-testing/index.html", keywords: "endpoint integración contrato request response envelope error catalog 45 endpoints" },

  // 11
  { title: "UI Testing", module: "Superficies", url: "modules/11-ui-testing/index.html", keywords: "componentes accesibilidad visual paridad público privado BCS design system" },

  // 12
  { title: "Regression Testing", module: "Superficies", url: "modules/12-regression-testing/index.html", keywords: "casos críticos lista roja numOrNull handle_new_user bug conocido Sprint 4.1" },

  // 13
  { title: "Coverage", module: "Gobernanza", url: "modules/13-coverage/index.html", keywords: "cobertura sin objetivo numérico global trazabilidad regla test matriz" },

  // 14
  { title: "Testing ADR", module: "Gobernanza", url: "modules/14-testing-adr/index.html", keywords: "TEST-ADR decisiones AR-024 AR-025 AR-026 AR-013 cierre" },

  // 15
  { title: "Anti-patterns", module: "Gobernanza", url: "modules/15-anti-patterns/index.html", keywords: "mockear supabase completo snapshot sin versión test no determinista fecha real" },

  // 16
  { title: "Preguntas Abiertas", module: "Gobernanza", url: "modules/16-preguntas-abiertas/index.html", keywords: "preguntas abiertas autoauditoría contradicciones detectadas cobertura del contrato" },
];
