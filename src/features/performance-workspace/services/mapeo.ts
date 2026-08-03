// ── Traducción Workspace → PAE (Sprint PAS-7.0) ────────────────────────────
// Convierte lo que el profesional registró en el DTO de entrada del motor de
// evaluación. Es traducción de forma, no de contenido: ningún valor cambia,
// ninguna regla se aplica.
//
// El Workspace guarda su propio modelo porque persiste cosas que al PAE no le
// importan —estado del expediente, notas, código interno— y porque el PAE no
// debe conocer la base de datos.

import type { EvaluacionPAS, RegistroPrueba } from '@/lib/pas';
import type { Evaluacion, RegistroWorkspace } from '../schemas/tipos';

/**
 * Un registro anulado en el Workspace llega al PAE como anulado, no se omite.
 *
 * Omitirlo haría indistinguible «nunca se registró» de «se registró y se
 * anuló», que es justo la distinción que el PAE existe para conservar.
 */
export function aRegistroPAE(registro: RegistroWorkspace): RegistroPrueba {
  return {
    id: registro.id,
    pruebaId: registro.pruebaId,
    fecha: registro.fecha,
    valor: registro.valor,
    estado: registro.estado,
    condiciones: registro.condiciones,
    precondicionesCumplidas: registro.precondicionesCumplidas,
    patron: registro.patron,
    observaciones: registro.observaciones,
    metadatos: {},
  };
}

export function aEvaluacionPAE(
  evaluacion: Evaluacion,
  registros: readonly RegistroWorkspace[],
  atletaId: string
): EvaluacionPAS {
  return {
    id: evaluacion.id,
    atletaId,
    fecha: evaluacion.fecha,
    tipo: evaluacion.tipo,
    registros: registros.map(aRegistroPAE),
    observaciones: evaluacion.observaciones,
    metadatos: {},
  };
}

/** Varias evaluaciones del mismo atleta, para el análisis acumulado. */
export function aEvaluacionesPAE(
  entradas: readonly { evaluacion: Evaluacion; registros: readonly RegistroWorkspace[] }[],
  atletaId: string
): EvaluacionPAS[] {
  return entradas.map(({ evaluacion, registros }) =>
    aEvaluacionPAE(evaluacion, registros, atletaId)
  );
}
