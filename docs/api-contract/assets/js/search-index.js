// ── Índice de búsqueda — API Contract Handbook v1.0 ───────────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  // 00
  { title: "Introducción", module: "Empezar", url: "modules/00-introduccion/index.html", keywords: "propósito alcance no alcance jerarquía documental prioridad sobre implementación architecture review implementation handbook domain model handbook" },

  // 01
  { title: "Filosofía de API", module: "Empezar", url: "modules/01-filosofia-api/index.html", keywords: "REST stateless determinismo idempotencia versionado JSON UTC snake_case camelCase convenciones globales notación transporte agnóstico" },

  // 02
  { title: "Arquitectura General", module: "Acceso", url: "modules/02-arquitectura-general/index.html", keywords: "frontend backend motores repositorios supabase server actions route handlers qué habla con qué diagrama AR-005 motor bps progression engine" },

  // 03
  { title: "Autenticación", module: "Acceso", url: "modules/03-autenticacion/index.html", keywords: "JWT cookies roles trainer entrenador cliente admin anonymous autorización ownership supabase auth RLS getUser getSession" },

  // 04
  { title: "Convenciones HTTP", module: "Convenciones", url: "modules/04-convenciones-http/index.html", keywords: "GET POST PATCH PUT DELETE status codes headers content-type cache-control métodos" },

  // 05
  { title: "Convenciones de Requests", module: "Convenciones", url: "modules/05-convenciones-requests/index.html", keywords: "query params path params body validación errores campos opcionales obligatorios naming" },

  // 06
  { title: "Convenciones de Responses", module: "Convenciones", url: "modules/06-convenciones-responses/index.html", keywords: "estructura única success error metadata pagination timestamps warnings ok envelope" },

  // 07
  { title: "Catálogo de Endpoints", module: "Contrato", url: "modules/07-catalogo-endpoints/index.html", keywords: "diagnóstico motor bps progression engine recovery engine workout generator workout player profiles bcs cliente mediciones enlaces públicos reportes sistema health endpoints rutas" },

  // 08
  { title: "DTO Oficiales", module: "Contrato", url: "modules/08-dto-oficiales/index.html", keywords: "input DTO output DTO error DTO pagination DTO event DTO recovery DTO veredicto procede subtipo razon cliente medicion enlacepublico reporte workout profile" },

  // 09
  { title: "Errores", module: "Operación", url: "modules/09-errores/index.html", keywords: "error codes status mensaje errores de dominio infraestructura autenticación autorización validación catálogo" },

  // 10
  { title: "Versionado", module: "Operación", url: "modules/10-versionado/index.html", keywords: "v1 compatibilidad breaking changes deprecación sunset" },

  // 11
  { title: "Idempotencia", module: "Operación", url: "modules/11-idempotencia/index.html", keywords: "transaccionId device_id sequence semana ya generada duplicate_parameter casos límite reintentos" },

  // 12
  { title: "Rate Limiting", module: "Operación", url: "modules/12-rate-limiting/index.html", keywords: "límites políticas 429 reintentos enlace público token entropía" },

  // 13
  { title: "Seguridad", module: "Gobernanza", url: "modules/13-seguridad/index.html", keywords: "ownership RLS JWT validación input output secretos service role key" },

  // 14
  { title: "Observabilidad", module: "Gobernanza", url: "modules/14-observabilidad/index.html", keywords: "request id trace id correlation id logs eventos auditoría contexto console.error" },

  // 15
  { title: "API-ADR", module: "Gobernanza", url: "modules/15-api-adr/index.html", keywords: "API-ADR-01 API-ADR-10 decisiones recovery verdict coach admin rate limiting pagination idempotencia" },

  // 16
  { title: "Preguntas Abiertas", module: "Gobernanza", url: "modules/16-preguntas-abiertas/index.html", keywords: "preguntas abiertas autoauditoría cobertura del contrato endpoints documentados DTO documentados" },
];
