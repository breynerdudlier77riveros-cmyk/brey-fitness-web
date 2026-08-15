// ── Composición del informe v2 (PRS v2.0) ──────────────────────────────────
//
// COMPONE. No calcula posición normativa, no interpreta y no redacta.
//
// Lo único que hace con números es **geometría de dibujo** (`escala.ts`), que
// opera sobre un eje de valores y jamás produce un percentil. Todo lo demás es
// agrupar, rotular y transportar texto ajeno sin tocarlo.
//
// Módulo puro.

import type { ResultadoNormativo, SalidaNIE, ValoresNormativos } from '@/lib/nie';
import type { ConsultaNormativa } from '@/lib/pas/normativo';

import { escalar, type Escala } from './escala';
import {
  ETIQUETA_CALIDAD,
  ETIQUETA_CONFLICTO,
  ETIQUETA_ESTADO_NORMA,
  ETIQUETA_INTERPRETACION,
  ETIQUETA_PAIS,
  ETIQUETA_UNIDAD,
  ETIQUETA_VARIABLE,
} from './etiquetas';
import type {
  FilaEvidencia,
  GrupoDescarte,
  InformeNormativoV2,
  PanelComparabilidad,
  TarjetaNormativa,
  TarjetaResumen,
  TarjetaSinNorma,
} from './tipos';

/** Cuántas identidades de ejemplo lleva cada grupo de descarte. */
export const EJEMPLOS_POR_GRUPO = 3;

export interface DatosPortada {
  atleta: string;
  edad: number | null;
  sexo: string | null;
  fecha: string;
  profesional: string | null;
  codigo: string;
}

// ─── Escala ─────────────────────────────────────────────────────────────────

/**
 * Construye la escala desde lo que la fuente publica, **sin añadir marcas**.
 *
 * TN-1 dibuja los percentiles publicados; TN-2 dibuja μ y ±1σ, ±2σ, que son
 * los puntos que la propia media y dispersión definen. En ningún caso se
 * traduce uno al otro: una puntuación z no se convierte en percentil (`06`).
 */
function escalaDe(valores: ValoresNormativos, observado: number): Escala | null {
  if (valores.tipo === 'percentiles') {
    if (valores.percentiles.length < 2) return null;
    return escalar(
      valores.percentiles.map((p) => ({
        etiqueta: `P${p.percentil}`,
        valor: p.valor,
        principal: p.percentil === 50,
      })),
      observado,
    );
  }

  if (valores.tipo === 'media_dispersion') {
    const media = valores.media;
    const dt = valores.desviacionTipica;
    if (!(dt > 0)) return null;
    return escalar(
      [
        { etiqueta: 'μ−2σ', valor: media - 2 * dt },
        { etiqueta: 'μ−1σ', valor: media - dt },
        { etiqueta: 'μ', valor: media, principal: true },
        { etiqueta: 'μ+1σ', valor: media + dt },
        { etiqueta: 'μ+2σ', valor: media + 2 * dt },
      ],
      observado,
    );
  }

  return null;
}

// ─── Rótulos derivados ──────────────────────────────────────────────────────

const paisDe = (p: string): string => ETIQUETA_PAIS[p] ?? p;

function poblacionDe(r: ResultadoNormativo): string {
  return `${paisDe(r.norma.pais)} · ${r.norma.estrato}`;
}

function evidenciaDe(r: ResultadoNormativo): readonly FilaEvidencia[] {
  return [
    { dimension: 'Calidad', estado: ETIQUETA_CALIDAD[r.norma.calidad] },
    { dimension: 'Estado', estado: ETIQUETA_ESTADO_NORMA[r.norma.estado] },
    { dimension: 'Conflicto', estado: ETIQUETA_CONFLICTO[r.conflicto] ?? r.conflicto },
    { dimension: 'Unidad', estado: ETIQUETA_UNIDAD[r.unidad.estado] },
    {
      dimension: 'Tamaño de celda',
      // «No consta» es un dato de la ficha, no un cero. La NKB distingue una
      // celda pequeña de una celda cuyo n la fuente nunca publicó (`37`).
      estado: r.norma.nCelda === null ? 'No consta' : `${r.norma.nCelda} personas`,
    },
  ];
}

/** Rótulo accesible que no depende del color ni de la barra. */
function ariaDe(r: ResultadoNormativo, variable: string, valor: number): string {
  return [
    `${variable}:`,
    `${valor} ${r.unidad.unidadOriginal}.`,
    `${ETIQUETA_INTERPRETACION[r.comparacion.estado]}.`,
    `Norma de ${poblacionDe(r)}.`,
    `Calidad ${ETIQUETA_CALIDAD[r.norma.calidad].toLowerCase()},`,
    `evidencia ${ETIQUETA_ESTADO_NORMA[r.norma.estado].toLowerCase()}.`,
  ].join(' ');
}

/** Rótulo corto del motivo por el que una norma no se comparó. */
function motivoCorto(r: ResultadoNormativo): string {
  if (r.comparacion.estado === 'NO_COMPARABLE_EQ3') return 'EQ-3';
  if (r.comparacion.estado === 'UNIDAD_INCOMPATIBLE') return 'Unidad';
  if (r.unidad.estado === 'CONVERSION_DISPONIBLE_NO_SOLICITADA') return 'Conversión';
  if (r.unidad.estado === 'CONVERSION_NO_AUTORIZADA') return 'Unidad';
  return 'No aplica';
}

// ─── Secciones ──────────────────────────────────────────────────────────────

function comparabilidadDe(salida: SalidaNIE): PanelComparabilidad {
  // Se agrupan por motivo en lugar de listarse. Una consulta de prensión evalúa
  // 356 normas y descarta 354: listarlas una a una no es transparencia, es
  // sepultar las dos que importan. El recuento por motivo conserva la
  // información —«302 por método no equivalente»— sin la avalancha, y ninguna
  // norma desaparece del recuento.
  const comparables = salida.particion.comparables.map((r) => ({
    normaId: r.norma.id,
    identidad: poblacionDe(r),
  }));

  const grupos = new Map<string, { motivo: string; total: number; ejemplos: string[] }>();
  for (const r of salida.particion.noComparables) {
    const clave = motivoCorto(r);
    const g = grupos.get(clave) ?? { motivo: r.comparacion.motivo, total: 0, ejemplos: [] };
    g.total += 1;
    if (g.ejemplos.length < EJEMPLOS_POR_GRUPO) g.ejemplos.push(poblacionDe(r));
    grupos.set(clave, g);
  }

  const descartes: GrupoDescarte[] = [...grupos.entries()].map(([motivoCorto, g]) => ({
    motivoCorto,
    motivo: g.motivo,
    total: g.total,
    ejemplos: g.ejemplos,
  }));

  return { evaluadas: salida.candidatasEvaluadas, comparables, descartes };
}

function tarjetasDe(
  consulta: Extract<ConsultaNormativa, { estado: 'CONSULTADA' }>,
): readonly TarjetaNormativa[] {
  const publicados = new Map(consulta.publicados.map((p) => [p.normaId, p.valores]));

  return consulta.salida.particion.comparables.map((r) => {
    const valores = publicados.get(r.norma.id);
    const valor = r.unidad.valorOriginal;
    const variable = ETIQUETA_VARIABLE.fuerza_prension_manual;

    return {
      normaId: r.norma.id,
      registroId: consulta.registroId,
      variable,
      valor,
      unidad: r.unidad.unidadOriginal,
      situacion: ETIQUETA_INTERPRETACION[r.comparacion.estado],
      motivo: r.comparacion.motivo,
      poblacion: poblacionDe(r),
      metodo: r.norma.instrumento,
      tipo: r.norma.tipo === 'TN-2' ? ('TN-2' as const) : ('TN-1' as const),
      calidad: ETIQUETA_CALIDAD[r.norma.calidad],
      estadoNorma: ETIQUETA_ESTADO_NORMA[r.norma.estado],
      estadoEvidencia: r.estadoEvidencia,
      conflicto: r.conflicto,
      nCelda: r.norma.nCelda,
      // Se dibuja sobre el valor que entró en la comparación: si hubo una
      // conversión autorizada, el eje está en la unidad de la norma.
      escala: valores ? escalaDe(valores, r.unidad.valorComparado) : null,
      aria: ariaDe(r, variable, valor),
      evidencia: evidenciaDe(r),
      advertencias: r.advertencias,
      referencia: r.procedencia.referencia,
    };
  });
}

/**
 * Compone el informe normativo.
 *
 * `consultas` llega del eslabón PAS→NIE en su orden. No se reordena por
 * calidad, ni por país, ni por nada: el orden es el de los registros.
 */
export function componerInformeNormativo(
  consultas: readonly ConsultaNormativa[],
  datos: DatosPortada,
): InformeNormativoV2 {
  const consultadas = consultas.filter(
    (c): c is Extract<ConsultaNormativa, { estado: 'CONSULTADA' }> => c.estado === 'CONSULTADA',
  );

  const comparabilidad: Record<string, PanelComparabilidad> = {};
  for (const c of consultadas) comparabilidad[c.registroId] = comparabilidadDe(c.salida);

  const sinNorma: TarjetaSinNorma[] = consultas.flatMap((c) =>
    c.estado === 'SIN_CONSULTA'
      ? [{ id: c.registroId, variable: c.pruebaId, detalle: c.detalle }]
      : [],
  );

  const resumen: TarjetaResumen[] = consultas.map((c) => {
    if (c.estado === 'SIN_CONSULTA') {
      return {
        id: c.registroId,
        variable: c.pruebaId,
        estado: 'Sin norma disponible',
        evidencia: '—',
        conNorma: false,
      };
    }
    const propias = c.salida.particion.comparables;
    return {
      id: c.registroId,
      variable: ETIQUETA_VARIABLE.fuerza_prension_manual,
      estado: ETIQUETA_INTERPRETACION[c.salida.estadoInterpretacion],
      evidencia:
        propias.length === 0 ? '—' : [...new Set(propias.map((r) => r.norma.estado))].join(' · '),
      conNorma: propias.length > 0,
    };
  });

  const conNorma = resumen.filter((r) => r.conNorma).length;

  return {
    portada: {
      ...datos,
      estadoCientifico:
        conNorma === 0
          ? 'Ninguna medición de este informe dispone de norma admisible en la base de conocimiento.'
          : `${conNorma} de ${resumen.length} mediciones disponen de al menos una norma comparable.`,
    },
    resumen,
    tarjetas: consultadas.flatMap(tarjetasDe),
    comparabilidad,
    sinNorma,
    advertencias: [...new Set(consultadas.flatMap((c) => c.salida.advertencias))],
  };
}
