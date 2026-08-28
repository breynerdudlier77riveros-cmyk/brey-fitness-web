// ── Fichas que parecen la misma persona (Sprint PAS-14) ────────────────────
//
// EL CASO REAL: dos fichas «breyner dudlier riveros», una con sexo y país y
// otra con los dos en blanco, con las evaluaciones repartidas entre las dos.
// El histórico partido en dos expedientes que no se ven entre sí, y ninguna
// pantalla lo decía.
//
// LO QUE ESTOS TESTS PROTEGEN:
//
//   1 · QUE SOSPECHE, NO QUE DECIDA. Dos homónimos son perfectamente posibles
//       —dos hermanos, un padre y un hijo— y unir por parecido inventaría una
//       identidad, que es lo que este sistema se niega a hacer en todas partes.
//
//   2 · QUE NO OFREZCA FUSIONAR CUANDO LA IDENTIDAD SE CONTRADICE. Si una dice
//       varón y la otra mujer, casi seguro no son la misma persona, y el
//       traslado de evaluaciones no se puede deshacer.
//
//   3 · QUE UN DATO AUSENTE NO CUENTE COMO CONTRADICCIÓN. Es justo el caso que
//       una fusión arregla; tratarlo como conflicto escondería el duplicado
//       más común de todos.

import { describe, expect, it } from 'vitest';

import {
  gruposDuplicados,
  masCompleta,
  normalizarNombre,
  type AtletaComparable,
} from '../services/duplicados-atleta';

const a = (over: Partial<AtletaComparable> & { id: string }): AtletaComparable => ({
  nombre: 'breyner dudlier riveros',
  sexo: null,
  fechaNacimiento: null,
  pais: null,
  estado: 'activo',
  ...over,
});

describe('normalizarNombre', () => {
  it('ignora mayúsculas, tildes y espacios de más', () => {
    // Así es como aparece un duplicado de verdad: el mismo nombre tecleado
    // dos veces, no dos nombres distintos.
    expect(normalizarNombre('  Breyner   Dudlier  RIVEROS ')).toBe('breyner dudlier riveros');
    expect(normalizarNombre('José Muñóz')).toBe(normalizarNombre('jose munoz'));
  });
});

describe('detección', () => {
  it('encuentra el caso real', () => {
    const grupos = gruposDuplicados([
      a({ id: '1' }),
      a({ id: '2', sexo: 'M', pais: 'CO', fechaNacimiento: '2004-01-17' }),
    ]);

    expect(grupos).toHaveLength(1);
    expect(grupos[0].atletas.map((x) => x.id)).toEqual(['1', '2']);
    expect(grupos[0].identidadEnConflicto).toBe(false);
  });

  it('CONTROL POSITIVO · sin duplicados no inventa ninguno', () => {
    const grupos = gruposDuplicados([a({ id: '1' }), a({ id: '2', nombre: 'Otra Persona' })]);
    expect(grupos).toEqual([]);
  });

  it('deja fuera a los eliminados', () => {
    // Su ficha existe para conservar el histórico, no para participar.
    const grupos = gruposDuplicados([a({ id: '1' }), a({ id: '2', estado: 'eliminado' })]);
    expect(grupos).toEqual([]);
  });

  it('un nombre en blanco no agrupa a nadie', () => {
    const grupos = gruposDuplicados([a({ id: '1', nombre: '  ' }), a({ id: '2', nombre: '' })]);
    expect(grupos).toEqual([]);
  });
});

describe('identidad en conflicto', () => {
  it('dos sexos distintos SÍ son conflicto', () => {
    const [g] = gruposDuplicados([a({ id: '1', sexo: 'M' }), a({ id: '2', sexo: 'F' })]);
    expect(g.identidadEnConflicto).toBe(true);
  });

  it('dos fechas de nacimiento distintas también', () => {
    const [g] = gruposDuplicados([
      a({ id: '1', fechaNacimiento: '2004-01-17' }),
      a({ id: '2', fechaNacimiento: '1998-05-02' }),
    ]);
    expect(g.identidadEnConflicto).toBe(true);
  });

  it('AUSENTE contra PRESENTE no es conflicto', () => {
    // Es el caso que la fusión resuelve. Marcarlo como conflicto escondería el
    // duplicado más frecuente y dejaría al profesional sin la herramienta.
    const [g] = gruposDuplicados([a({ id: '1', sexo: null }), a({ id: '2', sexo: 'M' })]);
    expect(g.identidadEnConflicto).toBe(false);
  });

  it('el mismo valor en las dos tampoco', () => {
    const [g] = gruposDuplicados([
      a({ id: '1', sexo: 'M', pais: 'CO' }),
      a({ id: '2', sexo: 'M', pais: 'CO' }),
    ]);
    expect(g.identidadEnConflicto).toBe(false);
  });
});

describe('cuál conservar', () => {
  it('sugiere la que más datos de identidad tiene', () => {
    const completa = a({ id: '2', sexo: 'M', pais: 'CO', fechaNacimiento: '2004-01-17' });
    expect(masCompleta([a({ id: '1' }), completa])?.id).toBe('2');
  });

  it('en empate se queda con la primera, para no cambiar de opinión sola', () => {
    // La sugerencia tiene que ser estable entre recargas: si bailara, el
    // profesional vería un botón distinto cada vez que entra.
    const lista = [a({ id: '1', sexo: 'M' }), a({ id: '2', sexo: 'M' })];
    expect(masCompleta(lista)?.id).toBe('1');
    expect(masCompleta([...lista])?.id).toBe('1');
  });

  it('sin fichas no sugiere nada', () => {
    expect(masCompleta([])).toBeNull();
  });

  it('es una SUGERENCIA: no decide por su cuenta', () => {
    // La función devuelve una ficha, no ejecuta nada. Quien fusiona es la
    // acción de servidor, y quien la invoca es una persona.
    const r = masCompleta([a({ id: '1' }), a({ id: '2', sexo: 'M' })]);
    expect(r).toHaveProperty('id');
  });
});
