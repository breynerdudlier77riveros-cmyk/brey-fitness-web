// ── Contrato de BREY AI (Sprint PAS-8) ─────────────────────────────────────
//
// CONTRATO, NO IMPLEMENTACIÓN. PAS-8 no llama a ningún modelo: define qué se le
// entregaría y qué se le aceptaría de vuelta. La llamada real es de PAS-11.
//
// LA REGLA QUE ORDENA TODO EL FICHERO:
//
//   La IA recibe datos ya calculados y devuelve lenguaje. No calcula ciencia.
//
// Por qué esto importa tanto aquí: un modelo de lenguaje es extraordinariamente
// bueno produciendo una frase que suena a conclusión científica. Si se le
// entregaran percentiles crudos y una media, produciría «estás en el percentil
// 93» sin que nadie lo haya publicado — interpolando, que es exactamente lo que
// la NKB prohíbe desde su primer módulo. La defensa no es pedirle que no lo
// haga: es no darle nunca los ingredientes para hacerlo.
//
// Por eso `EntradaBreyAI` transporta LECTURAS YA REDACTADAS —«entre P90 y P97»,
// «z = +1,25»— y nunca los percentiles publicados ni la media y la desviación.
// Con eso puede explicar, comparar y ordenar prioridades. No puede derivar una
// posición normativa nueva porque no tiene con qué.

import { metaDe } from './objetivos';
import type { InformeHumano, ResultadoHumano } from './tipos';

/**
 * Lo que se le entrega al modelo.
 *
 * Deliberadamente empobrecido respecto al informe completo: sin `detalles`
 * técnicos, sin valores publicados, sin media ni desviación. Todo lo que se
 * omite es algo con lo que podría fabricarse una afirmación normativa.
 */
export interface EntradaBreyAI {
  atleta: { edad: number | null; sexo: string | null };
  fecha: string;
  resultados: readonly {
    nombre: string;
    dominio: string | null;
    valor: number;
    unidad: string;
    /** La lectura ya redactada. Nunca los percentiles con los que se hizo. */
    referencia: string | null;
    /** Cómo cambió respecto a sí mismo. */
    cambio: { anterior: number; actual: number; diferencia: number } | null;
    /** El objetivo declarado, si lo hay. */
    /**
     * `meta` va ya redactada («140 kg», «entre 63 y 67 kg») en vez de como
     * número: un objetivo de mantenimiento no tiene un valor único, y obligar
     * al modelo a reconstruir la frase desde un par de extremos es pedirle que
     * decida cuál de los dos es «la meta». `null` cuando el objetivo no
     * declara ninguna.
     */
    objetivo: { nombre: string; actual: number; meta: string | null; unidad: string } | null;
  }[];
  /** Objetivos sin medición en esta evaluación. También son contexto. */
  objetivosSinMedicion: readonly { nombre: string; meta: string | null; unidad: string }[];
}

/**
 * Lo que se le acepta de vuelta.
 *
 * Solo texto. Ningún campo numérico, ninguna categoría, ningún identificador de
 * norma: si el modelo devolviera un percentil, no habría dónde ponerlo, y esa
 * es la intención. El contrato es la primera línea de defensa.
 */
export interface AnalisisBreyAI {
  /** Dos o tres frases sobre el conjunto. */
  resumen: string;
  /** Lo que el propio atleta ha mejorado o sostiene. Nunca «eres fuerte». */
  fortalezas: readonly string[];
  /** Dónde mirar, en términos de qué medir o repetir. No qué entrenar. */
  oportunidades: readonly string[];
  /** Relación con los objetivos declarados. */
  objetivos: readonly string[];
  /** Lo que NO puede afirmarse, y por qué. La parte más importante. */
  advertencias: readonly string[];
}

/**
 * Vocabulario que una respuesta de la IA jamás puede contener.
 *
 * Es la misma lista que rige el motor y el informe, y está aquí para que PAS-11
 * la aplique a la salida del modelo antes de mostrarla. Una IA que devuelva
 * «tu resultado es bajo» ha clasificado, y clasificar exige una norma que lo
 * autorice — ninguna de la NKB lo hace hoy (`41`).
 */
export const VOCABULARIO_PROHIBIDO_IA: readonly string[] = [
  'bajo',
  'alto',
  'normal',
  'anormal',
  'deficiente',
  'insuficiente',
  'excelente',
  'óptimo',
  'malo',
  'bueno',
  'apto',
  'riesgo',
  'diagnóstico',
  'patología',
  'lesión',
];

/**
 * Prepara la entrada para el modelo desde el informe humano.
 *
 * Es una PROYECCIÓN que quita información, no que la añade. Nada de lo que
 * sale de aquí permite reconstruir los valores publicados de una norma.
 */
export function prepararEntradaIA(informe: InformeHumano): EntradaBreyAI {
  const conMedicion = new Set(informe.resultados.map((r) => r.pruebaId));

  return {
    atleta: { edad: informe.atleta.edad, sexo: informe.atleta.sexo },
    fecha: informe.fecha,
    resultados: informe.resultados.map((r: ResultadoHumano) => ({
      nombre: r.nombre,
      dominio: r.dominio,
      valor: r.valorObservado,
      unidad: r.unidad,
      referencia: r.referencia.resumen,
      cambio:
        r.tendencia.disponible && r.tendencia.valorAnterior !== null
          ? {
              anterior: r.tendencia.valorAnterior,
              actual: r.tendencia.valorActual,
              diferencia: r.tendencia.cambioAbsoluto ?? 0,
            }
          : null,
      objetivo:
        r.objetivo.disponible && r.objetivo.objetivo
          ? {
              nombre: r.objetivo.objetivo.nombre,
              actual: r.valorObservado,
              meta: metaDe(r.objetivo.objetivo),
              unidad: r.objetivo.objetivo.unidad,
            }
          : null,
    })),
    objetivosSinMedicion: informe.objetivos
      .filter((o) => !conMedicion.has(o.pruebaId))
      .map((o) => ({ nombre: o.nombre, meta: metaDe(o), unidad: o.unidad })),
  };
}

/**
 * Términos prohibidos presentes en una respuesta del modelo.
 *
 * Se descuentan las negaciones: «no puede afirmarse que sea alto» es una
 * advertencia correcta, no una clasificación. Es la misma lección que costó
 * cinco hallazgos en los sprints anteriores.
 */
export function terminosProhibidosIA(texto: string): string[] {
  const afirmado = texto.replace(/\bno\s+\w+[^.]*/gi, '');
  return VOCABULARIO_PROHIBIDO_IA.filter((t) =>
    new RegExp(`(?<![-\\w])${t}(?![-\\w])`, 'i').test(afirmado),
  );
}
