// ── Etiquetas legibles (Sprint PAS-4.0) ────────────────────────────────────
// Traduce códigos internos a los fragmentos de texto que se inyectan en las
// plantillas. Vive aparte porque es la única pieza con criterio de redacción,
// y conviene poder auditarla sin leer el motor.

import type { DominioId } from '../capacidades';
import { DOMINIOS } from '../capacidades';
import type { EstadoCapacidad } from '../resultado';
import type { LimitacionPKB, NivelEvidencia, Poblacion } from './tipos';

/** «fuerza máxima (A-01)». El código va siempre: sin él no hay traza legible. */
export function etiquetaCapacidad(estado: EstadoCapacidad): string {
  return `${estado.nombre.toLocaleLowerCase('es')} (${estado.capacidad})`;
}

export function etiquetaDominio(dominio: DominioId): string {
  return `${DOMINIOS[dominio].toLocaleLowerCase('es')} (${dominio})`;
}

/** «nivel» es masculino: `moderada` daría una concordancia incorrecta. */
const NIVEL: Readonly<Record<NivelEvidencia, string>> = {
  alta: 'alto',
  moderada: 'moderado',
  baja: 'bajo',
  muy_baja: 'muy bajo',
  insuficiente: 'insuficiente',
};

export function etiquetaNivel(nivel: NivelEvidencia): string {
  return NIVEL[nivel];
}

const POBLACION: Readonly<Record<Poblacion, string>> = {
  atletas: 'atletas',
  elite: 'deportistas de élite',
  recreacionales: 'practicantes recreacionales',
  adultos_mayores: 'adultos mayores',
  ninos: 'niños',
  adolescentes: 'adolescentes',
  rehabilitacion: 'personas en recuperación',
  clinicos: 'poblaciones clínicas',
  mixta: 'poblaciones mixtas',
  general: 'población adulta general',
};

export function etiquetaPoblacion(poblacion: Poblacion): string {
  return POBLACION[poblacion];
}

/**
 * Motivos de exclusión del PAE en lenguaje legible.
 *
 * Se mantienen deliberadamente descriptivos: dicen qué ocurrió con el
 * registro, nunca si el registro era bueno o malo.
 */
const MOTIVO: Readonly<Record<string, string>> = {
  'EL-01_anulado': 'registros anulados',
  'EL-02_fuera_de_vigencia': 'registros fuera de vigencia',
  'EL-03_integridad': 'registros incompletos',
  'EL-04_sin_correspondencia': 'registros sin correspondencia declarada',
  'EL-05_condiciones_ausentes': 'registros sin sus condiciones de toma',
  'EL-06_precondiciones_no_constan': 'registros sin constancia de precondiciones',
  prueba_no_catalogada: 'registros de pruebas no catalogadas',
  contribucion_sin_referencia: 'correspondencias sin referencia',
  capacidad_reservada: 'capacidad fuera de alcance',
};

export function etiquetaMotivo(motivo: string): string {
  return MOTIVO[motivo] ?? 'registros excluidos';
}

const LIMITACION: Readonly<Record<LimitacionPKB, string>> = {
  validez_constructo_no_verificada: 'validez de constructo no verificada',
  especifica_del_ejercicio: 'resultado específico del ejercicio evaluado',
  especifica_del_angulo: 'resultado específico de la posición articular evaluada',
  estimacion_mediada_por_ecuacion: 'resultado estimado mediante ecuación',
  requiere_normalizacion: 'requiere normalización antropométrica',
  contaminada_por_aprendizaje: 'sensible al aprendizaje de la tarea',
  indice_oculta_componentes: 'índice que no expone sus componentes',
  varianza_dominada_por_edad_y_sexo: 'varianza dominada por edad y sexo',
  confundida_por_proporciones_corporales: 'confundida por proporciones corporales',
  alcance_restringido: 'alcance restringido',
  poblacion_restringida: 'población de estudio restringida',
};

export function etiquetaLimitacion(limitacion: LimitacionPKB): string {
  return LIMITACION[limitacion];
}
