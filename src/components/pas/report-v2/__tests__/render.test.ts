// ── Render del Performance Clinical Report v2 (PRS v2.0) ───────────────────
//
// Render REAL a HTML con `react-dom/server`, igual que el informe v1. No hace
// falta jsdom: esbuild ya transforma el JSX y `renderToStaticMarkup` produce el
// marcado exacto que llegará al navegador y a la impresora.

import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import ReportViewV2 from '../ReportViewV2';
import NormativeRangeBar from '../NormativeRangeBar';
import UnavailableNorm from '../UnavailableNorm';
import WarningBlock from '../WarningBlock';
import ComparabilityPanel from '../ComparabilityPanel';
import EvidenceMatrix from '../EvidenceMatrix';
import { escalar } from '@/lib/pas/report-v2';
import {
  SUJETO_CO_20,
  informe,
  informeEnsin,
  informeUni,
  registroSinNorma,
} from '@/lib/pas/report-v2/__tests__/fixtures';

const render = (informeV2: ReturnType<typeof informeUni>): string =>
  renderToStaticMarkup(createElement(ReportViewV2, { informe: informeV2 }));

const HTML = render(informeUni());
const HTML_ENSIN = render(informeEnsin());
const HTML_SIN = render(informe([registroSinNorma('x', 'CMJ-01')], SUJETO_CO_20));

const CSS_BRUTO = readFileSync(
  join(process.cwd(), 'src/components/pas/report-v2/print.css'),
  'utf-8',
);
/**
 * La hoja sin comentarios.
 *
 * Su cabecera EXPLICA que no pisa `.reporte-pas-print` ni `.reporte-print`, así
 * que auditar el fichero en bruto haría saltar la comprobación contra el texto
 * que documenta la prohibición. Es el mismo error que el hallazgo H-02: se
 * audita quién escribe la regla, no qué palabras aparecen.
 */
const CSS = CSS_BRUTO.replace(/\/\*[\s\S]*?\*\//g, '');

// ─── Render básico ──────────────────────────────────────────────────────────

describe('render básico', () => {
  it('produce marcado', () => {
    expect(HTML.length).toBeGreaterThan(1000);
  });

  it('un informe sin ninguna norma también renderiza', () => {
    expect(HTML_SIN.length).toBeGreaterThan(500);
  });

  it('no lanza con ninguno de los tres casos', () => {
    expect(() => render(informeUni())).not.toThrow();
    expect(() => render(informeEnsin())).not.toThrow();
  });

  it('es determinista', () => {
    expect(render(informeUni())).toBe(HTML);
  });

  it('rotula el documento', () => {
    expect(HTML).toContain('aria-label="Informe clínico de perfil normativo"');
  });

  it('cuelga de su propia clase de impresión', () => {
    expect(HTML).toContain('reporte-prs2-print');
    // Y no de la del informe v1, que tiene su propia hoja.
    expect(HTML).not.toContain('reporte-pas-print');
  });
});

// ─── Orden de las secciones ─────────────────────────────────────────────────

describe('orden del informe', () => {
  const pos = (id: string) => HTML.indexOf(`data-seccion-v2="${id}"`);

  it('las secciones aparecen en el orden declarado', () => {
    const orden = ['portada', 'resumen', 'perfil'].map(pos);
    expect(orden.every((p) => p >= 0)).toBe(true);
    expect(orden).toEqual([...orden].sort((a, b) => a - b));
  });

  it('la portada es lo primero', () => {
    expect(pos('portada')).toBeLessThan(pos('resumen'));
  });

  it('las capacidades sin norma tienen su propia sección', () => {
    expect(HTML_SIN).toContain('data-seccion-v2="sin-norma"');
  });

  it('sin capacidades huérfanas, la sección no se dibuja vacía', () => {
    expect(HTML).not.toContain('data-seccion-v2="sin-norma"');
  });
});

// ─── Portada ────────────────────────────────────────────────────────────────

describe('portada', () => {
  it('lleva nombre, edad y fecha', () => {
    expect(HTML).toContain('Atleta de prueba');
    expect(HTML).toContain('20 años');
    expect(HTML).toContain('2026-08-14');
  });

  it('lleva profesional y código', () => {
    expect(HTML).toContain('Evaluador de prueba');
    expect(HTML).toContain('PRS2-TEST-0001');
  });

  it('lleva el estado científico del informe', () => {
    expect(HTML).toContain('prs2-estado-cientifico');
    expect(HTML).toContain('1 de 1');
  });
});

// ─── La barra ───────────────────────────────────────────────────────────────

describe('barra normativa', () => {
  const escala = escalar(
    [
      { etiqueta: 'P25', valor: 30 },
      { etiqueta: 'P50', valor: 40, principal: true },
      { etiqueta: 'P75', valor: 50 },
    ],
    40,
  );
  const barra = renderToStaticMarkup(
    createElement(NormativeRangeBar, {
      escala,
      valor: 40,
      unidad: 'kg',
      aria: 'Prensión manual: percentil 50 de la población colombiana masculina de 15 años',
      tipo: 'TN-1' as const,
    }),
  );

  it('es un SVG, no una pila de divs', () => {
    expect(barra).toContain('<svg');
    expect(barra).toContain('viewBox');
  });

  it('declara role="img"', () => {
    expect(barra).toContain('role="img"');
  });

  it('lleva el aria-label completo que compuso el modelo de vista', () => {
    expect(barra).toContain('aria-label="Prensión manual: percentil 50');
  });

  it('cada marca lleva su rótulo escrito, no solo su posición', () => {
    for (const e of ['P25', 'P50', 'P75']) expect(barra).toContain(`>${e}</text>`);
  });

  it('el valor observado va escrito junto al punto', () => {
    expect(barra).toContain('40');
    expect(barra).toContain('kg');
  });

  it('la marca principal se distingue por dato, no solo por color', () => {
    expect(barra).toContain('data-principal="true"');
  });

  it('el punto se distingue por forma: halo más círculo', () => {
    expect(barra).toContain('prs2-punto-halo');
    expect(barra).toContain('class="prs2-punto"');
  });

  it('lleva figcaption para lectores de pantalla', () => {
    expect(barra).toContain('<figcaption');
  });

  it('un valor fuera de rango se rotula como tal', () => {
    const fuera = escalar(
      [
        { etiqueta: 'P25', valor: 30 },
        { etiqueta: 'P75', valor: 50 },
      ],
      500,
    );
    const html = renderToStaticMarkup(
      createElement(NormativeRangeBar, {
        escala: fuera,
        valor: 500,
        unidad: 'kg',
        aria: 'x',
        tipo: 'TN-1' as const,
      }),
    );
    expect(html).toContain('data-fuera="true"');
    expect(html).toContain('no representa una posición normativa');
  });

  it('una TN-2 se marca como tal en el DOM', () => {
    const html = renderToStaticMarkup(
      createElement(NormativeRangeBar, {
        escala,
        valor: 40,
        unidad: 'kg',
        aria: 'x',
        tipo: 'TN-2' as const,
      }),
    );
    expect(html).toContain('data-tipo="TN-2"');
  });

  it('el informe completo dibuja una barra por tarjeta', () => {
    expect(HTML.match(/role="img"/g) ?? []).toHaveLength(2);
  });

  it('la barra de la TN-2 lleva las desviaciones en el marcado', () => {
    expect(HTML).toContain('μ+1σ');
    expect(HTML).toContain('μ−2σ');
  });

  it('y la de la TN-1 lleva percentiles publicados', () => {
    expect(HTML).toContain('>P50</text>');
  });
});

// ─── ES-2, conflicto y EQ-3 en pantalla ─────────────────────────────────────

describe('la objeción científica llega al marcado', () => {
  it('la tarjeta declara su estado de evidencia', () => {
    expect(HTML_ENSIN).toContain('data-evidencia="CUESTIONADA"');
  });

  it('y su conflicto', () => {
    expect(HTML_ENSIN).toContain('data-conflicto="CONFLICTO_NO_DETERMINABLE"');
  });

  it('el distintivo de cuestionada se ve, con texto', () => {
    expect(HTML_ENSIN).toContain('Cuestionada');
  });

  it('el conflicto se nombra en el distintivo', () => {
    expect(HTML_ENSIN).toContain('Conflicto documentado');
  });

  it('la advertencia de la ficha se imprime literal', () => {
    expect(HTML_ENSIN).toContain('ENSIN-2015');
    expect(HTML_ENSIN).toContain('4,5 kg');
  });

  it('EQ-3 aparece en el panel de comparabilidad', () => {
    expect(HTML).toContain('EQ-3');
  });

  it('el panel dice cuántas normas se evaluaron', () => {
    expect(HTML).toContain('Normas evaluadas:');
  });

  it('las descartadas llevan su motivo íntegro para lector de pantalla', () => {
    expect(HTML).toContain('Descartadas:');
  });
});

// ─── Capacidades sin norma ──────────────────────────────────────────────────

describe('capacidades sin norma', () => {
  const html = renderToStaticMarkup(
    createElement(UnavailableNorm, {
      tarjeta: { id: 'x', variable: 'CMJ', detalle: 'Sin referencia admisible.' },
    }),
  );

  it('dice «norma no disponible»', () => {
    expect(html).toContain('Norma no disponible');
  });

  it('nunca dice «insuficiente» ni equivalentes', () => {
    expect(html).not.toMatch(/insuficiente|deficiente|bajo|malo/i);
  });

  it('en el informe completo, tampoco', () => {
    const seccion = HTML_SIN.slice(HTML_SIN.indexOf('data-seccion-v2="sin-norma"'));
    expect(seccion).not.toMatch(/insuficiente|deficiente/i);
  });
});

// ─── Advertencias ───────────────────────────────────────────────────────────

describe('advertencias', () => {
  it('se renderizan sin reescribir', () => {
    const texto = 'Texto exacto que no debe tocarse, con cifras: 4,5 kg.';
    const html = renderToStaticMarkup(
      createElement(WarningBlock, { advertencias: [texto] }),
    );
    expect(html).toContain(texto);
  });

  it('sin advertencias no se dibuja el bloque', () => {
    expect(renderToStaticMarkup(createElement(WarningBlock, { advertencias: [] }))).toBe('');
  });

  it('el informe agrega las del conjunto', () => {
    expect(HTML).toContain('Advertencias del conjunto');
  });
});

// ─── Matriz y panel aislados ────────────────────────────────────────────────

describe('componentes aislados', () => {
  it('la matriz de evidencia es una tabla real', () => {
    const html = renderToStaticMarkup(
      createElement(EvidenceMatrix, {
        filas: [{ dimension: 'Calidad', estado: 'Moderada' }],
        titulo: 'Evidencia',
      }),
    );
    expect(html).toContain('<table');
    expect(html).toContain('<caption');
    expect(html).toContain('scope="row"');
  });

  it('el panel de comparabilidad no depende del símbolo para el lector', () => {
    const html = renderToStaticMarkup(
      createElement(ComparabilityPanel, {
        panel: {
          evaluadas: 10,
          comparables: [{ normaId: 'N1', identidad: 'Colombia · 20 años', tipo: 'TN-1' }],
          descartes: [
            {
              naturaleza: 'no comparables',
              motivoCorto: 'método EQ-3',
              motivo: 'Métodos en EQ-3',
              total: 9,
              ejemplos: ['Brasil'],
            },
          ],
        },
      }),
    );
    expect(html).toContain('aria-hidden="true"');
    expect(html).toContain('Comparable:');
    expect(html).toContain('Descartadas:');
    expect(html).toContain('no comparables');
    expect(html).toContain('TN-1');
    expect(html).toContain('Métodos en EQ-3');
  });

  it('un panel sin comparables lo explica sin culpar al atleta', () => {
    const html = renderToStaticMarkup(
      createElement(ComparabilityPanel, {
        panel: { evaluadas: 356, comparables: [], descartes: [] },
      }),
    );
    expect(html).toContain('evidencia disponible');
    expect(html).not.toMatch(/insuficiente|deficiente/i);
  });
});

// ─── Responsive ─────────────────────────────────────────────────────────────

describe('responsive', () => {
  it('el perfil normativo es de una columna en móvil y dos desde md', () => {
    expect(HTML).toContain('grid-cols-1 items-start gap-4 md:grid-cols-2');
  });

  it('el resumen crece hasta tres columnas', () => {
    expect(HTML).toContain('grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3');
  });

  it('la barra ocupa el ancho disponible sin ancho fijo en píxeles', () => {
    expect(HTML).toContain('w-full');
    expect(HTML).not.toMatch(/<svg[^>]*width="\d+"/);
  });
});

// ─── Impresión ──────────────────────────────────────────────────────────────

describe('impresión', () => {
  it('la hoja cuelga de la clase raíz del v2 y no pisa las otras', () => {
    expect(CSS).toContain('.reporte-prs2-print');
    expect(CSS).not.toContain('.reporte-pas-print');
    expect(CSS).not.toContain('.reporte-print');
    // Control positivo: la comprobación sabe encontrar una regla ajena.
    expect('.reporte-pas-print { color: red }').toContain('.reporte-pas-print');
  });

  it('define página A4 con márgenes', () => {
    expect(CSS).toContain('size: A4');
    expect(CSS).toMatch(/margin:\s*18mm/);
  });

  it('las barras no se parten entre páginas', () => {
    expect(CSS).toMatch(/\.prs2-barra svg[\s\S]*?break-inside: avoid/);
  });

  it('los rótulos del eje suben a opacidad plena en papel', () => {
    expect(CSS).toMatch(/\.prs2-barra text[\s\S]*?fill-opacity: 1/);
  });

  it('el trazo se rasteriza con precisión geométrica', () => {
    expect(CSS).toContain('shape-rendering: geometricPrecision');
  });

  it('preserva los colores informativos de los distintivos', () => {
    expect(CSS).toContain('print-color-adjust: exact');
  });

  it('la portada ocupa su propia página', () => {
    expect(CSS).toMatch(/\.prs2-portada[\s\S]*?page-break-after: always/);
  });

  it('las tarjetas no se parten', () => {
    expect(CSS).toMatch(/\.prs2-tarjeta[\s\S]*?break-inside: avoid/);
  });

  it('las advertencias no se separan de su norma', () => {
    expect(CSS).toMatch(/\.prs2-advertencias[\s\S]*?break-inside: avoid/);
  });

  it('las leyendas ocultas vuelven a ser visibles en papel', () => {
    expect(CSS).toMatch(/\.prs2-barra figcaption[\s\S]*?position: static/);
  });

  it('el motivo del NIE se imprime a plena opacidad', () => {
    expect(CSS).toMatch(/\.prs2-motivo[\s\S]*?opacity: 1/);
  });

  it('fija la rejilla del papel, que no depende del ancho de ventana', () => {
    expect(CSS).toMatch(/data-seccion-v2="perfil"[\s\S]*?grid-template-columns: 1fr 1fr/);
  });

  it('oculta la aplicación alrededor del informe', () => {
    expect(CSS).toMatch(/nav,[\s\S]*?display: none/);
  });
});

// ─── Accesibilidad ──────────────────────────────────────────────────────────

describe('accesibilidad', () => {
  it('cada barra tiene role e etiqueta', () => {
    const roles = HTML.match(/role="img"/g) ?? [];
    const labels = HTML.match(/aria-label="[^"]{20,}"/g) ?? [];
    expect(roles.length).toBeGreaterThan(0);
    expect(labels.length).toBeGreaterThanOrEqual(roles.length);
  });

  it('el aria-label nombra población, valor y estado', () => {
    const m = HTML.match(/aria-label="(Fuerza de prensión[^"]+)"/);
    expect(m).not.toBeNull();
    expect(m![1]).toMatch(/kg/);
    expect(m![1]).toMatch(/Colombia/);
    expect(m![1]).toMatch(/Calidad/);
  });

  it('ninguna sección depende solo del color: los símbolos llevan texto', () => {
    const simbolos = (HTML.match(/[✓✕]/g) ?? []).length;
    const ocultos = (HTML.match(/aria-hidden="true"/g) ?? []).length;
    expect(ocultos).toBeGreaterThanOrEqual(simbolos);
  });

  it('las tablas se anuncian con caption', () => {
    expect(HTML).toContain('<caption');
  });

  it('las secciones llevan rótulo accesible', () => {
    expect(HTML).toContain('aria-label="Resumen ejecutivo"');
    expect(HTML).toContain('aria-label="Perfil normativo"');
  });

  it('los encabezados van en jerarquía: h1 en portada, h2 por sección', () => {
    expect(HTML.indexOf('<h1')).toBeLessThan(HTML.indexOf('<h2'));
    expect((HTML.match(/<h1/g) ?? []).length).toBe(1);
  });

  it('el estado de la evidencia se anuncia, no solo se colorea', () => {
    expect(HTML).toContain('Estado de la evidencia:');
  });
});

// ─── Pureza de los componentes ──────────────────────────────────────────────

describe('componentes puros', () => {
  const RAIZ = join(process.cwd(), 'src/components/pas/report-v2');
  const FICHEROS = [
    'ComparabilityPanel.tsx',
    'EvidenceMatrix.tsx',
    'NormativeCard.tsx',
    'NormativeRangeBar.tsx',
    'ReportViewV2.tsx',
    'ScientificBadge.tsx',
    'SummaryMetric.tsx',
    'UnavailableNorm.tsx',
    'WarningBlock.tsx',
  ].map((f) => [f, readFileSync(join(RAIZ, f), 'utf-8')] as const);

  const sinComentarios = (s: string) =>
    s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  it('los ocho componentes del encargo existen', () => {
    for (const f of [
      'NormativeRangeBar',
      'NormativeCard',
      'EvidenceMatrix',
      'ComparabilityPanel',
      'ScientificBadge',
      'WarningBlock',
      'UnavailableNorm',
      'SummaryMetric',
    ]) {
      expect(FICHEROS.map(([n]) => n)).toContain(`${f}.tsx`);
    }
  });

  it.each(FICHEROS)('%s no lleva estado ni interactividad', (_f, src) => {
    const codigo = sinComentarios(src);
    for (const [nombre, patron] of [
      ['use client', /"use client"/],
      ['useState', /useState/],
      ['useEffect', /useEffect/],
      ['onClick', /onClick/],
      ['fetch', /\bfetch\(/],
      ['Date', /new Date\(|Date\.now/],
      ['Math.random', /Math\.random/],
    ] as const) {
      expect(codigo, nombre).not.toMatch(patron);
    }
  });

  it.each(FICHEROS)('%s no hace ciencia', (_f, src) => {
    const codigo = sinComentarios(src)
      .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
      .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
      .replace(/`(?:[^`\\]|\\.)*`/g, '``');
    for (const [nombre, patron] of [
      ['interpolar', /\b(interpolar|extrapolar)\b/i],
      ['percentil calculado', /\bpercentil\w*\s*[=(]/i],
      ['puntuación', /\b(score|puntaje|ranking)\b/i],
      ['conversión', /\bconvertir\w*\s*\(/i],
      ['ordenación', /\.sort\(/],
    ] as const) {
      expect(codigo, nombre).not.toMatch(patron);
    }
  });

  it.each(FICHEROS)('%s no importa la NKB ni el motor directamente', (_f, src) => {
    // Los componentes consumen el modelo de vista, nunca el NIE ni las fichas.
    expect(sinComentarios(src)).not.toMatch(/from ["']@\/lib\/nie/);
    expect(sinComentarios(src)).not.toMatch(/nkb\/cargador/);
  });

  it('sólo usan primitivas de marca, nunca ui/ directamente', () => {
    for (const [f, src] of FICHEROS) {
      expect(sinComentarios(src), f).not.toMatch(/from ["']@\/components\/ui\//);
    }
  });

  it('ningún componente escribe un juicio de valor', () => {
    const JUICIO = /\b(bajo|alto|bueno|malo|deficiente|insuficiente|excelente|[oó]ptimo)\b/i;
    for (const [f, src] of FICHEROS) {
      const literales = sinComentarios(src).match(/>[^<>{}]{4,}</g) ?? [];
      for (const l of literales) expect(l, `${f}: ${l}`).not.toMatch(JUICIO);
    }
    expect('>resultado bajo<').toMatch(JUICIO);
  });
});
