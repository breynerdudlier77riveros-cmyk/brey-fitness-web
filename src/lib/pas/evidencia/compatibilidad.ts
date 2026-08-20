// ── Compatibilidad y lectura de evidencia (Sprint PAS-10E §7, §17, §18) ────
//
// EL DEFECTO QUE ESTE MÓDULO CORRIGE.
//
//   El PAS venía respondiendo «sin evidencia compatible» en diez de once
//   pruebas. Esa frase era falsa casi siempre. Los casos reales eran otros:
//
//     · existe evidencia, pero falta el peso del atleta   → NO_DETERMINABLE
//     · existe evidencia, pero no consta el protocolo     → NO_COMPARABLE
//     · existe evidencia, pero es de escolares            → EVIDENCIA_NO_COMPATIBLE
//     · existe fiabilidad, no normativa                   → EVIDENCIA_PARCIAL
//     · existe la fuente y falta transcribir su tabla     → EVIDENCIA_PARCIAL
//
//   Cinco situaciones distintas, cuatro de ellas con salida, colapsadas en una
//   que las hacía parecer un callejón sin salida.
//
// NO SE ELIGE ENTRE REFERENCIAS COMPATIBLES. Si dos lo son, salen las dos, con
// su jerarquía declarada pero sin descartar ninguna: misma doctrina que el NIE.
//
// Módulo puro. No lee la base, no consulta la red, no conoce React.

import { requeridasAusentes } from '@/features/performance-workspace/schemas/condiciones';

import { situar } from './posicion';
import { fuenteDe, referenciasDe } from './registro';
import type {
  Carencia,
  EstadoEvidencia,
  LecturaEvidencia,
  Posicion,
  ReferenciaEvidencia,
} from './tipos';

/** Lo que se sabe del atleta. `null` significa NO CONSTA, jamás un defecto. */
export interface SujetoEvidencia {
  edad: number | null;
  sexo: 'M' | 'F' | null;
  pais: string | null;
  /** Masa corporal en kg. Hoy el PAS no la registra: ver `DATA_GAPS.md`. */
  pesoKg: number | null;
}

export interface MedicionEvaluada {
  pruebaId: string;
  valor: number;
  unidad: string;
  condiciones: Readonly<Record<string, string>>;
}

/** Las variables del atleta que una referencia puede exigir. */
const VARIABLES_ATLETA: Readonly<Record<string, (s: SujetoEvidencia) => boolean>> = {
  edad: (s) => s.edad !== null,
  sexo: (s) => s.sexo !== null,
  pais: (s) => s.pais !== null,
  peso_kg: (s) => s.pesoKg !== null,
};

const DETALLE_VARIABLE: Readonly<Record<string, string>> = {
  edad: 'No consta la fecha de nacimiento del atleta, y la referencia se estratifica por edad.',
  sexo: 'No consta el sexo del atleta, y la referencia publica valores distintos para cada uno.',
  pais: 'No consta el país de pertenencia del atleta.',
  peso_kg:
    'Para situar este resultado respecto a la referencia hace falta registrar la masa corporal: ' +
    'la fuente publica sus valores en relación con el peso, no en kilos absolutos.',
};

// ════════════════════════════════════════════════════════════════════════════
// LAS SIETE CONDICIONES DEL §7
// ════════════════════════════════════════════════════════════════════════════

type Veredicto =
  | { apta: true }
  | { apta: false; motivo: string }
  | { apta: false; carencia: Carencia };

function esCarencia(v: Veredicto): v is { apta: false; carencia: Carencia } {
  return !v.apta && 'carencia' in v;
}

/**
 * Comprueba una referencia contra el sujeto y la medición.
 *
 * El orden de las comprobaciones es deliberado: primero lo que descarta la
 * referencia para siempre (fuente, unidad, población), después lo que solo
 * falta (variables del atleta, condiciones del registro). Así una referencia
 * de escolares nunca sale como «falta el peso»: sale como no compatible, que
 * es lo que es.
 */
function evaluar(
  ref: ReferenciaEvidencia,
  sujeto: SujetoEvidencia,
  medicion: MedicionEvaluada,
): Veredicto {
  // 1 · Procedencia. Una fuente que no se ha recuperado no sostiene nada, por
  //     verosímil que parezca lo que dice de ella un resumen de búsqueda.
  const fuente = fuenteDe(ref.fuenteId);
  if (fuente === null) {
    return { apta: false, motivo: 'La referencia apunta a una fuente que no está registrada.' };
  }
  if (fuente.estado === 'sin_verificar') {
    return {
      apta: false,
      motivo:
        'La fuente está localizada pero no se ha recuperado en origen. Existe literatura sobre ' +
        'la prueba; lo que no existe todavía es una comprobación de sus cifras.',
    };
  }

  // 2 · Unidad. No se convierte nada: este sprint no crea conversiones.
  if (ref.ambito.unidad !== medicion.unidad) {
    return {
      apta: false,
      motivo:
        `La referencia publica sus valores en ${ref.ambito.unidad} y la medición está en ` +
        `${medicion.unidad}. No hay conversión autorizada entre ambas.`,
    };
  }

  // 3 · Población · edad.
  const { edadMin, edadMax } = ref.ambito;
  if (edadMin !== null || edadMax !== null) {
    if (sujeto.edad === null) {
      return {
        apta: false,
        carencia: { variable: 'edad', origen: 'atleta', detalle: DETALLE_VARIABLE.edad },
      };
    }
    if (
      (edadMin !== null && sujeto.edad < edadMin) ||
      (edadMax !== null && sujeto.edad > edadMax)
    ) {
      const rango = `${edadMin ?? '—'} a ${edadMax ?? '—'} años`;
      return {
        apta: false,
        motivo:
          `La referencia se publicó sobre población de ${rango} y el atleta tiene ` +
          `${sujeto.edad}. Extenderla fuera de su rango de edad afirmaría algo que la fuente ` +
          'no midió.',
      };
    }
  }

  // 4 · Población · sexo.
  if (ref.ambito.sexo !== null) {
    if (sujeto.sexo === null) {
      return {
        apta: false,
        carencia: { variable: 'sexo', origen: 'atleta', detalle: DETALLE_VARIABLE.sexo },
      };
    }
    if (ref.ambito.sexo !== sujeto.sexo) {
      return { apta: false, motivo: 'La referencia corresponde al otro sexo.' };
    }
  }

  // 5 · Población · país. Una referencia sin país es internacional y no excluye
  //     a nadie; una con país solo aplica a esa población.
  if (ref.ambito.pais !== null && sujeto.pais !== null && ref.ambito.pais !== sujeto.pais) {
    return {
      apta: false,
      motivo:
        `La referencia describe a la población de ${ref.ambito.pais} y el atleta pertenece a ` +
        `la de ${sujeto.pais}.`,
    };
  }

  // 6 · Protocolo. Aquí es donde el bloqueo de captura se vuelve visible: si la
  //     prueba no declara sus condiciones, esto no puede resolverse.
  for (const [clave, exigido] of Object.entries(ref.ambito.protocolo)) {
    const declarado = medicion.condiciones[clave];
    if (typeof declarado !== 'string' || declarado === '') {
      return {
        apta: false,
        carencia: {
          variable: clave,
          origen: 'registro',
          detalle:
            `No consta «${clave}» en el registro, y la referencia solo aplica a un valor ` +
            'concreto. Declarándolo puede comprobarse si la comparación es válida.',
        },
      };
    }
    if (declarado !== exigido) {
      return {
        apta: false,
        motivo:
          `La referencia exige «${clave} = ${exigido}» y la medición se tomó con ` +
          `«${declarado}». Son protocolos distintos.`,
      };
    }
  }

  // 7 · Variables del atleta que la referencia necesita para poder aplicarse.
  for (const variable of ref.variablesAtleta) {
    const disponible = VARIABLES_ATLETA[variable];
    if (disponible && !disponible(sujeto)) {
      return {
        apta: false,
        carencia: {
          variable,
          origen: 'atleta',
          detalle: DETALLE_VARIABLE[variable] ?? `Falta «${variable}» en la ficha del atleta.`,
        },
      };
    }
  }

  return { apta: true };
}

// ════════════════════════════════════════════════════════════════════════════
// JERARQUÍA (§4)
// ════════════════════════════════════════════════════════════════════════════

/**
 * Prioridad de una referencia compatible. Menor número, antes.
 *
 * **Ordena, no descarta.** El §4 pide priorizar por cercanía metodológica y
 * poblacional, y advierte explícitamente contra elegir una fuente solo porque
 * tenga percentiles. Por eso esto es un criterio de presentación: las
 * compatibles salen todas, y esta función decide en qué orden se leen.
 */
function prioridad(ref: ReferenciaEvidencia, sujeto: SujetoEvidencia): number {
  let p = 100;
  if (ref.ambito.pais !== null && ref.ambito.pais === sujeto.pais) p -= 40;
  if (ref.ambito.sexo !== null) p -= 20;
  if (ref.ambito.edadMin !== null || ref.ambito.edadMax !== null) p -= 20;
  if (Object.keys(ref.ambito.protocolo).length > 0) p -= 10;
  return p;
}

// ════════════════════════════════════════════════════════════════════════════
// LECTURA
// ════════════════════════════════════════════════════════════════════════════

/** Las clases de evidencia que sitúan un valor respecto a algo. */
const POSICIONALES = new Set(['NORMATIVA', 'DESCRIPTIVA', 'BENCHMARK']);

/**
 * Qué puede decirse de esta medición, y qué falta para poder decir más.
 *
 * Nunca lanza. Una prueba sin ninguna referencia declarada devuelve
 * `SIN_EVIDENCIA_UTILIZABLE` con las listas vacías, que es la respuesta
 * correcta y no un error.
 */
export function leerEvidencia(
  medicion: MedicionEvaluada,
  sujeto: SujetoEvidencia,
): LecturaEvidencia {
  const compatibles: { referencia: ReferenciaEvidencia; posicion: Posicion | null }[] = [];
  const descartadas: { referencia: ReferenciaEvidencia; motivo: string }[] = [];
  const carencias: Carencia[] = [];
  const complementarias: ReferenciaEvidencia[] = [];

  for (const ref of referenciasDe(medicion.pruebaId)) {
    const v = evaluar(ref, sujeto, medicion);

    if (!v.apta) {
      if (esCarencia(v)) carencias.push(v.carencia);
      else descartadas.push({ referencia: ref, motivo: v.motivo });
      continue;
    }

    if (POSICIONALES.has(ref.tipo)) {
      // La fuente existe y es compatible, pero su tabla no se ha cargado. Es un
      // hueco NUESTRO, y decirlo así evita pedirle al profesional un dato que
      // ya tiene.
      if (ref.representacion.clase === 'valores_sin_transcribir') {
        carencias.push({
          variable: ref.id,
          origen: 'sistema',
          detalle:
            'Existe una referencia compatible y verificada para esta prueba, pero sus valores ' +
            `todavía no se han incorporado al sistema. La fuente publica: ` +
            `${ref.representacion.queSePublica}.`,
        });
        continue;
      }
      compatibles.push({ referencia: ref, posicion: situar(medicion.valor, ref.representacion) });
    } else {
      complementarias.push(ref);
    }
  }

  compatibles.sort((a, b) => prioridad(a.referencia, sujeto) - prioridad(b.referencia, sujeto));

  // EL ESTADO SE DECIDE ANTES DE AÑADIR LAS CARENCIAS GENÉRICAS, y el orden
  // importa más de lo que parece.
  //
  // Las de arriba salen de EVALUAR UNA REFERENCIA: si faltan, esa referencia se
  // desbloquea al declararlas. Las de abajo salen de un barrido del catálogo y
  // son ciertas igualmente —sin ellas la serie longitudinal no sabe si dos
  // mediciones son comparables—, pero NO desbloquean ninguna referencia.
  //
  // Mezclarlas hacía que un atleta colombiano viera «falta declarar el método
  // de cálculo» cuando lo que le bloqueaba era que la norma es canadiense. Es
  // una falsa promesa: habría declarado el método y seguiría sin comparación.
  const estado = resolverEstado({ compatibles, descartadas, carencias, complementarias });

  for (const clave of requeridasAusentes(medicion.pruebaId, medicion.condiciones)) {
    if (!carencias.some((c) => c.variable === clave)) {
      carencias.push({
        variable: clave,
        origen: 'registro',
        detalle:
          `No consta «${clave}», que es una condición que cambia el resultado de esta prueba. ` +
          'Sin ella no puede compararse esta medición con otras, ni siquiera con las del propio ' +
          'atleta.',
      });
    }
  }

  return {
    pruebaId: medicion.pruebaId,
    estado,
    compatibles,
    descartadas,
    carencias,
    complementarias,
  };
}

/**
 * El estado global, por prioridad de lo más informativo a lo menos.
 *
 * El orden NO es arbitrario: gana el estado que más le dice a quien lee sobre
 * qué puede hacer a continuación. «Falta el peso» es más útil que «hay
 * fiabilidad», y las dos son más útiles que «no hay evidencia».
 */
function resolverEstado(l: {
  compatibles: readonly unknown[];
  descartadas: readonly unknown[];
  carencias: readonly Carencia[];
  complementarias: readonly unknown[];
}): EstadoEvidencia {
  if (l.compatibles.length > 0) return 'EVIDENCIA_COMPATIBLE';
  if (l.carencias.some((c) => c.origen === 'atleta')) return 'NO_DETERMINABLE';
  if (l.carencias.some((c) => c.origen === 'registro')) return 'NO_COMPARABLE';
  if (l.carencias.some((c) => c.origen === 'sistema')) return 'EVIDENCIA_PARCIAL';
  if (l.complementarias.length > 0) return 'EVIDENCIA_PARCIAL';
  if (l.descartadas.length > 0) return 'EVIDENCIA_NO_COMPATIBLE';
  return 'SIN_EVIDENCIA_UTILIZABLE';
}
