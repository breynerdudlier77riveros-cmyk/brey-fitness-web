// ── Reglas complementarias de evidencia, PIE-02…PIE-05, PIE-13, PIE-14 ─────
// Acotan lo que la interpretación principal permite afirmar: alcance,
// población, nivel de evidencia y validez de constructo.
//
// Existen porque una capacidad «caracterizada» sin sus acotaciones se lee como
// si estuviera medida, y ninguna correspondencia de la PKB v1.0 lo está.

import { definicionCapacidad } from '../capacidades';
import type { EstadoCapacidad } from '../resultado';
import { etiquetaCapacidad, etiquetaNivel, etiquetaPoblacion } from './etiquetas';
import { enumerar, render } from './render';
import { construirInterpretacion } from './trazabilidad';
import type { FichaPKB, Interpretacion } from './tipos';

const APLICABLES = new Set(['respaldada', 'parcialmente_respaldada']);

export function fichasAplicables(fichas: readonly FichaPKB[]): FichaPKB[] {
  return fichas.filter((f) => APLICABLES.has(f.estado));
}

export function complementarias(
  estado: EstadoCapacidad,
  fichas: readonly FichaPKB[],
  hallazgos: readonly string[]
): Interpretacion[] {
  if (definicionCapacidad(estado.capacidad).reservada) return [];

  const capacidad = etiquetaCapacidad(estado);
  const salida: Interpretacion[] = [];

  const base = (ficha: FichaPKB) => ({
    clave: `${estado.capacidad}|${ficha.id}`,
    bloque: 'capacidad' as const,
    capacidades: [estado.capacidad],
    estadoFuncional: estado.estado,
    hallazgos,
    fichas: [ficha],
    nivelEvidencia: ficha.nivelEvidencia,
  });

  for (const ficha of fichasAplicables(fichas)) {
    salida.push(
      construirInterpretacion({
        ...base(ficha), regla: 'PIE-02', prioridad: 'media', plantilla: 'CAP_ALCANCE',
        texto: render('CAP_ALCANCE', { capacidad, alcance: ficha.alcanceAutorizado }),
      })
    );

    salida.push(
      construirInterpretacion({
        ...base(ficha), regla: 'PIE-03', prioridad: 'informativa',
        plantilla: 'EVIDENCIA_POBLACION',
        texto: render('EVIDENCIA_POBLACION', {
          capacidad,
          poblaciones: enumerar(ficha.poblaciones.map(etiquetaPoblacion)),
        }),
      })
    );

    if (ficha.nivelEvidencia === 'baja' || ficha.nivelEvidencia === 'muy_baja') {
      salida.push(
        construirInterpretacion({
          ...base(ficha), regla: 'PIE-04', prioridad: 'alta',
          plantilla: 'EVIDENCIA_NIVEL_BAJO',
          texto: render('EVIDENCIA_NIVEL_BAJO', {
            capacidad, nivel: etiquetaNivel(ficha.nivelEvidencia),
          }),
        })
      );
    }

    if (ficha.limitaciones.includes('validez_constructo_no_verificada')) {
      salida.push(
        construirInterpretacion({
          ...base(ficha), regla: 'PIE-05', prioridad: 'alta',
          plantilla: 'EVIDENCIA_CONSTRUCTO',
          texto: render('EVIDENCIA_CONSTRUCTO', { capacidad }),
        })
      );
    }
  }

  for (const ficha of fichas.filter((f) => f.estado === 'insuficiente')) {
    salida.push(
      construirInterpretacion({
        ...base(ficha), regla: 'PIE-13', prioridad: 'media',
        plantilla: 'EVIDENCIA_INSUFICIENTE_PKB',
        texto: render('EVIDENCIA_INSUFICIENTE_PKB', { capacidad }),
      })
    );
  }

  for (const ficha of fichas.filter((f) => f.estado === 'no_recomendada')) {
    salida.push(
      construirInterpretacion({
        ...base(ficha), regla: 'PIE-14', prioridad: 'alta',
        plantilla: 'EVIDENCIA_NO_RECOMENDADA',
        texto: render('EVIDENCIA_NO_RECOMENDADA', { capacidad, prueba: ficha.pruebaId }),
      })
    );
  }

  return salida;
}
