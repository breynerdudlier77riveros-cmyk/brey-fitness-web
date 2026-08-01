// ── Índice de búsqueda — BCS Handbook v1.0 ──────────────────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  // 00
  { title: "Introducción", module: "Fundamentos", url: "modules/00-introduccion/index.html", keywords: "objetivo entrenador cliente único administrador" },
  { title: "Quién es quién", module: "00 · Introducción", url: "modules/00-introduccion/index.html#quien-es-quien", keywords: "entrenador cliente permisos roles" },
  { title: "No alcance", module: "00 · Introducción", url: "modules/00-introduccion/index.html#no-alcance", keywords: "diagnóstico médico dispositivo bluetooth login cliente core product" },
  { title: "Cinco etiquetas de procedencia", module: "00 · Introducción", url: "modules/00-introduccion/index.html#rol", keywords: "crudo derivado fabricante validación científica producto 📟 🧮 🏭 🔬 🟠" },

  // 01
  { title: "Arquitectura", module: "Fundamentos", url: "modules/01-arquitectura/index.html", keywords: "capas bounded context flujo dependencias invariantes" },
  { title: "Bounded context", module: "01 · Arquitectura", url: "modules/01-arquitectura/index.html#bounded-context", keywords: "contexto delimitado core product" },
  { title: "Observabilidad, auditoría y eventos — resumen", module: "01 · Arquitectura", url: "modules/01-arquitectura/index.html#observabilidad-resumen", keywords: "auditoría eventos fold seguridad api interna" },

  // 02
  { title: "Modelo del Dominio", module: "Dominio y datos", url: "modules/02-modelo-dominio/index.html", keywords: "entidades agregados value objects casos de uso máquinas de estado" },
  { title: "Entidades y agregados", module: "02 · Modelo del Dominio", url: "modules/02-modelo-dominio/index.html#entidades", keywords: "cliente medición enlace público reporte aggregate root" },
  { title: "Casos de uso UC-01 a UC-09", module: "02 · Modelo del Dominio", url: "modules/02-modelo-dominio/index.html#casos-uso", keywords: "crear cliente registrar medición generar enlace" },
  { title: "Las tres máquinas de estado", module: "02 · Modelo del Dominio", url: "modules/02-modelo-dominio/index.html#maquinas-estado", keywords: "activo archivado eliminado vigente anulada revocado" },

  // 03
  { title: "Modelo de Datos — catálogo de 25 variables", module: "Dominio y datos", url: "modules/03-modelo-datos/index.html", keywords: "peso IMC grasa masa muscular agua corporal proteína minerales" },
  { title: "Antropometría y datos crudos base", module: "03 · Modelo de Datos", url: "modules/03-modelo-datos/index.html#antropometria", keywords: "altura peso impedancia BCS-V01 BCS-V02 BCS-V22" },
  { title: "Composición corporal derivada", module: "03 · Modelo de Datos", url: "modules/03-modelo-datos/index.html#composicion", keywords: "IMC porcentaje grasa masa grasa masa muscular masa ósea grasa visceral ángulo de fase" },
  { title: "Agua corporal", module: "03 · Modelo de Datos", url: "modules/03-modelo-datos/index.html#agua", keywords: "agua corporal total intracelular extracelular" },
  { title: "Metabólicos e índices", module: "03 · Modelo de Datos", url: "modules/03-modelo-datos/index.html#metabolicos", keywords: "BMR edad metabólica SMI WHR circunferencia cintura cadera" },
  { title: "Matriz de validaciones cruzadas", module: "03 · Modelo de Datos", url: "modules/03-modelo-datos/index.html#matriz-validaciones", keywords: "masa grasa masa libre de grasa agua intracelular extracelular" },

  // 04
  { title: "Modelo del Reporte", module: "Reporte", url: "modules/04-modelo-reporte/index.html", keywords: "resumen ejecutivo gráficos tablas barras de progreso histórico" },
  { title: "Reporte privado vs. público — paridad", module: "04 · Modelo del Reporte", url: "modules/04-modelo-reporte/index.html#paridad", keywords: "mismo contenido edición vista pública" },

  // 05
  { title: "Modelo del Historial", module: "Reporte", url: "modules/05-modelo-historial/index.html", keywords: "historial ilimitado corrección comparación mejoras retrocesos" },
  { title: "Corrección de una Medición pasada", module: "05 · Modelo del Historial", url: "modules/05-modelo-historial/index.html#correccion", keywords: "anular vigente nueva medición inmutabilidad" },
  { title: "Mejoras y retrocesos", module: "05 · Modelo del Historial", url: "modules/05-modelo-historial/index.html#mejoras-retrocesos", keywords: "dirección de mejora grasa masa muscular" },

  // 06
  { title: "Modelo de Interpretación", module: "Reporte", url: "modules/06-modelo-interpretacion/index.html", keywords: "clasificación diagnóstico lenguaje clínico" },
  { title: "El aviso poblacional", module: "06 · Modelo de Interpretación", url: "modules/06-modelo-interpretacion/index.html#aviso-poblacional", keywords: "alta masa muscular población entrenada IMC WHR" },
  { title: "Qué variables tienen clasificación", module: "06 · Modelo de Interpretación", url: "modules/06-modelo-interpretacion/index.html#que-se-clasifica", keywords: "SMI ángulo de fase edad metabólica no se clasifica" },

  // 07
  { title: "Modelo de Visualización", module: "Reporte", url: "modules/07-modelo-visualizacion/index.html", keywords: "gráfico de línea barra de progreso tabla comparativa galería" },
  { title: "Reglas de diseño conceptual", module: "07 · Modelo de Visualización", url: "modules/07-modelo-visualizacion/index.html#reglas", keywords: "badge de procedencia eje huecos de tiempo" },

  // 08
  { title: "Seguridad", module: "Acceso y datos sensibles", url: "modules/08-seguridad/index.html", keywords: "RLS permisos auditoría eventos de seguridad" },
  { title: "Modelo de permisos", module: "08 · Seguridad", url: "modules/08-seguridad/index.html#permisos", keywords: "entrenador cliente token autenticación" },
  { title: "Auditoría", module: "08 · Seguridad", url: "modules/08-seguridad/index.html#auditoria", keywords: "quién qué cuándo registro inmutable" },

  // 09
  { title: "Compartición", module: "Acceso y datos sensibles", url: "modules/09-comparticion/index.html", keywords: "manual whatsapp email un enlace activo" },
  { title: "Un enlace activo por cliente", module: "09 · Compartición", url: "modules/09-comparticion/index.html#un-enlace-activo", keywords: "reemplazo automático revocación" },

  // 10
  { title: "Links Públicos", module: "Acceso y datos sensibles", url: "modules/10-links-publicos/index.html", keywords: "token aleatorio noindex qué expone" },
  { title: "Diseño del token", module: "10 · Links Públicos", url: "modules/10-links-publicos/index.html#token", keywords: "21 caracteres aleatorio criptográfico" },
  { title: "Sobre la expiración automática", module: "10 · Links Públicos", url: "modules/10-links-publicos/index.html#expiracion", keywords: "no incluida v1 roadmap" },

  // 11
  { title: "Privacidad", module: "Acceso y datos sensibles", url: "modules/11-privacidad/index.html", keywords: "datos sensibles consentimiento retención derecho a eliminación" },
  { title: "Fotografías — tratamiento especial", module: "11 · Privacidad", url: "modules/11-privacidad/index.html#fotografias", keywords: "almacenamiento separado dato más sensible" },

  // 12
  { title: "Escalabilidad", module: "Sistema y gobernanza", url: "modules/12-escalabilidad/index.html", keywords: "volumen esperado single-tenant multi-tenant paginación" },

  // 13
  { title: "API Interna", module: "Sistema y gobernanza", url: "modules/13-api-interna/index.html", keywords: "casos de uso pseudocódigo repositorios eventos de dominio" },
  { title: "Catálogo de eventos de dominio", module: "13 · API Interna", url: "modules/13-api-interna/index.html#eventos-dominio", keywords: "cliente_creado medicion_registrada enlace_creado" },

  // 14
  { title: "Roadmap", module: "Sistema y gobernanza", url: "modules/14-roadmap/index.html", keywords: "v1.0 v1.1 candidatos riesgos" },
  { title: "Riesgos", module: "14 · Roadmap", url: "modules/14-roadmap/index.html#riesgos", keywords: "enlace compartido mal interpretación diagnóstico rate limiting" },

  // 15
  { title: "Glosario", module: "Sistema y gobernanza", url: "modules/15-glosario/index.html", keywords: "términos definiciones" },

  // 16
  { title: "ADR", module: "Sistema y gobernanza", url: "modules/16-adr/index.html", keywords: "BCS-ADR-01 BCS-ADR-06 decisiones de arquitectura" },

  // 17
  { title: "Preguntas abiertas", module: "Sistema y gobernanza", url: "modules/17-preguntas/index.html", keywords: "consentimiento expiración menores de edad snapshot BMR multi-entrenador" },
];
