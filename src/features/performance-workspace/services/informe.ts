// ── Orquestación de los motores (Sprint PAS-7.0) ───────────────────────────
// EL ÚNICO sitio del Workspace donde se ejecutan PAE, PIE y PPRE. Se ejecutan
// UNA vez y su salida viaja completa; ninguna pantalla vuelve a llamarlos.
//
// El Workspace no interpreta, no calcula y no genera conocimiento: encadena.
// Si algo de aquí decidiera algo, estaría en la capa equivocada.

import { analizarRendimiento } from '@/lib/pas';
import { PKB_V1, interpretarRendimiento } from '@/lib/pas/interpretation';
import { generarRecomendaciones } from '@/lib/pas/recommendations';
import type { PerformanceAnalysis } from '@/lib/pas';
import type { ConocimientoPKB, PerformanceInterpretationReport } from '@/lib/pas/interpretation';
import type { PerformanceRecommendationReport } from '@/lib/pas/recommendations';
import type { CatalogoPruebas } from '@/lib/pas';
import { CATALOGO_PAS } from '../schemas/catalogo';
import { aEvaluacionesPAE } from './mapeo';
import type { Evaluacion, RegistroWorkspace } from '../schemas/tipos';

export interface EntradaInforme {
  atletaId: string;
  evaluaciones: readonly { evaluacion: Evaluacion; registros: readonly RegistroWorkspace[] }[];
  /** Fecha de referencia. Se recibe: ninguna capa pura lee el reloj. */
  hoyISO: string;
  catalogo?: CatalogoPruebas;
  pkb?: ConocimientoPKB;
}

/**
 * Los tres DTO finales del PAS, resueltos de una vez.
 *
 * Se devuelven juntos a propósito: separarlos permitiría que una pantalla
 * mostrase un análisis y una interpretación calculados en momentos distintos,
 * y el informe dejaría de ser internamente coherente.
 */
export interface InformeCompleto {
  analisis: PerformanceAnalysis;
  interpretacion: PerformanceInterpretationReport;
  recomendaciones: PerformanceRecommendationReport;
}

export function construirInformeCompleto(entrada: EntradaInforme): InformeCompleto {
  const catalogo = entrada.catalogo ?? CATALOGO_PAS;
  const pkb = entrada.pkb ?? PKB_V1;

  const analisis = analizarRendimiento({
    atletaId: entrada.atletaId,
    evaluaciones: aEvaluacionesPAE(entrada.evaluaciones, entrada.atletaId),
    catalogo,
    hoyISO: entrada.hoyISO,
  });

  const interpretacion = interpretarRendimiento(analisis, pkb);
  const recomendaciones = generarRecomendaciones(analisis, interpretacion, pkb);

  return { analisis, interpretacion, recomendaciones };
}

/**
 * Informe de UNA evaluación concreta.
 *
 * Deriva solo con sus registros, no con el histórico del atleta: el detalle de
 * una evaluación describe esa sesión. El acumulado se pide aparte.
 */
export function informeDeEvaluacion(
  atletaId: string,
  evaluacion: Evaluacion,
  registros: readonly RegistroWorkspace[],
  hoyISO: string
): InformeCompleto {
  return construirInformeCompleto({
    atletaId,
    evaluaciones: [{ evaluacion, registros }],
    hoyISO,
  });
}

/** Recuentos para el historial, leídos del análisis ya derivado. */
export function resumirInforme(informe: InformeCompleto) {
  return {
    capacidadesCaracterizadas: informe.interpretacion.cobertura.caracterizadas,
    capacidadesActivas: informe.interpretacion.cobertura.capacidadesActivas,
    registrosElegibles: informe.analisis.resumen.registrosElegibles,
    registrosTotales: informe.analisis.resumen.registrosTotales,
    conflictos: informe.analisis.resumen.conflictos,
    recomendaciones: informe.recomendaciones.estadisticas.total,
    versionPAS: informe.analisis.coordenadas.motor,
  };
}
