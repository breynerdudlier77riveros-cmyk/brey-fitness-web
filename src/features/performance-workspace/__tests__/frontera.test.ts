// ── La frontera completa, como test permanente (Sprint PRS-2.4) ────────────
//
// NKB → cargarNormas → adaptador → SujetoNormativo → consultarEvaluacion →
// NIE → componerInformeNormativo → Report v2
//
// La fase 18 de PRS-2.3 comprobó esta cadena con un script de scratchpad. Un
// script no protege de una regresión: se ejecuta una vez y se olvida. Esto sí.
//
// El caso principal reproduce la evaluación real ya validada contra Supabase:
// varón colombiano de 22 años, 46 kg medidos con Takei T-18, media de ambas
// manos, de pie, ambas. Las normas son las reales de la NKB, cargadas del
// disco: no hay fixture de valores normativos en ninguna parte.

import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import ReportViewV2 from '@/components/pas/report-v2/ReportViewV2';
import { cargarNormas } from '@/lib/nie/nkb/cargador';
import { MAPEOS } from '@/lib/pas/normativo';
import type { DatosPortada } from '@/lib/pas/report-v2';

import { construirInformeNormativo } from '../services/informe-normativo';
import { resolverSujeto } from '../services/sujeto';
import type { Atleta, RegistroWorkspace } from '../schemas/tipos';

const NORMAS = cargarNormas();
const HOY = '2026-08-15';
const PRUEBA = MAPEOS[0].pruebaId;

const PORTADA: DatosPortada = {
  atleta: 'Atleta de prueba',
  edad: 22,
  sexo: 'M',
  fecha: HOY,
  profesional: null,
  codigo: 'EVAL-REAL',
};

/** El atleta real: 22 años, varón, Colombia, 162 cm. */
const atleta = (over: Partial<Atleta> = {}): Atleta => ({
  id: 'a1',
  profesionalId: 'p1',
  nombre: 'Atleta de prueba',
  documento: null,
  codigoInterno: null,
  deporte: null,
  fechaNacimiento: '2004-01-17',
  sexo: 'M',
  pais: 'CO',
  estaturaCm: 162,
  notas: null,
  estado: 'activo',
  createdAt: HOY,
  updatedAt: HOY,
  ...over,
});

/** El método real declarado en la evaluación. */
const METODO = {
  dinamometro: 'takei-t18',
  consolidacion: 'media_ambas_manos',
  posicion: 'bipedestacion',
  mano: 'ambas',
};

const registro = (
  valor = 46,
  condiciones: Record<string, string> = METODO,
  over: Partial<RegistroWorkspace> = {},
): RegistroWorkspace => ({
  id: 'r1',
  evaluacionId: 'e1',
  pruebaId: PRUEBA,
  fecha: HOY,
  valor: { tipo: 'continuo', valor, unidad: 'kg' },
  estado: 'vigente',
  condiciones,
  componentes: {},
  precondicionesCumplidas: true,
  patron: null,
  observaciones: null,
  createdAt: HOY,
  ...over,
});

function cadena(
  registros: readonly RegistroWorkspace[] = [registro()],
  a: Atleta = atleta(),
) {
  const r = construirInformeNormativo({
    atleta: a,
    registros,
    hoyISO: HOY,
    portada: PORTADA,
    normas: NORMAS,
  });
  if (r.estado !== 'DISPONIBLE') throw new Error(`esperaba DISPONIBLE, llegó ${r.estado}`);
  return r.informe;
}

// ════════════════════════════════════════════════════════════════════════════
// EL CASO REAL
// ════════════════════════════════════════════════════════════════════════════

describe('el caso real de 46 kg atraviesa la cadena entera', () => {
  const inf = cadena();

  it('el sujeto se resuelve completo desde el expediente', () => {
    const s = resolverSujeto(atleta(), HOY);
    expect(s.estado).toBe('COMPLETO');
    expect(s.sujeto).toEqual({ edad: 22, sexo: 'M', estaturaM: 1.62, pais: 'CO' });
  });

  it('produce exactamente las dos normas universitarias colombianas', () => {
    expect(inf.tarjetas.map((t) => t.normaId)).toEqual([
      'HGS-CO-UNI-M-22',
      'HGS-CO-UNI-TN2-M-22',
    ]);
  });

  it('una es TN-1 y la otra TN-2', () => {
    expect(inf.tarjetas.map((t) => t.tipo)).toEqual(['TN-1', 'TN-2']);
  });

  it('y se renderiza entero', () => {
    const html = renderToStaticMarkup(createElement(ReportViewV2, { informe: inf }));
    expect(html.length).toBeGreaterThan(20000);
    expect(html.match(/role="img"/g) ?? []).toHaveLength(2);
    for (const marca of ['prs2-tarjeta', 'prs2-barra', 'prs2-evidencia', 'prs2-comparabilidad']) {
      expect(html, marca).toContain(marca);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LOS TRECE INVARIANTES
// ════════════════════════════════════════════════════════════════════════════

describe('invariantes de la frontera', () => {
  it('I-1 · el valor observado entra y sale idéntico', () => {
    for (const v of [46, 20.5, 0.1, 300]) {
      for (const t of cadena([registro(v)]).tarjetas) {
        expect(t.valor).toBe(v);
        expect(t.unidad).toBe('kg');
      }
    }
  });

  it('I-2 · los valores normativos son los publicados, sin tocar', () => {
    const t = cadena().tarjetas.find((x) => x.tipo === 'TN-1')!;
    const norma = NORMAS.find((n) => n.id === t.normaId)!;
    if (norma.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    expect(t.escala!.marcas.map((m) => m.valor)).toEqual(
      norma.valores.percentiles.map((p) => p.valor),
    );
  });

  it('I-3 · componer el informe no modifica la NKB', () => {
    const antes = JSON.stringify(NORMAS);
    cadena();
    cadena([registro(1)]);
    cadena([registro(500)]);
    expect(JSON.stringify(NORMAS)).toBe(antes);
  });

  it('I-4 · el valor observado no cambia qué normas son candidatas', () => {
    const ids = (v: number) => cadena([registro(v)]).tarjetas.map((t) => t.normaId);
    expect(ids(1)).toEqual(ids(46));
    expect(ids(46)).toEqual(ids(500));
    const evaluadas = (v: number) => cadena([registro(v)]).comparabilidad.r1.evaluadas;
    expect(evaluadas(1)).toBe(evaluadas(500));
  });

  it('I-5 · TN-1 solo devuelve lo publicado, sin interpolar ni extrapolar', () => {
    const norma = NORMAS.find((n) => n.id === 'HGS-CO-UNI-M-22')!;
    if (norma.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    const publicados = norma.valores.percentiles;

    // Coincidencia literal.
    const exacto = cadena([registro(publicados[3].valor)]).tarjetas.find((t) => t.tipo === 'TN-1')!;
    expect(exacto.resumenResultado).toBe(`P${publicados[3].percentil}`);

    // Entre dos publicados: devuelve el par, nunca un percentil intermedio.
    const medio = (publicados[3].valor + publicados[4].valor) / 2;
    const entre = cadena([registro(medio)]).tarjetas.find((t) => t.tipo === 'TN-1')!;
    expect(entre.resumenResultado).toBe(
      `entre P${publicados[3].percentil} y P${publicados[4].percentil}`,
    );
    // Y ninguna marca inventada.
    const etiquetas = publicados.map((p) => `P${p.percentil}`);
    for (const m of entre.escala!.marcas) expect(etiquetas).toContain(m.etiqueta);

    // Fuera de rango: se declara, no se extrapola.
    const alto = cadena([registro(500)]).tarjetas.find((t) => t.tipo === 'TN-1')!;
    expect(alto.escala!.fueraDeRango).toBe(true);
    expect(alto.explicacion).toMatch(/No se extrapola/);
  });

  it('I-6 · TN-2 calcula z y nunca lo convierte en percentil', () => {
    const t = cadena().tarjetas.find((x) => x.tipo === 'TN-2')!;
    const norma = NORMAS.find((n) => n.id === t.normaId)!;
    if (norma.valores.tipo !== 'media_dispersion') throw new Error('tipo inesperado');
    const z = (46 - norma.valores.media) / norma.valores.desviacionTipica;
    expect(t.resumenResultado).toContain(z.toFixed(2).replace('.', ','));
    // La escala son desviaciones, no percentiles, y el texto lo niega.
    for (const m of t.escala!.marcas) expect(m.etiqueta).not.toMatch(/^P\d/);
    expect(t.explicacion).toMatch(/No representa un percentil/);
  });

  it('I-7 · no se elige «la mejor norma»: las dos permanecen', () => {
    const inf = cadena();
    expect(inf.tarjetas).toHaveLength(2);
    expect(inf.advertencias.join(' ')).toContain('no elige entre ellas');
    // Y en el orden de la NKB, no por calidad ni por tipo.
    const enNkb = NORMAS.filter((n) => inf.tarjetas.some((t) => t.normaId === n.id)).map((n) => n.id);
    expect(inf.tarjetas.map((t) => t.normaId)).toEqual(enNkb);
  });

  it('I-8 · el informe no produce ninguna categoría', () => {
    const JUICIO =
      /\b(bajo|alto|normal|anormal|excelente|malo|superior|inferior|deficiente|adecuado)\b/i;
    for (const v of [1, 46, 500]) {
      const inf = cadena([registro(v)]);
      const delMotor = [
        inf.portada.estadoCientifico,
        ...inf.resumen.map((r) => `${r.estado} ${r.evidencia}`),
        ...inf.tarjetas.flatMap((t) => [
          t.situacion,
          t.resumenResultado ?? '',
          t.explicacion ?? '',
          t.aria,
          ...t.evidencia.map((f) => f.estado),
        ]),
      ].join(' ');
      // Se descuentan las negaciones: «No representa un percentil» y «No se
      // extrapola» son prohibiciones, no categorías (H-02).
      expect(delMotor.replace(/\bNo\s+\w+[^.]*/g, ''), String(v)).not.toMatch(JUICIO);
    }
    expect('el resultado es alto').toMatch(JUICIO);
  });

  it('I-9 · EQ-3 sigue bloqueando la comparación', () => {
    const otroAparato = { ...METODO, dinamometro: 'takei-tkk-5101' };
    const inf = cadena([registro(46, otroAparato)]);
    expect(inf.tarjetas.every((t) => !t.normaId.startsWith('HGS-CO-UNI'))).toBe(true);
    const eq3 = inf.comparabilidad.r1.descartes.find((d) => d.motivoCorto === 'método EQ-3');
    expect(eq3).toBeDefined();
    expect(eq3!.naturaleza).toBe('no comparables');
  });

  it('I-10 · ES-2 se propaga hasta la tarjeta', () => {
    // Escolar de 15 años con el TKK 5101: la norma ENSIN, cuestionada.
    const escolar = atleta({ fechaNacimiento: '2011-01-17' });
    const inf = cadena([registro(30.7, { ...METODO, dinamometro: 'takei-tkk-5101' })], escolar);
    const t = inf.tarjetas.find((x) => x.normaId === 'HGS-CO-M-15')!;
    expect(t).toBeDefined();
    expect(t.estadoEvidencia).toBe('CUESTIONADA');
    expect(t.estadoNorma).toBe('Cuestionada');
    // Y sigue siendo utilizable: se comparó.
    expect(t.resumenResultado).not.toBeNull();
  });

  it('I-11 · el conflicto ENSIN se conserva, con su advertencia íntegra', () => {
    const escolar = atleta({ fechaNacimiento: '2011-01-17' });
    const inf = cadena([registro(30.7, { ...METODO, dinamometro: 'takei-tkk-5101' })], escolar);
    const t = inf.tarjetas.find((x) => x.normaId === 'HGS-CO-M-15')!;
    expect(t.conflicto).toBe('CONFLICTO_NO_DETERMINABLE');
    expect(t.advertencias.join(' ')).toContain('ENSIN-2015');
    const enNkb = NORMAS.find((n) => n.id === 'HGS-CO-M-15')!;
    expect(t.advertencias).toEqual(enNkb.advertencias);
    expect(inf.advertencias.join(' ')).toContain('no lo resuelve');
  });

  it('I-12 · no hay conversión automática de unidades', () => {
    // Las normas colombianas publican en kg. Con la misma medición declarada en
    // kgf el informe se produce igual —el sujeto está completo y hay medición—
    // pero SIN ninguna norma comparable: nadie convierte por su cuenta.
    const enKgf = cadena([
      registro(46, METODO, { valor: { tipo: 'continuo', valor: 46, unidad: 'kgf' } }),
    ]);
    expect(enKgf.tarjetas).toHaveLength(0);

    // Y el motivo lo dice, en lugar de callarlo.
    const motivos = enKgf.comparabilidad.r1.descartes.map((d) => d.motivo).join(' ');
    expect(motivos).toMatch(/unidad/i);

    // En kg, la misma medición sí compara: la diferencia es la unidad, no el valor.
    expect(cadena([registro(46)]).tarjetas).toHaveLength(2);
  });

  it('I-13 · misma entrada, mismo resultado', () => {
    expect(JSON.stringify(cadena())).toBe(JSON.stringify(cadena()));
    const html = () => renderToStaticMarkup(createElement(ReportViewV2, { informe: cadena() }));
    expect(html()).toBe(html());
  });
});

// ════════════════════════════════════════════════════════════════════════════
// ESTADOS DE DOMINIO, CON DATOS COMO LOS REALES
// ════════════════════════════════════════════════════════════════════════════

describe('los estados de dominio se distinguen entre sí', () => {
  const estado = (registros: readonly RegistroWorkspace[], a: Atleta) =>
    construirInformeNormativo({
      atleta: a,
      registros,
      hoyISO: HOY,
      portada: PORTADA,
      normas: NORMAS,
    }).estado;

  it('evaluación vacía → SIN_MEDICIONES', () => {
    expect(estado([], atleta())).toBe('SIN_MEDICIONES');
  });

  it('atleta histórico sin coordenadas → SUJETO_INCOMPLETO, con la edad viva', () => {
    const historico = atleta({ sexo: null, pais: null, estaturaCm: null });
    expect(estado([registro()], historico)).toBe('SUJETO_INCOMPLETO');
    expect(resolverSujeto(historico, HOY).sujeto.edad).toBe(22);
  });

  it('sin estatura, las normas que no la usan siguen comparándose', () => {
    const sinEstatura = atleta({ estaturaCm: null });
    expect(resolverSujeto(sinEstatura, HOY).estado).toBe('COMPLETO');
    expect(cadena([registro()], sinEstatura).tarjetas).toHaveLength(2);
  });

  it('expediente completo → informe', () => {
    expect(estado([registro()], atleta())).toBe('DISPONIBLE');
  });
});
