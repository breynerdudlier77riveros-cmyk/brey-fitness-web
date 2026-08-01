// ── Índice de búsqueda — Implementation Handbook v1.0 ────────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  // 00
  { title: "Introducción", module: "Fundamentos", url: "modules/00-introduccion/index.html", keywords: "orquesta siete documentos regla absoluta" },
  { title: "Los siete documentos que este handbook asume", module: "00 · Introducción", url: "modules/00-introduccion/index.html#documentos-de-entrada", keywords: "architecture motor bps progression engine bcs design system engineering architecture review" },
  { title: "Cómo leer este documento", module: "00 · Introducción", url: "modules/00-introduccion/index.html#como-leer", keywords: "no iniciado en progreso bloqueado implementado verificado" },

  // 01
  { title: "Estrategia general", module: "Fundamentos", url: "modules/01-estrategia-general/index.html", keywords: "cinco reglas contrato ambiguo abajo hacia arriba paralelización" },
  { title: "Definition of Ready y Definition of Done", module: "01 · Estrategia general", url: "modules/01-estrategia-general/index.html#definition-ready-done" },

  // 02
  { title: "Dependencias", module: "Fundamentos", url: "modules/02-dependencias/index.html", keywords: "árbol corregido ciclo falso motor bps progression engine invoca depende" },
  { title: "Corrección aplicada, sin editar el Engineering Handbook", module: "02 · Dependencias", url: "modules/02-dependencias/index.html", keywords: "AR-005 ciclo" },
  { title: "Qué puede construirse en paralelo", module: "02 · Dependencias", url: "modules/02-dependencias/index.html#paralelizable", keywords: "pista A pista B" },

  // 03
  { title: "Roadmap", module: "Planificación", url: "modules/03-roadmap/index.html", keywords: "fase 0 fase 1 fase 2 fase 3 fase 4 fundación pista A pista B integración endurecimiento expansión" },

  // 04
  { title: "Orden de construcción", module: "Planificación", url: "modules/04-orden-construccion/index.html", keywords: "20 pasos secuencia despliegue validación" },
  { title: "Orden exacto de despliegue", module: "04 · Orden de construcción", url: "modules/04-orden-construccion/index.html#orden-despliegue" },
  { title: "Orden exacto de validación", module: "04 · Orden de construcción", url: "modules/04-orden-construccion/index.html#orden-validacion" },

  // 05
  { title: "Migraciones", module: "Construcción", url: "modules/05-migraciones/index.html", keywords: "M1 M2 M3 M4 RLS progression_events tablas BCS índices" },
  { title: "Mapeo canónico — 25 variables del BCS a columna", module: "05 · Migraciones", url: "modules/05-migraciones/index.html#mapeo-bcs", keywords: "peso_kg altura_cm imc grasa_pct IMP-ADR-06" },

  // 06
  { title: "Backend", module: "Construcción", url: "modules/06-backend/index.html", keywords: "repositorios casos de uso motores pista A pista B application service" },

  // 07
  { title: "Frontend", module: "Construcción", url: "modules/07-frontend/index.html", keywords: "componentes BCS design system gap motores sin diseño" },
  { title: "Gap declarado — sin superficie de UI para Motor BPS/Progression Engine", module: "07 · Frontend", url: "modules/07-frontend/index.html#gap-motores" },

  // 08
  { title: "Motores", module: "Construcción", url: "modules/08-motores/index.html", keywords: "recovery engine motor bps progression engine definition of ready contrato mínimo" },

  // 09
  { title: "Integración", module: "Construcción", url: "modules/09-integracion/index.html", keywords: "ciclo semanal checklist de integración" },

  // 10
  { title: "Testing", module: "Calidad", url: "modules/10-testing/index.html", keywords: "unit integration E2E orden lista roja factories fixtures" },

  // 11
  { title: "Observabilidad", module: "Calidad", url: "modules/11-observabilidad/index.html", keywords: "logs eventos métricas alertas orden de instrumentación" },

  // 12
  { title: "Checklist por Feature", module: "Checklists y gobernanza", url: "modules/12-checklist-feature/index.html", keywords: "estado por módulo matriz feature handbooks migraciones backend frontend testing release" },
  { title: "Estado por módulo del sistema", module: "12 · Checklist por Feature", url: "modules/12-checklist-feature/index.html#tabla-estado" },
  { title: "Matriz Feature → Handbooks → Migraciones → Backend → Frontend → Testing → Release", module: "12 · Checklist por Feature", url: "modules/12-checklist-feature/index.html#matriz-feature" },

  // 13
  { title: "Release Checklist", module: "Checklists y gobernanza", url: "modules/13-release-checklist/index.html", keywords: "pull request merge producción release testing seguridad performance accesibilidad" },

  // 14
  { title: "ADR", module: "Checklists y gobernanza", url: "modules/14-adr/index.html", keywords: "IMP-ADR-01 IMP-ADR-06 veredicto de recovery contrato mínimo pistas paralelas RLS" },

  // 15
  { title: "Glosario", module: "Checklists y gobernanza", url: "modules/15-glosario/index.html", keywords: "pista A pista B fase contrato mínimo definition of ready done estados" },
];
