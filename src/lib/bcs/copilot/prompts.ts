// ── Contratos de prompt (Sprint BCS-6.0) ───────────────────────────────────
// Este archivo NO ejecuta ningún modelo de lenguaje, no hace red y no tiene
// dependencias. Define el contrato que un LLM tendría que cumplir el día en
// que sustituyera la composición determinista de `render.ts`.
//
// Existe por la misma razón que el COG dejó preparado el suyo: cuando llegue
// ese momento, el contrato de entrada y salida no debe cambiar, y las
// restricciones no deben renegociarse. Escribirlas ahora, con el sistema
// determinista funcionando, evita que se relajen para que «el modelo escriba
// mejor».

import type { TipoEntregable } from './tipos';

export interface ContratoPrompt {
  tipo: TipoEntregable;
  /** Rol que el modelo asumiría. Nunca «experto clínico». */
  rol: string;
  /** Datos que puede usar. Cerrado: nada fuera de esta lista. */
  fuentesPermitidas: string[];
  /** Restricciones no negociables. Se verifican con el validador, no por confianza. */
  restricciones: string[];
  /** Forma esperada de la salida. */
  formato: string;
}

const RESTRICCIONES_COMUNES = [
  'No añadir ninguna afirmación que no proceda de las fuentes suministradas.',
  'No emitir diagnóstico, pronóstico, tratamiento, prescripción ni indicación de medicación.',
  'No atribuir causa a ningún cambio observado.',
  'No emitir recomendaciones nutricionales ni de entrenamiento.',
  'No calificar ningún valor como bueno, malo, normal, anormal ni saludable.',
  'No fijar plazos de seguimiento: ninguna fuente documenta periodicidad.',
  'Conservar las limitaciones declaradas: no pueden omitirse para acortar el texto.',
  'La salida se valida con el mismo validador que la composición determinista. Una violación rechaza el resultado completo.',
];

const FUENTES_COMUNES = [
  'BodyCompositionAnalysis (hallazgos, comparaciones, tendencias, avisos, resumen)',
  'RecommendationReport (recomendaciones y ámbitos no cubiertos)',
  'ClinicalObservationReport (observaciones ya redactadas y trazadas)',
  'Clinical Knowledge Base (fichas proyectadas, con su nivel de evidencia y población)',
];

export const CONTRATOS: Record<TipoEntregable, ContratoPrompt> = {
  resumen_ejecutivo: {
    tipo: 'resumen_ejecutivo',
    rol: 'Redactor técnico que sintetiza un informe ya elaborado por otros sistemas.',
    fuentesPermitidas: FUENTES_COMUNES,
    restricciones: [...RESTRICCIONES_COMUNES, 'Respetar la extensión exacta solicitada en palabras.'],
    formato: 'Párrafo continuo, sin encabezados.',
  },
  explicacion_paciente: {
    tipo: 'explicacion_paciente',
    rol: 'Redactor que traduce lenguaje técnico a lenguaje llano sin perder precisión.',
    fuentesPermitidas: FUENTES_COMUNES,
    restricciones: [
      ...RESTRICCIONES_COMUNES,
      'Simplificar la forma, nunca el contenido: no convertir un hecho en un juicio.',
      'No dirigirse al paciente con instrucciones.',
    ],
    formato: 'Secciones con título breve y dos a cuatro frases cada una.',
  },
  guion_consulta: {
    tipo: 'guion_consulta',
    rol: 'Redactor de guion para una devolución oral.',
    fuentesPermitidas: FUENTES_COMUNES,
    restricciones: [...RESTRICCIONES_COMUNES, 'Mantener las cuatro partes: saludo, explicación, cierre y seguimiento.'],
    formato: 'Cuatro secciones fijas, ajustadas a la duración solicitada.',
  },
  faq: {
    tipo: 'faq',
    rol: 'Redactor de respuestas breves fundamentadas en una base de conocimiento cerrada.',
    fuentesPermitidas: ['Clinical Knowledge Base exclusivamente'],
    restricciones: [
      ...RESTRICCIONES_COMUNES,
      'Toda respuesta debe citar la ficha de la base de conocimiento que la sostiene.',
      'Si la base no cubre la pregunta, declararlo en lugar de responder.',
    ],
    formato: 'Pregunta seguida de respuesta y de su límite explícito.',
  },
  correo: {
    tipo: 'correo',
    rol: 'Redactor de correspondencia profesional de coordinación.',
    fuentesPermitidas: FUENTES_COMUNES,
    restricciones: [
      ...RESTRICCIONES_COMUNES,
      'No reproducir hallazgos clínicos: el mensaje anuncia el informe y remite a él.',
    ],
    formato: 'Asunto y cuerpo, con firma neutra si no se conoce el nombre del profesional.',
  },
  whatsapp: {
    tipo: 'whatsapp',
    rol: 'Redactor de mensajería breve de coordinación.',
    fuentesPermitidas: FUENTES_COMUNES,
    restricciones: [
      ...RESTRICCIONES_COMUNES,
      'Sin emojis de ningún tipo.',
      'No reproducir hallazgos clínicos.',
    ],
    formato: 'Entre una y cuatro líneas.',
  },
  nota_soap: {
    tipo: 'nota_soap',
    rol: 'Redactor de nota estructurada para historia clínica.',
    fuentesPermitidas: FUENTES_COMUNES,
    restricciones: [
      ...RESTRICCIONES_COMUNES,
      'El apartado Assessment solo puede resumir la salida del motor de análisis.',
      'El apartado Subjective se declara no registrado: el sistema no captura relato del paciente.',
      'El apartado Plan solo admite acciones administrativas sobre el registro.',
    ],
    formato: 'Cuatro apartados: S, O, A, P.',
  },
  presentacion: {
    tipo: 'presentacion',
    rol: 'Redactor de material de apoyo para una consulta.',
    fuentesPermitidas: FUENTES_COMUNES,
    restricciones: [...RESTRICCIONES_COMUNES, 'Contenido idéntico en todos los soportes.'],
    formato: 'Diapositivas con título y viñetas breves.',
  },
  material_educativo: {
    tipo: 'material_educativo',
    rol: 'Redactor de material divulgativo sobre conceptos de composición corporal.',
    fuentesPermitidas: ['Clinical Knowledge Base exclusivamente'],
    restricciones: [
      ...RESTRICCIONES_COMUNES,
      'Cada concepto debe incluir qué no puede concluirse: esa parte nunca se omite.',
      'No referirse a los datos de ninguna persona concreta.',
    ],
    formato: 'Un bloque por concepto, con tres apartados fijos.',
  },
  documento_impresion: {
    tipo: 'documento_impresion',
    rol: 'Selector de secciones de un reporte ya existente.',
    fuentesPermitidas: ['Professional Report System'],
    restricciones: [
      ...RESTRICCIONES_COMUNES,
      'No reescribir el reporte: únicamente seleccionar qué secciones se imprimen.',
    ],
    formato: 'Índice de secciones a incluir.',
  },
};

/** Serializa un contrato como instrucción de sistema, sin ejecutarlo. */
export function renderizarContrato(tipo: TipoEntregable): string {
  const c = CONTRATOS[tipo];
  return [
    `ROL: ${c.rol}`,
    `FORMATO: ${c.formato}`,
    'FUENTES PERMITIDAS (cerrado):',
    ...c.fuentesPermitidas.map((f) => `  - ${f}`),
    'RESTRICCIONES (no negociables):',
    ...c.restricciones.map((r) => `  - ${r}`),
  ].join('\n');
}
