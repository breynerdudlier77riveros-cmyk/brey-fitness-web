// ── Hallazgos (Sprint PAS-2.0) ─────────────────────────────────────────────
// Un hallazgo DESCRIBE. Nunca califica: ni «mejor», ni «peor», ni «óptimo»,
// ni «deficiente», ni «alto», ni «bajo». Esas palabras exigirían un valor de
// referencia o un objetivo, y el PAS no conoce ninguno de los dos
// (`16-glosario.md`, términos prohibidos).
//
// Por eso el contenido de un hallazgo es su `tipo` —un código cerrado— y los
// ids que lo originan. No hay ni una frase redactada en toda la salida.

import type { CapacidadId } from './capacidades';
import { definicionCapacidad } from './capacidades';
import { hallazgosAnulados, hallazgosExclusion, hallazgosRepetidos } from './hallazgos-datos';
import { crearHallazgo, ordenarHallazgos } from './trazabilidad';
import type { EstadoCapacidad, Hallazgo } from './resultado';
import type { EvaluacionPAS } from './tipos';

/** Un hallazgo por capacidad, derivado de su estado. Correspondencia 1 a 1. */
function hallazgoDeEstado(estado: EstadoCapacidad, fecha: string): Hallazgo {
  const comun = {
    clave: estado.capacidad,
    capacidad: estado.capacidad as CapacidadId | null,
    registros: estado.traza.incluidos,
    pruebas: estado.traza.correspondencias.map((c) => c.pruebaId),
    fecha,
  };

  switch (estado.estado) {
    case 'evaluada':
      return crearHallazgo({ ...comun, tipo: 'evidencia_suficiente', regla: 'HAL-01' });

    case 'parcialmente_evaluada':
      return crearHallazgo({ ...comun, tipo: 'cobertura_parcial', regla: 'HAL-02' });

    case 'desactualizada':
      // Los registros del hallazgo son los EXCLUIDOS: son los que existieron
      // y caducaron. No hay ninguno incluido, por definición del estado.
      return crearHallazgo({
        ...comun,
        tipo: 'resultado_obsoleto',
        regla: 'HAL-03',
        registros: estado.traza.excluidos.map((e) => e.registroId),
      });

    case 'en_conflicto':
      return crearHallazgo({ ...comun, tipo: 'resultado_conflictivo', regla: 'HAL-04' });

    case 'desconocida':
      // «Insuficiente» y «sin evidencia» se distinguen por si hubo candidatos:
      // que existan registros excluidos significa que alguien evaluó algo,
      // aunque no haya servido.
      return estado.traza.excluidos.length > 0
        ? crearHallazgo({
            ...comun,
            tipo: 'evidencia_insuficiente',
            regla: 'HAL-05',
            registros: estado.traza.excluidos.map((e) => e.registroId),
          })
        : crearHallazgo({ ...comun, tipo: 'sin_evidencia', regla: 'HAL-06' });
  }
}

/**
 * Capacidades reservadas (F-01, F-02).
 *
 * Su hallazgo es *pendiente*, no *sin evidencia*: aquí no falta el dato,
 * falta el respaldo para admitirlo (Sprint 5, PAS-ADR-10).
 */
function hallazgosPendientes(estados: readonly EstadoCapacidad[], fecha: string): Hallazgo[] {
  return estados
    .filter((e) => definicionCapacidad(e.capacidad).reservada)
    .map((e) =>
      crearHallazgo({
        tipo: 'resultado_pendiente',
        clave: e.capacidad,
        regla: 'HAL-07',
        capacidad: e.capacidad,
        fecha,
      })
    );
}

export function generarHallazgos(entrada: {
  estados: readonly EstadoCapacidad[];
  evaluaciones: readonly EvaluacionPAS[];
  duplicados: readonly (readonly string[])[];
  hoyISO: string;
}): Hallazgo[] {
  const { estados, evaluaciones, duplicados, hoyISO } = entrada;

  // Las reservadas reciben su propio hallazgo y no el derivado del estado:
  // decir «sin evidencia» de una capacidad que aún no admite pruebas
  // confundiría la falta de dato con la falta de respaldo.
  const activas = estados.filter((e) => !definicionCapacidad(e.capacidad).reservada);

  return ordenarHallazgos([
    ...activas.map((e) => hallazgoDeEstado(e, hoyISO)),
    ...hallazgosPendientes(estados, hoyISO),
    ...hallazgosAnulados(evaluaciones, hoyISO),
    ...hallazgosExclusion(estados, hoyISO),
    ...hallazgosRepetidos(duplicados, hoyISO),
  ]);
}
