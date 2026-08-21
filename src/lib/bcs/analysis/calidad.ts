// ── Calidad y consistencia del dato (Sprint I-03) ──────────────────────────
// Implementa la matriz de validaciones cruzadas y los rangos/valores
// sospechosos del BCS Handbook 03 — únicamente los que traen cifra. Las
// reglas documentadas pero sin número quedan enumeradas en reglas.ts y se
// emiten aquí como limitación, no como silencio.
//
// Nunca diagnostica el dispositivo ni al cliente: el handbook es explícito
// en que una razón ECW/ICW elevada "puede ser dato real (retención) o error
// de contacto de electrodos; BREY no distingue automáticamente, solo lo
// marca para revisión del entrenador". Ese es el techo de lo que esta capa
// afirma.

import { CATALOGO, type VariableId } from '@/lib/bcs/reporte';
import { bloqueosDe, SUJETO_DESCONOCIDO, type SujetoBCS } from '@/lib/bcs/identidad';
import type { Medicion } from '@/lib/bcs/tipos';
import { diasEntre } from './comparacion';
import {
  CAMBIO_SOSPECHOSO,
  IMC_SOSPECHOSO_PCT,
  MASAS_ACOTADAS_POR_PESO,
  RANGO_FISICO,
  TOLERANCIA_SUMA_MASAS_KG,
  VALOR_IMPOSIBLE,
} from './reglas';

export type ClaseIncidencia = 'alerta' | 'limitacion' | 'nota';

export interface Incidencia {
  /** Id estable; incluye la variable cuando la regla es por variable. */
  id: string;
  clase: ClaseIncidencia;
  severidad: 'informativo' | 'atencion';
  titulo: string;
  descripcion: string;
  variables: VariableId[];
  mediciones: string[];
}

function valorSuperaLimite(valor: number, variable: VariableId, peso: number | null, aguaTotal: number | null): boolean {
  const limite = VALOR_IMPOSIBLE[variable];
  if (!limite) return false;
  if (limite.menorOIgualA !== undefined && valor <= limite.menorOIgualA) return true;
  if (limite.menorA !== undefined && valor < limite.menorA) return true;
  if (limite.mayorA !== undefined && valor > limite.mayorA) return true;
  if (limite.noSuperaPeso && peso !== null && valor > peso) return true;
  if (limite.noSuperaAguaTotal && aguaTotal !== null && valor > aguaTotal) return true;
  return false;
}

/** Valores imposibles y fuera del rango físico de referencia, para UNA medición. */
function revisarValores(m: Medicion): Incidencia[] {
  const incidencias: Incidencia[] = [];
  const variables = Object.keys(CATALOGO) as VariableId[];

  for (const variable of variables) {
    const valor = m[variable];
    if (valor === null || valor === undefined) continue;
    const def = CATALOGO[variable];

    if (valorSuperaLimite(valor, variable, m.peso_kg, m.agua_total_l)) {
      incidencias.push({
        id: `valor_imposible:${variable}:${m.id}`,
        clase: 'alerta',
        severidad: 'atencion',
        titulo: `Valor no válido en ${def.etiqueta}`,
        descripcion: `${def.etiqueta} registra ${valor}${def.unidad ? ` ${def.unidad}` : ''} en la medición del ${m.fecha}, un valor que no es físicamente posible. Conviene revisar el registro.`,
        variables: [variable],
        mediciones: [m.id],
      });
      continue; // Ya es imposible: comprobar además el rango sería redundante.
    }

    const rango = RANGO_FISICO[variable];
    if (rango && (valor < rango.min || valor > rango.max)) {
      incidencias.push({
        id: `fuera_de_rango:${variable}:${m.id}`,
        clase: rango.orientativo ? 'nota' : 'alerta',
        severidad: rango.orientativo ? 'informativo' : 'atencion',
        titulo: `${def.etiqueta} fuera del rango de referencia`,
        descripcion: `${def.etiqueta} registra ${valor}${def.unidad ? ` ${def.unidad}` : ''} en la medición del ${m.fecha}, fuera del rango de referencia habitual (${rango.min}–${rango.max}${def.unidad ? ` ${def.unidad}` : ''})${rango.orientativo ? ', que es orientativo' : ''}.`,
        variables: [variable],
        mediciones: [m.id],
      });
    }
  }

  return incidencias;
}

/** Matriz de validaciones cruzadas (BCS Handbook 03) para UNA medición. */
function revisarConsistencia(m: Medicion): Incidencia[] {
  const incidencias: Incidencia[] = [];

  if (m.masa_grasa_kg !== null && m.masa_libre_grasa_kg !== null && m.peso_kg !== null) {
    const suma = m.masa_grasa_kg + m.masa_libre_grasa_kg;
    const desvio = Math.abs(suma - m.peso_kg);
    if (desvio > TOLERANCIA_SUMA_MASAS_KG) {
      incidencias.push({
        id: `suma_masas:${m.id}`,
        clase: 'alerta',
        severidad: 'atencion',
        titulo: 'Las masas no reconstruyen el peso',
        descripcion: `En la medición del ${m.fecha}, masa grasa + masa libre de grasa suman ${suma.toFixed(1)} kg, frente a un peso registrado de ${m.peso_kg.toFixed(1)} kg — una diferencia de ${desvio.toFixed(1)} kg, por encima de la tolerancia de ${TOLERANCIA_SUMA_MASAS_KG} kg.`,
        variables: ['masa_grasa_kg', 'masa_libre_grasa_kg', 'peso_kg'],
        mediciones: [m.id],
      });
    }
  }

  if (m.peso_kg !== null) {
    for (const variable of MASAS_ACOTADAS_POR_PESO) {
      const valor = m[variable];
      if (valor !== null && valor !== undefined && valor > m.peso_kg) {
        incidencias.push({
          id: `masa_supera_peso:${variable}:${m.id}`,
          clase: 'alerta',
          severidad: 'atencion',
          titulo: `${CATALOGO[variable].etiqueta} supera el peso total`,
          descripcion: `En la medición del ${m.fecha}, ${CATALOGO[variable].etiqueta.toLowerCase()} (${valor} kg) es mayor que el peso registrado (${m.peso_kg} kg), lo cual no es posible.`,
          variables: [variable, 'peso_kg'],
          mediciones: [m.id],
        });
      }
    }
  }

  if (m.agua_intracelular_l !== null && m.agua_extracelular_l !== null && m.agua_total_l !== null) {
    incidencias.push({
      id: `agua_sin_tolerancia:${m.id}`,
      clase: 'limitacion',
      severidad: 'informativo',
      titulo: 'La suma de aguas no puede verificarse',
      descripcion:
        'Agua intracelular y extracelular deberían reconstruir el agua corporal total, pero no existe una tolerancia definida para decidir cuándo la diferencia es aceptable. No se emite ningún juicio sobre esta relación.',
      variables: ['agua_intracelular_l', 'agua_extracelular_l', 'agua_total_l'],
      mediciones: [m.id],
    });
  }

  return incidencias;
}

/** Cambios sospechosos entre dos Mediciones consecutivas. */
function revisarCambios(anterior: Medicion, actual: Medicion): Incidencia[] {
  const incidencias: Incidencia[] = [];
  const dias = diasEntre(anterior.fecha, actual.fecha);

  for (const [clave, regla] of Object.entries(CAMBIO_SOSPECHOSO)) {
    const variable = clave as VariableId;
    const previo = anterior[variable];
    const nuevo = actual[variable];
    if (previo === null || previo === undefined || nuevo === null || nuevo === undefined) continue;

    // Con ventana definida, la regla solo aplica dentro de ella: un cambio
    // grande en 6 meses no es sospechoso, en 5 días sí.
    if (regla.ventanaDias !== null && (Number.isNaN(dias) || dias >= regla.ventanaDias)) continue;

    const deltaAbs = Math.abs(nuevo - previo);
    const excede =
      regla.tipo === 'porcentual'
        ? previo !== 0 && (deltaAbs / Math.abs(previo)) * 100 > regla.umbral
        : deltaAbs > regla.umbral;

    if (excede) {
      incidencias.push({
        id: `cambio_sospechoso:${variable}:${actual.id}`,
        clase: 'alerta',
        severidad: 'atencion',
        titulo: `Cambio inusual en ${CATALOGO[variable].etiqueta}`,
        descripcion: `${regla.descripcion} Entre el ${anterior.fecha} y el ${actual.fecha}${Number.isNaN(dias) ? '' : ` (${dias} días)`}. Puede ser un cambio real o un error de registro — conviene verificarlo.`,
        variables: [variable],
        mediciones: [anterior.id, actual.id],
      });
    }
  }

  // IMC: su regla no es solo un delta — exige además que altura y peso NO
  // hayan cambiado, porque un IMC que se mueve con ellos es esperable.
  const imcPrevio = anterior.imc;
  const imcNuevo = actual.imc;
  if (
    imcPrevio !== null &&
    imcNuevo !== null &&
    imcPrevio !== 0 &&
    anterior.altura_cm !== null &&
    actual.altura_cm !== null &&
    anterior.peso_kg !== null &&
    actual.peso_kg !== null &&
    anterior.altura_cm === actual.altura_cm &&
    anterior.peso_kg === actual.peso_kg
  ) {
    const variacion = (Math.abs(imcNuevo - imcPrevio) / Math.abs(imcPrevio)) * 100;
    if (variacion > IMC_SOSPECHOSO_PCT) {
      incidencias.push({
        id: `imc_sospechoso:${actual.id}`,
        clase: 'alerta',
        severidad: 'atencion',
        titulo: 'El IMC cambió sin que cambiaran peso ni altura',
        descripcion: `El IMC varió ${variacion.toFixed(1)} % entre el ${anterior.fecha} y el ${actual.fecha}, pero el peso y la altura registrados son idénticos en ambas mediciones. Conviene revisar el cálculo.`,
        variables: ['imc', 'peso_kg', 'altura_cm'],
        mediciones: [anterior.id, actual.id],
      });
    }
  }

  return incidencias;
}

/**
 * Limitaciones de clasificación, con el motivo REAL de cada una.
 *
 * El motivo depende del sujeto y de la medición, no de la variable: la misma
 * `grasa_pct` está bloqueada por el sexo en un cliente, por el dispositivo en
 * otro, y por la tabla sin cargar en un tercero. Una constante no puede
 * distinguirlos, y la diferencia es la que decide a quién se le pide el dato.
 */
function limitacionesDeClasificacion(actual: Medicion, sujeto: SujetoBCS): Incidencia[] {
  return bloqueosDe(actual, sujeto).map((b) => ({
    id: `clasificacion_bloqueada:${b.variable}`,
    clase: 'limitacion' as ClaseIncidencia,
    severidad: 'informativo' as const,
    titulo: `${CATALOGO[b.variable].etiqueta} no puede clasificarse`,
    descripcion: b.detalle,
    variables: [b.variable],
    mediciones: [actual.id],
  }));
}

export interface EntradaCalidad {
  /** Mediciones vigentes, de la más reciente a la más antigua. */
  historicoDesc: readonly Medicion[];
  /** Fecha de referencia `yyyy-mm-dd` para detectar fechas futuras. Sin ella, esa validación se omite (nunca se consulta el reloj desde aquí). */
  hoyISO?: string;
  /**
   * Sexo y fecha de nacimiento del cliente, para poder decir POR QUÉ una
   * variable no se clasifica.
   *
   * Opcional, y su ausencia se trata como «no consta» —que es exactamente lo
   * que el informe sabe cuando nadie se lo pasa—, nunca como un sujeto
   * inventado.
   */
  sujeto?: SujetoBCS;
}

/**
 * Evalúa la calidad del histórico completo. No muta la entrada y no lee el
 * reloj: si el llamador no pasa `hoyISO`, la validación de fecha futura
 * simplemente no se ejecuta.
 */
export function evaluarCalidad({
  historicoDesc,
  hoyISO,
  sujeto = SUJETO_DESCONOCIDO,
}: EntradaCalidad): Incidencia[] {
  const incidencias: Incidencia[] = [];

  if (historicoDesc.length === 0) return incidencias;

  const actual = historicoDesc[0];

  for (const m of historicoDesc) {
    if (m.estado === 'anulada') {
      incidencias.push({
        id: `medicion_anulada:${m.id}`,
        clase: 'alerta',
        severidad: 'atencion',
        titulo: 'Medición anulada dentro del análisis',
        descripcion: `La medición del ${m.fecha} está anulada y no debería participar del historial visible. Se incluyó en el análisis, así que sus resultados pueden no ser fiables.`,
        variables: [],
        mediciones: [m.id],
      });
    }

    if (hoyISO !== undefined && m.fecha > hoyISO) {
      incidencias.push({
        id: `fecha_futura:${m.id}`,
        clase: 'alerta',
        severidad: 'atencion',
        titulo: 'Medición con fecha futura',
        descripcion: `La medición registrada el ${m.fecha} tiene una fecha posterior a hoy (${hoyISO}). Una medición nunca puede ser futura.`,
        variables: [],
        mediciones: [m.id],
      });
    }

    incidencias.push(...revisarValores(m));
    incidencias.push(...revisarConsistencia(m));
  }

  // Fechas duplicadas — válido a nivel de dato, pero marcado como sospechoso
  // para revisión (BCS Handbook 05, casos límite).
  const porFecha = new Map<string, string[]>();
  for (const m of historicoDesc) {
    porFecha.set(m.fecha, [...(porFecha.get(m.fecha) ?? []), m.id]);
  }
  for (const [fecha, ids] of porFecha) {
    if (ids.length > 1) {
      incidencias.push({
        id: `fecha_duplicada:${fecha}`,
        clase: 'alerta',
        severidad: 'atencion',
        titulo: 'Dos mediciones con la misma fecha',
        descripcion: `Hay ${ids.length} mediciones registradas el ${fecha}. Puede tratarse de un registro duplicado.`,
        variables: [],
        mediciones: ids,
      });
    }
  }

  // Pares consecutivos, del más antiguo al más reciente.
  const asc = [...historicoDesc].reverse();
  for (let i = 1; i < asc.length; i += 1) {
    incidencias.push(...revisarCambios(asc[i - 1], asc[i]));
  }

  incidencias.push(...limitacionesDeClasificacion(actual, sujeto));

  if (historicoDesc.length === 1) {
    incidencias.push({
      id: 'historial_insuficiente',
      clase: 'limitacion',
      severidad: 'informativo',
      titulo: 'Todavía no hay con qué comparar',
      descripcion:
        'Con una sola medición se puede describir el estado actual, pero no la evolución. A partir de la segunda medición aparecen la comparación y las tendencias.',
      variables: [],
      mediciones: [actual.id],
    });
  }

  return incidencias;
}
