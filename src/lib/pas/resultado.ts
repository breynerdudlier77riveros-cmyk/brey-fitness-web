// ── Contratos de SALIDA del PAE: reunión (Sprint PAS-2.0) ──────────────────
// Los tipos de salida viven en dos archivos por tamaño, no por naturaleza:
// `estado.ts` (Estado de Capacidad y su traza) e `informe.ts` (conflictos,
// hallazgos, limitaciones y el análisis completo). Este módulo los reúne para
// que el resto del motor importe de un solo sitio.

export { ESTADOS_CAPACIDAD } from './estado';

export type {
  CoordenadasVersion,
  EstadoCapacidad,
  EstadoCapacidadValor,
  MotivoExclusion,
  RegistroExcluido,
  Traza,
} from './estado';

export type {
  Conflicto,
  Hallazgo,
  InformeConsistencia,
  Limitacion,
  NivelConsistencia,
  PerformanceAnalysis,
  ResumenAnalisis,
  TipoConflicto,
  TipoHallazgo,
  TipoLimitacion,
} from './informe';
