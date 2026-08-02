// ── Motor de reglas (Sprint BCS-4.0) ───────────────────────────────────────
// Recorre el catálogo y construye una recomendación por cada activación.
// Solo DECIDE qué se emite: el texto lo pone plantillas.ts y la autoridad
// evidencia.ts. Este archivo no contiene ni una frase dirigida al usuario.
//
// Puro: mismo análisis → mismas recomendaciones, en el mismo orden. Sin
// Supabase, sin red, sin reloj, sin aleatoriedad.

import type { BodyCompositionAnalysis } from '@/lib/bcs/analysis';
import { EVIDENCIAS } from './evidencia';
import { PLANTILLAS, interpolar } from './plantillas';
import { REGLAS, type Activacion, type Regla } from './reglas';
import type { ProfessionalRecommendation } from './tipos';

/** Construye la recomendación de UNA activación de UNA regla. */
function construir(regla: Regla, activacion: Activacion): ProfessionalRecommendation {
  const plantilla = PLANTILLAS[regla.plantilla];
  const { valores } = activacion;

  return {
    id: activacion.discriminante ? `${regla.id}#${activacion.discriminante}` : regla.id,
    regla: regla.id,
    categoria: regla.categoria,
    prioridad: regla.prioridad,
    titulo: interpolar(plantilla.titulo, valores),
    descripcion: interpolar(plantilla.descripcion, valores),
    fundamento: activacion.fundamento,
    evidencia: EVIDENCIAS[regla.evidencia],
    variablesRelacionadas: [...new Set(activacion.variables)],
    accionProfesional: interpolar(plantilla.accionProfesional, valores),
    seguimiento: plantilla.seguimiento ? interpolar(plantilla.seguimiento, valores) : null,
    limitaciones: [...plantilla.limitaciones],
    origenHallazgos: activacion.origen,
    estado: 'activa',
  };
}

/**
 * Evalúa el catálogo completo contra un análisis.
 *
 * El orden de salida es el del catálogo; ordenar por prioridad y categoría es
 * responsabilidad del orquestador, para que el motor siga siendo trivialmente
 * reproducible y fácil de auditar regla a regla.
 */
export function evaluarReglas(analisis: BodyCompositionAnalysis): ProfessionalRecommendation[] {
  const recomendaciones: ProfessionalRecommendation[] = [];

  for (const regla of REGLAS) {
    for (const activacion of regla.evaluar(analisis)) {
      recomendaciones.push(construir(regla, activacion));
    }
  }

  return recomendaciones;
}

/** Número de reglas del catálogo. Se reporta en la salida para auditoría. */
export function totalReglas(): number {
  return REGLAS.length;
}
