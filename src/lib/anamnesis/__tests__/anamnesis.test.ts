import { describe, expect, it } from 'vitest';
import { conValor, nombreDe, valorDe } from '../tipos';
import { normalizar } from '../contenido';
import {
  SECCION_DEMOGRAFICOS,
  SECCION_ANTECEDENTES,
  SECCION_COMPORTAMIENTO,
  SECCION_FACTOR_IMPIDE,
  PARQ_PREGUNTAS,
  AHA_ANTECEDENTES,
  AHA_SINTOMAS,
  SECCION_HABITOS_ALIMENTACION,
} from '../secciones';
import { ALIMENTOS, MOTIVOS, ESTRES_ITEMS, LABORATORIO_ORINA, LABORATORIO_LIPIDICO, LABORATORIO_HEMATICO, LABORATORIO_GLUCOMETRIA, TEMPERAMENTO_SITUACIONES } from '../datos-fijos';
import type { CampoDef } from '../tipos';

function clavesDe(campos: readonly CampoDef[]): string[] {
  const claves: string[] = [];
  for (const campo of campos) {
    if ('clave' in campo) claves.push(campo.clave);
    if (campo.tipo === 'opciones' && campo.otraClave) claves.push(campo.otraClave);
  }
  return claves;
}

describe('tipos: diccionario plano', () => {
  it('valorDe devuelve string vacío para una clave ausente', () => {
    expect(valorDe({}, 'demo.nombre')).toBe('');
  });

  it('conValor no muta el documento original', () => {
    const original = { a: '1' };
    const siguiente = conValor(original, 'b', '2');
    expect(original).toEqual({ a: '1' });
    expect(siguiente).toEqual({ a: '1', b: '2' });
  });

  it('nombreDe compone nombre y apellido, con fallback si faltan ambos', () => {
    expect(nombreDe({ 'demo.nombre': 'Ana', 'demo.apellido': 'Pérez' })).toBe('Ana Pérez');
    expect(nombreDe({ 'demo.nombre': 'Ana' })).toBe('Ana');
    expect(nombreDe({})).toBe('Sin nombre');
  });
});

describe('contenido: normalizar', () => {
  it('quita las claves con string vacío', () => {
    expect(normalizar({ a: '1', b: '', c: 'x' })).toEqual({ a: '1', c: 'x' });
  });

  it('conserva un documento sin claves vacías tal cual', () => {
    const datos = { a: '1', c: 'x' };
    expect(normalizar(datos)).toEqual(datos);
  });
});

describe('secciones: integridad de claves', () => {
  it('ninguna clave de campo se repite entre todas las secciones del formulario', () => {
    const grupos: string[][] = [
      clavesDe(SECCION_DEMOGRAFICOS.campos),
      clavesDe(SECCION_ANTECEDENTES.campos),
      clavesDe(SECCION_COMPORTAMIENTO.campos),
      clavesDe(SECCION_FACTOR_IMPIDE),
      PARQ_PREGUNTAS.map((p) => p.clave),
      AHA_ANTECEDENTES.map((a) => a.clave),
      AHA_SINTOMAS.flatMap((s) => (s.conDetalle ? [s.clave, s.conDetalle] : [s.clave])),
      SECCION_HABITOS_ALIMENTACION.map((h) => h.clave),
    ];

    const todas = grupos.flat();
    const repetidas = todas.filter((clave, i) => todas.indexOf(clave) !== i);
    expect(repetidas).toEqual([]);
  });

  it('las 21 filas de alimentos tienen id único', () => {
    const ids = ALIMENTOS.map((a) => a.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(ids.length).toBe(21);
  });

  it('los 37 motivos y los 14 ítems de estrés tienen id consecutivo sin huecos', () => {
    expect(MOTIVOS.map((m) => m.id)).toEqual(Array.from({ length: 37 }, (_, i) => i + 1));
    expect(ESTRES_ITEMS.map((e) => e.id)).toEqual(Array.from({ length: 14 }, (_, i) => i + 1));
  });

  it('las 13 situaciones de temperamento tienen exactamente 4 opciones A–D', () => {
    expect(TEMPERAMENTO_SITUACIONES.length).toBe(13);
    for (const situacion of TEMPERAMENTO_SITUACIONES) {
      expect(situacion.opciones.map((o) => o.letra)).toEqual(['A', 'B', 'C', 'D']);
    }
  });

  it('las filas de laboratorio tienen id único dentro de cada grupo', () => {
    for (const grupo of [LABORATORIO_ORINA, LABORATORIO_LIPIDICO, LABORATORIO_HEMATICO, LABORATORIO_GLUCOMETRIA]) {
      const ids = grupo.map((f) => f.id);
      expect(new Set(ids).size).toBe(ids.length);
    }
  });
});
