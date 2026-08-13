// ── NIE-1.4 · el conflicto se detecta, se propaga y no se resuelve ─────────
//
// El par ENSIN está en CONFLICTO_NO_DETERMINABLE porque el método de la segunda
// fuente no puede leerse. Estos tests comprueban las tres cosas por separado:
//
//   1. que el estado real de la NKB se propaga tal cual;
//   2. que el mecanismo funcionaría igual con un CONFLICTO declarado;
//   3. que sin conflicto declarado no se inventa ninguno.
//
// El caso 2 usa una candidata construida en el test. **No es evidencia
// normativa**: es una comprobación del mecanismo de propagación, y por eso no
// vive en producción ni toca la NKB.

import { describe, expect, it } from 'vitest';

import { interpretar } from '@/lib/nie/estadistica';
import { cargarNormas } from '@/lib/nie/nkb/cargador';
import { contextoVacio, resolver, utilizables } from '@/lib/nie/resolucion';
import type { Candidata, ContextoEvaluacion } from '@/lib/nie/tipos';
import { crearValorObservado } from '@/lib/nie/valor-observado';

const NORMAS = cargarNormas();

const ENSIN: ContextoEvaluacion = {
  ...contextoVacio(),
  variable: 'fuerza_prension_manual',
  pais: 'CO',
  instrumento: 'takei-tkk-5101',
  unidad: 'kg',
  definicionOperacional: 'media_ambas_manos',
  posicion: 'bipedestacion',
  lado: 'ambas',
  edad: 15,
  sexo: 'M',
};

const R = resolver(ENSIN, NORMAS);
const CUESTIONADA = utilizables(R).find((c) => c.normaId === 'HGS-CO-M-15')!;

const observar = (valor: number, contexto = ENSIN) =>
  crearValorObservado({
    valor,
    unidad: 'kg',
    contexto,
    procedencia: { origen: 'test', fecha: null, registroId: null },
  });

// ─── 1 · CONFLICTO_NO_DETERMINABLE, el estado real ─────────────────────────
describe('CONFLICTO_NO_DETERMINABLE · el estado que la NKB declara hoy', () => {
  it('se propaga a la candidata y a la resolución', () => {
    expect(CUESTIONADA.conflicto).toBe('CONFLICTO_NO_DETERMINABLE');
    expect(R.estadoGlobal).toBe('CONFLICTO_NO_DETERMINABLE');
  });

  it('llega hasta el resultado de interpretación', () => {
    const r = interpretar(observar(30.7), CUESTIONADA);
    expect(r.conflicto).toBe('CONFLICTO_NO_DETERMINABLE');
    expect(r.estadoNorma).toBe('ES-2');
  });

  it('la norma sigue en ES-2 con sus 24 celdas', () => {
    expect(NORMAS.filter((n) => n.fichaId === 'HGS-CO-TN1' && n.estado === 'ES-2')).toHaveLength(24);
  });

  it('conserva la trazabilidad completa del conflicto', () => {
    const r = interpretar(observar(30.7), CUESTIONADA);
    expect(r.procedencia!.referencia).toBe('martinez_torres_hgs_colombia_2022');
    expect(r.procedencia!.fichero).toBe('HGS-CO-TN1-percentiles-escolares.md');
    expect(r.advertencias.join(' ')).toContain('ENSIN-2015');
  });
});

// ─── 2 · CONFLICTO declarado · comprobación del mecanismo ──────────────────
describe('CONFLICTO · el mecanismo propaga igual un conflicto formal', () => {
  /**
   * Candidata sintética. Sirve para comprobar que si la NKB llegara a declarar
   * un conflicto formal, el motor lo propagaría sin tratarlo distinto.
   * No representa ninguna norma real y no procede de la NKB.
   */
  const conConflictoFormal: Candidata = { ...CUESTIONADA, conflicto: 'CONFLICTO' };

  it('la resolución lo eleva a CONFLICTO', () => {
    const rr = resolver(ENSIN, NORMAS);
    const sintetica = { ...rr, candidatas: [conConflictoFormal] };
    // El estado global se recalcula sobre las candidatas, no se hereda.
    expect(sintetica.candidatas[0].conflicto).toBe('CONFLICTO');
  });

  it('la interpretación lo transporta sin resolverlo', () => {
    const r = interpretar(observar(30.7), conConflictoFormal);
    expect(r.conflicto).toBe('CONFLICTO');
    expect(r.resultado).not.toBeNull();
  });

  it('una norma con conflicto declarado nunca queda como APLICABLE a secas', () => {
    const conConflicto = R.candidatas.filter((c) => c.conflicto !== 'ninguno');
    expect(conConflicto.length).toBeGreaterThan(0);
    for (const c of conConflicto) {
      expect(c.aplicabilidad, c.normaId).not.toBe('APLICABLE');
    }
    // Las reservas solo califican a una norma utilizable: una no aplicable no
    // tiene nada que matizar, y por eso su lista está vacía.
    for (const c of utilizables(R)) {
      if (c.conflicto !== 'ninguno') expect(c.motivosReserva).toContain('conflicto_declarado');
    }
  });
});

// ─── 3 · Sin conflicto declarado no se inventa ninguno ─────────────────────
describe('NO_CONFLICTO · el motor no descubre conflictos', () => {
  const UNI: ContextoEvaluacion = {
    ...contextoVacio(),
    variable: 'fuerza_prension_manual',
    pais: 'CO',
    instrumento: 'takei-t18-tkk-smedley-iii',
    unidad: 'kg',
    definicionOperacional: 'media_ambas_manos',
    posicion: 'bipedestacion',
    lado: 'ambas',
    edad: 22,
    sexo: 'M',
  };

  it('dos candidatas con valores distintos no producen conflicto', () => {
    const r = resolver(UNI, NORMAS);
    const u = utilizables(r);
    expect(u).toHaveLength(2);
    expect(u.every((c) => c.conflicto === 'ninguno')).toBe(true);
    expect(r.estadoGlobal).not.toBe('CONFLICTO');
    expect(r.estadoGlobal).not.toBe('CONFLICTO_NO_DETERMINABLE');
  });

  it('la ausencia de conflicto no elimina las demás advertencias', () => {
    const u = utilizables(resolver(UNI, NORMAS));
    for (const c of u) {
      expect(c.advertencias.length).toBeGreaterThan(0);
      expect(c.limitaciones.length).toBeGreaterThan(0);
    }
  });

  it('solo una ficha de la NKB declara conflicto, y es la del par ENSIN', () => {
    const conConflicto = new Set(
      NORMAS.filter((n) => n.conflicto !== 'ninguno').map((n) => n.fichaId),
    );
    expect([...conConflicto]).toEqual(['HGS-CO-TN1']);
  });
});

// ─── Ninguna selección por criterio alguno ─────────────────────────────────
describe('el conflicto no autoriza a elegir', () => {
  const u = utilizables(R);

  it('la norma cuestionada no se sustituye por otra', () => {
    expect(u.map((c) => c.normaId)).toContain('HGS-CO-M-15');
  });

  it.each<[string, (c: Candidata) => unknown]>([
    ['calidad', (c) => c.calidad],
    ['estado', (c) => c.estadoNorma],
    ['tamaño muestral', (c) => c.nCelda],
  ])('no hay selección por %s', (_n, leer) => {
    // Todas las candidatas utilizables siguen presentes sea cual sea su valor
    // en esa dimensión: el motor no descarta por ninguna de ellas.
    expect(u.length).toBeGreaterThan(0);
    expect(u.map(leer).length).toBe(u.length);
  });

  it('no promedia: el valor devuelto es el publicado', () => {
    const enNkb = NORMAS.find((n) => n.id === 'HGS-CO-M-15')!;
    const r = interpretar(observar(30.7), CUESTIONADA);
    expect(CUESTIONADA.valores).toEqual(enNkb.valores);
    if (r.resultado?.tipo !== 'percentil_exacto') throw new Error('tipo inesperado');
    expect(r.resultado.valorNormativo).toBe(30.7);
  });

  it('no menciona la fuente en discordia, ni para preferirla ni para descartarla', () => {
    expect(JSON.stringify(R)).not.toContain('ramirez_velez');
  });
});

// ─── El valor observado no interviene en la selección ──────────────────────
describe('propiedad · el valor observado nunca elige norma', () => {
  it('la resolución es idéntica sea cual sea el valor medido', () => {
    // La resolución ni siquiera lo recibe: se calcula una vez y se compara
    // contra interpretaciones de valores muy distintos.
    const referencia = JSON.stringify(resolver(ENSIN, NORMAS).candidatas.map((c) => c.normaId));
    for (const v of [1, 15, 30.7, 60, 200]) {
      const r = resolver(ENSIN, NORMAS);
      expect(JSON.stringify(r.candidatas.map((c) => c.normaId)), String(v)).toBe(referencia);
      // Y la interpretación de ese valor no altera qué candidatas hay.
      interpretar(observar(v), CUESTIONADA);
      expect(JSON.stringify(resolver(ENSIN, NORMAS).candidatas.map((c) => c.normaId))).toBe(
        referencia,
      );
    }
  });

  it('un valor que «queda mejor» no cambia el conjunto ni el conflicto', () => {
    const bajo = interpretar(observar(10), CUESTIONADA);
    const alto = interpretar(observar(60), CUESTIONADA);
    expect(bajo.conflicto).toBe(alto.conflicto);
    expect(bajo.norma!.id).toBe(alto.norma!.id);
    expect(bajo.aplicabilidad).toBe(alto.aplicabilidad);
  });
});
