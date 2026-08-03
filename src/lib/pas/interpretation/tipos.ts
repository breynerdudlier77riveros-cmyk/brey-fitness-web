// ── Contratos del PIE: reunión (Sprint PAS-4.0) ────────────────────────────
// Los tipos viven en dos archivos por tamaño, no por naturaleza:
// `conocimiento.ts` (lo que entra de la PKB) e `informe.ts` (lo que sale).
// Este módulo los reúne para que el resto del motor importe de un solo sitio.

export { PKB_VACIA } from './conocimiento';

export type {
  ConocimientoPKB,
  EstadoCorrespondencia,
  FichaPKB,
  LimitacionPKB,
  NivelEvidencia,
  Poblacion,
} from './conocimiento';

export type {
  BloqueInterpretacion,
  CoberturaPerfil,
  Interpretacion,
  MetaInterpretacion,
  PerformanceInterpretationReport,
  PrioridadInterpretacion,
  Trazabilidad,
} from './informe';
