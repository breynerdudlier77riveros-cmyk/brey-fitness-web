// ── Hallazgos (Sprint I-03) ────────────────────────────────────────────────
// Un hallazgo es un hecho verificable sobre el dato, nunca un juicio de
// valor. La regla que gobierna todo este archivo: "aumentó" no significa
// "mejoró" y "disminuyó" no significa "empeoró" — el BCS no conoce el
// objetivo del cliente (BCS Handbook 05, límite explícito), así que solo el
// subconjunto de variables con dirección de mejora documentada puede
// mencionar siquiera la palabra, y aun ahí como default de producto.
//
// Los hallazgos se construyen a partir de la comparación, las tendencias y
// las incidencias de calidad ya calculadas — nunca releyendo las Mediciones.

import { CATALOGO, type VariableId } from '@/lib/bcs/reporte';
import type { Incidencia } from './calidad';
import type {
  CategoriaHallazgo,
  ComparacionMetrica,
  Hallazgo,
  Suficiencia,
  TendenciaMetrica,
} from './tipos';

/**
 * Variables que participan de la narrativa del reporte, con la categoría de
 * hallazgo a la que pertenecen. Las otras 15 del catálogo siguen presentes
 * en `comparacion` y `tendencias` del DTO, pero no generan hallazgo propio:
 * emitir 22 hallazgos por análisis convertiría la sección en ruido y ninguna
 * fuente pide narrar la impedancia o la edad metabólica.
 */
const CATEGORIA_POR_VARIABLE: Partial<Record<VariableId, CategoriaHallazgo>> = {
  peso_kg: 'cambio_de_peso',
  grasa_pct: 'cambio_de_grasa',
  masa_grasa_kg: 'cambio_de_grasa',
  masa_muscular_kg: 'cambio_de_masa_muscular',
  masa_libre_grasa_kg: 'cambio_de_masa_muscular',
  agua_total_l: 'cambio_de_agua',
  imc: 'composicion',
};

function formatearValor(valor: number, unidad: string): string {
  return `${valor.toFixed(1)}${unidad ? ` ${unidad}` : ''}`;
}

/** Hallazgos de cambio y de estabilidad, desde la comparación entre dos mediciones. */
function desdeComparacion(comparacion: readonly ComparacionMetrica[]): Hallazgo[] {
  const hallazgos: Hallazgo[] = [];

  for (const fila of comparacion) {
    const categoria = CATEGORIA_POR_VARIABLE[fila.variable];
    if (!categoria) continue;
    if (fila.disponibilidad !== 'comparable') continue;
    if (fila.deltaAbsoluto === null || fila.valorAnterior === null || fila.valorActual === null) continue;

    const def = CATALOGO[fila.variable];
    const magnitud = formatearValor(Math.abs(fila.deltaAbsoluto), fila.unidad);
    const desde = formatearValor(fila.valorAnterior, fila.unidad);
    const hasta = formatearValor(fila.valorActual, fila.unidad);

    if (fila.direccion === 'estable') {
      hallazgos.push({
        id: `estabilidad:${fila.variable}`,
        categoria: 'estabilidad',
        severidad: 'informativo',
        titulo: `${def.etiqueta} se mantuvo`,
        descripcion:
          fila.significancia === 'insignificante' && fila.umbralAplicado !== null
            ? `${def.etiqueta} pasó de ${desde} a ${hasta}, una diferencia por debajo del umbral de ${fila.umbralAplicado} ${fila.unidad} definido para esta variable.`
            : `${def.etiqueta} registró el mismo valor en ambas mediciones (${hasta}).`,
        variables: [fila.variable],
        mediciones: [],
        procedencia: fila.procedencia,
        suficiencia: fila.significancia === 'no_definida' ? 'parcial' : 'suficiente',
        direccion: 'estable',
        explicacion: fila.razon,
      });
      continue;
    }

    if (fila.direccion === 'indeterminada') continue;

    const verbo = fila.direccion === 'aumento' ? 'aumentó' : 'disminuyó';
    const suficiencia: Suficiencia = fila.significancia === 'no_definida' ? 'parcial' : 'suficiente';

    hallazgos.push({
      id: `cambio:${fila.variable}`,
      categoria,
      severidad: 'informativo',
      titulo: `${def.etiqueta} ${verbo} ${magnitud}`,
      descripcion: `${def.etiqueta} pasó de ${desde} a ${hasta} entre las dos mediciones comparadas.${
        fila.significancia === 'no_definida'
          ? ' No existe un umbral definido para esta variable, así que no puede afirmarse si el cambio es relevante.'
          : ''
      }`,
      variables: [fila.variable],
      mediciones: [],
      procedencia: fila.procedencia,
      suficiencia,
      direccion: fila.direccion,
      explicacion: fila.razon,
    });
  }

  return hallazgos;
}

/** Hallazgos de tendencia — solo con 3+ puntos, donde la serie ya dice algo. */
function desdeTendencias(tendencias: readonly TendenciaMetrica[]): Hallazgo[] {
  const hallazgos: Hallazgo[] = [];

  for (const tendencia of tendencias) {
    const categoria = CATEGORIA_POR_VARIABLE[tendencia.variable];
    if (!categoria) continue;
    if (tendencia.suficiencia !== 'suficiente') continue;
    if (tendencia.estado !== 'ascendente' && tendencia.estado !== 'descendente') continue;

    const def = CATALOGO[tendencia.variable];
    const direccion = tendencia.estado === 'ascendente' ? 'al alza' : 'a la baja';

    hallazgos.push({
      id: `tendencia:${tendencia.variable}`,
      categoria,
      severidad: 'informativo',
      titulo: `${def.etiqueta}: serie ${direccion}`,
      descripcion: `A lo largo de ${tendencia.puntosUsados} mediciones, ${def.etiqueta.toLowerCase()} se movió consistentemente ${direccion}${
        tendencia.cambioNeto !== null
          ? ` (${tendencia.cambioNeto > 0 ? '+' : '−'}${formatearValor(Math.abs(tendencia.cambioNeto), tendencia.unidad)} en total)`
          : ''
      }. Describe lo ya registrado, no una proyección.`,
      variables: [tendencia.variable],
      mediciones: [],
      procedencia: def.procedencia,
      suficiencia: 'suficiente',
      direccion: tendencia.estado === 'ascendente' ? 'aumento' : 'disminucion',
      explicacion: tendencia.razon,
    });
  }

  return hallazgos;
}

/** Hallazgos de calidad — solo las incidencias de clase alerta. */
function desdeCalidad(incidencias: readonly Incidencia[]): Hallazgo[] {
  return incidencias
    .filter((incidencia) => incidencia.clase === 'alerta')
    .map((incidencia) => ({
      id: `calidad:${incidencia.id}`,
      categoria: 'calidad_de_dato' as CategoriaHallazgo,
      severidad: incidencia.severidad,
      titulo: incidencia.titulo,
      descripcion: incidencia.descripcion,
      variables: incidencia.variables,
      mediciones: incidencia.mediciones,
      procedencia: null,
      suficiencia: 'suficiente' as Suficiencia,
      explicacion: 'Regla de validación del catálogo de variables de composición corporal.',
    }));
}

export interface EntradaHallazgos {
  comparacion: readonly ComparacionMetrica[];
  tendencias: readonly TendenciaMetrica[];
  incidencias: readonly Incidencia[];
  cantidadMediciones: number;
}

export function construirHallazgos({
  comparacion,
  tendencias,
  incidencias,
  cantidadMediciones,
}: EntradaHallazgos): Hallazgo[] {
  if (cantidadMediciones === 0) {
    return [
      {
        id: 'datos_insuficientes:sin_mediciones',
        categoria: 'datos_insuficientes',
        severidad: 'informativo',
        titulo: 'Sin mediciones registradas',
        descripcion: 'Todavía no hay ninguna medición sobre la que hacer un análisis.',
        variables: [],
        mediciones: [],
        procedencia: null,
        suficiencia: 'sin_datos',
        explicacion: 'El análisis necesita al menos una medición registrada.',
      },
    ];
  }

  const hallazgos: Hallazgo[] = [];

  if (cantidadMediciones === 1) {
    hallazgos.push({
      id: 'datos_insuficientes:una_medicion',
      categoria: 'datos_insuficientes',
      severidad: 'informativo',
      titulo: 'Una sola medición registrada',
      descripcion:
        'Con una única medición se describe el estado actual, pero no hay evolución que analizar. La comparación y las tendencias aparecen a partir de la segunda.',
      variables: [],
      mediciones: [],
      procedencia: null,
      suficiencia: 'insuficiente',
      explicacion: 'Se necesitan al menos 2 mediciones vigentes para comparar.',
    });
  }

  hallazgos.push(...desdeComparacion(comparacion));
  hallazgos.push(...desdeTendencias(tendencias));
  hallazgos.push(...desdeCalidad(incidencias));

  // Un id repetido significaría dos reglas describiendo lo mismo — se
  // conserva la primera, que es la de mayor prioridad por orden de armado.
  const vistos = new Set<string>();
  return hallazgos.filter((hallazgo) => {
    if (vistos.has(hallazgo.id)) return false;
    vistos.add(hallazgo.id);
    return true;
  });
}
