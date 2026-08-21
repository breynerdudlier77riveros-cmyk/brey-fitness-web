// ── Informe humano · API pública (Sprint PAS-8) ────────────────────────────
//
// La capa que separa la ciencia del atleta. Por debajo: NKB, NIE, Report v2.
// Por encima: componentes que solo renderizan.

export {
  componerInformeHumano,
  type EntradaInformeHumano,
  type MedicionPrevia,
} from './componer';
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
