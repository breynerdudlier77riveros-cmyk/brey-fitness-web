// ── Render y ajuste de longitud (Sprint BCS-6.0) ───────────────────────────
// Compone secciones en texto plano y ajusta a la longitud pedida.
//
// El recorte es POR ORACIONES COMPLETAS, nunca por palabras: cortar a mitad de
// frase produciría un documento que parece truncado por error. Si la última
// oración no cabe entera, se descarta.
//
// Este archivo es el equivalente al render.ts del Observation Generator: sería
// lo único que cambiaría si un modelo de lenguaje sustituyera la composición
// determinista.

import type { Seccion } from './tipos';

/**
 * `n` con la forma que le corresponda: «1 evaluación», «3 evaluaciones».
 *
 * Existe porque el fallo se repetía en siete plantillas distintas y siempre
 * igual: una condición `length > 0` con una frase escrita en plural. Con una
 * sola medición —el caso de la mayoría de los clientes reales— el documento
 * decía «Se registraron 1 evaluación», y un informe que no sabe contar hasta
 * uno no invita a creerse el resto.
 *
 * Devuelve la frase entera y no solo el sustantivo, porque a menudo lo que
 * hay que concordar es el verbo: «que condiciona» / «que condicionan».
 */
export function segunNumero(n: number, singular: string, plural: string): string {
  return `${n} ${n === 1 ? singular : plural}`;
}

/** Palabras de un texto. Cuenta secuencias no vacías separadas por espacio. */
export function contarPalabras(texto: string): number {
  return texto.trim().split(/\s+/).filter(Boolean).length;
}

/** Divide en oraciones conservando su puntuación final. */
export function dividirOraciones(texto: string): string[] {
  return texto
    .split(/(?<=[.!?])\s+/)
    .map((o) => o.trim())
    .filter(Boolean);
}

/**
 * Recorta a un máximo de palabras sin partir ninguna oración.
 *
 * Devuelve al menos la primera oración aunque exceda el máximo: entregar un
 * documento vacío porque su primera frase era larga sería peor que exceder
 * ligeramente el límite, y el llamador siempre puede comprobar `palabras`.
 */
export function recortarAPalabras(oraciones: readonly string[], maximo: number): string[] {
  const resultado: string[] = [];
  let total = 0;

  for (const oracion of oraciones) {
    const palabras = contarPalabras(oracion);
    if (resultado.length > 0 && total + palabras > maximo) break;
    resultado.push(oracion);
    total += palabras;
  }

  return resultado.length > 0 ? resultado : oraciones.slice(0, 1);
}

/** Texto plano de un conjunto de secciones. */
export function componerTexto(secciones: readonly Seccion[]): string {
  return secciones
    .map((s) => (s.titulo ? `${s.titulo}\n${s.contenido.join('\n')}` : s.contenido.join('\n')))
    .join('\n\n')
    .trim();
}

/**
 * Palabras por minuto usadas para dimensionar los guiones de consulta.
 *
 * DECISIÓN DE PRODUCTO, sin base clínica ni bibliográfica — se declara como
 * tal, igual que el umbral de significancia del BCS Design Handbook. Sirve
 * para que un guion de «5 minutos» tenga una extensión razonable, no para
 * afirmar a qué velocidad habla nadie.
 */
export const PALABRAS_POR_MINUTO = 130;

export function palabrasParaMinutos(minutos: number): number {
  return minutos * PALABRAS_POR_MINUTO;
}
