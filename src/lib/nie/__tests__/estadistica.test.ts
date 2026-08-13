// ── NIE-1.3.1 + NIE-1.3.2 · valor observado e interpretación ───────────────

import { describe, expect, it } from 'vitest';

import { interpretar, interpretarConjunto } from '@/lib/nie/estadistica';
import { autorizar, TIPOS_CON_NORMAS } from '@/lib/nie/operaciones';
import { cargarNormas } from '@/lib/nie/nkb/cargador';
import { contextoVacio, resolver, utilizables } from '@/lib/nie/resolucion';
import type { Candidata, ContextoEvaluacion, TipoNorma } from '@/lib/nie/tipos';
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

function ctx(p: Partial<ContextoEvaluacion>): ContextoEvaluacion {
  return { ...contextoVacio(), ...UNI, ...p };
}

function observar(valor: number, p: Partial<ContextoEvaluacion> = {}, unidad = 'kg' as const): ValorObservado {
  return crearValorObservado({
    valor,
    unidad,
    contexto: ctx({ edad: 18, sexo: 'M', ...p }),
    procedencia: { origen: 'test', fecha: '2026-08-10', registroId: null },
  });
}

const candidataDe = (id: string, c: ContextoEvaluacion): Candidata =>
  utilizables(resolver(c, NORMAS)).find((x) => x.normaId === id) ??
  resolver(c, NORMAS).candidatas.find((x) => x.normaId === id)!;

// La fila HGS-CO-UNI-M-18 publica P3 23,0 · P10 26,7 · P25 32,0 · P50 37,5 …
const CTX18 = ctx({ edad: 18, sexo: 'M' });
const TN1 = candidataDe('HGS-CO-UNI-M-18', CTX18);
const TN2 = candidataDe('HGS-CO-UNI-TN2-M-18', CTX18);

// ─── A · TN-1 ───────────────────────────────────────────────────────────────
describe('A · TN-1 · localizar entre percentiles publicados', () => {
  it('1 · observado exactamente igual al P50', () => {
    const r = interpretar(observar(37.5), TN1);
    expect(r.estado).toBe('COINCIDE_CON_PERCENTIL');
    expect(r.resultado).toEqual({ tipo: 'percentil_exacto', percentil: 50, valorNormativo: 37.5 });
  });

  it('2 · observado exactamente igual a otro percentil publicado', () => {
    const r = interpretar(observar(23.0), TN1);
    expect(r.estado).toBe('COINCIDE_CON_PERCENTIL');
    if (r.resultado?.tipo !== 'percentil_exacto') throw new Error('tipo inesperado');
    expect(r.resultado.percentil).toBe(3);
  });

  it('3 · observado entre dos percentiles publicados', () => {
    const r = interpretar(observar(35.0), TN1);
    expect(r.estado).toBe('ENTRE_PERCENTILES_PUBLICADOS');
    if (r.resultado?.tipo !== 'entre_percentiles') throw new Error('tipo inesperado');
    expect(r.resultado.inferior?.percentil).toBe(25);
    expect(r.resultado.superior?.percentil).toBe(50);
  });

  it('4 · NO interpola: no aparece ningún percentil intermedio', () => {
    const r = interpretar(observar(35.0), TN1);
    if (r.resultado?.tipo !== 'entre_percentiles') throw new Error('tipo inesperado');
    const publicados = TN1.valores.tipo === 'percentiles'
      ? TN1.valores.percentiles.map((p) => p.percentil)
      : [];
    expect(publicados).toContain(r.resultado.inferior!.percentil);
    expect(publicados).toContain(r.resultado.superior!.percentil);
    expect(r.motivo).toContain('no se interpola');
  });

  it('5 · no inventa percentiles fuera del rango publicado', () => {
    const bajo = interpretar(observar(10), TN1);
    expect(bajo.estado).toBe('POR_DEBAJO_DEL_MENOR_PUBLICADO');
    if (bajo.resultado?.tipo !== 'entre_percentiles') throw new Error('tipo inesperado');
    expect(bajo.resultado.inferior).toBeNull();
    expect(bajo.resultado.superior?.percentil).toBe(3);

    const alto = interpretar(observar(90), TN1);
    expect(alto.estado).toBe('POR_ENCIMA_DEL_MAYOR_PUBLICADO');
    if (alto.resultado?.tipo !== 'entre_percentiles') throw new Error('tipo inesperado');
    expect(alto.resultado.superior).toBeNull();
    expect(alto.resultado.inferior?.percentil).toBe(97);
  });
});

// ─── B · TN-2 ───────────────────────────────────────────────────────────────
describe('B · TN-2 · puntuación z', () => {
  it('6 · calcula z cuando está autorizado', () => {
    // Fila: media 36,8 · DT 7,0
    const r = interpretar(observar(43.8), TN2);
    expect(r.estado).toBe('CALCULADA');
    expect(r.operacion).toBe('PUNTUACION_Z');
    if (r.resultado?.tipo !== 'puntuacion_z') throw new Error('tipo inesperado');
    expect(r.resultado.z).toBeCloseTo(1, 10);
    expect(r.resultado.media).toBe(36.8);
    expect(r.resultado.desviacionTipica).toBe(7.0);
  });

  it('7 · la unidad del resultado es la de la norma, sin convertir', () => {
    const r = interpretar(observar(43.8), TN2);
    expect(r.norma!.unidad).toBe('kg');
    expect(r.observado.unidad).toBe('kg');
  });

  it('8 · sin dispersión utilizable devuelve DATOS_INSUFICIENTES', () => {
    const rota: Candidata = {
      ...TN2,
      valores: { tipo: 'media_dispersion', media: 36.8, desviacionTipica: 0 },
    };
    const r = interpretar(observar(40), rota);
    expect(r.estado).toBe('DATOS_INSUFICIENTES');
    expect(r.resultado).toBeNull();
  });

  it('9 · dispersión inválida no produce infinitos ni NaN', () => {
    for (const dt of [0, -1, Number.NaN]) {
      const rota: Candidata = {
        ...TN2,
        valores: { tipo: 'media_dispersion', media: 36.8, desviacionTipica: dt },
      };
      expect(interpretar(observar(40), rota).estado, String(dt)).toBe('DATOS_INSUFICIENTES');
    }
  });

  it('10 · no asume normalidad: el motivo lo dice explícitamente', () => {
    const r = interpretar(observar(43.8), TN2);
    expect(r.motivo).toContain('No es un percentil');
    expect(r.advertencias.join(' ')).toContain('NO es normal');
  });

  it('11 · no convierte z en percentil ni aunque se pida', () => {
    const r = interpretar(observar(43.8), TN2, 'PERCENTIL_DESDE_Z');
    expect(r.estado).toBe('OPERACION_NO_AUTORIZADA');
    expect(r.resultado).toBeNull();
    expect(r.motivo).toContain('normalidad');
  });
});

// ─── C · Unidades ───────────────────────────────────────────────────────────
describe('C · unidades', () => {
  it('12 · kg contra kg continúa', () => {
    expect(interpretar(observar(37.5), TN1).estado).toBe('COINCIDE_CON_PERCENTIL');
  });

  it('13 · kg contra kgf no se convierte', () => {
    const brasil = ctx({
      pais: 'BR',
      instrumento: 'jamar-j00105',
      unidad: 'kgf',
      definicionOperacional: 'media_2a_y_3a_mano_dominante',
      posicion: 'sedestacion',
      lado: 'dominante',
      edad: 70,
      sexo: 'M',
      estaturaM: 1.75,
    });
    const c = candidataDe('HGS-BR-M170-70', brasil);
    const obs = crearValorObservado({
      valor: 30,
      unidad: 'kg',
      contexto: { ...brasil, unidad: 'kg' },
      procedencia: { origen: 'test', fecha: null, registroId: null },
    });
    const r = interpretar(obs, c);
    // La resolución ya la marcó no aplicable por unidad; el motor no interpreta.
    expect(['UNIDAD_INCOMPATIBLE', 'NORMA_NO_APLICABLE']).toContain(r.estado);
    expect(r.resultado).toBeNull();
  });

  it('14 · kgf contra lbf tampoco', () => {
    const chile = ctx({
      pais: 'CL',
      instrumento: 'jamar-pc-5030-j1',
      unidad: 'kgf',
      definicionOperacional: 'mejor_mano_derecha',
      posicion: 'sedestacion',
      lado: 'derecha',
      edad: 10,
      sexo: 'M',
    });
    const c = resolver(chile, NORMAS).candidatas.find((x) => x.normaId === 'HGS-CL-D-M-10')!;
    expect(c.aplicabilidad).toBe('NO_APLICABLE');
    expect(c.discrepancias).toContain('unidad');
  });

  it('15 · el motor no contiene ningún factor de conversión', () => {
    const r = interpretar(observar(37.5), TN1);
    expect(r.observado.valor).toBe(37.5);
    expect(r.observado.unidad).toBe('kg');
  });
});

// ─── D · Método ─────────────────────────────────────────────────────────────
describe('D · método', () => {
  it('16 · mismo instrumento interpreta', () => {
    expect(interpretar(observar(37.5), TN1).resultado).not.toBeNull();
  });

  it('17 · EQ-3 impide interpretar', () => {
    const otro = ctx({ instrumento: 'takei-tkk-5101', edad: 18, sexo: 'M' });
    const c = resolver(otro, NORMAS).candidatas.find((x) => x.normaId === 'HGS-CO-UNI-M-18')!;
    const r = interpretar(observar(37.5, { instrumento: 'takei-tkk-5101' }), c);
    expect(r.estado).toBe('NORMA_NO_APLICABLE');
    expect(r.resultado).toBeNull();
  });

  it('18 · instrumento ausente tampoco interpreta', () => {
    const sin = ctx({ instrumento: null, edad: 18, sexo: 'M' });
    const c = resolver(sin, NORMAS).candidatas.find((x) => x.normaId === 'HGS-CO-UNI-M-18')!;
    expect(c.aplicabilidad).toBe('NO_DETERMINABLE');
    expect(interpretar(observar(37.5), c).estado).toBe('NORMA_NO_APLICABLE');
  });
});

// ─── E · Calidad ────────────────────────────────────────────────────────────
describe('E · calidad', () => {
  const cucuta = ctx({
    instrumento: 'camry-digital',
    definicionOperacional: 'mejor_mano_dominante',
    lado: 'dominante',
    edad: 45,
    sexo: 'M',
  });
  const baja = candidataDe('HGS-CO-CUC-D-M-40', cucuta);

  it('19 · aplicable con calidad Baja interpreta igual', () => {
    const obs = crearValorObservado({
      valor: 39.0,
      unidad: 'kg',
      contexto: cucuta,
      procedencia: { origen: 'test', fecha: null, registroId: null },
    });
    const r = interpretar(obs, baja);
    expect(r.calidad).toBe('baja');
    expect(r.estado).toBe('COINCIDE_CON_PERCENTIL');
  });

  it('20 · aplicable con calidad Moderada interpreta igual', () => {
    const r = interpretar(observar(37.5), TN1);
    expect(r.calidad).toBe('moderada');
    expect(r.estado).toBe('COINCIDE_CON_PERCENTIL');
  });

  it('21 · la calidad no altera la operación ni el resultado', () => {
    // Mismo tipo de operación con calidades distintas: la calidad viaja aparte.
    const a = interpretar(observar(37.5), TN1);
    const obs = crearValorObservado({
      valor: 39.0,
      unidad: 'kg',
      contexto: cucuta,
      procedencia: { origen: 'test', fecha: null, registroId: null },
    });
    const b = interpretar(obs, baja);
    expect(a.operacion).toBe(b.operacion);
    expect(a.calidad).not.toBe(b.calidad);
  });
});

// ─── F · Conflictos ─────────────────────────────────────────────────────────
describe('F · conflictos', () => {
  const ensin = ctx({
    instrumento: 'takei-tkk-5101',
    definicionOperacional: 'media_ambas_manos',
    lado: 'ambas',
    edad: 15,
    sexo: 'M',
  });
  const c = candidataDe('HGS-CO-M-15', ensin);
  const obs = crearValorObservado({
    valor: 30.7,
    unidad: 'kg',
    contexto: ensin,
    procedencia: { origen: 'test', fecha: null, registroId: null },
  });

  it('22 · norma aplicable con conflicto ENSIN sigue interpretándose', () => {
    const r = interpretar(obs, c);
    expect(r.estado).toBe('COINCIDE_CON_PERCENTIL');
    expect(r.conflicto).toBe('CONFLICTO_NO_DETERMINABLE');
    expect(r.estadoNorma).toBe('ES-2');
  });

  it('23 · el conflicto no se resuelve ni desaparece', () => {
    const r = interpretar(obs, c);
    expect(r.advertencias.join(' ')).toContain('ENSIN-2015');
    expect(JSON.stringify(r)).not.toContain('ramirez_velez');
  });

  it('24 · nunca promedia: el valor normativo es el publicado', () => {
    const r = interpretar(obs, c);
    if (r.resultado?.tipo !== 'percentil_exacto') throw new Error('tipo inesperado');
    expect(r.resultado.valorNormativo).toBe(30.7);
  });
});

// ─── G · Ausencia normativa ─────────────────────────────────────────────────
describe('G · tipos sin norma admisible', () => {
  it('25 · punto de corte solicitado sin norma TN-5', () => {
    const r = interpretar(observar(37.5), TN1, 'PUNTO_DE_CORTE');
    expect(r.estado).toBe('SIN_PUNTO_DE_CORTE_ADMISIBLE');
    expect(r.resultado).toBeNull();
    expect(r.motivo).toContain('no son sustitutos');
  });

  it('26 · clasificación solicitada sin norma TN-7', () => {
    const r = interpretar(observar(37.5), TN1, 'CLASIFICACION');
    expect(r.estado).toBe('SIN_CLASIFICACION_ADMISIBLE');
    expect(r.resultado).toBeNull();
  });

  it.each(['TN-3', 'TN-4', 'TN-5', 'TN-6', 'TN-7'] as const)(
    '27-28 · %s no tiene operación automática porque no hay normas de ese tipo',
    (tipo: TipoNorma) => {
      const a = autorizar(tipo, 'AUTOMATICA');
      expect(a.autorizada).toBe(false);
      expect(a.operacion).toBe('NINGUNA');
    },
  );

  it('la NKB solo tiene normas TN-1 y TN-2, y el motor no inventa las demás', () => {
    expect(TIPOS_CON_NORMAS).toEqual(['TN-1', 'TN-2']);
    expect(new Set(NORMAS.map((n) => n.tipo))).toEqual(new Set(['TN-1', 'TN-2']));
  });

  it('sin candidatas utilizables devuelve SIN_NORMA_APLICABLE', () => {
    const r = interpretarConjunto(observar(37.5, { edad: 75 }), []);
    expect(r).toHaveLength(1);
    expect(r[0].estado).toBe('SIN_NORMA_APLICABLE');
    expect(r[0].motivo).toContain('describe la evidencia, no al sujeto');
  });

  it('LMS no autoriza ninguna derivación', () => {
    const chile = ctx({
      pais: 'CL',
      instrumento: 'jamar-pc-5030-j1',
      unidad: 'lbf',
      definicionOperacional: 'mejor_mano_derecha',
      posicion: 'sedestacion',
      lado: 'derecha',
      edad: 10,
      sexo: 'M',
    });
    const c = candidataDe('HGS-CL-D-M-10', chile);
    const obs = crearValorObservado({
      valor: 34,
      unidad: 'lbf',
      contexto: chile,
      procedencia: { origen: 'test', fecha: null, registroId: null },
    });
    const r = interpretar(obs, c, 'DERIVAR_DESDE_LMS');
    expect(r.estado).toBe('OPERACION_NO_AUTORIZADA');
    expect(r.motivo).toContain('OR-3');
  });
});

// ─── H · Integridad y conjunto ──────────────────────────────────────────────
describe('H · integridad', () => {
  it('32 · cada resultado conserva la trazabilidad completa', () => {
    const r = interpretar(observar(37.5), TN1);
    expect(r.procedencia!.fichero).toMatch(/\.md$/);
    expect(r.procedencia!.referencia).not.toBe('');
    expect(r.procedencia!.tabla).toContain('P50');
  });

  it('33 · con dos candidatas utilizables devuelve dos resultados', () => {
    const r = interpretarConjunto(observar(37.5), utilizables(resolver(CTX18, NORMAS)));
    expect(r).toHaveLength(2);
    expect(r.map((x) => x.norma!.tipo).sort()).toEqual(['TN-1', 'TN-2']);
  });

  it('34 · no consolida ni elige entre ellas', () => {
    const u = utilizables(resolver(CTX18, NORMAS));
    const r = interpretarConjunto(observar(37.5), u);
    expect(r.map((x) => x.norma!.id)).toEqual(u.map((c) => c.normaId));
  });

  it('el resultado nunca es un número desnudo', () => {
    const r = interpretar(observar(37.5), TN1);
    expect(r).toHaveProperty('estado');
    expect(r).toHaveProperty('aplicabilidad');
    expect(r).toHaveProperty('calidad');
    expect(r).toHaveProperty('conflicto');
    expect(r).toHaveProperty('procedencia');
    expect(r).toHaveProperty('limitaciones');
    expect(r).toHaveProperty('advertencias');
  });
});

// ─── Pruebas de propiedad ───────────────────────────────────────────────────
describe('propiedades · sobre 100 valores observados', () => {
  const VALORES = Array.from({ length: 100 }, (_, i) => 5 + i * 0.9);

  it.each([['TN-1', TN1], ['TN-2', TN2]] as const)(
    '%s · nunca altera el valor observado ni su unidad',
    (_n, cand) => {
      for (const v of VALORES) {
        const r = interpretar(observar(v), cand);
        expect(r.observado.valor).toBe(v);
        expect(r.observado.unidad).toBe('kg');
      }
    },
  );

  it('nunca altera el valor normativo publicado', () => {
    const enNkb = NORMAS.find((n) => n.id === 'HGS-CO-UNI-M-18')!;
    for (const v of VALORES) {
      const r = interpretar(observar(v), TN1);
      const res = r.resultado;
      if (res?.tipo === 'percentil_exacto' && enNkb.valores.tipo === 'percentiles') {
        expect(enNkb.valores.percentiles.some((p) => p.valor === res.valorNormativo)).toBe(true);
      }
    }
  });

  it('los percentiles devueltos siempre son percentiles publicados', () => {
    const publicados =
      TN1.valores.tipo === 'percentiles' ? TN1.valores.percentiles.map((p) => p.percentil) : [];
    for (const v of VALORES) {
      const r = interpretar(observar(v), TN1);
      if (r.resultado?.tipo === 'percentil_exacto') {
        expect(publicados).toContain(r.resultado.percentil);
      }
      if (r.resultado?.tipo === 'entre_percentiles') {
        if (r.resultado.inferior) expect(publicados).toContain(r.resultado.inferior.percentil);
        if (r.resultado.superior) expect(publicados).toContain(r.resultado.superior.percentil);
      }
    }
  });

  it('nunca produce una clasificación', () => {
    const juicios = /\b(normal|anormal|bajo|alto|deficiente|insuficiente|riesgo|apto|excelente|bueno|malo)\b/i;
    for (const v of VALORES) {
      for (const cand of [TN1, TN2]) {
        const r = interpretar(observar(v), cand);
        const delMotor = [r.estado, r.operacion, r.motivo].join(' ');
        expect(delMotor.replace(/\bno (es|son)\b[^.]*/gi, ''), `${v}`).not.toMatch(juicios);
      }
    }
  });

  it('el resultado es determinista', () => {
    for (const v of VALORES.slice(0, 20)) {
      expect(JSON.stringify(interpretar(observar(v), TN1))).toBe(
        JSON.stringify(interpretar(observar(v), TN1)),
      );
    }
  });
});

// ─── El valor observado no puede entrar en la NKB ───────────────────────────
describe('separación NKB / valor observado', () => {
  it('el contexto de resolución no admite el valor observado', () => {
    expect(Object.keys(contextoVacio())).not.toContain('valor');
  });

  it('crear un valor observado exige coherencia de unidad', () => {
    expect(() =>
      crearValorObservado({
        valor: 30,
        unidad: 'kgf',
        contexto: ctx({ edad: 18, sexo: 'M' }),
        procedencia: { origen: 'test', fecha: null, registroId: null },
      }),
    ).toThrow(/no convierte unidades/);
  });

  it('rechaza un valor que no es un número finito', () => {
    for (const v of [Number.NaN, Number.POSITIVE_INFINITY]) {
      expect(() =>
        crearValorObservado({
          valor: v,
          unidad: 'kg',
          contexto: ctx({ edad: 18, sexo: 'M' }),
          procedencia: { origen: 'test', fecha: null, registroId: null },
        }),
      ).toThrow(/número finito/);
    }
  });

  it('ninguna norma cargada contiene un valor observado', () => {
    for (const n of NORMAS.slice(0, 50)) {
      expect(Object.keys(n)).not.toContain('observado');
      expect(Object.keys(n)).not.toContain('sujeto');
    }
  });
});
