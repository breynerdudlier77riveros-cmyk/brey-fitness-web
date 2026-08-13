// ── NIE-1.5 · la capa de conversión, probada en aislamiento ────────────────

import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import {
  ADVERTENCIA_METODOLOGICA,
  TABLA_CONVERSIONES,
  UNIDADES_CONOCIDAS,
  entradaDe,
} from '@/lib/nie/conversiones';
import { convertir, decimalesDe, esConvertible } from '@/lib/nie/conversion-unidad';
import { cargarNormas } from '@/lib/nie/nkb/cargador';
import { contextoVacio, resolver } from '@/lib/nie/resolucion';
import type { Unidad } from '@/lib/nie/tipos';

const UNIDADES: readonly Unidad[] = ['kg', 'kgf', 'lbf'];

// ─── La tabla ───────────────────────────────────────────────────────────────
describe('tabla declarativa', () => {
  it('declara los seis pares posibles, ninguno por omisión', () => {
    const pares = UNIDADES.flatMap((a) => UNIDADES.filter((b) => b !== a).map((b) => `${a}->${b}`));
    expect(pares).toHaveLength(6);
    for (const p of pares) {
      const [o, d] = p.split('->') as [Unidad, Unidad];
      expect(entradaDe(o, d), p).toBeDefined();
    }
  });

  it('autoriza exactamente un par, en sus dos sentidos', () => {
    const autorizados = TABLA_CONVERSIONES.filter((e) => e.estado === 'AUTORIZADO');
    expect(autorizados.map((e) => `${e.origen}->${e.destino}`).sort()).toEqual([
      'kgf->lbf',
      'lbf->kgf',
    ]);
  });

  it('no reconoce unidades que no estén en la NKB', () => {
    expect(UNIDADES_CONOCIDAS).toEqual(['kg', 'kgf', 'lbf']);
    const enTabla = new Set(TABLA_CONVERSIONES.flatMap((e) => [e.origen, e.destino]));
    expect([...enTabla].sort()).toEqual(['kg', 'kgf', 'lbf']);
  });

  it('el factor kgf→lbf es exacto y es el recíproco de la libra avoirdupois', () => {
    const e = entradaDe('kgf', 'lbf')!;
    if (e.estado !== 'AUTORIZADO') throw new Error('esperado AUTORIZADO');
    expect(e.exacto).toBe(true);
    expect(e.factor).toBeCloseTo(1 / 0.45359237, 15);
    expect(e.definicion).toContain('9,80665');
    expect(e.referencia).toContain('0,45359237');
  });

  it('cada entrada autorizada trae su trazabilidad completa', () => {
    for (const e of TABLA_CONVERSIONES) {
      if (e.estado !== 'AUTORIZADO') continue;
      expect(e.definicion.length, `${e.origen}->${e.destino}`).toBeGreaterThan(20);
      expect(e.referencia.length).toBeGreaterThan(20);
      expect(e.precision).toBeGreaterThan(0);
    }
  });

  it('cada entrada no autorizada explica por qué', () => {
    for (const e of TABLA_CONVERSIONES) {
      if (e.estado !== 'NO_AUTORIZADO') continue;
      expect(e.motivo, `${e.origen}->${e.destino}`).toContain('dimensión distinta');
    }
  });
});

// ─── kg no es kgf ───────────────────────────────────────────────────────────
describe('kg y kgf no se igualan', () => {
  it.each([
    ['kg', 'kgf'],
    ['kgf', 'kg'],
    ['kg', 'lbf'],
    ['lbf', 'kg'],
  ] as const)('%s → %s no está autorizada', (o, d) => {
    const r = convertir(30.7, o, d);
    expect(r.estado).toBe('NO_AUTORIZADA');
    expect(esConvertible(o, d)).toBe(false);
  });

  it('el motivo cita la decisión congelada de la NKB', () => {
    const r = convertir(30.7, 'kg', 'kgf');
    if (r.estado !== 'NO_AUTORIZADA') throw new Error('esperado NO_AUTORIZADA');
    expect(r.motivo).toContain('`39`');
    expect(r.motivo).toContain('ninguna fuente declara');
  });

  it('no lanza: devuelve el motivo y conserva el valor', () => {
    const r = convertir(30.7, 'kg', 'lbf');
    if (r.estado !== 'NO_AUTORIZADA') throw new Error('esperado NO_AUTORIZADA');
    expect(r.valorOriginal).toBe(30.7);
    expect(r.unidadOriginal).toBe('kg');
  });
});

// ─── Inmutabilidad ──────────────────────────────────────────────────────────
describe('inmutabilidad', () => {
  const r = convertir(30.7, 'kgf', 'lbf');
  if (r.estado !== 'CONVERTIDO') throw new Error('esperado CONVERTIDO');
  const c = r.conversion;

  it('conserva valor y unidad originales junto a los convertidos', () => {
    expect(c.valorOriginal).toBe(30.7);
    expect(c.unidadOriginal).toBe('kgf');
    expect(c.unidadDestino).toBe('lbf');
    expect(c.valorConvertido).not.toBe(c.valorOriginal);
  });

  it('nunca sustituye el original por el convertido', () => {
    for (const clave of ['valorOriginal', 'unidadOriginal', 'valorConvertido', 'unidadDestino']) {
      expect(Object.keys(c)).toContain(clave);
    }
  });

  it('trae el factor, su definición y su referencia', () => {
    expect(c.trazabilidad.factor).toBeCloseTo(2.204622621848776, 12);
    expect(c.trazabilidad.exacto).toBe(true);
    expect(c.trazabilidad.definicion).toContain('recíproco');
    expect(c.trazabilidad.referencia).toContain('1959');
  });

  it('la identidad también devuelve una conversión completa', () => {
    const i = convertir(30.7, 'kg', 'kg');
    expect(i.estado).toBe('IDENTIDAD');
    if (i.estado !== 'IDENTIDAD') throw new Error('esperado IDENTIDAD');
    expect(i.conversion.operacion).toBe('IDENTIDAD');
    expect(i.conversion.trazabilidad.factor).toBe(1);
    expect(i.conversion.valorConvertido).toBe(30.7);
  });
});

// ─── Precisión ──────────────────────────────────────────────────────────────
describe('precisión · sin inventar resolución', () => {
  it.each([
    [30.7, 1],
    [30, 0],
    [22.09, 2],
    [8.5, 1],
  ])('cuenta los decimales de %s como %i', (v, d) => {
    expect(decimalesDe(v)).toBe(d);
  });

  it('la representación respeta los decimales del original', () => {
    const r = convertir(30.7, 'kgf', 'lbf');
    if (r.estado !== 'CONVERTIDO') throw new Error('esperado CONVERTIDO');
    // 30,7 kgf = 67,68189... lbf. La fuente midió con un decimal.
    expect(r.conversion.decimalesOriginales).toBe(1);
    expect(r.conversion.representacion).toBe(67.7);
    expect(String(r.conversion.representacion).split('.')[1]?.length ?? 0).toBeLessThanOrEqual(1);
  });

  it('conserva el valor exacto aparte, para poder revertir sin perder', () => {
    const r = convertir(30.7, 'kgf', 'lbf');
    if (r.estado !== 'CONVERTIDO') throw new Error('esperado CONVERTIDO');
    expect(r.conversion.valorConvertido).not.toBe(r.conversion.representacion);
    expect(r.conversion.valorConvertido).toBeCloseTo(67.68189, 4);
  });

  it('un entero no gana decimales al convertirse', () => {
    const r = convertir(30, 'kgf', 'lbf');
    if (r.estado !== 'CONVERTIDO') throw new Error('esperado CONVERTIDO');
    expect(r.conversion.decimalesOriginales).toBe(0);
    expect(Number.isInteger(r.conversion.representacion)).toBe(true);
  });
});

// ─── Reversibilidad ─────────────────────────────────────────────────────────
describe('reversibilidad', () => {
  const VALORES = Array.from({ length: 60 }, (_, i) => 5 + i * 1.3);

  it('kgf → lbf → kgf devuelve el original', () => {
    for (const v of VALORES) {
      const ida = convertir(v, 'kgf', 'lbf');
      if (ida.estado !== 'CONVERTIDO') throw new Error('esperado CONVERTIDO');
      const vuelta = convertir(ida.conversion.valorConvertido, 'lbf', 'kgf');
      if (vuelta.estado !== 'CONVERTIDO') throw new Error('esperado CONVERTIDO');
      expect(vuelta.conversion.valorConvertido, String(v)).toBeCloseTo(v, 10);
    }
  });

  it('los dos factores son recíprocos exactos', () => {
    const a = entradaDe('kgf', 'lbf')!;
    const b = entradaDe('lbf', 'kgf')!;
    if (a.estado !== 'AUTORIZADO' || b.estado !== 'AUTORIZADO') throw new Error('esperados AUTORIZADOS');
    expect(a.factor * b.factor).toBeCloseTo(1, 15);
  });
});

// ─── La advertencia metodológica ────────────────────────────────────────────
describe('unidad compatible ≠ método compatible', () => {
  it('toda conversión arrastra la advertencia', () => {
    for (const [o, d] of [['kgf', 'lbf'], ['lbf', 'kgf'], ['kg', 'kg']] as const) {
      const r = convertir(30, o, d);
      if (r.estado === 'NO_AUTORIZADA') throw new Error('esperada conversión');
      expect(r.conversion.advertencia).toBe(ADVERTENCIA_METODOLOGICA);
    }
  });

  it('la advertencia dice explícitamente que no resuelve EQ-3', () => {
    expect(ADVERTENCIA_METODOLOGICA).toContain('EQ-3');
    expect(ADVERTENCIA_METODOLOGICA).toContain('No convierte instrumentos');
    expect(ADVERTENCIA_METODOLOGICA).toContain('siguen sin ser comparables');
  });

  it('convertir la unidad NO vuelve aplicable una norma de otro método', () => {
    // Brasil publica en kgf y Chile en lbf: el par está autorizado. Y aun así
    // sus normas son EQ-3, y siguen sin serlo después de convertir.
    expect(esConvertible('kgf', 'lbf')).toBe(true);

    const NORMAS = cargarNormas();
    const contexto = {
      ...contextoVacio(),
      variable: 'fuerza_prension_manual' as const,
      pais: 'BR' as const,
      instrumento: 'jamar-j00105' as const,
      unidad: 'lbf' as const, // ya en la unidad chilena
      definicionOperacional: 'media_2a_y_3a_mano_dominante' as const,
      posicion: 'sedestacion' as const,
      lado: 'dominante' as const,
      edad: 10,
      sexo: 'M' as const,
    };
    const chilena = resolver(contexto, NORMAS).candidatas.find((c) => c.normaId === 'HGS-CL-D-M-10')!;
    // Unidad coincidente y aun así no aplicable: el método manda.
    expect(chilena.coincidencias).toContain('unidad');
    expect(chilena.aplicabilidad).toBe('NO_APLICABLE');
    expect(chilena.discrepancias).toEqual(
      expect.arrayContaining(['instrumento', 'pais', 'definicion_operacional']),
    );
  });
});

// ─── No acoplamiento ────────────────────────────────────────────────────────
describe('la capa no se aplica sola', () => {
  const RAIZ = join(process.cwd(), 'src', 'lib', 'nie');
  const sinComentarios = (s: string) =>
    s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  const OTROS = readdirSync(RAIZ)
    .filter(
      (f) =>
        f.endsWith('.ts') &&
        // La capa misma, el barril, y la capa de composición de NIE-1.6, que es
        // la única autorizada a usarla y solo bajo petición explícita.
        !['conversiones.ts', 'conversion-unidad.ts', 'index.ts', 'comparacion-normativa.ts'].includes(f),
    )
    .map((f) => [f, readFileSync(join(RAIZ, f), 'utf-8')] as const);

  it.each(OTROS)('%s no importa la capa de conversión', (_f, src) => {
    const codigo = sinComentarios(src);
    expect(codigo).not.toMatch(/from '\.\/conversion/);
  });

  it('UNIT_MISMATCH sigue bloqueando la aplicabilidad', () => {
    const NORMAS = cargarNormas();
    const contexto = {
      ...contextoVacio(),
      variable: 'fuerza_prension_manual' as const,
      pais: 'BR' as const,
      instrumento: 'jamar-j00105' as const,
      unidad: 'kg' as const, // la norma está en kgf
      definicionOperacional: 'media_2a_y_3a_mano_dominante' as const,
      posicion: 'sedestacion' as const,
      lado: 'dominante' as const,
      edad: 70,
      sexo: 'M' as const,
      estaturaM: 1.75,
    };
    const c = resolver(contexto, NORMAS).candidatas.find((x) => x.normaId === 'HGS-BR-M170-70')!;
    const unidad = c.dimensiones.find((d) => d.dimension === 'unidad')!;
    expect(unidad.codigo).toBe('UNIT_MISMATCH');
    expect(c.aplicabilidad).toBe('NO_APLICABLE');
  });

  it('la NKB sigue con cero conversiones: los valores no cambian', () => {
    const NORMAS = cargarNormas();
    const kgf = NORMAS.filter((n) => n.unidad === 'kgf');
    const lbf = NORMAS.filter((n) => n.unidad === 'lbf');
    expect(kgf).toHaveLength(156);
    expect(lbf).toHaveLength(48);
    // La ficha chilena sigue publicando en lbf, no en kgf.
    const cl = NORMAS.find((n) => n.id === 'HGS-CL-D-M-06')!;
    if (cl.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    expect(cl.valores.percentiles.find((p) => p.percentil === 50)!.valor).toBe(20.4);
  });
});

// ─── Factores en un solo sitio ──────────────────────────────────────────────
describe('ningún factor disperso por el código', () => {
  const RAIZ = join(process.cwd(), 'src', 'lib', 'nie');
  const sinComentarios = (s: string) =>
    s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  it('solo conversiones.ts contiene los números de conversión', () => {
    const sospechosos = /0\.45359237|2\.2046|9\.80665|4\.44822/;
    for (const f of readdirSync(RAIZ).filter((x) => x.endsWith('.ts'))) {
      const codigo = sinComentarios(readFileSync(join(RAIZ, f), 'utf-8'));
      if (f === 'conversiones.ts') {
        expect(codigo, f).toMatch(sospechosos);
      } else {
        expect(codigo, f).not.toMatch(sospechosos);
      }
    }
  });
});
