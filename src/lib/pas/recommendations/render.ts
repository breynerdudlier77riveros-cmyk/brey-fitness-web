// ── Render del PPRE (Sprint PAS-6.0) ───────────────────────────────────────
// Sustituye huecos en los cuatro campos de texto de una plantilla. Es lo único
// que produce texto en todo el motor.
//
// Falla ruidosamente ante un hueco ausente, uno sobrante o léxico prohibido en
// el resultado. Una recomendación con un `{hueco}` a la vista llegaría al
// profesional pareciendo texto y siendo un error.

import { plantilla } from './plantillas';
import { terminosProhibidos } from './vocabulario';

export type Valores = Readonly<Record<string, string>>;

export interface TextoRenderizado {
  titulo: string;
  descripcion: string;
  accion: string;
  seguimiento: string | null;
}

/** Lista en español natural: «a», «a y b», «a, b y c». */
export function enumerar(elementos: readonly string[]): string {
  if (elementos.length === 0) return '—';
  if (elementos.length === 1) return elementos[0];
  return `${elementos.slice(0, -1).join(', ')} y ${elementos[elementos.length - 1]}`;
}

function sustituir(texto: string, huecos: readonly string[], valores: Valores): string {
  return huecos.reduce(
    (acumulado, hueco) => acumulado.split(`{${hueco}}`).join(valores[hueco]),
    texto
  );
}

export function render(plantillaId: string, valores: Valores = {}): TextoRenderizado {
  const definicion = plantilla(plantillaId);

  const faltantes = definicion.huecos.filter(
    (hueco) => valores[hueco] === undefined || valores[hueco] === ''
  );
  if (faltantes.length > 0) {
    throw new Error(`PPRE: faltan huecos en ${plantillaId}: ${faltantes.join(', ')}`);
  }

  const sobrantes = Object.keys(valores).filter((clave) => !definicion.huecos.includes(clave));
  if (sobrantes.length > 0) {
    throw new Error(`PPRE: huecos no declarados en ${plantillaId}: ${sobrantes.join(', ')}`);
  }

  const salida: TextoRenderizado = {
    titulo: sustituir(definicion.titulo, definicion.huecos, valores),
    descripcion: sustituir(definicion.descripcion, definicion.huecos, valores),
    accion: sustituir(definicion.accion, definicion.huecos, valores),
    seguimiento: definicion.seguimiento
      ? sustituir(definicion.seguimiento, definicion.huecos, valores)
      : null,
  };

  // Un valor inyectado puede traer léxico prohibido aunque la plantilla esté
  // limpia — es justo lo que ocurriría si alguien inyectase el NOMBRE de una
  // capacidad en vez de su código.
  for (const [campo, texto] of Object.entries(salida)) {
    if (typeof texto !== 'string') continue;
    const prohibidos = terminosProhibidos(texto);
    if (prohibidos.length > 0) {
      throw new Error(`PPRE: léxico prohibido en ${plantillaId}.${campo}: ${prohibidos.join(', ')}`);
    }
  }

  return salida;
}
