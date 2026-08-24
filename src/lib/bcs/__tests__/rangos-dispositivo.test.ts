// ── La banda del aparato (Sprint BCS-13) ───────────────────────────────────
//
// LO QUE ESTOS TESTS PROTEGEN:
//
//   1 · Que la barra NUNCA emita una etiqueta de mérito. Es la única razón por
//       la que dibujarla es admisible: la CKB (12 §5) excluye los rangos
//       comerciales porque «un rango de referencia es lo que convertiría una
//       descripción en una clasificación». La prohibición es a la palabra. Si
//       un día alguien añade «normal» al texto, el test cae.
//
//   2 · Que la barra diga de dónde sale. Un intervalo calculado desde la talla
//       no es un percentil, y sin esa frase el lector supondrá que lo es —
//       porque es exactamente lo que parece.
//
//   3 · Que un rango mal copiado NO se dibuje. Invertido, degenerado o a
//       medias: el sitio para arreglarlo es la hoja, no el renderizador.
//
// ── EL CONTROL POSITIVO ───────────────────────────────────────────────────
//
// Los tests de prohibición de este repositorio llevan control positivo desde
// que uno pasó por no encontrar nada donde no buscaba. Aquí el detector se
// prueba contra una frase que SÍ contiene las palabras vetadas: si el detector
// dejara de detectar, ese test caería antes que los demás y diría por qué.

import { describe, expect, it } from 'vitest';

import {
  CAPTURABLES,
  procedenciaBanda,
  redactarBanda,
  situarEnBanda,
  type PosicionBanda,
  type RangosDispositivo,
} from '../rangos-dispositivo';
import { CATALOGO } from '../reporte';

/** Los rangos de la hoja real contra la que se dedujo todo esto. */
const HOJA: RangosDispositivo = {
  grasa_pct: { min: 10, max: 20 },
  proteina_kg: { min: 11.1, max: 13.5 },
  agua_total_l: { min: 41.2, max: 50.4 },
};

/**
 * Las palabras que la barra no puede decir.
 *
 * No son sinónimos sueltos: son las categorías que el aparato imprime y que
 * este sistema no puede respaldar. `\b` a los dos lados para que «altura» o
 * «normalizado» no den un falso positivo.
 */
const MERITO =
  /\b(normal(es)?|anormal|standard|est[áa]ndar|bajo|baja|alto|alta|d[ée]ficit|exceso|[óo]ptimo|ideal|saludable|adecuado|insuficiente|elevado)\b/i;

describe('situarEnBanda', () => {
  it('sitúa dentro, por debajo y por encima según el intervalo de la hoja', () => {
    expect(situarEnBanda('grasa_pct', 13.3, HOJA)).toEqual({
      clase: 'dentro',
      min: 10,
      max: 20,
    });
    expect(situarEnBanda('grasa_pct', 8, HOJA)?.clase).toBe('por_debajo');
    expect(situarEnBanda('grasa_pct', 24, HOJA)?.clase).toBe('por_encima');
  });

  it('cuenta los extremos como dentro: el intervalo impreso es cerrado', () => {
    expect(situarEnBanda('grasa_pct', 10, HOJA)?.clase).toBe('dentro');
    expect(situarEnBanda('grasa_pct', 20, HOJA)?.clase).toBe('dentro');
  });

  it('no dibuja nada sin rangos capturados', () => {
    expect(situarEnBanda('grasa_pct', 13.3, null)).toBeNull();
    expect(situarEnBanda('grasa_pct', 13.3, {})).toBeNull();
    // Capturada otra variable, no esta: tampoco.
    expect(situarEnBanda('imc', 22, HOJA)).toBeNull();
  });

  it('descarta el rango invertido o de anchura cero en vez de acomodarlo', () => {
    // Invertido: vendría de copiar los dos números en el orden contrario. Si
    // se «arreglara» girándolo, el desliz quedaría enterrado en una barra que
    // parece correcta.
    expect(situarEnBanda('grasa_pct', 15, { grasa_pct: { min: 20, max: 10 } })).toBeNull();
    // Anchura cero: cualquier valor cae fuera, y la barra no tiene tramo.
    expect(situarEnBanda('grasa_pct', 15, { grasa_pct: { min: 15, max: 15 } })).toBeNull();
  });
});

describe('redactarBanda', () => {
  const casos: PosicionBanda[] = [
    { clase: 'dentro', min: 10, max: 20 },
    { clase: 'por_debajo', min: 10, max: 20 },
    { clase: 'por_encima', min: 10, max: 20 },
  ];

  it('nombra los dos números del intervalo en los tres casos', () => {
    for (const p of casos) {
      const texto = redactarBanda(p, '%');
      expect(texto).toContain('10');
      expect(texto).toContain('20');
    }
  });

  it('escribe los decimales con coma, como el resto del informe', () => {
    expect(redactarBanda({ clase: 'dentro', min: 11.1, max: 13.5 }, 'kg')).toContain('11,1–13,5 kg');
  });

  it('NUNCA emite una etiqueta de mérito', () => {
    for (const p of casos) {
      const texto = redactarBanda(p, '%');
      expect(texto, texto).not.toMatch(MERITO);
    }
  });

  it('control positivo: el detector sí encuentra las palabras vetadas', () => {
    // Si este test cae, el de arriba no demuestra nada — estaría pasando
    // porque la expresión dejó de reconocer las palabras, no porque el texto
    // esté limpio.
    expect('Tu valor es normal.').toMatch(MERITO);
    expect('Resultado bajo para tu estatura.').toMatch(MERITO);
    expect('Standard.').toMatch(MERITO);
    // Y no confunde palabras que sí pueden aparecer.
    expect('Tu altura y tu peso.').not.toMatch(MERITO);
  });
});

describe('procedenciaBanda', () => {
  it('dice que no es un percentil y de dónde sale el intervalo', () => {
    const texto = procedenciaBanda('InBody 770');
    expect(texto).toContain('InBody 770');
    expect(texto).toContain('no es un percentil');
    expect(texto).toContain('estatura');
  });

  it('sin modelo capturado, no inventa uno', () => {
    const texto = procedenciaBanda(null);
    expect(texto).toContain('tu analizador');
    expect(texto).toContain('no es un percentil');
  });

  it('tampoco cuela una etiqueta de mérito por la puerta de atrás', () => {
    expect(procedenciaBanda('InBody 770')).not.toMatch(MERITO);
  });
});

describe('CAPTURABLES', () => {
  it('solo lista variables que el catálogo conoce', () => {
    for (const { id } of CAPTURABLES) {
      expect(CATALOGO[id], id).toBeDefined();
    }
  });

  it('no repite ninguna: dos filas del mismo id darían dos campos que se pisan', () => {
    const ids = CAPTURABLES.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});
