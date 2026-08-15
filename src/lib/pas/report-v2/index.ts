// ── Performance Clinical Report v2 · API del modelo de vista (PRS v2.0) ────

export { escalar, type Escala, type Marca } from './escala';
export {
  ETIQUETA_CALIDAD,
  ETIQUETA_CONFLICTO,
  ETIQUETA_ESTADO_NORMA,
  ETIQUETA_INTERPRETACION,
  ETIQUETA_PAIS,
  ETIQUETA_UNIDAD,
  ETIQUETA_VARIABLE,
} from './etiquetas';
export {
  componerInformeNormativo,
  EJEMPLOS_POR_GRUPO,
  type DatosPortada,
} from './vista';
export type {
  FilaEvidencia,
  InformeNormativoV2,
  GrupoDescarte,
  PanelComparabilidad,
  Portada,
  TarjetaNormativa,
  TarjetaResumen,
  TarjetaSinNorma,
} from './tipos';
