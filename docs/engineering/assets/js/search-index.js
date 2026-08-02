// ── Índice de búsqueda — Engineering Handbook v1.0 ───────────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  // 00
  { title: "Introducción", module: "Fundamentos", url: "modules/00-introduccion/index.html", keywords: "SSoT ecosistema alcance módulos futuros implementado especificado futuro" },
  { title: "Relación con los demás handbooks", module: "00 · Introducción", url: "modules/00-introduccion/index.html#relacion", keywords: "architecture motor bps progression engine bcs design system" },
  { title: "Cómo leer este handbook", module: "00 · Introducción", url: "modules/00-introduccion/index.html#como-leer", keywords: "tres etiquetas tag implementado especificado futuro" },

  // 01
  { title: "Filosofía Técnica", module: "Fundamentos", url: "modules/01-filosofia-tecnica/index.html", keywords: "SSoT determinismo idempotencia fail visible explicabilidad observabilidad testabilidad" },
  { title: "Precedencia general", module: "01 · Filosofía Técnica", url: "modules/01-filosofia-tecnica/index.html#precedencia", keywords: "nivel innegociable estructural operacional" },
  { title: "Los trece principios", module: "01 · Filosofía Técnica", url: "modules/01-filosofia-tecnica/index.html#principios", keywords: "FT-01 FT-13 numOrNull repositorio" },

  // 02
  { title: "Arquitectura General", module: "Fundamentos", url: "modules/02-arquitectura-general/index.html", keywords: "capas bounded contexts frontend application domain infrastructure" },
  { title: "Mapa de los 10 diagramas exigidos", module: "02 · Arquitectura General", url: "modules/02-arquitectura-general/index.html#mapa-diagramas" },
  { title: "Mapa de las 10 matrices exigidas", module: "02 · Arquitectura General", url: "modules/02-arquitectura-general/index.html#mapa-matrices" },
  { title: "Flujo de una request típica", module: "02 · Arquitectura General", url: "modules/02-arquitectura-general/index.html#flujo-request", keywords: "proxy server component server action repositorio" },

  // 03
  { title: "Frontend Architecture", module: "Capas", url: "modules/03-frontend-architecture/index.html", keywords: "app components lib features hooks contexts providers types services styles assets utils data" },
  { title: "Las 12 carpetas", module: "03 · Frontend Architecture", url: "modules/03-frontend-architecture/index.html#tabla-carpetas", keywords: "FE-01 FE-12 ui brand umbral de creación" },

  // 04
  { title: "Backend Architecture", module: "Capas", url: "modules/04-backend-architecture/index.html", keywords: "server actions application services repositories policies domain services infrastructure storage events jobs schedulers" },
  { title: "Matriz Servicio → Repositorio", module: "04 · Backend Architecture", url: "modules/04-backend-architecture/index.html#matriz-servicio-repositorio" },
  { title: "Matriz Repositorio → Tabla", module: "04 · Backend Architecture", url: "modules/04-backend-architecture/index.html#matriz-repositorio-tabla" },

  // 05
  { title: "Database Handbook", module: "Capas", url: "modules/05-database-handbook/index.html", keywords: "naming schemas tablas enums jsonb FK CHECK índices policies triggers soft delete hard delete migraciones" },
  { title: "Diagrama ER — estado real hoy", module: "05 · Database Handbook", url: "modules/05-database-handbook/index.html#diagrama-er", keywords: "profiles workouts workout_logs diagnoses systems" },
  { title: "Enums", module: "05 · Database Handbook", url: "modules/05-database-handbook/index.html#enums", keywords: "text check enum nativo" },
  { title: "Migraciones y versionado", module: "05 · Database Handbook", url: "modules/05-database-handbook/index.html#migraciones", keywords: "schema.sql migration_perfil_persistente migration_perfil_integridad" },
  { title: "Matriz Dominio → Storage", module: "05 · Database Handbook", url: "modules/05-database-handbook/index.html#matriz-dominio-storage" },

  // 06
  { title: "API Handbook", module: "Contratos", url: "modules/06-api-handbook/index.html", keywords: "DTO commands queries responses errores versionado paginación filtros sorting idempotencia timeouts retry" },
  { title: "Catálogo de errores reales", module: "06 · API Handbook", url: "modules/06-api-handbook/index.html#errores", keywords: "invalid_body invalid_email not_configured provider_error" },
  { title: "Matriz DTO → Caso de uso", module: "06 · API Handbook", url: "modules/06-api-handbook/index.html#matriz-dto-caso-uso" },

  // 07
  { title: "Domain Events", module: "Contratos", url: "modules/07-domain-events/index.html", keywords: "progression_events naming payload consumidores productores persistencia replay event sourcing" },
  { title: "Catálogo consolidado de tipos — y la brecha real", module: "07 · Domain Events", url: "modules/07-domain-events/index.html#catalogo", keywords: "25 valores gate_fallado transicion_estado prescripcion_actualizada" },
  { title: "Matriz Evento → Productor", module: "07 · Domain Events", url: "modules/07-domain-events/index.html#matriz-evento-productor" },
  { title: "Matriz Evento → Consumidor", module: "07 · Domain Events", url: "modules/07-domain-events/index.html#matriz-evento-consumidor" },
  { title: "¿Es esto Event Sourcing?", module: "07 · Domain Events", url: "modules/07-domain-events/index.html#event-sourcing", keywords: "puntero materializado híbrido MBPS-ADR-01" },

  // 08
  { title: "Security Handbook", module: "Calidad y operación", url: "modules/08-security-handbook/index.html", keywords: "autenticación autorización JWT supabase auth RLS policies storage buckets tokens rate limiting secrets" },
  { title: "RLS — la barrera real", module: "08 · Security Handbook", url: "modules/08-security-handbook/index.html#diagrama-rls" },
  { title: "Riesgo real — migración de endurecimiento pendiente", module: "08 · Security Handbook", url: "modules/08-security-handbook/index.html#policies", keywords: "CRUD propio delete workouts workout_logs" },
  { title: "Matriz Policy → Recurso", module: "08 · Security Handbook", url: "modules/08-security-handbook/index.html#matriz-policy-recurso" },
  { title: "Secrets y Variables", module: "08 · Security Handbook", url: "modules/08-security-handbook/index.html#secrets-variables", keywords: "NEXT_PUBLIC SUPABASE_SERVICE_ROLE_KEY BREVO_API_KEY" },

  // 09
  { title: "Performance Handbook", module: "Calidad y operación", url: "modules/09-performance-handbook/index.html", keywords: "lazy loading streaming SSR ISR cache optimistic UI memoización queries índices paginación" },

  // 10
  { title: "Testing Handbook", module: "Calidad y operación", url: "modules/10-testing-handbook/index.html", keywords: "unit integration E2E factories fixtures mocks cobertura casos críticos casos borde" },
  { title: "Qué nunca debe romperse — la lista roja", module: "10 · Testing Handbook", url: "modules/10-testing-handbook/index.html#que-nunca-romperse" },

  // 11
  { title: "Observability Handbook", module: "Calidad y operación", url: "modules/11-observability-handbook/index.html", keywords: "logs tracing errores warnings auditoría replay KPIs métricas alertas health checks" },
  { title: "Matriz Error → Recuperación", module: "11 · Observability Handbook", url: "modules/11-observability-handbook/index.html#matriz-error-recuperacion" },

  // 12
  { title: "Deployment Handbook", module: "Calidad y operación", url: "modules/12-deployment-handbook/index.html", keywords: "entornos local preview producción migraciones rollback feature flags versionado backups monitoreo vercel" },
  { title: "Riesgo real: un solo proyecto de Supabase", module: "12 · Deployment Handbook", url: "modules/12-deployment-handbook/index.html#entornos" },

  // 13
  { title: "Coding Standards", module: "Estándares y gobernanza", url: "modules/13-coding-standards/index.html", keywords: "naming componentes hooks services repositories DTO enums interfaces tipos imports comentarios errores async" },
  { title: "Lint y Formateo", module: "13 · Coding Standards", url: "modules/13-coding-standards/index.html#lint-formateo", keywords: "eslint prettier typescript strict" },

  // 14
  { title: "ADR", module: "Estándares y gobernanza", url: "modules/14-adr/index.html", keywords: "ENG-ADR-01 ENG-ADR-06 decisiones de arquitectura" },

  // 15
  { title: "Roadmap", module: "Estándares y gobernanza", url: "modules/15-roadmap/index.html", keywords: "deuda técnica refactors tecnologías candidatas límites conocidos" },
  { title: "Deuda técnica activa", module: "15 · Roadmap", url: "modules/15-roadmap/index.html#deuda-tecnica" },

  // 16
  { title: "Glosario", module: "Estándares y gobernanza", url: "modules/16-glosario/index.html", keywords: "sinónimos términos prohibidos confusiones frecuentes nivel_actual nivel_experiencia" },
];
