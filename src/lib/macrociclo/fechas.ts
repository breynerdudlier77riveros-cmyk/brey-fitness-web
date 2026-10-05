// ── El calendario del macrociclo (Sprint MAC-3) ────────────────────────────
//
// LAS FECHAS Y LOS MESES NO SE GUARDAN. SE DERIVAN.
//
//   El documento guarda UNA fecha: el lunes de la semana 1. Todo lo demás
//   —el rango de cada semana, la banda de meses, el año— se calcula desde ahí.
//
//   Guardarlos sería guardar lo mismo dos veces. Y dos copias de un dato se
//   separan: cambiar la fecha de inicio dejaría una banda de meses que sigue
//   diciendo «Octubre» sobre una semana que ya cae en septiembre, y el plan
//   entero se leería mal sin que nada avisara.
//
// ── POR QUÉ NO SE USA `new Date('2026-01-05')` ───────────────────────────
//
//   Porque esa forma parsea en UTC y luego se lee en la zona local. Al oeste
//   de Greenwich —Colombia está en UTC-5— eso devuelve el DÍA ANTERIOR: un
//   plan que empieza el lunes 5 aparecería empezando el domingo 4, y la banda
//   de meses se correría entera en los planes que arrancan día 1.
//
//   Aquí la fecha se parte a mano y toda la aritmética va en `Date.UTC`, que
//   no tiene zona. Es un módulo puro y sin reloj: no consulta «hoy».

/** Una fecha de calendario, sin hora y sin zona. */
export interface FechaCivil {
  anio: number;
  /** 1 = enero … 12 = diciembre. */
  mes: number;
  dia: number;
}

export const MESES: readonly string[] = [
  'Enero',
  'Febrero',
  'Marzo',
  'Abril',
  'Mayo',
  'Junio',
  'Julio',
  'Agosto',
  'Septiembre',
  'Octubre',
  'Noviembre',
  'Diciembre',
];

/** `2026-01-05` → `{anio: 2026, mes: 1, dia: 5}`. `null` si no es una fecha. */
export function parsearISO(iso: string | null): FechaCivil | null {
  if (iso === null) return null;
  const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso.trim());
  if (m === null) return null;

  const anio = Number(m[1]);
  const mes = Number(m[2]);
  const dia = Number(m[3]);
  if (mes < 1 || mes > 12 || dia < 1 || dia > 31) return null;

  // `2026-02-31` pasa la comprobación de arriba y no existe. Se construye la
  // fecha y se comprueba que el día no se haya desbordado al mes siguiente:
  // aceptarla produciría una banda de meses desplazada un día sin avisar.
  const d = new Date(Date.UTC(anio, mes - 1, dia));
  if (d.getUTCMonth() !== mes - 1 || d.getUTCDate() !== dia) return null;

  return { anio, mes, dia };
}

export function formatearISO(f: FechaCivil): string {
  const dd = String(f.dia).padStart(2, '0');
  const mm = String(f.mes).padStart(2, '0');
  return `${f.anio}-${mm}-${dd}`;
}

/** Suma días. Sin zona horaria: toda la aritmética va en UTC. */
export function sumarDias(f: FechaCivil, dias: number): FechaCivil {
  const d = new Date(Date.UTC(f.anio, f.mes - 1, f.dia));
  d.setUTCDate(d.getUTCDate() + dias);
  return { anio: d.getUTCFullYear(), mes: d.getUTCMonth() + 1, dia: d.getUTCDate() };
}

/** El lunes y el domingo de una semana del plan, en base cero. */
export interface RangoSemana {
  semana: number;
  inicio: FechaCivil;
  fin: FechaCivil;
}

/**
 * El rango de cada semana del plan.
 *
 * Vacío si no hay fecha de inicio, que es un estado legítimo: una plantilla de
 * macrociclo se escribe muchas veces antes de saber cuándo empieza, y la
 * rejilla se lee entonces por número de semana.
 */
export function rangosDeSemanas(fechaInicio: string | null, semanas: number): RangoSemana[] {
  const inicio = parsearISO(fechaInicio);
  if (inicio === null) return [];

  return Array.from({ length: Math.max(0, Math.trunc(semanas)) }, (_, i) => {
    const desde = sumarDias(inicio, i * 7);
    return { semana: i, inicio: desde, fin: sumarDias(desde, 6) };
  });
}

/** «2 · 8» — el día de inicio y el de fin, como se lee en el plan gráfico. */
export function etiquetaDeRango(r: RangoSemana): string {
  return `${r.inicio.dia} · ${r.fin.dia}`;
}

/** Un tramo de la banda de meses: cuántas semanas consecutivas cubre. */
export interface TramoMes {
  /** 1..12 */
  mes: number;
  anio: number;
  nombre: string;
  /** Semana en la que empieza, base cero. */
  desde: number;
  semanas: number;
}

/**
 * La banda de meses, agrupando semanas consecutivas.
 *
 * ── A QUÉ MES PERTENECE UNA SEMANA QUE CAE ENTRE DOS ────────────────────
 *
 *   A la de su LUNES. Una semana del 29 de septiembre al 5 de octubre se
 *   cuenta en septiembre.
 *
 *   Hay que elegir un criterio y decirlo: repartirla entre los dos meses
 *   partiría la columna por la mitad y dejaría la rejilla sin una retícula
 *   común con las demás bandas, que es justo lo que hace legible el cuadro.
 */
export function bandaDeMeses(fechaInicio: string | null, semanas: number): TramoMes[] {
  const rangos = rangosDeSemanas(fechaInicio, semanas);
  const tramos: TramoMes[] = [];

  for (const r of rangos) {
    const ultimo = tramos[tramos.length - 1];
    if (ultimo !== undefined && ultimo.mes === r.inicio.mes && ultimo.anio === r.inicio.anio) {
      ultimo.semanas += 1;
      continue;
    }
    tramos.push({
      mes: r.inicio.mes,
      anio: r.inicio.anio,
      nombre: MESES[r.inicio.mes - 1],
      desde: r.semana,
      semanas: 1,
    });
  }

  return tramos;
}
