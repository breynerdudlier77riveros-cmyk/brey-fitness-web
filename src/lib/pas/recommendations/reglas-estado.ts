// ── Reglas derivadas del estado del perfil, PPRE-01…07 y 17 (PAS-6.0) ──────
// Parten del Estado de Capacidad ya derivado por el PAE. Ninguna recalcula
// nada ni mira un registro.

import { construirRecomendacion } from './constructor';
import { codigos, enEstado, reservadas } from './contexto';
import type { ContextoPPRE } from './contexto';
import { fichasDe, interpretacionesDe } from './evidencia';
import { enumerar } from './render';
import type { Recomendacion } from './tipos';

const MOTIVO: Readonly<Record<string, string>> = {
  'EL-01_anulado': 'registros anulados',
  'EL-02_fuera_de_vigencia': 'registros fuera de vigencia',
  'EL-03_integridad': 'registros incompletos',
  'EL-05_condiciones_ausentes': 'registros sin sus condiciones de toma',
  'EL-06_precondiciones_no_constan': 'registros sin constancia de precondiciones',
  prueba_no_catalogada: 'registros de pruebas no catalogadas',
  contribucion_sin_referencia: 'correspondencias sin referencia',
  capacidad_reservada: 'capacidad fuera de alcance',
};

export function reglasDeEstado(ctx: ContextoPPRE): Recomendacion[] {
  const salida: Recomendacion[] = [];

  const comun = (estados: ReturnType<typeof enEstado>) => ({
    capacidades: codigos(estados),
    fichas: fichasDe(ctx.pkb, codigos(estados)),
    interpretaciones: interpretacionesDe(ctx.informe, codigos(estados)),
  });

  // PPRE-01 · capacidades sin registros elegibles
  const desconocidas = enEstado(ctx, 'desconocida').filter(
    (c) => c.traza.excluidos.length === 0
  );
  if (desconocidas.length > 0) {
    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-01', categoria: 'cobertura', prioridad: 'media',
        plantilla: 'SIN_EVIDENCIA',
        valores: { capacidades: enumerar(codigos(desconocidas)) },
        fundamento: `El motor de evaluación deriva ${desconocidas.length} capacidades activas sin ningún registro elegible.`,
        ...comun(desconocidas),
        limitaciones: ['No indica qué valorar: el alcance de la sesión lo fija el profesional.'],
      })
    );
  }

  // PPRE-02 · capacidades reservadas
  const fueraDeAlcance = reservadas(ctx);
  if (fueraDeAlcance.length > 0) {
    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-02', categoria: 'metodologia', prioridad: 'informativa',
        plantilla: 'RESERVADA',
        valores: { capacidades: enumerar(codigos(fueraDeAlcance)) },
        fundamento: 'El catálogo declara estas capacidades fuera del alcance de la versión vigente.',
        capacidades: codigos(fueraDeAlcance),
        limitaciones: ['Su activación depende de la base de conocimiento, no del perfil.'],
      })
    );
  }

  // PPRE-03 · cobertura declarada incompleta
  const parciales = enEstado(ctx, 'parcialmente_evaluada');
  if (parciales.length > 0) {
    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-03', categoria: 'cobertura', prioridad: 'alta',
        plantilla: 'COBERTURA_PARCIAL',
        valores: { capacidades: enumerar(codigos(parciales)) },
        fundamento: 'Existen registros elegibles que no completan la cobertura declarada en el catálogo.',
        ...comun(parciales),
      })
    );
  }

  // PPRE-05 · registros no conciliables
  const enConflicto = enEstado(ctx, 'en_conflicto');
  if (enConflicto.length > 0) {
    const registros = [...new Set(enConflicto.flatMap((c) => c.traza.incluidos))].sort();
    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-05', categoria: 'consistencia', prioridad: 'critica',
        plantilla: 'CONFLICTO',
        valores: { capacidades: enumerar(codigos(enConflicto)), registros: enumerar(registros) },
        fundamento: 'El motor de evaluación conserva ambos registros y no elige entre ellos.',
        ...comun(enConflicto),
        limitaciones: ['El motor no resuelve la divergencia: solo la declara.'],
      })
    );
  }

  // PPRE-07 · registros fuera de vigencia
  const desactualizadas = enEstado(ctx, 'desactualizada');
  if (desactualizadas.length > 0) {
    const fechas = desactualizadas
      .flatMap((c) => c.traza.excluidos.map((e) => e.detalle.fecha))
      .filter((f): f is string => Boolean(f))
      .sort();

    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-07', categoria: 'reevaluacion', prioridad: 'alta',
        plantilla: 'REGISTROS_NO_VIGENTES',
        valores: {
          capacidades: enumerar(codigos(desactualizadas)),
          fecha: fechas[fechas.length - 1] ?? 'fecha no registrada',
        },
        fundamento: 'La vigencia declarada en el catálogo excluye estos registros del estado actual.',
        ...comun(desactualizadas),
        limitaciones: ['No fija cada cuánto repetir una toma: ninguna fuente lo documenta.'],
      })
    );
  }

  // PPRE-17 · registros excluidos de la derivación
  const conExcluidos = ctx.analisis.capacidades.filter((c) => c.traza.excluidos.length > 0);
  if (conExcluidos.length > 0) {
    const motivos = [
      ...new Set(
        conExcluidos.flatMap((c) =>
          c.traza.excluidos.map((e) => MOTIVO[e.motivo] ?? 'registros excluidos')
        )
      ),
    ].sort();

    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-17', categoria: 'calidad_perfil', prioridad: 'alta',
        plantilla: 'REGISTROS_EXCLUIDOS',
        valores: {
          capacidades: enumerar(codigos(conExcluidos)),
          motivos: enumerar(motivos),
        },
        fundamento: 'La traza del motor de evaluación declara el motivo de cada exclusión.',
        capacidades: codigos(conExcluidos),
        interpretaciones: interpretacionesDe(ctx.informe, codigos(conExcluidos)),
      })
    );
  }

  return salida;
}
