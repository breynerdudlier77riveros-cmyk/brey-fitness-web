// ── Constructores para las pruebas del PRS (Sprint PAS-5.0) ────────────────
// Los DTO se obtienen del PAE y del PIE REALES, encadenados como en
// producción. Fabricarlos a mano probaría el PRS contra una idea de sus
// entradas, no contra sus entradas.

import { analizarRendimiento } from '../../index';
import { PKB_V1, interpretarRendimiento } from '../../interpretation';
import type { PerformanceAnalysis } from '../../index';
import type { ConocimientoPKB, PerformanceInterpretationReport } from '../../interpretation';

export const HOY = '2026-08-02';
export const ATLETA = 'atleta-1';

function registro(id: string, over: Record<string, unknown> = {}) {
  return {
    id,
    pruebaId: 'P-01',
    fecha: HOY,
    valor: { tipo: 'continuo' as const, valor: 100, unidad: 'kg' },
    estado: 'vigente' as const,
    condiciones: {},
    precondicionesCumplidas: null,
    patron: null,
    observaciones: null,
    metadatos: {},
    ...over,
  };
}

/** Perfil sin ninguna evaluación: el estado inicial de todo atleta. */
export function analisisVacio(): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: ATLETA,
    evaluaciones: [],
    catalogo: { version: 'cat-1', pruebas: [] },
    hoyISO: HOY,
  });
}

/** Perfil con A-01 caracterizada por la prueba P-01. */
export function analisisConDatos(): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: ATLETA,
    evaluaciones: [
      {
        id: 'ev1',
        atletaId: ATLETA,
        fecha: HOY,
        tipo: 'T-01',
        observaciones: null,
        metadatos: {},
        registros: [registro('r1')],
      },
    ],
    catalogo: {
      version: 'cat-1',
      pruebas: [
        {
          id: 'P-01',
          familia: 'F-A',
          naturaleza: 'continuo',
          vigenciaDias: 180,
          condicionesRequeridas: [],
          exigePrecondiciones: false,
          requierePatron: false,
          repetible: true,
          contribuciones: [{ capacidad: 'A-01', peso: 1, referencia: 'grgic_1rm_2020' }],
        },
      ],
    },
    hoyISO: HOY,
  });
}

export function informeDe(
  analisis: PerformanceAnalysis,
  pkb: ConocimientoPKB = PKB_V1
): PerformanceInterpretationReport {
  return interpretarRendimiento(analisis, pkb);
}

/** El par completo, tal como llegará al componente. */
export function parCompleto() {
  const analisis = analisisConDatos();
  return { analisis, interpretacion: informeDe(analisis) };
}

export function parVacio() {
  const analisis = analisisVacio();
  return { analisis, interpretacion: informeDe(analisis) };
}
