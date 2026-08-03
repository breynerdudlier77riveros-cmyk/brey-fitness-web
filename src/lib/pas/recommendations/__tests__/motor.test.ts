import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  CASOS_RECHAZADOS,
  TOTAL_REGLAS,
  VERSION_PPRE,
  auditarRecomendaciones,
  auditarTextos,
  esCategoria,
  esPrioridad,
  esRegla,
  generarRecomendaciones,
  trazaCompleta,
} from '../index';
import { PKB_V1, PKB_VACIA } from '../../interpretation';
import type { PerformanceRecommendationReport } from '../index';
import {
  analisisConAnulados,
  analisisConDatos,
  analisisDesactualizado,
  analisisEnConflicto,
  analisisVacio,
  informeDe,
  terna,
} from './fixtures';

// ── Motor, trazabilidad, pureza y guardas (Sprint PAS-6.0) ─────────────────

const DIRECTORIO = join(dirname(fileURLToPath(import.meta.url)), '..');

function generar(
  analisis = analisisConDatos(),
  pkb = PKB_V1
): PerformanceRecommendationReport {
  return generarRecomendaciones(analisis, informeDe(analisis, pkb), pkb);
}

const ESCENARIOS: readonly [string, () => PerformanceRecommendationReport][] = [
  ['perfil vacío', () => generar(analisisVacio(), PKB_VACIA)],
  ['perfil vacío con base real', () => generar(analisisVacio())],
  ['perfil con datos', () => generar()],
  ['perfil en conflicto', () => generar(analisisEnConflicto())],
  ['perfil desactualizado', () => generar(analisisDesactualizado())],
  ['perfil con anulados', () => generar(analisisConAnulados())],
];

describe('orquestador', () => {
  it('produce un informe completo', () => {
    const informe = generar();
    expect(informe.meta).toBeDefined();
    expect(informe.recomendaciones.length).toBeGreaterThan(0);
    expect(informe.estadisticas.total).toBe(informe.recomendaciones.length);
  });

  it('declara las cinco coordenadas de versión', () => {
    const { meta } = generar();
    expect(meta.versionMotor).toBe(VERSION_PPRE);
    expect(meta.versionPAE).toBe('pae-1.0.0');
    expect(meta.versionPIE).toBe('pie-1.0.0');
    expect(meta.versionPKB).toBe('pkb-1.0.0');
    expect(meta.versionCatalogo).toBe('cat-1');
  });

  it('hereda la fecha del PAE y no lee el reloj', () => {
    expect(generar().meta.calculadoEn).toBe('2026-08-02');
  });

  it('la base es opcional y por defecto está vacía', () => {
    const analisis = analisisVacio();
    const informe = generarRecomendaciones(analisis, informeDe(analisis, PKB_VACIA));
    expect(informe.meta.versionPKB).toBe('vacia-0');
  });

  it('un perfil sin datos no es un error', () => {
    expect(() => generar(analisisVacio(), PKB_VACIA)).not.toThrow();
  });

  it('el resumen es un recuento, no un juicio', () => {
    const informe = generar();
    expect(informe.resumen).toMatch(/observaciones metodológicas/);
    expect(auditarTextos(informe.resumen)).toEqual([]);
  });

  it('sin reglas activadas el resumen lo dice', () => {
    const informe = generar(analisisVacio(), PKB_VACIA);
    expect(informe.resumen.length).toBeGreaterThan(0);
  });
});

describe('auditoría del propio informe', () => {
  it.each(ESCENARIOS)('%s: sin problemas', (_etiqueta, construir) => {
    expect(auditarRecomendaciones(construir())).toEqual([]);
  });
});

describe('guarda léxica sobre la salida', () => {
  it.each(ESCENARIOS)('%s: el DTO entero está limpio', (_etiqueta, construir) => {
    expect(auditarTextos(construir())).toEqual([]);
  });

  it('ningún caso rechazado aparece en la salida', () => {
    const informe = generar();
    const serializado = JSON.stringify(informe);
    for (const caso of CASOS_RECHAZADOS) {
      expect(serializado).not.toContain(caso.ejemplo);
    }
  });

  it('los ejemplos rechazados SÍ traen léxico prohibido: son lo que no se emite', () => {
    const conLexico = CASOS_RECHAZADOS.filter((c) => auditarTextos(c.ejemplo).length > 0);
    expect(conLexico.length).toBeGreaterThanOrEqual(10);
  });

  it('ninguna recomendación nombra capacidades por su nombre', () => {
    // A-03 se llama «Potencia» y D-01 «Velocidad»: si el motor las nombrase,
    // colaría término prohibido. Se nombran por código.
    const informe = generar();
    for (const recomendacion of informe.recomendaciones) {
      for (const capacidad of recomendacion.capacidades) {
        expect(recomendacion.descripcion).not.toMatch(/\bPotencia\b|\bVelocidad\b/i);
        expect(capacidad).toMatch(/^[A-F]-\d\d$/);
      }
    }
  });
});

describe('categorías y prioridades', () => {
  const informe = generar();

  it('toda recomendación usa una categoría del catálogo', () => {
    for (const r of informe.recomendaciones) expect(esCategoria(r.categoria), r.id).toBe(true);
  });

  it('toda recomendación usa una prioridad del catálogo', () => {
    for (const r of informe.recomendaciones) expect(esPrioridad(r.prioridad), r.id).toBe(true);
  });

  it('la prioridad coincide con la declarada por su regla', () => {
    for (const r of informe.recomendaciones) {
      const definicion = REGLAS_POR_ID.get(r.trazabilidad.regla);
      expect(r.prioridad, r.id).toBe(definicion?.prioridad);
      expect(r.categoria, r.id).toBe(definicion?.categoria);
    }
  });

  it('las estadísticas por prioridad suman el total', () => {
    const suma = Object.values(informe.estadisticas.porPrioridad).reduce((a, b) => a + b, 0);
    expect(suma).toBe(informe.estadisticas.total);
  });

  it('las estadísticas por categoría suman el total', () => {
    const suma = Object.values(informe.estadisticas.porCategoria).reduce((a, b) => a + b, 0);
    expect(suma).toBe(informe.estadisticas.total);
  });

  it('con y sin referencia suman el total', () => {
    const { conReferencia, sinReferencia, total } = informe.estadisticas;
    expect(conReferencia + sinReferencia).toBe(total);
  });
});

const REGLAS_POR_ID = new Map(
  (await import('../reglas')).REGLAS.map((r) => [r.id, r])
);

describe('reglas ejecutadas y descartadas', () => {
  it('las ejecutadas y las descartadas suman el catálogo', () => {
    const informe = generar();
    const ejecutadas = new Set(informe.reglasEjecutadas);
    const descartadas = new Set(informe.reglasDescartadas.map((r) => r.regla));
    expect(ejecutadas.size + descartadas.size).toBe(TOTAL_REGLAS);
  });

  it('ninguna regla está a la vez ejecutada y descartada', () => {
    const informe = generar();
    const descartadas = new Set(informe.reglasDescartadas.map((r) => r.regla));
    for (const regla of informe.reglasEjecutadas) expect(descartadas.has(regla)).toBe(false);
  });

  it('toda descartada declara su motivo', () => {
    for (const descartada of generar().reglasDescartadas) {
      expect(descartada.motivo.trim()).not.toBe('');
    }
  });

  it('toda regla emitida está catalogada', () => {
    for (const r of generar().recomendaciones) {
      expect(esRegla(r.trazabilidad.regla), r.id).toBe(true);
    }
  });

  it('un perfil en conflicto activa las reglas de consistencia', () => {
    const informe = generar(analisisEnConflicto());
    expect(informe.reglasEjecutadas).toContain('PPRE-05');
    expect(informe.reglasEjecutadas).toContain('PPRE-06');
  });

  it('un perfil desactualizado activa la de revalidación', () => {
    expect(generar(analisisDesactualizado()).reglasEjecutadas).toContain('PPRE-07');
  });

  it('un histórico con anulados activa la documental', () => {
    expect(generar(analisisConAnulados()).reglasEjecutadas).toContain('PPRE-18');
  });

  it('una base sin correspondencias activa la crítica de evidencia', () => {
    expect(generar(analisisVacio(), PKB_VACIA).reglasEjecutadas).toContain('PPRE-19');
  });

  it('con la base real, PPRE-14 declara la falta de sensibilidad al cambio', () => {
    expect(generar().reglasEjecutadas).toContain('PPRE-14');
  });
});

describe('trazabilidad', () => {
  const informe = generar();

  it('todas la superan', () => {
    for (const r of informe.recomendaciones) expect(trazaCompleta(r), r.id).toBe(true);
  });

  it('los siete eslabones están presentes', () => {
    for (const r of informe.recomendaciones) {
      const t = r.trazabilidad;
      expect(Array.isArray(t.capacidades)).toBe(true);
      expect(Array.isArray(t.hallazgos)).toBe(true);
      expect(Array.isArray(t.interpretaciones)).toBe(true);
      expect(Array.isArray(t.fichasPKB)).toBe(true);
      expect(Array.isArray(t.referencias)).toBe(true);
      expect(typeof t.regla).toBe('string');
      expect(typeof t.plantilla).toBe('string');
    }
  });

  it('el id deriva de la regla', () => {
    for (const r of informe.recomendaciones) {
      expect(r.id.startsWith(`${r.trazabilidad.regla}:`)).toBe(true);
    }
  });

  it('las interpretaciones citadas existen en el informe del PIE', () => {
    const analisis = analisisConDatos();
    const pie = informeDe(analisis);
    const ppre = generarRecomendaciones(analisis, pie, PKB_V1);
    const ids = new Set([
      ...pie.porCapacidad, ...pie.observacionesMetodologicas,
      ...pie.interpretacionCobertura, ...pie.consistencia,
    ].map((i) => i.id));

    for (const r of ppre.recomendaciones) {
      for (const id of r.interpretaciones) expect(ids.has(id), id).toBe(true);
    }
  });

  it('las fichas citadas existen en la base', () => {
    const fichas = new Set(PKB_V1.fichas.map((f) => f.id));
    for (const r of informe.recomendaciones) {
      for (const id of r.trazabilidad.fichasPKB) expect(fichas.has(id), id).toBe(true);
    }
  });

  it('las capacidades citadas son códigos del catálogo', () => {
    for (const r of informe.recomendaciones) {
      for (const capacidad of r.capacidades) expect(capacidad).toMatch(/^[A-F]-\d\d$/);
    }
  });

  it('una recomendación que afirma evidencia arrastra su referencia', () => {
    for (const r of informe.recomendaciones) {
      const afirma = r.evidencia.nivel !== null && r.evidencia.nivel !== 'insuficiente';
      if (afirma && r.trazabilidad.fichasPKB.length > 0) {
        expect(r.referencias.length, r.id).toBeGreaterThan(0);
      }
    }
  });

  it('NUNCA incrusta el texto del PIE', () => {
    const analisis = analisisConDatos();
    const pie = informeDe(analisis);
    const ppre = generarRecomendaciones(analisis, pie, PKB_V1);
    const textosPIE = pie.porCapacidad.map((i) => i.texto);

    for (const r of ppre.recomendaciones) {
      for (const texto of textosPIE) {
        expect(r.descripcion).not.toBe(texto);
        expect(r.fundamento).not.toBe(texto);
      }
    }
  });

  it('todas declaran fundamento no vacío', () => {
    for (const r of informe.recomendaciones) expect(r.fundamento.trim()).not.toBe('');
  });

  it('todas declaran acción profesional', () => {
    for (const r of informe.recomendaciones) expect(r.accionProfesional.trim()).not.toBe('');
  });

  it('todas están activas: no se emiten inaplicables', () => {
    for (const r of informe.recomendaciones) expect(r.estado).toBe('activa');
  });
});

describe('orden y unicidad', () => {
  const informe = generar();

  it('ningún id se repite', () => {
    const ids = informe.recomendaciones.map((r) => r.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('van ordenadas por prioridad', () => {
    const rango = { critica: 0, alta: 1, media: 2, informativa: 3 };
    const valores = informe.recomendaciones.map((r) => rango[r.prioridad]);
    expect(valores).toEqual([...valores].sort((a, b) => a - b));
  });

  it('las reglas descartadas van ordenadas', () => {
    const ids = informe.reglasDescartadas.map((r) => r.regla);
    expect(ids).toEqual([...ids].sort());
  });
});

describe('determinismo y no mutación', () => {
  it('la misma terna produce el mismo informe', () => {
    const { analisis, informe: pie, pkb } = terna();
    expect(generarRecomendaciones(analisis, pie, pkb)).toEqual(
      generarRecomendaciones(analisis, pie, pkb)
    );
  });

  it('no muta el análisis', () => {
    const { analisis, informe: pie, pkb } = terna();
    const copia = structuredClone(analisis);
    generarRecomendaciones(analisis, pie, pkb);
    expect(analisis).toEqual(copia);
  });

  it('no muta el informe del PIE', () => {
    const { analisis, informe: pie, pkb } = terna();
    const copia = structuredClone(pie);
    generarRecomendaciones(analisis, pie, pkb);
    expect(pie).toEqual(copia);
  });

  it('no muta la base de conocimiento', () => {
    const { analisis, informe: pie, pkb } = terna();
    const copia = structuredClone(pkb);
    generarRecomendaciones(analisis, pie, pkb);
    expect(pkb).toEqual(copia);
  });

  it('es idempotente en serialización', () => {
    const { analisis, informe: pie, pkb } = terna();
    expect(JSON.stringify(generarRecomendaciones(analisis, pie, pkb))).toBe(
      JSON.stringify(generarRecomendaciones(analisis, pie, pkb))
    );
  });
});

describe('pureza de la capa', () => {
  function sinComentarios(codigo: string): string {
    return codigo.replace(/\/\*[\s\S]*?\*\//g, '').replace(/\/\/.*$/gm, '');
  }

  const fuentes = readdirSync(DIRECTORIO)
    .filter((f) => f.endsWith('.ts'))
    .map((f) => ({
      nombre: f,
      codigo: sinComentarios(readFileSync(join(DIRECTORIO, f), 'utf8')),
      original: readFileSync(join(DIRECTORIO, f), 'utf8'),
    }));

  it('hay archivos que revisar', () => {
    expect(fuentes.length).toBeGreaterThan(14);
  });

  it.each([
    ['Supabase', /supabase/i],
    ['React', /from ['"]react/],
    ['Next', /from ['"]next/],
    ['fetch', /\bfetch\(/],
    ['console', /console\./],
    ['Date.now', /Date\.now/],
    ['Math.random', /Math\.random/],
    ['localStorage', /localStorage|sessionStorage/],
    ['process.env', /process\.env/],
    ['new Date()', /new Date\(/],
  ])('ningún archivo usa %s', (_etiqueta, patron) => {
    expect(fuentes.filter((f) => patron.test(f.codigo)).map((f) => f.nombre)).toEqual([]);
  });

  it('ningún archivo pasa de 150 líneas', () => {
    const largos = fuentes
      .filter((f) => f.original.split('\n').length - 1 > 150)
      .map((f) => f.nombre);
    expect(largos).toEqual([]);
  });

  it('no importa nada fuera de la capa del PAS', () => {
    expect(fuentes.filter((f) => /from ['"]@\//.test(f.codigo)).map((f) => f.nombre)).toEqual([]);
  });

  it('no importa el BCS ni otros módulos del ecosistema', () => {
    const cruzados = fuentes
      .filter((f) => /from ['"][^'"]*\/(bcs|engines|diagnostico|ciclo)\//.test(f.codigo))
      .map((f) => f.nombre);
    expect(cruzados).toEqual([]);
  });
});

describe('el motor no calcula ni evalúa', () => {
  it('la consistencia procede del PAE', () => {
    const analisis = analisisEnConflicto();
    expect(analisis.consistencia.nivel).toBe('inconsistente');
    expect(generar(analisisEnConflicto()).reglasEjecutadas).toContain('PPRE-06');
  });

  it('la cobertura procede del PIE', () => {
    const analisis = analisisVacio();
    const pie = informeDe(analisis, PKB_VACIA);
    const ppre = generarRecomendaciones(analisis, pie, PKB_VACIA);
    expect(pie.cobertura.caracterizadas).toBe(0);
    expect(ppre.reglasEjecutadas).toContain('PPRE-04');
  });

  it('el nivel de evidencia procede de la base, sin promediarse', () => {
    const informe = generar();
    for (const r of informe.recomendaciones) {
      if (r.evidencia.nivel === null) continue;
      expect(['alta', 'moderada', 'baja', 'muy_baja', 'insuficiente']).toContain(r.evidencia.nivel);
    }
  });

  it('no emite puntuación ni ranking en ninguna clave', () => {
    const claves = new Set<string>();
    const recorrer = (valor: unknown): void => {
      if (Array.isArray(valor)) valor.forEach(recorrer);
      else if (valor && typeof valor === 'object') {
        for (const [clave, hijo] of Object.entries(valor)) {
          claves.add(clave.toLowerCase());
          recorrer(hijo);
        }
      }
    };
    recorrer(generar());
    for (const prohibida of ['puntuacion', 'score', 'ranking', 'percentil', 'indice']) {
      expect([...claves]).not.toContain(prohibida);
    }
  });
});
