// ── Series para gráficos (Sprint BCS-5.0) ──────────────────────────────────
// Da forma a datos que otros módulos ya calcularon. No agrega ni interpreta:
// convierte MesActividad[] y las distribuciones en series listas para pintar.
//
// Los componentes de gráfico reciben estas series y solo dibujan; ninguna
// decisión sobre qué mostrar vive en la capa de presentación.

import { etiquetaMes } from './fechas';
import type { Distribuciones, MesActividad, PuntoSerie, SeriesGraficos } from './tipos';

export function construirSeries(
  actividad: readonly MesActividad[],
  distribuciones: Distribuciones
): SeriesGraficos {
  const medicionesPorMes: PuntoSerie[] = actividad.map((m) => ({
    etiqueta: etiquetaMes(m.mes),
    valor: m.mediciones,
  }));

  const clientesNuevosPorMes: PuntoSerie[] = actividad.map((m) => ({
    etiqueta: etiquetaMes(m.mes),
    valor: m.clientesNuevos,
  }));

  return {
    medicionesPorMes,
    clientesNuevosPorMes,
    distribucionEstado: distribuciones.porEstado,
    distribucionMediciones: distribuciones.porNumeroDeMediciones,
    sparklineMediciones: actividad.map((m) => m.mediciones),
  };
}

/**
 * Escala de una serie a un rango de píxeles.
 *
 * Devuelve `null` cuando no hay nada que dibujar: una serie vacía, o una serie
 * plana en cero. Dibujar una línea en el suelo del gráfico sugeriría un mínimo
 * medido cuando lo que hay es ausencia de datos.
 */
export function escalar(
  valores: readonly number[],
  alto: number,
  padding: number
): { puntos: number[]; maximo: number } | null {
  if (valores.length === 0) return null;
  const maximo = Math.max(...valores);
  if (maximo <= 0) return null;

  const util = alto - padding * 2;
  return {
    puntos: valores.map((v) => padding + (1 - v / maximo) * util),
    maximo,
  };
}

/** Segmentos de un donut como porcentajes acumulados. Total 0 devuelve []. */
export function segmentosDonut(
  segmentos: readonly { etiqueta: string; valor: number }[]
): { etiqueta: string; valor: number; porcentaje: number; desde: number }[] {
  const total = segmentos.reduce((n, s) => n + s.valor, 0);
  if (total === 0) return [];

  let acumulado = 0;
  return segmentos
    .filter((s) => s.valor > 0)
    .map((s) => {
      const porcentaje = (s.valor / total) * 100;
      const desde = acumulado;
      acumulado += porcentaje;
      return { ...s, porcentaje, desde };
    });
}
