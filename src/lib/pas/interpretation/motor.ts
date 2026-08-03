// ── Motor del PIE (Sprint PAS-4.0) ─────────────────────────────────────────
// Cinco pasos en orden fijo, sobre un Perfil Funcional YA construido:
//
//   1 · indexar la PKB por capacidad
//   2 · interpretar cada capacidad
//   3 · interpretar dominios, cobertura y consistencia
//   4 · interpretar metodología
//   5 · repartir en bloques
//
// No recalcula nada del PAE. No lee registros. No consulta el reloj.

import type { CapacidadId } from '../capacidades';
import type { PerformanceAnalysis } from '../resultado';
import * as bloques from './bloques';
import { VERSION_PIE } from './version';
import {
  calcularCobertura,
  interpretarCobertura,
  interpretarConsistencia,
  interpretarDominios,
  interpretarMetodologia,
} from './reglas-perfil';
import { interpretarCapacidad } from './reglas-capacidad';
import { ordenarYDeduplicar } from './prioridad';
import { TOTAL_REGLAS } from './reglas';
import type {
  ConocimientoPKB,
  FichaPKB,
  Interpretacion,
  PerformanceInterpretationReport,
} from './tipos';

export function indexarPKB(pkb: ConocimientoPKB): Map<CapacidadId, FichaPKB[]> {
  const indice = new Map<CapacidadId, FichaPKB[]>();
  for (const ficha of pkb.fichas) {
    const lista = indice.get(ficha.capacidad) ?? [];
    lista.push(ficha);
    indice.set(ficha.capacidad, lista);
  }
  // Orden estable dentro de cada capacidad: el orden de la PKB no debe
  // filtrarse a la salida.
  for (const lista of indice.values()) lista.sort((a, b) => a.id.localeCompare(b.id));
  return indice;
}

/** Hallazgos del PAE agrupados por la capacidad a la que se refieren. */
export function indexarHallazgos(analisis: PerformanceAnalysis): Map<CapacidadId, string[]> {
  const indice = new Map<CapacidadId, string[]>();
  for (const hallazgo of analisis.hallazgos) {
    if (hallazgo.capacidad === null) continue;
    const lista = indice.get(hallazgo.capacidad) ?? [];
    lista.push(hallazgo.id);
    indice.set(hallazgo.capacidad, lista);
  }
  for (const lista of indice.values()) lista.sort();
  return indice;
}

export function ejecutar(
  analisis: PerformanceAnalysis,
  pkb: ConocimientoPKB
): PerformanceInterpretationReport {
  const fichasPorCapacidad = indexarPKB(pkb);
  const hallazgosPorCapacidad = indexarHallazgos(analisis);

  const deCapacidades = analisis.capacidades.flatMap((estado) =>
    interpretarCapacidad({
      estado,
      fichas: fichasPorCapacidad.get(estado.capacidad) ?? [],
      hallazgos: hallazgosPorCapacidad.get(estado.capacidad) ?? [],
    })
  );

  const aplicables = pkb.fichas.filter(
    (f) => f.estado === 'respaldada' || f.estado === 'parcialmente_respaldada'
  ).length;

  const cobertura = calcularCobertura(analisis.capacidades, aplicables);

  const todas: Interpretacion[] = ordenarYDeduplicar([
    ...deCapacidades,
    ...interpretarDominios(analisis.capacidades),
    ...interpretarCobertura(cobertura, pkb),
    ...interpretarConsistencia(analisis.consistencia),
    ...interpretarMetodologia(analisis, pkb, analisis.capacidades),
  ]);

  return {
    meta: {
      versionMotor: VERSION_PIE,
      versionPKB: pkb.version,
      versionPAE: analisis.coordenadas.motor,
      versionCatalogo: analisis.coordenadas.catalogo,
      calculadoEn: analisis.coordenadas.calculadoEn,
      atletaId: analisis.atletaId,
      reglasEvaluadas: TOTAL_REGLAS,
      interpretacionesEmitidas: todas.length,
    },
    resumenEjecutivo: bloques.resumenEjecutivo(todas),
    porCapacidad: bloques.porBloque(todas, 'capacidad'),
    porDominio: bloques.porBloque(todas, 'dominio'),
    hallazgos: bloques.ligadasAHallazgo(todas),
    cobertura,
    interpretacionCobertura: bloques.porBloque(todas, 'cobertura'),
    consistencia: bloques.porBloque(todas, 'consistencia'),
    evidenciaDisponible: bloques.evidenciaDisponible(todas),
    evidenciaInsuficiente: bloques.evidenciaInsuficiente(todas),
    observacionesMetodologicas: bloques.porBloque(todas, 'metodologia'),
    limitaciones: bloques.limitaciones(todas),
  };
}

/** Todas las interpretaciones del informe, sin repetir. Útil para auditar. */
export function todasLasInterpretaciones(
  informe: PerformanceInterpretationReport
): Interpretacion[] {
  return ordenarYDeduplicar([
    ...informe.resumenEjecutivo,
    ...informe.porCapacidad,
    ...informe.porDominio,
    ...informe.interpretacionCobertura,
    ...informe.consistencia,
    ...informe.observacionesMetodologicas,
  ]);
}
