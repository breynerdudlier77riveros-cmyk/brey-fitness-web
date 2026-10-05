// ── VO2máx estimado desde la Course-navette (Sprint PAS-8.x) ────────────────
//
// La Course-navette (P-07) solo tiene evidencia publicada para escolares de
// Bogotá (`registro.ts`, FUPRECOL): para cualquier otro perfil, la prueba se
// queda sin norma aunque el dato SÍ sirva para algo — estimar el VO2máx con
// la ecuación de Léger (1988) y situarlo en las mismas tablas de Cooper, AHA
// y Rivera que ya clasifican una prensión... una caminata Rockport (P-12).
//
// ── POR QUÉ SE CLASIFICA COMO SI FUERA P-12 ──────────────────────────────
//
//   Rockport y Harvard hoy funcionan porque el profesional calcula el VO2máx
//   FUERA de la aplicación y lo escribe en P-12 como un número más. Eso ya
//   pasa por `leerEvidencia` y ya tiene sus cuatro tablas. Aquí se hace la
//   misma cuenta, pero DENTRO de la aplicación: se deriva con `vo2Leger` y se
//   compara contra las MISMAS tablas de P-12 — no una copia, la misma
//   función y las mismas `REFERENCIAS`.
//
//   El resultado NUNCA se guarda como si fuera una medición de P-12 real: es
//   un panel aparte, marcado como estimación, con su fórmula a la vista.
//
// Módulo puro.

import { vo2Leger } from '@/lib/pas/calculo/derivados';
import { fuenteDe, leerEvidencia, type SujetoEvidencia } from '@/lib/pas/evidencia';
import type { PanelVo2Estimado } from './tipos';

const P_COURSE_NAVETTE = 'P-07';
/** El VO2máx derivado se clasifica contra las tablas de esta prueba genérica. */
const P_VO2MAX_GENERICO = 'P-12';

export interface MedicionVo2Estimado {
  pruebaId: string;
  valor: number;
}

/** «Autores. (Año). Título. Publicación.» — o `null` si la fuente no consta. */
function citaDe(fuenteId: string): string | null {
  const f = fuenteDe(fuenteId);
  if (f === null || f.cita === null) return null;
  return `${f.cita.autores}. (${f.cita.anio}). ${f.cita.titulo}. ${f.cita.publicacion}.`;
}

/**
 * El VO2máx estimado de la Course-navette, clasificado, o `null` si falta
 * algo: la propia prueba, o la edad del atleta que la ecuación necesita.
 *
 * Con más de un registro de P-07 en la evaluación se toma el ÚLTIMO, el mismo
 * criterio que el resto del sistema.
 */
export function panelVo2EstimadoDe(
  mediciones: readonly MedicionVo2Estimado[],
  sujeto: SujetoEvidencia,
): PanelVo2Estimado | null {
  const registros = mediciones.filter((m) => m.pruebaId === P_COURSE_NAVETTE);
  if (registros.length === 0) return null;
  const estadios = registros[registros.length - 1].valor;

  const derivado = vo2Leger({ estadios, edad: sujeto.edad });
  if (!derivado.hay) return null;

  const evidencia = leerEvidencia(
    { pruebaId: P_VO2MAX_GENERICO, valor: derivado.valor, unidad: derivado.unidad, condiciones: {} },
    sujeto,
  );

  return {
    valor: derivado.valor,
    unidad: derivado.unidad,
    formula: derivado.formula,
    fuente: citaDe(derivado.fuenteId),
    evidencia,
  };
}
