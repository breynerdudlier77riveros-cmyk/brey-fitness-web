// ── Capa de evidencia · API pública (Sprint PAS-10E) ───────────────────────
//
// Fuente única de verdad de todo lo que el PAS puede afirmar sobre una prueba.
// Ningún componente declara valores científicos: los consume de aquí.

export { leerEvidencia, type MedicionEvaluada, type SujetoEvidencia } from './compatibilidad';
export { leerCambio, situar, type LecturaDeCambio } from './posicion';
export { redactar, type FraseEvidencia } from './redaccion';
export {
  admiteRelativa,
  calcularRelativa,
  type FuerzaRelativa,
  type MotivoSinRelativa,
} from './relativa';
export { FUENTES, REFERENCIAS, fuenteDe, referenciasDe } from './registro';
export type {
  AmbitoReferencia,
  Carencia,
  Cobertura,
  EstadoEvidencia,
  EstadoFuente,
  FuenteEvidencia,
  LecturaEvidencia,
  NivelEvidencia,
  Posicion,
  ReferenciaEvidencia,
  Representacion,
  TipoEvidencia,
} from './tipos';
