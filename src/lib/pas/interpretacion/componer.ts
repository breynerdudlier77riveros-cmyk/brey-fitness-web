// ── Composición de la interpretación (Sprint PAS-9) ────────────────────────
//
// Aplica el catálogo de reglas a un resultado ya resuelto y devuelve las tres
// interpretaciones, una por eje.
//
// LA PRIMERA REGLA QUE RECONOCE LA SITUACIÓN GANA, y las más específicas van
// antes en el catálogo. No es una elección entre alternativas: los estados de
// cada eje son excluyentes por construcción —un resultado no puede tener a la
// vez referencia disponible y ausente—, así que «la primera» y «la única»
// coinciden. El orden solo importa dentro de un mismo estado, donde separa el
// caso particular del general: alcanzar el objetivo antes que avanzar hacia él.
//
// Determinista y puro. Sin fecha, sin azar, sin red.

import type { ResultadoHumano } from '@/lib/pas/informe-humano';

import { REGLAS_LONGITUDINALES, REGLAS_NORMATIVAS, REGLAS_OBJETIVO } from './reglas';
import type { Interpretacion, InterpretacionResultado, Regla } from './tipos';

function primera(
  reglas: readonly Regla<ResultadoHumano>[],
  r: ResultadoHumano,
): Interpretacion | null {
  const regla = reglas.find((x) => x.aplica(r));
  if (!regla) return null;
  const { texto, limite } = regla.redactar(r);
  return { eje: regla.eje, regla: regla.id, texto, limite };
}

/** Las tres interpretaciones de un resultado. Cada eje por separado. */
export function interpretar(resultado: ResultadoHumano): InterpretacionResultado {
  return {
    normativo: primera(REGLAS_NORMATIVAS, resultado),
    longitudinal: primera(REGLAS_LONGITUDINALES, resultado),
    objetivo: primera(REGLAS_OBJETIVO, resultado),
  };
}

/**
 * La interpretación como texto corrido, para quien solo tenga una línea.
 *
 * Concatena los ejes que existan **en orden de lectura**: primero dónde cae
 * respecto a la referencia, después respecto a uno mismo, después respecto al
 * objetivo. Los límites NO entran aquí: viajan en el modelo estructurado y se
 * muestran donde haya sitio para ellos.
 */
export function comoTexto(i: InterpretacionResultado): string | null {
  const partes = [i.normativo, i.longitudinal, i.objetivo]
    .filter((x): x is Interpretacion => x !== null)
    .map((x) => x.texto);
  return partes.length === 0 ? null : partes.join(' ');
}
