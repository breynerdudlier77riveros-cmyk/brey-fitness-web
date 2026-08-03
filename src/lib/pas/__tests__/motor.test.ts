import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  CATALOGO_VACIO,
  VERSION_MOTOR,
  analisisVacio,
  analizarEvaluacion,
  analizarRendimiento,
  indexarCatalogo,
  indexarCobertura,
} from '../index';
import { HOY, catalogo, contrib, escenarioEvaluada, evaluacion, prueba, registro } from './fixtures';

// ── Orquestador, determinismo y pureza de la capa (Sprint PAS-2.0) ─────────

const DIRECTORIO = join(dirname(fileURLToPath(import.meta.url)), '..');

describe('orquestador', () => {
  it('analizarRendimiento devuelve un análisis completo', () => {
    const analisis = analizarRendimiento(escenarioEvaluada());
    expect(analisis.atletaId).toBe('atleta-1');
    expect(analisis.capacidades).toHaveLength(20);
    expect(analisis.consistencia).toBeDefined();
  });

  it('rechaza una fecha de referencia ilegible', () => {
    expect(() =>
      analizarRendimiento({ ...escenarioEvaluada(), hoyISO: 'mañana' })
    ).toThrow(/hoyISO/);
  });

  it('rechaza una fecha de referencia que no existe', () => {
    expect(() =>
      analizarRendimiento({ ...escenarioEvaluada(), hoyISO: '2026-02-30' })
    ).toThrow(/hoyISO/);
  });

  it('NO rechaza datos ausentes, imposibles ni contradictorios', () => {
    const evs = [
      evaluacion({
        id: 'ev1',
        fecha: '2099-01-01',
        registros: [registro({ id: 'r1', pruebaId: 'fantasma', fecha: 'ayer' })],
      }),
    ];
    expect(() =>
      analizarRendimiento({ atletaId: 'a', evaluaciones: evs, catalogo: CATALOGO_VACIO, hoyISO: HOY })
    ).not.toThrow();
  });

  it('analizarEvaluacion toma el atleta de la propia evaluación', () => {
    const ev = evaluacion({ id: 'ev1', atletaId: 'atleta-9' });
    expect(analizarEvaluacion(ev, CATALOGO_VACIO, HOY).atletaId).toBe('atleta-9');
  });

  it('analisisVacio describe un atleta sin ninguna evaluación', () => {
    const analisis = analisisVacio('atleta-nuevo', HOY);
    expect(analisis.capacidades).toHaveLength(20);
    expect(analisis.capacidades.every((c) => c.estado === 'desconocida')).toBe(true);
    expect(analisis.resumen.evaluaciones).toBe(0);
  });

  it('el análisis vacío no es un error: trae sus limitaciones declaradas', () => {
    expect(analisisVacio('a', HOY).limitaciones.length).toBeGreaterThan(0);
  });

  it('declara las tres coordenadas de versión', () => {
    const analisis = analizarRendimiento(escenarioEvaluada());
    expect(analisis.coordenadas).toEqual({
      motor: VERSION_MOTOR,
      catalogo: 'cat-1',
      calculadoEn: HOY,
    });
  });
});

describe('resumen', () => {
  const analisis = analizarRendimiento(escenarioEvaluada());

  it('cuenta evaluaciones y registros', () => {
    expect(analisis.resumen.evaluaciones).toBe(1);
    expect(analisis.resumen.registrosTotales).toBe(1);
    expect(analisis.resumen.registrosElegibles).toBe(1);
  });

  it('el reparto por estado suma 20', () => {
    const total = Object.values(analisis.resumen.capacidadesPorEstado).reduce((a, b) => a + b, 0);
    expect(total).toBe(20);
  });

  it('los totales coinciden con las listas', () => {
    expect(analisis.resumen.hallazgos).toBe(analisis.hallazgos.length);
    expect(analisis.resumen.conflictos).toBe(analisis.conflictos.length);
    expect(analisis.resumen.limitaciones).toBe(analisis.limitaciones.length);
  });

  it('cuenta los registros excluidos sin duplicar', () => {
    const cat = catalogo([
      prueba({ id: 'p1', contribuciones: [contrib('A-01'), contrib('A-02')] }),
    ]);
    const otro = analizarRendimiento({
      atletaId: 'atleta-1',
      evaluaciones: [
        evaluacion({
          id: 'ev1',
          registros: [registro({ id: 'r1', pruebaId: 'p1', estado: 'anulada' })],
        }),
      ],
      catalogo: cat,
      hoyISO: HOY,
    });
    expect(otro.resumen.registrosExcluidos).toBe(1);
  });
});

describe('índices del catálogo', () => {
  it('indexarCatalogo mapea por id', () => {
    const indice = indexarCatalogo(catalogo([prueba({ id: 'p1' }), prueba({ id: 'p2' })]));
    expect(indice.size).toBe(2);
    expect(indice.get('p1')?.id).toBe('p1');
  });

  it('un catálogo vacío produce un índice vacío', () => {
    expect(indexarCatalogo(CATALOGO_VACIO).size).toBe(0);
  });

  it('indexarCobertura tolera que no se declare', () => {
    expect(indexarCobertura(CATALOGO_VACIO).size).toBe(0);
  });

  it('indexarCobertura mapea capacidad → pruebas exigidas', () => {
    const cat = catalogo([], { cobertura: [{ capacidad: 'A-01', pruebasRequeridas: ['p1'] }] });
    expect(indexarCobertura(cat).get('A-01')).toEqual(['p1']);
  });
});

describe('determinismo', () => {
  it('la misma solicitud produce el mismo análisis', () => {
    const solicitud = escenarioEvaluada();
    expect(analizarRendimiento(solicitud)).toEqual(analizarRendimiento(solicitud));
  });

  it('no muta la solicitud', () => {
    const solicitud = escenarioEvaluada();
    const copia = structuredClone(solicitud);
    analizarRendimiento(solicitud);
    expect(solicitud).toEqual(copia);
  });

  it('el orden de los registros no altera el resultado', () => {
    const cat = catalogo([prueba({ id: 'p1', contribuciones: [contrib('A-01')] })]);
    const a = registro({ id: 'ra', pruebaId: 'p1' });
    const b = registro({ id: 'rb', pruebaId: 'p1', fecha: '2026-07-01' });

    const uno = analizarRendimiento({
      atletaId: 'atleta-1',
      evaluaciones: [evaluacion({ id: 'ev1', registros: [a, b] })],
      catalogo: cat,
      hoyISO: HOY,
    });
    const otro = analizarRendimiento({
      atletaId: 'atleta-1',
      evaluaciones: [evaluacion({ id: 'ev1', registros: [b, a] })],
      catalogo: cat,
      hoyISO: HOY,
    });
    expect(uno.capacidades).toEqual(otro.capacidades);
    expect(uno.hallazgos).toEqual(otro.hallazgos);
  });

  it('cambiar hoyISO cambia el resultado de forma predecible', () => {
    const cat = catalogo([
      prueba({ id: 'p1', vigenciaDias: 30, contribuciones: [contrib('A-01')] }),
    ]);
    const evs = [
      evaluacion({
        id: 'ev1',
        fecha: '2026-01-01',
        registros: [registro({ id: 'r1', pruebaId: 'p1', fecha: '2026-01-01' })],
      }),
    ];
    const cerca = analizarRendimiento({
      atletaId: 'atleta-1', evaluaciones: evs, catalogo: cat, hoyISO: '2026-01-15',
    });
    const lejos = analizarRendimiento({
      atletaId: 'atleta-1', evaluaciones: evs, catalogo: cat, hoyISO: '2026-06-01',
    });
    expect(cerca.capacidades[0].estado).toBe('evaluada');
    expect(lejos.capacidades[0].estado).toBe('desactualizada');
  });

  it('cambiar la versión del catálogo se refleja en las coordenadas', () => {
    const solicitud = escenarioEvaluada();
    const otro = analizarRendimiento({
      ...solicitud,
      catalogo: { ...solicitud.catalogo, version: 'cat-2' },
    });
    expect(otro.coordenadas.catalogo).toBe('cat-2');
  });
});

/**
 * Quita comentarios antes de buscar construcciones prohibidas.
 *
 * Sin esto la guarda se dispara con su propia documentación: `fechas.ts`
 * explica que `Date.now()` está prohibido e `index.ts` declara que no importa
 * Supabase. Se corrige el test, no el texto — reescribir un comentario para
 * que pase una comprobación sería falsear la documentación.
 */
function sinComentarios(codigo: string): string {
  return codigo.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
}

describe('pureza de la capa', () => {
  const fuentes = readdirSync(DIRECTORIO)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => ({
      nombre: f,
      codigo: sinComentarios(readFileSync(join(DIRECTORIO, f), 'utf8')),
      original: readFileSync(join(DIRECTORIO, f), 'utf8'),
    }));

  it('hay archivos que revisar', () => {
    expect(fuentes.length).toBeGreaterThan(15);
  });

  it.each([
    ['Math.random', /Math\.random/],
    ['Date.now', /Date\.now/],
    ['new Date() sin argumento', /new Date\(\s*\)/],
    ['fetch', /\bfetch\(/],
    ['Supabase', /supabase/i],
    ['React', /from ['"]react/],
    ['Next', /from ['"]next/],
    ['proceso', /process\.env/],
    ['almacenamiento', /localStorage|sessionStorage/],
    ['consola', /console\./],
  ])('ningún archivo usa %s', (_etiqueta, patron) => {
    const infractores = fuentes.filter((f) => patron.test(f.codigo)).map((f) => f.nombre);
    expect(infractores).toEqual([]);
  });

  it('ningún archivo pasa de 150 líneas', () => {
    const largos = fuentes
      .filter((f) => f.original.split('\n').length - 1 > 150)
      .map((f) => f.nombre);
    expect(largos).toEqual([]);
  });

  it('ningún archivo importa fuera de la capa salvo por tipo', () => {
    const externos = fuentes.filter((f) => /from ['"]@\//.test(f.codigo)).map((f) => f.nombre);
    expect(externos).toEqual([]);
  });
});

describe('vocabulario', () => {
  const analisis = analizarRendimiento(escenarioEvaluada());
  const serializado = JSON.stringify(analisis);

  it.each([
    'óptimo', 'optimo', 'deficiente', 'mejor', 'peor', 'riesgo',
    'normal', 'anormal', 'debe', 'debería', 'recomend', 'diagnost',
  ])('la salida no contiene «%s»', (palabra) => {
    expect(serializado.toLowerCase()).not.toContain(palabra);
  });

  it('no emite prosa: ningún valor de texto pasa de 60 caracteres', () => {
    const largos: string[] = [];
    const recorrer = (valor: unknown): void => {
      if (typeof valor === 'string' && valor.length > 60) largos.push(valor);
      else if (Array.isArray(valor)) valor.forEach(recorrer);
      else if (valor && typeof valor === 'object') Object.values(valor).forEach(recorrer);
    };
    recorrer(analisis);
    expect(largos).toEqual([]);
  });

  it('no emite puntuación global ni ranking', () => {
    const claves = new Set<string>();
    const recorrer = (valor: unknown): void => {
      if (Array.isArray(valor)) valor.forEach(recorrer);
      else if (valor && typeof valor === 'object') {
        for (const [clave, hijo] of Object.entries(valor)) {
          claves.add(clave.toLowerCase());
          recorrer(hijo);
        }
      }
    };
    recorrer(analisis);

    // `nivel` NO entra en esta lista: existe como `consistencia.nivel`, que
    // califica al conjunto de datos, no al atleta. Lo que el glosario prohíbe
    // es el «nivel» del Core Product —principiante/intermedio/avanzado—, y
    // eso es lo que comprueba la aserción siguiente.
    for (const prohibida of ['puntuacion', 'score', 'ranking', 'indice', 'global']) {
      expect([...claves]).not.toContain(prohibida);
    }
  });

  it('ninguna capacidad lleva nivel, puntuación ni juicio', () => {
    const claves = new Set(analisis.capacidades.flatMap((c) => Object.keys(c)));
    for (const prohibida of ['nivel', 'puntuacion', 'score', 'valoracion']) {
      expect([...claves]).not.toContain(prohibida);
    }
  });
});

describe('casos extremos', () => {
  it('una evaluación con muchos registros no rompe nada', () => {
    const cat = catalogo([prueba({ id: 'p1', contribuciones: [contrib('A-01')] })]);
    const registros = Array.from({ length: 300 }, (_, i) =>
      registro({ id: `r${i}`, pruebaId: 'p1', valor: { tipo: 'continuo', valor: i, unidad: 'kg' } })
    );
    const analisis = analizarRendimiento({
      atletaId: 'atleta-1',
      evaluaciones: [evaluacion({ id: 'ev1', registros })],
      catalogo: cat,
      hoyISO: HOY,
    });
    expect(analisis.resumen.registrosTotales).toBe(300);
    expect(analisis.capacidades[0].estado).toBe('en_conflicto');
  });

  it('muchas evaluaciones se agregan sin perder trazas', () => {
    const cat = catalogo([prueba({ id: 'p1', contribuciones: [contrib('A-01')] })]);
    const evaluaciones = Array.from({ length: 40 }, (_, i) =>
      evaluacion({
        id: `ev${i}`,
        tipo: 'T-02',
        fecha: '2026-07-01',
        registros: [registro({ id: `r${i}`, pruebaId: 'p1', fecha: '2026-07-01' })],
      })
    );
    const analisis = analizarRendimiento({
      atletaId: 'atleta-1', evaluaciones, catalogo: cat, hoyISO: HOY,
    });
    expect(analisis.resumen.evaluaciones).toBe(40);
    expect(analisis.capacidades.every((c) => c.traza.coordenadas.calculadoEn === HOY)).toBe(true);
  });

  it('una evaluación de cada tipo se acepta sin conflicto de tipo', () => {
    const evaluaciones = (['T-01', 'T-02', 'T-03', 'T-04', 'T-05', 'T-06'] as const).map((tipo, i) =>
      evaluacion({ id: `ev${i}`, tipo, registros: [registro({ id: `r${i}`, pruebaId: 'p1' })] })
    );
    const analisis = analizarRendimiento({
      atletaId: 'atleta-1',
      evaluaciones,
      catalogo: catalogo([prueba({ id: 'p1' })]),
      hoyISO: HOY,
    });
    expect(analisis.conflictos.map((c) => c.tipo)).not.toContain('evaluacion_inicial_duplicada');
  });

  it('todos los campos de texto del DTO pueden venir vacíos', () => {
    const analisis = analizarRendimiento({
      atletaId: '',
      evaluaciones: [evaluacion({ id: '', registros: [] })],
      catalogo: CATALOGO_VACIO,
      hoyISO: HOY,
    });
    expect(analisis.capacidades).toHaveLength(20);
  });
});
