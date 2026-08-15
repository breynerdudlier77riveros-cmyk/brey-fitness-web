// ── El eslabón PAS → NIE · API pública (PRS v2.0) ──────────────────────────

export { consultarEvaluacion, consultarNorma, type ConsultaNormativa } from './adaptador';
export { MAPEOS, mapeoDe } from './mapeo';
export type {
  CoordenadaSinTraducir,
  MapeoNormativo,
  MotivoSinConsulta,
  SujetoNormativo,
} from './tipos';
