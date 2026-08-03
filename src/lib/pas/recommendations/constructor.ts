// ── Constructor de recomendaciones (Sprint PAS-6.0) ────────────────────────
// Único camino hacia el tipo `Recomendacion`. Que sea el único es la garantía:
// no existe forma de emitir una recomendación sin su cadena de trazabilidad
// completa, porque no hay otra puerta.
//
// Aquí no se decide nada: la regla ya eligió categoría, prioridad y plantilla.

import type { CapacidadId } from '../capacidades';
import type { FichaPKB, Interpretacion } from '../interpretation';
import { construirEvidencia, hallazgosDe, referenciasDe } from './evidencia';
import { render } from './render';
import type { Valores } from './render';
import type {
  CategoriaRecomendacion,
  EstadoRecomendacion,
  PrioridadRecomendacion,
  Recomendacion,
  TrazabilidadRecomendacion,
} from './tipos';

export interface EntradaRecomendacion {
  /** Clave estable que, junto a la regla, forma el id. */
  clave: string;
  regla: string;
  categoria: CategoriaRecomendacion;
  prioridad: PrioridadRecomendacion;
  plantilla: string;
  valores?: Valores;
  /** Por qué se emitió, en términos del estado observado. */
  fundamento: string;
  capacidades?: readonly CapacidadId[];
  fichas?: readonly FichaPKB[];
  interpretaciones?: readonly Interpretacion[];
  /** Hallazgos adicionales que no proceden de una interpretación. */
  hallazgosExtra?: readonly string[];
  limitaciones?: readonly string[];
  estado?: EstadoRecomendacion;
}

function unicos(valores: readonly string[]): string[] {
  return [...new Set(valores)].sort();
}

export function construirRecomendacion(entrada: EntradaRecomendacion): Recomendacion {
  const fichas = entrada.fichas ?? [];
  const interpretaciones = entrada.interpretaciones ?? [];
  const capacidades = [...(entrada.capacidades ?? [])].sort();

  const texto = render(entrada.plantilla, entrada.valores ?? {});

  const hallazgos = unicos([
    ...hallazgosDe(interpretaciones),
    ...(entrada.hallazgosExtra ?? []),
  ]);

  const referencias = referenciasDe(fichas);

  const trazabilidad: TrazabilidadRecomendacion = {
    capacidades,
    hallazgos,
    // Ids, NUNCA el texto del PIE: sus plantillas insertan el nombre de la
    // capacidad, y varios de esos nombres son término prohibido aquí.
    interpretaciones: unicos(interpretaciones.map((i) => i.id)),
    fichasPKB: unicos(fichas.map((f) => f.id)),
    referencias,
    regla: entrada.regla,
    plantilla: entrada.plantilla,
  };

  return {
    id: `${entrada.regla}:${entrada.clave}`,
    categoria: entrada.categoria,
    prioridad: entrada.prioridad,
    titulo: texto.titulo,
    descripcion: texto.descripcion,
    accionProfesional: texto.accion,
    seguimiento: texto.seguimiento,
    fundamento: entrada.fundamento,
    evidencia: construirEvidencia(fichas),
    referencias,
    limitaciones: [...(entrada.limitaciones ?? [])],
    capacidades,
    hallazgos,
    interpretaciones: trazabilidad.interpretaciones,
    trazabilidad,
    estado: entrada.estado ?? 'activa',
  };
}

/**
 * `true` si la cadena está completa.
 *
 * La exigencia de referencia es asimétrica, igual que en el PIE: **afirmar
 * evidencia obliga a poder citarla; declarar su ausencia, no.** Una
 * correspondencia que la base marca insuficiente carece de referencia a
 * propósito, y pedirle una obligaría a inventarla.
 */
export function trazaCompleta(recomendacion: Recomendacion): boolean {
  const { trazabilidad, evidencia } = recomendacion;

  if (trazabilidad.regla.trim() === '') return false;
  if (trazabilidad.plantilla.trim() === '') return false;
  if (recomendacion.titulo.trim() === '') return false;
  if (recomendacion.fundamento.trim() === '') return false;

  const afirmaEvidencia = evidencia.nivel !== null && evidencia.nivel !== 'insuficiente';
  if (afirmaEvidencia && trazabilidad.fichasPKB.length > 0) {
    return trazabilidad.referencias.length > 0;
  }

  return true;
}
