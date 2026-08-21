// ── Composición del Reporte del BCS (capa Application/Dominio del bounded ──
// context) ───────────────────────────────────────────────────────────────
//
// El Reporte es un value object NO persistido, siempre computado on-demand
// (BCS Handbook Domain Model, IN-D3) a partir de un Cliente y sus
// Mediciones vigentes — nunca un snapshot en base de datos. Esta es la
// única implementación: la sirven tanto el panel del Entrenador como la
// vista pública del Cliente (BCS-ADR-05, paridad total de contenido —
// "no hay dos implementaciones que mantener sincronizadas").
//
// Pureza: recibe objetos (Cliente, Medicion[]), devuelve objetos. Sin
// Supabase, sin fetch, sin React, sin Date.now() salvo donde el propio
// dominio lo requiere explícitamente (aquí no se necesita: todo delta es
// entre dos Mediciones, nunca contra "ahora"). Mismo principio de pureza
// que los motores de src/lib/engines/, aplicado al bounded context del BCS,
// que no tiene su propio "motor" — este archivo es su equivalente.
//
// ── Reglas de dominio implementadas exactamente como están especificadas
// (BCS Handbook 05/06, BCS Design Handbook 09/12) — nada inventado:
//
//   · Clasificación (06-modelo-interpretacion): de las 25 variables, SOLO
//     4 tienen clasificación definida (IMC, %grasa, grasa visceral, WHR).
//     De esas 4, esta implementación solo puede CALCULAR la de IMC: %grasa
//     y WHR exigen sexo+edad del Cliente (06: "por sexo y edad" / "por
//     sexo (OMS)") y grasa visceral exige la escala del fabricante del
//     dispositivo (03: BCS-V14) — ninguno de esos tres campos existe en
//     `Cliente` ni en `Medicion` (ver src/lib/bcs/tipos.ts). Es una regla
//     que falta la información para aplicarse: se documenta aquí y se
//     detiene SOLO ese punto (ninguna clasificación se inventa para las
//     tres), el resto del Reporte se construye completo. Ver informe del
//     Sprint para el detalle.
//   · SMI, Ángulo de fase, Edad metabólica y los valores absolutos de masa
//     NUNCA se clasifican (06) — se muestran como tendencia únicamente.
//   · Dirección de "mejora" (05-modelo-historial): solo 5 variables la
//     tienen asignada; Peso/IMC explícitamente sin dirección; el resto
//     (agua, proteína, minerales, masa ósea, SMI, WHR, ángulo de fase,
//     edad metabólica, altura, circunferencias, impedancia, BMR) queda
//     "sin dirección razonablemente universal" según el propio handbook
//     — se tratan como Neutral, consistente con el Design Handbook (VIZ-05,
//     06, 08, 09, 11 ya las trata así).
//   · Umbral de "cambio insignificante" (Design Handbook 12): el handbook
//     da únicamente 2 ejemplos numéricos explícitos (peso <0.2kg, %grasa
//     <0.3pp) y dice literalmente que no define el resto. No se inventan
//     umbrales para las otras 20 variables — un delta distinto de cero sin
//     umbral definido se clasifica por dirección (o Neutral si no tiene
//     dirección asignada), nunca como "insignificante".
//   · Validaciones cruzadas (03-modelo-datos): solo la de
//     Masa grasa + Masa libre de grasa ≈ Peso trae tolerancia numérica
//     explícita (±0.5 kg) — se implementa. La de Agua intra+extra≈total no
//     trae tolerancia numérica; no se inventa una, se documenta como
//     pendiente en el informe.

import type { Cliente, Medicion } from '@/lib/bcs/tipos';
import { bloqueoDe, sujetoDe, type SujetoBCS } from '@/lib/bcs/identidad';

// ── Catálogo de variables ──────────────────────────────────────────────────

export type VariableId =
  | 'altura_cm' | 'peso_kg' | 'imc' | 'circ_cintura_cm' | 'circ_cadera_cm' | 'whr'
  | 'grasa_pct' | 'masa_grasa_kg' | 'masa_muscular_kg' | 'masa_libre_grasa_kg'
  | 'proteina_kg' | 'minerales_kg' | 'masa_osea_kg' | 'grasa_visceral_idx'
  | 'agua_total_l' | 'agua_intracelular_l' | 'agua_extracelular_l'
  | 'bmr_kcal' | 'edad_metabolica' | 'smi' | 'angulo_fase_deg' | 'impedancia_ohm';

export type Categoria = 'antropometria' | 'composicion' | 'agua' | 'metabolicos';

/** Las 5 etiquetas de procedencia del BCS Handbook (00) — nunca semánticas. */
export type Procedencia = 'crudo' | 'derivado' | 'fabricante' | 'validacion' | 'producto';

export type DireccionMejora = 'aumentar' | 'disminuir' | 'neutral';
export type TipoGrafico = 'linea' | 'area_apilada' | 'sin_grafico';

interface DefinicionVariable {
  id: VariableId;
  etiqueta: string;
  unidad: string;
  categoria: Categoria;
  procedencia: Procedencia;
  direccionMejora: DireccionMejora;
  tipoGrafico: TipoGrafico;
  /** true = el BCS Handbook define clasificación para esta variable (06). No implica que HOY se pueda calcular — ver `clasificarValor`. */
  clasificableEnEspecificacion: boolean;
  /** Solo definido donde el Design Handbook (12) da un número explícito. */
  umbralInsignificante?: number;
}

export const CATALOGO: Record<VariableId, DefinicionVariable> = {
  altura_cm: { id: 'altura_cm', etiqueta: 'Altura', unidad: 'cm', categoria: 'antropometria', procedencia: 'crudo', direccionMejora: 'neutral', tipoGrafico: 'sin_grafico', clasificableEnEspecificacion: false },
  peso_kg: { id: 'peso_kg', etiqueta: 'Peso', unidad: 'kg', categoria: 'antropometria', procedencia: 'crudo', direccionMejora: 'neutral', tipoGrafico: 'linea', clasificableEnEspecificacion: false, umbralInsignificante: 0.2 },
  imc: { id: 'imc', etiqueta: 'IMC', unidad: 'kg/m²', categoria: 'antropometria', procedencia: 'derivado', direccionMejora: 'neutral', tipoGrafico: 'linea', clasificableEnEspecificacion: true },
  circ_cintura_cm: { id: 'circ_cintura_cm', etiqueta: 'Circunferencia de cintura', unidad: 'cm', categoria: 'antropometria', procedencia: 'crudo', direccionMejora: 'neutral', tipoGrafico: 'sin_grafico', clasificableEnEspecificacion: false },
  circ_cadera_cm: { id: 'circ_cadera_cm', etiqueta: 'Circunferencia de cadera', unidad: 'cm', categoria: 'antropometria', procedencia: 'crudo', direccionMejora: 'neutral', tipoGrafico: 'sin_grafico', clasificableEnEspecificacion: false },
  whr: { id: 'whr', etiqueta: 'WHR (relación cintura-cadera)', unidad: '', categoria: 'antropometria', procedencia: 'derivado', direccionMejora: 'neutral', tipoGrafico: 'linea', clasificableEnEspecificacion: true },
  grasa_pct: { id: 'grasa_pct', etiqueta: '% Grasa corporal', unidad: '%', categoria: 'composicion', procedencia: 'crudo', direccionMejora: 'disminuir', tipoGrafico: 'linea', clasificableEnEspecificacion: true, umbralInsignificante: 0.3 },
  masa_grasa_kg: { id: 'masa_grasa_kg', etiqueta: 'Masa grasa', unidad: 'kg', categoria: 'composicion', procedencia: 'derivado', direccionMejora: 'disminuir', tipoGrafico: 'linea', clasificableEnEspecificacion: false },
  masa_muscular_kg: { id: 'masa_muscular_kg', etiqueta: 'Masa muscular', unidad: 'kg', categoria: 'composicion', procedencia: 'crudo', direccionMejora: 'aumentar', tipoGrafico: 'linea', clasificableEnEspecificacion: false },
  masa_libre_grasa_kg: { id: 'masa_libre_grasa_kg', etiqueta: 'Masa libre de grasa', unidad: 'kg', categoria: 'composicion', procedencia: 'derivado', direccionMejora: 'aumentar', tipoGrafico: 'linea', clasificableEnEspecificacion: false },
  proteina_kg: { id: 'proteina_kg', etiqueta: 'Proteína corporal', unidad: 'kg', categoria: 'composicion', procedencia: 'crudo', direccionMejora: 'neutral', tipoGrafico: 'linea', clasificableEnEspecificacion: false },
  minerales_kg: { id: 'minerales_kg', etiqueta: 'Minerales', unidad: 'kg', categoria: 'composicion', procedencia: 'crudo', direccionMejora: 'neutral', tipoGrafico: 'linea', clasificableEnEspecificacion: false },
  masa_osea_kg: { id: 'masa_osea_kg', etiqueta: 'Masa ósea', unidad: 'kg', categoria: 'composicion', procedencia: 'crudo', direccionMejora: 'neutral', tipoGrafico: 'linea', clasificableEnEspecificacion: false },
  grasa_visceral_idx: { id: 'grasa_visceral_idx', etiqueta: 'Grasa visceral', unidad: 'índice', categoria: 'composicion', procedencia: 'fabricante', direccionMejora: 'disminuir', tipoGrafico: 'linea', clasificableEnEspecificacion: true },
  agua_total_l: { id: 'agua_total_l', etiqueta: 'Agua corporal total', unidad: 'L', categoria: 'agua', procedencia: 'crudo', direccionMejora: 'neutral', tipoGrafico: 'area_apilada', clasificableEnEspecificacion: false },
  agua_intracelular_l: { id: 'agua_intracelular_l', etiqueta: 'Agua intracelular', unidad: 'L', categoria: 'agua', procedencia: 'crudo', direccionMejora: 'neutral', tipoGrafico: 'area_apilada', clasificableEnEspecificacion: false },
  agua_extracelular_l: { id: 'agua_extracelular_l', etiqueta: 'Agua extracelular', unidad: 'L', categoria: 'agua', procedencia: 'crudo', direccionMejora: 'neutral', tipoGrafico: 'area_apilada', clasificableEnEspecificacion: false },
  bmr_kcal: { id: 'bmr_kcal', etiqueta: 'Tasa metabólica basal (BMR)', unidad: 'kcal/día', categoria: 'metabolicos', procedencia: 'crudo', direccionMejora: 'neutral', tipoGrafico: 'linea', clasificableEnEspecificacion: false },
  edad_metabolica: { id: 'edad_metabolica', etiqueta: 'Edad metabólica', unidad: 'años', categoria: 'metabolicos', procedencia: 'validacion', direccionMejora: 'neutral', tipoGrafico: 'linea', clasificableEnEspecificacion: false },
  smi: { id: 'smi', etiqueta: 'SMI (Índice de Masa Muscular Esquelética)', unidad: 'kg/m²', categoria: 'metabolicos', procedencia: 'derivado', direccionMejora: 'neutral', tipoGrafico: 'linea', clasificableEnEspecificacion: false },
  angulo_fase_deg: { id: 'angulo_fase_deg', etiqueta: 'Ángulo de fase', unidad: '°', categoria: 'metabolicos', procedencia: 'fabricante', direccionMejora: 'neutral', tipoGrafico: 'linea', clasificableEnEspecificacion: false },
  impedancia_ohm: { id: 'impedancia_ohm', etiqueta: 'Impedancia', unidad: 'Ω', categoria: 'metabolicos', procedencia: 'crudo', direccionMejora: 'neutral', tipoGrafico: 'sin_grafico', clasificableEnEspecificacion: false },
};

export const CATEGORIAS: { id: Categoria; etiqueta: string }[] = [
  { id: 'antropometria', etiqueta: 'Antropometría' },
  { id: 'composicion', etiqueta: 'Composición' },
  { id: 'agua', etiqueta: 'Agua' },
  { id: 'metabolicos', etiqueta: 'Metabólicos' },
];

const ORDEN_VARIABLES = Object.keys(CATALOGO) as VariableId[];

// ── Clasificación (BCS Handbook 06) ────────────────────────────────────────

export interface Clasificacion {
  etiqueta: string;
  texto: string;
}

/**
 * Las tres variables que la especificación clasifica y este sistema todavía
 * no. **Solo la lista** — el motivo de cada una ya no es una constante.
 *
 * Lo era, y decía «ningún campo de Cliente ni Medición los captura hoy».
 * Desde BCS-7.0 los campos existen, así que la frase pasó de verdadera a
 * falsa sin que nada avisara. Pero el defecto de fondo era otro: una sola
 * frase describía cuatro situaciones distintas —falta el sexo, falta la fecha
 * de nacimiento, falta el dispositivo, falta cargar la tabla— y solo tres de
 * ellas las puede resolver quien lee el informe.
 *
 * El motivo se calcula ahora por sujeto y por medición en `bcs/identidad`.
 */
export const CLASIFICABLES_PENDIENTES: readonly VariableId[] = [
  'grasa_pct',
  'whr',
  'grasa_visceral_idx',
];

/** Solo IMC es calculable con los datos disponibles hoy (bandas OMS universales, sin sexo/edad/dispositivo). */
function clasificarImc(valor: number): Clasificacion {
  if (valor < 18.5) {
    return { etiqueta: 'Bajo peso', texto: `IMC de ${valor.toFixed(1)} kg/m² — por debajo del rango de referencia general para adultos (18.5–24.9). Este rango no está validado para personas con alta masa muscular; considerar junto al % de grasa corporal registrado.` };
  }
  if (valor < 25) {
    return { etiqueta: 'Normal', texto: `IMC de ${valor.toFixed(1)} kg/m² — dentro del rango de referencia general para adultos (18.5–24.9). Este rango no está validado para personas con alta masa muscular; considerar junto al % de grasa corporal registrado.` };
  }
  if (valor < 30) {
    return { etiqueta: 'Sobrepeso', texto: `IMC de ${valor.toFixed(1)} kg/m² — por encima del rango de referencia general para adultos (18.5–24.9). Este rango no está validado para personas con alta masa muscular; considerar junto al % de grasa corporal registrado.` };
  }
  return { etiqueta: 'Obesidad', texto: `IMC de ${valor.toFixed(1)} kg/m² — por encima del rango de referencia general para adultos (18.5–24.9). Este rango no está validado para personas con alta masa muscular; considerar junto al % de grasa corporal registrado.` };
}

function clasificarValor(id: VariableId, valor: number): Clasificacion | null {
  if (id === 'imc') return clasificarImc(valor);
  return null;
}

// ── Delta / tendencia entre dos Mediciones ─────────────────────────────────

export type TipoDelta = 'positivo' | 'negativo' | 'insignificante' | 'sin_direccion';

export interface Delta {
  absoluto: number;
  relativo: number | null;
  tipo: TipoDelta;
}

export function calcularDelta(id: VariableId, actual: number, anterior: number): Delta {
  const def = CATALOGO[id];
  const absoluto = actual - anterior;
  const relativo = anterior !== 0 ? (absoluto / anterior) * 100 : null;

  if (absoluto === 0) return { absoluto, relativo, tipo: 'insignificante' };
  if (def.direccionMejora === 'neutral') return { absoluto, relativo, tipo: 'sin_direccion' };
  if (def.umbralInsignificante !== undefined && Math.abs(absoluto) < def.umbralInsignificante) {
    return { absoluto, relativo, tipo: 'insignificante' };
  }

  const esMejora =
    (def.direccionMejora === 'aumentar' && absoluto > 0) ||
    (def.direccionMejora === 'disminuir' && absoluto < 0);
  return { absoluto, relativo, tipo: esMejora ? 'positivo' : 'negativo' };
}

// ── Ficha de la medición actual, agrupada por categoría ────────────────────

export interface FilaVariable {
  id: VariableId;
  etiqueta: string;
  unidad: string;
  valor: number;
  procedencia: Procedencia;
  clasificacion: Clasificacion | null;
  bloqueoClasificacion: string | null;
}

export interface BloqueCategoria {
  categoria: Categoria;
  etiqueta: string;
  filas: FilaVariable[];
}

export function construirFicha(medicion: Medicion, sujeto: SujetoBCS): BloqueCategoria[] {
  return CATEGORIAS.map(({ id: categoria, etiqueta }) => {
    const filas: FilaVariable[] = ORDEN_VARIABLES
      .filter((id) => CATALOGO[id].categoria === categoria)
      .reduce<FilaVariable[]>((acc, id) => {
        const valor = medicion[id];
        if (valor === null || valor === undefined) return acc; // R6/DS-09: ausente ≠ cero — se omite, nunca placeholder "—"
        const def = CATALOGO[id];
        acc.push({
          id,
          etiqueta: def.etiqueta,
          unidad: def.unidad,
          valor,
          procedencia: def.procedencia,
          clasificacion: clasificarValor(id, valor),
          bloqueoClasificacion: bloqueoDe(id, sujeto, medicion)?.detalle ?? null,
        });
        return acc;
      }, []);
    return { categoria, etiqueta, filas };
  });
}

// ── Comparación entre dos Mediciones (Design Handbook 12) ──────────────────

export interface FilaComparacion {
  id: VariableId;
  etiqueta: string;
  unidad: string;
  valorAnterior: number;
  valorActual: number;
  delta: Delta;
}

/** Solo variables presentes en AMBAS mediciones — ausente en una se omite, nunca delta=0 falso (Design Handbook 12). */
export function construirComparacion(actual: Medicion, anterior: Medicion): FilaComparacion[] {
  return ORDEN_VARIABLES.reduce<FilaComparacion[]>((acc, id) => {
    const va = actual[id];
    const vb = anterior[id];
    if (va === null || va === undefined || vb === null || vb === undefined) return acc;
    acc.push({
      id,
      etiqueta: CATALOGO[id].etiqueta,
      unidad: CATALOGO[id].unidad,
      valorAnterior: vb,
      valorActual: va,
      delta: calcularDelta(id, va, vb),
    });
    return acc;
  }, []);
}

// ── Series de tendencia (Design Handbook 09/11) ────────────────────────────

export interface PuntoSerie {
  fecha: string;
  valor: number;
}

export interface SerieTendencia {
  id: VariableId;
  etiqueta: string;
  unidad: string;
  tipoGrafico: TipoGrafico;
  puntos: PuntoSerie[];
}

/** Histórico ascendente (más antigua primero) — convención de gráficos (BCS Handbook 05). Solo variables con >=2 puntos (BCS Handbook 07: mínimo 2 Mediciones para Línea). */
export function construirTendencias(historicoDesc: Medicion[]): SerieTendencia[] {
  const historicoAsc = [...historicoDesc].reverse();
  return ORDEN_VARIABLES
    .filter((id) => CATALOGO[id].tipoGrafico !== 'sin_grafico')
    .map((id) => {
      const puntos = historicoAsc
        .map((m) => ({ fecha: m.fecha, valor: m[id] }))
        .filter((p): p is PuntoSerie => p.valor !== null && p.valor !== undefined);
      return { id, etiqueta: CATALOGO[id].etiqueta, unidad: CATALOGO[id].unidad, tipoGrafico: CATALOGO[id].tipoGrafico, puntos };
    })
    .filter((serie) => serie.puntos.length >= 2);
}

// ── Resumen ejecutivo (BCS Handbook 04, 3-5 cifras) ─────────────────────────

export interface ItemResumen {
  id: VariableId;
  texto: string;
}

const VARIABLES_RESUMEN: VariableId[] = ['peso_kg', 'grasa_pct', 'masa_muscular_kg', 'imc'];

function formatearDelta(etiqueta: string, unidad: string, delta: Delta): string {
  const signo = delta.absoluto > 0 ? '+' : '';
  const valorTxt = `${signo}${delta.absoluto.toFixed(1)}${unidad ? ` ${unidad}` : ''}`;
  if (delta.tipo === 'sin_direccion' || delta.tipo === 'insignificante') {
    return `${etiqueta}: ${valorTxt} desde la última medición`;
  }
  const verbo = delta.absoluto > 0 ? 'subió' : 'bajó';
  return `${etiqueta}: ${verbo} ${Math.abs(delta.absoluto).toFixed(1)}${unidad ? ` ${unidad}` : ''} desde la última medición`;
}

export function construirResumenEjecutivo(actual: Medicion, anterior: Medicion | null): ItemResumen[] {
  return VARIABLES_RESUMEN.reduce<ItemResumen[]>((acc, id) => {
    const valor = actual[id];
    if (valor === null || valor === undefined) return acc;
    const def = CATALOGO[id];
    const base = `${def.etiqueta}: ${valor.toFixed(1)}${def.unidad ? ` ${def.unidad}` : ''}`;
    const valorAnterior = anterior?.[id];
    const texto =
      valorAnterior !== null && valorAnterior !== undefined
        ? formatearDelta(def.etiqueta, def.unidad, calcularDelta(id, valor, valorAnterior)).replace(`${def.etiqueta}: `, `${base} — `)
        : base;
    acc.push({ id, texto });
    return acc;
  }, []);
}

// ── Validaciones cruzadas (BCS Handbook 03) — solo la que trae tolerancia
// numérica explícita (±0.5 kg). La de agua intra+extra≈total no trae
// tolerancia en el handbook: no se implementa para no inventar un número. ──

export interface AdvertenciaValidacion {
  id: 'masa_no_suma_peso';
  texto: string;
}

const TOLERANCIA_MASA_KG = 0.5;

export function calcularAdvertencias(m: Medicion): AdvertenciaValidacion[] {
  const advertencias: AdvertenciaValidacion[] = [];
  if (m.masa_grasa_kg !== null && m.masa_libre_grasa_kg !== null && m.peso_kg !== null) {
    const suma = m.masa_grasa_kg + m.masa_libre_grasa_kg;
    if (Math.abs(suma - m.peso_kg) > TOLERANCIA_MASA_KG) {
      advertencias.push({
        id: 'masa_no_suma_peso',
        texto: `Masa grasa + masa libre de grasa (${suma.toFixed(1)} kg) difiere del peso registrado (${m.peso_kg.toFixed(1)} kg) en más de ${TOLERANCIA_MASA_KG} kg — verificar la medición.`,
      });
    }
  }
  return advertencias;
}

// ── El Reporte completo (BCS Handbook 04, 8 secciones) ─────────────────────

/**
 * Lo que el Reporte necesita del Cliente.
 *
 * `sexo` y `fecha_nacimiento` entran aquí porque sin ellos no puede decirse
 * POR QUÉ una variable no se clasifica, y decir «faltan datos» sin nombrar
 * cuáles convierte una tarea de treinta segundos en un callejón sin salida.
 */
export type ClienteDelReporte = Pick<
  Cliente,
  'id' | 'nombre' | 'estado' | 'sexo' | 'fecha_nacimiento'
>;

export interface Reporte {
  cliente: ClienteDelReporte;
  medicionActual: Medicion;
  medicionAnterior: Medicion | null;
  resumenEjecutivo: ItemResumen[];
  ficha: BloqueCategoria[];
  comparacion: FilaComparacion[] | null;
  historico: Medicion[];
  tendencias: SerieTendencia[];
  advertencias: AdvertenciaValidacion[];
  fotografias: { url: string; fecha: string }[];
}

/**
 * Compone el Reporte completo. `historicoVigenteDesc` debe venir ya
 * filtrado a mediciones `vigente` y ordenado por fecha descendente
 * (exactamente lo que devuelve `listarMedicionesVigentesPorCliente` —
 * esta función no vuelve a filtrar por estado, confía en su contrato).
 */
export function construirReporte(
  cliente: ClienteDelReporte,
  historicoVigenteDesc: Medicion[]
): Reporte | null {
  if (historicoVigenteDesc.length === 0) return null;

  const [medicionActual, medicionAnterior = null] = historicoVigenteDesc;
  const sujeto = sujetoDe(cliente);

  return {
    cliente,
    medicionActual,
    medicionAnterior,
    resumenEjecutivo: construirResumenEjecutivo(medicionActual, medicionAnterior),
    ficha: construirFicha(medicionActual, sujeto),
    comparacion: medicionAnterior ? construirComparacion(medicionActual, medicionAnterior) : null,
    historico: historicoVigenteDesc,
    tendencias: construirTendencias(historicoVigenteDesc),
    advertencias: calcularAdvertencias(medicionActual),
    fotografias: historicoVigenteDesc
      .filter((m) => m.foto_url)
      .map((m) => ({ url: m.foto_url as string, fecha: m.fecha }))
      .reverse(), // cronológico ascendente (BCS Handbook 04, sección 8)
  };
}
