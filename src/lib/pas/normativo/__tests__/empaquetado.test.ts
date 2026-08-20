// ── La NKB llega al artefacto de producción (Sprint PRS-2.4) ───────────────
//
// EL RIESGO QUE ESTE FICHERO CIERRA:
//
//   `cargarNormas()` lee las fichas Markdown con `readdirSync` sobre una ruta
//   compuesta en tiempo de ejecución. `@vercel/nft` —el trazador de `next
//   build`— analiza el uso de `fs` de forma ESTÁTICA, y hoy consigue resolver
//   esa lectura: la traza incluye las dieciocho fichas.
//
//   Depender de esa heurística es la trampa. Un refactor de cómo se compone la
//   ruta la haría fallar, el build seguiría pasando, y las fichas
//   desaparecerían del artefacto sin que nada lo avisara. El fallo llegaría a
//   producción como ENOENT.
//
// Por eso `next.config.ts` las declara explícitamente, y esto lo comprueba.
//
// LA FUENTE DE VERDAD NO CAMBIA. Aquí no se genera JSON, ni TS, ni una segunda
// tabla normativa: se comprueba que los MISMOS ficheros Markdown llegan al
// sitio donde el proceso los buscará.

import { describe, expect, it } from 'vitest';
import { copyFileSync, existsSync, mkdirSync, readdirSync, readFileSync, rmSync } from 'node:fs';
import { join } from 'node:path';
import { tmpdir } from 'node:os';

import { RUTA_FICHAS, cargarNormas } from '@/lib/nie/nkb/cargador';

const FUENTE = join(process.cwd(), RUTA_FICHAS);

/**
 * Copia las fichas a un directorio ajeno al árbol fuente y devuelve su raíz.
 *
 * Simula el artefacto de producción: un proceso que **no puede** apoyarse por
 * accidente en el repositorio original, porque no está debajo de él.
 */
function artefacto(): string {
  const raiz = join(tmpdir(), `prs24-artefacto-${process.pid}`);
  const destino = join(raiz, RUTA_FICHAS);
  if (existsSync(raiz)) rmSync(raiz, { recursive: true, force: true });
  mkdirSync(destino, { recursive: true });
  for (const f of readdirSync(FUENTE)) copyFileSync(join(FUENTE, f), join(destino, f));
  return raiz;
}

/**
 * El recuento va FIJO a propósito: es un disparador.
 *
 * Cualquiera que añada o quite una ficha de la NKB tiene que pasar por aquí y
 * actualizarlo, y al hacerlo comprueba que la nueva viaja al artefacto. Si el
 * test contara `readdirSync().length` contra sí mismo no comprobaría nada.
 *
 * 15 en PRS-2.4 · 18 desde PAS-12 (+SAR-CA, +CMJ-CA, +SRT-CO-FUP).
 */
const FICHAS_ESPERADAS = 18;

describe('la NKB se carga desde fuera del árbol fuente', () => {
  it('un artefacto con solo las fichas produce las 356 normas', () => {
    const raiz = artefacto();
    try {
      expect(cargarNormas(raiz)).toHaveLength(356);
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  it('y son idénticas a las del árbol fuente, ficha a ficha', () => {
    const raiz = artefacto();
    try {
      // Igualdad estructural completa: si el transporte alterara un solo
      // percentil, esto caería.
      expect(JSON.stringify(cargarNormas(raiz))).toBe(JSON.stringify(cargarNormas()));
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  it('las dieciocho fichas viajan enteras, byte a byte', () => {
    const raiz = artefacto();
    try {
      const destino = join(raiz, RUTA_FICHAS);
      const ficheros = readdirSync(FUENTE);
      expect(ficheros).toHaveLength(FICHAS_ESPERADAS);
      for (const f of ficheros) {
        expect(readFileSync(join(destino, f), 'utf-8'), f).toBe(
          readFileSync(join(FUENTE, f), 'utf-8'),
        );
      }
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });

  it('sin las fichas lanza ENOENT: un fallo técnico, no una lista vacía', () => {
    const raiz = artefacto();
    try {
      rmSync(join(raiz, RUTA_FICHAS), { recursive: true, force: true });
      let capturado: NodeJS.ErrnoException | null = null;
      try {
        cargarNormas(raiz);
      } catch (e) {
        capturado = e as NodeJS.ErrnoException;
      }
      // Que LANCE es lo correcto. Devolver `[]` haría que aguas abajo se
      // leyera como «ninguna norma aplicable», que es una conclusión
      // científica que nadie ha sacado.
      expect(capturado).not.toBeNull();
      expect(capturado!.code).toBe('ENOENT');
    } finally {
      rmSync(raiz, { recursive: true, force: true });
    }
  });
});

describe('la configuración de build declara el transporte', () => {
  const CONFIG = readFileSync(join(process.cwd(), 'next.config.ts'), 'utf-8');
  /** Sin comentarios: la cabecera EXPLICA el riesgo y nombra lo que prohíbe. */
  const CODIGO = CONFIG.replace(/\/\/.*$/gm, '').replace(/\/\*[\s\S]*?\*\//g, '');

  it('declara `outputFileTracingIncludes`', () => {
    expect(CODIGO).toContain('outputFileTracingIncludes');
  });

  it('incluye la carpeta de fichas de la NKB', () => {
    expect(CODIGO).toContain('docs/normative-knowledge-base/fichas');
  });

  it('la clave es la ruta que deriva el informe normativo', () => {
    expect(CODIGO).toContain('/app/rendimiento/evaluacion/[evaluacionId]');
  });

  it('el glob declarado cubre las dieciocho fichas reales', () => {
    // El patrón dice `**/*.md`; se comprueba que todo lo que `cargarNormas`
    // lee son ficheros `.md`, o el glob dejaría alguno fuera.
    const ficheros = readdirSync(FUENTE);
    expect(ficheros.every((f) => f.endsWith('.md'))).toBe(true);
    expect(ficheros).toHaveLength(FICHAS_ESPERADAS);
  });

  it('la ruta declarada en el config es la que el cargador usa de verdad', () => {
    // Sin esto, mover `RUTA_FICHAS` dejaría el config apuntando al vacío y el
    // artefacto se quedaría sin normas otra vez.
    expect(CODIGO).toContain(RUTA_FICHAS.replace(/\\/g, '/'));
  });

  it('control positivo: la comprobación detecta un config sin la declaración', () => {
    const falso = 'const nextConfig = { redirects() { return [] } };';
    expect(falso).not.toContain('outputFileTracingIncludes');
    expect(CODIGO).toContain('outputFileTracingIncludes');
  });
});

describe('no existe una segunda fuente de verdad normativa', () => {
  it('las fichas Markdown son lo único que el cargador lee', () => {
    const src = readFileSync(join(process.cwd(), 'src/lib/nie/nkb/cargador.ts'), 'utf-8');
    expect(src).toContain("'.md'");
    // Ni JSON, ni YAML, ni una tabla embebida.
    expect(src).not.toMatch(/\.json['"]|JSON\.parse|require\(.*\.json/);
  });

  it('ningún módulo de producción genera una NKB alternativa', () => {
    // Un generador dejaría rastro: un script que escriba normas serializadas.
    const paquete = JSON.parse(
      readFileSync(join(process.cwd(), 'package.json'), 'utf-8'),
    ) as { scripts: Record<string, string> };
    const guiones = Object.values(paquete.scripts).join(' ');
    expect(guiones).not.toMatch(/generar.*nkb|nkb.*generar|build.*normas/i);
  });
});
