// ── Constructores para las pruebas del PIE (Sprint PAS-4.0) ────────────────
// Los perfiles se construyen con el PAE REAL, no a mano: si el contrato entre
// ambos motores se rompiera, estas pruebas lo detectarían. Un perfil fabricado
// a mano probaría el PIE contra una idea del PAE, no contra el PAE.

import { analizarRendimiento } from '../../index';
import type { CapacidadId, CatalogoPruebas, EvaluacionPAS, PerformanceAnalysis } from '../../index';
import type { ConocimientoPKB, FichaPKB, LimitacionPKB, NivelEvidencia, Poblacion } from '../index';

export const HOY = '2026-08-02';
export const ATLETA = 'atleta-1';

export function ficha(over: Partial<FichaPKB> & { id: string; capacidad: CapacidadId }): FichaPKB {
  return {
    pruebaId: 'P-01',
    estado: 'parcialmente_respaldada',
    nivelEvidencia: 'moderada' as NivelEvidencia,
    poblaciones: ['general'] as Poblacion[],
    alcanceAutorizado: 'la magnitud registrada por la prueba',
    limitaciones: [] as LimitacionPKB[],
    referencias: ['ref_1'],
    sensibilidadDocumentada: true,
    vigenciaDocumentada: true,
    pesoDocumentado: true,
    ...over,
  };
}

export function pkb(fichas: FichaPKB[], version = 'pkb-test'): ConocimientoPKB {
  return { version, fichas };
}

export function prueba(over: Partial<CatalogoPruebas['pruebas'][number]> & { id: string }) {
  return {
    familia: 'F-A' as const,
    naturaleza: 'continuo' as const,
    vigenciaDias: 180,
    condicionesRequeridas: [],
    exigePrecondiciones: false,
    requierePatron: false,
    repetible: true,
    contribuciones: [],
    ...over,
  };
}

export function registro(over: { id: string; pruebaId: string } & Record<string, unknown>) {
  return {
    fecha: HOY,
    valor: { tipo: 'continuo' as const, valor: 100, unidad: 'kg' },
    estado: 'vigente' as const,
    condiciones: {},
    precondicionesCumplidas: null,
    patron: null,
    observaciones: null,
    metadatos: {},
    ...over,
  } as EvaluacionPAS['registros'][number];
}

export function evaluacion(over: Partial<EvaluacionPAS> & { id: string }): EvaluacionPAS {
  return {
    atletaId: ATLETA,
    fecha: HOY,
    tipo: 'T-01',
    registros: [],
    observaciones: null,
    metadatos: {},
    ...over,
  };
}

/** Perfil vacío: ninguna evaluación, catálogo sin pruebas. */
export function analisisVacio(): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: ATLETA,
    evaluaciones: [],
    catalogo: { version: 'cat-test', pruebas: [] },
    hoyISO: HOY,
  });
}

/** Perfil con UNA capacidad caracterizada, mediante el PAE real. */
export function analisisConCapacidad(
  capacidad: CapacidadId = 'A-01',
  overRegistro: Record<string, unknown> = {}
): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: ATLETA,
    evaluaciones: [
      evaluacion({
        id: 'ev1',
        registros: [registro({ id: 'r1', pruebaId: 'P-01', ...overRegistro })],
      }),
    ],
    catalogo: {
      version: 'cat-test',
      pruebas: [
        prueba({
          id: 'P-01',
          contribuciones: [{ capacidad, peso: 1, referencia: 'ref_1' }],
        }),
      ],
    },
    hoyISO: HOY,
  });
}

/** Perfil con cobertura declarada e incompleta: falta una prueba exigida. */
export function analisisParcial(capacidad: CapacidadId = 'A-01'): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: ATLETA,
    evaluaciones: [
      evaluacion({ id: 'ev1', registros: [registro({ id: 'r1', pruebaId: 'P-01' })] }),
    ],
    catalogo: {
      version: 'cat-test',
      cobertura: [{ capacidad, pruebasRequeridas: ['P-01', 'P-02'] }],
      pruebas: [
        prueba({ id: 'P-01', contribuciones: [{ capacidad, peso: 1, referencia: 'ref_1' }] }),
      ],
    },
    hoyISO: HOY,
  });
}

/** Perfil con dos registros incompatibles del mismo día. */
export function analisisEnConflicto(capacidad: CapacidadId = 'A-01'): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: ATLETA,
    evaluaciones: [
      evaluacion({
        id: 'ev1',
        registros: [
          registro({ id: 'r1', pruebaId: 'P-01' }),
          registro({
            id: 'r2',
            pruebaId: 'P-01',
            valor: { tipo: 'continuo', valor: 250, unidad: 'kg' },
          }),
        ],
      }),
    ],
    catalogo: {
      version: 'cat-test',
      pruebas: [
        prueba({ id: 'P-01', contribuciones: [{ capacidad, peso: 1, referencia: 'ref_1' }] }),
      ],
    },
    hoyISO: HOY,
  });
}

/** Perfil cuyo único registro caducó. */
export function analisisDesactualizado(capacidad: CapacidadId = 'A-01'): PerformanceAnalysis {
  return analizarRendimiento({
    atletaId: ATLETA,
    evaluaciones: [
      evaluacion({
        id: 'ev1',
        fecha: '2026-01-01',
        registros: [registro({ id: 'r1', pruebaId: 'P-01', fecha: '2026-01-01' })],
      }),
    ],
    catalogo: {
      version: 'cat-test',
      pruebas: [
        prueba({
          id: 'P-01',
          vigenciaDias: 30,
          contribuciones: [{ capacidad, peso: 1, referencia: 'ref_1' }],
        }),
      ],
    },
    hoyISO: HOY,
  });
}
