// ── Deciles de fuerza relativa · van den Hoek et al. 2024 (Sprint PAS-15) ──
//
// FICHERO GENERADO desde el PDF del artículo y verificado antes de escribirse.
// No se teclea a mano: 270 celdas transcritas a ojo son 270 oportunidades de
// equivocarse, y una cifra normativa equivocada no se nota nunca.
//
// ── LO QUE SE COMPROBÓ ANTES DE ACEPTARLAS ────────────────────────────────
//
//   1 · Las nueve filas de cada tabla, completas. El extractor partía la fila
//       del percentil 50 en dos líneas y se perdía; se vuelve a unir antes de
//       parsear, porque perder una fila entera es peor que cualquier otro
//       error.
//   2 · Monotonía: dentro de cada banda de edad, el corte del p90 ≥ p80 ≥ …
//       ≥ p10. Las 30 columnas la cumplen.
//   3 · CONTROL CRUZADO contra los doce valores que el propio resumen del
//       artículo publica. Once coinciden exactamente.
//
// ── LA DISCREPANCIA DEL ARTÍCULO CONSIGO MISMO ────────────────────────────
//
//   El resumen dice que el p90 de press de banca masculino 18-35 es 1,95. La
//   Tabla 4 dice 1,96, con IC [1,96 , 1,96]. Se transcribe lo que dice LA
//   TABLA: es el dato primario, y un resumen redondea. Queda anotado en las
//   limitaciones de la referencia para que quien audite lo encuentre sin
//   tener que descubrirlo otra vez.
//
// ── LO QUE NO SE CARGA ────────────────────────────────────────────────────
//
//   Los intervalos de confianza. Tres celdas de las tablas masculinas los dan
//   imposibles —el corte cae fuera de su propio intervalo, o el límite
//   inferior supera al superior— y no hay forma de saber desde aquí si es un
//   error de imprenta o del análisis. Los CORTES sí son coherentes, así que
//   la posición percentil se calcula y el intervalo no se afirma.
//
//     press banca  p20 · 36-59   corte 1,26 · IC [1,29 , 1,27]
//     peso muerto  p70 · 18-35   corte 2,87 · IC [2,87 , 2,28]
//     peso muerto  p30 · 18-35   corte 2,40 · IC [2,38 , 2,39]
//
// ── Y LO QUE ESTAS CIFRAS NO SON ──────────────────────────────────────────
//
//   No son categorías. El artículo publica DECILES, o sea posiciones dentro de
//   una distribución. «Percentil 60» es una posición; «avanzado» sería una
//   etiqueta de mérito, y ninguna fuente admisible la publica (auditoría NKB
//   41). El sistema dice dónde caes, no lo que eres.
//
//   Y la población son competidores federados de powerlifting con control
//   antidopaje. No es población general, y quien lo lea tiene que saberlo.

import type { PatronCanonico } from './patrones';

export interface BandaEdad {
  min: number;
  max: number | null;
}

export interface DecilesNorma {
  patron: PatronCanonico;
  sexo: 'M' | 'F';
  banda: BandaEdad;
  /** Percentil → razón carga/masa corporal, tal como imprime la tabla. */
  puntos: readonly { p: number; valor: number }[];
}

export const DECILES_POWERLIFTING: readonly DecilesNorma[] = [
  {
    patron: 'sentadilla',
    sexo: 'M',
    banda: { min: 12, max: 17 },
    puntos: [{ p: 90, valor: 2.5 }, { p: 80, valor: 2.3 }, { p: 70, valor: 2.16 }, { p: 60, valor: 2.04 }, { p: 50, valor: 1.92 }, { p: 40, valor: 1.8 }, { p: 30, valor: 1.67 }, { p: 20, valor: 1.52 }, { p: 10, valor: 1.32 }],
  },
  {
    patron: 'sentadilla',
    sexo: 'M',
    banda: { min: 18, max: 35 },
    puntos: [{ p: 90, valor: 2.83 }, { p: 80, valor: 2.63 }, { p: 70, valor: 2.5 }, { p: 60, valor: 2.38 }, { p: 50, valor: 2.28 }, { p: 40, valor: 2.17 }, { p: 30, valor: 2.06 }, { p: 20, valor: 1.93 }, { p: 10, valor: 1.75 }],
  },
  {
    patron: 'sentadilla',
    sexo: 'M',
    banda: { min: 36, max: 59 },
    puntos: [{ p: 90, valor: 2.58 }, { p: 80, valor: 2.38 }, { p: 70, valor: 2.24 }, { p: 60, valor: 2.13 }, { p: 50, valor: 2.03 }, { p: 40, valor: 1.92 }, { p: 30, valor: 1.81 }, { p: 20, valor: 1.67 }, { p: 10, valor: 1.48 }],
  },
  {
    patron: 'sentadilla',
    sexo: 'M',
    banda: { min: 60, max: 79 },
    puntos: [{ p: 90, valor: 2.16 }, { p: 80, valor: 1.98 }, { p: 70, valor: 1.85 }, { p: 60, valor: 1.74 }, { p: 50, valor: 1.62 }, { p: 40, valor: 1.5 }, { p: 30, valor: 1.38 }, { p: 20, valor: 1.23 }, { p: 10, valor: 1.04 }],
  },
  {
    patron: 'sentadilla',
    sexo: 'M',
    banda: { min: 80, max: null },
    puntos: [{ p: 90, valor: 1.72 }, { p: 80, valor: 1.52 }, { p: 70, valor: 1.37 }, { p: 60, valor: 1.22 }, { p: 50, valor: 1.11 }, { p: 40, valor: 0.99 }, { p: 30, valor: 0.89 }, { p: 20, valor: 0.79 }, { p: 10, valor: 0.52 }],
  },
  {
    patron: 'press_banca',
    sexo: 'M',
    banda: { min: 12, max: 17 },
    puntos: [{ p: 90, valor: 1.63 }, { p: 80, valor: 1.49 }, { p: 70, valor: 1.4 }, { p: 60, valor: 1.32 }, { p: 50, valor: 1.24 }, { p: 40, valor: 1.17 }, { p: 30, valor: 1.09 }, { p: 20, valor: 0.99 }, { p: 10, valor: 0.85 }],
  },
  {
    patron: 'press_banca',
    sexo: 'M',
    banda: { min: 18, max: 35 },
    puntos: [{ p: 90, valor: 1.96 }, { p: 80, valor: 1.81 }, { p: 70, valor: 1.71 }, { p: 60, valor: 1.63 }, { p: 50, valor: 1.56 }, { p: 40, valor: 1.48 }, { p: 30, valor: 1.4 }, { p: 20, valor: 1.31 }, { p: 10, valor: 1.19 }],
  },
  {
    patron: 'press_banca',
    sexo: 'M',
    banda: { min: 36, max: 59 },
    puntos: [{ p: 90, valor: 1.92 }, { p: 80, valor: 1.77 }, { p: 70, valor: 1.67 }, { p: 60, valor: 1.59 }, { p: 50, valor: 1.51 }, { p: 40, valor: 1.44 }, { p: 30, valor: 1.36 }, { p: 20, valor: 1.26 }, { p: 10, valor: 1.13 }],
  },
  {
    patron: 'press_banca',
    sexo: 'M',
    banda: { min: 60, max: 79 },
    puntos: [{ p: 90, valor: 1.6 }, { p: 80, valor: 1.47 }, { p: 70, valor: 1.38 }, { p: 60, valor: 1.3 }, { p: 50, valor: 1.23 }, { p: 40, valor: 1.16 }, { p: 30, valor: 1.09 }, { p: 20, valor: 1.0 }, { p: 10, valor: 0.88 }],
  },
  {
    patron: 'press_banca',
    sexo: 'M',
    banda: { min: 80, max: null },
    puntos: [{ p: 90, valor: 1.31 }, { p: 80, valor: 1.21 }, { p: 70, valor: 1.1 }, { p: 60, valor: 1.0 }, { p: 50, valor: 0.93 }, { p: 40, valor: 0.86 }, { p: 30, valor: 0.8 }, { p: 20, valor: 0.73 }, { p: 10, valor: 0.61 }],
  },
  {
    patron: 'peso_muerto',
    sexo: 'M',
    banda: { min: 12, max: 17 },
    puntos: [{ p: 90, valor: 2.9 }, { p: 80, valor: 2.69 }, { p: 70, valor: 2.53 }, { p: 60, valor: 2.41 }, { p: 50, valor: 2.28 }, { p: 40, valor: 2.15 }, { p: 30, valor: 2.01 }, { p: 20, valor: 1.85 }, { p: 10, valor: 1.61 }],
  },
  {
    patron: 'peso_muerto',
    sexo: 'M',
    banda: { min: 18, max: 35 },
    puntos: [{ p: 90, valor: 3.25 }, { p: 80, valor: 3.03 }, { p: 70, valor: 2.87 }, { p: 60, valor: 2.75 }, { p: 50, valor: 2.63 }, { p: 40, valor: 2.51 }, { p: 30, valor: 2.4 }, { p: 20, valor: 2.24 }, { p: 10, valor: 2.03 }],
  },
  {
    patron: 'peso_muerto',
    sexo: 'M',
    banda: { min: 36, max: 59 },
    puntos: [{ p: 90, valor: 2.98 }, { p: 80, valor: 2.75 }, { p: 70, valor: 2.59 }, { p: 60, valor: 2.46 }, { p: 50, valor: 2.34 }, { p: 40, valor: 2.22 }, { p: 30, valor: 2.09 }, { p: 20, valor: 1.95 }, { p: 10, valor: 1.75 }],
  },
  {
    patron: 'peso_muerto',
    sexo: 'M',
    banda: { min: 60, max: 79 },
    puntos: [{ p: 90, valor: 2.64 }, { p: 80, valor: 2.44 }, { p: 70, valor: 2.27 }, { p: 60, valor: 2.14 }, { p: 50, valor: 2.02 }, { p: 40, valor: 1.89 }, { p: 30, valor: 1.75 }, { p: 20, valor: 1.61 }, { p: 10, valor: 1.42 }],
  },
  {
    patron: 'peso_muerto',
    sexo: 'M',
    banda: { min: 80, max: null },
    puntos: [{ p: 90, valor: 2.3 }, { p: 80, valor: 2.07 }, { p: 70, valor: 1.81 }, { p: 60, valor: 1.63 }, { p: 50, valor: 1.5 }, { p: 40, valor: 1.4 }, { p: 30, valor: 1.24 }, { p: 20, valor: 1.12 }, { p: 10, valor: 0.96 }],
  },
  {
    patron: 'sentadilla',
    sexo: 'F',
    banda: { min: 12, max: 17 },
    puntos: [{ p: 90, valor: 1.95 }, { p: 80, valor: 1.77 }, { p: 70, valor: 1.65 }, { p: 60, valor: 1.55 }, { p: 50, valor: 1.45 }, { p: 40, valor: 1.36 }, { p: 30, valor: 1.26 }, { p: 20, valor: 1.15 }, { p: 10, valor: 1.01 }],
  },
  {
    patron: 'sentadilla',
    sexo: 'F',
    banda: { min: 18, max: 35 },
    puntos: [{ p: 90, valor: 2.26 }, { p: 80, valor: 2.07 }, { p: 70, valor: 1.93 }, { p: 60, valor: 1.82 }, { p: 50, valor: 1.72 }, { p: 40, valor: 1.62 }, { p: 30, valor: 1.52 }, { p: 20, valor: 1.4 }, { p: 10, valor: 1.23 }],
  },
  {
    patron: 'sentadilla',
    sexo: 'F',
    banda: { min: 36, max: 59 },
    puntos: [{ p: 90, valor: 2.05 }, { p: 80, valor: 1.85 }, { p: 70, valor: 1.73 }, { p: 60, valor: 1.61 }, { p: 50, valor: 1.51 }, { p: 40, valor: 1.41 }, { p: 30, valor: 1.3 }, { p: 20, valor: 1.17 }, { p: 10, valor: 1.01 }],
  },
  {
    patron: 'sentadilla',
    sexo: 'F',
    banda: { min: 60, max: 79 },
    puntos: [{ p: 90, valor: 1.65 }, { p: 80, valor: 1.48 }, { p: 70, valor: 1.36 }, { p: 60, valor: 1.26 }, { p: 50, valor: 1.17 }, { p: 40, valor: 1.08 }, { p: 30, valor: 0.99 }, { p: 20, valor: 0.87 }, { p: 10, valor: 0.72 }],
  },
  {
    patron: 'sentadilla',
    sexo: 'F',
    banda: { min: 80, max: null },
    puntos: [{ p: 90, valor: 1.01 }, { p: 80, valor: 0.96 }, { p: 70, valor: 0.9 }, { p: 60, valor: 0.78 }, { p: 50, valor: 0.67 }, { p: 40, valor: 0.55 }, { p: 30, valor: 0.49 }, { p: 20, valor: 0.32 }, { p: 10, valor: 0.29 }],
  },
  {
    patron: 'press_banca',
    sexo: 'F',
    banda: { min: 12, max: 17 },
    puntos: [{ p: 90, valor: 1.14 }, { p: 80, valor: 1.02 }, { p: 70, valor: 0.94 }, { p: 60, valor: 0.87 }, { p: 50, valor: 0.81 }, { p: 40, valor: 0.75 }, { p: 30, valor: 0.7 }, { p: 20, valor: 0.63 }, { p: 10, valor: 0.56 }],
  },
  {
    patron: 'press_banca',
    sexo: 'F',
    banda: { min: 18, max: 35 },
    puntos: [{ p: 90, valor: 1.35 }, { p: 80, valor: 1.2 }, { p: 70, valor: 1.1 }, { p: 60, valor: 1.03 }, { p: 50, valor: 0.96 }, { p: 40, valor: 0.9 }, { p: 30, valor: 0.84 }, { p: 20, valor: 0.77 }, { p: 10, valor: 0.67 }],
  },
  {
    patron: 'press_banca',
    sexo: 'F',
    banda: { min: 36, max: 59 },
    puntos: [{ p: 90, valor: 1.28 }, { p: 80, valor: 1.14 }, { p: 70, valor: 1.04 }, { p: 60, valor: 0.97 }, { p: 50, valor: 0.9 }, { p: 40, valor: 0.84 }, { p: 30, valor: 0.77 }, { p: 20, valor: 0.7 }, { p: 10, valor: 0.62 }],
  },
  {
    patron: 'press_banca',
    sexo: 'F',
    banda: { min: 60, max: 79 },
    puntos: [{ p: 90, valor: 1.04 }, { p: 80, valor: 0.93 }, { p: 70, valor: 0.85 }, { p: 60, valor: 0.77 }, { p: 50, valor: 0.72 }, { p: 40, valor: 0.67 }, { p: 30, valor: 0.62 }, { p: 20, valor: 0.56 }, { p: 10, valor: 0.49 }],
  },
  {
    patron: 'press_banca',
    sexo: 'F',
    banda: { min: 80, max: null },
    puntos: [{ p: 90, valor: 0.92 }, { p: 80, valor: 0.74 }, { p: 70, valor: 0.67 }, { p: 60, valor: 0.59 }, { p: 50, valor: 0.55 }, { p: 40, valor: 0.49 }, { p: 30, valor: 0.46 }, { p: 20, valor: 0.43 }, { p: 10, valor: 0.41 }],
  },
  {
    patron: 'peso_muerto',
    sexo: 'F',
    banda: { min: 12, max: 17 },
    puntos: [{ p: 90, valor: 2.3 }, { p: 80, valor: 2.11 }, { p: 70, valor: 1.98 }, { p: 60, valor: 1.87 }, { p: 50, valor: 1.76 }, { p: 40, valor: 1.66 }, { p: 30, valor: 1.55 }, { p: 20, valor: 1.43 }, { p: 10, valor: 1.26 }],
  },
  {
    patron: 'peso_muerto',
    sexo: 'F',
    banda: { min: 18, max: 35 },
    puntos: [{ p: 90, valor: 2.66 }, { p: 80, valor: 2.45 }, { p: 70, valor: 2.3 }, { p: 60, valor: 2.17 }, { p: 50, valor: 2.06 }, { p: 40, valor: 1.94 }, { p: 30, valor: 1.82 }, { p: 20, valor: 1.68 }, { p: 10, valor: 1.49 }],
  },
  {
    patron: 'peso_muerto',
    sexo: 'F',
    banda: { min: 36, max: 59 },
    puntos: [{ p: 90, valor: 2.51 }, { p: 80, valor: 2.28 }, { p: 70, valor: 2.13 }, { p: 60, valor: 2.0 }, { p: 50, valor: 1.88 }, { p: 40, valor: 1.76 }, { p: 30, valor: 1.64 }, { p: 20, valor: 1.5 }, { p: 10, valor: 1.32 }],
  },
  {
    patron: 'peso_muerto',
    sexo: 'F',
    banda: { min: 60, max: 79 },
    puntos: [{ p: 90, valor: 2.19 }, { p: 80, valor: 1.98 }, { p: 70, valor: 1.85 }, { p: 60, valor: 1.71 }, { p: 50, valor: 1.6 }, { p: 40, valor: 1.49 }, { p: 30, valor: 1.39 }, { p: 20, valor: 1.27 }, { p: 10, valor: 1.11 }],
  },
  {
    patron: 'peso_muerto',
    sexo: 'F',
    banda: { min: 80, max: null },
    puntos: [{ p: 90, valor: 1.68 }, { p: 80, valor: 1.61 }, { p: 70, valor: 1.47 }, { p: 60, valor: 1.28 }, { p: 50, valor: 1.16 }, { p: 40, valor: 0.97 }, { p: 30, valor: 0.84 }, { p: 20, valor: 0.7 }, { p: 10, valor: 0.61 }],
  },
];
