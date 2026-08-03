// ── Estado de Capacidad y su traza (Sprint PAS-2.0) ────────────────────────
// La entidad E-06 y la E-08 de `01-modelo-conceptual.md`. Van juntas porque
// no pueden separarse: sin traza no hay estado (I-05).

import type { CapacidadId, DominioId } from './capacidades';

/** Los cinco estados excluyentes de `02-state-model.md`. No hay un sexto. */
export type EstadoCapacidadValor =
  | 'evaluada'
  | 'parcialmente_evaluada'
  | 'desactualizada'
  | 'en_conflicto'
  | 'desconocida';

export const ESTADOS_CAPACIDAD: readonly EstadoCapacidadValor[] = [
  'evaluada', 'parcialmente_evaluada', 'desactualizada', 'en_conflicto', 'desconocida',
];

/** Motivo de exclusión de un registro. Toda exclusión lleva motivo (TR-03). */
export type MotivoExclusion =
  | 'EL-01_anulado'
  | 'EL-02_fuera_de_vigencia'
  | 'EL-03_integridad'
  | 'EL-04_sin_correspondencia'
  | 'EL-05_condiciones_ausentes'
  | 'EL-06_precondiciones_no_constan'
  | 'prueba_no_catalogada'
  | 'contribucion_sin_referencia'
  | 'capacidad_reservada';

export interface RegistroExcluido {
  registroId: string;
  pruebaId: string;
  motivo: MotivoExclusion;
  detalle: Record<string, string>;
}

/** Las tres coordenadas del invariante I-11. */
export interface CoordenadasVersion {
  motor: string;
  catalogo: string;
  calculadoEn: string;
}

export interface Traza {
  capacidad: CapacidadId;
  incluidos: string[];
  excluidos: RegistroExcluido[];
  /** Correspondencias aplicadas: `prueba→capacidad` con su referencia (TR-04). */
  correspondencias: { pruebaId: string; referencia: string; peso: number }[];
  coordenadas: CoordenadasVersion;
}

export interface EstadoCapacidad {
  capacidad: CapacidadId;
  dominio: DominioId;
  nombre: string;
  estado: EstadoCapacidadValor;
  /** Fecha del registro elegible más reciente. `null` si no hay ninguno. */
  ultimaFecha: string | null;
  registrosElegibles: number;
  traza: Traza;
}
