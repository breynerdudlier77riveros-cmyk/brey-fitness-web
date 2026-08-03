// ── Conflictos del catálogo (Sprint PAS-2.0) ───────────────────────────────
// Incoherencias en las DEFINICIONES, no en los datos del atleta. Se detectan
// aparte porque su responsable es otro: un dato malo lo corrige quien evaluó;
// un catálogo mal declarado lo corrige quien lo cura.

import { crearAcumulador } from './acumulador';
import { definicionCapacidad, FAMILIAS_SOLO_CONTEXTO } from './capacidades';
import type { CatalogoPruebas } from './tipos';
import type { Conflicto } from './resultado';

export function conflictosDeCatalogo(catalogo: CatalogoPruebas): Conflicto[] {
  const acc = crearAcumulador();
  const pruebas = [...catalogo.pruebas].sort((a, b) => a.id.localeCompare(b.id));
  const vistas = new Set<string>();

  for (const prueba of pruebas) {
    if (vistas.has(prueba.id)) {
      acc.push('prueba_no_catalogada', `duplicada|${prueba.id}`, 'CAT-00', {
        pruebas: [prueba.id],
        detalle: { motivo: 'definicion_repetida' },
      });
    }
    vistas.add(prueba.id);

    // F-J se registra como contexto: una talla o un perímetro no informan de
    // ninguna capacidad funcional por sí mismos (`04-pruebas.md`).
    if (FAMILIAS_SOLO_CONTEXTO.includes(prueba.familia) && prueba.contribuciones.length > 0) {
      acc.push('contribucion_de_familia_contexto', prueba.id, 'CAT-01', {
        pruebas: [prueba.id],
        capacidades: prueba.contribuciones.map((c) => c.capacidad),
        detalle: { familia: prueba.familia },
      });
    }

    for (const contribucion of prueba.contribuciones) {
      const clave = `${prueba.id}|${contribucion.capacidad}`;

      if (contribucion.referencia === null || contribucion.referencia.trim() === '') {
        acc.push('contribucion_sin_referencia', clave, 'CAT-02', {
          pruebas: [prueba.id],
          capacidades: [contribucion.capacidad],
        });
      }

      if (definicionCapacidad(contribucion.capacidad).reservada) {
        acc.push('contribucion_a_capacidad_reservada', clave, 'CAT-03', {
          pruebas: [prueba.id],
          capacidades: [contribucion.capacidad],
        });
      }
    }
  }

  return acc.lista;
}
