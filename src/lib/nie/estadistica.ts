// ── NIE-1.3.2 · motor estadístico ──────────────────────────────────────────
//
// Une un valor observado con una norma aplicable y ejecuta **solo** la
// operación que el tipo de norma autoriza.
//
// Lo que este módulo no hace, y no debe hacer nunca:
//   · interpolar entre percentiles publicados;
//   · inventar percentiles intermedios;
//   · convertir una puntuación z en percentil;
//   · suponer normalidad;
//   · derivar nada desde L, M y S;
//   · convertir unidades;
//   · clasificar al sujeto.
//
// Módulo puro.

import { autorizar, type OperacionRealizada, type OperacionSolicitada } from './operaciones';
import type {
  Calidad,
  Candidata,
  ConflictoDeclarado,
  EstadoAplicabilidad,
  EstadoInterpretacion,
  EstadoNorma,
  PercentilPublicado,
  Procedencia,
  ResultadoEstadistico,
  TipoNorma,
  Unidad,
} from './tipos';
import type { ValorObservado } from './valor-observado';

/** Salida del motor. Nunca un número desnudo. */
export interface ResultadoInterpretacion {
  observado: { valor: number; unidad: Unidad };
  norma: {
    id: string;
    fichaId: string;
    tipo: TipoNorma;
    unidad: Unidad;
  } | null;
  operacion: OperacionRealizada;
  resultado: ResultadoEstadistico | null;
  estado: EstadoInterpretacion;
  /** Los tres ejes que ya existían, transportados sin mezclarse con el cuarto. */
  aplicabilidad: EstadoAplicabilidad | null;
  calidad: Calidad | null;
  estadoNorma: EstadoNorma | null;
  conflicto: ConflictoDeclarado;
  procedencia: Procedencia | null;
  limitaciones: readonly string[];
  advertencias: readonly string[];
  /** Por qué el estado es el que es. Legible sin abrir el código. */
  motivo: string;
}

function sinNorma(
  observado: ValorObservado,
  estado: EstadoInterpretacion,
  motivo: string,
): ResultadoInterpretacion {
  return {
    observado: { valor: observado.valor, unidad: observado.unidad },
    norma: null,
    operacion: 'NINGUNA',
    resultado: null,
    estado,
    aplicabilidad: null,
    calidad: null,
    estadoNorma: null,
    conflicto: 'ninguno',
    procedencia: null,
    limitaciones: [],
    advertencias: [],
    motivo,
  };
}

/**
 * Sitúa un valor entre los percentiles que la fuente publica.
 *
 * **No interpola.** Si el valor cae entre P25 y P50 se devuelven ambos y se
 * dice exactamente eso: la fuente no publica nada entre ellos, y afirmar «P37»
 * sería inventar una posición que nadie midió.
 *
 * Se resuelve en una sola pasada, **sin ordenar**: el motor no contiene ningún
 * `.sort()`, y esa ausencia es un invariante comprobado sobre el código fuente.
 * El resultado no depende del orden en que la ficha escriba sus columnas.
 */
function localizarEnPercentiles(
  valor: number,
  percentiles: readonly PercentilPublicado[],
): { resultado: ResultadoEstadistico; estado: EstadoInterpretacion; motivo: string } {
  let exacto: PercentilPublicado | null = null;
  let menor: PercentilPublicado | null = null;
  let mayor: PercentilPublicado | null = null;
  let inferior: PercentilPublicado | null = null;
  let superior: PercentilPublicado | null = null;

  for (const p of percentiles) {
    if (p.valor === valor && (exacto === null || p.percentil < exacto.percentil)) exacto = p;
    if (menor === null || p.valor < menor.valor) menor = p;
    if (mayor === null || p.valor > mayor.valor) mayor = p;
    if (p.valor < valor && (inferior === null || p.valor > inferior.valor)) inferior = p;
    if (p.valor > valor && (superior === null || p.valor < superior.valor)) superior = p;
  }

  if (exacto) {
    return {
      resultado: { tipo: 'percentil_exacto', percentil: exacto.percentil, valorNormativo: exacto.valor },
      estado: 'COINCIDE_CON_PERCENTIL',
      motivo: `El valor observado coincide exactamente con el percentil ${exacto.percentil} publicado`,
    };
  }

  if (inferior === null) {
    return {
      resultado: { tipo: 'entre_percentiles', inferior: null, superior: menor },
      estado: 'POR_DEBAJO_DEL_MENOR_PUBLICADO',
      motivo: `El valor queda por debajo del percentil ${menor!.percentil}, el menor que la fuente publica. No se extrapola por debajo`,
    };
  }
  if (superior === null) {
    return {
      resultado: { tipo: 'entre_percentiles', inferior: mayor, superior: null },
      estado: 'POR_ENCIMA_DEL_MAYOR_PUBLICADO',
      motivo: `El valor queda por encima del percentil ${mayor!.percentil}, el mayor que la fuente publica. No se extrapola por encima`,
    };
  }

  return {
    resultado: { tipo: 'entre_percentiles', inferior, superior },
    estado: 'ENTRE_PERCENTILES_PUBLICADOS',
    motivo:
      `El valor cae entre los percentiles ${inferior.percentil} y ${superior.percentil} publicados. ` +
      'La fuente no publica nada entre ellos y no se interpola',
  };
}

/**
 * Puntuación z: `z = (x − μ) / σ`.
 *
 * Es una re-expresión del valor observado en unidades de la desviación típica
 * de la norma. **No supone ninguna forma de distribución** y no es un
 * percentil: convertirla en uno exigiría normalidad, y eso está bloqueado en
 * `operaciones.ts`.
 */
function puntuacionZ(
  valor: number,
  media: number,
  desviacionTipica: number,
): { resultado: ResultadoEstadistico; estado: EstadoInterpretacion; motivo: string } | null {
  if (!Number.isFinite(desviacionTipica) || desviacionTipica <= 0) return null;
  return {
    resultado: {
      tipo: 'puntuacion_z',
      z: (valor - media) / desviacionTipica,
      media,
      desviacionTipica,
    },
    estado: 'CALCULADA',
    motivo:
      'Distancia a la media en unidades de desviación típica. No es un percentil y no se convierte en uno: ' +
      'eso exigiría asumir una distribución que la fuente no sostiene',
  };
}

/**
 * Interpreta un valor observado contra una candidata.
 *
 * Orden de comprobación, y el orden importa: primero se descarta lo que impide
 * cualquier operación —aplicabilidad y unidad—, y solo después se mira qué
 * autoriza el tipo de norma.
 */
export function interpretar(
  observado: ValorObservado,
  candidata: Candidata,
  solicitud: OperacionSolicitada = 'AUTOMATICA',
): ResultadoInterpretacion {
  const base = {
    observado: { valor: observado.valor, unidad: observado.unidad },
    norma: {
      id: candidata.normaId,
      fichaId: candidata.fichaId,
      tipo: candidata.tipo,
      unidad: candidata.unidad,
    },
    operacion: 'NINGUNA' as OperacionRealizada,
    resultado: null as ResultadoEstadistico | null,
    aplicabilidad: candidata.aplicabilidad,
    calidad: candidata.calidad,
    estadoNorma: candidata.estadoNorma,
    conflicto: candidata.conflicto,
    procedencia: candidata.procedencia,
    limitaciones: candidata.limitaciones,
    advertencias: candidata.advertencias,
  };

  const utilizable =
    candidata.aplicabilidad === 'APLICABLE' ||
    candidata.aplicabilidad === 'APLICABLE_CON_RESERVAS';

  if (!utilizable) {
    return {
      ...base,
      estado: 'NORMA_NO_APLICABLE',
      motivo: `La norma no corresponde a este caso (${candidata.aplicabilidad}). No se interpreta nada con ella`,
    };
  }

  // Se comprueba aunque la aplicabilidad ya lo cubra: un cambio futuro en la
  // resolución no debe poder abrir la puerta a comparar magnitudes distintas.
  if (observado.unidad !== candidata.unidad) {
    return {
      ...base,
      estado: 'UNIDAD_INCOMPATIBLE',
      motivo: `La medición está en ${observado.unidad} y la norma en ${candidata.unidad}. El motor no convierte unidades`,
    };
  }

  const permiso = autorizar(candidata.tipo, solicitud);
  if (!permiso.autorizada) {
    const estado: EstadoInterpretacion =
      solicitud === 'PUNTO_DE_CORTE'
        ? 'SIN_PUNTO_DE_CORTE_ADMISIBLE'
        : solicitud === 'CLASIFICACION'
          ? 'SIN_CLASIFICACION_ADMISIBLE'
          : 'OPERACION_NO_AUTORIZADA';
    return { ...base, estado, motivo: permiso.motivo };
  }

  if (permiso.operacion === 'LOCALIZAR_EN_PERCENTILES') {
    if (candidata.valores.tipo !== 'percentiles') {
      return {
        ...base,
        estado: 'DATOS_INSUFICIENTES',
        motivo: 'La norma se declara TN-1 y no aporta percentiles publicados',
      };
    }
    const r = localizarEnPercentiles(observado.valor, candidata.valores.percentiles);
    return { ...base, operacion: permiso.operacion, ...r };
  }

  if (permiso.operacion === 'PUNTUACION_Z') {
    if (candidata.valores.tipo !== 'media_dispersion') {
      return {
        ...base,
        estado: 'DATOS_INSUFICIENTES',
        motivo: 'La norma se declara TN-2 y no aporta media con dispersión',
      };
    }
    const { media, desviacionTipica } = candidata.valores;
    const r = puntuacionZ(observado.valor, media, desviacionTipica);
    if (!r) {
      return {
        ...base,
        estado: 'DATOS_INSUFICIENTES',
        motivo: `La desviación típica publicada (${desviacionTipica}) no permite calcular una puntuación z`,
      };
    }
    return { ...base, operacion: permiso.operacion, ...r };
  }

  return { ...base, estado: 'OPERACION_NO_AUTORIZADA', motivo: permiso.motivo };
}

/**
 * Interpreta contra **todas** las candidatas utilizables.
 *
 * Devuelve un resultado por norma. **No elige, no ordena y no consolida**: si
 * hay dos normas aplicables, hay dos resultados, y decidir cuál usar es una
 * decisión externa que debe declararse.
 */
export function interpretarConjunto(
  observado: ValorObservado,
  candidatas: readonly Candidata[],
  solicitud: OperacionSolicitada = 'AUTOMATICA',
): readonly ResultadoInterpretacion[] {
  const utilizables = candidatas.filter(
    (c) => c.aplicabilidad === 'APLICABLE' || c.aplicabilidad === 'APLICABLE_CON_RESERVAS',
  );

  if (utilizables.length === 0) {
    return [
      sinNorma(
        observado,
        'SIN_NORMA_APLICABLE',
        'No existe ninguna norma admisible aplicable con la información disponible. ' +
          'Esto describe la evidencia, no al sujeto',
      ),
    ];
  }

  return utilizables.map((c) => interpretar(observado, c, solicitud));
}
