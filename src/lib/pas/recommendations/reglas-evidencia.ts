// ── Reglas derivadas de la base, PPRE-08…13 (Sprint PAS-6.0) ───────────────
// Parten de lo que la PKB declara sobre cada correspondencia. No evalúan
// evidencia: leen el estado, el nivel y las limitaciones ya publicados.

import type { CapacidadId } from '../capacidades';
import type { FichaPKB } from '../interpretation';
import { construirRecomendacion } from './constructor';
import { fichasConLimitacion, fichasPorEstado } from './contexto';
import type { ContextoPPRE } from './contexto';
import { interpretacionesDe } from './evidencia';
import { enumerar } from './render';
import type { CategoriaRecomendacion, PrioridadRecomendacion, Recomendacion } from './tipos';

const POBLACION: Readonly<Record<string, string>> = {
  atletas: 'deportistas',
  elite: 'deportistas de élite',
  recreacionales: 'practicantes recreacionales',
  adultos_mayores: 'adultos mayores',
  ninos: 'niños',
  adolescentes: 'adolescentes',
  rehabilitacion: 'personas en proceso de recuperación',
  clinicos: 'poblaciones clínicas',
  mixta: 'poblaciones mixtas',
  general: 'población adulta general',
};

function capacidadesDe(fichas: readonly FichaPKB[]): CapacidadId[] {
  return [...new Set(fichas.map((f) => f.capacidad))].sort();
}

interface Emision {
  regla: string;
  categoria: CategoriaRecomendacion;
  prioridad: PrioridadRecomendacion;
  plantilla: string;
  fundamento: string;
  limitaciones?: string[];
  valoresExtra?: (fichas: readonly FichaPKB[]) => Record<string, string>;
}

function emitir(
  ctx: ContextoPPRE,
  fichas: readonly FichaPKB[],
  emision: Emision
): Recomendacion | null {
  if (fichas.length === 0) return null;

  const capacidades = capacidadesDe(fichas);

  return construirRecomendacion({
    clave: 'global',
    regla: emision.regla,
    categoria: emision.categoria,
    prioridad: emision.prioridad,
    plantilla: emision.plantilla,
    valores: {
      capacidades: enumerar(capacidades),
      ...(emision.valoresExtra?.(fichas) ?? {}),
    },
    fundamento: emision.fundamento,
    capacidades,
    fichas,
    interpretaciones: interpretacionesDe(ctx.informe, capacidades),
    limitaciones: emision.limitaciones,
  });
}

export function reglasDeEvidencia(ctx: ContextoPPRE): Recomendacion[] {
  const salida: (Recomendacion | null)[] = [];

  // PPRE-08 · la base declara respaldo insuficiente
  salida.push(
    emitir(ctx, fichasPorEstado(ctx, ['insuficiente']), {
      regla: 'PPRE-08', categoria: 'evidencia', prioridad: 'media',
      plantilla: 'EVIDENCIA_INSUFICIENTE',
      fundamento: 'La base de conocimiento clasifica estas correspondencias como insuficientes.',
      limitaciones: ['Insuficiente no equivale a refutada: significa que no se verificó respaldo.'],
    })
  );

  // PPRE-09 · la base desaconseja la correspondencia
  salida.push(
    emitir(ctx, fichasPorEstado(ctx, ['no_recomendada']), {
      regla: 'PPRE-09', categoria: 'evidencia', prioridad: 'alta',
      plantilla: 'EVIDENCIA_DESACONSEJADA',
      fundamento: 'La base registra evidencia en contra, o un constructo que no corresponde.',
      valoresExtra: (fichas) => ({
        pruebas: enumerar([...new Set(fichas.map((f) => f.pruebaId))].sort()),
      }),
    })
  );

  // PPRE-10 · nivel de evidencia bajo
  const nivelBajo = ctx.pkb.fichas
    .filter(
      (f) =>
        (f.estado === 'respaldada' || f.estado === 'parcialmente_respaldada') &&
        (f.nivelEvidencia === 'baja' || f.nivelEvidencia === 'muy_baja')
    )
    .sort((a, b) => a.id.localeCompare(b.id));

  salida.push(
    emitir(ctx, nivelBajo, {
      regla: 'PPRE-10', categoria: 'evidencia', prioridad: 'media',
      plantilla: 'NIVEL_BAJO',
      fundamento: 'El nivel lo gradúa la base de conocimiento; este motor lo reproduce.',
    })
  );

  // PPRE-11 · validez de constructo no verificada
  salida.push(
    emitir(ctx, fichasConLimitacion(ctx, 'validez_constructo_no_verificada'), {
      regla: 'PPRE-11', categoria: 'interpretacion', prioridad: 'alta',
      plantilla: 'CONSTRUCTO_NO_VERIFICADO',
      fundamento: 'La base documenta reproducibilidad de la medida, no validez de constructo.',
      limitaciones: ['Reproducible no implica que la medida represente la dimensión atribuida.'],
    })
  );

  // PPRE-12 · alcance restringido
  salida.push(
    emitir(ctx, fichasConLimitacion(ctx, 'alcance_restringido'), {
      regla: 'PPRE-12', categoria: 'interpretacion', prioridad: 'media',
      plantilla: 'ALCANCE_RESTRINGIDO',
      fundamento: 'La correspondencia declara un alcance autorizado más estrecho que la capacidad.',
    })
  );

  // PPRE-13 · poblaciones de estudio restringidas
  salida.push(
    emitir(ctx, fichasConLimitacion(ctx, 'poblacion_restringida'), {
      regla: 'PPRE-13', categoria: 'interpretacion', prioridad: 'alta',
      plantilla: 'POBLACION_RESTRINGIDA',
      fundamento: 'La base prohíbe extrapolar entre poblaciones.',
      valoresExtra: (fichas) => ({
        poblaciones: enumerar(
          [...new Set(fichas.flatMap((f) => f.poblaciones))]
            .sort()
            .map((p) => POBLACION[p] ?? p)
        ),
      }),
    })
  );

  return salida.filter((r): r is Recomendacion => r !== null);
}
