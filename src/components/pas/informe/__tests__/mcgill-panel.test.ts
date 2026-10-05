// ── Render del panel de McGill ──────────────────────────────────────────────
//
// Protege que el panel realmente DIBUJE la línea de cada cociente con
// `EvidenceScale` — antes de esto, el panel solo mostraba el número y el
// «cumple / no cumple» en texto, sin el gráfico que sí tienen las demás
// pruebas con evidencia.

import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { PanelMcGill } from '@/lib/pas/informe-humano';
import McGillPanel from '../McGillPanel';

const PANEL: PanelMcGill = {
  cocientes: [
    {
      id: 'flexion_extension',
      nombre: 'Flexión : extensión',
      criterio: 'menor que 1,00',
      valor: 0.67,
      cumple: true,
      representacion: {
        clase: 'punto_de_corte',
        valor: 1,
        porDebajo: 'Dentro del criterio del manual',
        porEncima: 'Fuera del criterio del manual',
      },
    },
    {
      id: 'lateral_derecha_izquierda',
      nombre: 'Puente derecho : puente izquierdo',
      criterio: 'a menos de 0,05 de 1,00',
      valor: 1.36,
      cumple: false,
      representacion: { clase: 'rango', min: 0.95, max: 1.05 },
    },
    {
      id: 'lateral_extension',
      nombre: 'Puente lateral : extensión',
      criterio: 'menor que 0,75',
      valor: 0.6,
      cumple: true,
      representacion: {
        clase: 'punto_de_corte',
        valor: 0.75,
        porDebajo: 'Dentro del criterio del manual',
        porEncima: 'Fuera del criterio del manual',
      },
    },
  ],
  fuente: "American Council on Exercise. (2015). McGill's Torso Muscular Endurance Test Battery.",
};

const html = renderToStaticMarkup(createElement(McGillPanel, { panel: PANEL }));

describe('McGillPanel dibuja la línea de cada cociente', () => {
  it('las tres escalas se dibujan, con la forma que le corresponde a cada una', () => {
    expect((html.match(/data-clase="punto-de-corte"/g) ?? []).length).toBe(2);
    expect((html.match(/data-clase="rango"/g) ?? []).length).toBe(1);
  });

  it('el cumplimiento se sigue diciendo en palabras, no solo con la línea', () => {
    expect(html).toContain('Cumple el criterio');
    expect(html).toContain('No cumple el criterio');
  });

  it('el veredicto NO se repite: la línea describe la zona, no copia «cumple»', () => {
    // Dos cocientes cumplen y uno no; si la línea repitiera el veredicto,
    // «Cumple el criterio» aparecería más veces de las que hay tarjetas que
    // cumplen. Es el mismo defecto que ya se corrigió en `EvidenceBlock`.
    const cumplen = PANEL.cocientes.filter((c) => c.cumple).length;
    const apariciones = (html.match(/(?<!No )Cumple el criterio/g) ?? []).length;
    expect(apariciones).toBe(cumplen);
  });

  it('la fuente aparece', () => {
    expect(html).toContain('American Council on Exercise');
  });
});
