// ── API pública del Performance Assessment Engine (Sprint PAS-2.0) ─────────
// Todo consumidor importa desde aquí. Los módulos internos no son contrato:
// que `derivacion.ts` o `conflictos-registro.ts` existan es un detalle de
// implementación, y cambiarlos no debe romper a nadie.
//
// Este motor es capa PURA. No importa React, Next, Supabase ni nada con
// efectos, y ninguna función suya lee el reloj: `hoyISO` siempre entra por
// argumento.

export { analizarRendimiento, analizarEvaluacion, analisisVacio } from './orquestador';

export { VERSION_MOTOR } from './version';

export {
  CAPACIDADES,
  CAPACIDADES_ACTIVAS,
  CAPACIDADES_RESERVADAS,
  DOMINIOS,
  FAMILIAS,
  FAMILIAS_RESERVADAS,
  FAMILIAS_SOLO_CONTEXTO,
  definicionCapacidad,
  esCapacidad,
  esFamilia,
} from './capacidades';

export { CATALOGO_VACIO, TIPOS_EVALUACION } from './tipos';
export { ESTADOS_CAPACIDAD } from './resultado';

// Piezas reutilizables por otros motores del ecosistema. Se exponen porque
// son puras y deterministas; no porque el PAE dependa de que nadie las use.
export { compararFechas, dentroDeVigencia, diasEntre, esFechaISO, esFutura, fechaMasReciente } from './fechas';
export { contribucionAplicable, evaluarElegibilidadBase } from './elegibilidad';
export { agrupar, claveValor, esDivergente, esDuplicadoExacto } from './duplicados';
export { detectarConflictos, ordenarConflictos, registrosDivergentes } from './conflictos';
export { evaluarConsistencia } from './consistencia';
export { generarHallazgos } from './hallazgos';
export { generarLimitaciones } from './limitaciones';
export { derivarCapacidad, derivarCapacidades } from './derivacion';
export { construirTraza, coordenadas, crearHallazgo, ordenarHallazgos } from './trazabilidad';
export { indexarCatalogo, indexarCobertura } from './motor';

export type {
  CapacidadId,
  DefinicionCapacidad,
  DominioId,
  FamiliaId,
} from './capacidades';

export type {
  CatalogoPruebas,
  CoberturaCapacidad,
  Contribucion,
  DefinicionPrueba,
  EstadoRegistro,
  EvaluacionPAS,
  NaturalezaResultado,
  RegistroPrueba,
  SolicitudAnalisis,
  TipoEvaluacion,
  ValorRegistro,
} from './tipos';

export type {
  Conflicto,
  CoordenadasVersion,
  EstadoCapacidad,
  EstadoCapacidadValor,
  Hallazgo,
  InformeConsistencia,
  Limitacion,
  MotivoExclusion,
  NivelConsistencia,
  PerformanceAnalysis,
  RegistroExcluido,
  ResumenAnalisis,
  TipoConflicto,
  TipoHallazgo,
  TipoLimitacion,
  Traza,
} from './resultado';

export type { ContextoDerivacion } from './derivacion';
export type { ResultadoElegibilidad } from './elegibilidad';
export type { GrupoRegistros } from './duplicados';
export type { CorrespondenciaAplicada } from './trazabilidad';
