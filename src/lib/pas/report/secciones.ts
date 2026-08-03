// ── Orden y etiquetas de las secciones (Sprint PAS-5.0) ────────────────────
// El orden es fijo y está aquí, no repartido por los componentes: un informe
// clínico cuyo orden dependa del árbol de JSX es un informe cuyo orden nadie
// puede verificar.

import type { NivelMostrado, SeccionId } from './tipos';

export interface DefinicionSeccion {
  id: SeccionId;
  titulo: string;
  /** Numeración visible. `null` en portada y pie, que no se numeran. */
  numero: number | null;
}

export const SECCIONES: readonly DefinicionSeccion[] = [
  { id: 'portada', titulo: 'Portada', numero: null },
  { id: 'resumen', titulo: 'Resumen ejecutivo', numero: 1 },
  { id: 'perfil', titulo: 'Perfil funcional', numero: 2 },
  { id: 'dominios', titulo: 'Dominios', numero: 3 },
  { id: 'interpretaciones', titulo: 'Interpretaciones profesionales', numero: 4 },
  { id: 'cobertura', titulo: 'Cobertura', numero: 5 },
  { id: 'evidencia', titulo: 'Nivel de evidencia', numero: 6 },
  { id: 'metodologia', titulo: 'Metodología', numero: 7 },
  { id: 'limitaciones', titulo: 'Limitaciones', numero: 8 },
  { id: 'apendice', titulo: 'Apéndice', numero: 9 },
  { id: 'pie', titulo: 'Pie', numero: null },
];

export const ORDEN_SECCIONES: readonly SeccionId[] = SECCIONES.map((s) => s.id);

export function seccion(id: SeccionId): DefinicionSeccion {
  const encontrada = SECCIONES.find((s) => s.id === id);
  if (!encontrada) throw new Error(`PRS: sección desconocida: ${id}`);
  return encontrada;
}

/** Título con su número, tal como se muestra: «2 · Perfil funcional». */
export function tituloSeccion(id: SeccionId): string {
  const definicion = seccion(id);
  return definicion.numero === null
    ? definicion.titulo
    : `${definicion.numero} · ${definicion.titulo}`;
}

/** Etiquetas de nivel de evidencia. Las cuatro que el encargo enumera. */
export const ETIQUETA_NIVEL: Readonly<Record<NivelMostrado, string>> = {
  alta: 'Alto',
  moderada: 'Moderado',
  baja: 'Bajo',
  muy_baja: 'Muy bajo',
  insuficiente: 'Insuficiente',
  no_documentado: 'No documentado',
};

/** Orden de presentación: de mayor respaldo a menor. */
export const ORDEN_NIVELES: readonly NivelMostrado[] = [
  'alta', 'moderada', 'baja', 'muy_baja', 'insuficiente', 'no_documentado',
];

export const ETIQUETA_ESTADO: Readonly<Record<string, string>> = {
  evaluada: 'Caracterizada',
  parcialmente_evaluada: 'Parcialmente caracterizada',
  desactualizada: 'Registros no vigentes',
  en_conflicto: 'Datos no conciliables',
  desconocida: 'Desconocida',
};
