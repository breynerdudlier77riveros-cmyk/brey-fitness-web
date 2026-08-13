// ── El adaptador refleja la NKB, y solo la NKB ─────────────────────────────
//
// Estos tests son la garantía de que el NIE no inventa normas ni se desalinea
// de las fichas. Si alguien edita una ficha y no el adaptador, fallan.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { COORDENADAS } from '@/lib/nie/nkb/coordenadas';
import { RUTA_FICHAS, cargarNormas, interpretarEdad } from '@/lib/nie/nkb/cargador';

const NORMAS = cargarNormas();

/** Cifras auditadas en `35` y `42`. */
const TOTAL_NORMAS = 356;
const TOTAL_FICHAS = 15;
const TOTAL_ES2 = 29;

describe('cargador · recuento contra la auditoría de la NKB', () => {
  it('carga exactamente las 356 normas publicadas', () => {
    expect(NORMAS).toHaveLength(TOTAL_NORMAS);
  });

  it('cubre las 15 fichas', () => {
    expect(COORDENADAS).toHaveLength(TOTAL_FICHAS);
    expect(new Set(NORMAS.map((n) => n.fichaId)).size).toBe(TOTAL_FICHAS);
  });

  it('no produce identificadores duplicados', () => {
    expect(new Set(NORMAS.map((n) => n.id)).size).toBe(TOTAL_NORMAS);
  });

  it('respeta las 29 normas en ES-2 · Cuestionada', () => {
    const es2 = NORMAS.filter((n) => n.estado === 'ES-2');
    expect(es2).toHaveLength(TOTAL_ES2);
    // 24 de la ficha colombiana de escolares y 5 del estrato brasileño.
    expect(es2.filter((n) => n.fichaId === 'HGS-CO-TN1')).toHaveLength(24);
    expect(es2.filter((n) => n.fichaId === 'HGS-BR-TN1-M167')).toHaveLength(5);
  });

  it('reparte la calidad como la audita `37`: 0 alta, 332 moderada, 24 baja', () => {
    const cuenta = (c: string) => NORMAS.filter((n) => n.calidad === c).length;
    expect(cuenta('alta')).toBe(0);
    expect(cuenta('moderada')).toBe(332);
    expect(cuenta('baja')).toBe(24);
    expect(cuenta('muy_baja')).toBe(0);
  });

  it('conserva las tres unidades sin convertir ninguna', () => {
    const unidades = new Set(NORMAS.map((n) => n.unidad));
    expect([...unidades].sort()).toEqual(['kg', 'kgf', 'lbf']);
    expect(NORMAS.filter((n) => n.unidad === 'lbf')).toHaveLength(48);
    expect(NORMAS.filter((n) => n.unidad === 'kgf')).toHaveLength(156);
  });

  it('toda norma trae sexo, rango etario y referencia', () => {
    for (const n of NORMAS) {
      expect(n.sexo, n.id).toMatch(/^[MF]$/);
      expect(n.edad.min, n.id).toBeLessThanOrEqual(n.edad.max);
      expect(n.referencia, n.id).not.toBe('');
    }
  });

  it('no publica N por celda donde la fuente no lo publica', () => {
    const brasil = NORMAS.filter((n) => n.pais === 'BR');
    expect(brasil).toHaveLength(156);
    expect(brasil.every((n) => n.nCelda === null)).toBe(true);
  });
});

describe('interpretarEdad · las cuatro formas que conviven en las fichas', () => {
  it.each([
    ['65', 65, 65],
    ['18', 18, 18],
    ['6,0–6,9', 6, 6],
    ['17,0–17,9', 17, 17],
    ['10–19', 10, 19],
    ['17–19', 17, 19],
  ])('interpreta %s', (celda, min, max) => {
    expect(interpretarEdad(celda)).toEqual({ min, max });
  });

  it('devuelve null antes que inventar un rango', () => {
    expect(interpretarEdad('adultos')).toBeNull();
    expect(interpretarEdad('')).toBeNull();
  });
});

describe('trazabilidad · las coordenadas coinciden con los campos CN', () => {
  const ficha = (f: string) =>
    readFileSync(join(process.cwd(), RUTA_FICHAS, f), 'utf-8');

  /** Compara contenido, no formato: la negrita de la ficha no debe importar. */
  const sinFormato = (s: string) => s.replace(/\*\*/g, '');

  it.each(COORDENADAS.map((c) => [c.fichaId, c] as const))(
    '%s declara lo mismo que su ficha',
    (_id, c) => {
      const t = sinFormato(ficha(c.fichero));
      // Cada coordenada debe aparecer literalmente en el campo CN del que dice
      // proceder. Es lo que impide que adaptador y ficha se separen.
      expect(t, 'CN-01').toContain(sinFormato(c.variableCN01));
      expect(t, 'CN-02').toContain(sinFormato(c.definicionCN02));
      expect(t, 'CN-04').toContain(sinFormato(c.paisCN04));
      expect(t, 'CN-06').toContain(sinFormato(c.unidadCN06));
      expect(t, 'CN-07').toContain(sinFormato(c.instrumentoCN07));
      // `null` = la ficha no declara la posición. No se rellena (`39`).
      if (c.posicionCN08 !== null) expect(t, 'CN-08').toContain(sinFormato(c.posicionCN08));
      for (const d of c.dimensionesDegradantes) expect(t, 'CN-30').toContain(d);
      expect(t, 'cabecera').toContain(`ficha: ${c.fichaId}`);
      expect(t, 'tipo').toContain(`tipo_norma: ${c.tipo}`);
    },
  );

  it('el conflicto declarado se corresponde con el de la NKB', () => {
    // `40` deja el par ENSIN en CONFLICTO_NO_DETERMINABLE, y solo ese.
    const conConflicto = COORDENADAS.filter((c) => c.conflicto !== 'ninguno');
    expect(conConflicto.map((c) => c.fichaId)).toEqual(['HGS-CO-TN1']);
    expect(conConflicto[0].conflicto).toBe('CONFLICTO_NO_DETERMINABLE');
  });
});
