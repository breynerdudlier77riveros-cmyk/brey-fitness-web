// ── Mapeo fila ↔ entidad (Sprint PAS-7.0) ──────────────────────────────────
// Traduce entre el esquema de Postgres y las entidades del Workspace.
// Separado del repositorio para poder probarlo sin base de datos: es donde se
// cuelan los errores silenciosos de un CRUD.
//
// PostgREST devuelve `numeric` como CADENA. Convertirlo aquí, en un único
// sitio, evita el fallo clásico de comparar un string con un número y que la
// aplicación no se entere.

import type {
  Atleta,
  EnlacePublico,
  EstadoAtleta,
  EstadoEvaluacion,
  Evaluacion,
  RegistroWorkspace,
} from '../schemas/tipos';
import type { TipoEvaluacion, ValorRegistro } from '@/lib/pas';

type Fila = Record<string, unknown>;

const texto = (valor: unknown): string => (typeof valor === 'string' ? valor : '');
const textoONulo = (valor: unknown): string | null =>
  typeof valor === 'string' && valor !== '' ? valor : null;

/** `numeric` de Postgres llega como cadena. */
function numero(valor: unknown): number {
  if (typeof valor === 'number') return valor;
  if (typeof valor === 'string') return Number(valor);
  return NaN;
}

export function mapAtleta(fila: Fila): Atleta {
  return {
    id: texto(fila.id),
    profesionalId: texto(fila.profesional_id),
    nombre: texto(fila.nombre),
    documento: textoONulo(fila.documento),
    codigoInterno: textoONulo(fila.codigo_interno),
    deporte: textoONulo(fila.deporte),
    fechaNacimiento: textoONulo(fila.fecha_nacimiento),
    notas: textoONulo(fila.notas),
    estado: texto(fila.estado) as EstadoAtleta,
    createdAt: texto(fila.created_at),
    updatedAt: texto(fila.updated_at),
  };
}

export function mapEvaluacion(fila: Fila): Evaluacion {
  return {
    id: texto(fila.id),
    atletaId: texto(fila.atleta_id),
    tipo: texto(fila.tipo) as TipoEvaluacion,
    fecha: texto(fila.fecha),
    estado: texto(fila.estado) as EstadoEvaluacion,
    observaciones: textoONulo(fila.observaciones),
    createdAt: texto(fila.created_at),
    updatedAt: texto(fila.updated_at),
  };
}

/** Reconstruye la unión discriminada del valor desde sus cuatro columnas. */
export function mapValor(fila: Fila): ValorRegistro {
  switch (texto(fila.valor_tipo)) {
    case 'ordinal':
      return { tipo: 'ordinal', valor: numero(fila.valor_num), escala: numero(fila.escala) };
    case 'binario':
      return { tipo: 'binario', valor: fila.valor_bool === true };
    case 'categorico':
      return { tipo: 'categorico', valor: texto(fila.valor_texto) };
    default:
      return { tipo: 'continuo', valor: numero(fila.valor_num), unidad: texto(fila.unidad) };
  }
}

export function mapRegistro(fila: Fila): RegistroWorkspace {
  return {
    id: texto(fila.id),
    evaluacionId: texto(fila.evaluacion_id),
    pruebaId: texto(fila.prueba_id),
    fecha: texto(fila.fecha),
    valor: mapValor(fila),
    estado: texto(fila.estado) === 'anulada' ? 'anulada' : 'vigente',
    condiciones: (fila.condiciones as Record<string, string>) ?? {},
    precondicionesCumplidas:
      typeof fila.precondiciones_cumplidas === 'boolean' ? fila.precondiciones_cumplidas : null,
    patron: textoONulo(fila.patron),
    observaciones: textoONulo(fila.observaciones),
    createdAt: texto(fila.created_at),
  };
}

export function mapEnlace(fila: Fila): EnlacePublico {
  return {
    id: texto(fila.id),
    evaluacionId: texto(fila.evaluacion_id),
    token: texto(fila.token),
    activo: fila.activo === true,
    createdAt: texto(fila.created_at),
    revocadoAt: textoONulo(fila.revocado_at),
  };
}

/** Descompone el valor en las cuatro columnas que exige el CHECK de la tabla. */
export function columnasDeValor(valor: ValorRegistro): Fila {
  const base = { valor_num: null, valor_texto: null, valor_bool: null, unidad: null, escala: null };

  switch (valor.tipo) {
    case 'continuo':
      return { ...base, valor_tipo: 'continuo', valor_num: valor.valor, unidad: valor.unidad };
    case 'ordinal':
      return { ...base, valor_tipo: 'ordinal', valor_num: valor.valor, escala: valor.escala };
    case 'binario':
      return { ...base, valor_tipo: 'binario', valor_bool: valor.valor };
    case 'categorico':
      return { ...base, valor_tipo: 'categorico', valor_texto: valor.valor };
  }
}
