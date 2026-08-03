// ── Constructores para las pruebas del PAE (Sprint PAS-2.0) ────────────────
// Solo los tests importan de aquí. Cada constructor devuelve un objeto válido
// por defecto y acepta un `over` parcial, para que cada prueba declare
// únicamente lo que le importa y el resto no distraiga.

import type {
  CapacidadId,
  CatalogoPruebas,
  Contribucion,
  DefinicionPrueba,
  EvaluacionPAS,
  RegistroPrueba,
  ValorRegistro,
} from '../index';

/** Fecha de referencia de toda la batería. Nunca se lee el reloj. */
export const HOY = '2026-08-02';

export function contrib(
  capacidad: CapacidadId,
  over: Partial<Contribucion> = {}
): Contribucion {
  return { capacidad, peso: 1, referencia: 'ckb_ref_1', ...over };
}

export function prueba(
  over: Partial<DefinicionPrueba> & { id: string }
): DefinicionPrueba {
  return {
    familia: 'F-A',
    naturaleza: 'continuo',
    vigenciaDias: 180,
    condicionesRequeridas: [],
    exigePrecondiciones: false,
    requierePatron: false,
    repetible: true,
    contribuciones: [],
    ...over,
  };
}

export const VALOR: ValorRegistro = { tipo: 'continuo', valor: 100, unidad: 'kg' };

export function registro(
  over: Partial<RegistroPrueba> & { id: string; pruebaId: string }
): RegistroPrueba {
  return {
    fecha: HOY,
    valor: VALOR,
    estado: 'vigente',
    condiciones: {},
    precondicionesCumplidas: null,
    patron: null,
    observaciones: null,
    metadatos: {},
    ...over,
  };
}

export function evaluacion(
  over: Partial<EvaluacionPAS> & { id: string } = { id: 'ev1' }
): EvaluacionPAS {
  return {
    atletaId: 'atleta-1',
    fecha: HOY,
    tipo: 'T-01',
    registros: [],
    observaciones: null,
    metadatos: {},
    ...over,
  };
}

export function catalogo(
  pruebas: DefinicionPrueba[],
  over: Partial<CatalogoPruebas> = {}
): CatalogoPruebas {
  return { version: 'cat-1', pruebas, ...over };
}

/**
 * Escenario mínimo que SÍ produce una capacidad evaluada: una prueba con
 * correspondencia respaldada y un registro elegible.
 */
export function escenarioEvaluada(capacidad: CapacidadId = 'A-01') {
  const definicion = prueba({ id: 'p1', contribuciones: [contrib(capacidad)] });
  const reg = registro({ id: 'r1', pruebaId: 'p1' });
  return {
    catalogo: catalogo([definicion]),
    evaluaciones: [evaluacion({ id: 'ev1', registros: [reg] })],
    atletaId: 'atleta-1',
    hoyISO: HOY,
  };
}
