// ── Render del panel de VO2máx estimado ─────────────────────────────────────
//
// Protege que el panel realmente DIBUJE «Tu posición» con `EvidenceScale` —
// antes de esto, la tarjeta solo mostraba el texto de `redactar`, sin el
// gráfico de bandas que sí tienen Cooper, AHA y Rivera cuando se registran a
// mano bajo P-12. Usa lecturas REALES de `leerEvidencia`, igual que
// `integracion.test.ts`: nada se fabrica a mano.

import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import { leerEvidencia } from '@/lib/pas/evidencia';
import type { PanelVo2Estimado } from '@/lib/pas/informe-humano';
import Vo2EstimadoPanel from '../Vo2EstimadoPanel';

const ADULTO_CO = { edad: 25, sexo: 'M' as const, pais: 'CO', pesoKg: null };
const SIN_PAIS = { edad: 25, sexo: null, pais: null, pesoKg: null };

function panel(evidencia: ReturnType<typeof leerEvidencia>): PanelVo2Estimado {
  return {
    valor: 38.6,
    unidad: 'mL/kg/min',
    formula: '31,025 + (3,238 × velocidad) − (3,248 × edad*) + (0,1536 × velocidad × edad*)',
    fuente: 'Léger, L. A., Mercier, D., Gadoury, C., y Lambert, J. (1988).',
    evidencia,
  };
}

describe('Vo2EstimadoPanel dibuja Tu posición como cualquier otra prueba', () => {
  it('con una referencia compatible, se dibuja la escala de bandas', () => {
    const evidencia = leerEvidencia(
      { pruebaId: 'P-12', valor: 38.6, unidad: 'mL/kg/min', condiciones: {} },
      ADULTO_CO,
    );
    expect(evidencia.compatibles.length).toBeGreaterThan(0); // control: hay algo que dibujar

    const html = renderToStaticMarkup(createElement(Vo2EstimadoPanel, { panel: panel(evidencia) }));
    expect(html).toContain('data-clase="bandas"');
    expect(html).toContain('Comparado con:');
  });

  it('sin sexo ni país, no hay banda que dibujar, y lo dice en vez de fingir una', () => {
    const evidencia = leerEvidencia(
      { pruebaId: 'P-12', valor: 38.6, unidad: 'mL/kg/min', condiciones: {} },
      SIN_PAIS,
    );
    expect(evidencia.compatibles).toHaveLength(0); // control: nada que dibujar

    const html = renderToStaticMarkup(createElement(Vo2EstimadoPanel, { panel: panel(evidencia) }));
    expect(html).not.toContain('data-clase="bandas"');
    expect(html).toContain('pas10e-evidencia');
  });

  it('la fórmula y la fuente siguen visibles, marcadas como estimación', () => {
    const evidencia = leerEvidencia(
      { pruebaId: 'P-12', valor: 38.6, unidad: 'mL/kg/min', condiciones: {} },
      ADULTO_CO,
    );
    const html = renderToStaticMarkup(createElement(Vo2EstimadoPanel, { panel: panel(evidencia) }));
    expect(html).toContain('ESTIMACIÓN');
    expect(html).toContain('Léger');
  });
});
