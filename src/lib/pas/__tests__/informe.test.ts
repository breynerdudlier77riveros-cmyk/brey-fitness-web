import { describe, expect, it } from 'vitest';
import { analizarRendimiento, evaluarConsistencia, VERSION_MOTOR } from '../index';
import type {
  CatalogoPruebas,
  EvaluacionPAS,
  Hallazgo,
  Limitacion,
  PerformanceAnalysis,
  TipoHallazgo,
  TipoLimitacion,
} from '../index';
import { HOY, catalogo, contrib, evaluacion, prueba, registro } from './fixtures';

// ── Hallazgos, consistencia y limitaciones (Sprint PAS-2.0) ────────────────

function analizar(evaluaciones: EvaluacionPAS[], cat: CatalogoPruebas): PerformanceAnalysis {
  return analizarRendimiento({ atletaId: 'atleta-1', evaluaciones, catalogo: cat, hoyISO: HOY });
}

function tiposH(hallazgos: readonly Hallazgo[]): TipoHallazgo[] {
  return hallazgos.map((h) => h.tipo);
}

function tiposL(limitaciones: readonly Limitacion[]): TipoLimitacion[] {
  return limitaciones.map((l) => l.tipo);
}

const CAT = catalogo([prueba({ id: 'p1', contribuciones: [contrib('A-01')] })]);
const UN_REGISTRO = [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })];

describe('hallazgos · uno por capacidad activa', () => {
  const analisis = analizar(UN_REGISTRO, CAT);

  it('la capacidad evaluada produce evidencia_suficiente', () => {
    const hallazgo = analisis.hallazgos.find((h) => h.capacidad === 'A-01' && h.tipo === 'evidencia_suficiente');
    expect(hallazgo).toBeDefined();
  });

  it('las capacidades sin datos producen sin_evidencia', () => {
    const sinEvidencia = analisis.hallazgos.filter((h) => h.tipo === 'sin_evidencia');
    expect(sinEvidencia).toHaveLength(17);
  });

  it('las reservadas producen resultado_pendiente y no sin_evidencia', () => {
    const pendientes = analisis.hallazgos.filter((h) => h.tipo === 'resultado_pendiente');
    expect(pendientes.map((h) => h.capacidad).sort()).toEqual(['F-01', 'F-02']);
    expect(analisis.hallazgos.some((h) => h.capacidad === 'F-01' && h.tipo === 'sin_evidencia')).toBe(false);
  });
});

describe('hallazgos · por tipo', () => {
  it('cobertura_parcial', () => {
    const cat = catalogo(
      [
        prueba({ id: 'p1', contribuciones: [contrib('A-01')] }),
        prueba({ id: 'p2', contribuciones: [contrib('A-01')] }),
      ],
      { cobertura: [{ capacidad: 'A-01', pruebasRequeridas: ['p1', 'p2'] }] }
    );
    expect(tiposH(analizar(UN_REGISTRO, cat).hallazgos)).toContain('cobertura_parcial');
  });

  it('resultado_obsoleto', () => {
    const cat = catalogo([
      prueba({ id: 'p1', vigenciaDias: 10, contribuciones: [contrib('A-01')] }),
    ]);
    const evs = [
      evaluacion({
        id: 'ev1',
        fecha: '2026-01-01',
        registros: [registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-01-01' })],
      }),
    ];
    const hallazgo = analizar(evs, cat).hallazgos.find((h) => h.tipo === 'resultado_obsoleto');
    expect(hallazgo?.registros).toEqual(['r1']);
  });

  it('resultado_conflictivo', () => {
    const evs = [
      evaluacion({
        id: 'ev1',
        registros: [
          registro({ id: 'r1', pruebaId: 'p1' }),
          registro({ id: 'r2', pruebaId: 'p1', valor: { tipo: 'continuo', valor: 9, unidad: 'kg' } }),
        ],
      }),
    ];
    expect(tiposH(analizar(evs, CAT).hallazgos)).toContain('resultado_conflictivo');
  });

  it('evidencia_insuficiente cuando hubo candidatos y ninguno sirvió', () => {
    const evs = [
      evaluacion({
        id: 'ev1',
        registros: [registro({ id: 'r1', pruebaId: 'p1', estado: 'anulada' })],
      }),
    ];
    expect(tiposH(analizar(evs, CAT).hallazgos)).toContain('evidencia_insuficiente');
  });

  it('registro_anulado_presente', () => {
    const evs = [
      evaluacion({
        id: 'ev1',
        registros: [registro({ id: 'r1', pruebaId: 'p1', estado: 'anulada' })],
      }),
    ];
    const hallazgo = analizar(evs, CAT).hallazgos.find((h) => h.tipo === 'registro_anulado_presente');
    expect(hallazgo?.registros).toEqual(['r1']);
  });

  it('sin anulados no aparece ese hallazgo', () => {
    expect(tiposH(analizar(UN_REGISTRO, CAT).hallazgos)).not.toContain('registro_anulado_presente');
  });

  it('resultado_repetido ante un duplicado exacto', () => {
    const evs = [
      evaluacion({
        id: 'ev1',
        registros: [registro({ id: 'r1', pruebaId: 'p1' }), registro({ id: 'r2', pruebaId: 'p1' })],
      }),
    ];
    const hallazgo = analizar(evs, CAT).hallazgos.find((h) => h.tipo === 'resultado_repetido');
    expect(hallazgo?.registros).toEqual(['r1', 'r2']);
  });

  it('registro_excluido con el motivo en la clave', () => {
    const evs = [
      evaluacion({
        id: 'ev1',
        registros: [registro({ id: 'r1', pruebaId: 'p1', estado: 'anulada' })],
      }),
    ];
    const hallazgo = analizar(evs, CAT).hallazgos.find((h) => h.tipo === 'registro_excluido');
    expect(hallazgo?.id).toContain('EL-01_anulado');
  });
});

describe('hallazgos · trazabilidad obligatoria', () => {
  const analisis = analizar(UN_REGISTRO, CAT);

  it('todos declaran la regla que los activó', () => {
    expect(analisis.hallazgos.every((h) => h.regla.startsWith('HAL-'))).toBe(true);
  });

  it('todos declaran la versión del motor', () => {
    expect(analisis.hallazgos.every((h) => h.versionMotor === VERSION_MOTOR)).toBe(true);
  });

  it('todos declaran la fecha de cálculo', () => {
    expect(analisis.hallazgos.every((h) => h.fecha === HOY)).toBe(true);
  });

  it('todos tienen id derivado de su tipo', () => {
    expect(analisis.hallazgos.every((h) => h.id.startsWith(h.tipo))).toBe(true);
  });

  it('ningún id se repite', () => {
    const ids = analisis.hallazgos.map((h) => h.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('salen ordenados por id', () => {
    const ids = analisis.hallazgos.map((h) => h.id);
    expect(ids).toEqual([...ids].sort());
  });

  it('el hallazgo de una capacidad evaluada nombra la prueba que lo originó', () => {
    const hallazgo = analisis.hallazgos.find((h) => h.tipo === 'evidencia_suficiente');
    expect(hallazgo?.pruebas).toEqual(['p1']);
    expect(hallazgo?.registros).toEqual(['r1']);
  });
});

describe('consistencia', () => {
  it('sin registros → sin_datos', () => {
    expect(analizar([], catalogo([])).consistencia.nivel).toBe('sin_datos');
  });

  it('registros sin correspondencias → sin_datos', () => {
    const analisis = analizar(UN_REGISTRO, catalogo([prueba({ id: 'p1' })]));
    expect(analisis.consistencia.nivel).toBe('sin_datos');
  });

  it('un conflicto la vuelve inconsistente', () => {
    const evs = [
      evaluacion({
        id: 'ev1',
        registros: [
          registro({ id: 'r1', pruebaId: 'p1' }),
          registro({ id: 'r2', pruebaId: 'p1', valor: { tipo: 'continuo', valor: 3, unidad: 'kg' } }),
        ],
      }),
    ];
    expect(analizar(evs, CAT).consistencia.nivel).toBe('inconsistente');
  });

  it('el conflicto pesa más que la ausencia de datos elegibles', () => {
    const evs = [evaluacion({ id: 'ev1', fecha: '2030-01-01' })];
    expect(analizar(evs, catalogo([])).consistencia.nivel).toBe('inconsistente');
  });

  it('datos parciales → parcial', () => {
    expect(analizar(UN_REGISTRO, CAT).consistencia.nivel).toBe('parcial');
  });

  it('todas las capacidades activas evaluadas → completa', () => {
    const todas = catalogo([
      prueba({
        id: 'p1',
        contribuciones: [
          contrib('A-01'), contrib('A-02'), contrib('A-03'), contrib('A-04'), contrib('A-05'),
          contrib('B-01'), contrib('B-02'), contrib('B-03'), contrib('B-04'),
          contrib('C-01'), contrib('C-02'), contrib('C-03'),
          contrib('D-01'), contrib('D-02'), contrib('D-03'), contrib('D-04'),
          contrib('E-01'), contrib('E-02'),
        ],
      }),
    ]);
    const analisis = analizar(UN_REGISTRO, todas);
    expect(analisis.consistencia.nivel).toBe('completa');
    expect(analisis.consistencia.capacidadesEvaluadas).toBe(18);
  });

  it('cuenta 18 capacidades evaluables', () => {
    expect(analizar([], catalogo([])).consistencia.capacidadesEvaluables).toBe(18);
  });

  it('no cuenta dos veces un registro que alimenta varias capacidades', () => {
    const cat = catalogo([
      prueba({ id: 'p1', contribuciones: [contrib('A-01'), contrib('A-02')] }),
    ]);
    expect(analizar(UN_REGISTRO, cat).consistencia.registrosElegibles).toBe(1);
  });

  it('evaluarConsistencia es una función pura sobre sus argumentos', () => {
    const informe = evaluarConsistencia({ estados: [], registrosTotales: 0, conflictos: 0 });
    expect(informe.nivel).toBe('sin_datos');
    expect(informe.registrosElegibles).toBe(0);
  });
});

describe('limitaciones', () => {
  it('catálogo vacío', () => {
    const tipos = tiposL(analizar([], catalogo([])).limitaciones);
    expect(tipos).toContain('catalogo_sin_pruebas');
    expect(tipos).toContain('catalogo_sin_correspondencias');
  });

  it('catálogo con pruebas pero sin correspondencias respaldadas', () => {
    const cat = catalogo([prueba({ id: 'p1', contribuciones: [contrib('A-01', { referencia: null })] })]);
    const tipos = tiposL(analizar(UN_REGISTRO, cat).limitaciones);
    expect(tipos).toContain('catalogo_sin_correspondencias');
    expect(tipos).not.toContain('catalogo_sin_pruebas');
  });

  it('con una correspondencia respaldada, esa limitación desaparece', () => {
    expect(tiposL(analizar(UN_REGISTRO, CAT).limitaciones)).not.toContain('catalogo_sin_correspondencias');
  });

  it('vigencia no declarada', () => {
    const cat = catalogo([prueba({ id: 'p1', vigenciaDias: null, contribuciones: [contrib('A-01')] })]);
    const limitacion = analizar(UN_REGISTRO, cat).limitaciones.find((l) => l.tipo === 'vigencia_no_declarada');
    expect(limitacion?.detalle.prueba).toBe('p1');
  });

  it('una limitación por cada capacidad sin evidencia', () => {
    const sinEvidencia = analizar(UN_REGISTRO, CAT).limitaciones.filter(
      (l) => l.tipo === 'capacidad_sin_evidencia'
    );
    expect(sinEvidencia).toHaveLength(17);
  });

  it('las dos reservadas se declaran como tales', () => {
    const reservadas = analizar([], catalogo([])).limitaciones.filter(
      (l) => l.tipo === 'capacidad_reservada'
    );
    expect(reservadas.map((l) => l.capacidad).sort()).toEqual(['F-01', 'F-02']);
  });

  it('cobertura no declarada sobre una capacidad evaluada', () => {
    const limitacion = analizar(UN_REGISTRO, CAT).limitaciones.find(
      (l) => l.tipo === 'cobertura_no_declarada'
    );
    expect(limitacion?.capacidad).toBe('A-01');
  });

  it('con cobertura declarada y completa, esa limitación no aparece', () => {
    const cat = catalogo([prueba({ id: 'p1', contribuciones: [contrib('A-01')] })], {
      cobertura: [{ capacidad: 'A-01', pruebasRequeridas: ['p1'] }],
    });
    expect(tiposL(analizar(UN_REGISTRO, cat).limitaciones)).not.toContain('cobertura_no_declarada');
  });

  it('evaluación sin registros', () => {
    expect(tiposL(analizar([evaluacion({ id: 'ev1' })], CAT).limitaciones)).toContain(
      'evaluacion_sin_registros'
    );
  });

  it('datos incompatibles ante una divergencia', () => {
    const evs = [
      evaluacion({
        id: 'ev1',
        registros: [
          registro({ id: 'r1', pruebaId: 'p1' }),
          registro({ id: 'r2', pruebaId: 'p1', valor: { tipo: 'continuo', valor: 4, unidad: 'kg' } }),
        ],
      }),
    ];
    expect(tiposL(analizar(evs, CAT).limitaciones)).toContain('datos_incompatibles');
  });

  it('capacidad en conflicto', () => {
    const evs = [
      evaluacion({
        id: 'ev1',
        registros: [
          registro({ id: 'r1', pruebaId: 'p1' }),
          registro({ id: 'r2', pruebaId: 'p1', valor: { tipo: 'continuo', valor: 4, unidad: 'kg' } }),
        ],
      }),
    ];
    expect(tiposL(analizar(evs, CAT).limitaciones)).toContain('capacidad_en_conflicto');
  });

  it('capacidad desactualizada', () => {
    const cat = catalogo([prueba({ id: 'p1', vigenciaDias: 5, contribuciones: [contrib('A-01')] })]);
    const evs = [
      evaluacion({
        id: 'ev1',
        fecha: '2026-01-01',
        registros: [registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-01-01' })],
      }),
    ];
    expect(tiposL(analizar(evs, cat).limitaciones)).toContain('capacidad_desactualizada');
  });

  it('salen ordenadas y sin repetir', () => {
    const limitaciones = analizar(UN_REGISTRO, CAT).limitaciones;
    const ids = limitaciones.map((l) => l.id);
    expect(ids).toEqual([...ids].sort());
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ninguna inventa una causa: solo tipo, capacidad y detalle', () => {
    const claves = new Set(analizar(UN_REGISTRO, CAT).limitaciones.flatMap((l) => Object.keys(l)));
    expect([...claves].sort()).toEqual(['capacidad', 'detalle', 'id', 'tipo']);
  });
});
