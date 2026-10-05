// ── La curva de carga (Sprint MAC-2) ───────────────────────────────────────
//
// LO QUE ESTE FICHERO DEFIENDE, Y ES UNA SOLA COSA:
//
//   Que la curva dibuje lo que el entrenador escribió y NADA MÁS.
//
//   Un gráfico miente de dos maneras y las dos son invisibles: uniendo dos
//   puntos por encima de una semana vacía —lo que dibuja una progresión que
//   nadie planificó—, y suavizando la línea con curvas que inventan valores
//   intermedios para que quede bonita. Las dos están prohibidas aquí.

import { describe, expect, it } from 'vitest';

import { COLORES_CURVA, alternarGrafico, contenidoVacio, filaNueva } from '../contenido';
import {
  MARCAS_EJE,
  coordenada,
  numeroDeCelda,
  serieDeFila,
  seriesDeCurva,
  trazoDeTramo,
} from '../curva';
import type { FilaPlan } from '../tipos';

/** Una fila con sus valores ya puestos. */
function fila(valores: (string | null)[], grafico: string | null = '#3b82f6'): FilaPlan {
  const f = filaNueva('Volumen', valores.length, 'numero', 'kg', grafico);
  return { ...f, valores };
}

describe('qué se lee como punto y qué no', () => {
  it('CONTROL POSITIVO · un número se lee', () => {
    expect(numeroDeCelda('5000')).toBe(5000);
  });

  it('la coma decimal y el signo de porcentaje se toleran', () => {
    // «75 %» es como se escribe de verdad en una fila de intensidad.
    expect(numeroDeCelda('7,5')).toBe(7.5);
    expect(numeroDeCelda('75 %')).toBe(75);
    expect(numeroDeCelda('  80%  ')).toBe(80);
  });

  it('una anotación NO es un punto', () => {
    // «alto» en la fila de intensidad es una anotación legítima. Convertirla
    // en un número exigiría inventar cuál.
    expect(numeroDeCelda('alto')).toBeNull();
    expect(numeroDeCelda('8-10')).toBeNull();
    expect(numeroDeCelda('')).toBeNull();
    expect(numeroDeCelda(null)).toBeNull();
  });

  it('el cero SÍ es un punto', () => {
    // Una semana de descarga total es una decisión, no un hueco.
    expect(numeroDeCelda('0')).toBe(0);
  });
});

describe('solo se dibujan las filas marcadas', () => {
  it('una fila sin color no produce serie', () => {
    expect(serieDeFila(fila(['10', '20'], null))).toBeNull();
  });

  it('una fila marcada pero sin ningún número tampoco', () => {
    // Una serie sin puntos no es una línea plana en cero: es una línea que no
    // existe, y dibujarla en el suelo diría que el volumen planificado es cero.
    expect(serieDeFila(fila([null, 'alto', ''], '#f00'))).toBeNull();
  });

  it('seriesDeCurva conserva el orden de las filas', () => {
    const filas = [
      fila(['1', '2'], '#111'),
      fila(['3', '4'], null),
      fila(['5', '6'], '#222'),
    ];
    expect(seriesDeCurva(filas).map((s) => s.color)).toEqual(['#111', '#222']);
  });
});

describe('EL HUECO PARTE LA LÍNEA', () => {
  it('una semana sin valor corta el trazo en dos', () => {
    // Unir esos dos puntos dibujaría una progresión que nadie planificó, y el
    // ojo la leería como parte del plan: una línea continua no se lee como una
    // suposición.
    const s = serieDeFila(fila(['10', '20', null, '40', '50']))!;
    expect(s.tramos).toHaveLength(2);
    expect(s.tramos[0].map((p) => p.semana)).toEqual([0, 1]);
    expect(s.tramos[1].map((p) => p.semana)).toEqual([3, 4]);
  });

  it('varios huecos producen varios tramos', () => {
    const s = serieDeFila(fila(['1', null, '2', null, '3']))!;
    expect(s.tramos).toHaveLength(3);
  });

  it('un hueco al principio y al final no deja tramos vacíos', () => {
    const s = serieDeFila(fila([null, '1', '2', null]))!;
    expect(s.tramos).toHaveLength(1);
    expect(s.tramos[0].map((p) => p.semana)).toEqual([1, 2]);
  });

  it('sin huecos hay un solo tramo', () => {
    const s = serieDeFila(fila(['1', '2', '3']))!;
    expect(s.tramos).toHaveLength(1);
    expect(s.conValor).toBe(3);
  });

  it('un punto suelto es un tramo de uno, no se descarta', () => {
    // Una sola semana planificada tiene que verse. Descartarla porque «no hace
    // línea» escondería el único dato que hay.
    const s = serieDeFila(fila([null, '42', null]))!;
    expect(s.tramos).toEqual([[{ semana: 1, valor: 42, relativo: 1 }]]);
  });
});

describe('cada serie se escala contra su propio máximo', () => {
  it('el máximo vale 1 y el resto se reparte', () => {
    const s = serieDeFila(fila(['50', '100', '25']))!;
    expect(s.maximo).toBe(100);
    expect(s.minimo).toBe(25);
    expect(s.tramos[0].map((p) => p.relativo)).toEqual([0.5, 1, 0.25]);
  });

  it('volumen en kg e intensidad en % conviven sin aplastarse', () => {
    // Es el motivo de normalizar por serie: en un eje común, una intensidad de
    // 75 quedaría pegada al suelo junto a un volumen de 5.000.
    const [vol, int] = seriesDeCurva([
      fila(['5000', '4000'], '#00f'),
      { ...fila(['75', '85'], '#f00'), nombre: 'Intensidad', unidad: '%' },
    ]);
    expect(vol.tramos[0].map((p) => p.relativo)).toEqual([1, 0.8]);
    expect(int.tramos[0].map((p) => p.relativo)).toEqual([75 / 85, 1]);
  });

  it('el máximo real viaja con la serie, para que el eje tenga referente', () => {
    // Un «100 %» sin decir 100 % de qué es un número sin referente.
    const s = serieDeFila(fila(['3000', '6000']))!;
    expect(s.maximo).toBe(6000);
    expect(s.unidad).toBe('kg');
  });

  it('todo a cero no divide entre cero: se dibuja a media altura', () => {
    const s = serieDeFila(fila(['0', '0']))!;
    expect(s.tramos[0].every((p) => p.relativo === 0.5)).toBe(true);
  });

  it('valores iguales dan una línea plana ARRIBA, no a media altura', () => {
    // Son todos el máximo de su serie. Aplastarlos al centro sugeriría una
    // variación que no existe.
    const s = serieDeFila(fila(['80', '80', '80']))!;
    expect(s.tramos[0].every((p) => p.relativo === 1)).toBe(true);
  });
});

describe('la geometría se alinea con la rejilla', () => {
  it('cada punto se centra en SU columna de semana', () => {
    // Sin el medio paso, la curva sale corrida media columna a la izquierda y
    // deja de alinearse con la celda a la que se refiere, que es todo el
    // sentido de dibujarla debajo.
    const p = { semana: 0, valor: 1, relativo: 1 };
    expect(coordenada(p, 4, 400, 100).x).toBe(50);
    expect(coordenada({ ...p, semana: 3 }, 4, 400, 100).x).toBe(350);
  });

  it('el eje crece hacia arriba aunque el SVG crezca hacia abajo', () => {
    const arriba = coordenada({ semana: 0, valor: 1, relativo: 1 }, 1, 100, 200);
    const abajo = coordenada({ semana: 0, valor: 0, relativo: 0 }, 1, 100, 200);
    expect(arriba.y).toBe(0);
    expect(abajo.y).toBe(200);
  });

  it('el margen deja sitio arriba y abajo sin descentrar', () => {
    const arriba = coordenada({ semana: 0, valor: 1, relativo: 1 }, 1, 100, 200, 10);
    const abajo = coordenada({ semana: 0, valor: 0, relativo: 0 }, 1, 100, 200, 10);
    expect(arriba.y).toBe(10);
    expect(abajo.y).toBe(190);
  });

  it('EL TRAZO NO LLEVA CURVAS: solo M y L', () => {
    // Un suavizado inventa valores entre dos semanas para que la línea quede
    // bonita, y esos valores no los ha escrito nadie.
    const s = serieDeFila(fila(['10', '20', '15']))!;
    const d = trazoDeTramo(s.tramos[0], 3, 300, 100);
    expect(d).toMatch(/^M[\d.,]+ L[\d.,]+ L[\d.,]+$/);
    expect(d).not.toMatch(/[CQSTA]/);
  });

  it('un tramo vacío produce un trazo vacío, no un path roto', () => {
    expect(trazoDeTramo([], 4, 400, 100)).toBe('');
  });

  it('el eje es una retícula FIJA, no calculada de los datos', () => {
    // Que lo sea es lo que permite comparar dos macrociclos de un vistazo.
    expect(MARCAS_EJE).toEqual([100, 90, 80, 70, 60, 50]);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// METER Y SACAR UNA FILA DE LA CURVA
// ════════════════════════════════════════════════════════════════════════════

describe('alternar una fila en la curva', () => {
  const plan = () => ({
    ...contenidoVacio(3),
    filas: [
      filaNueva('Volumen', 3, 'numero', 'kg', COLORES_CURVA[0]),
      filaNueva('Intensidad', 3, 'porcentaje', '%', COLORES_CURVA[1]),
      filaNueva('Contenidos', 3),
    ],
  });

  it('CONTROL POSITIVO · una fila marcada se desmarca', () => {
    const c = plan();
    const despues = alternarGrafico(c, c.filas[0].id);
    expect(despues.filas[0].grafico).toBeNull();
  });

  it('una fila sin marcar toma el primer color LIBRE', () => {
    // Dos líneas del mismo color son dos líneas que no se distinguen.
    const c = plan();
    const despues = alternarGrafico(c, c.filas[2].id);
    expect(despues.filas[2].grafico).toBe(COLORES_CURVA[2]);
  });

  it('un color concreto manda sobre la elección automática', () => {
    const c = plan();
    expect(alternarGrafico(c, c.filas[2].id, '#123456').filas[2].grafico).toBe('#123456');
  });

  it('no toca ninguna otra fila', () => {
    const c = plan();
    const despues = alternarGrafico(c, c.filas[2].id);
    expect(despues.filas[0].grafico).toBe(COLORES_CURVA[0]);
    expect(despues.filas[1].grafico).toBe(COLORES_CURVA[1]);
  });

  it('una fila que no existe no cambia nada', () => {
    const c = plan();
    expect(alternarGrafico(c, 'no-existe')).toBe(c);
  });

  it('con todos los colores en uso se reutiliza el primero', () => {
    // Peor que un color libre y mejor que negarse a dibujar.
    const c = {
      ...contenidoVacio(2),
      filas: [
        ...COLORES_CURVA.map((color, i) => filaNueva(`F${i}`, 2, 'numero', '', color)),
        filaNueva('Extra', 2),
      ],
    };
    const ultima = c.filas[c.filas.length - 1];
    expect(alternarGrafico(c, ultima.id).filas.at(-1)!.grafico).toBe(COLORES_CURVA[0]);
  });

  it('los colores del catálogo no se repiten', () => {
    expect(new Set(COLORES_CURVA).size).toBe(COLORES_CURVA.length);
  });
});
