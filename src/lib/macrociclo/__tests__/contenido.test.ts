// ── El núcleo del macrociclo (Sprint MAC-1) ────────────────────────────────
//
// LAS TRES INVARIANTES QUE ESTE FICHERO DEFIENDE:
//
//   1 · Toda fila tiene exactamente `semanas` valores. Una fila corta pinta
//       sus datos una columna a la izquierda y nadie lo nota.
//   2 · Los mesociclos no se solapan ni exceden el total.
//   3 · Los identificadores no se reutilizan.
//
// Y la regla de fondo del subsistema: NINGÚN MODELO TRAE CIFRAS.

import { describe, expect, it } from 'vitest';

import {
  claveDia,
  contenidoVacio,
  escribirCelda,
  escribirDia,
  filaNueva,
  indiceDias,
  iniciosDeMesociclo,
  loQueSePierde,
  mesocicloDeSemana,
  mesocicloNuevo,
  nuevoId,
  plantillasUsadas,
  problemasDe,
  redimensionar,
  redimensionarMesociclo,
  semanasCubiertas,
} from '../contenido';
import {
  MODELOS,
  faseDe,
  mesociclosDelModelo,
  modeloDe,
  modeloDeFase,
  repartirSemanas,
} from '../modelos';
import type { ContenidoMacrociclo } from '../tipos';

/** Un plan de 8 semanas con dos mesociclos y dos filas. */
function plan(): ContenidoMacrociclo {
  return {
    ...contenidoVacio(8),
    mesociclos: [mesocicloNuevo('Acumulación', 5), mesocicloNuevo('Realización', 3)],
    filas: [filaNueva('Volumen', 8, 'numero', 'kg'), filaNueva('Contenidos', 8)],
  };
}

describe('la rejilla nace coherente', () => {
  it('CONTROL POSITIVO · un plan recién creado no tiene problemas', () => {
    expect(problemasDe(plan(), 8)).toEqual([]);
  });

  it('una fila nace con un valor por semana, y todos nulos', () => {
    const f = filaNueva('Volumen', 12);
    expect(f.valores).toHaveLength(12);
    expect(f.valores.every((v) => v === null)).toBe(true);
  });

  it('nulo y cadena vacía NO son lo mismo', () => {
    // «No planificado» y «planificado como nada» son estados distintos, y el
    // exportador necesita distinguirlos para no llenar el Excel de celdas que
    // parecen rellenas.
    const c = escribirCelda(plan(), plan().filas[0].id, 0, '');
    expect(c.filas[0].valores[0]).toBeNull();
  });

  it('los identificadores no se repiten', () => {
    const ids = new Set(Array.from({ length: 200 }, () => nuevoId()));
    expect(ids.size).toBe(200);
  });
});

describe('la invariante 1 · una fila, una columna por semana', () => {
  it('problemasDe detecta una fila corta', () => {
    const c = plan();
    c.filas[0].valores.pop();
    expect(problemasDe(c, 8).join(' ')).toMatch(/tiene 7 valores/);
  });

  it('escribir fuera de rango NO alarga la fila', () => {
    // Alargarla rompería la invariante en silencio, y el fallo aparecería
    // tres pantallas después, al exportar.
    const c = plan();
    const despues = escribirCelda(c, c.filas[0].id, 99, 'x');
    expect(despues.filas[0].valores).toHaveLength(8);
    expect(problemasDe(despues, 8)).toEqual([]);
  });

  it('escribir con índice negativo tampoco', () => {
    const c = plan();
    const despues = escribirCelda(c, c.filas[0].id, -1, 'x');
    expect(despues.filas[0].valores).toHaveLength(8);
  });

  it('redimensionar mantiene la invariante en las dos direcciones', () => {
    const c = plan();
    for (const n of [1, 3, 8, 20, 104]) {
      expect(problemasDe(redimensionar(c, n), n), `a ${n} semanas`).toEqual([]);
    }
  });
});

describe('redimensionar conserva lo que cabe', () => {
  it('al crecer, las semanas nuevas salen vacías y NO copian a la última', () => {
    let c = plan();
    c = escribirCelda(c, c.filas[0].id, 7, '5000');
    const mayor = redimensionar(c, 12);
    expect(mayor.filas[0].valores[7]).toBe('5000');
    expect(mayor.filas[0].valores.slice(8).every((v) => v === null)).toBe(true);
  });

  it('al encoger se recorta por el final y se conserva el principio', () => {
    let c = plan();
    c = escribirCelda(c, c.filas[0].id, 0, 'A');
    c = escribirCelda(c, c.filas[0].id, 7, 'Z');
    const menor = redimensionar(c, 4);
    expect(menor.filas[0].valores).toEqual(['A', null, null, null]);
  });

  it('avisa de lo que se perdería ANTES de perderlo', () => {
    let c = plan();
    c = escribirCelda(c, c.filas[0].id, 6, 'x');
    c = escribirCelda(c, c.filas[1].id, 7, 'y');
    c = escribirDia(c, 6, 0, { plantillaId: 'p1' });

    const perdida = loQueSePierde(c, 4);
    expect(perdida.celdas).toBe(2);
    expect(perdida.dias).toBe(1);
    expect(perdida.mesociclos).toBe(1); // el de realización empieza en la 5
  });

  it('los días fuera del nuevo tamaño se van con él', () => {
    let c = plan();
    c = escribirDia(c, 1, 0, { plantillaId: 'p1' });
    c = escribirDia(c, 6, 0, { plantillaId: 'p2' });
    const menor = redimensionar(c, 4);
    expect(menor.dias).toHaveLength(1);
    expect(menor.dias[0].semana).toBe(1);
  });

  it('un mesociclo que queda a medias pierde solo lo que sobra', () => {
    const menor = redimensionar(plan(), 6);
    expect(menor.mesociclos.map((m) => m.semanas)).toEqual([5, 1]);
    expect(semanasCubiertas(menor.mesociclos)).toBe(6);
  });

  it('nunca se pasa de los límites declarados', () => {
    expect(redimensionar(plan(), 0).filas[0].valores).toHaveLength(1);
    expect(redimensionar(plan(), 500).filas[0].valores).toHaveLength(104);
  });
});

describe('la invariante 2 · los mesociclos no se pisan', () => {
  it('los inicios se derivan de las longitudes, no se guardan', () => {
    expect(iniciosDeMesociclo(plan().mesociclos)).toEqual([0, 5]);
  });

  it('cada semana cae en un solo mesociclo', () => {
    const { mesociclos } = plan();
    expect(mesocicloDeSemana(mesociclos, 0)!.nombre).toBe('Acumulación');
    expect(mesocicloDeSemana(mesociclos, 4)!.nombre).toBe('Acumulación');
    expect(mesocicloDeSemana(mesociclos, 5)!.nombre).toBe('Realización');
    expect(mesocicloDeSemana(mesociclos, 7)!.nombre).toBe('Realización');
  });

  it('una semana descubierta devuelve null, no el mesociclo de al lado', () => {
    // Asignarla «porque queda cerca» inventaría una decisión que nadie tomó.
    const { mesociclos } = plan();
    expect(mesocicloDeSemana(mesociclos, 8)).toBeNull();
  });

  it('problemasDe detecta mesociclos que exceden el total', () => {
    const c = plan();
    c.mesociclos[0].semanas = 20;
    expect(problemasDe(c, 8).join(' ')).toMatch(/suman 23 semanas/);
  });

  it('alargar un mesociclo se lo QUITA al siguiente, sin mover el total', () => {
    const c = plan();
    const despues = redimensionarMesociclo(c, c.mesociclos[0].id, 6);
    expect(despues.mesociclos.map((m) => m.semanas)).toEqual([6, 2]);
    expect(semanasCubiertas(despues.mesociclos)).toBe(8);
  });

  it('no se puede dejar al siguiente sin ninguna semana', () => {
    const c = plan();
    const despues = redimensionarMesociclo(c, c.mesociclos[0].id, 8);
    expect(despues.mesociclos.map((m) => m.semanas)).toEqual([5, 3]);
  });

  it('el último mesociclo solo puede encoger: crecer lo sacaría del plan', () => {
    const c = plan();
    expect(redimensionarMesociclo(c, c.mesociclos[1].id, 9).mesociclos[1].semanas).toBe(3);
    expect(redimensionarMesociclo(c, c.mesociclos[1].id, 2).mesociclos[1].semanas).toBe(2);
  });
});

describe('los días apuntan a plantillas, no las contienen', () => {
  it('un día guarda el id de la plantilla y nada más', () => {
    const c = escribirDia(plan(), 0, 0, { plantillaId: 'plantilla-a' });
    expect(c.dias[0]).toEqual({ semana: 0, dia: 0, plantillaId: 'plantilla-a', etiqueta: null });
  });

  it('un día sin plantilla y sin etiqueta NO se guarda', () => {
    // Guardarlo llenaría el documento de registros que no dicen nada.
    let c = escribirDia(plan(), 0, 0, { plantillaId: 'p1' });
    c = escribirDia(c, 0, 0, { plantillaId: null });
    expect(c.dias).toHaveLength(0);
  });

  it('pero una etiqueta sin plantilla SÍ: «Descanso» es una decisión', () => {
    const c = escribirDia(plan(), 0, 6, { etiqueta: 'Descanso' });
    expect(c.dias).toHaveLength(1);
    expect(c.dias[0].etiqueta).toBe('Descanso');
  });

  it('escribir dos veces el mismo día NO lo duplica', () => {
    let c = escribirDia(plan(), 2, 3, { plantillaId: 'p1' });
    c = escribirDia(c, 2, 3, { plantillaId: 'p2' });
    expect(c.dias).toHaveLength(1);
    expect(c.dias[0].plantillaId).toBe('p2');
    expect(problemasDe(c, 8)).toEqual([]);
  });

  it('cambiar la etiqueta conserva la plantilla, y al revés', () => {
    let c = escribirDia(plan(), 1, 1, { plantillaId: 'p1' });
    c = escribirDia(c, 1, 1, { etiqueta: 'Doble sesión' });
    expect(c.dias[0]).toMatchObject({ plantillaId: 'p1', etiqueta: 'Doble sesión' });
  });

  it('el índice usa la MISMA clave que escribe el documento', () => {
    // Dos formas de componer «semana:día» acabarían buscando en un sitio
    // distinto del que se escribió.
    const c = escribirDia(plan(), 3, 5, { plantillaId: 'p9' });
    expect(indiceDias(c.dias).get(claveDia(3, 5))?.plantillaId).toBe('p9');
  });

  it('las plantillas usadas salen sin repetir y en orden de calendario', () => {
    let c = plan();
    c = escribirDia(c, 2, 0, { plantillaId: 'B' });
    c = escribirDia(c, 0, 1, { plantillaId: 'A' });
    c = escribirDia(c, 1, 0, { plantillaId: 'A' });
    c = escribirDia(c, 3, 0, { plantillaId: 'C' });
    expect(plantillasUsadas(c)).toEqual(['A', 'B', 'C']);
  });

  it('problemasDe detecta un día fuera de la semana o del plan', () => {
    const c = contenidoVacio();
    c.dias.push({ semana: 99, dia: 0, plantillaId: 'p', etiqueta: null });
    c.dias.push({ semana: 0, dia: 9, plantillaId: 'p', etiqueta: null });
    const p = problemasDe(c, 8).join(' ');
    expect(p).toMatch(/fuera del macrociclo/);
    expect(p).toMatch(/fuera de la semana/);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LOS MODELOS DE PERIODIZACIÓN
// ════════════════════════════════════════════════════════════════════════════

describe('los modelos traen estructura, NUNCA cifras', () => {
  it('CONTROL POSITIVO · hay cinco modelos con sus fases', () => {
    expect(MODELOS.length).toBe(5);
    for (const m of MODELOS) expect(m.fases.length, m.id).toBeGreaterThan(1);
  });

  it('NINGUNA fase prescribe un porcentaje, un peso ni un rango', () => {
    // Es la regla que sostiene el subsistema entero. «El ATR ordena
    // acumulación, transformación y realización» describe un modelo publicado;
    // «en acumulación se trabaja al 60-75 %» es una cifra que nadie ha escrito
    // aquí, y el sistema no inventa cifras.
    const CIFRA = /\d+\s*(%|kg|rm|rir|series|repeticiones)|\d+\s*[-–]\s*\d+/i;
    for (const m of MODELOS) {
      for (const f of m.fases) {
        expect(`${f.nombre} ${f.proposito}`, `${m.id}/${f.id}`).not.toMatch(CIFRA);
      }
      expect(m.descripcion, m.id).not.toMatch(CIFRA);
    }
  });

  it('CONTROL POSITIVO · esa comprobación detecta una cifra real', () => {
    const CIFRA = /\d+\s*(%|kg|rm|rir|series|repeticiones)|\d+\s*[-–]\s*\d+/i;
    expect('trabajo al 75 % de 1RM').toMatch(CIFRA);
    expect('volumen de 60-80 series').toMatch(CIFRA);
  });

  it('las filas sugeridas son RENGLONES, no valores', () => {
    for (const m of MODELOS) {
      expect(m.filasSugeridas.length, m.id).toBeGreaterThan(0);
      for (const f of m.filasSugeridas) {
        expect(Object.keys(f).sort()).toEqual(['grafico', 'nombre', 'tipo', 'unidad']);
      }
    }
  });

  it('cada modelo declara a quién se atribuye Y que no se ha verificado', () => {
    // Una atribución sin esa advertencia se lee como una cita comprobada, y no
    // lo es: la obra original no se ha abierto en este proyecto.
    for (const m of MODELOS) {
      expect(m.atribucion.length, m.id).toBeGreaterThan(10);
      expect(m.verificado, m.id).toBe(false);
    }
  });

  it('los identificadores de fase son únicos en todo el catálogo', () => {
    const ids = MODELOS.flatMap((m) => m.fases.map((f) => `${m.id}/${f.id}`));
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('faseDe resuelve solo dentro de su modelo', () => {
    expect(faseDe('atr', 'acumulacion')?.nombre).toBe('Acumulación');
    expect(faseDe('clasico', 'acumulacion')).toBeNull();
    expect(modeloDe('inexistente')).toBeNull();
  });

  it('modeloDeFase encuentra al dueño de una fase sin ambigüedad', () => {
    expect(modeloDeFase('acumulacion')?.id).toBe('atr');
    expect(modeloDeFase('prep_general')?.id).toBe('clasico');
    expect(modeloDeFase('bloque_carga')?.id).toBe('bloques');
    expect(modeloDeFase(null)).toBeNull();
    expect(modeloDeFase('no-existe')).toBeNull();
  });
});

describe('sembrar un macrociclo desde un modelo', () => {
  it('el reparto es a partes iguales, y eso es deliberado', () => {
    // Cuánto dura cada fase ES la decisión del entrenador. Un reparto
    // «bueno» estaría afirmando una proporción que nadie ha escrito aquí.
    expect(repartirSemanas(12, 3)).toEqual([4, 4, 4]);
  });

  it('el resto se reparte desde la PRIMERA fase', () => {
    // Quedarse corto al final dejaría la fase que toca la competición con
    // menos semanas sin que nadie lo haya decidido.
    expect(repartirSemanas(14, 3)).toEqual([5, 5, 4]);
    expect(repartirSemanas(13, 3)).toEqual([5, 4, 4]);
  });

  it('el reparto SIEMPRE suma el total', () => {
    for (let total = 1; total <= 104; total++) {
      for (let fases = 1; fases <= 5; fases++) {
        const r = repartirSemanas(total, fases);
        const suma = r.reduce((a, b) => a + b, 0);
        expect(suma, `${total} en ${fases}`).toBe(Math.min(total, Math.max(total, suma)));
        expect(r.every((n) => n >= 1), `${total} en ${fases}`).toBe(true);
      }
    }
  });

  it('con menos semanas que fases no se crean mesociclos de cero', () => {
    expect(repartirSemanas(2, 4)).toEqual([1, 1]);
    expect(repartirSemanas(0, 3)).toEqual([]);
  });

  it('sembrar produce mesociclos coherentes con el total', () => {
    for (const m of MODELOS) {
      const mesos = mesociclosDelModelo(m.id, 12, nuevoId);
      expect(mesos.length, m.id).toBe(m.fases.length);
      expect(semanasCubiertas(mesos), m.id).toBe(12);
      const c: ContenidoMacrociclo = {
        ...contenidoVacio(12),
        mesociclos: mesos,
        filas: m.filasSugeridas.map((f) => filaNueva(f.nombre, 12, f.tipo, f.unidad)),
      };
      expect(problemasDe(c, 12), m.id).toEqual([]);
    }
  });

  it('las celdas sembradas salen VACÍAS', () => {
    const modelo = modeloDe('atr')!;
    const filas = modelo.filasSugeridas.map((f) => filaNueva(f.nombre, 8, f.tipo, f.unidad));
    for (const f of filas) expect(f.valores.every((v) => v === null), f.nombre).toBe(true);
  });

  it('un modelo inexistente no siembra nada', () => {
    expect(mesociclosDelModelo('no-existe', 12, nuevoId)).toEqual([]);
  });
});
