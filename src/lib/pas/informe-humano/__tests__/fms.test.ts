// ── El panel del FMS, en aislamiento ────────────────────────────────────────
//
// Protege lo que `fms.ts` compone a partir de las siete pruebas: que el
// mínimo de las bilaterales se calcule bien, que falte una sola y el total
// desaparezca entero, y que la suma no lleve pegada ninguna banda ni punto
// de corte — la PKB ya prohibió el de 14 para P-09, y esa regla no puede
// colarse por la puerta de atrás de las siete sueltas.

import { describe, expect, it } from 'vitest';

import { panelFmsDe, type MedicionFms } from '../fms';

const NOMBRES: Readonly<Record<string, string>> = {
  'P-24': 'FMS · sentadilla profunda',
  'P-25': 'FMS · paso de valla',
  'P-26': 'FMS · zancada en línea',
  'P-27': 'FMS · movilidad de hombro',
  'P-28': 'FMS · elevación de pierna recta',
  'P-29': 'FMS · estabilidad de tronco',
  'P-30': 'FMS · estabilidad rotatoria',
};

const lado = (l: 'derecho' | 'izquierdo') => ({ lado: l });

const m = (pruebaId: string, valor: number, condiciones: Record<string, string> = {}): MedicionFms => ({
  pruebaId,
  valor,
  condiciones,
});

/** Las siete completas: dos únicas en 3, cinco bilaterales con sus dos lados. */
const COMPLETO: readonly MedicionFms[] = [
  m('P-24', 3),
  m('P-25', 2, lado('derecho')),
  m('P-25', 3, lado('izquierdo')),
  m('P-26', 2, lado('derecho')),
  m('P-26', 2, lado('izquierdo')),
  m('P-27', 1, lado('derecho')),
  m('P-27', 3, lado('izquierdo')),
  m('P-28', 3, lado('derecho')),
  m('P-28', 3, lado('izquierdo')),
  m('P-29', 2),
  m('P-30', 2, lado('derecho')),
  m('P-30', 2, lado('izquierdo')),
];

describe('panelFmsDe', () => {
  it('CONTROL POSITIVO · con las siete completas, calcula el total', () => {
    const p = panelFmsDe(COMPLETO, NOMBRES);
    expect(p).not.toBeNull();
    expect(p!.maximo).toBe(21);
    // 3 + min(2,3)=2 + min(2,2)=2 + min(1,3)=1 + min(3,3)=3 + 2 + min(2,2)=2 = 15
    expect(p!.total).toBe(15);
  });

  it('en cada bilateral, la puntuación final es la del lado MÁS BAJO', () => {
    const p = panelFmsDe(COMPLETO, NOMBRES)!;
    const hombro = p.pruebas.find((x) => x.pruebaId === 'P-27')!;
    expect(hombro.puntuacion).toBe(1); // min(1, 3)
  });

  it('con una sola prueba ausente, no hay panel', () => {
    const sinRotatoria = COMPLETO.filter((x) => x.pruebaId !== 'P-30');
    expect(panelFmsDe(sinRotatoria, NOMBRES)).toBeNull();
  });

  it('con una bilateral a la que le falta UN lado, tampoco', () => {
    const sinIzquierdo = COMPLETO.filter(
      (x) => !(x.pruebaId === 'P-28' && x.condiciones.lado === 'izquierdo'),
    );
    expect(panelFmsDe(sinIzquierdo, NOMBRES)).toBeNull();
  });

  it('sin ninguna medición, tampoco', () => {
    expect(panelFmsDe([], NOMBRES)).toBeNull();
  });

  it('los nombres vienen del catálogo que se le pasa, no de un código', () => {
    const p = panelFmsDe(COMPLETO, NOMBRES)!;
    expect(p.pruebas.map((x) => x.nombre)).toContain('FMS · sentadilla profunda');
    expect(p.pruebas.map((x) => x.nombre)).not.toContain('P-24');
  });

  it('EL TOTAL NO LLEVA NINGUNA CLASIFICACIÓN: es un número, sin banda ni juicio', () => {
    // El punto de corte de 14 está prohibido para P-09 (`moran_fms_2017`), y
    // esta prueba comprueba que el tipo que compone las 7 sueltas ni siquiera
    // tiene un campo donde meter una clasificación semejante.
    const p = panelFmsDe(COMPLETO, NOMBRES)!;
    expect(Object.keys(p).sort()).toEqual(['maximo', 'pruebas', 'total']);
  });
});
