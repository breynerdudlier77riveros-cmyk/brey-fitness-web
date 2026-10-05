// ── Ningún desplegable en blanco sobre blanco (Sprint MAC-2) ───────────────
//
// EL FALLO, Y POR QUÉ VOLVÍA UNA Y OTRA VEZ:
//
//   Un `<select>` con fondo translúcido y texto blanco se ve perfecto
//   cerrado. Al abrirlo, el sistema operativo pinta SU panel —blanco en
//   Windows— y hereda el `color: white` del control: la lista de opciones
//   sale invisible.
//
//   El proyecto ya lo había arreglado TRES veces, a mano, en sitios
//   distintos, con tres apaños distintos. `ClienteForm` hasta lleva el
//   comentario que lo explica. Nada de eso impidió que el cuarto `<select>`
//   —el de crear macrociclos— naciera con el mismo defecto: arreglarlo donde
//   aparece no evita que reaparezca donde todavía no está.
//
//   Por eso el arreglo de verdad no es otro parche: es esta comprobación.
//   Un `<select>` nuevo sin el tratamiento rompe la suite, y quien lo escriba
//   se entera en el momento y no cuando un cliente abre el desplegable.
//
// QUÉ SE EXIGE:
//
//   `[color-scheme:dark]` en las clases del propio `<select>`, que es lo que
//   manda pintar el panel nativo en oscuro. El fondo opaco viaja con él en
//   `CLASES_SELECT`; sin `color-scheme` no basta ningún fondo, porque el panel
//   no es parte de la página.

import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const SRC = join(process.cwd(), 'src');

/** Una barra invertida, construida asi para no pelearse con el escapado. */
const B = String.fromCharCode(92);

function tsx(dir: string): string[] {
  const salida: string[] = [];
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (statSync(ruta).isDirectory()) {
      salida.push(...tsx(ruta));
    } else if (entrada.endsWith('.tsx')) {
      salida.push(ruta);
    }
  }
  return salida;
}

/** El fichero sin comentarios de bloque ni de línea. */
function sinComentarios(texto: string): string {
  // Se sustituyen por ESPACIOS y no se borran, para que el numero de linea
  // que se informa siga siendo el del fichero real.
  const bloques = new RegExp(B + '/' + B + '*[' + B + 's' + B + 'S]*?' + B + '*' + B + '/', 'g');
  const lineas = new RegExp('^[ \t]*' + B + '/' + B + '/.*$', 'gm');
  return texto
    .replace(bloques, (m) => m.replace(/[^\n]/g, ' '))
    .replace(lineas, (m) => ' '.repeat(m.length));
}

/** Cada `<select …>` del proyecto, con su fichero y su texto de apertura. */
function selects(): { fichero: string; etiqueta: string; linea: number }[] {
  const encontrados: { fichero: string; etiqueta: string; linea: number }[] = [];

  for (const ruta of tsx(SRC)) {
    // SIN COMENTARIOS. El primer intento marcó tres `<select>` de
    // `brand/Select.tsx` que no existen: son la palabra escrita dentro de la
    // cabecera, explicando al select nativo que ese componente reemplaza.
    // Nombrar algo para hablar de ello no es usarlo.
    const texto = sinComentarios(readFileSync(ruta, 'utf-8'));
    // Desde `<select` hasta el `>` que lo cierra. Basta para leer su
    // `className`, que es donde tiene que estar el tratamiento.
    for (const m of texto.matchAll(/<select\b[\s\S]*?>/g)) {
      encontrados.push({
        fichero: relative(process.cwd(), ruta).replace(/\\/g, '/'),
        etiqueta: m[0],
        linea: texto.slice(0, m.index).split('\n').length,
      });
    }
  }
  return encontrados;
}

/** El componente compartido: es de donde salen las clases buenas. */
const FUENTE_COMPARTIDA = 'src/components/brand/SelectNativo.tsx';

describe('los desplegables nativos son legibles al abrirse', () => {
  const todos = selects();

  it('CONTROL POSITIVO · el proyecto tiene selects que revisar', () => {
    // Sin esto, borrar el escáner dejaría la prueba pasando en verde sobre
    // una lista vacía.
    expect(todos.length).toBeGreaterThan(5);
  });

  it('el componente compartido declara el tratamiento', () => {
    const fuente = readFileSync(join(process.cwd(), FUENTE_COMPARTIDA), 'utf-8');
    expect(fuente).toContain('[color-scheme:dark]');
    expect(fuente).toContain('bg-slate-900');
  });

  it('TODOS llevan color-scheme dark, directo o heredado de las clases comunes', () => {
    const sinTratar = todos.filter((s) => {
      // El del componente compartido lo recibe por `cn(CLASES_SELECT, …)`.
      if (s.fichero === FUENTE_COMPARTIDA) return false;
      if (s.etiqueta.includes('[color-scheme:dark]')) return false;
      // Una constante local de clases vale si la declara en su fichero.
      const fuente = sinComentarios(readFileSync(join(process.cwd(), s.fichero), 'utf-8'));
      return !fuente.includes('[color-scheme:dark]');
    });

    expect(
      sinTratar.map((s) => `${s.fichero}:${s.linea}`),
      'Estos <select> abren un panel nativo en blanco sobre blanco. Usa ' +
        '`SelectNativo` de components/brand, o añade `[color-scheme:dark]` y un ' +
        'fondo OPACO a sus clases.',
    ).toEqual([]);
  });

  it('ninguno usa un fondo translúcido, que es lo que destapa el fallo', () => {
    // `bg-white/[0.03]` y compañía dejan ver lo que hay detrás, y detrás del
    // panel nativo no hay página: hay el blanco del sistema.
    const translucidos = todos.filter((s) => /bg-white\/\[?[\d.]/.test(s.etiqueta));
    expect(
      translucidos.map((s) => `${s.fichero}:${s.linea}`),
      'Un <select> con fondo translúcido deja el desplegable nativo en blanco.',
    ).toEqual([]);
  });
});
