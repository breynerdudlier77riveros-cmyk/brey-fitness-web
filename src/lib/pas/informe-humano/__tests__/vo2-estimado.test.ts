// ── El VO2máx estimado de la Course-navette, en aislamiento ────────────────
//
// La ecuación en sí está probada en `calculo/__tests__/derivados.test.ts`.
// Este fichero protege lo que `vo2-estimado.ts` añade encima: leer P-07 de la
// lista de mediciones, quedarse con la última si hay más de una, y clasificar
// el resultado contra las tablas REALES de P-12 en vez de inventar una copia.

import { describe, expect, it } from 'vitest';

import type { SujetoEvidencia } from '@/lib/pas/evidencia';
import { panelVo2EstimadoDe, type MedicionVo2Estimado } from '../vo2-estimado';

const SUJETO_ADULTO: SujetoEvidencia = { edad: 30, sexo: 'M', pais: 'CO', pesoKg: null };
const SUJETO_SIN_EDAD: SujetoEvidencia = { edad: null, sexo: 'M', pais: 'CO', pesoKg: null };

const m = (pruebaId: string, valor: number): MedicionVo2Estimado => ({ pruebaId, valor });

describe('panelVo2EstimadoDe', () => {
  it('CONTROL POSITIVO · con P-07 y edad, calcula y clasifica', () => {
    const p = panelVo2EstimadoDe([m('P-07', 10)], SUJETO_ADULTO);
    expect(p).not.toBeNull();
    expect(p!.unidad).toBe('mL/kg/min');
    // 30 años → tope en 18 en la fórmula (ver derivados.test.ts).
    expect(p!.valor).toBe(50.6);
    expect(p!.formula).toContain('31,025');
  });

  it('sin ninguna Course-navette registrada, no hay panel', () => {
    expect(panelVo2EstimadoDe([], SUJETO_ADULTO)).toBeNull();
    expect(panelVo2EstimadoDe([m('P-01', 100)], SUJETO_ADULTO)).toBeNull();
  });

  it('sin la edad del atleta, no hay panel: la ecuación no tiene edad por defecto', () => {
    expect(panelVo2EstimadoDe([m('P-07', 10)], SUJETO_SIN_EDAD)).toBeNull();
  });

  it('con más de un registro de P-07, se queda con el ÚLTIMO', () => {
    const p = panelVo2EstimadoDe([m('P-07', 5), m('P-07', 10)], SUJETO_ADULTO);
    expect(p!.valor).toBe(50.6); // el de estadio 10, no el de estadio 5
  });

  it('el valor SE CLASIFICA de verdad: hay una lectura de evidencia, no solo un número', () => {
    const p = panelVo2EstimadoDe([m('P-07', 10)], SUJETO_ADULTO)!;
    expect(p.evidencia.estado).toBe('EVIDENCIA_COMPATIBLE');
    // Un adulto colombiano activa Cooper y AHA (Rivera es de Puerto Rico), así
    // que tiene que haber al menos una referencia real detrás del número.
    expect(p.evidencia.compatibles.length).toBeGreaterThan(0);
    expect(p.evidencia.compatibles[0].referencia.representacion.clase).toBe('bandas');
  });

  it('sin sexo ni país, el panel sigue existiendo: lo único que pide vo2Leger es la edad', () => {
    // La ausencia de sexo/país bloquea SITUAR el valor en una tabla, pero eso
    // es un estado de `leerEvidencia` (NO_DETERMINABLE), no un panel ausente:
    // el panel existe porque la EDAD sí está, que es lo único que pide `vo2Leger`.
    const p = panelVo2EstimadoDe([m('P-07', 10)], { ...SUJETO_ADULTO, sexo: null, pais: null });
    expect(p).not.toBeNull();
    expect(p!.valor).toBe(50.6);
  });

  it('cita la fuente con autor, año, título y publicación', () => {
    const p = panelVo2EstimadoDe([m('P-07', 10)], SUJETO_ADULTO)!;
    expect(p.fuente).toContain('Léger');
    expect(p.fuente).toContain('1988');
  });
});
