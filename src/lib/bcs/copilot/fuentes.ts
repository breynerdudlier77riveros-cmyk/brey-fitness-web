// ── Lectura normalizada de las fuentes (Sprint BCS-6.0) ────────────────────
// Punto ÚNICO donde el copilot consulta los DTO de los motores. Todo el resto
// del módulo trabaja sobre este resumen, nunca sobre los DTO crudos: así, si
// mañana cambia la forma de un motor, solo este archivo se entera.
//
// No calcula nada. Selecciona y agrupa lo que otros ya determinaron.

import { CATALOGO, type VariableId } from '@/lib/bcs/reporte';
import type { EntradaCopilot } from './tipos';

export interface FuentesNormalizadas {
  clienteNombre: string;
  profesional: string | null;
  hoyISO: string;
  fechaActual: string | null;
  fechaAnterior: string | null;
  cantidadMediciones: number;
  suficiencia: string;
  /** Titular y texto del resumen que el Analysis Engine ya emitió. */
  tituloResumen: string;
  textoResumen: string;
  /** Cambios que superaron su umbral documentado. */
  cambiosSignificativos: { variable: VariableId; etiqueta: string; titulo: string; id: string }[];
  /** Cambios reales en variables sin umbral definido. */
  cambiosSinUmbral: { variable: VariableId; etiqueta: string; titulo: string; id: string }[];
  /** Series con dirección sostenida. */
  tendencias: { variable: VariableId; etiqueta: string; titulo: string; id: string }[];
  /** Observaciones del COG, ya redactadas y trazadas. */
  observaciones: { id: string; bloque: string; texto: string; referencias: string[]; fichas: string[] }[];
  /** Recomendaciones, resumidas por categoría y prioridad. */
  recomendaciones: { id: string; categoria: string; prioridad: string; titulo: string; accion: string }[];
  alertas: { id: string; titulo: string }[];
  limitaciones: { id: string; titulo: string; descripcion: string }[];
  ambitosNoCubiertos: string[];
  /** Variables presentes en la medición actual. Nada fuera de esta lista puede mencionarse. */
  variablesDisponibles: VariableId[];
}

const etiquetaDe = (v: VariableId) => CATALOGO[v].etiqueta;

export function normalizar(entrada: EntradaCopilot): FuentesNormalizadas {
  const { reporte, analisis, recomendaciones, observaciones, hoyISO, profesional } = entrada;

  const porPrefijo = (p: string) =>
    analisis.hallazgos
      .filter((h) => h.id.startsWith(p))
      .map((h) => ({
        variable: h.variables[0],
        etiqueta: h.variables[0] ? etiquetaDe(h.variables[0]) : '',
        titulo: h.titulo,
        id: h.id,
      }))
      .filter((x) => x.variable !== undefined);

  const cambios = analisis.hallazgos.filter((h) => h.id.startsWith('cambio:'));

  return {
    clienteNombre: reporte.cliente.nombre,
    profesional: profesional ?? null,
    hoyISO,
    fechaActual: analisis.fechaFinal,
    fechaAnterior: reporte.historico.length >= 2 ? reporte.historico[1].fecha : null,
    cantidadMediciones: analisis.cantidadMediciones,
    suficiencia: analisis.suficiencia,
    tituloResumen: analisis.resumen.titulo,
    textoResumen: analisis.resumen.texto,

    cambiosSignificativos: cambios
      .filter((h) => h.suficiencia === 'suficiente')
      .map((h) => ({ variable: h.variables[0], etiqueta: etiquetaDe(h.variables[0]), titulo: h.titulo, id: h.id })),

    cambiosSinUmbral: cambios
      .filter((h) => h.suficiencia === 'parcial')
      .map((h) => ({ variable: h.variables[0], etiqueta: etiquetaDe(h.variables[0]), titulo: h.titulo, id: h.id })),

    tendencias: porPrefijo('tendencia:'),

    observaciones: observaciones.bloques.flatMap((b) =>
      b.observaciones.map((o) => ({
        id: o.id,
        bloque: b.bloque,
        texto: o.texto,
        referencias: o.trazabilidad.referenceIds,
        fichas: o.trazabilidad.knowledgeIds,
      }))
    ),

    recomendaciones: recomendaciones.recomendaciones.map((r) => ({
      id: r.id,
      categoria: r.categoria,
      prioridad: r.prioridad,
      titulo: r.titulo,
      accion: r.accionProfesional,
    })),

    alertas: analisis.avisos
      .filter((a) => a.tipo === 'alerta')
      .map((a) => ({ id: a.id, titulo: a.titulo })),

    limitaciones: analisis.avisos
      .filter((a) => a.tipo === 'limitacion')
      .map((a) => ({ id: a.id, titulo: a.titulo, descripcion: a.descripcion })),

    ambitosNoCubiertos: recomendaciones.limitaciones.map((l) => l.ambito),

    variablesDisponibles: reporte.ficha.flatMap((b) => b.filas.map((f) => f.id)),
  };
}
