// ── Anamnesis · contenido fijo transcrito de "anamnesis mejorada.xls" ──────
//
// Estas listas son el texto literal del formulario original (Hoja1). Son
// contenido, no configuración: no cambian de un cliente a otro, por eso
// viven separadas de `secciones.ts` (que sí describe qué se puede editar).

export interface FilaAlimento {
  id: string;
  etiqueta: string;
  porcion: string;
}

export const ALIMENTOS: FilaAlimento[] = [
  { id: 'leche', etiqueta: 'Leche sola o bebidas con leche', porcion: 'Vaso, pocillo o taza' },
  { id: 'yogurtKumis', etiqueta: 'Yogurt o kumis', porcion: 'Vaso, pocillo o taza' },
  { id: 'quesoCuajada', etiqueta: 'Queso o cuajada', porcion: 'Porción grande, mediana o pequeña' },
  { id: 'huevos', etiqueta: 'Huevos', porcion: 'Unidades' },
  { id: 'carneRes', etiqueta: 'Carne de res', porcion: 'Porción grande, mediana o pequeña' },
  { id: 'pollo', etiqueta: 'Pollo', porcion: 'Porción grande, mediana o pequeña' },
  { id: 'pescadoAtun', etiqueta: 'Pescado o atún', porcion: 'Porción grande, mediana o pequeña' },
  { id: 'visceras', etiqueta: 'Vísceras o menudencias', porcion: 'Porción grande, mediana o pequeña' },
  { id: 'frijolLentejaGarbanzo', etiqueta: 'Frijol, lentejas o garbanzo', porcion: 'Cucharadas' },
  { id: 'frutas', etiqueta: 'Frutas en porción', porcion: 'Unidades' },
  { id: 'jugos', etiqueta: 'Jugos de fruta', porcion: 'Vaso, pocillo o taza' },
  { id: 'arrozPastas', etiqueta: 'Arroz o pastas', porcion: 'Cucharadas' },
  { id: 'papaYucaPlatano', etiqueta: 'Papa, yuca o plátano', porcion: 'Unidades' },
  { id: 'dulces', etiqueta: 'Dulces o chocolates', porcion: 'Unidades' },
  { id: 'gaseosas', etiqueta: 'Gaseosas o refrescos', porcion: 'Vaso, pocillo o taza' },
  { id: 'golosinas', etiqueta: 'Golosinas de paquete', porcion: 'Unidades' },
  { id: 'pastelesEmpanadas', etiqueta: 'Pasteles o empanadas', porcion: 'Unidades' },
  { id: 'frituras', etiqueta: 'Alimentos fritos', porcion: 'Porción grande, mediana o pequeña' },
  { id: 'mayonesaSalsas', etiqueta: 'Mayonesa o salsas variadas', porcion: 'Cucharadas' },
  { id: 'hamburguesasPizza', etiqueta: 'Hamburguesas, perros, pizza, crepes o sandwich', porcion: 'Unidades' },
  { id: 'aguaSola', etiqueta: 'Agua sola', porcion: 'Vaso, pocillo o taza' },
];

export const MOTIVOS: { id: number; texto: string }[] = [
  { id: 1, texto: 'Para mantenerme delgado (a)' },
  { id: 2, texto: 'Para mantenerme sano (a)' },
  { id: 3, texto: 'Porque me hace sentir bien' },
  { id: 4, texto: 'Para parecer más joven' },
  { id: 5, texto: 'Porque me deja tiempo para pensar sobre mis cosas' },
  { id: 6, texto: 'Para tener un cuerpo sano' },
  { id: 7, texto: 'Porque me gusta la sensación que tengo cuando hago ejercicio' },
  { id: 8, texto: 'Para pasar el tiempo con mis amigos' },
  { id: 9, texto: 'Porque el médico me ha aconsejado' },
  { id: 10, texto: 'Porque me gusta intentar ganar cuando hago ejercicio' },
  { id: 11, texto: 'Para estar más ágil' },
  { id: 12, texto: 'Para tener unas metas por las que esforzarme' },
  { id: 13, texto: 'Para perder peso' },
  { id: 14, texto: 'Para evitar problemas de salud' },
  { id: 15, texto: 'Porque el ejercicio me da energías' },
  { id: 16, texto: 'Para tener un buen cuerpo' },
  { id: 17, texto: 'Para comparar mis habilidades con las de los demás' },
  { id: 18, texto: 'Porque ayuda a reducir la tensión' },
  { id: 19, texto: 'Para aumentar mi resistencia' },
  { id: 20, texto: 'Porque el ejercicio hace que me sienta satisfecho' },
  { id: 21, texto: 'Para disfrutar de los aspectos sociales de los ejercicios' },
  { id: 22, texto: 'Para evitar una enfermedad que se da mucho en la familia' },
  { id: 23, texto: 'Para mantener la flexibilidad' },
  { id: 24, texto: 'Para controlar mi peso' },
  { id: 25, texto: 'Para evitar problemas cardiacos' },
  { id: 26, texto: 'Para mejorar mi aspecto' },
  { id: 27, texto: 'Para tener reconocimiento cuando me supero' },
  { id: 28, texto: 'Para sentirme más sano (a)' },
  { id: 29, texto: 'Para sentirme más fuerte' },
  { id: 30, texto: 'Porque el ejercicio me produce diversión' },
  { id: 31, texto: 'Para divertirme haciendo ejercicio con otras personas' },
  { id: 32, texto: 'Para recuperarme de una enfermedad' },
  { id: 33, texto: 'Para desarrollar mis habilidades personales' },
  { id: 34, texto: 'Para desarrollar mis músculos' },
  { id: 35, texto: 'Porque haciendo ejercicio me siento muy bien' },
  { id: 36, texto: 'Para hacer amigos' },
  { id: 37, texto: 'Porque me divierte hacer ejercicio sobre todo si hay competición' },
];

export const ESCALA_MOTIVOS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => ({
  valor: String(n),
  etiqueta: String(n),
}));

export const ESTRES_ITEMS: { id: number; texto: string }[] = [
  { id: 1, texto: 'En el último mes, ¿con qué frecuencia ha estado afectado por algo que ha ocurrido inesperadamente?' },
  { id: 2, texto: 'En el último mes, ¿con qué frecuencia se ha sentido incapaz de controlar las cosas importantes en su vida?' },
  { id: 3, texto: 'En el último mes, ¿con qué frecuencia se ha sentido nervioso o estresado?' },
  { id: 4, texto: 'En el último mes, ¿con qué frecuencia ha manejado con éxito los pequeños problemas irritantes de la vida?' },
  { id: 5, texto: 'En el último mes, ¿con qué frecuencia ha sentido que ha afrontado efectivamente los cambios importantes que han estado ocurriendo en su vida?' },
  { id: 6, texto: 'En el último mes, ¿con qué frecuencia ha estado seguro sobre su capacidad para manejar sus problemas personales?' },
  { id: 7, texto: 'En el último mes, ¿con qué frecuencia ha sentido que las cosas le van bien?' },
  { id: 8, texto: 'En el último mes, ¿con qué frecuencia ha sentido que no podía afrontar todas las cosas que tenía que hacer?' },
  { id: 9, texto: 'En el último mes, ¿con qué frecuencia ha podido controlar las dificultades de su vida?' },
  { id: 10, texto: 'En el último mes, ¿con qué frecuencia se ha sentido que tenía todo bajo control?' },
  { id: 11, texto: 'En el último mes, ¿con qué frecuencia ha estado enfadado porque las cosas que le han ocurrido estaban fuera de su control?' },
  { id: 12, texto: 'En el último mes, ¿con qué frecuencia ha pensado sobre las cosas que le quedan por hacer?' },
  { id: 13, texto: 'En el último mes, ¿con qué frecuencia ha podido controlar la forma de pasar el tiempo?' },
  { id: 14, texto: 'En el último mes, ¿con qué frecuencia ha sentido que las dificultades se acumulan tanto que no puede superarlas?' },
];

export const ESCALA_ESTRES = [
  { valor: '0', etiqueta: 'Nunca' },
  { valor: '1', etiqueta: 'Casi nunca' },
  { valor: '2', etiqueta: 'De vez en cuando' },
  { valor: '3', etiqueta: 'A menudo' },
  { valor: '4', etiqueta: 'Muy a menudo' },
];

export interface SituacionTemperamento {
  id: number;
  situacion: string;
  opciones: { letra: 'A' | 'B' | 'C' | 'D'; texto: string }[];
}

export const TEMPERAMENTO_SITUACIONES: SituacionTemperamento[] = [
  {
    id: 1,
    situacion: 'Al caminar',
    opciones: [
      { letra: 'A', texto: 'Tiene un paso firme, resuelto. Pisa fuerte, camina rápido y seguro en una dirección determinada. No se deja desviar fácilmente.' },
      { letra: 'B', texto: 'Su paso es ágil. Salta, trota, camina en zig-zag y descuidadamente. Se deja desviar fácilmente.' },
      { letra: 'C', texto: 'Camina silenciosamente, concentrado, lento, arrastradamente. En ocasiones da la impresión de estar muy cansado o apesadumbrado.' },
      { letra: 'D', texto: 'Camina pausadamente, perezosamente. Su andar es tranquilo y constante. Nunca anda grandes distancias.' },
    ],
  },
  {
    id: 2,
    situacion: 'La mirada',
    opciones: [
      { letra: 'A', texto: 'Tiene una mirada punzante, resuelta, firme y crítica. Mira calculadoramente y en ocasiones amenazadoramente.' },
      { letra: 'B', texto: 'Tiene una mirada plácida, lánguida e inexpresiva. A menudo cierra los ojos para dormir. Puede llegar a ser una mirada curiosa, pero de una curiosidad lenta, calmada.' },
      { letra: 'C', texto: 'Mira serio, preocupado o tristemente. En ocasiones parece "mirar a las nubes", pero suele estar "mirando hacia dentro". Su mirada es bonachona, profunda y refleja admiración. Le gusta cerrar los ojos y meditar.' },
      { letra: 'D', texto: 'Su mirada es alegre, vivaz, amigable. A menudo curiosa.' },
    ],
  },
  {
    id: 3,
    situacion: 'Al vestir',
    opciones: [
      { letra: 'A', texto: 'Sigue la moda, pero recatadamente. Viste siempre pulcramente y expresando algo. Sin embargo llama a veces la atención porque lleva un botón desabrochado, la camisa fuera o el pañuelo sobresaliendo del bolsillo y a punto de caérsele.' },
      { letra: 'B', texto: 'Elige colores oscuros, no le gustan los colores chillones ni las formas estrambóticas. Su ropa es siempre impecable.' },
      { letra: 'C', texto: 'Le gusta la ropa elegante, llamativa. Suele ir a la moda, puede llegar a gastar demasiado en ropa; o andar descuidado, desprolijo.' },
      { letra: 'D', texto: 'Le gusta la ropa buena, usar la que corresponde en cada caso. Quiere decir algo con la forma de vestir, sin querer ser llamativo ni demasiado elegante. Su ropa es práctica.' },
    ],
  },
  {
    id: 4,
    situacion: 'Al saludar',
    opciones: [
      { letra: 'A', texto: 'Quisiera saludar a todos, pero no se atreve. Cuando saluda lo hace en forma cortés y amigable. Entrega todo al saludar.' },
      { letra: 'B', texto: 'Saluda justo cuando ya se ha pasado diez metros. Entonces lo hace cortés y amigablemente. En ocasiones puede pasar silenciosamente sin saludar a nadie.' },
      { letra: 'C', texto: 'Solo saluda cuando le parece necesario y apropiado. Cuando lo hace es notoriamente, en forma calculada y clara, sin ser impertinente.' },
      { letra: 'D', texto: 'Saluda según su estado de ánimo, a todo el mundo o a nadie. Grita de una acera a la otra, se lanza al cuello del otro para abrazarlo efusivamente. Saluda a menudo y a mucha gente.' },
    ],
  },
  {
    id: 5,
    situacion: 'Tiempo libre',
    opciones: [
      { letra: 'A', texto: 'Se lanza despreocupada y alegremente a su tiempo libre. Va detrás de la última sensación. Le gusta ir en grupo, correr aventuras, variar, improvisar. Alarga su tiempo libre al máximo y le cuesta un mundo dejarlo.' },
      { letra: 'B', texto: 'Trabaja en su tiempo libre. Es enemigo de todo lo que sea perder el tiempo. Planifica su tiempo libre y lo ocupa en actividades relacionadas con su estudio o profesión, en todo lo que le ayude a mejorar su posición.' },
      { letra: 'C', texto: 'Le encanta tener tiempo libre. Lo usa preferentemente para conversar, entretenerse calmadamente. A menudo para disfrutar de una buena comida. Suele hacer largas siestas a la sombra, se queda durmiendo aun cuando el trabajo ya haya comenzado hace rato.' },
      { letra: 'D', texto: 'Se recoge a gusto en su tiempo libre. Ama el silencio, los lugares apartados, la naturaleza, el arte. No le gustan los sensacionalismos. Piensa, lee, escribe, hace música, arma puzzles. Nunca sobrepasa el tiempo libre.' },
    ],
  },
  {
    id: 6,
    situacion: 'Ante un obstáculo',
    opciones: [
      { letra: 'A', texto: 'No se intimida, piensa rápidamente, agarra el obstáculo y lo quita del camino.' },
      { letra: 'B', texto: 'Se siente tentado a saltar sobre el obstáculo o bien rodearlo para seguir su camino.' },
      { letra: 'C', texto: 'Medita seria y un tanto preocupadamente la situación. Después elimina el obstáculo consciente de su responsabilidad. Le entristecen las dificultades y teme encontrar tarde la solución.' },
      { letra: 'D', texto: 'El obstáculo le permite hacer una pausa, siempre saludable. Una vez solucionado por sí solo el problema, sigue pausadamente su camino. De ser absolutamente necesario, comienza poco a poco a solucionarlo.' },
    ],
  },
  {
    id: 7,
    situacion: 'En el tránsito',
    opciones: [
      { letra: 'A', texto: 'Se lo toma con calma. Espera tranquilamente hasta que la masa se ponga en movimiento. Entonces se deja empujar por ella. Se siente seguro y protegido de esta forma. No se molesta tampoco cuando se convierte en un obstáculo y todos le recriminan.' },
      { letra: 'B', texto: 'Va con cara seria, pero abierta; sin sentirse a gusto entre la multitud. Le molesta el ruido de la circulación. Se preocupa de ir a la defensiva y con cuidado para no molestar, no atropellar, no llamar la atención.' },
      { letra: 'C', texto: 'Reacciona nerviosa e imprudentemente, anda zigzagueando, choca con las personas y está en permanente peligro de acabar encima de algún radiador.' },
      { letra: 'D', texto: 'Observa fría y señorialmente el tráfico, las luces y la masa. Va con seguridad entre la multitud y, si es necesario, se abre camino a codazos.' },
    ],
  },
  {
    id: 8,
    situacion: 'En las comidas',
    opciones: [
      { letra: 'A', texto: 'Llega puntualmente, comienza sin preámbulos. No se alarga en la sobremesa, vuelve rápidamente a sus ocupaciones.' },
      { letra: 'B', texto: 'Llega ceremoniosamente a la mesa. Come silenciosamente, concentrado en lo que hace. Come poco. Come también lo que no le gusta. Habla poco. Se retira con gusto a descansar.' },
      { letra: 'C', texto: 'Llega a cualquier hora. No se rige demasiado por los modales. Juega con los vasos, platos, cubiertos. Come solo lo que le gusta. Habla y gesticula. Alarga las comidas indefinidamente.' },
      { letra: 'D', texto: 'Llega demasiado pronto o demasiado tarde. Come tranquilo. Habla pausadamente. Siempre es el último en terminar. A veces da la impresión de que dormir y comer fuesen para él las cosas más importantes.' },
    ],
  },
  {
    id: 9,
    situacion: 'En el trabajo',
    opciones: [
      { letra: 'A', texto: 'Nunca se sabe cuándo llega, ya que se distrae o entretiene por el camino. Trabaja irregularmente. De tanto en tanto sueña o silba, conversa, desaparece para buscar comida o bebida. Le cuesta "un mundo" la constancia y la continuidad.' },
      { letra: 'B', texto: 'Llega puntualmente. Comienza su trabajo con decisión y firmeza. Racionaliza siempre. Presiona a su ambiente hacia un mayor rendimiento. Quiere alcanzar nuevos "récords".' },
      { letra: 'C', texto: 'Se dirige al trabajo en silencio, concentrado y consciente de su deber. Siempre es puntual. Es responsable y tranquilo en su ocupación. No le gustan los charlatanes o los "histéricos".' },
      { letra: 'D', texto: 'Se hace esperar con frecuencia. Con toda tranquilidad suele quedarse dormido. Tiene un ritmo de trabajo lento y tranquilo, pero es constante y de fiar. Si se deja llevar puede llegar a ser un holgazán de categoría.' },
    ],
  },
  {
    id: 10,
    situacion: 'Los gastos',
    opciones: [
      { letra: 'A', texto: 'No gasta un centavo en cosas innecesarias. Todo gasto debe ser calculado y provechoso. No es gastador si no cae en fumar, beber o jugar con exceso. En ese caso puede llegar a derrochar todo su dinero.' },
      { letra: 'B', texto: 'Por naturaleza ahorrador, no gasta nunca impulsivamente. Suele necesitar dinero a menudo, ya que se toma "tiempo libre" con frecuencia. Le salva el que suela tenderse a menudo para descansar un poco.' },
      { letra: 'C', texto: 'Es incapaz de distribuir su dinero. Lo gasta según sus apetencias o estados de ánimo. Le gusta invitar. Es incapaz de resistir una buena propaganda. Su cuota mensual nunca llega hasta fin de mes.' },
      { letra: 'D', texto: 'Es el ahorrador por excelencia. Es muy crítico con sus gastos. No se deja seducir fácilmente por la propaganda. Da parte de su dinero a obras sociales o de caridad. Le gusta que sus posesiones sirvan al bien físico y espiritual de los demás.' },
    ],
  },
  {
    id: 11,
    situacion: 'Al dar la mano',
    opciones: [
      { letra: 'A', texto: 'No termina nunca de dar la mano, pero a veces la da solo tímidamente. A menudo golpea en los hombros.' },
      { letra: 'B', texto: 'Aprieta firme y fuerte al dar la mano.' },
      { letra: 'C', texto: 'No sabe lo que es dar la mano con efusividad. Su apretón de manos es tranquilo y sincero.' },
      { letra: 'D', texto: 'Da la mano plenamente convencida de lo que hace. Quiere expresar su cercanía y amistad más profunda.' },
    ],
  },
  {
    id: 12,
    situacion: 'Hablando',
    opciones: [
      { letra: 'A', texto: 'Habla antes de pensar. Habla rápido, exagera, fanfarronea, señala, gesticula con pies y manos. Le gusta ser el centro y llamar la atención. No es duro al hablar; sí sabe galantear y adular.' },
      { letra: 'B', texto: 'Habla poco, piensa y reflexiona. Cuando habla sus palabras son profundas y con sentido. Habla bajo. Elabora en silencio sus experiencias, compartiéndolas comedidamente. Cuando se siente defraudado o afligido puede hacer duras críticas.' },
      { letra: 'C', texto: 'Es objetivo y parco al hablar, de voz clara y dominante. Su expresión es clara, decidida, a menudo dura. Piensa antes de hablar. No habla innecesariamente.' },
      { letra: 'D', texto: 'Normalmente habla poco. Sus palabras son comedidas y bien escogidas. Habla "al grano" sin agobiarse. No hace valoraciones ni da juicios prematuramente. Habla con cierta monotonía. A veces es bueno para conversar.' },
    ],
  },
  {
    id: 13,
    situacion: 'Cómo ve la vida',
    opciones: [
      { letra: 'A', texto: 'Valora la vida según la posición que ocupa y lo que rinde en ella. Su objetivo es vencer en la "lucha" por la vida. La Historia Universal es a sus ojos la historia de la lucha por la vida.' },
      { letra: 'B', texto: 'Valora la vida según el cobijamiento y la paz que le brinde. Equilibrio y tranquilidad son lo principal. Opina que muchas cosas deberían aceptarse tal y como son. El sentido de la vida es alcanzar el mayor grado de paz interior y exterior.' },
      { letra: 'C', texto: 'Valora la vida según las alegrías que esta le depara. Si no encuentra alegría tampoco le encuentra sentido a la vida, ya que este consiste en dar y recibir alegría y felicidad.' },
      { letra: 'D', texto: 'Juzga la vida de acuerdo a la medida de la culpa y la gracia. La Historia es para él una historia de pecado y conversión. El sentido de la vida es superar el pecado con la virtud y la santidad.' },
    ],
  },
];

export const TEMPERAMENTO_RESULTADO: Record<'A' | 'B' | 'C' | 'D', { nombre: string; tipo: string; fluido: string }> = {
  A: { nombre: 'Colérico', tipo: 'Extrovertido', fluido: 'Bilis amarilla' },
  B: { nombre: 'Sanguíneo', tipo: 'Extrovertido', fluido: 'Sangre' },
  C: { nombre: 'Melancólico', tipo: 'Introvertido', fluido: 'Bilis negra' },
  D: { nombre: 'Flemático', tipo: 'Introvertido', fluido: 'Flema' },
};

export interface FilaLaboratorio {
  id: string;
  etiqueta: string;
  minimo: string;
  normal: string;
  maximo: string;
}

export const LABORATORIO_ORINA: FilaLaboratorio[] = [
  { id: 'orinaColor', etiqueta: 'Color', minimo: 'Transparente', normal: 'Amarillento', maximo: 'Colores opacos' },
  { id: 'orinaOlor', etiqueta: 'Olor', minimo: 'Neutro', normal: 'Neutro', maximo: 'Olor fuerte / olor dulce' },
  { id: 'orinaPh', etiqueta: 'Ph', minimo: '> 4.6', normal: '4.6 — 8.0', maximo: '< 8' },
];

export const LABORATORIO_LIPIDICO: FilaLaboratorio[] = [
  { id: 'hdl', etiqueta: 'HDL', minimo: '35 mg/dl', normal: '35 – 45 mg/dl', maximo: '< 60 mg/dl' },
  { id: 'ldl', etiqueta: 'LDL', minimo: '60 mg/dl', normal: '60 – 130 mg/dl', maximo: '< 160 mg/dl' },
  { id: 'vldl', etiqueta: 'VLDL', minimo: '< 150 mg/dl', normal: '150 – 199 mg/dl', maximo: '200 – 499 mg/dl' },
  { id: 'colesterolTotal', etiqueta: 'Colesterol total', minimo: '< 200 mg/dl', normal: '200 – 239 mg/dl', maximo: '> 240 mg/dl' },
];

export const LABORATORIO_HEMATICO: FilaLaboratorio[] = [
  { id: 'eritrocitos', etiqueta: 'Eritrocitos', minimo: '4.1 g/dl', normal: '4.1 – 16.3 g/dl', maximo: '16.3 g/dl' },
  { id: 'leucocitos', etiqueta: 'Leucocitos', minimo: '4.3 ul', normal: '4.3 – 17 ul', maximo: '17 ul' },
  { id: 'plaquetas', etiqueta: 'Plaquetas', minimo: '140 ul', normal: '140 – 840 ul', maximo: '840 ul' },
];

export const LABORATORIO_GLUCOMETRIA: FilaLaboratorio[] = [
  { id: 'glucosaPrePrandial', etiqueta: 'Pre-prandial', minimo: '> 70 mg/dl', normal: '70 – 100 mg/dl', maximo: '< 100 mg/dl' },
  { id: 'glucosaPosPrandial', etiqueta: 'Pos-prandial', minimo: '> 100 mg/dl', normal: '> 140 mg/dl', maximo: '< 140 mg/dl' },
];
