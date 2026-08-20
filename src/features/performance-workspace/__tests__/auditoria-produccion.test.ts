// ── Auditoría de producción, durable (Sprint PRS-2.4) ──────────────────────
//
// Las auditorías de los sprints anteriores vivían en scripts de scratchpad: se
// ejecutaban una vez, daban cero, y se perdían. Una prohibición que solo se
// comprueba el día que se escribe no protege de nada.
//
// LO QUE SE AUDITA Y LO QUE NO:
//
//   Se audita CÓDIGO DE PRODUCCIÓN. No comentarios, no documentación, no
//   ficheros de test. La razón está aprendida a base de tropezar cinco veces
//   (H-02, H-03, H-05, H-10): la prosa que EXPLICA una prohibición contiene
//   necesariamente las palabras prohibidas, y buscarlas a ciegas convierte la
//   documentación en la infracción. Los tests, además, nombran lo prohibido por
//   oficio: comprobar que «kgf» sigue bloqueando exige escribir «kgf».
//
//   Y toda prohibición lleva CONTROL POSITIVO: se demuestra sobre una muestra
//   artificial que la comprobación sabe encontrar una infracción real. Sin eso,
//   una expresión regular rota da cero para siempre y nadie se entera.

import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

// ─── La superficie auditada ─────────────────────────────────────────────────

/** Capas de producción de la ruta normativa. El motor NIE y la NKB no se tocan. */
const SUPERFICIE = [
  'src/lib/pas/normativo',
  'src/lib/pas/report-v2',
  'src/components/pas/report-v2',
  'src/features/performance-workspace/services',
  'src/features/performance-workspace/repository',
  'src/features/performance-workspace/components',
  'src/app/app/rendimiento',
];

function recorrer(dir: string): string[] {
  const abs = join(process.cwd(), dir);
  const salida: string[] = [];
  for (const entrada of readdirSync(abs)) {
    const ruta = join(abs, entrada);
    if (statSync(ruta).isDirectory()) {
      // Los tests se excluyen: nombran lo prohibido para comprobarlo.
      if (entrada === '__tests__') continue;
      salida.push(...recorrer(relative(process.cwd(), ruta)));
    } else if (/\.tsx?$/.test(entrada) && !/\.test\.tsx?$/.test(entrada)) {
      salida.push(relative(process.cwd(), ruta));
    }
  }
  return salida;
}

const FICHEROS = SUPERFICIE.flatMap(recorrer);

/** Código sin comentarios: la prosa que documenta una prohibición no es una. */
const sinComentarios = (s: string): string =>
  s.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

/** Y sin literales de cadena, para las comprobaciones estructurales. */
const soloCodigo = (s: string): string =>
  sinComentarios(s)
    .replace(/'(?:[^'\\\n]|\\.)*'/g, "''")
    .replace(/"(?:[^"\\\n]|\\.)*"/g, '""')
    .replace(/`(?:[^`\\]|\\.)*`/g, '``');

const FUENTES = FICHEROS.map((f) => [f, readFileSync(join(process.cwd(), f), 'utf-8')] as const);

describe('la superficie auditada es la que se cree', () => {
  it('cubre las siete capas de producción de la ruta normativa', () => {
    expect(SUPERFICIE).toHaveLength(7);
    expect(FICHEROS.length).toBeGreaterThan(20);
  });

  it('no incluye ningún fichero de test', () => {
    for (const f of FICHEROS) expect(f).not.toMatch(/__tests__|\.test\./);
  });

  it('no incluye el motor NIE ni la NKB', () => {
    for (const f of FICHEROS) {
      expect(f).not.toMatch(/src[\\/]lib[\\/]nie/);
      expect(f).not.toMatch(/normative-knowledge-base/);
    }
  });
});

// ─── Las prohibiciones, cada una con su control positivo ────────────────────

/**
 * Cada entrada declara qué se prohíbe y una muestra que DEBE detectarse.
 *
 * La muestra no es decorativa: es lo que impide que una expresión regular rota
 * dé cero para siempre. Si alguien rompe el patrón, el control positivo cae
 * antes que la comprobación real.
 */
const PROHIBICIONES: readonly {
  nombre: string;
  patron: RegExp;
  muestra: string;
}[] = [
  {
    nombre: 'clasificación generada',
    patron: /\b(clasificar|categorizar|etiquetarNivel|calificar)\s*\(/i,
    muestra: 'const n = clasificar(valor);',
  },
  {
    nombre: 'selección automática de norma',
    patron: /\b(mejorNorma|normaElegida|resultadoFinal|normaGanadora|elegirNorma)\b/,
    muestra: 'const mejorNorma = candidatas[0];',
  },
  {
    // La prohibición es ordenar NORMAS para decidir cuál gana, no ordenar en
    // general: el Workspace ordena evaluaciones por fecha y nombres de deporte
    // alfabéticamente, y eso es presentación de otras entidades. Un patrón que
    // cazara cualquier `.sort(` marcaría esas dos y dejaría de significar algo.
    nombre: 'ordenación de normas',
    patron: /\b(normas|candidatas|comparables|tarjetas|resultados|descartes)\b[^;\n]{0,30}\.sort\(/,
    muestra: 'candidatas.sort((a, b) => a.calidad - b.calidad);',
  },
  {
    nombre: 'selección por índice de una lista de normas',
    patron: /\b(normas|candidatas|comparables|tarjetas|resultados)\s*\[\s*0\s*\]/,
    muestra: 'const elegida = normas[0];',
  },
  {
    nombre: 'interpolación o extrapolación',
    patron: /\b(interpolar|extrapolar)\s*\(/i,
    muestra: 'const p = interpolar(p25, p50, valor);',
  },
  {
    nombre: 'z convertido en percentil',
    patron: /\berf\s*\(|\bnormalCdf\b|\bpnorm\b|percentilDesdeZ\s*\(/i,
    muestra: 'const p = normalCdf(z) * 100;',
  },
  {
    nombre: 'punto de corte',
    patron: /\b(umbral|cutoff|puntoDeCorte)\s*[=:]/i,
    muestra: 'const umbral = 27;',
  },
  {
    nombre: 'factor de conversión de unidades',
    patron: /0\.45359237|9\.80665|2\.20462/,
    muestra: 'const f = 0.45359237;',
  },
  {
    nombre: 'conversión de unidades fuera de su capa',
    patron: /\bconvertirUnidad\s*\(|\baKilogramos\s*\(|\baLibras\s*\(/i,
    muestra: 'const v = aKilogramos(x);',
  },
  {
    nombre: 'promedio entre normas',
    patron: /\b(promediarNormas|mediaDeNormas|fusionarNormas)\s*\(/i,
    muestra: 'const n = promediarNormas(a, b);',
  },
  {
    nombre: 'inferencia de sexo',
    patron: /\bsexo\s*(=|\?\?|\|\|)\s*['"](M|F)['"]/,
    muestra: "const sexo = atleta.sexo ?? 'M';",
  },
  {
    nombre: 'inferencia de país',
    patron: /\bpais\s*(=|\?\?|\|\|)\s*['"][A-Z]{2}['"]/,
    muestra: "const pais = atleta.pais || 'CO';",
  },
  {
    // PAS-12 AFLOJÓ ESTE PATRÓN, y conviene dejar dicho por qué.
    //
    // Antes bastaba con nombrar `peso_kg`: cuando se escribió, esa columna solo
    // existía en `profiles`, así que la palabra sola delataba la infracción.
    // Desde PAS-12 existe también `pas_evaluaciones.peso_kg`, que es el peso
    // DEL ATLETA en la fecha de su evaluación — exactamente lo que el sistema
    // debe usar para la fuerza relativa.
    //
    // La prohibición NO ha cambiado: sigue prohibido tomar las coordenadas del
    // atleta del perfil de quien lo mide. Lo que cambia es que ahora se
    // persigue el ORIGEN y no el nombre de la columna.
    //
    // `altura_cm` sigue prohibida a secas: `pas_atletas` usa `estatura_cm`, así
    // que quien escriba `altura_cm` está leyendo el perfil sí o sí.
    nombre: 'lectura del perfil del profesional',
    patron: /\baltura_cm\b|(profile|perfil)\.(peso_kg|pesoKg|sexo|altura_cm)|from\(['"]profiles['"]\)/,
    muestra: 'const alt = profile.altura_cm;',
  },
  {
    // El caso concreto que el patrón anterior cubría por accidente y este
    // cubre a propósito.
    nombre: 'peso del profesional en vez del de la evaluación',
    patron: /(profile|perfil)\.(peso_kg|pesoKg)/,
    muestra: 'const kg = profile.peso_kg;',
  },
  {
    nombre: 'escritura sobre la NKB',
    patron: /writeFileSync|appendFileSync|\bmkdirSync\b|\brmSync\b/,
    muestra: 'writeFileSync(ficha, contenido);',
  },
];

describe('prohibiciones de producción', () => {
  it.each(PROHIBICIONES.map((p) => [p.nombre, p] as const))(
    'la comprobación de «%s» detecta una infracción real',
    (_n, p) => {
      // Control positivo: sin esto, un patrón roto daría cero para siempre.
      expect(p.muestra).toMatch(p.patron);
    },
  );

  it.each(PROHIBICIONES.map((p) => [p.nombre, p] as const))(
    'no hay «%s» en el código de producción',
    (nombre, p) => {
      const infractores = FUENTES.filter(([, s]) => p.patron.test(soloCodigo(s))).map(([f]) => f);
      expect(infractores, `${nombre}: ${infractores.join(', ')}`).toEqual([]);
    },
  );
});

// ─── Pureza y fronteras de importación ──────────────────────────────────────

describe('fronteras de importación', () => {
  const componentes = FUENTES.filter(([f]) => f.includes(join('components', 'pas', 'report-v2')));

  it('los componentes existen y son varios', () => {
    expect(componentes.length).toBeGreaterThanOrEqual(9);
  });

  it.each(componentes)('%s no importa la NKB, fs ni Supabase', (_f, src) => {
    const codigo = sinComentarios(src);
    for (const [nombre, patron] of [
      ['NKB', /nkb\/cargador|normative-knowledge-base/],
      ['node:fs', /node:fs/],
      ['Supabase', /@\/lib\/supabase|createClient/],
      ['motor NIE', /from ["']@\/lib\/nie["']|from ["']@\/lib\/nie\//],
      ['repositorio', /performance-workspace\/(repository|actions)/],
    ] as const) {
      expect(codigo, nombre).not.toMatch(patron);
    }
  });

  it.each(componentes)('%s no lleva estado ni efectos', (_f, src) => {
    const codigo = sinComentarios(src);
    for (const [nombre, patron] of [
      ['use client', /"use client"/],
      ['useState', /useState/],
      ['useEffect', /useEffect/],
      ['fetch', /\bfetch\(/],
      ['Date', /new Date\(|Date\.now/],
      ['Math.random', /Math\.random/],
    ] as const) {
      expect(codigo, nombre).not.toMatch(patron);
    }
  });

  it('control positivo: las fronteras detectan una importación indebida', () => {
    const MUESTRA = 'import { cargarNormas } from "@/lib/nie/nkb/cargador";';
    expect(MUESTRA).toMatch(/nkb\/cargador/);
    expect(MUESTRA).not.toBe('');
  });

  it('solo el servicio de servidor toca la NKB', () => {
    const conNKB = FUENTES.filter(([, s]) => /cargarNormas/.test(sinComentarios(s))).map(([f]) => f);
    expect(conNKB).toHaveLength(1);
    expect(conNKB[0]).toMatch(/informe-normativo\.ts$/);
  });
});

// ─── El antipatrón del error silenciado ─────────────────────────────────────

describe('los errores no se silencian', () => {
  const ANTIPATRON = /catch\s*(\([^)]*\))?\s*\{[^}]{0,120}?return\s*(\[\]|null|undefined)\s*[;}]/;

  it('control positivo: el antipatrón se reconoce', () => {
    expect('try { cargarNormas() } catch { return [] }').toMatch(ANTIPATRON);
    expect('try { x() } catch (e) { return null; }').toMatch(ANTIPATRON);
  });

  it('ningún catch de producción devuelve vacío en lugar del error', () => {
    const infractores = FUENTES.filter(([, s]) => ANTIPATRON.test(sinComentarios(s))).map(
      ([f]) => f,
    );
    expect(infractores).toEqual([]);
  });

  it('el servicio normativo nombra el fallo en lugar de tragárselo', () => {
    const src = readFileSync(
      join(process.cwd(), 'src/features/performance-workspace/services/informe-normativo.ts'),
      'utf-8',
    );
    expect(src).toContain("estado: 'ERROR_TECNICO'");
    expect(src).toMatch(/origen: 'NKB'/);
    expect(src).toMatch(/origen: 'REGISTROS'/);
  });
});

// ─── Vocabulario en el texto que el sistema redacta ─────────────────────────

describe('el texto que escribe la aplicación no clasifica', () => {
  // Las fronteras excluyen el guion a propósito: `font-normal` es un peso
  // tipográfico de Tailwind, no la categoría «normal», y `\b` no los distingue.
  // Una palabra pegada a un guion pertenece a un identificador, no a una frase.
  const CATEGORIAS =
    /(?<![-\w])(bajo|alto|normal|anormal|excelente|malo|superior|inferior|deficiente|adecuado|apto|riesgo)(?![-\w])/i;

  /** Literales de cadena del código de producción: lo que la app puede mostrar. */
  const LITERALES = FUENTES.flatMap(([f, s]) => {
    const texto = sinComentarios(s);
    const encontrados = [
      ...(texto.match(/'(?:[^'\\\n]{6,})'/g) ?? []),
      ...(texto.match(/"(?:[^"\\\n]{6,})"/g) ?? []),
    ];
    return encontrados.map((l) => [f, l] as const);
  });

  it('hay literales que auditar', () => {
    expect(LITERALES.length).toBeGreaterThan(50);
  });

  it('ninguno afirma una categoría', () => {
    const infractores = LITERALES.filter(([, l]) => {
      // Se descuentan las negaciones: «No representa un percentil» o «no una
      // afirmación de que no haya mediciones» son prohibiciones, no juicios.
      const afirmado = l.replace(/\bno\s+\w+[^.]*/gi, '').replace(/\bNo\s+\w+[^.]*/g, '');
      return CATEGORIAS.test(afirmado);
    });
    expect(infractores.map(([f, l]) => `${f}: ${l}`)).toEqual([]);
  });

  it('control positivo: detecta la categoría y no la clase de Tailwind', () => {
    expect("'el resultado es alto'").toMatch(CATEGORIAS);
    expect("'perfil normal para su edad'").toMatch(CATEGORIAS);
    // La distinción que costó el falso positivo: `font-normal` es un peso
    // tipográfico, no un juicio sobre nadie.
    expect('"ml-2 font-normal text-white/35"').not.toMatch(CATEGORIAS);
    expect('"text-superior"').not.toMatch(CATEGORIAS);
  });
});
