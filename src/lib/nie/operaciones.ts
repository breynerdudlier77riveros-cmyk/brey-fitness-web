// ── NIE-1.3.1 · qué autoriza cada tipo de norma ────────────────────────────
//
// La arquitectura soporta los siete tipos que la NKB define. **Que un tipo esté
// soportado no significa que exista una norma admisible de ese tipo**: hoy solo
// hay TN-1 y TN-2 en la base, y este módulo no inventa las demás.
//
// Las seis preguntas que decide cada autorización (`21`):
//
//   1. ¿La fuente publica directamente el dato?
//   2. ¿La NKB autoriza derivarlo?
//   3. ¿La operación exige asumir una distribución?
//   4. ¿Exige interpolar?
//   5. ¿Exige convertir unidades?
//   6. ¿Cambia el significado estadístico de la norma?
//
// Si alguna revela una operación no autorizada, no se implementa: se devuelve
// estado explícito.
//
// Módulo puro.

import type { TipoNorma } from './tipos';

/** Operación que un consumidor puede pedir. */
export type OperacionSolicitada =
  /** Deja que el tipo de norma decida qué se puede hacer. */
  | 'AUTOMATICA'
  | 'LOCALIZAR_EN_PERCENTILES'
  | 'PUNTUACION_Z'
  | 'PERCENTIL_DESDE_Z'
  | 'PUNTO_DE_CORTE'
  | 'CLASIFICACION'
  | 'DERIVAR_DESDE_LMS';

/** Operación que el motor llegó a ejecutar. */
export type OperacionRealizada =
  | 'LOCALIZAR_EN_PERCENTILES'
  | 'PUNTUACION_Z'
  | 'NINGUNA';

export interface Autorizacion {
  autorizada: boolean;
  /** Operación que se ejecutaría. `NINGUNA` cuando no se autoriza. */
  operacion: OperacionRealizada;
  motivo: string;
}

const NO = (motivo: string): Autorizacion => ({
  autorizada: false,
  operacion: 'NINGUNA',
  motivo,
});

const SI = (operacion: OperacionRealizada, motivo: string): Autorizacion => ({
  autorizada: true,
  operacion,
  motivo,
});

/** Operación que cada tipo autoriza por sí mismo, sin que nadie la pida. */
function automatica(tipo: TipoNorma): Autorizacion {
  switch (tipo) {
    case 'TN-1':
      return SI(
        'LOCALIZAR_EN_PERCENTILES',
        'La fuente publica percentiles: situar el valor entre ellos es leerlos, no derivarlos',
      );
    case 'TN-2':
      return SI(
        'PUNTUACION_Z',
        'La fuente publica media y desviación típica: la puntuación z las usa tal cual, sin suponer forma de distribución',
      );
    default:
      return NO(
        `No hay operación automática definida para ${tipo}: la NKB no contiene ninguna norma admisible de ese tipo`,
      );
  }
}

/**
 * Decide si una operación puede ejecutarse sobre una norma de este tipo.
 *
 * Las negativas son tan importantes como las afirmativas, y por eso cada una
 * lleva su motivo: un consumidor debe poder explicar por qué no obtuvo lo que
 * pidió sin leer este fichero.
 */
export function autorizar(tipo: TipoNorma, solicitud: OperacionSolicitada): Autorizacion {
  if (solicitud === 'AUTOMATICA') return automatica(tipo);

  switch (solicitud) {
    case 'LOCALIZAR_EN_PERCENTILES':
      return tipo === 'TN-1'
        ? automatica('TN-1')
        : NO(
            `Una norma ${tipo} no publica percentiles. Derivarlos exigiría suponer una distribución que la fuente no declara`,
          );

    case 'PUNTUACION_Z':
      return tipo === 'TN-2'
        ? automatica('TN-2')
        : NO(`Una norma ${tipo} no publica media y desviación típica`);

    /**
     * Convertir z en percentil exige asumir normalidad.
     *
     * `HGS-CO-UNI-TN2` declara expresamente que la distribución **no** es
     * normal; `HGS-DE-TN2` no declara su forma. En un caso está prohibido por
     * evidencia y en el otro por defecto (`21`, DV-03, caso CR-16). En ninguno
     * está autorizado.
     */
    case 'PERCENTIL_DESDE_Z':
      return NO(
        'Convertir una puntuación z en percentil exige asumir normalidad. Ninguna ficha TN-2 de la NKB la sostiene: una la niega y la otra no declara la forma de su distribución',
      );

    /**
     * `41`: cero normas TN-5 en cinco sprints. Y no se sustituye por
     * media − 1 DT, ni por un percentil, ni por categorías de autores: es
     * exactamente lo que RN-02, RN-03 y RN-04 rechazaron.
     */
    case 'PUNTO_DE_CORTE':
      return NO(
        'No existe ningún punto de corte admisible en la NKB para esta variable. Un percentil o una desviación típica por debajo de la media no son sustitutos',
      );

    case 'CLASIFICACION':
      return NO(
        'No existe ninguna norma TN-7 admisible. Las categorías que publican algunas fuentes fueron rechazadas por definirse sobre la propia distribución (RN-03, RN-04)',
      );

    /**
     * L, M y S se conservan porque hacen reproducible la norma. Calcular con
     * ellos un percentil que la fuente no tabula sería una derivación OR-3, y
     * las propias fichas chilenas lo prohíben.
     */
    case 'DERIVAR_DESDE_LMS':
      return NO(
        'Los parámetros L, M y S se conservan pero no autorizan a calcular percentiles que la fuente no tabula (`21`, OR-3)',
      );
  }
}

/** Tipos con al menos una norma admisible en la NKB hoy. */
export const TIPOS_CON_NORMAS: readonly TipoNorma[] = ['TN-1', 'TN-2'];
