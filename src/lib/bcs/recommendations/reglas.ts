// ── Catálogo de reglas (Sprint BCS-4.0) ────────────────────────────────────
// SSoT de TODA recomendación que este motor puede emitir. Una regla solo
// entra aquí si puede citarse su fuente en evidencia.ts. No hay ninguna regla
// derivada de criterio propio, y por eso no existe ninguna categoría clínica.
//
// Cada regla es declarativa: dice qué la activa y qué texto usar, nunca cómo
// redactarlo. motor.ts las recorre; plantillas.ts las escribe.

import type { Aviso, BodyCompositionAnalysis, Hallazgo } from '@/lib/bcs/analysis';
import { CATALOGO, type VariableId } from '@/lib/bcs/reporte';
import { EVIDENCIAS, type ClaveEvidencia } from './evidencia';
import { type ClavePlantilla } from './plantillas';
import type { CategoriaRecomendacion, LimitacionRecomendacion, PrioridadRecomendacion } from './tipos';

/** Una activación concreta de una regla sobre un análisis concreto. */
export interface Activacion {
  /** Sufijo que distingue varias activaciones de la misma regla. */
  discriminante?: string;
  /** Valores para interpolar en la plantilla. */
  valores: Record<string, string | number>;
  variables: VariableId[];
  /** Ids de hallazgos/avisos del análisis que la dispararon. */
  origen: string[];
  /** Texto que explica, sobre el dato observado, por qué se emitió. */
  fundamento: string;
}

export interface Regla {
  id: string;
  categoria: CategoriaRecomendacion;
  prioridad: PrioridadRecomendacion;
  plantilla: ClavePlantilla;
  evidencia: ClaveEvidencia;
  /** Devuelve una activación por cada recomendación a emitir. Vacío = no aplica. */
  evaluar: (analisis: BodyCompositionAnalysis) => Activacion[];
}

// ── Utilidades de lectura del análisis ─────────────────────────────────────

const avisosPorPrefijo = (analisis: BodyCompositionAnalysis, prefijo: string): Aviso[] =>
  analisis.avisos.filter((a) => a.id.startsWith(prefijo));

const hallazgosPorPrefijo = (analisis: BodyCompositionAnalysis, prefijo: string): Hallazgo[] =>
  analisis.hallazgos.filter((h) => h.id.startsWith(prefijo));

const etiquetaDe = (id: VariableId): string => CATALOGO[id].etiqueta;

/** Extrae la VariableId de un id de aviso con forma `prefijo:variable:...`. */
function variableDeAviso(idAviso: string): VariableId | null {
  const partes = idAviso.split(':');
  const posible = partes[1];
  return posible && posible in CATALOGO ? (posible as VariableId) : null;
}

// ── Catálogo ───────────────────────────────────────────────────────────────

export const REGLAS: Regla[] = [
  // R-01 · Inconsistencia de masas ─────────────────────────────────────────
  {
    id: 'R-01-inconsistencia-masas',
    categoria: 'control_de_calidad',
    prioridad: 'alta',
    plantilla: 'INCONSISTENCIA_MASAS',
    evidencia: 'TOLERANCIA_MASAS',
    evaluar: (analisis) =>
      avisosPorPrefijo(analisis, 'suma_masas:').map((aviso) => ({
        valores: { tolerancia: 0.5 },
        variables: aviso.variables,
        origen: [aviso.id],
        fundamento: aviso.descripcion,
      })),
  },

  // R-02 · Masa que supera el peso total ───────────────────────────────────
  {
    id: 'R-02-masa-supera-peso',
    categoria: 'control_de_calidad',
    prioridad: 'alta',
    plantilla: 'MASA_SUPERA_PESO',
    evidencia: 'MASA_SUPERA_PESO',
    evaluar: (analisis) =>
      [...avisosPorPrefijo(analisis, 'masa_supera_peso:'), ...avisosPorPrefijo(analisis, 'valor_imposible:')].map(
        (aviso) => ({
          discriminante: aviso.id,
          valores: {},
          variables: aviso.variables,
          origen: [aviso.id],
          fundamento: aviso.descripcion,
        })
      ),
  },

  // R-03 · Valor fuera del rango físico de referencia ──────────────────────
  {
    id: 'R-03-fuera-de-rango',
    categoria: 'reevaluacion',
    prioridad: 'media',
    plantilla: 'VALOR_FUERA_DE_RANGO',
    evidencia: 'RANGO_FISICO',
    evaluar: (analisis) =>
      avisosPorPrefijo(analisis, 'fuera_de_rango:').map((aviso) => {
        const variable = variableDeAviso(aviso.id);
        return {
          discriminante: aviso.id,
          valores: { variable: variable ? etiquetaDe(variable) : 'la variable afectada' },
          variables: aviso.variables,
          origen: [aviso.id],
          fundamento: aviso.descripcion,
        };
      }),
  },

  // R-04 · Variación inusual entre mediciones ──────────────────────────────
  {
    id: 'R-04-cambio-sospechoso',
    categoria: 'reevaluacion',
    prioridad: 'media',
    plantilla: 'CAMBIO_SOSPECHOSO',
    evidencia: 'VALOR_SOSPECHOSO',
    evaluar: (analisis) =>
      [...avisosPorPrefijo(analisis, 'cambio_sospechoso:'), ...avisosPorPrefijo(analisis, 'imc_sospechoso:')].map(
        (aviso) => {
          const variable = variableDeAviso(aviso.id) ?? (aviso.variables[0] as VariableId | undefined);
          return {
            discriminante: aviso.id,
            valores: { variable: variable ? etiquetaDe(variable) : 'la variable afectada' },
            variables: aviso.variables,
            origen: [aviso.id],
            fundamento: aviso.descripcion,
          };
        }
      ),
  },

  // R-05 · Mediciones con la misma fecha ───────────────────────────────────
  {
    id: 'R-05-fecha-duplicada',
    categoria: 'control_de_calidad',
    prioridad: 'media',
    plantilla: 'FECHA_DUPLICADA',
    evidencia: 'FECHA_DUPLICADA',
    evaluar: (analisis) =>
      avisosPorPrefijo(analisis, 'fecha_duplicada:').map((aviso) => ({
        discriminante: aviso.id,
        valores: {},
        variables: [],
        origen: [aviso.id],
        fundamento: aviso.descripcion,
      })),
  },

  // R-06 · Medición anulada dentro del análisis ────────────────────────────
  {
    id: 'R-06-medicion-anulada',
    categoria: 'control_de_calidad',
    prioridad: 'alta',
    plantilla: 'MEDICION_ANULADA',
    evidencia: 'MEDICION_INMUTABLE',
    evaluar: (analisis) =>
      avisosPorPrefijo(analisis, 'medicion_anulada:').map((aviso) => ({
        discriminante: aviso.id,
        valores: {},
        variables: [],
        origen: [aviso.id],
        fundamento: aviso.descripcion,
      })),
  },

  // R-07 · Sin mediciones ──────────────────────────────────────────────────
  {
    id: 'R-07-sin-mediciones',
    categoria: 'medicion',
    prioridad: 'alta',
    plantilla: 'SIN_MEDICIONES',
    evidencia: 'SUFICIENCIA_ANALISIS',
    evaluar: (analisis) =>
      analisis.cantidadMediciones === 0
        ? [
            {
              valores: {},
              variables: [],
              origen: ['datos_insuficientes:sin_mediciones'],
              fundamento: 'El análisis no encontró ninguna medición vigente para este cliente.',
            },
          ]
        : [],
  },

  // R-08 · Una sola medición ───────────────────────────────────────────────
  {
    id: 'R-08-una-medicion',
    categoria: 'seguimiento',
    prioridad: 'media',
    plantilla: 'UNA_SOLA_MEDICION',
    evidencia: 'MINIMO_DOS_MEDICIONES',
    evaluar: (analisis) =>
      analisis.cantidadMediciones === 1
        ? [
            {
              valores: {},
              variables: [],
              origen: ['datos_insuficientes:una_medicion'],
              fundamento:
                'El histórico contiene una única medición vigente, insuficiente para comparar.',
            },
          ]
        : [],
  },

  // R-09 · Dos mediciones: sin tendencia sostenida ─────────────────────────
  {
    id: 'R-09-dos-mediciones',
    categoria: 'seguimiento',
    prioridad: 'baja',
    plantilla: 'DOS_MEDICIONES',
    evidencia: 'TENDENCIA_DESCRIPTIVA',
    evaluar: (analisis) =>
      analisis.cantidadMediciones === 2
        ? [
            {
              valores: {},
              variables: [],
              origen: [],
              fundamento:
                'El histórico contiene dos mediciones: permite comparar, no describir una tendencia sostenida.',
            },
          ]
        : [],
  },

  // R-10 · Serie con base suficiente ───────────────────────────────────────
  {
    id: 'R-10-seguimiento-activo',
    categoria: 'seguimiento',
    prioridad: 'baja',
    plantilla: 'SEGUIMIENTO_ACTIVO',
    evidencia: 'SUFICIENCIA_ANALISIS',
    evaluar: (analisis) =>
      analisis.cantidadMediciones >= 3
        ? [
            {
              valores: { mediciones: analisis.cantidadMediciones },
              variables: [],
              origen: [],
              fundamento: `El histórico contiene ${analisis.cantidadMediciones} mediciones vigentes.`,
            },
          ]
        : [],
  },

  // R-11 · Cambios que superan el umbral ───────────────────────────────────
  {
    id: 'R-11-cambio-significativo',
    categoria: 'composicion_corporal',
    prioridad: 'informativa',
    plantilla: 'CAMBIO_SIGNIFICATIVO',
    evidencia: 'UMBRAL_INSIGNIFICANCIA',
    evaluar: (analisis) => {
      const significativos = hallazgosPorPrefijo(analisis, 'cambio:').filter(
        (h) => h.suficiencia === 'suficiente'
      );
      if (significativos.length === 0) return [];
      return [
        {
          valores: { variables: significativos.map((h) => h.titulo.toLowerCase()).join('; ') },
          variables: significativos.flatMap((h) => h.variables),
          origen: significativos.map((h) => h.id),
          fundamento: `${significativos.length} variable(s) superaron su umbral documentado de significancia.`,
        },
      ];
    },
  },

  // R-12 · Cambios por debajo del umbral ───────────────────────────────────
  {
    id: 'R-12-cambio-bajo-umbral',
    categoria: 'composicion_corporal',
    prioridad: 'informativa',
    plantilla: 'CAMBIO_BAJO_UMBRAL',
    evidencia: 'UMBRAL_INSIGNIFICANCIA',
    evaluar: (analisis) => {
      const bajoUmbral = analisis.comparacion.filter(
        (c) => c.disponibilidad === 'comparable' && c.significancia === 'insignificante'
      );
      if (bajoUmbral.length === 0) return [];
      return [
        {
          valores: { variables: bajoUmbral.map((c) => c.etiqueta.toLowerCase()).join('; ') },
          variables: bajoUmbral.map((c) => c.variable),
          origen: bajoUmbral.map((c) => `estabilidad:${c.variable}`),
          fundamento: `${bajoUmbral.length} variable(s) con umbral definido variaron por debajo de él.`,
        },
      ];
    },
  },

  // R-13 · Cambios sin umbral definido ─────────────────────────────────────
  {
    id: 'R-13-cambio-sin-umbral',
    categoria: 'composicion_corporal',
    prioridad: 'informativa',
    plantilla: 'CAMBIO_SIN_UMBRAL',
    evidencia: 'SIN_UMBRAL_DEFINIDO',
    evaluar: (analisis) => {
      const sinUmbral = hallazgosPorPrefijo(analisis, 'cambio:').filter(
        (h) => h.suficiencia === 'parcial'
      );
      if (sinUmbral.length === 0) return [];
      return [
        {
          valores: { cantidad: sinUmbral.length },
          variables: sinUmbral.flatMap((h) => h.variables),
          origen: sinUmbral.map((h) => h.id),
          fundamento: `${sinUmbral.length} variable(s) cambiaron sin umbral documentado que permita valorarlo.`,
        },
      ];
    },
  },

  // R-14 · Clasificación bloqueada por datos ausentes ──────────────────────
  {
    id: 'R-14-clasificacion-bloqueada',
    categoria: 'interpretacion',
    prioridad: 'informativa',
    plantilla: 'CLASIFICACION_BLOQUEADA',
    evidencia: 'CLASIFICACION_REQUIERE_SEXO_EDAD',
    evaluar: (analisis) =>
      avisosPorPrefijo(analisis, 'clasificacion_bloqueada:').map((aviso) => {
        const variable = variableDeAviso(aviso.id);
        return {
          discriminante: aviso.id,
          valores: { variable: variable ? etiquetaDe(variable) : 'la variable afectada' },
          variables: aviso.variables,
          origen: [aviso.id],
          fundamento: aviso.descripcion,
        };
      }),
  },

  // R-15 · Suma de aguas no verificable ────────────────────────────────────
  {
    id: 'R-15-agua-no-verificable',
    categoria: 'interpretacion',
    prioridad: 'informativa',
    plantilla: 'AGUA_NO_VERIFICABLE',
    evidencia: 'AGUA_SIN_TOLERANCIA',
    evaluar: (analisis) => {
      const aviso = avisosPorPrefijo(analisis, 'agua_sin_tolerancia:')[0];
      return aviso
        ? [
            {
              valores: {},
              variables: aviso.variables,
              origen: [aviso.id],
              fundamento: aviso.descripcion,
            },
          ]
        : [];
    },
  },
];

/**
 * Ámbitos sobre los que este motor NO emite recomendaciones, con el motivo.
 *
 * No es una lista de funciones pendientes: es el resultado de haber buscado
 * respaldo documental y no encontrarlo. Ningún handbook del ecosistema define
 * criterios de nutrición, entrenamiento, derivación profesional, educación o
 * adherencia a partir de composición corporal, ni periodicidad de medición.
 * La única recomendación de evaluación profesional documentada pertenece al
 * Recovery Engine, se dispara por dolor articular —otro contexto acotado, otro
 * disparador— y su redacción exacta figura allí como pregunta abierta
 * pendiente de revisión.
 *
 * Se devuelven junto a las recomendaciones para que el silencio quede
 * explicado en el propio informe.
 */
export const LIMITACIONES_DE_ALCANCE: LimitacionRecomendacion[] = [
  {
    id: 'L-01-nutricion',
    ambito: 'Nutrición',
    motivo:
      'Ninguna fuente del ecosistema define criterios nutricionales a partir de composición corporal. El motor no emite recomendaciones de este ámbito.',
  },
  {
    id: 'L-02-entrenamiento',
    ambito: 'Actividad física y entrenamiento',
    motivo:
      'El BCS no conoce el objetivo del cliente ni su programa; ninguna fuente vincula un hallazgo de composición corporal con una decisión de entrenamiento.',
  },
  {
    id: 'L-03-derivacion',
    ambito: 'Derivación profesional',
    motivo:
      'La única derivación documentada del ecosistema pertenece al Recovery Engine y se dispara por dolor articular, no por composición corporal.',
  },
  {
    id: 'L-04-periodicidad',
    ambito: 'Periodicidad del seguimiento',
    motivo:
      'Ninguna fuente documenta cada cuánto repetir una medición. El motor indica qué habilita cada nuevo registro, nunca cuándo realizarlo.',
  },
  {
    id: 'L-05-clinico',
    ambito: 'Valoración clínica',
    motivo:
      'El BCS interpreta tendencias numéricas, nunca estado de salud. No emite juicios diagnósticos, pronósticos ni de riesgo.',
  },
];

/** Comprobación de integridad: toda regla apunta a una evidencia existente. */
export function reglasSinEvidencia(): string[] {
  return REGLAS.filter((r) => !(r.evidencia in EVIDENCIAS)).map((r) => r.id);
}
