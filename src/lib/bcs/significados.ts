// ── Qué es cada variable, y qué se puede leer de ella (Sprint BCS-8.0) ─────
//
// EL HUECO QUE CIERRA:
//
//   El informe enseñaba «Proteína corporal · 12,3 kg» y nada más. La cifra
//   sola no informa a nadie que no sepa ya qué es la proteína corporal, cuánta
//   es mucha, o por qué el sistema no le pone una etiqueta.
//
//   Los analizadores comerciales resuelven esto con un panel por variable: qué
//   es, dónde cae, cómo ha evolucionado. Lo que este módulo aporta es la
//   primera parte —qué es y qué puede leerse— con la diferencia de que aquí
//   cada afirmación viene de un sitio citable.
//
// ── DE DÓNDE SALE CADA CAMPO, Y POR QUÉ IMPORTA ───────────────────────────
//
//   `significado`  → BCS Handbook 03, fila «Significado» de cada ficha.
//                    Transcrito, no reescrito.
//   `lectura`      → qué informa el número y de qué depende. Sale de la misma
//                    ficha (filas «Cálculo», «Origen») y de la CKB.
//   `limite`       → qué NO puede afirmarse. Sale de la fila «Interpretación»
//                    del handbook y de las «interpretaciones no admisibles»
//                    de la Clinical Knowledge Base.
//
//   `limite` no es un descargo de responsabilidad ni letra pequeña: es la
//   parte que impide que la cifra se lea de más. Un BMR estimado presentado
//   sin decir que es una estimación de una ecuación poblacional se lee como
//   un dato medido, y a partir de ahí todo lo que se construya encima está
//   mal.
//
// LO QUE ESTE MÓDULO NO HACE: clasificar. Aquí no hay «alto», «bajo» ni
// «normal» aplicados al resultado de nadie. Explicar qué mide una variable y
// situarla en una escala son dos cosas distintas, y la segunda necesita un
// rango publicado que para 24 de las 25 no existe.
//
// Módulo puro y declarativo.

import type { VariableId } from '@/lib/bcs/reporte';

export interface Significado {
  /** Qué es. Literal del BCS Handbook 03. */
  significado: string;
  /** Qué informa el número y de qué depende. */
  lectura: string;
  /** Qué NO puede afirmarse con él. Nunca vacío: siempre hay un límite. */
  limite: string;
}

/**
 * Las 22 variables numéricas del catálogo.
 *
 * `fecha`, `observaciones` y `foto_url` no están: son metadatos de la
 * medición, no medidas del cuerpo, y no hay nada que interpretar en ellas.
 */
export const SIGNIFICADOS: Readonly<Partial<Record<VariableId, Significado>>> = {
  altura_cm: {
    significado:
      'Estatura en posición vertical. En un adulto es un dato relativamente estable: se toma una vez y solo se actualiza si cambia.',
    lectura:
      'No se interpreta por sí misma. Entra en el cálculo del IMC y del índice de masa muscular, así que un error aquí desplaza los dos.',
    limite:
      'Un cambio de estatura en un adulto casi siempre es un error de registro antes que un cambio real.',
  },

  peso_kg: {
    significado:
      'Masa corporal total en el momento de la medición: la suma de agua, proteína, minerales y grasa.',
    lectura:
      'Es la variable que más se mueve por causas ajenas a la composición: hidratación, comida reciente, hora del día. Por eso se lee junto a las demás y no sola.',
    limite:
      'El peso no distingue de qué está hecho el cuerpo. Subir o bajar un kilo no dice si fue músculo, grasa o agua.',
  },

  imc: {
    significado: 'Relación entre peso y altura, usada como indicador poblacional de adiposidad.',
    lectura:
      'Es la única variable de la ficha con bandas de referencia universales publicadas, y por eso la única que el informe clasifica.',
    limite:
      'Sus categorías se desarrollaron en población general y son conocidamente poco fiables en personas con mucha masa muscular. Una persona entrenada puede caer en «sobrepeso» sin exceso de grasa: por eso el IMC se lee junto al porcentaje graso, nunca solo.',
  },

  grasa_pct: {
    significado: 'Proporción del peso total correspondiente a masa grasa.',
    lectura:
      'No se mide directamente: el analizador lo deriva de la impedancia con un algoritmo propio. Su valor sirve sobre todo para seguirte a ti mismo en el tiempo con el mismo aparato.',
    limite:
      'Dos dispositivos distintos pueden dar cifras diferentes de la misma persona el mismo día, porque cada fabricante usa su propia ecuación y ninguna es pública. La concordancia con densitometría tiene márgenes amplios a nivel individual.',
  },

  masa_grasa_kg: {
    significado: 'Peso absoluto correspondiente a tejido graso.',
    lectura:
      'Es el porcentaje graso convertido a kilos. Se mira junto al porcentaje porque los dos pueden moverse en sentidos distintos: si el peso total sube, el porcentaje puede bajar sin que haya bajado un solo kilo de grasa.',
    limite:
      'Hereda toda la incertidumbre del porcentaje graso del que se deriva; no es una medida independiente.',
  },

  masa_muscular_kg: {
    significado: 'Peso estimado de tejido muscular esquelético.',
    lectura:
      'Es la variable que responde al entrenamiento de fuerza, y la que más lento se mueve: sus cambios reales se ven en meses, no en semanas.',
    limite:
      'Es una estimación del aparato, no una medida. Una subida rápida entre dos mediciones próximas suele reflejar más hidratación que músculo nuevo.',
  },

  masa_libre_grasa_kg: {
    significado: 'Todo el peso corporal que no es tejido graso: músculo, huesos, órganos y agua.',
    lectura:
      'Al incluir el agua, se mueve con el estado de hidratación. Es útil como contrapeso de la masa grasa dentro de la misma medición.',
    limite:
      'Que suba no significa que haya subido el músculo: puede ser agua. Para eso se mira la masa muscular por separado.',
  },

  proteina_kg: {
    significado: 'Masa estimada de proteína corporal total.',
    lectura:
      'Va de la mano de la masa muscular, porque el músculo es su principal reservorio. Se sigue como serie propia, no como cifra aislada.',
    limite:
      'Es un valor derivado del modelo del aparato. No existe un rango de referencia publicado que permita decir si es mucha o poca.',
  },

  minerales_kg: {
    significado:
      'Masa estimada del contenido mineral corporal total. Incluye el mineral óseo, pero no solo.',
    lectura: 'Cambia muy poco. Su valor está en el seguimiento a largo plazo, no en una medición.',
    limite:
      'Sin rango de referencia publicado. Un valor aislado no admite lectura de suficiencia ni de carencia.',
  },

  masa_osea_kg: {
    significado: 'Peso estimado del contenido mineral óseo.',
    lectura:
      'Es la variable más estable de la ficha. Un salto entre dos mediciones próximas apunta antes a una lectura del aparato que a un cambio real.',
    limite:
      'Una estimación por bioimpedancia no equivale a una densitometría, que es la prueba con la que se valora la salud ósea. No se lee en esa clave.',
  },

  grasa_visceral_idx: {
    significado:
      'Estimación de la grasa que rodea los órganos abdominales, expresada como índice adimensional, no como peso.',
    lectura:
      'Solo es interpretable como serie temporal tuya, medida siempre con el mismo aparato. Que suba o baje respecto a tu propia medición anterior es la única lectura que sostiene.',
    limite:
      'Cada fabricante usa una escala propia y no hay equivalencia publicada entre marcas (una llega a 20, otra a 59). El sistema no clasifica este índice contra ningún rango comercial ni compara entre dispositivos: la base de conocimiento clínica lo declara expresamente no admisible.',
  },

  agua_total_l: {
    significado:
      'Agua corporal total, sumando la de dentro y la de fuera de las células.',
    lectura:
      'Es la variable que explica buena parte de las diferencias de peso entre dos días. Cambia con la comida, la bebida, el ejercicio reciente y la hora.',
    limite:
      'Una diferencia de agua entre dos mediciones no dice si es retención, deshidratación o simplemente la hora del día. El sistema la registra y no la interpreta.',
  },

  agua_intracelular_l: {
    significado: 'Agua contenida dentro de las células.',
    lectura:
      'Se lee junto a la extracelular: lo que informa es la proporción entre ambas, no cada una por su cuenta.',
    limite:
      'No existe una tolerancia publicada que permita decir cuándo la suma de las dos se aparta demasiado del agua total, así que el sistema no emite ningún juicio sobre esa relación.',
  },

  agua_extracelular_l: {
    significado: 'Agua fuera de las células: plasma y líquido intersticial.',
    lectura:
      'Su proporción respecto al agua total es lo que la literatura usa como indicador; el valor absoluto por sí solo informa poco.',
    limite:
      'Una proporción elevada puede ser un dato real o un problema de contacto de los electrodos. El sistema no distingue automáticamente entre las dos cosas: lo marca para que lo revises.',
  },

  bmr_kcal: {
    significado:
      'Energía estimada que el cuerpo consume en reposo absoluto durante 24 horas.',
    lectura:
      'Se calcula a partir de la masa libre de grasa con una ecuación poblacional. Sube cuando sube el músculo, y esa es su lectura útil.',
    limite:
      'No es un dato medido: es una predicción, y su exactitud varía marcadamente según sexo, edad, IMC y etnia. En personas entrenadas varias ecuaciones de uso general se desvían de forma sistemática. Sirve para seguirte a ti, no para compararte con otra persona.',
  },

  edad_metabolica: {
    significado:
      'Cifra propietaria del fabricante que compara tu metabolismo basal estimado contra un promedio de población por edad.',
    lectura:
      'Es un número de marketing más que fisiológico: resume en un solo dato algo que la ficha ya muestra con más detalle.',
    limite:
      'El concepto no tiene una base fisiológica establecida de forma independiente. El sistema muestra el número que da el aparato y no lo clasifica ni construye nada encima.',
  },

  smi: {
    significado:
      'Masa muscular normalizada por la altura al cuadrado. Se usa en la literatura de sarcopenia.',
    lectura:
      'Al descontar la altura, permite seguir el músculo sin que el tamaño corporal lo enmascare.',
    limite:
      'No existe un punto de corte único aceptado, y los que circulan proceden de poblaciones clínicas de edad avanzada. El sistema no lo clasifica.',
  },

  angulo_fase_deg: {
    significado:
      'Ángulo derivado de la relación entre resistencia y reactancia. La literatura clínica lo usa como marcador indirecto de integridad de la membrana celular.',
    lectura: 'Se muestra como serie temporal. Su movimiento tuyo a lo largo del tiempo es lo único que se lee.',
    limite:
      'No hay consenso suficiente sobre sus valores de referencia, así que no se clasifica. Y no se compara entre aparatos distintos.',
  },

  circ_cintura_cm: {
    significado: 'Perímetro abdominal a la altura del ombligo, tomado con cinta métrica.',
    lectura:
      'Es una medida directa, no una estimación del aparato: no depende de ninguna ecuación. Se registra para poder calcular la relación cintura-cadera.',
    limite:
      'Depende de dónde se coloque la cinta y de la fase respiratoria. Para que dos mediciones sean comparables tienen que tomarse igual.',
  },

  circ_cadera_cm: {
    significado: 'Perímetro en el punto de mayor circunferencia glútea, con cinta métrica.',
    lectura: 'Igual que la cintura: medida directa, registrada para poder calcular la relación entre ambas.',
    limite: 'Misma dependencia de la técnica de medición que la cintura.',
  },

  whr: {
    significado:
      'Proporción entre la circunferencia de cintura y la de cadera, usada como indicador de cómo se distribuye la grasa.',
    lectura:
      'Informa de la forma, no de la cantidad: dos personas con el mismo porcentaje graso pueden tener relaciones muy distintas.',
    limite:
      'Sus categorías se publican por sexo y proceden de población general, sin validar en población entrenada. El sistema no las aplica mientras no consten el sexo del cliente y la tabla cargada.',
  },

  impedancia_ohm: {
    significado:
      'Resistencia eléctrica del cuerpo al paso de una corriente de bajo voltaje. Es la medición física bruta de la que el analizador deriva internamente casi todo lo demás.',
    lectura:
      'Es el dato más «real» de la ficha en el sentido de que sí se mide. Todo lo demás sale de aquí a través de ecuaciones del fabricante.',
    limite:
      'Por sí sola no dice nada sobre el cuerpo: es una magnitud eléctrica. Se registra para poder auditar de dónde salen las demás cifras.',
  },
};

/** Qué es y qué puede leerse de una variable. `null` si no está descrita. */
export function significadoDe(id: VariableId): Significado | null {
  return SIGNIFICADOS[id] ?? null;
}
