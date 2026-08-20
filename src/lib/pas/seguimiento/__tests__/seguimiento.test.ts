// ── Serie longitudinal y progreso (Sprint PAS-10) ──────────────────────────
//
// Protegen las dos decisiones del sprint:
//
//   · una serie NO une puntos incomparables — los parte y declara la ruptura;
//   · el progreso NO se calcula sin dirección declarada, y jamás sale invertido.

import { describe, expect, it } from 'vitest';

import { PRUEBAS } from '@/features/performance-workspace/schemas/catalogo';

import { calcularProgreso, type EntradaProgreso } from '../progreso';
import { construirSerie, profundidadActual, type PuntoMedicion } from '../serie';

const METODO = { dinamometro: 'takei-t18', mano: 'ambas' };

const punto = (
  fecha: string,
  valor: number,
  unidad = 'kg',
  condiciones: Record<string, string> = METODO,
  pruebaId = 'P-03',
): PuntoMedicion => ({ pruebaId, valor, unidad, fecha, condiciones });

// ════════════════════════════════════════════════════════════════════════════
// EL CATÁLOGO DECLARA LA DIRECCIÓN
// ════════════════════════════════════════════════════════════════════════════

describe('dirección de mejora en el catálogo', () => {
  const de = (id: string) => PRUEBAS.find((p) => p.id === id)!;

  it('las pruebas de carga y de capacidad crecen hacia arriba', () => {
    for (const id of ['P-01', 'P-02', 'P-03', 'P-04', 'P-05', 'P-07']) {
      expect(de(id).direccion, id).toBe('mayor_mejor');
    }
  });

  it('las cronometradas crecen hacia abajo', () => {
    for (const id of ['P-10', 'P-11']) {
      expect(de(id).direccion, id).toBe('menor_mejor');
    }
  });

  it('tres quedan sin declarar, y es una respuesta legítima', () => {
    // Sit-and-reach (hipermovilidad), Y-Balance (importa la asimetría) y FMS
    // (ordinal compuesta). Declararlas sería inventar la semántica.
    for (const id of ['P-06', 'P-08', 'P-09']) {
      expect(de(id).direccion, id).toBeNull();
    }
  });

  it('las once declaran el campo, aunque sea null', () => {
    expect(PRUEBAS).toHaveLength(11);
    for (const p of PRUEBAS) expect(p, p.id).toHaveProperty('direccion');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// SERIE LONGITUDINAL
// ════════════════════════════════════════════════════════════════════════════

describe('la serie ordena y no pierde a nadie', () => {
  it('ordena por fecha aunque lleguen desordenadas', () => {
    const s = construirSerie('P-03', [
      punto('2026-08-15', 46),
      punto('2026-05-01', 42),
      punto('2026-06-15', 44),
    ]);
    expect(s.puntos.map((p) => p.fecha)).toEqual(['2026-05-01', '2026-06-15', '2026-08-15']);
  });

  it('ignora las mediciones de otras pruebas', () => {
    const s = construirSerie('P-03', [punto('2026-05-01', 42), punto('2026-06-01', 120, 'kg', {}, 'P-01')]);
    expect(s.puntos).toHaveLength(1);
  });

  it('sin mediciones devuelve una serie vacía, no lanza', () => {
    const s = construirSerie('P-03', []);
    expect(s.puntos).toEqual([]);
    expect(s.tramos).toEqual([]);
    expect(s.tramoActual).toBeNull();
    expect(profundidadActual(s)).toBe(0);
  });

  it('con método constante hay un solo tramo', () => {
    const s = construirSerie('P-03', [
      punto('2026-05-01', 42),
      punto('2026-06-15', 44),
      punto('2026-08-15', 46),
    ]);
    expect(s.tramos).toHaveLength(1);
    expect(s.rupturas).toEqual([]);
    expect(profundidadActual(s)).toBe(3);
  });

  it('nunca interpola: solo hay puntos medidos', () => {
    const s = construirSerie('P-03', [punto('2026-01-01', 40), punto('2026-12-01', 50)]);
    expect(s.puntos).toHaveLength(2);
    expect(s.puntos.map((p) => p.valor)).toEqual([40, 50]);
  });
});

describe('la serie se parte donde deja de ser comparable', () => {
  it('un cambio de método abre un tramo nuevo y declara la ruptura', () => {
    const s = construirSerie('P-03', [
      punto('2026-05-01', 42),
      punto('2026-08-15', 46, 'kg', { dinamometro: 'camry-digital', mano: 'ambas' }),
    ]);
    expect(s.tramos).toHaveLength(2);
    expect(s.rupturas).toHaveLength(1);
    expect(s.rupturas[0].motivo).toBe('metodo');
    expect(s.rupturas[0].desde).toBe('2026-05-01');
    expect(s.rupturas[0].hasta).toBe('2026-08-15');
    expect(s.rupturas[0].detalle).toMatch(/cambio de instrumento, no el del atleta/);
  });

  it('un cambio de unidad también, y con su propio motivo', () => {
    const s = construirSerie('P-03', [punto('2026-05-01', 42), punto('2026-08-15', 101, 'lbf')]);
    expect(s.rupturas[0].motivo).toBe('unidad');
    expect(s.rupturas[0].detalle).toMatch(/sin una conversión autorizada/);
  });

  it('ningún punto se pierde al partir la serie', () => {
    const s = construirSerie('P-03', [
      punto('2026-01-01', 40),
      punto('2026-05-01', 42),
      punto('2026-08-15', 46, 'kg', { dinamometro: 'camry-digital', mano: 'ambas' }),
    ]);
    const enTramos = s.tramos.flatMap((t) => t.puntos);
    expect(enTramos).toHaveLength(s.puntos.length);
    expect(enTramos.map((p) => p.fecha)).toEqual(s.puntos.map((p) => p.fecha));
  });

  it('el tramo actual es el de la medición más reciente', () => {
    const s = construirSerie('P-03', [
      punto('2026-01-01', 40),
      punto('2026-05-01', 42),
      punto('2026-08-15', 46, 'kg', { dinamometro: 'camry-digital', mano: 'ambas' }),
    ]);
    expect(profundidadActual(s)).toBe(1);
    expect(s.tramoActual!.puntos[0].fecha).toBe('2026-08-15');
  });

  it('volver al método original abre un tercer tramo, no reabre el primero', () => {
    // Son tres periodos distintos, y unir el primero con el tercero saltándose
    // el segundo afirmaría una continuidad que no hubo.
    const s = construirSerie('P-03', [
      punto('2026-01-01', 40),
      punto('2026-05-01', 44, 'kg', { dinamometro: 'camry-digital', mano: 'ambas' }),
      punto('2026-08-15', 46),
    ]);
    expect(s.tramos).toHaveLength(3);
    expect(s.rupturas).toHaveLength(2);
  });

  it('es determinista', () => {
    const m = [punto('2026-05-01', 42), punto('2026-08-15', 46)];
    expect(JSON.stringify(construirSerie('P-03', m))).toBe(
      JSON.stringify(construirSerie('P-03', m)),
    );
  });
});

// ════════════════════════════════════════════════════════════════════════════
// PROGRESO
// ════════════════════════════════════════════════════════════════════════════

describe('progreso hacia el objetivo', () => {
  const base: EntradaProgreso = {
    direccion: 'mayor_mejor',
    tipo: 'aumentar',
    valorInicial: 100,
    valorObjetivo: 140,
    rango: null,
    valorActual: 120,
    unidadObjetivo: 'kg',
    unidadMedicion: 'kg',
  };

  it('mayor_mejor · la mitad del recorrido', () => {
    const r = calcularProgreso(base);
    expect(r.calculable).toBe(true);
    if (!r.calculable || r.clase !== 'recorrido') throw new Error('no es un recorrido');
    expect(r.proporcion).toBeCloseTo(0.5, 10);
    expect(r.superado).toBe(false);
  });

  it('menor_mejor · la mitad, y NO sale invertido', () => {
    // Un esprint de 15 s con objetivo 12 s: 13,5 s es la mitad del camino.
    const r = calcularProgreso({
      ...base,
      direccion: 'menor_mejor',
      tipo: 'reducir',
      valorInicial: 15,
      valorObjetivo: 12,
      valorActual: 13.5,
      unidadObjetivo: 's',
      unidadMedicion: 's',
    });
    if (!r.calculable || r.clase !== 'recorrido') throw new Error('no es un recorrido');
    expect(r.proporcion).toBeCloseTo(0.5, 10);
    // La comprobación que justifica todo el sprint: con la fórmula de aumento
    // esto habría dado −0,5.
    expect(r.proporcion).toBeGreaterThan(0);
  });

  it('superar el objetivo se declara, no se pierde en el tope', () => {
    const r = calcularProgreso({ ...base, valorActual: 150 });
    if (!r.calculable || r.clase !== 'recorrido') throw new Error('no es un recorrido');
    expect(r.proporcion).toBe(1);
    expect(r.superado).toBe(true);
  });

  it('retroceder se acota a cero, sin porcentaje negativo', () => {
    const r = calcularProgreso({ ...base, valorActual: 80 });
    if (!r.calculable || r.clase !== 'recorrido') throw new Error('no es un recorrido');
    expect(r.proporcion).toBe(0);
    expect(r.superado).toBe(false);
  });
});

describe('el progreso se niega a calcularse cuando no puede', () => {
  const base: EntradaProgreso = {
    direccion: 'mayor_mejor',
    tipo: 'aumentar',
    valorInicial: 100,
    valorObjetivo: 140,
    rango: null,
    valorActual: 120,
    unidadObjetivo: 'kg',
    unidadMedicion: 'kg',
  };

  const motivo = (e: Partial<EntradaProgreso>) => {
    const r = calcularProgreso({ ...base, ...e });
    if (r.calculable) throw new Error('esperaba que no fuera calculable');
    return r.motivo;
  };

  it('sin medición actual', () => {
    expect(motivo({ valorActual: null })).toBe('SIN_MEDICION_ACTUAL');
  });

  it('sin punto de partida', () => {
    expect(motivo({ valorInicial: null })).toBe('SIN_PUNTO_DE_PARTIDA');
  });

  it('sin dirección declarada en el catálogo', () => {
    expect(motivo({ direccion: null })).toBe('SIN_DIRECCION_DECLARADA');
  });

  it('con recorrido nulo', () => {
    expect(motivo({ valorObjetivo: 100 })).toBe('RECORRIDO_NULO');
  });

  it('con unidades distintas', () => {
    expect(motivo({ unidadMedicion: 'lbf' })).toBe('UNIDADES_INCOMPATIBLES');
  });

  it('cuando el objetivo contradice la dirección de la prueba', () => {
    // «Aumentar» el tiempo de un esprint: quien lo fijó quiso decir otra cosa,
    // y adivinar cuál no es trabajo de este módulo.
    expect(motivo({ direccion: 'menor_mejor', tipo: 'aumentar' })).toBe(
      'DIRECCION_CONTRADICE_OBJETIVO',
    );
    expect(motivo({ direccion: 'mayor_mejor', tipo: 'reducir' })).toBe(
      'DIRECCION_CONTRADICE_OBJETIVO',
    );
  });

  it('«alcanzar» no contradice ninguna dirección: la del catálogo manda', () => {
    const r = calcularProgreso({ ...base, tipo: 'alcanzar' });
    expect(r.calculable).toBe(true);
  });

  it('cada motivo trae su explicación, y ninguna culpa a nadie', () => {
    const JUICIO = /\b(error|fallo|inv[áa]lido|mal)\b/i;
    for (const e of [
      { valorActual: null },
      { valorInicial: null },
      { direccion: null },
      { valorObjetivo: 100 },
      { unidadMedicion: 'lbf' },
      { direccion: 'menor_mejor' as const, tipo: 'aumentar' as const },
    ]) {
      const r = calcularProgreso({ ...base, ...e });
      if (r.calculable) throw new Error('esperaba no calculable');
      expect(r.detalle.length).toBeGreaterThan(30);
      expect(r.detalle).not.toMatch(JUICIO);
    }
  });

  it('es determinista', () => {
    expect(JSON.stringify(calcularProgreso(base))).toBe(JSON.stringify(calcularProgreso(base)));
  });
});

// ════════════════════════════════════════════════════════════════════════════
// FRONTERA
// ════════════════════════════════════════════════════════════════════════════

describe('la capa no cruza sus fronteras', () => {
  it.each(['serie.ts', 'progreso.ts', 'index.ts'])('%s no importa NIE, NKB ni React', async (f) => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    const src = readFileSync(join(process.cwd(), 'src/lib/pas/seguimiento', f), 'utf-8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
    for (const [nombre, patron] of [
      ['NIE', /@\/lib\/nie/],
      ['NKB', /normative-knowledge-base|cargarNormas/],
      ['React', /from ['"]react/],
      ['Supabase', /supabase/i],
    ] as const) {
      expect(src, `${f}: ${nombre}`).not.toMatch(patron);
    }
  });

  it('no hay efectos ni azar', async () => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    for (const f of ['serie.ts', 'progreso.ts']) {
      const src = readFileSync(join(process.cwd(), 'src/lib/pas/seguimiento', f), 'utf-8');
      for (const p of [/new Date\(/, /Date\.now/, /Math\.random/, /\bfetch\(/]) {
        expect(src, f).not.toMatch(p);
      }
    }
  });

  it('control positivo: la comprobación detecta una infracción', () => {
    expect('const hoy = new Date();').toMatch(/new Date\(/);
  });
});
