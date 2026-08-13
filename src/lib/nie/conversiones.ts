// ── NIE-1.5 · tabla declarativa de conversiones ────────────────────────────
//
// **Única fuente de factores de todo el proyecto.** Ningún número de conversión
// puede aparecer disperso por el código: si hace falta uno, se declara aquí o
// no existe.
//
// La tabla es **deliberadamente cerrada**. No se añade una conversión porque
// sea matemáticamente posible: se añade cuando la evidencia la autoriza.
//
// Y lo más importante de todo el módulo:
//
//   unidad compatible ≠ método compatible
//   conversión de unidad ≠ resolución de EQ-3
//
// Convertir cambia cómo se escribe una magnitud. No cambia el instrumento, el
// protocolo, la posición, la definición operacional ni la población.
//
// Módulo puro. Sin E/S, sin fecha, sin azar.

import type { Unidad } from './tipos';

/** Estado de un par de unidades en la tabla. */
export type EstadoConversion = 'AUTORIZADO' | 'NO_AUTORIZADO';

export interface FactorConversion {
  origen: Unidad;
  destino: Unidad;
  estado: 'AUTORIZADO';
  /** `valorDestino = valorOrigen × factor`. */
  factor: number;
  /** `true` cuando el factor procede de una definición, no de una medida. */
  exacto: boolean;
  /** Cómo se deriva el factor, para que pueda recalcularse sin consultar a nadie. */
  definicion: string;
  /** Convención de la que procede. */
  referencia: string;
  /** Decimales significativos del propio factor. */
  precision: number;
}

export interface ConversionNoAutorizada {
  origen: Unidad;
  destino: Unidad;
  estado: 'NO_AUTORIZADO';
  motivo: string;
}

export type EntradaTabla = FactorConversion | ConversionNoAutorizada;

/**
 * Factor kgf → lbf.
 *
 * Ambas son unidades de **fuerza**, de modo que la conversión es dimensional-
 * mente sólida:
 *
 *   1 kgf = 9,80665 N          (gravedad estándar, exacta por definición)
 *   1 lbf = 0,45359237 × 9,80665 N   (libra avoirdupois, exacta desde 1959)
 *
 *   kgf → lbf = 9,80665 / (0,45359237 × 9,80665) = 1 / 0,45359237
 *
 * La gravedad se cancela: el factor es exactamente el recíproco de la libra
 * avoirdupois, y por tanto **exacto, no medido**.
 */
const LIBRA_AVOIRDUPOIS_KG = 0.45359237;
const KGF_A_LBF = 1 / LIBRA_AVOIRDUPOIS_KG;

const DEFINICION_FUERZA =
  '1 kgf = 9,80665 N y 1 lbf = 0,45359237 × 9,80665 N. La gravedad estándar se cancela y el factor queda como el recíproco exacto de la libra avoirdupois';
const REFERENCIA_FUERZA =
  'Libra avoirdupois internacional (1959): 1 lb = 0,45359237 kg exactos. Gravedad estándar: 9,80665 m/s² exactos (3.ª CGPM, 1901)';

/**
 * Motivo por el que la masa no se convierte en fuerza.
 *
 * `39` congeló la decisión y este módulo no la reabre: *«Aunque numéricamente
 * coincidan en la práctica de la dinamometría, se registran como las publica
 * cada fuente. Igualarlas sería una decisión nuestra sobre la equivalencia de
 * dos magnitudes, y no nos corresponde tomarla.»*
 *
 * A eso se añade la razón física: el kilogramo mide masa y el kilogramo-fuerza
 * mide fuerza. Pasar de una a otra exige multiplicar por la gravedad, que no es
 * un factor de conversión de unidades sino una constante física — y hacerlo
 * supondría que la fuente que escribe «kg» quería decir «kgf», cosa que ninguna
 * de ellas declara.
 */
const MOTIVO_MASA_FUERZA =
  'El kilogramo mide masa y el kilogramo-fuerza y la libra-fuerza miden fuerza: son magnitudes de dimensión distinta. ' +
  'La NKB congeló en `39` la decisión de no igualarlas, y ninguna fuente declara que su «kg» signifique «kgf». ' +
  'Convertir exigiría suponerlo';

/**
 * La tabla. Seis pares posibles entre tres unidades; **uno autorizado**.
 *
 * Los no autorizados se declaran igual que los autorizados: un par ausente
 * sería indistinguible de un olvido, y aquí no puede haber olvidos.
 */
export const TABLA_CONVERSIONES: readonly EntradaTabla[] = [
  {
    origen: 'kgf',
    destino: 'lbf',
    estado: 'AUTORIZADO',
    factor: KGF_A_LBF,
    exacto: true,
    definicion: DEFINICION_FUERZA,
    referencia: REFERENCIA_FUERZA,
    precision: 15,
  },
  {
    origen: 'lbf',
    destino: 'kgf',
    estado: 'AUTORIZADO',
    factor: LIBRA_AVOIRDUPOIS_KG,
    exacto: true,
    definicion: DEFINICION_FUERZA,
    referencia: REFERENCIA_FUERZA,
    precision: 15,
  },
  { origen: 'kg', destino: 'kgf', estado: 'NO_AUTORIZADO', motivo: MOTIVO_MASA_FUERZA },
  { origen: 'kgf', destino: 'kg', estado: 'NO_AUTORIZADO', motivo: MOTIVO_MASA_FUERZA },
  { origen: 'kg', destino: 'lbf', estado: 'NO_AUTORIZADO', motivo: MOTIVO_MASA_FUERZA },
  { origen: 'lbf', destino: 'kg', estado: 'NO_AUTORIZADO', motivo: MOTIVO_MASA_FUERZA },
];

/** Unidades que la capa reconoce. Son las que hay en la NKB, ni una más. */
export const UNIDADES_CONOCIDAS: readonly Unidad[] = ['kg', 'kgf', 'lbf'];

/** Busca el par en la tabla. `undefined` = par no declarado. */
export function entradaDe(origen: Unidad, destino: Unidad): EntradaTabla | undefined {
  return TABLA_CONVERSIONES.find((e) => e.origen === origen && e.destino === destino);
}

/**
 * Advertencia que acompaña a **toda** conversión, sin excepción.
 *
 * Existe porque el riesgo real de esta capa no es equivocarse en el factor:
 * es que alguien lea «unidades ya compatibles» como «normas ya comparables».
 */
export const ADVERTENCIA_METODOLOGICA =
  'Una conversión de unidad cambia la representación numérica de la magnitud y nada más. ' +
  'No convierte instrumentos, protocolos, posiciones, definiciones operacionales ni poblaciones, ' +
  'y no resuelve una relación EQ-3: dos normas con la unidad ya unificada siguen sin ser comparables ' +
  'si su método difiere';
