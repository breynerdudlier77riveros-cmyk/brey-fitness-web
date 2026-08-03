// ── Vocabulario prohibido del PPRE (Sprint PAS-6.0) ────────────────────────
// Lista única, compartida por el motor y las pruebas.
//
// ⚠ CONSECUENCIA DELIBERADA: `potencia`, `velocidad` y `carga` son a la vez
// términos de prescripción y NOMBRES DE CAPACIDADES del PAS (A-03, D-01,
// F-01). Como la prohibición es literal, este motor nombra las capacidades
// **por código** y nunca por su nombre. Es también lo más trazable: `A-03` no
// admite la lectura de «hay que trabajar la potencia».
//
// Por el mismo motivo el PPRE NO incrusta el texto del PIE en sus
// recomendaciones: las plantillas del PIE insertan el nombre de la capacidad,
// así que copiarlas colaría el término prohibido. Se referencian por id.

export const VOCABULARIO_PROHIBIDO: readonly string[] = [
  // Prescripción de contenido
  'entrene', 'entrenar', 'entrenamiento', 'ejercicio', 'ejercicios',
  'sentadilla', 'press', 'peso muerto', 'series', 'repeticiones',
  'carga', 'cargas', 'volumen', 'intensidad', 'frecuencia',
  'programa', 'rutina', 'periodización', 'periodizacion',
  // Cualidades como objetivo de trabajo
  'velocidad', 'potencia', 'hipertrofia', 'agilidad', 'movilidad',
  // Clínico
  'riesgo', 'prevención', 'prevencion', 'tratamiento', 'diagnóstico',
  'diagnostico', 'rehabilitación', 'rehabilitacion', 'lesión', 'lesion',
  'fisioterapeuta',
  // Juicio y prescripción verbal
  'debe', 'debería', 'deberia', 'conviene', 'recomendable',
  'mejorar', 'corregir', 'reducir', 'aumentar', 'trabajar',
  'mejor', 'peor', 'óptimo', 'optimo', 'deficiente', 'ideal',
  // Comparación y puntuación
  'ranking', 'puntuación', 'puntuacion', 'score', 'percentil',
];

/** Frases prohibidas: se comprueban tal cual, sin frontera de palabra. */
export const FRASES_PROHIBIDAS: readonly string[] = [
  'se recomienda entrenar',
  'enviar al fisioterapeuta',
  'cambiar la rutina',
];

const LETRA = 'a-zá-úüñ';

function patronDe(termino: string): RegExp {
  const escapado = termino.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`(?<![${LETRA}])${escapado}(?![${LETRA}])`, 'i');
}

const PATRONES = VOCABULARIO_PROHIBIDO.map((termino) => ({ termino, patron: patronDe(termino) }));

/** Términos y frases prohibidos presentes en un texto. */
export function terminosProhibidos(texto: string): string[] {
  const encontrados = PATRONES.filter(({ patron }) => patron.test(texto)).map((p) => p.termino);
  const frases = FRASES_PROHIBIDAS.filter((frase) => texto.toLowerCase().includes(frase));
  return [...new Set([...encontrados, ...frases])].sort();
}

export function esTextoAdmisible(texto: string): boolean {
  return terminosProhibidos(texto).length === 0;
}

/** Recorre un objeto y devuelve todo texto inadmisible que encuentre. */
export function auditarTextos(valor: unknown, ruta = ''): string[] {
  if (typeof valor === 'string') {
    const prohibidos = terminosProhibidos(valor);
    return prohibidos.length > 0 ? [`${ruta}: ${prohibidos.join(', ')}`] : [];
  }
  if (Array.isArray(valor)) {
    return valor.flatMap((hijo, i) => auditarTextos(hijo, `${ruta}[${i}]`));
  }
  if (valor && typeof valor === 'object') {
    return Object.entries(valor).flatMap(([clave, hijo]) =>
      auditarTextos(hijo, ruta ? `${ruta}.${clave}` : clave)
    );
  }
  return [];
}
