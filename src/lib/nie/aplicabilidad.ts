// ── NIE-1.2 · Applicability Engine ─────────────────────────────────────────
//
// Toma las dimensiones ya comparadas y determina el estado de aplicabilidad.
//
// La aplicabilidad es multidimensional y **no se puntúa**: no hay un «80%
// aplicable», no se suman puntos y no existe una puntuación compuesta que mezcle
// calidad con correspondencia (`38`).
//
// Módulo puro.

import type {
  ComparacionDimension,
  DimensionId,
  EstadoAplicabilidad,
  MotivoReserva,
  NormaNKB,
} from './tipos';

export interface Veredicto {
  aplicabilidad: EstadoAplicabilidad;
  motivosReserva: readonly MotivoReserva[];
  coincidencias: readonly DimensionId[];
  discrepancias: readonly DimensionId[];
  camposFaltantes: readonly DimensionId[];
}

/**
 * Motivos por los que una norma aplicable arrastra reservas.
 *
 * Todos proceden de un hecho **declarado en la ficha**. Ninguno se deduce de un
 * umbral inventado: la NKB no tiene umbral de N y este motor tampoco lo crea
 * (`37`).
 */
function reservasDe(norma: NormaNKB): MotivoReserva[] {
  const motivos: MotivoReserva[] = [];
  if (norma.estado === 'ES-2') motivos.push('estado_cuestionado');
  if (norma.calidad === 'baja' || norma.calidad === 'muy_baja') motivos.push('calidad_baja');
  if (norma.nCelda === null) motivos.push('n_celda_no_consta');
  if (norma.valoresProyectados) motivos.push('valores_proyectados');
  if (norma.conflicto !== 'ninguno') motivos.push('conflicto_declarado');
  return motivos;
}

/**
 * Determina la aplicabilidad de una candidata.
 *
 * Orden de decisión, y el orden importa:
 *
 * 1. **Cualquier MISMATCH excluye.** Basta una incompatibilidad demostrada.
 *    Se comprueba primero para que una discrepancia real no quede enmascarada
 *    por un campo que además falte.
 * 2. **Cualquier NO_DETERMINABLE detiene.** Falta información: no se asume que
 *    coincide ni que no coincide.
 * 3. Todo coincide → APLICABLE, salvo que la norma traiga reservas declaradas.
 *
 * El conflicto declarado por la NKB se propaga tal cual: el NIE no lo descubre
 * y no lo resuelve.
 */
export function determinarAplicabilidad(
  dimensiones: readonly ComparacionDimension[],
  norma: NormaNKB,
): Veredicto {
  const porEstado = (e: ComparacionDimension['estado']) =>
    dimensiones.filter((d) => d.estado === e).map((d) => d.dimension);

  const coincidencias = porEstado('MATCH');
  const discrepancias = porEstado('MISMATCH');
  const camposFaltantes = porEstado('NO_DETERMINABLE');
  const base = { coincidencias, discrepancias, camposFaltantes };

  if (discrepancias.length > 0) {
    return { aplicabilidad: 'NO_APLICABLE', motivosReserva: [], ...base };
  }

  if (camposFaltantes.length > 0) {
    // Un conflicto declarado sobre una candidata que además está incompleta se
    // conserva como incertidumbre doble, no se simplifica a una de las dos.
    const aplicabilidad: EstadoAplicabilidad =
      norma.conflicto === 'CONFLICTO' || norma.conflicto === 'CONFLICTO_NO_DETERMINABLE'
        ? 'CONFLICTO_NO_DETERMINABLE'
        : 'NO_DETERMINABLE';
    return { aplicabilidad, motivosReserva: reservasDe(norma), ...base };
  }

  const motivosReserva = reservasDe(norma);
  const aplicabilidad: EstadoAplicabilidad =
    motivosReserva.length > 0 ? 'APLICABLE_CON_RESERVAS' : 'APLICABLE';

  return { aplicabilidad, motivosReserva, ...base };
}
