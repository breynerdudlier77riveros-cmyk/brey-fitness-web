// ── Normative Interpretation Engine · API pública (NIE-1.1 + NIE-1.2) ──────
//
// Alcance de este sprint: EXISTENCIA → CANDIDATURA → APLICABILIDAD.
//
// El NIE **no** calcula posición normativa, no deriva percentiles, no convierte
// unidades, no clasifica y no recomienda. Nada de eso existe todavía, y no debe
// añadirse aquí sin el sprint que lo autorice.
//
// El motor es puro y recibe las normas como dato. Cargarlas desde las fichas de
// la NKB es responsabilidad del adaptador `nkb/cargador`, que sí toca ficheros
// y por eso se importa aparte.

export type {
  Calidad,
  Candidata,
  CategoriaDiferencia,
  ComparacionCandidatas,
  ComparacionDimension,
  Diferencia,
  EstadoEvidencia,
  EstadoInterpretacion,
  EstadoUnidad,
  ResultadoEstadistico,
  ParametrosModelo,
  PercentilPublicado,
  ValoresNormativos,
  ConflictoDeclarado,
  ContextoEvaluacion,
  DefinicionOperacional,
  DimensionId,
  EstadoAplicabilidad,
  EstadoDimension,
  EstadoNorma,
  EstadoResolucion,
  Equivalencia,
  InstrumentoId,
  Lado,
  MotivoReserva,
  NormaNKB,
  PaisId,
  Posicion,
  Procedencia,
  RangoEstatura,
  RangoEtario,
  ResolucionNormativa,
  Sexo,
  TipoNorma,
  Unidad,
  VariableId,
} from './tipos';

export { UNIT_MISMATCH } from './tipos';

export { compararDimensiones } from './dimensiones';
export { compararCandidatas, describirDiferenciaDeValores } from './comparacion';
export {
  autorizar,
  TIPOS_CON_NORMAS,
  type Autorizacion,
  type OperacionRealizada,
  type OperacionSolicitada,
} from './operaciones';
export {
  interpretar,
  interpretarConjunto,
  type ResultadoInterpretacion,
} from './estadistica';
export {
  comparables,
  compararValor,
  interpretarNormativamente,
  type InterpretacionNormativa,
  type NormaResumen,
  type OpcionesComparacion,
  type ResolucionUnidad,
  type ResultadoNormativo,
} from './comparacion-normativa';
export {
  ADVERTENCIA_METODOLOGICA,
  TABLA_CONVERSIONES,
  UNIDADES_CONOCIDAS,
  entradaDe,
  type ConversionNoAutorizada,
  type EntradaTabla,
  type EstadoConversion,
  type FactorConversion,
} from './conversiones';
export {
  convertir,
  decimalesDe,
  esConvertible,
  type ResultadoConversion,
  type TrazabilidadConversion,
  type ValorConvertido,
} from './conversion-unidad';
export {
  crearValorObservado,
  type ProcedenciaObservacion,
  type ValorObservado,
} from './valor-observado';
export { determinarAplicabilidad, type Veredicto } from './aplicabilidad';
export { contextoVacio, resolver, utilizables } from './resolucion';
export {
  construirSalida,
  type ConflictoPropagado,
  type ConversionRegistrada,
  type Distinciones,
  type Divergencia,
  type Evidencia,
  type Particion,
  type SalidaNIE,
} from './salida';
