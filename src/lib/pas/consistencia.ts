// ── Consistencia (Sprint PAS-2.0) ──────────────────────────────────────────
// Cuatro niveles, completamente deterministas. El orden de las comprobaciones
// ES la regla: se evalúa de arriba abajo y gana la primera que se cumple.
//
// La consistencia describe el CONJUNTO de datos, no al atleta. «Inconsistente»
// significa que los registros se contradicen entre sí, jamás que el atleta
// tenga algo mal.

import { CAPACIDADES_ACTIVAS } from './capacidades';
import type { EstadoCapacidad, InformeConsistencia, NivelConsistencia } from './resultado';

export interface EntradaConsistencia {
  estados: readonly EstadoCapacidad[];
  registrosTotales: number;
  conflictos: number;
}

function decidirNivel(
  registrosTotales: number,
  registrosElegibles: number,
  conflictos: number,
  enConflicto: number,
  evaluadas: number,
  evaluables: number
): NivelConsistencia {
  // 1 · Algo se contradice. Prevalece sobre TODO lo demás, incluida la
  //     ausencia de registros: una evaluación vacía o con fecha imposible no
  //     es «sin datos», es una entrada malformada. Si `sin_datos` ganara aquí,
  //     un consumidor que solo mire el nivel no se enteraría del problema, y
  //     ese silencio es exactamente lo que el modelo de limitaciones impide.
  if (conflictos > 0 || enConflicto > 0) return 'inconsistente';

  // 2 · No hay nada que juzgar, y tampoco nada que objetar.
  if (registrosTotales === 0) return 'sin_datos';

  // 3 · Hay registros pero ninguno participa. Es el caso del catálogo sin
  //     correspondencias, que en v1.0 es el estado normal del sistema.
  if (registrosElegibles === 0) return 'sin_datos';

  // 4 · Todas las capacidades activas evaluadas.
  if (evaluables > 0 && evaluadas === evaluables) return 'completa';

  return 'parcial';
}

export function evaluarConsistencia(entrada: EntradaConsistencia): InformeConsistencia {
  const { estados, registrosTotales, conflictos } = entrada;

  const evaluables = CAPACIDADES_ACTIVAS.length;
  const evaluadas = estados.filter((e) => e.estado === 'evaluada').length;
  const enConflicto = estados.filter((e) => e.estado === 'en_conflicto').length;

  // Un mismo registro puede alimentar varias capacidades; se cuenta una vez.
  const elegibles = new Set<string>();
  for (const estado of estados) {
    for (const id of estado.traza.incluidos) elegibles.add(id);
  }

  return {
    nivel: decidirNivel(
      registrosTotales,
      elegibles.size,
      conflictos,
      enConflicto,
      evaluadas,
      evaluables
    ),
    capacidadesEvaluables: evaluables,
    capacidadesEvaluadas: evaluadas,
    capacidadesEnConflicto: enConflicto,
    registrosTotales,
    registrosElegibles: elegibles.size,
    conflictos,
  };
}
