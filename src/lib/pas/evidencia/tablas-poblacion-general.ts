// ── Tablas de población general (Sprint PAS-18) ────────────────────────────
//
// ⚠ FICHERO GENERADO. No se edita a mano. Ver `scripts/gen-tablas.mjs`.
//
// Cinco protocolos aportados por el profesional, transcritos y comprobados dos
// veces antes de escribirse:
//
//   1 · CADA CELDA existe literalmente en el texto del PDF del que dice venir.
//       311 cadenas comprobadas. Atrapa un dígito cambiado al copiar.
//
//   2 · CADA FILA se reconstruyó del PDF y se comprobó que las columnas salen
//       en el orden que aquí se les asigna. 31 filas. Atrapa una transposición,
//       que el control anterior no vería: intercambiar dos columnas deja todas
//       las cifras presentes.
//
//   Y la del Senior Fitness Test se reconstruyó además por COORDENADAS con
//   PyMuPDF, porque `pdftotext -layout` entrega sus etiquetas de fila
//   desplazadas respecto a sus datos y reordenarlas a ojo era justo el error
//   que no se nota.
//
// ── LO QUE HAY AQUÍ ───────────────────────────────────────────────────────
//
//   · 98 intervalos normales del Senior Fitness Test (Rikli y Jones): siete
//     pruebas × siete bandas de edad × dos sexos, cada uno el tramo entre el
//     percentil 25 y el 75.
//
//   · 33 grupos de bandas con nombre para el VO2máx y el índice del
//     escalón, de CUATRO tablas distintas que no coinciden entre sí.
//
// ── LAS UNIDADES SON LAS DE LA FUENTE, Y NO SE CONVIERTEN ─────────────────
//
//   El Senior Fitness Test publica la marcha de seis minutos en YARDAS y las
//   dos pruebas de flexibilidad en PULGADAS. Aquí se guardan así.
//
//   Convertirlas a metros y centímetros haría la tabla más cómoda y rompería
//   la regla que sostiene todo el registro: «ningún valor de aquí se ha
//   calculado, redondeado ni convertido». La conversión, si hace falta, es
//   ayuda de captura en el formulario —visible, del lado del profesional— y no
//   una operación silenciosa sobre una cifra publicada.

export interface IntervaloSFT {
  tabla: 'sft';
  prueba: string;
  sexo: 'M' | 'F';
  edadMin: number;
  edadMax: number;
  unidad: string;
  /** Percentil 25 y percentil 75, ya ordenados de menor a mayor. */
  min: number;
  max: number;
}

export interface GrupoBandas {
  /** Qué tabla es: decide la cita, y hay cuatro que se contradicen. */
  tabla: 'cooper' | 'aha' | 'rivera' | 'harvard_largo' | 'harvard_corto';
  prueba: string;
  sexo: 'M' | 'F' | null;
  edadMin: number | null;
  edadMax: number | null;
  unidad: string;
  bandas: readonly { nombre: string; min: number | null; max: number | null }[];
}

/** 98 intervalos P25–P75 del Senior Fitness Test. */
export const INTERVALOS_SFT: readonly IntervaloSFT[] = [
  { tabla: 'sft', prueba: 'P-14', sexo: 'M', edadMin: 60, edadMax: 64, unidad: 'repeticiones', min: 14, max: 19 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'M', edadMin: 65, edadMax: 69, unidad: 'repeticiones', min: 12, max: 18 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'M', edadMin: 70, edadMax: 74, unidad: 'repeticiones', min: 12, max: 17 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'M', edadMin: 75, edadMax: 79, unidad: 'repeticiones', min: 11, max: 17 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'M', edadMin: 80, edadMax: 84, unidad: 'repeticiones', min: 10, max: 15 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'M', edadMin: 85, edadMax: 89, unidad: 'repeticiones', min: 8, max: 14 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'M', edadMin: 90, edadMax: 94, unidad: 'repeticiones', min: 7, max: 12 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'F', edadMin: 60, edadMax: 64, unidad: 'repeticiones', min: 12, max: 17 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'F', edadMin: 65, edadMax: 69, unidad: 'repeticiones', min: 11, max: 16 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'F', edadMin: 70, edadMax: 74, unidad: 'repeticiones', min: 10, max: 15 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'F', edadMin: 75, edadMax: 79, unidad: 'repeticiones', min: 10, max: 15 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'F', edadMin: 80, edadMax: 84, unidad: 'repeticiones', min: 9, max: 14 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'F', edadMin: 85, edadMax: 89, unidad: 'repeticiones', min: 8, max: 13 },
  { tabla: 'sft', prueba: 'P-14', sexo: 'F', edadMin: 90, edadMax: 94, unidad: 'repeticiones', min: 4, max: 11 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'M', edadMin: 60, edadMax: 64, unidad: 'repeticiones', min: 16, max: 22 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'M', edadMin: 65, edadMax: 69, unidad: 'repeticiones', min: 15, max: 21 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'M', edadMin: 70, edadMax: 74, unidad: 'repeticiones', min: 14, max: 21 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'M', edadMin: 75, edadMax: 79, unidad: 'repeticiones', min: 13, max: 19 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'M', edadMin: 80, edadMax: 84, unidad: 'repeticiones', min: 13, max: 19 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'M', edadMin: 85, edadMax: 89, unidad: 'repeticiones', min: 11, max: 17 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'M', edadMin: 90, edadMax: 94, unidad: 'repeticiones', min: 10, max: 14 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'F', edadMin: 60, edadMax: 64, unidad: 'repeticiones', min: 13, max: 19 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'F', edadMin: 65, edadMax: 69, unidad: 'repeticiones', min: 12, max: 18 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'F', edadMin: 70, edadMax: 74, unidad: 'repeticiones', min: 12, max: 17 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'F', edadMin: 75, edadMax: 79, unidad: 'repeticiones', min: 11, max: 17 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'F', edadMin: 80, edadMax: 84, unidad: 'repeticiones', min: 10, max: 16 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'F', edadMin: 85, edadMax: 89, unidad: 'repeticiones', min: 10, max: 15 },
  { tabla: 'sft', prueba: 'P-15', sexo: 'F', edadMin: 90, edadMax: 94, unidad: 'repeticiones', min: 8, max: 13 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'M', edadMin: 60, edadMax: 64, unidad: 'yardas', min: 610, max: 735 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'M', edadMin: 65, edadMax: 69, unidad: 'yardas', min: 560, max: 700 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'M', edadMin: 70, edadMax: 74, unidad: 'yardas', min: 545, max: 680 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'M', edadMin: 75, edadMax: 79, unidad: 'yardas', min: 470, max: 640 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'M', edadMin: 80, edadMax: 84, unidad: 'yardas', min: 445, max: 605 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'M', edadMin: 85, edadMax: 89, unidad: 'yardas', min: 380, max: 570 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'M', edadMin: 90, edadMax: 94, unidad: 'yardas', min: 305, max: 500 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'F', edadMin: 60, edadMax: 64, unidad: 'yardas', min: 545, max: 660 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'F', edadMin: 65, edadMax: 69, unidad: 'yardas', min: 500, max: 635 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'F', edadMin: 70, edadMax: 74, unidad: 'yardas', min: 480, max: 615 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'F', edadMin: 75, edadMax: 79, unidad: 'yardas', min: 435, max: 585 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'F', edadMin: 80, edadMax: 84, unidad: 'yardas', min: 385, max: 540 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'F', edadMin: 85, edadMax: 89, unidad: 'yardas', min: 340, max: 510 },
  { tabla: 'sft', prueba: 'P-16', sexo: 'F', edadMin: 90, edadMax: 94, unidad: 'yardas', min: 275, max: 440 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'M', edadMin: 60, edadMax: 64, unidad: 'pasos', min: 87, max: 115 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'M', edadMin: 65, edadMax: 69, unidad: 'pasos', min: 86, max: 116 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'M', edadMin: 70, edadMax: 74, unidad: 'pasos', min: 80, max: 110 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'M', edadMin: 75, edadMax: 79, unidad: 'pasos', min: 73, max: 109 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'M', edadMin: 80, edadMax: 84, unidad: 'pasos', min: 71, max: 103 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'M', edadMin: 85, edadMax: 89, unidad: 'pasos', min: 59, max: 91 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'M', edadMin: 90, edadMax: 94, unidad: 'pasos', min: 52, max: 86 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'F', edadMin: 60, edadMax: 64, unidad: 'pasos', min: 75, max: 107 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'F', edadMin: 65, edadMax: 69, unidad: 'pasos', min: 73, max: 107 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'F', edadMin: 70, edadMax: 74, unidad: 'pasos', min: 68, max: 101 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'F', edadMin: 75, edadMax: 79, unidad: 'pasos', min: 68, max: 100 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'F', edadMin: 80, edadMax: 84, unidad: 'pasos', min: 60, max: 90 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'F', edadMin: 85, edadMax: 89, unidad: 'pasos', min: 55, max: 85 },
  { tabla: 'sft', prueba: 'P-17', sexo: 'F', edadMin: 90, edadMax: 94, unidad: 'pasos', min: 44, max: 72 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'M', edadMin: 60, edadMax: 64, unidad: 'pulgadas', min: -2.5, max: 4 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'M', edadMin: 65, edadMax: 69, unidad: 'pulgadas', min: -3, max: 3 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'M', edadMin: 70, edadMax: 74, unidad: 'pulgadas', min: -3, max: 3 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'M', edadMin: 75, edadMax: 79, unidad: 'pulgadas', min: -4, max: 2 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'M', edadMin: 80, edadMax: 84, unidad: 'pulgadas', min: -5.5, max: 1.5 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'M', edadMin: 85, edadMax: 89, unidad: 'pulgadas', min: -5.5, max: 0.5 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'M', edadMin: 90, edadMax: 94, unidad: 'pulgadas', min: -6.5, max: -0.5 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'F', edadMin: 60, edadMax: 64, unidad: 'pulgadas', min: -0.5, max: 5 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'F', edadMin: 65, edadMax: 69, unidad: 'pulgadas', min: -0.5, max: 4.5 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'F', edadMin: 70, edadMax: 74, unidad: 'pulgadas', min: -1, max: 4 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'F', edadMin: 75, edadMax: 79, unidad: 'pulgadas', min: -1.5, max: 3.5 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'F', edadMin: 80, edadMax: 84, unidad: 'pulgadas', min: -2, max: 3 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'F', edadMin: 85, edadMax: 89, unidad: 'pulgadas', min: -2.5, max: 2.5 },
  { tabla: 'sft', prueba: 'P-18', sexo: 'F', edadMin: 90, edadMax: 94, unidad: 'pulgadas', min: -4.5, max: 1 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'M', edadMin: 60, edadMax: 64, unidad: 'pulgadas', min: -6.5, max: 0 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'M', edadMin: 65, edadMax: 69, unidad: 'pulgadas', min: -7.5, max: -1 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'M', edadMin: 70, edadMax: 74, unidad: 'pulgadas', min: -8, max: -1 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'M', edadMin: 75, edadMax: 79, unidad: 'pulgadas', min: -9, max: -2 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'M', edadMin: 80, edadMax: 84, unidad: 'pulgadas', min: -9.5, max: -2 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'M', edadMin: 85, edadMax: 89, unidad: 'pulgadas', min: -9.5, max: -3 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'M', edadMin: 90, edadMax: 94, unidad: 'pulgadas', min: -10.5, max: -4 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'F', edadMin: 60, edadMax: 64, unidad: 'pulgadas', min: -3, max: 1.5 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'F', edadMin: 65, edadMax: 69, unidad: 'pulgadas', min: -3.5, max: 1.5 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'F', edadMin: 70, edadMax: 74, unidad: 'pulgadas', min: -4, max: 1 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'F', edadMin: 75, edadMax: 79, unidad: 'pulgadas', min: -5, max: 0.5 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'F', edadMin: 80, edadMax: 84, unidad: 'pulgadas', min: -5.5, max: 0 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'F', edadMin: 85, edadMax: 89, unidad: 'pulgadas', min: -7, max: -1 },
  { tabla: 'sft', prueba: 'P-19', sexo: 'F', edadMin: 90, edadMax: 94, unidad: 'pulgadas', min: -8, max: -1 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'M', edadMin: 60, edadMax: 64, unidad: 's', min: 3.8, max: 5.6 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'M', edadMin: 65, edadMax: 69, unidad: 's', min: 4.3, max: 5.9 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'M', edadMin: 70, edadMax: 74, unidad: 's', min: 4.4, max: 6.2 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'M', edadMin: 75, edadMax: 79, unidad: 's', min: 4.6, max: 7.2 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'M', edadMin: 80, edadMax: 84, unidad: 's', min: 5.2, max: 7.6 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'M', edadMin: 85, edadMax: 89, unidad: 's', min: 5.5, max: 8.9 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'M', edadMin: 90, edadMax: 94, unidad: 's', min: 6.2, max: 10 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'F', edadMin: 60, edadMax: 64, unidad: 's', min: 4.4, max: 6 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'F', edadMin: 65, edadMax: 69, unidad: 's', min: 4.8, max: 6.4 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'F', edadMin: 70, edadMax: 74, unidad: 's', min: 4.9, max: 7.1 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'F', edadMin: 75, edadMax: 79, unidad: 's', min: 5.2, max: 7.4 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'F', edadMin: 80, edadMax: 84, unidad: 's', min: 5.7, max: 8.7 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'F', edadMin: 85, edadMax: 89, unidad: 's', min: 6.2, max: 9.6 },
  { tabla: 'sft', prueba: 'P-20', sexo: 'F', edadMin: 90, edadMax: 94, unidad: 's', min: 7.3, max: 11.5 },
];

/**
 * 33 grupos de bandas nombradas para el VO2máx y el índice del escalón.
 *
 * LOS SOLAPES SON DE LA FUENTE Y SE CONSERVAN. El generador los detecta y los
 * deja pasar a propósito: son 27 y están impresos así en los documentos —Cooper
 * cierra «Muy Pobre» en 35.0 y abre «Pobre» en 35.0, Rivera cubre 50-65 y 60+
 * a la vez, el método corto del escalón hace 40-60 y 60-80—. Corregirlos aquí
 * sería enmendar la plana a la tabla; `situar()` resuelve el borde con una
 * regla declarada y el resto se informa como limitación.
 */
export const GRUPOS_BANDAS: readonly GrupoBandas[] = [
  { tabla: 'cooper', prueba: 'P-12', sexo: 'M', edadMin: 13, edadMax: 19, unidad: 'mL/kg/min', bandas: [{ nombre: "Muy Pobre", min: null, max: 35 }, { nombre: "Pobre", min: 35, max: 38.3 }, { nombre: "Promedio", min: 38.4, max: 45.1 }, { nombre: "Bueno", min: 45.2, max: 50.9 }, { nombre: "Excelente", min: 51, max: 55.9 }, { nombre: "Superior", min: 56, max: null }] },
  { tabla: 'cooper', prueba: 'P-12', sexo: 'M', edadMin: 20, edadMax: 29, unidad: 'mL/kg/min', bandas: [{ nombre: "Muy Pobre", min: null, max: 33 }, { nombre: "Pobre", min: 33, max: 36.4 }, { nombre: "Promedio", min: 36.5, max: 42.2 }, { nombre: "Bueno", min: 42.5, max: 46.4 }, { nombre: "Excelente", min: 46.5, max: 52.4 }, { nombre: "Superior", min: 52.5, max: null }] },
  { tabla: 'cooper', prueba: 'P-12', sexo: 'M', edadMin: 30, edadMax: 39, unidad: 'mL/kg/min', bandas: [{ nombre: "Muy Pobre", min: null, max: 31.5 }, { nombre: "Pobre", min: 31.5, max: 35.4 }, { nombre: "Promedio", min: 35.5, max: 40.9 }, { nombre: "Bueno", min: 41, max: 44.9 }, { nombre: "Excelente", min: 45, max: 49.4 }, { nombre: "Superior", min: 49.5, max: null }] },
  { tabla: 'cooper', prueba: 'P-12', sexo: 'M', edadMin: 40, edadMax: 49, unidad: 'mL/kg/min', bandas: [{ nombre: "Muy Pobre", min: null, max: 30.2 }, { nombre: "Pobre", min: 30.2, max: 33.5 }, { nombre: "Promedio", min: 33.6, max: 38.9 }, { nombre: "Bueno", min: 39, max: 43.7 }, { nombre: "Excelente", min: 43.8, max: 48 }, { nombre: "Superior", min: 48.1, max: null }] },
  { tabla: 'cooper', prueba: 'P-12', sexo: 'M', edadMin: 50, edadMax: 59, unidad: 'mL/kg/min', bandas: [{ nombre: "Muy Pobre", min: null, max: 26.1 }, { nombre: "Pobre", min: 26.1, max: 30.9 }, { nombre: "Promedio", min: 31, max: 35.7 }, { nombre: "Bueno", min: 35.8, max: 40.9 }, { nombre: "Excelente", min: 41, max: 45.3 }, { nombre: "Superior", min: 45.4, max: null }] },
  { tabla: 'cooper', prueba: 'P-12', sexo: 'M', edadMin: 60, edadMax: null, unidad: 'mL/kg/min', bandas: [{ nombre: "Muy Pobre", min: null, max: 20.5 }, { nombre: "Pobre", min: 20.5, max: 26 }, { nombre: "Promedio", min: 26.1, max: 32.2 }, { nombre: "Bueno", min: 32.2, max: 36.4 }, { nombre: "Excelente", min: 36.5, max: 44.2 }, { nombre: "Superior", min: 44.3, max: null }] },
  { tabla: 'aha', prueba: 'P-12', sexo: 'M', edadMin: 20, edadMax: 29, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 25 }, { nombre: "Aceptable", min: 25, max: 33 }, { nombre: "Promedio", min: 34, max: 42 }, { nombre: "Bueno", min: 43, max: 52 }, { nombre: "Alto", min: 53, max: null }] },
  { tabla: 'aha', prueba: 'P-12', sexo: 'M', edadMin: 30, edadMax: 39, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 23 }, { nombre: "Aceptable", min: 23, max: 30 }, { nombre: "Promedio", min: 31, max: 38 }, { nombre: "Bueno", min: 39, max: 48 }, { nombre: "Alto", min: 49, max: null }] },
  { tabla: 'aha', prueba: 'P-12', sexo: 'M', edadMin: 40, edadMax: 49, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 20 }, { nombre: "Aceptable", min: 20, max: 26 }, { nombre: "Promedio", min: 27, max: 35 }, { nombre: "Bueno", min: 36, max: 44 }, { nombre: "Alto", min: 45, max: null }] },
  { tabla: 'aha', prueba: 'P-12', sexo: 'M', edadMin: 50, edadMax: 65, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 18 }, { nombre: "Aceptable", min: 18, max: 24 }, { nombre: "Promedio", min: 25, max: 33 }, { nombre: "Bueno", min: 34, max: 42 }, { nombre: "Alto", min: 43, max: null }] },
  { tabla: 'aha', prueba: 'P-12', sexo: 'M', edadMin: 60, edadMax: 69, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 16 }, { nombre: "Aceptable", min: 16, max: 22 }, { nombre: "Promedio", min: 23, max: 30 }, { nombre: "Bueno", min: 31, max: 40 }, { nombre: "Alto", min: 41, max: null }] },
  { tabla: 'rivera', prueba: 'P-12', sexo: 'M', edadMin: 20, edadMax: 29, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 35 }, { nombre: "Debajo del Promedio", min: 36, max: 41 }, { nombre: "Promedio", min: 42, max: 49 }, { nombre: "Sobre el Promedio", min: 50, max: 55 }, { nombre: "Alto", min: 56, max: null }] },
  { tabla: 'rivera', prueba: 'P-12', sexo: 'M', edadMin: 30, edadMax: 39, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 31 }, { nombre: "Debajo del Promedio", min: 32, max: 38 }, { nombre: "Promedio", min: 39, max: 43 }, { nombre: "Sobre el Promedio", min: 44, max: 49 }, { nombre: "Alto", min: 50, max: null }] },
  { tabla: 'rivera', prueba: 'P-12', sexo: 'M', edadMin: 40, edadMax: 49, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 25 }, { nombre: "Debajo del Promedio", min: 26, max: 32 }, { nombre: "Promedio", min: 33, max: 40 }, { nombre: "Sobre el Promedio", min: 41, max: 46 }, { nombre: "Alto", min: 47, max: null }] },
  { tabla: 'rivera', prueba: 'P-12', sexo: 'M', edadMin: 50, edadMax: 65, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 20 }, { nombre: "Debajo del Promedio", min: 21, max: 26 }, { nombre: "Promedio", min: 27, max: 34 }, { nombre: "Sobre el Promedio", min: 35, max: 40 }, { nombre: "Alto", min: 41, max: null }] },
  { tabla: 'rivera', prueba: 'P-12', sexo: 'M', edadMin: 60, edadMax: null, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 17 }, { nombre: "Debajo del Promedio", min: 18, max: 24 }, { nombre: "Promedio", min: 25, max: 31 }, { nombre: "Sobre el Promedio", min: 32, max: 38 }, { nombre: "Alto", min: 39, max: null }] },
  { tabla: 'cooper', prueba: 'P-12', sexo: 'F', edadMin: 13, edadMax: 19, unidad: 'mL/kg/min', bandas: [{ nombre: "Muy Pobre", min: null, max: 25 }, { nombre: "Pobre", min: 25, max: 30.9 }, { nombre: "Promedio", min: 31, max: 34.9 }, { nombre: "Bueno", min: 35, max: 38.9 }, { nombre: "Excelente", min: 39, max: 41.9 }, { nombre: "Superior", min: 42, max: null }] },
  { tabla: 'cooper', prueba: 'P-12', sexo: 'F', edadMin: 20, edadMax: 29, unidad: 'mL/kg/min', bandas: [{ nombre: "Muy Pobre", min: null, max: 23.6 }, { nombre: "Pobre", min: 23.6, max: 28.9 }, { nombre: "Promedio", min: 29, max: 32.9 }, { nombre: "Bueno", min: 33, max: 36.9 }, { nombre: "Excelente", min: 37, max: 40.9 }, { nombre: "Superior", min: 41, max: null }] },
  { tabla: 'cooper', prueba: 'P-12', sexo: 'F', edadMin: 30, edadMax: 39, unidad: 'mL/kg/min', bandas: [{ nombre: "Muy Pobre", min: null, max: 22.8 }, { nombre: "Pobre", min: 22.8, max: 26.9 }, { nombre: "Promedio", min: 27, max: 31.4 }, { nombre: "Bueno", min: 31.5, max: 35.6 }, { nombre: "Excelente", min: 35.7, max: 40.1 }, { nombre: "Superior", min: 40.1, max: null }] },
  { tabla: 'cooper', prueba: 'P-12', sexo: 'F', edadMin: 40, edadMax: 49, unidad: 'mL/kg/min', bandas: [{ nombre: "Muy Pobre", min: null, max: 21 }, { nombre: "Pobre", min: 21, max: 24.4 }, { nombre: "Promedio", min: 24.5, max: 28.9 }, { nombre: "Bueno", min: 29, max: 32.8 }, { nombre: "Excelente", min: 32.9, max: 36.9 }, { nombre: "Superior", min: 37, max: null }] },
  { tabla: 'cooper', prueba: 'P-12', sexo: 'F', edadMin: 50, edadMax: 59, unidad: 'mL/kg/min', bandas: [{ nombre: "Muy Pobre", min: null, max: 20.2 }, { nombre: "Pobre", min: 20.2, max: 22.7 }, { nombre: "Promedio", min: 22.8, max: 26.9 }, { nombre: "Bueno", min: 27, max: 31.4 }, { nombre: "Excelente", min: 31.5, max: 35.7 }, { nombre: "Superior", min: 35.8, max: null }] },
  { tabla: 'cooper', prueba: 'P-12', sexo: 'F', edadMin: 60, edadMax: null, unidad: 'mL/kg/min', bandas: [{ nombre: "Muy Pobre", min: null, max: 17.5 }, { nombre: "Pobre", min: 17.5, max: 20.1 }, { nombre: "Promedio", min: 20.2, max: 24.4 }, { nombre: "Bueno", min: 24.5, max: 30.2 }, { nombre: "Excelente", min: 30.3, max: 31.4 }, { nombre: "Superior", min: 31.5, max: null }] },
  { tabla: 'aha', prueba: 'P-12', sexo: 'F', edadMin: 20, edadMax: 29, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 24 }, { nombre: "Aceptable", min: 24, max: 30 }, { nombre: "Promedio", min: 31, max: 37 }, { nombre: "Bueno", min: 38, max: 48 }, { nombre: "Alto", min: 49, max: null }] },
  { tabla: 'aha', prueba: 'P-12', sexo: 'F', edadMin: 30, edadMax: 39, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 20 }, { nombre: "Aceptable", min: 20, max: 27 }, { nombre: "Promedio", min: 28, max: 33 }, { nombre: "Bueno", min: 34, max: 44 }, { nombre: "Alto", min: 45, max: null }] },
  { tabla: 'aha', prueba: 'P-12', sexo: 'F', edadMin: 40, edadMax: 49, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 17 }, { nombre: "Aceptable", min: 17, max: 23 }, { nombre: "Promedio", min: 24, max: 30 }, { nombre: "Bueno", min: 31, max: 41 }, { nombre: "Alto", min: 42, max: null }] },
  { tabla: 'aha', prueba: 'P-12', sexo: 'F', edadMin: 50, edadMax: 65, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 15 }, { nombre: "Aceptable", min: 15, max: 20 }, { nombre: "Promedio", min: 21, max: 27 }, { nombre: "Bueno", min: 28, max: 37 }, { nombre: "Alto", min: 38, max: null }] },
  { tabla: 'aha', prueba: 'P-12', sexo: 'F', edadMin: 60, edadMax: 69, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 13 }, { nombre: "Aceptable", min: 13, max: 17 }, { nombre: "Promedio", min: 18, max: 23 }, { nombre: "Bueno", min: 24, max: 34 }, { nombre: "Alto", min: 35, max: null }] },
  { tabla: 'rivera', prueba: 'P-12', sexo: 'F', edadMin: 20, edadMax: 29, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 25 }, { nombre: "Debajo del Promedio", min: 26, max: 30 }, { nombre: "Promedio", min: 31, max: 37 }, { nombre: "Sobre el Promedio", min: 38, max: 43 }, { nombre: "Alto", min: 44, max: null }] },
  { tabla: 'rivera', prueba: 'P-12', sexo: 'F', edadMin: 30, edadMax: 39, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 22 }, { nombre: "Debajo del Promedio", min: 23, max: 28 }, { nombre: "Promedio", min: 29, max: 33 }, { nombre: "Sobre el Promedio", min: 34, max: 41 }, { nombre: "Alto", min: 42, max: null }] },
  { tabla: 'rivera', prueba: 'P-12', sexo: 'F', edadMin: 40, edadMax: 49, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 19 }, { nombre: "Debajo del Promedio", min: 20, max: 25 }, { nombre: "Promedio", min: 26, max: 32 }, { nombre: "Sobre el Promedio", min: 33, max: 38 }, { nombre: "Alto", min: 39, max: null }] },
  { tabla: 'rivera', prueba: 'P-12', sexo: 'F', edadMin: 50, edadMax: null, unidad: 'mL/kg/min', bandas: [{ nombre: "Bajo", min: null, max: 16 }, { nombre: "Debajo del Promedio", min: 17, max: 21 }, { nombre: "Promedio", min: 22, max: 29 }, { nombre: "Sobre el Promedio", min: 30, max: 36 }, { nombre: "Alto", min: 37, max: null }] },
  { tabla: 'harvard_largo', prueba: 'P-13', sexo: null, edadMin: null, edadMax: null, unidad: 'indice', bandas: [{ nombre: "Muy Pobre", min: null, max: 55 }, { nombre: "Pobre", min: 56, max: 64 }, { nombre: "Promedio", min: 65, max: 79 }, { nombre: "Bueno", min: 80, max: 89 }, { nombre: "Excelente", min: 90, max: null }] },
  { tabla: 'harvard_corto', prueba: 'P-13', sexo: null, edadMin: null, edadMax: null, unidad: 'indice', bandas: [{ nombre: "Pobre", min: null, max: 40 }, { nombre: "Promedio", min: 40, max: 60 }, { nombre: "Bueno", min: 60, max: 80 }, { nombre: "Excelente", min: 80, max: null }] },
];

/** Los solapes que traen impresos los documentos, tal cual se detectaron. */
export const SOLAPES_EN_LA_FUENTE: readonly string[] = [
  "cooper/M/13: «Muy Pobre» acaba en 35 y «Pobre» empieza en 35",
  "cooper/M/20: «Muy Pobre» acaba en 33 y «Pobre» empieza en 33",
  "cooper/M/30: «Muy Pobre» acaba en 31.5 y «Pobre» empieza en 31.5",
  "cooper/M/40: «Muy Pobre» acaba en 30.2 y «Pobre» empieza en 30.2",
  "cooper/M/50: «Muy Pobre» acaba en 26.1 y «Pobre» empieza en 26.1",
  "cooper/M/60: «Muy Pobre» acaba en 20.5 y «Pobre» empieza en 20.5",
  "cooper/M/60: «Promedio» acaba en 32.2 y «Bueno» empieza en 32.2",
  "aha/M/20: «Bajo» acaba en 25 y «Aceptable» empieza en 25",
  "aha/M/30: «Bajo» acaba en 23 y «Aceptable» empieza en 23",
  "aha/M/40: «Bajo» acaba en 20 y «Aceptable» empieza en 20",
  "aha/M/50: «Bajo» acaba en 18 y «Aceptable» empieza en 18",
  "aha/M/60: «Bajo» acaba en 16 y «Aceptable» empieza en 16",
  "cooper/F/13: «Muy Pobre» acaba en 25 y «Pobre» empieza en 25",
  "cooper/F/20: «Muy Pobre» acaba en 23.6 y «Pobre» empieza en 23.6",
  "cooper/F/30: «Muy Pobre» acaba en 22.8 y «Pobre» empieza en 22.8",
  "cooper/F/30: «Excelente» acaba en 40.1 y «Superior» empieza en 40.1",
  "cooper/F/40: «Muy Pobre» acaba en 21 y «Pobre» empieza en 21",
  "cooper/F/50: «Muy Pobre» acaba en 20.2 y «Pobre» empieza en 20.2",
  "cooper/F/60: «Muy Pobre» acaba en 17.5 y «Pobre» empieza en 17.5",
  "aha/F/20: «Bajo» acaba en 24 y «Aceptable» empieza en 24",
  "aha/F/30: «Bajo» acaba en 20 y «Aceptable» empieza en 20",
  "aha/F/40: «Bajo» acaba en 17 y «Aceptable» empieza en 17",
  "aha/F/50: «Bajo» acaba en 15 y «Aceptable» empieza en 15",
  "aha/F/60: «Bajo» acaba en 13 y «Aceptable» empieza en 13",
  "harvard_corto/-/-: «Pobre» acaba en 40 y «Promedio» empieza en 40",
  "harvard_corto/-/-: «Promedio» acaba en 60 y «Bueno» empieza en 60",
  "harvard_corto/-/-: «Bueno» acaba en 80 y «Excelente» empieza en 80",
];
