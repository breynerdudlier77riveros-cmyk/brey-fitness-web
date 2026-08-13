// ── NIE-1.1 + NIE-1.2 · orquestador ────────────────────────────────────────
//
// Dado un contexto de evaluación, localiza **todas** las normas de la NKB que
// podrían corresponder y determina el estado de aplicabilidad de cada una.
//
// Lo que este módulo NO hace, y no debe hacer nunca:
//   · elegir la mejor norma;
//   · ordenar por calidad, recencia, tamaño muestral o cercanía geográfica;
//   · resolver conflictos;
//   · convertir unidades;
//   · calcular percentiles, z, T ni posición normativa alguna;
//   · clasificar al sujeto.
//
// Módulo puro: recibe las normas ya cargadas y no toca el sistema de ficheros.

import { determinarAplicabilidad } from './aplicabilidad';
import { compararDimensiones } from './dimensiones';
import type {
  Candidata,
  ContextoEvaluacion,
  EstadoAplicabilidad,
  EstadoResolucion,
  NormaNKB,
  ResolucionNormativa,
} from './tipos';

const ESTADOS: readonly EstadoAplicabilidad[] = [
  'APLICABLE',
  'APLICABLE_CON_RESERVAS',
  'NO_APLICABLE',
  'NO_DETERMINABLE',
  'CONFLICTO',
  'CONFLICTO_NO_DETERMINABLE',
];

/** Contexto vacío. Todo `null` = nada consta; nada se asume. */
export function contextoVacio(): ContextoEvaluacion {
  return {
    variable: null,
    edad: null,
    sexo: null,
    pais: null,
    instrumento: null,
    unidad: null,
    definicionOperacional: null,
    posicion: null,
    lado: null,
    estaturaM: null,
    metadatos: {},
  };
}

function describirEstrato(n: NormaNKB): string {
  return n.alcance;
}

/**
 * Estado global de la resolución.
 *
 * `SIN_NORMA_ADMISIBLE` significa exactamente una cosa: **no existe una norma
 * admisible aplicable con la información disponible**. No significa que el
 * sujeto esté fuera de lo normal, ni por debajo, ni por encima de nada. La
 * ausencia de norma es una afirmación sobre la evidencia, no sobre la persona.
 */
function esUtilizable(c: Candidata): boolean {
  return c.aplicabilidad === 'APLICABLE' || c.aplicabilidad === 'APLICABLE_CON_RESERVAS';
}

function estadoGlobal(candidatas: readonly Candidata[]): EstadoResolucion {
  if (candidatas.length === 0) return 'SIN_NORMA_ADMISIBLE';

  const hay = (e: EstadoAplicabilidad) => candidatas.some((c) => c.aplicabilidad === e);

  // Un conflicto declarado por la NKB sobre una candidata que además resulta
  // utilizable es lo que más atención humana exige: se informa antes que nada.
  // La candidata sigue siendo utilizable —su estado propio no cambia—, pero la
  // resolución no puede presentarse como un caso rutinario.
  const conConflicto = candidatas.filter((c) => esUtilizable(c) && c.conflicto !== 'ninguno');
  if (conConflicto.some((c) => c.conflicto === 'CONFLICTO')) return 'CONFLICTO';
  if (conConflicto.length > 0) return 'CONFLICTO_NO_DETERMINABLE';

  if (hay('CONFLICTO')) return 'CONFLICTO';
  if (hay('CONFLICTO_NO_DETERMINABLE')) return 'CONFLICTO_NO_DETERMINABLE';
  if (hay('APLICABLE')) return 'APLICABLE';
  if (hay('APLICABLE_CON_RESERVAS')) return 'APLICABLE_CON_RESERVAS';
  if (hay('NO_DETERMINABLE')) return 'NO_DETERMINABLE';
  return 'SIN_NORMA_ADMISIBLE';
}

function advertenciasGlobales(candidatas: readonly Candidata[]): string[] {
  const out: string[] = [];

  const utilizables = candidatas.filter(esUtilizable);

  if (utilizables.length > 1) {
    out.push(
      `Hay ${utilizables.length} normas aplicables a este contexto. El NIE no elige entre ellas: ` +
        'la selección es una decisión externa que debe declararse.',
    );
  }

  if (candidatas.length > 0 && utilizables.length === 0) {
    out.push(
      'Se localizaron normas para esta variable, pero ninguna resultó aplicable con la ' +
        'información disponible. Esto no describe al sujeto: describe la evidencia.',
    );
  }

  if (candidatas.some((c) => c.estadoNorma === 'ES-2')) {
    out.push(
      'Alguna candidata está en ES-2 · Cuestionada. La objeción registrada por la NKB debe ' +
        'acompañar a cualquier uso de esa norma.',
    );
  }

  return out;
}

/**
 * Resuelve candidatas y aplicabilidad.
 *
 * Devuelve **todas** las normas de la variable solicitada, incluidas las no
 * aplicables: la salida debe permitir auditar por qué cada una quedó donde
 * quedó, y una norma descartada en silencio no es auditable.
 */
export function resolver(
  contexto: ContextoEvaluacion,
  normas: readonly NormaNKB[],
): ResolucionNormativa {
  const candidatas: Candidata[] = [];

  for (const norma of normas) {
    // Solo entra en la comparación lo que trata de la misma variable. Una norma
    // de otra variable no es «no aplicable»: sencillamente no viene al caso.
    if (contexto.variable !== null && contexto.variable !== norma.variable) continue;

    const dimensiones = compararDimensiones(contexto, norma);
    const veredicto = determinarAplicabilidad(dimensiones, norma);

    candidatas.push({
      normaId: norma.id,
      fichaId: norma.fichaId,
      variable: norma.variable,
      instrumento: norma.instrumento,
      poblacion: norma.poblacion,
      pais: norma.pais,
      estrato: describirEstrato(norma),
      tipo: norma.tipo,
      unidad: norma.unidad,
      estadoNorma: norma.estado,
      calidad: norma.calidad,
      dimensionesDegradantes: norma.dimensionesDegradantes,
      nCelda: norma.nCelda,
      aplicabilidad: veredicto.aplicabilidad,
      motivosReserva: veredicto.motivosReserva,
      dimensiones,
      coincidencias: veredicto.coincidencias,
      discrepancias: veredicto.discrepancias,
      camposFaltantes: veredicto.camposFaltantes,
      restricciones: norma.restricciones,
      limitaciones: norma.limitaciones,
      advertencias: norma.advertencias,
      conflicto: norma.conflicto,
      valores: norma.valores,
      parametrosModelo: norma.parametrosModelo,
      procedencia: {
        normaId: norma.id,
        fichaId: norma.fichaId,
        fichero: norma.fichero,
        tabla: norma.tabla,
        fila: norma.alcance,
        referencia: norma.referencia,
      },
    });
  }

  const resumen = Object.fromEntries(
    ESTADOS.map((e) => [e, candidatas.filter((c) => c.aplicabilidad === e).length]),
  ) as Record<EstadoAplicabilidad, number>;

  return {
    contexto,
    candidatas,
    estadoGlobal: estadoGlobal(candidatas),
    resumen,
    advertencias: advertenciasGlobales(candidatas),
  };
}

/** Candidatas utilizables. **No las ordena**: filtrar no es elegir. */
export function utilizables(r: ResolucionNormativa): readonly Candidata[] {
  return r.candidatas.filter(esUtilizable);
}
