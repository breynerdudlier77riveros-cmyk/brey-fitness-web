// ── Alertas administrativas y distribuciones (Sprint BCS-5.0) ──────────────
// Las alertas de este archivo son HECHOS sobre el estado administrativo del
// consultorio, nunca recomendaciones ni juicios sobre ninguna persona.
//
// Tres de los tipos de alerta que el encargo enumeraba NO se implementan, y el
// motivo está documentado en ALERTAS_NO_IMPLEMENTADAS al final del archivo.

import { analizarComposicionCorporal } from '@/lib/bcs/analysis';
import type { ClienteIndexado } from './clientes';
import { vigentes } from './clientes';
import type { AlertaAdministrativa, Distribuciones, SegmentoDistribucion } from './tipos';

export function construirAlertas(indice: readonly ClienteIndexado[], hoyISO: string): AlertaAdministrativa[] {
  const alertas: AlertaAdministrativa[] = [];

  for (const c of vigentes(indice)) {
    const { id: clienteId, nombre, estado } = c.cliente;

    if (estado === 'archivado' && c.tieneEnlaceActivo) {
      alertas.push({
        id: `archivado_con_enlace_activo:${clienteId}`,
        tipo: 'archivado_con_enlace_activo',
        clienteId,
        nombre,
        hecho: 'Cliente archivado que conserva un enlace público activo.',
      });
    }

    if (c.medicionesVigentes.length === 0) {
      alertas.push({
        id: `sin_mediciones:${clienteId}`,
        tipo: 'sin_mediciones',
        clienteId,
        nombre,
        hecho: 'Cliente sin ninguna medición vigente registrada.',
      });
    }

    if (c.enlacesActivos.length > 1) {
      alertas.push({
        id: `multiples_enlaces_activos:${clienteId}`,
        tipo: 'multiples_enlaces_activos',
        clienteId,
        nombre,
        hecho: `Cliente con ${c.enlacesActivos.length} enlaces públicos activos simultáneos.`,
      });
    }

    if (c.medicionesAnuladas.length > 0) {
      alertas.push({
        id: `con_mediciones_anuladas:${clienteId}`,
        tipo: 'con_mediciones_anuladas',
        clienteId,
        nombre,
        hecho: `Cliente con ${c.medicionesAnuladas.length} ${c.medicionesAnuladas.length === 1 ? 'medición anulada' : 'mediciones anuladas'} en su historial.`,
      });
    }

    // Inconsistencias: se DELEGA en el Analysis Engine en lugar de reimplementar
    // sus reglas aquí. Es puro y no hace I/O, así que ejecutarlo por cliente es
    // aceptable; duplicar la tolerancia de ±0.5 kg en esta capa crearía una
    // segunda fuente de verdad destinada a divergir.
    if (c.medicionesVigentes.length > 0) {
      const analisis = analizarComposicionCorporal(c.medicionesVigentes, { hoyISO });
      const incidencias = analisis.avisos.filter((a) => a.tipo === 'alerta').length;
      if (incidencias > 0) {
        alertas.push({
          id: `con_inconsistencias:${clienteId}`,
          tipo: 'con_inconsistencias',
          clienteId,
          nombre,
          hecho: `Cliente con ${incidencias} ${incidencias === 1 ? 'incidencia' : 'incidencias'} de consistencia en sus registros.`,
        });
      }
    }
  }

  // Orden estable: por tipo y luego por nombre.
  return alertas.sort((a, b) =>
    a.tipo !== b.tipo ? a.tipo.localeCompare(b.tipo) : a.nombre.localeCompare(b.nombre)
  );
}

export function construirDistribuciones(indice: readonly ClienteIndexado[]): Distribuciones {
  const contables = vigentes(indice);

  const porEstado: SegmentoDistribucion[] = [
    { etiqueta: 'Activos', valor: contables.filter((c) => c.cliente.estado === 'activo').length },
    { etiqueta: 'Archivados', valor: contables.filter((c) => c.cliente.estado === 'archivado').length },
  ];

  const cuenta = (predicado: (n: number) => boolean) =>
    contables.filter((c) => predicado(c.medicionesVigentes.length)).length;

  const porNumeroDeMediciones: SegmentoDistribucion[] = [
    { etiqueta: 'Sin mediciones', valor: cuenta((n) => n === 0) },
    { etiqueta: '1 medición', valor: cuenta((n) => n === 1) },
    { etiqueta: '2 a 5', valor: cuenta((n) => n >= 2 && n <= 5) },
    { etiqueta: 'Más de 5', valor: cuenta((n) => n > 5) },
  ];

  const conEnlace = contables.filter((c) => c.tieneEnlaceActivo).length;
  const porEnlace: SegmentoDistribucion[] = [
    { etiqueta: 'Con enlace activo', valor: conEnlace },
    { etiqueta: 'Sin enlace activo', valor: contables.length - conEnlace },
  ];

  return { porEstado, porNumeroDeMediciones, porEnlace };
}

/**
 * Tipos de alerta que el encargo enumeraba y que NO se implementan.
 * Se registran para que la ausencia sea auditable y deliberada.
 */
export const ALERTAS_NO_IMPLEMENTADAS = [
  {
    alerta: 'Cliente sin diagnóstico',
    motivo:
      'El Diagnóstico BPS pertenece al Core Product y se asocia a un Usuario de la aplicación. Un Cliente del BCS es una persona presencial del entrenador, nunca un Usuario (Domain Model IN-31): no puede tener diagnóstico, así que la alerta no es aplicable a este contexto acotado.',
  },
  {
    alerta: 'Cliente con token duplicado',
    motivo:
      'El token es UNIQUE global en la base de datos, de modo que un duplicado es imposible por construcción. Se implementa en su lugar `multiples_enlaces_activos`, que sí es un estado alcanzable y viola la invariante de un enlace activo por cliente.',
  },
  {
    alerta: 'Cliente con observaciones pendientes',
    motivo:
      'No existe el concepto de observación pendiente: el Clinical Observation Generator redacta bajo demanda a partir del análisis vigente y no deja nada en cola. No hay estado que consultar.',
  },
] as const;

/** Distribución por procedencia: no implementada, ver motivo. */
export const DISTRIBUCION_PROCEDENCIA_NO_IMPLEMENTADA =
  'La procedencia (crudo, derivado, fabricante, validación, producto) es un atributo de cada VARIABLE del catálogo, no de un Cliente. Agrupar clientes por procedencia no tiene referente en el modelo de datos.';
