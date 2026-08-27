// ── El hilo de conversación (Sprint BCS-15) ────────────────────────────────
//
// Vive fuera de `preguntar.ts` por dos razones, y la segunda es la que manda:
//
//   1 · Es lógica pura y se prueba sola.
//   2 · `preguntar.ts` lleva `"use server"`, y de un módulo así Next.js exige
//       que TODO lo exportado sea una función async — es la frontera de las
//       acciones de servidor, no un fichero de utilidades. Exportar de allí una
//       función síncrona para poder probarla rompería la compilación.
//
// ── POR QUÉ HAY HILO ──────────────────────────────────────────────────────
//
//   Sin él, cada pregunta empezaba de cero y «explícame más eso» no tenía
//   antecedente: el modelo devolvía otro resumen del informe entero en vez de
//   desarrollar lo que acababa de decir. Profundizar es, sobre todo, poder
//   repreguntar.
//
// ── DÓNDE VA EL INFORME ───────────────────────────────────────────────────
//
//   Pegado al PRIMER turno del usuario, nunca repetido. Repetirlo en cada
//   pregunta multiplicaría el coste por el número de preguntas —el informe es
//   con diferencia la parte más larga— y le daría al modelo tres copias del
//   mismo documento entre las que elegir.
//
// Módulo puro.

import type { Turno } from './proveedor';

/**
 * Turnos que se conservan.
 *
 * Seis son tres idas y vueltas: suficiente para repreguntar dos veces sobre lo
 * mismo, que es donde está el valor. Más allá, el hilo cuesta más de lo que
 * aporta, y en la capa gratuita eso se paga en cuota.
 */
export const MAX_TURNOS = 6;

/** Longitud máxima de un turno del historial, que llega del navegador. */
export const MAX_TURNO = 4000;

/**
 * El hilo tal como se manda al modelo.
 *
 * `informe` es el contexto ya redactado; se inyecta en lugar de construirse
 * aquí para que este módulo no dependa de los motores y se pueda probar con
 * una cadena cualquiera.
 */
export function construirTurnos(
  informe: string,
  historial: readonly Turno[],
  pregunta: string,
): Turno[] {
  const recortado = historial
    .filter((t) => t.texto.trim() !== '')
    // Por el PRINCIPIO, nunca por el final: los turnos recientes son los que
    // dan sentido a «eso» y «lo que acabas de decir».
    .slice(-MAX_TURNOS)
    .map((t) => ({ rol: t.rol, texto: t.texto.slice(0, MAX_TURNO) }));

  // Un hilo tiene que empezar por el usuario. Si el recorte dejó arriba una
  // respuesta del modelo, se descarta: las dos APIs rechazan lo contrario, y
  // un 400 del proveedor aquí se leería como «el modelo falló».
  while (recortado.length > 0 && recortado[0].rol !== 'usuario') recortado.shift();

  const conInforme = (texto: string): string => `${informe}\n\n---\n\nPregunta: ${texto}`;

  if (recortado.length === 0) {
    return [{ rol: 'usuario', texto: conInforme(pregunta) }];
  }

  return [
    { rol: 'usuario', texto: conInforme(recortado[0].texto) },
    ...recortado.slice(1),
    { rol: 'usuario', texto: pregunta },
  ];
}
