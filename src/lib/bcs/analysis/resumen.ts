// ── Resumen ejecutivo del análisis (Sprint I-03) ───────────────────────────
// Conservador por diseño y con una prioridad fija, para que lo primero que
// se lea sea siempre lo más importante:
//
//   1. insuficiencia de datos
//   2. alertas de consistencia
//   3. principales cambios comprobados
//   4. tendencias comprobadas
//   5. limitaciones interpretativas
//
// Sin frases motivacionales, sin recomendaciones de dieta o entrenamiento,
// sin causalidad. El tono `atencion` se refiere SIEMPRE a revisar un dato,
// nunca a la salud de la persona.

import type { Hallazgo, ResumenAnalisis, Suficiencia, TonoResumen } from './tipos';

export interface EntradaResumen {
  hallazgos: readonly Hallazgo[];
  cantidadMediciones: number;
  suficiencia: Suficiencia;
}

export function construirResumen({
  hallazgos,
  cantidadMediciones,
  suficiencia,
}: EntradaResumen): ResumenAnalisis {
  const usados: string[] = [];

  if (cantidadMediciones === 0) {
    return {
      titulo: 'Sin datos para analizar',
      texto: 'Todavía no hay mediciones registradas. Cuando se registre la primera, aquí aparecerá su análisis.',
      tono: 'neutral',
      hallazgosUsados: [],
      suficiencia: 'sin_datos',
    };
  }

  const calidad = hallazgos.filter((h) => h.categoria === 'calidad_de_dato');
  const cambios = hallazgos.filter((h) => h.id.startsWith('cambio:'));
  const tendencias = hallazgos.filter((h) => h.id.startsWith('tendencia:'));

  // 1 · Insuficiencia de datos manda sobre todo lo demás.
  if (cantidadMediciones === 1) {
    const base = hallazgos.find((h) => h.id === 'datos_insuficientes:una_medicion');
    if (base) usados.push(base.id);
    calidad.slice(0, 2).forEach((h) => usados.push(h.id));

    return {
      titulo: 'Primera medición registrada',
      texto:
        calidad.length > 0
          ? `Se registró la primera medición. Hay ${calidad.length === 1 ? 'un punto' : `${calidad.length} puntos`} del dato que conviene revisar. A partir de la segunda medición podrán mostrarse comparación y tendencias.`
          : 'Se registró la primera medición. A partir de la segunda podrán mostrarse la comparación y las tendencias.',
      tono: calidad.length > 0 ? 'atencion' : 'neutral',
      hallazgosUsados: usados,
      suficiencia: 'insuficiente',
    };
  }

  const partes: string[] = [];
  let tono: TonoResumen = 'neutral';

  // 2 · Alertas de consistencia.
  if (calidad.length > 0) {
    tono = 'atencion';
    calidad.slice(0, 3).forEach((h) => usados.push(h.id));
    partes.push(
      calidad.length === 1
        ? 'Hay un dato que conviene revisar antes de sacar conclusiones.'
        : `Hay ${calidad.length} datos que conviene revisar antes de sacar conclusiones.`
    );
  }

  // 3 · Principales cambios comprobados.
  if (cambios.length > 0) {
    if (tono === 'neutral') tono = 'informativo';
    const principales = cambios.slice(0, 3);
    principales.forEach((h) => usados.push(h.id));
    partes.push(
      `Entre las dos últimas mediciones: ${principales.map((h) => h.titulo.toLowerCase()).join('; ')}.`
    );
  } else {
    partes.push('No se registraron cambios entre las dos últimas mediciones.');
  }

  // 4 · Tendencias comprobadas.
  if (tendencias.length > 0) {
    if (tono === 'neutral') tono = 'informativo';
    const principales = tendencias.slice(0, 2);
    principales.forEach((h) => usados.push(h.id));
    partes.push(`En el histórico completo: ${principales.map((h) => h.titulo.toLowerCase()).join('; ')}.`);
  }

  // 5 · Limitaciones interpretativas.
  const parciales = hallazgos.filter((h) => h.suficiencia === 'parcial');
  if (parciales.length > 0) {
    partes.push(
      'Parte de los cambios corresponde a variables sin umbral de relevancia definido, así que se describen sin valorarlos.'
    );
  }

  return {
    titulo:
      tono === 'atencion'
        ? 'Análisis con datos por revisar'
        : cambios.length > 0
          ? 'Cambios registrados entre mediciones'
          : 'Sin cambios entre las últimas mediciones',
    texto: partes.join(' '),
    tono,
    hallazgosUsados: usados,
    suficiencia,
  };
}
