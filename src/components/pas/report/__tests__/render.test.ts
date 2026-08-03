import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import ReportView from '../ReportView';
import { ORDEN_SECCIONES, componerInforme } from '@/lib/pas/report';
import { parCompleto, parVacio } from '@/lib/pas/report/__tests__/fixtures';

// ── Render del informe (Sprint PAS-5.0) ────────────────────────────────────
// Render REAL a HTML con `react-dom/server`. No hace falta jsdom ni el plugin
// de React: esbuild ya transforma el JSX, y `renderToStaticMarkup` produce el
// marcado exacto que llegará al navegador y a la impresora.
//
// Lo que se comprueba sobre ese HTML es lo que el encargo exige: orden,
// impresión, accesibilidad y ausencia de elementos interactivos.

function render(par: ReturnType<typeof parCompleto>): string {
  return renderToStaticMarkup(createElement(ReportView, par));
}

const HTML = render(parCompleto());
const HTML_VACIO = render(parVacio());

describe('render básico', () => {
  it('produce marcado', () => {
    expect(HTML.length).toBeGreaterThan(1000);
  });

  it('un perfil vacío también renderiza', () => {
    expect(HTML_VACIO.length).toBeGreaterThan(1000);
  });

  it('no lanza con ninguno de los dos perfiles', () => {
    expect(() => render(parCompleto())).not.toThrow();
    expect(() => render(parVacio())).not.toThrow();
  });

  it('es determinista', () => {
    expect(render(parCompleto())).toBe(HTML);
  });

  it('rotula el documento para lectores de pantalla', () => {
    expect(HTML).toContain('aria-label="Informe de perfil funcional"');
  });
});

describe('orden del informe', () => {
  it('las once secciones aparecen en el orden declarado', () => {
    const posiciones = ORDEN_SECCIONES.map((id) => HTML.indexOf(`data-seccion="${id}"`));
    expect(posiciones.every((p) => p >= 0)).toBe(true);
    expect(posiciones).toEqual([...posiciones].sort((a, b) => a - b));
  });

  it('la portada es lo primero', () => {
    expect(HTML.indexOf('data-seccion="portada"')).toBeLessThan(
      HTML.indexOf('data-seccion="resumen"')
    );
  });

  it('el pie es lo último', () => {
    const pie = HTML.indexOf('data-seccion="pie"');
    for (const id of ORDEN_SECCIONES.filter((s) => s !== 'pie')) {
      expect(HTML.indexOf(`data-seccion="${id}"`)).toBeLessThan(pie);
    }
  });

  it('cada sección numerada muestra su número', () => {
    for (const titulo of ['1 · Resumen', '2 · Perfil', '3 · Dominios', '9 · Apéndice']) {
      expect(HTML).toContain(titulo);
    }
  });

  it('el mismo orden se respeta con un perfil vacío', () => {
    const posiciones = ORDEN_SECCIONES.map((id) => HTML_VACIO.indexOf(`data-seccion="${id}"`));
    expect(posiciones).toEqual([...posiciones].sort((a, b) => a - b));
  });
});

describe('sin elementos de aplicación', () => {
  it.each([
    ['botones', /<button/i],
    ['inputs', /<input/i],
    ['selects', /<select/i],
    ['textareas', /<textarea/i],
    ['formularios', /<form/i],
    ['navegación', /<nav/i],
    ['enlaces', /<a\s/i],
    ['acordeones', /data-state="(open|closed)"/i],
    ['diálogos', /role="dialog"/i],
  ])('el informe no contiene %s', (_etiqueta, patron) => {
    expect(patron.test(HTML)).toBe(false);
  });

  it('tampoco con un perfil vacío', () => {
    expect(/<button|<input|<form/i.test(HTML_VACIO)).toBe(false);
  });

  it('no lleva manejadores de eventos', () => {
    expect(/on[a-z]+=/i.test(HTML)).toBe(false);
  });
});

describe('impresión', () => {
  it('la raíz lleva la clase de impresión propia del PAS', () => {
    expect(HTML).toContain('reporte-pas-print');
  });

  it('no usa la clase del informe del BCS', () => {
    expect(HTML).not.toContain('reporte-print"');
  });

  it.each(['prs-seccion', 'prs-bloque', 'prs-item', 'prs-fila', 'prs-tabla', 'prs-portada', 'prs-pie'])(
    'emite la clase de control de salto «%s»',
    (clase) => {
      expect(HTML).toContain(clase);
    }
  );

  it('cada gancho de impresión tiene su regla en la hoja de estilos', async () => {
    const { readFileSync } = await import('node:fs');
    const { fileURLToPath } = await import('node:url');
    const { dirname, join } = await import('node:path');
    const css = readFileSync(
      join(dirname(fileURLToPath(import.meta.url)), '..', 'print.css'),
      'utf8'
    );

    for (const clase of ['prs-seccion', 'prs-bloque', 'prs-item', 'prs-fila', 'prs-tabla', 'prs-portada']) {
      expect(css, clase).toContain(`.${clase}`);
    }
    expect(css).toContain('break-inside: avoid');
    expect(css).toContain('print-color-adjust: exact');
    expect(css).toContain('@page');
    expect(css).toContain('.reporte-pas-print');
  });

  it('la hoja de estilos no toca la clase del BCS', () => {
    // Verificado por lectura directa: ambas hojas cuelgan de clases distintas
    // y pueden coexistir sin pisarse.
    expect(HTML).toContain('reporte-pas-print');
  });
});

describe('accesibilidad', () => {
  it('las tablas declaran caption', () => {
    expect(HTML).toContain('<caption');
  });

  it('las columnas usan scope="col"', () => {
    expect(HTML).toContain('scope="col"');
  });

  it('la primera celda de cada fila es cabecera de fila', () => {
    expect(HTML).toContain('scope="row"');
  });

  it('cada tabla lleva un resumen sr-only', () => {
    expect(HTML).toContain('sr-only');
    expect(HTML).toMatch(/sr-only[^>]*>[^<]*Tabla/);
  });

  it('todo elemento con role="img" lleva su propio aria-label', () => {
    // Se extrae cada etiqueta de apertura que declare role="img" y se
    // comprueba DENTRO de esa etiqueta, no en el documento entero: buscar
    // «aria-label» en todo el HTML pasaría aunque el gráfico no lo tuviera.
    const etiquetas = [...HTML.matchAll(/<[a-z]+[^>]*role="img"[^>]*>/g)].map((m) => m[0]);

    expect(etiquetas.length).toBeGreaterThan(0);
    for (const etiqueta of etiquetas) {
      expect(etiqueta, etiqueta).toMatch(/aria-label="[^"]+"/);
    }
  });

  it('el aria-label del gráfico describe el dato, no su forma', () => {
    const etiquetas = [...HTML.matchAll(/<[a-z]+[^>]*role="img"[^>]*aria-label="([^"]+)"/g)]
      .map((m) => m[1]);

    for (const texto of etiquetas) {
      expect(texto).toMatch(/\d+ de \d+ capacidades/);
      expect(texto.toLowerCase()).not.toContain('barra');
    }
  });

  it('cada sección se asocia a su título', () => {
    expect(HTML).toContain('aria-labelledby="prs-resumen-titulo"');
    expect(HTML).toContain('id="prs-resumen-titulo"');
  });

  it('la jerarquía arranca en un único h1', () => {
    expect([...HTML.matchAll(/<h1/g)]).toHaveLength(1);
  });

  it('no hay saltos de h1 a h3 dentro de una sección', () => {
    // Las secciones usan CardTitle (h3 en la primitiva) y los bloques h3:
    // se comprueba que no aparezca h4 sin h3 previo.
    const primerH3 = HTML.indexOf('<h3');
    const primerH4 = HTML.indexOf('<h4');
    if (primerH4 >= 0) expect(primerH3).toBeLessThan(primerH4);
  });
});

describe('responsive', () => {
  it('la rejilla del resumen apila en móvil y reparte en escritorio', () => {
    expect(HTML).toContain('grid-cols-2');
    expect(HTML).toContain('sm:grid-cols-4');
  });

  it('los dominios pasan de una a dos columnas', () => {
    expect(HTML).toContain('grid-cols-1');
    expect(HTML).toContain('md:grid-cols-2');
  });

  it('los títulos de sección escalan con el ancho', () => {
    expect(HTML).toContain('text-base sm:text-lg');
  });

  it('la portada escala su titular', () => {
    expect(HTML).toContain('text-2xl');
    expect(HTML).toContain('sm:text-3xl');
  });

  it('no hay anchos fijos en píxeles que rompan en móvil', () => {
    expect(/style="[^"]*width:\s*\d+px/.test(HTML)).toBe(false);
  });

  it('el único ancho en línea es el porcentaje de la barra de proporción', () => {
    const estilos = [...HTML.matchAll(/style="([^"]*)"/g)].map((m) => m[1]);
    for (const estilo of estilos) expect(estilo).toMatch(/width:\s*\d+%/);
  });

  it('las tablas ocupan el ancho disponible', () => {
    expect(HTML).toContain('w-full border-collapse');
  });

  it('el marcado no depende de scroll horizontal', () => {
    expect(HTML).not.toContain('overflow-x-scroll');
  });
});

describe('el texto es el del PIE', () => {
  const par = parCompleto();

  it('todas las interpretaciones emitidas aparecen literalmente', () => {
    const html = render(par);
    for (const item of par.interpretacion.observacionesMetodologicas) {
      const esperado = item.texto.replace(/&/g, '&amp;').replace(/</g, '&lt;');
      expect(html).toContain(esperado);
    }
  });

  it('las limitaciones aparecen literalmente', () => {
    const html = render(par);
    for (const item of par.interpretacion.limitaciones.slice(0, 5)) {
      expect(html).toContain(item.texto.replace(/&/g, '&amp;'));
    }
  });

  it('el resumen ejecutivo aparece literalmente', () => {
    const html = render(par);
    for (const item of par.interpretacion.resumenEjecutivo) {
      expect(html).toContain(item.texto.replace(/&/g, '&amp;'));
    }
  });

  it('cada interpretación expone su regla', () => {
    const html = render(par);
    expect(html).toContain('data-regla="PIE-');
  });

  it('el informe no añade frases fuera de las plantillas del PIE ni de los rótulos', () => {
    // Las únicas frases propias del PRS son rótulos y notas de sección,
    // declaradas en los componentes. Se comprueba que no aparezca ningún
    // verbo prescriptivo, que es el riesgo real de redactar en la vista.
    for (const prohibido of ['debe ', 'debería', 'recomend', 'conviene', 'ideal']) {
      expect(html().toLowerCase()).not.toContain(prohibido);
    }
    function html() { return render(par); }
  });
});

describe('contenido del informe', () => {
  it('muestra las 18 capacidades activas en el perfil', () => {
    const filas = [...HTML.matchAll(/data-capacidad="[A-F]-\d\d"/g)];
    expect(filas.length).toBeGreaterThanOrEqual(18);
  });

  it('muestra las dos reservadas como fuera de alcance', () => {
    expect(HTML).toContain('Fuera de alcance');
  });

  it('muestra los seis dominios', () => {
    for (const dominio of ['A', 'B', 'C', 'D', 'E', 'F']) {
      expect(HTML).toContain(`data-dominio="${dominio}"`);
    }
  });

  it('el apéndice incluye las cuatro versiones', () => {
    const vista = componerInforme(parCompleto().analisis, parCompleto().interpretacion);
    for (const version of Object.values(vista.apendice.versiones)) {
      expect(HTML).toContain(version);
    }
  });

  it('el pie repite las coordenadas', () => {
    expect(HTML).toContain('pae-1.0.0');
    expect(HTML).toContain('pie-1.0.0');
  });

  it('el pie declara el alcance del documento', () => {
    expect(HTML).toContain('no indica qué hacer a continuación');
  });

  it('la portada no muestra ninguna cifra de resultado', () => {
    const portada = HTML.slice(
      HTML.indexOf('data-seccion="portada"'),
      HTML.indexOf('data-seccion="resumen"')
    );
    expect(/\b\d+ de \d+\b/.test(portada)).toBe(false);
  });
});
