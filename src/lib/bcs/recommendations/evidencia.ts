// ── Evidencia de las reglas (Sprint BCS-4.0) ───────────────────────────────
// SSoT de las fuentes que respaldan cada regla. Toda recomendación apunta a
// una entrada de aquí: si un comportamiento no puede citarse, no se convierte
// en regla.
//
// `origen` distingue dos autoridades distintas y no las mezcla:
//   · handbook       — lo afirma un documento del ecosistema.
//   · motor_analisis — es el contrato del Analysis Engine ya implementado.
//     Se usa cuando la recomendación es la consecuencia operativa directa de
//     un estado que ese motor emite, sin añadir ninguna afirmación nueva.
//
// Ninguna entrada respalda una afirmación fisiológica: este motor no las
// hace. Todas respaldan procedimiento sobre el dato.

import type { Evidencia } from './tipos';

export const EVIDENCIAS = {
  TOLERANCIA_MASAS: {
    origen: 'handbook',
    referencia: 'BCS Handbook 03 · Matriz de validaciones cruzadas',
    cita:
      'Masa grasa + Masa libre de grasa ≈ Peso (±0.5 kg) — Warning en observabilidad, no bloquea el guardado.',
  },
  MASA_SUPERA_PESO: {
    origen: 'handbook',
    referencia: 'BCS Handbook 03 · Matriz de validaciones cruzadas',
    cita:
      'Masa grasa < Peso; Masa muscular < Peso; Masa ósea < Peso — Error de validación, imposible físicamente.',
  },
  RANGO_FISICO: {
    origen: 'handbook',
    referencia: 'BCS Handbook 03 · Rango físico válido por variable',
    cita:
      'Cada variable declara su rango físicamente válido y un valor imposible de ejemplo.',
  },
  VALOR_SOSPECHOSO: {
    origen: 'handbook',
    referencia: 'BCS Handbook 03 · Valor sospechoso por variable',
    cita:
      'Cada variable declara qué variación entre mediciones se marca como sospechosa para revisión del entrenador.',
  },
  FECHA_DUPLICADA: {
    origen: 'handbook',
    referencia: 'BCS Handbook 05 · Casos límite',
    cita:
      'Dos Mediciones con la misma fecha: válido a nivel de dato — el sistema no lo bloquea, pero lo marca como valor sospechoso para revisión del entrenador.',
  },
  MINIMO_DOS_MEDICIONES: {
    origen: 'handbook',
    referencia: 'BCS Handbook 07 · Mínimo de datos por visualización',
    cita:
      'Gráfico de línea: 2 Mediciones vigentes con esa variable presente. Tabla comparativa: 2 Mediciones vigentes.',
  },
  UMBRAL_INSIGNIFICANCIA: {
    origen: 'handbook',
    referencia: 'BCS Design Handbook 12 · Clasificación del cambio',
    cita:
      'Cambio insignificante: delta absoluto por debajo del umbral de la variable (ej. peso <0.2 kg, %grasa <0.3pp) — decisión de producto sin base clínica, solo evita ruido visual.',
  },
  SIN_UMBRAL_DEFINIDO: {
    origen: 'handbook',
    referencia: 'BCS Design Handbook 12 · Clasificación del cambio',
    cita:
      'El handbook define umbral únicamente para peso y porcentaje de grasa; no lo define para el resto de variables.',
  },
  CLASIFICACION_REQUIERE_SEXO_EDAD: {
    origen: 'handbook',
    referencia: 'BCS Handbook 06 · Casos límite',
    cita:
      'Sexo no especificado en el Cliente: las clasificaciones que dependen de sexo (% grasa, WHR) se omiten, mostrando solo el valor crudo.',
  },
  ESCALA_FABRICANTE: {
    origen: 'handbook',
    referencia: 'BCS Handbook 03 · BCS-V14 Grasa visceral',
    cita:
      'La escala varía por fabricante; no existe un rango universal. BREY nunca compara el índice de un cliente entre dos dispositivos distintos como si fueran la misma escala.',
  },
  MEDICION_INMUTABLE: {
    origen: 'handbook',
    referencia: 'BCS Handbook 05 · Corrección de una Medición pasada',
    cita:
      'UC-06 CorregirMedición — nunca edición en sitio: se anula la original y se crea una nueva.',
  },
  TENDENCIA_DESCRIPTIVA: {
    origen: 'motor_analisis',
    referencia: 'Analysis Engine · tendencias.ts',
    cita:
      'Con dos puntos se describe la diferencia entre ellos, no una tendencia sostenida; a partir de tres se evalúa la serie completa, siempre de forma descriptiva y sin proyectar.',
  },
  SUFICIENCIA_ANALISIS: {
    origen: 'motor_analisis',
    referencia: 'Analysis Engine · analizar.ts',
    cita:
      'La suficiencia del análisis se deriva del número de mediciones: 0 sin datos, 1 insuficiente, 2 parcial, 3 o más suficiente.',
  },
  AGUA_SIN_TOLERANCIA: {
    origen: 'handbook',
    referencia: 'BCS Handbook 03 · Matriz de validaciones cruzadas',
    cita:
      'Agua intracelular + Agua extracelular ≈ Agua corporal total — Warning en observabilidad. La matriz no publica tolerancia numérica para esta validación.',
  },
} as const satisfies Record<string, Evidencia>;

export type ClaveEvidencia = keyof typeof EVIDENCIAS;
