// ── Índice de búsqueda — BCS Design System Handbook v1.0 ────────────────
// Estático (sin fetch) para funcionar bajo file:// — mismo patrón que los
// demás handbooks de BREY.

const BREY_SEARCH_INDEX = [
  // 00
  { title: "Introducción", module: "Fundamentos", url: "modules/00-introduccion/index.html", keywords: "objetivo sistema de diseño real BREY componentes existentes" },
  { title: "Hallazgo de partida — este sistema ya existe", module: "00 · Introducción", url: "modules/00-introduccion/index.html#hallazgo", keywords: "globals.css brand components Ley 2 Ley 7 Constitución de Diseño" },
  { title: "Convenciones de este documento", module: "00 · Introducción", url: "modules/00-introduccion/index.html#convenciones", keywords: "heredado nuevo v2 tags" },

  // 01
  { title: "Filosofía visual", module: "Fundamentos", url: "modules/01-filosofia-visual/index.html", keywords: "minimalismo claridad jerarquía consistencia contraste respiración escaneabilidad accesibilidad determinismo explicabilidad" },
  { title: "Los diez principios", module: "01 · Filosofía visual", url: "modules/01-filosofia-visual/index.html#principios" },

  // 02
  { title: "Arquitectura de experiencia", module: "Fundamentos", url: "modules/02-arquitectura-experiencia/index.html", keywords: "recorrido entrenador cliente compartir historial comparación nueva medición" },
  { title: "Mapa completo del recorrido", module: "02 · Arquitectura de experiencia", url: "modules/02-arquitectura-experiencia/index.html#mapa" },
  { title: "Matriz de pantallas", module: "02 · Arquitectura de experiencia", url: "modules/02-arquitectura-experiencia/index.html#matriz-pantallas" },

  // 03
  { title: "Sistema de Layout", module: "Sistema visual", url: "modules/03-sistema-layout/index.html", keywords: "grid spacing container anchuras columnas padding breakpoints max-w-5xl" },
  { title: "Escala de espaciado", module: "03 · Sistema de Layout", url: "modules/03-sistema-layout/index.html#spacing" },
  { title: "Breakpoints", module: "03 · Sistema de Layout", url: "modules/03-sistema-layout/index.html#breakpoints", keywords: "mobile tablet desktop ultra wide" },

  // 04
  { title: "Sistema tipográfico", module: "Sistema visual", url: "modules/04-sistema-tipografico/index.html", keywords: "Inter escala jerarquía peso interlineado longitud máxima" },
  { title: "Números — regla nueva", module: "04 · Sistema tipográfico", url: "modules/04-sistema-tipografico/index.html#numeros", keywords: "tabular figures alineación columnas" },

  // 05
  { title: "Sistema de color", module: "Sistema visual", url: "modules/05-sistema-color/index.html", keywords: "semántico funcional informativo advertencia éxito fondo contraste modo oscuro" },
  { title: "Modo oscuro y modo claro", module: "05 · Sistema de color", url: "modules/05-sistema-color/index.html#modo-oscuro-claro", keywords: "solo dark mode v2" },
  { title: "Estados de interacción", module: "05 · Sistema de color", url: "modules/05-sistema-color/index.html#estados", keywords: "hover disabled focus active" },

  // 06
  { title: "Componentes", module: "Componentes y pantallas", url: "modules/06-componentes/index.html", keywords: "cards buttons inputs selects tabs badges progress accordions dialogs tooltips skeletons" },
  { title: "Componentes nuevos de este dominio", module: "06 · Componentes", url: "modules/06-componentes/index.html#nuevos", keywords: "metric card section card history card warning card info card indicador skeleton" },
  { title: "Componentes heredados", module: "06 · Componentes", url: "modules/06-componentes/index.html#heredados", keywords: "brand button card tabs badge progress accordion dialog tooltip" },

  // 07
  { title: "Dashboard del entrenador", module: "Componentes y pantallas", url: "modules/07-dashboard-entrenador/index.html", keywords: "distribución prioridades flujo visual acciones primarias secundarias" },
  { title: "Qué jamás debe esconderse", module: "07 · Dashboard del entrenador", url: "modules/07-dashboard-entrenador/index.html#jamas-esconder" },

  // 08
  { title: "Vista pública del cliente", module: "Componentes y pantallas", url: "modules/08-vista-publica-cliente/index.html", keywords: "cómo se siente qué ve qué no ve compartir imprimir exportar" },

  // 09
  { title: "Visualización de métricas", module: "Datos y visualización", url: "modules/09-visualizacion-metricas/index.html", keywords: "peso grasa músculo agua proteína minerales IMC SMI WHR grasa visceral ángulo de fase" },
  { title: "Matriz de cobertura de las 25 variables", module: "09 · Visualización de métricas", url: "modules/09-visualizacion-metricas/index.html#matriz-cobertura" },

  // 10
  { title: "Sistema de barras", module: "Datos y visualización", url: "modules/10-sistema-barras/index.html", keywords: "InBody Tanita Seca ancho altura marcadores zonas escala ticks leyenda" },
  { title: "Por qué una barra propia", module: "10 · Sistema de barras", url: "modules/10-sistema-barras/index.html#por-que" },

  // 11
  { title: "Sistema de gráficos", module: "Datos y visualización", url: "modules/11-sistema-graficos/index.html", keywords: "línea área radar columnas barras scatter qué usar qué no usar" },
  { title: "Qué NO usar en v1", module: "11 · Sistema de gráficos", url: "modules/11-sistema-graficos/index.html#que-no-usar", keywords: "radar scatter columnas descartado" },

  // 12
  { title: "Comparaciones", module: "Datos y visualización", url: "modules/12-comparaciones/index.html", keywords: "medición vs medición fecha diferencias cambio positivo negativo insignificante" },

  // 13
  { title: "Estados", module: "Comportamiento", url: "modules/13-estados/index.html", keywords: "vacío error carga offline sin historial sin internet sin datos suficientes sin permiso" },
  { title: "Jerarquía de estados en una sola pantalla", module: "13 · Estados", url: "modules/13-estados/index.html#diagrama" },

  // 14
  { title: "Exportación", module: "Comportamiento", url: "modules/14-exportacion/index.html", keywords: "PDF PNG impresión A4 carta responsive márgenes numeración pie de página" },

  // 15
  { title: "Accesibilidad", module: "Comportamiento", url: "modules/15-accesibilidad/index.html", keywords: "WCAG navegación teclado lectores de pantalla contraste tamaño mínimo objetivos táctiles focus ARIA" },
  { title: "Matriz de contraste verificado", module: "15 · Accesibilidad", url: "modules/15-accesibilidad/index.html#contraste" },

  // 16
  { title: "Motion System", module: "Comportamiento", url: "modules/16-motion-system/index.html", keywords: "animaciones duración curvas cuándo animar transiciones microinteracciones" },
  { title: "Cuándo NO animar", module: "16 · Motion System", url: "modules/16-motion-system/index.html#cuando-no-animar" },

  // 17
  { title: "Design Tokens", module: "Gobernanza", url: "modules/17-design-tokens/index.html", keywords: "spacing radius shadow opacity elevation typography grid animation naming versionado" },

  // 18
  { title: "Casos especiales", module: "Gobernanza", url: "modules/18-casos-especiales/index.html", keywords: "pantallas pequeñas enormes zoom muchos registros variables desconocidas" },

  // 19
  { title: "Roadmap", module: "Gobernanza", url: "modules/19-roadmap/index.html", keywords: "v1 v2 nunca entra modo claro PNG radar scatter" },

  // 20
  { title: "ADR", module: "Gobernanza", url: "modules/20-adr/index.html", keywords: "BCSD-ADR-01 BCSD-ADR-06 decisiones de arquitectura" },

  // 21
  { title: "Glosario", module: "Gobernanza", url: "modules/21-glosario/index.html", keywords: "BCSD Ley 2 Ley 7 metric card section card history card tabular figures" },
];
