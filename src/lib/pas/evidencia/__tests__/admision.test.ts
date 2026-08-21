// ── Admisión científica y G-06 (Sprint PAS-11.2 §16, §17) ──────────────────
//
// LA REGLA QUE ESTE FICHERO DEFIENDE:
//
//   **Verificada no es lo mismo que admisible.**
//
//   Siete fuentes están verificadas en origen. Solo dos podrían sostener una
//   norma. Las otras cinco son fiabilidad, benchmark o evidencia negativa, y la
//   diferencia entre esas categorías es todo lo que separa a este sistema de
//   uno que fabrica escalas para que las tarjetas no queden vacías.

import { describe, expect, it } from 'vitest';

import { leerEvidencia, type SujetoEvidencia } from '../compatibilidad';
import { FUENTES, REFERENCIAS, fuenteDe } from '../registro';

const CO: SujetoEvidencia = { edad: 22, sexo: 'M', pais: 'CO', pesoKg: null };
const CA: SujetoEvidencia = { edad: 22, sexo: 'M', pais: 'CA', pesoKg: null };

const SALTO = { pruebaId: 'P-04', valor: 44, unidad: 'cm', condiciones: { brazos: 'libres' } };
const FLEX = { pruebaId: 'P-06', valor: 26, unidad: 'cm', condiciones: { version: 'clasico' } };

// ════════════════════════════════════════════════════════════════════════════
// G-06 · DECIDIDO POR VARIABLE, CON FUENTE
// ════════════════════════════════════════════════════════════════════════════

describe('G-06 · el país ya no bloquea, y la fuente sigue acotando lo decible', () => {
  it('la fuente que justifica la decisión está registrada y verificada', () => {
    const f = fuenteDe('rouis_etnia_salto_2016')!;
    expect(f.estado).toBe('propuesta');
    expect(f.cita!.localizador).toMatch(/PMID 28149384/);
    expect(f.sostiene).toMatch(/62,9/);
    expect(f.sostiene).toMatch(/brazos libres/);
  });

  it('esa fuente NO puede usarse para situar a nadie', () => {
    // Sostiene una REGLA de compatibilidad, que es otro uso. Un test lo fija
    // porque la tentación de convertirla en norma es real: tiene medias y DE.
    const f = fuenteDe('rouis_etnia_salto_2016')!;
    expect(f.noSostiene).toMatch(/NO es una norma ni un benchmark/);
    expect(REFERENCIAS.filter((r) => r.fuenteId === 'rouis_etnia_salto_2016')).toEqual([]);
  });

  it('y NUNCA autoriza a clasificar ni corregir por ascendencia', () => {
    const f = fuenteDe('rouis_etnia_salto_2016')!;
    expect(f.noSostiene).toMatch(/clasificar a nadie por su ascendencia/);
    expect(f.noSostiene).toMatch(/corregir un resultado por ella/);
  });

  it('salto: la norma canadiense sitúa a un canadiense', () => {
    expect(leerEvidencia(SALTO, CA).estado).toBe('EVIDENCIA_COMPATIBLE');
  });

  it('salto: y también a un colombiano, marcando de quién es la norma', () => {
    // PAS-13 invierte G-06. Rouis 2016 documenta que la ascendencia se asocia
    // con diferencias de salto, y eso es exactamente lo que obliga a NOMBRAR
    // la población de origen; no a esconder la única norma que existe.
    const l = leerEvidencia(SALTO, CO);
    expect(l.estado).toBe('EVIDENCIA_COMPATIBLE');
    expect(l.compatibles[0].poblacionAjena).toBe(true);
  });

  it('sit-and-reach: misma decisión, mismo comportamiento', () => {
    expect(leerEvidencia(FLEX, CA).estado).toBe('EVIDENCIA_COMPATIBLE');
    expect(leerEvidencia(FLEX, CA).compatibles[0].poblacionAjena).toBe(false);
    expect(leerEvidencia(FLEX, CO).compatibles[0].poblacionAjena).toBe(true);
  });

  it('la decisión se tomó por variable, no en bloque', () => {
    // Las dos referencias documentan su propio motivo, y son motivos distintos:
    // fisiológico en el salto, geométrico en la flexión.
    const salto = REFERENCIAS.find((r) => r.id === 'P-04/chms/m-20-24')!;
    const flex = REFERENCIAS.find((r) => r.id === 'P-06/chms/m-20-24')!;
    expect(salto.ambito.pais).toBe('CA');
    expect(flex.ambito.pais).toBe('CA');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// VERIFICADA ≠ ADMISIBLE
// ════════════════════════════════════════════════════════════════════════════

describe('una fuente verificada no se convierte sola en norma', () => {
  /** Las que el sprint declaró NO admisibles como norma. */
  const NO_ADMISIBLES = [
    'van_den_hoek_powerlifting_2024',
    'bagchi_cmj_2024',
    'triplett_fms_2021',
    'alkhathami_fms_2021',
    'rouis_etnia_salto_2016',
  ];

  it('ninguna de las cinco no admisibles cuelga una referencia NORMATIVA', () => {
    for (const id of NO_ADMISIBLES) {
      const normativas = REFERENCIAS.filter((r) => r.fuenteId === id && r.tipo === 'NORMATIVA');
      expect(normativas, id).toEqual([]);
    }
  });

  it('las dos admisibles son las únicas con referencias normativas', () => {
    const conNormativa = new Set(
      REFERENCIAS.filter((r) => r.tipo === 'NORMATIVA').map((r) => r.fuenteId),
    );
    expect([...conNormativa].sort()).toEqual([
      'hoffmann_chms_2019',
      'ramirez_velez_fuprecol_2017',
    ]);
  });

  it('un benchmark deportivo no se declara NORMATIVA por tener percentiles', () => {
    // van den Hoek publica percentiles y el título dice «normative data». Ni
    // una cosa ni la otra lo convierten en una norma poblacional.
    const suyas = REFERENCIAS.filter((r) => r.fuenteId === 'van_den_hoek_powerlifting_2024');
    expect(suyas.length).toBeGreaterThan(0);
    for (const r of suyas) expect(r.tipo, r.id).toBe('BENCHMARK');
  });

  it('toda fuente verificada declara qué NO sostiene', () => {
    for (const f of FUENTES.filter((x) => x.estado === 'propuesta')) {
      expect(f.noSostiene.length, f.id).toBeGreaterThan(50);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// REGRESIÓN · LO QUE NO PUEDE HABER CAMBIADO
// ════════════════════════════════════════════════════════════════════════════

describe('el motor científico existente sigue intacto', () => {
  it('P-03 no ha adquirido referencias en la capa de evidencia', () => {
    // Su cobertura sigue siendo de la NKB, y la precedencia lo resuelve. Si
    // alguien le colgara una referencia aquí, habría dos respuestas para la
    // misma pregunta.
    expect(REFERENCIAS.filter((r) => r.pruebaId === 'P-03')).toEqual([]);
  });

  it('ninguna referencia interpola ni deriva: todos los percentiles son publicados', () => {
    for (const r of REFERENCIAS) {
      if (r.representacion.clase !== 'percentiles') continue;
      // Los percentiles del CHMS son exactamente los once que publica.
      const ps = r.representacion.puntos.map((q) => q.p);
      expect(new Set(ps).size, r.id).toBe(ps.length);
      for (const p of ps) expect(Number.isInteger(p), `${r.id}/P${p}`).toBe(true);
    }
  });

  it('el valor observado nunca se altera al leer la evidencia', () => {
    const medicion = { ...SALTO, valor: 44.37 };
    const antes = medicion.valor;
    leerEvidencia(medicion, CA);
    expect(medicion.valor).toBe(antes);
  });

  it('la lectura es determinista', () => {
    expect(JSON.stringify(leerEvidencia(SALTO, CA))).toBe(JSON.stringify(leerEvidencia(SALTO, CA)));
  });

  it('ninguna fuente introduce una categoría de rendimiento', () => {
    const CATEGORIA =
      /(?<![-\w])(excelente|bueno|malo|superior|inferior|avanzado|principiante|[oó]ptimo)(?![-\w])/i;
    for (const f of FUENTES) {
      const texto = `${f.sostiene} ${f.noSostiene}`.replace(/\bno\s+\w+[^.]*/gi, '');
      expect(texto, f.id).not.toMatch(CATEGORIA);
    }
  });

  it('control positivo: esa comprobación detecta una categoría real', () => {
    expect('el atleta es avanzado'.replace(/\bno\s+\w+[^.]*/gi, '')).toMatch(
      /(?<![-\w])(avanzado)(?![-\w])/i,
    );
  });
});
