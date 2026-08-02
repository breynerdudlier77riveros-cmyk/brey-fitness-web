// ── Conocimiento adicional para el copilot (Sprint BCS-6.0) ────────────────
// El Clinical Observation Generator ya proyecta 10 fichas de la CKB, y este
// módulo las REUTILIZA en lugar de copiarlas. Solo añade las que el COG no
// necesitaba y el material educativo y las preguntas frecuentes sí: IMC,
// metabolismo basal, edad metabólica, ángulo de fase y masa libre de grasa.
//
// ⚠ MISMA DEUDA que en el COG: la proyección se mantiene a mano. La CKB
// (módulo 17) prevé un extractor automático en su Fase 2; hasta entonces, un
// cambio en una ficha no se propaga solo hasta aquí. Cada entrada declara su
// ficha y su módulo para que la comprobación sea mecánica cuando exista.

import { CONOCIMIENTO } from '@/lib/bcs/observation';

export interface FichaCopilot {
  fichaCkb: string;
  moduloCkb: string;
  referencias: string[];
  /** Explicación en lenguaje profesional. */
  tecnica: string;
  /** La misma idea, en lenguaje llano. Sin perder precisión. */
  llana: string;
  /** Qué NO puede concluirse. Se muestra siempre junto a la explicación. */
  limite: string;
}

/** Fichas nuevas, no cubiertas por la proyección del COG. */
export const FICHAS_COPILOT = {
  imc: {
    fichaCkb: 'imc',
    moduloCkb: '08-indicadores-antropometricos',
    referencias: ['who_waist_2008'],
    tecnica:
      'Índice que relaciona el peso con la talla al cuadrado. Fue diseñado para describir poblaciones, no para caracterizar individuos, y no distingue de qué tejido procede el peso.',
    llana:
      'Es una cifra que combina el peso y la estatura. Sirve para comparar grupos de personas, pero no distingue si el peso viene de músculo o de grasa.',
    limite:
      'Una persona con mucha masa muscular puede tener un índice alto sin exceso de grasa, así que este valor no se lee solo.',
  },

  metabolismo_basal: {
    fichaCkb: 'metabolismo-basal',
    moduloCkb: '07-metabolismo-basal',
    referencias: ['rmr_atletas_2023'],
    tecnica:
      'Energía que el organismo consume en reposo. La masa libre de grasa es su principal determinante individual. En la mayoría de dispositivos no se mide: se calcula a partir de otras variables ya estimadas.',
    llana:
      'Es la energía que el cuerpo gasta estando en reposo. En la mayoría de básculas no se mide directamente: se calcula a partir de los otros valores.',
    limite:
      'La exactitud de ese cálculo varía mucho según la persona, así que la cifra no equivale a una medición real de laboratorio.',
  },

  edad_metabolica: {
    fichaCkb: 'edad-metabolica',
    moduloCkb: '07-metabolismo-basal',
    referencias: ['edad_metabolica_caidas_2025'],
    tecnica:
      'Cifra propietaria de cada fabricante que compara el metabolismo basal estimado con un promedio poblacional por edad. La evidencia indica que refleja sobre todo la edad cronológica y las propias estimaciones del dispositivo.',
    llana:
      'Es un número que calcula la propia báscula comparando tus valores con un promedio. Cada marca lo calcula a su manera.',
    limite:
      'No representa una edad biológica real, y dos aparatos distintos pueden dar cifras diferentes para la misma persona.',
  },

  angulo_fase: {
    fichaCkb: 'angulo-de-fase',
    moduloCkb: '06-bioimpedancia',
    referencias: ['angulo_fase_criticos_metaanalisis'],
    tecnica:
      'Ángulo derivado de la relación entre resistencia y reactancia. Refleja la contribución relativa de los fluidos y de las membranas celulares.',
    llana:
      'Es un valor que sale de cómo la corriente atraviesa el cuerpo y se relaciona con el estado de las células.',
    limite:
      'La investigación disponible procede de pacientes hospitalizados, no de personas sanas que entrenan, así que aquí se muestra únicamente como un valor que seguir en el tiempo.',
  },

  masa_libre_grasa: {
    fichaCkb: 'masa-libre-de-grasa',
    moduloCkb: '03-masa-muscular',
    referencias: ['espen_bia_1'],
    tecnica:
      'Todo el peso corporal que no es tejido graso: músculo, hueso, órganos y agua. Es una categoría compositiva, no un tejido.',
    llana:
      'Es todo lo que pesa el cuerpo salvo la grasa: músculo, huesos, órganos y agua, todo junto.',
    limite:
      'Como agrupa cosas muy distintas, si sube o baja no indica por sí sola qué componente cambió.',
  },
} as const satisfies Record<string, FichaCopilot>;

export type ClaveFichaCopilot = keyof typeof FICHAS_COPILOT;

/** Fichas heredadas del COG que el copilot también cita. */
export const FICHAS_HEREDADAS = {
  agua: CONOCIMIENTO.COMPARTIMENTOS_HIDRICOS,
  musculo: CONOCIMIENTO.HIPERTROFIA,
  grasa: CONOCIMIENTO.REDUCCION_GRASA,
  medicion: CONOCIMIENTO.LONGITUDINAL_VS_TRANSVERSAL,
  calidad: CONOCIMIENTO.ERROR_TECNICO,
} as const;
