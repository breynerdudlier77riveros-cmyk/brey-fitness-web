// ── Seguimiento (Sprint BCS-5.0) ───────────────────────────────────────────
// Antigüedad de la última medición de cada cliente, ordenada de mayor a menor.
//
// LÍMITE DELIBERADO: esta capa muestra CUÁNTO tiempo ha pasado, nunca cuándo
// medir de nuevo. Ninguna fuente del ecosistema documenta una periodicidad
// —verificado en la Clinical Knowledge Base, módulo 12 §4— y el Recommendation
// Engine ya declara ese ámbito como no cubierto. Un dashboard que ordenara por
// «urgencia» estaría inventando ese criterio por la puerta de atrás.

import type { ClienteIndexado } from './clientes';
import { vigentes } from './clientes';
import type { FilaSeguimiento } from './tipos';

/**
 * Filas de seguimiento ordenadas por antigüedad descendente.
 *
 * Los clientes SIN ninguna medición van al final, no al principio: no tienen
 * antigüedad que medir, y colocarlos arriba los presentaría como los más
 * atrasados cuando en realidad no han empezado.
 */
export function construirSeguimiento(indice: readonly ClienteIndexado[]): FilaSeguimiento[] {
  const filas: FilaSeguimiento[] = vigentes(indice).map((c) => ({
    clienteId: c.cliente.id,
    nombre: c.cliente.nombre,
    estado: c.cliente.estado,
    ultimaMedicion: c.ultimaMedicion,
    diasSinMedicion: c.diasSinMedicion,
    totalMediciones: c.medicionesVigentes.length,
    tieneEnlaceActivo: c.tieneEnlaceActivo,
  }));

  return filas.sort((a, b) => {
    const sinA = a.diasSinMedicion === null;
    const sinB = b.diasSinMedicion === null;
    if (sinA && sinB) return a.nombre.localeCompare(b.nombre);
    if (sinA) return 1;
    if (sinB) return -1;
    if (b.diasSinMedicion !== a.diasSinMedicion) {
      return (b.diasSinMedicion as number) - (a.diasSinMedicion as number);
    }
    // Desempate estable: sin esto, dos clientes con la misma antigüedad
    // podrían alternar posición entre ejecuciones.
    return a.nombre.localeCompare(b.nombre);
  });
}

/** Clientes sin ninguna medición vigente registrada. */
export function sinMedicionAlguna(filas: readonly FilaSeguimiento[]): FilaSeguimiento[] {
  return filas.filter((f) => f.diasSinMedicion === null);
}
