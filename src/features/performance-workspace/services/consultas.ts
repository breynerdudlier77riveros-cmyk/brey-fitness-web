// ── Filtros, búsqueda e historial (Sprint PAS-7.0) ─────────────────────────
// Puras sobre listas ya cargadas. No consultan la base: el repositorio filtra
// lo que puede en SQL y esto refina en memoria lo que no conviene traducir a
// consulta —la búsqueda por tres campos, sobre todo—.
//
// Ninguna de estas funciones interpreta: filtra y ordena.

import { esVisibleEnListado } from '../schemas/estados';
import type {
  Atleta,
  EntradaHistorial,
  Evaluacion,
  FiltrosAtleta,
  FiltrosEvaluacion,
  RegistroWorkspace,
} from '../schemas/tipos';

/** Normaliza para buscar: sin tildes, sin mayúsculas, sin espacios sobrantes. */
export function normalizar(texto: string): string {
  return texto
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .trim();
}

/**
 * Busca en nombre, documento y código interno.
 *
 * Los tres a la vez y no en campos separados: un profesional teclea lo que
 * recuerda, y obligarle a elegir antes en qué campo busca convierte una
 * búsqueda en un formulario.
 */
export function coincideBusqueda(atleta: Atleta, termino: string): boolean {
  const aguja = normalizar(termino);
  if (aguja === '') return true;

  return [atleta.nombre, atleta.documento ?? '', atleta.codigoInterno ?? ''].some((campo) =>
    normalizar(campo).includes(aguja)
  );
}

export function filtrarAtletas(
  atletas: readonly Atleta[],
  filtros: FiltrosAtleta = {}
): Atleta[] {
  return atletas.filter((atleta) => {
    // Un atleta eliminado nunca se lista, ni siquiera pidiendo su estado: el
    // borrado lógico conserva el histórico, no lo devuelve al listado.
    if (!esVisibleEnListado(atleta.estado)) return false;

    if (filtros.estado && atleta.estado !== filtros.estado) return false;
    if (filtros.deporte && atleta.deporte !== filtros.deporte) return false;
    if (filtros.busqueda && !coincideBusqueda(atleta, filtros.busqueda)) return false;

    return true;
  });
}

export function filtrarEvaluaciones(
  evaluaciones: readonly Evaluacion[],
  filtros: FiltrosEvaluacion = {}
): Evaluacion[] {
  return evaluaciones.filter((evaluacion) => {
    if (filtros.atletaId && evaluacion.atletaId !== filtros.atletaId) return false;
    if (filtros.estado && evaluacion.estado !== filtros.estado) return false;
    if (filtros.tipo && evaluacion.tipo !== filtros.tipo) return false;
    if (filtros.desde && evaluacion.fecha < filtros.desde) return false;
    if (filtros.hasta && evaluacion.fecha > filtros.hasta) return false;
    return true;
  });
}

/** Cronológico descendente. A igual fecha, la creada después va primero. */
export function ordenarCronologico(evaluaciones: readonly Evaluacion[]): Evaluacion[] {
  return [...evaluaciones].sort((a, b) => {
    if (a.fecha !== b.fecha) return a.fecha < b.fecha ? 1 : -1;
    if (a.createdAt !== b.createdAt) return a.createdAt < b.createdAt ? 1 : -1;
    return a.id.localeCompare(b.id);
  });
}

/** Deportes presentes, para poblar el filtro sin una consulta aparte. */
export function deportesDisponibles(atletas: readonly Atleta[]): string[] {
  const deportes = atletas
    .filter((a) => esVisibleEnListado(a.estado))
    .map((a) => a.deporte)
    .filter((d): d is string => Boolean(d));

  return [...new Set(deportes)].sort();
}

export interface RecuentoEvaluacion {
  evaluacionId: string;
  pruebas: number;
  capacidades: number;
}

/**
 * Construye el historial con los recuentos YA resueltos.
 *
 * `capacidades` procede del informe derivado, no de recorrer registros: el
 * Workspace no vuelve a recorrer nada (criterio de rendimiento del sprint).
 */
export function construirHistorial(
  evaluaciones: readonly Evaluacion[],
  recuentos: readonly RecuentoEvaluacion[],
  versionPAS: string
): EntradaHistorial[] {
  const porId = new Map(recuentos.map((r) => [r.evaluacionId, r]));

  return ordenarCronologico(evaluaciones).map((evaluacion) => ({
    evaluacionId: evaluacion.id,
    fecha: evaluacion.fecha,
    tipo: evaluacion.tipo,
    estado: evaluacion.estado,
    pruebas: porId.get(evaluacion.id)?.pruebas ?? 0,
    capacidades: porId.get(evaluacion.id)?.capacidades ?? 0,
    versionPAS,
  }));
}

/** Registros vigentes de una evaluación. Los anulados siguen existiendo. */
export function registrosVigentes(
  registros: readonly RegistroWorkspace[]
): RegistroWorkspace[] {
  return registros.filter((r) => r.estado === 'vigente');
}
