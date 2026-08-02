// ── API pública del Recommendation Engine del BCS (Sprint BCS-4.0) ─────────
// Todo consumidor (páginas, componentes, tests) importa desde aquí. Los
// módulos internos no son parte del contrato.

export { generarRecomendaciones } from './orquestador';

export { CATEGORIAS, ORDEN_CATEGORIAS } from './categorias';
export { PRIORIDADES, compararPrioridad } from './prioridad';

export type {
  CategoriaRecomendacion,
  EstadoRecomendacion,
  Evidencia,
  LimitacionRecomendacion,
  OrigenEvidencia,
  PrioridadRecomendacion,
  ProfessionalRecommendation,
  RecommendationReport,
} from './tipos';
