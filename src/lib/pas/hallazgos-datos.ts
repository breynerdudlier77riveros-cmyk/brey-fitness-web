// ── Hallazgos derivados de los datos (Sprint PAS-2.0) ──────────────────────
// Los que no dependen del estado de una capacidad, sino de los registros
// mismos: anulaciones, exclusiones y repeticiones.

import { crearHallazgo } from './trazabilidad';
import type { EstadoCapacidad, Hallazgo } from './resultado';
import type { EvaluacionPAS } from './tipos';

/**
 * Registros anulados presentes.
 *
 * Dejan de ser elegibles, no de haber ocurrido (I-02). Silenciarlos haría
 * indistinguible una capacidad que nunca se evaluó de una cuyos registros se
 * anularon todos.
 */
export function hallazgosAnulados(
  evaluaciones: readonly EvaluacionPAS[],
  fecha: string
): Hallazgo[] {
  const anulados = evaluaciones.flatMap((e) => e.registros).filter((r) => r.estado === 'anulada');
  if (anulados.length === 0) return [];

  return [
    crearHallazgo({
      tipo: 'registro_anulado_presente',
      clave: 'global',
      regla: 'HAL-08',
      capacidad: null,
      registros: anulados.map((r) => r.id),
      pruebas: [...new Set(anulados.map((r) => r.pruebaId))],
      fecha,
    }),
  ];
}

/** Un hallazgo por capacidad y motivo de exclusión. Ninguna exclusión se calla. */
export function hallazgosExclusion(
  estados: readonly EstadoCapacidad[],
  fecha: string
): Hallazgo[] {
  const salida: Hallazgo[] = [];

  for (const estado of estados) {
    const porMotivo = new Map<string, string[]>();

    for (const excluido of estado.traza.excluidos) {
      const lista = porMotivo.get(excluido.motivo) ?? [];
      lista.push(excluido.registroId);
      porMotivo.set(excluido.motivo, lista);
    }

    for (const [motivo, registros] of porMotivo) {
      salida.push(
        crearHallazgo({
          tipo: 'registro_excluido',
          clave: `${estado.capacidad}|${motivo}`,
          regla: 'HAL-09',
          capacidad: estado.capacidad,
          registros,
          fecha,
        })
      );
    }
  }

  return salida;
}

/**
 * Duplicados exactos: el mismo hecho registrado dos veces.
 *
 * Se señala aunque no haya divergencia — dos registros idénticos no aportan
 * más evidencia que uno, y contarlos como dos daría una impresión de respaldo
 * que no existe.
 */
export function hallazgosRepetidos(
  idsPorGrupo: readonly (readonly string[])[],
  fecha: string
): Hallazgo[] {
  return idsPorGrupo.map((registros) =>
    crearHallazgo({
      tipo: 'resultado_repetido',
      clave: [...registros].sort().join('|'),
      regla: 'HAL-10',
      capacidad: null,
      registros,
      fecha,
    })
  );
}
