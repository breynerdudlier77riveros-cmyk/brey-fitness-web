// ── Tipos del Performance Workspace (Sprint PAS-7.0) ───────────────────────
// Entidades de PERSISTENCIA del espacio de trabajo. No son los DTO de los
// motores: el Workspace guarda lo que el profesional registra y se lo entrega
// al PAE, que devuelve los suyos.
//
// El Workspace nunca interpreta, nunca calcula y nunca genera conocimiento.

import type { TipoEvaluacion, ValorRegistro } from '@/lib/pas';

export type EstadoAtleta = 'activo' | 'archivado' | 'eliminado';

export type EstadoEvaluacion =
  | 'borrador'
  | 'completada'
  | 'anulada'
  | 'compartida'
  | 'archivada';

export type EstadoRegistro = 'vigente' | 'anulada';

export interface Atleta {
  id: string;
  profesionalId: string;
  nombre: string;
  documento: string | null;
  codigoInterno: string | null;
  deporte: string | null;
  fechaNacimiento: string | null;
  notas: string | null;
  estado: EstadoAtleta;
  createdAt: string;
  updatedAt: string;
}

export interface Evaluacion {
  id: string;
  atletaId: string;
  tipo: TipoEvaluacion;
  fecha: string;
  estado: EstadoEvaluacion;
  observaciones: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface RegistroWorkspace {
  id: string;
  evaluacionId: string;
  pruebaId: string;
  fecha: string;
  valor: ValorRegistro;
  estado: EstadoRegistro;
  condiciones: Record<string, string>;
  precondicionesCumplidas: boolean | null;
  patron: string | null;
  observaciones: string | null;
  createdAt: string;
}

export interface EnlacePublico {
  id: string;
  evaluacionId: string;
  token: string;
  activo: boolean;
  createdAt: string;
  revocadoAt: string | null;
}

/** Fila del historial. Recuentos ya resueltos, sin recorrer registros. */
export interface EntradaHistorial {
  evaluacionId: string;
  fecha: string;
  tipo: TipoEvaluacion;
  estado: EstadoEvaluacion;
  pruebas: number;
  capacidades: number;
  versionPAS: string;
}

export interface FiltrosEvaluacion {
  atletaId?: string;
  desde?: string;
  hasta?: string;
  estado?: EstadoEvaluacion;
  tipo?: TipoEvaluacion;
}

export interface FiltrosAtleta {
  estado?: EstadoAtleta;
  deporte?: string;
  /** Nombre, documento o código interno. */
  busqueda?: string;
}

/** Datos de alta y edición. El id y las marcas de tiempo los pone la base. */
export type EntradaAtleta = Pick<Atleta, 'nombre'> &
  Partial<Pick<Atleta, 'documento' | 'codigoInterno' | 'deporte' | 'fechaNacimiento' | 'notas'>>;

export type EntradaEvaluacion = Pick<Evaluacion, 'atletaId' | 'tipo' | 'fecha'> &
  Partial<Pick<Evaluacion, 'observaciones'>>;

export type EntradaRegistro = Pick<RegistroWorkspace, 'evaluacionId' | 'pruebaId' | 'fecha' | 'valor'> &
  Partial<Pick<RegistroWorkspace, 'condiciones' | 'precondicionesCumplidas' | 'patron' | 'observaciones'>>;
