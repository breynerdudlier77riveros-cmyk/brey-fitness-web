import { describe, expect, it } from 'vitest';
import { createElement } from 'react';
import { renderToStaticMarkup } from 'react-dom/server';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  construirInformeCompleto,
  informeDeEvaluacion,
  resumirInforme,
} from '../services/informe';
import { aEvaluacionPAE, aRegistroPAE } from '../services/mapeo';
import { CATALOGO_PAS } from '../schemas/catalogo';
import ReportView from '@/components/pas/report/ReportView';
import { VERSION_MOTOR } from '@/lib/pas';
import { evaluacion, registro, HOY } from './fixtures';

// ── Integración con los motores (Sprint PAS-7.0) ───────────────────────────
// El Workspace orquesta PAE → PIE → PPRE una vez y no recalcula nada. Estas
// pruebas ejercitan los motores REALES: si el contrato entre capas se rompiera,
// fallarían aquí y no en producción.

const EV = evaluacion({ id: 'ev1', atletaId: 'a1' });
const REGISTROS = [registro({ id: 'r1', evaluacionId: 'ev1' })];

function informe() {
  return informeDeEvaluacion('a1', EV, REGISTROS, HOY);
}

describe('traducción Workspace → PAE', () => {
  it('un registro conserva su valor sin tocarlo', () => {
    const pae = aRegistroPAE(REGISTROS[0]);
    expect(pae.valor).toEqual(REGISTROS[0].valor);
    expect(pae.id).toBe('r1');
    expect(pae.pruebaId).toBe('P-01');
  });

  it('un registro anulado llega al PAE como anulado, no se omite', () => {
    const anulado = registro({ id: 'r2', estado: 'anulada' });
    expect(aRegistroPAE(anulado).estado).toBe('anulada');
  });

  it('la evaluación conserva tipo, fecha y atleta', () => {
    const pae = aEvaluacionPAE(EV, REGISTROS, 'a1');
    expect(pae).toMatchObject({ id: 'ev1', atletaId: 'a1', tipo: 'T-01', fecha: HOY });
    expect(pae.registros).toHaveLength(1);
  });

  it('no muta el registro de origen', () => {
    const copia = structuredClone(REGISTROS[0]);
    aRegistroPAE(REGISTROS[0]);
    expect(REGISTROS[0]).toEqual(copia);
  });
});

describe('orquestación de los tres motores', () => {
  const resultado = informe();

  it('devuelve los tres DTO', () => {
    expect(resultado.analisis).toBeDefined();
    expect(resultado.interpretacion).toBeDefined();
    expect(resultado.recomendaciones).toBeDefined();
  });

  it('el PAE deriva las 20 capacidades', () => {
    expect(resultado.analisis.capacidades).toHaveLength(20);
  });

  it('el catálogo del Workspace caracteriza A-01 con la prueba P-01', () => {
    const a01 = resultado.analisis.capacidades.find((c) => c.capacidad === 'A-01');
    expect(a01?.estado).toBe('evaluada');
    expect(a01?.traza.correspondencias.map((c) => c.pruebaId)).toEqual(['P-01']);
  });

  it('el PIE interpreta ese mismo análisis', () => {
    expect(resultado.interpretacion.meta.versionPAE).toBe(
      resultado.analisis.coordenadas.motor
    );
    expect(resultado.interpretacion.meta.calculadoEn).toBe(
      resultado.analisis.coordenadas.calculadoEn
    );
  });

  it('el PPRE parte del mismo perfil e interpretación', () => {
    expect(resultado.recomendaciones.meta.versionPIE).toBe(
      resultado.interpretacion.meta.versionMotor
    );
    expect(resultado.recomendaciones.meta.atletaId).toBe('a1');
  });

  it('las cuatro coordenadas de versión son coherentes entre motores', () => {
    const { analisis, interpretacion, recomendaciones } = resultado;
    expect(interpretacion.meta.versionCatalogo).toBe(analisis.coordenadas.catalogo);
    expect(recomendaciones.meta.versionCatalogo).toBe(analisis.coordenadas.catalogo);
    expect(recomendaciones.meta.versionPKB).toBe(interpretacion.meta.versionPKB);
  });

  it('el PPRE emite recomendaciones metodológicas', () => {
    expect(resultado.recomendaciones.recomendaciones.length).toBeGreaterThan(0);
  });

  it('declara la falta de sensibilidad al cambio', () => {
    expect(resultado.recomendaciones.reglasEjecutadas).toContain('PPRE-14');
  });

  it('declara la falta de vigencia documentada', () => {
    expect(resultado.recomendaciones.reglasEjecutadas).toContain('PPRE-15');
  });

  it('sin registros, el perfil se describe igual de bien', () => {
    const vacio = informeDeEvaluacion('a1', EV, [], HOY);
    expect(vacio.analisis.capacidades).toHaveLength(20);
    expect(vacio.interpretacion.cobertura.caracterizadas).toBe(0);
  });

  it('es determinista', () => {
    expect(informe()).toEqual(informe());
  });
});

describe('el Workspace no recalcula ni modifica', () => {
  it('el resumen del historial usa los DTO, no un recuento propio', () => {
    const resultado = informe();
    const resumen = resumirInforme(resultado);

    expect(resumen.capacidadesCaracterizadas).toBe(
      resultado.interpretacion.cobertura.caracterizadas
    );
    expect(resumen.registrosElegibles).toBe(resultado.analisis.resumen.registrosElegibles);
    expect(resumen.versionPAS).toBe(resultado.analisis.coordenadas.motor);
  });

  it('la versión del motor procede del PAE, no de una constante local', () => {
    expect(informe().analisis.coordenadas.motor).toBe(VERSION_MOTOR);
  });

  it('no muta la evaluación ni los registros de entrada', () => {
    const copiaEv = structuredClone(EV);
    const copiaReg = structuredClone(REGISTROS);
    informeDeEvaluacion('a1', EV, REGISTROS, HOY);
    expect(EV).toEqual(copiaEv);
    expect(REGISTROS).toEqual(copiaReg);
  });

  it('no muta el catálogo compartido', () => {
    const copia = structuredClone(CATALOGO_PAS);
    construirInformeCompleto({
      atletaId: 'a1',
      evaluaciones: [{ evaluacion: EV, registros: REGISTROS }],
      hoyISO: HOY,
    });
    expect(CATALOGO_PAS).toEqual(copia);
  });

  it('varias evaluaciones se acumulan sin recorrer registros dos veces', () => {
    const otra = evaluacion({ id: 'ev2', atletaId: 'a1', fecha: '2026-07-01' });
    const resultado = construirInformeCompleto({
      atletaId: 'a1',
      evaluaciones: [
        { evaluacion: EV, registros: REGISTROS },
        { evaluacion: otra, registros: [registro({ id: 'r9', evaluacionId: 'ev2', fecha: '2026-07-01' })] },
      ],
      hoyISO: HOY,
    });
    expect(resultado.analisis.resumen.evaluaciones).toBe(2);
    expect(resultado.analisis.resumen.registrosTotales).toBe(2);
  });
});

describe('render del informe desde el Workspace', () => {
  const resultado = informe();
  const html = renderToStaticMarkup(
    createElement(ReportView, {
      analisis: resultado.analisis,
      interpretacion: resultado.interpretacion,
      atleta: 'Ana Pérez',
    })
  );

  it('el PRS renderiza con los DTO que produce el Workspace', () => {
    expect(html.length).toBeGreaterThan(1000);
  });

  it('muestra el nombre del atleta en la portada', () => {
    expect(html).toContain('Ana Pérez');
  });

  it('lleva la clase de impresión del PRS', () => {
    expect(html).toContain('reporte-pas-print');
  });

  it('no introduce botones ni formularios en el informe', () => {
    expect(/<button|<input|<form/i.test(html)).toBe(false);
  });

  it('las once secciones aparecen', () => {
    for (const id of [
      'portada', 'resumen', 'perfil', 'dominios', 'interpretaciones',
      'cobertura', 'evidencia', 'metodologia', 'limitaciones', 'apendice', 'pie',
    ]) {
      expect(html, id).toContain(`data-seccion="${id}"`);
    }
  });

  it('el apéndice muestra la versión del catálogo del Workspace', () => {
    expect(html).toContain(CATALOGO_PAS.version);
  });
});

describe('seguridad y aislamiento', () => {
  const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..');

  /**
   * Lee el código SIN comentarios.
   *
   * El repositorio declara en su cabecera que «no importa ni una función de
   * lib/bcs/repository», y buscar esa cadena sobre el fichero entero se
   * dispara con su propia documentación. Se corrige el test, no el comentario.
   */
  function leer(ruta: string): string {
    return readFileSync(join(RAIZ, ruta), 'utf8')
      .replace(/\/\*[\s\S]*?\*\//g, '')
      .replace(/\/\/.*$/gm, '');
  }

  it('el repositorio no importa nada del BCS', () => {
    expect(/lib\/bcs/.test(leer('repository/index.ts'))).toBe(false);
  });

  it('ninguna capa del Workspace importa el BCS', () => {
    for (const ruta of [
      'repository/index.ts', 'repository/mappers.ts',
      'services/informe.ts', 'services/mapeo.ts', 'services/consultas.ts',
      'actions/atletas.ts', 'actions/evaluaciones.ts',
      'schemas/catalogo.ts', 'schemas/validacion.ts', 'schemas/estados.ts',
    ]) {
      expect(/lib\/bcs|composicion-corporal/.test(leer(ruta)), ruta).toBe(false);
    }
  });

  it('el repositorio solo toca tablas pas_*', () => {
    const codigo = leer('repository/index.ts');
    const tablas = [...codigo.matchAll(/\.from\(['"]([a-z_]+)['"]\)/g)].map((m) => m[1]);
    expect(tablas.length).toBeGreaterThan(0);
    for (const tabla of tablas) expect(tabla, tabla).toMatch(/^pas_/);
  });

  it('las acciones validan la sesión antes de tocar la base', () => {
    for (const ruta of ['actions/atletas.ts', 'actions/evaluaciones.ts']) {
      const codigo = leer(ruta);
      expect(codigo, ruta).toContain('getUser()');
      expect(codigo, ruta).toContain('NO_AUTENTICADO');
    }
  });

  it('las acciones no re-implementan el chequeo de dueño: lo hace la RLS', () => {
    const codigo = leer('actions/atletas.ts') + leer('actions/evaluaciones.ts');
    expect(/profesionalId\s*===\s*user\.id/.test(codigo)).toBe(false);
  });

  it('la migración activa RLS en las cuatro tablas', () => {
    const sql = readFileSync(
      join(RAIZ, '..', '..', '..', 'supabase', 'migration_pas_workspace.sql'),
      'utf8'
    );

    // Se normalizan los espacios: la migración los alinea en columna y la
    // comparación literal fallaría por estética, no por contenido.
    const normalizado = sql.replace(/[ \t]+/g, ' ');

    for (const tabla of ['pas_atletas', 'pas_evaluaciones', 'pas_registros', 'pas_enlaces_publicos']) {
      expect(normalizado, tabla).toContain(
        `alter table public.${tabla} enable row level security;`
      );
    }
  });

  it('toda política de RLS cuelga de auth.uid()', () => {
    const sql = readFileSync(
      join(RAIZ, '..', '..', '..', 'supabase', 'migration_pas_workspace.sql'),
      'utf8'
    );
    const politicas = [...sql.matchAll(/create policy[\s\S]*?;/g)].map((m) => m[0]);

    expect(politicas).toHaveLength(4);
    for (const politica of politicas) expect(politica).toContain('auth.uid()');
  });

  it('la migración impide editar un registro: solo permite cambiar su estado', () => {
    const sql = readFileSync(
      join(RAIZ, '..', '..', '..', 'supabase', 'migration_pas_workspace.sql'),
      'utf8'
    );
    expect(sql).toContain('revoke update on public.pas_registros from authenticated');
    expect(sql).toContain('grant update (estado) on public.pas_registros');
  });

  it('el borrado es lógico: la migración no declara ningún delete', () => {
    const sql = readFileSync(
      join(RAIZ, '..', '..', '..', 'supabase', 'migration_pas_workspace.sql'),
      'utf8'
    );
    expect(sql).toContain("estado in ('activo', 'archivado', 'eliminado')");
  });
});
