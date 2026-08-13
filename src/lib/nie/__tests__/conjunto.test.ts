// ── NIE-1.3 + NIE-1.4 · conjunto normativo y comparación estructurada ──────
//
// Los quince casos obligatorios del sprint, más las pruebas de no reducción
// arbitraria: si alguien introduce una regla de selección, estas fallan.

import { describe, expect, it } from 'vitest';

import { compararCandidatas, describirDiferenciaDeValores } from '@/lib/nie/comparacion';
import { cargarNormas } from '@/lib/nie/nkb/cargador';
import { contextoVacio, resolver, utilizables } from '@/lib/nie/resolucion';
import type { Candidata, ContextoEvaluacion } from '@/lib/nie/tipos';

const NORMAS = cargarNormas();

function ctx(p: Partial<ContextoEvaluacion>): ContextoEvaluacion {
  return { ...contextoVacio(), variable: 'fuerza_prension_manual', ...p };
}

const UNI = {
  pais: 'CO',
  instrumento: 'takei-t18-tkk-smedley-iii',
  unidad: 'kg',
  definicionOperacional: 'media_ambas_manos',
  posicion: 'bipedestacion',
  lado: 'ambas',
} as const;

const CUCUTA = {
  pais: 'CO',
  instrumento: 'camry-digital',
  unidad: 'kg',
  definicionOperacional: 'mejor_mano_dominante',
  posicion: 'bipedestacion',
  lado: 'dominante',
} as const;

const ENSIN = {
  pais: 'CO',
  instrumento: 'takei-tkk-5101',
  unidad: 'kg',
  definicionOperacional: 'media_ambas_manos',
  posicion: 'bipedestacion',
  lado: 'ambas',
} as const;

// ─── NIE-1.3.1 · el valor normativo entra en el resultado ──────────────────
describe('NIE-1.3.1 · contrato de resultado', () => {
  const c = utilizables(resolver(ctx({ ...UNI, edad: 18, sexo: 'M' }), NORMAS)).find(
    (x) => x.normaId === 'HGS-CO-UNI-M-18',
  )!;

  it('transporta los percentiles publicados sin tocarlos', () => {
    expect(c.valores.tipo).toBe('percentiles');
    if (c.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    // Tabla II de la ficha: P3 23,0 · P50 37,5 · P97 49,5
    const p = Object.fromEntries(c.valores.percentiles.map((x) => [x.percentil, x.valor]));
    expect(p[3]).toBe(23.0);
    expect(p[50]).toBe(37.5);
    expect(p[97]).toBe(49.5);
    expect(c.valores.percentiles).toHaveLength(7);
  });

  it('trae la trazabilidad completa: norma, ficha, fichero, tabla, fila y fuente', () => {
    expect(c.procedencia.normaId).toBe('HGS-CO-UNI-M-18');
    expect(c.procedencia.fichaId).toBe('HGS-CO-UNI-TN1');
    expect(c.procedencia.fichero).toBe('HGS-CO-UNI-TN1-percentiles.md');
    expect(c.procedencia.tabla).toContain('P50');
    expect(c.procedencia.fila).toContain('18');
    expect(c.procedencia.referencia).toBe('vivas_diaz_hgs_universitarios_2016');
  });

  it('ninguna candidata carece de trazabilidad', () => {
    const r = resolver(ctx({ edad: 20 }), NORMAS);
    for (const x of r.candidatas) {
      expect(x.procedencia.referencia, x.normaId).not.toBe('');
      expect(x.procedencia.fichero, x.normaId).toMatch(/\.md$/);
      expect(x.procedencia.tabla, x.normaId).not.toBe('');
    }
  });

  it('la media y la dispersión llegan como tales, no como percentiles', () => {
    const tn2 = utilizables(resolver(ctx({ ...UNI, edad: 18, sexo: 'M' }), NORMAS)).find(
      (x) => x.normaId === 'HGS-CO-UNI-TN2-M-18',
    )!;
    expect(tn2.valores.tipo).toBe('media_dispersion');
    if (tn2.valores.tipo !== 'media_dispersion') throw new Error('tipo inesperado');
    expect(tn2.valores.media).toBe(36.8);
    expect(tn2.valores.desviacionTipica).toBe(7.0);
  });

  it('conserva L, M y S donde la fuente los publica', () => {
    const cl = NORMAS.find((n) => n.id === 'HGS-CL-D-M-06')!;
    expect(cl.parametrosModelo).toEqual({ L: 1.5, M: 20.38, S: 0.23 });
    // Signo menos tipográfico de la ficha chilena.
    expect(NORMAS.find((n) => n.id === 'HGS-CL-I-M-06')!.parametrosModelo!.L).toBe(-0.88);
  });
});

// ─── NIE-1.3.3 · no reducción arbitraria ───────────────────────────────────
describe('NIE-1.3.3 · el motor no reduce el conjunto', () => {
  const r = resolver(ctx({ ...UNI, edad: 22, sexo: 'M' }), NORMAS);
  const u = utilizables(r);

  it('devuelve las dos normas aplicables', () => {
    expect(u).toHaveLength(2);
    expect(u.map((x) => x.normaId).sort()).toEqual([
      'HGS-CO-UNI-M-22',
      'HGS-CO-UNI-TN2-M-22',
    ]);
  });

  it.each([
    ['la primera', (l: readonly Candidata[]) => [l[0]]],
    ['la última', (l: readonly Candidata[]) => [l[l.length - 1]]],
    ['la de mayor n', (l: readonly Candidata[]) => [[...l].sort((a, b) => (b.nCelda ?? 0) - (a.nCelda ?? 0))[0]]],
    ['la de mayor calidad', (l: readonly Candidata[]) => [[...l].sort((a, b) => a.calidad.localeCompare(b.calidad))[0]]],
  ])('no equivale a quedarse con %s', (_n, reducir) => {
    expect(u.length).toBeGreaterThan(reducir(u).length);
  });

  it('no fusiona, no promedia y no genera una norma consolidada', () => {
    const ids = u.map((x) => x.normaId);
    expect(ids.every((id) => NORMAS.some((n) => n.id === id))).toBe(true);
    expect(ids.some((id) => /consolidad|media|fusion/i.test(id))).toBe(false);
  });

  it('el resumen registra cuántas hay en cada estado, sin ordenarlas', () => {
    expect(r.resumen.APLICABLE + r.resumen.APLICABLE_CON_RESERVAS).toBe(u.length);
    expect(r.advertencias.join(' ')).toContain('no elige');
  });
});

// ─── NIE-1.3.4 · TN-1 y TN-2 no se confunden ───────────────────────────────
describe('NIE-1.3.4 · el tipo normativo se conserva', () => {
  const u = utilizables(resolver(ctx({ ...UNI, edad: 22, sexo: 'M' }), NORMAS));

  it('coexisten TN-1 y TN-2 para el mismo estrato', () => {
    expect(u.map((x) => x.tipo).sort()).toEqual(['TN-1', 'TN-2']);
  });

  it('sus valores son de clase distinta y no se contraponen', () => {
    const [a, b] = u;
    expect(new Set([a.valores.tipo, b.valores.tipo]).size).toBe(2);
    expect(describirDiferenciaDeValores(a, b)).toContain('no se contraponen');
  });
});

// ─── NIE-1.3.6 · las tres colisiones de instrumento ────────────────────────
describe('NIE-1.3.6 · EQ-3 bloquea la aplicabilidad', () => {
  it.each([
    ['Takei TKK 5101 vs Takei T-18 SMEDLY III', 'takei-tkk-5101', 'HGS-CO-UNI-M-22', UNI],
    ['Takei T-18 SMEDLY III vs Takei TKK 5101', 'takei-t18-tkk-smedley-iii', 'HGS-CO-M-15', ENSIN],
    ['JAMAR PC-5030 J1 vs JAMAR J00105', 'jamar-pc-5030-j1', 'HGS-BR-M170-70', null],
    ['Smedley S vs Takei T-18 SMEDLY III', 'smedley-s', 'HGS-CO-UNI-M-22', UNI],
  ] as const)('%s no son intercambiables', (_n, instrumento, normaId, base) => {
    const contexto = base
      ? ctx({ ...base, instrumento, edad: normaId.includes('-15') ? 15 : 22, sexo: 'M' })
      : ctx({
          pais: 'BR',
          instrumento,
          unidad: 'kgf',
          definicionOperacional: 'media_2a_y_3a_mano_dominante',
          posicion: 'sedestacion',
          lado: 'dominante',
          edad: 70,
          sexo: 'M',
          estaturaM: 1.75,
        });
    const c = resolver(contexto, NORMAS).candidatas.find((x) => x.normaId === normaId)!;
    expect(c.aplicabilidad).toBe('NO_APLICABLE');
    expect(c.discrepancias).toContain('instrumento');
  });

  it('no basta con que ambos sean dinamómetros, midan prensión y usen kg', () => {
    const c = resolver(ctx({ ...UNI, instrumento: 'camry-digital', edad: 22, sexo: 'M' }), NORMAS)
      .candidatas.find((x) => x.normaId === 'HGS-CO-UNI-M-22')!;
    // Misma variable, misma unidad, mismo país, misma posición… y aun así no.
    expect(c.coincidencias).toContain('unidad');
    expect(c.coincidencias).toContain('pais');
    expect(c.aplicabilidad).toBe('NO_APLICABLE');
  });
});

// ─── NIE-1.4.1 · matriz de diferencias ─────────────────────────────────────
describe('NIE-1.4.1 · comparación estructurada', () => {
  const u = utilizables(resolver(ctx({ ...UNI, edad: 22, sexo: 'M' }), NORMAS));
  const comp = compararCandidatas(u);

  it('clasifica la diferencia de tipo normativo como tal', () => {
    const d = comp.diferencias.find((x) => x.campo === 'tipo_normativo')!;
    expect(d.categoria).toBe('tipo_normativo');
    expect(Object.values(d.porNorma).sort()).toEqual(['TN-1', 'TN-2']);
  });

  it('reconoce que comparten población, instrumento y estrato', () => {
    for (const campo of ['poblacion', 'instrumento', 'estrato', 'unidad', 'calidad']) {
      expect(comp.coincidencias, campo).toContain(campo);
    }
  });

  it('no existe ninguna categoría de mérito', () => {
    const texto = JSON.stringify(comp).toLowerCase();
    for (const palabra of ['mejor', 'superior', 'peor', 'preferib', 'recomend', 'ranking']) {
      expect(texto, palabra).not.toContain(palabra);
    }
  });

  it('el resumen describe, no aconseja', () => {
    expect(comp.resumen).toContain('no corresponde a este motor');
  });

  it('con una sola candidata no hay nada que comparar', () => {
    expect(compararCandidatas([u[0]]).diferencias).toHaveLength(0);
    expect(compararCandidatas([]).resumen).toContain('No hay candidatas');
  });
});

// ─── NIE-1.4.2 · valores distintos no son conflicto ────────────────────────
describe('NIE-1.4.2 · el motor no descubre conflictos', () => {
  it('dos normas con valores distintos no producen CONFLICTO por sí solas', () => {
    const a = utilizables(resolver(ctx({ ...UNI, edad: 18, sexo: 'M' }), NORMAS))[0];
    const b = utilizables(resolver(ctx({ ...UNI, edad: 25, sexo: 'M' }), NORMAS))[0];
    expect(describirDiferenciaDeValores(a, b)).toContain('no constituye conflicto');
  });

  it('las normas sin conflicto declarado no lo inventan', () => {
    const r = resolver(ctx({ ...UNI, edad: 22, sexo: 'M' }), NORMAS);
    expect(utilizables(r).every((c) => c.conflicto === 'ninguno')).toBe(true);
    expect(r.estadoGlobal).not.toBe('CONFLICTO');
  });
});

// ─── NIE-1.4.3 · caso ENSIN ────────────────────────────────────────────────
describe('NIE-1.4.3 · caso ENSIN', () => {
  const r = resolver(ctx({ ...ENSIN, edad: 15, sexo: 'M' }), NORMAS);
  const c = utilizables(r).find((x) => x.normaId === 'HGS-CO-M-15')!;

  it('la norma sigue visible y utilizable', () => {
    expect(c).toBeDefined();
    expect(c.aplicabilidad).toBe('APLICABLE_CON_RESERVAS');
  });

  it('conserva ES-2, calidad Moderada y sus valores', () => {
    expect(c.estadoNorma).toBe('ES-2');
    expect(c.calidad).toBe('moderada');
    if (c.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    // Fila de la Tabla 2: P50 de varones de 15 años = 30,7 kg
    const p50 = c.valores.percentiles.find((x) => x.percentil === 50)!;
    expect(p50.valor).toBe(30.7);
  });

  it('conserva la advertencia y la propaga', () => {
    expect(c.advertencias.join(' ')).toContain('ENSIN-2015');
    expect(c.motivosReserva).toContain('estado_cuestionado');
    expect(c.motivosReserva).toContain('conflicto_declarado');
    expect(r.estadoGlobal).toBe('CONFLICTO_NO_DETERMINABLE');
  });

  it('el motor no escoge otra norma para evitar el conflicto', () => {
    // No hay una segunda norma colombiana con este método: no la fabrica.
    expect(utilizables(r).map((x) => x.normaId)).toEqual(['HGS-CO-M-15']);
  });

  it('no promedia: los valores son idénticos a los de la NKB', () => {
    // Comprobación estructural, no de vocabulario: cada candidata debe llevar
    // exactamente los estadísticos de su fila en la ficha. Si el motor
    // promediara, fusionara o ajustara algo, esto fallaría.
    for (const cand of r.candidatas) {
      const enNkb = NORMAS.find((n) => n.id === cand.normaId)!;
      expect(cand.valores, cand.normaId).toEqual(enNkb.valores);
    }
  });

  it('no declara cuál de las dos fuentes es correcta', () => {
    // El motor solo conoce la norma admitida: la otra no está en la NKB y no
    // aparece por ninguna parte, ni para preferirla ni para descartarla.
    expect(JSON.stringify(r)).not.toContain('ramirez_velez');
    expect(c.conflicto).toBe('CONFLICTO_NO_DETERMINABLE');
  });
});

// ─── NIE-1.4.4 · Colombia 45 años ──────────────────────────────────────────
describe('NIE-1.4.4 · Cúcuta no se elimina por existir normas mejores', () => {
  const r = resolver(ctx({ ...CUCUTA, edad: 45, sexo: 'M' }), NORMAS);
  const c = utilizables(r).find((x) => x.normaId === 'HGS-CO-CUC-D-M-40')!;

  it('sigue siendo candidata pese a su calidad Baja', () => {
    expect(c.aplicabilidad).toBe('APLICABLE_CON_RESERVAS');
    expect(c.calidad).toBe('baja');
    expect(c.nCelda).toBe(15);
  });

  it('la existencia de normas de calidad Moderada no la desplaza', () => {
    const moderadas = r.candidatas.filter((x) => x.calidad === 'moderada');
    expect(moderadas.length).toBeGreaterThan(0);
    expect(utilizables(r).map((x) => x.normaId)).toContain('HGS-CO-CUC-D-M-40');
  });
});

// ─── NIE-1.4.5 · más de 70 años ────────────────────────────────────────────
describe('NIE-1.4.5 · 75 años sin norma admisible', () => {
  const r = resolver(ctx({ ...CUCUTA, edad: 75, sexo: 'M' }), NORMAS);

  it('devuelve SIN_NORMA_ADMISIBLE', () => {
    expect(r.estadoGlobal).toBe('SIN_NORMA_ADMISIBLE');
  });

  it('no usa la celda de 60–69 por cercanía', () => {
    const c = r.candidatas.find((x) => x.normaId === 'HGS-CO-CUC-D-M-60')!;
    expect(c.aplicabilidad).toBe('NO_APLICABLE');
    expect(c.discrepancias).toContain('edad');
  });

  it('no usa Brasil ni Alemania, que sí cubren esa edad', () => {
    const cubren = r.candidatas.filter(
      (x) => (x.pais === 'BR' || x.pais === 'DE') && x.aplicabilidad !== 'NO_APLICABLE',
    );
    expect(cubren).toHaveLength(0);
  });
});

// ─── Casos 11 a 15 del listado obligatorio ─────────────────────────────────
describe('caso 11 · información insuficiente', () => {
  it('sin edad, la dimensión queda NO_DETERMINABLE', () => {
    const r = resolver(ctx({ ...UNI, edad: null, sexo: 'M' }), NORMAS);
    const c = r.candidatas.find((x) => x.normaId === 'HGS-CO-UNI-M-22')!;
    expect(c.aplicabilidad).toBe('NO_DETERMINABLE');
    expect(c.camposFaltantes).toContain('edad');
    expect(utilizables(r)).toHaveLength(0);
  });
});

describe('caso 12 · poblaciones no compatibles', () => {
  it('un chileno no recibe la norma colombiana', () => {
    const r = resolver(ctx({ ...UNI, pais: 'CL', edad: 22, sexo: 'M' }), NORMAS);
    const c = r.candidatas.find((x) => x.normaId === 'HGS-CO-UNI-M-22')!;
    expect(c.discrepancias).toContain('pais');
    expect(r.estadoGlobal).toBe('SIN_NORMA_ADMISIBLE');
  });
});

describe('caso 13 · misma variable, distinto método', () => {
  it('la variable coincide y el método no', () => {
    const r = resolver(ctx({ ...CUCUTA, edad: 22, sexo: 'M' }), NORMAS);
    const c = r.candidatas.find((x) => x.normaId === 'HGS-CO-UNI-M-22')!;
    expect(c.coincidencias).toContain('variable');
    expect(c.discrepancias).toEqual(
      expect.arrayContaining(['instrumento', 'definicion_operacional', 'lado']),
    );
  });
});

describe('caso 14 · misma población, distinto estrato', () => {
  it('la celda contigua no cubre al sujeto', () => {
    const r = resolver(ctx({ ...UNI, edad: 22, sexo: 'M' }), NORMAS);
    const contigua = r.candidatas.find((x) => x.normaId === 'HGS-CO-UNI-M-23')!;
    expect(contigua.coincidencias).toContain('pais');
    expect(contigua.discrepancias).toEqual(['edad']);
  });
});

describe('caso 15 · misma identidad, distinto tipo', () => {
  it('ambas se conservan y la comparación lo clasifica', () => {
    const u = utilizables(resolver(ctx({ ...UNI, edad: 22, sexo: 'F' }), NORMAS));
    const comp = compararCandidatas(u);
    expect(u).toHaveLength(2);
    expect(comp.diferencias.map((d) => d.campo)).toContain('tipo_normativo');
    expect(comp.diferencias.every((d) => d.categoria !== 'identidad')).toBe(true);
  });
});
