// ── Lenguaje llano (Sprint PAS-13) ─────────────────────────────────────────
//
// LO QUE ESTOS TESTS PROTEGEN:
//
//   Que traducir un percentil a español NO se convierta, por el camino, en
//   clasificarlo. Es la frontera más fina de todo el proyecto: «entre 20 y 30
//   de cada 100 quedan por debajo de tu marca» es la definición literal del
//   número, y «tu resultado es bajo» es una categoría que nadie ha publicado.
//   Una sola palabra separa las dos frases — y este auditor ya cazó dos:
//   «más baja que la tuya» y «el protocolo no fija un óptimo», las dos escritas
//   por descuido en el propio módulo que vigila.
//
// Cada prohibición lleva su control positivo. Una prohibición no está
// demostrada porque una regex no encontró nada: hay que ver a la regex
// encontrar la infracción cuando existe.

import { describe, expect, it } from 'vitest';

import { PRUEBAS } from '@/features/performance-workspace/schemas/catalogo';
import type { Posicion } from '@/lib/pas/evidencia';

import { enLlano, sentidoDe } from '../llano';

const POBLACION = 'varones de 20 a 24 años de Canadá';

/** Todas las clases de posición que el sistema puede producir. */
const TODAS: readonly Posicion[] = [
  { clase: 'percentil_exacto', p: 50 },
  { clase: 'entre_percentiles', inferior: 20, superior: 30 },
  { clase: 'fuera_por_debajo', primerPercentil: 5 },
  { clase: 'fuera_por_encima', ultimoPercentil: 95 },
  { clase: 'desviaciones', z: 1.25 },
  { clase: 'desviaciones', z: -1.25 },
  { clase: 'dentro_del_rango' },
  { clase: 'fuera_del_rango', lado: 'superior' },
  { clase: 'fuera_del_rango', lado: 'inferior' },
  { clase: 'respecto_al_corte', lado: 'por_debajo' },
  { clase: 'respecto_al_corte', lado: 'por_encima' },
  { clase: 'respecto_al_corte', lado: 'en_el_corte' },
];

// ════════════════════════════════════════════════════════════════════════════
// NO SE CLASIFICA, Y SE DEMUESTRA
// ════════════════════════════════════════════════════════════════════════════

/**
 * Las categorías prohibidas. Los límites `(?<![-\w])…(?![-\w])` importan: sin
 * ellos, «normal» casa dentro de `font-normal` y «alto» dentro de «resaltado»,
 * y el auditor empieza a fallar por donde no debe.
 */
const CATEGORIAS =
  /(?<![-\w])(bueno|buena|malo|mala|alto|alta|bajo|baja|normal|excelente|óptimo|adecuado|deficiente|pobre|superior|inferior)(?![-\w])/i;

describe('traducir no es clasificar', () => {
  it('CONTROL POSITIVO · el auditor reconoce una categoría cuando la hay', () => {
    // Sin esta comprobación, los tres siguientes pasarían aunque la expresión
    // estuviera rota y no encontrara nada nunca.
    expect(CATEGORIAS.test('Tu resultado es bueno.')).toBe(true);
    expect(CATEGORIAS.test('Tu nivel es bajo para tu edad.')).toBe(true);
    expect(CATEGORIAS.test('Rendimiento normal.')).toBe(true);
  });

  it('CONTROL POSITIVO · y NO confunde una palabra dentro de otra', () => {
    expect(CATEGORIAS.test('resaltado')).toBe(false);
    expect(CATEGORIAS.test('font-normal')).toBe(false);
    expect(CATEGORIAS.test('rebajado')).toBe(false);
  });

  it('ninguna frase de ninguna posición contiene una categoría', () => {
    for (const p of TODAS) {
      for (const prueba of PRUEBAS) {
        const l = enLlano(prueba.id, p, POBLACION);
        expect(l.texto, `${prueba.id}/${p.clase}`).not.toMatch(CATEGORIAS);
        expect(l.sentido, `${prueba.id}/${p.clase}`).not.toMatch(CATEGORIAS);
      }
    }
  });

  it('ninguna frase es una cadena vacía: todas las clases están cubiertas', () => {
    for (const p of TODAS) {
      const l = enLlano('P-04', p, POBLACION);
      expect(l.texto.length, p.clase).toBeGreaterThan(20);
      expect(l.tecnico.length, p.clase).toBeGreaterThan(3);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LA FRASE DICE LO QUE EL PERCENTIL DICE
// ════════════════════════════════════════════════════════════════════════════

describe('la traducción es la definición del número, no una interpretación', () => {
  it('entre dos percentiles: cuánta gente queda por debajo', () => {
    const l = enLlano('P-04', { clase: 'entre_percentiles', inferior: 20, superior: 30 }, POBLACION);
    expect(l.texto).toBe(
      `Entre 20 y 30 de cada 100 ${POBLACION} quedan por debajo de tu marca.`,
    );
  });

  it('fuera por debajo: «menos de», y se dice que la fuente no llega más abajo', () => {
    const l = enLlano('P-04', { clase: 'fuera_por_debajo', primerPercentil: 5 }, POBLACION);
    expect(l.texto).toMatch(/Menos de 5 de cada 100/);
    expect(l.texto).toMatch(/no llega al valor más pequeño que publica la fuente/);
  });

  it('fuera por encima: «más de», y tampoco se extrapola', () => {
    const l = enLlano('P-04', { clase: 'fuera_por_encima', ultimoPercentil: 95 }, POBLACION);
    expect(l.texto).toMatch(/Más de 95 de cada 100/);
    expect(l.texto).toMatch(/pasa del valor más grande que publica la fuente/);
  });

  it('media y dispersión: NO se dice a cuánta gente supera', () => {
    // El error más tentador del sistema. La fuente publicó una media, no una
    // tabla; convertirla en un percentil exige suponer la distribución.
    const l = enLlano('P-04', { clase: 'desviaciones', z: 1.25 }, POBLACION);
    expect(l.texto).toMatch(/por encima de la media/);
    expect(l.texto).toMatch(/no puede decirse a cuánta gente superas/);
    expect(l.texto).not.toMatch(/de cada 100/);
  });

  it('y tampoco se le enseña la z al atleta: esa va en el rótulo técnico', () => {
    const l = enLlano('P-04', { clase: 'desviaciones', z: 1.25 }, POBLACION);
    expect(l.texto).not.toMatch(/1,25|desviaciones típicas/);
    expect(l.tecnico).toMatch(/1,25 desviaciones típicas por encima/);
  });

  it('el rótulo técnico conserva la forma exacta, sin perderla', () => {
    expect(
      enLlano('P-04', { clase: 'entre_percentiles', inferior: 90, superior: 97 }, POBLACION).tecnico,
    ).toBe('Entre el percentil 90 y el 97');
  });

  it('GUARDA · con la tabla invertida no se cuenta gente, se describe y ya', () => {
    // Si una fuente publicara P90 en el extremo bajo, `situar()` devolvería
    // inferior=90 y superior=30, y «entre 90 y 30 de cada 100» diría justo lo
    // contrario de la verdad. Ninguna registrada hoy lo hace: por eso mismo la
    // comprobación tiene que estar escrita.
    const l = enLlano('P-04', { clase: 'entre_percentiles', inferior: 90, superior: 30 }, POBLACION);
    expect(l.texto).not.toMatch(/de cada 100/);
    expect(l.texto).toMatch(/entre dos de los valores que la fuente publica/);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LA DIRECCIÓN SALE DEL CATÁLOGO, NO DE UNA SUPOSICIÓN
// ════════════════════════════════════════════════════════════════════════════

describe('el sentido de la escala lo declara el catálogo', () => {
  it('las ocho pruebas con dirección la enuncian en una línea', () => {
    expect(sentidoDe('P-01')).toBe('En esta prueba, un número mayor es mejor resultado.');
    expect(sentidoDe('P-11')).toBe('En esta prueba, un número menor es mejor resultado.');
  });

  it('las tres sin dirección explican POR QUÉ, y cada una la suya', () => {
    // Repetir «no se declara dirección» en los tres casos escondería que en el
    // sit-and-reach el motivo es fisiológico y en el FMS es aritmético.
    expect(sentidoDe('P-06')).toMatch(/exceso de rango/);
    expect(sentidoDe('P-06')).toMatch(/punto justo/);
    expect(sentidoDe('P-08')).toMatch(/diferencia entre las dos piernas/);
    expect(sentidoDe('P-09')).toMatch(/puntuación compuesta/);
    expect(new Set([sentidoDe('P-06'), sentidoDe('P-08'), sentidoDe('P-09')]).size).toBe(3);
  });

  it('las once del catálogo tienen algo que decir', () => {
    for (const p of PRUEBAS) {
      expect(sentidoDe(p.id).length, p.id).toBeGreaterThan(30);
    }
  });

  it('una prueba que no existe no se inventa una dirección', () => {
    expect(sentidoDe('P-99')).toMatch(/no describe esta prueba/);
  });

  it('la dirección NUNCA se mezcla con la posición en la misma frase', () => {
    // Fundirlas sería emitir el juicio: «superas al 30 % y más es mejor» ya es
    // una valoración. Van en campos distintos para que no puedan juntarse por
    // descuido de quien renderice.
    const l = enLlano('P-01', { clase: 'entre_percentiles', inferior: 20, superior: 30 }, POBLACION);
    expect(l.texto).not.toMatch(/mejor/);
    expect(l.sentido).not.toMatch(/de cada 100/);
  });
});
