// ── Derivación del Estado de Capacidad (Sprint PAS-2.0) ────────────────────
// El núcleo del motor: para cada una de las 20 capacidades decide cuál de los
// cinco estados excluyentes le corresponde, y deja la traza de por qué.
//
// Una capacidad sin prueba elegible es DESCONOCIDA. Nunca promedio, nunca
// estimada, nunca inferida desde otra (I-06, límite L-06). Aquí no hay ninguna
// rama que rellene un hueco.

import type { CapacidadId, DefinicionCapacidad } from './capacidades';
import { CAPACIDADES, definicionCapacidad } from './capacidades';
import { contribucionAplicable, evaluarElegibilidadBase } from './elegibilidad';
import { fechaMasReciente } from './fechas';
import type { CorrespondenciaAplicada } from './trazabilidad';
import { construirTraza } from './trazabilidad';
import type { CoordenadasVersion, EstadoCapacidad, EstadoCapacidadValor, RegistroExcluido } from './resultado';
import type { DefinicionPrueba, RegistroPrueba } from './tipos';

export interface ContextoDerivacion {
  registros: readonly RegistroPrueba[];
  indice: ReadonlyMap<string, DefinicionPrueba>;
  /** Pruebas exigidas por capacidad para cobertura completa. Puede faltar. */
  cobertura: ReadonlyMap<CapacidadId, readonly string[]>;
  /** Registros implicados en un resultado divergente. */
  divergentes: ReadonlySet<string>;
  hoyISO: string;
  coordenadas: CoordenadasVersion;
}

interface Reparto {
  incluidos: RegistroPrueba[];
  excluidos: RegistroExcluido[];
  correspondencias: CorrespondenciaAplicada[];
  /** Candidatos excluidos ÚNICAMENTE por vigencia (EL-02). */
  caducados: number;
  candidatos: number;
}

/**
 * Reparte los registros entre incluidos y excluidos para una capacidad.
 *
 * Un registro cuya prueba no declara nada sobre esta capacidad NO es
 * candidato y no aparece en la traza: si apareciera, cada capacidad listaría
 * todos los registros del atleta y la traza dejaría de ser legible (TR-05).
 */
function repartir(capacidad: CapacidadId, ctx: ContextoDerivacion): Reparto {
  const reparto: Reparto = {
    incluidos: [], excluidos: [], correspondencias: [], caducados: 0, candidatos: 0,
  };

  for (const registro of ctx.registros) {
    const definicion = ctx.indice.get(registro.pruebaId);
    if (!definicion) continue;

    const aplicable = contribucionAplicable(definicion, capacidad);
    if ('motivo' in aplicable) {
      if (aplicable.motivo === 'EL-04_sin_correspondencia') continue;
      reparto.candidatos += 1;
      reparto.excluidos.push({
        registroId: registro.id,
        pruebaId: registro.pruebaId,
        motivo: aplicable.motivo,
        detalle: {},
      });
      continue;
    }

    reparto.candidatos += 1;
    const elegibilidad = evaluarElegibilidadBase(registro, definicion, ctx.hoyISO);

    if (!elegibilidad.elegible && elegibilidad.motivo) {
      if (elegibilidad.motivo === 'EL-02_fuera_de_vigencia') reparto.caducados += 1;
      reparto.excluidos.push({
        registroId: registro.id,
        pruebaId: registro.pruebaId,
        motivo: elegibilidad.motivo,
        detalle: elegibilidad.detalle,
      });
      continue;
    }

    reparto.incluidos.push(registro);
    reparto.correspondencias.push({
      pruebaId: registro.pruebaId,
      referencia: aplicable.contribucion.referencia ?? '',
      peso: aplicable.contribucion.peso,
    });
  }

  return reparto;
}

/** Cobertura declarada cumplida: todas las pruebas exigidas están incluidas. */
function coberturaCompleta(
  exigidas: readonly string[] | undefined,
  incluidos: readonly RegistroPrueba[]
): boolean {
  if (!exigidas || exigidas.length === 0) return true;
  const presentes = new Set(incluidos.map((r) => r.pruebaId));
  return exigidas.every((prueba) => presentes.has(prueba));
}

/**
 * Decide el estado. El orden de las ramas ES la regla, y no es conmutativo:
 * el conflicto pesa más que la cobertura, y la caducidad solo se considera
 * cuando no queda ningún registro elegible.
 */
function decidirEstado(reparto: Reparto, ctx: ContextoDerivacion, capacidad: CapacidadId): EstadoCapacidadValor {
  if (reparto.candidatos === 0) return 'desconocida';

  if (reparto.incluidos.length === 0) {
    // «Desactualizada» dice que se supo y caducó; «desconocida», que nunca se
    // supo. Solo la primera admite reevaluación como vía directa.
    return reparto.caducados > 0 ? 'desactualizada' : 'desconocida';
  }

  if (reparto.incluidos.some((r) => ctx.divergentes.has(r.id))) return 'en_conflicto';

  return coberturaCompleta(ctx.cobertura.get(capacidad), reparto.incluidos)
    ? 'evaluada'
    : 'parcialmente_evaluada';
}

export function derivarCapacidad(
  definicion: DefinicionCapacidad,
  ctx: ContextoDerivacion
): EstadoCapacidad {
  const reparto = repartir(definicion.id, ctx);
  const estado = decidirEstado(reparto, ctx, definicion.id);

  return {
    capacidad: definicion.id,
    dominio: definicion.dominio,
    nombre: definicion.nombre,
    estado,
    ultimaFecha: fechaMasReciente(reparto.incluidos.map((r) => r.fecha)),
    registrosElegibles: reparto.incluidos.length,
    traza: construirTraza(
      definicion.id,
      reparto.incluidos.map((r) => r.id),
      reparto.excluidos,
      reparto.correspondencias,
      ctx.coordenadas
    ),
  };
}

/** Las 20 capacidades, siempre, en el orden del catálogo. Ninguna se omite. */
export function derivarCapacidades(ctx: ContextoDerivacion): EstadoCapacidad[] {
  return CAPACIDADES.map((c) => derivarCapacidad(definicionCapacidad(c.id), ctx));
}
