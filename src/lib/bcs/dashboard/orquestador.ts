// ── Orquestador del Dashboard Analytics (Sprint BCS-5.0) ───────────────────
// Punto de entrada único. Recibe los datos ya cargados, construye el índice una
// sola vez y lo reparte entre los módulos de cálculo.
//
// Puro y determinista: mismas entradas → mismo DTO, con igualdad profunda. No
// consulta Supabase, no lee el reloj (`hoyISO` llega como parámetro) y no muta
// nada de lo recibido.

import { indexarClientes } from './clientes';
import { construirActividadMensual, construirActividadReciente, MESES_POR_DEFECTO } from './actividad';
import { construirSeries } from './graficos';
import { calcularEstadoConsultorio, calcularResumen } from './metricas';
import { construirSeguimiento } from './seguimiento';
import { construirAlertas, construirDistribuciones } from './tendencias';
import type { DashboardAnalytics, EntradaDashboard } from './tipos';

export interface OpcionesDashboard {
  /** Meses cubiertos por la serie de actividad. Por defecto 12. */
  meses?: number;
  /** Eventos devueltos en actividad reciente. Por defecto 20. */
  eventosRecientes?: number;
}

export function construirDashboard(
  entrada: EntradaDashboard,
  opciones: OpcionesDashboard = {}
): DashboardAnalytics {
  const { hoyISO } = entrada;
  const meses = opciones.meses ?? MESES_POR_DEFECTO;

  // Índice único: el resto de módulos trabaja sobre él, nunca sobre los
  // arreglos crudos. Evita recorrer todas las mediciones una vez por cliente.
  const indice = indexarClientes(entrada);

  const actividadMensual = construirActividadMensual(indice, hoyISO, meses);
  const distribuciones = construirDistribuciones(indice);

  return {
    resumen: calcularResumen(indice, hoyISO),
    consultorio: calcularEstadoConsultorio(indice),
    actividadMensual,
    seguimiento: construirSeguimiento(indice),
    alertas: construirAlertas(indice, hoyISO),
    distribuciones,
    actividadReciente: construirActividadReciente(indice, opciones.eventosRecientes ?? 20),
    series: construirSeries(actividadMensual, distribuciones),
    meta: {
      hoyISO,
      mesesCubiertos: meses,
      consultorioVacio: indice.every((c) => c.cliente.estado === 'eliminado'),
    },
  };
}
