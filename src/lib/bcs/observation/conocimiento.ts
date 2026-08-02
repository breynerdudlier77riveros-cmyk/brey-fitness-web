// ── Proyección de la Clinical Knowledge Base (COG v1.0) ────────────────────
// Puente entre la CKB —documentación Markdown en docs/clinical-knowledge-base/—
// y este motor, que debe ser puro y no puede leer ficheros en runtime.
//
// QUÉ TRANSPORTA: autoridad y restricciones. Ficha de origen, claves de
// referencia, nivel de evidencia ya graduado para la población de BREY,
// población del estudio, limitaciones e interpretaciones prohibidas.
//
// QUÉ NO TRANSPORTA: prosa. El texto de las observaciones vive en
// plantillas.ts. La CKB no dicta cómo se redacta, dicta qué está permitido
// afirmar. Duplicar aquí la redacción de la CKB crearía dos versiones del
// mismo conocimiento destinadas a divergir.
//
// ⚠ DEUDA CONOCIDA: esta proyección se mantiene a mano. La CKB (módulo 17)
// prevé un extractor automático en su Fase 2; hasta que exista, un cambio en
// una ficha de la CKB no se propaga solo hasta aquí. Cada entrada declara su
// `fichaCkb` y su `moduloCkb` precisamente para que la comprobación sea
// mecánica cuando se construya ese extractor.

export type NivelEvidencia = 'alto' | 'moderado' | 'bajo' | 'bajo_para_poblacion_brey' | 'insuficiente';

export type Poblacion =
  | 'general_sana'
  | 'entrenada'
  | 'clinica'
  | 'pediatrica'
  | 'no_aplicable'
  | 'no_determinada';

export interface EntradaConocimiento {
  /** Id de la ficha en la CKB. */
  fichaCkb: string;
  /** Módulo de la CKB donde vive. */
  moduloCkb: string;
  nivelEvidencia: NivelEvidencia;
  poblacion: Poblacion;
  /** Claves del registro _evidencia/referencias.yaml. */
  referencias: string[];
  /** Limitaciones que deben acompañar a cualquier afirmación basada en esta ficha. */
  limitaciones: string[];
  /** Interpretaciones que la ficha declara NO admisibles. */
  prohibidas: string[];
}

export const CONOCIMIENTO = {
  LONGITUDINAL_VS_TRANSVERSAL: {
    fichaCkb: 'bia-transversal-vs-longitudinal',
    moduloCkb: '06-bioimpedancia',
    nivelEvidencia: 'moderado',
    poblacion: 'general_sana',
    referencias: ['bia_dxa_longitudinal_ninos_2024', 'bia_dxa_ukbiobank', 'espen_bia_2'],
    limitaciones: [
      'La concordancia individual con densitometría presenta intervalos amplios; el buen comportamiento longitudinal está documentado sobre todo a nivel de grupo.',
    ],
    prohibidas: [
      'Presentar un porcentaje graso obtenido por bioimpedancia como un valor exacto.',
      'Comparar el valor absoluto de una persona con el de otra.',
      'Comparar dos mediciones tomadas con dispositivos distintos.',
    ],
  },

  COMPARTIMENTOS_HIDRICOS: {
    fichaCkb: 'compartimentos-hidricos',
    moduloCkb: '05-agua-corporal',
    nivelEvidencia: 'alto',
    poblacion: 'general_sana',
    referencias: ['espen_bia_1', 'espen_bia_2'],
    limitaciones: [
      'El agua corporal es la variable más volátil del catálogo a corto plazo: ingesta, glucógeno, sudoración y ejercicio previo la modifican en horas.',
    ],
    prohibidas: [
      'Leer un aumento de agua total como ganancia muscular.',
      'Leer una pérdida de agua como pérdida de grasa.',
      'Interpretar una variación de agua sin conocer las condiciones de la medición.',
    ],
  },

  HIPERTROFIA: {
    fichaCkb: 'hipertrofia-muscular',
    moduloCkb: '03-masa-muscular',
    nivelEvidencia: 'moderado',
    poblacion: 'entrenada',
    referencias: ['proximidad_fallo_hipertrofia_2023', 'barakat_recomposicion_2020'],
    limitaciones: [
      'La velocidad y magnitud esperables dependen del historial de entrenamiento, la edad y el punto de partida.',
    ],
    prohibidas: [
      'Atribuir un aumento de masa muscular a una intervención concreta.',
      'Proyectar ganancia futura a partir de dos mediciones.',
      'Interpretar un aumento observado en días como tejido nuevo.',
    ],
  },

  REDUCCION_GRASA: {
    fichaCkb: 'reduccion-masa-grasa',
    moduloCkb: '04-masa-grasa',
    nivelEvidencia: 'moderado',
    poblacion: 'general_sana',
    referencias: ['barakat_recomposicion_2020'],
    limitaciones: [
      'La masa grasa suele derivarse del peso y del porcentaje graso, por lo que hereda el error de ambos.',
    ],
    prohibidas: [
      'Atribuir la pérdida a una intervención concreta.',
      'Proyectar la pérdida futura.',
      'Leer un descenso del porcentaje graso como pérdida de grasa sin comprobar la masa absoluta.',
    ],
  },

  RECOMPOSICION: {
    fichaCkb: 'patron-recomposicion',
    moduloCkb: '09-patrones-de-cambio',
    nivelEvidencia: 'moderado',
    poblacion: 'entrenada',
    referencias: ['barakat_recomposicion_2020'],
    limitaciones: [
      'El fenómeno está documentado de forma más robusta en personas no entrenadas previamente y con mayor porcentaje graso inicial.',
      'La evidencia no permite anticipar una magnitud para una persona concreta.',
    ],
    prohibidas: [
      'Calificar el patrón como favorable: depende de un objetivo que el dato no contiene.',
      'Afirmar qué proporción del cambio de peso corresponde a tejido graso.',
      'Prometer o proyectar recomposición futura.',
    ],
  },

  ERROR_DE_MEDICION: {
    fichaCkb: 'patron-error-de-medicion',
    moduloCkb: '09-patrones-de-cambio',
    nivelEvidencia: 'alto',
    poblacion: 'no_aplicable',
    referencias: ['espen_bia_2', 'isak_estandares'],
    limitaciones: [
      'La distinción entre cambio real y error de medida no siempre es resoluble con el dato disponible.',
    ],
    prohibidas: [
      'Declarar un fallo del dispositivo como conclusión.',
      'Descartar un dato por inverosímil sin verificarlo.',
    ],
  },

  CONSISTENCIA_INTERNA: {
    fichaCkb: 'consistencia-interna',
    moduloCkb: '11-calidad-de-medicion',
    nivelEvidencia: 'alto',
    poblacion: 'no_aplicable',
    referencias: ['espen_bia_1'],
    limitaciones: [
      'La identidad indica que hay un error, nunca dónde se originó.',
    ],
    prohibidas: [
      'Concluir cuál de los valores implicados es el incorrecto.',
      'Atribuir la inconsistencia a un fallo del dispositivo como conclusión.',
    ],
  },

  ERROR_TECNICO: {
    fichaCkb: 'error-tecnico-de-medida',
    moduloCkb: '11-calidad-de-medicion',
    nivelEvidencia: 'alto',
    poblacion: 'no_aplicable',
    referencias: ['isak_estandares'],
    limitaciones: [
      'No se ha verificado un error técnico de medida publicado para las variables derivadas de bioimpedancia.',
    ],
    prohibidas: [
      'Interpretar como cambio real una diferencia menor que el error de la técnica.',
    ],
  },

  CLASIFICACION_BLOQUEADA: {
    fichaCkb: 'whr-perimetros',
    moduloCkb: '08-indicadores-antropometricos',
    nivelEvidencia: 'alto',
    poblacion: 'general_sana',
    referencias: ['who_waist_2008'],
    limitaciones: [
      'La validez de los puntos de corte varía por sexo, edad y etnia.',
    ],
    prohibidas: [
      'Trasladar un punto de corte poblacional a una evaluación individual sin su contexto.',
      'Presentar un índice antropométrico como evaluación de riesgo certificada.',
    ],
  },

  SUFICIENCIA_SERIE: {
    fichaCkb: 'bia-condiciones-validez',
    moduloCkb: '06-bioimpedancia',
    nivelEvidencia: 'alto',
    poblacion: 'general_sana',
    referencias: ['espen_bia_2'],
    limitaciones: [
      'La guía condiciona el seguimiento longitudinal a un balance hidroelectrolítico estable e indica interpretarlo con cautela.',
    ],
    prohibidas: [
      'Aplicar los resultados fuera del rango de índice de masa corporal 16-34 sin advertirlo.',
    ],
  },
} as const satisfies Record<string, EntradaConocimiento>;

export type ClaveConocimiento = keyof typeof CONOCIMIENTO;

/** Combina varias fichas: se conserva el nivel de evidencia más débil. */
const ORDEN_EVIDENCIA: Record<NivelEvidencia, number> = {
  alto: 0,
  moderado: 1,
  bajo: 2,
  bajo_para_poblacion_brey: 3,
  insuficiente: 4,
};

export function evidenciaCombinada(claves: readonly ClaveConocimiento[]): NivelEvidencia {
  if (claves.length === 0) return 'insuficiente';
  return claves
    .map((c) => CONOCIMIENTO[c].nivelEvidencia as NivelEvidencia)
    .reduce((peor, actual) => (ORDEN_EVIDENCIA[actual] > ORDEN_EVIDENCIA[peor] ? actual : peor));
}

/** Población combinada: si las fichas discrepan, no se determina. */
export function poblacionCombinada(claves: readonly ClaveConocimiento[]): Poblacion {
  const unicas = new Set(claves.map((c) => CONOCIMIENTO[c].poblacion as Poblacion));
  unicas.delete('no_aplicable');
  if (unicas.size === 0) return 'no_aplicable';
  if (unicas.size === 1) return [...unicas][0];
  return 'no_determinada';
}
