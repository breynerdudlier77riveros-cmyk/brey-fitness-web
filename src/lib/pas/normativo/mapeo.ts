// ── Catálogo de correspondencia prueba → variable normativa (PRS v2.0) ─────
//
// Declarativo y **cerrado**. Una prueba que no esté aquí no se consulta contra
// la NKB, y el informe lo dice: «norma no disponible». Es la respuesta honesta
// mientras la NKB solo contenga una variable.
//
// El vocabulario también es cerrado. Traduce el texto que el evaluador declaró
// en `condiciones` al identificador del NIE; lo que no esté declarado se
// entrega como falta de información. **Nunca hay valor por defecto**: suponer
// que «si no dice nada, se midió de pie» es exactamente el error que la NKB
// detectó en sus propias fichas alemanas (`39`, hallazgo H-01).

import type { MapeoNormativo } from './tipos';

/**
 * Hoy la NKB solo admite una variable: fuerza de prensión manual. Las otras
 * diecinueve capacidades del PAS no tienen norma admisible, y eso no es una
 * carencia de este mapeo sino el estado real de la evidencia (`41`).
 */
export const MAPEOS: readonly MapeoNormativo[] = [
  {
    pruebaId: 'HGS-01',
    variable: 'fuerza_prension_manual',
    claves: {
      instrumento: 'dinamometro',
      definicionOperacional: 'consolidacion',
      posicion: 'posicion',
      lado: 'mano',
    },
    vocabulario: {
      instrumento: {
        'takei-tkk-5101': 'takei-tkk-5101',
        'takei-t18': 'takei-t18-tkk-smedley-iii',
        'camry-digital': 'camry-digital',
        'jamar-j00105': 'jamar-j00105',
        'jamar-pc-5030-j1': 'jamar-pc-5030-j1',
        'smedley-s': 'smedley-s',
      },
      definicionOperacional: {
        media_ambas_manos: 'media_ambas_manos',
        maximo_ambas_manos: 'maximo_ambas_manos',
        mejor_mano_derecha: 'mejor_mano_derecha',
        mejor_mano_izquierda: 'mejor_mano_izquierda',
        mejor_mano_dominante: 'mejor_mano_dominante',
        mejor_mano_no_dominante: 'mejor_mano_no_dominante',
        media_2a_y_3a_mano_dominante: 'media_2a_y_3a_mano_dominante',
      },
      posicion: {
        bipedestacion: 'bipedestacion',
        sedestacion: 'sedestacion',
      },
      lado: {
        derecha: 'derecha',
        izquierda: 'izquierda',
        dominante: 'dominante',
        no_dominante: 'no_dominante',
        ambas: 'ambas',
      },
    },
    unidades: { kg: 'kg', kgf: 'kgf', lbf: 'lbf' },
  },
];

/** El mapeo de una prueba, o `null` si el catálogo no la declara. */
export function mapeoDe(pruebaId: string): MapeoNormativo | null {
  return MAPEOS.find((m) => m.pruebaId === pruebaId) ?? null;
}
