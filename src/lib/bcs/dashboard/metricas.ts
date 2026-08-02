// ── Métricas del consultorio (Sprint BCS-5.0) ──────────────────────────────
// Solo recuentos y medias sobre datos ya cargados. Ninguna métrica de este
// archivo introduce interpretación: no hay índices compuestos, ni
// puntuaciones, ni umbrales de «buen consultorio».

import type { ClienteIndexado } from './clientes';
import { vigentes } from './clientes';
import { mesDe } from './fechas';
import type { EstadoConsultorio, ResumenGeneral } from './tipos';

/** Redondeo a un decimal. Media de 0 clientes es 0, no NaN. */
function media(total: number, cantidad: number): number {
  if (cantidad === 0) return 0;
  return Math.round((total / cantidad) * 10) / 10;
}

export function calcularResumen(indice: readonly ClienteIndexado[], hoyISO: string): ResumenGeneral {
  const mesActual = mesDe(hoyISO);
  const contables = vigentes(indice);

  const medicionesVigentes = indice.reduce((n, c) => n + c.medicionesVigentes.length, 0);
  const medicionesAnuladas = indice.reduce((n, c) => n + c.medicionesAnuladas.length, 0);

  const medicionesEsteMes = indice.reduce(
    (n, c) => n + c.medicionesVigentes.filter((m) => mesDe(m.fecha) === mesActual).length,
    0
  );

  const clientesNuevosEsteMes = indice.filter(
    (c) => mesDe(c.cliente.created_at) === mesActual
  ).length;

  return {
    clientesActivos: indice.filter((c) => c.cliente.estado === 'activo').length,
    clientesArchivados: indice.filter((c) => c.cliente.estado === 'archivado').length,
    clientesEliminados: indice.filter((c) => c.cliente.estado === 'eliminado').length,
    totalClientes: contables.length,
    totalMediciones: medicionesVigentes + medicionesAnuladas,
    medicionesVigentes,
    medicionesAnuladas,
    promedioMediciones: media(
      contables.reduce((n, c) => n + c.medicionesVigentes.length, 0),
      contables.length
    ),
    medicionesEsteMes,
    clientesNuevosEsteMes,
  };
}

export function calcularEstadoConsultorio(indice: readonly ClienteIndexado[]): EstadoConsultorio {
  const contables = vigentes(indice);

  return {
    activos: contables.filter((c) => c.cliente.estado === 'activo').length,
    archivados: contables.filter((c) => c.cliente.estado === 'archivado').length,
    sinMediciones: contables.filter((c) => c.medicionesVigentes.length === 0).length,
    conUnaMedicion: contables.filter((c) => c.medicionesVigentes.length === 1).length,
    conSeguimiento: contables.filter((c) => c.tieneSeguimiento).length,
    conMasDeCinco: contables.filter((c) => c.medicionesVigentes.length > 5).length,
    conEnlacePublico: contables.filter((c) => c.tieneEnlaceActivo).length,
    // Sin seguimiento = menos de dos mediciones vigentes, es decir, todavía no
    // hay nada que comparar. No implica abandono ni inactividad del cliente.
    sinSeguimiento: contables.filter((c) => !c.tieneSeguimiento).length,
  };
}

/** Mediciones vigentes registradas en los últimos `dias` días. */
export function medicionesEnVentana(
  indice: readonly ClienteIndexado[],
  hoyISO: string,
  dias: number
): number {
  const limite = Date.parse(`${hoyISO}T00:00:00Z`) - dias * 86_400_000;
  return indice.reduce(
    (n, c) =>
      n +
      c.medicionesVigentes.filter((m) => {
        const t = Date.parse(`${m.fecha}T00:00:00Z`);
        return !Number.isNaN(t) && t >= limite;
      }).length,
    0
  );
}
