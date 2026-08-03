// ── Conflictos de contenido del registro (Sprint PAS-2.0) ──────────────────
// El registro contra la definición de su prueba, y los registros entre sí.
// Ninguna comprobación de aquí decide nada: detecta y describe.

import { crearAcumulador } from './acumulador';
import { agrupar, esDivergente, esDuplicadoExacto, esRepeticionNoAdmitida, idsDe } from './duplicados';
import type { DefinicionPrueba, EvaluacionPAS } from './tipos';
import type { Conflicto } from './resultado';

export function conflictosDeRegistros(
  evaluaciones: readonly EvaluacionPAS[],
  indice: ReadonlyMap<string, DefinicionPrueba>
): Conflicto[] {
  const acc = crearAcumulador();
  const todos = evaluaciones.flatMap((e) => e.registros);

  for (const registro of todos) {
    const definicion = indice.get(registro.pruebaId);

    if (!definicion) {
      acc.push('prueba_no_catalogada', registro.id, 'REG-01', {
        registros: [registro.id],
        pruebas: [registro.pruebaId],
      });
      continue;
    }

    // La naturaleza del resultado la declara la prueba. Un valor de otra
    // variante no se convierte: convertirlo sería interpretar.
    if (registro.valor.tipo !== definicion.naturaleza) {
      acc.push('valor_incompatible', registro.id, 'REG-02', {
        registros: [registro.id],
        pruebas: [registro.pruebaId],
        detalle: { esperado: definicion.naturaleza, recibido: registro.valor.tipo },
      });
    }

    if (definicion.requierePatron && (registro.patron === null || registro.patron.trim() === '')) {
      acc.push('patron_ausente', registro.id, 'REG-03', {
        registros: [registro.id],
        pruebas: [registro.pruebaId],
      });
    }
  }

  for (const grupo of agrupar(todos)) {
    const definicion = indice.get(grupo.pruebaId);
    const clave = `${grupo.pruebaId}|${grupo.fecha}`;

    if (esDuplicadoExacto(grupo)) {
      acc.push('duplicado_exacto', clave, 'REG-04', {
        registros: idsDe(grupo),
        pruebas: [grupo.pruebaId],
        detalle: { fecha: grupo.fecha },
      });
    }

    if (esDivergente(grupo)) {
      acc.push('resultado_divergente', clave, 'REG-05', {
        registros: idsDe(grupo),
        pruebas: [grupo.pruebaId],
        detalle: { fecha: grupo.fecha, valores: grupo.valoresDistintos.join(' | ') },
      });
    }

    if (definicion && esRepeticionNoAdmitida(grupo, definicion.repetible)) {
      acc.push('repeticion_no_admitida', clave, 'REG-06', {
        registros: idsDe(grupo),
        pruebas: [grupo.pruebaId],
        detalle: { fecha: grupo.fecha, total: String(grupo.registros.length) },
      });
    }
  }

  return acc.lista;
}
