// ── Nota SOAP y documentos de impresión (flujos 7 y 10) ────────────────────
// SOAP con una restricción dura: el apartado Assessment solo RESUME lo que el
// Analysis Engine determinó. No emite diagnóstico, no lo insinúa y no lo
// deduce.
//
// Consecuencia práctica en Subjective: el BCS no registra el relato del
// paciente. Ese apartado se deja explícitamente vacío en lugar de rellenarlo
// con datos objetivos disfrazados, que es el error clásico al automatizar SOAP.

import type { FuentesNormalizadas } from '../fuentes';
import { Traza } from '../trazabilidad';
import type { Seccion } from '../tipos';

export function componerSoap(f: FuentesNormalizadas) {
  const traza = new Traza('nota_soap');

  // S — el sistema no captura relato subjetivo. Se declara, no se inventa.
  const subjective = [
    'No registrado. El sistema de composición corporal no captura el relato del paciente.',
  ];

  // O — datos objetivos tal como se midieron.
  const objective: string[] = [
    `Evaluación de composición corporal por bioimpedancia. ${f.cantidadMediciones} ${f.cantidadMediciones === 1 ? 'registro vigente' : 'registros vigentes'}${f.fechaActual ? `, último del ${f.fechaActual}` : ''}.`,
  ];

  if (f.cambiosSignificativos.length > 0) {
    objective.push(
      `Variación por encima del umbral definido en: ${f.cambiosSignificativos.map((c) => c.titulo.toLowerCase()).join('; ')}.`
    );
    f.cambiosSignificativos.forEach((c) => traza.usarHallazgo(c.id).usarVariable(c.variable));
  }

  if (f.cambiosSinUmbral.length > 0) {
    objective.push(
      `Variación sin umbral documentado en ${f.cambiosSinUmbral.length} variables adicionales.`
    );
    f.cambiosSinUmbral.forEach((c) => traza.usarHallazgo(c.id).usarVariable(c.variable));
  }

  if (f.alertas.length > 0) {
    objective.push(`${f.alertas.length} incidencias de consistencia pendientes de verificación.`);
    f.alertas.forEach((a) => traza.usarHallazgo(a.id));
  }

  // A — SOLO resume el Analysis Engine. Ni una palabra propia.
  const assessment: string[] = [
    `Resumen del análisis automatizado: ${f.textoResumen}`,
    'El presente apartado resume exclusivamente la salida del motor de análisis de composición corporal. No constituye juicio clínico ni valoración del estado de salud.',
  ];

  if (f.limitaciones.length > 0) {
    assessment.push(
      `Interpretación limitada en ${f.limitaciones.length} ${f.limitaciones.length === 1 ? 'aspecto' : 'aspectos'}: ${f.limitaciones.map((l) => l.titulo.toLowerCase()).join('; ')}.`
    );
  }

  // P — solo acciones administrativas sobre el registro. Nada terapéutico.
  const plan: string[] = [];
  const altas = f.recomendaciones.filter((r) => r.prioridad === 'alta');
  if (altas.length > 0) {
    plan.push(`Verificación de ${altas.length} ${altas.length === 1 ? 'registro señalado' : 'registros señalados'} por el control de consistencia.`);
    altas.forEach((r) => traza.usarRecomendacion(r.id));
  }
  plan.push('Continuidad del registro longitudinal. El sistema no establece periodicidad.');
  if (f.ambitosNoCubiertos.length > 0) {
    plan.push(`Fuera del alcance de este sistema: ${f.ambitosNoCubiertos.join(', ').toLowerCase()}.`);
  }

  const secciones: Seccion[] = [
    { titulo: 'S · Subjective', contenido: subjective },
    { titulo: 'O · Objective', contenido: objective },
    { titulo: 'A · Assessment', contenido: assessment },
    { titulo: 'P · Plan', contenido: plan },
  ];

  return { secciones, traza: traza.construir() };
}

// ── Documentos de impresión (flujo 10) ─────────────────────────────────────

export type VarianteImpresion = 'una_pagina' | 'dos_paginas' | 'completo';

/**
 * Índice de lo que debe imprimirse en cada formato.
 *
 * NO reimplementa el reporte: el documento completo lo sigue produciendo
 * ReportView, que no se toca. Esto describe qué SECCIONES de ese reporte
 * componen cada formato, para que la capa de presentación las seleccione.
 */
export const COMPOSICION_IMPRESION: Record<VarianteImpresion, string[]> = {
  una_pagina: ['Resumen ejecutivo', 'Indicadores principales', 'Conclusión'],
  dos_paginas: [
    'Resumen ejecutivo',
    'Indicadores principales',
    'Comparación con la medición anterior',
    'Observaciones clínicas',
    'Qué no puede interpretarse',
    'Conclusión',
  ],
  completo: ['Reporte íntegro tal como lo emite ReportView, sin modificación'],
};

export function componerDocumentoImpresion(f: FuentesNormalizadas, variante: VarianteImpresion) {
  const traza = new Traza(`documento_impresion:${variante}`);

  const secciones: Seccion[] = [
    {
      titulo: 'Documento',
      contenido: [
        `${f.clienteNombre} · Composición corporal · ${f.hoyISO}`,
        variante === 'completo'
          ? 'Reporte completo, generado por el sistema de reportes sin alteración.'
          : `Extracto de ${variante === 'una_pagina' ? 'una página' : 'dos páginas'} del reporte completo.`,
      ],
    },
    { titulo: 'Secciones incluidas', contenido: COMPOSICION_IMPRESION[variante] },
  ];

  return { secciones, traza: traza.construir() };
}
