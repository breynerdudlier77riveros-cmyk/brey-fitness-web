// ── La evolución de cada prueba (Sprint PAS-14) ────────────────────────────
//
// Reúne todos los registros de una misma prueba a lo largo del expediente para
// poder dibujar «¿mejoré o empeoré?», que es la pregunta que un atleta se hace
// antes que ninguna otra.
//
// ── LO QUE PASA CUANDO UNA FECHA TIENE VARIOS VALORES ─────────────────────
//
//   Es el caso real que destapó todo esto: cuatro 1RM el mismo día —100, 120,
//   150 y 50 kg— sin forma de saber cuál vale.
//
//   La tentación es elegir uno (el mayor, el último, la media) y dibujar una
//   línea limpia. Sería mentir con un gráfico, que es la peor forma de mentir:
//   una línea ascendente convence sin que nadie la lea con cuidado.
//
//   Así que el punto se marca como AMBIGUO: se dibujan todos sus valores y la
//   línea NO lo atraviesa. El gráfico se rompe justo donde los datos se
//   contradicen, que es exactamente lo que hay que ver.
//
// ── UNA PRUEBA, UNA UNIDAD ────────────────────────────────────────────────
//
//   Si una prueba aparece con unidades distintas, la serie no se construye: no
//   hay eje común y el sistema no convierte (regla de comparabilidad). Se dice
//   por qué, en vez de dibujar una línea que mezcla escalas.
//
// Módulo puro.

export interface PuntoSerie {
  fecha: string;
  /** Todos los valores registrados esa fecha. Casi siempre uno. */
  valores: number[];
  /** Más de un valor distinto: la línea no atraviesa este punto. */
  ambiguo: boolean;
}

export interface SeriePrueba {
  pruebaId: string;
  unidad: string;
  puntos: PuntoSerie[];
  /** Por qué no se puede dibujar, si es el caso. */
  bloqueo: string | null;
}

export interface MedicionSerie {
  pruebaId: string;
  valor: number;
  unidad: string;
  fecha: string;
}

/**
 * Una serie por prueba, ordenada por fecha.
 *
 * Se incluyen las pruebas con UN solo punto: el gráfico no se dibuja para
 * ellas, pero saber que existe una sola medición es información —es la
 * diferencia entre «no ha cambiado» y «todavía no hay con qué compararlo».
 */
export function seriesPorPrueba(mediciones: readonly MedicionSerie[]): SeriePrueba[] {
  const porPrueba = new Map<string, MedicionSerie[]>();
  for (const m of mediciones) {
    porPrueba.set(m.pruebaId, [...(porPrueba.get(m.pruebaId) ?? []), m]);
  }

  const salida: SeriePrueba[] = [];

  for (const [pruebaId, lista] of porPrueba) {
    const unidades = [...new Set(lista.map((m) => m.unidad))];

    if (unidades.length > 1) {
      salida.push({
        pruebaId,
        unidad: unidades[0],
        puntos: [],
        bloqueo:
          `Esta prueba está registrada en ${unidades.join(' y ')}. No hay un eje común ` +
          'y el sistema no convierte entre unidades, así que no se dibuja su evolución.',
      });
      continue;
    }

    const porFecha = new Map<string, number[]>();
    for (const m of lista) {
      porFecha.set(m.fecha, [...(porFecha.get(m.fecha) ?? []), m.valor]);
    }

    const puntos: PuntoSerie[] = [...porFecha.entries()]
      .map(([fecha, valores]) => ({
        fecha,
        valores,
        // Dos registros del MISMO valor no son ambiguos: son un duplicado
        // exacto, que se reporta en otro sitio y no impide leer la evolución.
        ambiguo: new Set(valores).size > 1,
      }))
      .sort((a, b) => a.fecha.localeCompare(b.fecha));

    salida.push({ pruebaId, unidad: unidades[0] ?? '', puntos, bloqueo: null });
  }

  return salida.sort((a, b) => a.pruebaId.localeCompare(b.pruebaId));
}

/**
 * El valor que representa a un punto, o `null` si no lo hay.
 *
 * Un punto ambiguo NO tiene representante: es justo lo que significa. Que esta
 * función devuelva `null` es lo que rompe la línea aguas arriba.
 */
export function valorDe(punto: PuntoSerie): number | null {
  if (punto.ambiguo) return null;
  return punto.valores[0] ?? null;
}
