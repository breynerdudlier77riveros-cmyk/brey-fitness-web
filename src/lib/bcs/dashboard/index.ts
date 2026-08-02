// ── API pública del Dashboard Analytics del BCS (Sprint 5.0) ───────────────
// Todo consumidor importa desde aquí. Los módulos internos no son parte del
// contrato.

export { construirDashboard, type OpcionesDashboard } from './orquestador';

export { FILTROS, ORDEN_FILTROS, filtrarSeguimiento, contarPorFiltro } from './resumen';
export { escalar, segmentosDonut } from './graficos';
export { etiquetaMes } from './fechas';
export { ALERTAS_NO_IMPLEMENTADAS, DISTRIBUCION_PROCEDENCIA_NO_IMPLEMENTADA } from './tendencias';

export type {
  AlertaAdministrativa,
  DashboardAnalytics,
  Distribuciones,
  EntradaDashboard,
  EstadoConsultorio,
  EventoReciente,
  FilaSeguimiento,
  FiltroDashboard,
  MesActividad,
  PuntoSerie,
  ResumenGeneral,
  SegmentoDistribucion,
  SeriesGraficos,
  TipoAlerta,
  TipoEvento,
} from './tipos';
