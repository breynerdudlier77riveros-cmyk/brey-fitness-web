// ── Cobertura científica del catálogo (Sprint PAS-11) ──────────────────────
//
// LO QUE ESTOS TESTS PROTEGEN:
//
//   Que la referencia canadiense recién incorporada haga exactamente lo que
//   debe —situar a quien pertenece a esa población y NEGARSE con quien no— y
//   que ninguna de las dos respuestas se degrade a «no hay evidencia».
//
// La decisión científica que blindan: **el país es una coordenada de identidad**,
// igual que en las fichas de dinamometría de la NKB. Una norma nacional
// canadiense no describe a un atleta colombiano, y aplicarla «porque es lo que
// hay» sería inventar una equivalencia poblacional que nadie ha publicado.

import { describe, expect, it } from 'vitest';

import { PRUEBAS } from '@/features/performance-workspace/schemas/catalogo';

import { leerEvidencia, type SujetoEvidencia } from '../compatibilidad';
import { redactar } from '../redaccion';
import { FUENTES, REFERENCIAS } from '../registro';

const COLOMBIANO: SujetoEvidencia = { edad: 22, sexo: 'M', pais: 'CO', pesoKg: null };
const CANADIENSE: SujetoEvidencia = { edad: 22, sexo: 'M', pais: 'CA', pesoKg: null };
const CANADIENSE_F: SujetoEvidencia = { edad: 22, sexo: 'F', pais: 'CA', pesoKg: null };

const SALTO = { pruebaId: 'P-04', valor: 44, unidad: 'cm', condiciones: { brazos: 'libres' } };
const FLEX = { pruebaId: 'P-06', valor: 26, unidad: 'cm', condiciones: { version: 'clasico' } };

// ════════════════════════════════════════════════════════════════════════════
// LA REFERENCIA NUEVA SITÚA A QUIEN LE CORRESPONDE
// ════════════════════════════════════════════════════════════════════════════

describe('la norma poblacional canadiense sitúa a un adulto canadiense', () => {
  it('el salto cae entre dos percentiles publicados', () => {
    const l = leerEvidencia(SALTO, CANADIENSE);
    expect(l.estado).toBe('EVIDENCIA_COMPATIBLE');
    const p = l.compatibles[0].posicion!;
    // 44 cm queda entre P30 (44,3 no: 44 < 44,3) → entre P20 (41,2) y P30 (44,3).
    expect(p.clase).toBe('entre_percentiles');
    if (p.clase !== 'entre_percentiles') throw new Error('clase inesperada');
    expect(p.inferior).toBe(20);
    expect(p.superior).toBe(30);
  });

  it('y la frase lo dice sin clasificar', () => {
    const f = redactar(leerEvidencia(SALTO, CANADIENSE));
    expect(f.texto).toMatch(/entre el percentil 20 y el 30/);
    expect(f.texto).not.toMatch(/(?<![-\w])(bueno|malo|alto|bajo|normal)(?![-\w])/i);
  });

  it('el sit-and-reach también, y con la banda de edad correcta', () => {
    const l = leerEvidencia(FLEX, CANADIENSE);
    expect(l.estado).toBe('EVIDENCIA_COMPATIBLE');
    expect(l.compatibles[0].referencia.ambito.edadMin).toBe(20);
    expect(l.compatibles[0].referencia.ambito.edadMax).toBe(24);
  });

  it('la referencia de mujeres NO se aplica a un varón, y viceversa', () => {
    expect(
      leerEvidencia(SALTO, CANADIENSE).compatibles.every((c) => c.referencia.ambito.sexo === 'M'),
    ).toBe(true);
    expect(
      leerEvidencia(SALTO, CANADIENSE_F).compatibles.every((c) => c.referencia.ambito.sexo === 'F'),
    ).toBe(true);
  });

  it('una mujer de 22 se sitúa en su propia tabla', () => {
    const l = leerEvidencia({ ...SALTO, valor: 32 }, CANADIENSE_F);
    expect(l.estado).toBe('EVIDENCIA_COMPATIBLE');
    // 32 cm queda entre P50 (31,8) y P60 (33,3) de la tabla femenina.
    const p = l.compatibles[0].posicion!;
    if (p.clase !== 'entre_percentiles') throw new Error('clase inesperada');
    expect(p.inferior).toBe(50);
  });

  it('nunca se estima un percentil que la fuente no publica', () => {
    // La tabla salta de P30 a P40: entre medias no hay P35.
    const l = leerEvidencia({ ...SALTO, valor: 46 }, CANADIENSE);
    const p = l.compatibles[0].posicion!;
    if (p.clase !== 'entre_percentiles') throw new Error('clase inesperada');
    expect([p.inferior, p.superior]).toEqual([30, 40]);
    expect(JSON.stringify(p)).not.toContain('35');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// Y SE NIEGA CON QUIEN NO LE CORRESPONDE
// ════════════════════════════════════════════════════════════════════════════

describe('el país es una coordenada de identidad, no un adorno', () => {
  it('un atleta colombiano NO se compara con la norma canadiense', () => {
    const l = leerEvidencia(SALTO, COLOMBIANO);
    // Lo que importa es que NO se le sitúe. El estado global es
    // EVIDENCIA_PARCIAL porque la fiabilidad de la prueba sí le aplica, y
    // decir eso informa más que limitarse a «no compatible».
    expect(l.compatibles).toEqual([]);
    expect(l.estado).not.toBe('EVIDENCIA_COMPATIBLE');
    expect(l.descartadas.length).toBeGreaterThan(0);
  });

  it('pero el motivo nombra el país, en vez de callar', () => {
    const l = leerEvidencia(SALTO, COLOMBIANO);
    const d = l.descartadas.find((x) => x.motivo.includes('CA'));
    expect(d).toBeDefined();
    expect(d!.motivo).toMatch(/población de CA/);
  });

  it('y la frase NO dice que no exista evidencia', () => {
    const f = redactar(leerEvidencia(SALTO, COLOMBIANO));
    expect(f.texto).toMatch(/tiene evidencia publicada/);
    expect(f.texto).not.toMatch(/No se ha localizado evidencia/);
  });

  it('la norma descartada sigue constando, para que el profesional la vea', () => {
    // Descartarla no es borrarla: existe, está verificada, y algún día el
    // producto puede decidir que una norma internacional es admisible.
    const l = leerEvidencia(SALTO, COLOMBIANO);
    expect(l.descartadas.some((d) => d.referencia.fuenteId === 'hoffmann_chms_2019')).toBe(true);
  });

  it('la edad fuera de banda también descarta, con su motivo', () => {
    // Solo están transcritas las bandas 20-24 y 25-29: un adulto de 45 queda
    // fuera y NO se le extrapola, aunque la fuente publique hasta los 69.
    const mayor: SujetoEvidencia = { edad: 45, sexo: 'M', pais: 'CA', pesoKg: null };
    const l = leerEvidencia(SALTO, mayor);
    expect(l.compatibles).toEqual([]);
    expect(l.descartadas.some((d) => /rango de edad/.test(d.motivo))).toBe(true);
  });

  it('el protocolo distinto descarta: brazos en la cadera no es la prueba publicada', () => {
    const l = leerEvidencia(
      { ...SALTO, condiciones: { brazos: 'en_cadera' } },
      CANADIENSE,
    );
    expect(l.compatibles).toEqual([]);
    expect(l.descartadas.some((d) => d.motivo.includes('protocolos distintos'))).toBe(true);
  });

  it('sin declarar el protocolo no se compara a ciegas', () => {
    const l = leerEvidencia({ ...SALTO, condiciones: {} }, CANADIENSE);
    expect(l.estado).toBe('NO_COMPARABLE');
    expect(l.compatibles).toEqual([]);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// TRAZABILIDAD DE LA FUENTE (§10)
// ════════════════════════════════════════════════════════════════════════════

describe('la fuente nueva es rastreable', () => {
  const chms = FUENTES.find((f) => f.id === 'hoffmann_chms_2019')!;

  it('está registrada y verificada', () => {
    expect(chms).toBeDefined();
    expect(chms.estado).toBe('propuesta');
    expect(chms.cita!.localizador).toMatch(/doi:|PMID/);
  });

  it('declara su población con el tamaño muestral', () => {
    expect(chms.poblacion).toMatch(/5188/);
    expect(chms.poblacion).toMatch(/Canadian Health Measures Survey/);
  });

  it('declara qué NO sostiene, incluida la advertencia de los autores', () => {
    expect(chms.noSostiene).toMatch(/fuera de Canadá/);
    expect(chms.noSostiene).toMatch(/no equivale a un punto de corte/);
  });

  it('cada referencia suya transporta la calibración o el protocolo', () => {
    const suyas = REFERENCIAS.filter((r) => r.fuenteId === 'hoffmann_chms_2019');
    expect(suyas.length).toBeGreaterThanOrEqual(8);
    for (const r of suyas) {
      expect(r.limitaciones.join(' '), r.id).toMatch(/CANADÁ/);
      expect(Object.keys(r.ambito.protocolo).length, r.id).toBeGreaterThan(0);
    }
  });

  it('la calibración del cero viaja con el sit-and-reach', () => {
    // Hallazgo de este sprint: un alcance de 24 cm es casi tocar los dedos en
    // un cajón calibrado a 26 y un estiramiento enorme en uno calibrado a 0.
    const sr = REFERENCIAS.find((r) => r.id === 'P-06/chms/m-20-24')!;
    expect(sr.limitaciones.join(' ')).toMatch(/tocar los dedos equivale a 26 cm/);
  });

  it('declara que solo se transcribieron las bandas adultas', () => {
    const suyas = REFERENCIAS.filter((r) => r.fuenteId === 'hoffmann_chms_2019');
    for (const r of suyas) {
      expect(r.limitaciones.join(' '), r.id).toMatch(/Solo se han transcrito/);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// ESTADO DE COBERTURA DE LAS ONCE (§13)
// ════════════════════════════════════════════════════════════════════════════

describe('las once pruebas tienen una respuesta explícita', () => {
  it('ninguna lanza y ninguna queda sin estado', () => {
    for (const p of PRUEBAS) {
      for (const sujeto of [COLOMBIANO, CANADIENSE]) {
        const l = leerEvidencia(
          { pruebaId: p.id, valor: 10, unidad: p.unidad ?? '—', condiciones: {} },
          sujeto,
        );
        expect(l.estado, `${p.id}/${sujeto.pais}`).toBeTruthy();
        expect(redactar(l).texto.length, p.id).toBeGreaterThan(30);
      }
    }
  });

  it('«sin evidencia utilizable» es excepcional, no la respuesta por defecto', () => {
    const estados = PRUEBAS.map(
      (p) =>
        leerEvidencia(
          { pruebaId: p.id, valor: 10, unidad: p.unidad ?? '—', condiciones: {} },
          CANADIENSE,
        ).estado,
    );
    const sinEvidencia = estados.filter((e) => e === 'SIN_EVIDENCIA_UTILIZABLE').length;
    // Con once pruebas, la mayoría debe tener algo que decir.
    expect(sinEvidencia).toBeLessThan(PRUEBAS.length / 2);
  });

  it('el registro no contiene ninguna fuente sin verificar activa', () => {
    const sinVerificar = new Set(
      FUENTES.filter((f) => f.estado === 'sin_verificar').map((f) => f.id),
    );
    // Pueden estar registradas —para poder decir «existe literatura»— pero
    // ninguna puede tener una referencia normativa colgando.
    for (const r of REFERENCIAS) {
      if (sinVerificar.has(r.fuenteId)) {
        expect(r.tipo, r.id).not.toBe('NORMATIVA');
      }
    }
  });
});
