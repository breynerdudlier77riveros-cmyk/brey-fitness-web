// ── Vocabulario prohibido (Sprint PAS-4.0) ─────────────────────────────────
// Lista única, compartida por el motor y por las pruebas. Que sea una sola
// fuente es lo que impide que la comprobación y la redacción se separen.
//
// La prohibición alcanza al TEXTO EMITIDO. No alcanza a los comentarios del
// código ni a los identificadores internos: `nivelEvidencia` es un nombre de
// campo, no una afirmación sobre un atleta.

/**
 * Términos que jamás aparecen en una interpretación.
 *
 * Cada uno afirma algo que el PAS no puede sostener: un juicio de valor, una
 * predicción, una categoría clínica o una decisión de contenido.
 */
export const VOCABULARIO_PROHIBIDO: readonly string[] = [
  // Juicio de valor
  'mejor', 'peor', 'óptimo', 'optimo', 'deficiente', 'ideal',
  // Clínico
  'riesgo', 'lesión', 'lesion', 'tratamiento', 'rehabilitación', 'rehabilitacion',
  'diagnóstico', 'diagnostico', 'patología', 'patologia',
  // Prescripción
  'debe', 'debería', 'deberia', 'recomendable', 'conveniente', 'prescripción',
  'prescripcion', 'plan', 'entrenamiento', 'corregir', 'mejorar',
];

/**
 * Frontera de palabra para español, con acentos y sin `\b`.
 *
 * `\b` no sirve aquí: trata la tilde como separador, así que `debe` casaría
 * dentro de `debería`. Y sin frontera, `plan` casaría dentro de `plantilla` y
 * `mejor` dentro de `mejorar`, que son casos reales de este módulo.
 */
const LETRA = 'a-zá-úüñ';

function patronDe(termino: string): RegExp {
  const escapado = termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![${LETRA}])${escapado}(?![${LETRA}])`, 'i');
}

const PATRONES: readonly { termino: string; patron: RegExp }[] = VOCABULARIO_PROHIBIDO.map(
  (termino) => ({ termino, patron: patronDe(termino) })
);

/** Términos prohibidos presentes en un texto. Vacío = texto admisible. */
export function terminosProhibidos(texto: string): string[] {
  return PATRONES.filter(({ patron }) => patron.test(texto)).map(({ termino }) => termino);
}

export function esTextoAdmisible(texto: string): boolean {
  return terminosProhibidos(texto).length === 0;
}
