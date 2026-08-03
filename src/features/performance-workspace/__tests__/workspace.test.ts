import { describe, expect, it } from 'vitest';
import {
  ETIQUETA_ESTADO_ATLETA,
  ETIQUETA_ESTADO_EVALUACION,
  admiteInforme,
  admiteRegistros,
  esVisibleEnListado,
  puedeTransicionarAtleta,
  puedeTransicionarEvaluacion,
  transicionesEvaluacion,
} from '../schemas/estados';
import {
  CATALOGO_PAS,
  PRUEBAS,
  VERSION_CATALOGO,
  esPruebaRegistrable,
  nombrePrueba,
} from '../schemas/catalogo';
import { validarAtleta, validarEvaluacion, validarRegistro } from '../schemas/validacion';
import {
  coincideBusqueda,
  construirHistorial,
  deportesDisponibles,
  filtrarAtletas,
  filtrarEvaluaciones,
  normalizar,
  ordenarCronologico,
  registrosVigentes,
} from '../services/consultas';
import { columnasDeValor, mapAtleta, mapRegistro, mapValor } from '../repository/mappers';
import { atleta, evaluacion, filaAtleta, filaRegistro, registro, HOY } from './fixtures';

// ── Schemas, filtros y mapeo (Sprint PAS-7.0) ──────────────────────────────

describe('máquina de estados · atleta', () => {
  it('activo puede archivarse y eliminarse', () => {
    expect(puedeTransicionarAtleta('activo', 'archivado')).toBe(true);
    expect(puedeTransicionarAtleta('activo', 'eliminado')).toBe(true);
  });

  it('archivado puede reactivarse', () => {
    expect(puedeTransicionarAtleta('archivado', 'activo')).toBe(true);
  });

  it('eliminado es terminal: no se reactiva', () => {
    expect(puedeTransicionarAtleta('eliminado', 'activo')).toBe(false);
    expect(puedeTransicionarAtleta('eliminado', 'archivado')).toBe(false);
  });

  it('un atleta eliminado nunca se lista', () => {
    expect(esVisibleEnListado('eliminado')).toBe(false);
    expect(esVisibleEnListado('archivado')).toBe(true);
  });

  it('todas las etiquetas existen', () => {
    for (const estado of ['activo', 'archivado', 'eliminado'] as const) {
      expect(ETIQUETA_ESTADO_ATLETA[estado]).toBeTruthy();
    }
  });
});

describe('máquina de estados · evaluación', () => {
  it('el borrador se cierra o se anula', () => {
    expect(transicionesEvaluacion('borrador')).toEqual(['completada', 'anulada']);
  });

  it('una completada puede compartirse y archivarse', () => {
    expect(puedeTransicionarEvaluacion('completada', 'compartida')).toBe(true);
    expect(puedeTransicionarEvaluacion('completada', 'archivada')).toBe(true);
  });

  it('anulada es terminal', () => {
    expect(transicionesEvaluacion('anulada')).toEqual([]);
  });

  it('no se puede volver a borrador desde ningún estado', () => {
    for (const estado of ['completada', 'compartida', 'archivada', 'anulada'] as const) {
      expect(puedeTransicionarEvaluacion(estado, 'borrador'), estado).toBe(false);
    }
  });

  it('solo el borrador admite registros', () => {
    expect(admiteRegistros('borrador')).toBe(true);
    for (const estado of ['completada', 'compartida', 'archivada', 'anulada'] as const) {
      expect(admiteRegistros(estado), estado).toBe(false);
    }
  });

  it('todas menos la anulada derivan informe', () => {
    expect(admiteInforme('anulada')).toBe(false);
    for (const estado of ['borrador', 'completada', 'compartida', 'archivada'] as const) {
      expect(admiteInforme(estado), estado).toBe(true);
    }
  });

  it('todas las etiquetas existen', () => {
    for (const estado of ['borrador', 'completada', 'anulada', 'compartida', 'archivada'] as const) {
      expect(ETIQUETA_ESTADO_EVALUACION[estado]).toBeTruthy();
    }
  });
});

describe('catálogo de pruebas', () => {
  it('declara las 11 pruebas de la base de conocimiento', () => {
    expect(PRUEBAS).toHaveLength(11);
    expect(CATALOGO_PAS.pruebas).toHaveLength(11);
  });

  it('ningún id se repite', () => {
    const ids = PRUEBAS.map((p) => p.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('declara exactamente las 7 correspondencias autorizadas', () => {
    const total = CATALOGO_PAS.pruebas.reduce((s, p) => s + p.contribuciones.length, 0);
    expect(total).toBe(7);
  });

  it('toda correspondencia lleva referencia verificable', () => {
    for (const prueba of CATALOGO_PAS.pruebas) {
      for (const contribucion of prueba.contribuciones) {
        expect(contribucion.referencia, prueba.id).toBeTruthy();
      }
    }
  });

  it('las correspondencias cubren 6 capacidades', () => {
    const capacidades = new Set(
      CATALOGO_PAS.pruebas.flatMap((p) => p.contribuciones.map((c) => c.capacidad))
    );
    expect(capacidades.size).toBe(6);
  });

  it('ninguna prueba declara vigencia: la base no la documenta', () => {
    for (const prueba of CATALOGO_PAS.pruebas) {
      expect(prueba.vigenciaDias, prueba.id).toBeNull();
    }
  });

  it('las pruebas sin correspondencia autorizada no contribuyen a nada', () => {
    for (const id of ['P-04', 'P-09', 'P-10', 'P-11']) {
      const prueba = CATALOGO_PAS.pruebas.find((p) => p.id === id);
      expect(prueba?.contribuciones, id).toEqual([]);
    }
  });

  it('reconoce y rechaza identificadores', () => {
    expect(esPruebaRegistrable('P-01')).toBe(true);
    expect(esPruebaRegistrable('P-99')).toBe(false);
  });

  it('nombrePrueba devuelve el id cuando no la conoce', () => {
    expect(nombrePrueba('P-99')).toBe('P-99');
    expect(nombrePrueba('P-01')).toContain('1RM');
  });

  it('la versión del catálogo está declarada', () => {
    expect(CATALOGO_PAS.version).toBe(VERSION_CATALOGO);
  });
});

describe('validación · atleta', () => {
  it('acepta un alta mínima', () => {
    expect(validarAtleta({ nombre: 'Ana' }).ok).toBe(true);
  });

  it('exige nombre', () => {
    expect(validarAtleta({ nombre: '   ' }).errores).toContain('NOMBRE_REQUERIDO');
  });

  it('rechaza un nombre demasiado largo', () => {
    expect(validarAtleta({ nombre: 'x'.repeat(121) }).errores).toContain('NOMBRE_DEMASIADO_LARGO');
  });

  it('rechaza una fecha de nacimiento imposible', () => {
    expect(
      validarAtleta({ nombre: 'Ana', fechaNacimiento: '2000-02-30' }).errores
    ).toContain('FECHA_INVALIDA');
  });

  it('acepta una fecha de nacimiento válida', () => {
    expect(validarAtleta({ nombre: 'Ana', fechaNacimiento: '1994-05-12' }).ok).toBe(true);
  });

  it('rechaza campos que exceden su longitud', () => {
    expect(validarAtleta({ nombre: 'Ana', deporte: 'x'.repeat(61) }).errores).toContain(
      'CAMPO_DEMASIADO_LARGO'
    );
  });
});

describe('validación · evaluación', () => {
  it('acepta una evaluación correcta', () => {
    expect(validarEvaluacion({ atletaId: 'a1', tipo: 'T-01', fecha: HOY }, HOY).ok).toBe(true);
  });

  it('exige atleta', () => {
    expect(
      validarEvaluacion({ atletaId: '', tipo: 'T-01', fecha: HOY }, HOY).errores
    ).toContain('ATLETA_REQUERIDO');
  });

  it('rechaza un tipo fuera del catálogo del PAS', () => {
    expect(
      validarEvaluacion({ atletaId: 'a1', tipo: 'T-99' as never, fecha: HOY }, HOY).errores
    ).toContain('TIPO_INVALIDO');
  });

  it('rechaza una fecha futura', () => {
    expect(
      validarEvaluacion({ atletaId: 'a1', tipo: 'T-01', fecha: '2027-01-01' }, HOY).errores
    ).toContain('FECHA_FUTURA');
  });

  it('la fecha de hoy no es futura', () => {
    expect(validarEvaluacion({ atletaId: 'a1', tipo: 'T-01', fecha: HOY }, HOY).ok).toBe(true);
  });
});

describe('validación · registro', () => {
  const base = { evaluacionId: 'ev1', pruebaId: 'P-01', fecha: HOY };

  it('acepta un registro válido con su patrón', () => {
    const r = validarRegistro(
      { ...base, valor: { tipo: 'continuo', valor: 100, unidad: 'kg' }, patron: 'sentadilla' },
      HOY
    );
    expect(r.ok).toBe(true);
  });

  it('rechaza una prueba fuera del catálogo y corta ahí', () => {
    const r = validarRegistro(
      { ...base, pruebaId: 'P-99', valor: { tipo: 'continuo', valor: 1, unidad: 'kg' } },
      HOY
    );
    expect(r.errores).toEqual(['PRUEBA_NO_CATALOGADA']);
  });

  it('rechaza un valor de otra naturaleza', () => {
    const r = validarRegistro(
      { ...base, valor: { tipo: 'binario', valor: true }, patron: 'sentadilla' },
      HOY
    );
    expect(r.errores).toContain('VALOR_INCOMPATIBLE');
  });

  it('rechaza un número no finito', () => {
    const r = validarRegistro(
      { ...base, valor: { tipo: 'continuo', valor: NaN, unidad: 'kg' }, patron: 's' },
      HOY
    );
    expect(r.errores).toContain('VALOR_NO_FINITO');
  });

  it('exige patrón cuando la prueba lo requiere', () => {
    const r = validarRegistro(
      { ...base, valor: { tipo: 'continuo', valor: 100, unidad: 'kg' } },
      HOY
    );
    expect(r.errores).toContain('PATRON_REQUERIDO');
  });

  it('no exige patrón cuando la prueba no lo requiere', () => {
    const r = validarRegistro(
      { ...base, pruebaId: 'P-03', valor: { tipo: 'continuo', valor: 40, unidad: 'kg' } },
      HOY
    );
    expect(r.ok).toBe(true);
  });

  it('rechaza una fecha futura', () => {
    const r = validarRegistro(
      {
        ...base,
        fecha: '2027-01-01',
        valor: { tipo: 'continuo', valor: 100, unidad: 'kg' },
        patron: 's',
      },
      HOY
    );
    expect(r.errores).toContain('FECHA_FUTURA');
  });

  it('el FMS exige valor ordinal', () => {
    const r = validarRegistro(
      { ...base, pruebaId: 'P-09', valor: { tipo: 'ordinal', valor: 2, escala: 3 } },
      HOY
    );
    expect(r.ok).toBe(true);
  });
});

describe('búsqueda y filtros', () => {
  const lista = [
    atleta({ id: 'a1', nombre: 'Ana Pérez', documento: '12345', deporte: 'Atletismo' }),
    atleta({ id: 'a2', nombre: 'Luis Gómez', codigoInterno: 'INT-7', deporte: 'Fútbol' }),
    atleta({ id: 'a3', nombre: 'Archivado', estado: 'archivado' }),
    atleta({ id: 'a4', nombre: 'Borrado', estado: 'eliminado' }),
  ];

  it('normalizar quita tildes y mayúsculas', () => {
    expect(normalizar('  Ángel Pérez ')).toBe('angel perez');
  });

  it('busca por nombre sin tildes', () => {
    expect(coincideBusqueda(lista[0], 'perez')).toBe(true);
  });

  it('busca por documento', () => {
    expect(coincideBusqueda(lista[0], '12345')).toBe(true);
  });

  it('busca por código interno', () => {
    expect(coincideBusqueda(lista[1], 'INT-7')).toBe(true);
  });

  it('una búsqueda vacía casa con todos', () => {
    expect(coincideBusqueda(lista[0], '  ')).toBe(true);
  });

  it('el eliminado nunca aparece, ni pidiendo su estado', () => {
    expect(filtrarAtletas(lista).map((a) => a.id)).not.toContain('a4');
    expect(filtrarAtletas(lista, { estado: 'eliminado' })).toEqual([]);
  });

  it('filtra por estado', () => {
    expect(filtrarAtletas(lista, { estado: 'archivado' }).map((a) => a.id)).toEqual(['a3']);
  });

  it('filtra por deporte', () => {
    expect(filtrarAtletas(lista, { deporte: 'Fútbol' }).map((a) => a.id)).toEqual(['a2']);
  });

  it('combina búsqueda y estado', () => {
    expect(filtrarAtletas(lista, { busqueda: 'ana', estado: 'activo' }).map((a) => a.id)).toEqual([
      'a1',
    ]);
  });

  it('los deportes disponibles excluyen los eliminados', () => {
    expect(deportesDisponibles(lista)).toEqual(['Atletismo', 'Fútbol']);
  });
});

describe('filtros de evaluación', () => {
  const lista = [
    evaluacion({ id: 'e1', fecha: '2026-01-15', tipo: 'T-01', estado: 'completada' }),
    evaluacion({ id: 'e2', fecha: '2026-06-01', tipo: 'T-02', estado: 'borrador' }),
    evaluacion({ id: 'e3', fecha: '2026-08-01', tipo: 'T-02', estado: 'anulada', atletaId: 'a2' }),
  ];

  it('filtra por atleta', () => {
    expect(filtrarEvaluaciones(lista, { atletaId: 'a2' }).map((e) => e.id)).toEqual(['e3']);
  });

  it('filtra por estado', () => {
    expect(filtrarEvaluaciones(lista, { estado: 'borrador' }).map((e) => e.id)).toEqual(['e2']);
  });

  it('filtra por tipo', () => {
    expect(filtrarEvaluaciones(lista, { tipo: 'T-02' })).toHaveLength(2);
  });

  it('filtra por rango de fechas, con ambos extremos incluidos', () => {
    expect(
      filtrarEvaluaciones(lista, { desde: '2026-01-15', hasta: '2026-06-01' }).map((e) => e.id)
    ).toEqual(['e1', 'e2']);
  });

  it('sin filtros devuelve todo', () => {
    expect(filtrarEvaluaciones(lista)).toHaveLength(3);
  });

  it('ordena de la más reciente a la más antigua', () => {
    expect(ordenarCronologico(lista).map((e) => e.id)).toEqual(['e3', 'e2', 'e1']);
  });

  it('el orden es estable a igual fecha', () => {
    const misma = [
      evaluacion({ id: 'b', fecha: HOY, createdAt: '2026-08-02T10:00:00Z' }),
      evaluacion({ id: 'a', fecha: HOY, createdAt: '2026-08-02T10:00:00Z' }),
    ];
    expect(ordenarCronologico(misma).map((e) => e.id)).toEqual(['a', 'b']);
  });
});

describe('historial', () => {
  const evaluaciones = [
    evaluacion({ id: 'e1', fecha: '2026-01-15' }),
    evaluacion({ id: 'e2', fecha: '2026-06-01', estado: 'completada' }),
  ];

  it('usa los recuentos recibidos, no recorre registros', () => {
    const historial = construirHistorial(
      evaluaciones,
      [
        { evaluacionId: 'e1', pruebas: 3, capacidades: 2 },
        { evaluacionId: 'e2', pruebas: 5, capacidades: 4 },
      ],
      'pae-1.0.0'
    );

    expect(historial[0]).toMatchObject({ evaluacionId: 'e2', pruebas: 5, capacidades: 4 });
    expect(historial[1]).toMatchObject({ evaluacionId: 'e1', pruebas: 3, capacidades: 2 });
  });

  it('sin recuento, muestra cero en vez de omitir la fila', () => {
    const historial = construirHistorial(evaluaciones, [], 'pae-1.0.0');
    expect(historial).toHaveLength(2);
    expect(historial.every((e) => e.pruebas === 0 && e.capacidades === 0)).toBe(true);
  });

  it('declara la versión del sistema en cada fila', () => {
    const historial = construirHistorial(evaluaciones, [], 'pae-1.0.0');
    expect(historial.every((e) => e.versionPAS === 'pae-1.0.0')).toBe(true);
  });

  it('registrosVigentes excluye los anulados sin borrarlos de la lista original', () => {
    const registros = [registro({ id: 'r1' }), registro({ id: 'r2', estado: 'anulada' })];
    expect(registrosVigentes(registros).map((r) => r.id)).toEqual(['r1']);
    expect(registros).toHaveLength(2);
  });
});

describe('mapeo fila ↔ entidad', () => {
  it('convierte numeric de Postgres, que llega como cadena', () => {
    const valor = mapValor(filaRegistro());
    expect(valor).toEqual({ tipo: 'continuo', valor: 100.5, unidad: 'kg' });
    expect(typeof (valor as { valor: number }).valor).toBe('number');
  });

  it('reconstruye la variante ordinal', () => {
    expect(mapValor(filaRegistro({ valor_tipo: 'ordinal', valor_num: '2', escala: '3' }))).toEqual({
      tipo: 'ordinal',
      valor: 2,
      escala: 3,
    });
  });

  it('reconstruye la variante binaria', () => {
    expect(
      mapValor(filaRegistro({ valor_tipo: 'binario', valor_num: null, valor_bool: true }))
    ).toEqual({ tipo: 'binario', valor: true });
  });

  it('reconstruye la variante categórica', () => {
    expect(
      mapValor(filaRegistro({ valor_tipo: 'categorico', valor_num: null, valor_texto: 'ok' }))
    ).toEqual({ tipo: 'categorico', valor: 'ok' });
  });

  it('mapRegistro conserva el estado anulado', () => {
    expect(mapRegistro(filaRegistro({ estado: 'anulada' })).estado).toBe('anulada');
  });

  it('mapAtleta traduce snake_case a camelCase', () => {
    const entidad = mapAtleta(filaAtleta({ codigo_interno: 'INT-1', profesional_id: 'p9' }));
    expect(entidad.codigoInterno).toBe('INT-1');
    expect(entidad.profesionalId).toBe('p9');
  });

  it('las cadenas vacías se normalizan a null', () => {
    expect(mapAtleta(filaAtleta({ documento: '' })).documento).toBeNull();
  });

  it('columnasDeValor produce exactamente las columnas del CHECK', () => {
    expect(columnasDeValor({ tipo: 'continuo', valor: 100, unidad: 'kg' })).toMatchObject({
      valor_tipo: 'continuo',
      valor_num: 100,
      unidad: 'kg',
      valor_texto: null,
      valor_bool: null,
    });
  });

  it('la ida y vuelta del valor es fiel', () => {
    for (const valor of [
      { tipo: 'continuo', valor: 12.5, unidad: 'cm' },
      { tipo: 'ordinal', valor: 2, escala: 3 },
      { tipo: 'binario', valor: false },
      { tipo: 'categorico', valor: 'apto' },
    ] as const) {
      const columnas = columnasDeValor(valor);
      expect(mapValor(columnas)).toEqual(valor);
    }
  });
});
