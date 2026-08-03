// ── Constructores para las pruebas del PPRE (Sprint PAS-6.0) ───────────────
// La cadena PAE → PIE se ejecuta de verdad. Fabricar los DTO a mano probaría
// el motor contra una idea de sus entradas, no contra sus entradas.

import { analizarRendimiento } from '../../index';
import { PKB_V1, interpretarRendimiento } from '../../interpretation';
import type { CapacidadId, PerformanceAnalysis } from '../../index';
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

function evaluacion(registros: ReturnType<typeof registro>[], fecha = HOY) {
  return {
    id: 'ev1',
    atletaId: ATLETA,
    fecha,
    tipo: 'T-01' as const,
    observaciones: null,
    metadatos: {},
    registros,
  };
}

function catalogo(capacidad: CapacidadId, vigenciaDias: number | null = 180) {
  return {
    version: 'cat-1',
    pruebas: [
      {
        id: 'P-01',
        familia: 'F-A' as const,
        naturaleza: 'continuo' as const,
        vigenciaDias,
        condicionesRequeridas: [],
        exigePrecondiciones: false,
        requierePatron: false,
        repetible: true,
        contribuciones: [{ capacidad, peso: 1, referencia: 'grgic_1rm_2020' }],
      },
    ],
  };
}

export function analisisVacio(): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: ATLETA,
    evaluaciones: [],
    catalogo: { version: 'cat-1', pruebas: [] },
    hoyISO: HOY,
  });
}

export function analisisConDatos(capacidad: CapacidadId = 'A-01'): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: ATLETA,
    evaluaciones: [evaluacion([registro('r1')])],
    catalogo: catalogo(capacidad),
    hoyISO: HOY,
  });
}

export function analisisEnConflicto(): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: ATLETA,
    evaluaciones: [
      evaluacion([
        registro('r1'),
        registro('r2', { valor: { tipo: 'continuo', valor: 250, unidad: 'kg' } }),
      ]),
    ],
    catalogo: catalogo('A-01'),
    hoyISO: HOY,
  });
}

export function analisisDesactualizado(): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: ATLETA,
    evaluaciones: [evaluacion([registro('r1', { fecha: '2026-01-01' })], '2026-01-01')],
    catalogo: catalogo('A-01', 30),
    hoyISO: HOY,
  });
}

export function analisisConAnulados(): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: ATLETA,
    evaluaciones: [evaluacion([registro('r1', { estado: 'anulada' })])],
    catalogo: catalogo('A-01'),
    hoyISO: HOY,
  });
}

export function informeDe(
  analisis: PerformanceAnalysis,
  pkb: ConocimientoPKB = PKB_V1
): PerformanceInterpretationReport {
  return interpretarRendimiento(analisis, pkb);
}

/** Terna completa, tal como llega al PPRE. */
export function terna(
  analisis: PerformanceAnalysis = analisisConDatos(),
  pkb: ConocimientoPKB = PKB_V1
) {
  return { analisis, informe: informeDe(analisis, pkb), pkb };
}
