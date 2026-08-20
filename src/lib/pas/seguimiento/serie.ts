// ── Serie longitudinal (Sprint PAS-10) ─────────────────────────────────────
//
// PAS-8 comparaba dos puntos: anterior y actual. Eso responde «¿cambió?», pero
// no «¿qué ha pasado con esta variable?». Esta capa construye la serie entera.
//
// LO QUE UNA SERIE NO PUEDE HACER, Y ES SU RAZÓN DE SER:
//
//   Unir puntos que no son comparables. Dos mediciones con distinto método o
//   distinta unidad no forman una línea: forman DOS líneas, y dibujarlas juntas
//   afirmaría una continuidad que no existe.
//
//   Por eso la serie no es una lista de puntos, sino una lista de TRAMOS. Un
//   cambio de método parte la serie y la ruptura se declara: es información
//   —«aquí cambió el dinamómetro»—, no un detalle que ocultar para que el
//   gráfico salga bonito.
//
// Y nunca se interpola. Si entre marzo y agosto no hay medición, no hay punto:
// inventarlo pondría en la serie un valor que nadie midió.
//
// Módulo puro. Sin fecha del sistema, sin azar, sin red.

/** Una medición, tal como se registró. */
export interface PuntoMedicion {
  pruebaId: string;
  valor: number;
  unidad: string;
  /** `yyyy-mm-dd`. */
  fecha: string;
  /** Condiciones declaradas. Definen si dos puntos son comparables. */
  condiciones: Record<string, string>;
}

/** Por qué la serie se parte. */
export type MotivoRuptura = 'metodo' | 'unidad';

export interface Ruptura {
  motivo: MotivoRuptura;
  /** Fecha del último punto antes de la ruptura. */
  desde: string;
  /** Fecha del primer punto después. */
  hasta: string;
  /** Explicación literal, para mostrar sin reescribir. */
  detalle: string;
}

/** Un tramo comparable: todos sus puntos comparten método y unidad. */
export interface Tramo {
  unidad: string;
  condiciones: Record<string, string>;
  puntos: readonly PuntoMedicion[];
}

export interface SerieLongitudinal {
  pruebaId: string;
  /** Todos los puntos, ordenados por fecha. Ninguno se pierde. */
  puntos: readonly PuntoMedicion[];
  /** Los tramos comparables. Más de uno significa que hubo ruptura. */
  tramos: readonly Tramo[];
  rupturas: readonly Ruptura[];
  /** El tramo que contiene la medición más reciente. `null` si no hay puntos. */
  tramoActual: Tramo | null;
}

/** Dos mediciones son comparables si coinciden unidad y todas las condiciones. */
function comparables(a: PuntoMedicion, b: PuntoMedicion): boolean {
  if (a.unidad !== b.unidad) return false;
  const claves = new Set([...Object.keys(a.condiciones), ...Object.keys(b.condiciones)]);
  return [...claves].every((k) => a.condiciones[k] === b.condiciones[k]);
}

/**
 * Construye la serie de una prueba a partir de sus mediciones.
 *
 * El orden se impone aquí, explícitamente: no se confía en que la consulta
 * devuelva las filas cronológicamente. Una serie que dependa del orden de
 * llegada de un `select` deja de ser determinista el día que alguien añada un
 * índice.
 *
 * A igualdad de fecha se conserva el orden de entrada: dos mediciones del mismo
 * día no tienen entre sí un «antes» que el sistema pueda conocer.
 */
export function construirSerie(
  pruebaId: string,
  mediciones: readonly PuntoMedicion[],
): SerieLongitudinal {
  const propias = mediciones.filter((m) => m.pruebaId === pruebaId);

  // `sort` es estable en JS, así que los empates de fecha conservan su orden.
  const puntos = [...propias].sort((a, b) => (a.fecha < b.fecha ? -1 : a.fecha > b.fecha ? 1 : 0));

  const tramos: Tramo[] = [];
  const rupturas: Ruptura[] = [];

  for (const punto of puntos) {
    const ultimo = tramos[tramos.length - 1];
    const anterior = ultimo?.puntos[ultimo.puntos.length - 1];

    if (anterior && comparables(anterior, punto)) {
      tramos[tramos.length - 1] = { ...ultimo, puntos: [...ultimo.puntos, punto] };
      continue;
    }

    if (anterior) {
      const porUnidad = anterior.unidad !== punto.unidad;
      rupturas.push({
        motivo: porUnidad ? 'unidad' : 'metodo',
        desde: anterior.fecha,
        hasta: punto.fecha,
        detalle: porUnidad
          ? `La unidad cambió de ${anterior.unidad} a ${punto.unidad}. Los valores no se ` +
            'comparan entre sí sin una conversión autorizada.'
          : 'El método de medición cambió. Comparar valores obtenidos con protocolos distintos ' +
            'describiría el cambio de instrumento, no el del atleta.',
      });
    }

    tramos.push({ unidad: punto.unidad, condiciones: punto.condiciones, puntos: [punto] });
  }

  return {
    pruebaId,
    puntos,
    tramos,
    rupturas,
    tramoActual: tramos.length === 0 ? null : tramos[tramos.length - 1],
  };
}

/** Cuántos puntos comparables sostienen la lectura más reciente. */
export function profundidadActual(serie: SerieLongitudinal): number {
  return serie.tramoActual?.puntos.length ?? 0;
}
