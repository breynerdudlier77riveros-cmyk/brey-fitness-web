// ── Constructores para las pruebas del Workspace (Sprint PAS-7.0) ──────────
// Entidades del Workspace tal como salen del repositorio. Los DTO de los
// motores NO se fabrican: se obtienen ejecutando los motores reales.

import type {
  Atleta,
  Evaluacion,
  RegistroWorkspace,
} from '../schemas/tipos';

export const HOY = '2026-08-02';
export const PROFESIONAL = 'prof-1';

export function atleta(over: Partial<Atleta> & { id: string }): Atleta {
  return {
    profesionalId: PROFESIONAL,
    nombre: 'Atleta de prueba',
    documento: null,
    codigoInterno: null,
    deporte: null,
    fechaNacimiento: null,
    sexo: null,
    pais: null,
    estaturaCm: null,
    notas: null,
    estado: 'activo',
    createdAt: '2026-01-01T10:00:00Z',
    updatedAt: '2026-01-01T10:00:00Z',
    ...over,
  };
}

export function evaluacion(over: Partial<Evaluacion> & { id: string }): Evaluacion {
  return {
    atletaId: 'a1',
    tipo: 'T-01',
    fecha: HOY,
    estado: 'borrador',
    observaciones: null,
    createdAt: '2026-08-02T10:00:00Z',
    updatedAt: '2026-08-02T10:00:00Z',
    ...over,
  };
}

export function registro(
  over: Partial<RegistroWorkspace> & { id: string }
): RegistroWorkspace {
  return {
    evaluacionId: 'ev1',
    pruebaId: 'P-01',
    fecha: HOY,
    valor: { tipo: 'continuo', valor: 100, unidad: 'kg' },
    estado: 'vigente',
    condiciones: {},
    precondicionesCumplidas: null,
    patron: 'sentadilla',
    observaciones: null,
    createdAt: '2026-08-02T10:00:00Z',
    ...over,
  };
}

/** Fila cruda de Postgres, con `numeric` como cadena, que es como llega. */
export function filaRegistro(over: Record<string, unknown> = {}) {
  return {
    id: 'r1',
    evaluacion_id: 'ev1',
    prueba_id: 'P-01',
    fecha: HOY,
    valor_tipo: 'continuo',
    valor_num: '100.5',
    valor_texto: null,
    valor_bool: null,
    unidad: 'kg',
    escala: null,
    estado: 'vigente',
    condiciones: {},
    precondiciones_cumplidas: null,
    patron: null,
    observaciones: null,
    created_at: '2026-08-02T10:00:00Z',
    ...over,
  };
}

export function filaAtleta(over: Record<string, unknown> = {}) {
  return {
    id: 'a1',
    profesional_id: PROFESIONAL,
    nombre: 'Atleta',
    documento: null,
    codigo_interno: null,
    deporte: null,
    fecha_nacimiento: null,
    notas: null,
    estado: 'activo',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-01-01T10:00:00Z',
    ...over,
  };
}
