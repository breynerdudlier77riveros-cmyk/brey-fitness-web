// ── Reglas de consistencia y metodología, PIE-20…PIE-28 (Sprint PAS-4.0) ───
// Lo que se dice del conjunto de datos y de los límites del método. Las de
// dominio y cobertura viven en `reglas-cobertura.ts`.

import type { EstadoCapacidad, InformeConsistencia, PerformanceAnalysis } from '../resultado';
import { etiquetaCapacidad } from './etiquetas';
import { cantidad, enumerar, render } from './render';
import { construirInterpretacion } from './trazabilidad';
import type { ConocimientoPKB, Interpretacion } from './tipos';

export {
  calcularCobertura,
  interpretarCobertura,
  interpretarDominios,
} from './reglas-cobertura';

export function interpretarConsistencia(informe: InformeConsistencia): Interpretacion[] {
  const comun = { clave: 'global', bloque: 'consistencia' as const };

  switch (informe.nivel) {
    case 'completa':
      return [construirInterpretacion({
        ...comun, regla: 'PIE-20', prioridad: 'media', plantilla: 'CONSISTENCIA_COMPLETA',
        texto: render('CONSISTENCIA_COMPLETA'),
      })];

    case 'parcial':
      return [construirInterpretacion({
        ...comun, regla: 'PIE-21', prioridad: 'media', plantilla: 'CONSISTENCIA_PARCIAL',
        texto: render('CONSISTENCIA_PARCIAL', {
          caracterizadas: cantidad(informe.capacidadesEvaluadas),
          activas: cantidad(informe.capacidadesEvaluables),
        }),
      })];

    case 'inconsistente':
      return [construirInterpretacion({
        ...comun, regla: 'PIE-22', prioridad: 'estructural',
        plantilla: 'CONSISTENCIA_INCONSISTENTE',
        texto: render('CONSISTENCIA_INCONSISTENTE', {
          conflictos: cantidad(informe.conflictos),
        }),
      })];

    case 'sin_datos':
      return [construirInterpretacion({
        ...comun, regla: 'PIE-23', prioridad: 'estructural',
        plantilla: 'CONSISTENCIA_SIN_DATOS',
        texto: render('CONSISTENCIA_SIN_DATOS'),
      })];
  }
}

/**
 * Observaciones sobre el método. PIE-24 es la más importante del motor: sin
 * sensibilidad al cambio documentada, no puede afirmarse que un valor haya
 * variado — y es lo primero que un profesional querrá saber.
 */
export function interpretarMetodologia(
  analisis: PerformanceAnalysis,
  pkb: ConocimientoPKB,
  estados: readonly EstadoCapacidad[]
): Interpretacion[] {
  const salida: Interpretacion[] = [];
  const comun = { clave: 'global', bloque: 'metodologia' as const };

  const sinSensibilidad = pkb.fichas.filter((f) => !f.sensibilidadDocumentada);
  if (sinSensibilidad.length > 0) {
    const afectadas = [...new Set(sinSensibilidad.map((f) => f.capacidad))].sort();
    const nombres = afectadas
      .map((id) => estados.find((e) => e.capacidad === id))
      .filter((e): e is EstadoCapacidad => e !== undefined)
      .map(etiquetaCapacidad);

    if (nombres.length > 0) {
      salida.push(
        construirInterpretacion({
          ...comun, regla: 'PIE-24', prioridad: 'estructural',
          plantilla: 'METODO_SENSIBILIDAD',
          texto: render('METODO_SENSIBILIDAD', { capacidades: enumerar(nombres) }),
          capacidades: afectadas, fichas: sinSensibilidad,
        })
      );
    }
  }

  const sinVigencia = pkb.fichas.filter((f) => !f.vigenciaDocumentada);
  if (sinVigencia.length > 0) {
    salida.push(
      construirInterpretacion({
        ...comun, regla: 'PIE-25', prioridad: 'alta', plantilla: 'METODO_VIGENCIA',
        texto: render('METODO_VIGENCIA', {
          pruebas: enumerar([...new Set(sinVigencia.map((f) => f.pruebaId))].sort()),
        }),
        fichas: sinVigencia,
      })
    );
  }

  if (pkb.fichas.length > 0 && pkb.fichas.every((f) => !f.pesoDocumentado)) {
    salida.push(
      construirInterpretacion({
        ...comun, regla: 'PIE-26', prioridad: 'informativa', plantilla: 'METODO_PESOS',
        texto: render('METODO_PESOS'), fichas: pkb.fichas,
      })
    );
  }

  const anulados = analisis.hallazgos.find((h) => h.tipo === 'registro_anulado_presente');
  if (anulados) {
    salida.push(
      construirInterpretacion({
        ...comun, regla: 'PIE-27', prioridad: 'informativa', plantilla: 'DATO_ANULADOS',
        texto: render('DATO_ANULADOS', { registros: enumerar(anulados.registros) }),
        hallazgos: [anulados.id],
      })
    );
  }

  // Siempre. Es la declaración de alcance del informe entero.
  salida.push(
    construirInterpretacion({
      ...comun, regla: 'PIE-28', prioridad: 'estructural',
      plantilla: 'DATO_LIMITE_INTERPRETACION',
      texto: render('DATO_LIMITE_INTERPRETACION'),
    })
  );

  return salida;
}
