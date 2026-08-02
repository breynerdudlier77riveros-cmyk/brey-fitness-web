// ── Render (COG v1.0) ──────────────────────────────────────────────────────
// Ensambla las observaciones ya construidas en bloques ordenados.
//
// Es deliberadamente delgado. Si algún día el motor determinista se sustituye
// por un modelo de lenguaje, ESTE es el único archivo que cambiaría: el
// contrato de entrada (Observacion[]) y de salida
// (ClinicalObservationReport) se mantendría intacto, y con él la trazabilidad,
// que seguiría exigiéndose igual.

import { ORDEN_BLOQUES, TITULO_BLOQUE, indiceDeBloque } from './orden';
import { compararPrioridad, prioridadDe } from './prioridad';
import type { BloqueInforme, BloqueObservacion, ClinicalObservationReport, Observacion } from './tipos';

/** Prioridad primero; a igual prioridad, orden estable por id. */
function ordenarDentroDeBloque(observaciones: Observacion[]): Observacion[] {
  return [...observaciones].sort((a, b) => {
    const porPrioridad = compararPrioridad(
      prioridadDe(a.trazabilidad.ruleId),
      prioridadDe(b.trazabilidad.ruleId)
    );
    if (porPrioridad !== 0) return porPrioridad;
    return a.id.localeCompare(b.id);
  });
}

/** Evita que dos observaciones del mismo bloque repitan la misma variable. */
function eliminarRedundanciaDeVariables(observaciones: Observacion[]): Observacion[] {
  const yaMencionadas = new Set<string>();
  return observaciones.map((obs) => {
    const propias = obs.variables.filter((v) => !yaMencionadas.has(v));
    obs.variables.forEach((v) => yaMencionadas.add(v));
    // Se ajusta el listado declarado, nunca el texto: recortar una oración ya
    // redactada produciría prosa incompleta.
    return { ...obs, variables: propias };
  });
}

export function ensamblar(observaciones: Observacion[]): ClinicalObservationReport {
  const porBloque = {} as Record<BloqueObservacion, BloqueInforme>;
  const bloques: BloqueInforme[] = [];
  const bloquesSinDatos: BloqueObservacion[] = [];

  for (const bloque of ORDEN_BLOQUES) {
    const propias = eliminarRedundanciaDeVariables(
      ordenarDentroDeBloque(observaciones.filter((o) => o.bloque === bloque))
    );

    const informe: BloqueInforme = {
      bloque,
      titulo: TITULO_BLOQUE[bloque],
      observaciones: propias,
      estado: propias.length > 0 ? 'emitido' : 'sin_datos',
    };

    porBloque[bloque] = informe;
    bloques.push(informe);
    if (propias.length === 0) bloquesSinDatos.push(bloque);
  }

  bloques.sort((a, b) => indiceDeBloque(a.bloque) - indiceDeBloque(b.bloque));

  return {
    bloques,
    porBloque,
    meta: {
      plantillasEvaluadas: 0, // lo completa el orquestador, que conoce el catálogo
      observacionesEmitidas: observaciones.length,
      bloquesSinDatos,
    },
  };
}
