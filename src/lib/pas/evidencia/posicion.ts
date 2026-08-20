// ── Posición respecto a la referencia (Sprint PAS-10E §7) ──────────────────
//
// Dónde cae un valor observado dentro de lo que la fuente publica.
//
// LO QUE ESTE MÓDULO NO HACE, Y ES SU RAZÓN DE SER:
//
//   · No interpola. Entre el P90 y el P97 no hay P93: hay «entre P90 y P97».
//   · No convierte z en percentil. Exigiría asumir una distribución que la
//     fuente no publica, y es el error más tentador de todo el sistema.
//   · No convierte una media en categorías, ni una desviación típica en
//     percentiles, ni un punto de corte en un percentil.
//   · No clasifica. «Dentro del rango» es una posición medida; «normal» es una
//     categoría, y solo la fuente puede definirla.
//
// Módulo puro: misma entrada, misma salida, siempre.

import type { Posicion, Representacion } from './tipos';

/**
 * Dónde cae `valor` dentro de la representación.
 *
 * `null` cuando la representación no describe una distribución de valores
 * —fiabilidad, error de medición, valores sin transcribir—. Devolver `null` es
 * la respuesta correcta: un ICC no es una escala sobre la que situar a nadie.
 */
export function situar(valor: number, r: Representacion): Posicion | null {
  switch (r.clase) {
    case 'percentiles':
      return situarEnPercentiles(valor, r.puntos);

    case 'media_dt':
      // Se informa la distancia a la media EN DESVIACIONES, y ahí se para. La
      // fuente publicó media y dispersión; traducir eso a un percentil sería
      // inventar la forma de la distribución.
      return r.dt === 0 ? null : { clase: 'desviaciones', z: (valor - r.media) / r.dt };

    case 'rango':
      if (valor < r.min) return { clase: 'fuera_del_rango', lado: 'inferior' };
      if (valor > r.max) return { clase: 'fuera_del_rango', lado: 'superior' };
      return { clase: 'dentro_del_rango' };

    case 'punto_de_corte':
      return {
        clase: 'respecto_al_corte',
        lado: valor < r.valor ? 'por_debajo' : valor > r.valor ? 'por_encima' : 'en_el_corte',
      };

    case 'fiabilidad':
    case 'error_medicion':
    case 'valores_sin_transcribir':
      return null;
  }
}

/**
 * Dónde cae el valor entre los percentiles PUBLICADOS.
 *
 * Los puntos se ordenan aquí, explícitamente: confiar en que la fuente se
 * transcribió en orden es confiar en que nadie edite la tabla más adelante.
 */
function situarEnPercentiles(
  valor: number,
  puntos: readonly { p: number; valor: number }[],
): Posicion | null {
  if (puntos.length === 0) return null;

  const orden = [...puntos].sort((a, b) => a.valor - b.valor);

  const exacto = orden.find((q) => q.valor === valor);
  if (exacto) return { clase: 'percentil_exacto', p: exacto.p };

  const primero = orden[0];
  const ultimo = orden[orden.length - 1];

  // Fuera del intervalo publicado. NO se extrapola hasta dónde llegaría: la
  // fuente sencillamente no publica valores más allá de ese punto.
  if (valor < primero.valor) return { clase: 'fuera_por_debajo', primerPercentil: primero.p };
  if (valor > ultimo.valor) return { clase: 'fuera_por_encima', ultimoPercentil: ultimo.p };

  for (let i = 0; i < orden.length - 1; i++) {
    if (valor > orden[i].valor && valor < orden[i + 1].valor) {
      return { clase: 'entre_percentiles', inferior: orden[i].p, superior: orden[i + 1].p };
    }
  }

  return null;
}

// ════════════════════════════════════════════════════════════════════════════
// CAMBIO FRENTE AL ERROR DE MEDIDA (§13, §21)
// ════════════════════════════════════════════════════════════════════════════

export type LecturaDeCambio =
  | { decidible: true; superaError: boolean; mdcUsado: number; unidad: string }
  | { decidible: false; motivo: 'SIN_MDC_PUBLICADO' | 'SOLO_CV_PUBLICADO'; detalle: string };

/**
 * Si un cambio observado supera el error de medida de la prueba.
 *
 * LA REGLA QUE ESTE MÓDULO DEFIENDE: **un CV no es un MDC**.
 *
 * Existe una fórmula habitual para derivar uno del otro, y aplicarla aquí en
 * silencio convertiría una fiabilidad publicada en un umbral que ninguna
 * fuente publicó. Mientras esa derivación no se autorice explícitamente, tener
 * solo el CV es un estado propio —`SOLO_CV_PUBLICADO`— y no una respuesta
 * negativa: dice que falta un permiso, no que falte la ciencia.
 */
export function leerCambio(
  cambioAbsoluto: number,
  valorAnterior: number,
  representacion: Representacion,
  unidad: string,
): LecturaDeCambio {
  if (representacion.clase === 'fiabilidad') {
    return {
      decidible: false,
      motivo: 'SOLO_CV_PUBLICADO',
      detalle:
        'La fuente publica la fiabilidad de la prueba, pero no un cambio mínimo detectable. ' +
        'Derivar uno del otro exigiría una autorización que todavía no se ha dado, así que no ' +
        'puede decirse si este cambio supera el error de medida.',
    };
  }

  if (representacion.clase !== 'error_medicion') {
    return {
      decidible: false,
      motivo: 'SIN_MDC_PUBLICADO',
      detalle:
        'No consta un cambio mínimo detectable para esta prueba, así que no puede distinguirse ' +
        'este cambio del error de la propia medición.',
    };
  }

  const magnitud = Math.abs(cambioAbsoluto);

  if (representacion.mdc !== null) {
    return {
      decidible: true,
      superaError: magnitud > representacion.mdc,
      mdcUsado: representacion.mdc,
      unidad,
    };
  }

  // Un MDC porcentual se aplica sobre el valor de partida, que es como lo
  // publican las fuentes que lo expresan así.
  if (representacion.mdcPct !== null && valorAnterior !== 0) {
    const umbral = (Math.abs(valorAnterior) * representacion.mdcPct) / 100;
    return { decidible: true, superaError: magnitud > umbral, mdcUsado: umbral, unidad };
  }

  return {
    decidible: false,
    motivo: 'SIN_MDC_PUBLICADO',
    detalle:
      'La fuente registra error de medición, pero no un cambio mínimo detectable aplicable a ' +
      'este resultado.',
  };
}
