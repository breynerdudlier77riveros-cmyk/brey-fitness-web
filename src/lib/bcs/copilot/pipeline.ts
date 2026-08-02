// ── Pipeline del copilot (Sprint BCS-6.0) ──────────────────────────────────
// Camino único que recorre TODO entregable:
//
//   fuentes → plantilla → composición → VALIDACIÓN → traza → entregable
//
// La validación no es opcional ni configurable. Un entregable que la incumple
// se rechaza con sus violaciones, y el llamador recibe el motivo. No hay
// bandera para saltársela: si existiera, alguien la usaría.

import { componerTexto, contarPalabras } from './render';
import { validarSecciones } from './validaciones';
import type { FuentesNormalizadas } from './fuentes';
import type { Entregable, EntregableRechazado, Seccion, TipoEntregable, TrazaEntregable } from './tipos';

export interface Composicion {
  secciones: Seccion[];
  traza: TrazaEntregable;
}

export interface Solicitud {
  tipo: TipoEntregable;
  variante: string;
  titulo: string;
  componer: (f: FuentesNormalizadas) => Composicion;
  /**
   * Material genérico, no referido al reporte de un cliente. Desactiva la
   * comprobación de variables: las preguntas frecuentes y el material
   * educativo explican conceptos con independencia de qué se midió a quién.
   */
  generico?: boolean;
}

export type ResultadoPipeline =
  | { ok: true; entregable: Entregable }
  | { ok: false; rechazado: EntregableRechazado };

/**
 * Ejecuta una solicitud completa.
 *
 * Cualquier excepción durante la composición se convierte en rechazo, no se
 * propaga: un fallo al generar un correo no puede tumbar la generación del
 * resto de documentos del lote.
 */
export function ejecutar(solicitud: Solicitud, fuentes: FuentesNormalizadas): ResultadoPipeline {
  let composicion: Composicion;

  try {
    composicion = solicitud.componer(fuentes);
  } catch (error) {
    return {
      ok: false,
      rechazado: {
        tipo: solicitud.tipo,
        variante: solicitud.variante,
        motivo: `La composición falló: ${error instanceof Error ? error.message : 'error desconocido'}.`,
        violaciones: [],
      },
    };
  }

  const violaciones = validarSecciones(composicion.secciones, fuentes.variablesDisponibles, {
    verificarVariables: !solicitud.generico,
  });

  if (violaciones.length > 0) {
    return {
      ok: false,
      rechazado: {
        tipo: solicitud.tipo,
        variante: solicitud.variante,
        motivo:
          'El texto compuesto incumple las restricciones de seguridad del copilot y no se entrega. No se sanea: un documento recortado en silencio ocultaría lo que faltó.',
        violaciones: violaciones.map((v) => v.detalle),
      },
    };
  }

  const texto = componerTexto(composicion.secciones);

  return {
    ok: true,
    entregable: {
      id: `${solicitud.tipo}:${solicitud.variante}`,
      tipo: solicitud.tipo,
      variante: solicitud.variante,
      titulo: solicitud.titulo,
      secciones: composicion.secciones,
      texto,
      palabras: contarPalabras(texto),
      traza: composicion.traza,
    },
  };
}
