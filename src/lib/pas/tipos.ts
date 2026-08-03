// ── Contratos de ENTRADA del Performance Assessment Engine (Sprint PAS-2.0) ─
// DTOs puros. No hay tabla, columna ni endpoint detrás de ninguno de ellos, y
// este Sprint no crea ninguno: el motor recibe lo que le den y no sabe de
// dónde viene.
//
// Extensibilidad: cada DTO lleva `metadatos` como bolsa abierta de pares
// clave/valor. Un campo nuevo entra por ahí sin romper a ningún consumidor,
// que es el crecimiento X-A/X-B de `11-extensibilidad.md`.

import type { CapacidadId, FamiliaId } from './capacidades';

/** Tipos de evaluación T-01…T-06 (`06-tipos-de-evaluacion.md`). */
export type TipoEvaluacion = 'T-01' | 'T-02' | 'T-03' | 'T-04' | 'T-05' | 'T-06';

export const TIPOS_EVALUACION: readonly TipoEvaluacion[] = [
  'T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06',
];

/** Naturaleza del resultado declarada por la definición de prueba (`04`). */
export type NaturalezaResultado = 'continuo' | 'ordinal' | 'binario' | 'categorico';

/**
 * Valor de un registro. Unión discriminada: el motor comprueba que la variante
 * coincida con la naturaleza que declara la prueba, y reporta conflicto si no.
 * Nunca convierte ni normaliza — eso sería interpretar.
 */
export type ValorRegistro =
  | { tipo: 'continuo'; valor: number; unidad: string }
  | { tipo: 'ordinal'; valor: number; escala: number }
  | { tipo: 'binario'; valor: boolean }
  | { tipo: 'categorico'; valor: string };

/** Un registro anulado deja de ser elegible; no deja de haber ocurrido (I-02). */
export type EstadoRegistro = 'vigente' | 'anulada';

export interface RegistroPrueba {
  id: string;
  pruebaId: string;
  /** `yyyy-mm-dd`. Inmutable (I-01). */
  fecha: string;
  valor: ValorRegistro;
  estado: EstadoRegistro;
  /** Condiciones de la toma, por clave declarada en la definición (EL-05). */
  condiciones: Record<string, string>;
  /** `null` = no consta. Ausencia de información, no incumplimiento (EL-06). */
  precondicionesCumplidas: boolean | null;
  /** Patrón del Master Exercise Dataset, para E-01/E-02 y familia F-H. */
  patron: string | null;
  observaciones: string | null;
  metadatos: Record<string, string>;
}

export interface EvaluacionPAS {
  id: string;
  atletaId: string;
  /** `yyyy-mm-dd`. */
  fecha: string;
  tipo: TipoEvaluacion;
  registros: RegistroPrueba[];
  observaciones: string | null;
  metadatos: Record<string, string>;
}

/**
 * Correspondencia prueba→capacidad. `referencia` es la clave de la Clinical
 * Knowledge Base que la respalda: sin ella la contribución NO se aplica
 * (I-10), y el motor lo reporta como conflicto en vez de callarlo.
 */
export interface Contribucion {
  capacidad: CapacidadId;
  peso: number;
  referencia: string | null;
}

export interface DefinicionPrueba {
  id: string;
  familia: FamiliaId;
  naturaleza: NaturalezaResultado;
  /** Días de vigencia (EL-02). `null` = no declarada: no caduca y se avisa. */
  vigenciaDias: number | null;
  /** Claves que deben constar en `condiciones` para cumplir EL-05. */
  condicionesRequeridas: string[];
  /** Si `true`, EL-06 exige `precondicionesCumplidas === true`. */
  exigePrecondiciones: boolean;
  /** Si `true`, el registro debe traer `patron`. */
  requierePatron: boolean;
  /** Si `false`, dos registros de la misma prueba y fecha son conflicto. */
  repetible: boolean;
  contribuciones: Contribucion[];
}

/**
 * Cobertura exigida por la definición de una capacidad para considerarla
 * evaluada por completo. Es dato de catálogo, no conocimiento del motor: sin
 * declararla, el motor no puede saber si una capacidad quedó a medias y lo
 * declara como limitación en lugar de suponerlo.
 */
export interface CoberturaCapacidad {
  capacidad: CapacidadId;
  pruebasRequeridas: string[];
}

export interface CatalogoPruebas {
  version: string;
  pruebas: DefinicionPrueba[];
  cobertura?: CoberturaCapacidad[];
}

/** Catálogo vacío: ninguna prueba, ninguna correspondencia. Estado real en v1.0. */
export const CATALOGO_VACIO: CatalogoPruebas = { version: 'vacio-0', pruebas: [] };

export interface SolicitudAnalisis {
  atletaId: string;
  evaluaciones: EvaluacionPAS[];
  catalogo: CatalogoPruebas;
  /** Fecha de referencia `yyyy-mm-dd`. El motor NUNCA lee el reloj. */
  hoyISO: string;
}
