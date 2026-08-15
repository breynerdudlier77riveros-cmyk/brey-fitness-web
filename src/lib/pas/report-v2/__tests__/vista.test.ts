// ── Modelo de vista del informe v2 (PRS v2.0) ──────────────────────────────

import { describe, expect, it } from 'vitest';

import { escalar } from '../escala';
import {
  ETIQUETA_CALIDAD,
  ETIQUETA_CONFLICTO,
  ETIQUETA_ESTADO_NORMA,
  ETIQUETA_INTERPRETACION,
  ETIQUETA_PAIS,
  ETIQUETA_UNIDAD,
  ETIQUETA_VARIABLE,
} from '../etiquetas';
import {
  COND_BR,
  COND_UNI,
  NORMAS,
  PORTADA,
  SUJETO_BR_70,
  SUJETO_CO_20,
  SUJETO_SIN_DATOS,
  informe,
  informeEnsin,
  informeUni,
  registro,
  registroSinNorma,
} from './fixtures';

const UNI = informeUni();
const ENSIN = informeEnsin();

// ─── El eslabón ─────────────────────────────────────────────────────────────

describe('eslabón PAS → NIE', () => {
  it('un registro de prensión llega a la NKB y vuelve con normas', () => {
    expect(UNI.tarjetas.length).toBeGreaterThan(0);
  });

  it('una prueba que la NKB no cubre no se consulta, y lo dice', () => {
    const i = informe([registroSinNorma('x', 'CMJ-01')], SUJETO_CO_20);
    expect(i.tarjetas).toHaveLength(0);
    expect(i.sinNorma).toHaveLength(1);
    expect(i.sinNorma[0].detalle).toContain('no contiene todavía una referencia admisible');
  });

  it('un registro anulado no se consulta', () => {
    const i = informe(
      [registro('r', 37.5, 'kg', COND_UNI, { estado: 'anulada' })],
      SUJETO_CO_20,
    );
    expect(i.sinNorma[0].detalle).toContain('anulado');
    expect(i.tarjetas).toHaveLength(0);
  });

  it('un valor no continuo no se consulta', () => {
    const i = informe(
      [registro('r', 1, 'kg', COND_UNI, { valor: { tipo: 'binario', valor: true } })],
      SUJETO_CO_20,
    );
    expect(i.sinNorma[0].detalle).toContain('magnitud continua');
  });

  it('una unidad que la NKB no publica no se consulta', () => {
    const i = informe([registro('r', 37.5, 'newton', COND_UNI)], SUJETO_CO_20);
    expect(i.sinNorma[0].detalle).toContain('unidad');
  });

  it('sin edad ni sexo no hay norma: falta información, no incumplimiento', () => {
    const i = informe([registro('r', 37.5, 'kg', COND_UNI)], SUJETO_SIN_DATOS);
    expect(i.tarjetas).toHaveLength(0);
    expect(i.resumen[0].estado).toBe(ETIQUETA_INTERPRETACION.SIN_NORMA_APLICABLE);
  });

  it('una condición no declarada no se rellena por defecto', () => {
    const sinPosicion = { ...COND_UNI };
    delete (sinPosicion as Record<string, string>).posicion;
    const i = informe([registro('r', 37.5, 'kg', sinPosicion)], SUJETO_CO_20);
    // El NIE responde NO_DETERMINABLE, no una coincidencia inventada.
    expect(i.tarjetas).toHaveLength(0);
  });

  it('un vocabulario desconocido tampoco se adivina', () => {
    const raro = { ...COND_UNI, dinamometro: 'dinamometro-de-marca-desconocida' };
    const i = informe([registro('r', 37.5, 'kg', raro)], SUJETO_CO_20);
    expect(i.tarjetas).toHaveLength(0);
  });
});

// ─── TN-1 ───────────────────────────────────────────────────────────────────

describe('TN-1 · percentiles publicados', () => {
  const tn1 = UNI.tarjetas.find((t) => t.tipo === 'TN-1')!;

  it('produce una tarjeta TN-1', () => {
    expect(tn1).toBeDefined();
    expect(tn1.normaId).toBe('HGS-CO-UNI-M-20');
  });

  it('la escala dibuja exactamente los percentiles que la fuente publica', () => {
    const norma = NORMAS.find((n) => n.id === 'HGS-CO-UNI-M-20')!;
    if (norma.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    expect(tn1.escala!.marcas.map((m) => m.etiqueta)).toEqual(
      norma.valores.percentiles.map((p) => `P${p.percentil}`),
    );
  });

  it('cada marca lleva el valor publicado, sin tocar', () => {
    const norma = NORMAS.find((n) => n.id === 'HGS-CO-UNI-M-20')!;
    if (norma.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    expect(tn1.escala!.marcas.map((m) => m.valor)).toEqual(
      norma.valores.percentiles.map((p) => p.valor),
    );
  });

  it('P50 es la marca principal', () => {
    expect(tn1.escala!.marcas.filter((m) => m.principal).map((m) => m.etiqueta)).toEqual(['P50']);
  });

  it('conserva el valor observado tal como se midió', () => {
    expect(tn1.valor).toBe(37.5);
    expect(tn1.unidad).toBe('kg');
  });

  it('la situación es la que dictó el NIE', () => {
    expect(tn1.situacion).toBe(ETIQUETA_INTERPRETACION.COINCIDE_CON_PERCENTIL);
  });

  it('transporta el motivo del NIE sin reescribirlo', () => {
    expect(tn1.motivo.length).toBeGreaterThan(10);
  });
});

// ─── TN-2 ───────────────────────────────────────────────────────────────────

describe('TN-2 · media y dispersión', () => {
  const tn2 = UNI.tarjetas.find((t) => t.tipo === 'TN-2')!;

  it('produce una tarjeta TN-2 propia, no fusionada con la TN-1', () => {
    expect(tn2).toBeDefined();
    expect(UNI.tarjetas).toHaveLength(2);
  });

  it('la escala son las desviaciones, no percentiles', () => {
    expect(tn2.escala!.marcas.map((m) => m.etiqueta)).toEqual([
      'μ−2σ',
      'μ−1σ',
      'μ',
      'μ+1σ',
      'μ+2σ',
    ]);
  });

  it('μ es la marca principal y vale la media publicada', () => {
    const norma = NORMAS.find((n) => n.id === 'HGS-CO-UNI-TN2-M-20')!;
    if (norma.valores.tipo !== 'media_dispersion') throw new Error('tipo inesperado');
    const mu = tn2.escala!.marcas.find((m) => m.principal)!;
    expect(mu.etiqueta).toBe('μ');
    expect(mu.valor).toBe(norma.valores.media);
  });

  it('las desviaciones se construyen con la DT publicada', () => {
    const norma = NORMAS.find((n) => n.id === 'HGS-CO-UNI-TN2-M-20')!;
    if (norma.valores.tipo !== 'media_dispersion') throw new Error('tipo inesperado');
    const { media, desviacionTipica: dt } = norma.valores;
    expect(tn2.escala!.marcas.map((m) => m.valor)).toEqual([
      media - 2 * dt,
      media - dt,
      media,
      media + dt,
      media + 2 * dt,
    ]);
  });

  it('ninguna marca de una TN-2 lleva rótulo de percentil', () => {
    for (const m of tn2.escala!.marcas) expect(m.etiqueta).not.toMatch(/^P\d/);
  });

  it('la z no se convierte en percentil por ningún camino', () => {
    // Se auditan los campos ESTRUCTURALES, no el texto. El motivo del NIE y la
    // advertencia de la ficha contienen la palabra «percentil» precisamente
    // para prohibirlo —«no es un percentil y no se convierte en uno»—, y
    // buscarla a ciegas convertiría la prohibición en la infracción (H-02).
    expect(JSON.stringify(tn2.escala)).not.toMatch(/percentil/i);
    expect(JSON.stringify(tn2.evidencia)).not.toMatch(/percentil/i);
    expect(tn2.situacion).not.toMatch(/percentil/i);
    expect(tn2.resumenResultado).toMatch(/^z = [+−]/);

    // El texto SÍ nombra el percentil, para negarlo — en la explicación, en el
    // motivo del NIE y en el rótulo accesible. Se comprueba que la negación
    // está, no que la palabra falte: buscarla a ciegas convertiría la
    // prohibición en la infracción (H-02).
    expect(tn2.motivo).toMatch(/no es un percentil/i);
    expect(tn2.explicacion).toMatch(/no representa un percentil/i);
    expect(tn2.aria).toMatch(/no representa un percentil/i);
  });
});

// ─── Sin interpolar ─────────────────────────────────────────────────────────

describe('nunca se interpola', () => {
  it('un valor entre P25 y P50 no produce un percentil intermedio', () => {
    const norma = NORMAS.find((n) => n.id === 'HGS-CO-UNI-M-20')!;
    if (norma.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    const p25 = norma.valores.percentiles.find((p) => p.percentil === 25)!.valor;
    const p50 = norma.valores.percentiles.find((p) => p.percentil === 50)!.valor;

    const i = informe([registro('r', (p25 + p50) / 2, 'kg', COND_UNI)], SUJETO_CO_20);
    const t = i.tarjetas.find((x) => x.tipo === 'TN-1')!;
    expect(t.situacion).toBe(ETIQUETA_INTERPRETACION.ENTRE_PERCENTILES_PUBLICADOS);
    // No aparece ningún percentil que la fuente no publique.
    const publicados = norma.valores.percentiles.map((p) => `P${p.percentil}`);
    for (const m of t.escala!.marcas) expect(publicados).toContain(m.etiqueta);
  });

  it('el modelo de vista no añade marcas a las publicadas', () => {
    const norma = NORMAS.find((n) => n.id === 'HGS-CO-UNI-M-20')!;
    if (norma.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    const tn1 = UNI.tarjetas.find((t) => t.tipo === 'TN-1')!;
    expect(tn1.escala!.marcas).toHaveLength(norma.valores.percentiles.length);
  });

  it('un valor fuera del intervalo se declara fuera, y no se extrapola', () => {
    const i = informe([registro('r', 300, 'kg', COND_UNI)], SUJETO_CO_20);
    const t = i.tarjetas.find((x) => x.tipo === 'TN-1')!;
    expect(t.escala!.fueraDeRango).toBe(true);
    expect(t.situacion).toBe(ETIQUETA_INTERPRETACION.POR_ENCIMA_DEL_MAYOR_PUBLICADO);
  });

  it('por el extremo inferior, igual', () => {
    const i = informe([registro('r', 1, 'kg', COND_UNI)], SUJETO_CO_20);
    const t = i.tarjetas.find((x) => x.tipo === 'TN-1')!;
    expect(t.escala!.fueraDeRango).toBe(true);
    expect(t.escala!.posicionObservado).toBe(0);
  });
});

// ─── ES-2 y conflicto ───────────────────────────────────────────────────────

describe('ES-2 y conflicto siguen visibles hasta la pantalla', () => {
  const t = ENSIN.tarjetas[0];

  it('la comparación se produce', () => {
    expect(t.situacion).toBe(ETIQUETA_INTERPRETACION.COINCIDE_CON_PERCENTIL);
  });

  it('y la norma se muestra como cuestionada', () => {
    expect(t.estadoEvidencia).toBe('CUESTIONADA');
    expect(t.estadoNorma).toBe(ETIQUETA_ESTADO_NORMA['ES-2']);
  });

  it('y el conflicto llega entero', () => {
    expect(t.conflicto).toBe('CONFLICTO_NO_DETERMINABLE');
    expect(t.evidencia.find((f) => f.dimension === 'Conflicto')!.estado).toBe(
      ETIQUETA_CONFLICTO.CONFLICTO_NO_DETERMINABLE,
    );
  });

  it('con la advertencia literal de la ficha', () => {
    expect(t.advertencias.join(' ')).toContain('ENSIN-2015');
    expect(t.advertencias.join(' ')).toContain('4,5 kg');
  });

  it('la advertencia no se reescribe ni se acorta', () => {
    const enNkb = NORMAS.find((n) => n.id === 'HGS-CO-M-15')!;
    expect(t.advertencias).toEqual(enNkb.advertencias);
  });

  it('una norma cuestionada no se relega ni se oculta', () => {
    expect(ENSIN.tarjetas).toHaveLength(1);
    expect(ENSIN.resumen[0].conNorma).toBe(true);
  });

  it('el resumen ejecutivo declara la evidencia', () => {
    expect(ENSIN.resumen[0].evidencia).toBe('ES-2');
  });
});

// ─── Comparabilidad ─────────────────────────────────────────────────────────

describe('comparabilidad', () => {
  const panel = UNI.comparabilidad.r1;

  it('declara cuántas normas se evaluaron de verdad', () => {
    expect(panel.evaluadas).toBe(NORMAS.length);
  });

  it('lista las comparables con su identidad', () => {
    expect(panel.comparables).toHaveLength(2);
    for (const c of panel.comparables) expect(c.identidad).toContain('Colombia');
  });

  it('agrupa las descartadas por motivo en vez de enumerarlas', () => {
    expect(panel.descartes.length).toBeLessThan(6);
    const total = panel.descartes.reduce((a, d) => a + d.total, 0);
    expect(total).toBe(panel.evaluadas - panel.comparables.length);
  });

  it('EQ-3 aparece como motivo propio', () => {
    const eq3 = panel.descartes.find((d) => d.motivoCorto === 'método EQ-3')!;
    expect(eq3).toBeDefined();
    expect(eq3.total).toBeGreaterThan(0);
    expect(eq3.motivo).toContain('EQ-3');
    // Y se declara como estado de comparabilidad, no como juicio de calidad.
    expect(eq3.naturaleza).toBe('no comparables');
  });

  it('cada grupo declara su naturaleza, que no es un juicio', () => {
    const JUICIO = /\b(mala|peor|deficiente|baja calidad|descartada por calidad)\b/i;
    for (const d of panel.descartes) {
      expect(['no comparables', 'no aplicables', 'sin determinar']).toContain(d.naturaleza);
      expect(`${d.naturaleza} ${d.motivoCorto}`).not.toMatch(JUICIO);
    }
    expect('descartada por calidad').toMatch(JUICIO);
  });

  it('las comparables llevan su tipo, para no parecer la misma norma repetida', () => {
    expect(panel.comparables.map((c) => c.tipo).sort()).toEqual(['TN-1', 'TN-2']);
  });

  it('cada grupo trae ejemplos, sin superar el tope', () => {
    for (const d of panel.descartes) {
      expect(d.ejemplos.length).toBeLessThanOrEqual(3);
      expect(d.ejemplos.length).toBeLessThanOrEqual(d.total);
    }
  });

  it('ninguna norma se pierde en el recuento', () => {
    const suma = panel.comparables.length + panel.descartes.reduce((a, d) => a + d.total, 0);
    expect(suma).toBe(panel.evaluadas);
  });

  it('cada tarjeta enlaza con su panel por el registro', () => {
    for (const t of UNI.tarjetas) expect(UNI.comparabilidad[t.registroId]).toBeDefined();
  });
});

// ─── Unidades ───────────────────────────────────────────────────────────────

describe('unidades', () => {
  it('lbf contra una norma en kgf no se convierte sola', () => {
    const i = informe([registro('b', 66, 'lbf', COND_BR)], SUJETO_BR_70);
    expect(i.tarjetas).toHaveLength(0);
    expect(i.resumen[0].estado).toBe(ETIQUETA_INTERPRETACION.SIN_NORMA_APLICABLE);
  });

  it('las normas en kgf quedan descartadas, con el motivo del NIE intacto', () => {
    const i = informe([registro('b', 66, 'lbf', COND_BR)], SUJETO_BR_70);
    const panel = i.comparabilidad.b;
    const total = panel.descartes.reduce((a, d) => a + d.total, 0);
    expect(total).toBe(panel.evaluadas);
    // Las 156 normas brasileñas caen por identidad de unidad, no por método.
    const porUnidad = panel.descartes.find((d) => d.ejemplos.some((e) => e.includes('Brasil')))!;
    expect(porUnidad.total).toBeGreaterThan(0);
    expect(porUnidad.motivo).toMatch(/unidad/i);
  });

  it('HALLAZGO · la conversión autorizada es inalcanzable desde el PAS', () => {
    // La unidad es una DIMENSIÓN de aplicabilidad en el NIE: un desajuste
    // excluye la norma antes de que la capa de composición pueda ofrecer la
    // conversión. Como el contexto toma la unidad del registro —que es la
    // verdad de cómo se midió—, `CONVERSION_DISPONIBLE_NO_SOLICITADA` no puede
    // aparecer por este camino.
    //
    // No se corrige falseando el contexto: eso mentiría sobre la medición.
    // Queda anotado como hallazgo para el NIE, y este test lo fija para que un
    // cambio futuro se note.
    const i = informe([registro('b', 66, 'lbf', COND_BR)], SUJETO_BR_70);
    const estados = i.comparabilidad.b.descartes.map((d) => d.motivoCorto);
    expect(estados).not.toContain('Conversión');
    expect(i.tarjetas).toHaveLength(0);
  });

  it('la matriz de evidencia declara el estado de la unidad', () => {
    const fila = UNI.tarjetas[0].evidencia.find((f) => f.dimension === 'Unidad')!;
    expect(fila.estado).toBe(ETIQUETA_UNIDAD.MISMA_UNIDAD);
  });
});

// ─── Matriz de evidencia ────────────────────────────────────────────────────

describe('matriz de evidencia', () => {
  it('lleva los cinco ejes, siempre', () => {
    for (const t of [...UNI.tarjetas, ...ENSIN.tarjetas]) {
      expect(t.evidencia.map((f) => f.dimension)).toEqual([
        'Calidad',
        'Estado',
        'Conflicto',
        'Unidad',
        'Tamaño de celda',
      ]);
    }
  });

  it('la calidad es la que declara la ficha', () => {
    const norma = NORMAS.find((n) => n.id === 'HGS-CO-UNI-M-20')!;
    const t = UNI.tarjetas.find((x) => x.normaId === 'HGS-CO-UNI-M-20')!;
    expect(t.calidad).toBe(ETIQUETA_CALIDAD[norma.calidad]);
  });

  it('un n que no consta se dice, y no se convierte en cero', () => {
    for (const t of UNI.tarjetas) {
      const fila = t.evidencia.find((f) => f.dimension === 'Tamaño de celda')!;
      expect(fila.estado).toMatch(t.nCelda === null ? /No consta/ : /personas/);
    }
  });

  it('los ejes no se combinan en ninguna puntuación', () => {
    expect(JSON.stringify(UNI)).not.toMatch(/"(score|puntuacion|puntaje|ranking|indice)"/i);
  });
});

// ─── Portada y resumen ──────────────────────────────────────────────────────

describe('portada y resumen', () => {
  it('la portada lleva los datos que recibió', () => {
    expect(UNI.portada.atleta).toBe(PORTADA.atleta);
    expect(UNI.portada.codigo).toBe(PORTADA.codigo);
    expect(UNI.portada.fecha).toBe(PORTADA.fecha);
  });

  it('el estado científico cuenta de cuántas mediciones hay norma', () => {
    expect(UNI.portada.estadoCientifico).toContain('1 de 1');
  });

  it('sin ninguna norma, lo dice sin culpar al atleta', () => {
    const i = informe([registroSinNorma('x', 'CMJ-01')], SUJETO_CO_20);
    expect(i.portada.estadoCientifico).toContain('Ninguna medición');
    expect(i.portada.estadoCientifico).toContain('base de conocimiento');
  });

  it('hay una tarjeta de resumen por medición', () => {
    const i = informe(
      [registro('a', 37.5, 'kg', COND_UNI), registroSinNorma('b', 'CMJ-01')],
      SUJETO_CO_20,
    );
    expect(i.resumen).toHaveLength(2);
    expect(i.resumen.map((r) => r.conNorma)).toEqual([true, false]);
  });

  it('el orden del resumen es el de los registros, sin reordenar', () => {
    const i = informe(
      [registroSinNorma('b', 'CMJ-01'), registro('a', 37.5, 'kg', COND_UNI)],
      SUJETO_CO_20,
    );
    expect(i.resumen.map((r) => r.id)).toEqual(['b', 'a']);
  });
});

// ─── Ninguna clasificación ──────────────────────────────────────────────────

describe('el informe no clasifica a nadie', () => {
  const JUICIO =
    /\b(bajo|alto|bueno|malo|deficiente|insuficiente|adecuado|excelente|[oó]ptimo|apto|riesgo|anormal)\b/i;

  it('ninguna etiqueta del catálogo contiene un juicio', () => {
    const todas = [
      ...Object.values(ETIQUETA_INTERPRETACION),
      ...Object.values(ETIQUETA_CALIDAD),
      ...Object.values(ETIQUETA_ESTADO_NORMA),
      ...Object.values(ETIQUETA_UNIDAD),
      ...Object.values(ETIQUETA_PAIS),
      ...Object.values(ETIQUETA_CONFLICTO),
      ...Object.values(ETIQUETA_VARIABLE),
    ];
    for (const e of todas) expect(e, e).not.toMatch(JUICIO);
    // Control positivo: la comprobación sabe encontrar lo que busca.
    expect('resultado bajo').toMatch(JUICIO);
  });

  it('el texto que redacta el modelo de vista tampoco', () => {
    for (const i of [UNI, ENSIN]) {
      const propio = [
        i.portada.estadoCientifico,
        ...i.resumen.map((r) => `${r.estado} ${r.evidencia}`),
        ...i.tarjetas.flatMap((t) => [
          t.situacion,
          t.aria,
          ...t.evidencia.map((f) => `${f.dimension} ${f.estado}`),
        ]),
        ...i.sinNorma.map((s) => s.detalle),
      ].join(' ');
      expect(propio).not.toMatch(JUICIO);
    }
  });

  it('«sin norma» nunca se expresa como «insuficiente»', () => {
    const i = informe([registroSinNorma('x', 'CMJ-01')], SUJETO_CO_20);
    expect(i.sinNorma[0].detalle).not.toMatch(/insuficiente|deficiente|bajo/i);
  });
});

// ─── Escala, aritmética pura ────────────────────────────────────────────────

describe('escala', () => {
  it('sitúa proporcionalmente sobre el eje de valores', () => {
    const e = escalar(
      [
        { etiqueta: 'A', valor: 0 },
        { etiqueta: 'B', valor: 100 },
      ],
      25,
    );
    expect(e.posicionObservado).toBe(25);
  });

  it('sujeta al borde lo que queda fuera, y lo declara', () => {
    const e = escalar(
      [
        { etiqueta: 'A', valor: 10 },
        { etiqueta: 'B', valor: 20 },
      ],
      99,
    );
    expect(e.posicionObservado).toBe(100);
    expect(e.fueraDeRango).toBe(true);
  });

  it('una escala degenerada no produce NaN', () => {
    const e = escalar(
      [
        { etiqueta: 'A', valor: 5 },
        { etiqueta: 'B', valor: 5 },
      ],
      5,
    );
    expect(Number.isFinite(e.posicionObservado)).toBe(true);
    for (const m of e.marcas) expect(Number.isFinite(m.posicion)).toBe(true);
  });

  it('toda posición queda entre 0 y 100', () => {
    for (const v of [-1000, 0, 37.5, 1000]) {
      const e = escalar(
        [
          { etiqueta: 'A', valor: 20 },
          { etiqueta: 'B', valor: 50 },
        ],
        v,
      );
      expect(e.posicionObservado).toBeGreaterThanOrEqual(0);
      expect(e.posicionObservado).toBeLessThanOrEqual(100);
    }
  });

  it('no reordena las marcas que recibe', () => {
    const e = escalar(
      [
        { etiqueta: 'Z', valor: 30 },
        { etiqueta: 'A', valor: 10 },
      ],
      20,
    );
    expect(e.marcas.map((m) => m.etiqueta)).toEqual(['Z', 'A']);
  });
});

// ─── Determinismo ───────────────────────────────────────────────────────────

describe('determinismo y pureza', () => {
  it('dos composiciones del mismo caso son idénticas', () => {
    expect(JSON.stringify(informeUni())).toBe(JSON.stringify(informeUni()));
  });

  it('el orden de los registros no altera el contenido de cada tarjeta', () => {
    const a = informe(
      [registro('a', 37.5, 'kg', COND_UNI), registroSinNorma('b', 'CMJ-01')],
      SUJETO_CO_20,
    );
    const b = informe(
      [registroSinNorma('b', 'CMJ-01'), registro('a', 37.5, 'kg', COND_UNI)],
      SUJETO_CO_20,
    );
    expect(a.tarjetas).toEqual(b.tarjetas);
  });

  it('el valor observado no altera qué normas se evalúan', () => {
    const evaluadas = (v: number) =>
      informe([registro('r', v, 'kg', COND_UNI)], SUJETO_CO_20).comparabilidad.r.evaluadas;
    expect(evaluadas(1)).toBe(evaluadas(300));
  });

  it('no modifica las normas de la NKB', () => {
    const antes = JSON.stringify(NORMAS.find((n) => n.id === 'HGS-CO-UNI-M-20')!.valores);
    informeUni();
    expect(JSON.stringify(NORMAS.find((n) => n.id === 'HGS-CO-UNI-M-20')!.valores)).toBe(antes);
  });

  it('los ENSIN de dos informes distintos coinciden', () => {
    expect(JSON.stringify(informeEnsin())).toBe(JSON.stringify(ENSIN));
  });

  it('el registro de la ficha ENSIN sigue en ES-2 tras componer', () => {
    expect(NORMAS.find((n) => n.id === 'HGS-CO-M-15')!.estado).toBe('ES-2');
  });
});
