// ── El breadcrumb no enlaza rutas que no existen (Sprint I-02) ─────────────
//
// EL FALLO QUE ESTE FICHERO IMPIDE:
//
//   En `/app/rendimiento/evaluacion/<id>` el breadcrumb hacía enlazable el
//   segmento `evaluacion`. Pero `/app/rendimiento/evaluacion` no es una página:
//   solo existe con el id detrás. Al pulsarlo, la URL caía en la ruta
//   `[atletaId]`, que recibía `atletaId = "evaluacion"`, y Postgres rechazaba
//   el uuid con un `22P02`.
//
//   Un error técnico provocado por la propia navegación de la aplicación, y que
//   además se mostraba al usuario como un 404: «este atleta no existe».
//
// La comprobación clave es la última: la lista declarada de segmentos sin
// página tiene que coincidir EXACTAMENTE con los directorios que no tienen
// `page.tsx`. Así, añadir una agrupación nueva y olvidarse de declararla hace
// caer el test en vez de romper la navegación en producción.

import { describe, expect, it } from 'vitest';
import { readFileSync, readdirSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';

const RAIZ = join(process.cwd(), 'src/app/app');
const FUENTE = readFileSync(join(process.cwd(), 'src/components/app/Breadcrumb.tsx'), 'utf-8');

/** Directorios de ruta bajo `/app` que NO tienen `page.tsx`. */
function sinPagina(dir: string): string[] {
  const salida: string[] = [];
  for (const entrada of readdirSync(dir)) {
    const ruta = join(dir, entrada);
    if (!statSync(ruta).isDirectory()) continue;
    if (entrada === '__tests__') continue;
    salida.push(...sinPagina(ruta));
    try {
      statSync(join(ruta, 'page.tsx'));
    } catch {
      salida.push(relative(RAIZ, ruta).replace(/\\/g, '/'));
    }
  }
  return salida;
}

/** El último tramo de cada ruta sin página: lo que el breadcrumb ve como segmento. */
const SEGMENTOS_SIN_PAGINA = [
  ...new Set(sinPagina(RAIZ).map((r) => r.split('/').pop()!)),
].sort();

/** Los que el componente declara. */
function declarados(): string[] {
  const m = /const SIN_PAGINA = new Set\(\[([^\]]*)\]\)/.exec(FUENTE);
  if (!m) return [];
  return [...m[1].matchAll(/"([^"]+)"/g)].map((x) => x[1]).sort();
}

describe('segmentos sin página', () => {
  it('el árbol de rutas tiene al menos uno, o esta prueba no comprueba nada', () => {
    expect(SEGMENTOS_SIN_PAGINA.length).toBeGreaterThan(0);
  });

  it('`evaluacion` es uno de ellos: es agrupación, no página', () => {
    expect(SEGMENTOS_SIN_PAGINA).toContain('evaluacion');
  });

  it('lo declarado coincide EXACTAMENTE con el árbol real', () => {
    // Si alguien añade `/app/x/y/[id]` sin `y/page.tsx` y no lo declara aquí,
    // este test cae. Es la única forma de que el componente, que es de cliente
    // y no puede leer el árbol, siga estando al día.
    expect(declarados()).toEqual(SEGMENTOS_SIN_PAGINA);
  });

  it('los segmentos declarados no se renderizan como enlace', () => {
    // La condición que lo gobierna: último O no navegable → texto plano.
    expect(FUENTE).toContain('const texto = last || !c.navegable;');
    expect(FUENTE).toMatch(/navegable:\s*!SIN_PAGINA\.has\(seg\)/);
  });

  it('control positivo: la comprobación detecta una lista desincronizada', () => {
    const FALSA = 'const SIN_PAGINA = new Set([]);';
    const m = /const SIN_PAGINA = new Set\(\[([^\]]*)\]\)/.exec(FALSA);
    expect(m).not.toBeNull();
    expect([...m![1].matchAll(/"([^"]+)"/g)].map((x) => x[1])).toEqual([]);
    // Y la real sí trae algo, o la comparación de arriba pasaría por vacío.
    expect(declarados().length).toBeGreaterThan(0);
  });
});

describe('rótulos legibles', () => {
  it('las rutas del Workspace tienen etiqueta, no el slug crudo', () => {
    for (const seg of ['rendimiento', 'evaluacion']) {
      expect(FUENTE, seg).toMatch(new RegExp(`${seg}:\\s*"`));
    }
  });

  it('el primer nivel del Workspace sigue siendo navegable', () => {
    // `/app/rendimiento` SÍ existe: no debe entrar en la lista de excluidos.
    expect(declarados()).not.toContain('rendimiento');
  });
});
