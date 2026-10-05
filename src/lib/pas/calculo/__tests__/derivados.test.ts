// ── Los valores que se calculan (Sprint PAS-18) ────────────────────────────
//
// Tres protocolos no producen su número: lo derivan. Una ecuación mal copiada
// no se nota nunca —da un número plausible siempre— así que estos tests
// comprueban los coeficientes contra cuentas hechas a mano, y comprueban
// además lo que el módulo tiene que NEGARSE a hacer.

import { describe, expect, it } from 'vitest';

import {
  cocientesMcGill,
  indiceHarvard,
  vo2Leger,
  vo2Rockport,
  type EntradaRockport,
} from '../derivados';
import { FUENTES } from '@/lib/pas/evidencia/registro';

const BASE: EntradaRockport = {
  ecuacion: 'rockport_kg',
  masa: 70,
  edad: 30,
  minutos: 13,
  fcFinal: 140,
  sexo: 'M',
};

describe('Rockport · las tres ecuaciones', () => {
  it('ecuación 1 · coeficientes contra una cuenta a mano', () => {
    // 132,6 − (0,17×70) − (0,39×30) + (6,31×1) − (3,27×13) − (0,156×140)
    // = 132,6 − 11,9 − 11,7 + 6,31 − 42,51 − 21,84 = 50,96
    const r = vo2Rockport(BASE);
    expect(r.hay).toBe(true);
    if (!r.hay) return;
    expect(r.valor).toBe(50.96);
    expect(r.unidad).toBe('mL/kg/min');
  });

  it('ecuación 2 · NO usa la edad, y se nota', () => {
    // Es la diferencia de fondo entre las tres: cambiar la edad no mueve el
    // resultado de la segunda. Si algún día alguien "unifica" las ecuaciones,
    // esto lo dice.
    const a = vo2Rockport({ ...BASE, ecuacion: 'rockport_lb_sin_edad', masa: 154, edad: 20 });
    const b = vo2Rockport({ ...BASE, ecuacion: 'rockport_lb_sin_edad', masa: 154, edad: 60 });
    expect(a.hay && b.hay).toBe(true);
    if (!a.hay || !b.hay) return;
    expect(a.valor).toBe(b.valor);
    // 88,768 − (0,0957×154) + 8,892 − (1,4537×13) − (0,1194×140)
    // = 88,768 − 14,7378 + 8,892 − 18,8981 − 16,716 = 47,31
    expect(a.valor).toBe(47.31);
  });

  it('ecuación 3 · coeficientes contra una cuenta a mano', () => {
    // 132,85 − (0,0769×154) − (0,3877×30) + 6,315 − (3,2649×13) − (0,1565×140)
    // = 132,85 − 11,8426 − 11,631 + 6,315 − 42,4437 − 21,91 = 51,34
    const r = vo2Rockport({ ...BASE, ecuacion: 'rockport_lb', masa: 154 });
    expect(r.hay).toBe(true);
    if (!r.hay) return;
    expect(r.valor).toBe(51.34);
  });

  it('las tres dan resultados DISTINTOS para el mismo paseo', () => {
    // Por eso la ecuación es condición de registro. Si coincidieran, declarar
    // cuál se usó sería burocracia; como no coinciden, es el dato que hace
    // comparable un VO2máx con el de la evaluación anterior.
    const kg = vo2Rockport(BASE);
    const lb = vo2Rockport({ ...BASE, ecuacion: 'rockport_lb', masa: 154 });
    const sinEdad = vo2Rockport({ ...BASE, ecuacion: 'rockport_lb_sin_edad', masa: 154 });
    const vals = [kg, lb, sinEdad].map((r) => (r.hay ? r.valor : NaN));
    expect(new Set(vals).size).toBe(3);
  });

  it('el sexo cambia el resultado y NO tiene valor por defecto', () => {
    const v = vo2Rockport({ ...BASE, sexo: 'F' });
    expect(v.hay && v.valor).toBe(44.65); // 50,96 − 6,31
    const sin = vo2Rockport({ ...BASE, sexo: null });
    expect(sin.hay).toBe(false);
    if (sin.hay) return;
    expect(sin.faltan).toContain('sexo');
  });

  it('sin peso no hay estimación, y dice cuál falta', () => {
    const r = vo2Rockport({ ...BASE, masa: null, fcFinal: null });
    expect(r.hay).toBe(false);
    if (r.hay) return;
    expect(r.faltan).toEqual(['masa', 'fcFinal']);
  });

  it('la edad solo se exige donde la ecuación la usa', () => {
    expect(vo2Rockport({ ...BASE, ecuacion: 'rockport_lb_sin_edad', edad: null }).hay).toBe(true);
    expect(vo2Rockport({ ...BASE, ecuacion: 'rockport_kg', edad: null }).hay).toBe(false);
  });
});

describe('Escalón de Harvard · los dos métodos', () => {
  it('método largo · cuenta a mano', () => {
    // (300 × 100) / (2 × (40+38+36)) = 30000 / 228 = 131,58
    const r = indiceHarvard({ metodo: 'largo', segundos: 300, pulso1: 40, pulso2: 38, pulso3: 36 });
    expect(r.hay && r.valor).toBe(131.58);
  });

  it('método corto · cuenta a mano, y usa SOLO el primer pulso', () => {
    // (300 × 100) / (5,5 × 40) = 30000 / 220 = 136,36
    const r = indiceHarvard({ metodo: 'corto', segundos: 300, pulso1: 40, pulso2: 38, pulso3: 36 });
    expect(r.hay && r.valor).toBe(136.36);
    const otro = indiceHarvard({ metodo: 'corto', segundos: 300, pulso1: 40, pulso2: 99, pulso3: 99 });
    expect(otro.hay && otro.valor).toBe(136.36);
  });

  it('el método corto NO exige los pulsos que no usa', () => {
    const r = indiceHarvard({ metodo: 'corto', segundos: 300, pulso1: 40, pulso2: null, pulso3: null });
    expect(r.hay).toBe(true);
  });

  it('el largo sí los exige, y dice cuáles', () => {
    const r = indiceHarvard({ metodo: 'largo', segundos: 300, pulso1: 40, pulso2: null, pulso3: null });
    expect(r.hay).toBe(false);
    if (r.hay) return;
    expect(r.faltan).toEqual(['pulso2', 'pulso3']);
  });

  it('un pulso de cero no divide entre cero: se declara imposible', () => {
    const r = indiceHarvard({ metodo: 'corto', segundos: 300, pulso1: 0, pulso2: null, pulso3: null });
    expect(r.hay).toBe(false);
  });

  it('los dos métodos dan escalas DISTINTAS, que es por lo que hay dos tablas', () => {
    const largo = indiceHarvard({ metodo: 'largo', segundos: 300, pulso1: 40, pulso2: 38, pulso3: 36 });
    const corto = indiceHarvard({ metodo: 'corto', segundos: 300, pulso1: 40, pulso2: 38, pulso3: 36 });
    expect(largo.hay && corto.hay && largo.valor !== corto.valor).toBe(true);
  });
});

describe('McGill · los tres cocientes', () => {
  const EQUILIBRADO = { flexion: 100, extension: 150, lateralDerecho: 90, lateralIzquierdo: 88 };

  it('los tres criterios se evalúan con los umbrales del manual', () => {
    const r = cocientesMcGill(EQUILIBRADO);
    expect(r.hay).toBe(true);
    if (!r.hay) return;
    expect(r.cocientes.map((c) => c.id)).toEqual([
      'flexion_extension',
      'lateral_derecha_izquierda',
      'lateral_extension',
    ]);
    expect(r.cocientes[0].valor).toBe(0.67); // 100/150
    expect(r.cocientes[0].cumple).toBe(true);
    expect(r.cocientes[1].valor).toBe(1.02); // 90/88
    expect(r.cocientes[1].cumple).toBe(true);
    expect(r.cocientes[2].valor).toBe(0.6); // 90/150, el peor lado
    expect(r.cocientes[2].cumple).toBe(true);
  });

  it('la asimetría entre lados se detecta al pasar de 0,05', () => {
    const r = cocientesMcGill({ ...EQUILIBRADO, lateralDerecho: 120 }); // 120/88 = 1,36
    expect(r.hay).toBe(true);
    if (!r.hay) return;
    expect(r.cocientes[1].cumple).toBe(false);
  });

  it('el puente se compara con la extensión por el PEOR lado, no por la media', () => {
    // Un lado fuerte no puede tapar al otro: el manual pide que cada lado
    // quede por debajo de 0,75, así que el que decide es el mayor.
    const r = cocientesMcGill({ ...EQUILIBRADO, lateralDerecho: 140 }); // 140/150 = 0,93
    expect(r.hay).toBe(true);
    if (!r.hay) return;
    expect(r.cocientes[2].valor).toBe(0.93);
    expect(r.cocientes[2].cumple).toBe(false);
  });

  it('con un tiempo suelto no se calcula nada, y dice cuáles faltan', () => {
    const r = cocientesMcGill({ ...EQUILIBRADO, extension: null, lateralIzquierdo: null });
    expect(r.hay).toBe(false);
    if (r.hay) return;
    expect(r.faltan).toEqual(['extension', 'lateralIzquierdo']);
  });

  it('nunca divide entre cero', () => {
    expect(cocientesMcGill({ ...EQUILIBRADO, extension: 0 }).hay).toBe(false);
  });
});

describe('Course-navette (Léger) · VO2máx desde el estadio y la edad', () => {
  it('CONTROL POSITIVO · la cuenta hecha a mano, dentro del rango calibrado (≤18)', () => {
    // estadio 10 → velocidad 13 km/h; edad 15 (dentro de 8-19, no se topa).
    const r = vo2Leger({ estadios: 10, edad: 15 });
    expect(r.hay).toBe(true);
    if (!r.hay) return;
    // 31,025 + 3,238×13 − 3,248×15 + 0,1536×13×15 = 54,351
    expect(r.valor).toBe(54.35);
  });

  it('a partir de 18 años, la edad de la fórmula se topa en 18', () => {
    // Un adulto de 40 y uno de 60 tienen que dar EXACTAMENTE el mismo
    // resultado: los dos usan 18, no su edad real.
    const r40 = vo2Leger({ estadios: 10, edad: 40 });
    const r60 = vo2Leger({ estadios: 10, edad: 60 });
    expect(r40.hay && r60.hay).toBe(true);
    if (!r40.hay || !r60.hay) return;
    expect(r40.valor).toBe(r60.valor);
    // 31,025 + 3,238×13 − 3,248×18 + 0,1536×13×18 = 50,5974
    expect(r40.valor).toBe(50.6);
  });

  it('menor de 18 SÍ usa su edad real, no un tope', () => {
    const r15 = vo2Leger({ estadios: 10, edad: 15 });
    const r18 = vo2Leger({ estadios: 10, edad: 18 });
    expect(r15.hay && r18.hay).toBe(true);
    if (!r15.hay || !r18.hay) return;
    expect(r15.valor).not.toBe(r18.valor);
  });

  it('sin estadio o sin edad no calcula nada, y dice qué falta', () => {
    expect(vo2Leger({ estadios: null, edad: 20 })).toEqual({ hay: false, faltan: ['estadios'] });
    expect(vo2Leger({ estadios: 8, edad: null })).toEqual({ hay: false, faltan: ['edad'] });
  });

  it('la velocidad se deriva del estadio como publica la fuente: 8 + 0,5 × estadio', () => {
    // Con estadio 0 la velocidad de partida es 8 km/h, la de la primera línea
    // del protocolo. No se resta ni se suma nada más.
    const r = vo2Leger({ estadios: 0, edad: 18 });
    expect(r.hay).toBe(true);
    if (!r.hay) return;
    // 31,025 + 3,238×8 − 3,248×18 + 0,1536×8×18 = 20,5834
    expect(r.valor).toBe(20.58);
  });
});

describe('cada fórmula declara una fuente que EXISTE', () => {
  it('y no una inventada al vuelo', () => {
    // Es el mismo control que protege al registro de evidencia: la ciencia
    // vive en un sitio y se referencia por clave. Una clave que no resuelve
    // sería una fórmula sin procedencia.
    const ids = new Set(FUENTES.map((f) => f.id));
    const derivados = [
      vo2Rockport(BASE),
      vo2Rockport({ ...BASE, ecuacion: 'rockport_lb', masa: 154 }),
      vo2Rockport({ ...BASE, ecuacion: 'rockport_lb_sin_edad', masa: 154 }),
      indiceHarvard({ metodo: 'largo', segundos: 300, pulso1: 40, pulso2: 38, pulso3: 36 }),
      indiceHarvard({ metodo: 'corto', segundos: 300, pulso1: 40, pulso2: null, pulso3: null }),
      vo2Leger({ estadios: 10, edad: 20 }),
    ];
    for (const d of derivados) {
      expect(d.hay).toBe(true);
      if (!d.hay) continue;
      expect(ids.has(d.fuenteId), d.fuenteId).toBe(true);
    }
    const m = cocientesMcGill({ flexion: 100, extension: 150, lateralDerecho: 90, lateralIzquierdo: 88 });
    expect(m.hay && ids.has(m.fuenteId)).toBe(true);
  });

  it('el Rockport NO se atribuye al escalón de Harvard', () => {
    // Lo estuvo durante media hora en este mismo sprint: las cinco fórmulas
    // se escribieron seguidas y las tres primeras heredaron la fuente de las
    // dos últimas. Un error de copiar y pegar que deja la cita mintiendo.
    const r = vo2Rockport(BASE);
    expect(r.hay && r.fuenteId).toBe('rockport_kline_lopategui');
    const h = indiceHarvard({ metodo: 'corto', segundos: 300, pulso1: 40, pulso2: null, pulso3: null });
    expect(h.hay && h.fuenteId).toBe('harvard_iac_lopategui');
  });
});
