// ── Los diez casos obligatorios del sprint NIE-1.1 + NIE-1.2 ───────────────
//
// Se ejecutan contra las 356 normas reales de la NKB, no contra fixtures: lo
// que se comprueba es el comportamiento sobre la base auditada.

import { describe, expect, it } from 'vitest';

import { cargarNormas } from '@/lib/nie/nkb/cargador';
import { contextoVacio, resolver, utilizables } from '@/lib/nie/resolucion';
import type { Candidata, ContextoEvaluacion } from '@/lib/nie/tipos';

const NORMAS = cargarNormas();

/** Contexto base. Cada caso sobreescribe solo lo que le interesa. */
function ctx(p: Partial<ContextoEvaluacion>): ContextoEvaluacion {
  return { ...contextoVacio(), variable: 'fuerza_prension_manual', ...p };
}

/** Medición hecha con el protocolo de la ficha de universitarios colombianos. */
const PROTOCOLO_UNI = {
  pais: 'CO',
  instrumento: 'takei-t18-tkk-smedley-iii',
  unidad: 'kg',
  definicionOperacional: 'media_ambas_manos',
  posicion: 'bipedestacion',
  lado: 'ambas',
} as const;

/** Medición hecha con el protocolo de la ficha de Cúcuta. */
const PROTOCOLO_CUCUTA = {
  pais: 'CO',
  instrumento: 'camry-digital',
  unidad: 'kg',
  definicionOperacional: 'mejor_mano_dominante',
  posicion: 'bipedestacion',
  lado: 'dominante',
} as const;

const dim = (c: Candidata, d: string) => c.dimensiones.find((x) => x.dimension === d)!;

// ─── Caso 1 ─────────────────────────────────────────────────────────────────
describe('Caso 1 · colombiano de 20 años con el método de HGS-CO-UNI', () => {
  const r = resolver(ctx({ ...PROTOCOLO_UNI, edad: 20, sexo: 'M' }), NORMAS);

  it('encuentra la norma correspondiente', () => {
    const ids = utilizables(r).map((c) => c.normaId);
    expect(ids).toContain('HGS-CO-UNI-M-20');
  });

  it('la variable, el país, el instrumento y la unidad coinciden', () => {
    const c = r.candidatas.find((x) => x.normaId === 'HGS-CO-UNI-M-20')!;
    for (const d of ['variable', 'pais', 'instrumento', 'unidad', 'edad', 'sexo']) {
      expect(dim(c, d).estado, d).toBe('MATCH');
    }
  });

  it('devuelve también la norma TN-2 de la misma fuente, sin elegir entre ellas', () => {
    const ids = utilizables(r).map((c) => c.normaId);
    expect(ids).toContain('HGS-CO-UNI-TN2-M-20');
    expect(r.advertencias.some((a) => a.includes('no elige'))).toBe(true);
  });
});

// ─── Caso 2 ─────────────────────────────────────────────────────────────────
describe('Caso 2 · colombiano de 45 años · Cúcuta aplicable con reservas', () => {
  const r = resolver(ctx({ ...PROTOCOLO_CUCUTA, edad: 45, sexo: 'M' }), NORMAS);
  const c = r.candidatas.find((x) => x.normaId === 'HGS-CO-CUC-D-M-40')!;

  it('devuelve APLICABLE_CON_RESERVAS', () => {
    expect(c.aplicabilidad).toBe('APLICABLE_CON_RESERVAS');
  });

  it('conserva la calidad Baja como dimensión independiente', () => {
    expect(c.calidad).toBe('baja');
    expect(c.motivosReserva).toContain('calidad_baja');
    expect(c.dimensionesDegradantes).toEqual(['D-01', 'D-02']);
  });

  it('arrastra el N de la celda y las limitaciones declaradas', () => {
    expect(c.nCelda).toBe(15);
    expect(c.limitaciones.join(' ')).toContain('no probabilístico');
    expect(c.advertencias.join(' ')).toContain('no se pueden generalizar');
  });
});

// ─── Caso 3 ─────────────────────────────────────────────────────────────────
describe('Caso 3 · colombiano de 75 años · no existe norma admisible', () => {
  const r = resolver(ctx({ ...PROTOCOLO_CUCUTA, edad: 75, sexo: 'M' }), NORMAS);

  it('devuelve SIN_NORMA_ADMISIBLE', () => {
    expect(r.estadoGlobal).toBe('SIN_NORMA_ADMISIBLE');
    expect(utilizables(r)).toHaveLength(0);
  });

  it('no dice nada sobre el sujeto: solo sobre la evidencia', () => {
    // Se examina el texto que redacta el motor, no la prosa que las fichas de
    // la NKB aportan: una limitación de la fuente puede contener la palabra
    // «bajo» con todo derecho, y no es el motor quien juzga entonces.
    const redactadoPorElMotor = [
      r.estadoGlobal,
      ...r.advertencias,
      ...r.candidatas.flatMap((c) => [c.aplicabilidad, ...c.dimensiones.map((d) => d.motivo)]),
    ]
      .join(' ')
      .toLowerCase();

    for (const juicio of ['bajo', 'alto', 'anormal', 'normal', 'deficiente', 'insuficiente']) {
      expect(redactadoPorElMotor, juicio).not.toMatch(new RegExp(`\\b${juicio}\\b`));
    }
    expect(r.advertencias.join(' ')).toContain('describe la evidencia');
  });

  it('las normas brasileñas de 75 años no lo rescatan por proximidad', () => {
    const br = r.candidatas.filter((c) => c.pais === 'BR' && c.aplicabilidad !== 'NO_APLICABLE');
    expect(br).toHaveLength(0);
  });
});

// ─── Caso 4 ─────────────────────────────────────────────────────────────────
describe('Caso 4 · Takei TKK 5101 frente a norma de T-18 SMEDLY III', () => {
  const r = resolver(
    ctx({ ...PROTOCOLO_UNI, instrumento: 'takei-tkk-5101', edad: 20, sexo: 'M' }),
    NORMAS,
  );
  const c = r.candidatas.find((x) => x.normaId === 'HGS-CO-UNI-M-20')!;

  it('produce NO_APLICABLE por incompatibilidad de instrumento', () => {
    expect(c.aplicabilidad).toBe('NO_APLICABLE');
    expect(c.discrepancias).toContain('instrumento');
  });

  it('no inventa equivalencia por compartir marca', () => {
    expect(dim(c, 'instrumento').motivo).toContain('EQ-3');
  });
});

// ─── Caso 5 ─────────────────────────────────────────────────────────────────
describe('Caso 5 · entrada en kg frente a norma en kgf', () => {
  const r = resolver(
    ctx({
      pais: 'BR',
      instrumento: 'jamar-j00105',
      unidad: 'kg',
      definicionOperacional: 'media_2a_y_3a_mano_dominante',
      posicion: 'sedestacion',
      lado: 'dominante',
      edad: 70,
      sexo: 'M',
      estaturaM: 1.75,
    }),
    NORMAS,
  );
  const c = r.candidatas.find((x) => x.normaId === 'HGS-BR-M170-70')!;

  it('marca UNIT_MISMATCH y no convierte', () => {
    expect(dim(c, 'unidad').codigo).toBe('UNIT_MISMATCH');
    expect(dim(c, 'unidad').estado).toBe('MISMATCH');
  });

  it('la norma no pasa a aplicable', () => {
    expect(c.aplicabilidad).toBe('NO_APLICABLE');
    expect(utilizables(r)).toHaveLength(0);
  });
});

// ─── Caso 6 ─────────────────────────────────────────────────────────────────
describe('Caso 6 · edad dentro del rango pero sexo incompatible', () => {
  const r = resolver(ctx({ ...PROTOCOLO_UNI, edad: 20, sexo: 'F' }), NORMAS);
  const c = r.candidatas.find((x) => x.normaId === 'HGS-CO-UNI-M-20')!;

  it('produce NO_APLICABLE', () => {
    expect(c.aplicabilidad).toBe('NO_APLICABLE');
    expect(c.discrepancias).toEqual(['sexo']);
    expect(dim(c, 'edad').estado).toBe('MATCH');
  });

  it('sí encuentra la del estrato femenino', () => {
    expect(utilizables(r).map((x) => x.normaId)).toContain('HGS-CO-UNI-F-20');
  });
});

// ─── Caso 7 ─────────────────────────────────────────────────────────────────
describe('Caso 7 · falta el instrumento', () => {
  const r = resolver(
    ctx({ ...PROTOCOLO_UNI, instrumento: null, edad: 20, sexo: 'M' }),
    NORMAS,
  );
  const c = r.candidatas.find((x) => x.normaId === 'HGS-CO-UNI-M-20')!;

  it('produce NO_DETERMINABLE, no NO_APLICABLE', () => {
    expect(c.aplicabilidad).toBe('NO_DETERMINABLE');
    expect(c.camposFaltantes).toContain('instrumento');
  });

  it('no convierte «desconocido» en «no»', () => {
    expect(dim(c, 'instrumento').estado).toBe('NO_DETERMINABLE');
    expect(dim(c, 'instrumento').recibido).toBeNull();
    expect(c.discrepancias).toHaveLength(0);
  });
});

// ─── Caso 8 ─────────────────────────────────────────────────────────────────
describe('Caso 8 · norma en ES-2 · Cuestionada', () => {
  const r = resolver(
    ctx({
      pais: 'CO',
      instrumento: 'takei-tkk-5101',
      unidad: 'kg',
      definicionOperacional: 'media_ambas_manos',
      posicion: 'bipedestacion',
      lado: 'ambas',
      edad: 15,
      sexo: 'M',
    }),
    NORMAS,
  );
  const c = r.candidatas.find((x) => x.normaId === 'HGS-CO-M-15')!;

  it('la encuentra y no la descarta', () => {
    expect(c).toBeDefined();
    expect(c.aplicabilidad).not.toBe('NO_APLICABLE');
  });

  it('conserva el estado ES-2 sin convertirlo en ES-1', () => {
    expect(c.estadoNorma).toBe('ES-2');
    expect(c.motivosReserva).toContain('estado_cuestionado');
  });

  it('propaga el conflicto declarado por la NKB sin resolverlo', () => {
    expect(c.conflicto).toBe('CONFLICTO_NO_DETERMINABLE');
    expect(r.estadoGlobal).toBe('CONFLICTO_NO_DETERMINABLE');
    expect(c.advertencias.join(' ')).toContain('ENSIN-2015');
  });

  it('la advertencia viaja en la resolución global', () => {
    expect(r.advertencias.join(' ')).toContain('ES-2');
  });
});

// ─── Caso 9 ─────────────────────────────────────────────────────────────────
describe('Caso 9 · dos normas encontradas, ninguna elegida', () => {
  const r = resolver(ctx({ ...PROTOCOLO_UNI, edad: 25, sexo: 'F' }), NORMAS);
  const u = utilizables(r);

  it('devuelve ambas candidatas', () => {
    expect(u.length).toBeGreaterThanOrEqual(2);
    const ids = u.map((c) => c.normaId);
    expect(ids).toContain('HGS-CO-UNI-F-25');
    expect(ids).toContain('HGS-CO-UNI-TN2-F-25');
  });

  it('son de tipos distintos y el motor no prefiere ninguno', () => {
    expect(new Set(u.map((c) => c.tipo))).toEqual(new Set(['TN-1', 'TN-2']));
    expect(r.advertencias.join(' ')).toContain('no elige');
  });

  it('el orden es el de la NKB, no un ranking', () => {
    const enNkb = NORMAS.filter((n) => u.some((c) => c.normaId === n.id)).map((n) => n.id);
    expect(u.map((c) => c.normaId)).toEqual(enNkb);
  });
});

// ─── Caso 10 ────────────────────────────────────────────────────────────────
describe('Caso 10 · aplicabilidad y calidad son ejes independientes', () => {
  const r = resolver(ctx({ ...PROTOCOLO_CUCUTA, edad: 45, sexo: 'M' }), NORMAS);
  const c = r.candidatas.find((x) => x.normaId === 'HGS-CO-CUC-D-M-40')!;

  it('aplicable con reservas y calidad Baja a la vez', () => {
    expect(c.aplicabilidad).toBe('APLICABLE_CON_RESERVAS');
    expect(c.calidad).toBe('baja');
  });

  it('no existe ninguna puntuación compuesta', () => {
    const claves = Object.keys(c).join(' ');
    for (const prohibida of ['score', 'puntuacion', 'puntaje', 'ranking', 'porcentaje']) {
      expect(claves.toLowerCase(), prohibida).not.toContain(prohibida);
    }
    expect(Array.isArray(c.motivosReserva)).toBe(true);
  });

  it('una norma de calidad Moderada puede no ser aplicable', () => {
    // Alemania es Moderada y no corresponde a un colombiano.
    const de = r.candidatas.find((x) => x.pais === 'DE')!;
    expect(de.calidad).toBe('moderada');
    expect(de.aplicabilidad).toBe('NO_APLICABLE');
  });
});
