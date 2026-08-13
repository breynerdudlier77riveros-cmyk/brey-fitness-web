// ── El motor es puro y no hace lo que este sprint prohíbe ──────────────────
//
// Las comprobaciones se hacen sobre el código fuente, con los comentarios ya
// retirados: un comentario que explique una prohibición no debe hacerla saltar.
// Cuando una de estas falla, se corrige el código, nunca el comentario.

import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import { cargarNormas } from '@/lib/nie/nkb/cargador';
import { contextoVacio, resolver } from '@/lib/nie/resolucion';

const RAIZ = join(process.cwd(), 'src', 'lib', 'nie');

/** Ficheros del motor. Excluye el adaptador `nkb/`, que sí toca ficheros. */
const MOTOR = readdirSync(RAIZ)
  .filter((f) => f.endsWith('.ts'))
  .map((f) => [f, readFileSync(join(RAIZ, f), 'utf-8')] as const);

/**
 * La capa de conversión de NIE-1.5. Es el **único** sitio del proyecto donde
 * puede haber un factor de conversión, y por eso queda fuera de las
 * prohibiciones que persiguen precisamente eso. Todo lo demás —pureza,
 * determinismo, ausencia de E/S— se le aplica igual.
 */
const CAPA_CONVERSION = ['conversiones.ts', 'conversion-unidad.ts'];

/**
 * El motor de resolución e interpretación: sin la capa de conversión y sin el
 * barril de exportación, que reexporta esa capa y no contiene lógica alguna.
 * Que no la contiene se comprueba aparte, más abajo.
 */
const MOTOR_SIN_CONVERSION = MOTOR.filter(
  ([f]) => !CAPA_CONVERSION.includes(f) && f !== 'index.ts',
);

/**
 * La capa de composición de NIE-1.6. Es el único módulo del motor autorizado a
 * llamar a la capa de conversión, y solo cuando quien lo invoca lo pide. La
 * dispensa se limita a eso: el resto de prohibiciones —calcular percentiles,
 * interpolar, extrapolar, puntuar— se le siguen aplicando abajo, y que la
 * conversión no se dispare sola se comprueba aparte.
 */
const CAPA_COMPOSICION = 'comparacion-normativa.ts';

/** Retira comentarios de bloque y de línea. */
function sinComentarios(src: string): string {
  return src.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');
}

describe('pureza del motor', () => {
  it('inspecciona los trece ficheros del motor', () => {
    // Sin esto, si la ruta cambiara, todo lo demás pasaría por vacío.
    expect(MOTOR.map(([f]) => f).sort()).toEqual([
      'aplicabilidad.ts',
      'comparacion-normativa.ts',
      'comparacion.ts',
      'conversion-unidad.ts',
      'conversiones.ts',
      'dimensiones.ts',
      'estadistica.ts',
      'index.ts',
      'operaciones.ts',
      'resolucion.ts',
      'salida.ts',
      'tipos.ts',
      'valor-observado.ts',
    ]);
  });

  it('la capa de conversión son exactamente dos ficheros', () => {
    // Si apareciera un tercero, las prohibiciones dejarían de cubrirlo.
    expect(MOTOR.map(([f]) => f).filter((f) => CAPA_CONVERSION.includes(f)).sort()).toEqual(
      [...CAPA_CONVERSION].sort(),
    );
  });

  it.each(MOTOR)('%s no tiene efectos ni fuentes de no determinismo', (_f, src) => {
    const codigo = sinComentarios(src);
    for (const [nombre, patron] of [
      ['Date.now', /Date\.now/],
      ['new Date', /new Date\(/],
      ['Math.random', /Math\.random/],
      ['fetch', /\bfetch\(/],
      ['console', /\bconsole\./],
      ['node:fs', /node:fs/],
      ['Supabase', /supabase/i],
      ['process.env', /process\.env/],
    ] as const) {
      expect(codigo, nombre).not.toMatch(patron);
    }
  });

  it('el motor no importa el adaptador que lee ficheros', () => {
    for (const [f, src] of MOTOR) {
      expect(sinComentarios(src), f).not.toMatch(/from '\.\/nkb\//);
    }
  });
});

describe('prohibiciones del sprint NIE-1.1 + NIE-1.2', () => {
  it.each(MOTOR_SIN_CONVERSION)('%s no calcula posición normativa', (_f, src) => {
    const codigo = sinComentarios(src);
    for (const [nombre, patron] of [
      ['percentil calculado', /\bpercentil\w*\s*[=(]/i],
      ['z-score', /zScore|z_score/i],
      ['T-score', /tScore|t_score/i],
      ['interpolación', /interpolar|interpolacion/i],
      ['extrapolación', /extrapolar|extrapolacion/i],
      ['puntuación compuesta', /score|puntaje|ranking/i],
    ] as const) {
      expect(codigo, nombre).not.toMatch(patron);
    }
  });

  it.each(MOTOR_SIN_CONVERSION.filter(([f]) => f !== CAPA_COMPOSICION))(
    '%s no convierte unidades',
    (_f, src) => {
      expect(sinComentarios(src)).not.toMatch(/convertir\w*\s*\(|factorConversion/i);
    },
  );

  it('la capa de composición solo convierte bajo petición explícita', () => {
    const codigo = sinComentarios(MOTOR.find(([f]) => f === CAPA_COMPOSICION)![1]);
    // Una sola llamada, y protegida por la opción que la autoriza.
    expect(codigo.match(/\bconvertir\(/g) ?? []).toHaveLength(1);
    // Y la guarda que la autoriza está delante de ella, alimentada por la opción.
    expect(codigo).toMatch(/if \(!convertirSiSePuede\)[\s\S]{0,600}?\bconvertir\(/);
    expect(codigo).toMatch(/opciones\.convertirUnidad === true/);
    // Sin conversión implícita en ningún otro punto.
    expect(codigo).not.toMatch(/autoConvert|conversionAutomatica/i);
  });

  it('no ordena las candidatas', () => {
    const codigo = MOTOR.map(([, s]) => sinComentarios(s)).join('\n');
    // La regla real es «no ordenar candidatas para decidir cuál gana». Un orden
    // de presentación que venga de la NKB sería admisible, pero hoy no hace
    // falta ninguno: el motor conserva el orden que recibe. Mientras eso siga
    // siendo cierto, la prohibición total es la más barata de mantener y la más
    // difícil de eludir. Si algún día hiciera falta ordenar para presentar, esta
    // comprobación debe acotarse, no borrarse.
    expect(codigo).not.toMatch(/\.sort\(/);
  });

  it('no toma la primera de una lista de normas', () => {
    // Un `[0]` no es en sí una infracción: `distintos[0]` sobre un conjunto de
    // estados unánime no elige nada. Lo que nunca es admisible es indexar una
    // lista de **normas**, porque ahí el índice sí decide. Por eso se prohíben
    // los nombres de esas listas, no el operador.
    const LISTAS = /\b(candidatas|resultados|comparables|comparadas|utilizables|normas)\s*\[\s*0\s*\]/;
    for (const [f, src] of MOTOR) {
      expect(sinComentarios(src), f).not.toMatch(LISTAS);
    }
    // Control positivo: la comprobación sabe encontrar lo que busca. Sin esto,
    // una expresión regular rota la haría pasar siempre (hallazgo H-02).
    expect('const x = candidatas[0];').toMatch(LISTAS);
  });

  it('ningún campo de la salida nombra una norma ganadora', () => {
    const codigo = MOTOR.map(([, s]) => sinComentarios(s)).join('\n');
    const GANADORA = /\b(mejorNorma|normaElegida|resultadoFinal|resultadoPromedio|seleccionada|ganadora)\b/i;
    expect(codigo).not.toMatch(GANADORA);
    expect('mejorNorma: x').toMatch(GANADORA);
  });

  it('index.ts es solo un barril: no contiene lógica', () => {
    const codigo = sinComentarios(MOTOR.find(([f]) => f === 'index.ts')![1]);
    // Sin sentencias ejecutables: solo export/import y sus llaves.
    for (const [nombre, patron] of [
      ['función', /\bfunction\b|=>/],
      ['condicional', /\bif\b|\bswitch\b/],
      ['bucle', /\bfor\b|\bwhile\b/],
      ['asignación', /^\s*(const|let|var)\s/m],
    ] as const) {
      expect(codigo, nombre).not.toMatch(patron);
    }
  });

  it('el contexto de evaluación no admite el valor medido', () => {
    const claves = Object.keys(contextoVacio());
    for (const prohibida of ['valor', 'medicion', 'resultado', 'puntuacion']) {
      expect(claves, prohibida).not.toContain(prohibida);
    }
  });
});

describe('el motor no elige por conveniencia', () => {
  const NORMAS = cargarNormas();
  const base = {
    ...contextoVacio(),
    variable: 'fuerza_prension_manual' as const,
    pais: 'CO' as const,
    instrumento: 'takei-t18-tkk-smedley-iii' as const,
    unidad: 'kg' as const,
    definicionOperacional: 'media_ambas_manos' as const,
    posicion: 'bipedestacion' as const,
    lado: 'ambas' as const,
    edad: 22,
    sexo: 'M' as const,
  };

  it('devuelve todas las candidatas de la variable, incluidas las no aplicables', () => {
    const r = resolver(base, NORMAS);
    expect(r.candidatas).toHaveLength(356);
    expect(r.resumen.NO_APLICABLE).toBeGreaterThan(0);
  });

  it('el recuento del resumen cuadra con las candidatas', () => {
    const r = resolver(base, NORMAS);
    const suma = Object.values(r.resumen).reduce((a, b) => a + b, 0);
    expect(suma).toBe(r.candidatas.length);
  });

  it('conserva el orden de la NKB y no lo reordena por calidad', () => {
    const r = resolver(base, NORMAS);
    expect(r.candidatas.map((c) => c.normaId)).toEqual(NORMAS.map((n) => n.id));
  });

  it('no rescata por proximidad geográfica cuando el país no coincide', () => {
    const r = resolver({ ...base, pais: 'CL' }, NORMAS);
    // Chile no tiene norma de adulto: la colombiana no debe cubrirle por región.
    const utilizables = r.candidatas.filter((c) =>
      ['APLICABLE', 'APLICABLE_CON_RESERVAS'].includes(c.aplicabilidad),
    );
    expect(utilizables).toHaveLength(0);
    expect(r.estadoGlobal).toBe('SIN_NORMA_ADMISIBLE');
  });

  it('no une dos normas contiguas para fabricar un rango continuo', () => {
    // 30 años: universitarios llega a 29 y Cúcuta cubre 30–39 con otro método.
    const r = resolver({ ...base, edad: 30 }, NORMAS);
    const uni = r.candidatas.filter((c) => c.fichaId.startsWith('HGS-CO-UNI'));
    expect(uni.every((c) => c.aplicabilidad === 'NO_APLICABLE')).toBe(true);
    expect(uni.every((c) => c.discrepancias.includes('edad'))).toBe(true);
  });
});

describe('auditoría de vocabulario · motor frente a fuentes', () => {
  const NORMAS = cargarNormas();
  const r = resolver(
    {
      ...contextoVacio(),
      variable: 'fuerza_prension_manual',
      pais: 'CO',
      instrumento: 'camry-digital',
      unidad: 'kg',
      definicionOperacional: 'mejor_mano_dominante',
      posicion: 'bipedestacion',
      lado: 'dominante',
      edad: 45,
      sexo: 'M',
    },
    NORMAS,
  );

  /** Texto que redacta el motor. Es lo único de lo que responde. */
  const DEL_MOTOR = [
    r.estadoGlobal,
    ...r.advertencias,
    ...r.candidatas.flatMap((c) => [
      c.aplicabilidad,
      ...c.motivosReserva,
      ...c.dimensiones.map((d) => d.motivo),
    ]),
  ].join(' ');

  /** Texto que aportan las fichas. El motor lo transporta, no lo escribe. */
  const DE_LAS_FUENTES = r.candidatas
    .flatMap((c) => [...c.restricciones, ...c.limitaciones, ...c.advertencias])
    .join(' ');

  const CLASIFICACION = [
    'normal',
    'anormal',
    'bajo',
    'alto',
    'deficiente',
    'insuficiente',
    'riesgo',
    'adecuado',
    'malo',
    'bueno',
  ];

  it.each(CLASIFICACION)('el motor no emite juicio: «%s»', (palabra) => {
    // Se busca la palabra afirmada. Una prohibición explícita —«el mejor
    // intento y el promedio no son equivalentes»— no es un juicio sobre nadie.
    const afirmada = new RegExp(`(?<!no\\s)(?<!ni\\s)\\b${palabra}\\b`, 'i');
    const sinNegaciones = DEL_MOTOR.replace(/\bno (es|son|dice|significa)\b[^.]*/gi, '');
    expect(sinNegaciones, palabra).not.toMatch(afirmada);
  });

  it('las fuentes sí pueden usar ese vocabulario, y se conserva intacto', () => {
    // La ficha de Cúcuta menciona las categorías que la NKB rechazó (RN-04).
    // Que el motor las transporte sin tocarlas es lo correcto.
    expect(DE_LAS_FUENTES).toContain('excelente');
    for (const c of r.candidatas) {
      const enNkb = NORMAS.find((n) => n.id === c.normaId)!;
      expect(c.advertencias, c.normaId).toEqual(enNkb.advertencias);
      expect(c.limitaciones, c.normaId).toEqual(enNkb.limitaciones);
    }
  });
});

describe('no hay valores normativos codificados en el motor', () => {
  it('ningún fichero del motor contiene una tabla de valores', () => {
    for (const [f, src] of MOTOR_SIN_CONVERSION) {
      const codigo = sinComentarios(src);
      // Un valor normativo sería un decimal suelto en el código del motor.
      const decimales = codigo.match(/\b\d+\.\d+\b/g) ?? [];
      expect(decimales, `${f} contiene decimales: ${decimales.join(', ')}`).toHaveLength(0);
    }
  });

  it('los únicos decimales de la capa de conversión son factores declarados', () => {
    // La excepción es acotada: los números que contiene son constantes de
    // definición de unidades, no valores normativos. Se comprueba uno a uno.
    const PERMITIDOS = new Set(['0.45359237', '9.80665']);
    for (const f of CAPA_CONVERSION) {
      const src = MOTOR.find(([n]) => n === f)![1];
      for (const d of sinComentarios(src).match(/\b\d+\.\d+\b/g) ?? []) {
        expect(PERMITIDOS, `${f} contiene ${d}`).toContain(d);
      }
    }
  });
});

describe('determinismo', () => {
  const NORMAS = cargarNormas();
  it('dos resoluciones del mismo contexto son idénticas', () => {
    const c = { ...contextoVacio(), variable: 'fuerza_prension_manual' as const, edad: 20 };
    expect(JSON.stringify(resolver(c, NORMAS))).toBe(JSON.stringify(resolver(c, NORMAS)));
  });
});
