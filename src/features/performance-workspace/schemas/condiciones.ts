// ── Condiciones de medición por prueba (Sprint PAS-10E §15) ────────────────
//
// EL PROBLEMA QUE ESTE FICHERO RESUELVE:
//
//   Hasta ahora solo `P-03` declaraba cómo se había medido, porque el bloque de
//   método del formulario se renderizaba bajo `mapeo ? …` y solo esa prueba
//   tenía mapeo normativo. Para las otras diez, `condiciones` se guardaba vacío.
//
//   Consecuencia doble y silenciosa: la regla de compatibilidad no podía
//   evaluarse —no constaba con qué instrumento ni con qué protocolo se midió— y
//   la serie longitudinal de PAS-10 nunca detectaba un cambio de método, porque
//   comparaba diccionarios que siempre estaban vacíos.
//
// DE DÓNDE SALEN ESTOS VOCABULARIOS, QUE NO ES DE NINGUNA INTUICIÓN:
//
//   De la fila «Factores que alteran» de cada ficha de
//   `docs/performance-knowledge-base/02-pruebas.md`. La PKB ya documenta, para
//   cada prueba, qué cambia el resultado; aquí solo se convierte esa lista en
//   campos registrables. Cuando la PKB nombra un factor sin enumerar sus
//   valores —«superficie», «motivación»— el campo NO se crea: inventar su
//   vocabulario sería inventar la variable.
//
// REQUERIDA no significa «obligatoria para guardar». El registro se guarda
// igual. Significa que **sin ella no puede haber comparación**, ni normativa ni
// longitudinal, y el sistema lo dirá en vez de comparar a ciegas.

/** Un campo de método, con su vocabulario cerrado. */
export interface CondicionPrueba {
  /** Clave con la que se guarda en `RegistroWorkspace.condiciones`. */
  clave: string;
  etiqueta: string;
  /**
   * Valores admitidos. **Cerrado a propósito**: un campo de texto libre
   * produciría veinte formas de escribir «fotocélulas» y ninguna comparable
   * con las demás.
   */
  vocabulario: readonly string[];
  /** Texto que ve el profesional para cada valor. */
  etiquetas: Readonly<Record<string, string>>;
  /** Por qué este campo altera el resultado. Se muestra como ayuda. */
  porQue: string;
}

export interface CondicionesDePrueba {
  pruebaId: string;
  /**
   * Sin estas condiciones no hay comparabilidad posible.
   *
   * Son las que distinguen protocolos que la literatura trata como pruebas
   * DISTINTAS: un 505 modificado no es un Illinois, y un esprint de 10 m no es
   * uno de 30 m.
   */
  requeridas: readonly CondicionPrueba[];
  /** Afinan la comparación, pero su ausencia no la impide. */
  opcionales: readonly CondicionPrueba[];
}

const et = (...pares: [string, string][]): Readonly<Record<string, string>> =>
  Object.fromEntries(pares);

// ── P-01 · 1RM ──────────────────────────────────────────────────────────────

const P01: CondicionesDePrueba = {
  pruebaId: 'P-01',
  requeridas: [
    {
      clave: 'determinacion',
      etiqueta: 'Cómo se determinó',
      vocabulario: ['medido_directo', 'estimado_submaximo'],
      etiquetas: et(
        ['medido_directo', 'Medido: intento máximo real'],
        ['estimado_submaximo', 'Estimado desde repeticiones submáximas'],
      ),
      porQue:
        'La PKB registra como error frecuente estimar el 1RM desde repeticiones submáximas y ' +
        'tratarlo después como medido. Son dos valores distintos y no se comparan entre sí.',
    },
  ],
  opcionales: [
    {
      clave: 'familiarizacion',
      etiqueta: 'Familiarización previa',
      vocabulario: ['si', 'no'],
      etiquetas: et(['si', 'Sí, hubo sesión previa'], ['no', 'No hubo']),
      porQue:
        'Los primeros aumentos de un 1RM pueden ser aprendizaje técnico y no fuerza. La ' +
        'fiabilidad publicada es alta con y sin familiarización, pero el dato importa al leer ' +
        'la evolución.',
    },
  ],
};

// ── P-02 · IMTP ─────────────────────────────────────────────────────────────

const P02: CondicionesDePrueba = {
  pruebaId: 'P-02',
  requeridas: [
    {
      clave: 'formato',
      etiqueta: 'Formato',
      vocabulario: ['bilateral', 'unilateral'],
      etiquetas: et(['bilateral', 'Bilateral'], ['unilateral', 'Unilateral']),
      porQue: 'La fiabilidad se publica por separado para cada formato y los valores no son equivalentes.',
    },
  ],
  opcionales: [
    {
      clave: 'instrumento',
      etiqueta: 'Instrumento',
      vocabulario: ['celula_carga', 'plataforma_fuerza'],
      etiquetas: et(['celula_carga', 'Célula de carga'], ['plataforma_fuerza', 'Plataforma de fuerza']),
      porQue:
        'La PKB registra la célula de carga y la tasa de muestreo entre los factores que alteran ' +
        'el resultado, y la literatura de estandarización lo confirma.',
    },
  ],
};

// ── P-03 · Dinamometría de agarre ───────────────────────────────────────────
//
// Las cuatro condiciones de esta prueba YA existen, declaradas por el mapeo
// normativo (`src/lib/pas/normativo/mapeo.ts`), y son la única fuente válida:
// su vocabulario tiene que coincidir con el del NIE. Aquí se declaran las
// claves para que el formulario las trate igual que las demás, pero el
// vocabulario sigue viniendo del mapeo y este fichero NO lo duplica.

const P03: CondicionesDePrueba = {
  pruebaId: 'P-03',
  requeridas: [],
  opcionales: [],
};

// ── P-04 · CMJ ──────────────────────────────────────────────────────────────

const P04: CondicionesDePrueba = {
  pruebaId: 'P-04',
  requeridas: [
    {
      clave: 'metodo_calculo',
      etiqueta: 'Método de cálculo',
      vocabulario: ['tiempo_vuelo', 'impulso_momento'],
      etiquetas: et(
        ['tiempo_vuelo', 'Tiempo de vuelo'],
        ['impulso_momento', 'Impulso-momento'],
      ),
      porQue:
        'La PKB lo dice con todas las letras: el método de cálculo cambia el número, y dos ' +
        'sistemas no son intercambiables sin comprobarlo.',
    },
    {
      clave: 'brazos',
      etiqueta: 'Uso de brazos',
      vocabulario: ['libres', 'en_cadera'],
      etiquetas: et(['libres', 'Brazos libres'], ['en_cadera', 'Manos en la cadera']),
      porQue: 'El impulso de brazos añade altura sin cambiar la capacidad del tren inferior.',
    },
  ],
  opcionales: [
    {
      clave: 'dispositivo',
      etiqueta: 'Dispositivo',
      vocabulario: ['plataforma_fuerza', 'alfombra_contacto', 'video'],
      etiquetas: et(
        ['plataforma_fuerza', 'Plataforma de fuerza'],
        ['alfombra_contacto', 'Alfombra de contacto'],
        ['video', 'Análisis de vídeo'],
      ),
      porQue:
        'Los tres dan medias equivalentes en la literatura, pero con diferencias sistemáticas ' +
        'pequeñas entre aparatos. Cambiar de dispositivo entre evaluaciones parte la serie.',
    },
  ],
};

// ── P-05 · Drop jump · RSI ──────────────────────────────────────────────────

const P05: CondicionesDePrueba = {
  pruebaId: 'P-05',
  requeridas: [
    {
      clave: 'altura_caida_cm',
      etiqueta: 'Altura de caída',
      vocabulario: ['20', '30', '40', '50', '60'],
      etiquetas: et(
        ['20', '20 cm'], ['30', '30 cm'], ['40', '40 cm'], ['50', '50 cm'], ['60', '60 cm'],
      ),
      porQue:
        'El RSI depende de la altura de caída. Comparar un drop jump de 30 cm con uno de 50 cm ' +
        'no describe un cambio del atleta.',
    },
    {
      clave: 'instruccion',
      etiqueta: 'Instrucción dada',
      vocabulario: ['maxima_altura', 'minimo_contacto'],
      etiquetas: et(
        ['maxima_altura', '«Salta lo más alto posible»'],
        ['minimo_contacto', '«Minimiza el tiempo de contacto»'],
      ),
      porQue: 'La PKB registra las dos instrucciones como factores que alteran el resultado.',
    },
  ],
  opcionales: [],
};

// ── P-06 · Sit-and-reach ────────────────────────────────────────────────────

const P06: CondicionesDePrueba = {
  pruebaId: 'P-06',
  requeridas: [
    {
      clave: 'version',
      etiqueta: 'Versión de la prueba',
      vocabulario: ['clasico', 'back_saver', 'modificado', 'sin_cajon'],
      etiquetas: et(
        ['clasico', 'Clásico (cajón estándar)'],
        ['back_saver', 'Back-saver (una pierna)'],
        ['modificado', 'Modificado'],
        ['sin_cajon', 'Sin cajón'],
      ),
      porQue:
        'La PKB registra como error frecuente comparar entre versiones distintas de la prueba. ' +
        'Cada versión tiene su propia escala y su propia literatura.',
    },
  ],
  opcionales: [
    {
      clave: 'punto_cero',
      etiqueta: 'Dónde está el cero de la regla',
      vocabulario: ['toque_dedos_26cm', 'toque_dedos_0cm', 'otro'],
      etiquetas: et(
        ['toque_dedos_26cm', 'Tocar los dedos = 26 cm'],
        ['toque_dedos_0cm', 'Tocar los dedos = 0 cm'],
        ['otro', 'Otra calibración'],
      ),
      porQue:
        'Hallazgo de PAS-11: la calibración del cero cambia el número por completo. Un alcance de ' +
        '24 cm es casi tocar los dedos en un cajón calibrado a 26, y un estiramiento enorme en ' +
        'uno calibrado a 0. Sin este dato, dos protocolos incomparables parecen el mismo.',
    },
    {
      clave: 'calentamiento',
      etiqueta: 'Calentamiento previo',
      vocabulario: ['si', 'no'],
      etiquetas: et(['si', 'Sí'], ['no', 'No']),
      porQue: 'La temperatura y el calentamiento previo alteran el alcance.',
    },
  ],
};

// ── P-07 · Course-navette ───────────────────────────────────────────────────

const P07: CondicionesDePrueba = {
  pruebaId: 'P-07',
  requeridas: [
    {
      clave: 'ecuacion',
      etiqueta: 'Ecuación de estimación',
      vocabulario: ['leger_1988', 'sin_estimar', 'otra'],
      etiquetas: et(
        ['leger_1988', 'Léger (1988)'],
        ['sin_estimar', 'No se estimó VO₂: solo estadios'],
        ['otra', 'Otra ecuación'],
      ),
      porQue:
        'La PKB lo declara prohibido: presentar un VO₂máx estimado sin declarar la ecuación ' +
        'empleada. Ecuaciones distintas dan números distintos sobre el mismo esfuerzo.',
    },
  ],
  opcionales: [
    {
      clave: 'altitud',
      etiqueta: 'Altitud del lugar',
      vocabulario: ['nivel_mar', 'altitud_moderada', 'altitud_alta'],
      etiquetas: et(
        ['nivel_mar', 'Nivel del mar (< 1000 m)'],
        ['altitud_moderada', 'Altitud moderada (1000-2500 m)'],
        ['altitud_alta', 'Altitud alta (> 2500 m)'],
      ),
      porQue:
        'La referencia colombiana disponible se recogió en Bogotá, a 2625 m, y publica valores ' +
        'ajustados por altitud precisamente porque cambia el resultado.',
    },
  ],
};

// ── P-08 · Y-Balance ────────────────────────────────────────────────────────

const P08: CondicionesDePrueba = {
  pruebaId: 'P-08',
  requeridas: [
    {
      clave: 'direccion',
      etiqueta: 'Dirección del alcance',
      vocabulario: ['anterior', 'posteromedial', 'posterolateral', 'compuesto'],
      etiquetas: et(
        ['anterior', 'Anterior'],
        ['posteromedial', 'Posteromedial'],
        ['posterolateral', 'Posterolateral'],
        ['compuesto', 'Puntuación compuesta'],
      ),
      porQue:
        'La literatura interpreta cada dirección por separado y la compuesta aparte. Un número ' +
        'sin dirección no puede compararse con ninguna referencia.',
    },
    {
      clave: 'lado',
      etiqueta: 'Lado evaluado',
      vocabulario: ['derecho', 'izquierdo'],
      etiquetas: et(['derecho', 'Pierna derecha'], ['izquierdo', 'Pierna izquierda']),
      porQue:
        'La variable con más respaldo en esta prueba es la ASIMETRÍA entre lados, y sin saber ' +
        'qué pierna se midió no puede calcularse.',
    },
    {
      clave: 'normalizado',
      etiqueta: 'Normalización',
      vocabulario: ['porcentaje_longitud_pierna', 'centimetros_absolutos'],
      etiquetas: et(
        ['porcentaje_longitud_pierna', '% de longitud de pierna'],
        ['centimetros_absolutos', 'Centímetros absolutos'],
      ),
      porQue:
        'La PKB registra que la longitud de pierna obliga a normalizar. Los valores absolutos y ' +
        'los normalizados no son la misma variable.',
    },
  ],
  opcionales: [],
};

// ── P-09 · FMS ──────────────────────────────────────────────────────────────

const P09: CondicionesDePrueba = {
  pruebaId: 'P-09',
  requeridas: [
    {
      clave: 'formacion_evaluador',
      etiqueta: 'Formación del evaluador',
      vocabulario: ['certificado', 'entrenado', 'sin_formacion_especifica'],
      etiquetas: et(
        ['certificado', 'Certificado en FMS'],
        ['entrenado', 'Con formación previa'],
        ['sin_formacion_especifica', 'Sin formación específica'],
      ),
      porQue:
        'Es la única prueba del catálogo cuyo error de medida es principalmente humano: la ' +
        'fiabilidad interevaluador publicada varía ampliamente según la formación de quien puntúa.',
    },
  ],
  opcionales: [],
};

// ── P-10 · Cambio de dirección ──────────────────────────────────────────────

const P10: CondicionesDePrueba = {
  pruebaId: 'P-10',
  requeridas: [
    {
      clave: 'protocolo',
      etiqueta: 'Protocolo',
      vocabulario: ['505', '505_modificado', 't_test', 'illinois'],
      etiquetas: et(
        ['505', '5-0-5 clásico'],
        ['505_modificado', '5-0-5 modificado'],
        ['t_test', 'T-test'],
        ['illinois', 'Illinois'],
      ),
      porQue:
        'El catálogo agrupa tres pruebas bajo un identificador, y su evidencia es específica de ' +
        'cada protocolo. Sin este dato ninguna referencia puede adjuntarse al registro.',
    },
    {
      clave: 'cronometraje',
      etiqueta: 'Cronometraje',
      vocabulario: ['fotocelulas', 'manual'],
      etiquetas: et(['fotocelulas', 'Fotocélulas'], ['manual', 'Cronómetro manual']),
      porQue:
        'La PKB registra el sistema de cronometraje entre los factores que alteran el resultado. ' +
        'Un tiempo manual y uno con fotocélulas no son comparables.',
    },
  ],
  opcionales: [],
};

// ── P-11 · Esprint lineal ───────────────────────────────────────────────────

const P11: CondicionesDePrueba = {
  pruebaId: 'P-11',
  requeridas: [
    {
      clave: 'distancia_m',
      etiqueta: 'Distancia',
      vocabulario: ['5', '10', '20', '30', '40'],
      etiquetas: et(['5', '5 m'], ['10', '10 m'], ['20', '20 m'], ['30', '30 m'], ['40', '40 m']),
      porQue:
        'El catálogo no declara la distancia y los tiempos de 10 m y de 30 m no son la misma ' +
        'variable. Es el dato que convierte «esprint» en una prueba concreta.',
    },
    {
      clave: 'cronometraje',
      etiqueta: 'Cronometraje',
      vocabulario: ['fotocelulas', 'manual'],
      etiquetas: et(['fotocelulas', 'Fotocélulas'], ['manual', 'Cronómetro manual']),
      porQue:
        'La PKB registra como error frecuente comparar tiempos entre sistemas de cronometraje ' +
        'distintos.',
    },
  ],
  opcionales: [
    {
      clave: 'salida',
      etiqueta: 'Posición de salida',
      vocabulario: ['parado', 'lanzado'],
      etiquetas: et(['parado', 'Salida parada'], ['lanzado', 'Salida lanzada']),
      porQue: 'La posición de salida y la distancia de activación alteran el tiempo registrado.',
    },
  ],
};

export const CONDICIONES: readonly CondicionesDePrueba[] = [
  P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11,
];

/** Las condiciones declaradas de una prueba. `null` si no está en el catálogo. */
export function condicionesDe(pruebaId: string): CondicionesDePrueba | null {
  return CONDICIONES.find((c) => c.pruebaId === pruebaId) ?? null;
}

/**
 * Qué condiciones requeridas faltan en un registro.
 *
 * Devuelve las CLAVES, no un booleano: quien lo consuma tiene que poder decir
 * cuál falta, no solo que algo falta. «Falta declarar el protocolo» es
 * accionable; «datos incompletos» no lo es.
 */
export function requeridasAusentes(
  pruebaId: string,
  condiciones: Readonly<Record<string, string>>,
): readonly string[] {
  const decl = condicionesDe(pruebaId);
  if (decl === null) return [];
  return decl.requeridas
    .filter((c) => {
      const v = condiciones[c.clave];
      return typeof v !== 'string' || v === '';
    })
    .map((c) => c.clave);
}
