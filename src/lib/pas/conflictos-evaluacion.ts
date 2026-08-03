// ── Conflictos de estructura de la evaluación (Sprint PAS-2.0) ─────────────
// Identidades, fechas y cobertura de la sesión. Nada de esto mira el VALOR de
// un registro: solo si la sesión que lo contiene es coherente consigo misma.

import { crearAcumulador } from './acumulador';
import { compararFechas, esFechaISO, esFutura } from './fechas';
import type { EvaluacionPAS } from './tipos';
import type { Conflicto } from './resultado';

export function conflictosDeEvaluaciones(
  evaluaciones: readonly EvaluacionPAS[],
  atletaId: string,
  hoyISO: string
): Conflicto[] {
  const acc = crearAcumulador();
  const vistasEval = new Set<string>();
  const vistasRegistro = new Set<string>();
  const iniciales: string[] = [];

  for (const evaluacion of evaluaciones) {
    if (vistasEval.has(evaluacion.id)) {
      acc.push('id_evaluacion_repetida', evaluacion.id, 'EST-01', {
        evaluaciones: [evaluacion.id],
      });
    }
    vistasEval.add(evaluacion.id);

    if (evaluacion.atletaId !== atletaId) {
      acc.push('atleta_divergente', evaluacion.id, 'EST-02', {
        evaluaciones: [evaluacion.id],
        detalle: { esperado: atletaId, recibido: evaluacion.atletaId },
      });
    }

    if (evaluacion.tipo === 'T-01') iniciales.push(evaluacion.id);

    if (evaluacion.registros.length === 0) {
      acc.push('evaluacion_sin_registros', evaluacion.id, 'EST-03', {
        evaluaciones: [evaluacion.id],
      });
    }

    if (!esFechaISO(evaluacion.fecha)) {
      acc.push('fecha_invalida', `eval|${evaluacion.id}`, 'EST-04', {
        evaluaciones: [evaluacion.id],
        detalle: { fecha: evaluacion.fecha },
      });
    } else if (esFutura(evaluacion.fecha, hoyISO)) {
      acc.push('fecha_futura', `eval|${evaluacion.id}`, 'EST-05', {
        evaluaciones: [evaluacion.id],
        detalle: { fecha: evaluacion.fecha, hoy: hoyISO },
      });
    }

    for (const registro of evaluacion.registros) {
      if (vistasRegistro.has(registro.id)) {
        acc.push('id_registro_repetido', registro.id, 'EST-06', {
          evaluaciones: [evaluacion.id],
          registros: [registro.id],
        });
      }
      vistasRegistro.add(registro.id);

      if (!esFechaISO(registro.fecha)) {
        acc.push('fecha_invalida', `reg|${registro.id}`, 'EST-04', {
          evaluaciones: [evaluacion.id],
          registros: [registro.id],
          detalle: { fecha: registro.fecha },
        });
        continue;
      }

      if (esFutura(registro.fecha, hoyISO)) {
        acc.push('fecha_futura', `reg|${registro.id}`, 'EST-05', {
          evaluaciones: [evaluacion.id],
          registros: [registro.id],
          detalle: { fecha: registro.fecha, hoy: hoyISO },
        });
      }

      // Un registro anterior a su propia sesión no puede haberse tomado en
      // ella. Es un dato imposible, no un dato viejo.
      if (esFechaISO(evaluacion.fecha) && compararFechas(registro.fecha, evaluacion.fecha) < 0) {
        acc.push('registro_anterior_a_evaluacion', registro.id, 'EST-07', {
          evaluaciones: [evaluacion.id],
          registros: [registro.id],
          detalle: { registro: registro.fecha, evaluacion: evaluacion.fecha },
        });
      }
    }
  }

  // T-01 es única por atleta (`06-tipos-de-evaluacion.md`): el sistema no
  // admite dos inicios sin cierre intermedio.
  if (iniciales.length > 1) {
    const ordenadas = [...iniciales].sort();
    acc.push('evaluacion_inicial_duplicada', ordenadas.join('|'), 'EST-08', {
      evaluaciones: ordenadas,
    });
  }

  return acc.lista;
}
