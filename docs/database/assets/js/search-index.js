// ── Índice de búsqueda — Database Handbook v1.0 ───────────────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  // 00
  { title: "Introducción", module: "Empezar", url: "modules/00-introduccion/index.html", keywords: "propósito alcance no alcance jerarquía documental prioridad sobre implementación single source of truth persistencia" },

  // 01
  { title: "Filosofía de Persistencia", module: "Empezar", url: "modules/01-filosofia-persistencia/index.html", keywords: "SSoT normalización integridad persistencia derivación cache evento estado catálogo append-only puntero materializado" },

  // 02
  { title: "Modelo Global", module: "Modelo", url: "modules/02-modelo-global/index.html", keywords: "mapa de tablas bounded context aggregate root ownership mermaid systems profiles diagnoses workouts workout_logs progression_events bcs_clientes bcs_mediciones bcs_enlaces_publicos" },

  // 03
  { title: "Tablas Oficiales", module: "Modelo", url: "modules/03-tablas-oficiales/index.html", keywords: "ficha de tabla owner aggregate persistente derivable efimera quien escribe quien lee nunca escribe nunca lee" },

  // 04
  { title: "Columnas", module: "Modelo", url: "modules/04-columnas/index.html", keywords: "nombre tipo lógico nullable unidad valor por defecto origen consumidores dominio infraestructura peso_kg altura_cm nivel_actual" },

  // 05
  { title: "Relaciones", module: "Modelo", url: "modules/05-relaciones/index.html", keywords: "FK cardinalidad ownership mermaid restricciones relaciones que no existen usuario cliente" },

  // 06
  { title: "Índices", module: "Esquema físico", url: "modules/06-indices/index.html", keywords: "índices existentes obligatorios futuros prohibidos justificación user_id fecha created_at" },

  // 07
  { title: "Constraints", module: "Esquema físico", url: "modules/07-constraints/index.html", keywords: "PK FK CHECK UNIQUE NOT NULL invariantes constraint protege regla de negocio" },

  // 08
  { title: "Eventos Persistidos", module: "Esquema físico", url: "modules/08-eventos-persistidos/index.html", keywords: "progression_events ownership replay contexto versionado domain events tipo origen" },

  // 09
  { title: "RLS", module: "Esquema físico", url: "modules/09-rls/index.html", keywords: "ownership policies row level security select insert update delete matrices" },

  // 10
  { title: "Consistencia", module: "Operación", url: "modules/10-consistencia/index.html", keywords: "transacciones atomicidad idempotencia concurrencia locks optimistic concurrency" },

  // 11
  { title: "Evolución", module: "Operación", url: "modules/11-evolucion/index.html", keywords: "migraciones backfill compatibilidad cambios incompatibles versionado de esquema jsonb discriminador v" },

  // 12
  { title: "Performance", module: "Operación", url: "modules/12-performance/index.html", keywords: "cardinalidad esperada volumen consultas hot paths cold paths cache materialización" },

  // 13
  { title: "Seguridad", module: "Operación", url: "modules/13-seguridad/index.html", keywords: "PII datos sensibles anonimización retención soft delete hard delete backup restore" },

  // 14
  { title: "Anti-patrones", module: "Gobernanza", url: "modules/14-antipatrones/index.html", keywords: "nunca duplicar nunca guardar derivados nunca romper ownership nunca saltar repositorios nunca escribir desde client components" },

  // 15
  { title: "DB-ADR", module: "Gobernanza", url: "modules/15-db-adr/index.html", keywords: "DB-ADR decisiones de arquitectura de base de datos" },

  // 16
  { title: "Preguntas Abiertas", module: "Gobernanza", url: "modules/16-preguntas-abiertas/index.html", keywords: "preguntas abiertas autoauditoría cobertura tablas documentadas columnas documentadas constraints índices" },
];
