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

// ── Población general · Sprint PAS-18 ───────────────────────────────────────
//
// Los vocabularios salen de los cinco protocolos aportados, igual que los once
// anteriores salían de la fila «Factores que alteran» de la PKB. Cuando un
// documento nombra un factor sin enumerar sus valores, el campo NO se crea.

/** Rockport. La ecuación no es un detalle de cálculo: es parte del método. */
const P12: CondicionesDePrueba = {
  pruebaId: 'P-12',
  requeridas: [
    {
      clave: 'ecuacion',
      etiqueta: 'Ecuación de estimación',
      vocabulario: ['rockport_kg', 'rockport_lb_sin_edad', 'rockport_lb'],
      etiquetas: et(
        ['rockport_kg', 'Ecuación 1 · con masa en kg y edad'],
        ['rockport_lb_sin_edad', 'Ecuación 2 · con masa en libras, sin edad'],
        ['rockport_lb', 'Ecuación 3 · con masa en libras y edad'],
      ),
      porQue:
        'El documento publica TRES ecuaciones de regresión distintas para el mismo paseo, y dan ' +
        'resultados distintos: la segunda ni siquiera usa la edad. Sin saber cuál se aplicó, el ' +
        'VO2máx registrado no es comparable ni consigo mismo en otra fecha.',
    },
  ],
  opcionales: [
    {
      clave: 'superficie',
      etiqueta: 'Superficie',
      vocabulario: ['pista', 'asfalto', 'cinta'],
      etiquetas: et(['pista', 'Pista atlética'], ['asfalto', 'Asfalto o cemento'], ['cinta', 'Cinta rodante']),
      porQue: 'La ecuación se validó caminando sobre suelo firme y llano.',
    },
  ],
};

/** Escalón de Harvard. Altura, cadencia y método de cálculo. */
const P13: CondicionesDePrueba = {
  pruebaId: 'P-13',
  requeridas: [
    {
      clave: 'metodo',
      etiqueta: 'Método de cálculo del índice',
      vocabulario: ['largo', 'corto'],
      etiquetas: et(
        ['largo', 'Largo · suma de los tres pulsos de recuperación'],
        ['corto', 'Corto · solo el pulso del primer minuto'],
      ),
      porQue:
        'Los dos métodos producen números en escalas distintas y el documento publica UNA TABLA ' +
        'PARA CADA UNO. Un índice de 70 es «Promedio» con el método largo y «Bueno» con el corto.',
    },
    {
      clave: 'altura_escalon',
      etiqueta: 'Altura del escalón',
      vocabulario: ['20_pulgadas', '18_pulgadas', 'otra'],
      etiquetas: et(
        ['20_pulgadas', '20 pulgadas (protocolo de varones)'],
        ['18_pulgadas', '18 pulgadas (protocolo de mujeres)'],
        ['otra', 'Otra altura'],
      ),
      porQue:
        'El protocolo fija alturas y cadencias distintas por sexo. Subir a un escalón más bajo ' +
        'es menos trabajo y produce una recuperación más rápida con la misma aptitud.',
    },
  ],
  opcionales: [],
};

/**
 * Las siete del Senior Fitness Test comparten condición: la batería vale como
 * conjunto y su tabla se publicó midiendo con SU material. Lo que cambia el
 * resultado en las tres primeras es el peso de la mancuerna y la altura de la
 * silla; en las de flexibilidad, dónde se pone el cero.
 */
const sft = (pruebaId: string, extra: CondicionPrueba[] = []): CondicionesDePrueba => ({
  pruebaId,
  requeridas: [
    {
      clave: 'protocolo',
      etiqueta: 'Protocolo',
      vocabulario: ['rikli_jones', 'adaptado'],
      etiquetas: et(
        ['rikli_jones', 'Rikli y Jones, sin modificar'],
        ['adaptado', 'Adaptado (silla, material o tiempo distintos)'],
      ),
      porQue:
        'El intervalo normal publicado describe a quien hizo la prueba EXACTAMENTE como está ' +
        'descrita. Una silla más alta o una mancuerna más ligera cambian el número y la tabla ' +
        'deja de aplicar.',
    },
  ],
  opcionales: extra,
});

const P14 = sft('P-14', [
  {
    clave: 'altura_silla',
    etiqueta: 'Altura del asiento',
    vocabulario: ['43_cm', 'otra'],
    etiquetas: et(['43_cm', '43 cm (17 pulgadas), la del protocolo'], ['otra', 'Otra altura']),
    porQue: 'Cuanto más bajo el asiento, más recorrido y menos repeticiones con la misma fuerza.',
  },
]);
const P15 = sft('P-15', [
  {
    clave: 'mancuerna',
    etiqueta: 'Peso de la mancuerna',
    vocabulario: ['5_lb', '8_lb', 'otro'],
    etiquetas: et(['5_lb', '5 libras (mujeres)'], ['8_lb', '8 libras (varones)'], ['otro', 'Otro peso']),
    porQue: 'El protocolo fija 5 lb en mujeres y 8 lb en varones. Con otro peso la tabla no aplica.',
  },
]);
const P16 = sft('P-16');
const P17 = sft('P-17');
const P18 = sft('P-18', [
  {
    clave: 'punto_cero',
    etiqueta: 'Dónde está el cero',
    vocabulario: ['punta_zapato', 'otro'],
    etiquetas: et(['punta_zapato', 'La punta del zapato = 0'], ['otro', 'Otra referencia']),
    porQue:
      'La tabla se construyó midiendo desde la punta del zapato, con negativos si no se llega. ' +
      'Es el mismo hallazgo que destapó el sit-and-reach: el cero cambia el número entero.',
  },
]);
const P19 = sft('P-19');
const P20 = sft('P-20');

/** McGill. Lo que altera los tres tiempos es cómo se sujeta al cliente. */
const mcgill = (pruebaId: string): CondicionesDePrueba => ({
  pruebaId,
  requeridas: [
    {
      clave: 'sujecion',
      etiqueta: 'Sujeción',
      vocabulario: ['correa', 'manual', 'ninguna'],
      etiquetas: et(
        ['correa', 'Correa'],
        ['manual', 'Sujeción manual del evaluador'],
        ['ninguna', 'Sin sujeción'],
      ),
      porQue:
        'El protocolo de ACE admite anclar con correa o sujetar a mano, y una sujeción firme ' +
        'permite aguantar más tiempo. Los tres cocientes de la batería solo tienen sentido si ' +
        'las tres pruebas se sujetaron igual.',
    },
  ],
  opcionales: [],
});
const P21 = mcgill('P-21');
// El puente lateral se hace a cada lado por separado, y a diferencia de la
// flexión y la extensión del tronco (P-21, P-23), aquí SÍ hace falta saber
// cuál: el cociente que compara ambos lados (`calculo/derivados.ts`,
// `cocientesMcGill`) necesita el tiempo derecho y el izquierdo por separado,
// y sin esta condición dos registros de «puente lateral» serían
// indistinguibles el uno del otro.
const P22: CondicionesDePrueba = {
  ...mcgill('P-22'),
  requeridas: [
    ...mcgill('P-22').requeridas,
    {
      clave: 'lado',
      etiqueta: 'Lado evaluado',
      vocabulario: ['derecho', 'izquierdo'],
      etiquetas: et(['derecho', 'Puente lateral derecho'], ['izquierdo', 'Puente lateral izquierdo']),
      porQue:
        'El manual de ACE compara el lado derecho contra el izquierdo, y sin declarar cuál se ' +
        'registró no puede saberse qué mitad del cociente es esta medición.',
    },
  ],
};
const P23 = mcgill('P-23');

/**
 * Las 7 pruebas sueltas del FMS (P-24 a P-30) comparten el mismo factor que ya
 * declara P-09: quién puntúa altera el resultado tanto como qué se puntúa.
 * Las 5 que se hacen a cada lado añaden, encima, la condición que distingue
 * cuál es cuál — igual que el puente lateral de McGill: sin ella, la
 * puntuación final de la prueba (la del lado más bajo) no se podría componer.
 */
const fms = (pruebaId: string): CondicionesDePrueba => ({
  pruebaId,
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
        'Es la misma razón que ya declara P-09 para la puntuación compuesta, aplicada a cada ' +
        'movimiento por separado: la fiabilidad interevaluador varía ampliamente según la ' +
        'formación de quien puntúa.',
    },
  ],
  opcionales: [],
});
const fmsBilateral = (pruebaId: string): CondicionesDePrueba => ({
  ...fms(pruebaId),
  requeridas: [
    ...fms(pruebaId).requeridas,
    {
      clave: 'lado',
      etiqueta: 'Lado evaluado',
      vocabulario: ['derecho', 'izquierdo'],
      etiquetas: et(['derecho', 'Lado derecho'], ['izquierdo', 'Lado izquierdo']),
      porQue:
        'El protocolo puntúa cada lado por separado y toma el más bajo como resultado de la ' +
        'prueba: sin declarar cuál es este registro, dos mediciones del mismo atleta serían ' +
        'indistinguibles.',
    },
  ],
});
const P24 = fms('P-24');
const P25 = fmsBilateral('P-25');
const P26 = fmsBilateral('P-26');
const P27 = fmsBilateral('P-27');
const P28 = fmsBilateral('P-28');
const P29 = fms('P-29');
const P30 = fmsBilateral('P-30');

export const CONDICIONES: readonly CondicionesDePrueba[] = [
  P01, P02, P03, P04, P05, P06, P07, P08, P09, P10, P11,
  P12, P13, P14, P15, P16, P17, P18, P19, P20, P21, P22, P23,
  P24, P25, P26, P27, P28, P29, P30,
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
