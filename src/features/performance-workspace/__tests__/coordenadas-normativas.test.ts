// ── Coordenadas normativas del atleta (Sprint PRS-2.2) ─────────────────────
//
// Los diez casos obligatorios del sprint, más la migración. Todo parte de un
// `Atleta` como el que devuelve el repositorio: nada se inyecta.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { cargarNormas } from '@/lib/nie/nkb/cargador';
import type { DatosPortada } from '@/lib/pas/report-v2';

import { construirInformeNormativo } from '../services/informe-normativo';
import { resolverSujeto } from '../services/sujeto';
import { validarAtleta } from '../schemas/validacion';
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

function atleta(over: Partial<Atleta> = {}): Atleta {
  return {
    id: 'a1',
    profesionalId: 'p1',
    nombre: 'Atleta de prueba',
    documento: null,
    codigoInterno: null,
    deporte: null,
    fechaNacimiento: null,
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

/** Atleta con las tres coordenadas obligatorias declaradas. 20 años. */
const completo = (over: Partial<Atleta> = {}): Atleta =>
  atleta({ fechaNacimiento: '2006-01-01', sexo: 'M', pais: 'CO', ...over });

const COND_UNI = {
  dinamometro: 'takei-t18',
  consolidacion: 'media_ambas_manos',
  posicion: 'bipedestacion',
  mano: 'ambas',
};

const registro = (): RegistroWorkspace => ({
  id: 'r1',
  evaluacionId: 'e1',
  pruebaId: 'HGS-01',
  fecha: HOY,
  valor: { tipo: 'continuo', valor: 37.5, unidad: 'kg' },
  estado: 'vigente',
  condiciones: COND_UNI,
  precondicionesCumplidas: true,
  patron: null,
  observaciones: null,
  createdAt: HOY,
});

const informe = (a: Atleta, registros: readonly RegistroWorkspace[] = [registro()]) =>
  construirInformeNormativo({
    atleta: a,
    registros,
    hoyISO: HOY,
    portada: PORTADA,
    normas: NORMAS,
  });

// ─── Los diez casos ─────────────────────────────────────────────────────────

describe('los diez casos del sprint', () => {
  it('1 · atleta completo produce un sujeto completo', () => {
    const r = resolverSujeto(completo(), HOY);
    expect(r.estado).toBe('COMPLETO');
    expect(r.sujeto).toEqual({ edad: 20, sexo: 'M', estaturaM: null, pais: 'CO' });
  });

  it('2 · falta el sexo → INCOMPLETO, y lo nombra', () => {
    const r = resolverSujeto(completo({ sexo: null }), HOY);
    expect(r.estado).toBe('INCOMPLETO');
    if (r.estado !== 'INCOMPLETO') throw new Error('estado inesperado');
    expect(r.ausentes).toEqual(['sexo']);
  });

  it('3 · falta el país → INCOMPLETO, y lo nombra', () => {
    const r = resolverSujeto(completo({ pais: null }), HOY);
    if (r.estado !== 'INCOMPLETO') throw new Error('estado inesperado');
    expect(r.ausentes).toEqual(['pais']);
  });

  it('4 · falta la estatura → COMPLETO, y es lo correcto', () => {
    // Decisión del sprint, con su razón: solo la estratifican las seis fichas
    // brasileñas. Exigirla dejaría sin informe a un atleta colombiano cuyas dos
    // normas no la usan — el sistema diría «no puedo» donde la evidencia dice
    // «sí puedo». El NIE ya distingue «esta norma no usa la estatura» de «no
    // sabemos la estatura».
    const r = resolverSujeto(completo({ estaturaCm: null }), HOY);
    expect(r.estado).toBe('COMPLETO');
    expect(r.sujeto.estaturaM).toBeNull();
  });

  it('4b · y sin ella las normas que no la usan siguen comparándose', () => {
    const r = informe(completo({ estaturaCm: null }));
    expect(r.estado).toBe('DISPONIBLE');
    if (r.estado !== 'DISPONIBLE') throw new Error('estado inesperado');
    expect(r.informe.tarjetas.length).toBeGreaterThan(0);
  });

  it('5 · faltan varias → INCOMPLETO, con todas enumeradas', () => {
    const r = resolverSujeto(atleta(), HOY);
    if (r.estado !== 'INCOMPLETO') throw new Error('estado inesperado');
    expect(r.ausentes).toEqual(['edad', 'sexo', 'pais']);
  });

  it('6 · un registro histórico con NULL no inventa ningún dato', () => {
    // Así llega una fila anterior a la migración: las tres columnas en NULL.
    const historico = atleta({ fechaNacimiento: '2006-01-01' });
    const r = resolverSujeto(historico, HOY);
    expect(r.sujeto.sexo).toBeNull();
    expect(r.sujeto.pais).toBeNull();
    expect(r.sujeto.estaturaM).toBeNull();
    // Y la edad, que sí constaba, se conserva.
    expect(r.sujeto.edad).toBe(20);
  });

  it('7 · un atleta completo llega al NIE y produce comparaciones', () => {
    const r = informe(completo());
    expect(r.estado).toBe('DISPONIBLE');
    if (r.estado !== 'DISPONIBLE') throw new Error('estado inesperado');
    expect(r.informe.tarjetas).toHaveLength(2);
    expect(r.informe.tarjetas.map((t) => t.tipo).sort()).toEqual(['TN-1', 'TN-2']);
    expect(r.informe.tarjetas[0].poblacion).toContain('Colombia');
  });

  it('8 · un atleta incompleto NO ejecuta una evaluación normativa parcial', () => {
    const r = informe(completo({ sexo: null }));
    expect(r.estado).toBe('SUJETO_INCOMPLETO');
    expect('informe' in r).toBe(false);
  });

  it('9 · la edad se calcula bien en el límite del cumpleaños', () => {
    expect(resolverSujeto(completo({ fechaNacimiento: '2006-08-15' }), HOY).sujeto.edad).toBe(19);
    expect(resolverSujeto(completo({ fechaNacimiento: '2006-08-14' }), HOY).sujeto.edad).toBe(20);
  });

  it('10 · ninguna coordenada se obtiene por inferencia', () => {
    const bruto = readFileSync(
      join(process.cwd(), 'src/features/performance-workspace/services/sujeto.ts'),
      'utf-8',
    );
    // Se audita el CÓDIGO, no los comentarios: la cabecera del módulo explica
    // precisamente por qué no se usa `Profile`, y buscarlo a ciegas convertiría
    // la documentación de la prohibición en la infracción (hallazgos H-02, H-05
    // y H-10 — es la cuarta vez que este patrón aparece en el proyecto).
    const src = bruto.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

    // Y esa explicación tiene que seguir estando: sin ella, alguien la deshará.
    expect(bruto).toMatch(/`Profile` describe al PROFESIONAL/);

    for (const [nombre, patron] of [
      ['Profile', /\bProfile\b/],
      ['columnas del perfil', /altura_cm|peso_kg/],
      ['nombre del atleta', /atleta\.nombre/],
      ['deporte', /atleta\.deporte/],
      ['valor por defecto', /\?\?\s*'(M|F|CO|CL|BR|DE)'/],
      ['locale o zona horaria', /navigator|Intl\.|timeZone/],
    ] as const) {
      expect(src, nombre).not.toMatch(patron);
    }
    // Control positivo: así se vería una inferencia.
    expect("const sexo = atleta.sexo ?? 'M';").toMatch(/\?\?\s*'(M|F)'/);
  });
});

// ─── Lectura de la fuente persistida ────────────────────────────────────────

describe('lectura de las coordenadas', () => {
  it('el sexo llega en el vocabulario del NIE, sin tabla de traducción', () => {
    for (const s of ['M', 'F'] as const) {
      expect(resolverSujeto(completo({ sexo: s }), HOY).sujeto.sexo).toBe(s);
    }
  });

  it('la estatura pasa de centímetros a metros, sin más aritmética', () => {
    expect(resolverSujeto(completo({ estaturaCm: 175 }), HOY).sujeto.estaturaM).toBe(1.75);
    expect(resolverSujeto(completo({ estaturaCm: 160.5 }), HOY).sujeto.estaturaM).toBe(1.605);
  });

  it('la estatura declarada llega hasta el NIE', () => {
    const r = resolverSujeto(completo({ estaturaCm: 175, pais: 'BR' }), HOY);
    expect(r.sujeto.estaturaM).toBe(1.75);
    expect(r.sujeto.pais).toBe('BR');
  });

  it('el país viaja tal cual, sin normalizar ni deducir', () => {
    for (const p of ['CO', 'CL', 'BR', 'DE']) {
      expect(resolverSujeto(completo({ pais: p }), HOY).sujeto.pais).toBe(p);
    }
  });

  it('una edad de cero años es un dato, no una ausencia', () => {
    const r = resolverSujeto(completo({ fechaNacimiento: '2026-01-01' }), HOY);
    expect(r.sujeto.edad).toBe(0);
    expect(r.estado).toBe('COMPLETO');
  });
});

// ─── Validación de entrada ──────────────────────────────────────────────────

describe('validación de las coordenadas', () => {
  const base = { nombre: 'Atleta' };

  it('las tres son opcionales: sin ellas el atleta se registra', () => {
    expect(validarAtleta(base).ok).toBe(true);
  });

  it('admite el vocabulario del NIE', () => {
    expect(validarAtleta({ ...base, sexo: 'M', pais: 'CO', estaturaCm: 175 }).ok).toBe(true);
  });

  it('rechaza un sexo fuera de dominio', () => {
    const r = validarAtleta({ ...base, sexo: 'Masculino' as unknown as 'M' });
    expect(r.ok).toBe(false);
    if (r.ok) throw new Error('esperaba error');
    expect(r.errores).toContain('SEXO_INVALIDO');
  });

  it('rechaza un país que no sea ISO alfa-2 en mayúsculas', () => {
    for (const p of ['Colombia', 'co', 'COL', '1']) {
      const r = validarAtleta({ ...base, pais: p });
      expect(r.ok, p).toBe(false);
    }
  });

  it('rechaza una estatura fuera de rango o no finita', () => {
    for (const e of [0, 80, 260, Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(validarAtleta({ ...base, estaturaCm: e }).ok, String(e)).toBe(false);
    }
  });

  it('`null` no es un valor inválido: es ausencia', () => {
    expect(validarAtleta({ ...base, sexo: null, pais: null, estaturaCm: null }).ok).toBe(true);
  });
});

// ─── La migración ───────────────────────────────────────────────────────────

describe('migración de pas_atletas', () => {
  const SQL = readFileSync(
    join(process.cwd(), 'supabase/migration_pas_coordenadas_normativas.sql'),
    'utf-8',
  );
  /** Sin comentarios: la cabecera explica lo que la migración NO hace. */
  const CODIGO = SQL.replace(/^\s*--.*$/gm, '');

  it('añade exactamente las tres columnas', () => {
    for (const col of ['sexo', 'pais', 'estatura_cm']) {
      expect(CODIGO).toMatch(new RegExp(`add column if not exists ${col}\\b`));
    }
  });

  it('las tres son nullable y sin valor por defecto', () => {
    expect(CODIGO).not.toMatch(/\bnot null\b/i);
    expect(CODIGO).not.toMatch(/\bdefault\b/i);
  });

  it('no toca ninguna fila existente', () => {
    for (const p of [/\bupdate\s+public\./i, /\binsert\s+into\b/i, /\bdelete\s+from\b/i]) {
      expect(CODIGO).not.toMatch(p);
    }
    // Control positivo.
    expect('update public.pas_atletas set sexo = 1').toMatch(/\bupdate\s+public\./i);
  });

  it('los dominios son los del NIE', () => {
    expect(CODIGO).toMatch(/sexo in \('M', 'F'\)/);
    expect(CODIGO).toMatch(/pais ~ '\^\[A-Z\]\{2\}\$'/);
  });

  it('documenta cómo revertirla', () => {
    expect(SQL).toMatch(/drop column if exists sexo/);
  });

  it('no toca ninguna otra tabla', () => {
    const tablas = [...CODIGO.matchAll(/alter table public\.(\w+)/g)].map((m) => m[1]);
    expect([...new Set(tablas)]).toEqual(['pas_atletas']);
  });

  it('no modifica ninguna política RLS', () => {
    expect(CODIGO).not.toMatch(/create policy|drop policy|enable row level security/i);
  });
});
