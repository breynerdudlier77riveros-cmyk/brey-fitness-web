// ── Validador del asistente del plan (Sprint PLS-2) ────────────────────────
//
// POR QUÉ NO SE REUTILIZA EL DEL BCS, QUE ERA LA OPCIÓN OBVIA.
//
//   `validarTexto` prohíbe el vocabulario de entrenamiento —«entrena»,
//   «rutina de», «series y repeticiones», «plan de entrenamiento»— y tiene
//   razón en hacerlo: en un informe de composición corporal esas palabras son
//   una prescripción que nadie ha respaldado.
//
//   Aquí son EL TEMA. Un asistente que explica un plan de entrenamiento y no
//   puede decir «series» no puede decir nada. Reutilizar aquel validador
//   habría rechazado toda respuesta correcta, y el sistema habría parecido
//   roto mientras funcionaba exactamente como se le pidió.
//
//   Así que este validador existe con la línea movida de sitio, no aflojada.
//
// ── DÓNDE ESTÁ LA LÍNEA AHORA ─────────────────────────────────────────────
//
//   Puede: leer el plan, explicar qué es un RIR, describir un ejercicio, decir
//   cuántas series hay en la semana 3, explicar para qué sirve el
//   calentamiento.
//
//   No puede: añadir nada que el entrenador no escribiera, cambiar una carga,
//   juzgar si el plan es bueno, opinar sobre alimentación, ni acercarse a lo
//   médico. Quien lee es el CLIENTE, y una sugerencia del sistema que
//   contradiga a su entrenador es peor que no responder.
//
// ── EL LÍMITE QUE NINGÚN LÉXICO PUEDE VIGILAR ─────────────────────────────
//
//   Que el modelo se invente un peso o una serie no lo detecta ninguna regex:
//   «85 kg» es una cifra legítima en este dominio. Eso lo cierra el CONTEXTO,
//   que le entrega el plan y nada más — no tiene de dónde sacar otra cifra.
//   Es la misma arquitectura que el BCS: la restricción fuerte es lo que no se
//   le da, no lo que se le pide.
//
// Módulo puro.

export type CategoriaPlan =
  /** Añadir o cambiar la prescripción. Lo escribe el entrenador, no el sistema. */
  | 'prescripcion_propia'
  /** Opinar sobre si el plan está bien. No es asunto suyo. */
  | 'juicio_del_plan'
  /** Cualquier cosa cercana a lo clínico. */
  | 'medico'
  /** Alimentación y suplementación. */
  | 'nutricion'
  /** Certezas que nadie puede garantizar. */
  | 'certeza';

export interface ViolacionPlan {
  categoria: CategoriaPlan;
  termino: string;
  detalle: string;
}

/**
 * Léxico prohibido, por categoría.
 *
 * Se comprueba sobre texto en minúsculas y sin acentos, y por SUBCADENA: así
 * «recomiend» cubre recomiendo, recomienda y recomendable con una entrada.
 *
 * Los términos llevan el espacio o la forma que evita el falso positivo. «te
 * recomiendo» y no «recomend» a secas, porque «lo que la evidencia recomienda»
 * podría aparecer citando la ficha del propio plan.
 */
const LEXICO: Readonly<Record<CategoriaPlan, readonly string[]>> = {
  prescripcion_propia: [
    'te recomiendo',
    'te recomendaria',
    'yo te sugiero',
    'yo haria',
    'deberias hacer',
    'deberias anadir',
    'deberias subir',
    'deberias bajar',
    'te aconsejo',
    'anade una serie',
    'quita una serie',
    'sube el peso',
    'baja el peso',
    'aumenta la carga',
    'reduce la carga',
    'cambia el ejercicio',
    'sustituye el ejercicio',
    'en su lugar haz',
    'mi recomendacion es',
  ],
  juicio_del_plan: [
    'este plan es bueno',
    'este plan es malo',
    'un buen plan',
    'un mal plan',
    'el plan esta mal',
    'el plan es insuficiente',
    'te falta trabajo',
    'le falta volumen',
    'seria mejor',
    'estaria mejor',
    'no es optimo',
    'es poco volumen',
    'es demasiado volumen',
    'deberia incluir',
  ],
  medico: [
    'diagnostic',
    'patolog',
    'enfermedad',
    'sindrome',
    'lesionado',
    'te vas a lesionar',
    'tendinitis',
    'hernia',
    'medicament',
    'farmac',
    'fisioterap',
    'rehabilitacion',
    'tratamiento',
    'terapia',
  ],
  nutricion: [
    'dieta',
    'caloria',
    'kcal diarias',
    'macronutrient',
    'suplement',
    'proteina en polvo',
    'creatina',
    'deficit calorico',
    'superavit calorico',
    'come mas',
    'ingesta recomendada',
  ],
  certeza: [
    'esta demostrado que',
    'seguro que vas a',
    'sin duda',
    'garantiza',
    'te garantizo',
    'siempre funciona',
    'nunca falla',
    'es imposible que',
  ],
};

/** Minúsculas y sin acentos, para que una sola entrada cubra las variantes. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

/**
 * Comprueba el texto que el asistente iba a enseñar.
 *
 * Devuelve TODAS las violaciones, no la primera: si un texto rompe tres
 * reglas, saberlo dice algo distinto de que rompa una — sobre todo cuando el
 * rechazo se le enseña a quien preguntó.
 */
export function validarTextoPlan(texto: string): ViolacionPlan[] {
  const plano = normalizar(texto);
  const violaciones: ViolacionPlan[] = [];

  for (const [categoria, terminos] of Object.entries(LEXICO)) {
    for (const termino of terminos) {
      if (plano.includes(normalizar(termino))) {
        violaciones.push({
          categoria: categoria as CategoriaPlan,
          termino,
          detalle: `El texto contiene «${termino}», vetado en la categoría ${categoria}.`,
        });
      }
    }
  }

  return violaciones;
}
