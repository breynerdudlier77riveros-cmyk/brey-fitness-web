// ── API pública del Performance Report System (Sprint PAS-5.0) ─────────────
// Capa de composición del informe. Pura: no recalcula, no redacta, no lee el
// reloj. Los componentes de `src/components/pas/report/` la consumen.

export {
  componerInforme,
  construirApendice,
  construirFilas,
  pruebasAplicadas,
} from './componer';

export { agruparPorCobertura, agruparPorDominio, agruparPorEvidencia } from './agrupar';

export {
  ETIQUETA_ESTADO,
  ETIQUETA_NIVEL,
  ORDEN_NIVELES,
  ORDEN_SECCIONES,
  SECCIONES,
  seccion,
  tituloSeccion,
} from './secciones';

export type {
  ApendiceInforme,
  FilaCapacidad,
  GrupoCobertura,
  GrupoDominio,
  GrupoEvidencia,
  NivelMostrado,
  PerformanceReportViewModel,
  PruebaAplicada,
  SeccionId,
  Versiones,
} from './tipos';

export type { DefinicionSeccion } from './secciones';
