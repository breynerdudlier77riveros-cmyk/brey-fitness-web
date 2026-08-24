// ── Edición estructural de una plantilla ───────────────────────────────────
//
// LO QUE ESTOS TESTS PROTEGEN:
//
//   1 · QUE NINGUNA OPERACIÓN MUTE LA ENTRADA. React compara por referencia:
//       una mutación en sitio produce el bug más caro de un editor, el de
//       «los datos cambian y la pantalla no».
//
//   2 · QUE DUPLICAR RENUEVE EL ID. Es la operación que más fácilmente
//       rompería la invariante que sostiene los ajustes por cliente. Con el
//       id repetido, las cargas de un cliente caerían sobre los dos
//       ejercicios y `problemasDe` rechazaría el documento al guardar.
//
//   3 · QUE MOVER FUERA DE RANGO NO SEA UN ERROR. Un editor que lanza porque
//       pulsaste «subir» en el primer elemento obliga a comprobar antes de
//       cada clic, y ese `if` acaba faltando en algún sitio.
//
//   4 · QUE AÑADIR UNA SERIE NO SE PROPAGUE. Subir de 3 a 4 series en la
//       semana 3 es una progresión legítima y tiene que poder expresarse.

import { describe, expect, it } from 'vitest';

import { bloqueNuevo, diaNuevo, ejercicioNuevo, ejerciciosDe, problemasDe } from '../contenido';
import {
  anadirDia,
  anadirEjercicio,
  anadirSerie,
  asegurarBloque,
  copiarSemana,
  duplicarEjercicio,
  editarEjercicio,
  editarSerie,
  moverDia,
  moverEjercicio,
  notasDia,
  quitarBloque,
  quitarDia,
  quitarEjercicio,
  quitarSerie,
  renombrarDia,
} from '../editar';
import type { Contenido } from '../tipos';

const SEMANAS = 3;

/** Un día con un bloque principal y dos ejercicios. */
function base(): Contenido {
  const a = ejercicioNuevo('Press de banca', SEMANAS);
  const b = ejercicioNuevo('Remo con barra', SEMANAS);
  a.semanas = a.semanas.map((_, i) => ({
    series: [{ reps: '5', pesoKg: 80 + i * 5, rir: 2, notas: null }],
  }));

  const bloque = bloqueNuevo('principal');
  bloque.ejercicios = [a, b];

  const dia = diaNuevo('Día 1');
  dia.bloques = [bloque];

  return { dias: [dia] };
}

const idsDe = (c: Contenido) => ejerciciosDe(c).map((e) => e.id);

describe('inmutabilidad', () => {
  it('ninguna operación toca la entrada', () => {
    const c = base();
    const antes = JSON.stringify(c);
    const [a] = idsDe(c);
    const diaId = c.dias[0].id;

    renombrarDia(c, diaId, 'Otro');
    notasDia(c, diaId, 'nota');
    moverDia(c, diaId, 1);
    quitarDia(c, diaId);
    anadirDia(c, diaNuevo('Nuevo'));
    asegurarBloque(c, diaId, 'accesorio');
    quitarBloque(c, diaId, c.dias[0].bloques[0].id);
    anadirEjercicio(c, diaId, c.dias[0].bloques[0].id, 'X', SEMANAS);
    editarEjercicio(c, a, { nombre: 'Cambiado' });
    quitarEjercicio(c, a);
    duplicarEjercicio(c, a);
    moverEjercicio(c, a, 1);
    anadirSerie(c, a, 0);
    quitarSerie(c, a, 0, 0);
    editarSerie(c, a, 0, 0, { pesoKg: 999 });
    copiarSemana(c, 0, 1);

    expect(JSON.stringify(c)).toBe(antes);
  });
});

describe('días', () => {
  it('renombra y anota', () => {
    const c = base();
    const id = c.dias[0].id;
    expect(renombrarDia(c, id, 'Empuje').dias[0].nombre).toBe('Empuje');
    expect(notasDia(c, id, 'Sin prisa').dias[0].notas).toBe('Sin prisa');
  });

  it('una nota en blanco se guarda como ausente, no como cadena vacía', () => {
    // Así la vista pregunta `dia.notas &&` y no tiene que saber que existe
    // un tercer estado entre «hay nota» y «no hay».
    const c = base();
    expect(notasDia(c, c.dias[0].id, '   ').dias[0].notas).toBeNull();
  });

  it('mover fuera de rango devuelve el contenido tal cual', () => {
    const c = anadirDia(base(), diaNuevo('Día 2'));
    const primero = c.dias[0].id;

    expect(moverDia(c, primero, -1)).toBe(c);
    expect(moverDia(c, 'no-existe', 1)).toBe(c);
    expect(moverDia(c, primero, 1).dias.map((d) => d.nombre)).toEqual(['Día 2', 'Día 1']);
  });
});

describe('bloques', () => {
  it('asegurar no duplica un bloque que ya existe', () => {
    // Dos «Accesorios» seguidos serían dos encabezados iguales y nadie
    // sabría en cuál escribir.
    const c = base();
    const id = c.dias[0].id;
    const conAccesorio = asegurarBloque(c, id, 'accesorio');

    expect(conAccesorio.dias[0].bloques).toHaveLength(2);
    expect(asegurarBloque(conAccesorio, id, 'accesorio').dias[0].bloques).toHaveLength(2);
  });

  it('quitar un bloque se lleva sus ejercicios', () => {
    const c = base();
    const sinBloque = quitarBloque(c, c.dias[0].id, c.dias[0].bloques[0].id);
    expect(ejerciciosDe(sinBloque)).toHaveLength(0);
  });
});

describe('ejercicios', () => {
  it('duplicar inserta la copia justo debajo', () => {
    const c = base();
    const [a] = idsDe(c);
    const nombres = ejerciciosDe(duplicarEjercicio(c, a)).map((e) => e.nombre);
    expect(nombres).toEqual(['Press de banca', 'Press de banca', 'Remo con barra']);
  });

  it('LA COPIA LLEVA UN ID NUEVO, y el documento sigue siendo válido', () => {
    // Sin id nuevo, los ajustes de un cliente sobre el original caerían
    // también sobre la copia — y `problemasDe` lo rechazaría al guardar.
    const c = base();
    const [a] = idsDe(c);
    const duplicado = duplicarEjercicio(c, a);

    const ids = idsDe(duplicado);
    expect(new Set(ids).size).toBe(ids.length);
    expect(problemasDe(duplicado, SEMANAS)).toEqual([]);
  });

  it('la copia no comparte las series con el original', () => {
    const c = base();
    const [a] = idsDe(c);
    const duplicado = duplicarEjercicio(c, a);
    const [original, copia] = ejerciciosDe(duplicado);

    copia.semanas[0].series[0].pesoKg = 999;
    expect(original.semanas[0].series[0].pesoKg).toBe(80);
  });

  it('mover fuera del bloque no hace nada', () => {
    const c = base();
    const [a, b] = idsDe(c);

    expect(idsDe(moverEjercicio(c, a, -1))).toEqual([a, b]);
    expect(idsDe(moverEjercicio(c, b, 1))).toEqual([a, b]);
    expect(idsDe(moverEjercicio(c, a, 1))).toEqual([b, a]);
  });

  it('quitar lo saca esté en el bloque que esté', () => {
    const c = base();
    const [a, b] = idsDe(c);
    expect(idsDe(quitarEjercicio(c, a))).toEqual([b]);
  });

  it('añadir crea el ejercicio con sus semanas completas', () => {
    const c = base();
    const conNuevo = anadirEjercicio(c, c.dias[0].id, c.dias[0].bloques[0].id, 'Fondos', SEMANAS);
    const fondos = ejerciciosDe(conNuevo).find((e) => e.nombre === 'Fondos')!;

    expect(fondos.semanas).toHaveLength(SEMANAS);
    expect(problemasDe(conNuevo, SEMANAS)).toEqual([]);
  });
});

describe('series', () => {
  it('añadir una serie afecta SOLO a esa semana', () => {
    // Subir de 1 a 2 series en la semana 3 y dejar 1 en las anteriores es
    // una progresión legítima. Propagarlo la impediría.
    const c = base();
    const [a] = idsDe(c);
    const e = ejerciciosDe(anadirSerie(c, a, 2))[0];

    expect(e.semanas.map((s) => s.series.length)).toEqual([1, 1, 2]);
  });

  it('la serie nueva copia la anterior', () => {
    const c = base();
    const [a] = idsDe(c);
    const e = ejerciciosDe(anadirSerie(c, a, 0))[0];

    expect(e.semanas[0].series[1].pesoKg).toBe(80);
    // Y es una copia, no la misma referencia.
    e.semanas[0].series[1].pesoKg = 999;
    expect(e.semanas[0].series[0].pesoKg).toBe(80);
  });

  it('quitar todas las series de una semana es válido', () => {
    // Un ejercicio que no se hace en la semana de descarga.
    const c = base();
    const [a] = idsDe(c);
    const sinSeries = quitarSerie(c, a, 1, 0);

    expect(ejerciciosDe(sinSeries)[0].semanas[1].series).toHaveLength(0);
    expect(problemasDe(sinSeries, SEMANAS)).toEqual([]);
  });

  it('editar una serie no toca a sus vecinas', () => {
    const c = base();
    const [a] = idsDe(c);
    const e = ejerciciosDe(editarSerie(c, a, 1, 0, { pesoKg: 100 }))[0];

    expect(e.semanas[0].series[0].pesoKg).toBe(80);
    expect(e.semanas[1].series[0].pesoKg).toBe(100);
    expect(e.semanas[2].series[0].pesoKg).toBe(90);
    // Y lo que el cambio no menciona sigue igual.
    expect(e.semanas[1].series[0].rir).toBe(2);
  });
});

describe('copiar una semana', () => {
  it('sustituye la semana destino en todos los ejercicios', () => {
    const c = base();
    const copiado = copiarSemana(c, 0, 2);
    const [press] = ejerciciosDe(copiado);

    expect(press.semanas[2].series[0].pesoKg).toBe(80);
    expect(press.semanas[1].series[0].pesoKg).toBe(85);
  });

  it('COPIA IGUAL, no incrementa', () => {
    // Es lo que separa esta operación de una sugerencia de progresión. El
    // sistema no propone cargas; solo ahorra teclear cuatro veces lo mismo.
    const c = base();
    const [press] = ejerciciosDe(copiarSemana(c, 0, 1));
    expect(press.semanas[1].series[0].pesoKg).toBe(80);
  });

  it('el destino es independiente del origen', () => {
    const c = base();
    const [press] = ejerciciosDe(copiarSemana(c, 0, 1));
    press.semanas[1].series[0].pesoKg = 999;
    expect(press.semanas[0].series[0].pesoKg).toBe(80);
  });

  it('copiar sobre sí misma no hace nada', () => {
    const c = base();
    expect(copiarSemana(c, 1, 1)).toBe(c);
  });

  it('una semana fuera de rango se ignora en vez de romper', () => {
    const c = base();
    expect(problemasDe(copiarSemana(c, 0, 9), SEMANAS)).toEqual([]);
    expect(problemasDe(copiarSemana(c, 9, 0), SEMANAS)).toEqual([]);
  });
});
