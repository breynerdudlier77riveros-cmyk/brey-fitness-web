// ── Superficie de búsqueda y filtros (Sprint I-02) ─────────────────────────
//
// LO QUE SE PRUEBA AQUÍ, Y LO QUE NO:
//
//   `filtrarAtletas`, `filtrarEvaluaciones` y `deportesDisponibles` ya estaban
//   escritas y probadas en `workspace.test.ts` desde PAS-7.0. Este sprint no
//   añadió lógica: añadió la SUPERFICIE que faltaba para invocarlas, porque
//   hasta ahora solo se podían activar escribiendo la URL a mano.
//
//   Por eso esto no repite las pruebas del filtrado. Comprueba la costura: que
//   los componentes emiten los nombres que las páginas leen, que las páginas
//   pasan lo que leen al servicio, y que los estados de la interfaz —vacío,
//   filtrado sin resultados, sin deportes— se distinguen entre sí.

import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import FiltrosAtletas from '../components/FiltrosAtletas';
import FiltrosEvaluaciones from '../components/FiltrosEvaluaciones';
import { deportesDisponibles, filtrarAtletas, filtrarEvaluaciones } from '../services/consultas';
import { atleta, evaluacion } from './fixtures';

const fuente = (r: string): string => readFileSync(join(process.cwd(), r), 'utf-8');

const RUTA_LISTADO = 'src/app/app/rendimiento/page.tsx';
const RUTA_ATLETA = 'src/app/app/rendimiento/[atletaId]/page.tsx';

// ─── Filtros de atletas ─────────────────────────────────────────────────────

describe('FiltrosAtletas', () => {
  const render = (props: Parameters<typeof FiltrosAtletas>[0]) =>
    renderToStaticMarkup(createElement(FiltrosAtletas, props));

  const base = {
    valores: {},
    deportes: ['Atletismo', 'Natación'],
    total: 5,
    visibles: 5,
  };

  it('es un formulario GET: funciona sin JavaScript', () => {
    const html = render(base);
    expect(html).toContain('method="get"');
    // Sin estado de cliente que hidratar.
    expect(fuente('src/features/performance-workspace/components/FiltrosAtletas.tsx')).not.toContain(
      '"use client"',
    );
  });

  it('emite los tres nombres que la página lee de searchParams', () => {
    const html = render(base);
    for (const nombre of ['q', 'estado', 'deporte']) {
      expect(html, nombre).toContain(`name="${nombre}"`);
    }
  });

  it('los deportes ofrecidos son los que existen, no una lista fija', () => {
    const html = render(base);
    expect(html).toContain('Atletismo');
    expect(html).toContain('Natación');
  });

  it('sin deportes declarados, el desplegable se deshabilita y lo dice', () => {
    const html = render({ ...base, deportes: [] });
    expect(html).toContain('disabled');
    expect(html).toContain('Ninguno declarado');
  });

  it('los controles muestran lo aplicado, no un formulario en blanco', () => {
    const html = render({ ...base, valores: { q: 'lopez', estado: 'activo', deporte: 'Natación' } });
    expect(html).toContain('value="lopez"');
    // Los `select` marcan la opción con `selected`.
    expect(html).toMatch(/<option value="activo"[^>]*selected/);
    expect(html).toMatch(/<option value="Natación"[^>]*selected/);
  });

  it('«Quitar filtros» solo aparece cuando hay alguno aplicado', () => {
    expect(render(base)).not.toContain('Quitar filtros');
    expect(render({ ...base, valores: { q: 'x' } })).toContain('Quitar filtros');
  });

  it('el recuento distingue «hay N» de «N de M coinciden»', () => {
    expect(render(base)).toContain('5 atletas');
    expect(render({ ...base, valores: { q: 'x' }, visibles: 2 })).toContain('2 de 5 atletas');
  });

  it('el singular no dice «1 atletas»', () => {
    expect(render({ ...base, total: 1, visibles: 1 })).toContain('1 atleta');
    expect(render({ ...base, total: 1, visibles: 1 })).not.toContain('1 atletas');
  });

  it('se anuncia a lectores de pantalla', () => {
    const html = render(base);
    expect(html).toContain('role="search"');
    expect(html).toContain('aria-label="Buscar atletas"');
    // El recuento cambia al filtrar: es la única señal de que la lista cambió.
    expect(html).toContain('aria-live="polite"');
  });

  it('cada control tiene su etiqueta visible', () => {
    const html = render(base);
    for (const etiqueta of ['Buscar', 'Estado', 'Deporte']) {
      expect(html, etiqueta).toContain(etiqueta);
    }
  });

  it('es determinista', () => {
    expect(render(base)).toBe(render(base));
  });
});

// ─── Filtros de evaluaciones ────────────────────────────────────────────────

describe('FiltrosEvaluaciones', () => {
  const render = (props: Parameters<typeof FiltrosEvaluaciones>[0]) =>
    renderToStaticMarkup(createElement(FiltrosEvaluaciones, props));

  const base = { valores: {}, rutaLimpia: '/app/rendimiento/a1', total: 4, visibles: 4 };

  it('es un formulario GET sin estado de cliente', () => {
    expect(render(base)).toContain('method="get"');
    expect(
      fuente('src/features/performance-workspace/components/FiltrosEvaluaciones.tsx'),
    ).not.toContain('"use client"');
  });

  it('emite los cuatro nombres que la página lee', () => {
    const html = render(base);
    for (const nombre of ['estado', 'tipo', 'desde', 'hasta']) {
      expect(html, nombre).toContain(`name="${nombre}"`);
    }
  });

  it('las fechas usan el control nativo, que ya entrega yyyy-mm-dd', () => {
    const html = render(base);
    expect(html.match(/type="date"/g) ?? []).toHaveLength(2);
  });

  it('ofrece los seis tipos de evaluación del catálogo', () => {
    const html = render(base);
    for (const t of ['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06']) {
      expect(html, t).toContain(`value="${t}"`);
    }
  });

  it('«Quitar filtros» vuelve a la ruta del atleta, no a la raíz', () => {
    const html = render({ ...base, valores: { estado: 'borrador' } });
    expect(html).toContain('/app/rendimiento/a1');
  });

  it('el recuento usa el plural correcto', () => {
    expect(render({ ...base, total: 1, visibles: 1 })).toContain('1 evaluación');
    expect(render(base)).toContain('4 evaluaciones');
  });

  it('es determinista', () => {
    expect(render(base)).toBe(render(base));
  });
});

// ─── La costura entre componente, página y servicio ─────────────────────────

describe('los nombres del formulario son los que la página lee', () => {
  it('el listado lee q, estado y deporte de searchParams', () => {
    const src = fuente(RUTA_LISTADO);
    expect(src).toMatch(/searchParams:[\s\S]*?q\?:[\s\S]*?estado\?:[\s\S]*?deporte\?:/);
    expect(src).toContain('const { q, estado, deporte } = await searchParams');
  });

  it('y se los pasa a `filtrarAtletas`, sin filtrar por su cuenta', () => {
    const src = fuente(RUTA_LISTADO);
    expect(src).toContain('filtrarAtletas(todos');
    expect(src).toMatch(/busqueda:\s*q/);
    // La página no reimplementa la búsqueda.
    expect(src).not.toMatch(/\.filter\(\s*\(?atleta/);
  });

  it('los deportes salen del servicio, no de una constante en la página', () => {
    const src = fuente(RUTA_LISTADO);
    expect(src).toContain('deportesDisponibles(todos)');
  });

  it('el detalle lee los cuatro y llama a `filtrarEvaluaciones`', () => {
    const src = fuente(RUTA_ATLETA);
    expect(src).toContain('const { estado, tipo, desde, hasta } = await searchParams');
    expect(src).toContain('filtrarEvaluaciones(todas');
  });

  it('filtra ANTES de derivar los informes, que es lo caro', () => {
    const src = fuente(RUTA_ATLETA);
    expect(src.indexOf('filtrarEvaluaciones')).toBeLessThan(src.indexOf('informeDeEvaluacion'));
  });
});

// ─── Que el cableado hace lo que promete, con datos ─────────────────────────

describe('el filtrado sigue siendo del servicio, y funciona', () => {
  const atletas = [
    atleta({ id: 'a1', nombre: 'Ana López', deporte: 'Atletismo' }),
    atleta({ id: 'a2', nombre: 'Beto Ruiz', deporte: 'Natación' }),
    atleta({ id: 'a3', nombre: 'Carla Díaz', deporte: 'Atletismo', estado: 'archivado' }),
  ];

  it('los deportes ofrecidos son exactamente los presentes, sin repetir', () => {
    expect(deportesDisponibles(atletas)).toEqual(['Atletismo', 'Natación']);
  });

  it('buscar por nombre reduce la lista', () => {
    expect(filtrarAtletas(atletas, { busqueda: 'lopez' }).map((a) => a.id)).toEqual(['a1']);
  });

  it('filtrar por deporte y estado se combinan', () => {
    expect(
      filtrarAtletas(atletas, { deporte: 'Atletismo', estado: 'archivado' }).map((a) => a.id),
    ).toEqual(['a3']);
  });

  it('sin filtros no se pierde nadie visible', () => {
    expect(filtrarAtletas(atletas, {})).toHaveLength(3);
  });

  it('las evaluaciones se filtran por rango de fechas', () => {
    const evals = [
      evaluacion({ id: 'e1', atletaId: 'a1', fecha: '2026-01-10' }),
      evaluacion({ id: 'e2', atletaId: 'a1', fecha: '2026-06-15' }),
    ];
    expect(filtrarEvaluaciones(evals, { desde: '2026-05-01' }).map((e) => e.id)).toEqual(['e2']);
    expect(filtrarEvaluaciones(evals, { hasta: '2026-05-01' }).map((e) => e.id)).toEqual(['e1']);
  });
});

// ─── Estados de las superficies nuevas ──────────────────────────────────────

describe('las rutas profundas tienen sus estados', () => {
  const RUTAS = [
    'src/app/app/rendimiento/[atletaId]',
    'src/app/app/rendimiento/evaluacion/[evaluacionId]',
  ];

  it.each(RUTAS)('%s declara loading y error', (ruta) => {
    expect(() => fuente(`${ruta}/loading.tsx`)).not.toThrow();
    expect(() => fuente(`${ruta}/error.tsx`)).not.toThrow();
  });

  it.each(RUTAS)('%s · el esqueleto usa las primitivas compartidas', (ruta) => {
    const src = fuente(`${ruta}/loading.tsx`);
    expect(src).toContain('@/components/app/Skeleton');
    // Sin fabricar sidebar ni header: el shell ya está montado.
    expect(src).not.toMatch(/Sidebar|Header/);
  });

  it.each(RUTAS)('%s · la frontera de error ofrece reintentar', (ruta) => {
    const src = fuente(`${ruta}/error.tsx`);
    expect(src).toContain('"use client"');
    expect(src).toContain('onRetry={reset}');
    expect(src).toContain('@/components/app/ErrorState');
  });

  it('ningún error.tsx afirma el motivo que no puede conocer', () => {
    // La frontera solo sabe que algo lanzó. Decir «el atleta no existe» o «las
    // fichas no llegaron» sería adivinar cuál de las causas ocurrió.
    for (const ruta of RUTAS) {
      const src = fuente(`${ruta}/error.tsx`);
      expect(src, ruta).not.toMatch(/no existe|no encontrado|no hay datos|sin mediciones/i);
    }
  });

  it('el de evaluación distingue el fallo técnico de una conclusión', () => {
    const src = fuente('src/app/app/rendimiento/evaluacion/[evaluacionId]/error.tsx');
    expect(src).toContain('no una conclusión sobre las mediciones');
  });
});

// ─── Frontera de arquitectura ───────────────────────────────────────────────

describe('los filtros no cruzan ninguna frontera', () => {
  const COMPONENTES = [
    'src/features/performance-workspace/components/FiltrosAtletas.tsx',
    'src/features/performance-workspace/components/FiltrosEvaluaciones.tsx',
  ];

  it.each(COMPONENTES)('%s no consulta Supabase ni filtra por su cuenta', (ruta) => {
    const src = fuente(ruta).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
    for (const [nombre, patron] of [
      ['Supabase', /@\/lib\/supabase|createClient/],
      ['repositorio', /repository/],
      ['filtrado propio', /\.filter\(/],
      ['ordenación', /\.sort\(/],
      ['motor NIE', /@\/lib\/nie/],
    ] as const) {
      expect(src, nombre).not.toMatch(patron);
    }
  });

  it('control positivo: la comprobación detecta una infracción', () => {
    const MUESTRA = 'const c = createClient(); const x = lista.filter(Boolean);';
    expect(MUESTRA).toMatch(/createClient/);
    expect(MUESTRA).toMatch(/\.filter\(/);
  });

  it('ninguna superficie nueva introduce vocabulario normativo', () => {
    const NORMATIVO = /percentil|norma\b|TN-[12]|EQ-3|ES-2|z\s*=/i;
    for (const ruta of [...COMPONENTES, 'src/app/app/rendimiento/[atletaId]/loading.tsx']) {
      const src = fuente(ruta).replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
      expect(src, ruta).not.toMatch(NORMATIVO);
    }
    expect('el percentil 50').toMatch(NORMATIVO);
  });
});
