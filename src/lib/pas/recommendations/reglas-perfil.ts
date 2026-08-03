// ── Reglas de perfil y método, PPRE-04, 06, 14…16, 18…20 (PAS-6.0) ─────────
// Lo que se dice del conjunto: cobertura global, consistencia, límites del
// método y estado documental.

import { construirRecomendacion } from './constructor';
import type { ContextoPPRE } from './contexto';
import { enumerar } from './render';
import type { Recomendacion } from './tipos';

export function reglasDePerfil(ctx: ContextoPPRE): Recomendacion[] {
  const salida: Recomendacion[] = [];
  const { analisis, informe, pkb } = ctx;

  // PPRE-04 · ninguna capacidad activa caracterizada
  if (informe.cobertura.caracterizadas === 0) {
    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-04', categoria: 'cobertura', prioridad: 'critica',
        plantilla: 'PERFIL_SIN_COBERTURA',
        fundamento: `El motor de interpretación declara 0 de ${informe.cobertura.capacidadesActivas} capacidades activas caracterizadas.`,
        interpretaciones: informe.interpretacionCobertura,
      })
    );
  }

  // PPRE-06 · la derivación registra contradicciones
  if (analisis.consistencia.nivel === 'inconsistente') {
    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-06', categoria: 'consistencia', prioridad: 'critica',
        plantilla: 'PERFIL_INCONSISTENTE',
        valores: { conflictos: String(analisis.consistencia.conflictos) },
        fundamento: 'El nivel de consistencia lo fija el motor de evaluación; este motor lo reproduce.',
        interpretaciones: informe.consistencia,
        limitaciones: ['El listado de contradicciones vive en el perfil, no en esta salida.'],
      })
    );
  }

  // PPRE-19 · el catálogo no declara correspondencias respaldadas
  const aplicables = pkb.fichas.filter(
    (f) => f.estado === 'respaldada' || f.estado === 'parcialmente_respaldada'
  );
  if (aplicables.length === 0) {
    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-19', categoria: 'evidencia', prioridad: 'critica',
        plantilla: 'CATALOGO_SIN_CORRESPONDENCIAS',
        fundamento: 'Sin correspondencias respaldadas ninguna capacidad puede caracterizarse.',
        interpretaciones: informe.interpretacionCobertura,
      })
    );
  }

  // PPRE-14 · sensibilidad al cambio no documentada
  const sinSensibilidad = pkb.fichas.filter((f) => !f.sensibilidadDocumentada);
  if (sinSensibilidad.length > 0) {
    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-14', categoria: 'metodologia', prioridad: 'critica',
        plantilla: 'SIN_SENSIBILIDAD',
        valores: {
          pruebas: enumerar([...new Set(sinSensibilidad.map((f) => f.pruebaId))].sort()),
        },
        fundamento: 'Sin cambio mínimo detectable no puede distinguirse una variación del error de medida.',
        capacidades: [...new Set(sinSensibilidad.map((f) => f.capacidad))].sort(),
        fichas: sinSensibilidad,
        interpretaciones: informe.observacionesMetodologicas,
        limitaciones: ['Afecta a cualquier comparación entre dos valoraciones del mismo perfil.'],
      })
    );
  }

  // PPRE-15 · vigencia no documentada
  const sinVigencia = pkb.fichas.filter((f) => !f.vigenciaDocumentada);
  if (sinVigencia.length > 0) {
    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-15', categoria: 'metodologia', prioridad: 'alta',
        plantilla: 'SIN_VIGENCIA',
        valores: { pruebas: enumerar([...new Set(sinVigencia.map((f) => f.pruebaId))].sort()) },
        fundamento: 'Ninguna fuente verificada documenta cuánto tiempo un resultado sigue representando al sujeto.',
        capacidades: [...new Set(sinVigencia.map((f) => f.capacidad))].sort(),
        fichas: sinVigencia,
        interpretaciones: informe.observacionesMetodologicas,
      })
    );
  }

  // PPRE-16 · ninguna correspondencia declara peso relativo
  if (pkb.fichas.length > 0 && pkb.fichas.every((f) => !f.pesoDocumentado)) {
    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-16', categoria: 'metodologia', prioridad: 'informativa',
        plantilla: 'SIN_PESOS',
        fundamento: 'La base no publica ponderación entre correspondencias.',
        fichas: pkb.fichas,
        interpretaciones: informe.observacionesMetodologicas,
      })
    );
  }

  // PPRE-18 · registros anulados en el histórico
  const anulados = analisis.hallazgos.find((h) => h.tipo === 'registro_anulado_presente');
  if (anulados) {
    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-18', categoria: 'seguimiento_documental',
        prioridad: 'informativa', plantilla: 'ANULADOS',
        valores: { registros: enumerar(anulados.registros) },
        fundamento: 'La anulación retira la elegibilidad, no la existencia del registro.',
        hallazgosExtra: [anulados.id],
      })
    );
  }

  // PPRE-20 · trazabilidad completa disponible
  const conTraza = informe.porCapacidad.filter((i) => i.trazabilidad.regla.trim() !== '');
  if (conTraza.length > 0) {
    salida.push(
      construirRecomendacion({
        clave: 'global', regla: 'PPRE-20', categoria: 'seguimiento_documental',
        prioridad: 'informativa', plantilla: 'TRAZABILIDAD_DISPONIBLE',
        valores: { total: String(conTraza.length) },
        fundamento: 'Cada interpretación del perfil declara regla, origen y referencias.',
        interpretaciones: conTraza.slice(0, 0),
      })
    );
  }

  return salida;
}
