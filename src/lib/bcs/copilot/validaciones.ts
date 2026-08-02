// ── Validador de seguridad (Sprint BCS-6.0) ────────────────────────────────
// Guardián del copilot. TODO entregable pasa por aquí antes de devolverse, y
// una violación lo RECHAZA — no lo sanea.
//
// Sanear sería peor que rechazar: borrar la palabra prohibida y entregar el
// resto dejaría un documento mutilado con apariencia de correcto, y el
// profesional no sabría que faltó algo. Un rechazo explícito es auditable.
//
// El validador no confía en las plantillas. Aunque todas estén escritas con
// cuidado, se ejecuta igual: es la última línea antes de que un texto llegue a
// una persona.

import { CATALOGO, type VariableId } from '@/lib/bcs/reporte';

export type CategoriaViolacion =
  | 'diagnostico'
  | 'tratamiento'
  | 'prescripcion'
  | 'medicacion'
  | 'causalidad'
  | 'nutricion'
  | 'deporte'
  | 'fuera_de_evidencia'
  | 'variable_inexistente';

export interface Violacion {
  categoria: CategoriaViolacion;
  termino: string;
  detalle: string;
}

/**
 * Léxico prohibido por categoría. Se comprueba sobre texto en minúsculas y sin
 * acentos, para que «diagnostico» y «diagnóstico» no requieran dos entradas.
 */
const LEXICO: Record<Exclude<CategoriaViolacion, 'variable_inexistente'>, string[]> = {
  diagnostico: [
    'diagnostic', 'padece', 'sufre de', 'presenta un cuadro', 'patolog',
    'enfermedad', 'sindrome', 'trastorno', 'sarcopenia', 'obesidad morbida',
  ],
  tratamiento: ['tratamiento', 'terapia', 'protocolo de intervencion', 'curar', 'tratar la'],
  prescripcion: ['prescrib', 'receta', 'posologia', 'dosis'],
  medicacion: ['medicament', 'farmac', 'suplement', 'creatina', 'proteina en polvo'],
  causalidad: [
    'se debe a', 'causado por', 'a causa de', 'provoco', 'produjo un',
    'gracias a', 'por culpa de', 'es consecuencia de',
  ],
  nutricion: [
    'dieta', 'caloria', 'kcal diarias', 'macronutrient', 'come ', 'comer mas',
    'ingesta recomendada', 'plan alimentario', 'deficit calorico',
  ],
  deporte: [
    'entrena ', 'entrenamiento de fuerza tres', 'rutina de', 'series y repeticiones',
    'plan de entrenamiento', 'ejercicio recomendado', 'debe entrenar',
  ],
  fuera_de_evidencia: [
    'esta demostrado que', 'seguro que', 'sin duda', 'garantiza', 'siempre ocurre',
    'nunca falla', 'es normal', 'es anormal', 'es saludable', 'es preocupante',
  ],
};

/** Minúsculas sin acentos: normaliza antes de buscar. */
function normalizar(texto: string): string {
  return texto
    .toLowerCase()
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '');
}

function escaparRegex(texto: string): string {
  return texto.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

/**
 * Busca una etiqueta como palabra completa.
 *
 * Necesario porque «impedancia» aparece dentro de «bioimpedancia», que es el
 * nombre de la TÉCNICA y no de la variable. Sin límite de palabra, cualquier
 * texto que explicara el método quedaba rechazado por mencionar una variable
 * que no estaba en el reporte.
 */
function contienePalabra(plano: string, etiquetaNormalizada: string): boolean {
  const patron = new RegExp(`(?<![a-z0-9])${escaparRegex(etiquetaNormalizada)}(?![a-z0-9])`);
  return patron.test(plano);
}

export interface OpcionesValidacion {
  /**
   * Comprobar que toda variable mencionada figure en el reporte.
   *
   * Se desactiva para el material genérico —preguntas frecuentes y material
   * educativo—, que explica conceptos con independencia de los datos de nadie:
   * exigirles que solo nombren variables del reporte de un cliente concreto
   * convertiría un texto divulgativo correcto en una violación.
   */
  verificarVariables?: boolean;
}

/**
 * Comprueba el texto contra el léxico prohibido.
 *
 * @param variablesPermitidas Variables presentes en el reporte. Mencionar una
 *   que no esté ahí es inventar un dato, y se trata como violación.
 */
export function validarTexto(
  texto: string,
  variablesPermitidas: readonly VariableId[],
  opciones: OpcionesValidacion = {}
): Violacion[] {
  const { verificarVariables = true } = opciones;
  const plano = normalizar(texto);
  const violaciones: Violacion[] = [];

  // El léxico se busca por subcadena a propósito: así «diagnostic» cubre
  // diagnóstico, diagnosticar y diagnosticado con una sola entrada.
  for (const [categoria, terminos] of Object.entries(LEXICO)) {
    for (const termino of terminos) {
      if (plano.includes(normalizar(termino))) {
        violaciones.push({
          categoria: categoria as CategoriaViolacion,
          termino,
          detalle: `El texto contiene «${termino}», vetado en la categoría ${categoria}.`,
        });
      }
    }
  }

  if (verificarVariables) {
    const permitidas = new Set(variablesPermitidas);
    for (const id of Object.keys(CATALOGO) as VariableId[]) {
      if (permitidas.has(id)) continue;
      const etiqueta = normalizar(CATALOGO[id].etiqueta);
      // Etiquetas muy cortas serían ambiguas incluso con límite de palabra.
      if (etiqueta.length < 6) continue;
      if (contienePalabra(plano, etiqueta)) {
        violaciones.push({
          categoria: 'variable_inexistente',
          termino: CATALOGO[id].etiqueta,
          detalle: `Se menciona «${CATALOGO[id].etiqueta}», que no figura en la medición de origen.`,
        });
      }
    }
  }

  return violaciones;
}

/** Valida un entregable completo, sección a sección. */
export function validarSecciones(
  secciones: readonly { titulo: string; contenido: string[] }[],
  variablesPermitidas: readonly VariableId[],
  opciones: OpcionesValidacion = {}
): Violacion[] {
  const texto = secciones.map((s) => `${s.titulo}. ${s.contenido.join(' ')}`).join(' ');
  return validarTexto(texto, variablesPermitidas, opciones);
}
