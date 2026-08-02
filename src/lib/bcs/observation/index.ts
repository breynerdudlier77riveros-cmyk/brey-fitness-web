// ── API pública del Clinical Observation Generator (COG v1.0) ──────────────
// Todo consumidor importa desde aquí. Los módulos internos no son parte del
// contrato y pueden reorganizarse —o sustituirse por un modelo de lenguaje—
// sin romper ningún call site.

export { generarObservaciones } from './orquestador';

export { PLANTILLAS, CASOS_RECHAZADOS, TOTAL_PLANTILLAS } from './plantillas';
export { PRIORIDADES, prioridadDe } from './prioridad';
export { ORDEN_BLOQUES, TITULO_BLOQUE } from './orden';
export { CONOCIMIENTO } from './conocimiento';

export type {
  BloqueInforme,
  BloqueObservacion,
  ClinicalObservationReport,
  EntradaObservacion,
  Observacion,
  Trazabilidad,
} from './tipos';

export type { NivelEvidencia, Poblacion } from './conocimiento';
export type { PrioridadObservacion } from './prioridad';
