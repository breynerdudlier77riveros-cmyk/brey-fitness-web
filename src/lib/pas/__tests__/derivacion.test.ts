import { describe, expect, it } from 'vitest';
import { analizarRendimiento } from '../index';
import type { CapacidadId, EstadoCapacidad, PerformanceAnalysis } from '../index';
import { HOY, catalogo, contrib, evaluacion, prueba, registro } from './fixtures';
import type { CatalogoPruebas, EvaluacionPAS } from '../index';

// ── Derivación del Estado de Capacidad (Sprint PAS-2.0) ────────────────────

function analizar(evaluaciones: EvaluacionPAS[], cat: CatalogoPruebas): PerformanceAnalysis {
  return analizarRendimiento({ atletaId: 'atleta-1', evaluaciones, catalogo: cat, hoyISO: HOY });
}

function estado(analisis: PerformanceAnalysis, id: CapacidadId): EstadoCapacidad {
  const encontrado = analisis.capacidades.find((c) => c.capacidad === id);
  if (!encontrado) throw new Error(`falta ${id}`);
  return encontrado;
}

const CON_CORRESPONDENCIA = catalogo([
  prueba({ id: 'p1', contribuciones: [contrib('A-01')] }),
]);

describe('las 20 capacidades siempre están', () => {
  it('sin evaluaciones', () => {
    expect(analizar([], catalogo([])).capacidades).toHaveLength(20);
  });

  it('con datos', () => {
    const analisis = analizar(
      [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })],
      CON_CORRESPONDENCIA
    );
    expect(analisis.capacidades).toHaveLength(20);
  });

  it('en el orden del catálogo', () => {
    const ids = analizar([], catalogo([])).capacidades.map((c) => c.capacidad);
    expect(ids[0]).toBe('A-01');
    expect(ids[19]).toBe('F-02');
  });

  it('cada una lleva su dominio y su nombre', () => {
    const a01 = estado(analizar([], catalogo([])), 'A-01');
    expect(a01.dominio).toBe('A');
    expect(a01.nombre).toBe('Fuerza máxima');
  });
});

describe('estado · desconocida', () => {
  it('sin evaluaciones', () => {
    expect(estado(analizar([], catalogo([])), 'A-01').estado).toBe('desconocida');
  });

  it('con catálogo vacío pese a haber registros', () => {
    const analisis = analizar(
      [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })],
      catalogo([])
    );
    expect(analisis.capacidades.every((c) => c.estado === 'desconocida')).toBe(true);
  });

  it('cuando la prueba no declara correspondencia con esa capacidad', () => {
    const analisis = analizar(
      [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })],
      CON_CORRESPONDENCIA
    );
    expect(estado(analisis, 'C-01').estado).toBe('desconocida');
  });

  it('cuando la correspondencia carece de referencia', () => {
    const cat = catalogo([
      prueba({ id: 'p1', contribuciones: [contrib('A-01', { referencia: null })] }),
    ]);
    const analisis = analizar(
      [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })],
      cat
    );
    expect(estado(analisis, 'A-01').estado).toBe('desconocida');
  });

  it('cuando todos los registros están anulados', () => {
    const analisis = analizar(
      [
        evaluacion({
          id: 'ev1',
          registros: [registro({ id: 'r1', pruebaId: 'p1', estado: 'anulada' })],
        }),
      ],
      CON_CORRESPONDENCIA
    );
    expect(estado(analisis, 'A-01').estado).toBe('desconocida');
  });

  it('pero la anulación queda registrada en la traza', () => {
    const analisis = analizar(
      [
        evaluacion({
          id: 'ev1',
          registros: [registro({ id: 'r1', pruebaId: 'p1', estado: 'anulada' })],
        }),
      ],
      CON_CORRESPONDENCIA
    );
    expect(estado(analisis, 'A-01').traza.excluidos[0].motivo).toBe('EL-01_anulado');
  });

  it('nunca se estima desde otra capacidad', () => {
    const cat = catalogo([
      prueba({ id: 'p1', contribuciones: [contrib('A-01'), contrib('A-02')] }),
    ]);
    const analisis = analizar(
      [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })],
      cat
    );
    expect(estado(analisis, 'A-01').estado).toBe('evaluada');
    expect(estado(analisis, 'A-03').estado).toBe('desconocida');
  });
});

describe('estado · evaluada', () => {
  const analisis = analizar(
    [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })],
    CON_CORRESPONDENCIA
  );

  it('con un registro elegible', () => {
    expect(estado(analisis, 'A-01').estado).toBe('evaluada');
  });

  it('cuenta los registros elegibles', () => {
    expect(estado(analisis, 'A-01').registrosElegibles).toBe(1);
  });

  it('declara la fecha del registro más reciente', () => {
    expect(estado(analisis, 'A-01').ultimaFecha).toBe(HOY);
  });

  it('una prueba puede alimentar varias capacidades a la vez', () => {
    const cat = catalogo([
      prueba({ id: 'p1', contribuciones: [contrib('A-01'), contrib('A-03')] }),
    ]);
    const otro = analizar(
      [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })],
      cat
    );
    expect(estado(otro, 'A-01').estado).toBe('evaluada');
    expect(estado(otro, 'A-03').estado).toBe('evaluada');
  });

  it('varias pruebas pueden alimentar una capacidad', () => {
    const cat = catalogo([
      prueba({ id: 'p1', contribuciones: [contrib('A-01')] }),
      prueba({ id: 'p2', contribuciones: [contrib('A-01')] }),
    ]);
    const otro = analizar(
      [
        evaluacion({
          id: 'ev1',
          registros: [
            registro({ id: 'r1', pruebaId: 'p1' }),
            registro({ id: 'r2', pruebaId: 'p2' }),
          ],
        }),
      ],
      cat
    );
    expect(estado(otro, 'A-01').registrosElegibles).toBe(2);
  });

  it('toma la fecha más reciente entre varios registros', () => {
    const otro = analizar(
      [
        evaluacion({
          id: 'ev1',
          fecha: '2026-01-01',
          registros: [
            registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-06-01' }),
            registro({ id: 'r2', pruebaId: 'p1', fecha: '2026-07-20' }),
          ],
        }),
      ],
      CON_CORRESPONDENCIA
    );
    expect(estado(otro, 'A-01').ultimaFecha).toBe('2026-07-20');
  });
});

describe('estado · desactualizada', () => {
  const caducado = catalogo([
    prueba({ id: 'p1', vigenciaDias: 30, contribuciones: [contrib('A-01')] }),
  ]);
  const analisis = analizar(
    [
      evaluacion({
        id: 'ev1',
        fecha: '2026-01-01',
        registros: [registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-01-01' })],
      }),
    ],
    caducado
  );

  it('cuando el único registro caducó', () => {
    expect(estado(analisis, 'A-01').estado).toBe('desactualizada');
  });

  it('no queda ningún registro elegible', () => {
    expect(estado(analisis, 'A-01').registrosElegibles).toBe(0);
    expect(estado(analisis, 'A-01').ultimaFecha).toBeNull();
  });

  it('la traza declara el motivo', () => {
    expect(estado(analisis, 'A-01').traza.excluidos[0].motivo).toBe('EL-02_fuera_de_vigencia');
  });

  it('un registro anulado y caducado es desconocida, no desactualizada', () => {
    const otro = analizar(
      [
        evaluacion({
          id: 'ev1',
          fecha: '2026-01-01',
          registros: [
            registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-01-01', estado: 'anulada' }),
          ],
        }),
      ],
      caducado
    );
    expect(estado(otro, 'A-01').estado).toBe('desconocida');
  });

  it('basta un registro vigente para que deje de estar desactualizada', () => {
    const otro = analizar(
      [
        evaluacion({
          id: 'ev1',
          fecha: '2026-01-01',
          registros: [
            registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-01-01' }),
            registro({ id: 'r2', pruebaId: 'p1', fecha: HOY }),
          ],
        }),
      ],
      caducado
    );
    expect(estado(otro, 'A-01').estado).toBe('evaluada');
  });
});

describe('estado · en conflicto', () => {
  const analisis = analizar(
    [
      evaluacion({
        id: 'ev1',
        registros: [
          registro({ id: 'r1', pruebaId: 'p1' }),
          registro({
            id: 'r2',
            pruebaId: 'p1',
            valor: { tipo: 'continuo', valor: 200, unidad: 'kg' },
          }),
        ],
      }),
    ],
    CON_CORRESPONDENCIA
  );

  it('dos resultados incompatibles del mismo día', () => {
    expect(estado(analisis, 'A-01').estado).toBe('en_conflicto');
  });

  it('conserva ambos registros: no elige ninguno', () => {
    expect(estado(analisis, 'A-01').traza.incluidos).toEqual(['r1', 'r2']);
  });

  it('el conflicto pesa más que la cobertura', () => {
    const cat = catalogo(
      [prueba({ id: 'p1', contribuciones: [contrib('A-01')] })],
      { cobertura: [{ capacidad: 'A-01', pruebasRequeridas: ['p1', 'p2'] }] }
    );
    const otro = analizar(
      [
        evaluacion({
          id: 'ev1',
          registros: [
            registro({ id: 'r1', pruebaId: 'p1' }),
            registro({
              id: 'r2',
              pruebaId: 'p1',
              valor: { tipo: 'continuo', valor: 7, unidad: 'kg' },
            }),
          ],
        }),
      ],
      cat
    );
    expect(estado(otro, 'A-01').estado).toBe('en_conflicto');
  });

  it('un duplicado exacto no es conflicto de capacidad', () => {
    const otro = analizar(
      [
        evaluacion({
          id: 'ev1',
          registros: [
            registro({ id: 'r1', pruebaId: 'p1' }),
            registro({ id: 'r2', pruebaId: 'p1' }),
          ],
        }),
      ],
      CON_CORRESPONDENCIA
    );
    expect(estado(otro, 'A-01').estado).toBe('evaluada');
  });
});

describe('estado · parcialmente evaluada', () => {
  const cat = catalogo(
    [
      prueba({ id: 'p1', contribuciones: [contrib('A-01')] }),
      prueba({ id: 'p2', contribuciones: [contrib('A-01')] }),
    ],
    { cobertura: [{ capacidad: 'A-01', pruebasRequeridas: ['p1', 'p2'] }] }
  );

  it('cuando falta una prueba de la cobertura declarada', () => {
    const analisis = analizar(
      [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })],
      cat
    );
    expect(estado(analisis, 'A-01').estado).toBe('parcialmente_evaluada');
  });

  it('con la cobertura completa pasa a evaluada', () => {
    const analisis = analizar(
      [
        evaluacion({
          id: 'ev1',
          registros: [
            registro({ id: 'r1', pruebaId: 'p1' }),
            registro({ id: 'r2', pruebaId: 'p2' }),
          ],
        }),
      ],
      cat
    );
    expect(estado(analisis, 'A-01').estado).toBe('evaluada');
  });

  it('sin cobertura declarada no se supone que falte nada', () => {
    const analisis = analizar(
      [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })],
      CON_CORRESPONDENCIA
    );
    expect(estado(analisis, 'A-01').estado).toBe('evaluada');
  });

  it('una cobertura declarada vacía no exige nada', () => {
    const vacia = catalogo([prueba({ id: 'p1', contribuciones: [contrib('A-01')] })], {
      cobertura: [{ capacidad: 'A-01', pruebasRequeridas: [] }],
    });
    const analisis = analizar(
      [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })],
      vacia
    );
    expect(estado(analisis, 'A-01').estado).toBe('evaluada');
  });
});

describe('capacidades reservadas', () => {
  const cat = catalogo([prueba({ id: 'p1', contribuciones: [contrib('F-01')] })]);
  const analisis = analizar(
    [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })],
    cat
  );

  it('F-01 y F-02 nunca se evalúan', () => {
    expect(estado(analisis, 'F-01').estado).toBe('desconocida');
    expect(estado(analisis, 'F-02').estado).toBe('desconocida');
  });

  it('el registro que pretendía alimentarla queda excluido con su motivo', () => {
    expect(estado(analisis, 'F-01').traza.excluidos[0].motivo).toBe('capacidad_reservada');
  });

  it('una reservada sin correspondencia no acumula exclusiones ajenas', () => {
    expect(estado(analisis, 'F-02').traza.excluidos).toEqual([]);
  });
});

describe('traza', () => {
  const cat = catalogo([
    prueba({ id: 'p1', contribuciones: [contrib('A-01', { peso: 0.7, referencia: 'ckb_x' })] }),
    prueba({ id: 'p2' }),
  ]);
  const analisis = analizar(
    [
      evaluacion({
        id: 'ev1',
        registros: [
          registro({ id: 'r1', pruebaId: 'p1' }),
          registro({ id: 'r9', pruebaId: 'p2' }),
        ],
      }),
    ],
    cat
  );

  it('toda capacidad tiene traza, incluso desconocida', () => {
    expect(analisis.capacidades.every((c) => c.traza !== undefined)).toBe(true);
  });

  it('la traza declara la capacidad que justifica', () => {
    expect(estado(analisis, 'A-01').traza.capacidad).toBe('A-01');
  });

  it('registra la correspondencia aplicada con su referencia y su peso', () => {
    expect(estado(analisis, 'A-01').traza.correspondencias).toEqual([
      { pruebaId: 'p1', referencia: 'ckb_x', peso: 0.7 },
    ]);
  });

  it('no lista registros de pruebas que no la alimentan', () => {
    const traza = estado(analisis, 'A-01').traza;
    expect(traza.incluidos).not.toContain('r9');
    expect(traza.excluidos.map((e) => e.registroId)).not.toContain('r9');
  });

  it('lleva las tres coordenadas de versión', () => {
    const coords = estado(analisis, 'A-01').traza.coordenadas;
    expect(coords.motor).toBe('pae-1.0.0');
    expect(coords.catalogo).toBe('cat-1');
    expect(coords.calculadoEn).toBe(HOY);
  });

  it('ordena los incluidos con independencia del orden de entrada', () => {
    const cat2 = catalogo([prueba({ id: 'p1', contribuciones: [contrib('A-01')] })]);
    const otro = analizar(
      [
        evaluacion({
          id: 'ev1',
          registros: [
            registro({ id: 'rz', pruebaId: 'p1' }),
            registro({ id: 'ra', pruebaId: 'p1' }),
          ],
        }),
      ],
      cat2
    );
    expect(estado(otro, 'A-01').traza.incluidos).toEqual(['ra', 'rz']);
  });

  it('no repite la correspondencia cuando hay varios registros de la misma prueba', () => {
    const otro = analizar(
      [
        evaluacion({
          id: 'ev1',
          registros: [
            registro({ id: 'r1', pruebaId: 'p1' }),
            registro({ id: 'r2', pruebaId: 'p1', fecha: '2026-07-01' }),
          ],
        }),
      ],
      cat
    );
    expect(estado(otro, 'A-01').traza.correspondencias).toHaveLength(1);
  });
});
