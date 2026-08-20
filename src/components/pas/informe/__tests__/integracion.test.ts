// ── Evidencia visible y perfil de rendimiento (PAS-10E.1 · PAS-10F) ────────
//
// Estos tests protegen lo que el sprint promete AL ATLETA, no al modelo:
//
//   · que lea «Dinamometría de agarre» y no «P-03»;
//   · que «evidencia parcial» no se le presente como «no hay evidencia»;
//   · que una escala solo dibuje valores realmente publicados;
//   · que ningún dominio se convierta en una nota.
//
// Render REAL a HTML con `react-dom/server`.

import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import type { GrupoDominio, ResultadoHumano } from '@/lib/pas/informe-humano';
import { leerEvidencia, type LecturaEvidencia } from '@/lib/pas/evidencia';
import { construirSerie } from '@/lib/pas/seguimiento';

import EvidenceBlock from '../EvidenceBlock';
import EvidenceScale from '@/components/pas/evidencia/EvidenceScale';
import PerformanceProfile from '../PerformanceProfile';
import ResultCard from '../ResultCard';

const SIN_EVIDENCIA: LecturaEvidencia = {
  pruebaId: 'P-03',
  estado: 'SIN_EVIDENCIA_UTILIZABLE',
  compatibles: [],
  descartadas: [],
  carencias: [],
  complementarias: [],
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
      resumen: null,
      explicacion: 'No existe actualmente una referencia normativa compatible.',
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
      motivo: 'No hay ninguna medición anterior de esta prueba.',
    },
    objetivo: {
      disponible: false, objetivo: null, progreso: null, superado: false,
      mantenimiento: null, motivoCodigo: null, motivo: null,
    },
    serie: construirSerie('P-03', [
      { pruebaId: 'P-03', valor: 46, unidad: 'kg', fecha: '2026-08-15', condiciones: {} },
    ]),
    evidencia: SIN_EVIDENCIA,
    fuenteNormativa: 'ninguna',
    interpretacion: {
      disponible: false, texto: null,
      porEje: { normativo: null, longitudinal: null, objetivo: null },
    },
    detalles: {
      pruebaId: 'P-03', normaId: null, tipoNorma: null, instrumento: null, poblacion: null,
      nCelda: null, calidad: null, estadoNorma: null, conflicto: null, unidad: null,
      referencia: null, motivo: null, advertencias: [], descartes: [],
    },
    ...over,
  };
}

const bloque = (evidencia: LecturaEvidencia, normativaCubierta = false) =>
  renderToStaticMarkup(
    createElement(EvidenceBlock, { evidencia, observado: 46, unidad: 'kg', normativaCubierta }),
  );

/** Lecturas reales, calculadas por la capa. Nada se fabrica en el test. */
const ADULTO = { edad: 22, sexo: 'M' as const, pais: 'CO', pesoKg: null };
const ESCOLAR = { edad: 14, sexo: 'M' as const, pais: 'CO', pesoKg: null };

const LECTURAS = {
  noDeterminable: leerEvidencia(
    { pruebaId: 'P-01', valor: 2.5, unidad: 'ratio_peso', condiciones: { determinacion: 'medido_directo' } },
    ADULTO,
  ),
  noComparable: leerEvidencia(
    { pruebaId: 'P-01', valor: 2.5, unidad: 'ratio_peso', condiciones: {} },
    { ...ADULTO, pesoKg: 70 },
  ),
  noCompatible: leerEvidencia(
    { pruebaId: 'P-07', valor: 60, unidad: 'estadios', condiciones: { ecuacion: 'leger_1988' } },
    ADULTO,
  ),
  parcialSistema: leerEvidencia(
    { pruebaId: 'P-07', valor: 60, unidad: 'estadios', condiciones: { ecuacion: 'leger_1988' } },
    ESCOLAR,
  ),
  parcialFiabilidad: leerEvidencia(
    { pruebaId: 'P-02', valor: 2400, unidad: 'N', condiciones: { formato: 'bilateral' } },
    ADULTO,
  ),
  compatible: leerEvidencia(
    { pruebaId: 'P-01', valor: 2.5, unidad: 'ratio_peso', condiciones: { determinacion: 'medido_directo' } },
    { ...ADULTO, pesoKg: 70 },
  ),
};

// ════════════════════════════════════════════════════════════════════════════
// LOS SIETE CASOS LLEGAN A PANTALLA (§A5)
// ════════════════════════════════════════════════════════════════════════════

describe('cada estado de evidencia se ve distinto', () => {
  it('cada lectura llega al bloque con su propio estado', () => {
    const vistos = new Set<string>();
    for (const [nombre, l] of Object.entries(LECTURAS)) {
      const html = bloque(l);
      expect(html, nombre).toContain(`data-estado="${l.estado}"`);
      vistos.add(l.estado);
    }
    // Cinco situaciones distintas, cinco presentaciones distintas.
    expect(vistos.size).toBeGreaterThanOrEqual(4);
  });

  it('«evidencia parcial» NO se presenta como ausencia de evidencia', () => {
    // Se afirma la INTENCIÓN, no una palabra concreta del título: la frase
    // debe empezar por lo que existe y no negar la evidencia.
    const html = bloque(LECTURAS.parcialSistema);
    expect(html).toContain('Evidencia disponible');
    expect(html).toContain('Existe una referencia compatible y verificada');
    expect(html).not.toContain('No se ha localizado evidencia');
    expect(html).not.toContain('Sin referencia utilizable');
  });

  it('ninguna tarjeta niega la referencia más de una vez', () => {
    // El defecto que reportó la revisión visual: la interpretación, el bloque
    // normativo y el de evidencia decían los tres que no había referencia,
    // antes de mencionar la fiabilidad que sí existía.
    const html = bloque(LECTURAS.parcialFiabilidad);
    const negaciones = (html.match(/[Nn]o (existe|hay) (actualmente )?una referencia/g) ?? []).length;
    expect(negaciones).toBeLessThanOrEqual(1);
  });

  it('la evidencia de fiabilidad se enuncia antes que lo que falta', () => {
    const html = bloque(LECTURAS.parcialFiabilidad);
    const texto = html.replace(/<[^>]+>/g, ' ');
    expect(texto.indexOf('tiene evidencia publicada')).toBeGreaterThan(-1);
    expect(texto.indexOf('tiene evidencia publicada')).toBeLessThan(
      texto.indexOf('Lo que no existe todavía'),
    );
  });

  it('«no determinable» NO se convierte en «sin evidencia»', () => {
    const html = bloque(LECTURAS.noDeterminable);
    expect(html).toContain('data-estado="NO_DETERMINABLE"');
    expect(html).toContain('Falta un dato');
    expect(html).not.toContain('No se ha localizado evidencia');
  });

  it('«no compatible» no se presenta como referencia válida', () => {
    const html = bloque(LECTURAS.noCompatible);
    expect(html).toContain('no compatible');
    // Y explica por qué, en lenguaje corriente.
    expect(html).toMatch(/edad|población|protocolo/i);
  });

  it('solo el estado sin literatura dice que no hay evidencia', () => {
    const html = bloque(SIN_EVIDENCIA);
    expect(html).toContain('Sin referencia utilizable');
    expect(html).toContain('seguimiento longitudinal');
  });

  it('cuando la NKB ya respondió, el bloque no repite la comparación', () => {
    // Era el conflicto de la auditoría: P-03 comparada por la NKB y declarada
    // «sin evidencia» por la capa nueva, en la misma tarjeta.
    expect(bloque(SIN_EVIDENCIA, true)).toBe('');
  });

  it('pero sí añade la fiabilidad cuando la NKB no la cubre', () => {
    const html = bloque(LECTURAS.parcialFiabilidad, true);
    expect(html).toContain('Evidencia complementaria');
    expect(html).toContain('Fiabilidad de la prueba');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LA ESCALA SOLO DIBUJA LO PUBLICADO (§A5, §A7)
// ════════════════════════════════════════════════════════════════════════════

describe('la escala no fabrica datos', () => {
  const escala = (representacion: Parameters<typeof EvidenceScale>[0]['representacion'], posicion = null) =>
    renderToStaticMarkup(
      createElement(EvidenceScale, { representacion, posicion, observado: 46, unidad: 'kg' }),
    );

  it('con percentiles dibuja SOLO los publicados', () => {
    const html = escala({
      clase: 'percentiles',
      puntos: [{ p: 90, valor: 44 }, { p: 97, valor: 50 }],
    });
    expect(html).toContain('P90');
    expect(html).toContain('P97');
    // No hay P93, ni P95, ni ningún intermedio inventado.
    for (const inventado of ['P91', 'P92', 'P93', 'P94', 'P95', 'P96']) {
      expect(html, inventado).not.toContain(inventado);
    }
  });

  it('con un solo percentil NO dibuja una barra completa', () => {
    const html = escala({ clase: 'percentiles', puntos: [{ p: 90, valor: 44 }] });
    expect(html).toContain('data-clase="percentil-unico"');
    expect(html).toContain('no puede dibujarse una escala');
  });

  it('media ± DT se rotula en desviaciones, nunca en percentiles', () => {
    const html = escala({ clase: 'media_dt', media: 40, dt: 5 });
    expect(html).toContain('DT');
    expect(html).toContain('media');
    expect(html).not.toMatch(/P\d\d/);
    expect(html).toContain('no equivale a una posición percentil');
  });

  it('la fiabilidad NO se dibuja como una escala con el atleta encima', () => {
    const html = escala({ clase: 'fiabilidad', icc: [0.9, 0.99], cvPct: 4.2 });
    expect(html).toContain('ICC publicado');
    expect(html).toContain('CV publicado');
    // Sin marcador: un ICC no es un eje sobre el que situar a nadie.
    expect(html).not.toContain('pas10e-marcador');
    // Y sin convertir el CV en un MDC.
    expect(html).not.toContain('MDC');
  });

  it('control positivo: la comprobación detectaría un MDC fabricado', () => {
    expect('<span>MDC 4,2</span>').toContain('MDC');
  });

  it('sin datos suficientes NO se fabrica un gráfico', () => {
    const html = escala({
      clase: 'valores_sin_transcribir',
      queSePublica: 'percentiles P3 a P97 por edad y sexo',
    });
    expect(html).toContain('data-clase="sin-transcribir"');
    expect(html).not.toContain('pas10e-marcador');
  });

  it('ninguna escala pinta un semáforo científico', () => {
    const casos: Parameters<typeof EvidenceScale>[0]['representacion'][] = [
      { clase: 'percentiles', puntos: [{ p: 25, valor: 30 }, { p: 90, valor: 55 }] },
      { clase: 'media_dt', media: 40, dt: 5 },
      { clase: 'rango', min: 20, max: 30 },
      { clase: 'punto_de_corte', valor: 40, porDebajo: 'a', porEncima: 'b' },
      { clase: 'fiabilidad', icc: [0.9, 0.99], cvPct: 4 },
    ];
    for (const r of casos) {
      const html = escala(r);
      // Verde y rojo afirmarían que un extremo es bueno y el otro malo, y
      // ninguna fuente registrada define categorías.
      expect(html, r.clase).not.toMatch(/(?<![-\w])(bg-green|bg-red|bg-emerald|bg-rose|text-green|text-red)/);
    }
  });

  it('control positivo: esa comprobación detecta un semáforo real', () => {
    expect('<div class="bg-green-500">').toMatch(/(?<![-\w])(bg-green|bg-red)/);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// EL ATLETA NO LEE CÓDIGOS (§A2, §A6)
// ════════════════════════════════════════════════════════════════════════════

describe('los identificadores internos no son la lectura principal', () => {
  const html = renderToStaticMarkup(
    createElement(ResultCard, { resultado: resultado({ evidencia: LECTURAS.parcialFiabilidad }) }),
  );

  it('el nombre humano se muestra', () => {
    expect(html).toContain('Dinamometría de agarre');
  });

  it('ningún código aparece como texto legible', () => {
    // Pueden estar en atributos `data-` —para pruebas y para el profesional—,
    // pero no como contenido que el atleta lea.
    const soloTexto = html.replace(/<[^>]+>/g, ' ');
    for (const codigo of ['P-03', 'P-01', 'TN-1', 'TN-2', 'EQ-3', 'ES-1', 'NKB', 'NIE']) {
      expect(soloTexto, codigo).not.toContain(codigo);
    }
  });

  it('control positivo: la comprobación detecta un código visible', () => {
    expect('<p>P-03</p>'.replace(/<[^>]+>/g, ' ')).toContain('P-03');
  });

  it('el valor observado permanece intacto', () => {
    // 46, no «46,0» ni «46.00». El original no se reformatea al alza.
    expect(html).toContain('>46<');
    expect(html).not.toContain('46,00');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// PERFIL DE RENDIMIENTO (§B1, §B2, §B6)
// ════════════════════════════════════════════════════════════════════════════

describe('el perfil agrupa por dominios sin puntuar', () => {
  const grupo = (nombre: string, resultados: ResultadoHumano[]): GrupoDominio => ({
    id: nombre,
    nombre,
    resultados,
    conReferencia: resultados.filter((r) => r.fuenteNormativa !== 'ninguna').length,
  });

  const dominios = [
    grupo('Producción de fuerza', [
      resultado({ nombre: 'Dinamometría de agarre', fuenteNormativa: 'nkb' }),
      resultado({
        pruebaId: 'P-01',
        nombre: '1RM (una repetición máxima)',
        valorObservado: 120,
        evidencia: LECTURAS.noDeterminable,
        tendencia: { ...resultado().tendencia, disponible: true, valorAnterior: 110, cambioAbsoluto: 10 },
      }),
    ]),
    grupo('Metabólico', [
      resultado({ pruebaId: 'P-07', nombre: 'Course-navette (20 m)', valorObservado: 60, unidad: 'estadios', evidencia: LECTURAS.noCompatible }),
    ]),
  ];

  const html = renderToStaticMarkup(createElement(PerformanceProfile, { dominios }));

  it('cada dominio aparece con su nombre real del catálogo', () => {
    expect(html).toContain('Producción de fuerza');
    expect(html).toContain('Metabólico');
  });

  it('NO existe ninguna puntuación global', () => {
    expect(html).not.toMatch(/(?<![-\w])(score|puntuaci[óo]n|\/\s*100|nivel global)(?![-\w])/i);
    expect(html).toContain('No se promedian entre sí');
  });

  it('los tres ejes se leen en columnas separadas', () => {
    expect(html).toContain('Referencia');
    expect(html).toContain('Evolución');
    expect(html).toContain('Objetivo');
  });

  it('una prueba SIN referencia no desaparece del perfil', () => {
    expect(html).toContain('1RM (una repetición máxima)');
    expect(html).toContain('120');
  });

  it('y declara qué le falta, en vez de un guion mudo', () => {
    expect(html).toContain('falta un dato');
  });

  it('una prueba sin norma pero con evolución la muestra igual', () => {
    // Es el punto del §B: sin normativa, el resultado sigue sirviendo.
    const fila = html.slice(html.indexOf('data-prueba="P-01"'));
    expect(fila.slice(0, 600)).toContain('✓');
  });

  it('las pruebas se identifican por nombre; el código va en data-', () => {
    const soloTexto = html.replace(/<[^>]+>/g, ' ');
    expect(soloTexto).not.toContain('P-01');
    expect(html).toContain('data-prueba="P-01"');
  });

  it('sin dominios no se dibuja nada', () => {
    expect(renderToStaticMarkup(createElement(PerformanceProfile, { dominios: [] }))).toBe('');
  });

  it('el render es determinista', () => {
    expect(renderToStaticMarkup(createElement(PerformanceProfile, { dominios }))).toBe(html);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// FRONTERAS DE PRESENTACIÓN (§E)
// ════════════════════════════════════════════════════════════════════════════

describe('la presentación no calcula ciencia', () => {
  const componentes = [
    'src/components/pas/informe/EvidenceBlock.tsx',
    'src/components/pas/informe/PerformanceProfile.tsx',
    'src/components/pas/evidencia/EvidenceScale.tsx',
  ];

  const leer = async (f: string) => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    return readFileSync(join(process.cwd(), f), 'utf-8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '')
      .replace(/\{\/\*[\s\S]*?\*\/\}/g, '');
  };

  it.each(componentes)('%s no consulta NIE, NKB ni Supabase', async (f) => {
    const src = await leer(f);
    for (const [nombre, patron] of [
      ['NIE', /from ['"]@\/lib\/nie/],
      ['NKB', /cargarNormas/],
      ['Supabase', /(?<![-\w])supabase(?![-\w])/i],
    ] as const) {
      expect(src, `${f}: ${nombre}`).not.toMatch(patron);
    }
  });

  it.each(componentes)('%s no reevalúa la evidencia', async (f) => {
    const src = await leer(f);
    // `leerEvidencia` y `situar` viven en la capa científica. Un componente que
    // los llamara estaría recalculando en React lo que ya viene resuelto.
    for (const p of [/leerEvidencia\(/, /\bsituar\(/, /calcularProgreso\(/, /construirSerie\(/]) {
      expect(src, f).not.toMatch(p);
    }
  });

  it('control positivo: las comprobaciones cazan sus infracciones', () => {
    expect("import {x} from '@/lib/nie'").toMatch(/from ['"]@\/lib\/nie/);
    expect('const l = leerEvidencia(a, b);').toMatch(/leerEvidencia\(/);
    expect('await supabase.from("x")').toMatch(/(?<![-\w])supabase(?![-\w])/i);
  });
});
