// ── Catálogo de plantillas (COG v1.0) ──────────────────────────────────────
// TODO el texto que este motor puede emitir vive aquí. motor.ts decide QUÉ
// plantilla se activa; este archivo decide CÓMO se lee. No hay concatenación
// libre ni generación abierta: una oración que no esté escrita aquí no puede
// aparecer en el informe.
//
// VOCABULARIO. Este catálogo no contiene: debería, debes, conviene, es
// recomendable, ideal, óptimo, riesgo de, saludable, correcto, incorrecto,
// preocupante, grave, patológico, normal, anormal.
//
// Consecuencia de diseño derivada de lo anterior: las plantillas del bloque
// `recommendation_summary` NO citan el texto de las recomendaciones. El
// Recommendation Engine sí emplea «conviene» en su propia redacción, que es
// legítima allí porque su registro es distinto. Citarlo aquí introduciría
// vocabulario prohibido por la puerta de atrás, así que este motor resume las
// recomendaciones por categoría y prioridad, con su prosa propia.

import type { BloqueObservacion } from './tipos';
import type { ClaveConocimiento } from './conocimiento';
import type { VariableId } from '@/lib/bcs/reporte';

/** Una activación concreta de una plantilla sobre unas entradas concretas. */
export interface Activacion {
  /** Distingue varias activaciones de la misma plantilla. */
  discriminante?: string;
  /** Entre 2 y 5 oraciones. El constructor lo verifica. */
  oraciones: string[];
  variables: VariableId[];
  findingIds: string[];
  recommendationIds: string[];
}

export interface Plantilla {
  id: string;
  bloque: BloqueObservacion;
  /** Documentación del catálogo: qué necesita para activarse. */
  variablesRequeridas: string;
  condiciones: string;
  /** Variantes de redacción que la plantilla puede producir. */
  variantes: string[];
  restricciones: string[];
  /** Fichas de la CKB que autorizan lo que esta plantilla afirma. */
  conocimiento: ClaveConocimiento[];
}

/**
 * Metadatos del catálogo. La lógica de activación vive en motor.ts; aquí solo
 * la descripción, para que el catálogo sea auditable sin leer código.
 */
export const PLANTILLAS: Record<string, Plantilla> = {
  // ── Executive ────────────────────────────────────────────────────────────
  'E-01-alcance-analisis': {
    id: 'E-01-alcance-analisis',
    bloque: 'executive',
    variablesRequeridas: 'cantidadMediciones, suficiencia',
    condiciones: 'Siempre. Encabeza el informe declarando qué permite afirmar la serie.',
    variantes: ['sin mediciones', 'una medición', 'dos mediciones', 'tres o más'],
    restricciones: ['No adelanta ningún hallazgo concreto.'],
    conocimiento: ['SUFICIENCIA_SERIE', 'LONGITUDINAL_VS_TRANSVERSAL'],
  },

  // ── Body composition ─────────────────────────────────────────────────────
  'BC-01-cambio-significativo': {
    id: 'BC-01-cambio-significativo',
    bloque: 'body_composition',
    variablesRequeridas: 'hallazgos de cambio con suficiencia `suficiente`',
    condiciones: 'Existe al menos un cambio que supera el umbral documentado.',
    variantes: ['una variable', 'varias variables'],
    restricciones: [
      'No califica la dirección del cambio.',
      'No atribuye causa.',
    ],
    conocimiento: ['LONGITUDINAL_VS_TRANSVERSAL'],
  },

  'BC-02-cambio-sin-umbral': {
    id: 'BC-02-cambio-sin-umbral',
    bloque: 'body_composition',
    variablesRequeridas: 'hallazgos de cambio con suficiencia `parcial`',
    condiciones: 'Hay variación en variables sin umbral documentado.',
    variantes: ['una variable', 'varias variables'],
    restricciones: ['No afirma que el cambio sea relevante ni irrelevante.'],
    conocimiento: ['LONGITUDINAL_VS_TRANSVERSAL'],
  },

  'BC-03-sin-variacion': {
    id: 'BC-03-sin-variacion',
    bloque: 'body_composition',
    variablesRequeridas: 'comparaciones con significancia `insignificante`',
    condiciones: 'Hay variables con umbral definido que se movieron por debajo de él.',
    variantes: ['única'],
    restricciones: ['No afirma ausencia de cambio real, solo cambio bajo el umbral.'],
    conocimiento: ['LONGITUDINAL_VS_TRANSVERSAL', 'ERROR_TECNICO'],
  },

  'BC-04-coocurrencia-peso-grasa': {
    id: 'BC-04-coocurrencia-peso-grasa',
    bloque: 'body_composition',
    variablesRequeridas: 'hallazgos de cambio en peso_kg y grasa_pct',
    condiciones: 'Ambas variables cambiaron en la misma dirección.',
    variantes: ['ambas a la baja', 'ambas al alza'],
    restricciones: [
      'NUNCA afirma predominancia: no dice que la pérdida fuera «principalmente grasa».',
      'Describe coincidencia, no proporción.',
    ],
    conocimiento: ['REDUCCION_GRASA', 'COMPARTIMENTOS_HIDRICOS'],
  },

  // ── Trend ────────────────────────────────────────────────────────────────
  'T-01-serie-con-direccion': {
    id: 'T-01-serie-con-direccion',
    bloque: 'trend',
    variablesRequeridas: 'tendencias con estado ascendente o descendente y suficiencia `suficiente`',
    condiciones: 'Al menos tres mediciones con la variable presente.',
    variantes: ['una serie', 'varias series'],
    restricciones: ['No proyecta. Describe lo registrado.'],
    conocimiento: ['LONGITUDINAL_VS_TRANSVERSAL'],
  },

  'T-02-serie-variable': {
    id: 'T-02-serie-variable',
    bloque: 'trend',
    variablesRequeridas: 'tendencias con estado `variable`',
    condiciones: 'La serie sube y baja sin dirección sostenida.',
    variantes: ['única'],
    restricciones: ['No interpreta la oscilación.'],
    conocimiento: ['LONGITUDINAL_VS_TRANSVERSAL', 'COMPARTIMENTOS_HIDRICOS'],
  },

  'T-03-historico-insuficiente': {
    id: 'T-03-historico-insuficiente',
    bloque: 'trend',
    variablesRequeridas: 'cantidadMediciones < 3',
    condiciones: 'La serie no alcanza para describir evolución sostenida.',
    variantes: ['sin histórico', 'histórico parcial'],
    restricciones: [],
    conocimiento: ['SUFICIENCIA_SERIE'],
  },

  // ── Measurement quality ──────────────────────────────────────────────────
  'MQ-01-inconsistencia-interna': {
    id: 'MQ-01-inconsistencia-interna',
    bloque: 'measurement_quality',
    variablesRequeridas: 'avisos de tipo alerta sobre consistencia',
    condiciones: 'Una identidad aditiva del modelo no se cumple.',
    variantes: ['única'],
    restricciones: [
      'No señala qué valor concreto es el erróneo.',
      'No atribuye la causa al dispositivo.',
    ],
    conocimiento: ['CONSISTENCIA_INTERNA'],
  },

  'MQ-02-variacion-implausible': {
    id: 'MQ-02-variacion-implausible',
    bloque: 'measurement_quality',
    variablesRequeridas: 'avisos de cambio sospechoso o valor fuera de rango',
    condiciones: 'Una variación excede lo esperable para el intervalo transcurrido.',
    variantes: ['una incidencia', 'varias incidencias'],
    restricciones: ['No concluye error: señala para verificación.'],
    conocimiento: ['ERROR_DE_MEDICION', 'ERROR_TECNICO'],
  },

  'MQ-03-sin-incidencias': {
    id: 'MQ-03-sin-incidencias',
    bloque: 'measurement_quality',
    variablesRequeridas: 'ausencia de avisos de tipo alerta',
    condiciones: 'Ninguna comprobación de consistencia falló.',
    variantes: ['única'],
    restricciones: [
      'No afirma que la medición sea exacta: solo que no falló ninguna comprobación.',
    ],
    conocimiento: ['CONSISTENCIA_INTERNA', 'ERROR_TECNICO'],
  },

  // ── Interpretation ───────────────────────────────────────────────────────
  'I-01-compatible-hidratacion': {
    id: 'I-01-compatible-hidratacion',
    bloque: 'interpretation',
    variablesRequeridas: 'cambio en peso_kg o agua_total_l en intervalo corto',
    condiciones: 'Intervalo entre mediciones igual o menor a 14 días con cambio registrado.',
    variantes: ['única'],
    restricciones: [
      'Enuncia compatibilidad, nunca causa.',
      'No descarta el cambio de tejido.',
    ],
    conocimiento: ['COMPARTIMENTOS_HIDRICOS'],
  },

  'I-02-patron-recomposicion': {
    id: 'I-02-patron-recomposicion',
    bloque: 'interpretation',
    variablesRequeridas: 'hallazgos de cambio en masa_muscular_kg y grasa_pct o masa_grasa_kg',
    condiciones: 'Masa muscular al alza y masa grasa o porcentaje graso a la baja.',
    variantes: ['única'],
    restricciones: [
      'Enuncia compatibilidad con el patrón descrito, nunca lo confirma.',
      'NUNCA lo califica como favorable.',
      'NUNCA cuantifica qué proporción del cambio corresponde a cada tejido.',
    ],
    conocimiento: ['RECOMPOSICION', 'HIPERTROFIA', 'REDUCCION_GRASA'],
  },

  'I-03-clasificacion-no-disponible': {
    id: 'I-03-clasificacion-no-disponible',
    bloque: 'interpretation',
    variablesRequeridas: 'avisos de tipo limitación sobre clasificación',
    condiciones: 'Una variable presente no puede clasificarse por datos ausentes en el modelo.',
    variantes: ['una variable', 'varias variables'],
    restricciones: ['No sugiere qué clasificación tendría.'],
    conocimiento: ['CLASIFICACION_BLOQUEADA'],
  },

  // ── Recommendation summary ───────────────────────────────────────────────
  'RS-01-acciones-prioritarias': {
    id: 'RS-01-acciones-prioritarias',
    bloque: 'recommendation_summary',
    variablesRequeridas: 'recomendaciones de prioridad alta',
    condiciones: 'El Recommendation Engine emitió al menos una de prioridad alta.',
    variantes: ['una', 'varias'],
    restricciones: [
      'NO cita el texto literal de la recomendación: lo resume con prosa propia.',
    ],
    conocimiento: ['CONSISTENCIA_INTERNA'],
  },

  'RS-02-continuidad': {
    id: 'RS-02-continuidad',
    bloque: 'recommendation_summary',
    variablesRequeridas: 'recomendaciones de categoría seguimiento o medición',
    condiciones: 'Existen recomendaciones sobre continuidad del registro.',
    variantes: ['única'],
    restricciones: ['No fija plazos: ninguna fuente documenta periodicidad.'],
    conocimiento: ['SUFICIENCIA_SERIE'],
  },

  'RS-03-sin-recomendaciones': {
    id: 'RS-03-sin-recomendaciones',
    bloque: 'recommendation_summary',
    variablesRequeridas: 'ninguna recomendación emitida',
    condiciones: 'El catálogo de reglas no activó ninguna.',
    variantes: ['única'],
    restricciones: [],
    conocimiento: [],
  },

  // ── Scientific limitations ───────────────────────────────────────────────
  'SL-01-ambitos-no-cubiertos': {
    id: 'SL-01-ambitos-no-cubiertos',
    bloque: 'scientific_limitations',
    variablesRequeridas: 'limitaciones de alcance del Recommendation Engine',
    condiciones: 'Siempre que existan ámbitos declarados sin cobertura.',
    variantes: ['única'],
    restricciones: [],
    conocimiento: [],
  },

  'SL-02-limites-tecnica': {
    id: 'SL-02-limites-tecnica',
    bloque: 'scientific_limitations',
    variablesRequeridas: 'ninguna',
    condiciones: 'Siempre que se haya emitido alguna observación de composición.',
    variantes: ['única'],
    restricciones: [],
    conocimiento: ['LONGITUDINAL_VS_TRANSVERSAL', 'ERROR_TECNICO'],
  },

  // ── Overall summary ──────────────────────────────────────────────────────
  'OS-01-cierre': {
    id: 'OS-01-cierre',
    bloque: 'overall_summary',
    variablesRequeridas: 'recuento de observaciones emitidas',
    condiciones: 'Siempre.',
    variantes: ['con hallazgos', 'sin hallazgos'],
    restricciones: ['No introduce contenido nuevo: recapitula.'],
    conocimiento: ['SUFICIENCIA_SERIE'],
  },
};

export const TOTAL_PLANTILLAS = Object.keys(PLANTILLAS).length;

/**
 * Casos que este catálogo RECHAZA implementar de forma deliberada.
 *
 * No son funciones pendientes: son afirmaciones que la Clinical Knowledge Base
 * declara no admisibles. Se registran aquí para que el rechazo sea auditable y
 * para que nadie los añada más adelante creyendo que faltaban.
 */
export const CASOS_RECHAZADOS = [
  {
    caso: 'Pérdida predominante de grasa',
    motivo:
      'Afirmar predominancia exige demostrar la proporción entre pérdida grasa y magra, y ninguna regla la establece. La ficha patron-recomposicion (CKB 09) lo declara no admisible. Se sustituye por BC-04, que describe coincidencia de dirección sin proporción.',
  },
  {
    caso: 'Ganancia predominante de músculo',
    motivo: 'Mismo motivo que el anterior, en sentido inverso.',
  },
  {
    caso: 'Ausencia de pérdida muscular',
    motivo:
      'La estabilidad solo es demostrable donde hay umbral documentado; la masa muscular no lo tiene. «No cambió» y «no lo sé» no son lo mismo.',
  },
  {
    caso: 'Evolución favorable o desfavorable',
    motivo:
      'Requiere un objetivo que el dato no contiene. El BCS no conoce el objetivo de la persona (CKB 01, P4).',
  },
  {
    caso: 'Intervalo hasta la próxima medición',
    motivo:
      'Ninguna fuente del ecosistema documenta periodicidad. Verificado en la CKB (módulo 12, §4).',
  },
  {
    caso: 'Clasificación de porcentaje graso, WHR o grasa visceral',
    motivo:
      'Requieren sexo, edad y escala del fabricante, que el modelo de datos no captura (CKB 12, §1 y §6).',
  },
  {
    caso: 'Cualquier atribución de causa',
    motivo:
      'El dato de composición describe un estado, no lo que lo produjo (CKB 01, P4).',
  },
] as const;
