// ── Motor de activación (COG v1.0) ─────────────────────────────────────────
// Decide qué plantillas se activan y con qué oraciones. Toda oración se
// compone a partir de fragmentos fijos definidos aquí; no hay concatenación
// libre de texto procedente de otros motores.
//
// Puro: mismas entradas → mismas activaciones, en el mismo orden. Sin reloj,
// sin aleatoriedad, sin I/O.

import type { BodyCompositionAnalysis, Hallazgo } from '@/lib/bcs/analysis';
import type { RecommendationReport } from '@/lib/bcs/recommendations';
import { CATALOGO, type VariableId } from '@/lib/bcs/reporte';
import type { Activacion } from './plantillas';

export interface Contexto {
  analisis: BodyCompositionAnalysis;
  recomendaciones: RecommendationReport;
}

type Evaluador = (ctx: Contexto) => Activacion[];

// ── Lectura del análisis ───────────────────────────────────────────────────

const hallazgosPorPrefijo = (a: BodyCompositionAnalysis, p: string): Hallazgo[] =>
  a.hallazgos.filter((h) => h.id.startsWith(p));

const etiqueta = (v: VariableId) => CATALOGO[v].etiqueta.toLowerCase();

/** Lista en prosa: «a», «a y b», «a, b y c». */
function enumerar(items: string[]): string {
  if (items.length === 0) return '';
  if (items.length === 1) return items[0];
  return `${items.slice(0, -1).join(', ')} y ${items[items.length - 1]}`;
}

/** Días entre las dos mediciones comparadas, si ambas fechas existen. */
function diasDeIntervalo(a: BodyCompositionAnalysis): number | null {
  if (!a.fechaInicial || !a.fechaFinal) return null;
  const i = Date.parse(`${a.fechaInicial}T00:00:00Z`);
  const f = Date.parse(`${a.fechaFinal}T00:00:00Z`);
  if (Number.isNaN(i) || Number.isNaN(f)) return null;
  return Math.round((f - i) / 86_400_000);
}

function direccionDe(h: Hallazgo): 'aumento' | 'disminucion' | null {
  return h.direccion === 'aumento' || h.direccion === 'disminucion' ? h.direccion : null;
}

// ── Evaluadores ────────────────────────────────────────────────────────────

export const EVALUADORES: Record<string, Evaluador> = {
  'E-01-alcance-analisis': ({ analisis }) => {
    const n = analisis.cantidadMediciones;
    const base = [
      n === 0
        ? 'No se dispone de mediciones registradas.'
        : `El análisis se apoya en ${n} ${n === 1 ? 'medición vigente' : 'mediciones vigentes'}.`,
    ];

    if (n === 0) {
      base.push('No procede emitir observaciones sobre composición corporal ni sobre su evolución.');
    } else if (n === 1) {
      base.push('Esa serie permite describir el estado registrado, no su evolución.');
      base.push('La comparación entre mediciones requiere al menos dos registros vigentes.');
    } else if (n === 2) {
      base.push('Esa serie permite describir la diferencia entre ambos registros.');
      base.push('La descripción de una evolución sostenida requiere al menos tres.');
    } else {
      base.push('Esa serie permite describir tanto la comparación con el registro anterior como la evolución del conjunto.');
      base.push('Las observaciones siguientes se refieren a esa persona comparada consigo misma, no a una referencia poblacional.');
    }

    return [{ oraciones: base, variables: [], findingIds: [], recommendationIds: [] }];
  },

  'BC-01-cambio-significativo': ({ analisis }) => {
    const sig = hallazgosPorPrefijo(analisis, 'cambio:').filter((h) => h.suficiencia === 'suficiente');
    if (sig.length === 0) return [];

    const nombres = sig.map((h) => etiqueta(h.variables[0]));
    return [
      {
        oraciones: [
          `Entre las dos mediciones comparadas se registran cambios que superan el umbral definido para su variable en ${enumerar(nombres)}.`,
          'El umbral corresponde a una decisión de producto destinada a reducir ruido de lectura, sin base clínica.',
          'La dirección del cambio se describe sin calificarla, dado que el sistema no dispone del objetivo de la persona.',
        ],
        variables: sig.flatMap((h) => h.variables),
        findingIds: sig.map((h) => h.id),
        recommendationIds: [],
      },
    ];
  },

  'BC-02-cambio-sin-umbral': ({ analisis }) => {
    const parciales = hallazgosPorPrefijo(analisis, 'cambio:').filter((h) => h.suficiencia === 'parcial');
    if (parciales.length === 0) return [];

    const nombres = parciales.map((h) => etiqueta(h.variables[0]));
    return [
      {
        oraciones: [
          `Se registran variaciones en ${enumerar(nombres)}.`,
          'Ninguna de esas variables cuenta con un umbral documentado que permita establecer si la variación observada es relevante.',
          'Se describen, por tanto, de forma estrictamente descriptiva.',
        ],
        variables: parciales.flatMap((h) => h.variables),
        findingIds: parciales.map((h) => h.id),
        recommendationIds: [],
      },
    ];
  },

  'BC-03-sin-variacion': ({ analisis }) => {
    const estables = analisis.comparacion.filter(
      (c) => c.disponibilidad === 'comparable' && c.significancia === 'insignificante'
    );
    if (estables.length === 0) return [];

    const nombres = estables.map((c) => c.etiqueta.toLowerCase());
    return [
      {
        oraciones: [
          `${enumerar(nombres).charAt(0).toUpperCase()}${enumerar(nombres).slice(1)} se ${estables.length === 1 ? 'mantuvo' : 'mantuvieron'} por debajo del umbral definido para su variable.`,
          'Una diferencia por debajo del umbral no permite afirmar que el valor no haya cambiado, únicamente que el cambio queda dentro del margen que el sistema no considera distinguible.',
        ],
        variables: estables.map((c) => c.variable),
        findingIds: estables.map((c) => `estabilidad:${c.variable}`),
        recommendationIds: [],
      },
    ];
  },

  'BC-04-coocurrencia-peso-grasa': ({ analisis }) => {
    const peso = analisis.hallazgos.find((h) => h.id === 'cambio:peso_kg');
    const grasa = analisis.hallazgos.find((h) => h.id === 'cambio:grasa_pct');
    if (!peso || !grasa) return [];

    const dPeso = direccionDe(peso);
    const dGrasa = direccionDe(grasa);
    if (!dPeso || !dGrasa || dPeso !== dGrasa) return [];

    const verbo = dPeso === 'disminucion' ? 'descendieron' : 'ascendieron';
    return [
      {
        oraciones: [
          `El peso corporal y el porcentaje de grasa ${verbo} en el mismo periodo.`,
          'Se trata de la coincidencia de dos cambios registrados por separado.',
          'El dato disponible no permite establecer qué proporción del cambio de peso corresponde a tejido graso.',
        ],
        variables: ['peso_kg', 'grasa_pct'],
        findingIds: [peso.id, grasa.id],
        recommendationIds: [],
      },
    ];
  },

  'T-01-serie-con-direccion': ({ analisis }) => {
    const series = analisis.tendencias.filter(
      (t) => t.suficiencia === 'suficiente' && (t.estado === 'ascendente' || t.estado === 'descendente')
    );
    if (series.length === 0) return [];

    const alza = series.filter((t) => t.estado === 'ascendente').map((t) => t.etiqueta.toLowerCase());
    const baja = series.filter((t) => t.estado === 'descendente').map((t) => t.etiqueta.toLowerCase());

    const oraciones: string[] = [
      `Sobre el conjunto de ${series[0].puntosUsados} mediciones, la serie describe una dirección sostenida en ${series.length === 1 ? 'una variable' : `${series.length} variables`}.`,
    ];
    if (alza.length > 0) oraciones.push(`Al alza: ${enumerar(alza)}.`);
    if (baja.length > 0) oraciones.push(`A la baja: ${enumerar(baja)}.`);
    oraciones.push('La descripción corresponde a lo ya registrado y no constituye una proyección.');

    return [
      {
        oraciones,
        variables: series.map((t) => t.variable),
        findingIds: series.map((t) => `tendencia:${t.variable}`),
        recommendationIds: [],
      },
    ];
  },

  'T-02-serie-variable': ({ analisis }) => {
    const variables = analisis.tendencias.filter((t) => t.estado === 'variable');
    if (variables.length === 0) return [];

    return [
      {
        oraciones: [
          `${variables.length === 1 ? 'Una variable presenta' : `${variables.length} variables presentan`} valores que ascienden y descienden entre registros, sin dirección sostenida.`,
          'El sistema no atribuye esa oscilación a ninguna causa concreta.',
        ],
        variables: variables.map((t) => t.variable),
        findingIds: [],
        recommendationIds: [],
      },
    ];
  },

  'T-03-historico-insuficiente': ({ analisis }) => {
    if (analisis.cantidadMediciones >= 3) return [];
    return [
      {
        oraciones: [
          'La serie no alcanza el número de registros necesario para describir una evolución sostenida.',
          'A partir del tercer registro vigente de una misma variable, el análisis evalúa el conjunto de la serie.',
        ],
        variables: [],
        findingIds: [],
        recommendationIds: [],
      },
    ];
  },

  'MQ-01-inconsistencia-interna': ({ analisis }) => {
    const avisos = analisis.avisos.filter(
      (a) => a.tipo === 'alerta' && (a.id.startsWith('suma_masas') || a.id.startsWith('masa_supera_peso'))
    );
    if (avisos.length === 0) return [];

    return [
      {
        oraciones: [
          'El registro no satisface una de las identidades que el modelo de composición corporal exige por construcción.',
          'Una identidad incumplida señala la presencia de un error en el registro, sin identificar cuál de los valores implicados lo origina.',
          'Las observaciones sobre composición y evolución quedan condicionadas hasta que el registro se verifique.',
        ],
        variables: avisos.flatMap((a) => a.variables),
        findingIds: avisos.map((a) => `calidad:${a.id}`),
        recommendationIds: [],
      },
    ];
  },

  'MQ-02-variacion-implausible': ({ analisis }) => {
    const avisos = analisis.avisos.filter(
      (a) =>
        a.tipo === 'alerta' &&
        (a.id.startsWith('cambio_sospechoso') || a.id.startsWith('fuera_de_rango') || a.id.startsWith('valor_imposible'))
    );
    if (avisos.length === 0) return [];

    return [
      {
        oraciones: [
          avisos.length === 1
            ? 'Se identifica una variación que excede lo esperable para el intervalo transcurrido o el rango de referencia de la variable.'
            : `Se identifican ${avisos.length} variaciones que exceden lo esperable para el intervalo transcurrido o el rango de referencia de la variable.`,
          'El sistema señala el registro para verificación y no concluye que exista un fallo del dispositivo.',
          'La distinción entre un cambio real y una variación del procedimiento no siempre es resoluble con el dato disponible.',
        ],
        variables: avisos.flatMap((a) => a.variables),
        findingIds: avisos.map((a) => `calidad:${a.id}`),
        recommendationIds: [],
      },
    ];
  },

  'MQ-03-sin-incidencias': ({ analisis }) => {
    if (analisis.cantidadMediciones === 0) return [];
    if (analisis.avisos.some((a) => a.tipo === 'alerta')) return [];

    return [
      {
        oraciones: [
          'Ninguna de las comprobaciones de consistencia aplicadas al registro resultó fallida.',
          'Eso indica que el registro es internamente coherente, no que los valores sean exactos.',
        ],
        variables: [],
        findingIds: [],
        recommendationIds: [],
      },
    ];
  },

  'I-01-compatible-hidratacion': ({ analisis }) => {
    const dias = diasDeIntervalo(analisis);
    if (dias === null || dias > 14 || analisis.cantidadMediciones < 2) return [];

    const cambios = hallazgosPorPrefijo(analisis, 'cambio:');
    if (cambios.length === 0) return [];

    return [
      {
        oraciones: [
          `El intervalo entre el primer y el último registro es de ${dias} ${dias === 1 ? 'día' : 'días'}.`,
          'En intervalos de esa extensión, las variaciones observadas son compatibles con cambios en el estado de hidratación y en las reservas de glucógeno, que modifican el agua corporal en horas.',
          'Esa compatibilidad no descarta un cambio de tejido; el dato disponible no permite separar ambas contribuciones.',
        ],
        variables: [],
        findingIds: cambios.map((h) => h.id),
        recommendationIds: [],
      },
    ];
  },

  'I-02-patron-recomposicion': ({ analisis }) => {
    const musculo = analisis.hallazgos.find((h) => h.id === 'cambio:masa_muscular_kg');
    const grasa =
      analisis.hallazgos.find((h) => h.id === 'cambio:masa_grasa_kg') ??
      analisis.hallazgos.find((h) => h.id === 'cambio:grasa_pct');
    if (!musculo || !grasa) return [];
    if (direccionDe(musculo) !== 'aumento' || direccionDe(grasa) !== 'disminucion') return [];

    return [
      {
        oraciones: [
          'La masa muscular ascendió mientras el componente graso descendió en el mismo periodo.',
          'Esa combinación es compatible con el patrón descrito en la literatura como recomposición corporal, documentado de forma más consistente en personas sin entrenamiento previo y con porcentaje graso inicial más elevado.',
          'La compatibilidad de un patrón no equivale a su confirmación, y el dato no permite cuantificar qué proporción del cambio corresponde a cada tejido.',
        ],
        variables: [musculo.variables[0], grasa.variables[0]],
        findingIds: [musculo.id, grasa.id],
        recommendationIds: [],
      },
    ];
  },

  'I-03-clasificacion-no-disponible': ({ analisis }) => {
    const limitaciones = analisis.avisos.filter(
      (a) => a.tipo === 'limitacion' && a.id.startsWith('clasificacion_bloqueada')
    );
    if (limitaciones.length === 0) return [];

    const nombres = limitaciones.flatMap((a) => a.variables).map(etiqueta);
    return [
      {
        oraciones: [
          `${nombres.length === 1 ? 'Una variable registrada no admite clasificación' : `${nombres.length} variables registradas no admiten clasificación`}: ${enumerar(nombres)}.`,
          'Su posición dentro de un rango de referencia requiere datos que el modelo no captura.',
          'Esas variables se presentan como valor y evolución, sin categoría asociada.',
        ],
        variables: limitaciones.flatMap((a) => a.variables),
        findingIds: limitaciones.map((a) => a.id),
        recommendationIds: [],
      },
    ];
  },

  'RS-01-acciones-prioritarias': ({ recomendaciones }) => {
    const altas = recomendaciones.recomendaciones.filter((r) => r.prioridad === 'alta');
    if (altas.length === 0) return [];

    return [
      {
        oraciones: [
          `El análisis de recomendaciones identifica ${altas.length} ${altas.length === 1 ? 'punto' : 'puntos'} de prioridad alta, ${altas.length === 1 ? 'referido' : 'referidos'} a la consistencia del dato registrado.`,
          'Su detalle figura en la sección de recomendaciones profesionales del informe.',
          'Hasta su verificación, la lectura de las variables implicadas queda condicionada.',
        ],
        variables: altas.flatMap((r) => r.variablesRelacionadas),
        findingIds: [],
        recommendationIds: altas.map((r) => r.id),
      },
    ];
  },

  'RS-02-continuidad': ({ recomendaciones }) => {
    const continuidad = recomendaciones.recomendaciones.filter(
      (r) => r.categoria === 'seguimiento' || r.categoria === 'medicion'
    );
    if (continuidad.length === 0) return [];

    return [
      {
        oraciones: [
          'Entre las recomendaciones emitidas figuran acciones relativas a la continuidad del registro longitudinal.',
          'El sistema indica qué habilita cada nuevo registro, sin establecer en qué momento realizarlo: ninguna fuente del ecosistema documenta una periodicidad.',
        ],
        variables: [],
        findingIds: [],
        recommendationIds: continuidad.map((r) => r.id),
      },
    ];
  },

  'RS-03-sin-recomendaciones': ({ recomendaciones }) => {
    if (recomendaciones.recomendaciones.length > 0) return [];
    return [
      {
        oraciones: [
          'El catálogo de reglas no activó ninguna recomendación con los datos disponibles.',
          'Esa ausencia describe el estado del catálogo frente a este registro, no una valoración del caso.',
        ],
        variables: [],
        findingIds: [],
        recommendationIds: [],
      },
    ];
  },

  'SL-01-ambitos-no-cubiertos': ({ recomendaciones }) => {
    if (recomendaciones.limitaciones.length === 0) return [];
    const ambitos = recomendaciones.limitaciones.map((l) => l.ambito.toLowerCase());
    return [
      {
        oraciones: [
          `El sistema no emite pronunciamiento alguno sobre ${enumerar(ambitos)}.`,
          'Ninguna fuente del ecosistema documenta criterios que permitan derivar esos ámbitos a partir de datos de composición corporal.',
          'Su ausencia en este informe es deliberada.',
        ],
        variables: [],
        findingIds: [],
        recommendationIds: [],
      },
    ];
  },

  'SL-02-limites-tecnica': ({ analisis }) => {
    if (analisis.cantidadMediciones === 0) return [];
    return [
      {
        oraciones: [
          'Los valores proceden de bioimpedancia, técnica que estima la composición corporal a partir de una medida eléctrica y de ecuaciones validadas en poblaciones concretas.',
          'Su comportamiento está mejor documentado para seguir la evolución de una misma persona que para establecer valores absolutos comparables entre personas o entre dispositivos distintos.',
          'Las cifras de este informe se interpretan dentro de ese marco.',
        ],
        variables: [],
        findingIds: [],
        recommendationIds: [],
      },
    ];
  },

  'OS-01-cierre': ({ analisis, recomendaciones }) => {
    const cambios = hallazgosPorPrefijo(analisis, 'cambio:').length;
    const alertas = analisis.avisos.filter((a) => a.tipo === 'alerta').length;

    const oraciones: string[] = [
      analisis.cantidadMediciones === 0
        ? 'El informe no contiene observaciones sobre composición corporal por ausencia de registros.'
        // «El informe recoge ninguna variación» era gramaticalmente imposible:
        // en español la negación va antes del verbo. El caso cero necesita su
        // propia frase, no un hueco dentro de la afirmativa.
        : cambios === 0
          ? `No se registró ninguna variación entre los registros comparados. El informe recoge ${recomendaciones.recomendaciones.length} ${recomendaciones.recomendaciones.length === 1 ? 'recomendación' : 'recomendaciones'}.`
          : `El informe recoge ${cambios} ${cambios === 1 ? 'variación registrada' : 'variaciones registradas'} y ${recomendaciones.recomendaciones.length} ${recomendaciones.recomendaciones.length === 1 ? 'recomendación' : 'recomendaciones'}.`,
    ];

    if (alertas > 0) {
      oraciones.push(
        `Quedan ${alertas} ${alertas === 1 ? 'elemento pendiente' : 'elementos pendientes'} de verificación sobre el dato registrado.`
      );
    }

    oraciones.push(
      'Este documento describe mediciones y su evolución; no sustituye una valoración profesional ni establece relaciones de causa entre los cambios observados.'
    );

    return [{ oraciones, variables: [], findingIds: [], recommendationIds: [] }];
  },
};
