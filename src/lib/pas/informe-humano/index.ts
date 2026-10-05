// ── Informe humano · API pública (Sprint PAS-8) ────────────────────────────
//
// La capa que separa la ciencia del atleta. Por debajo: NKB, NIE, Report v2.
// Por encima: componentes que solo renderizan.

export {
  componerInformeHumano,
  type EntradaInformeHumano,
  type MedicionPrevia,
} from './componer';
export { panelFmsDe, type MedicionFms } from './fms';
export { panelMcGillDe, type MedicionMcGill } from './mcgill';
export { panelVo2EstimadoDe, type MedicionVo2Estimado } from './vo2-estimado';
export { lecturaLlanaDe } from './llano';
export {
  metaDe,
  objetivoDe,
  type EstadoObjetivo,
  type ObjetivoAtleta,
  type RangoObjetivo,
  type TipoObjetivo,
} from './objetivos';
export {
  prepararEntradaIA,
  terminosProhibidosIA,
  VOCABULARIO_PROHIBIDO_IA,
  type AnalisisBreyAI,
  type EntradaBreyAI,
} from './brey-ai';
export type {
  Alerta,
  CodigoAlerta,
  CocientePanelMcGill,
  PanelFms,
  PruebaFms,
  PanelMcGill,
  PanelVo2Estimado,
  PanelObjetivos,
  ResumenAtleta,
  ClaseReferencia,
  DetallesTecnicos,
  EstadoReferencia,
  GrupoDominio,
  InformeHumano,
  Prioridad,
  ReferenciaNormativa,
  RelacionObjetivo,
  ResultadoHumano,
  Tendencia,
} from './tipos';
