// ── Transcripción de la PKB v1.0 (Sprint PAS-4.0) ──────────────────────────
// Traslado MANUAL de `docs/performance-knowledge-base/09-matriz-prueba-capacidad.md`
// a datos. PKB-ADR-08 exige que lo haga una persona y no un parser: así, un
// cambio de redacción en la base no altera en silencio lo que el motor afirma.
//
// Contrapartida asumida: los dos artefactos pueden desincronizarse. Es deuda
// declarada, no un descuido.
//
// NOTA: la fila M-13 de la matriz —sit-and-reach para movilidad lumbar— no se
// transcribe porque su destino no es una capacidad del catálogo del PAS. Se
// deja constancia en vez de forzarla dentro de B-01.

import type { CapacidadId } from '../capacidades';
import type { ConocimientoPKB, FichaPKB, LimitacionPKB, NivelEvidencia, Poblacion } from './tipos';

interface Compacta {
  id: string;
  prueba: string;
  capacidad: CapacidadId;
  nivel: NivelEvidencia;
  poblaciones: Poblacion[];
  alcance: string;
  limitaciones: LimitacionPKB[];
  referencias: string[];
}

/** Ninguna correspondencia de la PKB v1.0 documenta estas tres propiedades. */
const SIN_DOCUMENTAR = {
  sensibilidadDocumentada: false,
  vigenciaDocumentada: false,
  pesoDocumentado: false,
} as const;

function parcial(c: Compacta): FichaPKB {
  return {
    id: c.id, pruebaId: c.prueba, capacidad: c.capacidad,
    estado: 'parcialmente_respaldada', nivelEvidencia: c.nivel,
    poblaciones: c.poblaciones, alcanceAutorizado: c.alcance,
    limitaciones: c.limitaciones, referencias: c.referencias, ...SIN_DOCUMENTAR,
  };
}

function rechazada(
  estado: 'insuficiente' | 'no_recomendada',
  id: string, prueba: string, capacidad: CapacidadId, referencias: string[] = []
): FichaPKB {
  return {
    id, pruebaId: prueba, capacidad, estado, nivelEvidencia: 'insuficiente',
    poblaciones: [], alcanceAutorizado: 'sin alcance autorizado',
    limitaciones: [], referencias, ...SIN_DOCUMENTAR,
  };
}

/** Las 7 correspondencias autorizadas. Ninguna alcanza «respaldada». */
const AUTORIZADAS: readonly FichaPKB[] = [
  parcial({
    id: 'M-01', prueba: 'P-01', capacidad: 'A-01', nivel: 'moderada',
    poblaciones: ['general', 'adultos_mayores'],
    alcance: 'la carga máxima movilizable en el ejercicio evaluado',
    limitaciones: ['validez_constructo_no_verificada', 'especifica_del_ejercicio'],
    referencias: ['grgic_1rm_2020', 'acsm_guidelines_11'],
  }),
  parcial({
    id: 'M-02', prueba: 'P-02', capacidad: 'A-01', nivel: 'moderada',
    poblaciones: ['atletas'],
    alcance: 'el pico de fuerza isométrica en la posición articular evaluada',
    limitaciones: ['especifica_del_angulo', 'validez_constructo_no_verificada', 'poblacion_restringida'],
    referencias: ['grgic_imtp_2022'],
  }),
  parcial({
    id: 'M-03', prueba: 'P-03', capacidad: 'A-05', nivel: 'moderada',
    poblaciones: ['adultos_mayores', 'general'],
    alcance: 'la fuerza isométrica máxima de prensión manual',
    limitaciones: ['varianza_dominada_por_edad_y_sexo', 'alcance_restringido'],
    referencias: ['soysal_hgs_2021', 'bohannon_grip_2019', 'hgs_normas_internacionales'],
  }),
  parcial({
    id: 'M-04', prueba: 'P-05', capacidad: 'A-04', nivel: 'baja',
    poblaciones: ['general'],
    alcance: 'la relación entre altura de salto y tiempo de contacto',
    limitaciones: ['indice_oculta_componentes', 'contaminada_por_aprendizaje'],
    referencias: ['rsi_metaanalisis_2021'],
  }),
  parcial({
    id: 'M-05', prueba: 'P-06', capacidad: 'B-02', nivel: 'baja',
    poblaciones: ['recreacionales', 'adultos_mayores'],
    alcance: 'la extensibilidad isquiosural',
    limitaciones: ['alcance_restringido', 'confundida_por_proporciones_corporales'],
    referencias: ['mayorga_sit_reach_2014'],
  }),
  parcial({
    id: 'M-06', prueba: 'P-07', capacidad: 'C-01', nivel: 'moderada',
    poblaciones: ['ninos', 'adolescentes', 'general'],
    alcance: 'el consumo de oxígeno estimado mediante la ecuación declarada',
    limitaciones: ['estimacion_mediada_por_ecuacion'],
    referencias: ['mayorga_20msr_2015', 'acsm_guidelines_11'],
  }),
  parcial({
    id: 'M-07', prueba: 'P-08', capacidad: 'D-04', nivel: 'moderada',
    poblaciones: ['general', 'atletas'],
    alcance: 'el control postural dinámico',
    limitaciones: ['requiere_normalizacion', 'contaminada_por_aprendizaje'],
    referencias: ['plisky_ybt_2021', 'sebt_ybt_fiabilidad_2019'],
  }),
];

/** Correspondencias que se proponen y la evidencia verificada no sostiene. */
const INSUFICIENTES: readonly FichaPKB[] = [
  rechazada('insuficiente', 'M-08', 'P-04', 'A-03'),
  rechazada('insuficiente', 'M-09', 'P-04', 'A-01'),
  rechazada('insuficiente', 'M-10', 'P-08', 'B-03', ['plisky_ybt_2021']),
  rechazada('insuficiente', 'M-11', 'P-09', 'B-04', ['moran_fms_2017']),
  rechazada('insuficiente', 'M-12', 'P-11', 'D-01'),
];

/** Correspondencias con evidencia en contra o constructo que no corresponde. */
const NO_RECOMENDADAS: readonly FichaPKB[] = [
  rechazada('no_recomendada', 'M-14', 'P-06', 'B-01', ['mayorga_sit_reach_2014']),
  rechazada('no_recomendada', 'M-15', 'P-10', 'D-02', ['sheppard_agility_2006']),
  rechazada('no_recomendada', 'M-16', 'P-09', 'E-01', ['moran_fms_2017']),
  rechazada('no_recomendada', 'M-17', 'P-03', 'A-01', ['bohannon_grip_2019']),
];

export const PKB_V1: ConocimientoPKB = {
  version: 'pkb-1.0.0',
  fichas: [...AUTORIZADAS, ...INSUFICIENTES, ...NO_RECOMENDADAS],
};

export const TOTAL_AUTORIZADAS = AUTORIZADAS.length;
export const TOTAL_RECHAZADAS = INSUFICIENTES.length + NO_RECOMENDADAS.length;
