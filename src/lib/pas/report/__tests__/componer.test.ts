import { describe, expect, it } from 'vitest';
import {
  ETIQUETA_ESTADO,
  ETIQUETA_NIVEL,
  ORDEN_NIVELES,
  ORDEN_SECCIONES,
  SECCIONES,
  agruparPorCobertura,
  agruparPorDominio,
  agruparPorEvidencia,
  componerInforme,
  construirApendice,
  construirFilas,
  pruebasAplicadas,
  seccion,
  tituloSeccion,
} from '../index';
import { ESTADOS_CAPACIDAD } from '../../index';
import { analisisConDatos, analisisVacio, informeDe, parCompleto, parVacio } from './fixtures';

// ── Composición del informe (Sprint PAS-5.0) ───────────────────────────────
// El PRS reordena; no calcula. Estas pruebas comprueban esa frontera.

describe('secciones', () => {
  it('declara las 11 del encargo', () => {
    expect(SECCIONES).toHaveLength(11);
  });

  it('el orden es el del informe', () => {
    expect(ORDEN_SECCIONES).toEqual([
      'portada', 'resumen', 'perfil', 'dominios', 'interpretaciones',
      'cobertura', 'evidencia', 'metodologia', 'limitaciones', 'apendice', 'pie',
    ]);
  });

  it('portada y pie no se numeran', () => {
    expect(seccion('portada').numero).toBeNull();
    expect(seccion('pie').numero).toBeNull();
  });

  it('las nueve intermedias se numeran del 1 al 9', () => {
    const numeradas = SECCIONES.filter((s) => s.numero !== null);
    expect(numeradas.map((s) => s.numero)).toEqual([1, 2, 3, 4, 5, 6, 7, 8, 9]);
  });

  it('el título incluye el número cuando lo tiene', () => {
    expect(tituloSeccion('perfil')).toBe('2 · Perfil funcional');
    expect(tituloSeccion('portada')).toBe('Portada');
  });

  it('lanza ante una sección desconocida', () => {
    // @ts-expect-error se fuerza para comprobar el guard
    expect(() => seccion('inexistente')).toThrow(/sección desconocida/);
  });

  it('declara los cuatro niveles que el encargo enumera, y dos más', () => {
    for (const nivel of ['moderada', 'baja', 'insuficiente', 'no_documentado'] as const) {
      expect(ETIQUETA_NIVEL[nivel]).toBeTruthy();
    }
    expect(ORDEN_NIVELES).toHaveLength(6);
  });

  it('etiqueta los cinco estados del PAE', () => {
    for (const estado of ESTADOS_CAPACIDAD) {
      expect(ETIQUETA_ESTADO[estado], estado).toBeTruthy();
    }
  });

  it('ninguna etiqueta de estado es un juicio', () => {
    const textos = Object.values(ETIQUETA_ESTADO).join(' ').toLowerCase();
    for (const prohibido of ['bajo', 'alto', 'malo', 'bueno', 'déficit', 'riesgo']) {
      expect(textos).not.toContain(prohibido);
    }
  });
});

describe('construirFilas', () => {
  it('devuelve siempre las 20 capacidades', () => {
    const { analisis, interpretacion } = parVacio();
    expect(construirFilas(analisis, interpretacion)).toHaveLength(20);
  });

  it('conserva el orden del catálogo', () => {
    const { analisis, interpretacion } = parVacio();
    const filas = construirFilas(analisis, interpretacion);
    expect(filas[0].capacidad).toBe('A-01');
    expect(filas[19].capacidad).toBe('F-02');
  });

  it('el estado procede del PAE, sin recalcularse', () => {
    const { analisis, interpretacion } = parCompleto();
    const filas = construirFilas(analisis, interpretacion);
    for (const fila of filas) {
      const original = analisis.capacidades.find((c) => c.capacidad === fila.capacidad);
      expect(fila.estado).toBe(original?.estado);
      expect(fila.registrosElegibles).toBe(original?.registrosElegibles);
      expect(fila.ultimaFecha).toBe(original?.ultimaFecha);
    }
  });

  it('marca las dos reservadas', () => {
    const { analisis, interpretacion } = parVacio();
    const reservadas = construirFilas(analisis, interpretacion).filter((f) => f.reservada);
    expect(reservadas.map((f) => f.capacidad)).toEqual(['F-01', 'F-02']);
  });

  it('las pruebas salen de la traza del PAE', () => {
    const { analisis, interpretacion } = parCompleto();
    const a01 = construirFilas(analisis, interpretacion).find((f) => f.capacidad === 'A-01');
    expect(a01?.pruebas).toEqual(['P-01']);
  });

  it('el nivel de evidencia lo declara el PIE', () => {
    const { analisis, interpretacion } = parCompleto();
    const a01 = construirFilas(analisis, interpretacion).find((f) => f.capacidad === 'A-01');
    expect(a01?.nivel).toBe('moderada');
  });

  it('con la base vacía, ninguna capacidad tiene nivel declarado', () => {
    const analisis = analisisVacio();
    const informe = informeDe(analisis, { version: 'v0', fichas: [] });
    const filas = construirFilas(analisis, informe);
    expect(filas.every((f) => f.nivel === 'no_documentado')).toBe(true);
  });

  it('«insuficiente» no es «no documentado»: la base sí se pronunció', () => {
    // La PKB v1.0 declara nivel insuficiente para las correspondencias que
    // rechaza. Que rechace no significa que calle, y el informe distingue
    // ambas cosas.
    const { analisis, interpretacion } = parVacio();
    const filas = construirFilas(analisis, interpretacion);
    const insuficientes = filas.filter((f) => f.nivel === 'insuficiente');
    const sinDeclarar = filas.filter((f) => f.nivel === 'no_documentado');

    expect(insuficientes.length).toBeGreaterThan(0);
    expect(sinDeclarar.length).toBeGreaterThan(0);
  });

  it('las interpretaciones son las del PIE, sin modificar', () => {
    const { analisis, interpretacion } = parCompleto();
    const a01 = construirFilas(analisis, interpretacion).find((f) => f.capacidad === 'A-01');
    const original = interpretacion.porCapacidad.filter((i) =>
      i.capacidadesRelacionadas.includes('A-01')
    );
    expect(a01?.interpretaciones).toEqual(original);
  });
});

describe('agrupaciones', () => {
  const { analisis, interpretacion } = parCompleto();
  const filas = construirFilas(analisis, interpretacion);

  it('los dominios son los seis del catálogo', () => {
    expect(agruparPorDominio(filas, interpretacion)).toHaveLength(6);
  });

  it('toda capacidad cae en exactamente un dominio', () => {
    const grupos = agruparPorDominio(filas, interpretacion);
    const total = grupos.reduce((suma, g) => suma + g.capacidades.length, 0);
    expect(total).toBe(20);
  });

  it('el dominio F existe aunque solo tenga reservadas', () => {
    const grupos = agruparPorDominio(filas, interpretacion);
    const f = grupos.find((g) => g.dominio === 'F');
    expect(f?.capacidades).toHaveLength(2);
    expect(f?.capacidades.every((c) => c.reservada)).toBe(true);
  });

  it('cada dominio arrastra la interpretación del PIE si existe', () => {
    const grupos = agruparPorDominio(filas, interpretacion);
    const a = grupos.find((g) => g.dominio === 'A');
    expect(a?.interpretacion?.id).toContain(':A');
  });

  it('la cobertura reparte todas las capacidades sin solaparlas', () => {
    const grupos = agruparPorCobertura(filas);
    const total = grupos.reduce((suma, g) => suma + g.capacidades.length, 0);
    expect(total).toBe(20);
  });

  it('las reservadas van en su propio grupo, no en desconocidas', () => {
    const grupos = agruparPorCobertura(filas);
    const desconocidas = grupos.find((g) => g.clave === 'desconocidas');
    const reservadas = grupos.find((g) => g.clave === 'reservadas');
    expect(desconocidas?.capacidades.some((c) => c.reservada)).toBe(false);
    expect(reservadas?.capacidades).toHaveLength(2);
  });

  it('la cobertura declara los seis grupos aunque estén vacíos', () => {
    expect(agruparPorCobertura(filas)).toHaveLength(6);
  });

  it('la evidencia omite los niveles sin capacidades', () => {
    const grupos = agruparPorEvidencia(filas);
    expect(grupos.every((g) => g.capacidades.length > 0)).toBe(true);
  });

  it('la evidencia reparte las 20 capacidades', () => {
    const total = agruparPorEvidencia(filas).reduce((s, g) => s + g.capacidades.length, 0);
    expect(total).toBe(20);
  });

  it('los niveles salen en orden de mayor a menor respaldo', () => {
    const grupos = agruparPorEvidencia(filas);
    const indices = grupos.map((g) => ORDEN_NIVELES.indexOf(g.nivel));
    expect(indices).toEqual([...indices].sort((a, b) => a - b));
  });
});

describe('apéndice', () => {
  it('recoge las cuatro versiones del PIE', () => {
    const { analisis, interpretacion } = parCompleto();
    const apendice = construirApendice(analisis, interpretacion);
    expect(apendice.versiones).toEqual({
      pae: 'pae-1.0.0',
      pie: 'pie-1.0.0',
      pkb: 'pkb-1.0.0',
      catalogo: 'cat-1',
    });
  });

  it('la fecha es la del PAE, no la del reloj', () => {
    const { analisis, interpretacion } = parCompleto();
    expect(construirApendice(analisis, interpretacion).fecha).toBe('2026-08-02');
  });

  it('las pruebas salen de las trazas', () => {
    const pruebas = pruebasAplicadas(analisisConDatos());
    expect(pruebas.map((p) => p.pruebaId)).toEqual(['P-01']);
    expect(pruebas[0].capacidades).toEqual(['A-01']);
  });

  it('sin registros elegibles no hay pruebas aplicadas', () => {
    expect(pruebasAplicadas(analisisVacio())).toEqual([]);
  });

  it('van ordenadas por identificador', () => {
    const pruebas = pruebasAplicadas(analisisConDatos());
    expect(pruebas.map((p) => p.pruebaId)).toEqual([...pruebas.map((p) => p.pruebaId)].sort());
  });
});

describe('el PRS no recalcula ni modifica', () => {
  it('los totales son los del PIE, no un recuento propio', () => {
    const { analisis, interpretacion } = parCompleto();
    const vista = componerInforme(analisis, interpretacion);
    expect(vista.totales.capacidadesActivas).toBe(interpretacion.cobertura.capacidadesActivas);
    expect(vista.totales.caracterizadas).toBe(interpretacion.cobertura.caracterizadas);
    expect(vista.totales.desconocidas).toBe(interpretacion.cobertura.desconocidas);
  });

  it('no muta el análisis', () => {
    const { analisis, interpretacion } = parCompleto();
    const copia = structuredClone(analisis);
    componerInforme(analisis, interpretacion);
    expect(analisis).toEqual(copia);
  });

  it('no muta el informe de interpretación', () => {
    const { analisis, interpretacion } = parCompleto();
    const copia = structuredClone(interpretacion);
    componerInforme(analisis, interpretacion);
    expect(interpretacion).toEqual(copia);
  });

  it('es determinista', () => {
    const { analisis, interpretacion } = parCompleto();
    expect(componerInforme(analisis, interpretacion)).toEqual(
      componerInforme(analisis, interpretacion)
    );
  });

  it('no genera texto: toda interpretación existe en el PIE', () => {
    const { analisis, interpretacion } = parCompleto();
    const vista = componerInforme(analisis, interpretacion);
    const textosPIE = new Set(interpretacion.porCapacidad.map((i) => i.texto));
    for (const fila of vista.filas) {
      for (const item of fila.interpretaciones) expect(textosPIE.has(item.texto)).toBe(true);
    }
  });

  it('no inventa capacidades: todas están en el catálogo del PAE', () => {
    const { analisis, interpretacion } = parCompleto();
    const vista = componerInforme(analisis, interpretacion);
    const delPAE = new Set(analisis.capacidades.map((c) => c.capacidad));
    for (const fila of vista.filas) expect(delPAE.has(fila.capacidad)).toBe(true);
  });

  it('un perfil vacío se compone igual de bien', () => {
    const { analisis, interpretacion } = parVacio();
    const vista = componerInforme(analisis, interpretacion);
    expect(vista.filas).toHaveLength(20);
    expect(vista.totales.caracterizadas).toBe(0);
  });

  it('cambiar la PKB cambia el nivel mostrado, no el estado', () => {
    const analisis = analisisConDatos();
    const conPKB = componerInforme(analisis, informeDe(analisis));
    const sinPKB = componerInforme(analisis, informeDe(analisis, { version: 'v0', fichas: [] }));

    const a01Con = conPKB.filas.find((f) => f.capacidad === 'A-01');
    const a01Sin = sinPKB.filas.find((f) => f.capacidad === 'A-01');

    expect(a01Con?.nivel).toBe('moderada');
    expect(a01Sin?.nivel).toBe('no_documentado');
    expect(a01Con?.estado).toBe(a01Sin?.estado);
  });
});
