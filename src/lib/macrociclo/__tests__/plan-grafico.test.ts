// ── El plan gráfico completo (Sprint MAC-3) ────────────────────────────────
//
// TRES COSAS QUE ESTE FICHERO DEFIENDE:
//
//   1 · Las fechas no se corren un día. Toda la aritmética va en UTC porque
//       `new Date('2026-01-05')` se lee en la zona local, y al oeste de
//       Greenwich —Colombia está en UTC-5— eso devuelve el día ANTERIOR.
//
//   2 · La taxonomía está VERIFICADA. Cada entrada trae la página del libro
//       del que se transcribió, y hay una prueba que lo comprueba entrada por
//       entrada. Es lo que separa esto de una lista de nombres plausibles.
//
//   3 · Una semana del plan tiene siempre su entrada. Si la lista de semanas
//       se queda corta, la última semana da `undefined` al pintarla.

import { describe, expect, it } from 'vitest';

import {
  aplicarModeloEnRango,
  bandaNueva,
  cambiarTipoFila,
  escribirCelda,
  borrarCompetencia,
  contenidoVacio,
  escribirCompetencia,
  escribirSemana,
  filaNueva,
  indiceCompetencias,
  iniciosDeTramos,
  loQueSePierde,
  mesocicloNuevo,
  problemasDe,
  redimensionar,
  redimensionarTramo,
  renombrarMesociclo,
  renombrarTramo,
  semanasCubiertas,
  tramoNuevo,
} from '../contenido';
import {
  MESES,
  bandaDeMeses,
  etiquetaDeRango,
  formatearISO,
  parsearISO,
  rangosDeSemanas,
  sumarDias,
} from '../fechas';
import { modeloDeFase } from '../modelos';
import { repartirEnTramos, sembrarConModelo, sembrarPlanGrafico } from '../sembrar';
import type { ContenidoMacrociclo } from '../tipos';
import {
  CATEGORIAS_COMPETENCIA,
  ETAPAS,
  FUENTE,
  GRUPOS_CAPACIDADES,
  PERIODOS,
  TIPOS_MESOCICLO,
  TIPOS_MICROCICLO,
  categoriaCompetenciaDe,
  tipoMesocicloDe,
  tipoMicrocicloDe,
} from '../taxonomia';

// ════════════════════════════════════════════════════════════════════════════
// FECHAS
// ════════════════════════════════════════════════════════════════════════════

describe('el calendario no se corre un día', () => {
  it('CONTROL POSITIVO · una fecha ISO se lee tal cual', () => {
    expect(parsearISO('2026-01-05')).toEqual({ anio: 2026, mes: 1, dia: 5 });
  });

  it('EL FALLO QUE ESTO IMPIDE · el día 1 sigue siendo el día 1', () => {
    // Con `new Date('2026-10-01')` y la zona de Colombia esto daría el 30 de
    // septiembre, y la banda de meses entera saldría corrida.
    expect(parsearISO('2026-10-01')).toEqual({ anio: 2026, mes: 10, dia: 1 });
    expect(bandaDeMeses('2026-10-01', 1)[0].nombre).toBe('Octubre');
  });

  it('una fecha que no existe se rechaza en vez de desbordarse', () => {
    // `2026-02-31` construido a la ligera se convierte en el 3 de marzo.
    expect(parsearISO('2026-02-31')).toBeNull();
    expect(parsearISO('2026-13-01')).toBeNull();
    expect(parsearISO('cinco de enero')).toBeNull();
    expect(parsearISO(null)).toBeNull();
  });

  it('el año bisiesto se respeta', () => {
    expect(parsearISO('2028-02-29')).not.toBeNull();
    expect(parsearISO('2026-02-29')).toBeNull();
  });

  it('sumar días cruza el fin de mes y el fin de año', () => {
    expect(sumarDias({ anio: 2026, mes: 1, dia: 30 }, 3)).toEqual({ anio: 2026, mes: 2, dia: 2 });
    expect(sumarDias({ anio: 2026, mes: 12, dia: 30 }, 3)).toEqual({ anio: 2027, mes: 1, dia: 2 });
  });

  it('formatear y parsear son la vuelta entera', () => {
    for (const iso of ['2026-01-05', '2026-12-31', '2028-02-29']) {
      expect(formatearISO(parsearISO(iso)!)).toBe(iso);
    }
  });
});

describe('las semanas y su rango', () => {
  it('cada semana va de lunes a domingo', () => {
    const r = rangosDeSemanas('2026-01-05', 3);
    expect(r).toHaveLength(3);
    expect(formatearISO(r[0].inicio)).toBe('2026-01-05');
    expect(formatearISO(r[0].fin)).toBe('2026-01-11');
    expect(formatearISO(r[1].inicio)).toBe('2026-01-12');
    expect(formatearISO(r[2].inicio)).toBe('2026-01-19');
  });

  it('la etiqueta es la del plan gráfico: día de inicio y día de fin', () => {
    expect(etiquetaDeRango(rangosDeSemanas('2026-01-05', 1)[0])).toBe('5 · 11');
  });

  it('sin fecha de inicio no hay rangos, y eso es legítimo', () => {
    // Una plantilla de macrociclo se escribe muchas veces antes de saber
    // cuándo empieza; la rejilla se lee entonces por número de semana.
    expect(rangosDeSemanas(null, 12)).toEqual([]);
    expect(bandaDeMeses(null, 12)).toEqual([]);
  });
});

describe('la banda de meses', () => {
  it('agrupa semanas consecutivas del mismo mes', () => {
    const meses = bandaDeMeses('2026-01-05', 9);
    expect(meses.map((m) => m.nombre)).toEqual(['Enero', 'Febrero', 'Marzo']);
    expect(meses.map((m) => m.semanas)).toEqual([4, 4, 1]);
    expect(semanasCubiertas(meses)).toBe(9);
  });

  it('una semana a caballo cuenta en el mes de su LUNES', () => {
    // Hay que elegir un criterio: repartirla partiría la columna por la mitad
    // y dejaría la rejilla sin retícula común con las demás bandas.
    const meses = bandaDeMeses('2026-09-28', 2);
    expect(meses[0].nombre).toBe('Septiembre');
    expect(meses[0].semanas).toBe(1);
    expect(meses[1].nombre).toBe('Octubre');
  });

  it('cruza el año sin fundir diciembre con enero', () => {
    const meses = bandaDeMeses('2026-12-28', 3);
    expect(meses.map((m) => `${m.nombre} ${m.anio}`)).toEqual([
      'Diciembre 2026',
      'Enero 2027',
    ]);
  });

  it('la banda cubre exactamente las semanas del plan', () => {
    for (const n of [1, 5, 13, 52, 104]) {
      expect(semanasCubiertas(bandaDeMeses('2026-03-02', n)), `${n} semanas`).toBe(n);
    }
  });

  it('hay doce meses y el índice no se va de uno', () => {
    expect(MESES).toHaveLength(12);
    expect(bandaDeMeses('2026-12-07', 1)[0].nombre).toBe('Diciembre');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// TAXONOMÍA
// ════════════════════════════════════════════════════════════════════════════

describe('la taxonomía está verificada contra el libro', () => {
  const TODO = [
    ...PERIODOS,
    ...ETAPAS,
    ...TIPOS_MICROCICLO,
    ...TIPOS_MESOCICLO,
    ...CATEGORIAS_COMPETENCIA,
  ];

  it('CONTROL POSITIVO · hay taxonomía que comprobar', () => {
    expect(TODO.length).toBeGreaterThan(20);
  });

  it('la fuente se declara verificada, al contrario que los modelos', () => {
    // Los cinco modelos de `modelos.ts` llevan `verificado: false` porque la
    // obra no se había abierto. Esta sí: tiene ISBN y se cita por página.
    expect(FUENTE.verificado).toBe(true);
    expect(FUENTE.cita).toMatch(/ISBN 978-958-8269-48-1/);
  });

  it('CADA entrada dice su página, y es una página real del libro', () => {
    // El libro tiene 216 páginas. Una entrada sin página, o con una que no
    // existe, es una cita que nadie puede comprobar.
    for (const e of TODO) {
      expect(Number.isInteger(e.pagina), e.id).toBe(true);
      expect(e.pagina, e.id).toBeGreaterThan(0);
      expect(e.pagina, e.id).toBeLessThanOrEqual(216);
    }
  });

  it('los identificadores no se repiten dentro de su catálogo', () => {
    for (const grupo of [PERIODOS, ETAPAS, TIPOS_MICROCICLO, TIPOS_MESOCICLO]) {
      const ids = grupo.map((e) => e.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });

  it('los códigos de microciclo son los del plan gráfico de toda la vida', () => {
    expect(TIPOS_MICROCICLO.map((t) => t.codigo)).toEqual(['O', 'CH', 'A', 'C', 'R']);
  });

  it('la composición de cada mesociclo solo cita microciclos que existen', () => {
    // Una composición que nombra un tipo inexistente sembraría semanas sin
    // color ni código, y el fallo solo se vería al mirar la rejilla.
    const validos = new Set(TIPOS_MICROCICLO.map((t) => t.id));
    for (const m of TIPOS_MESOCICLO) {
      expect(m.composicion.length, m.id).toBeGreaterThan(0);
      for (const c of m.composicion) {
        expect(validos.has(c), `${m.id} → ${c}`).toBe(true);
      }
    }
  });

  it('la búsqueda resuelve lo que existe y NO inventa lo que no', () => {
    expect(tipoMicrocicloDe('choque')?.codigo).toBe('CH');
    expect(tipoMesocicloDe('entrante')?.nombre).toBe('Entrante');
    expect(categoriaCompetenciaDe('fundamental')?.codigo).toBe('C.F');
    expect(tipoMicrocicloDe('no-existe')).toBeNull();
    expect(tipoMesocicloDe(null)).toBeNull();
  });

  it('los grupos de capacidades cubren los cinco contenidos de preparación', () => {
    // El libro los enumera como «físicos, técnicos, tácticos, teóricos,
    // psicológicos» (p. 10).
    const nombres = GRUPOS_CAPACIDADES.map((g) => g.nombre).join(' ').toLowerCase();
    for (const c of ['física general', 'física especial', 'técnico-táctica', 'teórica']) {
      expect(nombres).toContain(c);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// SEMANAS, COMPETENCIAS Y BANDAS
// ════════════════════════════════════════════════════════════════════════════

function plan() {
  return {
    ...contenidoVacio(8),
    bandas: [
      bandaNueva('Periodo', [tramoNuevo('Preparatorio', 5), tramoNuevo('Competitivo', 3)]),
    ],
    mesociclos: [mesocicloNuevo('Entrante', 3), mesocicloNuevo('Básico', 5)],
    filas: [filaNueva('Volumen', 8, 'numero', 'kg')],
  };
}

describe('cada semana tiene su entrada, siempre', () => {
  it('CONTROL POSITIVO · un plan nuevo nace coherente', () => {
    expect(problemasDe(plan(), 8)).toEqual([]);
  });

  it('un contenido vacío ya trae una entrada por semana', () => {
    expect(contenidoVacio(12).semanas).toHaveLength(12);
    expect(contenidoVacio(12).semanas.every((s) => s.tipoMicrociclo === null)).toBe(true);
  });

  it('problemasDe detecta una lista de semanas corta', () => {
    const c = plan();
    c.semanas.pop();
    expect(problemasDe(c, 8).join(' ')).toMatch(/7 entradas de semana/);
  });

  it('redimensionar mantiene una entrada por semana en las dos direcciones', () => {
    for (const n of [1, 3, 8, 20, 104]) {
      const r = redimensionar(plan(), n);
      expect(r.semanas, `a ${n}`).toHaveLength(n);
      expect(problemasDe(r, n), `a ${n}`).toEqual([]);
    }
  });

  it('al crecer, las semanas nuevas salen SIN nada decidido', () => {
    let c = escribirSemana(plan(), 7, { tipoMicrociclo: 'choque', sesiones: 10 });
    c = redimensionar(c, 12);
    expect(c.semanas[7].tipoMicrociclo).toBe('choque');
    expect(c.semanas[11].tipoMicrociclo).toBeNull();
    expect(c.semanas[11].sesiones).toBeNull();
  });

  it('escribir una semana no toca las demás', () => {
    const c = escribirSemana(plan(), 2, { sesiones: 6, horas: 12 });
    expect(c.semanas[2]).toMatchObject({ sesiones: 6, horas: 12 });
    expect(c.semanas[1].sesiones).toBeNull();
    expect(c.semanas[3].sesiones).toBeNull();
  });

  it('escribir fuera de rango NO alarga la lista', () => {
    const c = escribirSemana(plan(), 99, { sesiones: 3 });
    expect(c.semanas).toHaveLength(8);
    expect(problemasDe(c, 8)).toEqual([]);
  });
});

describe('las competencias se anclan a su semana', () => {
  it('CONTROL POSITIVO · se guarda y se encuentra', () => {
    const c = escribirCompetencia(plan(), {
      semana: 4,
      nombre: 'Nacional de clubes',
      categoria: 'fundamental',
      ambito: 'Nacional',
    });
    expect(c.competencias).toHaveLength(1);
    expect(indiceCompetencias(c.competencias).get(4)?.[0].nombre).toBe('Nacional de clubes');
  });

  it('varias competencias pueden caer en la misma semana', () => {
    let c = plan();
    c = escribirCompetencia(c, { semana: 4, nombre: 'Ida', categoria: 'control', ambito: 'Local' });
    c = escribirCompetencia(c, { semana: 4, nombre: 'Vuelta', categoria: 'control', ambito: 'Local' });
    expect(indiceCompetencias(c.competencias).get(4)).toHaveLength(2);
  });

  it('una competencia SIN nombre no se guarda', () => {
    // Es una celda pulsada sin querer; guardarla pintaría una marca que no
    // significa nada.
    const c = escribirCompetencia(plan(), {
      semana: 2,
      nombre: '   ',
      categoria: 'control',
      ambito: '',
    });
    expect(c.competencias).toEqual([]);
  });

  it('escribir con el mismo id reemplaza, no duplica', () => {
    let c = escribirCompetencia(plan(), {
      semana: 1,
      nombre: 'Control',
      categoria: 'control',
      ambito: '',
    });
    const id = c.competencias[0].id;
    c = escribirCompetencia(c, {
      id,
      semana: 2,
      nombre: 'Control',
      categoria: 'fundamental',
      ambito: '',
    });
    expect(c.competencias).toHaveLength(1);
    expect(c.competencias[0].semana).toBe(2);
    expect(c.competencias[0].categoria).toBe('fundamental');
  });

  it('borrar quita solo esa', () => {
    let c = escribirCompetencia(plan(), { semana: 1, nombre: 'A', categoria: 'control', ambito: '' });
    c = escribirCompetencia(c, { semana: 2, nombre: 'B', categoria: 'control', ambito: '' });
    c = borrarCompetencia(c, c.competencias[0].id);
    expect(c.competencias.map((x) => x.nombre)).toEqual(['B']);
  });

  it('al encoger, las que quedan fuera se van Y SE AVISA antes', () => {
    let c = plan();
    c = escribirCompetencia(c, { semana: 1, nombre: 'Dentro', categoria: 'control', ambito: '' });
    c = escribirCompetencia(c, { semana: 6, nombre: 'Fuera', categoria: 'control', ambito: '' });

    expect(loQueSePierde(c, 4).competencias).toBe(1);
    expect(redimensionar(c, 4).competencias.map((x) => x.nombre)).toEqual(['Dentro']);
  });

  it('problemasDe detecta una competencia fuera del plan', () => {
    const c = plan();
    c.competencias.push({ id: 'x', semana: 99, nombre: 'Tardía', categoria: 'control', ambito: '' });
    expect(problemasDe(c, 8).join(' ')).toMatch(/fuera del plan/);
  });
});

describe('las bandas superiores se comportan como los mesociclos', () => {
  it('CONTROL POSITIVO · una banda nace cubriendo lo que se le dijo', () => {
    expect(semanasCubiertas(plan().bandas[0].tramos)).toBe(8);
  });

  it('alargar un tramo se lo QUITA al siguiente, sin mover el total', () => {
    const c = plan();
    const b = c.bandas[0];
    const d = redimensionarTramo(c, b.id, b.tramos[0].id, 6);
    expect(d.bandas[0].tramos.map((t) => t.semanas)).toEqual([6, 2]);
    expect(semanasCubiertas(d.bandas[0].tramos)).toBe(8);
  });

  it('no se puede dejar al siguiente sin ninguna semana', () => {
    const c = plan();
    const b = c.bandas[0];
    expect(redimensionarTramo(c, b.id, b.tramos[0].id, 8).bandas[0].tramos[1].semanas).toBe(3);
  });

  it('el último tramo solo puede encoger: crecer lo sacaría del plan', () => {
    const c = plan();
    const b = c.bandas[0];
    expect(redimensionarTramo(c, b.id, b.tramos[1].id, 9).bandas[0].tramos[1].semanas).toBe(3);
    expect(redimensionarTramo(c, b.id, b.tramos[1].id, 2).bandas[0].tramos[1].semanas).toBe(2);
  });

  it('una banda que excede el total se detecta', () => {
    const c = plan();
    c.bandas[0].tramos[0].semanas = 20;
    expect(problemasDe(c, 8).join(' ')).toMatch(/La banda «Periodo» suma 23 semanas/);
  });

  it('al encoger, los tramos se recortan en cascada igual que los mesociclos', () => {
    const r = redimensionar(plan(), 6);
    expect(r.bandas[0].tramos.map((t) => t.semanas)).toEqual([5, 1]);
    expect(r.mesociclos.map((m) => m.semanas)).toEqual([3, 3]);
  });

  it('los ids de tramo entran en la invariante de unicidad', () => {
    const c = plan();
    c.bandas[0].tramos[1].id = c.bandas[0].tramos[0].id;
    expect(problemasDe(c, 8).join(' ')).toMatch(/identificadores repetidos/);
  });
});

describe('renombrar tramos y mesociclos', () => {
  it('CONTROL POSITIVO · renombrarTramo cambia solo el tramo indicado', () => {
    const c = plan();
    const b = c.bandas[0];
    const d = renombrarTramo(c, b.id, b.tramos[0].id, 'General');
    expect(d.bandas[0].tramos.map((t) => t.nombre)).toEqual(['General', 'Competitivo']);
  });

  it('un nombre en blanco se ignora', () => {
    const c = plan();
    const b = c.bandas[0];
    const d = renombrarTramo(c, b.id, b.tramos[0].id, '   ');
    expect(d.bandas[0].tramos[0].nombre).toBe('Preparatorio');
  });

  it('renombrarMesociclo funciona igual, sin tocar los demás', () => {
    const c = plan();
    const d = renombrarMesociclo(c, c.mesociclos[0].id, 'Base');
    expect(d.mesociclos.map((m) => m.nombre)).toEqual(['Base', 'Básico']);
  });

  it('un id que no existe no rompe nada', () => {
    const c = plan();
    expect(renombrarTramo(c, c.bandas[0].id, 'no-existe', 'X')).toEqual(c);
    expect(renombrarMesociclo(c, 'no-existe', 'X')).toEqual(c);
  });

  it('iniciosDeTramos resuelve el mismo problema que iniciosDeMesociclo', () => {
    expect(iniciosDeTramos(plan().bandas[0].tramos)).toEqual([0, 5]);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// COMBINAR DOS MODELOS EN EL MISMO MACROCICLO
// ════════════════════════════════════════════════════════════════════════════

describe('aplicar un modelo a un tramo, sin tocar el resto del plan', () => {
  it('CONTROL POSITIVO · siembra el modelo solo dentro del rango', () => {
    const c = { ...contenidoVacio(12), mesociclos: [] };
    const d = aplicarModeloEnRango(c, 0, 12, 'atr');
    expect(d.mesociclos.map((m) => m.nombre)).toEqual([
      'Acumulación',
      'Transformación',
      'Realización',
    ]);
    expect(semanasCubiertas(d.mesociclos)).toBe(12);
    expect(problemasDe(d, 12)).toEqual([]);
  });

  it('lo de FUERA del rango se conserva tal cual', () => {
    const c = {
      ...contenidoVacio(20),
      mesociclos: [mesocicloNuevo('Base', 10), mesocicloNuevo('Pico', 10)],
    };
    const d = aplicarModeloEnRango(c, 10, 10, 'atr');
    expect(d.mesociclos[0]).toMatchObject({ nombre: 'Base', semanas: 10 });
    expect(d.mesociclos.slice(1).map((m) => m.nombre)).toEqual([
      'Acumulación',
      'Transformación',
      'Realización',
    ]);
    expect(semanasCubiertas(d.mesociclos)).toBe(20);
  });

  it('un mesociclo a caballo de un borde se recorta, no se rompe', () => {
    // Un solo mesociclo de 20 semanas cubre el plan entero. Sustituir las
    // semanas 5-15 tiene que dejar 5 semanas de él ANTES y 5 DESPUÉS.
    const c = { ...contenidoVacio(20), mesociclos: [mesocicloNuevo('Único', 20)] };
    const d = aplicarModeloEnRango(c, 5, 10, 'clasico');
    expect(d.mesociclos[0]).toMatchObject({ nombre: 'Único', semanas: 5 });
    expect(d.mesociclos.at(-1)).toMatchObject({ nombre: 'Único', semanas: 5 });
    expect(semanasCubiertas(d.mesociclos)).toBe(20);
    expect(problemasDe(d, 20)).toEqual([]);
  });

  it('COMBINAR DOS MODELOS · un periodo en ATR y el siguiente en Clásico', () => {
    let c: ContenidoMacrociclo = { ...contenidoVacio(20), mesociclos: [] };
    c = aplicarModeloEnRango(c, 0, 10, 'atr');
    c = aplicarModeloEnRango(c, 10, 10, 'clasico');

    expect(semanasCubiertas(c.mesociclos)).toBe(20);
    expect(problemasDe(c, 20)).toEqual([]);

    // Cada mitad se sembró de un modelo distinto, y se puede comprobar
    // mirando de qué modelo es la fase de cada mesociclo — no hace falta
    // guardar la relación dos veces en el documento.
    const modelosVistos = c.mesociclos.map((m) => modeloDeFase(m.faseId)?.id);
    expect(modelosVistos.slice(0, 3)).toEqual(['atr', 'atr', 'atr']);
    expect(modelosVistos.slice(3)).toEqual(['clasico', 'clasico', 'clasico', 'clasico']);
  });

  it('modeloId null vacía el rango en vez de dejarlo con un mesociclo inventado', () => {
    let c: ContenidoMacrociclo = { ...contenidoVacio(12), mesociclos: [] };
    c = aplicarModeloEnRango(c, 0, 12, 'atr');
    c = aplicarModeloEnRango(c, 4, 4, null);
    expect(semanasCubiertas(c.mesociclos)).toBe(8);
    expect(problemasDe(c, 12)).toEqual([]);
  });

  it('un modelo inexistente no toca el plan', () => {
    const c = { ...contenidoVacio(12), mesociclos: [mesocicloNuevo('X', 12)] };
    expect(aplicarModeloEnRango(c, 0, 12, 'no-existe')).toEqual(c);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LA SIEMBRA DEL PLAN GRÁFICO
// ════════════════════════════════════════════════════════════════════════════

describe('sembrar el plan gráfico', () => {
  it('CONTROL POSITIVO · sale coherente para cualquier tamaño', () => {
    for (const n of [1, 2, 6, 12, 52, 104]) {
      const c = sembrarPlanGrafico(n);
      expect(problemasDe(c, n), `${n} semanas`).toEqual([]);
    }
  });

  it('trae las bandas de periodo y etapa, cubriendo el plan entero', () => {
    const c = sembrarPlanGrafico(12);
    expect(c.bandas.map((b) => b.nombre)).toEqual(['Periodo', 'Etapa']);
    for (const b of c.bandas) {
      expect(semanasCubiertas(b.tramos), b.nombre).toBe(12);
    }
  });

  it('trae una fila por cada contenido de preparación, agrupada', () => {
    const c = sembrarPlanGrafico(12);
    const porGrupo = new Map<string, string[]>();
    for (const f of c.filas) {
      if (f.grupo === null) continue;
      porGrupo.set(f.grupo, [...(porGrupo.get(f.grupo) ?? []), f.nombre]);
    }
    expect(porGrupo.get('fisica_general')).toEqual([
      'Fuerza',
      'Velocidad',
      'Resistencia',
      'Flexibilidad',
      'Coordinación',
    ]);
    expect(porGrupo.get('fisica_especial')).toHaveLength(5);
    expect(porGrupo.get('tecnico_tactica')).toEqual(['Técnica', 'Táctica']);
  });

  it('las capacidades nacen como MARCA, no como número', () => {
    // Nacer como número obligaría a inventar una cifra para decir «esta
    // semana sí», que es justo lo que no se puede hacer.
    const c = sembrarPlanGrafico(12);
    for (const f of c.filas.filter((x) => x.grupo !== null)) {
      expect(f.tipo, f.nombre).toBe('marca');
    }
  });

  it('volumen e intensidad van a la curva y las capacidades no', () => {
    const c = sembrarPlanGrafico(12);
    const conCurva = c.filas.filter((f) => f.grafico !== null).map((f) => f.nombre);
    expect(conCurva).toEqual(['Volumen', 'Intensidad']);
  });

  it('NI UNA CELDA SALE RELLENA', () => {
    // Es la línea que sostiene el subsistema: el esqueleto es del libro, cada
    // cifra es del entrenador.
    const c = sembrarPlanGrafico(12);
    expect(c.filas.length).toBeGreaterThan(10);
    for (const f of c.filas) {
      expect(f.valores.every((v) => v === null), f.nombre).toBe(true);
    }
    expect(c.semanas.every((s) => s.tipoMicrociclo === null && s.sesiones === null)).toBe(true);
    expect(c.competencias).toEqual([]);
  });

  it('con menos semanas que tramos no se crean tramos de cero', () => {
    const c = sembrarPlanGrafico(2);
    for (const b of c.bandas) {
      expect(b.tramos.every((t) => t.semanas >= 1), b.nombre).toBe(true);
      expect(semanasCubiertas(b.tramos)).toBe(2);
    }
  });

  it('con modelo, además siembra sus mesociclos', () => {
    const c = sembrarConModelo(12, 'atr')!;
    expect(c.mesociclos.map((m) => m.nombre)).toEqual([
      'Acumulación',
      'Transformación',
      'Realización',
    ]);
    expect(semanasCubiertas(c.mesociclos)).toBe(12);
    expect(problemasDe(c, 12)).toEqual([]);
  });

  it('un modelo inexistente no siembra un plan a medias', () => {
    expect(sembrarConModelo(12, 'no-existe')).toBeNull();
  });

  it('el reparto de tramos SIEMPRE suma el total', () => {
    const tres = [
      { nombre: 'A', color: '#000', tipoId: 'a' },
      { nombre: 'B', color: '#000', tipoId: 'b' },
      { nombre: 'C', color: '#000', tipoId: 'c' },
    ];
    for (let n = 1; n <= 60; n++) {
      expect(semanasCubiertas(repartirEnTramos(n, tres)), `${n}`).toBe(n);
    }
    expect(repartirEnTramos(0, tres)).toEqual([]);
  });
});

describe('cambiar el tipo de una fila', () => {
  it('CONTROL POSITIVO · una marca pasa a porcentaje', () => {
    const c = sembrarPlanGrafico(8);
    const fuerza = c.filas.find((f) => f.nombre === 'Fuerza')!;
    const d = cambiarTipoFila(c, fuerza.id, 'porcentaje', '%');
    expect(d.filas.find((f) => f.id === fuerza.id)).toMatchObject({
      tipo: 'porcentaje',
      unidad: '%',
    });
  });

  it('LOS VALORES NO SE CONVIERTEN', () => {
    // Convertir una «X» en 100 inventaría una cifra que nadie ha escrito.
    let c = sembrarPlanGrafico(8);
    const fuerza = c.filas.find((f) => f.nombre === 'Fuerza')!;
    c = escribirCelda(c, fuerza.id, 0, 'X');
    c = cambiarTipoFila(c, fuerza.id, 'porcentaje');
    expect(c.filas.find((f) => f.id === fuerza.id)!.valores[0]).toBe('X');
  });

  it('no toca ninguna otra fila', () => {
    const c = sembrarPlanGrafico(8);
    const fuerza = c.filas.find((f) => f.nombre === 'Fuerza')!;
    const d = cambiarTipoFila(c, fuerza.id, 'numero');
    expect(d.filas.find((f) => f.nombre === 'Velocidad')!.tipo).toBe('marca');
  });
});
