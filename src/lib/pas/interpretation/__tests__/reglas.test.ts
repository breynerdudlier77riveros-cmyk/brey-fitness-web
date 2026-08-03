import { describe, expect, it } from 'vitest';
import { interpretarRendimiento } from '../index';
import type { Interpretacion, PerformanceInterpretationReport } from '../index';
import {
  analisisConCapacidad,
  analisisDesactualizado,
  analisisEnConflicto,
  analisisParcial,
  analisisVacio,
  ficha,
  pkb,
} from './fixtures';

// ── Reglas por capacidad y de evidencia (Sprint PAS-4.0) ───────────────────

function reglas(informe: PerformanceInterpretationReport): string[] {
  return informe.porCapacidad.map((i) => i.regla);
}

function porRegla(lista: readonly Interpretacion[], regla: string): Interpretacion[] {
  return lista.filter((i) => i.regla === regla);
}

const PKB_A01 = pkb([ficha({ id: 'M-01', capacidad: 'A-01' })]);

describe('PIE-01 · capacidad caracterizada', () => {
  const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
  const [interpretacion] = porRegla(informe.porCapacidad, 'PIE-01');

  it('se emite cuando hay estado evaluada y correspondencia aplicable', () => {
    expect(interpretacion).toBeDefined();
  });

  it('nombra la capacidad con su código', () => {
    expect(interpretacion.texto).toContain('(A-01)');
  });

  it('declara el nivel de evidencia en el texto', () => {
    expect(interpretacion.texto).toContain('moderado');
  });

  it('nombra la prueba que la sostiene', () => {
    expect(interpretacion.texto).toContain('P-01');
  });

  it('arrastra la ficha de la PKB', () => {
    expect(interpretacion.trazabilidad.fichasPKB).toEqual(['M-01']);
  });

  it('arrastra la referencia científica', () => {
    expect(interpretacion.referencias).toEqual(['ref_1']);
  });

  it('declara el estado funcional de origen', () => {
    expect(interpretacion.trazabilidad.estadoFuncional).toBe('evaluada');
  });

  it('relaciona la capacidad', () => {
    expect(interpretacion.capacidadesRelacionadas).toEqual(['A-01']);
  });
});

describe('PIE-12 · evaluada sin correspondencia en la base', () => {
  it('el PIE no hereda la caracterización del PAE sin comprobarla', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), pkb([]));
    const [interpretacion] = porRegla(informe.porCapacidad, 'PIE-12');
    expect(interpretacion).toBeDefined();
    expect(interpretacion.texto).toContain('Ninguna prueba');
  });

  it('tampoco cuando la ficha existe pero está rechazada', () => {
    const rechazada = pkb([ficha({ id: 'M-09', capacidad: 'A-01', estado: 'insuficiente' })]);
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), rechazada);
    expect(reglas(informe)).toContain('PIE-12');
    expect(reglas(informe)).not.toContain('PIE-01');
  });
});

describe('PIE-06 · cobertura parcial', () => {
  const informe = interpretarRendimiento(analisisParcial('A-01'), PKB_A01);

  it('se emite cuando el estado es parcialmente evaluada', () => {
    expect(reglas(informe)).toContain('PIE-06');
  });

  it('no se emite además la de capacidad caracterizada', () => {
    expect(reglas(informe)).not.toContain('PIE-01');
  });

  it('describe la cobertura sin calificarla', () => {
    const [interpretacion] = porRegla(informe.porCapacidad, 'PIE-06');
    expect(interpretacion.texto).toContain('solo en parte');
  });
});

describe('PIE-07 · registros no vigentes', () => {
  const informe = interpretarRendimiento(analisisDesactualizado('A-01'), PKB_A01);
  const [interpretacion] = porRegla(informe.porCapacidad, 'PIE-07');

  it('se emite ante una capacidad desactualizada', () => {
    expect(interpretacion).toBeDefined();
  });

  it('es de prioridad alta', () => {
    expect(interpretacion.prioridad).toBe('alta');
  });

  it('no afirma que el dato sea inválido, solo que no participa', () => {
    expect(interpretacion.texto).toContain('dejado de ser elegibles');
  });
});

describe('PIE-08 · datos no conciliables', () => {
  const informe = interpretarRendimiento(analisisEnConflicto('A-01'), PKB_A01);
  const [interpretacion] = porRegla(informe.porCapacidad, 'PIE-08');

  it('se emite ante una capacidad en conflicto', () => {
    expect(interpretacion).toBeDefined();
  });

  it('declara explícitamente que no se resuelven', () => {
    expect(interpretacion.texto).toContain('No se resuelven');
  });

  it('nombra ambos registros implicados', () => {
    expect(interpretacion.texto).toContain('r1');
    expect(interpretacion.texto).toContain('r2');
  });
});

describe('PIE-09 · sin evidencia', () => {
  const informe = interpretarRendimiento(analisisVacio(), pkb([]));

  it('se emite para las capacidades activas sin registros', () => {
    expect(porRegla(informe.porCapacidad, 'PIE-09')).toHaveLength(18);
  });

  it('no afirma nada sobre el atleta, solo sobre el dato', () => {
    const [interpretacion] = porRegla(informe.porCapacidad, 'PIE-09');
    expect(interpretacion.texto).toContain('No existe evidencia registrada');
  });
});

describe('PIE-10 · registros excluidos', () => {
  it('se emite cuando hubo registros y ninguno participa', () => {
    const informe = interpretarRendimiento(
      analisisConCapacidad('A-01', { estado: 'anulada' }),
      PKB_A01
    );
    const [interpretacion] = porRegla(informe.porCapacidad, 'PIE-10');
    expect(interpretacion).toBeDefined();
    expect(interpretacion.texto).toContain('registros anulados');
  });
});

describe('PIE-11 · capacidades reservadas', () => {
  const informe = interpretarRendimiento(analisisVacio(), pkb([]));

  it('se emite exactamente para F-01 y F-02', () => {
    const emitidas = porRegla(informe.porCapacidad, 'PIE-11');
    expect(emitidas.map((i) => i.capacidadesRelacionadas[0]).sort()).toEqual(['F-01', 'F-02']);
  });

  it('las reservadas no reciben además «sin evidencia»', () => {
    const sinEvidencia = porRegla(informe.porCapacidad, 'PIE-09');
    const capacidades = sinEvidencia.flatMap((i) => i.capacidadesRelacionadas);
    expect(capacidades).not.toContain('F-01');
  });

  it('una reservada tampoco recibe complementarias', () => {
    const conFichaReservada = pkb([ficha({ id: 'M-XX', capacidad: 'F-01' })]);
    const otro = interpretarRendimiento(analisisVacio(), conFichaReservada);
    const deF01 = otro.porCapacidad.filter((i) => i.capacidadesRelacionadas.includes('F-01'));
    expect(deF01.map((i) => i.regla)).toEqual(['PIE-11']);
  });
});

describe('reglas complementarias de evidencia', () => {
  it('PIE-02 declara el alcance autorizado', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    const [interpretacion] = porRegla(informe.porCapacidad, 'PIE-02');
    expect(interpretacion.texto).toContain('se limita a');
  });

  it('PIE-03 declara las poblaciones estudiadas', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    const [interpretacion] = porRegla(informe.porCapacidad, 'PIE-03');
    expect(interpretacion.texto).toContain('población adulta general');
    expect(interpretacion.texto).toContain('no es aplicable');
  });

  it('PIE-04 solo se emite con nivel bajo o muy bajo', () => {
    const moderada = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    expect(reglas(moderada)).not.toContain('PIE-04');

    const baja = pkb([ficha({ id: 'M-01', capacidad: 'A-01', nivelEvidencia: 'baja' })]);
    const otro = interpretarRendimiento(analisisConCapacidad('A-01'), baja);
    expect(reglas(otro)).toContain('PIE-04');
  });

  it('PIE-05 solo con validez de constructo no verificada', () => {
    const sinValidez = pkb([
      ficha({
        id: 'M-01', capacidad: 'A-01',
        limitaciones: ['validez_constructo_no_verificada'],
      }),
    ]);
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), sinValidez);
    const [interpretacion] = porRegla(informe.porCapacidad, 'PIE-05');
    expect(interpretacion.texto).toContain('reproducibilidad');
  });

  it('PIE-13 se emite ante evidencia insuficiente declarada', () => {
    const insuficiente = pkb([
      ficha({ id: 'M-08', capacidad: 'A-03', estado: 'insuficiente' }),
    ]);
    const informe = interpretarRendimiento(analisisVacio(), insuficiente);
    expect(reglas(informe)).toContain('PIE-13');
  });

  it('PIE-14 se emite ante una correspondencia desaconsejada', () => {
    const noRecomendada = pkb([
      ficha({ id: 'M-15', capacidad: 'D-02', estado: 'no_recomendada', pruebaId: 'P-10' }),
    ]);
    const informe = interpretarRendimiento(analisisVacio(), noRecomendada);
    const [interpretacion] = porRegla(informe.porCapacidad, 'PIE-14');
    expect(interpretacion.texto).toContain('desaconseja');
    expect(interpretacion.texto).toContain('P-10');
  });

  it('una ficha rechazada nunca produce PIE-02 ni PIE-01', () => {
    const rechazada = pkb([ficha({ id: 'M-09', capacidad: 'A-01', estado: 'insuficiente' })]);
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), rechazada);
    expect(reglas(informe)).not.toContain('PIE-02');
    expect(reglas(informe)).not.toContain('PIE-01');
  });
});

describe('una capacidad produce siempre exactamente una principal', () => {
  it('con PKB completa', () => {
    const informe = interpretarRendimiento(analisisConCapacidad('A-01'), PKB_A01);
    const principales = new Set(['PIE-01', 'PIE-06', 'PIE-07', 'PIE-08', 'PIE-09', 'PIE-10', 'PIE-11', 'PIE-12']);
    const deA01 = informe.porCapacidad.filter(
      (i) => i.capacidadesRelacionadas.includes('A-01') && principales.has(i.regla)
    );
    expect(deA01).toHaveLength(1);
  });

  it('para las 20 capacidades', () => {
    const informe = interpretarRendimiento(analisisVacio(), pkb([]));
    const principales = new Set(['PIE-09', 'PIE-11']);
    expect(informe.porCapacidad.filter((i) => principales.has(i.regla))).toHaveLength(20);
  });
});
