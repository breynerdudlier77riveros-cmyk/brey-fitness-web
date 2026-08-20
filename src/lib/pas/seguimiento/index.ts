// ── Seguimiento longitudinal y de objetivos · API (Sprint PAS-10) ──────────
//
// La dirección de mejora se reexporta desde aquí a propósito. Vive en el
// catálogo del Workspace —es una propiedad del instrumento, no de esta capa—,
// pero `lib/` no debe depender de `features/` más de una vez. Ese único borde,
// que además es solo de tipos y desaparece al compilar, queda concentrado en
// `progreso.ts`; el resto de `lib/` lo consume por este barril.

export type { DireccionMejora } from '@/features/performance-workspace/schemas/catalogo';

export {
  construirSerie,
  profundidadActual,
  type MotivoRuptura,
  type PuntoMedicion,
  type Ruptura,
  type SerieLongitudinal,
  type Tramo,
} from './serie';
export {
  calcularProgreso,
  type EntradaProgreso,
  type MotivoSinProgreso,
  type PosicionRango,
  type ResultadoProgreso,
} from './progreso';
