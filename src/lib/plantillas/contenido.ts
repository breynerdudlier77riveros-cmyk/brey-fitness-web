// ── Plantillas · operaciones sobre el contenido ────────────────────────────
//
// El núcleo puro. Todo lo que transforma una plantilla pasa por aquí: el
// editor, las acciones de servidor y la vista pública llaman a estas
// funciones y ninguna de las tres manipula la estructura por su cuenta.
//
// ── DOS INVARIANTES QUE SOSTIENEN TODO LO DEMÁS ───────────────────────────
//
//   1 · TODO EJERCICIO TIENE EXACTAMENTE `semanas` ENTRADAS. Siempre. Si el
//       entrenador amplía el bloque de 4 a 6 semanas, cada ejercicio gana dos
//       entradas; si lo recorta, las pierde. Un array corto haría que la
//       rejilla pintara huecos y que un ajuste apuntara al vacío.
//
//   2 · LOS IDs NO SE REUTILIZAN NI SE REORDENAN. Los ajustes por cliente
//       direccionan por id de ejercicio, no por posición. Mover un ejercicio
//       de sitio no puede cambiar a quién apuntan las cargas de nadie.
//
// ── AMPLIAR COPIA, RECORTAR AVISA ─────────────────────────────────────────
//
//   Al añadir una semana se copia la última en vez de crearla vacía. No es
//   una sugerencia de progresión —el sistema no propone cargas— es que
//   teclear la quinta semana desde cero cuando difiere de la cuarta en un
//   número es trabajo inventado.
//
//   Al recortar se PIERDEN datos, y por eso `redimensionar` no decide sola:
//   `semanasQueSePierden` deja que quien llama lo pregunte antes.
//
// Módulo puro. No consulta el reloj ni genera aleatoriedad salvo por `nuevoId`,
// que está aislada al final del fichero por ese motivo.

import type {
  Ajustes,
  Bloque,
  Contenido,
  Dia,
  EjercicioPlantilla,
  Serie,
  SemanaEjercicio,
  TipoBloque,
} from './tipos';

// ── Construcción ───────────────────────────────────────────────────────────

export const serieVacia = (): Serie => ({ reps: '', pesoKg: null, rir: null, notas: null });

/**
 * Un ejercicio nuevo, ya con sus `semanas` entradas y una serie en cada una.
 *
 * Empieza con UNA serie y no con tres: tres filas prerrellenadas parecen una
 * recomendación del sistema, y el sistema no recomienda nada.
 */
export function ejercicioNuevo(nombre: string, semanas: number, slug: string | null = null): EjercicioPlantilla {
  return {
    id: nuevoId(),
    nombre,
    slug,
    notas: null,
    descansoSeg: null,
    video: null,
    semanas: Array.from({ length: semanas }, () => ({ series: [serieVacia()] })),
  };
}

export const bloqueNuevo = (tipo: TipoBloque): Bloque => ({
  id: nuevoId(),
  tipo,
  ejercicios: [],
});

/**
 * Un día nuevo, con calentamiento y trabajo principal ya creados.
 *
 * Los dos bloques van de serie porque son los que tiene toda sesión, y porque
 * un día completamente vacío no enseña la estructura a quien abre el editor
 * por primera vez. Accesorios y vuelta a la calma se añaden si hacen falta.
 */
export const diaNuevo = (nombre: string): Dia => ({
  id: nuevoId(),
  nombre,
  notas: null,
  bloques: [bloqueNuevo('calentamiento'), bloqueNuevo('principal')],
});

export const contenidoVacio = (): Contenido => ({ dias: [] });

// ── El enlace al vídeo ─────────────────────────────────────────────────────

/**
 * La URL del vídeo, o `null` si no es utilizable.
 *
 * ── POR QUÉ ESTO NO ES UNA COMODIDAD, ES UNA PUERTA ───────────────────────
 *
 *   Este valor termina dentro de un `href` que pulsa un tercero desde la
 *   página pública. `javascript:alert(1)` es una URL perfectamente válida para
 *   `new URL()` y se EJECUTA al pulsarla, en el navegador de quien abrió el
 *   enlace. Lo mismo `data:text/html,...`.
 *
 *   Así que solo pasan `http:` y `https:`. Y se llama en los DOS sitios: al
 *   guardar y al pintar. Sanear solo al guardar deja fuera todo lo que ya
 *   estuviera en la base de datos, y una fila vieja o escrita por otra vía no
 *   tiene por qué haber pasado por el formulario.
 *
 * ── ESCRIBIR LA URL SIN ESQUEMA ES LO NORMAL ──────────────────────────────
 *
 *   Nadie teclea `https://` al copiar una dirección de memoria. Si el texto no
 *   parece llevar esquema se le antepone `https://` y se vuelve a intentar;
 *   así «youtube.com/watch?v=x» funciona sin tener que explicárselo a nadie.
 *   Un `javascript:` NO entra por esa vía: lleva esquema y se rechaza antes.
 */
export function urlDeVideo(texto: string | null | undefined): string | null {
  if (typeof texto !== 'string') return null;
  const limpio = texto.trim();
  if (limpio === '') return null;

  const intentar = (candidato: string): string | null => {
    let url: URL;
    try {
      url = new URL(candidato);
    } catch {
      return null;
    }
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null;
    if (url.hostname === '') return null;
    return url.toString();
  };

  const directo = intentar(limpio);
  if (directo !== null) return directo;

  // Solo se reintenta si NO traía esquema. Con esquema, un fallo es un fallo.
  if (/^[a-zA-Z][a-zA-Z0-9+.-]*:/.test(limpio)) return null;
  return intentar(`https://${limpio}`);
}

/**
 * La dirección en corto, para escribirla en papel.
 *
 * Un enlace impreso necesita su dirección —sobre papel no se puede pulsar—
 * pero la dirección completa de un vídeo es un muro:
 *
 *   https://youtube.com/shorts/Cxp6D7LEqjM?si=yOR--_U-xf0MiIS1
 *
 * En medio de una tabla de entrenamiento eso parece un fallo del documento.
 * Se le quita el esquema, el `www.` y los parámetros de seguimiento —que no
 * hacen falta para llegar al vídeo— y queda algo tecleable:
 *
 *   youtube.com/shorts/Cxp6D7LEqjM
 *
 * Los parámetros se descartan porque los de YouTube (`si=`, `t=`, `feature=`)
 * son de procedencia y reproducción, no de identidad. Si algún día un enlace
 * necesitara los suyos para funcionar, este es el sitio de matizarlo.
 */
export function urlCorta(url: string): string {
  try {
    const u = new URL(url);
    return `${u.hostname.replace(/^www\./, '')}${u.pathname}`.replace(/\/$/, '');
  } catch {
    return url;
  }
}

/** Si el enlace es de YouTube. Solo cambia la etiqueta que se enseña. */
export function esYouTube(url: string): boolean {
  try {
    const host = new URL(url).hostname.replace(/^www\./, '');
    return host === 'youtube.com' || host === 'm.youtube.com' || host === 'youtu.be';
  } catch {
    return false;
  }
}

// ── Recorrido ──────────────────────────────────────────────────────────────

/** Todos los ejercicios del documento, en orden de lectura. */
export function ejerciciosDe(contenido: Contenido): EjercicioPlantilla[] {
  return contenido.dias.flatMap((d) => d.bloques.flatMap((b) => b.ejercicios));
}

/** Cuántas series hay en total en una semana concreta. Para el resumen. */
export function seriesEnSemana(contenido: Contenido, semana: number): number {
  return ejerciciosDe(contenido).reduce(
    (total, e) => total + (e.semanas[semana]?.series.length ?? 0),
    0,
  );
}

/**
 * Tonelaje de una semana: suma de peso × repeticiones de cada serie.
 *
 * Solo cuenta las series donde AMBOS datos son numéricos. Una serie sin carga
 * prescrita no vale cero: vale «no se sabe», y sumarla como cero produciría
 * un total que parece bajo cuando en realidad está incompleto. Por eso se
 * devuelve también cuántas quedaron fuera.
 */
export function tonelajeSemana(
  contenido: Contenido,
  semana: number,
): { kg: number; seriesContadas: number; seriesSinDatos: number } {
  let kg = 0;
  let contadas = 0;
  let sinDatos = 0;

  for (const ejercicio of ejerciciosDe(contenido)) {
    for (const serie of ejercicio.semanas[semana]?.series ?? []) {
      const reps = repeticionesNumericas(serie.reps);
      if (serie.pesoKg === null || reps === null) {
        sinDatos += 1;
        continue;
      }
      kg += serie.pesoKg * reps;
      contadas += 1;
    }
  }

  return { kg: Math.round(kg), seriesContadas: contadas, seriesSinDatos: sinDatos };
}

/**
 * Las repeticiones como número, o `null` si no lo son.
 *
 * «8» cuenta. «8-10» NO cuenta, y no se toma el punto medio ni el extremo
 * bajo: elegir uno de los dos sería inventar la prescripción que el
 * entrenador dejó deliberadamente abierta. «al fallo» tampoco, obviamente.
 */
export function repeticionesNumericas(reps: string): number | null {
  const limpio = reps.trim();
  if (!/^\d+$/.test(limpio)) return null;
  const n = Number(limpio);
  return Number.isFinite(n) && n > 0 ? n : null;
}

// ── Redimensionar el bloque ────────────────────────────────────────────────

/**
 * Ajusta cada ejercicio a `semanas` entradas. Invariante 1.
 *
 * Al ampliar copia la última semana; al recortar corta por el final.
 */
export function redimensionar(contenido: Contenido, semanas: number): Contenido {
  const mapear = (e: EjercicioPlantilla): EjercicioPlantilla => {
    if (e.semanas.length === semanas) return e;

    if (e.semanas.length > semanas) {
      return { ...e, semanas: e.semanas.slice(0, semanas) };
    }

    const ultima = e.semanas[e.semanas.length - 1];
    const relleno: SemanaEjercicio[] = Array.from(
      { length: semanas - e.semanas.length },
      () => clonarSemana(ultima),
    );
    return { ...e, semanas: [...e.semanas, ...relleno] };
  };

  return {
    dias: contenido.dias.map((d) => ({
      ...d,
      bloques: d.bloques.map((b) => ({ ...b, ejercicios: b.ejercicios.map(mapear) })),
    })),
  };
}

/**
 * Cuántas series se perderían al recortar a `semanas`.
 *
 * Existe para poder preguntar antes de destruir. Cero significa que el
 * recorte es inocuo (las semanas que se van estaban vacías).
 */
export function seriesQueSePierden(contenido: Contenido, semanas: number): number {
  let total = 0;
  for (const ejercicio of ejerciciosDe(contenido)) {
    for (const sem of ejercicio.semanas.slice(semanas)) {
      total += sem.series.filter((s) => !serieEstaVacia(s)).length;
    }
  }
  return total;
}

/** Una semana sin nada escrito. Se usa para no avisar de pérdidas irrelevantes. */
export const serieEstaVacia = (s: Serie): boolean =>
  s.reps.trim() === '' && s.pesoKg === null && s.rir === null && (s.notas ?? '') === '';

const clonarSemana = (s: SemanaEjercicio | undefined): SemanaEjercicio =>
  s === undefined
    ? { series: [serieVacia()] }
    : { series: s.series.map((x) => ({ ...x })) };

// ── Ajustes por cliente ────────────────────────────────────────────────────

/** La dirección de una serie. Un solo sitio la construye, para que no diverja. */
export const direccion = (ejercicioId: string, semana: number, serie: number): string =>
  `${ejercicioId}:${semana}:${serie}`;

/**
 * La plantilla tal como la ve UN cliente concreto.
 *
 * Devuelve una copia con los ajustes aplicados encima. Lo que el ajuste no
 * menciona se queda como está en la plantilla madre, y esa es la razón de que
 * los ajustes guarden solo diferencias: cuando el entrenador corrige el
 * original, la corrección llega a todos los que no tenían ajuste en ese punto.
 *
 * Nunca muta la entrada.
 */
export function aplicarAjustes(contenido: Contenido, ajustes: Ajustes): Contenido {
  if (Object.keys(ajustes).length === 0) return contenido;

  const mapearEjercicio = (e: EjercicioPlantilla): EjercicioPlantilla => ({
    ...e,
    semanas: e.semanas.map((sem, iSemana) => ({
      series: sem.series.map((serie, iSerie) => {
        const ajuste = ajustes[direccion(e.id, iSemana, iSerie)];
        if (!ajuste) return serie;
        return {
          ...serie,
          // `?? serie.x` y no `||`: un ajuste que ponga `pesoKg: null`
          // significa «quítale la carga a este cliente», y `||` lo
          // confundiría con «no lo ajustes».
          reps: ajuste.reps ?? serie.reps,
          pesoKg: 'pesoKg' in ajuste ? (ajuste.pesoKg ?? null) : serie.pesoKg,
          rir: 'rir' in ajuste ? (ajuste.rir ?? null) : serie.rir,
        };
      }),
    })),
  });

  return {
    dias: contenido.dias.map((d) => ({
      ...d,
      bloques: d.bloques.map((b) => ({ ...b, ejercicios: b.ejercicios.map(mapearEjercicio) })),
    })),
  };
}

/**
 * Quita los ajustes que ya no apuntan a ninguna serie existente.
 *
 * Se ejecuta al guardar la plantilla. Sin esto, borrar un ejercicio dejaría
 * ajustes huérfanos que reaparecerían si algún día se reutilizara su id — y
 * que, mientras tanto, engordan la fila sin que nadie los vea.
 */
export function podarAjustes(contenido: Contenido, ajustes: Ajustes): Ajustes {
  const vivas = new Set<string>();
  for (const e of ejerciciosDe(contenido)) {
    e.semanas.forEach((sem, iSemana) => {
      sem.series.forEach((_, iSerie) => vivas.add(direccion(e.id, iSemana, iSerie)));
    });
  }

  const salida: Ajustes = {};
  for (const [clave, valor] of Object.entries(ajustes)) {
    if (vivas.has(clave)) salida[clave] = valor;
  }
  return salida;
}

// ── Validación ─────────────────────────────────────────────────────────────

/**
 * Lo que impide guardar, y nada más.
 *
 * NO valida entrenamiento. Un RIR de 8 o un descanso de 40 minutos son
 * decisiones del entrenador y el sistema no opina. Lo que sí comprueba es que
 * la estructura sea la que el resto del código da por hecha: si un ejercicio
 * llegara con menos semanas de las declaradas, la rejilla pintaría huecos.
 */
export function problemasDe(contenido: Contenido, semanas: number): string[] {
  const problemas: string[] = [];
  const ids = new Set<string>();

  if (semanas < 1 || semanas > 24 || !Number.isInteger(semanas)) {
    problemas.push('El número de semanas tiene que ser un entero entre 1 y 24.');
  }

  for (const dia of contenido.dias) {
    if (dia.nombre.trim() === '') problemas.push('Hay un día sin nombre.');

    for (const bloque of dia.bloques) {
      for (const ejercicio of bloque.ejercicios) {
        if (ejercicio.nombre.trim() === '') {
          problemas.push(`Hay un ejercicio sin nombre en «${dia.nombre}».`);
        }
        if (ids.has(ejercicio.id)) {
          // Invariante 2. Pasaría al duplicar un ejercicio sin renovar su id,
          // y haría que los ajustes de un cliente cayeran en los dos.
          problemas.push(`El ejercicio «${ejercicio.nombre}» tiene un identificador repetido.`);
        }
        ids.add(ejercicio.id);

        if (ejercicio.semanas.length !== semanas) {
          problemas.push(
            `«${ejercicio.nombre}» tiene ${ejercicio.semanas.length} semanas y el bloque declara ${semanas}.`,
          );
        }
      }
    }
  }

  return problemas;
}

// ── Lo único no determinista del módulo ────────────────────────────────────

/**
 * Identificador de un elemento del documento.
 *
 * `crypto.randomUUID` está en Node y en todos los navegadores que la
 * aplicación soporta. El respaldo existe para contextos sin `crypto` seguro
 * (algún entorno de prueba), y no pretende ser criptográfico: estos ids no
 * protegen nada, solo direccionan dentro de un documento que ya está
 * protegido por la RLS.
 */
export function nuevoId(): string {
  if (typeof crypto !== 'undefined' && typeof crypto.randomUUID === 'function') {
    return crypto.randomUUID();
  }
  return `e${Date.now().toString(36)}${Math.random().toString(36).slice(2, 10)}`;
}
