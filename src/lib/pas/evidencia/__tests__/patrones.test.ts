// ── El patrón decide contra qué norma se compara (Sprint PAS-15) ───────────
//
// EL FALLO QUE ESTO IMPIDE: antes de este sprint la referencia de 1RM no
// declaraba de qué levantamiento era. El p90 de sentadilla masculina 18-35 es
// 2,83 y el de press de banca 1,96; comparar un press contra 2,83 no da una
// lectura mala, da la lectura de otro ejercicio.
//
// Y el segundo, que se coló al escribirlo: `patronCanonico` no reconocía sus
// propios ids. `sentadilla` figuraba en los alias mapeándose a sí misma, así
// que ESE levantamiento funcionaba y los otros dos se descartaban solos. Un
// caso que pasa por casualidad es peor que uno que falla siempre.

import { describe, expect, it } from 'vitest';

import {
  PATRONES_CANONICOS,
  normalizarPatron,
  patronCanonico,
  tieneNorma,
} from '../patrones';
import { leerEvidencia } from '../compatibilidad';
import { redactar } from '../redaccion';

describe('patronCanonico', () => {
  it('ES IDEMPOTENTE · un id canónico se devuelve a sí mismo', () => {
    // La comprobación que faltaba. Las referencias guardan el id y las
    // mediciones guardan lo tecleado, así que la función recibe las dos formas.
    for (const p of PATRONES_CANONICOS) {
      expect(patronCanonico(p), p).toBe(p);
    }
  });

  it('reconoce cómo lo escribe la gente', () => {
    expect(patronCanonico('Sentadilla')).toBe('sentadilla');
    expect(patronCanonico('press banca')).toBe('press_banca');
    expect(patronCanonico('Press de Banca')).toBe('press_banca');
    expect(patronCanonico('Peso muerto')).toBe('peso_muerto');
    expect(patronCanonico('  DEADLIFT  ')).toBe('peso_muerto');
  });

  it('NO empareja por parecido', () => {
    // «Sentadilla búlgara» contiene «sentadilla» y no comparte su norma.
    // Emparejarlas produciría justo el error que este módulo existe para
    // impedir.
    expect(patronCanonico('sentadilla búlgara')).toBeNull();
    expect(patronCanonico('press banca inclinado')).toBeNull();
    expect(patronCanonico('peso muerto sumo')).toBeNull();
  });

  it('un ejercicio sin norma devuelve null, y no es un error', () => {
    expect(patronCanonico('Dominadas')).toBeNull();
    expect(patronCanonico('')).toBeNull();
    expect(patronCanonico(null)).toBeNull();
    expect(patronCanonico(undefined)).toBeNull();
  });

  it('normalizar ignora tildes, mayúsculas y espacios de más', () => {
    expect(normalizarPatron('  Press   de  BANCA ')).toBe('press de banca');
  });

  it('tieneNorma responde lo mismo, en booleano', () => {
    expect(tieneNorma('Sentadilla')).toBe(true);
    expect(tieneNorma('Dominadas')).toBe(false);
  });
});

describe('cada levantamiento contra SU norma', () => {
  const SUJETO = { edad: 22, sexo: 'M' as const, pais: 'CO', pesoKg: 66 };
  const leer = (patron: string, ratio: number) =>
    leerEvidencia(
      {
        pruebaId: 'P-01',
        valor: ratio,
        unidad: 'ratio_peso',
        patron,
        condiciones: { determinacion: 'medido_directo' },
      },
      SUJETO,
    );

  it('los tres levantamientos publicados encuentran norma', () => {
    // Los datos reales que destaparon todo esto: 120, 100 y 150 kg con 66 kg
    // de masa corporal.
    for (const [patron, ratio] of [
      ['Sentadilla', 120 / 66],
      ['press banca', 100 / 66],
      ['Peso muerto', 150 / 66],
    ] as const) {
      const l = leer(patron, ratio);
      expect(l.estado, patron).toBe('EVIDENCIA_COMPATIBLE');
      expect(l.compatibles.length, patron).toBe(1);
    }
  });

  it('y CADA UNO cae en un percentil distinto, que es la prueba de fondo', () => {
    // Si los tres compartieran norma, tres cargas distintas sobre el mismo
    // peso darían posiciones ordenadas por la carga. Al comparar cada uno con
    // su propia distribución, el orden cambia — y ese cambio es la señal de
    // que se está usando la norma correcta.
    const textos = [
      redactar(leer('Sentadilla', 120 / 66)).texto,
      redactar(leer('press banca', 100 / 66)).texto,
      redactar(leer('Peso muerto', 150 / 66)).texto,
    ];
    expect(textos[0]).toContain('percentil 10');
    expect(textos[1]).toContain('percentil 40');
    expect(textos[2]).toContain('percentil 20');
  });

  it('un levantamiento sin norma NO se compara con la de otro', () => {
    // Dominadas es un ejercicio legítimo que esta fuente no publica. Antes
    // habría caído contra la norma de sentadilla.
    const l = leer('Dominadas', 50 / 66);
    expect(l.estado).toBe('EVIDENCIA_NO_COMPATIBLE');
    expect(l.compatibles).toHaveLength(0);
  });

  it('sin declarar levantamiento tampoco se compara con ninguna', () => {
    const l = leerEvidencia(
      { pruebaId: 'P-01', valor: 1.8, unidad: 'ratio_peso', condiciones: { determinacion: 'medido_directo' } },
      SUJETO,
    );
    expect(l.compatibles).toHaveLength(0);
  });

  it('la frase dice percentil, NUNCA un nivel', () => {
    // La fuente publica deciles, que son posiciones. «Avanzado» sería una
    // etiqueta de mérito y ninguna fuente admisible la publica (auditoría
    // NKB 41).
    const t = redactar(leer('press banca', 100 / 66)).texto;
    expect(t).toMatch(/percentil/);
    expect(t).not.toMatch(/avanzado|intermedio|principiante|élite|elite|novato/i);
  });
});
