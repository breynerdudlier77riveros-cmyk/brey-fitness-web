// ── API pública del PPRE (Sprint PAS-6.0) ──────────────────────────────────
// Todo consumidor importa desde aquí. Los módulos internos no son contrato.
//
// Capa PURA: no importa React, Next, Supabase ni nada con efectos, y no lee el
// reloj — la fecha procede de las coordenadas del PAE.

export { generarRecomendaciones, auditarRecomendaciones } from './orquestador';
export { VERSION_PPRE } from './version';

export {
  CASOS_RECHAZADOS,
  LIMITACIONES_DE_ALCANCE,
  TOTAL_CASOS_RECHAZADOS,
} from './casos-rechazados';

export {
  CATEGORIAS,
  ETIQUETA_CATEGORIA,
  ETIQUETA_PRIORIDAD,
  ORDEN_CATEGORIAS,
  PRIORIDADES,
  esCategoria,
  esPrioridad,
} from './categorias';

export { REGLAS, TOTAL_REGLAS, definicionRegla, esRegla } from './reglas';
export { PLANTILLAS, TOTAL_PLANTILLAS, plantilla } from './plantillas';
export {
  FRASES_PROHIBIDAS,
  VOCABULARIO_PROHIBIDO,
  auditarTextos,
  esTextoAdmisible,
  terminosProhibidos,
} from './vocabulario';

export { compararPrioridad, esMasPrioritaria, ordenarYDeduplicar } from './prioridad';
export { construirRecomendacion, trazaCompleta } from './constructor';
export { enumerar, render } from './render';
export { calcularEstadisticas, componerResumen, ejecutarReglas, reglasDescartadas } from './motor';
export { construirEvidencia, fichasDe, referenciasDe } from './evidencia';

export type {
  CategoriaRecomendacion,
  EstadisticasRecomendaciones,
  EstadoRecomendacion,
  EvidenciaRecomendacion,
  LimitacionGeneral,
  MetaRecomendaciones,
  PerformanceRecommendationReport,
  PrioridadRecomendacion,
  Recomendacion,
  ReglaDescartada,
  TrazabilidadRecomendacion,
} from './tipos';

export type { CasoRechazado } from './casos-rechazados';
export type { DefinicionRegla } from './reglas';
export type { Plantilla } from './plantillas';
export type { ContextoPPRE } from './contexto';
export type { EntradaRecomendacion } from './constructor';
