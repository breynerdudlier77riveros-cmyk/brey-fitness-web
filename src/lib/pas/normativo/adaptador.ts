// ── El eslabón PAS → NIE (PRS v2.0) ────────────────────────────────────────
//
// Toma un registro del PAS y un sujeto, y devuelve lo que el NIE responde.
// **No interpreta nada por su cuenta**: construye el contexto, entrega el
// valor y transporta la salida.
//
// Las tres decisiones que lo definen:
//
//   1 · Lo que no consta viaja como `null`. El NIE responde `NO_DETERMINABLE`,
//       que es la verdad; rellenar con un valor frecuente la convertiría en
//       una coincidencia inventada.
//   2 · No convierte unidades. Si el registro está en lbf y la norma en kgf,
//       lo dice el NIE, y convertir es una decisión externa (NIE-1.5).
//   3 · No elige norma. Devuelve `SalidaNIE` entera, con sus particiones.
//
// Módulo puro salvo por `cargarNormas`, que lee las fichas de la NKB: por eso
// las normas se reciben como parámetro y el módulo no las carga él mismo.

import {
  construirSalida,
  contextoVacio,
  interpretarNormativamente,
  resolver,
  crearValorObservado,
  type ContextoEvaluacion,
  type NormaNKB,
  type SalidaNIE,
  type ValoresNormativos,
} from '@/lib/nie';
import type { RegistroPrueba } from '@/lib/pas/tipos';

import { mapeoDe } from './mapeo';
import type { CoordenadaSinTraducir, MotivoSinConsulta, SujetoNormativo } from './tipos';

/** Lo que este eslabón devuelve por cada registro. */
export type ConsultaNormativa =
  | {
      estado: 'CONSULTADA';
      pruebaId: string;
      registroId: string;
      fecha: string;
      salida: SalidaNIE;
      /**
       * Los estadísticos que cada norma publica, **literales**.
       *
       * `SalidaNIE` transporta el percentil localizado, no la tabla entera: sin
       * ella no puede dibujarse un eje P5…P95. Se toman de la candidata tal
       * como la NKB los publica —ni se recalculan, ni se completan, ni se
       * ordenan— porque el NIE no se modifica en este sprint.
       */
      publicados: readonly { normaId: string; valores: ValoresNormativos }[];
      /** Coordenadas que el registro no declaró o no se supieron traducir. */
      sinTraducir: readonly CoordenadaSinTraducir[];
    }
  | {
      estado: 'SIN_CONSULTA';
      pruebaId: string;
      registroId: string;
      fecha: string;
      motivo: MotivoSinConsulta;
      /** Explicación literal, para renderizar sin reescribir. */
      detalle: string;
    };

const DETALLE: Readonly<Record<MotivoSinConsulta, string>> = {
  PRUEBA_NO_MAPEADA:
    'La base de conocimiento normativo no contiene todavía una referencia admisible para esta prueba.',
  VALOR_NO_CONTINUO:
    'El registro no es una magnitud continua: no hay un valor que situar en una norma.',
  UNIDAD_DESCONOCIDA:
    'La unidad del registro no figura entre las que publica la base de conocimiento normativo.',
  REGISTRO_NO_VIGENTE:
    'El registro está anulado. Sigue constando, pero no es elegible para comparar.',
};

/** Traduce con la tabla declarada. Lo que no está declarado devuelve `null`. */
function traducir<T extends string>(
  condiciones: Record<string, string>,
  clave: string,
  tabla: Readonly<Record<string, T>>,
  nombre: string,
  fallos: CoordenadaSinTraducir[],
): T | null {
  const declarado = condiciones[clave];
  if (declarado === undefined) {
    fallos.push({ coordenada: nombre, declarado: null });
    return null;
  }
  const traducido = tabla[declarado];
  if (traducido === undefined) {
    fallos.push({ coordenada: nombre, declarado });
    return null;
  }
  return traducido;
}

/**
 * Consulta la NKB por un registro concreto.
 *
 * `normas` se recibe como dato: cargarlas toca ficheros, y eso pertenece al
 * adaptador `nkb/`, no aquí.
 */
export function consultarNorma(
  registro: RegistroPrueba,
  sujeto: SujetoNormativo,
  normas: readonly NormaNKB[],
): ConsultaNormativa {
  const cabecera = {
    pruebaId: registro.pruebaId,
    registroId: registro.id,
    fecha: registro.fecha,
  };
  const sin = (motivo: MotivoSinConsulta): ConsultaNormativa => ({
    estado: 'SIN_CONSULTA',
    ...cabecera,
    motivo,
    detalle: DETALLE[motivo],
  });

  if (registro.estado !== 'vigente') return sin('REGISTRO_NO_VIGENTE');

  const mapeo = mapeoDe(registro.pruebaId);
  if (mapeo === null) return sin('PRUEBA_NO_MAPEADA');

  if (registro.valor.tipo !== 'continuo') return sin('VALOR_NO_CONTINUO');

  const unidad = mapeo.unidades[registro.valor.unidad];
  if (unidad === undefined) return sin('UNIDAD_DESCONOCIDA');

  const sinTraducir: CoordenadaSinTraducir[] = [];
  const c = registro.condiciones;

  const contexto: ContextoEvaluacion = {
    ...contextoVacio(),
    variable: mapeo.variable,
    pais: sujeto.pais,
    edad: sujeto.edad,
    sexo: sujeto.sexo,
    estaturaM: sujeto.estaturaM,
    unidad,
    instrumento: traducir(c, mapeo.claves.instrumento, mapeo.vocabulario.instrumento, 'instrumento', sinTraducir),
    definicionOperacional: traducir(
      c,
      mapeo.claves.definicionOperacional,
      mapeo.vocabulario.definicionOperacional,
      'definicionOperacional',
      sinTraducir,
    ),
    posicion: traducir(c, mapeo.claves.posicion, mapeo.vocabulario.posicion, 'posicion', sinTraducir),
    lado: traducir(c, mapeo.claves.lado, mapeo.vocabulario.lado, 'lado', sinTraducir),
  };

  const resolucion = resolver(contexto, normas);
  const observado = crearValorObservado({
    valor: registro.valor.valor,
    unidad,
    contexto,
    procedencia: { origen: 'PAS', fecha: registro.fecha, registroId: registro.id },
  });
  const interpretacion = interpretarNormativamente(observado, resolucion.candidatas);

  const salida = construirSalida(resolucion, interpretacion);
  const utilizables = new Set(salida.resultados.map((r) => r.norma.id));

  return {
    estado: 'CONSULTADA',
    ...cabecera,
    salida,
    publicados: resolucion.candidatas
      .filter((c) => utilizables.has(c.normaId))
      .map((c) => ({ normaId: c.normaId, valores: c.valores })),
    sinTraducir,
  };
}

/**
 * Consulta todos los registros de una evaluación, en el orden en que están.
 *
 * No agrupa, no deduplica y no se queda con el más reciente: cada registro
 * produce su consulta, y decidir cuál mirar es de quien lo presente.
 */
export function consultarEvaluacion(
  registros: readonly RegistroPrueba[],
  sujeto: SujetoNormativo,
  normas: readonly NormaNKB[],
): readonly ConsultaNormativa[] {
  return registros.map((r) => consultarNorma(r, sujeto, normas));
}
