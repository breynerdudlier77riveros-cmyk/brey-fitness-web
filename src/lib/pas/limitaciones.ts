// ── Limitaciones (Sprint PAS-2.0) ──────────────────────────────────────────
// Una limitación declara algo que el sistema NO puede afirmar, y su motivo
// (entidad E-09). Nunca inventa la causa: dice qué falta, no por qué falta.
//
// «Faltan pruebas de esta capacidad» es una limitación. «El atleta no la ha
// entrenado» sería una explicación, y el motor no dispone de nada que la
// sostenga.

import { CAPACIDADES, definicionCapacidad } from './capacidades';
import type { CapacidadId } from './capacidades';
import type { CatalogoPruebas, EvaluacionPAS } from './tipos';
import type { Conflicto, EstadoCapacidad, Limitacion, TipoLimitacion } from './resultado';

function limitacion(
  tipo: TipoLimitacion,
  clave: string,
  capacidad: CapacidadId | null,
  detalle: Record<string, string> = {}
): Limitacion {
  return { id: `${tipo}:${clave}`, tipo, capacidad, detalle };
}

/** Limitaciones que nacen del catálogo, no de los datos del atleta. */
function delCatalogo(catalogo: CatalogoPruebas): Limitacion[] {
  const salida: Limitacion[] = [];

  if (catalogo.pruebas.length === 0) {
    salida.push(limitacion('catalogo_sin_pruebas', 'global', null, { version: catalogo.version }));
  }

  const conReferencia = catalogo.pruebas.some((p) =>
    p.contribuciones.some((c) => c.referencia !== null && c.referencia.trim() !== '')
  );

  // Estado normal del sistema en v1.0: el Sprint 1 difirió TODAS las
  // correspondencias al Sprint 3 (PAS-ADR-06). Sin ellas no puede derivarse
  // ninguna capacidad, y el motor lo dice en vez de devolver un perfil vacío
  // sin explicación.
  if (!conReferencia) {
    salida.push(
      limitacion('catalogo_sin_correspondencias', 'global', null, {
        version: catalogo.version,
        pruebas: String(catalogo.pruebas.length),
      })
    );
  }

  for (const prueba of [...catalogo.pruebas].sort((a, b) => a.id.localeCompare(b.id))) {
    if (prueba.vigenciaDias === null) {
      salida.push(limitacion('vigencia_no_declarada', prueba.id, null, { prueba: prueba.id }));
    }
  }

  return salida;
}

/** Una limitación por capacidad cuyo estado no es «evaluada». */
function deCapacidades(estados: readonly EstadoCapacidad[], catalogo: CatalogoPruebas): Limitacion[] {
  const salida: Limitacion[] = [];
  const coberturaDeclarada = new Set((catalogo.cobertura ?? []).map((c) => c.capacidad));

  for (const estado of estados) {
    const reservada = definicionCapacidad(estado.capacidad).reservada;

    if (reservada) {
      salida.push(
        limitacion('capacidad_reservada', estado.capacidad, estado.capacidad, { sprint: '5' })
      );
      continue;
    }

    switch (estado.estado) {
      case 'desconocida':
        salida.push(
          limitacion('capacidad_sin_evidencia', estado.capacidad, estado.capacidad, {
            excluidos: String(estado.traza.excluidos.length),
          })
        );
        break;
      case 'parcialmente_evaluada':
        salida.push(
          limitacion('capacidad_cobertura_parcial', estado.capacidad, estado.capacidad)
        );
        break;
      case 'desactualizada':
        salida.push(limitacion('capacidad_desactualizada', estado.capacidad, estado.capacidad));
        break;
      case 'en_conflicto':
        salida.push(limitacion('capacidad_en_conflicto', estado.capacidad, estado.capacidad));
        break;
      case 'evaluada':
        // Evaluada sin cobertura declarada: el motor no puede saber si la
        // capacidad quedó cubierta del todo, y no lo supone.
        if (!coberturaDeclarada.has(estado.capacidad)) {
          salida.push(
            limitacion('cobertura_no_declarada', estado.capacidad, estado.capacidad)
          );
        }
        break;
    }
  }

  return salida;
}

/** Limitaciones que nacen de los datos recibidos. */
function deDatos(
  evaluaciones: readonly EvaluacionPAS[],
  conflictos: readonly Conflicto[]
): Limitacion[] {
  const salida: Limitacion[] = [];

  for (const evaluacion of evaluaciones) {
    if (evaluacion.registros.length === 0) {
      salida.push(limitacion('evaluacion_sin_registros', evaluacion.id, null));
    }
  }

  const incompatibles = conflictos.filter(
    (c) => c.tipo === 'resultado_divergente' || c.tipo === 'valor_incompatible'
  );
  if (incompatibles.length > 0) {
    salida.push(
      limitacion('datos_incompatibles', 'global', null, { total: String(incompatibles.length) })
    );
  }

  return salida;
}

export function generarLimitaciones(entrada: {
  estados: readonly EstadoCapacidad[];
  evaluaciones: readonly EvaluacionPAS[];
  conflictos: readonly Conflicto[];
  catalogo: CatalogoPruebas;
}): Limitacion[] {
  const todas = [
    ...delCatalogo(entrada.catalogo),
    ...deCapacidades(entrada.estados, entrada.catalogo),
    ...deDatos(entrada.evaluaciones, entrada.conflictos),
  ];

  const unicas = new Map<string, Limitacion>();
  for (const item of todas) if (!unicas.has(item.id)) unicas.set(item.id, item);

  return [...unicas.values()].sort((a, b) => a.id.localeCompare(b.id));
}

/** Total de capacidades del catálogo. Útil para aserciones de cobertura. */
export const TOTAL_CAPACIDADES = CAPACIDADES.length;
