// ── Plantillas de texto (Sprint BCS-4.0) ───────────────────────────────────
// TODO el texto que el motor puede emitir vive aquí. reglas.ts y motor.ts
// deciden QUÉ recomendación sale; este archivo decide CÓMO se lee. Cambiar
// una redacción no toca nunca la lógica.
//
// Registro léxico: profesional, impersonal y descriptivo. Nunca se dirige al
// cliente ni al entrenador en segunda persona, nunca prescribe y nunca
// califica un valor como bueno o malo. Prohibido por contrato —y ausente de
// todo este archivo— el vocabulario: deberías, te recomiendo, es mejor, haz,
// come, evita, ideal, óptimo, perfecto, saludable, riesgoso.

export interface TextoRecomendacion {
  titulo: string;
  descripcion: string;
  accionProfesional: string;
  /** null cuando la regla no define ninguna acción posterior. */
  seguimiento: string | null;
  limitaciones: string[];
}

/** Interpolación mínima: `{clave}` se sustituye por el valor dado. */
export function interpolar(texto: string, valores: Record<string, string | number>): string {
  return texto.replace(/\{(\w+)\}/g, (coincidencia, clave: string) =>
    clave in valores ? String(valores[clave]) : coincidencia
  );
}

export const PLANTILLAS = {
  // ── Control de calidad ───────────────────────────────────────────────────
  INCONSISTENCIA_MASAS: {
    titulo: 'Verificar la composición de masas antes de interpretar',
    descripcion:
      'La suma de masa grasa y masa libre de grasa no reconstruye el peso registrado dentro de la tolerancia documentada de ±{tolerancia} kg.',
    accionProfesional:
      'Verificar nuevamente la medición antes de interpretar los resultados de composición corporal.',
    seguimiento:
      'Repetir el registro y comprobar que la suma de masas reconstruya el peso dentro de la tolerancia.',
    limitaciones: [
      'La discrepancia puede originarse en el dispositivo o en el registro manual; el sistema no distingue entre ambas causas.',
    ],
  },

  MASA_SUPERA_PESO: {
    titulo: 'Corregir un valor físicamente imposible',
    descripcion:
      'Una de las masas absolutas registradas supera el peso total de la misma medición.',
    accionProfesional:
      'Corregir la medición afectada antes de utilizar este informe. Los valores implicados no describen un estado físico posible.',
    seguimiento: 'Confirmar que la medición corregida sustituye a la original en el historial.',
    limitaciones: [],
  },

  VALOR_FUERA_DE_RANGO: {
    titulo: 'Confirmar un valor fuera del rango de referencia',
    descripcion:
      'La variable {variable} registra un valor fuera del rango físico de referencia documentado.',
    accionProfesional:
      'Confirmar la lectura del dispositivo y el registro manual para esa variable.',
    seguimiento: 'Comprobar el valor en la siguiente medición.',
    limitaciones: [
      'Algunos rangos son orientativos según el propio catálogo; quedar fuera no implica un error de medición.',
    ],
  },

  CAMBIO_SOSPECHOSO: {
    titulo: 'Contrastar una variación inusual en {variable}',
    descripcion:
      'La variación registrada en {variable} entre mediciones consecutivas excede lo que el catálogo marca como esperable en ese intervalo de tiempo.',
    accionProfesional:
      'Contrastar el registro con las condiciones de la medición anotadas en observaciones.',
    seguimiento: 'Verificar si la variación se sostiene en el siguiente registro.',
    limitaciones: [
      'El catálogo marca la variación para revisión; no determina si corresponde a un cambio real o a un error de registro.',
    ],
  },

  FECHA_DUPLICADA: {
    titulo: 'Revisar mediciones con la misma fecha',
    descripcion: 'Existe más de una medición vigente registrada con la misma fecha.',
    accionProfesional:
      'Revisar si se trata de un registro duplicado y, en ese caso, anular el que no corresponda.',
    seguimiento: null,
    limitaciones: [
      'Dos mediciones en la misma fecha son válidas a nivel de dato; el sistema no puede determinar cuál es la correcta.',
    ],
  },

  MEDICION_ANULADA: {
    titulo: 'Una medición anulada participó del análisis',
    descripcion:
      'El análisis incluyó una medición marcada como anulada, que no debería formar parte del historial visible.',
    accionProfesional:
      'Revisar el historial antes de entregar este informe: los resultados pueden no ser fiables.',
    seguimiento: null,
    limitaciones: [],
  },

  // ── Reevaluación y seguimiento ───────────────────────────────────────────
  SIN_MEDICIONES: {
    titulo: 'Registrar la primera medición',
    descripcion: 'No hay ninguna medición registrada para este cliente.',
    accionProfesional: 'Registrar una primera medición para iniciar el seguimiento.',
    seguimiento: 'La comparación longitudinal requiere al menos dos mediciones.',
    limitaciones: ['Sin datos registrados no es posible emitir ninguna interpretación.'],
  },

  UNA_SOLA_MEDICION: {
    titulo: 'Registrar una segunda medición',
    descripcion:
      'Con una única medición puede describirse el estado actual, pero no su evolución.',
    accionProfesional:
      'Realizar una nueva evaluación para permitir la comparación longitudinal.',
    seguimiento:
      'La tabla comparativa y los gráficos de línea requieren dos mediciones vigentes de la misma variable.',
    limitaciones: [
      'El sistema no define un intervalo entre mediciones: esa decisión corresponde al criterio del profesional.',
    ],
  },

  DOS_MEDICIONES: {
    titulo: 'Ampliar la serie para describir tendencia',
    descripcion:
      'Con dos mediciones se describe la diferencia entre ambas, pero no una tendencia sostenida.',
    accionProfesional:
      'Registrar una tercera medición para evaluar la serie completa.',
    seguimiento: 'A partir del tercer registro el análisis evalúa la dirección del histórico.',
    limitaciones: [
      'El sistema no proyecta valores futuros ni estima cuándo se alcanzará un valor determinado.',
    ],
  },

  SEGUIMIENTO_ACTIVO: {
    titulo: 'Continuar el seguimiento longitudinal',
    descripcion:
      'La serie cuenta con {mediciones} mediciones vigentes, suficientes para describir su evolución.',
    accionProfesional:
      'Continuar registrando mediciones para mantener la continuidad de la serie.',
    seguimiento: 'Cada nuevo registro actualiza la comparación y la evolución del histórico.',
    limitaciones: [
      'El sistema no define la periodicidad del seguimiento: ninguna fuente del ecosistema la documenta.',
    ],
  },

  // ── Composición corporal ─────────────────────────────────────────────────
  CAMBIO_SIGNIFICATIVO: {
    titulo: 'Cambios que superan el umbral documentado',
    descripcion:
      'Las siguientes variables presentan cambios por encima de su umbral de significancia: {variables}.',
    accionProfesional:
      'Considerar estos cambios como el elemento diferencial respecto a la medición anterior al revisar el caso.',
    seguimiento: 'Comprobar en el siguiente registro si la dirección observada se mantiene.',
    limitaciones: [
      'El umbral es una decisión de producto para reducir ruido visual, sin base clínica.',
      'El sistema no conoce el objetivo del cliente, por lo que no califica la dirección del cambio.',
    ],
  },

  CAMBIO_BAJO_UMBRAL: {
    titulo: 'Cambios por debajo del umbral documentado',
    descripcion:
      'El cambio observado en {variables} se encuentra dentro del rango de variación considerado no significativo.',
    accionProfesional:
      'Tratar estos valores como estables respecto a la medición anterior.',
    seguimiento: null,
    limitaciones: [
      'El umbral responde a una decisión de producto para reducir ruido visual, no a un criterio clínico.',
    ],
  },

  CAMBIO_SIN_UMBRAL: {
    titulo: 'Cambios sin umbral de relevancia definido',
    descripcion:
      '{cantidad} variables presentan variación respecto a la medición anterior, sin que exista un umbral documentado que permita calificarla.',
    accionProfesional:
      'Interpretar esas variaciones únicamente de forma descriptiva.',
    seguimiento: null,
    limitaciones: [
      'El catálogo define umbral de significancia solo para peso y porcentaje de grasa.',
    ],
  },

  // ── Interpretación ───────────────────────────────────────────────────────
  CLASIFICACION_BLOQUEADA: {
    titulo: 'Clasificación no disponible para {variable}',
    descripcion:
      'La clasificación de {variable} requiere datos que el sistema no registra, por lo que el valor se presenta sin categoría.',
    accionProfesional:
      'Considerar el valor y su evolución; la posición dentro de un rango de referencia no está disponible para esta variable.',
    seguimiento: null,
    limitaciones: [
      'El modelo de datos no captura sexo ni edad del cliente, ni la escala del dispositivo utilizado.',
    ],
  },

  AGUA_NO_VERIFICABLE: {
    titulo: 'La suma de aguas no puede verificarse',
    descripcion:
      'La matriz de validaciones exige que agua intracelular y extracelular reconstruyan el agua total, pero no publica una tolerancia numérica para decidirlo.',
    accionProfesional:
      'Interpretar los compartimentos de agua de forma descriptiva, sin verificación cruzada.',
    seguimiento: null,
    limitaciones: ['No se emite ningún juicio sobre la coherencia interna de esta relación.'],
  },
} as const;

export type ClavePlantilla = keyof typeof PLANTILLAS;
