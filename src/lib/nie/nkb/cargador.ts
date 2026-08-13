// ── Adaptador NKB → NIE · cargador de fichas ───────────────────────────────
//
// Lee las fichas de `docs/normative-knowledge-base/fichas/` y produce las
// normas que el motor consume. **Las fichas siguen siendo la única fuente**:
// aquí no se almacena ningún valor normativo, solo se leen los estratos.
//
// Este módulo NO es puro: toca el sistema de ficheros. Por eso vive aparte del
// motor, que sí lo es y recibe las normas ya cargadas. La frontera es la misma
// que separa repositorio y dominio en el resto del proyecto.

import { readFileSync, readdirSync } from 'node:fs';
import { join } from 'node:path';

import type {
  EstadoNorma,
  NormaNKB,
  ParametrosModelo,
  PercentilPublicado,
  RangoEtario,
  Sexo,
  ValoresNormativos,
} from '../tipos';
import { COORDENADAS, type CoordenadasFicha } from './coordenadas';

/** Ruta por defecto de las fichas, relativa a la raíz del repositorio. */
export const RUTA_FICHAS = join('docs', 'normative-knowledge-base', 'fichas');

/** Marca de norma cuestionada dentro de una ficha por lo demás activa. */
const MARCA_ES2 = '⚠';

/**
 * Interpreta la celda de edad de una fila.
 *
 * Cuatro formas conviven en las fichas y ninguna se normaliza en el documento:
 *   `65`          → 65–65   (Brasil, edad año a año)
 *   `18`          → 18–18   (Colombia universitarios)
 *   `6,0–6,9`     → 6–6     (Colombia escolares y Chile)
 *   `10–19`       → 10–19   (Cúcuta, décadas)
 *   `17–19`       → 17–19   (Alemania, grupos)
 *
 * Devuelve `null` si la celda no encaja en ninguna: se prefiere descartar la
 * fila y que el recuento falle a inventar un rango.
 */
export function interpretarEdad(celda: string): RangoEtario | null {
  const t = celda.replace(/\s/g, '');

  // `6,0–6,9` — decimal: el rango cubre el año entero
  const decimal = t.match(/^(\d+),\d+[–-](\d+),\d+$/);
  if (decimal) return { min: Number(decimal[1]), max: Number(decimal[2]) };

  // `10–19` — entero
  const rango = t.match(/^(\d+)[–-](\d+)$/);
  if (rango) return { min: Number(rango[1]), max: Number(rango[2]) };

  // `65` — edad única
  const unico = t.match(/^(\d+)$/);
  if (unico) return { min: Number(unico[1]), max: Number(unico[1]) };

  return null;
}

/**
 * Deduce el sexo de una fila.
 *
 * Las fichas lo expresan de tres maneras: en el id (`-M-`, `-F-`), en una
 * columna propia (Alemania) o mediante el encabezado de sección que precede a
 * la tabla (`### Varones`). Brasil no lo pone en la fila porque la ficha entera
 * es de un sexo, y ahí se toma del estrato declarado.
 */
function deducirSexo(
  id: string,
  celdas: readonly string[],
  seccion: Sexo | null,
  porDefecto: Sexo | null,
): Sexo | null {
  if (/-M-/.test(id)) return 'M';
  if (/-F-/.test(id)) return 'F';
  const columna = celdas.find((c) => /^(Varones|Mujeres)$/.test(c.trim()));
  if (columna) return columna.trim() === 'Varones' ? 'M' : 'F';
  return seccion ?? porDefecto;
}

/** Sexo implícito de las fichas brasileñas, que no lo repiten por fila. */
function sexoDelEstrato(fichaId: string): Sexo | null {
  if (/^HGS-BR-TN1(-M\d+)?$/.test(fichaId)) return 'M';
  if (/^HGS-BR-TN1-F\d+$/.test(fichaId)) return 'F';
  return null;
}

function describirEstrato(sexo: Sexo, edad: RangoEtario, c: CoordenadasFicha): string {
  const s = sexo === 'M' ? 'Varones' : 'Mujeres';
  const e = edad.min === edad.max ? `${edad.min} años` : `${edad.min}–${edad.max} años`;
  if (!c.estatura) return `${s} · ${e}`;
  const { minExclusivo: lo, maxInclusivo: hi } = c.estatura;
  const alt =
    lo !== null && hi !== null ? `> ${lo} y ≤ ${hi} m`
      : lo !== null ? `> ${lo} m`
        : `≤ ${hi} m`;
  return `${s} · ${e} · estatura ${alt}`;
}

/**
 * Interpreta un número tal como lo escribe la ficha.
 *
 * Coma decimal, separador de millar en espacio fino y signo menos tipográfico
 * (U+2212) en los parámetros L de las fichas chilenas.
 */
export function interpretarNumero(celda: string): number | null {
  const t = celda
    .replace(/[\s  ]/g, '')
    .replace(/−/g, '-')
    .replace(',', '.');
  if (!/^-?\d+(\.\d+)?$/.test(t)) return null;
  return Number(t);
}

/**
 * Interpreta la cabecera de una columna.
 *
 * Las tablas de la NKB se describen a sí mismas: `P50`, `2,5`, `Media (kg)`,
 * `DT`, `n`… Leer la cabecera en vez de fijar posiciones evita codificar en el
 * motor la forma de cada ficha, y hace que una columna nueva se recoja sola.
 */
type Columna =
  | { clase: 'id' }
  | { clase: 'edad' }
  | { clase: 'sexo' }
  | { clase: 'n' }
  | { clase: 'percentil'; percentil: number }
  | { clase: 'media' }
  | { clase: 'dt' }
  | { clase: 'modelo'; parametro: 'L' | 'M' | 'S' }
  | { clase: 'otra' };

export function interpretarCabecera(titulo: string): Columna {
  const t = titulo.replace(/\*\*/g, '').trim();
  if (/^Id$/i.test(t)) return { clase: 'id' };
  if (/^(Edad|Década)$/i.test(t)) return { clase: 'edad' };
  if (/^Sexo$/i.test(t)) return { clase: 'sexo' };
  if (/^n$/i.test(t)) return { clase: 'n' };
  if (/^Media(\s*\(.+\))?$/i.test(t)) return { clase: 'media' };
  if (/^DT$/i.test(t)) return { clase: 'dt' };
  if (/^[LMS]$/.test(t)) return { clase: 'modelo', parametro: t as 'L' | 'M' | 'S' };

  // `P50`, `P2,5`, `P50 (kg)` y también el `2,5` a secas de la ficha brasileña.
  const pct = t.match(/^P?(\d+(?:,\d+)?)(?:\s*\(.+\))?$/);
  if (pct) {
    const n = interpretarNumero(pct[1]);
    if (n !== null) return { clase: 'percentil', percentil: n };
  }
  return { clase: 'otra' };
}

/** Localiza la cabecera de la tabla de valores dentro de la ficha. */
function cabeceraDe(lineas: readonly string[], indiceFila: number): string | null {
  for (let i = indiceFila - 1; i >= 0 && i > indiceFila - 40; i--) {
    if (/^\|\s*Id\s*\|/i.test(lineas[i])) return lineas[i];
  }
  return null;
}

/** Extrae las normas de una ficha ya leída. */
export function normasDeFicha(texto: string, c: CoordenadasFicha): NormaNKB[] {
  const estadoFicha: EstadoNorma = /^estado:\s*ES-2/m.test(texto) ? 'ES-2' : 'ES-1';
  const porDefecto = sexoDelEstrato(c.fichaId);

  const normas: NormaNKB[] = [];
  let seccion: Sexo | null = null;

  const lineas = texto.split('\n');
  for (let i = 0; i < lineas.length; i++) {
    const linea = lineas[i];
    if (/^###\s+Varones/.test(linea)) seccion = 'M';
    else if (/^###\s+Mujeres/.test(linea)) seccion = 'F';

    const fila = linea.match(/^\|\s*(HGS-[A-Z0-9-]+)\s*(⚠?)\s*\|(.+)\|\s*$/);
    if (!fila) continue;

    const [, id, marca, resto] = fila;
    const celdas = [id, ...resto.split('|').map((x) => x.trim())];
    const edad = interpretarEdad(celdas[1] ?? '');
    const sexo = deducirSexo(id, celdas, seccion, porDefecto);
    if (!edad || !sexo) continue;

    // La cabecera dice qué contiene cada columna. Leerla, en vez de fijar
    // posiciones, evita codificar en el motor la forma concreta de cada ficha.
    const cabecera = cabeceraDe(lineas, i);
    if (!cabecera) {
      throw new Error(
        `NIE: la fila ${id} de ${c.fichero} no tiene cabecera de tabla que la describa. ` +
          'El adaptador no adivina qué contiene cada columna.',
      );
    }
    const columnas = cabecera
      .replace(/^\s*\||\|\s*$/g, '')
      .split('|')
      .map((x) => interpretarCabecera(x));

    let nCelda: number | null = null;
    let media: number | null = null;
    let dt: number | null = null;
    const percentiles: PercentilPublicado[] = [];
    const modelo: Partial<ParametrosModelo> = {};

    for (let k = 0; k < columnas.length && k < celdas.length; k++) {
      const col = columnas[k];
      const valor = interpretarNumero(celdas[k]);
      if (valor === null) continue;
      // N por celda: solo si la fuente lo publica. Nunca se estima (`16`).
      if (col.clase === 'n' && c.publicaNPorCelda) nCelda = valor;
      else if (col.clase === 'media') media = valor;
      else if (col.clase === 'dt') dt = valor;
      else if (col.clase === 'percentil') percentiles.push({ percentil: col.percentil, valor });
      else if (col.clase === 'modelo') modelo[col.parametro] = valor;
    }

    let valores: ValoresNormativos;
    if (media !== null && dt !== null) {
      valores = { tipo: 'media_dispersion', media, desviacionTipica: dt };
    } else if (percentiles.length > 0) {
      valores = { tipo: 'percentiles', percentiles };
    } else {
      throw new Error(
        `NIE: la fila ${id} de ${c.fichero} no aporta ni percentiles ni media con dispersión. ` +
          'Una norma sin estadísticos no se carga a medias.',
      );
    }

    normas.push({
      valores,
      parametrosModelo:
        modelo.L !== undefined && modelo.M !== undefined && modelo.S !== undefined
          ? { L: modelo.L, M: modelo.M, S: modelo.S }
          : null,
      tabla: cabecera.trim(),
      id,
      fichaId: c.fichaId,
      variable: c.variable,
      pais: c.pais,
      poblacion: c.paisCN04,
      instrumento: c.instrumento,
      definicionOperacional: c.definicionOperacional,
      posicion: c.posicion,
      lado: c.lado,
      unidad: c.unidad,
      tipo: c.tipo,
      edad,
      sexo,
      estatura: c.estatura,
      // Una norma marcada ⚠ está cuestionada aunque su ficha esté activa.
      estado: marca === MARCA_ES2 ? 'ES-2' : estadoFicha,
      calidad: c.calidad,
      dimensionesDegradantes: c.dimensionesDegradantes,
      nCelda,
      valoresProyectados: c.valoresProyectados,
      referencia: (texto.match(/^referencia:\s*(\S+)/m) ?? [])[1] ?? '',
      fichero: c.fichero,
      alcance: describirEstrato(sexo, edad, c),
      restricciones: c.restricciones,
      limitaciones: c.limitaciones,
      advertencias: c.advertencias,
      conflicto: c.conflicto,
    });
  }

  return normas;
}

/** Carga las 356 normas leyendo las 15 fichas de la NKB. */
export function cargarNormas(raiz = process.cwd(), rutaFichas = RUTA_FICHAS): NormaNKB[] {
  const dir = join(raiz, rutaFichas);
  const ficheros = new Set(readdirSync(dir).filter((f) => f.endsWith('.md')));

  const normas: NormaNKB[] = [];
  for (const c of COORDENADAS) {
    if (!ficheros.has(c.fichero)) {
      throw new Error(
        `NIE: la ficha ${c.fichero} está declarada en coordenadas.ts y no existe en ${rutaFichas}. ` +
          'El adaptador no inventa normas: corrige la declaración o restaura la ficha.',
      );
    }
    normas.push(...normasDeFicha(readFileSync(join(dir, c.fichero), 'utf-8'), c));
  }
  return normas;
}
