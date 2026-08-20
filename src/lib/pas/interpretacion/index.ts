// ── Motor de interpretación profesional · API pública (Sprint PAS-9) ───────
//
// Recibe resultados YA RESUELTOS y devuelve lenguaje determinista. No conoce
// React, ni Supabase, ni el NIE, ni la NKB.

export { comoTexto, interpretar } from './componer';
export {
  REGLAS_LONGITUDINALES,
  REGLAS_NORMATIVAS,
  REGLAS_OBJETIVO,
  TODAS_LAS_REGLAS,
} from './reglas';
export type { Eje, Interpretacion, InterpretacionResultado, Regla } from './tipos';
