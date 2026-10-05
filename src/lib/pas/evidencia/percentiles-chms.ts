// ── Percentiles del CHMS · salto y sit-and-reach (Sprint PAS-17) ───────────
//
// ⚠ FICHERO GENERADO. No se edita a mano.
//
//   Fuente: `hoffmann_chms_2019` (Canadian Health Measures Survey, ciclo 5).
//   Transcripción: las fichas `CMJ-CA-TN1-percentiles.md` (32 normas, 8 a 69
//   años) y `SAR-CA-TN1-percentiles.md` (34 normas, 6 a 69 años) de la NKB.
//   Generado por `scripts/gen-chms.mjs`.
//
// ── POR QUÉ EXISTE ────────────────────────────────────────────────────────
//
//   Las 66 normas llevaban desde el Sprint PAS-12 transcritas y verificadas en
//   la NKB, y solo OCHO llegaban al motor: varones y mujeres de 20 a 29 años,
//   tecleadas a mano en `registro.ts`. Las otras cincuenta y ocho existían en
//   el repositorio y no situaban a nadie. Un niño de 12, un adulto de 45 y una
//   mujer de 60 salían sin posición en dos de las cinco pruebas que la tienen,
//   no porque falte ciencia sino porque faltaba el cable.
//
//   Esto no admite ninguna norma nueva: la fuente ya estaba admitida, la ficha
//   ya estaba verificada y las cifras son las mismas. Lo único que cambia es
//   cuántas de ellas llegan a la pantalla.
//
// ── LAS TRES VERIFICACIONES DEL GENERADOR ─────────────────────────────────
//
//   1 · RECUENTO. Cada ficha declara cuántas normas contiene en su cabecera
//       —32 y 34— y el generador aborta si lee otra cantidad. Es el control
//       que atrapa una fila comida por el parser.
//
//   2 · MONOTONÍA. En cada banda, P95 ≥ P90 ≥ … ≥ P5. Un percentil que baja
//       es una columna desalineada, y en una tabla de once columnas leídas de
//       markdown ese es el fallo más probable y el más silencioso.
//
//   3 · CONTROL CRUZADO. Las ocho bandas adultas ya estaban tecleadas a mano
//       desde PAS-12. El generador las compara punto por punto con lo que lee
//       de la ficha y aborta si difieren. Sustituir ocho valores comprobados
//       por ochenta sin comprobar sería cambiar cobertura por confianza.
//
// ── LAS DOS CELDAS QUE NO ESTÁN ───────────────────────────────────────────
//
//   `CMJ-CA-F-60_64/P95` y `SAR-CA-F-50_54/P95` se perdieron en la extracción
//   del PDF y las fichas los conservan como «—», con la instrucción expresa de
//   no reconstruirlos. Aquí NO se emiten: esas dos bandas salen con diez
//   percentiles en vez de once. Una banda con un hueco declarado sitúa peor
//   que una completa y muchísimo mejor que una con un número inventado.

export interface BandaCHMS {
  /** Prueba del catálogo: 'P-04' salto, 'P-06' sit-and-reach. */
  prueba: 'P-04' | 'P-06';
  sexo: 'M' | 'F';
  edadMin: number;
  edadMax: number;
  puntos: readonly { p: number; valor: number }[];
}

/** 66 bandas: 32 de salto y 34 de sit-and-reach. */
export const PERCENTILES_CHMS: readonly BandaCHMS[] = [
  { prueba: 'P-04', sexo: 'M', edadMin: 8, edadMax: 9, puntos: [{ p: 5, valor: 21.4 }, { p: 10, valor: 22.9 }, { p: 20, valor: 24.9 }, { p: 30, valor: 26.5 }, { p: 40, valor: 27.9 }, { p: 50, valor: 29.2 }, { p: 60, valor: 30.7 }, { p: 70, valor: 32.3 }, { p: 80, valor: 34.3 }, { p: 90, valor: 37.2 }, { p: 95, valor: 39.8 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 10, edadMax: 11, puntos: [{ p: 5, valor: 24.9 }, { p: 10, valor: 26.9 }, { p: 20, valor: 29.5 }, { p: 30, valor: 31.5 }, { p: 40, valor: 33.2 }, { p: 50, valor: 34.8 }, { p: 60, valor: 36.5 }, { p: 70, valor: 38.4 }, { p: 80, valor: 40.6 }, { p: 90, valor: 43.8 }, { p: 95, valor: 45 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 12, edadMax: 13, puntos: [{ p: 5, valor: 27.9 }, { p: 10, valor: 30.5 }, { p: 20, valor: 33.6 }, { p: 30, valor: 35.9 }, { p: 40, valor: 38 }, { p: 50, valor: 39.9 }, { p: 60, valor: 41.8 }, { p: 70, valor: 43.9 }, { p: 80, valor: 46.3 }, { p: 90, valor: 49.8 }, { p: 95, valor: 52.7 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 14, edadMax: 15, puntos: [{ p: 5, valor: 30.2 }, { p: 10, valor: 33.3 }, { p: 20, valor: 37 }, { p: 30, valor: 39.6 }, { p: 40, valor: 41.9 }, { p: 50, valor: 44 }, { p: 60, valor: 46.1 }, { p: 70, valor: 48.3 }, { p: 80, valor: 51 }, { p: 90, valor: 54.6 }, { p: 95, valor: 57.6 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 16, edadMax: 17, puntos: [{ p: 5, valor: 31.8 }, { p: 10, valor: 35.2 }, { p: 20, valor: 39.3 }, { p: 30, valor: 42.2 }, { p: 40, valor: 44.7 }, { p: 50, valor: 46.9 }, { p: 60, valor: 49.2 }, { p: 70, valor: 51.5 }, { p: 80, valor: 54.3 }, { p: 90, valor: 58.1 }, { p: 95, valor: 61.1 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 18, edadMax: 19, puntos: [{ p: 5, valor: 32.6 }, { p: 10, valor: 36.3 }, { p: 20, valor: 40.7 }, { p: 30, valor: 43.8 }, { p: 40, valor: 46.3 }, { p: 50, valor: 48.7 }, { p: 60, valor: 51 }, { p: 70, valor: 53.5 }, { p: 80, valor: 56.3 }, { p: 90, valor: 60.1 }, { p: 95, valor: 63.2 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 20, edadMax: 24, puntos: [{ p: 5, valor: 32.6 }, { p: 10, valor: 36.6 }, { p: 20, valor: 41.2 }, { p: 30, valor: 44.3 }, { p: 40, valor: 47 }, { p: 50, valor: 49.4 }, { p: 60, valor: 51.7 }, { p: 70, valor: 54.1 }, { p: 80, valor: 56.9 }, { p: 90, valor: 60.7 }, { p: 95, valor: 63.8 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 25, edadMax: 29, puntos: [{ p: 5, valor: 31.5 }, { p: 10, valor: 35.5 }, { p: 20, valor: 40 }, { p: 30, valor: 43.1 }, { p: 40, valor: 45.7 }, { p: 50, valor: 48 }, { p: 60, valor: 50.3 }, { p: 70, valor: 52.6 }, { p: 80, valor: 55.3 }, { p: 90, valor: 59 }, { p: 95, valor: 61.9 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 30, edadMax: 34, puntos: [{ p: 5, valor: 30.1 }, { p: 10, valor: 33.9 }, { p: 20, valor: 38.2 }, { p: 30, valor: 41.1 }, { p: 40, valor: 43.6 }, { p: 50, valor: 45.8 }, { p: 60, valor: 47.9 }, { p: 70, valor: 50.2 }, { p: 80, valor: 52.8 }, { p: 90, valor: 56.3 }, { p: 95, valor: 59.1 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 35, edadMax: 39, puntos: [{ p: 5, valor: 28.8 }, { p: 10, valor: 32.3 }, { p: 20, valor: 36.3 }, { p: 30, valor: 39.1 }, { p: 40, valor: 41.4 }, { p: 50, valor: 43.5 }, { p: 60, valor: 45.5 }, { p: 70, valor: 47.7 }, { p: 80, valor: 50.2 }, { p: 90, valor: 53.5 }, { p: 95, valor: 56.2 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 40, edadMax: 44, puntos: [{ p: 5, valor: 27.5 }, { p: 10, valor: 30.7 }, { p: 20, valor: 34.4 }, { p: 30, valor: 37 }, { p: 40, valor: 39.1 }, { p: 50, valor: 41.1 }, { p: 60, valor: 43.1 }, { p: 70, valor: 45.1 }, { p: 80, valor: 47.5 }, { p: 90, valor: 50.7 }, { p: 95, valor: 53.3 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 45, edadMax: 49, puntos: [{ p: 5, valor: 26.2 }, { p: 10, valor: 29.1 }, { p: 20, valor: 32.5 }, { p: 30, valor: 34.9 }, { p: 40, valor: 36.9 }, { p: 50, valor: 38.8 }, { p: 60, valor: 40.6 }, { p: 70, valor: 42.6 }, { p: 80, valor: 44.9 }, { p: 90, valor: 48 }, { p: 95, valor: 50.5 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 50, edadMax: 54, puntos: [{ p: 5, valor: 24.8 }, { p: 10, valor: 27.4 }, { p: 20, valor: 30.6 }, { p: 30, valor: 32.8 }, { p: 40, valor: 34.7 }, { p: 50, valor: 36.4 }, { p: 60, valor: 38.2 }, { p: 70, valor: 40 }, { p: 80, valor: 42.2 }, { p: 90, valor: 45.1 }, { p: 95, valor: 47.6 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 55, edadMax: 59, puntos: [{ p: 5, valor: 23.4 }, { p: 10, valor: 25.7 }, { p: 20, valor: 28.5 }, { p: 30, valor: 30.6 }, { p: 40, valor: 32.3 }, { p: 50, valor: 33.9 }, { p: 60, valor: 35.6 }, { p: 70, valor: 37.3 }, { p: 80, valor: 39.3 }, { p: 90, valor: 42.2 }, { p: 95, valor: 44.5 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 60, edadMax: 64, puntos: [{ p: 5, valor: 21.7 }, { p: 10, valor: 23.8 }, { p: 20, valor: 26.4 }, { p: 30, valor: 28.2 }, { p: 40, valor: 29.8 }, { p: 50, valor: 31.3 }, { p: 60, valor: 32.8 }, { p: 70, valor: 34.4 }, { p: 80, valor: 36.3 }, { p: 90, valor: 39 }, { p: 95, valor: 41.2 }] },
  { prueba: 'P-04', sexo: 'M', edadMin: 65, edadMax: 69, puntos: [{ p: 5, valor: 19.9 }, { p: 10, valor: 21.7 }, { p: 20, valor: 24 }, { p: 30, valor: 25.7 }, { p: 40, valor: 27.1 }, { p: 50, valor: 28.5 }, { p: 60, valor: 29.8 }, { p: 70, valor: 31.3 }, { p: 80, valor: 33.1 }, { p: 90, valor: 35.5 }, { p: 95, valor: 37.6 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 8, edadMax: 9, puntos: [{ p: 5, valor: 20.6 }, { p: 10, valor: 22.2 }, { p: 20, valor: 24.2 }, { p: 30, valor: 25.6 }, { p: 40, valor: 26.8 }, { p: 50, valor: 27.9 }, { p: 60, valor: 29 }, { p: 70, valor: 30.2 }, { p: 80, valor: 31.5 }, { p: 90, valor: 33.4 }, { p: 95, valor: 35 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 10, edadMax: 11, puntos: [{ p: 5, valor: 24.1 }, { p: 10, valor: 26 }, { p: 20, valor: 28.3 }, { p: 30, valor: 30 }, { p: 40, valor: 31.4 }, { p: 50, valor: 32.8 }, { p: 60, valor: 34.1 }, { p: 70, valor: 35.5 }, { p: 80, valor: 37.2 }, { p: 90, valor: 39.5 }, { p: 95, valor: 41.4 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 12, edadMax: 13, puntos: [{ p: 5, valor: 25.5 }, { p: 10, valor: 27.6 }, { p: 20, valor: 30 }, { p: 30, valor: 31.9 }, { p: 40, valor: 33.4 }, { p: 50, valor: 34.9 }, { p: 60, valor: 36.3 }, { p: 70, valor: 37.9 }, { p: 80, valor: 39.7 }, { p: 90, valor: 42.3 }, { p: 95, valor: 44.4 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 14, edadMax: 15, puntos: [{ p: 5, valor: 25.3 }, { p: 10, valor: 27.3 }, { p: 20, valor: 29.9 }, { p: 30, valor: 31.7 }, { p: 40, valor: 33.3 }, { p: 50, valor: 34.7 }, { p: 60, valor: 36.2 }, { p: 70, valor: 37.8 }, { p: 80, valor: 39.7 }, { p: 90, valor: 42.3 }, { p: 95, valor: 44.5 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 16, edadMax: 17, puntos: [{ p: 5, valor: 24.5 }, { p: 10, valor: 26.5 }, { p: 20, valor: 28.9 }, { p: 30, valor: 30.7 }, { p: 40, valor: 32.3 }, { p: 50, valor: 33.7 }, { p: 60, valor: 35.2 }, { p: 70, valor: 36.8 }, { p: 80, valor: 38.7 }, { p: 90, valor: 41.3 }, { p: 95, valor: 43.5 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 18, edadMax: 19, puntos: [{ p: 5, valor: 23.6 }, { p: 10, valor: 25.6 }, { p: 20, valor: 28 }, { p: 30, valor: 29.8 }, { p: 40, valor: 31.3 }, { p: 50, valor: 32.8 }, { p: 60, valor: 34.2 }, { p: 70, valor: 35.8 }, { p: 80, valor: 37.6 }, { p: 90, valor: 40.2 }, { p: 95, valor: 42.4 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 20, edadMax: 24, puntos: [{ p: 5, valor: 22.8 }, { p: 10, valor: 24.7 }, { p: 20, valor: 27.1 }, { p: 30, valor: 28.9 }, { p: 40, valor: 30.4 }, { p: 50, valor: 31.8 }, { p: 60, valor: 33.3 }, { p: 70, valor: 34.8 }, { p: 80, valor: 36.7 }, { p: 90, valor: 39.3 }, { p: 95, valor: 41.4 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 25, edadMax: 29, puntos: [{ p: 5, valor: 22.2 }, { p: 10, valor: 24.1 }, { p: 20, valor: 26.5 }, { p: 30, valor: 28.3 }, { p: 40, valor: 29.9 }, { p: 50, valor: 31.3 }, { p: 60, valor: 32.8 }, { p: 70, valor: 34.3 }, { p: 80, valor: 36.2 }, { p: 90, valor: 38.8 }, { p: 95, valor: 41 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 30, edadMax: 34, puntos: [{ p: 5, valor: 21.7 }, { p: 10, valor: 23.6 }, { p: 20, valor: 26.1 }, { p: 30, valor: 27.9 }, { p: 40, valor: 29.4 }, { p: 50, valor: 30.9 }, { p: 60, valor: 32.3 }, { p: 70, valor: 33.9 }, { p: 80, valor: 35.8 }, { p: 90, valor: 38.5 }, { p: 95, valor: 40.7 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 35, edadMax: 39, puntos: [{ p: 5, valor: 21 }, { p: 10, valor: 22.9 }, { p: 20, valor: 25.4 }, { p: 30, valor: 27.2 }, { p: 40, valor: 28.7 }, { p: 50, valor: 30.2 }, { p: 60, valor: 31.6 }, { p: 70, valor: 33.2 }, { p: 80, valor: 35.1 }, { p: 90, valor: 37.8 }, { p: 95, valor: 40 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 40, edadMax: 44, puntos: [{ p: 5, valor: 20.1 }, { p: 10, valor: 22 }, { p: 20, valor: 24.4 }, { p: 30, valor: 26.1 }, { p: 40, valor: 27.7 }, { p: 50, valor: 29.1 }, { p: 60, valor: 30.5 }, { p: 70, valor: 32.1 }, { p: 80, valor: 34 }, { p: 90, valor: 36.6 }, { p: 95, valor: 38.7 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 45, edadMax: 49, puntos: [{ p: 5, valor: 19 }, { p: 10, valor: 20.8 }, { p: 20, valor: 23.1 }, { p: 30, valor: 24.8 }, { p: 40, valor: 26.3 }, { p: 50, valor: 27.7 }, { p: 60, valor: 29.1 }, { p: 70, valor: 30.6 }, { p: 80, valor: 32.4 }, { p: 90, valor: 34.9 }, { p: 95, valor: 37 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 50, edadMax: 54, puntos: [{ p: 5, valor: 17.7 }, { p: 10, valor: 19.5 }, { p: 20, valor: 21.7 }, { p: 30, valor: 23.3 }, { p: 40, valor: 24.7 }, { p: 50, valor: 26.1 }, { p: 60, valor: 27.4 }, { p: 70, valor: 28.8 }, { p: 80, valor: 30.5 }, { p: 90, valor: 32.9 }, { p: 95, valor: 34.9 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 55, edadMax: 59, puntos: [{ p: 5, valor: 16.4 }, { p: 10, valor: 18.1 }, { p: 20, valor: 20.2 }, { p: 30, valor: 21.8 }, { p: 40, valor: 23.1 }, { p: 50, valor: 24.4 }, { p: 60, valor: 25.6 }, { p: 70, valor: 27 }, { p: 80, valor: 28.6 }, { p: 90, valor: 30.9 }, { p: 95, valor: 32.7 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 60, edadMax: 64, puntos: [{ p: 5, valor: 15.2 }, { p: 10, valor: 16.8 }, { p: 20, valor: 18.8 }, { p: 30, valor: 20.2 }, { p: 40, valor: 21.5 }, { p: 50, valor: 22.7 }, { p: 60, valor: 23.9 }, { p: 70, valor: 25.2 }, { p: 80, valor: 26.7 }, { p: 90, valor: 28.8 }] },
  { prueba: 'P-04', sexo: 'F', edadMin: 65, edadMax: 69, puntos: [{ p: 5, valor: 14.1 }, { p: 10, valor: 15.6 }, { p: 20, valor: 17.4 }, { p: 30, valor: 18.8 }, { p: 40, valor: 20 }, { p: 50, valor: 21.1 }, { p: 60, valor: 22.2 }, { p: 70, valor: 23.4 }, { p: 80, valor: 24.9 }, { p: 90, valor: 26.9 }, { p: 95, valor: 28.5 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 6, edadMax: 7, puntos: [{ p: 5, valor: 9.5 }, { p: 10, valor: 13.2 }, { p: 20, valor: 17.5 }, { p: 30, valor: 20.4 }, { p: 40, valor: 22.8 }, { p: 50, valor: 24.9 }, { p: 60, valor: 27 }, { p: 70, valor: 29.4 }, { p: 80, valor: 32.4 }, { p: 90, valor: 36.8 }, { p: 95, valor: 40.7 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 8, edadMax: 9, puntos: [{ p: 5, valor: 9 }, { p: 10, valor: 12.3 }, { p: 20, valor: 16.5 }, { p: 30, valor: 19.5 }, { p: 40, valor: 22 }, { p: 50, valor: 24.4 }, { p: 60, valor: 26.8 }, { p: 70, valor: 29.3 }, { p: 80, valor: 32.3 }, { p: 90, valor: 36.4 }, { p: 95, valor: 39.9 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 10, edadMax: 11, puntos: [{ p: 5, valor: 8.8 }, { p: 10, valor: 12 }, { p: 20, valor: 16 }, { p: 30, valor: 19 }, { p: 40, valor: 21.7 }, { p: 50, valor: 24.3 }, { p: 60, valor: 26.8 }, { p: 70, valor: 29.5 }, { p: 80, valor: 32.5 }, { p: 90, valor: 36.4 }, { p: 95, valor: 39.6 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 12, edadMax: 13, puntos: [{ p: 5, valor: 8.8 }, { p: 10, valor: 11.8 }, { p: 20, valor: 15.7 }, { p: 30, valor: 18.8 }, { p: 40, valor: 21.6 }, { p: 50, valor: 24.3 }, { p: 60, valor: 27 }, { p: 70, valor: 29.7 }, { p: 80, valor: 32.7 }, { p: 90, valor: 36.6 }, { p: 95, valor: 39.5 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 14, edadMax: 15, puntos: [{ p: 5, valor: 8.8 }, { p: 10, valor: 11.7 }, { p: 20, valor: 15.6 }, { p: 30, valor: 18.7 }, { p: 40, valor: 21.6 }, { p: 50, valor: 24.4 }, { p: 60, valor: 27.1 }, { p: 70, valor: 29.9 }, { p: 80, valor: 33 }, { p: 90, valor: 36.8 }, { p: 95, valor: 39.6 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 16, edadMax: 17, puntos: [{ p: 5, valor: 8.8 }, { p: 10, valor: 11.7 }, { p: 20, valor: 15.6 }, { p: 30, valor: 18.7 }, { p: 40, valor: 21.6 }, { p: 50, valor: 24.4 }, { p: 60, valor: 27.3 }, { p: 70, valor: 30.1 }, { p: 80, valor: 33.2 }, { p: 90, valor: 37 }, { p: 95, valor: 39.7 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 18, edadMax: 19, puntos: [{ p: 5, valor: 8.8 }, { p: 10, valor: 11.7 }, { p: 20, valor: 15.6 }, { p: 30, valor: 18.7 }, { p: 40, valor: 21.6 }, { p: 50, valor: 24.5 }, { p: 60, valor: 27.4 }, { p: 70, valor: 30.3 }, { p: 80, valor: 33.4 }, { p: 90, valor: 37.1 }, { p: 95, valor: 39.8 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 20, edadMax: 24, puntos: [{ p: 5, valor: 8.9 }, { p: 10, valor: 11.7 }, { p: 20, valor: 15.5 }, { p: 30, valor: 18.7 }, { p: 40, valor: 21.7 }, { p: 50, valor: 24.6 }, { p: 60, valor: 27.5 }, { p: 70, valor: 30.4 }, { p: 80, valor: 33.5 }, { p: 90, valor: 37.2 }, { p: 95, valor: 39.9 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 25, edadMax: 29, puntos: [{ p: 5, valor: 8.8 }, { p: 10, valor: 11.6 }, { p: 20, valor: 15.4 }, { p: 30, valor: 18.6 }, { p: 40, valor: 21.6 }, { p: 50, valor: 24.5 }, { p: 60, valor: 27.4 }, { p: 70, valor: 30.3 }, { p: 80, valor: 33.4 }, { p: 90, valor: 37.1 }, { p: 95, valor: 39.7 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 30, edadMax: 34, puntos: [{ p: 5, valor: 8.7 }, { p: 10, valor: 11.5 }, { p: 20, valor: 15.3 }, { p: 30, valor: 18.4 }, { p: 40, valor: 21.3 }, { p: 50, valor: 24.2 }, { p: 60, valor: 27 }, { p: 70, valor: 29.9 }, { p: 80, valor: 32.9 }, { p: 90, valor: 36.6 }, { p: 95, valor: 39.3 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 35, edadMax: 39, puntos: [{ p: 5, valor: 8.6 }, { p: 10, valor: 11.3 }, { p: 20, valor: 15.1 }, { p: 30, valor: 18.2 }, { p: 40, valor: 21 }, { p: 50, valor: 23.8 }, { p: 60, valor: 26.5 }, { p: 70, valor: 29.3 }, { p: 80, valor: 32.3 }, { p: 90, valor: 36 }, { p: 95, valor: 38.6 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 40, edadMax: 44, puntos: [{ p: 5, valor: 8.4 }, { p: 10, valor: 11.1 }, { p: 20, valor: 14.9 }, { p: 30, valor: 17.8 }, { p: 40, valor: 20.6 }, { p: 50, valor: 23.3 }, { p: 60, valor: 25.9 }, { p: 70, valor: 28.6 }, { p: 80, valor: 31.6 }, { p: 90, valor: 35.2 }, { p: 95, valor: 37.8 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 45, edadMax: 49, puntos: [{ p: 5, valor: 8.2 }, { p: 10, valor: 10.9 }, { p: 20, valor: 14.6 }, { p: 30, valor: 17.5 }, { p: 40, valor: 20.1 }, { p: 50, valor: 22.7 }, { p: 60, valor: 25.3 }, { p: 70, valor: 27.9 }, { p: 80, valor: 30.7 }, { p: 90, valor: 34.3 }, { p: 95, valor: 36.9 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 50, edadMax: 54, puntos: [{ p: 5, valor: 8 }, { p: 10, valor: 10.7 }, { p: 20, valor: 14.3 }, { p: 30, valor: 17.1 }, { p: 40, valor: 19.7 }, { p: 50, valor: 22.1 }, { p: 60, valor: 24.6 }, { p: 70, valor: 27.1 }, { p: 80, valor: 29.8 }, { p: 90, valor: 33.4 }, { p: 95, valor: 36 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 55, edadMax: 59, puntos: [{ p: 5, valor: 7.8 }, { p: 10, valor: 10.5 }, { p: 20, valor: 14 }, { p: 30, valor: 16.7 }, { p: 40, valor: 19.2 }, { p: 50, valor: 21.5 }, { p: 60, valor: 23.9 }, { p: 70, valor: 26.3 }, { p: 80, valor: 28.9 }, { p: 90, valor: 32.4 }, { p: 95, valor: 35.1 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 60, edadMax: 64, puntos: [{ p: 5, valor: 7.6 }, { p: 10, valor: 10.3 }, { p: 20, valor: 13.7 }, { p: 30, valor: 16.4 }, { p: 40, valor: 18.7 }, { p: 50, valor: 20.9 }, { p: 60, valor: 23.1 }, { p: 70, valor: 25.5 }, { p: 80, valor: 28 }, { p: 90, valor: 31.4 }, { p: 95, valor: 34.1 }] },
  { prueba: 'P-06', sexo: 'M', edadMin: 65, edadMax: 69, puntos: [{ p: 5, valor: 7.4 }, { p: 10, valor: 10.1 }, { p: 20, valor: 13.4 }, { p: 30, valor: 16 }, { p: 40, valor: 18.2 }, { p: 50, valor: 20.3 }, { p: 60, valor: 22.4 }, { p: 70, valor: 24.6 }, { p: 80, valor: 27.1 }, { p: 90, valor: 30.5 }, { p: 95, valor: 33.1 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 6, edadMax: 7, puntos: [{ p: 5, valor: 15.1 }, { p: 10, valor: 19.3 }, { p: 20, valor: 23.8 }, { p: 30, valor: 26.7 }, { p: 40, valor: 29 }, { p: 50, valor: 30.9 }, { p: 60, valor: 32.8 }, { p: 70, valor: 35 }, { p: 80, valor: 37.6 }, { p: 90, valor: 41.6 }, { p: 95, valor: 45.1 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 8, edadMax: 9, puntos: [{ p: 5, valor: 15 }, { p: 10, valor: 19.2 }, { p: 20, valor: 23.7 }, { p: 30, valor: 26.6 }, { p: 40, valor: 28.9 }, { p: 50, valor: 30.9 }, { p: 60, valor: 32.9 }, { p: 70, valor: 35.1 }, { p: 80, valor: 37.8 }, { p: 90, valor: 41.7 }, { p: 95, valor: 45.2 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 10, edadMax: 11, puntos: [{ p: 5, valor: 14.9 }, { p: 10, valor: 19.1 }, { p: 20, valor: 23.6 }, { p: 30, valor: 26.6 }, { p: 40, valor: 28.9 }, { p: 50, valor: 31 }, { p: 60, valor: 33 }, { p: 70, valor: 35.2 }, { p: 80, valor: 37.9 }, { p: 90, valor: 41.9 }, { p: 95, valor: 45.3 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 12, edadMax: 13, puntos: [{ p: 5, valor: 14.9 }, { p: 10, valor: 18.9 }, { p: 20, valor: 23.5 }, { p: 30, valor: 26.5 }, { p: 40, valor: 28.9 }, { p: 50, valor: 31 }, { p: 60, valor: 33.1 }, { p: 70, valor: 35.3 }, { p: 80, valor: 38.1 }, { p: 90, valor: 42 }, { p: 95, valor: 45.3 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 14, edadMax: 15, puntos: [{ p: 5, valor: 14.8 }, { p: 10, valor: 18.8 }, { p: 20, valor: 23.4 }, { p: 30, valor: 26.4 }, { p: 40, valor: 28.9 }, { p: 50, valor: 31 }, { p: 60, valor: 33.1 }, { p: 70, valor: 35.5 }, { p: 80, valor: 38.2 }, { p: 90, valor: 42.1 }, { p: 95, valor: 45.4 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 16, edadMax: 17, puntos: [{ p: 5, valor: 14.7 }, { p: 10, valor: 18.7 }, { p: 20, valor: 23.3 }, { p: 30, valor: 26.4 }, { p: 40, valor: 28.8 }, { p: 50, valor: 31.1 }, { p: 60, valor: 33.2 }, { p: 70, valor: 35.6 }, { p: 80, valor: 38.4 }, { p: 90, valor: 42.3 }, { p: 95, valor: 45.5 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 18, edadMax: 19, puntos: [{ p: 5, valor: 14.6 }, { p: 10, valor: 18.6 }, { p: 20, valor: 23.1 }, { p: 30, valor: 26.3 }, { p: 40, valor: 28.8 }, { p: 50, valor: 31.1 }, { p: 60, valor: 33.3 }, { p: 70, valor: 35.7 }, { p: 80, valor: 38.5 }, { p: 90, valor: 42.4 }, { p: 95, valor: 45.6 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 20, edadMax: 24, puntos: [{ p: 5, valor: 14.4 }, { p: 10, valor: 18.3 }, { p: 20, valor: 22.9 }, { p: 30, valor: 26.1 }, { p: 40, valor: 28.7 }, { p: 50, valor: 31.1 }, { p: 60, valor: 33.5 }, { p: 70, valor: 36 }, { p: 80, valor: 38.8 }, { p: 90, valor: 42.6 }, { p: 95, valor: 45.7 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 25, edadMax: 29, puntos: [{ p: 5, valor: 14.1 }, { p: 10, valor: 17.9 }, { p: 20, valor: 22.5 }, { p: 30, valor: 25.8 }, { p: 40, valor: 28.5 }, { p: 50, valor: 31.1 }, { p: 60, valor: 33.7 }, { p: 70, valor: 36.2 }, { p: 80, valor: 39.1 }, { p: 90, valor: 42.9 }, { p: 95, valor: 45.8 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 30, edadMax: 34, puntos: [{ p: 5, valor: 13.8 }, { p: 10, valor: 17.5 }, { p: 20, valor: 22 }, { p: 30, valor: 25.4 }, { p: 40, valor: 28.3 }, { p: 50, valor: 31 }, { p: 60, valor: 33.7 }, { p: 70, valor: 36.4 }, { p: 80, valor: 39.3 }, { p: 90, valor: 43 }, { p: 95, valor: 45.7 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 35, edadMax: 39, puntos: [{ p: 5, valor: 13.5 }, { p: 10, valor: 17 }, { p: 20, valor: 21.4 }, { p: 30, valor: 24.8 }, { p: 40, valor: 27.8 }, { p: 50, valor: 30.7 }, { p: 60, valor: 33.5 }, { p: 70, valor: 36.2 }, { p: 80, valor: 39.2 }, { p: 90, valor: 42.8 }, { p: 95, valor: 45.4 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 40, edadMax: 44, puntos: [{ p: 5, valor: 13 }, { p: 10, valor: 16.4 }, { p: 20, valor: 20.8 }, { p: 30, valor: 24.2 }, { p: 40, valor: 27.3 }, { p: 50, valor: 30.2 }, { p: 60, valor: 33.1 }, { p: 70, valor: 35.9 }, { p: 80, valor: 38.8 }, { p: 90, valor: 42.3 }, { p: 95, valor: 44.8 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 45, edadMax: 49, puntos: [{ p: 5, valor: 12.5 }, { p: 10, valor: 15.8 }, { p: 20, valor: 20.1 }, { p: 30, valor: 23.5 }, { p: 40, valor: 26.6 }, { p: 50, valor: 29.6 }, { p: 60, valor: 32.5 }, { p: 70, valor: 35.4 }, { p: 80, valor: 38.3 }, { p: 90, valor: 41.7 }, { p: 95, valor: 44.1 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 50, edadMax: 54, puntos: [{ p: 5, valor: 12 }, { p: 10, valor: 15.3 }, { p: 20, valor: 19.6 }, { p: 30, valor: 23 }, { p: 40, valor: 26.1 }, { p: 50, valor: 29.1 }, { p: 60, valor: 32 }, { p: 70, valor: 34.9 }, { p: 80, valor: 37.8 }, { p: 90, valor: 41.1 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 55, edadMax: 59, puntos: [{ p: 5, valor: 11.6 }, { p: 10, valor: 14.9 }, { p: 20, valor: 19.2 }, { p: 30, valor: 22.6 }, { p: 40, valor: 25.8 }, { p: 50, valor: 28.8 }, { p: 60, valor: 31.7 }, { p: 70, valor: 34.6 }, { p: 80, valor: 37.5 }, { p: 90, valor: 40.9 }, { p: 95, valor: 43.2 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 60, edadMax: 64, puntos: [{ p: 5, valor: 11.3 }, { p: 10, valor: 14.7 }, { p: 20, valor: 19.1 }, { p: 30, valor: 22.5 }, { p: 40, valor: 25.7 }, { p: 50, valor: 28.8 }, { p: 60, valor: 31.7 }, { p: 70, valor: 34.6 }, { p: 80, valor: 37.6 }, { p: 90, valor: 41 }, { p: 95, valor: 43.4 }] },
  { prueba: 'P-06', sexo: 'F', edadMin: 65, edadMax: 69, puntos: [{ p: 5, valor: 11.1 }, { p: 10, valor: 14.5 }, { p: 20, valor: 19 }, { p: 30, valor: 22.6 }, { p: 40, valor: 25.8 }, { p: 50, valor: 28.9 }, { p: 60, valor: 31.8 }, { p: 70, valor: 34.7 }, { p: 80, valor: 37.7 }, { p: 90, valor: 41.3 }, { p: 95, valor: 43.8 }] },
];
