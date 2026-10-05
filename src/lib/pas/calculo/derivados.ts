// ── Valores derivados de una prueba (Sprint PAS-18) ────────────────────────
//
// Cuatro de los protocolos nuevos NO producen el número que se registra: lo
// calculan a partir de varias medidas. El Rockport estima un VO2máx desde el
// tiempo, el pulso, el peso y la edad; el escalón de Harvard produce un índice
// desde la duración y los pulsos de recuperación; McGill compara tres tiempos
// entre sí; la Course-navette estima un VO2máx desde el estadio alcanzado y la
// edad.
//
// ── POR QUÉ ESTO ES UN MÓDULO Y NO UNA CUENTA EN EL FORMULARIO ────────────
//
//   Porque una fórmula metida en un componente es una fórmula que nadie
//   audita. Aquí cada ecuación va con la fuente de la que se copió, con sus
//   coeficientes tal como están impresos, y con lo que exige para poder
//   aplicarse.
//
//   Y porque el resultado tiene que poder NO existir. Si falta el peso, el
//   Rockport no da un VO2máx aproximado: no da ninguno. Devolver un número
//   con un dato inventado por defecto es el fallo que este proyecto lleva
//   dieciocho sprints evitando.
//
// ── LO QUE ESTE MÓDULO NO HACE ────────────────────────────────────────────
//
//   · No elige ecuación. El Rockport tiene tres publicadas y dan resultados
//     distintos; cuál se usó es una condición de registro que declara el
//     profesional, no una preferencia del sistema.
//   · No convierte unidades por su cuenta. Las ecuaciones 2 y 3 piden libras
//     porque así se publicaron; quien las use registra libras.
//   · No clasifica. Produce el número y ahí se para. Situarlo es trabajo de
//     la capa de evidencia, que para eso tiene cuatro tablas que no coinciden.
//
// Módulo puro: misma entrada, misma salida, siempre.

/** El derivado existe, o no existe y se dice exactamente qué falta. */
export type Derivado =
  | { hay: true; valor: number; unidad: string; formula: string; fuenteId: string }
  | { hay: false; faltan: readonly string[] };

/** Redondeo de presentación, a dos decimales. NO se usa para encadenar. */
const dos = (v: number): number => Math.round(v * 100) / 100;

function exigir(campos: Readonly<Record<string, number | null | undefined>>): string[] {
  return Object.entries(campos)
    .filter(([, v]) => v === null || v === undefined || !Number.isFinite(v))
    .map(([k]) => k);
}

// ════════════════════════════════════════════════════════════════════════════
// ROCKPORT · VO2máx estimado desde una caminata de una milla
// ════════════════════════════════════════════════════════════════════════════
//
// Las tres ecuaciones son las del documento de Lopategui, copiadas con sus
// coeficientes. La primera pide kilogramos; las otras dos, libras. La SEGUNDA
// NO USA LA EDAD, que es la diferencia más importante entre ellas y la razón
// de que el registro exija declarar cuál se aplicó.

export type EcuacionRockport = 'rockport_kg' | 'rockport_lb_sin_edad' | 'rockport_lb';

export interface EntradaRockport {
  ecuacion: EcuacionRockport;
  /** Masa corporal. En kg para la ecuación 1, en libras para las otras dos. */
  masa: number | null;
  edad: number | null;
  /** Tiempo en completar la milla, en MINUTOS decimales. */
  minutos: number | null;
  /** Frecuencia cardiaca al terminar, en latidos por minuto. */
  fcFinal: number | null;
  sexo: 'M' | 'F' | null;
}

export function vo2Rockport(e: EntradaRockport): Derivado {
  // El sexo entra en las tres ecuaciones como 0 o 1. No tiene valor por
  // defecto: sin él la ecuación no puede evaluarse, y suponer «varón» sumaría
  // entre 6,3 y 8,9 mL/kg/min a una mujer.
  const faltan = exigir({
    masa: e.masa,
    minutos: e.minutos,
    fcFinal: e.fcFinal,
    ...(e.ecuacion === 'rockport_lb_sin_edad' ? {} : { edad: e.edad }),
  });
  if (e.sexo === null) faltan.push('sexo');
  if (faltan.length > 0) return { hay: false, faltan };

  const G = e.sexo === 'M' ? 1 : 0;
  const MC = e.masa!;
  const T = e.minutos!;
  const FC = e.fcFinal!;
  const E = e.edad ?? 0;

  switch (e.ecuacion) {
    case 'rockport_kg':
      return {
        hay: true,
        valor: dos(132.6 - 0.17 * MC - 0.39 * E + 6.31 * G - 3.27 * T - 0.156 * FC),
        unidad: 'mL/kg/min',
        formula:
          '132,6 − (0,17 × masa kg) − (0,39 × edad) + (6,31 × sexo) − (3,27 × min) − (0,156 × FC)',
        fuenteId: 'rockport_kline_lopategui',
      };
    case 'rockport_lb_sin_edad':
      return {
        hay: true,
        valor: dos(88.768 - 0.0957 * MC + 8.892 * G - 1.4537 * T - 0.1194 * FC),
        unidad: 'mL/kg/min',
        formula: '88,768 − (0,0957 × masa lb) + (8,892 × sexo) − (1,4537 × min) − (0,1194 × FC)',
        fuenteId: 'rockport_kline_lopategui',
      };
    case 'rockport_lb':
      return {
        hay: true,
        valor: dos(132.85 - 0.0769 * MC - 0.3877 * E + 6.315 * G - 3.2649 * T - 0.1565 * FC),
        unidad: 'mL/kg/min',
        formula:
          '132,85 − (0,0769 × masa lb) − (0,3877 × edad) + (6,315 × sexo) − (3,2649 × min) − (0,1565 × FC)',
        fuenteId: 'rockport_kline_lopategui',
      };
  }
}

// ════════════════════════════════════════════════════════════════════════════
// ESCALÓN DE HARVARD · índice de aptitud cardiorrespiratoria
// ════════════════════════════════════════════════════════════════════════════
//
//   Largo = (duración en segundos × 100) / (2 × suma de los tres pulsos)
//   Corto = (duración en segundos × 100) / (5,5 × pulso del primer minuto)
//
// Cada método tiene SU tabla, y el mismo esfuerzo produce números en escalas
// distintas. Por eso el método es condición de registro y no un detalle.

export interface EntradaHarvard {
  metodo: 'largo' | 'corto';
  /** Duración real del ejercicio en SEGUNDOS. Si se detuvo antes, la que hubo. */
  segundos: number | null;
  /** Pulso contado durante 30 s tras el 1.º, 2.º y 3.er minuto de recuperación. */
  pulso1: number | null;
  pulso2: number | null;
  pulso3: number | null;
}

export function indiceHarvard(e: EntradaHarvard): Derivado {
  const necesarios =
    e.metodo === 'largo'
      ? { segundos: e.segundos, pulso1: e.pulso1, pulso2: e.pulso2, pulso3: e.pulso3 }
      : { segundos: e.segundos, pulso1: e.pulso1 };
  const faltan = exigir(necesarios);
  if (faltan.length > 0) return { hay: false, faltan };

  if (e.metodo === 'largo') {
    const suma = e.pulso1! + e.pulso2! + e.pulso3!;
    if (suma === 0) return { hay: false, faltan: ['pulsos mayores que cero'] };
    return {
      hay: true,
      valor: dos((e.segundos! * 100) / (2 * suma)),
      unidad: 'indice',
      formula: '(duración en s × 100) / (2 × suma de los tres pulsos de recuperación)',
      fuenteId: 'harvard_iac_lopategui',
    };
  }

  if (e.pulso1 === 0) return { hay: false, faltan: ['pulso mayor que cero'] };
  return {
    hay: true,
    valor: dos((e.segundos! * 100) / (5.5 * e.pulso1!)),
    unidad: 'indice',
    formula: '(duración en s × 100) / (5,5 × pulso del primer minuto)',
    fuenteId: 'harvard_iac_lopategui',
  };
}

// ════════════════════════════════════════════════════════════════════════════
// McGILL · los tres cocientes del tronco
// ════════════════════════════════════════════════════════════════════════════
//
// Es la única batería de las cinco cuyo resultado NO es un número por prueba
// sino la relación entre las tres. El manual publica un criterio para cada
// cociente y ninguna norma para los tiempos sueltos.
//
// El criterio se cumple o no se cumple, y eso es lo que se informa. NO se
// dice «bien» ni «mal»: se dice qué pedía el manual y si el cociente lo
// cumple, que es la misma disciplina que el resto del sistema.

export interface EntradaMcGill {
  /** Segundos aguantados en cada posición. */
  flexion: number | null;
  extension: number | null;
  lateralDerecho: number | null;
  lateralIzquierdo: number | null;
}

export interface CocienteMcGill {
  id: 'flexion_extension' | 'lateral_derecha_izquierda' | 'lateral_extension';
  nombre: string;
  /** El criterio, literal del manual. */
  criterio: string;
  valor: number;
  cumple: boolean;
}

export type LecturaMcGill =
  | { hay: true; cocientes: readonly CocienteMcGill[]; fuenteId: string }
  | { hay: false; faltan: readonly string[] };

export function cocientesMcGill(e: EntradaMcGill): LecturaMcGill {
  const faltan = exigir({
    flexion: e.flexion,
    extension: e.extension,
    lateralDerecho: e.lateralDerecho,
    lateralIzquierdo: e.lateralIzquierdo,
  });
  if (faltan.length > 0) return { hay: false, faltan };
  if (e.extension === 0 || e.lateralIzquierdo === 0) {
    return { hay: false, faltan: ['tiempos mayores que cero en extensión y puente izquierdo'] };
  }

  const flexExt = e.flexion! / e.extension!;
  const derIzq = e.lateralDerecho! / e.lateralIzquierdo!;
  // El manual pide que CADA lado, no su media, quede por debajo de 0,75
  // respecto a la extensión. Se toma el mayor de los dos: si el peor lado
  // cumple, cumplen los dos.
  const peorLateral = Math.max(e.lateralDerecho!, e.lateralIzquierdo!) / e.extension!;

  return {
    hay: true,
    fuenteId: 'mcgill_torso_ace_2015',
    cocientes: [
      {
        id: 'flexion_extension',
        nombre: 'Flexión : extensión',
        criterio: 'menor que 1,00',
        valor: dos(flexExt),
        cumple: flexExt < 1,
      },
      {
        id: 'lateral_derecha_izquierda',
        nombre: 'Puente derecho : puente izquierdo',
        criterio: 'a menos de 0,05 de 1,00',
        valor: dos(derIzq),
        cumple: Math.abs(derIzq - 1) <= 0.05,
      },
      {
        id: 'lateral_extension',
        nombre: 'Puente lateral : extensión',
        criterio: 'menor que 0,75',
        valor: dos(peorLateral),
        cumple: peorLateral < 0.75,
      },
    ],
  };
}

// ════════════════════════════════════════════════════════════════════════════
// COURSE-NAVETTE (LÉGER) · VO2máx estimado desde el estadio y la edad
// ════════════════════════════════════════════════════════════════════════════
//
// La ecuación es la de Léger, Mercier, Gadoury y Lambert (1988): se calibró
// entre 8 y 19 años, y usar la edad real de un adulto la extrapolaría fuera de
// donde se ajustó. Léger y Gadoury (1989) la revalidaron para adultos de 18 a
// 50 años manteniendo la edad FIJA EN 18 — no es una decisión de este
// sistema, es la misma corrección que hizo el autor de la ecuación.

export interface EntradaLeger {
  /** Estadios completados en la Course-navette (P-07). */
  estadios: number | null;
  edad: number | null;
}

export function vo2Leger(e: EntradaLeger): Derivado {
  const faltan = exigir({ estadios: e.estadios, edad: e.edad });
  if (faltan.length > 0) return { hay: false, faltan };

  const velocidad = 8 + 0.5 * e.estadios!;
  // Tope en 18: por debajo, la ecuación sigue calibrada con la edad real.
  const edadEcuacion = Math.min(e.edad!, 18);

  return {
    hay: true,
    valor: dos(31.025 + 3.238 * velocidad - 3.248 * edadEcuacion + 0.1536 * velocidad * edadEcuacion),
    unidad: 'mL/kg/min',
    formula:
      '31,025 + (3,238 × velocidad) − (3,248 × edad*) + (0,1536 × velocidad × edad*); velocidad ' +
      '= 8 + 0,5 × estadio; *edad tope 18 años para cualquier edad mayor',
    fuenteId: 'leger_1988_20msr',
  };
}
