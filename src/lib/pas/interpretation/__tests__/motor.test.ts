import { describe, expect, it } from 'vitest';
import { readdirSync, readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';
import {
  CASOS_RECHAZADOS,
  PKB_V1,
  PKB_VACIA,
  TOTAL_AUTORIZADAS,
  TOTAL_CASOS_RECHAZADOS,
  TOTAL_RECHAZADAS,
  auditarInforme,
  indexarHallazgos,
  indexarPKB,
  interpretarRendimiento,
  terminosProhibidos,
  todasLasInterpretaciones,
  trazaCompleta,
} from '../index';
import { analisisConCapacidad, analisisEnConflicto, analisisVacio, ficha, pkb } from './fixtures';

// ── Motor, determinismo, pureza y casos rechazados (Sprint PAS-4.0) ────────

const DIRECTORIO = join(dirname(fileURLToPath(import.meta.url)), '..');
const PKB_A01 = pkb([ficha({ id: 'M-01', capacidad: 'A-01' })]);

describe('orquestador', () => {
  it('produce un informe completo', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    expect(informe.meta).toBeDefined();
    expect(informe.porCapacidad.length).toBeGreaterThan(0);
  });

  it('la PKB es opcional y por defecto está vacía', () => {
    const informe = interpretarRendimiento(analisisVacio());
    expect(informe.meta.versionPKB).toBe('vacia-0');
  });

  it('un perfil vacío no es un error', () => {
    expect(() => interpretarRendimiento(analisisVacio(), PKB_VACIA)).not.toThrow();
  });

  it('describe las 20 capacidades aunque no haya datos', () => {
    const informe = interpretarRendimiento(analisisVacio(), PKB_VACIA);
    const capacidades = new Set(informe.porCapacidad.flatMap((i) => i.capacidadesRelacionadas));
    expect(capacidades.size).toBe(20);
  });

  it('no lanza ante un perfil en conflicto', () => {
    expect(() => interpretarRendimiento(analisisEnConflicto(), PKB_A01)).not.toThrow();
  });
});

describe('auditoría del propio informe', () => {
  it.each([
    ['perfil vacío', () => interpretarRendimiento(analisisVacio(), PKB_VACIA)],
    ['perfil con capacidad', () => interpretarRendimiento(analisisConCapacidad(), PKB_A01)],
    ['perfil en conflicto', () => interpretarRendimiento(analisisEnConflicto(), PKB_A01)],
    ['PKB v1.0 real', () => interpretarRendimiento(analisisConCapacidad(), PKB_V1)],
  ])('%s: sin problemas', (_etiqueta, construir) => {
    expect(auditarInforme(construir())).toEqual([]);
  });

  it('ninguna interpretación queda con un hueco sin sustituir', () => {
    const informe = interpretarRendimiento(analisisConCapacidad(), PKB_V1);
    for (const i of todasLasInterpretaciones(informe)) {
      expect(i.texto).not.toContain('{');
    }
  });
});

describe('trazabilidad completa', () => {
  const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
  const todas = todasLasInterpretaciones(informe);

  it('todas la superan', () => {
    for (const i of todas) expect(trazaCompleta(i), i.id).toBe(true);
  });

  it('todas declaran su regla y su plantilla', () => {
    for (const i of todas) {
      expect(i.trazabilidad.regla).toBe(i.regla);
      expect(i.plantilla.trim()).not.toBe('');
    }
  });

  it('los siete eslabones están presentes en cada una', () => {
    for (const i of todas) {
      const t = i.trazabilidad;
      expect(Array.isArray(t.hallazgos)).toBe(true);
      expect('estadoFuncional' in t).toBe(true);
      expect(typeof t.regla).toBe('string');
      expect(Array.isArray(t.fichasPKB)).toBe(true);
      expect(Array.isArray(t.referencias)).toBe(true);
      expect('nivelEvidencia' in t).toBe(true);
      expect(Array.isArray(t.limitaciones)).toBe(true);
    }
  });

  it('una interpretación que AFIRMA evidencia arrastra su referencia', () => {
    for (const i of todas) {
      const afirma = i.nivelEvidencia !== null && i.nivelEvidencia !== 'insuficiente';
      if (afirma && i.trazabilidad.fichasPKB.length > 0) {
        expect(i.referencias.length, i.id).toBeGreaterThan(0);
      }
    }
  });

  it('declarar la AUSENCIA de evidencia no exige referencia', () => {
    // Las fichas que la PKB marca insuficientes carecen de referencia a
    // propósito: no existe fuente que las establezca.
    const informe = interpretarRendimiento(analisisConCapacidad(), PKB_V1);
    const insuficientes = todasLasInterpretaciones(informe).filter(
      (i) => i.regla === 'PIE-13' && i.referencias.length === 0
    );
    expect(insuficientes.length).toBeGreaterThan(0);
    for (const i of insuficientes) expect(trazaCompleta(i)).toBe(true);
  });

  it('el id deriva de la regla', () => {
    for (const i of todas) expect(i.id.startsWith(`${i.regla}:`)).toBe(true);
  });

  it('trazaCompleta rechaza una afirmación de evidencia sin referencia', () => {
    const rota = {
      ...todas[0],
      nivelEvidencia: 'moderada' as const,
      referencias: [],
      trazabilidad: {
        ...todas[0].trazabilidad,
        nivelEvidencia: 'moderada' as const,
        fichasPKB: ['M-X'],
        referencias: [],
      },
    };
    expect(trazaCompleta(rota)).toBe(false);
  });

  it('trazaCompleta rechaza una interpretación sin regla', () => {
    const rota = { ...todas[0], trazabilidad: { ...todas[0].trazabilidad, regla: '  ' } };
    expect(trazaCompleta(rota)).toBe(false);
  });

  it('trazaCompleta rechaza una interpretación sin plantilla', () => {
    expect(trazaCompleta({ ...todas[0], plantilla: '' })).toBe(false);
  });

  it('las listas van ordenadas', () => {
    for (const i of todas) {
      expect(i.referencias).toEqual([...i.referencias].sort());
      expect(i.capacidadesRelacionadas).toEqual([...i.capacidadesRelacionadas].sort());
    }
  });
});

describe('vocabulario en la salida', () => {
  const informes = [
    interpretarRendimiento(analisisVacio(), PKB_VACIA),
    interpretarRendimiento(analisisConCapacidad(), PKB_V1),
    interpretarRendimiento(analisisEnConflicto(), PKB_V1),
    interpretarRendimiento(analisisConCapacidad('A-01', { estado: 'anulada' }), PKB_V1),
  ];

  it('ningún texto contiene vocabulario prohibido', () => {
    for (const informe of informes) {
      for (const i of todasLasInterpretaciones(informe)) {
        expect(terminosProhibidos(i.texto), `${i.id}: ${i.texto}`).toEqual([]);
      }
    }
  });

  it('el informe serializado tampoco', () => {
    for (const informe of informes) {
      const textos = todasLasInterpretaciones(informe).map((i) => i.texto).join(' ');
      expect(terminosProhibidos(textos)).toEqual([]);
    }
  });
});

describe('casos rechazados', () => {
  it('se declaran al menos 15', () => {
    expect(TOTAL_CASOS_RECHAZADOS).toBeGreaterThanOrEqual(15);
  });

  it('cada uno declara motivo y fundamento', () => {
    for (const caso of CASOS_RECHAZADOS) {
      expect(caso.motivo.trim()).not.toBe('');
      expect(caso.fundamento.trim()).not.toBe('');
    }
  });

  it('ningún id se repite', () => {
    const ids = CASOS_RECHAZADOS.map((c) => c.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it('ninguno aparece en la salida del motor', () => {
    const informe = interpretarRendimiento(analisisConCapacidad(), PKB_V1);
    const salida = todasLasInterpretaciones(informe).map((i) => i.texto).join(' ');
    for (const caso of CASOS_RECHAZADOS) {
      expect(salida).not.toContain(caso.ejemplo);
    }
  });

  it('los ejemplos SÍ contienen léxico prohibido: son lo que no se emite', () => {
    const conLexico = CASOS_RECHAZADOS.filter((c) => terminosProhibidos(c.ejemplo).length > 0);
    expect(conLexico.length).toBeGreaterThan(0);
  });
});

describe('PKB v1.0 transcrita', () => {
  it('declara 7 correspondencias autorizadas', () => {
    expect(TOTAL_AUTORIZADAS).toBe(7);
  });

  it('declara 9 rechazadas', () => {
    expect(TOTAL_RECHAZADAS).toBe(9);
  });

  it('ninguna alcanza «respaldada»', () => {
    expect(PKB_V1.fichas.some((f) => f.estado === 'respaldada')).toBe(false);
  });

  it('ninguna documenta sensibilidad, vigencia ni peso', () => {
    for (const f of PKB_V1.fichas) {
      expect(f.sensibilidadDocumentada).toBe(false);
      expect(f.vigenciaDocumentada).toBe(false);
      expect(f.pesoDocumentado).toBe(false);
    }
  });

  it('toda autorizada trae al menos una referencia', () => {
    const autorizadas = PKB_V1.fichas.filter((f) => f.estado === 'parcialmente_respaldada');
    for (const f of autorizadas) expect(f.referencias.length).toBeGreaterThan(0);
  });

  it('ningún alcance autorizado trae léxico prohibido', () => {
    for (const f of PKB_V1.fichas) expect(terminosProhibidos(f.alcanceAutorizado)).toEqual([]);
  });

  it('cubre exactamente 6 capacidades', () => {
    const cubiertas = new Set(
      PKB_V1.fichas.filter((f) => f.estado === 'parcialmente_respaldada').map((f) => f.capacidad)
    );
    expect(cubiertas.size).toBe(6);
  });

  it('con la PKB real, PIE-24 declara que no puede afirmarse variación', () => {
    const informe = interpretarRendimiento(analisisConCapacidad(), PKB_V1);
    const reglas = informe.observacionesMetodologicas.map((i) => i.regla);
    expect(reglas).toContain('PIE-24');
  });
});

describe('índices', () => {
  it('indexarPKB agrupa por capacidad', () => {
    const indice = indexarPKB(PKB_V1);
    expect(indice.get('A-01')?.length).toBeGreaterThanOrEqual(2);
  });

  it('indexarPKB ordena las fichas dentro de cada capacidad', () => {
    const fichas = indexarPKB(PKB_V1).get('A-01') ?? [];
    expect(fichas.map((f) => f.id)).toEqual([...fichas.map((f) => f.id)].sort());
  });

  it('una PKB vacía produce un índice vacío', () => {
    expect(indexarPKB(PKB_VACIA).size).toBe(0);
  });

  it('indexarHallazgos ignora los que no tienen capacidad', () => {
    const analisis = analisisConCapacidad('A-01', { estado: 'anulada' });
    const indice = indexarHallazgos(analisis);
    for (const lista of indice.values()) expect(lista.length).toBeGreaterThan(0);
  });
});

describe('determinismo', () => {
  it('el mismo perfil produce el mismo informe', () => {
    const analisis = analisisConCapacidad('A-01');
    expect(interpretarRendimiento(analisis, PKB_A01)).toEqual(
      interpretarRendimiento(analisis, PKB_A01)
    );
  });

  it('no muta el análisis', () => {
    const analisis = analisisConCapacidad('A-01');
    const copia = structuredClone(analisis);
    interpretarRendimiento(analisis, PKB_A01);
    expect(analisis).toEqual(copia);
  });

  it('no muta la PKB', () => {
    const conocimiento = pkb([ficha({ id: 'M-01', capacidad: 'A-01' })]);
    const copia = structuredClone(conocimiento);
    interpretarRendimiento(analisisConCapacidad(), conocimiento);
    expect(conocimiento).toEqual(copia);
  });

  it('es idempotente sobre el mismo informe', () => {
    const analisis = analisisConCapacidad();
    const uno = interpretarRendimiento(analisis, PKB_V1);
    const otro = interpretarRendimiento(analisis, PKB_V1);
    expect(JSON.stringify(uno)).toBe(JSON.stringify(otro));
  });

  it('el orden de las fichas de la PKB no altera la salida', () => {
    const a = pkb([
      ficha({ id: 'M-01', capacidad: 'A-01' }),
      ficha({ id: 'M-02', capacidad: 'A-01', pruebaId: 'P-02' }),
    ]);
    const b = pkb([
      ficha({ id: 'M-02', capacidad: 'A-01', pruebaId: 'P-02' }),
      ficha({ id: 'M-01', capacidad: 'A-01' }),
    ]);
    const analisis = analisisConCapacidad('A-01');
    expect(interpretarRendimiento(analisis, a).porCapacidad).toEqual(
      interpretarRendimiento(analisis, b).porCapacidad
    );
  });

  it('cambiar la versión de la PKB se refleja en la meta', () => {
    const otra = pkb([ficha({ id: 'M-01', capacidad: 'A-01' })], 'pkb-2');
    expect(interpretarRendimiento(analisisVacio(), otra).meta.versionPKB).toBe('pkb-2');
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
    expect(fuentes.length).toBeGreaterThan(15);
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
    const infractores = fuentes.filter((f) => patron.test(f.codigo)).map((f) => f.nombre);
    expect(infractores).toEqual([]);
  });

  it('ningún archivo pasa de 150 líneas', () => {
    const largos = fuentes
      .filter((f) => f.original.split('\n').length - 1 > 150)
      .map((f) => f.nombre);
    expect(largos).toEqual([]);
  });

  it('no importa nada fuera de la capa del PAS', () => {
    const externos = fuentes.filter((f) => /from ['"]@\//.test(f.codigo)).map((f) => f.nombre);
    expect(externos).toEqual([]);
  });

  it('no importa el BCS ni ningún otro módulo del ecosistema', () => {
    const cruzados = fuentes
      .filter((f) => /from ['"][^'"]*\/(bcs|engines|diagnostico|ciclo)\//.test(f.codigo))
      .map((f) => f.nombre);
    expect(cruzados).toEqual([]);
  });
});

describe('el PIE no recalcula nada del PAE', () => {
  it('el recuento de capacidades procede del análisis', () => {
    const analisis = analisisConCapacidad('A-01');
    const informe = interpretarRendimiento(analisis, PKB_A01);
    expect(informe.cobertura.capacidadesTotales).toBe(analisis.capacidades.length);
  });

  it('la consistencia procede del análisis', () => {
    const analisis = analisisEnConflicto('A-01');
    const informe = interpretarRendimiento(analisis, PKB_A01);
    expect(analisis.consistencia.nivel).toBe('inconsistente');
    expect(informe.consistencia[0].regla).toBe('PIE-22');
  });

  it('los estados funcionales citados existen en el análisis', () => {
    const analisis = analisisConCapacidad('A-01');
    const informe = interpretarRendimiento(analisis, PKB_A01);
    const estados = new Set(analisis.capacidades.map((c) => c.estado));
    for (const i of informe.porCapacidad) {
      if (i.trazabilidad.estadoFuncional !== null) {
        expect(estados.has(i.trazabilidad.estadoFuncional as never)).toBe(true);
      }
    }
  });
});
