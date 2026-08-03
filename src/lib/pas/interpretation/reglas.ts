// ── Catálogo de reglas del PIE (Sprint PAS-4.0) ────────────────────────────
// Registro único de las 28 reglas. Existe para que el motor pueda declarar
// cuántas evaluó y para que una regla emitida sin estar catalogada sea
// detectable por una prueba, no por casualidad.

import type { BloqueInterpretacion, PrioridadInterpretacion } from './tipos';

export interface DefinicionRegla {
  id: string;
  bloque: BloqueInterpretacion;
  prioridad: PrioridadInterpretacion;
  /** Qué situación la activa. Descriptivo, nunca prescriptivo. */
  disparador: string;
  plantilla: string;
}

export const REGLAS: readonly DefinicionRegla[] = [
  // Estado de la capacidad
  { id: 'PIE-01', bloque: 'capacidad', prioridad: 'media', disparador: 'capacidad evaluada con correspondencia aplicable', plantilla: 'CAP_CARACTERIZADA' },
  { id: 'PIE-02', bloque: 'capacidad', prioridad: 'media', disparador: 'la correspondencia declara alcance autorizado', plantilla: 'CAP_ALCANCE' },
  { id: 'PIE-03', bloque: 'capacidad', prioridad: 'informativa', disparador: 'la correspondencia declara poblaciones estudiadas', plantilla: 'EVIDENCIA_POBLACION' },
  { id: 'PIE-04', bloque: 'capacidad', prioridad: 'alta', disparador: 'nivel de evidencia bajo o muy bajo', plantilla: 'EVIDENCIA_NIVEL_BAJO' },
  { id: 'PIE-05', bloque: 'capacidad', prioridad: 'alta', disparador: 'validez de constructo no verificada', plantilla: 'EVIDENCIA_CONSTRUCTO' },
  { id: 'PIE-06', bloque: 'capacidad', prioridad: 'media', disparador: 'capacidad parcialmente evaluada', plantilla: 'CAP_COBERTURA_PARCIAL' },
  { id: 'PIE-07', bloque: 'capacidad', prioridad: 'alta', disparador: 'capacidad desactualizada', plantilla: 'CAP_NO_VIGENTE' },
  { id: 'PIE-08', bloque: 'capacidad', prioridad: 'alta', disparador: 'capacidad en conflicto', plantilla: 'CAP_CONFLICTO' },
  { id: 'PIE-09', bloque: 'capacidad', prioridad: 'media', disparador: 'capacidad desconocida sin registros asociados', plantilla: 'CAP_SIN_EVIDENCIA' },
  { id: 'PIE-10', bloque: 'capacidad', prioridad: 'alta', disparador: 'capacidad desconocida con registros excluidos', plantilla: 'CAP_EVIDENCIA_NO_ELEGIBLE' },
  { id: 'PIE-11', bloque: 'capacidad', prioridad: 'informativa', disparador: 'capacidad reservada', plantilla: 'CAP_RESERVADA' },
  { id: 'PIE-12', bloque: 'capacidad', prioridad: 'alta', disparador: 'capacidad evaluada sin correspondencia en la base', plantilla: 'CAP_SIN_CORRESPONDENCIA' },
  { id: 'PIE-13', bloque: 'capacidad', prioridad: 'media', disparador: 'la base declara evidencia insuficiente', plantilla: 'EVIDENCIA_INSUFICIENTE_PKB' },
  { id: 'PIE-14', bloque: 'capacidad', prioridad: 'alta', disparador: 'la base desaconseja la correspondencia', plantilla: 'EVIDENCIA_NO_RECOMENDADA' },

  // Dominio
  { id: 'PIE-15', bloque: 'dominio', prioridad: 'media', disparador: 'dominio con alguna capacidad caracterizada', plantilla: 'DOMINIO_CARACTERIZADO' },
  { id: 'PIE-16', bloque: 'dominio', prioridad: 'alta', disparador: 'dominio sin ninguna capacidad caracterizada', plantilla: 'DOMINIO_SIN_EVIDENCIA' },

  // Cobertura
  { id: 'PIE-17', bloque: 'cobertura', prioridad: 'alta', disparador: 'siempre', plantilla: 'COBERTURA_PERFIL' },
  { id: 'PIE-18', bloque: 'cobertura', prioridad: 'alta', disparador: 'cobertura menor que el total de capacidades activas', plantilla: 'COBERTURA_INCOMPLETA' },
  { id: 'PIE-19', bloque: 'cobertura', prioridad: 'estructural', disparador: 'la base no declara ninguna correspondencia aplicable', plantilla: 'COBERTURA_SIN_CORRESPONDENCIAS' },

  // Consistencia
  { id: 'PIE-20', bloque: 'consistencia', prioridad: 'media', disparador: 'consistencia completa', plantilla: 'CONSISTENCIA_COMPLETA' },
  { id: 'PIE-21', bloque: 'consistencia', prioridad: 'media', disparador: 'consistencia parcial', plantilla: 'CONSISTENCIA_PARCIAL' },
  { id: 'PIE-22', bloque: 'consistencia', prioridad: 'estructural', disparador: 'consistencia inconsistente', plantilla: 'CONSISTENCIA_INCONSISTENTE' },
  { id: 'PIE-23', bloque: 'consistencia', prioridad: 'estructural', disparador: 'sin datos', plantilla: 'CONSISTENCIA_SIN_DATOS' },

  // Metodología y datos
  { id: 'PIE-24', bloque: 'metodologia', prioridad: 'estructural', disparador: 'sensibilidad al cambio no documentada', plantilla: 'METODO_SENSIBILIDAD' },
  { id: 'PIE-25', bloque: 'metodologia', prioridad: 'alta', disparador: 'vigencia no documentada', plantilla: 'METODO_VIGENCIA' },
  { id: 'PIE-26', bloque: 'metodologia', prioridad: 'informativa', disparador: 'ninguna correspondencia declara peso', plantilla: 'METODO_PESOS' },
  { id: 'PIE-27', bloque: 'metodologia', prioridad: 'informativa', disparador: 'existen registros anulados', plantilla: 'DATO_ANULADOS' },
  { id: 'PIE-28', bloque: 'metodologia', prioridad: 'estructural', disparador: 'siempre', plantilla: 'DATO_LIMITE_INTERPRETACION' },
] as const;

const INDICE = new Set(REGLAS.map((r) => r.id));

export function esRegla(id: string): boolean {
  return INDICE.has(id);
}

export function definicionRegla(id: string): DefinicionRegla | undefined {
  return REGLAS.find((r) => r.id === id);
}

export const TOTAL_REGLAS = REGLAS.length;
