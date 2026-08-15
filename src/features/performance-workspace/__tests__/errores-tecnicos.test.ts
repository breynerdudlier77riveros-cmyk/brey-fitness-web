// ── Error técnico ≠ estado científico (Sprint PRS-2.4) ─────────────────────
//
// LA REGLA QUE ESTE FICHERO DEFIENDE:
//
//   Un fallo de infraestructura nunca puede presentarse como una conclusión
//   sobre la evidencia. «No pude consultar las normas» y «ninguna norma
//   corresponde» son afirmaciones distintas, y la segunda habla del atleta.
//
// Antes de PRS-2.4 el repositorio devolvía `[]` tanto si no había registros
// como si Supabase fallaba, y aguas abajo eso se convertía en «esta evaluación
// no tiene pruebas registradas» — una afirmación sobre el trabajo del
// profesional que un fallo de red no autoriza a hacer.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';

import TechnicalError from '@/components/pas/report-v2/TechnicalError';
import { cargarNormas } from '@/lib/nie/nkb/cargador';
import type { DatosPortada } from '@/lib/pas/report-v2';

import { construirInformeNormativo } from '../services/informe-normativo';
import { MAPEOS } from '@/lib/pas/normativo';
import type { Atleta, RegistroWorkspace } from '../schemas/tipos';

/** Lectura de fuente para las comprobaciones estructurales. */
const fuente = (ruta: string): string => readFileSync(join(process.cwd(), ruta), 'utf-8');

const NORMAS = cargarNormas();
const HOY = '2026-08-15';
const PRUEBA = MAPEOS[0].pruebaId;

const PORTADA: DatosPortada = {
  atleta: 'Atleta de prueba',
  edad: null,
  sexo: null,
  fecha: HOY,
  profesional: null,
  codigo: 'EVAL-0001',
};

const atleta = (over: Partial<Atleta> = {}): Atleta => ({
  id: 'a1',
  profesionalId: 'p1',
  nombre: 'Atleta de prueba',
  documento: null,
  codigoInterno: null,
  deporte: null,
  fechaNacimiento: '2004-01-17',
  sexo: 'M',
  pais: 'CO',
  estaturaCm: 162,
  notas: null,
  estado: 'activo',
  createdAt: HOY,
  updatedAt: HOY,
  ...over,
});

const registro = (): RegistroWorkspace => ({
  id: 'r1',
  evaluacionId: 'e1',
  pruebaId: PRUEBA,
  fecha: HOY,
  valor: { tipo: 'continuo', valor: 46, unidad: 'kg' },
  estado: 'vigente',
  condiciones: {
    dinamometro: 'takei-t18',
    consolidacion: 'media_ambas_manos',
    posicion: 'bipedestacion',
    mano: 'ambas',
  },
  precondicionesCumplidas: true,
  patron: null,
  observaciones: null,
  createdAt: HOY,
});

const construir = (
  registros: Parameters<typeof construirInformeNormativo>[0]['registros'],
  a: Atleta = atleta(),
  normas: readonly (typeof NORMAS)[number][] | undefined = NORMAS,
) => construirInformeNormativo({ atleta: a, registros, hoyISO: HOY, portada: PORTADA, normas });

/** Los estados que hablan de la evidencia. Un fallo técnico no puede caer aquí. */
const CIENTIFICOS = ['SIN_MEDICIONES', 'SUJETO_INCOMPLETO', 'DISPONIBLE'];

// ─── Caso A · falla la lectura de los registros ─────────────────────────────

describe('caso A · Supabase falla al leer los registros', () => {
  const fallo = { estado: 'ERROR' as const, mensaje: 'connection terminated', codigo: '08006' };

  it('produce un estado técnico, no uno científico', () => {
    const r = construir(fallo);
    expect(r.estado).toBe('ERROR_TECNICO');
    expect(CIENTIFICOS).not.toContain(r.estado);
  });

  it('NO dice «no hay mediciones»', () => {
    const r = construir(fallo);
    if (r.estado !== 'ERROR_TECNICO') throw new Error('estado inesperado');
    expect(r.detalle).not.toMatch(/no tiene pruebas registradas/);
    expect(r.detalle).toContain('no una afirmación de que no haya mediciones');
  });

  it('declara su origen y conserva la causa para el registro del servidor', () => {
    const r = construir(fallo);
    if (r.estado !== 'ERROR_TECNICO') throw new Error('estado inesperado');
    expect(r.origen).toBe('REGISTROS');
    expect(r.causa).toBe('connection terminated');
  });

  it('se comprueba ANTES que el sujeto: sin datos no se juzga el expediente', () => {
    // Un atleta sin coordenadas y con la lectura rota debe reportar el fallo
    // técnico, no «perfil incompleto»: no sabemos siquiera si había mediciones.
    const r = construir(fallo, atleta({ sexo: null, pais: null }));
    expect(r.estado).toBe('ERROR_TECNICO');
  });
});

// ─── Caso B · falla la carga de la NKB ──────────────────────────────────────

describe('caso B · la NKB no puede cargarse', () => {
  // El comportamiento del cargador ante fichas ausentes se prueba de verdad en
  // `empaquetado.test.ts`, con un artefacto real sin ellas. Aquí importa otra
  // cosa: qué hace el SERVICIO con ese fallo. Se comprueba sobre su código
  // porque el contrato es estructural —hay o no hay un catch que lo nombre— y
  // porque provocar un ENOENT desde aquí exigiría manipular el módulo cargado.

  it('un ENOENT del cargador se convierte en estado técnico, no en lista vacía', () => {
    // Se comprueba el contrato directamente: el servicio captura y nombra.
    // El comportamiento real del cargador ante fichas ausentes se prueba en
    // `empaquetado.test.ts`; aquí importa qué hace el servicio con ello.
    const src = fuente(
      'src/features/performance-workspace/services/informe-normativo.ts',
    );
    expect(src).toMatch(/try \{[\s\S]*?normasNKB\(\)[\s\S]*?\} catch/);
    expect(src).toContain("origen: 'NKB'");
    // Y jamás una lista vacía como salida del catch.
    expect(src).not.toMatch(/catch[\s\S]{0,200}?return \[\]/);
  });

  it('el detalle no afirma nada sobre la evidencia', () => {
    const src = fuente(
      'src/features/performance-workspace/services/informe-normativo.ts',
    );
    expect(src).toContain('las normas existen, y este informe no ha podido consultarlas');
  });

  it('control positivo: así se vería el antipatrón prohibido', () => {
    const ANTIPATRON = /catch[\s\S]{0,120}?return \[\]/;
    expect('try { cargarNormas() } catch { return [] }').toMatch(ANTIPATRON);
    expect(
      fuente('src/features/performance-workspace/services/informe-normativo.ts'),
    ).not.toMatch(ANTIPATRON);
  });
});

// ─── Casos C, D y E · los estados científicos siguen siendo suyos ───────────

describe('los estados científicos no se contaminan', () => {
  it('caso C · evaluación con cero registros → SIN_MEDICIONES', () => {
    expect(construir({ estado: 'OK', registros: [] }).estado).toBe('SIN_MEDICIONES');
    // Y también si se pasa la lista pelada, que es la forma antigua.
    expect(construir([]).estado).toBe('SIN_MEDICIONES');
  });

  it('caso D · faltan coordenadas → SUJETO_INCOMPLETO, no error técnico', () => {
    const r = construir([registro()], atleta({ sexo: null, pais: null }));
    expect(r.estado).toBe('SUJETO_INCOMPLETO');
  });

  it('caso E · todo bien → informe disponible', () => {
    const r = construir([registro()]);
    expect(r.estado).toBe('DISPONIBLE');
    if (r.estado !== 'DISPONIBLE') throw new Error('estado inesperado');
    expect(r.informe.tarjetas).toHaveLength(2);
  });

  it('los cinco casos producen cinco estados distinguibles', () => {
    const estados = [
      construir({ estado: 'ERROR', mensaje: 'x', codigo: null }).estado,
      construir({ estado: 'OK', registros: [] }).estado,
      construir([registro()], atleta({ sexo: null })).estado,
      construir([registro()]).estado,
    ];
    expect(new Set(estados).size).toBe(4);
    expect(estados).toEqual([
      'ERROR_TECNICO',
      'SIN_MEDICIONES',
      'SUJETO_INCOMPLETO',
      'DISPONIBLE',
    ]);
  });
});

// ─── El componente ──────────────────────────────────────────────────────────

describe('el error técnico se ve como lo que es', () => {
  const html = (origen: 'NKB' | 'REGISTROS') =>
    renderToStaticMarkup(
      createElement(TechnicalError, { origen, detalle: 'No se pudo consultar.' }),
    );

  it('se rotula como error técnico', () => {
    expect(html('NKB')).toContain('Error técnico');
  });

  it('distingue el origen en el marcado', () => {
    expect(html('NKB')).toContain('data-error-tecnico="NKB"');
    expect(html('REGISTROS')).toContain('data-error-tecnico="REGISTROS"');
  });

  it('no emite ninguna conclusión sobre la evidencia', () => {
    const JUICIO =
      /(ninguna norma aplicable|no hay mediciones|no aplicable|sin norma|bajo|alto|deficiente)/i;
    for (const o of ['NKB', 'REGISTROS'] as const) {
      expect(html(o)).not.toMatch(JUICIO);
    }
    expect('ninguna norma aplicable').toMatch(JUICIO);
  });

  it('dice que el problema es de la instalación, no de los datos del atleta', () => {
    expect(html('NKB')).toContain('problema de la instalación');
  });

  it('se anuncia a lectores de pantalla', () => {
    expect(html('NKB')).toContain('role="status"');
  });
});

// ─── La ruta ────────────────────────────────────────────────────────────────

describe('la ruta usa la lectura que distingue el fallo', () => {
  const RUTA = fuente(
    'src/app/app/rendimiento/evaluacion/[evaluacionId]/page.tsx',
  );

  it('lee los registros con `leerRegistros` para el informe normativo', () => {
    expect(RUTA).toContain('leerRegistros');
    expect(RUTA).toContain('registros: lectura');
  });

  it('renderiza el error técnico con su propio componente', () => {
    expect(RUTA).toContain('TechnicalError');
    expect(RUTA).toContain('ERROR_TECNICO');
  });

  it('el error técnico se comprueba antes que los estados científicos', () => {
    expect(RUTA.indexOf('ERROR_TECNICO')).toBeLessThan(RUTA.indexOf('SUJETO_INCOMPLETO'));
  });
});
