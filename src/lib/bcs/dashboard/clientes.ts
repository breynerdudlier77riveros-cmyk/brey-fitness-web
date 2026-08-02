// ── Estado derivado por cliente (Sprint BCS-5.0) ───────────────────────────
// Índice interno que el resto de la capa consume. Se construye UNA vez y se
// reutiliza: sin esto, cada módulo recorrería el arreglo completo de
// mediciones por cada cliente.
//
// «Seguimiento» aquí significa exactamente «tiene 2 o más mediciones
// vigentes»: es el mínimo que el BCS necesita para comparar (BCS Handbook 07).
// No es un juicio sobre la constancia de nadie.

import type { Cliente, EnlacePublico, Medicion } from '@/lib/bcs/tipos';
import { diasEntre } from './fechas';

export interface ClienteIndexado {
  cliente: Cliente;
  medicionesVigentes: Medicion[];
  medicionesAnuladas: Medicion[];
  /** Fecha de la medición vigente más reciente, o null. */
  ultimaMedicion: string | null;
  diasSinMedicion: number | null;
  enlacesActivos: EnlacePublico[];
  enlacesRevocados: EnlacePublico[];
  tieneEnlaceActivo: boolean;
  /** 2 o más mediciones vigentes: el mínimo para comparar. */
  tieneSeguimiento: boolean;
}

export interface EntradaIndice {
  clientes: readonly Cliente[];
  mediciones: readonly Medicion[];
  enlaces: readonly EnlacePublico[];
  hoyISO: string;
}

/** Agrupa por `cliente_id` en una pasada. */
function agrupar<T extends { cliente_id: string }>(items: readonly T[]): Map<string, T[]> {
  const mapa = new Map<string, T[]>();
  for (const item of items) {
    const previos = mapa.get(item.cliente_id);
    if (previos) previos.push(item);
    else mapa.set(item.cliente_id, [item]);
  }
  return mapa;
}

/**
 * Construye el índice. No muta la entrada: los arreglos que quedan en el
 * índice son copias ordenadas, nunca las referencias recibidas.
 */
export function indexarClientes({ clientes, mediciones, enlaces, hoyISO }: EntradaIndice): ClienteIndexado[] {
  const medicionesPorCliente = agrupar(mediciones);
  const enlacesPorCliente = agrupar(enlaces);

  return clientes.map((cliente) => {
    const propias = medicionesPorCliente.get(cliente.id) ?? [];
    const vigentes = propias
      .filter((m) => m.estado === 'vigente')
      .slice()
      .sort((a, b) => b.fecha.localeCompare(a.fecha));
    const anuladas = propias.filter((m) => m.estado === 'anulada');

    const propiosEnlaces = enlacesPorCliente.get(cliente.id) ?? [];
    const activos = propiosEnlaces.filter((e) => e.estado === 'activo');
    const revocados = propiosEnlaces.filter((e) => e.estado === 'revocado');

    const ultimaMedicion = vigentes[0]?.fecha ?? null;

    return {
      cliente,
      medicionesVigentes: vigentes,
      medicionesAnuladas: anuladas,
      ultimaMedicion,
      diasSinMedicion: ultimaMedicion ? diasEntre(ultimaMedicion, hoyISO) : null,
      enlacesActivos: activos,
      enlacesRevocados: revocados,
      tieneEnlaceActivo: activos.length > 0,
      tieneSeguimiento: vigentes.length >= 2,
    };
  });
}

/** Clientes que cuentan para el consultorio: los eliminados quedan fuera. */
export function vigentes(indice: readonly ClienteIndexado[]): ClienteIndexado[] {
  return indice.filter((c) => c.cliente.estado !== 'eliminado');
}
