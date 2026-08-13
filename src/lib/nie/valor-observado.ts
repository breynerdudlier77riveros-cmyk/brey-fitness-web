// ── NIE-1.3.2 · el valor observado ─────────────────────────────────────────
//
// **Valor normativo ≠ valor observado.**
//
//   NKB            → norma       → valor normativo
//   Sujeto/entrada → medición    → valor observado
//   NIE            → interpretación matemática
//
// Nunca: NKB ← valor observado.
//
// El valor observado entra en el NIE como dato externo y **no se incorpora a
// la NKB, ni a las fichas, ni a las referencias, ni al contrato CN**. Tampoco
// entra en `ContextoEvaluacion`: la resolución de candidatas se hace sin él, y
// eso sigue siendo cierto después de este sprint.
//
// Módulo puro.

import type { ContextoEvaluacion, Unidad, VariableId } from './tipos';

/** De dónde salió el dato. Sin esto no hay traza del lado del sujeto. */
export interface ProcedenciaObservacion {
  /** Quién o qué lo aportó: un formulario, un import, un test. */
  origen: string;
  /** `yyyy-mm-dd`. Se recibe; el motor nunca consulta el reloj. */
  fecha: string | null;
  /** Identificador del registro de origen, si existe. */
  registroId: string | null;
}

/**
 * Una medición concreta.
 *
 * Lleva su propio contexto normativo porque la aplicabilidad depende de **cómo
 * se midió**, no de cuánto salió. El valor y el contexto viajan juntos pero se
 * usan en momentos distintos: el contexto resuelve candidatas, el valor solo
 * interviene después.
 */
export interface ValorObservado {
  variable: VariableId;
  valor: number;
  unidad: Unidad;
  /** Condiciones de la medición, en el mismo vocabulario que las normas. */
  contexto: ContextoEvaluacion;
  procedencia: ProcedenciaObservacion;
  metadatos: Record<string, string>;
}

/**
 * Construye un valor observado a partir de un contexto ya resuelto.
 *
 * Exige que la variable y la unidad del contexto coincidan con las del valor:
 * un contexto que dice `kg` y un valor en `lbf` sería una incoherencia interna,
 * y este motor no la arregla en silencio.
 */
export function crearValorObservado(entrada: {
  valor: number;
  unidad: Unidad;
  contexto: ContextoEvaluacion;
  procedencia: ProcedenciaObservacion;
  metadatos?: Record<string, string>;
}): ValorObservado {
  const { valor, unidad, contexto, procedencia } = entrada;

  if (!Number.isFinite(valor)) {
    throw new Error('NIE: el valor observado no es un número finito.');
  }
  if (contexto.variable === null) {
    throw new Error('NIE: el contexto de una medición debe declarar su variable.');
  }
  if (contexto.unidad !== null && contexto.unidad !== unidad) {
    throw new Error(
      `NIE: el contexto declara ${contexto.unidad} y la medición está en ${unidad}. ` +
        'El motor no convierte unidades ni elige cuál vale.',
    );
  }

  return {
    variable: contexto.variable,
    valor,
    unidad,
    // La unidad del contexto se fija a la de la medición cuando no constaba;
    // no es una conversión, es completar lo que el propio dato ya declara.
    contexto: { ...contexto, unidad },
    procedencia,
    metadatos: entrada.metadatos ?? {},
  };
}
