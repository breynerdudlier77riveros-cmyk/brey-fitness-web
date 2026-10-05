// ── Exportación a Excel (Sprint MAC-1) ─────────────────────────────────────
//
// Construye el LIBRO. No lo descarga: eso es cosa del navegador, y separarlo
// permite probar aquí exactamente lo que se va a abrir en Excel.
//
// ── LAS HOJAS ─────────────────────────────────────────────────────────────
//
//   · «Macrociclo» — la rejilla entera: la banda de mesociclos, las semanas,
//     las filas de planificación y el calendario de días.
//   · «Mesociclos» — un resumen con sus semanas de inicio y fin.
//   · Una hoja POR SESIÓN distinta, con sus bloques, ejercicios y series.
//
// ── UNA CELDA VACÍA SE QUEDA VACÍA ───────────────────────────────────────
//
//   `null` en el documento significa «no planificado». En el Excel sale una
//   celda vacía, no un cero ni un guion. Un cero en la fila de volumen se lee
//   como «esta semana no se entrena», que es una prescripción que nadie hizo.
//
// ── POR QUÉ TODO SALE COMO TEXTO SALVO LO QUE ES NÚMERO ──────────────────
//
//   Las filas declaran su tipo. Una fila `numero` cuyos valores son números
//   se escribe como número para que Excel pueda sumarla; si el entrenador
//   escribió «8-10» ahí, se escribe como texto y Excel no la estropea. Forzar
//   el número convertiría «8-10» en una fecha, que es el clásico desastre de
//   las hojas de cálculo.

import * as XLSX from 'xlsx';

import { claveDia, indiceCompetencias, indiceDias, iniciosDeMesociclo } from './contenido';
import { bandaDeMeses, etiquetaDeRango, rangosDeSemanas } from './fechas';
import { categoriaCompetenciaDe, tipoMesocicloDe, tipoMicrocicloDe } from './taxonomia';
import { seriesDeCurva } from './curva';
import { modeloDe } from './modelos';
import { GRUPOS_CAPACIDADES } from './taxonomia';
import type { Macrociclo } from './tipos';
import { DIAS_SEMANA } from './tipos';
import type { Contenido as ContenidoPlantilla } from '@/lib/plantillas/tipos';
import { ETIQUETA_BLOQUE } from '@/lib/plantillas/tipos';

/** Lo mínimo que el exportador necesita saber de una plantilla. */
export interface PlantillaExportable {
  id: string;
  nombre: string;
  semanas: number;
  contenido: ContenidoPlantilla;
}

type Celda = string | number | null;

/**
 * Nombre de hoja admisible para Excel.
 *
 * Excel rechaza el libro entero si una hoja pasa de 31 caracteres o lleva
 * `[ ] : * ? / \`. Un nombre de sesión con una barra —«Empuje/Tirón», que es
 * como se escriben— bastaría para que el archivo no abriera.
 */
export function nombreDeHoja(bruto: string, usados: Set<string>): string {
  const limpio = (bruto.replace(/[[\]:*?/\\]/g, '-').trim() || 'Hoja').slice(0, 31);

  if (!usados.has(limpio)) {
    usados.add(limpio);
    return limpio;
  }
  // Dos sesiones pueden llamarse igual. El sufijo se mete DENTRO del límite,
  // no detrás: pasarse de 31 al desambiguar rompería el libro igual.
  for (let n = 2; n < 1000; n++) {
    const sufijo = ` (${n})`;
    const candidato = limpio.slice(0, 31 - sufijo.length) + sufijo;
    if (!usados.has(candidato)) {
      usados.add(candidato);
      return candidato;
    }
  }
  const ultimo = limpio.slice(0, 24) + ` ${Date.now() % 100000}`;
  usados.add(ultimo);
  return ultimo;
}

/** Una fila `numero`/`porcentaje` cuyo texto ES un número sale como número. */
function celdaDeValor(valor: string | null, tipo: string): Celda {
  if (valor === null || valor === '') return null;
  // Una marca es «X» o «=»: leerla como número no tiene sentido, y el `=` al
  // principio de celda Excel lo interpreta como FÓRMULA y abre el libro con
  // un error de referencia en cada semana marcada.
  if (tipo === 'texto') return valor;
  if (tipo === 'marca') return valor === '=' ? "'=" : valor;
  const n = Number(valor.replace(',', '.'));
  return Number.isFinite(n) && valor.trim() !== '' ? n : valor;
}

/**
 * La hoja principal: mesociclos, semanas, filas y calendario.
 *
 * `nombrePlantilla` se recibe como argumento y no se busca aquí dentro: esta
 * función no sabe de base de datos, y así se puede probar entera sin una.
 */
export function hojaMacrociclo(
  m: Macrociclo,
  nombrePlantilla: (id: string) => string | null = () => null,
): {
  datos: Celda[][];
  combinadas: XLSX.Range[];
} {
  const n = m.semanas;
  const datos: Celda[][] = [];
  const combinadas: XLSX.Range[] = [];

  const cabecera = (texto: string) => {
    datos.push([texto, ...Array.from({ length: n }, () => null)]);
  };

  datos.push([m.nombre, ...Array.from({ length: n }, () => null)]);
  combinadas.push({ s: { r: 0, c: 0 }, e: { r: 0, c: n } });

  if (m.objetivo !== null && m.objetivo !== '') {
    datos.push([m.objetivo, ...Array.from({ length: n }, () => null)]);
    combinadas.push({ s: { r: 1, c: 0 }, e: { r: 1, c: n } });
  }

  const modelo = m.modeloId === null ? null : modeloDe(m.modeloId);
  if (modelo !== null) {
    datos.push([`Modelo: ${modelo.nombre} · ${modelo.atribucion}`]);
  }
  datos.push([]);

  /**
   * Escribe una banda de tramos combinados sobre sus semanas.
   *
   * Una sola función para meses, periodo, etapa y mesociclos. Cuando cada
   * banda calculaba sus propias combinadas, bastaba equivocarse en el índice
   * de fila de una para que Excel abriera el libro con las celdas fundidas
   * sobre la banda de al lado.
   */
  const banda = (etiqueta: string, tramos: readonly { nombre: string; semanas: number }[]) => {
    const fila = datos.length;
    const salida: Celda[] = [etiqueta];
    const inicios = iniciosDeMesociclo(tramos);
    tramos.forEach((t, i) => {
      for (let k = 0; k < t.semanas; k++) salida.push(k === 0 ? t.nombre : null);
      if (t.semanas > 1) {
        combinadas.push({
          s: { r: fila, c: inicios[i] + 1 },
          e: { r: fila, c: inicios[i] + t.semanas },
        });
      }
    });
    while (salida.length < n + 1) salida.push(null);
    datos.push(salida);
  };

  // ── Meses · derivados de la fecha de inicio ─────────────────────────────
  const meses = bandaDeMeses(m.fechaInicio, n);
  if (meses.length > 0) banda('Meses', meses);

  // ── Bandas del documento: periodo, etapa, las que haya ──────────────────
  for (const b of m.contenido.bandas) banda(b.nombre, b.tramos);

  // ── Mesociclos, con su tipo del catálogo si lo declaran ─────────────────
  banda(
    'Mesociclo',
    m.contenido.mesociclos.map((meso) => {
      const t = tipoMesocicloDe(meso.tipoId);
      return { nombre: t === null ? meso.nombre : `${meso.nombre} (${t.codigo})`, semanas: meso.semanas };
    }),
  );

  // ── Semanas ─────────────────────────────────────────────────────────────
  datos.push(['Semana', ...Array.from({ length: n }, (_, i) => i + 1)]);

  // ── Fechas · derivadas ──────────────────────────────────────────────────
  const rangos = rangosDeSemanas(m.fechaInicio, n);
  if (rangos.length > 0) datos.push(['Fechas', ...rangos.map(etiquetaDeRango)]);

  // ── Tipo de microciclo, con el código del plan gráfico ──────────────────
  datos.push([
    'Tipo de microciclo',
    ...Array.from({ length: n }, (_, i) => tipoMicrocicloDe(m.contenido.semanas[i]?.tipoMicrociclo ?? null)?.codigo ?? null),
  ]);

  // ── Sesiones, horas y días ──────────────────────────────────────────────
  const porSemana = (campo: 'sesiones' | 'horas' | 'diasEntrenamiento' | 'diasDescanso') =>
    Array.from({ length: n }, (_, i) => m.contenido.semanas[i]?.[campo] ?? null);

  datos.push(['Sesiones', ...porSemana('sesiones')]);
  datos.push(['Horas', ...porSemana('horas')]);
  datos.push(['Días de entrenamiento', ...porSemana('diasEntrenamiento')]);
  datos.push(['Días de descanso', ...porSemana('diasDescanso')]);

  // ── Competencias ────────────────────────────────────────────────────────
  //
  // Varias en la misma semana se juntan en la celda con un separador. Partir
  // la columna dejaría la rejilla sin retícula común con las demás bandas.
  const comps = indiceCompetencias(m.contenido.competencias);
  if (m.contenido.competencias.length > 0) {
    datos.push([
      'Competencias',
      ...Array.from({ length: n }, (_, i) => {
        const lista = comps.get(i);
        if (lista === undefined) return null;
        return lista
          .map((c) => {
            const cat = categoriaCompetenciaDe(c.categoria);
            return cat === null ? c.nombre : `${c.nombre} (${cat.codigo})`;
          })
          .join(' · ');
      }),
    ]);
  }

  // ── Filas de planificación, con su encabezado de grupo ──────────────────
  //
  // El encabezado va en una fila propia y no como prefijo del nombre: quien
  // recibe el Excel lee «Fuerza» bajo «Preparación física general», igual que
  // en la pantalla, en vez de veinte filas llamadas «General · Fuerza».
  let grupoAbierto: string | null | undefined;
  for (const f of m.contenido.filas) {
    if (f.grupo !== null && f.grupo !== grupoAbierto) {
      const g = GRUPOS_CAPACIDADES.find((x) => x.id === f.grupo);
      datos.push([(g?.nombre ?? f.grupo).toUpperCase()]);
    }
    grupoAbierto = f.grupo;

    const etiqueta = f.unidad === '' ? f.nombre : `${f.nombre} (${f.unidad})`;
    datos.push([etiqueta, ...f.valores.map((v) => celdaDeValor(v, f.tipo))]);
  }

  // ── Calendario ──────────────────────────────────────────────────────────
  const indice = indiceDias(m.contenido.dias);
  const hayDias = m.contenido.dias.length > 0;
  if (hayDias) {
    datos.push([]);
    cabecera('Calendario');
    DIAS_SEMANA.forEach((nombreDia, d) => {
      const fila: Celda[] = [nombreDia];
      for (let s = 0; s < n; s++) {
        const dia = indice.get(claveDia(s, d));
        if (dia === undefined) {
          fila.push(null);
          continue;
        }
        // La etiqueta manda sobre el nombre de la plantilla cuando las dos
        // existen: si el entrenador escribió «Partido» encima de una sesión,
        // eso es lo que pasa ese día.
        fila.push(
          dia.etiqueta ?? (dia.plantillaId === null ? null : nombrePlantilla(dia.plantillaId)),
        );
      }
      datos.push(fila);
    });
  }

  return { datos, combinadas };
}

/** La hoja de resumen de mesociclos. */
export function hojaMesociclos(m: Macrociclo): Celda[][] {
  const inicios = iniciosDeMesociclo(m.contenido.mesociclos);
  const datos: Celda[][] = [['Mesociclo', 'Semana inicial', 'Semana final', 'Semanas', 'Notas']];

  m.contenido.mesociclos.forEach((meso, i) => {
    datos.push([
      meso.nombre,
      inicios[i] + 1,
      inicios[i] + meso.semanas,
      meso.semanas,
      meso.notas ?? null,
    ]);
  });

  const cubiertas = inicios.length === 0 ? 0 : inicios[inicios.length - 1] + m.contenido.mesociclos[m.contenido.mesociclos.length - 1].semanas;
  if (cubiertas < m.semanas) {
    // El hueco se nombra. Una tabla que acaba en la semana 9 de un plan de 12
    // parece completa si nadie dice que faltan tres.
    datos.push([]);
    datos.push([`Sin mesociclo asignado: semanas ${cubiertas + 1} a ${m.semanas}`]);
  }

  return datos;
}

/**
 * La hoja de la curva de carga.
 *
 * ── POR QUÉ UNA HOJA APARTE SI LAS FILAS YA ESTÁN EN «MACROCICLO» ────────
 *
 *   Porque allí conviven con las filas de texto, y para hacer un gráfico en
 *   Excel hay que seleccionar a mano un rango salteado. Aquí las series
 *   dibujables salen solas, seguidas y con la cabecera de semanas encima: se
 *   marca todo y se pulsa Insertar › Gráfico de líneas.
 *
 * ── LO QUE ESTA HOJA NO ES ──────────────────────────────────────────────
 *
 *   NO es un gráfico. SheetJS en su edición libre escribe celdas, no objetos
 *   de dibujo, así que el .xlsx sale con los datos y sin la curva pintada.
 *   Decirlo aquí es mejor que dejar que se descubra al abrirlo.
 *
 *   Los valores salen COMO SE ESCRIBIERON, sin normalizar. La normalización
 *   por serie es un recurso de la pantalla —volumen e intensidad no comparten
 *   escala—; en una hoja de cálculo cada serie va a su propio eje y meter
 *   porcentajes calculados escondería el dato real.
 */
export function hojaCurva(m: Macrociclo): Celda[][] {
  const series = seriesDeCurva(m.contenido.filas);
  if (series.length === 0) return [];

  const datos: Celda[][] = [
    ['Curva de carga'],
    [],
    ['Semana', ...Array.from({ length: m.semanas }, (_, i) => i + 1)],
  ];

  for (const s of series) {
    // Se recorre por semana y no por tramo: la hoja necesita una columna por
    // semana, y una semana sin planificar tiene que quedar VACÍA para que
    // Excel corte la línea ahí igual que la corta la pantalla.
    const porSemana = new Map(s.tramos.flat().map((p) => [p.semana, p.valor]));
    const etiqueta = s.unidad === '' ? s.nombre : `${s.nombre} (${s.unidad})`;
    datos.push([
      etiqueta,
      ...Array.from({ length: m.semanas }, (_, i) => porSemana.get(i) ?? null),
    ]);
  }

  datos.push([]);
  datos.push([
    'Para verla como gráfico: selecciona el bloque de arriba e Insertar › Gráfico de líneas.',
  ]);

  return datos;
}

/** Una hoja por sesión: bloques, ejercicios y series semana a semana. */
export function hojaSesion(p: PlantillaExportable): Celda[][] {
  const datos: Celda[][] = [[p.nombre]];
  datos.push([]);

  for (const dia of p.contenido.dias) {
    datos.push([dia.nombre]);
    if (dia.notas !== null && dia.notas !== '') datos.push([dia.notas]);
    datos.push([
      'Bloque',
      'Ejercicio',
      'Descanso (s)',
      ...Array.from({ length: p.semanas }, (_, i) => `Semana ${i + 1}`),
    ]);

    for (const bloque of dia.bloques) {
      for (const ej of bloque.ejercicios) {
        const fila: Celda[] = [
          ETIQUETA_BLOQUE[bloque.tipo],
          ej.nombre,
          ej.descansoSeg,
        ];
        for (let s = 0; s < p.semanas; s++) {
          const semana = ej.semanas[s];
          fila.push(semana === undefined ? null : seriesEnTexto(semana.series));
        }
        datos.push(fila);
        if (ej.notas !== null && ej.notas !== '') datos.push([null, `↳ ${ej.notas}`]);
        if (ej.video !== null && ej.video !== '') datos.push([null, `↳ vídeo: ${ej.video}`]);
      }
    }
    datos.push([]);
  }

  return datos;
}

/**
 * Las series de una semana, en una celda.
 *
 * «3×8 @ 60 kg · RIR 2» es como se lee una prescripción, y meter cada dato en
 * su columna produciría una hoja de trescientas columnas que nadie abre. Los
 * campos ausentes NO se rellenan: «3×8» sin carga es una prescripción
 * legítima y distinta de «3×8 a 0 kg».
 */
export function seriesEnTexto(series: readonly { reps: string; pesoKg: number | null; rir: number | null }[]): string | null {
  if (series.length === 0) return null;

  const partes = series.map((s) => {
    const trozos: string[] = [];
    if (s.reps !== '') trozos.push(s.reps);
    if (s.pesoKg !== null) trozos.push(`${s.pesoKg} kg`);
    if (s.rir !== null) trozos.push(`RIR ${s.rir}`);
    return trozos.join(' @ ');
  });

  const texto = partes.filter((t) => t !== '').join(' · ');
  return texto === '' ? null : texto;
}

/** El libro entero, listo para escribirse. */
export function libroDeMacrociclo(
  m: Macrociclo,
  plantillas: readonly PlantillaExportable[],
): XLSX.WorkBook {
  const porId = new Map(plantillas.map((p) => [p.id, p]));
  const libro = XLSX.utils.book_new();
  const usados = new Set<string>();

  const { datos, combinadas } = hojaMacrociclo(m, (id) => porId.get(id)?.nombre ?? null);
  const principal = XLSX.utils.aoa_to_sheet(datos as unknown[][]);
  principal['!merges'] = combinadas;
  // La primera columna lleva los nombres de fila y necesita sitio; las demás
  // son semanas y con 14 caracteres caben una sesión o un número.
  principal['!cols'] = [{ wch: 26 }, ...Array.from({ length: m.semanas }, () => ({ wch: 14 }))];
  // Congelar la cabecera: una rejilla de 52 semanas sin esto obliga a contar
  // columnas con el dedo para saber en qué semana se está.
  principal['!freeze'] = { xSplit: 1, ySplit: 0 };
  XLSX.utils.book_append_sheet(libro, principal, nombreDeHoja('Macrociclo', usados));

  // La curva va ANTES de los mesociclos: es lo que se mira primero al abrir
  // el plan, y una hoja que hay que buscar es una hoja que no se usa.
  const curva = hojaCurva(m);
  if (curva.length > 0) {
    const hoja = XLSX.utils.aoa_to_sheet(curva as unknown[][]);
    hoja['!cols'] = [{ wch: 26 }, ...Array.from({ length: m.semanas }, () => ({ wch: 9 }))];
    XLSX.utils.book_append_sheet(libro, hoja, nombreDeHoja('Curva de carga', usados));
  }

  const meso = XLSX.utils.aoa_to_sheet(hojaMesociclos(m) as unknown[][]);
  meso['!cols'] = [{ wch: 28 }, { wch: 14 }, { wch: 14 }, { wch: 10 }, { wch: 40 }];
  XLSX.utils.book_append_sheet(libro, meso, nombreDeHoja('Mesociclos', usados));

  for (const p of plantillas) {
    const hoja = XLSX.utils.aoa_to_sheet(hojaSesion(p) as unknown[][]);
    hoja['!cols'] = [
      { wch: 18 },
      { wch: 32 },
      { wch: 12 },
      ...Array.from({ length: p.semanas }, () => ({ wch: 22 })),
    ];
    XLSX.utils.book_append_sheet(libro, hoja, nombreDeHoja(p.nombre, usados));
  }

  return libro;
}

/** Nombre de archivo sin caracteres que el sistema de ficheros rechace. */
export function nombreDeArchivo(m: Macrociclo): string {
  const base = m.nombre.replace(/[^\p{L}\p{N} _-]/gu, '').trim() || 'macrociclo';
  return `${base}.xlsx`;
}
