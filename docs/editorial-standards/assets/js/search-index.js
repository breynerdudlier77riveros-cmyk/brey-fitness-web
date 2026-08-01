// ── Índice de búsqueda — Editorial Standards Handbook v1.0 ────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  { title: "Introducción", module: "Empezar", url: "modules/00-introduccion/index.html", keywords: "gobernanza del conocimiento qué es qué no es alcance barrido deuda editorial SSoT" },
  { title: "Filosofía Editorial", module: "Empezar", url: "modules/01-filosofia/index.html", keywords: "ED-01 ED-08 autoridad responsabilidad neutralidad no duplicación ciencia marcada el handbook manda" },
  { title: "Ciclo de Vida", module: "Gobierno", url: "modules/02-ciclo-vida/index.html", keywords: "nace evoluciona revisa publica retira estados inexistentes deuda draft approved deprecated archived" },
  { title: "Roles Editoriales", module: "Gobierno", url: "modules/03-roles/index.html", keywords: "autor revisor aprobador administrador experto cero respaldo Contenido Ingeniería criterio de entrenador" },
  { title: "Flujo Editorial", module: "Gobierno", url: "modules/04-flujo/index.html", keywords: "solicitud creación revisión corrección aprobación publicación mantenimiento dónde se rompe" },
  { title: "Autoridad", module: "Gobierno", url: "modules/05-autoridad/index.html", keywords: "P14 quién decide entrenador ingeniería contenido documental frontera de autoridad humana" },
  { title: "Evidencia", module: "Garantías", url: "modules/06-evidencia/index.html", keywords: "consenso sólido evidencia moderada hipótesis decisión de producto badges ciencia marcada nunca inventada" },
  { title: "Versionado", module: "Garantías", url: "modules/07-versionado/index.html", keywords: "versión de catálogo BPS-023 ADR-009 R-2 cambios mayores menores correcciones por entrada deuda" },
  { title: "Trazabilidad", module: "Garantías", url: "modules/08-trazabilidad/index.html", keywords: "autor fecha motivo justificación fuente estado dónde se registra sin campo P3 P2" },
  { title: "Control de Calidad", module: "Garantías", url: "modules/09-control-calidad/index.html", keywords: "checklist editorial consistencia duplicados terminología lenguaje ubicuo integridad" },
  { title: "Revisión", module: "Garantías", url: "modules/10-revision/index.html", keywords: "revisión técnica editorial científica de dominio no existen cero archivos deuda" },
  { title: "Conflictos", module: "Operación", url: "modules/11-conflictos/index.html", keywords: "escalado registro conservación gobernar no decidir TG-07 ADR contradicción" },
  { title: "Mantenimiento", module: "Operación", url: "modules/12-mantenimiento/index.html", keywords: "actualizar corregir retirar fusionar cola editorial sin mecanismo deuda" },
  { title: "Integración", module: "Operación", url: "modules/13-integracion/index.html", keywords: "taxonomy tagging catalog exercise library generator motores cadena de dependencia" },
  { title: "ADR Editoriales", module: "Gobernanza", url: "modules/14-adr/index.html", keywords: "ED-ADR decisiones editoriales respaldadas sin biomecánica sin entrenamiento" },
  { title: "Anti-patterns", module: "Gobernanza", url: "modules/15-anti-patterns/index.html", keywords: "EDA duplicar cambiar slug perder trazabilidad modificar sin autorización inventar etiquetas deriva silenciosa" },
  { title: "Deuda Editorial", module: "Gobernanza", url: "modules/16-deuda-editorial/index.html", keywords: "ED-D lista priorizada qué falta qué bloquea criterio humano" },
  { title: "Roadmap y Auditoría", module: "Gobernanza", url: "modules/17-roadmap/index.html", keywords: "auditoría cuantitativa 36 celdas 47,2% 100 500 1000 ejercicios escala bloqueantes" },
];
