// ── Capa de evidencia · contratos (Sprint PAS-10E) ─────────────────────────
//
// QUÉ ES ESTA CAPA Y QUÉ NO ES.
//
//   NO es una segunda NKB. La NKB contiene normas admitidas tras un
//   procedimiento formal, y este sprint no la toca. Esto es el **registro de
//   trabajo del PAS** (§22): dónde se anota qué evidencia se ha localizado para
//   cada prueba, qué autoriza a afirmar y qué no.
//
//   Una entrada de aquí NO es una norma. Puede llegar a proponerse como tal,
//   y por eso cada fuente lleva su `estado`: lo que ya está en la NKB se
//   reutiliza por clave y no se copia (§23); lo nuevo entra como `propuesta` y
//   ahí se queda hasta que alguien la admita.
//
// LA DISTINCIÓN QUE JUSTIFICA TODO EL SPRINT (§17):
//
//   `SIN_EVIDENCIA_UTILIZABLE` — no existe literatura convertible en referencia.
//   `NO_DETERMINABLE`          — la evidencia existe, pero falta un dato del
//                                atleta o del registro para poder aplicarla.
//
//   El sistema venía diciendo lo primero cuando lo cierto era lo segundo. Son
//   respuestas opuestas: una cierra la puerta, la otra dice qué falta para
//   abrirla.

/** Qué clase de afirmación sostiene una fuente. Nunca se mezclan entre sí. */
export type TipoEvidencia =
  /** Percentiles, rangos o puntos de corte de una población. */
  | 'NORMATIVA'
  /** Media, desviación típica, mediana. Describe, no clasifica. */
  | 'DESCRIPTIVA'
  /** Distribución de atletas o competidores. No es norma poblacional. */
  | 'BENCHMARK'
  /** ICC, CV. Cuán reproducible es la medida. */
  | 'FIABILIDAD'
  /** SEM, MDC, error típico, límites de acuerdo. */
  | 'ERROR_MEDICION'
  /** Correlaciones y relaciones. Jamás una clasificación. */
  | 'ASOCIACION'
  /** Qué mide realmente la prueba. Sostiene prohibiciones, no comparaciones. */
  | 'VALIDEZ';

/**
 * Qué soporte tenemos DENTRO DEL PAS para una afirmación (§19).
 *
 * No es una nota de calidad científica del estudio. Un meta-análisis
 * impecable sobre fiabilidad es `D`, y no porque sea peor ciencia que una
 * tabla de percentiles: es que sostiene otra clase de afirmación.
 */
export type NivelEvidencia =
  /** Normativa poblacional robusta, muestra amplia, metodología sólida. */
  | 'A'
  /** Referencia relevante con limitaciones declaradas. */
  | 'B'
  /** Estudio específico de cobertura menor. */
  | 'C'
  /** Fiabilidad o error de medición. */
  | 'D'
  /** Evidencia indirecta o derivada. */
  | 'E';

/** Hasta dónde cubre la fuente al atleta que se está evaluando (§6). */
export type Cobertura = 'COMPLETA' | 'PARCIAL' | 'LIMITADA' | 'NO_COMPATIBLE';

/**
 * Qué puede decirse de una prueba concreta para un atleta concreto (§18).
 *
 * Seis estados que NO se colapsan. El error que este sprint corrige era
 * exactamente colapsarlos en «sin evidencia».
 */
export type EstadoEvidencia =
  /** Hay una referencia que pasa las siete condiciones de compatibilidad. */
  | 'EVIDENCIA_COMPATIBLE'
  /** Hay evidencia, pero de otra clase que la buscada (p. ej. solo fiabilidad). */
  | 'EVIDENCIA_PARCIAL'
  /** Existe evidencia, pero su población o su protocolo no corresponden. */
  | 'EVIDENCIA_NO_COMPATIBLE'
  /** Existe evidencia aplicable, pero falta una variable del ATLETA. */
  | 'NO_DETERMINABLE'
  /** Existe evidencia aplicable, pero falta una condición del REGISTRO. */
  | 'NO_COMPARABLE'
  /** No se ha localizado literatura convertible en referencia. */
  | 'SIN_EVIDENCIA_UTILIZABLE';

/** En qué situación está la fuente respecto a las bases formales (§22). */
export type EstadoFuente =
  /** Ya vive en la NKB o en la PKB. Aquí solo se referencia por clave. */
  | 'admitida'
  /** Localizada y verificada en origen, pendiente de procedimiento de admisión. */
  | 'propuesta'
  /** Localizada pero NO recuperada: no puede sostener ninguna afirmación. */
  | 'sin_verificar';

/**
 * Una fuente científica.
 *
 * `claveExterna` apunta a la entrada de la PKB o la NKB cuando ya existe allí.
 * En ese caso los campos bibliográficos se OMITEN: duplicarlos crearía dos
 * copias de la misma cita que acabarían divergiendo (§23).
 */
export interface FuenteEvidencia {
  id: string;
  estado: EstadoFuente;
  /** Clave en `docs/performance-knowledge-base/_evidencia/referencias.yaml`. */
  claveExterna: string | null;
  /** Solo para fuentes que no están todavía en ninguna base. */
  cita: {
    autores: string;
    anio: number;
    titulo: string;
    publicacion: string;
    localizador: string;
  } | null;
  /** Qué población midió. Literal de la fuente, sin redondear. */
  poblacion: string;
  /** Qué autoriza a afirmar. En positivo y sin ambigüedad. */
  sostiene: string;
  /** Qué NO autoriza a afirmar. Es el campo que impide leerla de más. */
  noSostiene: string;
}

/** A quién se aplica una referencia. `null` = la fuente no lo estratifica. */
export interface AmbitoReferencia {
  edadMin: number | null;
  edadMax: number | null;
  /** `'M'`, `'F'` o `null` si la fuente no separa por sexo. */
  sexo: 'M' | 'F' | null;
  /** ISO-3166-1 alfa-2, o `null` si es internacional. */
  pais: string | null;
  /** `'general'`, `'deportiva'`, `'escolar'`, `'competicion'`. */
  contexto: string;
  /** Condiciones de registro que la fuente exige que coincidan. */
  protocolo: Readonly<Record<string, string>>;
  unidad: string;
}

/** Cómo publica sus valores la fuente. Nunca se traduce un tipo en otro (§7). */
export type Representacion =
  | { clase: 'percentiles'; puntos: readonly { p: number; valor: number }[] }
  | { clase: 'media_dt'; media: number; dt: number }
  | { clase: 'rango'; min: number; max: number }
  | { clase: 'punto_de_corte'; valor: number; porDebajo: string; porEncima: string }
  | { clase: 'fiabilidad'; icc: readonly [number, number] | null; cvPct: number | null }
  | {
      clase: 'error_medicion';
      /** En unidades de la prueba. `null` si la fuente no lo publica. */
      sem: number | null;
      mdc: number | null;
      /** MDC expresado en porcentaje, cuando la fuente lo publica así. */
      mdcPct: number | null;
    }
  /**
   * La fuente publica valores utilizables, pero **todavía no se han
   * transcrito** a este sistema.
   *
   * Es un tercer estado que no existía y hacía falta. «No hay norma» y «la
   * norma existe, está verificada, y falta cargar su tabla» son situaciones
   * opuestas para quien planifica: la primera exige investigación, la segunda
   * solo trabajo de transcripción. Colapsarlas fue justo el defecto que este
   * sprint corrige.
   */
  | { clase: 'valores_sin_transcribir'; queSePublica: string };

/** Una referencia concreta: una fuente aplicada a un ámbito con un formato. */
export interface ReferenciaEvidencia {
  id: string;
  pruebaId: string;
  fuenteId: string;
  tipo: TipoEvidencia;
  nivel: NivelEvidencia;
  ambito: AmbitoReferencia;
  representacion: Representacion;
  /** Limitaciones literales de la fuente. Viajan con la referencia siempre. */
  limitaciones: readonly string[];
  /**
   * Variables del atleta sin las cuales esta referencia no puede aplicarse.
   * Su ausencia produce `NO_DETERMINABLE`, nunca `SIN_EVIDENCIA_UTILIZABLE`.
   */
  variablesAtleta: readonly string[];
}

/** Dónde cae el valor observado. Se calcula, no se clasifica. */
export type Posicion =
  | { clase: 'percentil_exacto'; p: number }
  | { clase: 'entre_percentiles'; inferior: number; superior: number }
  | { clase: 'fuera_por_debajo'; primerPercentil: number }
  | { clase: 'fuera_por_encima'; ultimoPercentil: number }
  | { clase: 'desviaciones'; z: number }
  | { clase: 'dentro_del_rango' }
  | { clase: 'fuera_del_rango'; lado: 'inferior' | 'superior' }
  | { clase: 'respecto_al_corte'; lado: 'por_debajo' | 'por_encima' | 'en_el_corte' };

/** Qué falta, cuando falta algo. Accionable, nunca «datos incompletos». */
export interface Carencia {
  /** `'peso_kg'`, `'protocolo'`, `'sexo'`… */
  variable: string;
  /**
   * Quién tiene el hueco, que decide el estado y a quién hay que pedírselo:
   *
   *   · `atleta`   → falta un dato de su ficha        → `NO_DETERMINABLE`
   *   · `registro` → falta una condición de medición  → `NO_COMPARABLE`
   *   · `sistema`  → la fuente existe y nos falta cargarla → `EVIDENCIA_PARCIAL`
   *
   * El tercero se declara porque no es culpa de nadie del otro lado de la
   * pantalla, y esconderlo entre los otros dos haría pedir al profesional un
   * dato que ya tiene.
   */
  origen: 'atleta' | 'registro' | 'sistema';
  /** Frase ya redactada: qué falta y qué se podría decir con ello. */
  detalle: string;
}

/** Lo que la capa entrega por cada prueba evaluada. */
export interface LecturaEvidencia {
  pruebaId: string;
  estado: EstadoEvidencia;
  /**
   * Las referencias compatibles. **Puede haber más de una y no se elige** —
   * misma doctrina que el NIE: se particiona, no se selecciona.
   */
  compatibles: readonly {
    referencia: ReferenciaEvidencia;
    posicion: Posicion | null;
    /**
     * La norma es de otra población que la del atleta (PAS-13).
     *
     * No impide situar el resultado —una prueba estandarizada mide lo mismo en
     * todas partes— pero **obliga a nombrar de quién es la norma**. Presentar
     * un percentil canadiense sin decirlo lo convertiría en uno colombiano.
     */
    poblacionAjena: boolean;
  }[];
  /** Las descartadas, con el motivo. Una ausencia sin motivo no es información. */
  descartadas: readonly { referencia: ReferenciaEvidencia; motivo: string }[];
  /** Qué falta para poder decir más. Vacío cuando no falta nada. */
  carencias: readonly Carencia[];
  /** Evidencia de otra clase que sí es utilizable (fiabilidad, error). */
  complementarias: readonly ReferenciaEvidencia[];
}
