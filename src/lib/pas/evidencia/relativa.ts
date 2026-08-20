// ── Fuerza relativa (Sprint PAS-12 §9) ─────────────────────────────────────
//
// LA DISTINCIÓN QUE ESTE MÓDULO EXISTE PARA MANTENER:
//
//   FUERZA RELATIVA DESCRIPTIVA   →  120 kg ÷ 66 kg = 1,82
//   CLASIFICACIÓN DE FUERZA RELATIVA →  «avanzado», «élite», «P90»
//
//   La primera es una división y puede hacerse siempre que existan los dos
//   números. La segunda necesita una fuente que publique esas categorías para
//   una población compatible, y **hoy no existe ninguna admitida**.
//
//   Por eso `clasificacion` es del tipo `null` y no `string | null`: no es que
//   esté vacía, es que este módulo no puede producirla. El día que se admita
//   una fuente con categorías, será esa fuente quien las traiga.
//
// EL PESO TIENE QUE SER EL DE LA EVALUACIÓN.
//
//   Un atleta pesa 65 kg en enero y 68 en agosto. Usar el peso de agosto para
//   interpretar la medición de enero produce una fuerza relativa falsa, y falsa
//   de la peor manera: plausible. Por eso la masa corporal viaja con la
//   evaluación y no con el atleta (G-01).
//
// Módulo puro.

/** Las pruebas cuya literatura expresa el resultado en relación con el peso. */
const RELATIVIZABLES: Readonly<Record<string, { unidad: string; expresion: string }>> = {
  // El 1RM se publica habitualmente como razón carga ÷ masa corporal.
  'P-01': { unidad: 'kg', expresion: '× peso corporal' },
  // La práctica recomendada del IMTP es informar el pico de fuerza en N/kg.
  'P-02': { unidad: 'N', expresion: 'N/kg' },
};

export type MotivoSinRelativa =
  | 'PRUEBA_NO_RELATIVIZABLE'
  | 'SIN_MASA_CORPORAL'
  | 'UNIDAD_INCOMPATIBLE'
  | 'MASA_NO_VALIDA';

export type FuerzaRelativa =
  | {
      calculable: true;
      ratio: number;
      /** Cómo se lee el número: `× peso corporal` o `N/kg`. */
      expresion: string;
      /**
       * SIEMPRE `null`, y por tipo.
       *
       * No existe ninguna fuente admitida que publique categorías de fuerza
       * relativa para una población compatible. Mientras no la haya, este
       * campo no puede tomar otro valor — y si algún día la hay, la traerá la
       * fuente, no este módulo.
       */
      clasificacion: null;
      /** Qué se puede y qué no se puede decir de este número. */
      nota: string;
    }
  | { calculable: false; motivo: MotivoSinRelativa; detalle: string };

const DETALLE: Readonly<Record<MotivoSinRelativa, string>> = {
  PRUEBA_NO_RELATIVIZABLE:
    'La literatura de esta prueba no expresa el resultado en relación con la masa corporal, así ' +
    'que dividir por el peso produciría un número sin significado publicado.',
  SIN_MASA_CORPORAL:
    'Esta evaluación no registra la masa corporal del atleta. No se usa la de otra fecha: el peso ' +
    'cambia entre evaluaciones, y aplicar el de hoy a una medición de hace meses daría una ' +
    'relación falsa con aspecto de correcta.',
  UNIDAD_INCOMPATIBLE:
    'El resultado no está en la unidad en la que la literatura expresa esta relación, y no hay ' +
    'conversión autorizada.',
  MASA_NO_VALIDA: 'La masa corporal registrada no es un valor utilizable.',
};

const NOTA =
  'Es una relación calculada, no una posición. No existe una referencia compatible que publique ' +
  'categorías de fuerza relativa, así que este número no sitúa el resultado respecto a ninguna ' +
  'población ni corresponde a ningún nivel.';

const sin = (motivo: MotivoSinRelativa): FuerzaRelativa => ({
  calculable: false,
  motivo,
  detalle: DETALLE[motivo],
});

/**
 * La relación entre el resultado y la masa corporal de ESA evaluación.
 *
 * `pesoKg` debe proceder de la propia evaluación. Pasar aquí el peso actual del
 * atleta para una medición antigua es el error que G-01 describe, y ningún
 * tipo puede impedirlo: solo puede impedirlo quien construya la llamada.
 */
export function calcularRelativa(
  pruebaId: string,
  valor: number,
  unidad: string,
  pesoKg: number | null,
): FuerzaRelativa {
  const decl = RELATIVIZABLES[pruebaId];
  if (!decl) return sin('PRUEBA_NO_RELATIVIZABLE');
  if (unidad !== decl.unidad) return sin('UNIDAD_INCOMPATIBLE');
  if (pesoKg === null) return sin('SIN_MASA_CORPORAL');
  if (!(pesoKg > 0)) return sin('MASA_NO_VALIDA');

  return {
    calculable: true,
    ratio: valor / pesoKg,
    expresion: decl.expresion,
    clasificacion: null,
    nota: NOTA,
  };
}

/** Si una prueba admite lectura relativa. Para decidir si preguntar el peso. */
export function admiteRelativa(pruebaId: string): boolean {
  return pruebaId in RELATIVIZABLES;
}
