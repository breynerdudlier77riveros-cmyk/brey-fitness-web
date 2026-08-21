// ── Render de la tarjeta humana (Sprints PAS-8 · PAS-9 · PAS-10) ───────────
//
// Render REAL a HTML con `react-dom/server`, igual que el informe v2.
//
// Estos componentes llevaban dos sprints sin test de render: se validaba el
// modelo y se daba por hecho que la tarjeta lo mostraba. PAS-10 añade a la
// tarjeta la serie y el objetivo superado, y ninguno de los dos puede quedar
// solo en el modelo — lo que no se pinta, para el atleta no existe.

import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { ResultadoHumano, ResumenAtleta } from '@/lib/pas/informe-humano';
import {
  construirSerie,
  type PosicionRango,
  type PuntoMedicion,
} from '@/lib/pas/seguimiento';

import AthleteSummary from '../AthleteSummary';
import ResultCard from '../ResultCard';

const METODO = { dinamometro: 'takei-t18' };

const punto = (fecha: string, valor: number, over: Partial<PuntoMedicion> = {}): PuntoMedicion => ({
  pruebaId: 'P-03',
  valor,
  unidad: 'kg',
  fecha,
  condiciones: METODO,
  ...over,
});

const OBJETIVO = {
  id: 'o1',
  atletaId: 'a1',
  pruebaId: 'P-03',
  tipo: 'aumentar' as const,
  nombre: 'Llegar a 50 kg de prensión',
  valorInicial: 40,
  fechaPuntoDePartida: '2026-01-15',
  valorObjetivo: 50,
  rango: null,
  unidad: 'kg',
  prioridad: 'alta' as const,
  fechaInicio: '2026-01-15',
  fechaObjetivo: null,
  estado: 'activo' as const,
  notas: null,
};

/** Un objetivo de mantenimiento: la meta es un rango, no un punto (§13). */
const MANTENIMIENTO = {
  ...OBJETIVO,
  id: 'o2',
  tipo: 'mantener' as const,
  nombre: 'Mantener el peso entre 63 y 67 kg',
  valorObjetivo: null,
  rango: { min: 63, max: 67 },
};

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
      posicion: null,
      resumen: null,
      explicacion: 'No existe actualmente una referencia normativa compatible.',
      poblacion: null,
      metodo: null,
      escala: null,
      aria: null,
    },
    tendencia: {
      disponible: false,
      valorAnterior: null,
      fechaAnterior: null,
      valorActual: 46,
      fechaActual: '2026-08-15',
      cambioAbsoluto: null,
      cambioRelativo: null,
      motivo: 'No hay ninguna medición anterior de esta prueba.',
    },
    objetivo: {
      disponible: false,
      objetivo: null,
      progreso: null,
      superado: false,
      mantenimiento: null,
      motivoCodigo: null,
      motivo: null,
    },
    serie: construirSerie('P-03', [punto('2026-08-15', 46)]),
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

const render = (r: ResultadoHumano): string =>
  renderToStaticMarkup(createElement(ResultCard, { resultado: r }));

// ════════════════════════════════════════════════════════════════════════════
// LO QUE SIEMPRE SE VE, Y LO QUE NUNCA
// ════════════════════════════════════════════════════════════════════════════

describe('la tarjeta habla en humano', () => {
  const html = render(resultado());

  it('el nombre legible se muestra; el código, no', () => {
    expect(html).toContain('Dinamometría de agarre');
    expect(html).not.toMatch(/>P-03</);
  });

  it('el valor y su unidad están', () => {
    expect(html).toContain('46');
    expect(html).toContain('kg');
  });

  it('no aparece jerga científica en la cara visible', () => {
    for (const jerga of ['TN-1', 'TN-2', 'EQ-3', 'ES-1', 'ES-2', 'NKB']) {
      expect(html, jerga).not.toContain(jerga);
    }
  });

  it('control positivo: la comprobación de jerga detectaría una infracción', () => {
    expect('<span>TN-1</span>').toContain('TN-1');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// SERIE (PAS-10)
// ════════════════════════════════════════════════════════════════════════════

describe('la serie se pinta cuando hay serie', () => {
  const conSerie = (puntos: readonly PuntoMedicion[]) =>
    render(resultado({ serie: construirSerie('P-03', puntos) }));

  it('con un solo punto no se dibuja: no hay serie que mostrar', () => {
    expect(conSerie([punto('2026-08-15', 46)])).not.toContain('pas10-serie');
  });

  it('con un par tampoco: eso ya lo cuenta la tendencia', () => {
    expect(conSerie([punto('2026-05-01', 42), punto('2026-08-15', 46)])).not.toContain(
      'pas10-serie',
    );
  });

  it('con tres o más aparece, con todos sus valores', () => {
    const html = conSerie([
      punto('2026-01-01', 40),
      punto('2026-05-01', 42),
      punto('2026-08-15', 46),
    ]);
    expect(html).toContain('pas10-serie');
    expect(html).toContain('3 mediciones');
    for (const v of ['40', '42', '46']) expect(html, v).toContain(v);
    expect(html).toContain('2026-01-01');
  });

  it('solo se dibuja el tramo actual: no se unen métodos distintos', () => {
    const html = conSerie([
      punto('2026-01-01', 40, { condiciones: { dinamometro: 'camry-digital' } }),
      punto('2026-05-01', 42),
      punto('2026-06-01', 44),
      punto('2026-08-15', 46),
    ]);
    expect(html).toContain('3 mediciones');
    // El punto del otro aparato no entra en la línea.
    expect(html).not.toMatch(/>40</);
  });

  it('y la ruptura se enuncia en vez de callarse', () => {
    const html = conSerie([
      punto('2026-01-01', 40, { condiciones: { dinamometro: 'camry-digital' } }),
      punto('2026-08-15', 46),
    ]);
    expect(html).toContain('pas10-ruptura');
    expect(html).toContain('La serie se interrumpió una vez');
    expect(html).toContain('cambio de instrumento');
  });

  it('sin rupturas no se menciona ninguna', () => {
    expect(conSerie([punto('2026-05-01', 42), punto('2026-08-15', 46)])).not.toContain(
      'pas10-ruptura',
    );
  });
});

// ════════════════════════════════════════════════════════════════════════════
// OBJETIVO (PAS-10)
// ════════════════════════════════════════════════════════════════════════════

describe('el objetivo no se disfraza de norma', () => {
  const conObjetivo = (
    progreso: number | null,
    superado = false,
    motivo: string | null = null,
    mantenimiento: PosicionRango | null = null,
  ) =>
    render(
      resultado({
        objetivo: {
          disponible: true,
          objetivo: mantenimiento === null ? OBJETIVO : MANTENIMIENTO,
          progreso,
          superado,
          mantenimiento,
          motivoCodigo: null,
          motivo,
        },
      }),
    );

  it('la barra no pasa del 100 %', () => {
    expect(conObjetivo(1, true)).toContain('width:100%');
  });

  it('pero rebasarlo se dice', () => {
    expect(conObjetivo(1, true)).toContain('objetivo superado');
  });

  it('llegar justo no se anuncia como superado', () => {
    expect(conObjetivo(1, false)).not.toContain('objetivo superado');
  });

  it('sin porcentaje se muestra el motivo, no una barra vacía', () => {
    const html = conObjetivo(null, false, 'El objetivo no declara desde qué valor se partía.');
    expect(html).toContain('no declara desde qué valor se partía');
    expect(html).not.toContain('del recorrido');
  });

  it('un objetivo de mantenimiento muestra el rango, no un punto', () => {
    const html = conObjetivo(null, false, null, 'dentro');
    expect(html).toContain('entre 63 y 67 kg');
    // Y no una barra de progreso: mantenerse no es recorrer una fracción.
    expect(html).not.toContain('del recorrido');
    expect(html).toContain('dentro del rango declarado');
  });

  it('quedar fuera del rango se dice sin adjetivarlo', () => {
    // Con fronteras de palabra: sin ellas, «mal» casa dentro de la clase
    // `font-normal` del propio marcado y la comprobación fallaría por una
    // hoja de estilos, no por una frase.
    const JUICIO = /(?<![-\w])(mal|error|fallo|preocupante|excesivo)(?![-\w])/i;
    for (const [pos, frase] of [
      ['por_encima', 'por encima del rango'],
      ['por_debajo', 'por debajo del rango'],
    ] as const) {
      const html = conObjetivo(null, false, null, pos);
      expect(html, pos).toContain(frase);
      expect(html, pos).not.toMatch(JUICIO);
    }
  });

  it('control positivo: la comprobación de juicios detecta uno real', () => {
    expect('el resultado es malo').toMatch(/(?<![-\w])(mal|malo)(?![-\w])/i);
  });

  it('el objetivo nunca se presenta con vocabulario normativo', () => {
    const html = conObjetivo(0.6);
    expect(html).not.toMatch(/percentil|P\d\d\b|población de referencia/i);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LOS TRES EJES SIGUEN SEPARADOS
// ════════════════════════════════════════════════════════════════════════════

describe('los ejes no se mezclan en el marcado', () => {
  const html = render(
    resultado({
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
        progreso: 0.6,
        superado: false,
        mantenimiento: null,
        motivoCodigo: null,
        motivo: null,
      },
      serie: construirSerie('P-03', [
        punto('2026-01-01', 40),
        punto('2026-05-01', 42),
        punto('2026-08-15', 46),
      ]),
    }),
  );

  it('cada eje tiene su propio bloque', () => {
    for (const clase of ['pas8-tendencia', 'pas8-objetivo', 'pas10-serie']) {
      expect(html, clase).toContain(clase);
    }
  });

  it('el bloque de tendencia va antes que el de objetivo', () => {
    expect(html.indexOf('pas8-tendencia')).toBeLessThan(html.indexOf('pas8-objetivo'));
  });

  it('el render es determinista', () => {
    expect(render(resultado())).toBe(render(resultado()));
  });
});

// ============================================================================
// CABECERA DEL INFORME (PAS-10 §22)
// ============================================================================

describe('la cabecera cuenta lo que hay, sin puntuar a nadie', () => {
  const RESUMEN: ResumenAtleta = {
    pruebasEvaluadas: 4,
    resultados: 5,
    conReferencia: 2,
    conEvolucion: 3,
    objetivosActivos: 2,
    objetivosAlcanzados: 1,
    alertas: [],
  };

  const cabecera = (over: Partial<ResumenAtleta> = {}) =>
    renderToStaticMarkup(createElement(AthleteSummary, { resumen: { ...RESUMEN, ...over } }));

  it('muestra las cuatro cifras', () => {
    const html = cabecera();
    for (const etiqueta of [
      'Pruebas evaluadas',
      'Con referencia comparable',
      'Con medición anterior',
      'Objetivos activos',
    ]) {
      expect(html, etiqueta).toContain(etiqueta);
    }
  });

  it('las cifras comparativas llevan su denominador', () => {
    // «2 con referencia» sin saber sobre cuántos resultados no dice nada.
    expect(cabecera()).toContain('/ 5');
  });

  it('NO hay ninguna puntuación global ni nivel', () => {
    const html = cabecera();
    expect(html).not.toMatch(/(?<![-\w])(puntuaci[óo]n|score|nivel|[íi]ndice global)(?![-\w])/i);
  });

  it('los objetivos cumplidos se atribuyen a quien los marcó', () => {
    // «1 objetivo cumplido» a secas sonaría a conclusión del sistema.
    expect(cabecera()).toContain('marcado como cumplido');
  });

  it('sin objetivos cumplidos no se escribe la línea', () => {
    expect(cabecera({ objetivosAlcanzados: 0 })).not.toContain('cumplid');
  });

  it('las alertas se listan con su código, fuera de las cifras', () => {
    const html = cabecera({
      alertas: [
        {
          codigo: 'METODO_SIN_DECLARAR',
          texto: 'En un resultado no consta cómo se midió.',
          total: 1,
        },
      ],
    });
    expect(html).toContain('data-alerta="METODO_SIN_DECLARAR"');
    expect(html).toContain('no consta cómo se midió');
    // Y fuera de la tarjeta de cifras: son otra clase de información.
    expect(html.indexOf('pas10-alertas')).toBeGreaterThan(html.indexOf('Objetivos activos'));
  });

  it('sin alertas no se dibuja la lista', () => {
    expect(cabecera()).not.toContain('pas10-alertas');
  });

  it('el render es determinista', () => {
    expect(cabecera()).toBe(cabecera());
  });
});
