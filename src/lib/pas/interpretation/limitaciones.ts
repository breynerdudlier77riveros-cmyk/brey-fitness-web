// ── Limitaciones automáticas (Sprint PAS-4.0) ──────────────────────────────
// El PIE genera limitaciones a partir de lo que la PKB declara y de lo que el
// perfil no cubre. Son las MISMAS interpretaciones que ya emiten las reglas,
// reagrupadas: una limitación no es un texto nuevo, es un texto existente
// leído como restricción.
//
// Reagrupar en vez de duplicar evita el fallo más probable de este módulo —que
// la lista de limitaciones y el cuerpo del informe se contradigan.

import type { Interpretacion, LimitacionPKB } from './tipos';

/** Reglas cuyo contenido es, por naturaleza, una restricción del alcance. */
const REGLAS_LIMITANTES: readonly string[] = [
  'PIE-02', // alcance autorizado
  'PIE-03', // población de la evidencia
  'PIE-04', // nivel de evidencia bajo
  'PIE-05', // validez de constructo no verificada
  'PIE-06', // cobertura parcial
  'PIE-07', // registros no vigentes
  'PIE-08', // datos no conciliables
  'PIE-10', // registros excluidos
  'PIE-12', // sin correspondencia
  'PIE-13', // evidencia insuficiente en la base
  'PIE-14', // correspondencia desaconsejada
  'PIE-18', // cobertura incompleta
  'PIE-19', // sin correspondencias
  'PIE-24', // sensibilidad no documentada
  'PIE-25', // vigencia no documentada
  'PIE-26', // pesos no documentados
];

const LIMITANTES = new Set(REGLAS_LIMITANTES);

export function esLimitante(regla: string): boolean {
  return LIMITANTES.has(regla);
}

/**
 * Selecciona del conjunto ya emitido las que restringen la interpretación.
 *
 * No construye nada: si una limitación no está entre las interpretaciones
 * emitidas, es que ninguna regla la detectó, y añadirla aquí sería afirmar
 * algo que el motor no dedujo.
 */
export function recopilarLimitaciones(
  interpretaciones: readonly Interpretacion[]
): Interpretacion[] {
  return interpretaciones.filter((i) => esLimitante(i.regla));
}

/** Códigos de limitación de la PKB presentes en el informe, sin repetir. */
export function limitacionesPKBAplicadas(
  interpretaciones: readonly Interpretacion[]
): LimitacionPKB[] {
  const codigos = new Set<LimitacionPKB>();
  for (const interpretacion of interpretaciones) {
    for (const limitacion of interpretacion.limitaciones) codigos.add(limitacion);
  }
  return [...codigos].sort();
}

/**
 * Las ocho situaciones que el encargo exige cubrir, con la regla que las
 * detecta. Sirve de comprobación cruzada: una fila sin regla sería un hueco
 * del motor.
 */
export const COBERTURA_DE_LIMITACIONES: readonly { situacion: string; regla: string }[] = [
  { situacion: 'la base declara evidencia insuficiente', regla: 'PIE-13' },
  { situacion: 'no existe correspondencia', regla: 'PIE-12' },
  { situacion: 'la cobertura es parcial', regla: 'PIE-06' },
  { situacion: 'la población difiere', regla: 'PIE-03' },
  { situacion: 'la validez es limitada', regla: 'PIE-05' },
  { situacion: 'la fiabilidad es insuficiente', regla: 'PIE-04' },
  { situacion: 'la sensibilidad al cambio es desconocida', regla: 'PIE-24' },
  { situacion: 'la capacidad permanece desconocida', regla: 'PIE-09' },
];
