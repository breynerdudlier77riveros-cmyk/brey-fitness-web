// ── Índice de búsqueda — BREY Master Exercise Dataset v1.0 ────────────────
// Estático (sin fetch) para funcionar bajo file://.

const BREY_SEARCH_INDEX = [
  { title: "Introducción", module: "Fundamento", url: "modules/00-introduccion/index.html", keywords: "dataset maestro SSoT qué es alcance 200 250 ejercicios modelo congelado especificación" },
  { title: "Filosofía del Dataset", module: "Fundamento", url: "modules/01-filosofia/index.html", keywords: "DS-01 DS-10 principios identidad inmutable append-only nunca borrar estructura congelada crecer sin migrar" },
  { title: "Arquitectura", module: "Fundamento", url: "modules/02-arquitectura/index.html", keywords: "capas núcleo clasificación relaciones gobierno consumidores contrato de lectura proyecciones" },
  { title: "Identidad", module: "El Exercise", url: "modules/03-identidad/index.html", keywords: "id slug dualidad clave primaria inmutable nombre canónico display alias" },
  { title: "Modelo Oficial", module: "El Exercise", url: "modules/04-modelo/index.html", keywords: "38 campos bloques obligatorio opcional derivado tipos cardinalidad esquema congelado" },
  { title: "Organización", module: "El Exercise", url: "modules/05-organizacion/index.html", keywords: "particionado por patrón nueve colecciones índice maestro plan de cobertura 220" },
  { title: "Versionado", module: "Estabilidad", url: "modules/06-versionado/index.html", keywords: "rev revisión entera major minor fix dataset semver historial changelog" },
  { title: "Compatibilidad", module: "Estabilidad", url: "modules/07-compatibilidad/index.html", keywords: "append-only tombstone sucesor deprecación resolución histórica congelado contrato" },
  { title: "Convenciones de Nombres", module: "Estabilidad", url: "modules/08-convenciones-nombres/index.html", keywords: "nombre canónico display corto inglés alias reglas ortografía implemento" },
  { title: "IDs Permanentes", module: "Estabilidad", url: "modules/09-ids/index.html", keywords: "EX-0001 formato secuencial cuatro dígitos nunca reutilizar rangos reservados asignación" },
  { title: "Slugs", module: "Estabilidad", url: "modules/10-slugs/index.html", keywords: "kebab-case ASCII derivación colisión sufijo estable inmutable reglas de formación" },
  { title: "Relaciones", module: "Relaciones", url: "modules/11-relaciones/index.html", keywords: "grafo variante progresión regresión equivalente sustituto cardinalidad integridad" },
  { title: "Variantes", module: "Relaciones", url: "modules/12-variantes/index.html", keywords: "variante criterio de identidad mismo ejercicio distinto agarre implemento apoyo" },
  { title: "Progresiones", module: "Relaciones", url: "modules/13-progresiones/index.html", keywords: "cadena siguiente dificultad creciente lineal raíz ramificación orden" },
  { title: "Regresiones", module: "Relaciones", url: "modules/14-regresiones/index.html", keywords: "cadena anterior dificultad decreciente simetría reciprocidad" },
  { title: "Mantenimiento", module: "Operación", url: "modules/15-mantenimiento/index.html", keywords: "estados draft review approved published deprecated archived transiciones autoridad" },
  { title: "Checklist de Alta", module: "Operación", url: "modules/16-checklist/index.html", keywords: "checklist 28 ítems alta nuevo ejercicio verificación aceptación bloqueantes" },
  { title: "Roadmap", module: "Operación", url: "modules/17-roadmap/index.html", keywords: "fases lotes cobertura 220 ejercicios hitos orden de construcción métricas" },
];
