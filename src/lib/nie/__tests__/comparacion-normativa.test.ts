// ── NIE-1.6 + NIE-1.7 · comparación controlada e interpretación ────────────

import { describe, expect, it } from 'vitest';

import {
  comparables,
  compararValor,
  interpretarNormativamente,
} from '@/lib/nie/comparacion-normativa';
import { cargarNormas } from '@/lib/nie/nkb/cargador';
import { contextoVacio, resolver } from '@/lib/nie/resolucion';
import type { Candidata, ContextoEvaluacion, Unidad } from '@/lib/nie/tipos';
import { crearValorObservado, type ValorObservado } from '@/lib/nie/valor-observado';

const NORMAS = cargarNormas();

const UNI = {
  variable: 'fuerza_prension_manual',
  pais: 'CO',
  instrumento: 'takei-t18-tkk-smedley-iii',
  unidad: 'kg',
  definicionOperacional: 'media_ambas_manos',
  posicion: 'bipedestacion',
  lado: 'ambas',
} as const;

const BRASIL = {
  variable: 'fuerza_prension_manual',
  pais: 'BR',
  instrumento: 'jamar-j00105',
  unidad: 'kgf',
  definicionOperacional: 'media_2a_y_3a_mano_dominante',
  posicion: 'sedestacion',
  lado: 'dominante',
} as const;

const ctx = (p: Partial<ContextoEvaluacion>): ContextoEvaluacion => ({
  ...contextoVacio(),
  ...p,
});

function obs(valor: number, contexto: ContextoEvaluacion, unidad: Unidad = 'kg'): ValorObservado {
  return crearValorObservado({
    valor,
    unidad,
    contexto: { ...contexto, unidad },
    procedencia: { origen: 'test', fecha: null, registroId: null },
  });
}

const cand = (id: string, c: ContextoEvaluacion): Candidata =>
  resolver(c, NORMAS).candidatas.find((x) => x.normaId === id)!;

// HGS-CO-UNI-M-18: P3 23,0 · P10 26,7 · P25 32,0 · P50 37,5 · P75 42,0 · P90 45,5 · P97 49,5
const C18 = ctx({ ...UNI, edad: 18, sexo: 'M' });
const TN1 = cand('HGS-CO-UNI-M-18', C18);
const TN2 = cand('HGS-CO-UNI-TN2-M-18', C18);

// ─── TN-1 · percentiles ─────────────────────────────────────────────────────
describe('TN-1 · localización sin interpolar', () => {
  it('coincidencia exacta con P50', () => {
    const r = compararValor(obs(37.5, C18), TN1);
    expect(r.comparacion.estado).toBe('COINCIDE_CON_PERCENTIL');
    expect(r.comparacion.resultado).toEqual({
      tipo: 'percentil_exacto',
      percentil: 50,
      valorNormativo: 37.5,
    });
  });

  it('coincidencia exacta con P25', () => {
    const r = compararValor(obs(32.0, C18), TN1);
    if (r.comparacion.resultado?.tipo !== 'percentil_exacto') throw new Error('tipo inesperado');
    expect(r.comparacion.resultado.percentil).toBe(25);
  });

  it('valor entre P25 y P50 devuelve el par, no un percentil intermedio', () => {
    const r = compararValor(obs(35.0, C18), TN1);
    expect(r.comparacion.estado).toBe('ENTRE_PERCENTILES_PUBLICADOS');
    if (r.comparacion.resultado?.tipo !== 'entre_percentiles') throw new Error('tipo inesperado');
    expect(r.comparacion.resultado.inferior?.percentil).toBe(25);
    expect(r.comparacion.resultado.superior?.percentil).toBe(50);
    // Ningún percentil calculado aparece por ninguna parte.
    expect(JSON.stringify(r)).not.toMatch(/"percentil":(?!3\b|10\b|25\b|50\b|75\b|90\b|97\b)\d+/);
  });

  it('por debajo del mínimo publicado', () => {
    const r = compararValor(obs(10, C18), TN1);
    expect(r.comparacion.estado).toBe('POR_DEBAJO_DEL_MENOR_PUBLICADO');
    if (r.comparacion.resultado?.tipo !== 'entre_percentiles') throw new Error('tipo inesperado');
    expect(r.comparacion.resultado.inferior).toBeNull();
  });

  it('por encima del máximo publicado', () => {
    const r = compararValor(obs(90, C18), TN1);
    expect(r.comparacion.estado).toBe('POR_ENCIMA_DEL_MAYOR_PUBLICADO');
    if (r.comparacion.resultado?.tipo !== 'entre_percentiles') throw new Error('tipo inesperado');
    expect(r.comparacion.resultado.superior).toBeNull();
  });

  it('un valor justo en medio de dos percentiles no se interpola', () => {
    // Punto medio aritmético entre P25 (32,0) y P50 (37,5) = 34,75
    const r = compararValor(obs(34.75, C18), TN1);
    expect(r.comparacion.estado).toBe('ENTRE_PERCENTILES_PUBLICADOS');
    expect(r.comparacion.motivo).toContain('no se interpola');
  });
});

// ─── TN-2 · puntuación z ────────────────────────────────────────────────────
describe('TN-2 · puntuación z', () => {
  it('calcula z correctamente', () => {
    const r = compararValor(obs(43.8, C18), TN2); // media 36,8 · DT 7,0
    expect(r.comparacion.estado).toBe('CALCULADA');
    if (r.comparacion.resultado?.tipo !== 'puntuacion_z') throw new Error('tipo inesperado');
    expect(r.comparacion.resultado.z).toBeCloseTo(1, 10);
  });

  it('z negativo', () => {
    const r = compararValor(obs(29.8, C18), TN2);
    if (r.comparacion.resultado?.tipo !== 'puntuacion_z') throw new Error('tipo inesperado');
    expect(r.comparacion.resultado.z).toBeCloseTo(-1, 10);
  });

  it('conserva media, dispersión y unidad de la norma', () => {
    const r = compararValor(obs(43.8, C18), TN2);
    if (r.comparacion.resultado?.tipo !== 'puntuacion_z') throw new Error('tipo inesperado');
    expect(r.comparacion.resultado.media).toBe(36.8);
    expect(r.comparacion.resultado.desviacionTipica).toBe(7.0);
    expect(r.norma.unidad).toBe('kg');
    expect(r.unidad.valorOriginal).toBe(43.8);
  });

  it('DT no utilizable devuelve estado explícito', () => {
    const rota: Candidata = {
      ...TN2,
      valores: { tipo: 'media_dispersion', media: 36.8, desviacionTipica: 0 },
    };
    const r = compararValor(obs(40, C18), rota);
    expect(r.comparacion.estado).toBe('DATOS_INSUFICIENTES');
    expect(r.comparacion.resultado).toBeNull();
  });

  it('z no se convierte en percentil ni aunque se pida', () => {
    const r = compararValor(obs(43.8, C18), TN2, { solicitud: 'PERCENTIL_DESDE_Z' });
    expect(r.comparacion.estado).toBe('OPERACION_NO_AUTORIZADA');
    expect(r.comparacion.motivo).toContain('normalidad');
  });
});

// ─── Unidades ───────────────────────────────────────────────────────────────
describe('unidades · nunca en silencio', () => {
  const CBR = ctx({ ...BRASIL, edad: 70, sexo: 'M', estaturaM: 1.75 });
  const NBR = cand('HGS-BR-M170-70', CBR);

  it('misma unidad compara directamente', () => {
    const r = compararValor(obs(37.5, C18), TN1);
    expect(r.unidad.estado).toBe('MISMA_UNIDAD');
    expect(r.unidad.factorAplicado).toBeNull();
  });

  it('par autorizado pero NO solicitado detiene la comparación', () => {
    const enLbf = obs(66, ctx({ ...BRASIL, edad: 70, sexo: 'M', estaturaM: 1.75 }), 'lbf');
    const r = compararValor(enLbf, NBR);
    expect(r.unidad.estado).toBe('CONVERSION_DISPONIBLE_NO_SOLICITADA');
    expect(r.comparacion.resultado).toBeNull();
    expect(r.unidad.motivo).toContain('decisión externa');
  });

  it('lbf → kgf autorizado se aplica solo al pedirlo', () => {
    const enLbf = obs(66, ctx({ ...BRASIL, edad: 70, sexo: 'M', estaturaM: 1.75 }), 'lbf');
    const r = compararValor(enLbf, NBR, { convertirUnidad: true });
    expect(r.unidad.estado).toBe('CONVERSION_AUTORIZADA');
    expect(r.unidad.factorAplicado).toBeCloseTo(0.45359237, 10);
    expect(r.unidad.valorComparado).toBeCloseTo(29.937, 3);
  });

  it('el valor original permanece intacto tras convertir', () => {
    const enLbf = obs(66, ctx({ ...BRASIL, edad: 70, sexo: 'M', estaturaM: 1.75 }), 'lbf');
    const r = compararValor(enLbf, NBR, { convertirUnidad: true });
    expect(r.unidad.valorOriginal).toBe(66);
    expect(r.unidad.unidadOriginal).toBe('lbf');
    expect(r.unidad.unidadComparada).toBe('kgf');
  });

  it('kg → kgf sigue bloqueado aunque se pida convertir', () => {
    const enKg = obs(30, ctx({ ...BRASIL, edad: 70, sexo: 'M', estaturaM: 1.75 }), 'kg');
    const c = cand('HGS-BR-M170-70', { ...CBR, unidad: 'kg' });
    const r = compararValor(enKg, c, { convertirUnidad: true });
    // La resolución ya la marcó no aplicable por unidad.
    expect(['UNIDAD_INCOMPATIBLE', 'NO_COMPARABLE']).toContain(r.comparacion.estado);
    expect(r.comparacion.resultado).toBeNull();
  });

  it('el valor normativo nunca se convierte: se convierte el observado', () => {
    const antes = JSON.stringify(NORMAS.find((n) => n.id === 'HGS-BR-M170-70')!.valores);
    const enLbf = obs(66, ctx({ ...BRASIL, edad: 70, sexo: 'M', estaturaM: 1.75 }), 'lbf');
    const r = compararValor(enLbf, NBR, { convertirUnidad: true });
    // La ficha sigue publicando en kgf, con los mismos números que antes de comparar.
    expect(r.norma.unidad).toBe('kgf');
    expect(JSON.stringify(NORMAS.find((n) => n.id === 'HGS-BR-M170-70')!.valores)).toBe(antes);
    expect(JSON.stringify(cargarNormas().find((n) => n.id === 'HGS-BR-M170-70')!.valores)).toBe(
      antes,
    );
    // Y lo convertido fue el observado, no la norma.
    expect(r.unidad.valorComparado).not.toBe(r.unidad.valorOriginal);
  });
});

// ─── EQ-3 ───────────────────────────────────────────────────────────────────
describe('EQ-3 · la unidad no resuelve un problema de método', () => {
  it('produce NO_COMPARABLE_EQ3, distinto de NO_COMPARABLE', () => {
    const otro = ctx({ ...UNI, instrumento: 'takei-tkk-5101', edad: 18, sexo: 'M' });
    const r = compararValor(obs(37.5, otro), cand('HGS-CO-UNI-M-18', otro));
    expect(r.comparacion.estado).toBe('NO_COMPARABLE_EQ3');
    expect(r.comparacion.resultado).toBeNull();
  });

  it('se comprueba antes que la unidad: convertir no lo desbloquea', () => {
    const otro = ctx({ ...UNI, instrumento: 'takei-tkk-5101', edad: 18, sexo: 'M' });
    const r = compararValor(obs(37.5, otro), cand('HGS-CO-UNI-M-18', otro), {
      convertirUnidad: true,
    });
    expect(r.comparacion.estado).toBe('NO_COMPARABLE_EQ3');
    expect(r.comparacion.motivo).toContain('EQ-3');
  });

  it('mismo método sí permite comparar', () => {
    expect(compararValor(obs(37.5, C18), TN1).comparacion.resultado).not.toBeNull();
  });
});

// ─── ES-2 y conflictos ──────────────────────────────────────────────────────
describe('ES-2 y conflicto · una comparación válida no borra la objeción', () => {
  const ENSIN = ctx({
    variable: 'fuerza_prension_manual',
    pais: 'CO',
    instrumento: 'takei-tkk-5101',
    unidad: 'kg',
    definicionOperacional: 'media_ambas_manos',
    posicion: 'bipedestacion',
    lado: 'ambas',
    edad: 15,
    sexo: 'M',
  });
  const r = compararValor(obs(30.7, ENSIN), cand('HGS-CO-M-15', ENSIN));

  it('la comparación se produce', () => {
    expect(r.comparacion.estado).toBe('COINCIDE_CON_PERCENTIL');
  });

  it('y el estado de evidencia lo dice', () => {
    expect(r.estadoEvidencia).toBe('CUESTIONADA');
    expect(r.norma.estado).toBe('ES-2');
  });

  it('y el conflicto sigue visible, sin resolverse', () => {
    expect(r.conflicto).toBe('CONFLICTO_NO_DETERMINABLE');
    expect(r.advertencias.join(' ')).toContain('ENSIN-2015');
  });

  it('la interpretación de conjunto lo advierte', () => {
    const i = interpretarNormativamente(obs(30.7, ENSIN), resolver(ENSIN, NORMAS).candidatas);
    expect(i.advertencias.join(' ')).toContain('no elimina la objeción');
    expect(i.advertencias.join(' ')).toContain('no lo resuelve');
  });
});

// ─── Múltiples normas ───────────────────────────────────────────────────────
describe('múltiples normas · ninguna selección', () => {
  const i = interpretarNormativamente(obs(37.5, C18), resolver(C18, NORMAS).candidatas);
  const c = comparables(i);

  it('devuelve las dos comparables', () => {
    expect(c).toHaveLength(2);
    expect(c.map((x) => x.norma.id).sort()).toEqual(['HGS-CO-UNI-M-18', 'HGS-CO-UNI-TN2-M-18']);
  });

  it('cada una trae su identidad, calidad, estado y trazabilidad', () => {
    for (const x of c) {
      expect(x.norma.poblacion).not.toBe('');
      expect(x.norma.calidad).toBe('moderada');
      expect(x.procedencia.referencia).toBe('vivas_diaz_hgs_universitarios_2016');
      // La cabecera literal de su tabla de origen, que difiere según el tipo.
      expect(x.procedencia.tabla).toMatch(x.norma.tipo === 'TN-1' ? /P50/ : /Media/);
    }
  });

  it('la calidad no altera el orden ni descarta', () => {
    expect(c.map((x) => x.norma.id)).toEqual(
      NORMAS.filter((n) => c.some((x) => x.norma.id === n.id)).map((n) => n.id),
    );
  });

  it('advierte que no elige', () => {
    expect(i.advertencias.join(' ')).toContain('no elige entre ellas');
  });

  it('el estado del conjunto no es el de la primera norma', () => {
    // TN-1 localiza (COINCIDE_CON_PERCENTIL) y TN-2 calcula (CALCULADA).
    expect(new Set(c.map((x) => x.comparacion.estado)).size).toBe(2);
    expect(i.estadoGlobal).toBe('ESTADOS_DIVERGENTES');
    expect(i.estadoGlobal).not.toBe(c[0].comparacion.estado);
    expect(i.advertencias.join(' ')).toContain('No hay un resultado único');
  });

  it('cuando todas coinciden, el estado del conjunto es ese, por unanimidad', () => {
    // 34,75 cae entre percentiles en TN-1; en TN-2 no hay percentiles que localizar.
    const solo = interpretarNormativamente(obs(35, C18), [TN1]);
    expect(solo.estadoGlobal).toBe('ENTRE_PERCENTILES_PUBLICADOS');
    expect(solo.advertencias.join(' ')).not.toContain('no elige');
  });

  it('sin ninguna comparable, el conjunto lo dice', () => {
    const sinNorma = ctx({ ...UNI, edad: 200, sexo: 'M' });
    const i2 = interpretarNormativamente(obs(37.5, sinNorma), resolver(sinNorma, NORMAS).candidatas);
    expect(i2.estadoGlobal).toBe('SIN_NORMA_APLICABLE');
    expect(comparables(i2)).toHaveLength(0);
    // Y aun así devuelve una entrada por candidata, con su motivo.
    expect(i2.resultadosNormativos).toHaveLength(NORMAS.length);
  });
});

// ─── Interpretación ≠ clasificación ─────────────────────────────────────────
describe('interpretación nunca es clasificación', () => {
  const JUICIOS =
    /\b(bajo|alto|normal|anormal|deficiente|adecuado|excelente|riesgo|insuficiente|[oó]ptimo|apto)\b/i;

  it.each([10, 25, 34.75, 37.5, 43.8, 90])('el valor %s no produce ninguna categoría', (v) => {
    for (const cd of [TN1, TN2]) {
      const r = compararValor(obs(v, C18), cd);
      const delMotor = [r.comparacion.estado, r.comparacion.operacion, r.comparacion.motivo].join(' ');
      expect(delMotor.replace(/\bno (es|son|se)\b[^.]*/gi, ''), `${v}`).not.toMatch(JUICIOS);
    }
  });

  it('«fuera de rango» no se convierte en bajo ni alto', () => {
    const bajo = compararValor(obs(5, C18), TN1);
    const alto = compararValor(obs(200, C18), TN1);
    expect(bajo.comparacion.estado).toBe('POR_DEBAJO_DEL_MENOR_PUBLICADO');
    expect(alto.comparacion.estado).toBe('POR_ENCIMA_DEL_MAYOR_PUBLICADO');
    for (const r of [bajo, alto]) {
      expect(r.comparacion.motivo).toContain('No se extrapola');
    }
  });

  it('los estados posibles son todos descriptivos', () => {
    const estados = new Set<string>();
    for (const v of [5, 32, 35, 37.5, 200]) {
      for (const cd of [TN1, TN2]) estados.add(compararValor(obs(v, C18), cd).comparacion.estado);
    }
    for (const e of estados) expect(e).not.toMatch(JUICIOS);
  });
});

// ─── Propiedades ────────────────────────────────────────────────────────────
describe('propiedades · sobre 80 valores', () => {
  const VALORES = Array.from({ length: 80 }, (_, i) => 3 + i * 1.17);
  const PUBLICADOS = TN1.valores.tipo === 'percentiles'
    ? TN1.valores.percentiles.map((p) => p.percentil)
    : [];

  it('nunca modifica el valor observado', () => {
    for (const v of VALORES) {
      expect(compararValor(obs(v, C18), TN1).unidad.valorOriginal).toBe(v);
    }
  });

  it('nunca modifica el valor normativo', () => {
    const enNkb = NORMAS.find((n) => n.id === 'HGS-CO-UNI-M-18')!;
    for (const v of VALORES) {
      const r = compararValor(obs(v, C18), TN1);
      const res = r.comparacion.resultado;
      if (res?.tipo === 'percentil_exacto' && enNkb.valores.tipo === 'percentiles') {
        expect(enNkb.valores.percentiles.some((p) => p.valor === res.valorNormativo)).toBe(true);
      }
    }
  });

  it('nunca crea un percentil no publicado', () => {
    for (const v of VALORES) {
      const res = compararValor(obs(v, C18), TN1).comparacion.resultado;
      if (res?.tipo === 'percentil_exacto') expect(PUBLICADOS).toContain(res.percentil);
      if (res?.tipo === 'entre_percentiles') {
        if (res.inferior) expect(PUBLICADOS).toContain(res.inferior.percentil);
        if (res.superior) expect(PUBLICADOS).toContain(res.superior.percentil);
      }
    }
  });

  it('nunca convierte sin que se pida', () => {
    const CBR = ctx({ ...BRASIL, edad: 70, sexo: 'M', estaturaM: 1.75 });
    const NBR = cand('HGS-BR-M170-70', CBR);
    for (const v of VALORES) {
      const r = compararValor(obs(v, CBR, 'lbf'), NBR);
      expect(r.unidad.factorAplicado).toBeNull();
      expect(r.unidad.valorComparado).toBe(v);
    }
  });

  it('nunca resuelve EQ-3 ni el conflicto', () => {
    const otro = ctx({ ...UNI, instrumento: 'takei-tkk-5101', edad: 18, sexo: 'M' });
    const cEq3 = cand('HGS-CO-UNI-M-18', otro);
    for (const v of VALORES) {
      expect(compararValor(obs(v, otro), cEq3, { convertirUnidad: true }).comparacion.estado).toBe(
        'NO_COMPARABLE_EQ3',
      );
    }
  });

  it('el conjunto devuelve siempre una entrada por candidata', () => {
    const candidatas = resolver(C18, NORMAS).candidatas;
    for (const v of VALORES.slice(0, 10)) {
      const i = interpretarNormativamente(obs(v, C18), candidatas);
      expect(i.resultadosNormativos).toHaveLength(candidatas.length);
    }
  });

  it('es determinista', () => {
    for (const v of VALORES.slice(0, 15)) {
      expect(JSON.stringify(compararValor(obs(v, C18), TN1))).toBe(
        JSON.stringify(compararValor(obs(v, C18), TN1)),
      );
    }
  });
});
