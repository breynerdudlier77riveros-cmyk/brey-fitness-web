import { describe, expect, it } from 'vitest';
import {
  agrupar,
  claveValor,
  contribucionAplicable,
  esDivergente,
  esDuplicadoExacto,
  evaluarElegibilidadBase,
} from '../index';
import { HOY, prueba, registro, contrib } from './fixtures';

// ── Elegibilidad EL-01…EL-06 y agrupación de registros (Sprint PAS-2.0) ────

const BASE = prueba({ id: 'p1' });

describe('EL-03 · integridad', () => {
  it('un registro completo la cumple', () => {
    const r = evaluarElegibilidadBase(registro({ id: 'r1', pruebaId: 'p1' }), BASE, HOY);
    expect(r.elegible).toBe(true);
    expect(r.motivo).toBeNull();
  });

  it('excluye si falta el id', () => {
    const r = evaluarElegibilidadBase(registro({ id: '', pruebaId: 'p1' }), BASE, HOY);
    expect(r.motivo).toBe('EL-03_integridad');
  });

  it('excluye si falta la prueba', () => {
    const r = evaluarElegibilidadBase(registro({ id: 'r1', pruebaId: '' }), BASE, HOY);
    expect(r.motivo).toBe('EL-03_integridad');
  });

  it('excluye ante una fecha imposible', () => {
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-02-30' }),
      BASE,
      HOY
    );
    expect(r.motivo).toBe('EL-03_integridad');
  });

  it('excluye un continuo no finito', () => {
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', valor: { tipo: 'continuo', valor: NaN, unidad: 'kg' } }),
      BASE,
      HOY
    );
    expect(r.motivo).toBe('EL-03_integridad');
  });

  it('excluye un infinito', () => {
    const r = evaluarElegibilidadBase(
      registro({
        id: 'r1',
        pruebaId: 'p1',
        valor: { tipo: 'continuo', valor: Infinity, unidad: 'kg' },
      }),
      BASE,
      HOY
    );
    expect(r.motivo).toBe('EL-03_integridad');
  });

  it('excluye un categórico vacío', () => {
    const definicion = prueba({ id: 'p1', naturaleza: 'categorico' });
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', valor: { tipo: 'categorico', valor: '  ' } }),
      definicion,
      HOY
    );
    expect(r.motivo).toBe('EL-03_integridad');
  });

  it('admite el valor binario `false`, que no es ausencia de valor', () => {
    const definicion = prueba({ id: 'p1', naturaleza: 'binario' });
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', valor: { tipo: 'binario', valor: false } }),
      definicion,
      HOY
    );
    expect(r.elegible).toBe(true);
  });

  it('admite el valor continuo cero', () => {
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', valor: { tipo: 'continuo', valor: 0, unidad: 'kg' } }),
      BASE,
      HOY
    );
    expect(r.elegible).toBe(true);
  });
});

describe('prueba no catalogada', () => {
  it('excluye cuando no hay definición', () => {
    const r = evaluarElegibilidadBase(registro({ id: 'r1', pruebaId: 'px' }), undefined, HOY);
    expect(r.motivo).toBe('prueba_no_catalogada');
    expect(r.detalle.prueba).toBe('px');
  });

  it('la integridad se comprueba antes que el catálogo', () => {
    const r = evaluarElegibilidadBase(registro({ id: '', pruebaId: 'px' }), undefined, HOY);
    expect(r.motivo).toBe('EL-03_integridad');
  });
});

describe('EL-01 · anulación', () => {
  it('un registro anulado nunca es elegible', () => {
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', estado: 'anulada' }),
      BASE,
      HOY
    );
    expect(r.motivo).toBe('EL-01_anulado');
  });

  it('la anulación pesa más que la vigencia', () => {
    const definicion = prueba({ id: 'p1', vigenciaDias: 1 });
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', fecha: '2020-01-01', estado: 'anulada' }),
      definicion,
      HOY
    );
    expect(r.motivo).toBe('EL-01_anulado');
  });
});

describe('EL-05 · condiciones registradas', () => {
  const conCondiciones = prueba({ id: 'p1', condicionesRequeridas: ['calzado', 'superficie'] });

  it('cumple cuando constan todas', () => {
    const r = evaluarElegibilidadBase(
      registro({
        id: 'r1',
        pruebaId: 'p1',
        condiciones: { calzado: 'sin', superficie: 'tatami' },
      }),
      conCondiciones,
      HOY
    );
    expect(r.elegible).toBe(true);
  });

  it('excluye si falta una y la nombra', () => {
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', condiciones: { calzado: 'sin' } }),
      conCondiciones,
      HOY
    );
    expect(r.motivo).toBe('EL-05_condiciones_ausentes');
    expect(r.detalle.faltantes).toBe('superficie');
  });

  it('una condición en blanco cuenta como ausente', () => {
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', condiciones: { calzado: '', superficie: ' ' } }),
      conCondiciones,
      HOY
    );
    expect(r.detalle.faltantes).toBe('calzado,superficie');
  });
});

describe('EL-06 · precondiciones', () => {
  const exigente = prueba({ id: 'p1', exigePrecondiciones: true });

  it('cumple cuando constan cumplidas', () => {
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', precondicionesCumplidas: true }),
      exigente,
      HOY
    );
    expect(r.elegible).toBe(true);
  });

  it('excluye cuando no se cumplían', () => {
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', precondicionesCumplidas: false }),
      exigente,
      HOY
    );
    expect(r.motivo).toBe('EL-06_precondiciones_no_constan');
  });

  it('excluye igualmente cuando no consta, y lo distingue en el detalle', () => {
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', precondicionesCumplidas: null }),
      exigente,
      HOY
    );
    expect(r.motivo).toBe('EL-06_precondiciones_no_constan');
    expect(r.detalle.consta).toBe('null');
  });

  it('si la prueba no las exige, da igual que no consten', () => {
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', precondicionesCumplidas: null }),
      BASE,
      HOY
    );
    expect(r.elegible).toBe(true);
  });
});

describe('EL-02 · vigencia, siempre la última', () => {
  it('excluye un registro caducado', () => {
    const definicion = prueba({ id: 'p1', vigenciaDias: 30 });
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-01-01' }),
      definicion,
      HOY
    );
    expect(r.motivo).toBe('EL-02_fuera_de_vigencia');
    expect(r.detalle.vigenciaDias).toBe('30');
  });

  it('«fuera de vigencia» implica haber cumplido todo lo demás', () => {
    // Si además faltara una condición, el motivo sería EL-05: la garantía es
    // la que permite a la derivación distinguir desactualizada de desconocida.
    const definicion = prueba({ id: 'p1', vigenciaDias: 1, condicionesRequeridas: ['x'] });
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', fecha: '2020-01-01' }),
      definicion,
      HOY
    );
    expect(r.motivo).toBe('EL-05_condiciones_ausentes');
  });

  it('sin vigencia declarada, un registro antiguo sigue siendo elegible', () => {
    const definicion = prueba({ id: 'p1', vigenciaDias: null });
    const r = evaluarElegibilidadBase(
      registro({ id: 'r1', pruebaId: 'p1', fecha: '2019-05-05' }),
      definicion,
      HOY
    );
    expect(r.elegible).toBe(true);
  });
});

describe('EL-04 · correspondencia con referencia', () => {
  it('aplica cuando la prueba la declara y está respaldada', () => {
    const definicion = prueba({ id: 'p1', contribuciones: [contrib('A-01')] });
    const r = contribucionAplicable(definicion, 'A-01');
    expect('contribucion' in r && r.contribucion.referencia).toBe('ckb_ref_1');
  });

  it('sin correspondencia declarada', () => {
    const definicion = prueba({ id: 'p1', contribuciones: [contrib('A-01')] });
    expect(contribucionAplicable(definicion, 'C-01')).toEqual({
      motivo: 'EL-04_sin_correspondencia',
    });
  });

  it('una contribución sin referencia NO se aplica', () => {
    const definicion = prueba({
      id: 'p1',
      contribuciones: [contrib('A-01', { referencia: null })],
    });
    expect(contribucionAplicable(definicion, 'A-01')).toEqual({
      motivo: 'contribucion_sin_referencia',
    });
  });

  it('una referencia en blanco tampoco vale', () => {
    const definicion = prueba({
      id: 'p1',
      contribuciones: [contrib('A-01', { referencia: '   ' })],
    });
    expect(contribucionAplicable(definicion, 'A-01')).toEqual({
      motivo: 'contribucion_sin_referencia',
    });
  });

  it('una capacidad reservada no admite contribución', () => {
    const definicion = prueba({ id: 'p1', contribuciones: [contrib('F-01')] });
    expect(contribucionAplicable(definicion, 'F-01')).toEqual({ motivo: 'capacidad_reservada' });
  });

  it('la ausencia de correspondencia se comprueba antes que la reserva', () => {
    const definicion = prueba({ id: 'p1', contribuciones: [contrib('A-01')] });
    expect(contribucionAplicable(definicion, 'F-02')).toEqual({
      motivo: 'EL-04_sin_correspondencia',
    });
  });
});

describe('claveValor', () => {
  it('distingue las cuatro variantes', () => {
    expect(claveValor({ tipo: 'continuo', valor: 1, unidad: 'kg' })).toBe('continuo:1:kg');
    expect(claveValor({ tipo: 'ordinal', valor: 3, escala: 5 })).toBe('ordinal:3/5');
    expect(claveValor({ tipo: 'binario', valor: true })).toBe('binario:true');
    expect(claveValor({ tipo: 'categorico', valor: 'ok' })).toBe('categorico:ok');
  });

  it('el mismo número con otra unidad no es el mismo valor', () => {
    const a = claveValor({ tipo: 'continuo', valor: 10, unidad: 'kg' });
    const b = claveValor({ tipo: 'continuo', valor: 10, unidad: 'lb' });
    expect(a).not.toBe(b);
  });
});

describe('agrupación de registros', () => {
  it('agrupa por prueba y fecha', () => {
    const grupos = agrupar([
      registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-01-01' }),
      registro({ id: 'r2', pruebaId: 'p1', fecha: '2026-01-01' }),
      registro({ id: 'r3', pruebaId: 'p1', fecha: '2026-02-01' }),
    ]);
    expect(grupos).toHaveLength(2);
  });

  it('no agrupa pruebas distintas del mismo día', () => {
    const grupos = agrupar([
      registro({ id: 'r1', pruebaId: 'p1' }),
      registro({ id: 'r2', pruebaId: 'p2' }),
    ]);
    expect(grupos).toHaveLength(2);
  });

  it('devuelve los grupos ordenados con independencia de la entrada', () => {
    const a = agrupar([
      registro({ id: 'r1', pruebaId: 'pz' }),
      registro({ id: 'r2', pruebaId: 'pa' }),
    ]);
    const b = agrupar([
      registro({ id: 'r2', pruebaId: 'pa' }),
      registro({ id: 'r1', pruebaId: 'pz' }),
    ]);
    expect(a.map((g) => g.pruebaId)).toEqual(['pa', 'pz']);
    expect(a.map((g) => g.pruebaId)).toEqual(b.map((g) => g.pruebaId));
  });

  it('lista vacía produce cero grupos', () => {
    expect(agrupar([])).toEqual([]);
  });

  it('detecta el duplicado exacto', () => {
    const [grupo] = agrupar([
      registro({ id: 'r1', pruebaId: 'p1' }),
      registro({ id: 'r2', pruebaId: 'p1' }),
    ]);
    expect(esDuplicadoExacto(grupo)).toBe(true);
    expect(esDivergente(grupo)).toBe(false);
  });

  it('un solo registro no es duplicado', () => {
    const [grupo] = agrupar([registro({ id: 'r1', pruebaId: 'p1' })]);
    expect(esDuplicadoExacto(grupo)).toBe(false);
  });

  it('detecta la divergencia', () => {
    const [grupo] = agrupar([
      registro({ id: 'r1', pruebaId: 'p1' }),
      registro({
        id: 'r2',
        pruebaId: 'p1',
        valor: { tipo: 'continuo', valor: 999, unidad: 'kg' },
      }),
    ]);
    expect(esDivergente(grupo)).toBe(true);
    expect(esDuplicadoExacto(grupo)).toBe(false);
    expect(grupo.valoresDistintos).toHaveLength(2);
  });

  it('fechas distintas no producen divergencia: eso sería evolución', () => {
    const grupos = agrupar([
      registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-01-01' }),
      registro({
        id: 'r2',
        pruebaId: 'p1',
        fecha: '2026-06-01',
        valor: { tipo: 'continuo', valor: 999, unidad: 'kg' },
      }),
    ]);
    expect(grupos.every((g) => !esDivergente(g))).toBe(true);
  });
});
