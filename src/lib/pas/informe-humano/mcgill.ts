// ── El panel de McGill (Sprint PAS-8.x) ─────────────────────────────────────
//
// McGill no publica una norma para el tiempo aislado de cada prueba: publica
// tres cocientes entre las tres pruebas del mismo atleta, y el cálculo ya
// existe, probado y citado, en `calculo/derivados.ts` — lo único que faltaba
// era usarlo. Ver `registro.ts` (P-21/22/23 · «mcgill/sin-norma») para la
// referencia que documenta por qué NO hay norma para el tiempo suelto.
//
// ── POR QUÉ ESTO VIVE AQUÍ Y NO EN EL NIE NI EN LA CAPA DE EVIDENCIA ────────
//
//   Los tres cocientes son aritmética sobre TRES mediciones del mismo atleta
//   en la misma evaluación. No comparan con ninguna población, así que no son
//   una interpretación normativa — es la misma excepción que ya cubre
//   `tendenciaDe` en `componer.ts` («la resta es aritmética sobre datos del
//   propio atleta»). Aplicada a un cociente en vez de a una diferencia, es el
//   mismo principio.
//
// Módulo puro.

import { cocientesMcGill, type CocienteMcGill } from '@/lib/pas/calculo/derivados';
import { fuenteDe, type Representacion } from '@/lib/pas/evidencia';
import type { PanelMcGill } from './tipos';

const P_FLEXION = 'P-21';
const P_LATERAL = 'P-22';
const P_EXTENSION = 'P-23';

/**
 * El mismo criterio, en la forma que ya sabe dibujar `EvidenceScale`.
 *
 * No es una norma poblacional: es un punto de corte o un rango de tolerancia
 * publicado por el MISMO manual que ya cita `mcgill_torso_ace_2015`. Vive
 * aquí y no en `calculo/derivados.ts` porque `Representacion` es un tipo de
 * la capa de evidencia, y esa capa no depende de la de cálculo.
 */
// `porDebajo`/`porEncima` describen la ZONA, no repiten el veredicto: el
// panel ya dice «cumple» o «no cumple» una sola vez, debajo del gráfico:
// escribir «cumple» también aquí sería la misma frase dos veces en la misma
// tarjeta, el defecto que ya se corrigió en `EvidenceBlock`.
const REPRESENTACION_DE: Readonly<Record<CocienteMcGill['id'], Representacion>> = {
  flexion_extension: {
    clase: 'punto_de_corte',
    valor: 1,
    porDebajo: 'Dentro del criterio del manual',
    porEncima: 'Fuera del criterio del manual',
  },
  // «A menos de 0,05 de 1,00» es un rango de tolerancia, no un corte: por
  // eso se dibuja como banda [0,95, 1,05] y no como un punto único.
  lateral_derecha_izquierda: { clase: 'rango', min: 0.95, max: 1.05 },
  lateral_extension: {
    clase: 'punto_de_corte',
    valor: 0.75,
    porDebajo: 'Dentro del criterio del manual',
    porEncima: 'Fuera del criterio del manual',
  },
};

/** Lo mínimo de una medición que este módulo necesita leer. */
export interface MedicionMcGill {
  pruebaId: string;
  valor: number;
  condiciones: Readonly<Record<string, string>>;
}

/** «Autores. (Año). Título. Publicación.» — o `null` si la fuente no consta. */
function citaDe(fuenteId: string): string | null {
  const f = fuenteDe(fuenteId);
  if (f === null || f.cita === null) return null;
  return `${f.cita.autores}. (${f.cita.anio}). ${f.cita.titulo}. ${f.cita.publicacion}.`;
}

/**
 * El panel de McGill, si esta evaluación registró las tres pruebas.
 *
 * P-22 (puente lateral) tiene que estar registrado DOS VECES, una por lado
 * (`condiciones.lado`): sin las dos mitades no hay cociente derecho:izquierdo
 * que calcular, y mostrar solo dos de los tres cocientes sería dar a entender
 * que el tercero no existe en vez de decir que falta un dato.
 *
 * Con más de un registro de la misma prueba en la evaluación se toma el
 * ÚLTIMO: es el mismo criterio que usa el resto del sistema para un registro
 * repetido, y no una decisión nueva de este módulo.
 */
export function panelMcGillDe(mediciones: readonly MedicionMcGill[]): PanelMcGill | null {
  const ultimaDe = (pruebaId: string, lado?: string): number | null => {
    const de = mediciones.filter(
      (m) => m.pruebaId === pruebaId && (lado === undefined || m.condiciones.lado === lado),
    );
    return de.length === 0 ? null : de[de.length - 1].valor;
  };

  const flexion = ultimaDe(P_FLEXION);
  const extension = ultimaDe(P_EXTENSION);
  const lateralDerecho = ultimaDe(P_LATERAL, 'derecho');
  const lateralIzquierdo = ultimaDe(P_LATERAL, 'izquierdo');

  const lectura = cocientesMcGill({ flexion, extension, lateralDerecho, lateralIzquierdo });
  if (!lectura.hay) return null;

  return {
    cocientes: lectura.cocientes.map((c) => ({
      id: c.id,
      nombre: c.nombre,
      criterio: c.criterio,
      valor: c.valor,
      cumple: c.cumple,
      representacion: REPRESENTACION_DE[c.id],
    })),
    fuente: citaDe(lectura.fuenteId),
  };
}
