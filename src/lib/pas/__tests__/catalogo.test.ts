import { describe, expect, it } from 'vitest';
import {
  CAPACIDADES,
  CAPACIDADES_ACTIVAS,
  CAPACIDADES_RESERVADAS,
  DOMINIOS,
  ESTADOS_CAPACIDAD,
  FAMILIAS,
  FAMILIAS_RESERVADAS,
  FAMILIAS_SOLO_CONTEXTO,
  TIPOS_EVALUACION,
  compararFechas,
  definicionCapacidad,
  dentroDeVigencia,
  diasEntre,
  esCapacidad,
  esFamilia,
  esFechaISO,
  esFutura,
  fechaMasReciente,
} from '../index';

// ── Catálogo congelado y utilidades de fecha (Sprint PAS-2.0) ──────────────

describe('catálogo de capacidades', () => {
  it('declara exactamente 20 capacidades', () => {
    expect(CAPACIDADES).toHaveLength(20);
  });

  it('18 activas y 2 reservadas', () => {
    expect(CAPACIDADES_ACTIVAS).toHaveLength(18);
    expect(CAPACIDADES_RESERVADAS).toHaveLength(2);
  });

  it('las reservadas son F-01 y F-02', () => {
    expect(CAPACIDADES_RESERVADAS.map((c) => c.id)).toEqual(['F-01', 'F-02']);
  });

  it('no repite ningún id', () => {
    const ids = CAPACIDADES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('reparte las capacidades entre los seis dominios del Sprint 1', () => {
    const porDominio = { A: 5, B: 4, C: 3, D: 4, E: 2, F: 2 };
    for (const [dominio, total] of Object.entries(porDominio)) {
      expect(CAPACIDADES.filter((c) => c.dominio === dominio)).toHaveLength(total);
    }
  });

  it('todo dominio usado está nombrado', () => {
    for (const capacidad of CAPACIDADES) {
      expect(DOMINIOS[capacidad.dominio]).toBeTruthy();
    }
  });

  it('ninguna capacidad tiene nombre vacío', () => {
    for (const capacidad of CAPACIDADES) expect(capacidad.nombre.trim()).not.toBe('');
  });

  it('declara 11 familias de prueba', () => {
    expect(Object.keys(FAMILIAS)).toHaveLength(11);
  });

  it('F-K es la única familia reservada', () => {
    expect(FAMILIAS_RESERVADAS).toEqual(['F-K']);
  });

  it('F-J es la única familia de solo contexto', () => {
    expect(FAMILIAS_SOLO_CONTEXTO).toEqual(['F-J']);
  });

  it('declara los cinco estados excluyentes, ni uno más', () => {
    expect(ESTADOS_CAPACIDAD).toHaveLength(5);
    expect(ESTADOS_CAPACIDAD).toContain('desconocida');
    expect(ESTADOS_CAPACIDAD).toContain('desactualizada');
  });

  it('declara los seis tipos de evaluación', () => {
    expect(TIPOS_EVALUACION).toEqual(['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06']);
  });

  it('esCapacidad reconoce ids del catálogo y rechaza el resto', () => {
    expect(esCapacidad('A-01')).toBe(true);
    expect(esCapacidad('F-02')).toBe(true);
    expect(esCapacidad('Z-99')).toBe(false);
    expect(esCapacidad('')).toBe(false);
  });

  it('esFamilia reconoce familias válidas', () => {
    expect(esFamilia('F-A')).toBe(true);
    expect(esFamilia('F-K')).toBe(true);
    expect(esFamilia('F-Z')).toBe(false);
  });

  it('definicionCapacidad devuelve la definición completa', () => {
    expect(definicionCapacidad('B-01')).toEqual({
      id: 'B-01',
      dominio: 'B',
      nombre: 'Movilidad',
      reservada: false,
    });
  });

  it('definicionCapacidad lanza ante un id fuera del catálogo', () => {
    // @ts-expect-error se fuerza a propósito: el guard existe para el `as`
    expect(() => definicionCapacidad('X-99')).toThrow(/Capacidad desconocida/);
  });

  it('mantiene B-01 y B-02 separadas', () => {
    const nombres = CAPACIDADES.filter((c) => c.dominio === 'B').map((c) => c.nombre);
    expect(nombres).toContain('Movilidad');
    expect(nombres).toContain('Flexibilidad');
  });
});

describe('esFechaISO', () => {
  it('acepta una fecha real', () => {
    expect(esFechaISO('2026-08-02')).toBe(true);
  });

  it('rechaza el formato incorrecto', () => {
    expect(esFechaISO('02-08-2026')).toBe(false);
    expect(esFechaISO('2026-8-2')).toBe(false);
    expect(esFechaISO('2026-08-02T00:00:00Z')).toBe(false);
    expect(esFechaISO('')).toBe(false);
  });

  it('rechaza un día que no existe', () => {
    expect(esFechaISO('2026-02-30')).toBe(false);
    expect(esFechaISO('2026-13-01')).toBe(false);
    expect(esFechaISO('2026-04-31')).toBe(false);
  });

  it('acepta el 29 de febrero en año bisiesto y lo rechaza fuera', () => {
    expect(esFechaISO('2024-02-29')).toBe(true);
    expect(esFechaISO('2026-02-29')).toBe(false);
  });
});

describe('aritmética de fechas', () => {
  it('diasEntre cuenta días calendario', () => {
    expect(diasEntre('2026-01-01', '2026-01-31')).toBe(30);
    expect(diasEntre('2026-01-01', '2026-01-01')).toBe(0);
  });

  it('diasEntre es negativo hacia atrás', () => {
    expect(diasEntre('2026-02-01', '2026-01-01')).toBe(-31);
  });

  it('diasEntre cruza el cambio de año', () => {
    expect(diasEntre('2025-12-31', '2026-01-01')).toBe(1);
  });

  it('diasEntre devuelve NaN ante una fecha ilegible', () => {
    expect(Number.isNaN(diasEntre('no-es-fecha', '2026-01-01'))).toBe(true);
  });

  it('compararFechas ordena cronológicamente', () => {
    expect(compararFechas('2026-01-01', '2026-06-01')).toBe(-1);
    expect(compararFechas('2026-06-01', '2026-01-01')).toBe(1);
    expect(compararFechas('2026-06-01', '2026-06-01')).toBe(0);
  });

  it('fechaMasReciente devuelve null si la lista está vacía', () => {
    expect(fechaMasReciente([])).toBeNull();
  });

  it('fechaMasReciente ignora el orden de entrada', () => {
    expect(fechaMasReciente(['2026-01-01', '2026-07-15', '2026-03-02'])).toBe('2026-07-15');
    expect(fechaMasReciente(['2026-07-15', '2026-01-01'])).toBe('2026-07-15');
  });

  it('esFutura solo es cierta después de hoy', () => {
    expect(esFutura('2026-08-03', '2026-08-02')).toBe(true);
    expect(esFutura('2026-08-02', '2026-08-02')).toBe(false);
    expect(esFutura('2026-08-01', '2026-08-02')).toBe(false);
  });
});

describe('dentroDeVigencia', () => {
  it('sin vigencia declarada, nunca caduca', () => {
    expect(dentroDeVigencia('2000-01-01', '2026-08-02', null)).toBe(true);
  });

  it('dentro de la ventana', () => {
    expect(dentroDeVigencia('2026-07-01', '2026-08-02', 180)).toBe(true);
  });

  it('el último día de la ventana sigue vigente', () => {
    expect(dentroDeVigencia('2026-07-03', '2026-08-02', 30)).toBe(true);
  });

  it('un día después de la ventana ya no', () => {
    expect(dentroDeVigencia('2026-07-02', '2026-08-02', 30)).toBe(false);
  });

  it('vigencia cero: solo el mismo día', () => {
    expect(dentroDeVigencia('2026-08-02', '2026-08-02', 0)).toBe(true);
    expect(dentroDeVigencia('2026-08-01', '2026-08-02', 0)).toBe(false);
  });
});
