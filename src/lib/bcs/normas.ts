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
const P = [5, 10, 25, 50, 75, 90, 95] as const;

/** Une los siete valores de una fila con sus etiquetas. Solo transcripción. */
const fila = (...v: readonly number[]): { p: number; valor: number }[] =>
  P.map((p, i) => ({ p, valor: v[i] }));

export const NORMAS: readonly NormaPoblacional[] = [
  {
    id: 'grasa_pct/amaral-2022',
    variable: 'grasa_pct',
    unidad: '%',
    fuente: 'amaral_percentiles_bia_2022',
    cita:
      'Amaral MA, Mundstock E, Scarpatto CH, Cañon-Montañez W, Mattiello R. ' +
      'Reference percentiles for bioimpedance body composition parameters of healthy ' +
      'individuals. Clinics (São Paulo) 2022;77:100078.',
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
          '(18,1 %), lo que es imposible en una distribución, y esa celda se calculó sobre ' +
          '16 personas. No se corrige la fuente ni se usa una celda que no se sostiene.',
      },

      // ── Mujeres ────────────────────────────────────────────────────────
      { sexo: 'F', edadMin: 5, edadMax: 9, n: 79, utilizable: true, puntos: fila(8.6, 11.2, 15.9, 21, 25.7, 38.2, 43.5) },
      { sexo: 'F', edadMin: 10, edadMax: 19, n: 154, utilizable: true, puntos: fila(15.6, 18.3, 21.8, 26, 33.3, 41.1, 43) },
      { sexo: 'F', edadMin: 20, edadMax: 59, n: 345, utilizable: true, puntos: fila(18.5, 20.8, 25, 32.3, 38.8, 44.3, 48) },
      { sexo: 'F', edadMin: 60, edadMax: 120, n: 51, utilizable: true, puntos: fila(24.4, 28.4, 33.7, 39.4, 43.4, 49.2, 50.7) },
    ],
    limitaciones: [
      'Los autores no presentan resultados por raza.',
      'No es una muestra probabilística de la población brasileña.',
      'La banda de 20 a 59 años es una sola: no distingue a alguien de 22 de alguien de 55.',
    ],
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
