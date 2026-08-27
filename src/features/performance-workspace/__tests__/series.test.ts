// ── La evolución de cada prueba (Sprint PAS-14) ────────────────────────────
//
// LO QUE ESTOS TESTS PROTEGEN, Y ES UNO SOLO EN EL FONDO:
//
//   QUE EL GRÁFICO NO MIENTA. Ante cuatro valores de 1RM del mismo día —100,
//   120, 150 y 50 kg— la tentación es elegir uno (el mayor, el último, la
//   media) y dibujar una línea limpia. Sería mentir con un gráfico, que es la
//   peor forma de mentir: una línea ascendente convence sin que nadie la mire
//   con cuidado.
//
//   Así que ese punto no tiene representante y la línea se rompe ahí. El hueco
//   ES la información.

import { describe, expect, it } from 'vitest';

import { seriesPorPrueba, valorDe, type MedicionSerie } from '../services/series';

const m = (pruebaId: string, fecha: string, valor: number, unidad = 'kg'): MedicionSerie => ({
  pruebaId,
  fecha,
  valor,
  unidad,
});

describe('agrupación', () => {
  it('una serie por prueba, ordenada por fecha', () => {
    const series = seriesPorPrueba([
      m('P-01', '2026-08-20', 120),
      m('P-03', '2026-08-13', 44),
      m('P-01', '2026-08-15', 100),
    ]);

    expect(series.map((s) => s.pruebaId)).toEqual(['P-01', 'P-03']);
    expect(series[0].puntos.map((p) => p.fecha)).toEqual(['2026-08-15', '2026-08-20']);
  });

  it('conserva la unidad de la prueba', () => {
    const [s] = seriesPorPrueba([m('P-04', '2026-08-15', 22, 'cm')]);
    expect(s.unidad).toBe('cm');
  });

  it('una prueba con una sola medición SÍ aparece', () => {
    // «No ha cambiado» y «todavía no hay con qué compararlo» son cosas
    // distintas, y omitir la serie borraría la segunda.
    const [s] = seriesPorPrueba([m('P-02', '2026-08-15', 25)]);
    expect(s.puntos).toHaveLength(1);
    expect(s.bloqueo).toBeNull();
  });
});

describe('cuando una fecha tiene varios valores', () => {
  // El caso real: cuatro 1RM el 15 de agosto.
  const series = seriesPorPrueba([
    m('P-01', '2026-08-15', 100),
    m('P-01', '2026-08-15', 120),
    m('P-01', '2026-08-15', 150),
    m('P-01', '2026-08-15', 50),
    m('P-01', '2026-08-20', 120),
  ]);
  const [p01] = series;

  it('los agrupa en UN punto, no en cuatro', () => {
    expect(p01.puntos).toHaveLength(2);
    expect(p01.puntos[0].valores).toHaveLength(4);
  });

  it('lo marca ambiguo', () => {
    expect(p01.puntos[0].ambiguo).toBe(true);
    expect(p01.puntos[1].ambiguo).toBe(false);
  });

  it('EL PUNTO AMBIGUO NO TIENE REPRESENTANTE', () => {
    // La comprobación que impide el gráfico mentiroso: no se elige el mayor,
    // ni el último, ni la media. No hay valor, y por eso la línea se rompe.
    expect(valorDe(p01.puntos[0])).toBeNull();
    expect(valorDe(p01.puntos[1])).toBe(120);
  });

  it('conserva TODOS los valores, para poder dibujarlos', () => {
    expect([...p01.puntos[0].valores].sort((a, b) => a - b)).toEqual([50, 100, 120, 150]);
  });

  it('dos registros del MISMO valor no son ambiguos', () => {
    // Es un duplicado exacto: se reporta en otro sitio y no impide leer la
    // evolución, porque no hay nada que elegir.
    const [s] = seriesPorPrueba([
      m('P-04', '2026-08-15', 22, 'cm'),
      m('P-04', '2026-08-15', 22, 'cm'),
      m('P-04', '2026-08-20', 24, 'cm'),
    ]);
    expect(s.puntos[0].ambiguo).toBe(false);
    expect(valorDe(s.puntos[0])).toBe(22);
  });
});

describe('unidades distintas', () => {
  it('no se dibuja la serie, y se dice por qué', () => {
    // El sistema no convierte entre unidades (regla de comparabilidad). Una
    // línea que mezclara escalas afirmaría algo que nadie comprobó.
    const [s] = seriesPorPrueba([
      m('P-01', '2026-08-15', 120, 'kg'),
      m('P-01', '2026-08-20', 2.1, 'ratio_peso'),
    ]);

    expect(s.puntos).toEqual([]);
    expect(s.bloqueo).toContain('kg y ratio_peso');
    expect(s.bloqueo).toContain('no convierte');
  });

  it('CONTROL POSITIVO · con una sola unidad sí se dibuja', () => {
    const [s] = seriesPorPrueba([m('P-01', '2026-08-15', 120), m('P-01', '2026-08-20', 125)]);
    expect(s.bloqueo).toBeNull();
    expect(s.puntos).toHaveLength(2);
  });
});

describe('lo que NO hace', () => {
  it('no dice si subir es mejorar', () => {
    // En 1RM subir es mejorar; en un tiempo de sprint es empeorar. La serie
    // solo ordena valores por fecha: interpretar la dirección es del lector,
    // y el sistema no sabe hacerlo para todas las pruebas del catálogo.
    const [s] = seriesPorPrueba([m('P-01', '2026-08-15', 150), m('P-01', '2026-08-20', 100)]);
    expect(Object.keys(s)).toEqual(['pruebaId', 'unidad', 'puntos', 'bloqueo']);
  });

  it('no inventa puntos entre fechas', () => {
    const [s] = seriesPorPrueba([m('P-01', '2026-01-01', 100), m('P-01', '2026-12-31', 120)]);
    expect(s.puntos).toHaveLength(2);
  });
});
