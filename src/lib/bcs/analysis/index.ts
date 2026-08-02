// ── API pública de la capa de análisis del BCS (Sprint I-03) ───────────────
// Todo consumidor (páginas, componentes, tests) importa desde aquí — los
// módulos internos no son parte del contrato y pueden reorganizarse sin
// romper call sites.

export { analizarComposicionCorporal, type OpcionesAnalisis } from './analizar';

/**
 * Reglas numéricas que la sección de Metodología del reporte necesita citar.
 * Se exponen desde aquí (no se copian al componente) para que el documento
 * mostrado al cliente nunca pueda desviarse del umbral que el motor aplica
 * de verdad.
 */
export { TOLERANCIA_SUMA_MASAS_KG } from './reglas';

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
