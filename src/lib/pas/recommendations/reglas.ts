// ── Catálogo de reglas del PPRE (Sprint PAS-6.0) ───────────────────────────
// Registro único de las 20 reglas. Existe para que el motor declare cuáles
// ejecutó y cuáles descartó, y para que una regla emitida sin estar catalogada
// sea detectable por una prueba en vez de por casualidad.
//
// La prioridad la fija la regla, no un cálculo. «Crítica» significa que impide
// leer el perfil, no gravedad clínica.

import type { CategoriaRecomendacion, PrioridadRecomendacion } from './tipos';

export interface DefinicionRegla {
  id: string;
  categoria: CategoriaRecomendacion;
  prioridad: PrioridadRecomendacion;
  /** Situación que la activa. Descriptiva, nunca prescriptiva. */
  disparador: string;
  plantilla: string;
}

export const REGLAS: readonly DefinicionRegla[] = [
  { id: 'PPRE-01', categoria: 'cobertura', prioridad: 'media', disparador: 'capacidades activas sin registros elegibles', plantilla: 'SIN_EVIDENCIA' },
  { id: 'PPRE-02', categoria: 'metodologia', prioridad: 'informativa', disparador: 'capacidades reservadas en el catálogo', plantilla: 'RESERVADA' },
  { id: 'PPRE-03', categoria: 'cobertura', prioridad: 'alta', disparador: 'capacidades con cobertura declarada incompleta', plantilla: 'COBERTURA_PARCIAL' },
  { id: 'PPRE-04', categoria: 'cobertura', prioridad: 'critica', disparador: 'ninguna capacidad activa caracterizada', plantilla: 'PERFIL_SIN_COBERTURA' },
  { id: 'PPRE-05', categoria: 'consistencia', prioridad: 'critica', disparador: 'capacidades con registros no conciliables', plantilla: 'CONFLICTO' },
  { id: 'PPRE-06', categoria: 'consistencia', prioridad: 'critica', disparador: 'la derivación registra contradicciones', plantilla: 'PERFIL_INCONSISTENTE' },
  { id: 'PPRE-07', categoria: 'reevaluacion', prioridad: 'alta', disparador: 'capacidades cuyos registros dejaron de ser elegibles', plantilla: 'REGISTROS_NO_VIGENTES' },
  { id: 'PPRE-08', categoria: 'evidencia', prioridad: 'media', disparador: 'la base declara respaldo insuficiente', plantilla: 'EVIDENCIA_INSUFICIENTE' },
  { id: 'PPRE-09', categoria: 'evidencia', prioridad: 'alta', disparador: 'la base desaconseja la correspondencia', plantilla: 'EVIDENCIA_DESACONSEJADA' },
  { id: 'PPRE-10', categoria: 'evidencia', prioridad: 'media', disparador: 'nivel de evidencia bajo o muy bajo', plantilla: 'NIVEL_BAJO' },
  { id: 'PPRE-11', categoria: 'interpretacion', prioridad: 'alta', disparador: 'validez de constructo no verificada', plantilla: 'CONSTRUCTO_NO_VERIFICADO' },
  { id: 'PPRE-12', categoria: 'interpretacion', prioridad: 'media', disparador: 'la correspondencia declara alcance restringido', plantilla: 'ALCANCE_RESTRINGIDO' },
  { id: 'PPRE-13', categoria: 'interpretacion', prioridad: 'alta', disparador: 'poblaciones de estudio restringidas', plantilla: 'POBLACION_RESTRINGIDA' },
  { id: 'PPRE-14', categoria: 'metodologia', prioridad: 'critica', disparador: 'sensibilidad al cambio no documentada', plantilla: 'SIN_SENSIBILIDAD' },
  { id: 'PPRE-15', categoria: 'metodologia', prioridad: 'alta', disparador: 'vigencia no documentada', plantilla: 'SIN_VIGENCIA' },
  { id: 'PPRE-16', categoria: 'metodologia', prioridad: 'informativa', disparador: 'ninguna correspondencia declara peso relativo', plantilla: 'SIN_PESOS' },
  { id: 'PPRE-17', categoria: 'calidad_perfil', prioridad: 'alta', disparador: 'capacidades con registros excluidos de la derivación', plantilla: 'REGISTROS_EXCLUIDOS' },
  { id: 'PPRE-18', categoria: 'seguimiento_documental', prioridad: 'informativa', disparador: 'el histórico contiene registros anulados', plantilla: 'ANULADOS' },
  { id: 'PPRE-19', categoria: 'evidencia', prioridad: 'critica', disparador: 'el catálogo no declara correspondencias respaldadas', plantilla: 'CATALOGO_SIN_CORRESPONDENCIAS' },
  { id: 'PPRE-20', categoria: 'seguimiento_documental', prioridad: 'informativa', disparador: 'existen interpretaciones con trazabilidad completa', plantilla: 'TRAZABILIDAD_DISPONIBLE' },
] as const;

const INDICE = new Map(REGLAS.map((r) => [r.id, r]));

export function esRegla(id: string): boolean {
  return INDICE.has(id);
}

export function definicionRegla(id: string): DefinicionRegla | undefined {
  return INDICE.get(id);
}

export const TOTAL_REGLAS = REGLAS.length;
