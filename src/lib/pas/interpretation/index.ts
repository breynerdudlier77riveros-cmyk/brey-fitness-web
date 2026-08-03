// ── API pública del Performance Interpretation Engine (Sprint PAS-4.0) ─────
// Todo consumidor importa desde aquí. Los módulos internos no son contrato.
//
// Capa PURA: no importa React, Next, Supabase ni nada con efectos, y no lee el
// reloj — la fecha del informe procede de las coordenadas que el PAE ya fijó.

export { interpretarRendimiento, auditarInforme } from './orquestador';
export { VERSION_PIE } from './version';

export { PKB_V1, TOTAL_AUTORIZADAS, TOTAL_RECHAZADAS } from './conocimiento-v1';
export { PKB_VACIA } from './tipos';

export { CASOS_RECHAZADOS, TOTAL_CASOS_RECHAZADOS } from './casos-rechazados';
export { REGLAS, TOTAL_REGLAS, definicionRegla, esRegla } from './reglas';
export { PLANTILLAS, TOTAL_PLANTILLAS, plantilla } from './plantillas';
export { VOCABULARIO_PROHIBIDO, esTextoAdmisible, terminosProhibidos } from './vocabulario';
export { COBERTURA_DE_LIMITACIONES, esLimitante, limitacionesPKBAplicadas } from './limitaciones';

// Piezas reutilizables. Puras y deterministas.
export { PRIORIDADES, compararPrioridad, esMasPrioritaria, ordenarYDeduplicar } from './prioridad';
export { construirInterpretacion, trazaCompleta } from './trazabilidad';
export { enumerar, render } from './render';
export { indexarHallazgos, indexarPKB, todasLasInterpretaciones } from './motor';
export { calcularCobertura } from './reglas-perfil';
export {
  etiquetaCapacidad,
  etiquetaDominio,
  etiquetaLimitacion,
  etiquetaNivel,
  etiquetaPoblacion,
} from './etiquetas';

export type {
  BloqueInterpretacion,
  CoberturaPerfil,
  ConocimientoPKB,
  EstadoCorrespondencia,
  FichaPKB,
  Interpretacion,
  LimitacionPKB,
  MetaInterpretacion,
  NivelEvidencia,
  PerformanceInterpretationReport,
  Poblacion,
  PrioridadInterpretacion,
  Trazabilidad,
} from './tipos';

export type { CasoRechazado } from './casos-rechazados';
export type { DefinicionRegla } from './reglas';
export type { Plantilla } from './plantillas';
export type { ContextoCapacidad } from './reglas-capacidad';
export type { EntradaInterpretacion } from './trazabilidad';
