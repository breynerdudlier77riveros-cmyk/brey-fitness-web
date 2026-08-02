// ── Prioridad de observación (COG v1.0) ────────────────────────────────────
// La prioridad NO se calcula ni se pondera: viene fijada por plantilla, igual
// que en el Recommendation Engine. Cualquier fórmula que combinara señales en
// un número sería una heurística inventada.
//
// Gobierna el orden DENTRO de un bloque. El orden ENTRE bloques vive en
// orden.ts, porque responde a un criterio editorial distinto.

export type PrioridadObservacion = 'critica' | 'principal' | 'contextual';

interface DefinicionPrioridad {
  etiqueta: string;
  criterio: string;
}

export const PRIORIDADES: Record<PrioridadObservacion, DefinicionPrioridad> = {
  critica: {
    etiqueta: 'Crítica',
    criterio:
      'Condiciona la lectura del resto del informe: sin resolverla, las demás observaciones no son interpretables.',
  },
  principal: {
    etiqueta: 'Principal',
    criterio: 'Describe el contenido central de lo observado en la serie.',
  },
  contextual: {
    etiqueta: 'Contextual',
    criterio: 'Acota el alcance de lo anterior. No aporta hallazgo nuevo.',
  },
};

const PESO: Record<PrioridadObservacion, number> = {
  critica: 0,
  principal: 1,
  contextual: 2,
};

/** Prioridad asignada a cada plantilla del catálogo. */
export const PRIORIDAD_POR_PLANTILLA: Record<string, PrioridadObservacion> = {
  'E-01-alcance-analisis': 'critica',

  'BC-01-cambio-significativo': 'principal',
  'BC-02-cambio-sin-umbral': 'contextual',
  'BC-03-sin-variacion': 'contextual',
  'BC-04-coocurrencia-peso-grasa': 'principal',

  'T-01-serie-con-direccion': 'principal',
  'T-02-serie-variable': 'contextual',
  'T-03-historico-insuficiente': 'contextual',

  'MQ-01-inconsistencia-interna': 'critica',
  'MQ-02-variacion-implausible': 'critica',
  'MQ-03-sin-incidencias': 'contextual',

  'I-01-compatible-hidratacion': 'contextual',
  'I-02-patron-recomposicion': 'principal',
  'I-03-clasificacion-no-disponible': 'contextual',

  'RS-01-acciones-prioritarias': 'principal',
  'RS-02-continuidad': 'contextual',
  'RS-03-sin-recomendaciones': 'contextual',

  'SL-01-ambitos-no-cubiertos': 'contextual',
  'SL-02-limites-tecnica': 'contextual',

  'OS-01-cierre': 'principal',
};

export function compararPrioridad(a: PrioridadObservacion, b: PrioridadObservacion): number {
  return PESO[a] - PESO[b];
}

export function prioridadDe(plantillaId: string): PrioridadObservacion {
  return PRIORIDAD_POR_PLANTILLA[plantillaId] ?? 'contextual';
}
