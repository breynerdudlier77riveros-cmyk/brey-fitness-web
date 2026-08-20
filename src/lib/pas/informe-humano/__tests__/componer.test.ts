// ── La frontera científico → humano (Sprint PAS-8) ─────────────────────────
//
// Los contratos inferiores ya están cubiertos por más de 1 800 tests: aquí no
// se repite la ciencia. Se protege **la traducción**, que es donde este sprint
// puede romper algo:
//
//   · que el valor observado cruce intacto;
//   · que la lectura normativa se transporte, no se recalcule;
//   · que los tres ejes no se mezclen;
//   · que «sin norma» no se convierta en «sin análisis»;
//   · que ningún código científico llegue a la superficie principal.

import { describe, expect, it } from 'vitest';

import { cargarNormas } from '@/lib/nie/nkb/cargador';
import { CATALOGO_PAS } from '@/features/performance-workspace/schemas/catalogo';
import { construirInformeAtleta } from '@/features/performance-workspace/services/informe-atleta';
import type { Atleta, RegistroWorkspace } from '@/features/performance-workspace/schemas/tipos';
import { MAPEOS } from '@/lib/pas/normativo';

import { type ObjetivoAtleta } from '../objetivos';
import { prepararEntradaIA, terminosProhibidosIA } from '../brey-ai';
import type { InformeHumano, MedicionPrevia } from '../index';

const NORMAS = cargarNormas();
const HOY = '2026-08-15';
const PRENSION = MAPEOS[0].pruebaId;

const METODO = {
  dinamometro: 'takei-t18',
  consolidacion: 'media_ambas_manos',
  posicion: 'bipedestacion',
  mano: 'ambas',
};

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

const registro = (
  pruebaId: string,
  valor: number,
  unidad: string,
  condiciones: Record<string, string> = {},
  id = 'r1',
): RegistroWorkspace => ({
  id,
  evaluacionId: 'e1',
  pruebaId,
  fecha: HOY,
  valor: { tipo: 'continuo', valor, unidad },
  estado: 'vigente',
  condiciones,
  componentes: {},
  precondicionesCumplidas: true,
  patron: null,
  observaciones: null,
  createdAt: HOY,
});

function informe(
  registros: readonly RegistroWorkspace[],
  previas: readonly MedicionPrevia[] = [],
  objetivos: readonly ObjetivoAtleta[] = [],
  a: Atleta = atleta(),
): InformeHumano {
  const r = construirInformeAtleta({
    atleta: a,
    registros,
    previas,
    objetivos,
    hoyISO: HOY,
    fecha: HOY,
    codigo: 'EVAL-1',
    edad: 22,
    sexo: 'M',
    pesoKg: null,
    catalogo: CATALOGO_PAS,
    normas: NORMAS,
  });
  if (r.estado !== 'DISPONIBLE') throw new Error(`esperaba DISPONIBLE, llegó ${r.estado}`);
  return r.informe;
}

/** El caso real: prensión de 46 kg con el método declarado. */
const CASO_REAL = [registro(PRENSION, 46, 'kg', METODO)];

// ════════════════════════════════════════════════════════════════════════════
// LO HUMANO SUSTITUYE AL CÓDIGO
// ════════════════════════════════════════════════════════════════════════════

describe('el atleta no ve códigos científicos', () => {
  const i = informe(CASO_REAL);

  it('el resultado se llama por su nombre, no P-03', () => {
    expect(i.resultados[0].nombre).toBe('Dinamometría de agarre');
    expect(i.resultados[0].nombre).not.toBe(PRENSION);
  });

  it('el dominio sale del catálogo existente, no de una taxonomía nueva', () => {
    // P-03 contribuye a A-05, del dominio A.
    expect(i.resultados[0].dominio).toBe('Producción de fuerza');
  });

  it('la superficie principal no contiene ningún identificador científico', () => {
    const principal = i.resultados.map((r) => ({
      nombre: r.nombre,
      dominio: r.dominio,
      valor: r.valorObservado,
      unidad: r.unidad,
      referencia: r.referencia,
      tendencia: r.tendencia,
      objetivo: r.objetivo,
    }));
    const texto = JSON.stringify(principal);
    for (const codigo of ['P-03', 'TN-1', 'TN-2', 'EQ-3', 'ES-1', 'ES-2', 'HGS-CO']) {
      expect(texto, codigo).not.toContain(codigo);
    }
  });

  it('pero los códigos siguen existiendo, en los detalles', () => {
    const d = i.resultados[0].detalles;
    expect(d.pruebaId).toBe(PRENSION);
    expect(d.normaId).toMatch(/^HGS-/);
    expect(d.tipoNorma).toMatch(/^TN-/);
    // Y con ellos toda la evidencia: nada se ha perdido.
    expect(d.nCelda).not.toBeNull();
    expect(d.calidad).not.toBeNull();
    expect(d.estadoNorma).not.toBeNull();
    expect(d.referencia).not.toBeNull();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LA TRADUCCIÓN NO INVENTA CIENCIA
// ════════════════════════════════════════════════════════════════════════════

describe('la capa humana transporta, no recalcula', () => {
  it('el valor observado cruza intacto', () => {
    for (const v of [46, 20.5, 0.1, 300]) {
      for (const r of informe([registro(PRENSION, v, 'kg', METODO)]).resultados) {
        expect(r.valorObservado).toBe(v);
        expect(r.unidad).toBe('kg');
      }
    }
  });

  it('la lectura normativa es la que compuso Report v2', () => {
    const r = informe(CASO_REAL).resultados.find((x) => x.detalles.tipoNorma === 'TN-1')!;
    expect(r.referencia.resumen).toBe('entre P90 y P97');
    expect(r.referencia.explicacion).toMatch(/no se interpola/);
  });

  it('no interpola: nunca aparece un percentil que la fuente no publique', () => {
    const publicados = /P(3|5|10|25|50|75|90|95|97)\b/;
    for (const r of informe(CASO_REAL).resultados) {
      const enResumen = (r.referencia.resumen ?? '').match(/P\d+/g) ?? [];
      for (const p of enResumen) expect(p, p).toMatch(publicados);
    }
  });

  it('no convierte z en percentil', () => {
    const tn2 = informe(CASO_REAL).resultados.find((x) => x.detalles.tipoNorma === 'TN-2')!;
    expect(tn2.referencia.clase).toBe('distancia_media');
    expect(tn2.referencia.resumen).toMatch(/^z = /);
    expect(tn2.referencia.explicacion).toMatch(/No representa un percentil/);
  });

  it('no clasifica: ningún texto propio emite una categoría', () => {
    const CATEGORIA =
      /(?<![-\w])(bajo|alto|normal|anormal|excelente|deficiente|adecuado|apto)(?![-\w])/i;
    const i = informe(CASO_REAL);
    const propio = [
      i.estadoGeneral,
      ...i.dominios.map((d) => d.nombre),
      ...i.resultados.flatMap((r) => [
        r.nombre,
        r.dominio ?? '',
        r.referencia.explicacion ?? '',
        r.tendencia.motivo ?? '',
        r.objetivo.motivo ?? '',
      ]),
    ].join(' ');
    expect(propio.replace(/\bNo\s+\w+[^.]*/g, '')).not.toMatch(CATEGORIA);
    expect('el resultado es alto').toMatch(CATEGORIA);
  });

  it('dos normas comparables producen dos resultados: no se elige', () => {
    const i = informe(CASO_REAL);
    expect(i.resultados).toHaveLength(2);
    expect(i.resultados.map((r) => r.detalles.tipoNorma).sort()).toEqual(['TN-1', 'TN-2']);
    // Los dos describen la MISMA medición.
    expect(new Set(i.resultados.map((r) => r.valorObservado)).size).toBe(1);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// SIN NORMA NO ES SIN ANÁLISIS
// ════════════════════════════════════════════════════════════════════════════

describe('una medición sin referencia sigue siendo un resultado', () => {
  const sinNorma = [registro('P-01', 120, 'kg', {}, 'r2')];

  it('aparece en el informe, no desaparece', () => {
    const i = informe(sinNorma);
    expect(i.resultados).toHaveLength(1);
    expect(i.resultados[0].valorObservado).toBe(120);
  });

  it('la referencia se declara ausente, con su motivo', () => {
    const r = informe(sinNorma).resultados[0];
    expect(r.referencia.estado).toBe('SIN_REFERENCIA');
    expect(r.referencia.resumen).toBeNull();
    expect(r.referencia.explicacion).toMatch(/No existe actualmente una referencia normativa compatible/);
  });

  it('y dice explícitamente que sirve para seguimiento longitudinal', () => {
    expect(informe(sinNorma).resultados[0].referencia.explicacion).toMatch(
      /seguimiento longitudinal/,
    );
  });

  it('PAS-9 · distingue por qué no hay referencia', () => {
    // Prueba fuera del mapeo: la base no cubre la variable.
    expect(informe(sinNorma).resultados[0].referencia.estado).toBe('SIN_REFERENCIA');

    // Prensión sin método declarado: no se sabe si alguna corresponde.
    const sinMetodo = informe([registro(PRENSION, 46, 'kg', {})]).resultados[0];
    expect(sinMetodo.referencia.estado).toBe('NO_DETERMINABLE');

    // Prensión con otro dinamómetro: hay normas, pero ninguna comparable.
    const otroAparato = informe([
      registro(PRENSION, 46, 'kg', { ...METODO, dinamometro: 'camry-digital' }),
    ]).resultados[0];
    expect(otroAparato.referencia.estado).toBe('NO_COMPARABLE');

    // Y los tres son distintos, que es el punto.
    expect(
      new Set([
        informe(sinNorma).resultados[0].referencia.estado,
        sinMetodo.referencia.estado,
        otroAparato.referencia.estado,
      ]).size,
    ).toBe(3);
  });

  it('conserva su nombre humano y su valor', () => {
    const r = informe(sinNorma).resultados[0];
    expect(r.nombre).toContain('1RM');
    expect(r.unidad).toBe('kg');
  });

  it('«sin norma» y «con norma» conviven en el mismo informe', () => {
    const i = informe([...CASO_REAL, ...sinNorma]);
    const estados = i.resultados.map((r) => r.referencia.estado);
    expect(estados).toContain('DISPONIBLE');
    expect(estados).toContain('SIN_REFERENCIA');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LOS TRES EJES NO SE MEZCLAN
// ════════════════════════════════════════════════════════════════════════════

describe('eje longitudinal', () => {
  const previa: MedicionPrevia = {
    pruebaId: PRENSION,
    valor: 42,
    unidad: 'kg',
    fecha: '2026-05-01',
    condiciones: METODO,
  };

  it('compara con la medición anterior del propio atleta', () => {
    const r = informe(CASO_REAL, [previa]).resultados[0];
    expect(r.tendencia.disponible).toBe(true);
    expect(r.tendencia.valorAnterior).toBe(42);
    expect(r.tendencia.cambioAbsoluto).toBe(4);
  });

  it('el cambio relativo es proporción, no porcentaje ya formateado', () => {
    const r = informe(CASO_REAL, [previa]).resultados[0];
    expect(r.tendencia.cambioRelativo).toBeCloseTo(4 / 42, 10);
  });

  it('NO compara mediciones tomadas con otro método', () => {
    const otroAparato = { ...previa, condiciones: { ...METODO, dinamometro: 'camry-digital' } };
    const r = informe(CASO_REAL, [otroAparato]).resultados[0];
    expect(r.tendencia.disponible).toBe(false);
    expect(r.tendencia.motivo).toMatch(/Hay mediciones anteriores/);
    expect(r.tendencia.motivo).toMatch(/método de medición cambió/);
  });

  it('NO compara unidades distintas, y NO lo llama ausencia de historial', () => {
    const enKgf = { ...previa, unidad: 'kgf' };
    const r = informe(CASO_REAL, [enKgf]).resultados[0];
    expect(r.tendencia.disponible).toBe(false);
    // PAS-8 decia aqui «No hay ninguna medicion anterior de esta prueba», que
    // era sencillamente falso: las hay, en otra unidad.
    expect(r.tendencia.motivo).toMatch(/Hay mediciones anteriores/);
    expect(r.tendencia.motivo).toMatch(/unidad/);
    expect(r.tendencia.motivo).not.toMatch(/No hay ninguna medicion anterior/);
  });

  it('la serie acompana a la tendencia, y no puede contradecirla', () => {
    const antigua = { ...previa, fecha: '2026-01-01', valor: 40 };
    const r = informe(CASO_REAL, [antigua, previa]).resultados[0];
    expect(r.serie.puntos.map((p) => p.valor)).toEqual([40, 42, 46]);
    expect(r.serie.rupturas).toEqual([]);
    // El penultimo punto del tramo actual ES la medicion anterior de la tarjeta.
    const tramo = r.serie.tramoActual!;
    expect(tramo.puntos[tramo.puntos.length - 2].valor).toBe(r.tendencia.valorAnterior);
  });

  it('la serie se parte donde la tendencia se niega a comparar', () => {
    const otroAparato = { ...previa, condiciones: { ...METODO, dinamometro: 'camry-digital' } };
    const r = informe(CASO_REAL, [otroAparato]).resultados[0];
    expect(r.tendencia.disponible).toBe(false);
    expect(r.serie.rupturas).toHaveLength(1);
    expect(r.serie.rupturas[0].motivo).toBe('metodo');
    // Ninguna medicion se pierde por no ser comparable.
    expect(r.serie.puntos).toHaveLength(2);
  });

  it('una medicion del mismo dia no se convierte en «la anterior»', () => {
    const mismoDia = { ...previa, fecha: HOY };
    const r = informe(CASO_REAL, [mismoDia]).resultados[0];
    expect(r.tendencia.disponible).toBe(false);
    expect(r.serie.puntos).toHaveLength(1);
  });

  it('sin histórico lo dice, y no lo confunde con un cambio de cero', () => {
    const r = informe(CASO_REAL).resultados[0];
    expect(r.tendencia.disponible).toBe(false);
    expect(r.tendencia.cambioAbsoluto).toBeNull();
    expect(r.tendencia.motivo).toMatch(/No hay ninguna medición anterior/);
  });

  it('la tendencia NO contamina la referencia normativa', () => {
    const conHistorial = informe(CASO_REAL, [previa]).resultados[0];
    const sinHistorial = informe(CASO_REAL).resultados[0];
    // Mejorar 4 kg no cambia dónde cae respecto a la población.
    expect(conHistorial.referencia).toEqual(sinHistorial.referencia);
  });
});

describe('eje de objetivo', () => {
  const objetivo: ObjetivoAtleta = {
    id: 'o1',
    atletaId: 'a1',
    pruebaId: 'P-01',
    tipo: 'aumentar',
    nombre: 'Aumentar 1RM de sentadilla',
    valorInicial: 120,
    fechaPuntoDePartida: '2026-01-15',
    valorObjetivo: 140,
    rango: null,
    unidad: 'kg',
    prioridad: 'alta',
    fechaInicio: '2026-01-15',
    fechaObjetivo: null,
    estado: 'activo',
    notas: null,
  };

  it('relaciona el objetivo con su prueba', () => {
    const r = informe([registro('P-01', 130, 'kg', {}, 'r2')], [], [objetivo]).resultados[0];
    expect(r.objetivo.disponible).toBe(true);
    expect(r.objetivo.objetivo!.nombre).toBe('Aumentar 1RM de sentadilla');
    expect(r.objetivo.progreso).toBeCloseTo(0.5, 10);
  });

  it('sin valor inicial no inventa un porcentaje', () => {
    const sinInicial = { ...objetivo, valorInicial: null };
    const r = informe([registro('P-01', 130, 'kg', {}, 'r2')], [], [sinInicial]).resultados[0];
    expect(r.objetivo.disponible).toBe(true);
    expect(r.objetivo.progreso).toBeNull();
    expect(r.objetivo.motivo).toMatch(/no declara desde qué valor se partía/);
  });

  it('un objetivo de otra prueba no se cuela', () => {
    const r = informe(CASO_REAL, [], [objetivo]).resultados[0];
    expect(r.objetivo.disponible).toBe(false);
  });

  it('con dos objetivos activos no elige: lo declara', () => {
    const otro = { ...objetivo, id: 'o2' };
    const r = informe([registro('P-01', 130, 'kg', {}, 'r2')], [], [objetivo, otro]).resultados[0];
    expect(r.objetivo.disponible).toBe(false);
    expect(r.objetivo.motivo).toMatch(/más de un objetivo activo/);
  });

  it('el objetivo NO contamina la referencia normativa', () => {
    const conObjetivo = informe([registro('P-01', 130, 'kg', {}, 'r2')], [], [objetivo]).resultados[0];
    const sinObjetivo = informe([registro('P-01', 130, 'kg', {}, 'r2')]).resultados[0];
    expect(conObjetivo.referencia).toEqual(sinObjetivo.referencia);
  });

  it('un objetivo sin medición aparece aparte, no como resultado', () => {
    const i = informe(CASO_REAL, [], [objetivo]);
    expect(i.objetivos.map((o) => o.id)).toContain('o1');
    expect(i.resultados.every((r) => r.pruebaId !== 'P-01')).toBe(true);
  });
});

/** Frases que señalan al atleta en vez de al dato ausente. */
const CULPA = /(?<![-\w])(no has|deberías|deberias|tu culpa|incumpl\w*)(?![-\w])/i;

describe('objetivos de mantenimiento · §13', () => {
  const mantener = (over: Partial<ObjetivoAtleta> = {}): ObjetivoAtleta => ({
    id: 'om', atletaId: 'a1', pruebaId: 'P-06', tipo: 'mantener',
    nombre: 'Mantener el sit-and-reach entre 20 y 26 cm',
    valorInicial: null, fechaPuntoDePartida: null,
    valorObjetivo: null, rango: { min: 20, max: 26 },
    unidad: 'cm', prioridad: 'media', fechaInicio: '2026-01-15',
    fechaObjetivo: null, estado: 'activo', notas: null,
    ...over,
  });

  const rel = (o: ObjetivoAtleta, valor: number) =>
    informe([registro(o.pruebaId, valor, o.unidad, {}, 'r7')], [], [o]).resultados[0].objetivo;

  it('funciona en una prueba SIN dirección declarada, que es su razón de ser', () => {
    // P-06 no declara dirección: más rango no es inequívocamente mejor. Pero
    // «seguir entre 20 y 26» no necesita saber hacia dónde se mejora.
    const r = rel(mantener(), 23);
    expect(r.disponible).toBe(true);
    expect(r.mantenimiento).toBe('dentro');
    expect(r.motivoCodigo).toBeNull();
  });

  it('no produce porcentaje: mantenerse no es recorrer una fracción', () => {
    expect(rel(mantener(), 23).progreso).toBeNull();
    expect(rel(mantener(), 23).superado).toBe(false);
  });

  it('distingue los dos lados de fuera', () => {
    expect(rel(mantener(), 30).mantenimiento).toBe('por_encima');
    expect(rel(mantener(), 15).mantenimiento).toBe('por_debajo');
  });

  it('los extremos del rango están dentro', () => {
    expect(rel(mantener(), 20).mantenimiento).toBe('dentro');
    expect(rel(mantener(), 26).mantenimiento).toBe('dentro');
  });

  it('sin rango declarado NO se inventa uno', () => {
    const r = rel(mantener({ rango: null }), 23);
    expect(r.mantenimiento).toBeNull();
    expect(r.motivoCodigo).toBe('SIN_RANGO_DEFINIDO');
  });

  it('con el rango del revés no se le da la vuelta', () => {
    const r = rel(mantener({ rango: { min: 26, max: 20 } }), 23);
    expect(r.motivoCodigo).toBe('RANGO_INVERTIDO');
  });

  it('«mantener» NUNCA se convierte en «aumentar»', () => {
    // La prohibición literal del §13. Si se tradujera, 30 cm sobre un rango de
    // 20–26 saldría como objetivo cumplido en vez de como fuera de rango.
    const r = rel(mantener(), 30);
    expect(r.progreso).not.toBe(1);
    expect(r.mantenimiento).toBe('por_encima');
  });
});

// ============================================================================
// PANEL DE OBJETIVOS Y RESUMEN · §9 · §22 · §25
// ============================================================================

const objetivoBase = (over: Partial<ObjetivoAtleta>): ObjetivoAtleta => ({
  id: 'o', atletaId: 'a1', pruebaId: 'P-01', tipo: 'aumentar', nombre: 'x',
  valorInicial: 100, fechaPuntoDePartida: '2026-01-15', valorObjetivo: 140,
  rango: null, unidad: 'kg', prioridad: 'media', fechaInicio: '2026-01-15',
  fechaObjetivo: null, estado: 'activo', notas: null,
  ...over,
});

describe('el panel de objetivos clasifica sin elegir', () => {
  const panelDe = (objetivos: readonly ObjetivoAtleta[]) =>
    informe(CASO_REAL, [], objetivos).panelObjetivos;

  it('separa por estado', () => {
    const p = panelDe([
      objetivoBase({ id: 'a', estado: 'activo' }),
      objetivoBase({ id: 'b', estado: 'cumplido', pruebaId: 'P-04' }),
      objetivoBase({ id: 'c', estado: 'pausado', pruebaId: 'P-07' }),
      objetivoBase({ id: 'd', estado: 'abandonado', pruebaId: 'P-10' }),
    ]);
    expect(p.activos.map((o) => o.id)).toEqual(['a']);
    expect(p.alcanzados.map((o) => o.id)).toEqual(['b']);
    expect(p.pausados.map((o) => o.id)).toEqual(['c']);
  });

  it('«alcanzado» lo marca el profesional: el sistema no lo deduce del valor', () => {
    // El objetivo se cumple con creces y sigue activo. Darlo por cumplido es
    // una decisión, y esta capa no la toma.
    const p = panelDe([objetivoBase({ id: 'a', pruebaId: PRENSION, valorObjetivo: 40 })]);
    expect(p.alcanzados).toEqual([]);
    expect(p.activos.map((o) => o.id)).toEqual(['a']);
  });

  it('los activos sin medición se listan aparte (§23)', () => {
    const p = panelDe([objetivoBase({ id: 'a', pruebaId: 'P-04' })]);
    expect(p.sinDatos.map((o) => o.id)).toEqual(['a']);
  });

  it('un objetivo CON medición no cae en «sin datos»', () => {
    const p = panelDe([objetivoBase({ id: 'a', pruebaId: PRENSION })]);
    expect(p.sinDatos).toEqual([]);
  });

  it('los activos sin punto de partida se listan aparte', () => {
    const p = panelDe([objetivoBase({ id: 'a', valorInicial: null })]);
    expect(p.sinPuntoDePartida.map((o) => o.id)).toEqual(['a']);
  });

  it('«sin datos» y «sin punto de partida» SON vistas: un objetivo cae en las dos', () => {
    const p = panelDe([objetivoBase({ id: 'a', pruebaId: 'P-04', valorInicial: null })]);
    expect(p.sinDatos.map((o) => o.id)).toEqual(['a']);
    expect(p.sinPuntoDePartida.map((o) => o.id)).toEqual(['a']);
    expect(p.activos).toHaveLength(1);
  });

  it('con dos activos en la misma prueba lo declara y no elige (§25)', () => {
    const p = panelDe([objetivoBase({ id: 'a' }), objetivoBase({ id: 'b' })]);
    expect(p.enConflicto).toHaveLength(1);
    expect(p.enConflicto[0].pruebaId).toBe('P-01');
    expect(p.enConflicto[0].objetivos.map((o) => o.id)).toEqual(['a', 'b']);
  });

  it('los abandonados no aparecen en ninguna lista', () => {
    const p = panelDe([objetivoBase({ id: 'z', estado: 'abandonado' })]);
    for (const lista of [p.activos, p.alcanzados, p.pausados, p.sinDatos, p.sinPuntoDePartida]) {
      expect(lista).toEqual([]);
    }
  });
});

describe('el resumen cuenta, no puntúa', () => {
  it('cuenta PRUEBAS distintas, no tarjetas', () => {
    // Una medición comparada por dos normas produce dos resultados y sigue
    // siendo UNA prueba. Contar tarjetas inflaría la cifra de cabecera.
    const i = informe(CASO_REAL);
    expect(i.resumen.pruebasEvaluadas).toBe(new Set(i.resultados.map((r) => r.pruebaId)).size);
    expect(i.resumen.resultados).toBe(i.resultados.length);
  });

  it('con referencia y con evolución salen de los propios resultados', () => {
    const previa: MedicionPrevia = {
      pruebaId: PRENSION, valor: 42, unidad: 'kg', fecha: '2026-05-01', condiciones: METODO,
    };
    const i = informe(CASO_REAL, [previa]);
    expect(i.resumen.conReferencia).toBe(
      i.resultados.filter((r) => r.referencia.estado === 'DISPONIBLE').length,
    );
    expect(i.resumen.conEvolucion).toBe(i.resultados.filter((r) => r.tendencia.disponible).length);
  });

  it('NO existe ninguna puntuación global', () => {
    const i = informe(CASO_REAL);
    const claves = Object.keys(i.resumen);
    for (const prohibida of ['puntuacion', 'score', 'nivel', 'global', 'indice', 'media']) {
      expect(claves.some((k) => k.toLowerCase().includes(prohibida)), prohibida).toBe(false);
    }
  });

  it('alerta de objetivos sin punto de partida, contando cuántos', () => {
    const i = informe(CASO_REAL, [], [objetivoBase({ id: 'a', valorInicial: null })]);
    const a = i.resumen.alertas.find((x) => x.codigo === 'OBJETIVO_SIN_PUNTO_DE_PARTIDA');
    expect(a).toBeDefined();
    expect(a!.total).toBe(1);
  });

  it('alerta de objetivos en conflicto', () => {
    const i = informe(CASO_REAL, [], [objetivoBase({ id: 'a' }), objetivoBase({ id: 'b' })]);
    expect(i.resumen.alertas.map((x) => x.codigo)).toContain('OBJETIVOS_EN_CONFLICTO');
  });

  it('alerta de serie interrumpida cuando cambió el método', () => {
    const otroAparato: MedicionPrevia = {
      pruebaId: PRENSION, valor: 42, unidad: 'kg', fecha: '2026-05-01',
      condiciones: { ...METODO, dinamometro: 'camry-digital' },
    };
    const i = informe(CASO_REAL, [otroAparato]);
    expect(i.resumen.alertas.map((x) => x.codigo)).toContain('SERIE_INTERRUMPIDA');
  });

  it('sin nada que señalar no se inventan alertas', () => {
    expect(informe(CASO_REAL).resumen.alertas).toEqual([]);
  });

  it('ninguna alerta culpa al atleta', () => {
    const i = informe(
      CASO_REAL, [],
      [objetivoBase({ id: 'a', valorInicial: null }), objetivoBase({ id: 'b' })],
    );
    expect(i.resumen.alertas.length).toBeGreaterThan(0);
    for (const a of i.resumen.alertas) {
      expect(a.texto, a.codigo).not.toMatch(CULPA);
      expect(a.texto.length, a.codigo).toBeGreaterThan(40);
    }
  });

  it('control positivo: esa comprobación reconoce una frase que sí culpa', () => {
    expect('deberías haberlo medido tú').toMatch(CULPA);
  });
});

describe('el progreso usa la dirección del catálogo, no el tipo del objetivo', () => {
  // P-01 (1RM sentadilla) es `mayor_mejor` en el catálogo; P-10, `menor_mejor`.
  const objetivoP01 = (over: Partial<ObjetivoAtleta> = {}): ObjetivoAtleta => ({
    id: 'o1', atletaId: 'a1', pruebaId: 'P-01', tipo: 'aumentar',
    nombre: 'Aumentar 1RM de sentadilla', valorInicial: 100, fechaPuntoDePartida: '2026-01-15',
    valorObjetivo: 140, rango: null, unidad: 'kg', prioridad: 'alta',
    fechaInicio: '2026-01-15', fechaObjetivo: null, estado: 'activo', notas: null,
    ...over,
  });

  const rel = (o: ObjetivoAtleta, valor = 120, unidad = 'kg') =>
    informe([registro(o.pruebaId, valor, unidad, {}, 'r9')], [], [o]).resultados[0].objetivo;

  it('calcula el avance cuando dirección e intención coinciden', () => {
    const r = rel(objetivoP01());
    expect(r.progreso).toBeCloseTo(0.5, 10);
    expect(r.motivoCodigo).toBeNull();
    expect(r.superado).toBe(false);
  });

  it('rebasar el objetivo se declara en vez de perderse en el tope', () => {
    const r = rel(objetivoP01(), 200);
    expect(r.progreso).toBe(1);
    expect(r.superado).toBe(true);
  });

  it('llegar justo al objetivo es alcanzarlo, no superarlo', () => {
    const r = rel(objetivoP01(), 140);
    expect(r.progreso).toBe(1);
    expect(r.superado).toBe(false);
  });

  it('retroceder se acota a cero, sin porcentaje negativo', () => {
    expect(rel(objetivoP01(), 80).progreso).toBe(0);
  });

  it('sin punto de partida no se toma la primera medición del histórico', () => {
    const r = rel(objetivoP01({ valorInicial: null }));
    expect(r.progreso).toBeNull();
    expect(r.motivoCodigo).toBe('SIN_PUNTO_DE_PARTIDA');
  });

  it('si el objetivo contradice la dirección de la prueba, no se calcula', () => {
    // «Reducir» un 1RM, que en el catálogo mejora hacia arriba.
    const r = rel(objetivoP01({ tipo: 'reducir' }));
    expect(r.progreso).toBeNull();
    expect(r.motivoCodigo).toBe('DIRECCION_CONTRADICE_OBJETIVO');
    expect(r.disponible).toBe(true);
  });

  it('«alcanzar» ya no devuelve null: la dirección la pone el catálogo', () => {
    const r = rel(objetivoP01({ tipo: 'alcanzar' }));
    expect(r.progreso).toBeCloseTo(0.5, 10);
  });

  it('en una prueba sin dirección declarada se dice, y se dice por qué', () => {
    // P-06 (sit-and-reach) no declara dirección: más rango no es mejor.
    const r = rel(
      objetivoP01({ pruebaId: 'P-06', valorInicial: 10, valorObjetivo: 20, unidad: 'cm' }),
      15,
      'cm',
    );
    expect(r.progreso).toBeNull();
    expect(r.motivoCodigo).toBe('SIN_DIRECCION_DECLARADA');
  });

  it('objetivo y medición en unidades distintas: no se convierte', () => {
    const r = rel(objetivoP01({ unidad: 'lb' }));
    expect(r.progreso).toBeNull();
    expect(r.motivoCodigo).toBe('UNIDADES_INCOMPATIBLES');
  });

  it('el motivo llega íntegro desde el motor, sin reescribir', () => {
    for (const o of [objetivoP01({ valorInicial: null }), objetivoP01({ tipo: 'reducir' })]) {
      const r = rel(o);
      expect(r.motivo!.length).toBeGreaterThan(40);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// EL CONTRATO DE BREY AI
// ════════════════════════════════════════════════════════════════════════════

describe('la entrada de BREY AI no permite fabricar ciencia', () => {
  const entrada = prepararEntradaIA(informe(CASO_REAL));

  it('lleva la lectura ya redactada', () => {
    expect(entrada.resultados[0].referencia).toBe('entre P90 y P97');
  });

  it('NO lleva los percentiles publicados, ni media ni desviación', () => {
    const texto = JSON.stringify(entrada);
    // Con estos números el modelo podría interpolar un percentil nuevo.
    expect(texto).not.toContain('45.6');
    expect(texto).not.toContain('49.7');
    expect(texto).not.toMatch(/desviacionTipica|"media"/);
  });

  it('NO lleva detalles técnicos ni identificadores de norma', () => {
    const texto = JSON.stringify(entrada);
    expect(texto).not.toContain('HGS-');
    expect(texto).not.toMatch(/TN-[12]/);
    expect(texto).not.toContain('nCelda');
  });

  it('es una proyección que quita, no que añade', () => {
    const completo = JSON.stringify(informe(CASO_REAL)).length;
    expect(JSON.stringify(entrada).length).toBeLessThan(completo);
  });

  it('el filtro de vocabulario detecta una clasificación', () => {
    expect(terminosProhibidosIA('Tu resultado es alto para tu edad')).toContain('alto');
    expect(terminosProhibidosIA('Presentas riesgo de lesión')).toContain('riesgo');
  });

  it('pero no marca una negación, que es una advertencia correcta', () => {
    expect(terminosProhibidosIA('No puede afirmarse que sea alto')).toEqual([]);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// ESTADOS Y DETERMINISMO
// ════════════════════════════════════════════════════════════════════════════

describe('estados de la aplicación', () => {
  const construir = (registros: Parameters<typeof construirInformeAtleta>[0]['registros'], a = atleta()) =>
    construirInformeAtleta({
      atleta: a, registros, previas: [], objetivos: [], hoyISO: HOY,
      pesoKg: null,
      fecha: HOY, codigo: 'c', edad: 22, sexo: 'M', catalogo: CATALOGO_PAS, normas: NORMAS,
    }).estado;

  it('sin mediciones → SIN_MEDICIONES', () => {
    expect(construir([])).toBe('SIN_MEDICIONES');
  });

  it('sujeto incompleto → SUJETO_INCOMPLETO', () => {
    expect(construir(CASO_REAL, atleta({ sexo: null, pais: null }))).toBe('SUJETO_INCOMPLETO');
  });

  it('fallo al leer los registros → ERROR_TECNICO, no «sin mediciones»', () => {
    expect(construir({ estado: 'ERROR', mensaje: 'timeout', codigo: '57014' })).toBe(
      'ERROR_TECNICO',
    );
  });

  it('los cuatro estados se distinguen', () => {
    const estados = [
      construir({ estado: 'ERROR', mensaje: 'x', codigo: null }),
      construir([]),
      construir(CASO_REAL, atleta({ sexo: null })),
      construir(CASO_REAL),
    ];
    expect(new Set(estados).size).toBe(4);
  });
});

describe('determinismo y agrupación', () => {
  it('mismo caso, mismo informe', () => {
    expect(JSON.stringify(informe(CASO_REAL))).toBe(JSON.stringify(informe(CASO_REAL)));
  });

  it('los dominios son una vista: no pierden ningún resultado', () => {
    const i = informe([...CASO_REAL, registro('P-01', 120, 'kg', {}, 'r2')]);
    const enDominios = i.dominios.flatMap((d) => d.resultados);
    expect(enDominios).toHaveLength(i.resultados.length);
    expect(new Set(enDominios)).toEqual(new Set(i.resultados));
  });

  it('el estado general cuenta, no juzga', () => {
    expect(informe(CASO_REAL).estadoGeneral).toMatch(/\d+ de \d+ resultados/);
    expect(informe([registro('P-01', 120, 'kg', {}, 'r2')]).estadoGeneral).toMatch(/Ninguna/);
  });
});
