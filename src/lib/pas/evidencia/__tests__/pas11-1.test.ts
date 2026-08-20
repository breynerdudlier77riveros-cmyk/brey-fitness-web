// ── Cierre de cobertura · P-09, P-10, P-11 (Sprint PAS-11.1 §24) ───────────
//
// Estos tests fijan los DOS HALLAZGOS del sprint, que son negativos y por eso
// especialmente fáciles de perder:
//
//   1 · Para el FMS existe una norma de población compatible —universitarios
//       de 18 a 26 años— que publica media y recorrido, pero NINGUNA
//       distribución. Un recorrido muestral no es un rango de referencia.
//
//   2 · Existe un MDC del FMS muy bueno (1,05 puntos), y corresponde a un
//       SISTEMA DE PUNTUACIÓN MODIFICADO. Aplicarlo al FMS estándar sería
//       trasladar el error de una prueba a otra.
//
// Las dos fuentes están verificadas en origen y registradas. Ninguna sostiene
// una comparación, y eso es un resultado, no una carencia.

import { describe, expect, it } from 'vitest';

import { leerEvidencia, type SujetoEvidencia } from '../compatibilidad';
import { redactar } from '../redaccion';
import { FUENTES, REFERENCIAS, fuenteDe } from '../registro';

const ATLETA: SujetoEvidencia = { edad: 22, sexo: 'M', pais: 'CO', pesoKg: null };

// ════════════════════════════════════════════════════════════════════════════
// P-09 · FMS
// ════════════════════════════════════════════════════════════════════════════

describe('P-09 · las dos fuentes verificadas y por qué ninguna sirve', () => {
  it('la fuente de universitarios está registrada y verificada', () => {
    const f = fuenteDe('triplett_fms_2021')!;
    expect(f.estado).toBe('propuesta');
    expect(f.cita!.localizador).toMatch(/PMID 33842040/);
    expect(f.poblacion).toMatch(/18 a 26 años/);
  });

  it('y declara que un recorrido muestral NO es un rango de referencia', () => {
    const f = fuenteDe('triplett_fms_2021')!;
    expect(f.noSostiene).toMatch(/recorrido muestral no es un rango de referencia/);
  });

  it('el MDC del FMS existe pero es de un sistema de puntuación MODIFICADO', () => {
    const f = fuenteDe('alkhathami_fms_2021')!;
    expect(f.sostiene).toMatch(/MODIFICADO/);
    expect(f.noSostiene).toMatch(/no al FMS estándar/);
  });

  it('ninguna de las dos produce una referencia utilizable', () => {
    // Es la comprobación central: ambas están verificadas, y aun así el
    // registro no cuelga de ellas ninguna referencia.
    const suyas = REFERENCIAS.filter(
      (r) => r.fuenteId === 'triplett_fms_2021' || r.fuenteId === 'alkhathami_fms_2021',
    );
    expect(suyas).toEqual([]);
  });

  it('P-09 sigue sin evidencia utilizable, ahora DEMOSTRADO', () => {
    const l = leerEvidencia(
      { pruebaId: 'P-09', valor: 16, unidad: '—', condiciones: { formacion_evaluador: 'certificado' } },
      ATLETA,
    );
    expect(l.estado).toBe('SIN_EVIDENCIA_UTILIZABLE');
  });

  it('una puntuación de FMS NUNCA se convierte en porcentaje ni en percentil', () => {
    const l = leerEvidencia(
      { pruebaId: 'P-09', valor: 14, unidad: '—', condiciones: { formacion_evaluador: 'certificado' } },
      ATLETA,
    );
    const f = redactar(l);
    // 14/21 = 66,7 %. Ese número no debe aparecer por ninguna parte.
    expect(f.texto).not.toMatch(/66|%|percentil/i);
    expect(l.compatibles).toEqual([]);
  });

  it('el punto de corte de 14 no se convierte en clasificación de rendimiento', () => {
    const moran = fuenteDe('moran_fms_2017')!;
    expect(moran.noSostiene).toMatch(/No respalda ningún punto de corte/);
    expect(moran.noSostiene).toMatch(/14/);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// P-10 · CAMBIO DE DIRECCIÓN · P-11 · ESPRINT
// ════════════════════════════════════════════════════════════════════════════

describe('P-10 y P-11 · la identidad del protocolo es parte de la compatibilidad', () => {
  it('ninguna de las dos tiene referencia registrada tras la búsqueda', () => {
    expect(REFERENCIAS.filter((r) => r.pruebaId === 'P-10')).toEqual([]);
    expect(REFERENCIAS.filter((r) => r.pruebaId === 'P-11')).toEqual([]);
  });

  it('las fuentes localizadas siguen sin verificar, y por eso no sostienen nada', () => {
    for (const id of ['cod_505_fiabilidad', 'sprint_referencia_futbol']) {
      const f = fuenteDe(id)!;
      expect(f.estado, id).toBe('sin_verificar');
      expect(f.sostiene, id).toMatch(/Nada todavía/);
    }
  });

  it('P-10 exige declarar CUÁL de los protocolos se ejecutó', () => {
    // 505 ≠ 505 modificado ≠ T-test ≠ Illinois. Sin esto, ninguna referencia
    // futura podrá adjuntarse al registro.
    const l = leerEvidencia({ pruebaId: 'P-10', valor: 2.5, unidad: 's', condiciones: {} }, ATLETA);
    expect(l.carencias.map((c) => c.variable)).toContain('protocolo');
  });

  it('P-11 exige declarar la distancia', () => {
    // 10 m no es 20 m, y ninguna fórmula convierte una en otra.
    const l = leerEvidencia({ pruebaId: 'P-11', valor: 3.1, unidad: 's', condiciones: {} }, ATLETA);
    expect(l.carencias.map((c) => c.variable)).toContain('distancia_m');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LA REGLA QUE PROTEGE TODO EL REGISTRO
// ════════════════════════════════════════════════════════════════════════════

describe('localizada nunca es lo mismo que verificada', () => {
  it('ninguna fuente sin verificar tiene referencias colgando', () => {
    const sinVerificar = new Set(
      FUENTES.filter((f) => f.estado === 'sin_verificar').map((f) => f.id),
    );
    expect(sinVerificar.size).toBeGreaterThan(0);
    for (const r of REFERENCIAS) {
      expect(sinVerificar.has(r.fuenteId), r.id).toBe(false);
    }
  });

  it('toda fuente verificada declara su localizador', () => {
    for (const f of FUENTES.filter((x) => x.estado === 'propuesta')) {
      expect(f.cita, f.id).not.toBeNull();
      expect(f.cita!.localizador, f.id).toMatch(/doi:|PMID/);
    }
  });

  it('una fuente verificada puede NO producir referencia, y es un resultado', () => {
    // Dos de las seis propuestas están verificadas y no cuelgan de ellas
    // ninguna referencia. Que eso sea posible es lo que impide que «verificada»
    // se lea automáticamente como «utilizable».
    const propuestas = FUENTES.filter((f) => f.estado === 'propuesta').map((f) => f.id);
    const conReferencia = new Set(REFERENCIAS.map((r) => r.fuenteId));
    const sinReferencia = propuestas.filter((id) => !conReferencia.has(id));
    expect(sinReferencia).toContain('triplett_fms_2021');
    expect(sinReferencia).toContain('alkhathami_fms_2021');
  });

  it('es determinista', () => {
    const e = { pruebaId: 'P-09', valor: 16, unidad: '—', condiciones: {} };
    expect(JSON.stringify(leerEvidencia(e, ATLETA))).toBe(
      JSON.stringify(leerEvidencia(e, ATLETA)),
    );
  });
});
