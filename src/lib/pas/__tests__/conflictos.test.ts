import { describe, expect, it } from 'vitest';
import {
  analizarRendimiento,
  detectarConflictos,
  indexarCatalogo,
  ordenarConflictos,
  registrosDivergentes,
} from '../index';
import type { Conflicto, TipoConflicto } from '../index';
import { HOY, catalogo, contrib, evaluacion, prueba, registro } from './fixtures';

// ── Detección de conflictos (Sprint PAS-2.0) ───────────────────────────────
// Los conflictos NO se resuelven: se reportan. Ninguna prueba de este archivo
// espera que el motor elija entre dos datos incompatibles.

function tipos(conflictos: readonly Conflicto[]): TipoConflicto[] {
  return conflictos.map((c) => c.tipo);
}

function detectar(evaluaciones: ReturnType<typeof evaluacion>[], cat = catalogo([])) {
  return detectarConflictos(evaluaciones, cat, indexarCatalogo(cat), 'atleta-1', HOY);
}

describe('conflictos de catálogo', () => {
  it('una contribución sin referencia', () => {
    const cat = catalogo([
      prueba({ id: 'p1', contribuciones: [contrib('A-01', { referencia: null })] }),
    ]);
    expect(tipos(detectar([], cat))).toContain('contribucion_sin_referencia');
  });

  it('una contribución a capacidad reservada', () => {
    const cat = catalogo([prueba({ id: 'p1', contribuciones: [contrib('F-01')] })]);
    expect(tipos(detectar([], cat))).toContain('contribucion_a_capacidad_reservada');
  });

  it('una prueba antropométrica que declara contribuciones', () => {
    const cat = catalogo([
      prueba({ id: 'p1', familia: 'F-J', contribuciones: [contrib('A-01')] }),
    ]);
    const conflicto = detectar([], cat).find(
      (c) => c.tipo === 'contribucion_de_familia_contexto'
    );
    expect(conflicto?.detalle.familia).toBe('F-J');
  });

  it('F-J sin contribuciones no genera conflicto', () => {
    const cat = catalogo([prueba({ id: 'p1', familia: 'F-J' })]);
    expect(tipos(detectar([], cat))).not.toContain('contribucion_de_familia_contexto');
  });

  it('una definición de prueba repetida', () => {
    const cat = catalogo([prueba({ id: 'p1' }), prueba({ id: 'p1' })]);
    const conflicto = detectar([], cat).find((c) => c.detalle.motivo === 'definicion_repetida');
    expect(conflicto).toBeDefined();
  });

  it('un catálogo correcto no genera ninguno', () => {
    const cat = catalogo([prueba({ id: 'p1', contribuciones: [contrib('A-01')] })]);
    expect(detectar([], cat)).toEqual([]);
  });
});

describe('conflictos de estructura', () => {
  it('dos evaluaciones con el mismo id', () => {
    const conflictos = detectar([evaluacion({ id: 'ev1' }), evaluacion({ id: 'ev1' })]);
    expect(tipos(conflictos)).toContain('id_evaluacion_repetida');
  });

  it('una evaluación de otro atleta', () => {
    const conflictos = detectar([evaluacion({ id: 'ev1', atletaId: 'otro' })]);
    const conflicto = conflictos.find((c) => c.tipo === 'atleta_divergente');
    expect(conflicto?.detalle).toEqual({ esperado: 'atleta-1', recibido: 'otro' });
  });

  it('dos evaluaciones iniciales', () => {
    const conflictos = detectar([
      evaluacion({ id: 'ev1', tipo: 'T-01' }),
      evaluacion({ id: 'ev2', tipo: 'T-01' }),
    ]);
    const conflicto = conflictos.find((c) => c.tipo === 'evaluacion_inicial_duplicada');
    expect(conflicto?.evaluaciones).toEqual(['ev1', 'ev2']);
  });

  it('una sola T-01 no genera conflicto', () => {
    const conflictos = detectar([
      evaluacion({ id: 'ev1', tipo: 'T-01' }),
      evaluacion({ id: 'ev2', tipo: 'T-02' }),
    ]);
    expect(tipos(conflictos)).not.toContain('evaluacion_inicial_duplicada');
  });

  it('una evaluación sin registros', () => {
    expect(tipos(detectar([evaluacion({ id: 'ev1' })]))).toContain('evaluacion_sin_registros');
  });

  it('una fecha de evaluación ilegible', () => {
    const conflictos = detectar([evaluacion({ id: 'ev1', fecha: '01/01/2026' })]);
    expect(tipos(conflictos)).toContain('fecha_invalida');
  });

  it('una fecha de evaluación futura', () => {
    const conflictos = detectar([evaluacion({ id: 'ev1', fecha: '2027-01-01' })]);
    const conflicto = conflictos.find((c) => c.tipo === 'fecha_futura');
    expect(conflicto?.detalle).toEqual({ fecha: '2027-01-01', hoy: HOY });
  });

  it('la fecha de hoy no es futura', () => {
    expect(tipos(detectar([evaluacion({ id: 'ev1', fecha: HOY })]))).not.toContain('fecha_futura');
  });

  it('dos registros con el mismo id', () => {
    const conflictos = detectar([
      evaluacion({
        id: 'ev1',
        registros: [registro({ id: 'r1', pruebaId: 'p1' }), registro({ id: 'r1', pruebaId: 'p2' })],
      }),
    ]);
    expect(tipos(conflictos)).toContain('id_registro_repetido');
  });

  it('ids repetidos entre evaluaciones distintas', () => {
    const conflictos = detectar([
      evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] }),
      evaluacion({ id: 'ev2', registros: [registro({ id: 'r1', pruebaId: 'p1' })] }),
    ]);
    expect(tipos(conflictos)).toContain('id_registro_repetido');
  });

  it('un registro con fecha futura', () => {
    const conflictos = detectar([
      evaluacion({
        id: 'ev1',
        registros: [registro({ id: 'r1', pruebaId: 'p1', fecha: '2030-01-01' })],
      }),
    ]);
    expect(tipos(conflictos)).toContain('fecha_futura');
  });

  it('un registro anterior a su propia evaluación', () => {
    const conflictos = detectar([
      evaluacion({
        id: 'ev1',
        fecha: '2026-06-01',
        registros: [registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-05-01' })],
      }),
    ]);
    const conflicto = conflictos.find((c) => c.tipo === 'registro_anterior_a_evaluacion');
    expect(conflicto?.detalle).toEqual({ registro: '2026-05-01', evaluacion: '2026-06-01' });
  });

  it('un registro posterior a la evaluación no es conflicto de orden', () => {
    const conflictos = detectar([
      evaluacion({
        id: 'ev1',
        fecha: '2026-05-01',
        registros: [registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-06-01' })],
      }),
    ]);
    expect(tipos(conflictos)).not.toContain('registro_anterior_a_evaluacion');
  });

  it('una fecha de registro ilegible corta el resto de comprobaciones de fecha', () => {
    const conflictos = detectar([
      evaluacion({
        id: 'ev1',
        registros: [registro({ id: 'r1', pruebaId: 'p1', fecha: 'ayer' })],
      }),
    ]);
    expect(tipos(conflictos).filter((t) => t === 'fecha_invalida')).toHaveLength(1);
    expect(tipos(conflictos)).not.toContain('fecha_futura');
  });
});

describe('conflictos de contenido', () => {
  const cat = catalogo([prueba({ id: 'p1', contribuciones: [contrib('A-01')] })]);

  it('una prueba que no está en el catálogo', () => {
    const conflictos = detectar(
      [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'fantasma' })] })],
      cat
    );
    const conflicto = conflictos.find((c) => c.tipo === 'prueba_no_catalogada');
    expect(conflicto?.pruebas).toEqual(['fantasma']);
  });

  it('un valor de otra naturaleza', () => {
    const conflictos = detectar(
      [
        evaluacion({
          id: 'ev1',
          registros: [
            registro({ id: 'r1', pruebaId: 'p1', valor: { tipo: 'binario', valor: true } }),
          ],
        }),
      ],
      cat
    );
    const conflicto = conflictos.find((c) => c.tipo === 'valor_incompatible');
    expect(conflicto?.detalle).toEqual({ esperado: 'continuo', recibido: 'binario' });
  });

  it('un patrón ausente cuando la prueba lo exige', () => {
    const conPatron = catalogo([prueba({ id: 'p1', requierePatron: true })]);
    const conflictos = detectar(
      [evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] })],
      conPatron
    );
    expect(tipos(conflictos)).toContain('patron_ausente');
  });

  it('un patrón en blanco cuenta como ausente', () => {
    const conPatron = catalogo([prueba({ id: 'p1', requierePatron: true })]);
    const conflictos = detectar(
      [
        evaluacion({
          id: 'ev1',
          registros: [registro({ id: 'r1', pruebaId: 'p1', patron: '   ' })],
        }),
      ],
      conPatron
    );
    expect(tipos(conflictos)).toContain('patron_ausente');
  });

  it('con patrón declarado no hay conflicto', () => {
    const conPatron = catalogo([prueba({ id: 'p1', requierePatron: true })]);
    const conflictos = detectar(
      [
        evaluacion({
          id: 'ev1',
          registros: [registro({ id: 'r1', pruebaId: 'p1', patron: 'sentadilla' })],
        }),
      ],
      conPatron
    );
    expect(tipos(conflictos)).not.toContain('patron_ausente');
  });

  it('un duplicado exacto', () => {
    const conflictos = detectar(
      [
        evaluacion({
          id: 'ev1',
          registros: [
            registro({ id: 'r1', pruebaId: 'p1' }),
            registro({ id: 'r2', pruebaId: 'p1' }),
          ],
        }),
      ],
      cat
    );
    const conflicto = conflictos.find((c) => c.tipo === 'duplicado_exacto');
    expect(conflicto?.registros).toEqual(['r1', 'r2']);
  });

  it('un resultado divergente, con ambos valores en el detalle', () => {
    const conflictos = detectar(
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
      cat
    );
    const conflicto = conflictos.find((c) => c.tipo === 'resultado_divergente');
    expect(conflicto?.detalle.valores).toContain('100');
    expect(conflicto?.detalle.valores).toContain('200');
  });

  it('una repetición sobre una prueba que no la admite', () => {
    const noRepetible = catalogo([prueba({ id: 'p1', repetible: false })]);
    const conflictos = detectar(
      [
        evaluacion({
          id: 'ev1',
          registros: [
            registro({ id: 'r1', pruebaId: 'p1' }),
            registro({ id: 'r2', pruebaId: 'p1' }),
          ],
        }),
      ],
      noRepetible
    );
    const conflicto = conflictos.find((c) => c.tipo === 'repeticion_no_admitida');
    expect(conflicto?.detalle.total).toBe('2');
  });

  it('la repetibilidad no elimina la divergencia', () => {
    const conflictos = detectar(
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
      cat
    );
    expect(tipos(conflictos)).toContain('resultado_divergente');
    expect(tipos(conflictos)).not.toContain('repeticion_no_admitida');
  });
});

describe('reunión y orden', () => {
  it('deduplica por id', () => {
    const uno: Conflicto = {
      id: 'x:1', tipo: 'fecha_futura', regla: 'R', evaluaciones: [],
      registros: [], pruebas: [], capacidades: [], detalle: {},
    };
    expect(ordenarConflictos([uno, { ...uno }])).toHaveLength(1);
  });

  it('ordena por id de forma estable', () => {
    const base = {
      tipo: 'fecha_futura' as const, regla: 'R', evaluaciones: [],
      registros: [], pruebas: [], capacidades: [], detalle: {},
    };
    const ordenados = ordenarConflictos([
      { ...base, id: 'z' },
      { ...base, id: 'a' },
      { ...base, id: 'm' },
    ]);
    expect(ordenados.map((c) => c.id)).toEqual(['a', 'm', 'z']);
  });

  it('todo conflicto declara la regla que lo detectó', () => {
    const conflictos = detectar([evaluacion({ id: 'ev1', atletaId: 'otro' })]);
    expect(conflictos.every((c) => c.regla.trim() !== '')).toBe(true);
  });

  it('todo conflicto tiene id derivado de su tipo', () => {
    const conflictos = detectar([evaluacion({ id: 'ev1' })]);
    expect(conflictos.every((c) => c.id.startsWith(c.tipo))).toBe(true);
  });

  it('registrosDivergentes recoge solo los del tipo divergente', () => {
    const cat = catalogo([prueba({ id: 'p1' })]);
    const conflictos = detectar(
      [
        evaluacion({
          id: 'ev1',
          registros: [
            registro({ id: 'r1', pruebaId: 'p1' }),
            registro({
              id: 'r2',
              pruebaId: 'p1',
              valor: { tipo: 'continuo', valor: 5, unidad: 'kg' },
            }),
          ],
        }),
      ],
      cat
    );
    expect([...registrosDivergentes(conflictos)].sort()).toEqual(['r1', 'r2']);
  });

  it('sin divergencias el conjunto queda vacío', () => {
    expect(registrosDivergentes([]).size).toBe(0);
  });

  it('el orden de las evaluaciones no altera los conflictos detectados', () => {
    const a = evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'p1' })] });
    const b = evaluacion({ id: 'ev2', registros: [registro({ id: 'r2', pruebaId: 'p1' })] });
    const cat = catalogo([prueba({ id: 'p1' })]);

    const uno = analizarRendimiento({
      atletaId: 'atleta-1', evaluaciones: [a, b], catalogo: cat, hoyISO: HOY,
    });
    const otro = analizarRendimiento({
      atletaId: 'atleta-1', evaluaciones: [b, a], catalogo: cat, hoyISO: HOY,
    });
    expect(uno.conflictos).toEqual(otro.conflictos);
  });
});
