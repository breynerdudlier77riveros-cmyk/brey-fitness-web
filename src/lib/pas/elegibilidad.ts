// ── Elegibilidad EL-01…EL-06 (Sprint PAS-2.0) ──────────────────────────────
// `09-elegibilidad.md`, literal. Un registro es elegible si cumple las SEIS
// condiciones; el incumplimiento de una sola lo excluye, y el motivo viaja
// hasta la traza (TR-03).
//
// El orden de comprobación es fijo y no es arbitrario: EL-02 va SIEMPRE al
// final para que «excluido por vigencia» implique haber cumplido todo lo
// demás. La derivación se apoya en esa garantía para distinguir una capacidad
// *desactualizada* de una *desconocida*.

import { dentroDeVigencia, esFechaISO } from './fechas';
import type { CapacidadId } from './capacidades';
import { definicionCapacidad } from './capacidades';
import type { Contribucion, DefinicionPrueba, RegistroPrueba } from './tipos';
import type { MotivoExclusion } from './resultado';

export interface ResultadoElegibilidad {
  elegible: boolean;
  motivo: MotivoExclusion | null;
  detalle: Record<string, string>;
}

const ELEGIBLE: ResultadoElegibilidad = { elegible: true, motivo: null, detalle: {} };

function excluido(motivo: MotivoExclusion, detalle: Record<string, string> = {}) {
  return { elegible: false, motivo, detalle };
}

/** EL-03: tiene valor, fecha y prueba identificada. */
function cumpleIntegridad(registro: RegistroPrueba): boolean {
  if (registro.id.trim() === '') return false;
  if (registro.pruebaId.trim() === '') return false;
  if (!esFechaISO(registro.fecha)) return false;
  if (registro.valor === null || registro.valor === undefined) return false;

  // Un continuo/ordinal no finito no es un valor: es la ausencia de uno
  // disfrazada de número.
  if (registro.valor.tipo === 'continuo' || registro.valor.tipo === 'ordinal') {
    return Number.isFinite(registro.valor.valor);
  }
  if (registro.valor.tipo === 'categorico') return registro.valor.valor.trim() !== '';
  return true;
}

/** EL-05: constan las condiciones que la definición exige. */
function condicionesAusentes(
  registro: RegistroPrueba,
  definicion: DefinicionPrueba
): string[] {
  return definicion.condicionesRequeridas.filter((clave) => {
    const valor = registro.condiciones[clave];
    return valor === undefined || valor.trim() === '';
  });
}

/**
 * Elegibilidad independiente de la capacidad: EL-01, EL-03, EL-05, EL-06 y
 * EL-02, más la comprobación de que la prueba esté catalogada.
 */
export function evaluarElegibilidadBase(
  registro: RegistroPrueba,
  definicion: DefinicionPrueba | undefined,
  hoyISO: string
): ResultadoElegibilidad {
  if (!cumpleIntegridad(registro)) {
    return excluido('EL-03_integridad', { registro: registro.id });
  }

  if (!definicion) {
    return excluido('prueba_no_catalogada', { prueba: registro.pruebaId });
  }

  if (registro.estado === 'anulada') {
    return excluido('EL-01_anulado', { registro: registro.id });
  }

  const faltantes = condicionesAusentes(registro, definicion);
  if (faltantes.length > 0) {
    return excluido('EL-05_condiciones_ausentes', { faltantes: faltantes.join(',') });
  }

  // EL-06 falla tanto si las precondiciones no se cumplían como si no consta
  // que se cumplieran. Son casos distintos y ambos excluyen: un registro sin
  // sus precondiciones no es malo, es un registro del que no puede saberse si
  // es bueno.
  if (definicion.exigePrecondiciones && registro.precondicionesCumplidas !== true) {
    return excluido('EL-06_precondiciones_no_constan', {
      registro: registro.id,
      consta: String(registro.precondicionesCumplidas),
    });
  }

  if (!dentroDeVigencia(registro.fecha, hoyISO, definicion.vigenciaDias)) {
    return excluido('EL-02_fuera_de_vigencia', {
      fecha: registro.fecha,
      vigenciaDias: String(definicion.vigenciaDias),
    });
  }

  return ELEGIBLE;
}

/**
 * EL-04: la prueba declara contribución a la capacidad, y esa contribución
 * lleva referencia verificable (I-10).
 *
 * Devuelve la contribución aplicable o el motivo por el que no lo es. Una
 * contribución sin referencia NO se aplica: sería ciencia inventada.
 */
export function contribucionAplicable(
  definicion: DefinicionPrueba,
  capacidad: CapacidadId
): { contribucion: Contribucion } | { motivo: MotivoExclusion } {
  // La ausencia de correspondencia se comprueba PRIMERO, incluso para las
  // capacidades reservadas. Al revés, F-01 y F-02 excluirían explícitamente
  // todos los registros del atleta y su traza dejaría de ser legible: lo
  // pertinente es solo el registro cuya prueba pretendía alimentarlas.
  const declarada = definicion.contribuciones.find((c) => c.capacidad === capacidad);
  if (!declarada) return { motivo: 'EL-04_sin_correspondencia' };

  if (definicionCapacidad(capacidad).reservada) {
    return { motivo: 'capacidad_reservada' };
  }

  if (declarada.referencia === null || declarada.referencia.trim() === '') {
    return { motivo: 'contribucion_sin_referencia' };
  }

  return { contribucion: declarada };
}
