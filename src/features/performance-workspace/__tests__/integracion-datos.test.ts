// ── Integración real del dato (Sprint PAS-12 §34) ──────────────────────────
//
// LOS DOS ERRORES QUE ESTE FICHERO PERSIGUE, Y SON EL MISMO:
//
//   Un dato del PRESENTE reinterpretando una medición del PASADO.
//
//   · el peso de hoy aplicado a una evaluación de enero  → G-01
//   · la edad de hoy aplicada a una evaluación de enero  → §10
//
//   Los dos producen un número plausible, y por eso ninguno se detecta
//   mirando la pantalla. Solo se detectan con un test que use dos fechas.

import { describe, expect, it } from 'vitest';

import { calcularRelativa } from '@/lib/pas/evidencia';

import { mapEvaluacion, mapRegistro } from '../repository/mappers';
import { resolverSujeto } from '../services/sujeto';
import { atleta, evaluacion } from './fixtures';

// ════════════════════════════════════════════════════════════════════════════
// EL PESO LLEGA, Y LLEGA EL DE SU EVALUACIÓN
// ════════════════════════════════════════════════════════════════════════════

describe('el peso viaja desde la fila hasta el motor', () => {
  const fila = (over: Record<string, unknown> = {}) => ({
    id: 'e1',
    atleta_id: 'a1',
    tipo: 'T-01',
    fecha: '2026-08-15',
    estado: 'completada',
    observaciones: null,
    created_at: '2026-08-15T10:00:00Z',
    updated_at: '2026-08-15T10:00:00Z',
    ...over,
  });

  it('el mapeador lo lee de la columna', () => {
    expect(mapEvaluacion(fila({ peso_kg: 70 })).pesoKg).toBe(70);
  });

  it('sin columna o sin valor queda en null, no en cero', () => {
    // Cero sería un peso, y dividir por él daría infinito. `null` es «no consta».
    expect(mapEvaluacion(fila()).pesoKg).toBeNull();
    expect(mapEvaluacion(fila({ peso_kg: null })).pesoKg).toBeNull();
  });

  it('un valor no numérico no se cuela como peso', () => {
    expect(mapEvaluacion(fila({ peso_kg: '70' })).pesoKg).toBeNull();
  });

  it('DOS evaluaciones del mismo atleta conservan cada una SU peso', () => {
    // El caso que da nombre al gap. Si el sistema mezclara los pesos, este
    // test seguiría pasando con números plausibles — por eso se comprueban los
    // dos a la vez y contra su propia fecha.
    const enero = mapEvaluacion(fila({ id: 'e1', fecha: '2026-01-01', peso_kg: 65 }));
    const agosto = mapEvaluacion(fila({ id: 'e2', fecha: '2026-08-15', peso_kg: 70 }));

    expect(enero.pesoKg).toBe(65);
    expect(agosto.pesoKg).toBe(70);
    expect(enero.pesoKg).not.toBe(agosto.pesoKg);
  });

  it('y la fuerza relativa sale distinta en cada una, como debe', () => {
    // Mismo 1RM de 120 kg en las dos fechas: la relación NO puede ser la misma.
    const enEnero = calcularRelativa('P-01', 120, 'kg', 65);
    const enAgosto = calcularRelativa('P-01', 120, 'kg', 70);
    if (!enEnero.calculable || !enAgosto.calculable) throw new Error('deberían');

    expect(enEnero.ratio).toBeCloseTo(1.846, 3);
    expect(enAgosto.ratio).toBeCloseTo(1.714, 3);
    expect(enEnero.ratio).not.toBeCloseTo(enAgosto.ratio, 2);
  });

  it('sin peso en la evaluación no se calcula, y no se busca en otra parte', () => {
    const r = calcularRelativa('P-01', 120, 'kg', mapEvaluacion(fila()).pesoKg);
    expect(r.calculable).toBe(false);
    if (r.calculable) throw new Error('no debería');
    expect(r.motivo).toBe('SIN_MASA_CORPORAL');
  });

  it('el tipo de dominio obliga a declarar el peso', () => {
    // Si alguien añadiera una evaluación sin `pesoKg`, TypeScript lo pararía.
    // Aquí solo se comprueba que el campo existe y admite ausencia.
    expect(evaluacion({ id: 'x' })).toHaveProperty('pesoKg');
    expect(evaluacion({ id: 'x' }).pesoKg).toBeNull();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LA EDAD ES LA DE LA FECHA DE LA EVALUACIÓN
// ════════════════════════════════════════════════════════════════════════════

describe('la edad se deriva de la fecha de la evaluación, no de hoy', () => {
  const nacido = (f: string) => atleta({ id: 'a1', fechaNacimiento: f, sexo: 'M', pais: 'CO' });

  it('una evaluación antigua usa la edad que el atleta tenía entonces', () => {
    const a = nacido('2004-05-10');
    // El mismo atleta, dos evaluaciones a un año de distancia.
    expect(resolverSujeto(a, '2026-02-01').sujeto.edad).toBe(21);
    expect(resolverSujeto(a, '2027-02-01').sujeto.edad).toBe(22);
  });

  it('cumplir años NO reinterpreta una medición anterior', () => {
    // Es el fallo real que PAS-12 corrigió: antes llegaba `hoyISO` y una
    // medición de hace un año se comparaba contra la edad de hoy. Las fichas de
    // dinamometría de la NKB estratifican por años de uno en uno, así que eso
    // movía el resultado a otra celda sin que nadie tocara el dato.
    const a = nacido('2004-05-10');
    const enLaFecha = resolverSujeto(a, '2026-04-01').sujeto.edad;
    const conHoyPosterior = resolverSujeto(a, '2026-06-01').sujeto.edad;
    expect(enLaFecha).toBe(21);
    expect(conHoyPosterior).toBe(22);
    expect(enLaFecha).not.toBe(conHoyPosterior);
  });

  it('sin fecha de nacimiento la edad es null, no una estimación', () => {
    expect(resolverSujeto(atleta({ id: 'a1', fechaNacimiento: null }), '2026-08-15').sujeto.edad)
      .toBeNull();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// COMPONENTES · G-04
// ════════════════════════════════════════════════════════════════════════════

describe('los componentes llegan y no se reconstruyen', () => {
  const filaReg = (over: Record<string, unknown> = {}) => ({
    id: 'r1',
    evaluacion_id: 'e1',
    prueba_id: 'P-05',
    fecha: '2026-08-15',
    valor_tipo: 'continuo',
    valor_num: 1.8,
    unidad: 'ratio',
    estado: 'vigente',
    condiciones: {},
    precondiciones_cumplidas: true,
    patron: null,
    observaciones: null,
    created_at: '2026-08-15T10:00:00Z',
    ...over,
  });

  it('el mapeador los lee de la columna', () => {
    const r = mapRegistro(filaReg({ componentes: { altura_cm: 42, tiempo_contacto_ms: 180 } }));
    expect(r.componentes).toEqual({ altura_cm: 42, tiempo_contacto_ms: 180 });
  });

  it('un registro histórico sin componentes queda en {}, NO se despeja del RSI', () => {
    // Un RSI de 1,8 admite infinitas combinaciones de altura y tiempo. Cualquier
    // reconstrucción sería una invención con aspecto de dato.
    const r = mapRegistro(filaReg());
    expect(r.componentes).toEqual({});
    // Y el resultado registrado se conserva intacto.
    expect(r.valor).toEqual({ tipo: 'continuo', valor: 1.8, unidad: 'ratio' });
  });

  it('los componentes de un registro no contaminan a otro', () => {
    const con = mapRegistro(filaReg({ id: 'r1', componentes: { altura_cm: 42 } }));
    const sin = mapRegistro(filaReg({ id: 'r2' }));
    expect(con.componentes).toEqual({ altura_cm: 42 });
    expect(sin.componentes).toEqual({});
  });
});

// ════════════════════════════════════════════════════════════════════════════
// NO RECONSTRUCCIÓN HISTÓRICA (§8)
// ════════════════════════════════════════════════════════════════════════════

describe('los 14 registros históricos sin condiciones se quedan como están', () => {
  const historico = mapRegistro({
    id: 'r-viejo',
    evaluacion_id: 'e-vieja',
    prueba_id: 'P-10',
    fecha: '2026-05-01',
    valor_tipo: 'continuo',
    valor_num: 2.5,
    unidad: 's',
    estado: 'vigente',
    condiciones: {},
    precondiciones_cumplidas: null,
    patron: null,
    observaciones: null,
    created_at: '2026-05-01T10:00:00Z',
  });

  it('las condiciones ausentes siguen ausentes', () => {
    expect(historico.condiciones).toEqual({});
  });

  it('no se infiere un protocolo por defecto', () => {
    // Ni «505», ni «estándar», ni «el habitual». P-10 cubre cuatro protocolos
    // distintos y elegir uno sería decidir por el evaluador.
    const json = JSON.stringify(historico);
    for (const inventado of ['505', 't_test', 'illinois', 'estandar', 'fotocelulas']) {
      expect(json, inventado).not.toContain(inventado);
    }
  });

  it('el valor observado se conserva intacto', () => {
    expect(historico.valor).toEqual({ tipo: 'continuo', valor: 2.5, unidad: 's' });
  });
});
