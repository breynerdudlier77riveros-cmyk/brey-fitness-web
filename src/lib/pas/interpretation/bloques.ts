// ── Bloques del informe (Sprint PAS-4.0) ───────────────────────────────────
// Reparte las interpretaciones ya construidas en las secciones de salida.
// No construye texto ni decide nada: solo agrupa y ordena.
//
// Una misma interpretación puede aparecer en dos bloques —el cuerpo y las
// limitaciones, por ejemplo—. Es deliberado: son dos lecturas del mismo hecho,
// no dos hechos.

import { ordenarYDeduplicar } from './prioridad';
import { recopilarLimitaciones } from './limitaciones';
import type { BloqueInterpretacion, Interpretacion } from './tipos';

export function porBloque(
  interpretaciones: readonly Interpretacion[],
  bloque: BloqueInterpretacion
): Interpretacion[] {
  return ordenarYDeduplicar(interpretaciones.filter((i) => i.bloque === bloque));
}

/**
 * Resumen ejecutivo: lo estructural, y nada más.
 *
 * Es lo que condiciona la lectura de todo el informe —que no haya
 * correspondencias, que el perfil sea inconsistente, que no pueda afirmarse
 * un cambio—. Meter aquí lo «más llamativo» convertiría el resumen en un
 * titular, y un titular sobre un perfil incompleto es justo lo que este
 * sistema evita.
 */
export function resumenEjecutivo(interpretaciones: readonly Interpretacion[]): Interpretacion[] {
  return ordenarYDeduplicar(interpretaciones.filter((i) => i.prioridad === 'estructural'));
}

/** Interpretaciones que SÍ apoyan una caracterización, con su referencia. */
export function evidenciaDisponible(
  interpretaciones: readonly Interpretacion[]
): Interpretacion[] {
  return ordenarYDeduplicar(
    interpretaciones.filter((i) => i.regla === 'PIE-01' || i.regla === 'PIE-06')
  );
}

/** Interpretaciones que declaran ausencia o insuficiencia de evidencia. */
export function evidenciaInsuficiente(
  interpretaciones: readonly Interpretacion[]
): Interpretacion[] {
  const REGLAS = new Set(['PIE-09', 'PIE-10', 'PIE-12', 'PIE-13', 'PIE-19']);
  return ordenarYDeduplicar(interpretaciones.filter((i) => REGLAS.has(i.regla)));
}

/** Interpretaciones ancladas a un hallazgo concreto del PAE. */
export function ligadasAHallazgo(
  interpretaciones: readonly Interpretacion[]
): Interpretacion[] {
  return ordenarYDeduplicar(
    interpretaciones.filter((i) => i.hallazgosRelacionados.length > 0)
  );
}

export function limitaciones(interpretaciones: readonly Interpretacion[]): Interpretacion[] {
  return ordenarYDeduplicar(recopilarLimitaciones(interpretaciones));
}
