// ── Composición del modelo de vista (Sprint PAS-5.0) ───────────────────────
// El PRS no recalcula: REORDENA. NO deriva capacidades, NO redacta texto y NO
// recorre evaluaciones — de hecho no podría: `PerformanceAnalysis` no contiene
// ninguna, solo estados ya derivados con su traza.
//
// Cada campo de la salida procede de un campo de la entrada. Si algo no está
// en los dos DTO, no aparece en el informe.

import type { CapacidadId } from '../capacidades';
import { CAPACIDADES } from '../capacidades';
import type { PerformanceAnalysis } from '../resultado';
import type { Interpretacion, PerformanceInterpretationReport } from '../interpretation';
import { agruparPorCobertura, agruparPorDominio, agruparPorEvidencia } from './agrupar';
import { ORDEN_NIVELES } from './secciones';
import type {
  ApendiceInforme,
  FilaCapacidad,
  NivelMostrado,
  PerformanceReportViewModel,
  PruebaAplicada,
} from './tipos';

function interpretacionesDe(
  informe: PerformanceInterpretationReport,
  capacidad: CapacidadId
): Interpretacion[] {
  return informe.porCapacidad.filter((i) => i.capacidadesRelacionadas.includes(capacidad));
}

/**
 * El nivel lo declara el PIE. Si ninguna interpretación lo trae, no consta.
 *
 * Se toma el más alto presente, recorriendo en orden descendente: una
 * capacidad alimentada por dos correspondencias se describe por la mejor
 * respaldada, y las reservas de la otra siguen apareciendo en su propia
 * interpretación.
 */
function nivelDe(interpretaciones: readonly Interpretacion[]): NivelMostrado {
  for (const nivel of ORDEN_NIVELES) {
    if (interpretaciones.some((i) => i.nivelEvidencia === nivel)) return nivel;
  }
  return 'no_documentado';
}

export function construirFilas(
  analisis: PerformanceAnalysis,
  informe: PerformanceInterpretationReport
): FilaCapacidad[] {
  return CAPACIDADES.map((definicion) => {
    const estado = analisis.capacidades.find((c) => c.capacidad === definicion.id);
    const interpretaciones = interpretacionesDe(informe, definicion.id);

    return {
      capacidad: definicion.id,
      nombre: definicion.nombre,
      dominio: definicion.dominio,
      estado: estado?.estado ?? 'desconocida',
      reservada: definicion.reservada,
      registrosElegibles: estado?.registrosElegibles ?? 0,
      ultimaFecha: estado?.ultimaFecha ?? null,
      pruebas: (estado?.traza.correspondencias ?? []).map((c) => c.pruebaId),
      nivel: nivelDe(interpretaciones),
      interpretaciones,
    };
  });
}

/**
 * Pruebas aplicadas, leídas de las TRAZAS del análisis.
 *
 * No se recorren evaluaciones —no llegan al PRS— ni se cuentan registros
 * crudos: se agregan los que cada traza declara como incluidos.
 */
export function pruebasAplicadas(analisis: PerformanceAnalysis): PruebaAplicada[] {
  const mapa = new Map<string, PruebaAplicada>();

  for (const estado of analisis.capacidades) {
    for (const correspondencia of estado.traza.correspondencias) {
      const entrada: PruebaAplicada = mapa.get(correspondencia.pruebaId) ?? {
        pruebaId: correspondencia.pruebaId,
        capacidades: [],
        registros: 0,
        ultimaFecha: null,
      };

      if (!entrada.capacidades.includes(estado.capacidad)) {
        entrada.capacidades.push(estado.capacidad);
        entrada.registros += estado.registrosElegibles;
      }

      if (estado.ultimaFecha && (!entrada.ultimaFecha || estado.ultimaFecha > entrada.ultimaFecha)) {
        entrada.ultimaFecha = estado.ultimaFecha;
      }

      mapa.set(correspondencia.pruebaId, entrada);
    }
  }

  return [...mapa.values()].sort((a, b) => a.pruebaId.localeCompare(b.pruebaId));
}

export function construirApendice(
  analisis: PerformanceAnalysis,
  informe: PerformanceInterpretationReport
): ApendiceInforme {
  return {
    pruebas: pruebasAplicadas(analisis),
    versiones: {
      pae: informe.meta.versionPAE,
      pie: informe.meta.versionMotor,
      pkb: informe.meta.versionPKB,
      catalogo: informe.meta.versionCatalogo,
    },
    // Fecha heredada del PAE. El PRS no lee el reloj: si lo hiciera, portada
    // y pie podrían discrepar en un informe generado a medianoche.
    fecha: informe.meta.calculadoEn,
    atletaId: informe.meta.atletaId,
  };
}

export function componerInforme(
  analisis: PerformanceAnalysis,
  informe: PerformanceInterpretationReport
): PerformanceReportViewModel {
  const filas = construirFilas(analisis, informe);

  return {
    filas,
    dominios: agruparPorDominio(filas, informe),
    cobertura: agruparPorCobertura(filas),
    evidencia: agruparPorEvidencia(filas),
    apendice: construirApendice(analisis, informe),
    // Los recuentos son los del PIE, tal cual. Recontarlos aquí abriría la
    // puerta a que el informe y su resumen discrepasen.
    totales: {
      capacidadesActivas: informe.cobertura.capacidadesActivas,
      caracterizadas: informe.cobertura.caracterizadas,
      parciales: informe.cobertura.parciales,
      desactualizadas: informe.cobertura.desactualizadas,
      enConflicto: informe.cobertura.enConflicto,
      desconocidas: informe.cobertura.desconocidas,
      reservadas: informe.cobertura.reservadas,
    },
  };
}
