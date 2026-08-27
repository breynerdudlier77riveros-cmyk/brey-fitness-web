// ── Límite de preguntas por enlace (Sprint PLS-2) ──────────────────────────
//
// EL PROBLEMA QUE NADIE PIDIÓ RESOLVER Y HAY QUE RESOLVER IGUAL.
//
//   Esta es la primera puerta ANÓNIMA del ecosistema que gasta una API medida.
//   Todo lo demás detrás de un token es de solo lectura: cuesta una consulta a
//   Postgres y punto. Preguntarle al modelo cuesta cuota, y la cuota es
//   compartida.
//
//   Sin límite, cualquiera que reciba un enlace —o a quien se lo reenvíen—
//   puede lanzar mil peticiones en un minuto y dejar al ENTRENADOR sin BREY IA
//   en su propio informe. No hace falta mala fe: basta con un script, una
//   pestaña olvidada o un cliente insistente.
//
// ── LO QUE ESTE LÍMITE ES, Y LO QUE NO ────────────────────────────────────
//
//   ES: una ventana deslizante en memoria, por token. Barata, sin esquema
//   nuevo, y suficiente para lo que de verdad va a pasar — un cliente
//   preguntando de más.
//
//   NO ES: protección contra alguien decidido. Vive en la memoria del proceso,
//   así que se reinicia con el servidor y no se comparte entre instancias si
//   algún día hay varias. Quien quiera saltárselo, se lo salta.
//
//   Se deja escrito aquí y no en un comentario optimista porque la diferencia
//   importa: el día que esto se despliegue en varias instancias, o que el
//   gasto empiece a doler, el sitio de arreglarlo es una tabla con una cuenta
//   por token, no este fichero.
//
// Módulo con estado de proceso. El reloj se inyecta para poder probarlo.

/** Preguntas permitidas por enlace dentro de la ventana. */
export const MAX_POR_VENTANA = 15;

/** La ventana, en milisegundos. Una hora. */
export const VENTANA_MS = 60 * 60 * 1000;

/**
 * Marcas de tiempo por token.
 *
 * Un `Map` a secas crecería sin fin si se emitieran muchos enlaces. Se poda en
 * cada consulta: los tokens cuyas marcas han caducado se borran enteros, así
 * que el mapa tiende al número de enlaces ACTIVOS en la última hora.
 */
const registro = new Map<string, number[]>();

export interface Veredicto {
  permitido: boolean;
  /** Cuántas quedan tras esta. Solo tiene sentido si `permitido`. */
  restantes: number;
  /** Segundos hasta que se libere una plaza. Solo si NO está permitido. */
  esperaSegundos: number;
}

/**
 * ¿Puede este token preguntar ahora?
 *
 * Consume una plaza cuando la respuesta es que sí. Consultar sin consumir
 * sería otra función, y no hace falta: quien pregunta esto es porque va a
 * lanzar la petición.
 */
export function registrarPregunta(token: string, ahora: number = Date.now()): Veredicto {
  const desde = ahora - VENTANA_MS;

  const previas = (registro.get(token) ?? []).filter((t) => t > desde);

  if (previas.length >= MAX_POR_VENTANA) {
    // La más antigua es la que libera la siguiente plaza.
    const espera = Math.ceil((previas[0] + VENTANA_MS - ahora) / 1000);
    registro.set(token, previas);
    return { permitido: false, restantes: 0, esperaSegundos: Math.max(1, espera) };
  }

  previas.push(ahora);
  registro.set(token, previas);

  podar(desde);

  return {
    permitido: true,
    restantes: MAX_POR_VENTANA - previas.length,
    esperaSegundos: 0,
  };
}

/** Borra los tokens sin marcas vivas. Evita que el mapa crezca sin fin. */
function podar(desde: number): void {
  for (const [token, marcas] of registro) {
    const vivas = marcas.filter((t) => t > desde);
    if (vivas.length === 0) registro.delete(token);
    else if (vivas.length !== marcas.length) registro.set(token, vivas);
  }
}

/** Solo para los tests: deja el registro como recién arrancado. */
export function reiniciarLimite(): void {
  registro.clear();
}
