// ── SSoT de las reglas numéricas del BCS (Sprint I-03) ─────────────────────
// TODO número de este archivo está copiado literalmente de una fuente del
// proyecto y lleva su cita. Nada aquí es criterio propio, redondeo cómodo ni
// valor "razonable": si un umbral no aparece citado abajo, es porque NO
// existe en la documentación y la capa de análisis debe reportarlo como
// `no_definida` / limitación, nunca rellenarlo.
//
// Este archivo NO redefine el catálogo de variables: CATALOGO (reporte.ts)
// sigue siendo la única SSoT de metadatos (etiqueta, unidad, categoría,
// procedencia, dirección de mejora, umbral de insignificancia). Aquí solo
// vive lo que ese catálogo no cubría: rangos físicos, valores imposibles y
// cambios sospechosos del BCS Handbook 03.
//
// ── Reglas documentadas pero NO implementables, y por qué ──────────────────
// Se listan aquí para que la ausencia sea deliberada y auditable, no un
// olvido. Todas provienen de BCS Handbook 03 salvo indicación:
//
//   · Agua intracelular + extracelular ≈ Agua corporal total — la matriz de
//     validaciones cruzadas la exige, pero NO da tolerancia numérica (la de
//     masa sí: ±0.5 kg). Sin tolerancia no hay forma de decidir "≈" sin
//     inventarla.
//   · Rango físico de Agua corporal total — el handbook lo expresa como
//     "35–75% del peso", pero la columna real (`agua_total_l`) está en
//     litros y no existe conversión documentada. Contradicción unidad/dato:
//     no se valida el rango de esta variable.
//   · Masa ósea, "cualquier variación entre mediciones" — la misma frase
//     dice después "una variación notable"; `cualquier` y `notable` no
//     pueden ser ambas ciertas y no hay número que las desempate.
//   · Proteína ("variación abrupta"), Minerales ("variación notable"),
//     Grasa visceral ("salto abrupto"), Ángulo de fase ("cambio abrupto"),
//     WHR ("cambio abrupto") — adjetivo sin cifra.
//   · Circunferencias, ">10 cm entre mediciones cercanas" — el delta está
//     cuantificado pero "cercanas" no; aplicar el umbral sin su ventana
//     cambiaría el sentido de la regla.
//   · BMR, "salto >300 kcal/día sin cambio de peso proporcional" — el salto
//     está cuantificado pero "proporcional" no define ninguna razón.
//   · Impedancia, "fuera del rango típico del dispositivo específico" — el
//     dispositivo no se captura en el modelo.
//   · Clasificaciones de % grasa (sexo+edad), WHR (sexo, OMS) y Grasa
//     visceral (escala del fabricante) — BCS Handbook 06 las define pero
//     `Cliente`/`Medicion` no capturan sexo, edad ni dispositivo. Ya
//     documentado en BLOQUEO_CLASIFICACION (reporte.ts); esta capa lo
//     reexpone como limitación estructurada.

import type { VariableId } from '@/lib/bcs/reporte';

/**
 * Rango físicamente válido por variable (BCS Handbook 03, "Rango físico
 * válido"). `orientativo: true` copia el propio adjetivo del handbook: para
 * esas variables el rango es una referencia, no un límite duro — quedar
 * fuera se reporta como nota, nunca como error.
 */
export interface RangoFisico {
  min: number;
  max: number;
  orientativo: boolean;
}

export const RANGO_FISICO: Partial<Record<VariableId, RangoFisico>> = {
  altura_cm: { min: 100, max: 230, orientativo: false },
  peso_kg: { min: 20, max: 300, orientativo: false },
  imc: { min: 10, max: 80, orientativo: false },
  grasa_pct: { min: 3, max: 60, orientativo: false },
  masa_grasa_kg: { min: 1, max: 150, orientativo: false },
  masa_muscular_kg: { min: 10, max: 90, orientativo: false },
  masa_libre_grasa_kg: { min: 15, max: 200, orientativo: false },
  masa_osea_kg: { min: 1.5, max: 5.5, orientativo: false },
  angulo_fase_deg: { min: 2, max: 12, orientativo: true },
  proteina_kg: { min: 2, max: 25, orientativo: true },
  minerales_kg: { min: 1.5, max: 6, orientativo: true },
  bmr_kcal: { min: 800, max: 3500, orientativo: true },
  edad_metabolica: { min: 10, max: 99, orientativo: true },
  smi: { min: 4, max: 15, orientativo: true },
  circ_cintura_cm: { min: 40, max: 200, orientativo: true },
  circ_cadera_cm: { min: 50, max: 200, orientativo: true },
  whr: { min: 0.6, max: 1.3, orientativo: true },
  impedancia_ohm: { min: 300, max: 1200, orientativo: true },
  // agua_total_l: sin entrada — contradicción de unidad (ver cabecera).
  // grasa_visceral_idx: sin entrada — "no existe un rango universal" (BCS-V14).
  // agua_intracelular_l / agua_extracelular_l: su límite es relativo
  // (< agua total), no un rango fijo — se valida en VALOR_IMPOSIBLE.
};

/**
 * Límites que hacen el valor físicamente imposible (BCS Handbook 03, "Valor
 * imposible"). A diferencia del rango, esto sí es un error del dato.
 */
export interface LimiteImposible {
  /** El valor es imposible si es <= a esto. */
  menorOIgualA?: number;
  /** El valor es imposible si es < a esto. */
  menorA?: number;
  /** El valor es imposible si es > a esto. */
  mayorA?: number;
  /** El valor es imposible si supera el peso total (variables de masa absoluta). */
  noSuperaPeso?: boolean;
  /** El valor es imposible si supera el agua corporal total. */
  noSuperaAguaTotal?: boolean;
}

export const VALOR_IMPOSIBLE: Partial<Record<VariableId, LimiteImposible>> = {
  altura_cm: { menorOIgualA: 0, mayorA: 250 },
  peso_kg: { menorOIgualA: 0, mayorA: 400 },
  imc: { menorOIgualA: 0 },
  grasa_pct: { menorOIgualA: 0, mayorA: 70 },
  masa_grasa_kg: { menorA: 0, noSuperaPeso: true },
  masa_muscular_kg: { menorA: 0, noSuperaPeso: true },
  masa_libre_grasa_kg: { menorA: 0, noSuperaPeso: true },
  masa_osea_kg: { menorOIgualA: 0, mayorA: 8, noSuperaPeso: true },
  proteina_kg: { menorA: 0, noSuperaPeso: true },
  minerales_kg: { menorOIgualA: 0, mayorA: 10 },
  grasa_visceral_idx: { menorA: 0 },
  angulo_fase_deg: { menorOIgualA: 0, mayorA: 20 },
  agua_intracelular_l: { menorA: 0, noSuperaAguaTotal: true },
  agua_extracelular_l: { menorA: 0, noSuperaAguaTotal: true },
  bmr_kcal: { menorOIgualA: 0, mayorA: 5000 },
  edad_metabolica: { menorOIgualA: 0, mayorA: 120 },
  smi: { menorOIgualA: 0 },
  circ_cintura_cm: { menorOIgualA: 0, mayorA: 250 },
  circ_cadera_cm: { menorOIgualA: 0, mayorA: 250 },
  whr: { menorOIgualA: 0 },
  impedancia_ohm: { menorOIgualA: 0 },
};

/**
 * Cambios marcados como sospechosos entre dos Mediciones (BCS Handbook 03,
 * "Valor sospechoso"). SOLO las reglas con umbral Y ventana temporal
 * completamente cuantificados — el resto está en la lista de no
 * implementables de la cabecera.
 *
 * `ventanaDias: null` = el handbook no condiciona la regla a un plazo
 * (altura y edad metabólica), no que la ventana se haya omitido.
 */
export interface CambioSospechoso {
  /** `absoluto` compara |Δ| en la unidad de la variable; `porcentual`, |Δ| relativo al valor anterior. */
  tipo: 'absoluto' | 'porcentual';
  umbral: number;
  ventanaDias: number | null;
  /** Texto mostrado al usuario cuando la regla se dispara. */
  descripcion: string;
}

export const CAMBIO_SOSPECHOSO: Partial<Record<VariableId, CambioSospechoso>> = {
  altura_cm: {
    tipo: 'absoluto',
    umbral: 3,
    ventanaDias: null,
    descripcion: 'La altura cambió más de 3 cm entre dos registros de un mismo adulto.',
  },
  peso_kg: {
    tipo: 'porcentual',
    umbral: 10,
    ventanaDias: 7,
    descripcion: 'El peso varió más de 10 % respecto a la medición anterior en menos de una semana.',
  },
  grasa_pct: {
    tipo: 'absoluto',
    umbral: 5,
    ventanaDias: 14,
    descripcion: 'El porcentaje de grasa varió más de 5 puntos en menos de dos semanas.',
  },
  masa_muscular_kg: {
    tipo: 'absoluto',
    umbral: 3,
    ventanaDias: 14,
    descripcion: 'La masa muscular varió más de 3 kg en menos de dos semanas.',
  },
  edad_metabolica: {
    tipo: 'absoluto',
    umbral: 10,
    ventanaDias: null,
    descripcion: 'La edad metabólica saltó más de 10 años entre mediciones consecutivas.',
  },
};

/**
 * IMC sospechoso (BCS-V03): ">15 % entre mediciones consecutivas sin cambio
 * de altura ni peso reportado". Va aparte de CAMBIO_SOSPECHOSO porque su
 * condición no es solo un delta: exige además que altura y peso NO hayan
 * cambiado, algo que sí es verificable con los datos disponibles.
 */
export const IMC_SOSPECHOSO_PCT = 15;

/**
 * Matriz de validaciones cruzadas (BCS Handbook 03). Única tolerancia
 * numérica publicada en toda la matriz. Mismo valor que TOLERANCIA_MASA_KG
 * en reporte.ts, que ya implementa esta validación para el Reporte; aquí se
 * reutiliza el número para expresarla como hallazgo estructurado.
 */
export const TOLERANCIA_SUMA_MASAS_KG = 0.5;

/**
 * Variables de masa absoluta que no pueden superar el Peso — el handbook lo
 * clasifica como error bloqueante, no como advertencia.
 */
export const MASAS_ACOTADAS_POR_PESO: VariableId[] = [
  'masa_grasa_kg',
  'masa_muscular_kg',
  'masa_osea_kg',
  'masa_libre_grasa_kg',
  'proteina_kg',
];

/**
 * Variables cuya clasificación existe en la especificación (BCS Handbook 06)
 * pero hoy no puede calcularse por falta de un dato en el modelo. El motivo
 * canónico vive en BLOQUEO_CLASIFICACION (reporte.ts) — aquí solo se
 * enumeran para poder emitir la limitación correspondiente sin duplicar los
 * textos.
 */
export const CLASIFICACION_BLOQUEADA: VariableId[] = ['grasa_pct', 'whr', 'grasa_visceral_idx'];
