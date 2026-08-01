// ── API pública de la capa de análisis del BCS (Sprint I-03) ───────────────
// Todo consumidor (páginas, componentes, tests) importa desde aquí — los
// módulos internos no son parte del contrato y pueden reorganizarse sin
// romper call sites.

export { analizarComposicionCorporal, type OpcionesAnalisis } from './analizar';

export type {
  Aviso,
  BodyCompositionAnalysis,
  CategoriaHallazgo,
  ComparacionMetrica,
  DireccionCambio,
  DisponibilidadComparacion,
  EstadoTendencia,
  Hallazgo,
  Insight,
  ResumenAnalisis,
  SeveridadHallazgo,
  Significancia,
  Suficiencia,
  TendenciaMetrica,
  TipoAviso,
  TonoResumen,
} from './tipos';
