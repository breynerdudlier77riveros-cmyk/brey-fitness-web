// ── Trazabilidad (Sprint PAS-2.0) ──────────────────────────────────────────
// Sin traza no hay estado (I-05, TR-01). Todo Estado de Capacidad y todo
// hallazgo se construyen AQUÍ, para que sea imposible emitir uno sin sus
// coordenadas: la traza se genera con el estado, nunca después (TR-02).

import type { CapacidadId } from './capacidades';
import type {
  CoordenadasVersion,
  Hallazgo,
  RegistroExcluido,
  TipoHallazgo,
  Traza,
} from './resultado';
import { VERSION_MOTOR } from './version';

export interface CorrespondenciaAplicada {
  pruebaId: string;
  referencia: string;
  peso: number;
}

/** Las tres coordenadas del invariante I-11. */
export function coordenadas(versionCatalogo: string, hoyISO: string): CoordenadasVersion {
  return { motor: VERSION_MOTOR, catalogo: versionCatalogo, calculadoEn: hoyISO };
}

/**
 * Construye la traza de una capacidad.
 *
 * Los excluidos se ordenan por id de registro y las correspondencias por
 * prueba: el orden de entrada no debe filtrarse a la salida, o dos análisis
 * equivalentes dejarían de ser comparables.
 */
export function construirTraza(
  capacidad: CapacidadId,
  incluidos: readonly string[],
  excluidos: readonly RegistroExcluido[],
  correspondencias: readonly CorrespondenciaAplicada[],
  coords: CoordenadasVersion
): Traza {
  const porPrueba = new Map<string, CorrespondenciaAplicada>();
  for (const correspondencia of correspondencias) {
    if (!porPrueba.has(correspondencia.pruebaId)) porPrueba.set(correspondencia.pruebaId, correspondencia);
  }

  return {
    capacidad,
    incluidos: [...incluidos].sort(),
    excluidos: [...excluidos].sort((a, b) => a.registroId.localeCompare(b.registroId)),
    correspondencias: [...porPrueba.values()].sort((a, b) => a.pruebaId.localeCompare(b.pruebaId)),
    coordenadas: coords,
  };
}

/**
 * Único constructor de hallazgos del motor.
 *
 * Obliga a los cinco datos que `08-trazabilidad.md` exige: qué prueba lo
 * originó, qué capacidad afecta, qué regla lo activó, qué versión del motor
 * intervino y la fecha. Ninguno es opcional.
 */
export function crearHallazgo(entrada: {
  tipo: TipoHallazgo;
  clave: string;
  regla: string;
  capacidad: CapacidadId | null;
  pruebas?: readonly string[];
  registros?: readonly string[];
  fecha: string;
}): Hallazgo {
  return {
    id: `${entrada.tipo}:${entrada.clave}`,
    tipo: entrada.tipo,
    capacidad: entrada.capacidad,
    pruebas: [...(entrada.pruebas ?? [])].sort(),
    registros: [...(entrada.registros ?? [])].sort(),
    regla: entrada.regla,
    versionMotor: VERSION_MOTOR,
    fecha: entrada.fecha,
  };
}

/** Orden estable por id. */
export function ordenarHallazgos(hallazgos: readonly Hallazgo[]): Hallazgo[] {
  const unicos = new Map<string, Hallazgo>();
  for (const hallazgo of hallazgos) {
    if (!unicos.has(hallazgo.id)) unicos.set(hallazgo.id, hallazgo);
  }
  return [...unicos.values()].sort((a, b) => a.id.localeCompare(b.id));
}
