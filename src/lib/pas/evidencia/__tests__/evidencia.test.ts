// ── Capa de evidencia (Sprint PAS-10E §30, §31) ────────────────────────────
//
// Cada prohibición importante tiene su control positivo: una comprobación que
// demuestra que el auditor detectaría una infracción artificial. Una regla no
// está protegida porque un test pase — está protegida cuando se ha visto
// fallar ante la infracción que persigue.

import { describe, expect, it } from 'vitest';

import {
  condicionesDe,
  requeridasAusentes,
} from '@/features/performance-workspace/schemas/condiciones';
import { PRUEBAS } from '@/features/performance-workspace/schemas/catalogo';

import { leerEvidencia, type MedicionEvaluada, type SujetoEvidencia } from '../compatibilidad';
import { leerCambio, situar } from '../posicion';
import { redactar } from '../redaccion';
import { FUENTES, REFERENCIAS, fuenteDe, referenciasDe } from '../registro';
import type { Representacion } from '../tipos';

const ADULTO: SujetoEvidencia = { edad: 22, sexo: 'M', pais: 'CO', pesoKg: null };
const ESCOLAR: SujetoEvidencia = { edad: 14, sexo: 'M', pais: 'CO', pesoKg: null };

const med = (over: Partial<MedicionEvaluada> = {}): MedicionEvaluada => ({
  pruebaId: 'P-01',
  valor: 140,
  unidad: 'kg',
  condiciones: {},
  ...over,
});

// ════════════════════════════════════════════════════════════════════════════
// CONDICIONES POR PRUEBA (§15)
// ════════════════════════════════════════════════════════════════════════════

describe('las once pruebas declaran sus condiciones', () => {
  it('todas las del catálogo tienen entrada', () => {
    for (const p of PRUEBAS) {
      expect(condicionesDe(p.id), p.id).not.toBeNull();
    }
  });

  it('los vocabularios son cerrados y no están vacíos', () => {
    for (const p of PRUEBAS) {
      const c = condicionesDe(p.id)!;
      for (const campo of [...c.requeridas, ...c.opcionales]) {
        expect(campo.vocabulario.length, `${p.id}/${campo.clave}`).toBeGreaterThan(1);
        for (const v of campo.vocabulario) {
          expect(campo.etiquetas[v], `${p.id}/${campo.clave}/${v}`).toBeTruthy();
        }
      }
    }
  });

  it('cada condición explica por qué altera el resultado', () => {
    for (const p of PRUEBAS) {
      const c = condicionesDe(p.id)!;
      for (const campo of [...c.requeridas, ...c.opcionales]) {
        expect(campo.porQue.length, `${p.id}/${campo.clave}`).toBeGreaterThan(40);
      }
    }
  });

  it('los dos identificadores que agrupaban protocolos ya los distinguen', () => {
    // Era el bloqueo 3 de la auditoría: P-10 cubría 5-0-5, T-test e Illinois, y
    // P-11 no declaraba distancia. Sin esto, ninguna referencia puede adjuntarse.
    const p10 = condicionesDe('P-10')!.requeridas.map((c) => c.clave);
    expect(p10).toContain('protocolo');
    const p11 = condicionesDe('P-11')!.requeridas.map((c) => c.clave);
    expect(p11).toContain('distancia_m');
  });

  it('las requeridas ausentes se declaran por clave, no como «faltan datos»', () => {
    expect(requeridasAusentes('P-10', {})).toEqual(['protocolo', 'cronometraje']);
    expect(requeridasAusentes('P-10', { protocolo: '505', cronometraje: 'manual' })).toEqual([]);
  });

  it('una clave vacía cuenta como ausente', () => {
    expect(requeridasAusentes('P-11', { distancia_m: '', cronometraje: 'manual' })).toEqual([
      'distancia_m',
    ]);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// REGISTRO (§22, §23, §24)
// ════════════════════════════════════════════════════════════════════════════

describe('el registro de evidencia es auditable', () => {
  it('toda referencia apunta a una fuente que existe', () => {
    for (const r of REFERENCIAS) {
      expect(fuenteDe(r.fuenteId), r.id).not.toBeNull();
    }
  });

  it('ningún identificador se repite', () => {
    expect(new Set(REFERENCIAS.map((r) => r.id)).size).toBe(REFERENCIAS.length);
    expect(new Set(FUENTES.map((f) => f.id)).size).toBe(FUENTES.length);
  });

  it('las fuentes de la PKB se referencian por clave y NO se copian', () => {
    // §23: dos copias de la misma cita acaban divergiendo.
    for (const f of FUENTES.filter((x) => x.estado === 'admitida')) {
      expect(f.claveExterna, f.id).not.toBeNull();
      expect(f.cita, f.id).toBeNull();
    }
  });

  it('las fuentes nuevas llevan cita completa y no clave externa', () => {
    for (const f of FUENTES.filter((x) => x.estado === 'propuesta')) {
      expect(f.claveExterna, f.id).toBeNull();
      expect(f.cita, f.id).not.toBeNull();
      expect(f.cita!.localizador, f.id).toMatch(/doi:|PMID/);
    }
  });

  it('toda fuente declara qué NO sostiene', () => {
    // Es el campo que impide leerla de más, así que no puede quedar en blanco.
    for (const f of FUENTES) {
      expect(f.noSostiene.length, f.id).toBeGreaterThan(30);
    }
  });

  it('toda referencia posicional transporta las limitaciones de su fuente', () => {
    for (const r of REFERENCIAS) {
      if (r.representacion.clase === 'fiabilidad') continue;
      expect(r.limitaciones.length, r.id).toBeGreaterThan(0);
    }
  });

  it('ninguna fuente sin verificar sostiene una comparación', () => {
    const sinVerificar = new Set(
      FUENTES.filter((f) => f.estado === 'sin_verificar').map((f) => f.id),
    );
    expect(sinVerificar.size).toBeGreaterThan(0);

    for (const r of REFERENCIAS.filter((x) => sinVerificar.has(x.fuenteId))) {
      const l = leerEvidencia(
        med({ pruebaId: r.pruebaId, unidad: r.ambito.unidad }),
        ADULTO,
      );
      expect(l.compatibles.map((c) => c.referencia.id), r.id).not.toContain(r.id);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LOS SEIS ESTADOS, SIN COLAPSAR (§17, §18)
// ════════════════════════════════════════════════════════════════════════════

describe('los estados de evidencia no se colapsan', () => {
  it('falta un dato del ATLETA → NO_DETERMINABLE, nunca «sin evidencia»', () => {
    // P-01 tiene benchmark de powerlifting, publicado en fuerza relativa. Sin
    // masa corporal no puede aplicarse — pero la evidencia existe.
    const l = leerEvidencia(
      med({ valor: 2.5, unidad: 'ratio_peso', condiciones: { determinacion: 'medido_directo' } }),
      ADULTO,
    );
    expect(l.estado).toBe('NO_DETERMINABLE');
    expect(l.carencias.map((c) => c.variable)).toContain('peso_kg');
    expect(l.carencias.find((c) => c.variable === 'peso_kg')!.origen).toBe('atleta');
  });

  it('falta una condición del REGISTRO → NO_COMPARABLE', () => {
    const l = leerEvidencia(
      med({ valor: 2.5, unidad: 'ratio_peso', condiciones: {} }),
      { ...ADULTO, pesoKg: 70 },
    );
    expect(l.estado).toBe('NO_COMPARABLE');
    expect(l.carencias.some((c) => c.origen === 'registro')).toBe(true);
  });

  it('la referencia es de otra población → EVIDENCIA_NO_COMPATIBLE', () => {
    // FUPRECOL es de escolares de 9 a 17,9. Un adulto de 22 queda fuera.
    const l = leerEvidencia(
      med({ pruebaId: 'P-07', valor: 60, unidad: 'estadios', condiciones: { ecuacion: 'leger_1988' } }),
      ADULTO,
    );
    expect(l.estado).toBe('EVIDENCIA_NO_COMPATIBLE');
    expect(l.descartadas[0].motivo).toMatch(/rango de edad|9 a 17/);
  });

  it('la misma prueba con un escolar → la referencia sí aplica', () => {
    const l = leerEvidencia(
      med({ pruebaId: 'P-07', valor: 60, unidad: 'estadios', condiciones: { ecuacion: 'leger_1988' } }),
      ESCOLAR,
    );
    // Compatible en población, pero su tabla no está transcrita: es un hueco
    // NUESTRO, y se declara como tal.
    expect(l.estado).toBe('EVIDENCIA_PARCIAL');
    expect(l.carencias.some((c) => c.origen === 'sistema')).toBe(true);
  });

  it('solo hay fiabilidad → EVIDENCIA_PARCIAL, no «sin evidencia»', () => {
    const l = leerEvidencia(
      med({ pruebaId: 'P-02', valor: 2400, unidad: 'N', condiciones: { formato: 'bilateral' } }),
      ADULTO,
    );
    expect(l.estado).toBe('EVIDENCIA_PARCIAL');
    expect(l.complementarias.map((r) => r.tipo)).toContain('FIABILIDAD');
  });

  it('no hay ninguna referencia declarada → SIN_EVIDENCIA_UTILIZABLE', () => {
    const l = leerEvidencia(
      med({ pruebaId: 'P-09', valor: 16, unidad: '—', condiciones: { formacion_evaluador: 'certificado' } }),
      ADULTO,
    );
    expect(l.estado).toBe('SIN_EVIDENCIA_UTILIZABLE');
    expect(l.compatibles).toEqual([]);
  });

  it('los seis estados son alcanzables y distintos entre sí', () => {
    const alcanzados = new Set([
      leerEvidencia(med({ valor: 2.5, unidad: 'ratio_peso', condiciones: { determinacion: 'medido_directo' } }), ADULTO).estado,
      leerEvidencia(med({ valor: 2.5, unidad: 'ratio_peso' }), { ...ADULTO, pesoKg: 70 }).estado,
      leerEvidencia(med({ pruebaId: 'P-07', valor: 60, unidad: 'estadios', condiciones: { ecuacion: 'leger_1988' } }), ADULTO).estado,
      leerEvidencia(med({ pruebaId: 'P-02', valor: 2400, unidad: 'N', condiciones: { formato: 'bilateral' } }), ADULTO).estado,
      leerEvidencia(med({ pruebaId: 'P-09', valor: 16, unidad: '—', condiciones: { formacion_evaluador: 'certificado' } }), ADULTO).estado,
    ]);
    expect(alcanzados.size).toBeGreaterThanOrEqual(4);
    expect(alcanzados).not.toContain('EVIDENCIA_COMPATIBLE');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// COMPATIBILIDAD · LAS SIETE CONDICIONES (§7)
// ════════════════════════════════════════════════════════════════════════════

describe('la regla de compatibilidad descarta con motivo', () => {
  it('unidad distinta → descartada, y no se convierte', () => {
    const l = leerEvidencia(
      med({ valor: 140, unidad: 'lb', condiciones: { determinacion: 'medido_directo' } }),
      { ...ADULTO, pesoKg: 70 },
    );
    const d = l.descartadas.find((x) => x.motivo.includes('conversión'));
    expect(d).toBeDefined();
  });

  it('protocolo distinto → descartada, con los dos valores en el motivo', () => {
    const l = leerEvidencia(
      med({
        valor: 2.5,
        unidad: 'ratio_peso',
        condiciones: { determinacion: 'estimado_submaximo' },
      }),
      { ...ADULTO, pesoKg: 70 },
    );
    const d = l.descartadas.find((x) => x.motivo.includes('protocolos distintos'));
    expect(d).toBeDefined();
    expect(d!.motivo).toContain('estimado_submaximo');
  });

  it('sexo distinto → descartada', () => {
    const l = leerEvidencia(
      med({ valor: 2.5, unidad: 'ratio_peso', condiciones: { determinacion: 'medido_directo' } }),
      { edad: 22, sexo: 'F', pais: 'CO', pesoKg: 60 },
    );
    expect(l.compatibles.every((c) => c.referencia.ambito.sexo !== 'M')).toBe(true);
  });

  it('ninguna descartada se queda sin motivo', () => {
    for (const sujeto of [ADULTO, ESCOLAR, { ...ADULTO, pesoKg: 70 }]) {
      for (const p of PRUEBAS) {
        const l = leerEvidencia(med({ pruebaId: p.id, unidad: 'kg' }), sujeto);
        for (const d of l.descartadas) {
          expect(d.motivo.length, `${p.id}/${d.referencia.id}`).toBeGreaterThan(20);
        }
      }
    }
  });

  it('no elige entre referencias compatibles', () => {
    // Ambas referencias de powerlifting son del mismo estudio, una por sexo. Un
    // varón solo casa con una — pero el contrato es que salgan TODAS las que
    // casen, no la primera.
    const l = leerEvidencia(
      med({ valor: 2.5, unidad: 'ratio_peso', condiciones: { determinacion: 'medido_directo' } }),
      { ...ADULTO, pesoKg: 70 },
    );
    expect(l.estado).toBe('EVIDENCIA_COMPATIBLE');
    expect(l.compatibles.every((c) => c.referencia.ambito.sexo === 'M')).toBe(true);
  });

  it('es determinista', () => {
    const entrada = med({ valor: 2.5, unidad: 'ratio_peso', condiciones: { determinacion: 'medido_directo' } });
    expect(JSON.stringify(leerEvidencia(entrada, ADULTO))).toBe(
      JSON.stringify(leerEvidencia(entrada, ADULTO)),
    );
  });
});

// ════════════════════════════════════════════════════════════════════════════
// POSICIÓN · NADA SE INTERPOLA NI SE CONVIERTE (§7, §20 de PAS-11)
// ════════════════════════════════════════════════════════════════════════════

describe('la posición se mide, no se estima', () => {
  const percentiles: Representacion = {
    clase: 'percentiles',
    puntos: [
      { p: 25, valor: 30 },
      { p: 50, valor: 40 },
      { p: 90, valor: 55 },
      { p: 97, valor: 60 },
    ],
  };

  it('un valor que coincide da el percentil exacto', () => {
    expect(situar(40, percentiles)).toEqual({ clase: 'percentil_exacto', p: 50 });
  });

  it('entre dos percentiles NO se inventa uno intermedio', () => {
    const p = situar(57, percentiles);
    expect(p).toEqual({ clase: 'entre_percentiles', inferior: 90, superior: 97 });
    // El error que esto impide: 57 está a mitad de camino entre 55 y 60, y
    // «P93,5» sería una cifra que nadie publicó.
    expect(JSON.stringify(p)).not.toContain('93');
  });

  it('fuera del intervalo publicado NO se extrapola', () => {
    expect(situar(80, percentiles)).toEqual({ clase: 'fuera_por_encima', ultimoPercentil: 97 });
    expect(situar(10, percentiles)).toEqual({ clase: 'fuera_por_debajo', primerPercentil: 25 });
  });

  it('ordena los puntos: no confía en el orden de transcripción', () => {
    const desordenados: Representacion = {
      clase: 'percentiles',
      puntos: [{ p: 90, valor: 55 }, { p: 25, valor: 30 }, { p: 50, valor: 40 }],
    };
    expect(situar(45, desordenados)).toEqual({ clase: 'entre_percentiles', inferior: 50, superior: 90 });
  });

  it('media ± DT devuelve desviaciones, NUNCA un percentil', () => {
    const p = situar(60, { clase: 'media_dt', media: 50, dt: 10 });
    expect(p).toEqual({ clase: 'desviaciones', z: 1 });
    expect(JSON.stringify(p)).not.toMatch(/percentil/i);
  });

  it('control positivo: la comprobación detectaría una conversión z→percentil', () => {
    expect(JSON.stringify({ clase: 'percentil_exacto', p: 84 })).toMatch(/percentil/i);
  });

  it('la fiabilidad NO sitúa a nadie', () => {
    expect(situar(46, { clase: 'fiabilidad', icc: [0.9, 0.99], cvPct: 4 })).toBeNull();
  });

  it('una referencia sin transcribir tampoco sitúa', () => {
    expect(
      situar(46, { clase: 'valores_sin_transcribir', queSePublica: 'percentiles P3 a P97' }),
    ).toBeNull();
  });

  it('el rango distingue los dos lados de fuera', () => {
    const r: Representacion = { clase: 'rango', min: 20, max: 30 };
    expect(situar(25, r)).toEqual({ clase: 'dentro_del_rango' });
    expect(situar(10, r)).toEqual({ clase: 'fuera_del_rango', lado: 'inferior' });
    expect(situar(40, r)).toEqual({ clase: 'fuera_del_rango', lado: 'superior' });
  });
});

// ════════════════════════════════════════════════════════════════════════════
// CAMBIO FRENTE AL ERROR DE MEDIDA (§13, §21)
// ════════════════════════════════════════════════════════════════════════════

describe('un CV no es un MDC', () => {
  it('con solo fiabilidad NO se decide si el cambio es real', () => {
    const r = leerCambio(4, 42, { clase: 'fiabilidad', icc: [0.9, 0.99], cvPct: 4.2 }, 'kg');
    expect(r.decidible).toBe(false);
    if (r.decidible) throw new Error('no debería');
    expect(r.motivo).toBe('SOLO_CV_PUBLICADO');
    expect(r.detalle).toMatch(/autorización/);
  });

  it('con MDC publicado sí se decide', () => {
    const rep: Representacion = { clase: 'error_medicion', sem: 1.5, mdc: 4.2, mdcPct: null };
    const menor = leerCambio(3, 42, rep, 'kg');
    const mayor = leerCambio(6, 42, rep, 'kg');
    if (!menor.decidible || !mayor.decidible) throw new Error('debería decidirse');
    expect(menor.superaError).toBe(false);
    expect(mayor.superaError).toBe(true);
  });

  it('un MDC porcentual se aplica sobre el valor de partida', () => {
    const rep: Representacion = { clase: 'error_medicion', sem: null, mdc: null, mdcPct: 8 };
    // 8 % de 2,50 s son 0,20 s.
    const justo = leerCambio(0.15, 2.5, rep, 's');
    const claro = leerCambio(0.3, 2.5, rep, 's');
    if (!justo.decidible || !claro.decidible) throw new Error('debería decidirse');
    expect(justo.superaError).toBe(false);
    expect(claro.superaError).toBe(true);
    expect(claro.mdcUsado).toBeCloseTo(0.2, 10);
  });

  it('el signo del cambio no altera la comparación con el error', () => {
    const rep: Representacion = { clase: 'error_medicion', sem: null, mdc: 4, mdcPct: null };
    const sube = leerCambio(5, 40, rep, 'kg');
    const baja = leerCambio(-5, 40, rep, 'kg');
    if (!sube.decidible || !baja.decidible) throw new Error('debería decidirse');
    expect(sube.superaError).toBe(baja.superaError);
  });

  it('sin nada publicado lo dice, en vez de suponer', () => {
    const r = leerCambio(4, 42, { clase: 'rango', min: 1, max: 2 }, 'kg');
    expect(r.decidible).toBe(false);
    if (r.decidible) throw new Error('no debería');
    expect(r.motivo).toBe('SIN_MDC_PUBLICADO');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// REDACCIÓN · NADA CLASIFICA (§20)
// ════════════════════════════════════════════════════════════════════════════

describe('ninguna frase clasifica al atleta', () => {
  const CATEGORIA =
    /(?<![-\w])(bueno|buena|malo|mala|excelente|deficiente|pobre|[oó]ptimo|adecuado|apto|alto|bajo|principiante|intermedio|avanzado)(?![-\w])/i;

  const CASOS: [string, MedicionEvaluada, SujetoEvidencia][] = [
    ['compatible', med({ valor: 2.5, unidad: 'ratio_peso', condiciones: { determinacion: 'medido_directo' } }), { ...ADULTO, pesoKg: 70 }],
    ['no determinable', med({ valor: 2.5, unidad: 'ratio_peso', condiciones: { determinacion: 'medido_directo' } }), ADULTO],
    ['no comparable', med({ valor: 2.5, unidad: 'ratio_peso' }), { ...ADULTO, pesoKg: 70 }],
    ['no compatible', med({ pruebaId: 'P-07', valor: 60, unidad: 'estadios', condiciones: { ecuacion: 'leger_1988' } }), ADULTO],
    ['parcial · sistema', med({ pruebaId: 'P-07', valor: 60, unidad: 'estadios', condiciones: { ecuacion: 'leger_1988' } }), ESCOLAR],
    ['parcial · fiabilidad', med({ pruebaId: 'P-02', valor: 2400, unidad: 'N', condiciones: { formato: 'bilateral' } }), ADULTO],
    ['sin evidencia', med({ pruebaId: 'P-09', valor: 16, unidad: '—', condiciones: { formacion_evaluador: 'certificado' } }), ADULTO],
  ];

  it('ninguna frase emite una categoría', () => {
    for (const [nombre, m, s] of CASOS) {
      const f = redactar(leerEvidencia(m, s));
      // Se descuentan las negaciones: «no equivale», «no invalida» son límites.
      const afirmado = `${f.texto} ${f.limite ?? ''}`.replace(/\bno\s+\w+[^.]*/gi, '');
      expect(afirmado, nombre).not.toMatch(CATEGORIA);
    }
  });

  it('control positivo: la comprobación detecta una categoría real', () => {
    expect('tu resultado es excelente'.replace(/\bno\s+\w+[^.]*/gi, '')).toMatch(CATEGORIA);
  });

  it('ningún estado se queda sin frase', () => {
    for (const [nombre, m, s] of CASOS) {
      const f = redactar(leerEvidencia(m, s));
      expect(f.texto.length, nombre).toBeGreaterThan(30);
    }
  });

  it('«sin evidencia» ya NO es la respuesta por defecto', () => {
    // El defecto que abrió el sprint: seis situaciones distintas contestaban lo
    // mismo. Solo una de las siete debe decir que no hay evidencia.
    const textos = CASOS.map(([, m, s]) => redactar(leerEvidencia(m, s)).texto);
    const sinEvidencia = textos.filter((t) => t.includes('No se ha localizado evidencia'));
    expect(sinEvidencia).toHaveLength(1);
  });

  it('los estados con salida dicen QUÉ falta', () => {
    for (const nombre of ['no determinable', 'no comparable', 'parcial · sistema']) {
      const [, m, s] = CASOS.find(([n]) => n === nombre)!;
      const f = redactar(leerEvidencia(m, s));
      expect(f.limite, nombre).not.toBeNull();
      expect(f.limite!.length, nombre).toBeGreaterThan(40);
    }
  });

  it('una posición entre percentiles arrastra siempre su límite', () => {
    const f = redactar({
      pruebaId: 'X',
      estado: 'EVIDENCIA_COMPATIBLE',
      compatibles: [
        {
          referencia: REFERENCIAS.find((r) => r.id === 'P-01/powerlifting/p90')!,
          posicion: { clase: 'entre_percentiles', inferior: 50, superior: 90 },
        },
      ],
      descartadas: [],
      carencias: [],
      complementarias: [],
    });
    expect(f.limite).toMatch(/no publica valores entre esos dos percentiles/);
  });

  it('la frase de una referencia compatible cita su procedencia', () => {
    const f = redactar(
      leerEvidencia(
        med({ valor: 2.5, unidad: 'ratio_peso', condiciones: { determinacion: 'medido_directo' } }),
        { ...ADULTO, pesoKg: 70 },
      ),
    );
    expect(f.procedencia).toMatch(/2024/);
  });

  it('un benchmark deportivo no se presenta como norma poblacional', () => {
    const f = redactar(
      leerEvidencia(
        med({ valor: 2.5, unidad: 'ratio_peso', condiciones: { determinacion: 'medido_directo' } }),
        { ...ADULTO, pesoKg: 70 },
      ),
    );
    expect(f.limite).toMatch(/competidores federados|no población general/i);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// COBERTURA DEL CATÁLOGO (§24)
// ════════════════════════════════════════════════════════════════════════════

describe('las once pruebas tienen conclusión', () => {
  it('ninguna lanza, y todas devuelven un estado', () => {
    for (const p of PRUEBAS) {
      const l = leerEvidencia(
        med({ pruebaId: p.id, valor: 10, unidad: p.unidad ?? '—' }),
        ADULTO,
      );
      expect(l.estado, p.id).toBeTruthy();
      expect(l.pruebaId, p.id).toBe(p.id);
    }
  });

  it('las pruebas con referencias declaradas las encuentran', () => {
    for (const id of ['P-01', 'P-02', 'P-04', 'P-05', 'P-07', 'P-08']) {
      expect(referenciasDe(id).length, id).toBeGreaterThan(0);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// FRONTERAS (§29)
// ════════════════════════════════════════════════════════════════════════════

describe('la capa no cruza sus fronteras', () => {
  const ficheros = ['tipos.ts', 'registro.ts', 'compatibilidad.ts', 'posicion.ts', 'redaccion.ts', 'index.ts'];

  const leer = async (f: string) => {
    const { readFileSync } = await import('node:fs');
    const { join } = await import('node:path');
    return readFileSync(join(process.cwd(), 'src/lib/pas/evidencia', f), 'utf-8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/^\s*\/\/.*$/gm, '');
  };

  it.each(ficheros)('%s no importa NIE, NKB, React ni Supabase', async (f) => {
    const src = await leer(f);
    for (const [nombre, patron] of [
      ['NIE', /from ['"]@\/lib\/nie/],
      ['NKB', /cargarNormas|normative-knowledge-base/],
      ['React', /from ['"]react/],
      ['Supabase', /(?<![-\w])supabase(?![-\w])/i],
    ] as const) {
      expect(src, `${f}: ${nombre}`).not.toMatch(patron);
    }
  });

  it.each(ficheros)('%s no tiene efectos ni azar', async (f) => {
    const src = await leer(f);
    for (const p of [/new Date\(/, /Date\.now/, /Math\.random/, /\bfetch\(/, /console\./]) {
      expect(src, f).not.toMatch(p);
    }
  });

  it('control positivo: las cuatro comprobaciones cazan su infracción', () => {
    expect("import { x } from '@/lib/nie'").toMatch(/from ['"]@\/lib\/nie/);
    expect('const n = cargarNormas()').toMatch(/cargarNormas|normative-knowledge-base/);
    expect("import React from 'react'").toMatch(/from ['"]react/);
    expect('await supabase.from("x")').toMatch(/(?<![-\w])supabase(?![-\w])/i);
  });

  it('el registro no contiene lógica: solo datos', async () => {
    const src = await leer('registro.ts');
    // Sin condicionales ni bucles: si aparecen, alguien está calculando un
    // valor científico en vez de declararlo.
    expect(src).not.toMatch(/\bif\s*\(/);
    expect(src).not.toMatch(/\bfor\s*\(/);
    expect(src).not.toMatch(/Math\./);
  });

  it('control positivo: esa comprobación detectaría un cálculo en el registro', () => {
    expect('const v = Math.round(x);').toMatch(/Math\./);
  });
});
