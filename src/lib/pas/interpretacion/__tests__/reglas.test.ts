// ── Motor de interpretación profesional (Sprint PAS-9) ─────────────────────
//
// Estos tests no repiten la ciencia: los contratos de abajo ya están cubiertos
// por más de 1 900. Protegen lo que este sprint puede romper — que una frase
// diga más de lo que la evidencia sostiene.
//
// El resultado se construye a mano, no desde la NKB: aquí se prueba el MOTOR DE
// REGLAS, y armar el caso completo lo haría depender de qué publican las fichas.
// La integración con datos reales se prueba en `informe-humano`.

import { describe, expect, it } from 'vitest';

import type { ResultadoHumano } from '@/lib/pas/informe-humano';

import { comoTexto, interpretar } from '../componer';
import {
  construirSerie,
  type MotivoSinProgreso,
  type PuntoMedicion,
} from '@/lib/pas/seguimiento';

import { REGLAS_LONGITUDINALES, REGLAS_NORMATIVAS, REGLAS_OBJETIVO, TODAS_LAS_REGLAS } from '../reglas';
import type { ObjetivoAtleta } from '@/lib/pas/informe-humano';

const OBJETIVO: ObjetivoAtleta = {
  id: 'o1',
  atletaId: 'a1',
  pruebaId: 'P-01',
  tipo: 'aumentar',
  nombre: 'Aumentar 1RM de sentadilla',
  valorInicial: 100,
  fechaPuntoDePartida: '2026-01-15',
  valorObjetivo: 140,
  rango: null,
  unidad: 'kg',
  prioridad: 'alta',
  fechaInicio: '2026-01-15',
  fechaObjetivo: null,
  estado: 'activo',
  notas: null,
};

const SIN_OBJETIVO = {
  disponible: false as const,
  objetivo: null,
  progreso: null,
  superado: false,
  mantenimiento: null,
  motivoCodigo: null,
  motivo: null,
};

const PUNTO_ACTUAL: PuntoMedicion = {
  pruebaId: 'P-03',
  valor: 46,
  unidad: 'kg',
  fecha: '2026-08-15',
  condiciones: { dinamometro: 'takei-t18' },
};

/** Una serie que se cortó justo antes de la medición actual. */
const serieRota = (motivo: 'metodo' | 'unidad') =>
  construirSerie('P-03', [
    {
      ...PUNTO_ACTUAL,
      fecha: '2026-05-01',
      valor: 42,
      unidad: motivo === 'unidad' ? 'lbf' : 'kg',
      condiciones: motivo === 'metodo' ? { dinamometro: 'camry-digital' } : PUNTO_ACTUAL.condiciones,
    },
    PUNTO_ACTUAL,
  ]);

/** Un resultado neutro. Cada test enciende solo el eje que le interesa. */
function resultado(over: Partial<ResultadoHumano> = {}): ResultadoHumano {
  return {
    pruebaId: 'P-03',
    nombre: 'Dinamometría de agarre',
    dominio: 'Producción de fuerza',
    valorObservado: 46,
    unidad: 'kg',
    fecha: '2026-08-15',
    referencia: {
      estado: 'SIN_REFERENCIA',
      clase: null,
      resumen: null,
      explicacion: null,
      poblacion: null,
      metodo: null,
    },
    tendencia: {
      disponible: false,
      valorAnterior: null,
      fechaAnterior: null,
      valorActual: 46,
      fechaActual: '2026-08-15',
      cambioAbsoluto: null,
      cambioRelativo: null,
      motivo: null,
    },
    objetivo: SIN_OBJETIVO,
    serie: construirSerie('P-03', [PUNTO_ACTUAL]),
    evidencia: {
      pruebaId: 'P-03',
      estado: 'SIN_EVIDENCIA_UTILIZABLE',
      compatibles: [],
      descartadas: [],
      carencias: [],
      complementarias: [],
    },
    fuenteNormativa: 'ninguna',
    interpretacion: {
      disponible: false,
      texto: null,
      porEje: { normativo: null, longitudinal: null, objetivo: null },
    },
    detalles: {
      pruebaId: 'P-03',
      normaId: null,
      tipoNorma: null,
      instrumento: null,
      poblacion: null,
      nCelda: null,
      calidad: null,
      estadoNorma: null,
      conflicto: null,
      unidad: null,
      referencia: null,
      motivo: null,
      advertencias: [],
      descartes: [],
    },
    ...over,
  };
}

const conReferencia = (
  clase: 'percentil' | 'intervalo' | 'fuera_de_rango' | 'distancia_media',
  resumen: string,
) =>
  resultado({
    referencia: {
      estado: 'DISPONIBLE',
      clase,
      resumen,
      explicacion: null,
      poblacion: 'Colombia · Varones · 22 años',
      metodo: 'takei-t18-tkk-smedley-iii',
    },
  });

// ════════════════════════════════════════════════════════════════════════════
// EL CATÁLOGO
// ════════════════════════════════════════════════════════════════════════════

describe('el catálogo de reglas', () => {
  it('cubre los tres ejes', () => {
    expect(new Set(TODAS_LAS_REGLAS.map((r) => r.eje))).toEqual(
      new Set(['normativo', 'longitudinal', 'objetivo']),
    );
  });

  it('ningún identificador se repite', () => {
    const ids = TODAS_LAS_REGLAS.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('cada regla declara qué situación reconoce', () => {
    for (const r of TODAS_LAS_REGLAS) {
      expect(r.cuando.length, r.id).toBeGreaterThan(10);
    }
  });

  it('cada eje tiene una regla que siempre aplica, para no dejar huecos', () => {
    // Sin una regla final, un estado no previsto produciría silencio en vez de
    // una explicación, y el silencio se lee como «no hay nada que decir».
    const neutro = resultado();
    expect(REGLAS_NORMATIVAS.some((r) => r.aplica(neutro))).toBe(true);
    expect(REGLAS_LONGITUDINALES.some((r) => r.aplica(neutro))).toBe(true);
    // El de objetivo sí puede quedar vacío: no tener objetivo no es un estado
    // que haya que explicar.
    expect(REGLAS_OBJETIVO.some((r) => r.aplica(neutro))).toBe(false);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// EJE NORMATIVO
// ════════════════════════════════════════════════════════════════════════════

describe('eje normativo', () => {
  it('N-01 · coincidencia con un percentil publicado', () => {
    const i = interpretar(conReferencia('percentil', 'P50'));
    expect(i.normativo!.regla).toBe('N-01');
    expect(i.normativo!.texto).toContain('P50');
    expect(i.normativo!.texto).toContain('Colombia · Varones · 22 años');
  });

  it('N-02 · intervalo, y dice que no se estima nada intermedio', () => {
    const i = interpretar(conReferencia('intervalo', 'entre P90 y P97'));
    expect(i.normativo!.regla).toBe('N-02');
    expect(i.normativo!.texto).toContain('entre P90 y P97');
    // El límite es la razón de ser de esta regla.
    expect(i.normativo!.limite).toMatch(/no se estima ninguno intermedio/);
  });

  it('N-03 · fuera de rango, sin extrapolar', () => {
    const i = interpretar(conReferencia('fuera_de_rango', 'por encima de P97'));
    expect(i.normativo!.regla).toBe('N-03');
    expect(i.normativo!.limite).toMatch(/no se extrapola/);
  });

  it('N-04 · distancia a la media, y niega el percentil', () => {
    const i = interpretar(conReferencia('distancia_media', 'z = +1,25'));
    expect(i.normativo!.regla).toBe('N-04');
    expect(i.normativo!.texto).toContain('z = +1,25');
    expect(i.normativo!.limite).toMatch(/no equivale a una posición percentil/);
  });

  it('N-05 · no determinable: falta el método, no falta la norma', () => {
    const i = interpretar(resultado({ referencia: { ...resultado().referencia, estado: 'NO_DETERMINABLE' } }));
    expect(i.normativo!.regla).toBe('N-05');
    expect(i.normativo!.limite).toMatch(/no significa que no exista referencia/);
  });

  it('N-06 · no comparable: hay normas, pero no para ese método', () => {
    const i = interpretar(resultado({ referencia: { ...resultado().referencia, estado: 'NO_COMPARABLE' } }));
    expect(i.normativo!.regla).toBe('N-06');
    expect(i.normativo!.texto).toMatch(/Existen referencias/);
    expect(i.normativo!.limite).toMatch(/seguir tu evolución/);
  });

  it('N-07 · sin referencia, y el resultado sigue sirviendo', () => {
    const i = interpretar(resultado());
    expect(i.normativo!.regla).toBe('N-07');
    expect(i.normativo!.limite).toMatch(/no invalida la medición/);
    expect(i.normativo!.limite).toMatch(/seguimiento longitudinal/);
  });

  it('los cuatro estados producen cuatro reglas distintas', () => {
    const estados = ['SIN_REFERENCIA', 'NO_COMPARABLE', 'NO_DETERMINABLE'] as const;
    const reglas = estados.map(
      (e) => interpretar(resultado({ referencia: { ...resultado().referencia, estado: e } })).normativo!.regla,
    );
    reglas.push(interpretar(conReferencia('percentil', 'P50')).normativo!.regla);
    expect(new Set(reglas).size).toBe(4);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// EJE LONGITUDINAL
// ════════════════════════════════════════════════════════════════════════════

describe('eje longitudinal', () => {
  const conCambio = (anterior: number, actual: number) =>
    resultado({
      valorObservado: actual,
      tendencia: {
        disponible: true,
        valorAnterior: anterior,
        fechaAnterior: '2026-05-01',
        valorActual: actual,
        fechaActual: '2026-08-15',
        cambioAbsoluto: actual - anterior,
        cambioRelativo: (actual - anterior) / anterior,
        motivo: null,
      },
    });

  it('L-01 · subida', () => {
    const i = interpretar(conCambio(42, 46));
    expect(i.longitudinal!.regla).toBe('L-01');
    expect(i.longitudinal!.texto).toContain('aumentó 4 kg');
    expect(i.longitudinal!.texto).toContain('2026-05-01');
  });

  it('L-02 · bajada, sin adjetivo', () => {
    const i = interpretar(conCambio(46, 42));
    expect(i.longitudinal!.regla).toBe('L-02');
    expect(i.longitudinal!.texto).toContain('disminuyó 4 kg');
    // Sin «empeoró», «preocupante» ni nada parecido: el motor no sabe por qué.
    expect(i.longitudinal!.texto).not.toMatch(/empeor|preocup|mal/i);
    expect(i.longitudinal!.limite).toMatch(/tampoco establece una tendencia/);
  });

  it('L-03 · sin cambio', () => {
    const i = interpretar(conCambio(46, 46));
    expect(i.longitudinal!.regla).toBe('L-03');
    expect(i.longitudinal!.texto).toContain('el mismo');
  });

  it('L-04 · hay anteriores con otro método', () => {
    // La regla se reconoce por la RUPTURA de la serie, no por el texto del
    // motivo: reescribir una frase no debe apagar una regla.
    const i = interpretar(resultado({ serie: serieRota('metodo') }));
    expect(i.longitudinal!.regla).toBe('L-04');
    expect(i.longitudinal!.limite).toMatch(/cambio de instrumento/);
  });

  it('L-06 · hay anteriores en otra unidad, y no se dice que no las haya', () => {
    const i = interpretar(resultado({ serie: serieRota('unidad') }));
    expect(i.longitudinal!.regla).toBe('L-06');
    expect(i.longitudinal!.texto).toMatch(/otra unidad/);
    // Lo que PAS-8 afirmaba en este caso, y era falso.
    expect(i.longitudinal!.texto).not.toMatch(/primera medición/);
  });

  it('L-05 · primera medición', () => {
    const i = interpretar(resultado());
    expect(i.longitudinal!.regla).toBe('L-05');
    expect(i.longitudinal!.texto).toMatch(/primera medición/);
  });

  it('TODA subida y bajada declara que no habla de la población', () => {
    for (const par of [[42, 46], [46, 42], [46, 46]] as const) {
      const i = interpretar(conCambio(par[0], par[1]));
      expect(i.longitudinal!.limite, `${par[0]}→${par[1]}`).toMatch(
        /no describe tu posición respecto a ninguna población/,
      );
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// EJE DE OBJETIVO
// ════════════════════════════════════════════════════════════════════════════

describe('eje de objetivo', () => {
  /** Con fronteras: sin ellas, «mal» casa dentro de «normal». */
  const JUICIO = /(?<![-\w])(error|fallo|mal)(?![-\w])/i;

  const conObjetivo = (
    progreso: number | null,
    motivoCodigo: MotivoSinProgreso | null = null,
    superado = false,
  ) =>
    resultado({
      objetivo: {
        disponible: true,
        objetivo: OBJETIVO,
        progreso,
        superado,
        mantenimiento: null,
        motivoCodigo,
        motivo: motivoCodigo === null ? null : 'detalle del motor',
      },
    });

  /** Un objetivo de mantenimiento, cuya meta es un rango y no un punto. */
  const MANTENIMIENTO: ObjetivoAtleta = {
    ...OBJETIVO,
    id: 'o2',
    tipo: 'mantener',
    nombre: 'Mantener el peso entre 63 y 67 kg',
    valorObjetivo: null,
    rango: { min: 63, max: 67 },
  };

  const conMantenimiento = (posicion: 'dentro' | 'por_encima' | 'por_debajo') =>
    resultado({
      objetivo: {
        disponible: true,
        objetivo: MANTENIMIENTO,
        progreso: null,
        superado: false,
        mantenimiento: posicion,
        motivoCodigo: null,
        motivo: null,
      },
    });

  it('O-01 · objetivo alcanzado', () => {
    const i = interpretar(conObjetivo(1));
    expect(i.objetivo!.regla).toBe('O-01');
    expect(i.objetivo!.texto).toMatch(/alcanzado el objetivo/);
  });

  it('O-02 · progreso parcial', () => {
    const i = interpretar(conObjetivo(0.5));
    expect(i.objetivo!.regla).toBe('O-02');
    expect(i.objetivo!.texto).toContain('50 %');
  });

  it('O-01 · superarlo se dice distinto de alcanzarlo', () => {
    const i = interpretar(conObjetivo(1, null, true));
    expect(i.objetivo!.regla).toBe('O-01');
    expect(i.objetivo!.texto).toMatch(/superado el objetivo/);
  });

  it('O-03 · sin punto de partida, no se inventa porcentaje', () => {
    const i = interpretar(conObjetivo(null, 'SIN_PUNTO_DE_PARTIDA'));
    expect(i.objetivo!.regla).toBe('O-03');
    expect(i.objetivo!.texto).not.toContain('%');
    expect(i.objetivo!.limite).toMatch(/no puede expresarse como porcentaje/);
  });

  it('cada motivo por el que no hay porcentaje tiene SU frase, no una genérica', () => {
    // PAS-8 atribuía siempre la ausencia de porcentaje a que faltaba el punto
    // de partida. Con seis motivos posibles eso era falso cinco veces de cada
    // seis, y una explicación falsa es peor que ninguna.
    const MOTIVOS: readonly MotivoSinProgreso[] = [
      'SIN_PUNTO_DE_PARTIDA',
      'SIN_MEDICION_ACTUAL',
      'SIN_DIRECCION_DECLARADA',
      'RECORRIDO_NULO',
      'DIRECCION_CONTRADICE_OBJETIVO',
      'UNIDADES_INCOMPATIBLES',
      'SIN_VALOR_OBJETIVO',
      'SIN_RANGO_DEFINIDO',
      'RANGO_INVERTIDO',
    ];

    const limites = new Set<string>();
    for (const m of MOTIVOS) {
      const i = interpretar(conObjetivo(null, m));
      expect(i.objetivo, m).not.toBeNull();
      expect(i.objetivo!.texto, m).not.toContain('%');
      expect(i.objetivo!.limite, m).not.toBeNull();
      limites.add(i.objetivo!.limite!);
    }
    expect(limites.size).toBe(MOTIVOS.length);
  });

  it('la frase de «sin dirección» no culpa a quien fijó el objetivo', () => {
    const i = interpretar(conObjetivo(null, 'SIN_DIRECCION_DECLARADA'));
    expect(i.objetivo!.limite).toMatch(/no tiene una única dirección de mejora declarada/);
    expect(i.objetivo!.limite).not.toMatch(JUICIO);
  });

  it('control positivo: esa comprobacion reconoce una frase que si culpa', () => {
    // Sin este control, un error al escribir la expresion regular la dejaria pasando
    // en vacio y el test pareceria estar protegiendo algo.
    expect('es un error del profesional').toMatch(JUICIO);
  });

  it('la contradicción de dirección se declara, no se resuelve', () => {
    const i = interpretar(conObjetivo(null, 'DIRECCION_CONTRADICE_OBJETIVO'));
    expect(i.objetivo!.limite).toMatch(/sentido contrario/);
    // No propone cuál de los dos sentidos era el bueno.
    expect(i.objetivo!.limite).not.toMatch(/deber[íi]a|corrige|cambia a/i);
  });

  it('mantenerse dentro del rango NO se expresa como porcentaje', () => {
    const i = interpretar(conMantenimiento('dentro'));
    expect(i.objetivo!.regla).toBe('O-10');
    expect(i.objetivo!.texto).toContain('entre 63 y 67 kg');
    expect(i.objetivo!.texto).not.toContain('%');
    expect(i.objetivo!.texto).not.toMatch(/recorrido/);
  });

  it('quedar fuera del rango se dice, y no se adjetiva', () => {
    for (const [pos, frase] of [
      ['por_encima', 'por encima del rango'],
      ['por_debajo', 'por debajo del rango'],
    ] as const) {
      const i = interpretar(conMantenimiento(pos));
      expect(i.objetivo!.texto, pos).toContain(frase);
      expect(i.objetivo!.texto, pos).not.toMatch(/mal|excesivo|preocupante|deber[íi]as/i);
    }
  });

  it('un rango de mantenimiento NO se presenta como intervalo de referencia', () => {
    const i = interpretar(conMantenimiento('dentro'));
    expect(i.objetivo!.limite).toMatch(/no un intervalo de referencia poblacional/);
  });

  it('O-04 · varios objetivos activos, no se elige', () => {
    const i = interpretar(
      resultado({
        objetivo: { ...SIN_OBJETIVO, motivo: 'más de un objetivo activo' },
      }),
    );
    expect(i.objetivo!.regla).toBe('O-04');
    expect(i.objetivo!.limite).toMatch(/no elige/);
  });

  it('sin objetivo, el eje calla: no tenerlo no es un estado que explicar', () => {
    expect(interpretar(resultado()).objetivo).toBeNull();
  });

  it('TODO objetivo declara que no es una norma poblacional', () => {
    for (const p of [1, 0.5]) {
      expect(interpretar(conObjetivo(p)).objetivo!.limite).toMatch(
        /no equivale a situarse en ningún percentil/,
      );
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LOS EJES NO SE MEZCLAN
// ════════════════════════════════════════════════════════════════════════════

describe('separación de ejes', () => {
  const completo = resultado({
    referencia: {
      estado: 'DISPONIBLE',
      clase: 'intervalo',
      resumen: 'entre P90 y P97',
      explicacion: null,
      poblacion: 'Colombia · Varones · 22 años',
      metodo: 'takei-t18-tkk-smedley-iii',
    },
    tendencia: {
      disponible: true,
      valorAnterior: 42,
      fechaAnterior: '2026-05-01',
      valorActual: 46,
      fechaActual: '2026-08-15',
      cambioAbsoluto: 4,
      cambioRelativo: 4 / 42,
      motivo: null,
    },
    objetivo: {
      disponible: true,
      objetivo: OBJETIVO,
      progreso: 0.5,
      superado: false,
      mantenimiento: null,
      motivoCodigo: null,
      motivo: null,
    },
  });

  it('los tres ejes producen tres interpretaciones separadas', () => {
    const i = interpretar(completo);
    expect(i.normativo).not.toBeNull();
    expect(i.longitudinal).not.toBeNull();
    expect(i.objetivo).not.toBeNull();
    expect(new Set([i.normativo!.eje, i.longitudinal!.eje, i.objetivo!.eje]).size).toBe(3);
  });

  it('la frase normativa NO menciona el cambio ni el objetivo', () => {
    const i = interpretar(completo);
    expect(i.normativo!.texto).not.toMatch(/aumentó|disminuyó|objetivo|recorrido/i);
  });

  it('la frase longitudinal NO menciona percentiles ni la población', () => {
    const i = interpretar(completo);
    expect(i.longitudinal!.texto).not.toMatch(/percentil|P\d+|Colombia/i);
  });

  it('la frase de objetivo NO menciona percentiles', () => {
    const i = interpretar(completo);
    expect(i.objetivo!.texto).not.toMatch(/percentil|P\d+/i);
  });

  it('cambiar la tendencia no altera la interpretación normativa', () => {
    const sinCambio = interpretar({ ...completo, tendencia: resultado().tendencia });
    expect(sinCambio.normativo).toEqual(interpretar(completo).normativo);
  });

  it('cambiar el objetivo no altera la interpretación normativa', () => {
    const sinObjetivo = interpretar({ ...completo, objetivo: resultado().objetivo });
    expect(sinObjetivo.normativo).toEqual(interpretar(completo).normativo);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// PROHIBICIONES CIENTÍFICAS
// ════════════════════════════════════════════════════════════════════════════

describe('ninguna regla clasifica', () => {
  const CATEGORIA =
    /(?<![-\w])(bajo|alto|normal|anormal|bueno|malo|excelente|deficiente|adecuado|apto|[oó]ptimo|riesgo)(?![-\w])/i;

  /** Todas las frases que el motor puede producir, sobre casos que las activan. */
  const TODAS = [
    conReferencia('percentil', 'P50'),
    conReferencia('intervalo', 'entre P90 y P97'),
    conReferencia('fuera_de_rango', 'por encima de P97'),
    conReferencia('distancia_media', 'z = +1,25'),
    resultado({ referencia: { ...resultado().referencia, estado: 'NO_DETERMINABLE' } }),
    resultado({ referencia: { ...resultado().referencia, estado: 'NO_COMPARABLE' } }),
    resultado(),
    resultado({
      tendencia: { ...resultado().tendencia, disponible: true, valorAnterior: 42, fechaAnterior: '2026-05-01', cambioAbsoluto: 4 },
    }),
    resultado({
      tendencia: { ...resultado().tendencia, disponible: true, valorAnterior: 50, fechaAnterior: '2026-05-01', cambioAbsoluto: -4 },
    }),
    resultado({
      objetivo: {
        disponible: true,
        objetivo: OBJETIVO,
        progreso: 1,
        superado: false,
        mantenimiento: null,
        motivoCodigo: null,
        motivo: null,
      },
    }),
    resultado({
      objetivo: {
        disponible: true,
        objetivo: OBJETIVO,
        progreso: 0.5,
        superado: false,
        mantenimiento: null,
        motivoCodigo: null,
        motivo: null,
      },
    }),
    resultado({
      objetivo: {
        disponible: true,
        objetivo: OBJETIVO,
        progreso: null,
        superado: false,
        mantenimiento: null,
        motivoCodigo: 'SIN_PUNTO_DE_PARTIDA',
        motivo: null,
      },
    }),
  ];

  it('ninguna frase emite una categoría', () => {
    for (const r of TODAS) {
      const i = interpretar(r);
      for (const eje of [i.normativo, i.longitudinal, i.objetivo]) {
        if (!eje) continue;
        // Se descuentan las negaciones: «no invalida», «no equivale» son
        // límites, no juicios (H-02).
        const afirmado = `${eje.texto} ${eje.limite ?? ''}`.replace(/\bno\s+\w+[^.]*/gi, '');
        expect(afirmado, eje.regla).not.toMatch(CATEGORIA);
      }
    }
    // Control positivo: la comprobación sabe encontrar una categoría.
    expect('tu resultado es alto').toMatch(CATEGORIA);
  });

  it('ninguna frase inventa un percentil que no venga en el resumen', () => {
    for (const r of TODAS) {
      const i = interpretar(r);
      const enTexto = (i.normativo?.texto ?? '').match(/P\d+/g) ?? [];
      const enResumen = (r.referencia.resumen ?? '').match(/P\d+/g) ?? [];
      for (const p of enTexto) expect(enResumen, p).toContain(p);
    }
  });

  it('ninguna frase convierte z en percentil', () => {
    const i = interpretar(conReferencia('distancia_media', 'z = +1,25'));
    expect(i.normativo!.texto).not.toMatch(/percentil \d/i);
    expect(i.normativo!.limite).toMatch(/no equivale a una posición percentil/);
  });

  it('ninguna frase diagnostica ni prescribe', () => {
    for (const r of TODAS) {
      const i = interpretar(r);
      const todo = [i.normativo, i.longitudinal, i.objetivo]
        .filter((x) => x !== null)
        .map((x) => `${x!.texto} ${x!.limite ?? ''}`)
        .join(' ');
      expect(todo).not.toMatch(/\b(deber[íi]as|entrena|lesi[óo]n|patolog[íi]a|diagn[óo]stico)\b/i);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// DETERMINISMO Y TEXTO CORRIDO
// ════════════════════════════════════════════════════════════════════════════

describe('determinismo', () => {
  it('misma entrada, misma salida', () => {
    const r = conReferencia('intervalo', 'entre P90 y P97');
    expect(JSON.stringify(interpretar(r))).toBe(JSON.stringify(interpretar(r)));
  });

  it('el texto corrido respeta el orden de lectura', () => {
    const completo = resultado({
      referencia: {
        estado: 'DISPONIBLE',
        clase: 'intervalo',
        resumen: 'entre P90 y P97',
        explicacion: null,
        poblacion: 'Colombia',
        metodo: 'x',
      },
      tendencia: {
        ...resultado().tendencia,
        disponible: true,
        valorAnterior: 42,
        fechaAnterior: '2026-05-01',
        cambioAbsoluto: 4,
      },
    });
    const texto = comoTexto(interpretar(completo))!;
    expect(texto.indexOf('entre P90')).toBeLessThan(texto.indexOf('aumentó'));
  });

  it('sin ninguna interpretación devuelve null, no una cadena vacía', () => {
    expect(
      comoTexto({ normativo: null, longitudinal: null, objetivo: null }),
    ).toBeNull();
  });

  it('los límites NO entran en el texto corrido: viajan estructurados', () => {
    const i = interpretar(conReferencia('intervalo', 'entre P90 y P97'));
    expect(comoTexto(i)).not.toContain(i.normativo!.limite!);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// FRONTERA DE LA CAPA
// ════════════════════════════════════════════════════════════════════════════

describe('la capa no cruza sus fronteras', () => {
  const FICHEROS = ['componer.ts', 'reglas.ts', 'tipos.ts', 'index.ts'];

  it.each(FICHEROS)('%s no importa React, Supabase, el NIE ni la NKB', async (f) => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const src = readFileSync(join(process.cwd(), 'src/lib/pas/interpretacion', f), 'utf-8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');

    for (const [nombre, patron] of [
      ['React', /from ['"]react/],
      ['Supabase', /supabase/i],
      ['NIE', /@\/lib\/nie/],
      ['NKB', /normative-knowledge-base|cargarNormas/],
      ['Profile', /\bProfile\b/],
    ] as const) {
      expect(src, `${f}: ${nombre}`).not.toMatch(patron);
    }
  });

  it('control positivo: la comprobación detecta una importación prohibida', () => {
    expect('import { cargarNormas } from "@/lib/nie/nkb/cargador";').toMatch(/@\/lib\/nie/);
  });

  it('no hay generación libre de lenguaje: todo sale de plantillas', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const src = readFileSync(join(process.cwd(), 'src/lib/pas/interpretacion/reglas.ts'), 'utf-8');
    // Ninguna llamada a un modelo, ninguna aleatoriedad, ninguna fecha.
    for (const p of [/fetch\(/, /Math\.random/, /new Date\(/, /anthropic|openai/i]) {
      expect(src).not.toMatch(p);
    }
  });
});
