// ── Índice de búsqueda — Exercise Tagging Handbook v1.0 ───────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  { title: "Introducción", module: "Empezar", url: "modules/00-introduccion/index.html", keywords: "propósito alcance barrido rehecho SSoT etiquetado justificable deuda documental P14 frontera de autoridad humana" },
  { title: "Filosofía del Etiquetado", module: "Empezar", url: "modules/01-filosofia/index.html", keywords: "TG-01 TG-08 principios el humano autoriza el motor ensambla criterio biomecánico trazabilidad rechazo" },
  { title: "Jerarquía de Reglas", module: "El proceso", url: "modules/02-jerarquia-reglas/index.html", keywords: "conflicto entre reglas precedencia seguridad estructura vocabulario criterio orden de autoridad" },
  { title: "Proceso Oficial", module: "El proceso", url: "modules/03-proceso-oficial/index.html", keywords: "siete pasos identificar patrón rol modalidad equipamiento restricciones validar aceptar rechazar" },
  { title: "Patrones", module: "Reglas por atributo", url: "modules/04-patrones/index.html", keywords: "patrón primario secundario burpee multi-patrón degradación empate sin regla deuda" },
  { title: "Roles", module: "Reglas por atributo", url: "modules/05-roles/index.html", keywords: "principal accesorio activacion core-final metabolico múltiples roles orden fatiga R-4" },
  { title: "Modalidad", module: "Reglas por atributo", url: "modules/06-modalidad/index.html", keywords: "dinamico isometrico bilateral unilateral unidad reps segundos equivalencias contador cronómetro" },
  { title: "Equipamiento", module: "Reglas por atributo", url: "modules/07-equipamiento/index.html", keywords: "barra mancuernas maquina peso-corporal cables kettlebell Track conjunción disyunción mapeo" },
  { title: "Zonas de Riesgo", module: "Reglas por atributo", url: "modules/08-zonas-riesgo/index.html", keywords: "rodilla cadera lumbar hombro codo-muneca tobillo alto medio bajo criterio biomecánico seguridad" },
  { title: "Cadena", module: "Reglas por atributo", url: "modules/09-cadena/index.html", keywords: "eslabón anterior siguiente lineal sin ciclos dentro de un patrón huecos de nivel orden entrenador" },
  { title: "Capacidades y Nivel", module: "Reglas por atributo", url: "modules/10-capacidades-nivel/index.html", keywords: "capacidad prerequisito demostrable gates calistenia nivel principiante intermedio avanzado sistemasVinculados" },
  { title: "Híbridos y Conflictos", module: "Consistencia", url: "modules/11-hibridos-conflictos/index.html", keywords: "ejercicio híbrido multi-patrón empate conflicto sin regla no inventar deuda escalado humano" },
  { title: "Matrices de Consistencia", module: "Consistencia", url: "modules/12-matrices-consistencia/index.html", keywords: "matriz patrón rol modalidad equipamiento compatibilidad combinaciones cobertura" },
  { title: "Validaciones", module: "Consistencia", url: "modules/13-validaciones/index.html", keywords: "inválido rechazado estructural contenido sin patronPrimario ciclo slot sin rol null vacío" },
  { title: "Checklist Oficial", module: "Consistencia", url: "modules/14-checklist/index.html", keywords: "checklist revisión etiquetado aceptación rechazo verificación paso a paso" },
  { title: "Anti-patterns", module: "Gobernanza", url: "modules/15-anti-patterns/index.html", keywords: "TGA errores frecuentes inferir del nombre copiar de otro ejercicio etiquetar por músculo default silencioso" },
  { title: "ADR", module: "Gobernanza", url: "modules/16-adr/index.html", keywords: "TG-ADR decisiones documentales encontradas arbitraje declaración sin decisiones nuevas" },
  { title: "Auditoría Final", module: "Gobernanza", url: "modules/17-auditoria/index.html", keywords: "métricas cuantitativas reglas respaldadas parciales inexistentes porcentaje criterio humano bloqueantes catálogo" },
];
