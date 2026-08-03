// ── Trazabilidad del PIE (Sprint PAS-4.0) ──────────────────────────────────
// Ninguna interpretación se emite sin su cadena completa. Los siete eslabones
// son obligatorios; los que no apliquen van vacíos, nunca ausentes.
//
//   hallazgo → estado funcional → regla PIE → ficha PKB → referencia
//            → nivel de evidencia → limitaciones utilizadas

import type { CapacidadId } from '../capacidades';
import type {
  BloqueInterpretacion,
  FichaPKB,
  Interpretacion,
  LimitacionPKB,
  NivelEvidencia,
  Poblacion,
  PrioridadInterpretacion,
  Trazabilidad,
} from './tipos';

export interface EntradaInterpretacion {
  /** Clave que, junto a la regla, forma el id. Debe ser estable. */
  clave: string;
  regla: string;
  bloque: BloqueInterpretacion;
  prioridad: PrioridadInterpretacion;
  plantilla: string;
  texto: string;
  hallazgos?: readonly string[];
  capacidades?: readonly CapacidadId[];
  estadoFuncional?: string | null;
  fichas?: readonly FichaPKB[];
  /** Referencias adicionales que no proceden de una ficha. */
  referenciasExtra?: readonly string[];
  nivelEvidencia?: NivelEvidencia | null;
  poblaciones?: readonly Poblacion[];
  limitacionesExtra?: readonly LimitacionPKB[];
}

function unicos(valores: readonly string[]): string[] {
  return [...new Set(valores)].sort();
}

/**
 * Único constructor de interpretaciones del motor.
 *
 * Que sea el único es la garantía: no existe forma de emitir un texto sin
 * trazabilidad, porque no hay otro camino hacia el tipo `Interpretacion`.
 */
export function construirInterpretacion(entrada: EntradaInterpretacion): Interpretacion {
  const fichas = entrada.fichas ?? [];

  const referencias = unicos([
    ...fichas.flatMap((f) => f.referencias),
    ...(entrada.referenciasExtra ?? []),
  ]);

  const limitaciones = [
    ...new Set([...fichas.flatMap((f) => f.limitaciones), ...(entrada.limitacionesExtra ?? [])]),
  ].sort();

  const poblaciones = [
    ...new Set([...fichas.flatMap((f) => f.poblaciones), ...(entrada.poblaciones ?? [])]),
  ].sort();

  const trazabilidad: Trazabilidad = {
    hallazgos: unicos(entrada.hallazgos ?? []),
    estadoFuncional: entrada.estadoFuncional ?? null,
    regla: entrada.regla,
    fichasPKB: unicos(fichas.map((f) => f.id)),
    referencias,
    nivelEvidencia: entrada.nivelEvidencia ?? null,
    limitaciones,
  };

  return {
    id: `${entrada.regla}:${entrada.clave}`,
    regla: entrada.regla,
    bloque: entrada.bloque,
    prioridad: entrada.prioridad,
    texto: entrada.texto,
    plantilla: entrada.plantilla,
    hallazgosRelacionados: trazabilidad.hallazgos,
    capacidadesRelacionadas: [...(entrada.capacidades ?? [])].sort(),
    referencias,
    nivelEvidencia: trazabilidad.nivelEvidencia,
    poblaciones,
    limitaciones,
    trazabilidad,
  };
}

/**
 * `true` si la cadena está completa hasta la referencia científica.
 *
 * La regla no es «toda ficha exige referencia», sino la asimétrica:
 *
 *   **Afirmar evidencia exige poder citarla; declarar su ausencia, no.**
 *
 * Una correspondencia que la PKB marca como insuficiente carece de referencia
 * *a propósito* —no existe fuente que la establezca—, y exigirle una obligaría
 * a inventarla. Por eso la comprobación se salta las interpretaciones cuyo
 * nivel de evidencia es `insuficiente`.
 */
export function trazaCompleta(interpretacion: Interpretacion): boolean {
  const { trazabilidad } = interpretacion;
  if (trazabilidad.regla.trim() === '') return false;
  if (interpretacion.plantilla.trim() === '') return false;

  const afirmaEvidencia =
    trazabilidad.nivelEvidencia !== null && trazabilidad.nivelEvidencia !== 'insuficiente';

  if (afirmaEvidencia && trazabilidad.fichasPKB.length > 0) {
    return trazabilidad.referencias.length > 0;
  }

  return true;
}
