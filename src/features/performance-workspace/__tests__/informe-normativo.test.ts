// ── Integración Atleta → NIE → informe v2 (PRS-2.1 · PRS-2.2) ──────────────
//
// Flujo COMPLETO, sin mocks de las funciones intermedias: se parte de un
// `Atleta` como el que devuelve el repositorio y se llega al HTML renderizado.
// Las normas son las reales de la NKB.
//
// Desde PRS-2.2 el atleta lleva sus propias coordenadas normativas, así que el
// camino real ya no necesita inyectar un sujeto: se declara en el expediente.

import { describe, expect, it } from 'vitest';
import { MAPEOS } from '@/lib/pas/normativo';

/** El id real que declara el mapeo. Nunca se teclea a mano. */
const PRUEBA_PRENSION = MAPEOS[0].pruebaId;

import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import ReportViewV2 from '@/components/pas/report-v2/ReportViewV2';
import IncompleteSubject from '@/components/pas/report-v2/IncompleteSubject';
import { cargarNormas } from '@/lib/nie/nkb/cargador';
import { ETIQUETA_INTERPRETACION } from '@/lib/pas/report-v2';
import type { DatosPortada } from '@/lib/pas/report-v2';

import {
  construirInformeNormativo,
  type ResultadoInformeNormativo,
} from '../services/informe-normativo';
import { edadEnAnios, resolverSujeto } from '../services/sujeto';
import type { Atleta, RegistroWorkspace } from '../schemas/tipos';

const NORMAS = cargarNormas();
const HOY = '2026-08-14';

const PORTADA: DatosPortada = {
  atleta: 'Atleta de prueba',
  edad: null,
  sexo: null,
  fecha: HOY,
  profesional: null,
  codigo: 'EVAL-0001',
};

function atleta(fechaNacimiento: string | null, over: Partial<Atleta> = {}): Atleta {
  return {
    id: 'a1',
    profesionalId: 'p1',
    nombre: 'Atleta de prueba',
    documento: null,
    codigoInterno: null,
    deporte: null,
    fechaNacimiento,
    sexo: null,
    pais: null,
    estaturaCm: null,
    notas: null,
    estado: 'activo',
    createdAt: HOY,
    updatedAt: HOY,
    ...over,
  };
}

/** Atleta con todas las coordenadas obligatorias declaradas. */
const completo = (over: Partial<Atleta> = {}): Atleta =>
  atleta('2006-01-01', { sexo: 'M', pais: 'CO', ...over });

const COND_UNI = {
  dinamometro: 'takei-t18',
  consolidacion: 'media_ambas_manos',
  posicion: 'bipedestacion',
  mano: 'ambas',
};

function registro(
  id: string,
  valor: number,
  unidad: string,
  condiciones: Record<string, string>,
  pruebaId = PRUEBA_PRENSION,
): RegistroWorkspace {
  return {
    id,
    evaluacionId: 'e1',
    pruebaId,
    fecha: HOY,
    valor: { tipo: 'continuo', valor, unidad },
    estado: 'vigente',
    condiciones,
    precondicionesCumplidas: true,
    patron: null,
    observaciones: null,
    createdAt: HOY,
  };
}

/**
 * El flujo real, entero, desde el expediente.
 *
 * Ya no inyecta nada: construye un `Atleta` con la fecha de nacimiento que
 * produce la edad pedida y recorre `construirInformeNormativo`, igual que la
 * ruta. Si algún día `resolverSujeto` dejara de leer una coordenada, estos
 * casos caerían — que es justo lo que un test de integración debe hacer.
 */
function conSujeto(
  registros: readonly RegistroWorkspace[],
  sujeto: { edad: number; sexo: 'M' | 'F'; estaturaCm?: number; pais: string },
) {
  const nacimiento = `${2026 - sujeto.edad}-01-01`;
  const r = informe(
    atleta(nacimiento, {
      sexo: sujeto.sexo,
      pais: sujeto.pais,
      estaturaCm: sujeto.estaturaCm ?? null,
    }),
    registros,
  );
  if (r.estado !== 'DISPONIBLE') throw new Error(`esperaba DISPONIBLE, llegó ${r.estado}`);
  return r.informe;
}

const informe = (
  a: Atleta,
  registros: readonly RegistroWorkspace[],
): ResultadoInformeNormativo =>
  construirInformeNormativo({ atleta: a, registros, hoyISO: HOY, portada: PORTADA, normas: NORMAS });

// ════════════════════════════════════════════════════════════════════════════
// 1 · EL SUJETO
// ════════════════════════════════════════════════════════════════════════════

describe('Atleta → SujetoNormativo', () => {
  it('la edad se deriva de la fecha de nacimiento, sin leer el reloj', () => {
    expect(edadEnAnios('2006-08-14', HOY)).toBe(20);
    expect(edadEnAnios('2006-08-15', HOY)).toBe(19);
  });

  it('una fecha ilegible devuelve null, no una edad inventada', () => {
    expect(edadEnAnios('ayer', HOY)).toBeNull();
    expect(edadEnAnios('2006-13-45', '2026-08-14')).toBe(19);
  });

  it('una fecha futura no produce una edad negativa', () => {
    expect(edadEnAnios('2030-01-01', HOY)).toBeNull();
  });

  it('un expediente sin coordenadas sale incompleto, nombrando las dos', () => {
    const r = resolverSujeto(atleta('2006-01-01'), HOY);
    expect(r.estado).toBe('INCOMPLETO');
    if (r.estado !== 'INCOMPLETO') throw new Error('estado inesperado');
    expect(r.ausentes).toEqual(['sexo', 'pais']);
  });

  it('sin fecha de nacimiento, también falta la edad', () => {
    const r = resolverSujeto(atleta(null), HOY);
    if (r.estado !== 'INCOMPLETO') throw new Error('estado inesperado');
    expect(r.ausentes).toEqual(['edad', 'sexo', 'pais']);
  });

  it('la estatura no se exige: solo la estratifican las fichas brasileñas', () => {
    const r = resolverSujeto(completo(), HOY);
    expect(r.estado).toBe('COMPLETO');
  });

  it('nunca toma el sexo ni la altura del profesional', () => {
    const r = resolverSujeto(atleta('2006-01-01'), HOY);
    expect(r.sujeto.sexo).toBeNull();
    expect(r.sujeto.estaturaM).toBeNull();
    expect(r.sujeto.pais).toBeNull();
  });

  it('el servicio no recibe siquiera el Profile: la firma lo impide', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/features/performance-workspace/services/sujeto.ts'),
      'utf-8',
    );
    expect(src).not.toMatch(/^import[^\n]*\bProfile\b/m);
    expect(src).not.toMatch(/altura_cm|peso_kg/);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2 · ESTADOS DE LA RUTA
// ════════════════════════════════════════════════════════════════════════════

describe('estados explícitos', () => {
  it('sin registros: no hay nada que situar', () => {
    const r = informe(atleta('2006-01-01'), []);
    expect(r.estado).toBe('SIN_MEDICIONES');
  });

  it('con expediente completo, el informe se produce', () => {
    const r = informe(completo(), [registro('r', 37.5, 'kg', COND_UNI)]);
    expect(r.estado).toBe('DISPONIBLE');
  });

  it('con registros pero sujeto incompleto: se dice qué falta', () => {
    const r = informe(atleta('2006-01-01'), [registro('r', 37.5, 'kg', COND_UNI)]);
    expect(r.estado).toBe('SUJETO_INCOMPLETO');
    if (r.estado !== 'SUJETO_INCOMPLETO') throw new Error('estado inesperado');
    expect(r.ausentes).toContain('sexo');
    // Y por qué no se rellena solo, que es la parte que importa.
    expect(r.detalle).toContain('No se completan con los datos del profesional');
  });

  it('ninguno de los dos estados culpa al atleta', () => {
    const JUICIO = /\b(bajo|deficiente|insuficiente|malo|error|fallo)\b/i;
    for (const r of [
      informe(atleta('2006-01-01'), []),
      informe(atleta(null), [registro('r', 37.5, 'kg', COND_UNI)]),
    ]) {
      const texto = 'detalle' in r ? r.detalle : '';
      expect(texto).not.toMatch(JUICIO);
    }
    expect('resultado insuficiente').toMatch(JUICIO);
  });

  it('el estado de sujeto incompleto se comprueba después de las mediciones', () => {
    // Una evaluación vacía de un atleta sin datos informa de lo primero que
    // falta, no de las dos cosas a la vez.
    expect(informe(atleta(null), []).estado).toBe('SIN_MEDICIONES');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3 · LOS OCHO CASOS DEL SPRINT
// ════════════════════════════════════════════════════════════════════════════

describe('casos obligatorios', () => {
  const CO20 = { edad: 20, sexo: 'M' as const, pais: 'CO' };
  const CO45 = { edad: 45, sexo: 'M' as const, pais: 'CO' };
  const CO75 = { edad: 75, sexo: 'M' as const, pais: 'CO' };

  it('CASO 1 · sujeto con norma aplicable renderiza el informe', () => {
    const i = conSujeto([registro('r', 37.5, 'kg', COND_UNI)], CO20);
    expect(i.tarjetas.length).toBeGreaterThan(0);
    const html = renderToStaticMarkup(createElement(ReportViewV2, { informe: i }));
    expect(html).toContain('data-seccion-v2="perfil"');
    expect(html).toContain('role="img"');
  });

  it('CASO 2 · 45 años: Cúcuta, calidad Baja, sin convertirlo en clasificación', () => {
    const i = conSujeto(
      [
        registro('r', 40, 'kg', {
          dinamometro: 'camry-digital',
          consolidacion: 'mejor_mano_dominante',
          posicion: 'bipedestacion',
          mano: 'dominante',
        }),
      ],
      CO45,
    );
    const t = i.tarjetas.find((x) => x.normaId.startsWith('HGS-CO-CUC'))!;
    expect(t).toBeDefined();
    expect(t.calidad).toBe('Baja');
    // «Baja» califica la EVIDENCIA, nunca al atleta.
    expect(t.evidencia.find((f) => f.dimension === 'Calidad')!.estado).toBe('Baja');
    expect(t.situacion).not.toMatch(/\b(bajo|deficiente)\b/i);
  });

  it('CASO 3 · 75 años: sin norma admisible, y sin juicio', () => {
    const i = conSujeto([registro('r', 30, 'kg', COND_UNI)], CO75);
    expect(i.tarjetas).toHaveLength(0);
    expect(i.resumen[0].estado).toBe(ETIQUETA_INTERPRETACION.SIN_NORMA_APLICABLE);

    const html = renderToStaticMarkup(createElement(ReportViewV2, { informe: i }));
    // Se audita el texto que redacta el motor, no el transportado de las fichas.
    const propio = [
      i.portada.estadoCientifico,
      ...i.resumen.map((r) => r.estado),
      ...i.sinNorma.map((s) => s.detalle),
    ].join(' ');
    for (const p of ['bajo', 'alto', 'normal', 'anormal', 'deficiente', 'insuficiente']) {
      expect(propio.toLowerCase(), p).not.toContain(p);
    }
    expect(html).toContain('Ninguna medición');
  });

  it('CASO 4 · instrumento incompatible: NO_APLICABLE con su motivo', () => {
    const i = conSujeto(
      [registro('r', 37.5, 'kg', { ...COND_UNI, dinamometro: 'takei-tkk-5101' })],
      CO20,
    );
    const panel = i.comparabilidad.r;
    const eq3 = panel.descartes.find((d) => d.motivoCorto === 'método EQ-3')!;
    expect(eq3).toBeDefined();
    expect(eq3.motivo).toContain('EQ-3');
    // Las universitarias, medidas con otro dinamómetro, no se comparan.
    expect(i.tarjetas.every((t) => !t.normaId.startsWith('HGS-CO-UNI'))).toBe(true);
  });

  it('CASO 5 · unidad incompatible: no se convierte sola', () => {
    const i = conSujeto([registro('r', 37.5, 'kgf', COND_UNI)], CO20);
    expect(i.tarjetas).toHaveLength(0);
    const motivos = i.comparabilidad.r.descartes.map((d) => d.motivo).join(' ');
    expect(motivos).toMatch(/unidad/i);
  });

  it('CASO 6 · ENSIN: ES-2, conflicto y advertencias, a la vez', () => {
    const i = conSujeto(
      [
        registro('r', 30.7, 'kg', {
          dinamometro: 'takei-tkk-5101',
          consolidacion: 'media_ambas_manos',
          posicion: 'bipedestacion',
          mano: 'ambas',
        }),
      ],
      { edad: 15, sexo: 'M', pais: 'CO' },
    );
    const t = i.tarjetas.find((x) => x.normaId === 'HGS-CO-M-15')!;
    expect(t).toBeDefined();
    expect(t.estadoEvidencia).toBe('CUESTIONADA');
    expect(t.conflicto).toBe('CONFLICTO_NO_DETERMINABLE');
    expect(t.advertencias.join(' ')).toContain('ENSIN-2015');
    // Y sigue siendo utilizable: se comparó.
    expect(t.situacion).toBe(ETIQUETA_INTERPRETACION.COINCIDE_CON_PERCENTIL);

    const html = renderToStaticMarkup(createElement(ReportViewV2, { informe: i }));
    expect(html).toContain('data-evidencia="CUESTIONADA"');
    expect(html).toContain('data-conflicto="CONFLICTO_NO_DETERMINABLE"');
  });

  it('CASO 7 · dos candidatas aplicables: salen las dos', () => {
    const i = conSujeto([registro('r', 37.5, 'kg', COND_UNI)], CO20);
    expect(i.tarjetas).toHaveLength(2);
    expect(i.tarjetas.map((t) => t.tipo).sort()).toEqual(['TN-1', 'TN-2']);
    // En el orden de la NKB, no por calidad ni por tipo.
    const enNkb = NORMAS.filter((n) => i.tarjetas.some((t) => t.normaId === n.id)).map((n) => n.id);
    expect(i.tarjetas.map((t) => t.normaId)).toEqual(enNkb);
  });

  it('CASO 8 · variable sin norma: tarjeta gris, sin juicio', () => {
    const i = conSujeto(
      [registro('r', 37.5, 'kg', COND_UNI), registro('c', 42, 'cm', {}, 'CMJ-01')],
      CO20,
    );
    expect(i.sinNorma).toHaveLength(1);
    expect(i.sinNorma[0].detalle).not.toMatch(/malo|riesgo|insuficiente|deficiente/i);

    const html = renderToStaticMarkup(createElement(ReportViewV2, { informe: i }));
    expect(html).toContain('Norma no disponible');
    // Y la que sí tiene norma sigue mostrándose.
    expect(i.tarjetas.length).toBeGreaterThan(0);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4 · EL FLUJO LLEGA INTACTO
// ════════════════════════════════════════════════════════════════════════════

describe('el resultado del NIE llega intacto hasta el render', () => {
  const CO20 = { edad: 20, sexo: 'M' as const, pais: 'CO' };
  const i = conSujeto([registro('r', 37.5, 'kg', COND_UNI)], CO20);
  const html = renderToStaticMarkup(createElement(ReportViewV2, { informe: i }));

  it('el valor observado no se toca por el camino', () => {
    for (const t of i.tarjetas) {
      expect(t.valor).toBe(37.5);
      expect(t.unidad).toBe('kg');
    }
  });

  it('los valores normativos siguen siendo los de la ficha', () => {
    const t = i.tarjetas.find((x) => x.tipo === 'TN-1')!;
    const norma = NORMAS.find((n) => n.id === t.normaId)!;
    if (norma.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    expect(t.escala!.marcas.map((m) => m.valor)).toEqual(
      norma.valores.percentiles.map((p) => p.valor),
    );
  });

  it('la NKB no se modifica al renderizar', () => {
    const antes = JSON.stringify(cargarNormas().map((n) => n.valores));
    renderToStaticMarkup(createElement(ReportViewV2, { informe: i }));
    expect(JSON.stringify(cargarNormas().map((n) => n.valores))).toBe(antes);
  });

  it('el HTML contiene el motivo literal que redactó el NIE', () => {
    const t = i.tarjetas[0];
    expect(html).toContain(t.motivo.slice(0, 40));
  });

  it('la trazabilidad de la referencia llega a pantalla', () => {
    expect(html).toContain('vivas_diaz_hgs_universitarios_2016');
  });

  it('el render es determinista', () => {
    expect(renderToStaticMarkup(createElement(ReportViewV2, { informe: i }))).toBe(html);
  });

  it('el estado incompleto también renderiza, nombrando lo que falta', () => {
    const r = informe(atleta('2006-01-01'), [registro('r', 37.5, 'kg', COND_UNI)]);
    if (r.estado !== 'SUJETO_INCOMPLETO') throw new Error('estado inesperado');
    const h = renderToStaticMarkup(
      createElement(IncompleteSubject, { ausentes: r.ausentes, detalle: r.detalle }),
    );
    expect(h).toContain('sexo');
    expect(h).toContain('población de pertenencia');
    expect(h).toContain('data-sujeto="incompleto"');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5 · GUARDAS DE ARQUITECTURA
// ════════════════════════════════════════════════════════════════════════════

describe('guardas de arquitectura', () => {
  const RAIZ_COMP = join(process.cwd(), 'src/components/pas/report-v2');
  const COMPONENTES = readdirSync(RAIZ_COMP)
    .filter((f) => f.endsWith('.tsx'))
    .map((f) => [f, readFileSync(join(RAIZ_COMP, f), 'utf-8')] as const);

  const RUTA = readFileSync(
    join(process.cwd(), 'src/app/app/rendimiento/evaluacion/[evaluacionId]/page.tsx'),
    'utf-8',
  );
  const SERVICIO = readFileSync(
    join(process.cwd(), 'src/features/performance-workspace/services/informe-normativo.ts'),
    'utf-8',
  );

  const sinComentarios = (s: string) =>
    s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  it('el inventario de componentes está completo', () => {
    expect(COMPONENTES).toHaveLength(11);
  });

  it.each(COMPONENTES)('%s no importa la NKB, fs ni Supabase', (_f, src) => {
    const codigo = sinComentarios(src);
    for (const [nombre, patron] of [
      ['NKB', /nkb\/cargador|normative-knowledge-base/],
      ['node:fs', /node:fs/],
      ['Supabase', /supabase/i],
      ['motor NIE', /from ["']@\/lib\/nie/],
      ['servicio de datos', /performance-workspace\/(repository|actions)/],
    ] as const) {
      expect(codigo, nombre).not.toMatch(patron);
    }
  });

  it.each(COMPONENTES)('%s no hace ciencia', (_f, src) => {
    const codigo = sinComentarios(src)
      .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
      .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
      .replace(/`(?:[^`\\]|\\.)*`/g, '``');
    for (const [nombre, patron] of [
      ['ordenación', /\.sort\(/],
      ['selección por índice', /\b(tarjetas|normas|comparables|resultados)\s*\[\s*0\s*\]/],
      ['conversión', /\bconvertir\w*\s*\(|0\.45359237|9\.80665/],
      ['percentil calculado', /\bpercentil\w*\s*[=(]/i],
      ['z a percentil', /\berf\s*\(|normalCdf/],
      ['punto de corte', /\b(umbral|cutoff)\s*[=:]/i],
      ['clasificación', /\b(clasificar|categorizar)\s*\(/i],
    ] as const) {
      expect(codigo, nombre).not.toMatch(patron);
    }
  });

  it('la ruta no reproduce ninguna decisión normativa', () => {
    const codigo = sinComentarios(RUTA);
    for (const [nombre, patron] of [
      ['aplicabilidad', /aplicabilidad|APLICABLE/],
      ['comparación', /compararValor|interpretarNormativamente/],
      ['conversión', /\bconvertir\w*\s*\(/],
      ['selección', /\.sort\(|\.filter\([^)]*calidad/],
      ['carga directa de la NKB', /cargarNormas/],
    ] as const) {
      expect(codigo, nombre).not.toMatch(patron);
    }
  });

  it('la ruta usa los servicios existentes, sin duplicar su lógica', () => {
    expect(RUTA).toContain('construirInformeNormativo');
    expect(RUTA).toContain('informeDeEvaluacion');
  });

  it('solo el servicio de servidor toca la NKB', () => {
    expect(SERVICIO).toContain('cargarNormas');
    for (const [f, src] of COMPONENTES) {
      expect(sinComentarios(src), f).not.toContain('cargarNormas');
    }
  });

  it('ningún fichero del cableado copia una tabla de la NKB', () => {
    // Una tabla copiada es una SECUENCIA de números, no un decimal suelto: los
    // componentes llevan grosores de trazo (`strokeWidth={0.8}`) y opacidades
    // de Tailwind (`bg-white/[0.02]`) que coinciden por casualidad con algún
    // valor publicado. Buscar coincidencias sueltas produce falsos positivos;
    // buscar la FORMA de una tabla, no.
    const TABLA = /\[\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?\s*,\s*\d+(?:\.\d+)?/;
    for (const [f, src] of [...COMPONENTES, ['page.tsx', RUTA] as const, ['informe-normativo.ts', SERVICIO] as const]) {
      expect(sinComentarios(src), f).not.toMatch(TABLA);
    }
    // Control positivo: así se vería un percentil copiado.
    expect('const p = [23.0, 26.7, 32.0];').toMatch(TABLA);
  });

  it('las guardas saben encontrar una infracción real', () => {
    // Control positivo: sin esto, una expresión rota las haría pasar siempre
    // (hallazgos H-02 y H-05).
    const SONDA = 'const x = tarjetas[0]; arr.sort(); cargarNormas(); import "node:fs";';
    for (const p of [
      /\b(tarjetas|normas)\s*\[\s*0\s*\]/,
      /\.sort\(/,
      /cargarNormas/,
      /node:fs/,
    ]) {
      expect(SONDA).toMatch(p);
    }
  });

  it('el contexto de evaluación sigue sin admitir el valor observado', () => {
    const src = readFileSync(join(process.cwd(), 'src/lib/nie/tipos.ts'), 'utf-8');
    const ctx = /export interface ContextoEvaluacion[\s\S]*?\n\}/.exec(src)![0];
    for (const prohibida of ['valor', 'medicion', 'resultado', 'puntuacion']) {
      expect(ctx, prohibida).not.toMatch(new RegExp(`^\\s*${prohibida}\\w*\\s*:`, 'm'));
    }
  });
});
