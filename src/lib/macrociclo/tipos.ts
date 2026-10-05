// ── Macrociclo · tipos del dominio (Sprints MAC-1 · MAC-2 · MAC-3) ─────────
//
// LA CAPA QUE FALTABA, Y DÓNDE ENCAJA.
//
//   El PAS mide. Plantillas prescribe la sesión. Entre las dos no había nada
//   que dijera QUÉ SEMANA va antes de cuál y por qué, y esa es la pregunta
//   que resuelve un macrociclo.
//
//   Macrociclo → Mesociclo → Microciclo (semana) → Día → **plantilla**
//
//   El día NO contiene ejercicios. Contiene el identificador de una plantilla
//   de sesión, que ya tiene su editor, su PDF, su enlace público y su
//   asistente. Duplicar el editor de sesiones aquí crearía dos documentos del
//   mismo entrenamiento que divergirían al primer cambio — que es el fallo
//   que este proyecto lleva evitando desde el BCS.
//
// ── LO QUE ESTE SUBSISTEMA NO HACE ───────────────────────────────────────
//
//   NO PRESCRIBE CARGAS. Ni un porcentaje, ni un volumen, ni una progresión.
//   La taxonomía de `taxonomia.ts` SÍ está verificada contra un libro con su
//   ISBN y su página, pero lo que aporta son NOMBRES Y ESTRUCTURA; cada cifra
//   de la rejilla la escribe el entrenador.
//
//   Esa línea no es pereza. El BCS se niega a clasificar un porcentaje graso
//   sin tabla publicada, y el PAS se niega a situar un valor sin norma
//   compatible. Esas negativas solo significan algo si el sistema no está, en
//   la pestaña de al lado, repartiendo «75 % de 1RM en acumulación» sin más
//   aval que su propia confianza.
//
// ── LAS FILAS DE LA REJILLA SON DEL ENTRENADOR ───────────────────────────
//
//   Un macrociclo de halterofilia cuenta tonelaje; uno de fútbol, minutos y
//   sprints; uno de rehabilitación, dolor y rango. Fijar aquí una lista de
//   variables obligaría a todos a la del primero. Las filas se declaran por
//   macrociclo, con su nombre y su unidad, y el sistema solo las ordena.
//
// Módulo de tipos. Sin lógica.

/** Cómo se rellena una fila de la rejilla. NO cambia lo que se puede escribir. */
export type TipoFila =
  /** Texto libre: contenidos, objetivos, observaciones. */
  | 'texto'
  /** Un número con su unidad: tonelaje, minutos, km, sesiones. */
  | 'numero'
  /** Porcentaje. Se guarda como número; la unidad es cosa de la fila. */
  | 'porcentaje'
  /**
   * Marca de presencia: la celda solo dice «esto se trabaja esta semana».
   *
   * Es la fila de `X` y `=` del plan gráfico de toda la vida (MAC-3). Se
   * separa de `texto` porque la rejilla la pinta centrada y porque el
   * exportador no debe intentar leerla como número.
   */
  | 'marca';

/**
 * Una fila de la rejilla: qué se planifica semana a semana.
 *
 * `unidad` es texto libre y puede ir vacía. Un tonelaje se mide en kg, una
 * carga percibida en UA y un objetivo técnico en nada.
 */
export interface FilaPlan {
  id: string;
  nombre: string;
  tipo: TipoFila;
  unidad: string;
  /** Valor por semana. Longitud SIEMPRE igual a `macrociclo.semanas`. */
  valores: (string | null)[];
  /**
   * Color con el que esta fila se dibuja en la curva de carga. `null` = no se
   * dibuja (Sprint MAC-2).
   *
   * ── POR QUÉ UNA MARCA POR FILA Y NO DOS FILAS FIJAS ─────────────────────
   *
   *   La curva clásica lleva volumen e intensidad, y es lo que siembran los
   *   modelos. Pero un plan de natación quiere ver metros y otro de fútbol
   *   minutos de alta velocidad: atar el gráfico a dos nombres concretos
   *   obligaría a llamar «Volumen» a lo que no lo es.
   *
   *   Cualquier fila puede entrar en la curva, y las que no tienen color se
   *   quedan en la tabla. Es el entrenador quien decide qué merece dibujarse.
   */
  grafico: string | null;
  /**
   * Grupo al que pertenece la fila, para agruparla bajo un encabezado
   * (Sprint MAC-3): «Preparación física general», «…especial», etc.
   *
   * Es el id de un `GRUPOS_CAPACIDADES` de `taxonomia.ts`, o texto libre, o
   * `null` para las filas sueltas. NO se valida contra el catálogo: el
   * entrenador puede agrupar por lo que quiera, y el catálogo solo siembra.
   */
  grupo: string | null;
}

/**
 * Un mesociclo: un tramo CONTIGUO de semanas con un nombre.
 *
 * Se guarda por longitud y no por índice de inicio: insertar una semana al
 * principio tendría que recalcular el inicio de todos los demás, y basta que
 * uno se quede sin recalcular para que el bloque se solape con el siguiente.
 * Con longitudes, el orden del array ya es la posición.
 */
export interface Mesociclo {
  id: string;
  nombre: string;
  /** Cuántas semanas ocupa. Siempre ≥ 1. */
  semanas: number;
  /** Fase del modelo de periodización, si viene de uno. `null` = propia. */
  faseId: string | null;
  /**
   * Tipo del catálogo de Forteza (`TIPOS_MESOCICLO`), o `null`.
   *
   * Es informativo y no restringe: un mesociclo puede llamarse como quiera y
   * declararse «básico desarrollador» para que la rejilla lo etiquete.
   */
  tipoId: string | null;
  /** Color de la banda, para leer la estructura de un vistazo. */
  color: string;
  notas: string | null;
}

/**
 * Un tramo de una banda superior (periodo, etapa, o la que el entrenador
 * invente). Misma forma que un mesociclo porque es el mismo problema: un
 * nombre sobre un número contiguo de semanas.
 */
export interface TramoBanda {
  id: string;
  nombre: string;
  semanas: number;
  color: string;
  /** Id del catálogo (`PERIODOS`, `ETAPAS`) si viene de él. */
  tipoId: string | null;
}

/**
 * Una banda de la cabecera: PERIODO, ETAPAS, o lo que haga falta.
 *
 * ── POR QUÉ GENÉRICAS Y NO TRES CAMPOS FIJOS ────────────────────────────
 *
 *   El plan gráfico clásico lleva tres niveles —periodo, etapa, mesociclo—,
 *   pero no todos los planes los quieren y algunos quieren más (un plan de
 *   selección nacional añade «concentración»). Tres campos fijos obligarían a
 *   dejar vacíos los que no se usan y no dejarían añadir el cuarto.
 *
 *   Los mesociclos NO son una banda genérica y viven aparte: son a lo que
 *   apunta `faseId`, lo que tiñe el calendario y lo que siembran los modelos.
 *   Fundirlos aquí para ganar simetría costaría todo eso.
 */
export interface BandaPlan {
  id: string;
  /** Lo que se lee en la columna de etiquetas: «Periodo», «Etapas»… */
  nombre: string;
  tramos: TramoBanda[];
}

/**
 * Lo que se planifica de una semana concreta, más allá de sus celdas.
 *
 * ── POR QUÉ NO SON FILAS NORMALES ───────────────────────────────────────
 *
 *   Porque tienen vocabulario cerrado y aritmética. El tipo de microciclo sale
 *   de un catálogo con su color y su código; las sesiones y las horas se
 *   suman por mesociclo. Una fila de texto libre no puede hacer ni lo uno ni
 *   lo otro, y escribir «CH» a mano en una celda de texto no le daría color ni
 *   permitiría contar cuántos microciclos de choque lleva el plan.
 */
export interface SemanaPlan {
  /** Id de `TIPOS_MICROCICLO`, o `null` si aún no se ha decidido. */
  tipoMicrociclo: string | null;
  sesiones: number | null;
  horas: number | null;
  diasEntrenamiento: number | null;
  diasDescanso: number | null;
  notas: string | null;
}

/** Una competencia, anclada a la semana en que se compite. */
export interface Competencia {
  id: string;
  /** Semana en base cero. */
  semana: number;
  nombre: string;
  /** Id de `CATEGORIAS_COMPETENCIA`: preparatoria, control o fundamental. */
  categoria: string;
  /** Dónde se compite. Texto libre: «Nacional», «Bogotá», «Panamericano». */
  ambito: string;
}

/** Un día de una semana concreta. Apunta a una plantilla, no la contiene. */
export interface DiaPlan {
  /** 0 = lunes … 6 = domingo. */
  dia: number;
  /** Semana en base cero. */
  semana: number;
  /**
   * Plantilla de sesión asignada. `null` = día sin sesión asignada, que NO es
   * lo mismo que día de descanso: el descanso se escribe en `etiqueta`.
   */
  plantillaId: string | null;
  /** Qué se lee en la celda cuando no hay plantilla: «Descanso», «Partido». */
  etiqueta: string | null;
}

/** El documento entero. Es lo que va en la columna `contenido`. */
export interface ContenidoMacrociclo {
  /** Bandas superiores: periodo, etapas… Vacío es legítimo. */
  bandas: BandaPlan[];
  mesociclos: Mesociclo[];
  /** Una entrada por semana. Longitud SIEMPRE igual a `macrociclo.semanas`. */
  semanas: SemanaPlan[];
  competencias: Competencia[];
  filas: FilaPlan[];
  dias: DiaPlan[];
}

export type EstadoMacrociclo = 'borrador' | 'publicado' | 'archivado';

export interface Macrociclo {
  id: string;
  entrenadorId: string;
  /** Atleta del PAS al que pertenece el plan. `null` = plan sin atleta. */
  atletaId: string | null;
  nombre: string;
  objetivo: string | null;
  /** Fecha ISO del lunes de la semana 1. `null` = sin fecha de inicio. */
  fechaInicio: string | null;
  semanas: number;
  /** Qué modelo se usó para sembrarlo. Informativo: la rejilla ya es libre. */
  modeloId: string | null;
  contenido: ContenidoMacrociclo;
  estado: EstadoMacrociclo;
  createdAt: string;
  actualizadoEl: string;
}

/** Límites de la rejilla. Un macrociclo de 104 semanas son dos años. */
export const MIN_SEMANAS = 1;
export const MAX_SEMANAS = 104;

export const DIAS_SEMANA: readonly string[] = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];
