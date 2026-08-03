// ── Regla principal por capacidad, PIE-01 y PIE-06…PIE-12 (Sprint PAS-4.0) ─
// Una interpretación por capacidad, derivada de su estado en el Perfil
// Funcional. Las que acotan lo afirmable viven en `reglas-evidencia.ts`.
//
// Ninguna regla mira registros: parten del Estado de Capacidad ya derivado.

import { definicionCapacidad } from '../capacidades';
import type { EstadoCapacidad } from '../resultado';
import { etiquetaCapacidad, etiquetaMotivo, etiquetaNivel } from './etiquetas';
import { complementarias, fichasAplicables } from './reglas-evidencia';
import { enumerar, render } from './render';
import { construirInterpretacion } from './trazabilidad';
import type { FichaPKB, Interpretacion } from './tipos';

export interface ContextoCapacidad {
  estado: EstadoCapacidad;
  /** Fichas de la PKB que declaran algo sobre esta capacidad. */
  fichas: readonly FichaPKB[];
  /** Ids de hallazgos del PAE referidos a esta capacidad. */
  hallazgos: readonly string[];
}

function principal(ctx: ContextoCapacidad): Interpretacion {
  const { estado } = ctx;
  const capacidad = etiquetaCapacidad(estado);
  const comun = {
    clave: estado.capacidad,
    bloque: 'capacidad' as const,
    capacidades: [estado.capacidad],
    estadoFuncional: estado.estado,
    hallazgos: ctx.hallazgos,
  };

  if (definicionCapacidad(estado.capacidad).reservada) {
    return construirInterpretacion({
      ...comun, regla: 'PIE-11', prioridad: 'informativa', plantilla: 'CAP_RESERVADA',
      texto: render('CAP_RESERVADA', { capacidad }),
    });
  }

  const aplicables = fichasAplicables(ctx.fichas);

  switch (estado.estado) {
    case 'evaluada': {
      const ficha = aplicables[0];

      // Una capacidad puede quedar «evaluada» en el PAE por un catálogo de
      // pruebas que la PKB no respalda. El PIE lo dice en vez de heredar la
      // caracterización sin comprobarla.
      if (!ficha) {
        return construirInterpretacion({
          ...comun, regla: 'PIE-12', prioridad: 'alta',
          plantilla: 'CAP_SIN_CORRESPONDENCIA',
          texto: render('CAP_SIN_CORRESPONDENCIA', { capacidad }),
        });
      }

      return construirInterpretacion({
        ...comun, regla: 'PIE-01', prioridad: 'media', plantilla: 'CAP_CARACTERIZADA',
        texto: render('CAP_CARACTERIZADA', {
          capacidad,
          nivel: etiquetaNivel(ficha.nivelEvidencia),
          pruebas: enumerar(aplicables.map((f) => f.pruebaId)),
        }),
        fichas: aplicables,
        nivelEvidencia: ficha.nivelEvidencia,
      });
    }

    case 'parcialmente_evaluada':
      return construirInterpretacion({
        ...comun, regla: 'PIE-06', prioridad: 'media', plantilla: 'CAP_COBERTURA_PARCIAL',
        texto: render('CAP_COBERTURA_PARCIAL', { capacidad }),
        fichas: aplicables,
        nivelEvidencia: aplicables[0]?.nivelEvidencia ?? null,
      });

    case 'desactualizada':
      return construirInterpretacion({
        ...comun, regla: 'PIE-07', prioridad: 'alta', plantilla: 'CAP_NO_VIGENTE',
        texto: render('CAP_NO_VIGENTE', {
          capacidad,
          fecha: estado.ultimaFecha ?? 'fecha no registrada',
        }),
        fichas: aplicables,
      });

    case 'en_conflicto':
      return construirInterpretacion({
        ...comun, regla: 'PIE-08', prioridad: 'alta', plantilla: 'CAP_CONFLICTO',
        texto: render('CAP_CONFLICTO', {
          capacidad,
          registros: enumerar(estado.traza.incluidos),
        }),
        fichas: aplicables,
      });

    case 'desconocida': {
      if (estado.traza.excluidos.length === 0) {
        return construirInterpretacion({
          ...comun, regla: 'PIE-09', prioridad: 'media', plantilla: 'CAP_SIN_EVIDENCIA',
          texto: render('CAP_SIN_EVIDENCIA', { capacidad }),
        });
      }

      const motivos = [
        ...new Set(estado.traza.excluidos.map((e) => etiquetaMotivo(e.motivo))),
      ].sort();

      return construirInterpretacion({
        ...comun, regla: 'PIE-10', prioridad: 'alta',
        plantilla: 'CAP_EVIDENCIA_NO_ELEGIBLE',
        texto: render('CAP_EVIDENCIA_NO_ELEGIBLE', {
          capacidad,
          motivos: enumerar(motivos),
        }),
      });
    }
  }
}

export function interpretarCapacidad(ctx: ContextoCapacidad): Interpretacion[] {
  return [principal(ctx), ...complementarias(ctx.estado, ctx.fichas, ctx.hallazgos)];
}
