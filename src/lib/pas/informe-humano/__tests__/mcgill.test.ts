// ── El panel de McGill, en aislamiento ──────────────────────────────────────
//
// Los tres cocientes en sí —sus fórmulas, sus criterios, sus casos límite—
// están probados en `calculo/__tests__/derivados.test.ts`. Este fichero
// protege solo lo que `mcgill.ts` añade encima: LEER las cuatro mediciones de
// la lista de la evaluación, distinguir los dos lados del puente lateral por
// su condición, y quedarse con la ÚLTIMA si una prueba se registró más de
// una vez.

import { describe, expect, it } from 'vitest';

import { panelMcGillDe, type MedicionMcGill } from '../mcgill';

const m = (
  pruebaId: string,
  valor: number,
  condiciones: Record<string, string> = {},
): MedicionMcGill => ({ pruebaId, valor, condiciones });

const COMPLETO: readonly MedicionMcGill[] = [
  m('P-21', 90),
  m('P-23', 130),
  m('P-22', 80, { lado: 'derecho' }),
  m('P-22', 70, { lado: 'izquierdo' }),
];

describe('panelMcGillDe', () => {
  it('CONTROL POSITIVO · con las cuatro mediciones, calcula los tres cocientes', () => {
    const p = panelMcGillDe(COMPLETO);
    expect(p).not.toBeNull();
    expect(p!.cocientes).toHaveLength(3);
    const flexExt = p!.cocientes.find((c) => c.id === 'flexion_extension')!;
    expect(flexExt.valor).toBeCloseTo(90 / 130, 2);
  });

  it('sin ninguna medición, no hay panel', () => {
    expect(panelMcGillDe([])).toBeNull();
  });

  it('P-22 sin `condiciones.lado` no cuenta como ningún lado', () => {
    // Una medición mal etiquetada no es lo mismo que una ausente, pero
    // tampoco puede adivinarse de qué lado es: si se contara como cualquiera
    // de los dos, un registro sin lado declarado completaría el cociente con
    // un dato que nadie confirmó.
    const p = panelMcGillDe([m('P-21', 90), m('P-23', 130), m('P-22', 80)]);
    expect(p).toBeNull();
  });

  it('con dos registros del mismo lado, se queda con el ÚLTIMO', () => {
    const p = panelMcGillDe([
      ...COMPLETO,
      m('P-22', 40, { lado: 'derecho' }), // repite el derecho, más tarde en la lista
    ]);
    const derIzq = p!.cocientes.find((c) => c.id === 'lateral_derecha_izquierda')!;
    expect(derIzq.valor).toBeCloseTo(40 / 70, 2);
  });

  it('la fuente se cita con autor, año, título y publicación', () => {
    const p = panelMcGillDe(COMPLETO)!;
    expect(p.fuente).toBe(
      "American Council on Exercise. (2015). McGill's Torso Muscular Endurance Test Battery. " +
        'ACE Certified Medical Exercise Specialist.',
    );
  });

  it('cada cociente trae su criterio en la forma que EvidenceScale sabe dibujar', () => {
    // No es una norma poblacional, así que no puede faltar la línea que sí
    // dibuja cualquier otra prueba con evidencia: es la misma pieza que
    // dibuja sit-and-reach, aplicada al punto de corte del manual.
    const p = panelMcGillDe(COMPLETO)!;
    const flexExt = p.cocientes.find((c) => c.id === 'flexion_extension')!;
    expect(flexExt.representacion).toEqual({
      clase: 'punto_de_corte',
      valor: 1,
      porDebajo: 'Dentro del criterio del manual',
      porEncima: 'Fuera del criterio del manual',
    });

    const derIzq = p.cocientes.find((c) => c.id === 'lateral_derecha_izquierda')!;
    expect(derIzq.representacion).toEqual({ clase: 'rango', min: 0.95, max: 1.05 });

    const latExt = p.cocientes.find((c) => c.id === 'lateral_extension')!;
    expect(latExt.representacion).toEqual({
      clase: 'punto_de_corte',
      valor: 0.75,
      porDebajo: 'Dentro del criterio del manual',
      porEncima: 'Fuera del criterio del manual',
    });
  });
});
