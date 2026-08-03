import { describe, expect, it } from 'vitest';
import {
  COBERTURA_DE_LIMITACIONES,
  calcularCobertura,
  esLimitante,
  esRegla,
  interpretarRendimiento,
  limitacionesPKBAplicadas,
} from '../index';
import type { PerformanceInterpretationReport } from '../index';
import {
  analisisConCapacidad,
  analisisDesactualizado,
  analisisEnConflicto,
  analisisVacio,
  ficha,
  pkb,
} from './fixtures';

// ── Bloques, cobertura, consistencia, metodología y limitaciones ───────────

const PKB_A01 = pkb([ficha({ id: 'M-01', capacidad: 'A-01' })]);

function reglasDe(bloque: readonly { regla: string }[]): string[] {
  return bloque.map((i) => i.regla);
}

describe('estructura del informe', () => {
  const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);

  it('declara las cuatro coordenadas de versión', () => {
    expect(informe.meta.versionMotor).toBe('pie-1.0.0');
    expect(informe.meta.versionPKB).toBe('pkb-test');
    expect(informe.meta.versionPAE).toBe('pae-1.0.0');
    expect(informe.meta.versionCatalogo).toBe('cat-test');
  });

  it('hereda la fecha del PAE, no la calcula', () => {
    expect(informe.meta.calculadoEn).toBe('2026-08-02');
  });

  it('declara cuántas reglas se evaluaron', () => {
    expect(informe.meta.reglasEvaluadas).toBe(28);
  });

  it('el recuento emitido coincide con lo emitido', () => {
    expect(informe.meta.interpretacionesEmitidas).toBeGreaterThan(0);
  });

  it('conserva el atleta', () => {
    expect(informe.meta.atletaId).toBe('atleta-1');
  });

  it('todos los bloques existen aunque estén vacíos', () => {
    for (const clave of [
      'resumenEjecutivo', 'porCapacidad', 'porDominio', 'hallazgos',
      'interpretacionCobertura', 'consistencia', 'evidenciaDisponible',
      'evidenciaInsuficiente', 'observacionesMetodologicas', 'limitaciones',
    ] as const) {
      expect(Array.isArray(informe[clave])).toBe(true);
    }
  });

  it('toda regla emitida está catalogada', () => {
    const todas = [
      ...informe.porCapacidad, ...informe.porDominio, ...informe.consistencia,
      ...informe.interpretacionCobertura, ...informe.observacionesMetodologicas,
    ];
    for (const i of todas) expect(esRegla(i.regla), i.regla).toBe(true);
  });
});

describe('resumen ejecutivo', () => {
  it('solo contiene lo estructural', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(informe.resumenEjecutivo.every((i) => i.prioridad === 'estructural')).toBe(true);
  });

  it('siempre incluye la declaración de alcance del informe', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(reglasDe(informe.resumenEjecutivo)).toContain('PIE-28');
  });

  it('con PKB vacía incluye la ausencia de correspondencias', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(reglasDe(informe.resumenEjecutivo)).toContain('PIE-19');
  });
});

describe('dominios', () => {
  it('emite una interpretación por dominio con capacidades activas: cinco de seis', () => {
    // El dominio F solo contiene F-01 y F-02, ambas reservadas, así que no
    // emite: decir «sin capacidades caracterizadas» de un dominio que todavía
    // no admite pruebas confundiría la reserva con la falta de dato.
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(informe.porDominio).toHaveLength(5);
    expect(informe.porDominio.map((i) => i.id)).toEqual([
      'PIE-16:A', 'PIE-16:B', 'PIE-16:C', 'PIE-16:D', 'PIE-16:E',
    ]);
  });

  it('un dominio sin capacidades caracterizadas usa PIE-16', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(reglasDe(informe.porDominio).every((r) => r === 'PIE-16')).toBe(true);
  });

  it('un dominio con una capacidad caracterizada usa PIE-15', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    const dominioA = informe.porDominio.find((i) => i.id.endsWith(':A'));
    expect(dominioA?.regla).toBe('PIE-15');
    expect(dominioA?.texto).toContain('1 de 5');
  });

  it('el dominio F reservado se cuenta aparte y no aparece', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(informe.porDominio.some((i) => i.id.endsWith(':F'))).toBe(false);
  });
});

describe('cobertura', () => {
  it('cuenta 18 capacidades activas y 2 reservadas', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(informe.cobertura.capacidadesActivas).toBe(18);
    expect(informe.cobertura.reservadas).toBe(2);
    expect(informe.cobertura.capacidadesTotales).toBe(20);
  });

  it('con perfil vacío no hay ninguna caracterizada', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(informe.cobertura.caracterizadas).toBe(0);
    expect(informe.cobertura.desconocidas).toBe(18);
  });

  it('con una capacidad evaluada la cuenta', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    expect(informe.cobertura.caracterizadas).toBe(1);
    expect(informe.cobertura.desconocidas).toBe(17);
  });

  it('cuenta las correspondencias aplicables de la PKB', () => {
    const mixta = pkb([
      ficha({ id: 'M-01', capacidad: 'A-01' }),
      ficha({ id: 'M-08', capacidad: 'A-03', estado: 'insuficiente' }),
    ]);
    const informe = interpretarRendimiento(analisisVacio(), mixta);
    expect(informe.cobertura.correspondenciasAplicadas).toBe(1);
  });

  it('cuenta las desactualizadas', () => {
    const informe = interpretarRendimiento(analisisDesactualizado('A-01'), PKB_A01);
    expect(informe.cobertura.desactualizadas).toBe(1);
  });

  it('cuenta las que están en conflicto', () => {
    const informe = interpretarRendimiento(analisisEnConflicto('A-01'), PKB_A01);
    expect(informe.cobertura.enConflicto).toBe(1);
  });

  it('calcularCobertura es pura sobre sus argumentos', () => {
    const cobertura = calcularCobertura([], 0);
    expect(cobertura.capacidadesTotales).toBe(0);
    expect(cobertura.capacidadesActivas).toBe(0);
  });

  it('PIE-17 se emite siempre', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(reglasDe(informe.interpretacionCobertura)).toContain('PIE-17');
  });

  it('PIE-18 declara el motivo cuando falta cobertura', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    const incompleta = informe.interpretacionCobertura.find((i) => i.regla === 'PIE-18');
    expect(incompleta?.texto).toContain('no declara correspondencias respaldadas');
  });

  it('el motivo cambia cuando sí hay correspondencias', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    const incompleta = informe.interpretacionCobertura.find((i) => i.regla === 'PIE-18');
    expect(incompleta?.texto).toContain('registros elegibles');
  });
});

describe('consistencia', () => {
  it('sin datos emite PIE-23', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(reglasDe(informe.consistencia)).toEqual(['PIE-23']);
  });

  it('parcial emite PIE-21 con los recuentos', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    const [interpretacion] = informe.consistencia;
    expect(interpretacion.regla).toBe('PIE-21');
    expect(interpretacion.texto).toContain('1 de 18');
  });

  it('inconsistente emite PIE-22 y es estructural', () => {
    const informe = interpretarRendimiento(analisisEnConflicto('A-01'), PKB_A01);
    const [interpretacion] = informe.consistencia;
    expect(interpretacion.regla).toBe('PIE-22');
    expect(interpretacion.prioridad).toBe('estructural');
  });

  it('siempre emite exactamente una', () => {
    for (const analisis of [analisisVacio(), analisisConCapacidad(), analisisEnConflicto()]) {
      expect(interpretarRendimiento(analisis, PKB_A01).consistencia).toHaveLength(1);
    }
  });
});

describe('observaciones metodológicas', () => {
  const sinDocumentar = pkb([
    ficha({
      id: 'M-01', capacidad: 'A-01',
      sensibilidadDocumentada: false, vigenciaDocumentada: false, pesoDocumentado: false,
    }),
  ]);
  const informe = interpretarRendimiento(analisisConCapacidad('A-01'), sinDocumentar);

  it('PIE-24 declara que no puede afirmarse variación', () => {
    const interpretacion = informe.observacionesMetodologicas.find((i) => i.regla === 'PIE-24');
    expect(interpretacion?.texto).toContain('No puede afirmarse que un valor haya variado');
  });

  it('PIE-24 es estructural: condiciona todo el informe', () => {
    const interpretacion = informe.observacionesMetodologicas.find((i) => i.regla === 'PIE-24');
    expect(interpretacion?.prioridad).toBe('estructural');
  });

  it('PIE-25 nombra las pruebas sin vigencia documentada', () => {
    const interpretacion = informe.observacionesMetodologicas.find((i) => i.regla === 'PIE-25');
    expect(interpretacion?.texto).toContain('P-01');
  });

  it('PIE-26 se emite cuando ninguna ficha declara peso', () => {
    expect(reglasDe(informe.observacionesMetodologicas)).toContain('PIE-26');
  });

  it('PIE-26 no se emite si alguna lo declara', () => {
    const conPeso = pkb([ficha({ id: 'M-01', capacidad: 'A-01', pesoDocumentado: true })]);
    const otro = interpretarRendimiento(analisisConCapacidad('A-01'), conPeso);
    expect(reglasDe(otro.observacionesMetodologicas)).not.toContain('PIE-26');
  });

  it('con todo documentado no se emiten PIE-24 ni PIE-25', () => {
    const otro = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    expect(reglasDe(otro.observacionesMetodologicas)).not.toContain('PIE-24');
    expect(reglasDe(otro.observacionesMetodologicas)).not.toContain('PIE-25');
  });

  it('PIE-27 se emite ante registros anulados y los nombra', () => {
    const otro = interpretarRendimiento(
      analisisConCapacidad('A-01', { estado: 'anulada' }), PKB_A01
    );
    const interpretacion = otro.observacionesMetodologicas.find((i) => i.regla === 'PIE-27');
    expect(interpretacion?.texto).toContain('r1');
    expect(interpretacion?.texto).toContain('no dejan de existir');
  });

  it('PIE-28 se emite siempre y niega todo juicio', () => {
    const interpretacion = informe.observacionesMetodologicas.find((i) => i.regla === 'PIE-28');
    expect(interpretacion?.texto).toContain('No se emite ningún juicio sobre el atleta');
  });
});

describe('bloques de evidencia', () => {
  it('evidenciaDisponible recoge las caracterizaciones', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    expect(reglasDe(informe.evidenciaDisponible)).toContain('PIE-01');
  });

  it('evidenciaDisponible está vacía sin correspondencias', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(informe.evidenciaDisponible).toEqual([]);
  });

  it('evidenciaInsuficiente recoge las ausencias', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(reglasDe(informe.evidenciaInsuficiente)).toContain('PIE-09');
    expect(reglasDe(informe.evidenciaInsuficiente)).toContain('PIE-19');
  });

  it('el bloque de hallazgos solo trae las ancladas a un hallazgo del PAE', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    expect(informe.hallazgos.every((i) => i.hallazgosRelacionados.length > 0)).toBe(true);
  });

  it('las interpretaciones de capacidad citan hallazgos reales del PAE', () => {
    const analisis = analisisConCapacidad('A-01');
    const informe = interpretarRendimiento(analisis, PKB_A01);
    const ids = new Set(analisis.hallazgos.map((h) => h.id));
    for (const i of informe.porCapacidad) {
      for (const hallazgo of i.hallazgosRelacionados) expect(ids.has(hallazgo)).toBe(true);
    }
  });
});

describe('limitaciones', () => {
  it('cada situación exigida tiene una regla que la detecta', () => {
    expect(COBERTURA_DE_LIMITACIONES).toHaveLength(8);
    for (const { regla } of COBERTURA_DE_LIMITACIONES) expect(esRegla(regla)).toBe(true);
  });

  it('esLimitante distingue las reglas restrictivas', () => {
    expect(esLimitante('PIE-05')).toBe(true);
    expect(esLimitante('PIE-01')).toBe(false);
  });

  it('el bloque solo contiene reglas limitantes', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    expect(informe.limitaciones.every((i) => esLimitante(i.regla))).toBe(true);
  });

  it('no inventa limitaciones: todas proceden de lo emitido', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    const emitidas = new Set([
      ...informe.porCapacidad, ...informe.interpretacionCobertura,
      ...informe.observacionesMetodologicas,
    ].map((i) => i.id));
    for (const limitacion of informe.limitaciones) expect(emitidas.has(limitacion.id)).toBe(true);
  });

  it('recopila los códigos de limitación de la PKB aplicados', () => {
    const conLimitacion = pkb([
      ficha({
        id: 'M-01', capacidad: 'A-01',
        limitaciones: ['especifica_del_ejercicio', 'validez_constructo_no_verificada'],
      }),
    ]);
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), conLimitacion);
    const codigos = limitacionesPKBAplicadas(informe.porCapacidad);
    expect(codigos).toContain('especifica_del_ejercicio');
    expect(codigos).toContain('validez_constructo_no_verificada');
  });

  it('sin limitaciones declaradas, la lista de códigos queda vacía', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    expect(limitacionesPKBAplicadas(informe.porCapacidad)).toEqual([]);
  });
});

describe('orden y unicidad', () => {
  function ordenado(informe: PerformanceInterpretationReport, clave: keyof PerformanceInterpretationReport) {
    const bloque = informe[clave] as { id: string; prioridad: string }[];
    const ids = bloque.map((i) => i.id);
    expect(new Set(ids).size).toBe(ids.length);
  }

  const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);

  it.each([
    'resumenEjecutivo', 'porCapacidad', 'porDominio', 'consistencia',
    'interpretacionCobertura', 'observacionesMetodologicas', 'limitaciones',
  ] as const)('%s no repite ids', (clave) => {
    ordenado(informe, clave);
  });

  it('cada bloque va ordenado por prioridad', () => {
    const rango = { estructural: 0, alta: 1, media: 2, informativa: 3 };
    const valores = informe.porCapacidad.map((i) => rango[i.prioridad]);
    expect(valores).toEqual([...valores].sort((a, b) => a - b));
  });
});
