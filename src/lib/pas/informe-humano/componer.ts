// ── De resultado científico a resultado humano (Sprint PAS-8) ──────────────
//
// TRANSPORTA. No recalcula, no interpreta y no clasifica.
//
// Cada campo del `ResultadoHumano` procede de algo que otra capa ya decidió:
// el valor observado del registro, la lectura normativa de `report-v2`, el
// nombre humano del catálogo, el dominio de `capacidades.ts`. Lo único que se
// calcula aquí es la diferencia entre dos mediciones del mismo atleta, que es
// aritmética sobre datos suyos y no una afirmación sobre ninguna población.
//
// LO QUE NO HACE, Y HAY QUE SEGUIR SIN HACER:
//
//   · No convierte z en percentil. La lectura llega ya redactada.
//   · No interpola. Si la fuente publica un intervalo, se muestra el intervalo.
//   · No clasifica. No existe «bueno», «alto» ni «adecuado» en ningún camino.
//   · No elige norma. Si hay dos comparables, salen dos resultados.
//   · No convierte unidades. La tendencia solo compara lo que ya es comparable.
//
// Módulo puro.

import { CAPACIDADES, DOMINIOS } from '@/lib/pas/capacidades';
import type { CatalogoPruebas } from '@/lib/pas/tipos';
import type { InformeNormativoV2, TarjetaNormativa } from '@/lib/pas/report-v2';

import { comoTexto, interpretar } from '@/lib/pas/interpretacion';
import { leerEvidencia, type SujetoEvidencia } from '@/lib/pas/evidencia';
import {
  calcularProgreso,
  construirSerie,
  type DireccionMejora,
  type SerieLongitudinal,
} from '@/lib/pas/seguimiento';

import { objetivoDe, type ObjetivoAtleta } from './objetivos';
import type { LecturaEvidencia } from '@/lib/pas/evidencia';
import type {
  Alerta,
  ClaseReferencia,
  DetallesTecnicos,
  GrupoDominio,
  InformeHumano,
  PanelObjetivos,
  ReferenciaNormativa,
  RelacionObjetivo,
  ResultadoHumano,
  ResumenAtleta,
  Tendencia,
} from './tipos';

// ─── Nombres humanos ────────────────────────────────────────────────────────

/**
 * El nombre legible de la prueba. Nunca el código.
 *
 * Llega como dato, no se busca en `CatalogoPruebas`: ese tipo declara la
 * naturaleza y las contribuciones de cada prueba, pero los nombres viven en el
 * catálogo del Workspace, y esta capa no puede importar de `features/` sin
 * invertir el orden de las dependencias.
 *
 * Sin nombre declarado se devuelve el id. Ocultarlo dejaría una tarjeta
 * anónima, y eso solo ocurre con una prueba retirada del catálogo — donde el
 * id es la información honesta.
 */
function nombreDe(pruebaId: string, nombres: Readonly<Record<string, string>>): string {
  const nombre = nombres[pruebaId];
  return typeof nombre === 'string' && nombre !== '' ? nombre : pruebaId;
}

/**
 * El dominio al que contribuye la prueba, con su nombre legible.
 *
 * Sale del catálogo y de `capacidades.ts`, que ya clasifica las veinte
 * capacidades en seis dominios. No se inventa ninguna taxonomía nueva: la que
 * hay está respaldada por la PKB.
 *
 * `null` cuando la prueba no tiene correspondencia autorizada — que es un dato,
 * no un hueco: significa que la matriz de la PKB no la respalda.
 */
function dominioDe(
  pruebaId: string,
  catalogo: CatalogoPruebas,
): { id: string; nombre: string } | null {
  const def = catalogo.pruebas.find((p) => p.id === pruebaId);
  const primera = def?.contribuciones[0];
  if (!primera) return null;

  const capacidad = CAPACIDADES.find((c) => c.id === primera.capacidad);
  if (!capacidad) return null;

  return { id: capacidad.dominio, nombre: DOMINIOS[capacidad.dominio] };
}

// ─── Referencia normativa ───────────────────────────────────────────────────

/** Qué clase de comparación publicó la fuente, leída de la lectura ya hecha. */
function claseDe(t: TarjetaNormativa): ClaseReferencia {
  const r = t.resumenResultado ?? '';
  if (r.startsWith('z =')) return 'distancia_media';
  if (r.startsWith('entre P')) return 'intervalo';
  if (r.startsWith('por ')) return 'fuera_de_rango';
  return 'percentil';
}

const SIN: Omit<ReferenciaNormativa, 'estado' | 'explicacion'> = {
  clase: null,
  resumen: null,
  posicion: null,
  poblacion: null,
  metodo: null,
  escala: null,
  aria: null,
};

/**
 * Por qué no hubo comparación, cuando no la hubo.
 *
 * PAS-8 colapsaba los tres casos en `SIN_REFERENCIA`, y no son lo mismo:
 *
 *   · **Sin referencia** — la base no cubre esta variable, o ninguna norma
 *     corresponde a este perfil. La respuesta es «no la hay».
 *   · **No comparable** — sí hay normas de la variable, pero el método no es
 *     equivalente. La respuesta es «las hay, pero no para cómo se midió».
 *   · **No determinable** — no se sabe si alguna corresponde, porque falta
 *     declarar el método. La respuesta es «no lo sabemos».
 *
 * La distinción se lee del panel de comparabilidad, que ya la trae resuelta
 * desde PRS-2.3. Aquí no se reevalúa nada.
 */
function sinReferencia(
  registroId: string,
  informe: InformeNormativoV2,
): ReferenciaNormativa {
  const panel = informe.comparabilidad[registroId];

  // Sin panel, la prueba no llegó siquiera a consultarse: la base no cubre
  // esta variable.
  if (!panel) {
    return {
      ...SIN,
      estado: 'SIN_REFERENCIA',
      explicacion:
        'No existe actualmente una referencia normativa compatible con este protocolo y este ' +
        'perfil. El resultado se conserva para seguimiento longitudinal.',
    };
  }

  const indeterminadas = panel.descartes.find((d) => d.naturaleza === 'sin determinar');
  if (indeterminadas) {
    return {
      ...SIN,
      estado: 'NO_DETERMINABLE',
      explicacion:
        'No puede determinarse si existe una referencia compatible: falta declarar cómo se ' +
        'tomó la medición. El resultado se conserva para seguimiento longitudinal.',
    };
  }

  const noComparables = panel.descartes.find((d) => d.naturaleza === 'no comparables');
  if (noComparables) {
    return {
      ...SIN,
      estado: 'NO_COMPARABLE',
      explicacion:
        'Existen referencias para esta variable, pero ninguna es comparable con el método ' +
        'empleado. El resultado se conserva para seguimiento longitudinal.',
    };
  }

  return {
    ...SIN,
    estado: 'SIN_REFERENCIA',
    explicacion:
      'No existe actualmente una referencia normativa compatible con este protocolo y este ' +
      'perfil. El resultado se conserva para seguimiento longitudinal.',
  };
}

function referenciaDe(t: TarjetaNormativa): ReferenciaNormativa {
  return {
    estado: 'DISPONIBLE',
    clase: claseDe(t),
    resumen: t.resumenResultado,
    posicion: t.posicion,
    explicacion: t.explicacion,
    poblacion: t.poblacion,
    metodo: t.metodo,
    escala: t.escala,
    aria: t.aria,
  };
}

// ─── Tendencia ──────────────────────────────────────────────────────────────

/** Una medición anterior del mismo atleta, ya filtrada por quien la aporta. */
export interface MedicionPrevia {
  pruebaId: string;
  valor: number;
  unidad: string;
  fecha: string;
  /** Condiciones declaradas. Se comparan para no cruzar métodos distintos. */
  condiciones: Record<string, string>;
}

/**
 * La serie completa de la prueba, con la medición actual al final.
 *
 * Solo entran las anteriores en sentido estricto: una medición del MISMO día no
 * es «la anterior», porque entre dos tomas de la misma fecha el sistema no
 * conoce ningún orden. Filtrarlas aquí es lo que hace que la serie no invente
 * una cronología que nadie registró.
 */
function serieDe(
  actual: { valor: number; unidad: string; fecha: string; condiciones: Record<string, string> },
  pruebaId: string,
  previas: readonly MedicionPrevia[],
): SerieLongitudinal {
  const anteriores = previas.filter((p) => p.pruebaId === pruebaId && p.fecha < actual.fecha);
  return construirSerie(pruebaId, [...anteriores, { pruebaId, ...actual }]);
}

/**
 * Cómo cambió respecto a la medición anterior comparable.
 *
 * **Se lee de la serie, no se recalcula** (PAS-10). Antes había aquí una
 * segunda definición de «comparable», paralela a la de `construirSerie`; dos
 * definiciones de lo mismo divergen en cuanto una de las dos se toca, y
 * entonces la tarjeta y el histórico dirían cosas distintas del mismo dato.
 *
 * «Comparable» sigue exigiendo misma prueba, misma unidad y mismas condiciones
 * de método. Dos prensiones medidas con dinamómetros distintos no forman una
 * tendencia: es el mismo motivo por el que no formarían una comparación
 * normativa (EQ-3), aplicado al historial de una sola persona.
 *
 * La resta es aritmética sobre datos del propio atleta. No afirma nada sobre
 * ninguna población, y por eso vive aquí y no en el NIE.
 */
function tendenciaDe(
  actual: { valor: number; fecha: string },
  serie: SerieLongitudinal,
): Tendencia {
  const base: Tendencia = {
    disponible: false,
    valorAnterior: null,
    fechaAnterior: null,
    valorActual: actual.valor,
    fechaActual: actual.fecha,
    cambioAbsoluto: null,
    cambioRelativo: null,
    motivo: null,
  };

  // El tramo actual es el que contiene la medición de hoy, y su penúltimo punto
  // es «la anterior comparable» por construcción. Tomarlo no es elegir entre
  // alternativas: es la definición de anterior.
  const tramo = serie.tramoActual;
  const previa = tramo ? (tramo.puntos[tramo.puntos.length - 2] ?? null) : null;

  if (previa === null) {
    if (serie.puntos.length <= 1) {
      return { ...base, motivo: 'No hay ninguna medición anterior de esta prueba.' };
    }

    // Sí las hay, pero la serie se partió justo antes. El motivo de la ruptura
    // se transporta literal: decir «no hay medición anterior» cuando las hay en
    // otra unidad sería disfrazar una incomparabilidad de ausencia de datos.
    const ruptura = serie.rupturas[serie.rupturas.length - 1];
    return { ...base, motivo: `Hay mediciones anteriores, pero ${primeraMinuscula(ruptura.detalle)}` };
  }

  const cambio = actual.valor - previa.valor;

  return {
    disponible: true,
    valorAnterior: previa.valor,
    fechaAnterior: previa.fecha,
    valorActual: actual.valor,
    fechaActual: actual.fecha,
    cambioAbsoluto: cambio,
    // Dividir por cero daría infinito, y un «+∞ %» no informa de nada.
    cambioRelativo: previa.valor === 0 ? null : cambio / previa.valor,
    motivo: null,
  };
}

/** Encadena el detalle de la ruptura tras «pero». Solo presentación. */
function primeraMinuscula(s: string): string {
  return s.charAt(0).toLowerCase() + s.slice(1);
}

// ─── Objetivo ───────────────────────────────────────────────────────────────

/**
 * El avance hacia el objetivo declarado, si puede expresarse.
 *
 * La dirección la pone el CATÁLOGO, no el objetivo (PAS-10). Que una prueba
 * mejore hacia arriba o hacia abajo es una propiedad del instrumento; lo que
 * declara el objetivo es una intención. Cuando las dos se contradicen no se
 * elige una: se declara el conflicto y no se muestra porcentaje.
 */
function objetivoRelacionado(
  pruebaId: string,
  actual: { valor: number; unidad: string },
  objetivos: readonly ObjetivoAtleta[],
  direcciones: Readonly<Record<string, DireccionMejora | null>>,
): RelacionObjetivo {
  const objetivo = objetivoDe(objetivos, pruebaId);
  if (objetivo === null) {
    const activos = objetivos.filter((o) => o.pruebaId === pruebaId && o.estado === 'activo');
    return {
      disponible: false,
      objetivo: null,
      progreso: null,
      superado: false,
      mantenimiento: null,
      motivoCodigo: null,
      motivo:
        activos.length > 1
          ? 'Hay más de un objetivo activo para esta prueba. Revísalos antes de seguir el progreso.'
          : null,
    };
  }

  const progreso = calcularProgreso({
    // Una prueba ausente del mapa y una declarada sin dirección son lo mismo
    // aquí: en ninguno de los dos casos consta hacia dónde mejora.
    direccion: direcciones[pruebaId] ?? null,
    tipo: objetivo.tipo,
    valorInicial: objetivo.valorInicial,
    valorObjetivo: objetivo.valorObjetivo,
    rango: objetivo.rango,
    valorActual: actual.valor,
    unidadObjetivo: objetivo.unidad,
    unidadMedicion: actual.unidad,
  });

  if (!progreso.calculable) {
    return {
      disponible: true,
      objetivo,
      progreso: null,
      superado: false,
      mantenimiento: null,
      motivoCodigo: progreso.motivo,
      // El detalle viaja literal desde el motor: reescribirlo aquí crearía una
      // segunda explicación del mismo hecho, y las dos acabarían divergiendo.
      motivo: progreso.detalle,
    };
  }

  // Mantenerse dentro de un rango no se traduce a un porcentaje: `progreso`
  // queda en `null` y la posición viaja en su propio campo.
  if (progreso.clase === 'mantenimiento') {
    return {
      disponible: true,
      objetivo,
      progreso: null,
      superado: false,
      mantenimiento: progreso.posicion,
      motivoCodigo: null,
      motivo: null,
    };
  }

  return {
    disponible: true,
    objetivo,
    progreso: progreso.proporcion,
    superado: progreso.superado,
    mantenimiento: null,
    motivoCodigo: null,
    motivo: null,
  };
}

// ─── Panel de objetivos y resumen (§9, §22, §23, §25) ───────────────────────

/**
 * Clasifica los objetivos del atleta.
 *
 * `sinDatos` y `sinPuntoDePartida` son VISTAS sobre `activos`, no categorías
 * excluyentes: un objetivo puede estar en las dos a la vez. Ver `PanelObjetivos`.
 */
function clasificarObjetivos(
  objetivos: readonly ObjetivoAtleta[],
  conMedicion: ReadonlySet<string>,
): PanelObjetivos {
  const activos = objetivos.filter((o) => o.estado === 'activo');

  // Las pruebas con más de un objetivo activo. Se agrupan en vez de elegir uno:
  // el sistema detecta el conflicto y lo muestra, pero no lo resuelve (§25).
  const porPrueba = new Map<string, ObjetivoAtleta[]>();
  for (const o of activos) porPrueba.set(o.pruebaId, [...(porPrueba.get(o.pruebaId) ?? []), o]);

  return {
    activos,
    // «Alcanzado» es un estado que marca el profesional, no una conclusión que
    // saque el sistema de comparar el valor con la meta: dar por cumplido un
    // objetivo es una decisión, y no le corresponde a esta capa tomarla.
    alcanzados: objetivos.filter((o) => o.estado === 'cumplido'),
    pausados: objetivos.filter((o) => o.estado === 'pausado'),
    sinDatos: activos.filter((o) => !conMedicion.has(o.pruebaId)),
    sinPuntoDePartida: activos.filter((o) => o.valorInicial === null),
    enConflicto: [...porPrueba.entries()]
      .filter(([, os]) => os.length > 1)
      .map(([pruebaId, os]) => ({ pruebaId, objetivos: os })),
  };
}

/**
 * Las cuentas de cabecera y lo que falta para poder decir más.
 *
 * Ninguna alerta juzga al atleta: todas señalan un dato ausente y qué se podría
 * afirmar si estuviera. Es la diferencia entre «te falta algo» y «falta algo».
 */
function resumirAtleta(
  resultados: readonly ResultadoHumano[],
  panel: PanelObjetivos,
): ResumenAtleta {
  const alertas: Alerta[] = [];

  const sinMetodo = resultados.filter((r) => r.referencia.estado === 'NO_DETERMINABLE').length;
  if (sinMetodo > 0) {
    alertas.push({
      codigo: 'METODO_SIN_DECLARAR',
      texto:
        sinMetodo === 1
          ? 'En un resultado no consta cómo se midió, así que no puede saberse si existe una ' +
            'referencia comparable.'
          : `En ${sinMetodo} resultados no consta cómo se midieron, así que no puede saberse si ` +
            'existe una referencia comparable.',
      total: sinMetodo,
    });
  }

  const interrumpidas = resultados.filter((r) => r.serie.rupturas.length > 0).length;
  if (interrumpidas > 0) {
    alertas.push({
      codigo: 'SERIE_INTERRUMPIDA',
      texto:
        `El historial de ${interrumpidas === 1 ? 'una prueba' : `${interrumpidas} pruebas`} se ` +
        'interrumpió por un cambio de método o de unidad. Las mediciones anteriores se conservan, ' +
        'pero no se comparan con las actuales.',
      total: interrumpidas,
    });
  }

  if (panel.sinPuntoDePartida.length > 0) {
    const n = panel.sinPuntoDePartida.length;
    alertas.push({
      codigo: 'OBJETIVO_SIN_PUNTO_DE_PARTIDA',
      texto:
        `${n === 1 ? 'Un objetivo activo no declara' : `${n} objetivos activos no declaran`} desde ` +
        'qué valor se partía, así que su avance no puede expresarse en porcentaje.',
      total: n,
    });
  }

  if (panel.enConflicto.length > 0) {
    const n = panel.enConflicto.length;
    alertas.push({
      codigo: 'OBJETIVOS_EN_CONFLICTO',
      texto:
        `${n === 1 ? 'Una prueba tiene' : `${n} pruebas tienen`} más de un objetivo activo. No se ` +
        'selecciona ninguno automáticamente.',
      total: n,
    });
  }

  return {
    // Distintas, no tarjetas: una medición con dos normas comparables produce
    // dos resultados de UNA sola prueba, y contarlas como dos inflaría la cifra.
    pruebasEvaluadas: new Set(resultados.map((r) => r.pruebaId)).size,
    resultados: resultados.length,
    conReferencia: resultados.filter((r) => r.referencia.estado === 'DISPONIBLE').length,
    conEvolucion: resultados.filter((r) => r.tendencia.disponible).length,
    objetivosActivos: panel.activos.length,
    objetivosAlcanzados: panel.alcanzados.length,
    alertas,
  };
}

// ─── Precedencia entre la NKB y el registro de evidencia ───────────────────

/**
 * Quién contesta al eje normativo de esta tarjeta.
 *
 * **Donde la NKB tiene cobertura, manda la NKB.** Su procedimiento de admisión
 * es más estricto que el registro de trabajo del PAS, y preguntar a los dos
 * por lo mismo produce dos respuestas para el mismo dato: era exactamente el
 * caso de P-03, comparada por la NKB y declarada «sin evidencia» por la capa
 * nueva en la misma tarjeta.
 *
 * La regla vive aquí, en una función con nombre, y no repartida por los
 * componentes: una precedencia implícita en tres `if` de JSX es una
 * precedencia que nadie puede auditar.
 */
function quienResponde(
  referencia: ReferenciaNormativa,
  evidencia: LecturaEvidencia,
): 'nkb' | 'evidencia' | 'ninguna' {
  if (referencia.estado === 'DISPONIBLE') return 'nkb';
  if (evidencia.estado === 'EVIDENCIA_COMPATIBLE') return 'evidencia';
  return 'ninguna';
}

// ─── Detalles técnicos ──────────────────────────────────────────────────────

function detallesDe(
  pruebaId: string,
  t: TarjetaNormativa | null,
  informe: InformeNormativoV2,
): DetallesTecnicos {
  const panel = t ? informe.comparabilidad[t.registroId] : undefined;
  return {
    pruebaId,
    normaId: t?.normaId ?? null,
    tipoNorma: t?.tipo ?? null,
    instrumento: t?.metodo ?? null,
    poblacion: t?.poblacion ?? null,
    nCelda: t?.nCelda ?? null,
    calidad: t?.calidad ?? null,
    estadoNorma: t?.estadoNorma ?? null,
    conflicto: t?.conflicto ?? null,
    unidad: t?.unidad ?? null,
    referencia: t?.referencia ?? null,
    motivo: t?.motivo ?? null,
    advertencias: t?.advertencias ?? [],
    descartes:
      panel?.descartes.map((d) => ({
        naturaleza: d.naturaleza,
        motivo: d.motivo,
        total: d.total,
      })) ?? [],
  };
}

// ─── Composición ────────────────────────────────────────────────────────────

export interface EntradaInformeHumano {
  informe: InformeNormativoV2;
  catalogo: CatalogoPruebas;
  /** `pruebaId` → nombre legible. Lo aporta quien conoce el catálogo visible. */
  nombres: Readonly<Record<string, string>>;
  /**
   * `pruebaId` → hacia dónde mejora la prueba (PAS-10).
   *
   * Llega como dato por el mismo motivo que los nombres: lo declara el catálogo
   * del Workspace y esta capa no puede importarlo sin invertir el orden de las
   * dependencias. Una prueba ausente, o declarada `null`, significa que no
   * consta la dirección — y entonces no se calcula ningún porcentaje.
   */
  direcciones: Readonly<Record<string, DireccionMejora | null>>;
  /**
   * Coordenadas del atleta para la capa de evidencia (PAS-10E.1).
   *
   * Es un tipo APARTE de `atleta`, que solo lleva lo que se muestra en la
   * portada. Aquí van las variables que una referencia puede exigir, y `null`
   * en cualquiera de ellas significa «no consta» — nunca un valor por defecto.
   */
  sujeto: SujetoEvidencia;
  /** Las mediciones de esta evaluación, en su orden de registro. */
  mediciones: readonly {
    registroId: string;
    pruebaId: string;
    valor: number;
    unidad: string;
    fecha: string;
    condiciones: Record<string, string>;
  }[];
  /** Mediciones anteriores del atleta, de cualquier evaluación previa. */
  previas: readonly MedicionPrevia[];
  objetivos: readonly ObjetivoAtleta[];
  atleta: { nombre: string; edad: number | null; sexo: string | null };
}

/**
 * Compone el informe humano.
 *
 * Una medición puede producir VARIOS resultados: si dos normas la comparan
 * —una TN-1 y una TN-2—, salen dos tarjetas. No se elige entre ellas, igual
 * que no lo hace ninguna capa por debajo.
 *
 * Y una medición sin ninguna norma comparable produce **exactamente un**
 * resultado, con la referencia declarada ausente. Que no haya norma no la
 * saca del informe: sigue teniendo valor, tendencia y objetivo.
 */
export function componerInformeHumano(entrada: EntradaInformeHumano): InformeHumano {
  const { informe, catalogo, nombres, direcciones, mediciones, previas, objetivos, atleta, sujeto } =
    entrada;

  const resultados: ResultadoHumano[] = mediciones.flatMap((m) => {
    const tarjetas = informe.tarjetas.filter((t) => t.registroId === m.registroId);
    const dominio = dominioDe(m.pruebaId, catalogo);

    // La serie se construye UNA vez y la tendencia se lee de ella. Así el par
    // anterior→actual de la tarjeta y el histórico completo no pueden
    // contradecirse: son la misma estructura leída con distinto alcance.
    const serie = serieDe(m, m.pruebaId, previas);

    // La evidencia se lee una vez por medición y viaja con el resultado. NO se
    // recalcula en la presentación: los componentes consumen esta lectura.
    const evidencia = leerEvidencia(
      { pruebaId: m.pruebaId, valor: m.valor, unidad: m.unidad, condiciones: m.condiciones },
      sujeto,
    );

    const comun = {
      pruebaId: m.pruebaId,
      nombre: nombreDe(m.pruebaId, nombres),
      dominio: dominio?.nombre ?? null,
      valorObservado: m.valor,
      unidad: m.unidad,
      fecha: m.fecha,
      tendencia: tendenciaDe(m, serie),
      objetivo: objetivoRelacionado(m.pruebaId, m, objetivos, direcciones),
      evidencia,
      serie,
    };

    // La interpretación se calcula sobre el resultado YA compuesto: las reglas
    // leen la referencia, la tendencia y el objetivo resueltos, y nunca los
    // datos crudos. Por eso se arma primero el resultado y se interpreta después.
    const conInterpretacion = (r: Omit<ResultadoHumano, 'interpretacion'>): ResultadoHumano => {
      const porEje = interpretar(r as ResultadoHumano);
      const texto = comoTexto(porEje);
      return { ...r, interpretacion: { disponible: texto !== null, texto, porEje } };
    };

    if (tarjetas.length === 0) {
      const referencia = sinReferencia(m.registroId, informe);
      return [
        conInterpretacion({
          ...comun,
          referencia,
          fuenteNormativa: quienResponde(referencia, evidencia),
          detalles: detallesDe(m.pruebaId, null, informe),
        }),
      ];
    }

    return tarjetas.map((t) => {
      const referencia = referenciaDe(t);
      return conInterpretacion({
        ...comun,
        referencia,
        fuenteNormativa: quienResponde(referencia, evidencia),
        detalles: detallesDe(m.pruebaId, t, informe),
      });
    });
  });

  // Los dominios son una VISTA sobre los mismos resultados, no una selección:
  // la unión reconstruye la lista entera y nadie se queda fuera.
  const porDominio = new Map<string, ResultadoHumano[]>();
  for (const r of resultados) {
    const clave = r.dominio ?? 'Sin dominio declarado';
    porDominio.set(clave, [...(porDominio.get(clave) ?? []), r]);
  }

  const dominios: GrupoDominio[] = [...porDominio.entries()].map(([nombre, rs]) => ({
    id: nombre,
    nombre,
    resultados: rs,
    conReferencia: rs.filter((r) => r.referencia.estado === 'DISPONIBLE').length,
  }));

  const conReferencia = resultados.filter((r) => r.referencia.estado === 'DISPONIBLE').length;

  const panelObjetivos = clasificarObjetivos(
    objetivos,
    new Set(resultados.map((r) => r.pruebaId)),
  );

  return {
    atleta,
    fecha: informe.portada.fecha,
    codigo: informe.portada.codigo,
    resultados,
    dominios,
    objetivos: panelObjetivos.activos,
    panelObjetivos,
    resumen: resumirAtleta(resultados, panelObjetivos),
    estadoGeneral:
      conReferencia === 0
        ? 'Ninguna de las mediciones de esta evaluación dispone de una referencia comparable.'
        : `${conReferencia} de ${resultados.length} resultados disponen de una referencia comparable.`,
    advertencias: informe.advertencias,
  };
}
