// ── Admisión científica y cierre de gaps (Sprint PAS-12 §16) ───────────────
//
// Los veinte blindajes del encargo. La mayoría son PROHIBICIONES, y una
// prohibición solo está protegida cuando se ha visto fallar ante la infracción
// que persigue: cada bloque lleva su control positivo.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { leerEvidencia, type SujetoEvidencia } from '../compatibilidad';
import { admiteRelativa, calcularRelativa } from '../relativa';
import { FUENTES, REFERENCIAS, fuenteDe } from '../registro';

const FICHAS = 'docs/normative-knowledge-base/fichas';
const leerFicha = (n: string) => readFileSync(join(process.cwd(), FICHAS, n), 'utf-8');

const CO: SujetoEvidencia = { edad: 22, sexo: 'M', pais: 'CO', pesoKg: null };

// ════════════════════════════════════════════════════════════════════════════
// LAS FICHAS ADMITIDAS
// ════════════════════════════════════════════════════════════════════════════

describe('las tres fichas nuevas existen y siguen el procedimiento', () => {
  const fichas = [
    'SAR-CA-TN1-percentiles.md',
    'CMJ-CA-TN1-percentiles.md',
    'SRT-CO-FUP-TN1-percentiles.md',
  ];

  it.each(fichas)('%s declara los 40 campos CN', (n) => {
    const t = leerFicha(n);
    for (let i = 1; i <= 40; i++) {
      const cn = 'CN-' + String(i).padStart(2, '0');
      expect(t, `${n} sin ${cn}`).toContain(cn);
    }
  });

  it.each(fichas)('%s apunta a una referencia que existe en la NKB', (n) => {
    const t = leerFicha(n);
    const clave = /referencia: (\w+)/.exec(t)![1];
    const yaml = readFileSync(
      join(process.cwd(), 'docs/normative-knowledge-base/_evidencia/referencias.yaml'),
      'utf-8',
    );
    expect(yaml, `${clave} no está en referencias.yaml`).toContain(clave + ':');
  });

  it.each(fichas)('%s declara qué NO permite afirmar', (n) => {
    expect(leerFicha(n)).toContain('NO permiten afirmar');
  });

  it.each(fichas)('%s declara que la fuente no define categorías', (n) => {
    expect(leerFicha(n)).toMatch(/no define ninguna categoría/);
  });

  it('ninguna ficha convierte un percentil en una categoría', () => {
    const CATEGORIA = /(?<![-\w])(excelente|deficiente|[oó]ptimo|avanzado|principiante)(?![-\w])/i;
    for (const n of fichas) {
      const sinNegar = leerFicha(n).replace(/\bno\s+\w+[^.]*/gi, '');
      expect(sinNegar, n).not.toMatch(CATEGORIA);
    }
  });

  it('control positivo: esa comprobación detecta una categoría real', () => {
    expect('el sujeto es avanzado'.replace(/\bno\s+\w+[^.]*/gi, '')).toMatch(
      /(?<![-\w])(avanzado)(?![-\w])/i,
    );
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LOS DATOS TRANSCRITOS SON LOS PUBLICADOS
// ════════════════════════════════════════════════════════════════════════════

describe('ningún valor de las fichas se ha inventado', () => {
  it('FUPRECOL: la suma de los N reproduce el total del artículo', () => {
    // 3 211 varones + 4 033 mujeres = 7 244, que es el N que declara el
    // artículo. Si alguien tocara un N, esta suma dejaría de cuadrar.
    const t = leerFicha('SRT-CO-FUP-TN1-percentiles.md');
    const ns = [...t.matchAll(/^\| SRT-CO-FUP-[MF]-\d+ \| [\d.\-]+ \| (\d+) \|/gm)].map((m) =>
      Number(m[1]),
    );
    expect(ns).toHaveLength(18);
    expect(ns.reduce((a, b) => a + b, 0)).toBe(7244);
  });

  it('las celdas que la extracción perdió quedan en «—», no rellenadas', () => {
    for (const [n, edad] of [
      ['SAR-CA-TN1-percentiles.md', '50-54'],
      ['CMJ-CA-TN1-percentiles.md', '60-64'],
    ] as const) {
      const t = leerFicha(n);
      expect(t, n).toContain('—');
      expect(t, n).toContain('no se ha reconstruido');
      // La fila afectada es de mujeres y conserva el hueco.
      const fila = new RegExp(`\\| \\S+-F-${edad.replace('-', '_')} \\|[^\\n]*`).exec(t);
      expect(fila, `${n}/${edad}`).not.toBeNull();
      expect(fila![0]).toContain('—');
    }
  });

  it('los percentiles de cada ficha son exactamente los que publica su fuente', () => {
    // CHMS publica once; FUPRECOL, siete. Ni uno más.
    const chms = ['P5', 'P10', 'P20', 'P30', 'P40', 'P50', 'P60', 'P70', 'P80', 'P90', 'P95'];
    const fup = ['P3', 'P10', 'P25', 'P50', 'P75', 'P90', 'P97'];

    const cabecera = (n: string) => /^\| Id \| Edad \|.*$/m.exec(leerFicha(n))![0];
    for (const n of ['SAR-CA-TN1-percentiles.md', 'CMJ-CA-TN1-percentiles.md']) {
      const c = cabecera(n);
      for (const p of chms) expect(c, `${n}/${p}`).toContain(p);
      // Ningún percentil intermedio inventado.
      for (const inventado of ['P15', 'P25', 'P35', 'P75', 'P97']) {
        expect(c, `${n}/${inventado}`).not.toContain('| ' + inventado + ' |');
      }
    }
    const cf = cabecera('SRT-CO-FUP-TN1-percentiles.md');
    for (const p of fup) expect(cf, p).toContain(p);
  });

  it('FUPRECOL admite estadios, NO el VO₂pico estimado', () => {
    const t = leerFicha('SRT-CO-FUP-TN1-percentiles.md');
    expect(t).toContain('Estadios completados');
    expect(t).toContain('no se admite');
    expect(t).toContain('estimación');
    // Y la razón, que es lo que impide que alguien la promueva más adelante:
    // es una ecuación aplicada a los estadios, no una medición.
    expect(t).toContain('Léger');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LAS CATEGORÍAS DE FUENTE NO SE MEZCLAN
// ════════════════════════════════════════════════════════════════════════════

describe('verificada no es admisible, y admisible no es cualquier cosa', () => {
  it('solo las dos fuentes admitidas tienen referencias normativas', () => {
    const conNormativa = new Set(
      REFERENCIAS.filter((r) => r.tipo === 'NORMATIVA').map((r) => r.fuenteId),
    );
    expect([...conNormativa].sort()).toEqual([
      'hoffmann_chms_2019',
      'ramirez_velez_fuprecol_2017',
    ]);
  });

  it('van den Hoek sigue siendo BENCHMARK pese a publicar percentiles', () => {
    const suyas = REFERENCIAS.filter((r) => r.fuenteId === 'van_den_hoek_powerlifting_2024');
    expect(suyas.length).toBeGreaterThan(0);
    for (const r of suyas) expect(r.tipo, r.id).toBe('BENCHMARK');
  });

  it('Bagchi sigue siendo FIABILIDAD y no produce posición', () => {
    for (const r of REFERENCIAS.filter((x) => x.fuenteId === 'bagchi_cmj_2024')) {
      expect(r.tipo).toBe('FIABILIDAD');
      expect(r.representacion.clase).toBe('fiabilidad');
    }
  });

  it('las dos fuentes negativas del FMS no cuelgan ninguna referencia', () => {
    for (const id of ['triplett_fms_2021', 'alkhathami_fms_2021']) {
      expect(REFERENCIAS.filter((r) => r.fuenteId === id), id).toEqual([]);
    }
  });

  it('Rouis justifica una regla y NO se convierte en norma', () => {
    expect(REFERENCIAS.filter((r) => r.fuenteId === 'rouis_etnia_salto_2016')).toEqual([]);
    expect(fuenteDe('rouis_etnia_salto_2016')!.noSostiene).toMatch(/NO es una norma/);
  });

  it('ninguna fuente sin verificar sostiene una referencia', () => {
    const sinVerificar = new Set(
      FUENTES.filter((f) => f.estado === 'sin_verificar').map((f) => f.id),
    );
    for (const r of REFERENCIAS) expect(sinVerificar.has(r.fuenteId), r.id).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// G-01 · FUERZA RELATIVA
// ════════════════════════════════════════════════════════════════════════════

describe('la fuerza relativa se calcula pero NUNCA clasifica', () => {
  it('con peso de la evaluación produce la razón', () => {
    const r = calcularRelativa('P-01', 120, 'kg', 66);
    expect(r.calculable).toBe(true);
    if (!r.calculable) throw new Error('debería');
    expect(r.ratio).toBeCloseTo(1.818, 3);
    expect(r.expresion).toBe('× peso corporal');
  });

  it('y su clasificación es null POR TIPO, no por estar vacía', () => {
    const r = calcularRelativa('P-01', 120, 'kg', 66);
    if (!r.calculable) throw new Error('debería');
    expect(r.clasificacion).toBeNull();
    expect(r.nota).toMatch(/no sitúa el resultado respecto a ninguna población/);
  });

  it('sin masa corporal → NO se calcula, y se dice por qué', () => {
    const r = calcularRelativa('P-01', 120, 'kg', null);
    expect(r.calculable).toBe(false);
    if (r.calculable) throw new Error('no debería');
    expect(r.motivo).toBe('SIN_MASA_CORPORAL');
    // La advertencia central de G-01.
    expect(r.detalle).toMatch(/No se usa la de otra fecha/);
  });

  it('una prueba que la literatura no relativiza NO se divide por el peso', () => {
    const r = calcularRelativa('P-04', 44, 'cm', 70);
    expect(r.calculable).toBe(false);
    if (r.calculable) throw new Error('no debería');
    expect(r.motivo).toBe('PRUEBA_NO_RELATIVIZABLE');
  });

  it('solo P-01 y P-02 la admiten', () => {
    expect(admiteRelativa('P-01')).toBe(true);
    expect(admiteRelativa('P-02')).toBe(true);
    for (const id of ['P-03', 'P-04', 'P-05', 'P-06', 'P-07', 'P-08', 'P-09', 'P-10', 'P-11']) {
      expect(admiteRelativa(id), id).toBe(false);
    }
  });

  it('unidad distinta a la que publica la literatura → no se calcula', () => {
    const r = calcularRelativa('P-01', 265, 'lb', 66);
    if (r.calculable) throw new Error('no debería');
    expect(r.motivo).toBe('UNIDAD_INCOMPATIBLE');
  });

  it('es determinista', () => {
    expect(JSON.stringify(calcularRelativa('P-01', 120, 'kg', 66))).toBe(
      JSON.stringify(calcularRelativa('P-01', 120, 'kg', 66)),
    );
  });

  it('el módulo no puede producir una categoría: no existe ninguna en su código', () => {
    const src = readFileSync(join(process.cwd(), 'src/lib/pas/evidencia/relativa.ts'), 'utf-8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    expect(src).not.toMatch(/(?<![-\w])(avanzado|[eé]lite|principiante|intermedio)(?![-\w])/i);
  });

  it('control positivo: esa comprobación detectaría una categoría en el código', () => {
    expect("const nivel = 'avanzado';").toMatch(/(?<![-\w])(avanzado)(?![-\w])/i);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// G-04 · COMPONENTES · Y LA MIGRACIÓN
// ════════════════════════════════════════════════════════════════════════════

describe('la migración de gaps está escrita y NO aplicada', () => {
  const sql = () =>
    readFileSync(join(process.cwd(), 'supabase/migration_pas_gaps_g01_g04.sql'), 'utf-8');

  it('declara que no está aplicada', () => {
    expect(sql()).toContain('NO APLICADA');
  });

  it('el peso vive en la evaluación, no en el atleta', () => {
    const t = sql();
    expect(t).toMatch(/alter table public\.pas_evaluaciones\s+[\s\S]*?peso_kg/);
    expect(t).not.toMatch(/alter table public\.pas_atletas[\s\S]{0,200}peso_kg/);
  });

  it('y explica por qué, que es la parte que evita el error', () => {
    expect(sql()).toMatch(/65 kg en enero y 68 en agosto/);
  });

  it('las columnas nuevas son nullables y no tocan nada existente', () => {
    const t = sql();
    expect(t).toContain('add column if not exists peso_kg numeric');
    expect(t).toContain('add column if not exists componentes jsonb');
    // `drop column` solo puede aparecer COMENTADO, en la sección de reversión.
    // Una migración aditiva que borre algo de verdad no es aditiva.
    for (const linea of t.split('\n')) {
      if (linea.includes('drop column')) {
        expect(linea.trimStart().startsWith('--'), linea).toBe(true);
      }
    }
  });

  it('declara que los históricos quedan NULL y no se reconstruyen', () => {
    const t = sql();
    expect(t).toMatch(/No se rellenan/);
    expect(t).toMatch(/No se reconstruyen/);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// REGRESIÓN · NADA DE LO ANTERIOR CAMBIÓ
// ════════════════════════════════════════════════════════════════════════════

describe('el comportamiento científico anterior sigue intacto', () => {
  it('P-03 sigue sin referencias en la capa de evidencia: manda la NKB', () => {
    expect(REFERENCIAS.filter((r) => r.pruebaId === 'P-03')).toEqual([]);
  });

  it('la norma canadiense sigue sin aplicarse a un colombiano', () => {
    const l = leerEvidencia(
      { pruebaId: 'P-04', valor: 44, unidad: 'cm', condiciones: { brazos: 'libres' } },
      CO,
    );
    expect(l.compatibles).toEqual([]);
  });

  it('P-10 y P-11 siguen siendo gaps honestos', () => {
    expect(REFERENCIAS.filter((r) => r.pruebaId === 'P-10')).toEqual([]);
    expect(REFERENCIAS.filter((r) => r.pruebaId === 'P-11')).toEqual([]);
  });

  it('el valor observado no se altera al calcular la relativa', () => {
    const medicion = { pruebaId: 'P-01', valor: 120.5, unidad: 'kg' };
    const antes = medicion.valor;
    calcularRelativa(medicion.pruebaId, medicion.valor, medicion.unidad, 66);
    expect(medicion.valor).toBe(antes);
  });
});
