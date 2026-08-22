// ── Valores de referencia poblacionales (Sprint BCS-10.0) ──────────────────
//
// Percentiles publicados, transcritos de su fuente. Es lo que permite decir
// dónde cae un valor sin inventar una categoría.
//
// ── POR QUÉ PERCENTILES Y NO «BAJO / NORMAL / ALTO» ───────────────────────
//
//   Porque es lo que la fuente publica. Amaral 2022 da percentiles por sexo y
//   banda de edad; no define bandas de mérito. Convertir un percentil en una
//   etiqueta exige un punto de corte, y ese punto de corte no está en el
//   artículo: lo pondría yo.
//
//   Lo que sí puede decirse —y es más información, no menos— es cuánta gente
//   de su edad y su sexo queda por debajo. Es la definición literal del
//   número.
//
// ── LO QUE ESTA TABLA NO ES ──────────────────────────────────────────────
//
//   No es del aparato del profesional. Amaral midió con un InBody S10 y aquí
//   se mide con un 770. Mismo fabricante, modelo distinto, y que dos modelos
//   sean intercambiables NO está demostrado en el artículo. Se carga igual
//   —decisión del profesional, tomada con la advertencia delante— y por eso
//   cada norma declara su dispositivo y la lectura lo dice.
//
//   Es el mismo criterio con el que el PAS resolvió G-06: una referencia de
//   otra procedencia sitúa, y se nombra de quién es.
//
// ── CELDAS INUTILIZABLES, DECLARADAS ─────────────────────────────────────
//
//   La fila de varones ≥60 de Amaral está impresa con el percentil 10 (15,0)
//   POR DEBAJO del percentil 5 (18,1). Eso es aritméticamente imposible en
//   una tabla de percentiles y refleja que esa celda tiene n = 16.
//
//   No se corrige —corregir la fuente sería inventarla— y no se usa. Se
//   transcribe tal cual, se marca `utilizable: false` con el motivo, y quien
//   caiga en esa celda recibe la explicación en vez de una posición falsa.
//
// Módulo puro y declarativo.

import type { VariableId } from '@/lib/bcs/reporte';
import type { SexoCliente } from '@/lib/bcs/tipos';

export interface CeldaNorma {
  sexo: SexoCliente;
  /** Banda de edad, ambos extremos incluidos. */
  edadMin: number;
  edadMax: number;
  /** Tamaño de la celda. Se muestra: un percentil sobre 16 personas no es un percentil. */
  n: number;
  /** Percentiles publicados, tal como los imprime la fuente. */
  puntos: readonly { p: number; valor: number }[];
  /**
   * `false` cuando la celda no puede usarse, con el motivo.
   *
   * Existe porque una tabla publicada puede traer una fila imposible, y la
   * alternativa —corregirla o usarla igual— es peor que declararla.
   */
  utilizable: boolean;
  motivoNoUtilizable?: string;
}

export interface NormaPoblacional {
  id: string;
  variable: VariableId;
  unidad: string;
  /** Clave en `_evidencia/candidatas.yaml` o `referencias.yaml`. */
  fuente: string;
  cita: string;
  /** País de la muestra. Se nombra siempre que no sea la del cliente. */
  pais: string;
  /** Aparato con el que se obtuvo la tabla. */
  dispositivo: string;
  celdas: readonly CeldaNorma[];
  limitaciones: readonly string[];
}

/** Los siete percentiles que publica Amaral 2022, en orden. */
const P7 = [5, 10, 25, 50, 75, 90, 95] as const;
/** Los cinco que publica Coelho-Júnior 2024. */
const P5 = [5, 25, 50, 75, 95] as const;

/** Une los valores de una fila con sus etiquetas. Solo transcripción. */
const fila = (...v: readonly number[]): { p: number; valor: number }[] =>
  P7.map((p, i) => ({ p, valor: v[i] }));

const fila5 = (...v: readonly number[]): { p: number; valor: number }[] =>
  P5.map((p, i) => ({ p, valor: v[i] }));

const CITA_AMARAL =
  'Amaral MA, Mundstock E, Scarpatto CH, Cañon-Montañez W, Mattiello R. ' +
  'Reference percentiles for bioimpedance body composition parameters of healthy ' +
  'individuals. Clinics (São Paulo) 2022;77:100078.';

const LIMITES_AMARAL = [
  'Los autores no presentan resultados por raza.',
  'No es una muestra probabilística de la población brasileña.',
  'La banda de 20 a 59 años es una sola: no distingue a alguien de 22 de alguien de 55.',
];

/**
 * La celda de varones de 60 o más de Amaral, en las tres variables.
 *
 * n = 16. El propio artículo declara en sus métodos que consideraba «un número
 * mínimo de 50 participantes por sexo y ciclo vital»: esa celda incumple el
 * criterio de sus propios autores, no uno mío.
 */
const MOTIVO_N_INSUFICIENTE =
  'Esta celda se calculó sobre 16 personas, y el propio artículo fija en sus métodos un ' +
  'mínimo de 50 participantes por sexo y ciclo vital: incumple el criterio de sus autores.';

export const NORMAS: readonly NormaPoblacional[] = [
  {
    id: 'grasa_pct/amaral-2022',
    variable: 'grasa_pct',
    unidad: '%',
    fuente: 'amaral_percentiles_bia_2022',
    cita: CITA_AMARAL,
    pais: 'Brasil',
    dispositivo: 'InBody S10 (50 kHz)',
    celdas: [
      // ── Varones ────────────────────────────────────────────────────────
      { sexo: 'M', edadMin: 5, edadMax: 9, n: 58, utilizable: true, puntos: fila(9.3, 10, 14.4, 19, 28.1, 36.4, 40) },
      { sexo: 'M', edadMin: 10, edadMax: 19, n: 134, utilizable: true, puntos: fila(4.4, 7.4, 12, 15.5, 22.8, 32.4, 35.7) },
      { sexo: 'M', edadMin: 20, edadMax: 59, n: 371, utilizable: true, puntos: fila(10.2, 12, 15.5, 20.2, 25.8, 31.1, 34.5) },
      {
        sexo: 'M',
        edadMin: 60,
        edadMax: 120,
        n: 16,
        // Transcrita tal como se publica, con su fila imposible incluida.
        puntos: fila(18.1, 15, 20.7, 27.6, 33.8, 38.1, 38.1),
        utilizable: false,
        motivoNoUtilizable:
          'La tabla publicada imprime el percentil 10 (15,0 %) por debajo del percentil 5 ' +
          '(18,1 %), lo que es imposible en una distribución. ' + MOTIVO_N_INSUFICIENTE,
      },

      // ── Mujeres ────────────────────────────────────────────────────────
      { sexo: 'F', edadMin: 5, edadMax: 9, n: 79, utilizable: true, puntos: fila(8.6, 11.2, 15.9, 21, 25.7, 38.2, 43.5) },
      { sexo: 'F', edadMin: 10, edadMax: 19, n: 154, utilizable: true, puntos: fila(15.6, 18.3, 21.8, 26, 33.3, 41.1, 43) },
      { sexo: 'F', edadMin: 20, edadMax: 59, n: 345, utilizable: true, puntos: fila(18.5, 20.8, 25, 32.3, 38.8, 44.3, 48) },
      { sexo: 'F', edadMin: 60, edadMax: 120, n: 51, utilizable: true, puntos: fila(24.4, 28.4, 33.7, 39.4, 43.4, 49.2, 50.7) },
    ],
    limitaciones: LIMITES_AMARAL,
  },

  // ── Masa grasa absoluta y masa libre de grasa, misma fuente ────────────
  {
    id: 'masa_grasa_kg/amaral-2022',
    variable: 'masa_grasa_kg',
    unidad: 'kg',
    fuente: 'amaral_percentiles_bia_2022',
    cita: CITA_AMARAL,
    pais: 'Brasil',
    dispositivo: 'InBody S10 (50 kHz)',
    celdas: [
      { sexo: 'M', edadMin: 5, edadMax: 9, n: 58, utilizable: true, puntos: fila(2.3, 2.4, 3.6, 5.9, 9.6, 17, 19.2) },
      { sexo: 'M', edadMin: 10, edadMax: 19, n: 134, utilizable: true, puntos: fila(2.4, 3.2, 5.3, 7.7, 12.2, 21.3, 27.5) },
      { sexo: 'M', edadMin: 20, edadMax: 59, n: 371, utilizable: true, puntos: fila(7, 8.7, 11.9, 16.5, 22.4, 28.7, 35.5) },
      {
        sexo: 'M', edadMin: 60, edadMax: 120, n: 16,
        puntos: fila(12.3, 14, 15.2, 21.3, 27.4, 32.2, 32.2),
        utilizable: false,
        motivoNoUtilizable: MOTIVO_N_INSUFICIENTE,
      },
      { sexo: 'F', edadMin: 5, edadMax: 9, n: 79, utilizable: true, puntos: fila(2.2, 2.6, 4, 5.4, 8.3, 15.4, 17.8) },
      { sexo: 'F', edadMin: 10, edadMax: 19, n: 154, utilizable: true, puntos: fila(6.2, 7.6, 9.8, 13.4, 21.4, 25.2, 35.5) },
      { sexo: 'F', edadMin: 20, edadMax: 59, n: 345, utilizable: true, puntos: fila(10.1, 11.2, 14.4, 20.4, 28.5, 38.5, 43.3) },
      { sexo: 'F', edadMin: 60, edadMax: 120, n: 51, utilizable: true, puntos: fila(12.9, 15, 19.9, 24.6, 29.4, 36.7, 47.2) },
    ],
    limitaciones: LIMITES_AMARAL,
  },

  {
    id: 'masa_libre_grasa_kg/amaral-2022',
    variable: 'masa_libre_grasa_kg',
    unidad: 'kg',
    fuente: 'amaral_percentiles_bia_2022',
    cita: CITA_AMARAL,
    pais: 'Brasil',
    dispositivo: 'InBody S10 (50 kHz)',
    celdas: [
      { sexo: 'M', edadMin: 5, edadMax: 9, n: 58, utilizable: true, puntos: fila(19.2, 19.7, 21.3, 24.3, 26.5, 28.4, 29.4) },
      { sexo: 'M', edadMin: 10, edadMax: 19, n: 134, utilizable: true, puntos: fila(33.5, 35.4, 39.2, 44.6, 50.3, 56.3, 60.6) },
      { sexo: 'M', edadMin: 20, edadMax: 59, n: 371, utilizable: true, puntos: fila(51.2, 54.7, 59.2, 64.3, 70.3, 75.9, 79.1) },
      {
        sexo: 'M', edadMin: 60, edadMax: 120, n: 16,
        puntos: fila(44.8, 44.8, 47.2, 53.7, 66, 66.2, 77.1),
        utilizable: false,
        motivoNoUtilizable: MOTIVO_N_INSUFICIENTE,
      },
      { sexo: 'F', edadMin: 5, edadMax: 9, n: 79, utilizable: true, puntos: fila(16.3, 17.5, 19.5, 21.3, 23.8, 26.3, 27.6) },
      { sexo: 'F', edadMin: 10, edadMax: 19, n: 154, utilizable: true, puntos: fila(28.9, 30.6, 33.5, 38.2, 42.7, 48.3, 51.6) },
      { sexo: 'F', edadMin: 20, edadMax: 59, n: 345, utilizable: true, puntos: fila(36.3, 39.1, 40.7, 44.1, 47.6, 51.2, 53.1) },
      { sexo: 'F', edadMin: 60, edadMax: 120, n: 51, utilizable: true, puntos: fila(32, 33.5, 36.7, 38.5, 42.4, 45.9, 48.8) },
    ],
    limitaciones: LIMITES_AMARAL,
  },

  // ── Masa muscular · Coelho-Júnior 2024 ─────────────────────────────────
  //
  // De las cuatro filas normativas del artículo se carga UNA. Ver NO_CARGADAS.
  {
    id: 'masa_muscular_kg/coelho-2024',
    variable: 'masa_muscular_kg',
    unidad: 'kg',
    fuente: 'coelho_junior_musculo_2024',
    cita:
      'Coelho-Júnior HJ, Marques FL, Sousa CV, Marzetti E, Aguiar SdS. Age- and ' +
      'sex-specific normative values for muscle mass parameters in 18,625 Brazilian ' +
      'adults. Front Public Health 2024;11:1287994.',
    pais: 'Brasil',
    dispositivo: 'InBody 230 (20 y 100 kHz), tras 8 h de ayuno y 96 h sin ejercicio',
    celdas: [
      { sexo: 'M', edadMin: 18, edadMax: 29, n: 1793, utilizable: true, puntos: fila5(26.4, 31.2, 34.7, 38.0, 43.4) },
      { sexo: 'M', edadMin: 30, edadMax: 39, n: 1885, utilizable: true, puntos: fila5(29.5, 33.5, 36.8, 40.5, 47.0) },
      { sexo: 'M', edadMin: 40, edadMax: 49, n: 1911, utilizable: true, puntos: fila5(29.5, 33.8, 36.8, 40.6, 46.5) },
      { sexo: 'M', edadMin: 50, edadMax: 59, n: 1077, utilizable: true, puntos: fila5(27.7, 31.5, 35.0, 38.6, 43.5) },
      { sexo: 'M', edadMin: 60, edadMax: 69, n: 755, utilizable: true, puntos: fila5(25.5, 30.1, 33.3, 36.6, 41.1) },
      { sexo: 'M', edadMin: 70, edadMax: 79, n: 410, utilizable: true, puntos: fila5(24.4, 27.5, 30.5, 33.2, 38.9) },
      { sexo: 'M', edadMin: 80, edadMax: 120, n: 222, utilizable: true, puntos: fila5(22.3, 25.0, 26.5, 30.0, 35.0) },

      { sexo: 'F', edadMin: 18, edadMax: 29, n: 1544, utilizable: true, puntos: fila5(21.4, 23.1, 24.6, 26.9, 30.9) },
      { sexo: 'F', edadMin: 30, edadMax: 39, n: 2452, utilizable: true, puntos: fila5(21.6, 23.2, 25.0, 27.5, 31.9) },
      { sexo: 'F', edadMin: 40, edadMax: 49, n: 3101, utilizable: true, puntos: fila5(21.4, 23.4, 25.2, 27.5, 31.3) },
      { sexo: 'F', edadMin: 50, edadMax: 59, n: 1878, utilizable: true, puntos: fila5(21.1, 22.8, 24.6, 26.7, 30.5) },
      { sexo: 'F', edadMin: 60, edadMax: 69, n: 1127, utilizable: true, puntos: fila5(20.7, 22.3, 23.5, 25.0, 29.0) },
      { sexo: 'F', edadMin: 70, edadMax: 79, n: 368, utilizable: true, puntos: fila5(20.4, 21.8, 23.0, 24.6, 29.0) },
      { sexo: 'F', edadMin: 80, edadMax: 120, n: 102, utilizable: true, puntos: fila5(20.1, 21.6, 22.9, 25.7, 28.3) },
    ],
    limitaciones: [
      'Pacientes de una clínica privada de nutrición: los propios autores advierten de que sus resultados deben extrapolarse con cuidado a personas en otras condiciones.',
      'Sin datos de actividad física, adherencia al ejercicio ni prevalencia de enfermedad.',
      'El artículo no declara qué salida concreta del InBody 230 llama «masa muscular».',
      'Las evaluaciones se hicieron a distintas horas del día.',
    ],
  },
];

/**
 * Filas normativas publicadas que NO se cargan, y por qué.
 *
 * Se declaran porque su ausencia es una decisión, no un olvido: quien abra el
 * artículo verá cuatro tablas normativas y aquí encontrará una.
 */
export const NO_CARGADAS: readonly { fuente: string; filas: string; motivo: string }[] = [
  {
    fuente: 'coelho_junior_musculo_2024',
    filas: 'Masa muscular apendicular (ASM) y SMI I',
    motivo:
      'Sus centiles están TRANSPUESTOS en la publicación. En varones de 18 a 29 años la fila ' +
      'de ASM imprime centiles de 9,0 a 13,2 junto a una media de 26,1 kg, y la de SMI I ' +
      'imprime centiles de 20,2 a 32,5 junto a una media de 11,0 kg/m². En los dos casos los ' +
      'centiles son los de la otra fila. Se repite igual en la tabla de mujeres, y las medias ' +
      'coinciden con las de la Tabla 1, así que lo intercambiado son los bloques de centiles. ' +
      'Deshacer el cambio sería reescribir la fuente a partir de una deducción propia.',
  },
  {
    fuente: 'coelho_junior_musculo_2024',
    filas: 'SMI II (ASM / talla²)',
    motivo:
      'Su tabla sí es coherente, pero el catálogo del BCS define `smi` como masa muscular ' +
      'normalizada por la talla sin precisar si la absoluta o la apendicular. Cargar SMI II ' +
      'contra un campo que puede contener la otra compararía dos magnitudes distintas.',
  },
];

/**
 * La norma que corresponde a este sujeto, o `null`.
 *
 * Devuelve también las celdas NO utilizables: quien cae en una tiene derecho a
 * saber por qué no se le sitúa, y devolver `null` lo haría indistinguible de
 * «no hay norma para tu edad».
 */
export function normaPara(
  variable: VariableId,
  sexo: SexoCliente,
  edad: number,
): { norma: NormaPoblacional; celda: CeldaNorma } | null {
  for (const norma of NORMAS) {
    if (norma.variable !== variable) continue;
    const celda = norma.celdas.find(
      (c) => c.sexo === sexo && edad >= c.edadMin && edad <= c.edadMax,
    );
    if (celda) return { norma, celda };
  }
  return null;
}
