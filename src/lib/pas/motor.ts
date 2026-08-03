// ── Motor: tubería de derivación (Sprint PAS-2.0) ──────────────────────────
// Seis pasos en orden fijo. Cada uno consume solo lo que produjeron los
// anteriores, sin volver atrás y sin efectos: el motor es una función, no un
// proceso.
//
//   1 · indexar catálogo
//   2 · detectar conflictos
//   3 · derivar los 20 Estados de Capacidad (con su traza)
//   4 · generar hallazgos
//   5 · evaluar consistencia
//   6 · generar limitaciones

import type { CapacidadId } from './capacidades';
import { detectarConflictos, registrosDivergentes } from './conflictos';
import { evaluarConsistencia } from './consistencia';
import { derivarCapacidades } from './derivacion';
import { agrupar, esDuplicadoExacto, idsDe } from './duplicados';
import { generarHallazgos } from './hallazgos';
import { generarLimitaciones } from './limitaciones';
import { coordenadas } from './trazabilidad';
import type { CatalogoPruebas, DefinicionPrueba, SolicitudAnalisis } from './tipos';
import type { PerformanceAnalysis, ResumenAnalisis, EstadoCapacidadValor } from './resultado';

/** Índice por id de prueba. La última definición gana, y el duplicado se reporta. */
export function indexarCatalogo(catalogo: CatalogoPruebas): Map<string, DefinicionPrueba> {
  return new Map(catalogo.pruebas.map((p) => [p.id, p]));
}

export function indexarCobertura(catalogo: CatalogoPruebas): Map<CapacidadId, string[]> {
  return new Map((catalogo.cobertura ?? []).map((c) => [c.capacidad, c.pruebasRequeridas]));
}

function contarPorEstado(
  estados: readonly { estado: EstadoCapacidadValor }[]
): Record<EstadoCapacidadValor, number> {
  const conteo: Record<EstadoCapacidadValor, number> = {
    evaluada: 0,
    parcialmente_evaluada: 0,
    desactualizada: 0,
    en_conflicto: 0,
    desconocida: 0,
  };
  for (const estado of estados) conteo[estado.estado] += 1;
  return conteo;
}

export function ejecutar(solicitud: SolicitudAnalisis): PerformanceAnalysis {
  const { atletaId, evaluaciones, catalogo, hoyISO } = solicitud;

  const indice = indexarCatalogo(catalogo);
  const cobertura = indexarCobertura(catalogo);
  const coords = coordenadas(catalogo.version, hoyISO);
  const registros = evaluaciones.flatMap((e) => e.registros);

  const conflictos = detectarConflictos(evaluaciones, catalogo, indice, atletaId, hoyISO);

  const capacidades = derivarCapacidades({
    registros,
    indice,
    cobertura,
    divergentes: registrosDivergentes(conflictos),
    hoyISO,
    coordenadas: coords,
  });

  const duplicados = agrupar(registros).filter(esDuplicadoExacto).map(idsDe);

  const hallazgos = generarHallazgos({
    estados: capacidades,
    evaluaciones,
    duplicados,
    hoyISO,
  });

  const consistencia = evaluarConsistencia({
    estados: capacidades,
    registrosTotales: registros.length,
    conflictos: conflictos.length,
  });

  const limitaciones = generarLimitaciones({
    estados: capacidades,
    evaluaciones,
    conflictos,
    catalogo,
  });

  const excluidos = new Set<string>();
  for (const capacidad of capacidades) {
    for (const excluido of capacidad.traza.excluidos) excluidos.add(excluido.registroId);
  }

  const resumen: ResumenAnalisis = {
    evaluaciones: evaluaciones.length,
    registrosTotales: registros.length,
    registrosElegibles: consistencia.registrosElegibles,
    registrosExcluidos: excluidos.size,
    capacidadesPorEstado: contarPorEstado(capacidades),
    hallazgos: hallazgos.length,
    conflictos: conflictos.length,
    limitaciones: limitaciones.length,
  };

  return {
    atletaId,
    coordenadas: coords,
    capacidades,
    hallazgos,
    conflictos,
    consistencia,
    limitaciones,
    resumen,
  };
}
