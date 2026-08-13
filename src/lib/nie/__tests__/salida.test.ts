// ── NIE-1.8 + NIE-1.9 · resolución final y contrato de salida ──────────────

import { describe, expect, it } from 'vitest';

import { interpretarNormativamente } from '@/lib/nie/comparacion-normativa';
import { cargarNormas } from '@/lib/nie/nkb/cargador';
import { contextoVacio, resolver } from '@/lib/nie/resolucion';
import { construirSalida, type SalidaNIE } from '@/lib/nie/salida';
import type { Candidata, ContextoEvaluacion, Unidad } from '@/lib/nie/tipos';
import { crearValorObservado, type ValorObservado } from '@/lib/nie/valor-observado';

const NORMAS = cargarNormas();

const ctx = (p: Partial<ContextoEvaluacion>): ContextoEvaluacion => ({ ...contextoVacio(), ...p });

const obs = (valor: number, contexto: ContextoEvaluacion, unidad: Unidad = 'kg'): ValorObservado =>
  crearValorObservado({
    valor,
    unidad,
    contexto: { ...contexto, unidad },
    procedencia: { origen: 'test', fecha: null, registroId: null },
  });

/** El camino completo, tal como lo recorrería la aplicación. */
function salida(
  c: ContextoEvaluacion,
  valor: number,
  unidad: Unidad = 'kg',
  opciones = {},
): SalidaNIE {
  const r = resolver(c, NORMAS);
  const i = interpretarNormativamente(obs(valor, c, unidad), r.candidatas, opciones);
  return construirSalida(r, i);
}

// ─── Contextos reales, verificados contra la NKB ────────────────────────────

const UNI = {
  variable: 'fuerza_prension_manual',
  pais: 'CO',
  instrumento: 'takei-t18-tkk-smedley-iii',
  unidad: 'kg',
  definicionOperacional: 'media_ambas_manos',
  posicion: 'bipedestacion',
  lado: 'ambas',
} as const;

const CUCUTA = {
  variable: 'fuerza_prension_manual',
  pais: 'CO',
  instrumento: 'camry-digital',
  unidad: 'kg',
  definicionOperacional: 'mejor_mano_dominante',
  posicion: 'bipedestacion',
  lado: 'dominante',
} as const;

const ENSIN = {
  variable: 'fuerza_prension_manual',
  pais: 'CO',
  instrumento: 'takei-tkk-5101',
  unidad: 'kg',
  definicionOperacional: 'media_ambas_manos',
  posicion: 'bipedestacion',
  lado: 'ambas',
} as const;

const BRASIL = {
  variable: 'fuerza_prension_manual',
  pais: 'BR',
  instrumento: 'jamar-j00105',
  unidad: 'kgf',
  definicionOperacional: 'media_2a_y_3a_mano_dominante',
  posicion: 'sedestacion',
  lado: 'dominante',
} as const;

const C20 = ctx({ ...UNI, edad: 20, sexo: 'M' });
const C45 = ctx({ ...CUCUTA, edad: 45, sexo: 'M' });
const C75 = ctx({ ...UNI, edad: 75, sexo: 'M' });
const C15 = ctx({ ...ENSIN, edad: 15, sexo: 'M' });
const CBR = ctx({ ...BRASIL, edad: 70, sexo: 'M', estaturaM: 1.75 });

// ════════════════════════════════════════════════════════════════════════════
// 1 · LOS VEINTE CASOS OBLIGATORIOS
// ════════════════════════════════════════════════════════════════════════════

describe('casos obligatorios', () => {
  it('1 · colombiano 20 años: TN-1 y TN-2, las dos', () => {
    const s = salida(C20, 37.5);
    expect(s.particion.comparables).toHaveLength(2);
    expect(s.particion.comparables.map((r) => r.norma.tipo).sort()).toEqual(['TN-1', 'TN-2']);
  });

  it('2 · colombiano 45 años: Cúcuta, con su reserva de calidad', () => {
    const s = salida(C45, 40);
    expect(s.particion.comparables.map((r) => r.norma.id)).toEqual(['HGS-CO-CUC-D-M-40']);
    expect(s.particion.comparables[0].norma.calidad).toBe('baja');
    expect(s.estadoResolucion).toBe('APLICABLE_CON_RESERVAS');
  });

  it('3 · colombiano 75 años: no hay norma, y se dice como tal', () => {
    const s = salida(C75, 30);
    expect(s.estadoResolucion).toBe('SIN_NORMA_ADMISIBLE');
    expect(s.estadoInterpretacion).toBe('SIN_NORMA_APLICABLE');
    expect(s.particion.comparables).toHaveLength(0);
    // Y aun así las 356 candidatas siguen ahí, cada una con su motivo.
    expect(s.candidatasEvaluadas).toBe(356);
    expect(s.particion.noComparables).toHaveLength(356);
  });

  it('4 · TKK 5101 frente a T-18: EQ-3, no una coincidencia de marca', () => {
    const s = salida(ctx({ ...UNI, instrumento: 'takei-tkk-5101', edad: 20, sexo: 'M' }), 37.5);
    const uni = s.resultados.filter((r) => r.norma.fichaId.startsWith('HGS-CO-UNI'));
    expect(uni.every((r) => r.comparacion.estado === 'NO_COMPARABLE_EQ3')).toBe(true);
  });

  it('5 · kg frente a kgf: no se convierte, y el motivo lo dice', () => {
    const s = salida(ctx({ ...BRASIL, unidad: 'kg', edad: 70, sexo: 'M', estaturaM: 1.75 }), 30, 'kg');
    expect(s.particion.comparables).toHaveLength(0);
    expect(s.conversiones.every((c) => c.factorAplicado === null)).toBe(true);
  });

  it('6 · kgf y lbf con conversión solicitada: se aplica y queda registrada', () => {
    const s = salida(CBR, 66, 'lbf', { convertirUnidad: true });
    const c = s.conversiones.find((x) => x.normaId === 'HGS-BR-M170-70')!;
    expect(c.estado).toBe('CONVERSION_AUTORIZADA');
    expect(c.valorOriginal).toBe(66);
    expect(c.unidadOriginal).toBe('lbf');
    expect(c.unidadDestino).toBe('kgf');
    expect(c.factorAplicado).toBeCloseTo(0.45359237, 10);
    expect(c.valorConvertido).toBeCloseTo(29.937, 3);
    expect(c.representacion).toBe(30);
  });

  it('7 · kgf y lbf sin solicitarla: se detiene, y no es un fallo', () => {
    const s = salida(CBR, 66, 'lbf');
    const c = s.conversiones.find((x) => x.normaId === 'HGS-BR-M170-70')!;
    expect(c.estado).toBe('CONVERSION_DISPONIBLE_NO_SOLICITADA');
    expect(c.valorConvertido).toBeNull();
    expect(c.factorAplicado).toBeNull();
    expect(s.distinciones.conversionDisponibleNoSolicitada).toContain('HGS-BR-M170-70');
  });

  it('8 · sexo incompatible: la norma queda, marcada como no aplicable', () => {
    const s = salida(ctx({ ...UNI, edad: 20, sexo: 'F' }), 37.5);
    const varones = s.resultados.find((r) => r.norma.id === 'HGS-CO-UNI-M-20')!;
    expect(varones.comparacion.estado).toBe('NO_COMPARABLE');
    expect(varones.comparacion.motivo).toContain('sexo');
    expect(s.distinciones.noAplicables).toContain('HGS-CO-UNI-M-20');
  });

  it('9 · instrumento ausente: NO_DETERMINABLE, que no es NO_APLICABLE', () => {
    const sinInstr = ctx({
      variable: 'fuerza_prension_manual',
      pais: 'CO',
      unidad: 'kg',
      posicion: 'bipedestacion',
      definicionOperacional: 'media_ambas_manos',
      lado: 'ambas',
      edad: 20,
      sexo: 'M',
    });
    const s = salida(sinInstr, 37.5);
    expect(s.estadoResolucion).toBe('NO_DETERMINABLE');
    expect(s.distinciones.indeterminadas).toContain('HGS-CO-UNI-M-20');
    expect(s.distinciones.noAplicables).not.toContain('HGS-CO-UNI-M-20');
  });

  it('10 · ENSIN ES-2: comparación válida, objeción intacta', () => {
    const s = salida(C15, 30.7);
    expect(s.particion.comparables.map((r) => r.norma.id)).toEqual(['HGS-CO-M-15']);
    expect(s.evidencia.cuestionadas).toContain('HGS-CO-M-15');
    expect(s.distinciones.cuestionadas).toContain('HGS-CO-M-15');
    expect(s.conflictos.map((c) => c.normaId)).toContain('HGS-CO-M-15');
    expect(s.conflictos.find((c) => c.normaId === 'HGS-CO-M-15')!.conflicto).toBe(
      'CONFLICTO_NO_DETERMINABLE',
    );
    // Ni oculta, ni resuelta, ni degradada a no aplicable.
    expect(s.estadoResolucion).toBe('CONFLICTO_NO_DETERMINABLE');
    expect(s.distinciones.noAplicables).not.toContain('HGS-CO-M-15');
  });

  it('11 · dos normas aplicables: salen las dos, en el orden de la NKB', () => {
    const s = salida(C20, 37.5);
    const enNkb = NORMAS.filter((n) => s.distinciones.interpretables.includes(n.id)).map((n) => n.id);
    expect(s.distinciones.interpretables).toEqual(enNkb);
  });

  it('12 · dos normas con estados divergentes: no se resuelve', () => {
    const s = salida(C20, 37.5);
    expect(s.estadoInterpretacion).toBe('ESTADOS_DIVERGENTES');
    expect(s.divergencia).not.toBeNull();
    expect(s.divergencia!.estados).toHaveLength(2);
    // El reparto completo, no un ganador.
    const total = s.divergencia!.porEstado.flatMap((p) => p.normas);
    expect(total.sort()).toEqual([...s.distinciones.interpretables].sort());
  });

  it('13 · calidad Moderada junto a Baja: la calidad no selecciona', () => {
    // La NKB no permite construir este caso con datos reales —la única ficha de
    // calidad Baja usa Camry, en EQ-3 con todo lo demás—, así que se degrada la
    // calidad de una candidata real como fixture. No se toca la NKB.
    const r = resolver(C20, NORMAS);
    const degradadas: Candidata[] = r.candidatas.map((c) =>
      c.normaId === 'HGS-CO-UNI-M-20' ? { ...c, calidad: 'baja' as const } : c,
    );
    const s = construirSalida(
      { ...r, candidatas: degradadas },
      interpretarNormativamente(obs(37.5, C20), degradadas),
    );
    expect(s.particion.comparables).toHaveLength(2);
    expect(s.particion.comparables.map((x) => x.norma.calidad).sort()).toEqual([
      'baja',
      'moderada',
    ]);
    // Mismo conjunto y mismo orden que sin degradar.
    expect(s.distinciones.interpretables).toEqual(salida(C20, 37.5).distinciones.interpretables);
  });

  it('14 · TN-1 y TN-2 simultáneas: separadas, con su operación propia', () => {
    const s = salida(C20, 37.5);
    const tn1 = s.particion.comparables.find((r) => r.norma.tipo === 'TN-1')!;
    const tn2 = s.particion.comparables.find((r) => r.norma.tipo === 'TN-2')!;
    expect(tn1.comparacion.resultado!.tipo).toMatch(/percentil/);
    expect(tn2.comparacion.resultado!.tipo).toBe('puntuacion_z');
    // Y la z no se ha convertido en percentil por el camino.
    expect(JSON.stringify(tn2.comparacion.resultado)).not.toMatch(/percentil/);
  });

  it('15 · valor fuera del rango publicado: se dice, no se extrapola', () => {
    const bajo = salida(C20, 5).particion.comparables.find((r) => r.norma.tipo === 'TN-1')!;
    const alto = salida(C20, 300).particion.comparables.find((r) => r.norma.tipo === 'TN-1')!;
    expect(bajo.comparacion.estado).toBe('POR_DEBAJO_DEL_MENOR_PUBLICADO');
    expect(alto.comparacion.estado).toBe('POR_ENCIMA_DEL_MAYOR_PUBLICADO');
  });

  it('16 · valor exactamente en un percentil publicado', () => {
    const s = salida(C20, 37.5);
    const tn1 = s.particion.comparables.find((r) => r.norma.tipo === 'TN-1')!;
    const en = NORMAS.find((n) => n.id === 'HGS-CO-UNI-M-20')!;
    if (en.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    const p50 = en.valores.percentiles.find((p) => p.percentil === 50)!;
    const exacto = salida(C20, p50.valor).particion.comparables.find((r) => r.norma.tipo === 'TN-1')!;
    expect(exacto.comparacion.estado).toBe('COINCIDE_CON_PERCENTIL');
    expect(tn1.comparacion.estado).toBeDefined();
  });

  it('17 · valor entre dos percentiles: devuelve el par, sin interpolar', () => {
    const en = NORMAS.find((n) => n.id === 'HGS-CO-UNI-M-20')!;
    if (en.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    const p25 = en.valores.percentiles.find((p) => p.percentil === 25)!.valor;
    const p50 = en.valores.percentiles.find((p) => p.percentil === 50)!.valor;
    const medio = (p25 + p50) / 2;
    const r = salida(C20, medio).particion.comparables.find((x) => x.norma.tipo === 'TN-1')!;
    expect(r.comparacion.estado).toBe('ENTRE_PERCENTILES_PUBLICADOS');
    if (r.comparacion.resultado?.tipo !== 'entre_percentiles') throw new Error('tipo inesperado');
    expect(r.comparacion.resultado.inferior!.percentil).toBe(25);
    expect(r.comparacion.resultado.superior!.percentil).toBe(50);
  });

  it('18 · unidad convertible: el original nunca se pierde', () => {
    const s = salida(CBR, 66, 'lbf', { convertirUnidad: true });
    for (const c of s.conversiones) {
      expect(c.valorOriginal).toBe(66);
      expect(c.unidadOriginal).toBe('lbf');
    }
  });

  it('19 · unidad no convertible: par declarado y prohibido', () => {
    const s = salida(ctx({ ...UNI, edad: 20, sexo: 'M' }), 37.5, 'kgf');
    const c = s.conversiones.find((x) => x.normaId === 'HGS-CO-UNI-M-20')!;
    expect(c.estado).toBe('CONVERSION_NO_AUTORIZADA');
    expect(c.factorAplicado).toBeNull();
  });

  it('20 · ausencia completa de norma: distinta de «no aplicable»', () => {
    const s = salida(ctx({ variable: 'salto_vertical' as never, edad: 20, sexo: 'M' }), 40);
    expect(s.candidatasEvaluadas).toBe(0);
    expect(s.distinciones.sinNormaEnLaBase).toBe(true);
    expect(s.distinciones.noAplicables).toHaveLength(0);
    expect(s.estadoResolucion).toBe('SIN_NORMA_ADMISIBLE');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 2 · EL CONTRATO DE SALIDA · las siete distinciones (NIE-1.9)
// ════════════════════════════════════════════════════════════════════════════

describe('contrato de salida · A a G se distinguen entre sí', () => {
  it('A · no existe norma', () => {
    const s = salida(ctx({ variable: 'salto_vertical' as never, edad: 20 }), 40);
    expect(s.distinciones.sinNormaEnLaBase).toBe(true);
  });

  it('B · existe norma, pero no es aplicable', () => {
    const s = salida(ctx({ ...UNI, edad: 20, sexo: 'F' }), 37.5);
    expect(s.distinciones.sinNormaEnLaBase).toBe(false);
    expect(s.distinciones.noAplicables.length).toBeGreaterThan(0);
  });

  it('C · existe norma, pero falta información', () => {
    const s = salida(
      ctx({
        variable: 'fuerza_prension_manual',
        pais: 'CO',
        unidad: 'kg',
        posicion: 'bipedestacion',
        definicionOperacional: 'media_ambas_manos',
        lado: 'ambas',
        edad: 20,
        sexo: 'M',
      }),
      37.5,
    );
    expect(s.distinciones.indeterminadas.length).toBeGreaterThan(0);
    // Y no se ha confundido con B.
    for (const id of s.distinciones.indeterminadas) {
      expect(s.distinciones.noAplicables).not.toContain(id);
    }
  });

  it('D · existe norma y puede interpretarse', () => {
    expect(salida(C45, 40).distinciones.interpretables).toEqual(['HGS-CO-CUC-D-M-40']);
  });

  it('E · existe norma utilizable, y está cuestionada', () => {
    const s = salida(C15, 30.7);
    expect(s.distinciones.cuestionadas).toEqual(['HGS-CO-M-15']);
    // E no excluye D: es lo que hace imposible un enum único.
    expect(s.distinciones.interpretables).toContain('HGS-CO-M-15');
  });

  it('F · varias normas con resultados divergentes', () => {
    expect(salida(C20, 37.5).distinciones.divergentes).toBe(true);
    expect(salida(C45, 40).distinciones.divergentes).toBe(false);
  });

  it('G · la unidad puede convertirse y no se pidió', () => {
    expect(salida(CBR, 66, 'lbf').distinciones.conversionDisponibleNoSolicitada).toContain(
      'HGS-BR-M170-70',
    );
    expect(
      salida(CBR, 66, 'lbf', { convertirUnidad: true }).distinciones
        .conversionDisponibleNoSolicitada,
    ).toHaveLength(0);
  });

  it('las siete no se colapsan: D y E coexisten en el mismo caso', () => {
    const d = salida(C15, 30.7).distinciones;
    expect(d.interpretables).toContain('HGS-CO-M-15');
    expect(d.cuestionadas).toContain('HGS-CO-M-15');
  });

  it('«no aplicable» y «sin norma» no comparten representación', () => {
    const sinNorma = salida(ctx({ variable: 'salto_vertical' as never, edad: 20 }), 40);
    const noAplica = salida(ctx({ ...UNI, edad: 20, sexo: 'F' }), 37.5);
    expect(sinNorma.distinciones.sinNormaEnLaBase).not.toBe(
      noAplica.distinciones.sinNormaEnLaBase,
    );
    expect(sinNorma.candidatasEvaluadas).not.toBe(noAplica.candidatasEvaluadas);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 3 · LA PARTICIÓN NO PIERDE A NADIE
// ════════════════════════════════════════════════════════════════════════════

describe('estructura · toda vista es una partición', () => {
  const CASOS: readonly [string, ContextoEvaluacion, number, Unidad][] = [
    ['20 años', C20, 37.5, 'kg'],
    ['45 Cúcuta', C45, 40, 'kg'],
    ['75 años', C75, 30, 'kg'],
    ['ENSIN', C15, 30.7, 'kg'],
    ['Brasil lbf', CBR, 66, 'lbf'],
  ];

  it.each(CASOS)('%s · comparables + no comparables reconstruye el total', (_n, c, v, u) => {
    const s = salida(c, v, u);
    expect(s.particion.comparables.length + s.particion.noComparables.length).toBe(
      s.candidatasEvaluadas,
    );
    // Y no solo el recuento: las mismas entradas, en el mismo orden.
    const union = s.resultados.filter(
      (r) => s.particion.comparables.includes(r) || s.particion.noComparables.includes(r),
    );
    expect(union).toEqual(s.resultados);
  });

  it.each(CASOS)('%s · cada resultado está en exactamente una parte', (_n, c, v, u) => {
    const s = salida(c, v, u);
    for (const r of s.resultados) {
      const en = [s.particion.comparables, s.particion.noComparables].filter((p) =>
        p.includes(r),
      );
      expect(en).toHaveLength(1);
    }
  });

  it.each(CASOS)('%s · la trazabilidad acompaña a cada resultado', (_n, c, v, u) => {
    const s = salida(c, v, u);
    expect(s.trazabilidad).toHaveLength(s.resultados.length);
    for (const [i, r] of s.resultados.entries()) {
      expect(s.trazabilidad[i].normaId).toBe(r.norma.id);
      expect(s.trazabilidad[i].referencia).not.toBe('');
    }
  });

  it('el orden de los resultados es el de la NKB, sin excepción', () => {
    const s = salida(C20, 37.5);
    expect(s.resultados.map((r) => r.norma.id)).toEqual(NORMAS.map((n) => n.id));
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 4 · PROPIEDADES P1 – P10
// ════════════════════════════════════════════════════════════════════════════

describe('propiedades', () => {
  const base = resolver(C20, NORMAS);
  const idsDe = (s: SalidaNIE) => s.distinciones.interpretables;

  it('P1 · agregar una candidata no elimina otra', () => {
    const antes = idsDe(salida(C20, 37.5));
    const extra: Candidata = { ...base.candidatas[0], normaId: 'FIXTURE-EXTRA' };
    const conExtra = [...base.candidatas, extra];
    const s = construirSalida(
      { ...base, candidatas: conExtra },
      interpretarNormativamente(obs(37.5, C20), conExtra),
    );
    for (const id of antes) expect(idsDe(s)).toContain(id);
    expect(s.candidatasEvaluadas).toBe(base.candidatas.length + 1);
  });

  it('P2 · cambiar el orden de las candidatas no cambia el conjunto', () => {
    const invertidas = [...base.candidatas].reverse();
    const s = construirSalida(
      { ...base, candidatas: invertidas },
      interpretarNormativamente(obs(37.5, C20), invertidas),
    );
    expect([...idsDe(s)].sort()).toEqual([...idsDe(salida(C20, 37.5))].sort());
    expect(s.estadoInterpretacion).toBe(salida(C20, 37.5).estadoInterpretacion);
  });

  it('P3 · cambiar la calidad no cambia la selección', () => {
    for (const calidad of ['baja', 'moderada'] as const) {
      const c = base.candidatas.map((x) => ({ ...x, calidad }));
      const s = construirSalida(
        { ...base, candidatas: c },
        interpretarNormativamente(obs(37.5, C20), c),
      );
      expect(idsDe(s)).toEqual(idsDe(salida(C20, 37.5)));
    }
  });

  it('P4 · el país es una coordenada de identidad, no un criterio de preferencia', () => {
    // Se cambia **solo** el país, dejando instrumento, unidad, definición,
    // posición, lado, edad y sexo idénticos.
    const otroPais = salida(ctx({ ...UNI, pais: 'DE', edad: 20, sexo: 'M' }), 37.5);
    const ref = salida(C20, 37.5);

    // Las mismas candidatas, en el mismo orden: el país no reordena nada.
    expect(otroPais.resultados.map((r) => r.norma.id)).toEqual(
      ref.resultados.map((r) => r.norma.id),
    );

    // Y actúa como discrepancia de identidad sobre las colombianas, no como
    // una preferencia que las relegue: siguen presentes, marcadas.
    const col = otroPais.resultados.find((r) => r.norma.id === 'HGS-CO-UNI-M-20')!;
    expect(col.comparacion.estado).toBe('NO_COMPARABLE');
    expect(col.comparacion.motivo).toContain('pais');
    expect(otroPais.distinciones.noAplicables).toContain('HGS-CO-UNI-M-20');

    // Las alemanas tampoco se rescatan por región: su instrumento es otro.
    const ale = otroPais.resultados.filter((r) => r.norma.pais === 'DE');
    expect(ale.length).toBeGreaterThan(0);
    expect(otroPais.distinciones.interpretables).toHaveLength(0);
  });

  it('P5 · cambiar el valor observado no cambia las candidatas', () => {
    const ref = salida(C20, 37.5);
    for (const v of [1, 20, 37.5, 60, 500]) {
      const s = salida(C20, v);
      expect(s.candidatasEvaluadas).toBe(ref.candidatasEvaluadas);
      expect(s.resultados.map((r) => r.norma.id)).toEqual(ref.resultados.map((r) => r.norma.id));
      expect(s.distinciones.noAplicables).toEqual(ref.distinciones.noAplicables);
      expect(s.distinciones.indeterminadas).toEqual(ref.distinciones.indeterminadas);
    }
  });

  it('P6 · el valor solo cambia la interpretación estadística', () => {
    const a = salida(C20, 20);
    const b = salida(C20, 60);
    expect(a.distinciones.interpretables).toEqual(b.distinciones.interpretables);
    const ea = a.particion.comparables.map((r) => r.comparacion.estado);
    const eb = b.particion.comparables.map((r) => r.comparacion.estado);
    expect(ea).not.toEqual(eb);
  });

  it('P7 · una ES-2 nunca desaparece en silencio', () => {
    for (const v of [1, 8.7, 30.7, 500]) {
      const s = salida(C15, v);
      expect(s.evidencia.cuestionadas).toContain('HGS-CO-M-15');
      expect(s.resultados.some((r) => r.norma.id === 'HGS-CO-M-15')).toBe(true);
    }
  });

  it('P8 · un conflicto nunca desaparece en silencio', () => {
    for (const v of [1, 30.7, 500]) {
      const s = salida(C15, v);
      const c = s.conflictos.find((x) => x.normaId === 'HGS-CO-M-15')!;
      expect(c.conflicto).toBe('CONFLICTO_NO_DETERMINABLE');
      expect(c.advertencias.join(' ')).toContain('ENSIN-2015');
    }
  });

  it('P9 · una conversión nunca modifica el valor original', () => {
    for (const v of [1, 66, 120.5]) {
      for (const conv of [true, false]) {
        const s = salida(CBR, v, 'lbf', { convertirUnidad: conv });
        for (const c of s.conversiones) {
          expect(c.valorOriginal).toBe(v);
          expect(c.unidadOriginal).toBe('lbf');
        }
      }
    }
  });

  it('P10 · ninguna salida contiene una clasificación', () => {
    const JUICIO =
      /\b(bajo|alto|anormal|deficiente|adecuado|excelente|insuficiente|[oó]ptimo|apto)\b/i;
    for (const [c, v, u] of [
      [C20, 37.5, 'kg'],
      [C45, 40, 'kg'],
      [C75, 30, 'kg'],
      [C15, 30.7, 'kg'],
      [CBR, 66, 'lbf'],
    ] as const) {
      const s = salida(c, v, u);
      // Solo el texto que redacta el motor: lo que transportan las fichas es de
      // las fuentes, y va literal por contrato.
      const delMotor = [
        s.estadoResolucion,
        s.estadoInterpretacion,
        ...s.advertencias,
        ...s.resultados.flatMap((r) => [
          r.comparacion.estado,
          r.comparacion.motivo,
          r.unidad.estado,
          r.unidad.motivo,
        ]),
      ].join(' ');
      const sinNegaciones = delMotor.replace(/\bno (es|son|se|hay|está)\b[^.]*/gi, '');
      expect(sinNegaciones).not.toMatch(JUICIO);
    }
  });

  it('la salida es determinista', () => {
    for (const v of [10, 37.5, 90]) {
      expect(JSON.stringify(salida(C20, v))).toBe(JSON.stringify(salida(C20, v)));
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// 5 · AUDITORÍA DE SELECCIÓN
// ════════════════════════════════════════════════════════════════════════════

describe('auditoría de selección · nadie gana', () => {
  it('no existe ningún campo que nombre a una norma como la elegida', () => {
    const s = salida(C20, 37.5);
    const prohibidos = [
      'mejorNorma',
      'normaElegida',
      'resultadoFinal',
      'resultadoPromedio',
      'seleccionada',
      'ganadora',
      'principal',
      'recomendada',
    ];
    const claves = new Set<string>();
    const recorrer = (o: unknown) => {
      if (o === null || typeof o !== 'object') return;
      if (Array.isArray(o)) return o.forEach(recorrer);
      for (const [k, v] of Object.entries(o)) {
        claves.add(k);
        recorrer(v);
      }
    };
    recorrer(s);
    for (const p of prohibidos) expect([...claves]).not.toContain(p);
  });

  it('ninguna lista de la salida es más corta por calidad, n o estado', () => {
    const s = salida(C20, 37.5);
    // Los interpretables son todos los que produjeron resultado, sin filtro extra.
    expect(s.distinciones.interpretables).toEqual(
      s.resultados.filter((r) => r.comparacion.resultado !== null).map((r) => r.norma.id),
    );
  });

  it('la divergencia reparte todas las comparables, sin dejar ninguna fuera', () => {
    const s = salida(C20, 37.5);
    const repartidas = s.divergencia!.porEstado.flatMap((p) => p.normas);
    expect(repartidas).toHaveLength(s.particion.comparables.length);
    expect(new Set(repartidas).size).toBe(repartidas.length);
  });

  it('el estado del conjunto no coincide con el de ninguna norma cuando divergen', () => {
    const s = salida(C20, 37.5);
    for (const r of s.particion.comparables) {
      expect(s.estadoInterpretacion).not.toBe(r.comparacion.estado);
    }
  });
});
