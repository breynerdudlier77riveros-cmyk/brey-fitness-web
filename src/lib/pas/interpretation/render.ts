// ── Render (Sprint PAS-4.0) ────────────────────────────────────────────────
// Sustituye huecos en una plantilla. Es lo único que produce texto en todo el
// motor, y no sabe nada de reglas ni de perfiles: recibe una plantilla y unos
// valores.
//
// Falla ruidosamente ante un hueco ausente o sobrante. Una frase con un
// `{hueco}` sin sustituir llegaría al profesional pareciendo un texto y siendo
// un error, que es peor que no emitirla.

import { plantilla } from './plantillas';
import { terminosProhibidos } from './vocabulario';

export type Valores = Readonly<Record<string, string>>;

/** Lista en español natural: «a», «a y b», «a, b y c». */
export function enumerar(elementos: readonly string[]): string {
  if (elementos.length === 0) return '—';
  if (elementos.length === 1) return elementos[0];
  return `${elementos.slice(0, -1).join(', ')} y ${elementos[elementos.length - 1]}`;
}

/** Cardinal como texto para los recuentos pequeños; cifra a partir de diez. */
export function cantidad(n: number): string {
  return String(n);
}

export function render(plantillaId: string, valores: Valores = {}): string {
  const definicion = plantilla(plantillaId);

  const faltantes = definicion.huecos.filter(
    (hueco) => valores[hueco] === undefined || valores[hueco] === ''
  );
  if (faltantes.length > 0) {
    throw new Error(`PIE: faltan huecos en ${plantillaId}: ${faltantes.join(', ')}`);
  }

  const sobrantes = Object.keys(valores).filter((clave) => !definicion.huecos.includes(clave));
  if (sobrantes.length > 0) {
    throw new Error(`PIE: huecos no declarados en ${plantillaId}: ${sobrantes.join(', ')}`);
  }

  const texto = definicion.huecos.reduce(
    (acumulado, hueco) => acumulado.split(`{${hueco}}`).join(valores[hueco]),
    definicion.texto
  );

  // Un valor inyectado puede traer léxico prohibido aunque la plantilla esté
  // limpia. La comprobación va sobre el texto FINAL, que es lo que se lee.
  const prohibidos = terminosProhibidos(texto);
  if (prohibidos.length > 0) {
    throw new Error(`PIE: léxico prohibido en ${plantillaId}: ${prohibidos.join(', ')}`);
  }

  return texto;
}
