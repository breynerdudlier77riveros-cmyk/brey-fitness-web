// ── La exportación a Excel (Sprint MAC-1) ──────────────────────────────────
//
// EL FALLO QUE ESTE FICHERO EXISTE PARA IMPEDIR:
//
//   Un .xlsx que Excel se niega a abrir. Es el peor fallo posible de esta
//   función porque no se nota aquí —el código no lanza, el archivo se
//   descarga— sino delante del cliente, al hacer doble clic.
//
//   Por eso el test central NO comprueba el objeto que se construye: escribe
//   el libro a bytes y lo vuelve a leer, que es lo más cerca que se puede
//   estar de abrirlo en Excel sin tener Excel.

import { describe, expect, it } from 'vitest';
import * as XLSX from 'xlsx';

import {
  contenidoVacio,
  escribirCelda,
  escribirCompetencia,
  escribirSemana,
  escribirDia,
  filaNueva,
  mesocicloNuevo,
} from '../contenido';
import {
  hojaCurva,
  hojaMacrociclo,
  hojaMesociclos,
  hojaSesion,
  libroDeMacrociclo,
  nombreDeArchivo,
  nombreDeHoja,
  seriesEnTexto,
  type PlantillaExportable,
} from '../exportar';
import { sembrarPlanGrafico } from '../sembrar';
import type { ContenidoMacrociclo, Macrociclo } from '../tipos';

function macro(over: Partial<Macrociclo> = {}): Macrociclo {
  let contenido: ContenidoMacrociclo = {
    ...contenidoVacio(8),
    mesociclos: [mesocicloNuevo('Acumulación', 5), mesocicloNuevo('Realización', 3)],
    filas: [filaNueva('Volumen', 8, 'numero', 'kg'), filaNueva('Contenidos', 8)],
  };
  contenido = escribirCelda(contenido, contenido.filas[0].id, 0, '5000');
  contenido = escribirCelda(contenido, contenido.filas[1].id, 0, 'Técnica');

  return {
    id: 'm1',
    entrenadorId: 'e1',
    atletaId: null,
    nombre: 'Pretemporada 2026',
    objetivo: 'Llegar a marzo en forma',
    fechaInicio: '2026-01-05',
    semanas: 8,
    modeloId: 'atr',
    contenido,
    estado: 'borrador',
    createdAt: '2026-01-01T00:00:00Z',
    actualizadoEl: '2026-01-01T00:00:00Z',
    ...over,
  };
}

const SESION: PlantillaExportable = {
  id: 'p1',
  nombre: 'Día A · Empuje',
  semanas: 4,
  contenido: {
    dias: [
      {
        id: 'd1',
        nombre: 'Sesión de empuje',
        notas: 'Calentar hombro',
        bloques: [
          {
            id: 'b1',
            tipo: 'principal',
            ejercicios: [
              {
                id: 'e1',
                nombre: 'Press de banca',
                slug: null,
                notas: 'Pausa en pecho',
                descansoSeg: 180,
                video: 'https://ejemplo.test/v',
                semanas: [
                  { series: [{ reps: '5', pesoKg: 80, rir: 2, notas: null }] },
                  { series: [{ reps: '5', pesoKg: 85, rir: 1, notas: null }] },
                  { series: [{ reps: '8-10', pesoKg: null, rir: null, notas: null }] },
                  { series: [] },
                ],
              },
            ],
          },
        ],
      },
    ],
  },
};

// ════════════════════════════════════════════════════════════════════════════
// LO QUE EXCEL ACEPTA
// ════════════════════════════════════════════════════════════════════════════

describe('el archivo se puede abrir', () => {
  it('CONTROL POSITIVO · el libro se escribe y se vuelve a leer', () => {
    const libro = libroDeMacrociclo(macro(), [SESION]);
    const bytes = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' });
    expect(bytes.byteLength).toBeGreaterThan(1000);

    const releido = XLSX.read(bytes, { type: 'buffer' });
    expect(releido.SheetNames).toContain('Macrociclo');
    expect(releido.SheetNames).toContain('Mesociclos');
    expect(releido.SheetNames).toContain('Día A · Empuje');
  });

  it('los datos sobreviven al viaje de ida y vuelta', () => {
    const libro = libroDeMacrociclo(macro(), [SESION]);
    const bytes = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' });
    const hoja = XLSX.read(bytes, { type: 'buffer' }).Sheets['Macrociclo'];
    const filas = XLSX.utils.sheet_to_json<unknown[]>(hoja, { header: 1 });
    const plano = JSON.stringify(filas);

    expect(plano).toContain('Pretemporada 2026');
    expect(plano).toContain('Acumulación');
    expect(plano).toContain('5000');
    expect(plano).toContain('Técnica');
  });
});

describe('los nombres de hoja que Excel rechazaría', () => {
  it('una barra en «Empuje/Tirón» rompería el libro entero: se sustituye', () => {
    expect(nombreDeHoja('Empuje/Tirón', new Set())).toBe('Empuje-Tirón');
    expect(nombreDeHoja('A[1]:B*C?D\\E', new Set())).not.toMatch(/[[\]:*?/\\]/);
  });

  it('se corta a 31 caracteres, que es el límite de Excel', () => {
    const largo = 'Sesión de fuerza máxima del tren inferior en pretemporada';
    expect(nombreDeHoja(largo, new Set()).length).toBeLessThanOrEqual(31);
  });

  it('dos sesiones con el mismo nombre no colisionan', () => {
    const usados = new Set<string>();
    expect(nombreDeHoja('Día A', usados)).toBe('Día A');
    expect(nombreDeHoja('Día A', usados)).toBe('Día A (2)');
    expect(nombreDeHoja('Día A', usados)).toBe('Día A (3)');
  });

  it('y al desambiguar TAMPOCO se pasa de 31', () => {
    // El sufijo va dentro del límite, no detrás: pasarse al desambiguar
    // rompería el libro igual que pasarse al cortar.
    const usados = new Set<string>();
    const largo = 'Sesión de fuerza máxima del tren inferior';
    for (let i = 0; i < 5; i++) {
      expect(nombreDeHoja(largo, usados).length).toBeLessThanOrEqual(31);
    }
    expect(usados.size).toBe(5);
  });

  it('un nombre que queda vacío no produce una hoja sin nombre', () => {
    expect(nombreDeHoja('///', new Set()).length).toBeGreaterThan(0);
  });

  it('el nombre de archivo no lleva caracteres que el sistema rechace', () => {
    expect(nombreDeArchivo(macro({ nombre: 'Plan 2026/27: «fuerza»' }))).toBe('Plan 202627 fuerza.xlsx');
    expect(nombreDeArchivo(macro({ nombre: '///' }))).toBe('macrociclo.xlsx');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LO QUE SE ESCRIBE Y LO QUE NO
// ════════════════════════════════════════════════════════════════════════════

describe('una celda vacía se queda vacía', () => {
  it('un valor no planificado NO sale como cero ni como guion', () => {
    // Un cero en la fila de volumen se lee como «esta semana no se entrena»,
    // que es una prescripción que nadie hizo.
    const { datos } = hojaMacrociclo(macro());
    const volumen = datos.find((f) => f[0] === 'Volumen (kg)')!;
    expect(volumen[1]).toBe(5000);
    expect(volumen.slice(2).every((v) => v === null)).toBe(true);
  });

  it('una fila numérica con texto no numérico se escribe como TEXTO', () => {
    // Forzar el número convertiría «8-10» en una fecha, que es el clásico
    // desastre de las hojas de cálculo.
    let m = macro();
    m = { ...m, contenido: escribirCelda(m.contenido, m.contenido.filas[0].id, 1, '8-10') };
    const volumen = hojaMacrociclo(m).datos.find((f) => f[0] === 'Volumen (kg)')!;
    expect(volumen[2]).toBe('8-10');
  });

  it('una fila numérica con un número sale como número, para poder sumarla', () => {
    const volumen = hojaMacrociclo(macro()).datos.find((f) => f[0] === 'Volumen (kg)')!;
    expect(typeof volumen[1]).toBe('number');
  });

  it('la coma decimal se entiende como decimal', () => {
    let m = macro();
    m = { ...m, contenido: escribirCelda(m.contenido, m.contenido.filas[0].id, 2, '7,5') };
    const volumen = hojaMacrociclo(m).datos.find((f) => f[0] === 'Volumen (kg)')!;
    expect(volumen[3]).toBe(7.5);
  });
});

describe('la banda de mesociclos', () => {
  it('cada mesociclo se combina sobre sus semanas', () => {
    const { datos, combinadas } = hojaMacrociclo(macro());
    const banda = datos.find((f) => f[0] === 'Mesociclo')!;
    expect(banda[1]).toBe('Acumulación');
    expect(banda[2]).toBeNull(); // dentro de la combinada
    expect(banda[6]).toBe('Realización'); // empieza en la semana 6 → columna 6

    // Las combinadas se filtran POR SU FILA, no por «todas las que no están
    // en la columna cero». Al añadirse la banda de meses, ese filtro empezó a
    // recoger las de meses y el test dejó de comprobar lo que decía.
    const fila = datos.findIndex((f) => f[0] === 'Mesociclo');
    const deMeso = combinadas.filter((c) => c.s.r === fila);
    expect(deMeso).toHaveLength(2);
    expect(deMeso[0].e.c - deMeso[0].s.c + 1).toBe(5);
    expect(deMeso[1].e.c - deMeso[1].s.c + 1).toBe(3);
  });

  it('un mesociclo de UNA semana no se combina', () => {
    // Una combinada de una sola celda es válida pero inútil, y Excel a veces
    // la pinta raro.
    const m = macro({
      contenido: { ...macro().contenido, mesociclos: [mesocicloNuevo('Choque', 1)] },
    });
    const { datos, combinadas } = hojaMacrociclo(m);
    const fila = datos.findIndex((f) => f[0] === 'Mesociclo');
    expect(combinadas.filter((c) => c.s.r === fila)).toHaveLength(0);
  });

  it('la banda llega hasta la última semana aunque los mesociclos no', () => {
    const m = macro({
      contenido: { ...macro().contenido, mesociclos: [mesocicloNuevo('Base', 3)] },
    });
    const banda = hojaMacrociclo(m).datos.find((f) => f[0] === 'Mesociclo')!;
    expect(banda).toHaveLength(9); // etiqueta + 8 semanas
  });

  it('el resumen NOMBRA las semanas que no cubre ningún mesociclo', () => {
    // Una tabla que acaba en la semana 3 de un plan de 8 parece completa si
    // nadie dice que faltan cinco.
    const m = macro({
      contenido: { ...macro().contenido, mesociclos: [mesocicloNuevo('Base', 3)] },
    });
    expect(JSON.stringify(hojaMesociclos(m))).toContain('semanas 4 a 8');
  });

  it('el resumen da semana inicial y final, en base UNO', () => {
    const filas = hojaMesociclos(macro());
    expect(filas[1]).toEqual(['Acumulación', 1, 5, 5, null]);
    expect(filas[2]).toEqual(['Realización', 6, 8, 3, null]);
  });
});

describe('el calendario', () => {
  it('no se dibuja si no hay ningún día asignado', () => {
    expect(JSON.stringify(hojaMacrociclo(macro()).datos)).not.toContain('Calendario');
  });

  it('cada día cae en su semana y en su fila', () => {
    let m = macro();
    m = { ...m, contenido: escribirDia(m.contenido, 2, 0, { plantillaId: 'p1' }) };
    const datos = hojaMacrociclo(m, (id) => (id === 'p1' ? 'Día A · Empuje' : null)).datos;
    const lunes = datos.find((f) => f[0] === 'Lunes')!;
    expect(lunes[3]).toBe('Día A · Empuje'); // semana 3 → columna 3
    expect(lunes[1]).toBeNull();
  });

  it('la etiqueta manda sobre el nombre de la plantilla', () => {
    // Si el entrenador escribió «Partido» encima de una sesión, eso es lo que
    // pasa ese día.
    let m = macro();
    m = { ...m, contenido: escribirDia(m.contenido, 0, 5, { plantillaId: 'p1', etiqueta: 'Partido' }) };
    const sabado = hojaMacrociclo(m, () => 'Día A · Empuje').datos.find((f) => f[0] === 'Sábado')!;
    expect(sabado[1]).toBe('Partido');
  });

  it('una plantilla que ya no existe deja la celda vacía, no un id crudo', () => {
    let m = macro();
    m = { ...m, contenido: escribirDia(m.contenido, 0, 0, { plantillaId: 'borrada' }) };
    const lunes = hojaMacrociclo(m, () => null).datos.find((f) => f[0] === 'Lunes')!;
    expect(lunes[1]).toBeNull();
  });
});

describe('la hoja de cada sesión', () => {
  it('lleva bloque, ejercicio, descanso y una columna por semana', () => {
    const filas = hojaSesion(SESION);
    const cabecera = filas.find((f) => f[0] === 'Bloque')!;
    expect(cabecera).toEqual(['Bloque', 'Ejercicio', 'Descanso (s)', 'Semana 1', 'Semana 2', 'Semana 3', 'Semana 4']);
  });

  it('las series se leen como se prescriben', () => {
    const fila = hojaSesion(SESION).find((f) => f[1] === 'Press de banca')!;
    expect(fila[0]).toBe('Trabajo principal');
    expect(fila[2]).toBe(180);
    expect(fila[3]).toBe('5 @ 80 kg @ RIR 2');
  });

  it('lo no prescrito NO se rellena', () => {
    // «3×8» sin carga es una prescripción legítima y distinta de «3×8 a 0 kg».
    expect(seriesEnTexto([{ reps: '8-10', pesoKg: null, rir: null }])).toBe('8-10');
    expect(seriesEnTexto([{ reps: '5', pesoKg: 0, rir: null }])).toBe('5 @ 0 kg');
    expect(seriesEnTexto([])).toBeNull();
  });

  it('una semana sin series sale vacía', () => {
    const fila = hojaSesion(SESION).find((f) => f[1] === 'Press de banca')!;
    expect(fila[6]).toBeNull();
  });

  it('las notas y el vídeo van debajo, sin ocupar una columna de semana', () => {
    const plano = JSON.stringify(hojaSesion(SESION));
    expect(plano).toContain('↳ Pausa en pecho');
    expect(plano).toContain('↳ vídeo: https://ejemplo.test/v');
  });
});

describe('el libro completo', () => {
  it('tiene una hoja por sesión, más las dos del plan', () => {
    const otra: PlantillaExportable = { ...SESION, id: 'p2', nombre: 'Día B · Tirón' };
    const libro = libroDeMacrociclo(macro(), [SESION, otra]);
    expect(libro.SheetNames).toEqual(['Macrociclo', 'Mesociclos', 'Día A · Empuje', 'Día B · Tirón']);
  });

  it('sin sesiones sigue siendo un libro válido', () => {
    const libro = libroDeMacrociclo(macro(), []);
    const bytes = XLSX.write(libro, { type: 'buffer', bookType: 'xlsx' });
    expect(XLSX.read(bytes, { type: 'buffer' }).SheetNames).toEqual(['Macrociclo', 'Mesociclos']);
  });

  it('exportar dos veces da EXACTAMENTE lo mismo', () => {
    // El exportador no guarda estado entre llamadas. Una versión anterior sí
    // lo hacía —un resolutor de nombres a nivel de módulo— y dos exportaciones
    // seguidas podían pisarse.
    const a = JSON.stringify(hojaMacrociclo(macro(), () => 'X').datos);
    const b = JSON.stringify(hojaMacrociclo(macro(), () => 'X').datos);
    expect(a).toBe(b);
  });

  it('un macrociclo de 104 semanas se escribe sin romperse', () => {
    const grande = macro({
      semanas: 104,
      contenido: {
        ...contenidoVacio(104),
        mesociclos: [mesocicloNuevo('Largo', 104)],
        filas: [filaNueva('Volumen', 104, 'numero', 'kg')],
      },
    });
    const bytes = XLSX.write(libroDeMacrociclo(grande, []), { type: 'buffer', bookType: 'xlsx' });
    const hoja = XLSX.read(bytes, { type: 'buffer' }).Sheets['Macrociclo'];
    const filas = XLSX.utils.sheet_to_json<unknown[]>(hoja, { header: 1 });
    const semanas = filas.find((f) => f[0] === 'Semana')!;
    expect(semanas[104]).toBe(104);
  });

  it('el modelo y su atribución viajan en la hoja', () => {
    // Quien reciba el Excel tiene que poder ver de dónde sale la estructura.
    expect(JSON.stringify(hojaMacrociclo(macro()).datos)).toContain('Issurin');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LA HOJA DE LA CURVA (Sprint MAC-2)
// ════════════════════════════════════════════════════════════════════════════

describe('la curva en Excel', () => {
  /** Un plan con volumen e intensidad marcados y con huecos. */
  function conCurva(): Macrociclo {
    let c: ContenidoMacrociclo = {
      ...contenidoVacio(4),
      filas: [
        filaNueva('Volumen', 4, 'numero', 'kg', '#3b82f6'),
        filaNueva('Intensidad', 4, 'porcentaje', '%', '#ef4444'),
        filaNueva('Contenidos', 4),
      ],
    };
    c = escribirCelda(c, c.filas[0].id, 0, '5000');
    c = escribirCelda(c, c.filas[0].id, 1, '6000');
    c = escribirCelda(c, c.filas[0].id, 3, '3000');
    c = escribirCelda(c, c.filas[1].id, 0, '70');
    c = escribirCelda(c, c.filas[2].id, 0, 'Técnica');
    return macro({ semanas: 4, contenido: c });
  }

  it('CONTROL POSITIVO · salen las series marcadas', () => {
    const filas = hojaCurva(conCurva());
    const nombres = filas.map((f) => f[0]);
    expect(nombres).toContain('Volumen (kg)');
    expect(nombres).toContain('Intensidad (%)');
  });

  it('una fila SIN marcar no entra en la curva', () => {
    expect(hojaCurva(conCurva()).map((f) => f[0])).not.toContain('Contenidos');
  });

  it('una semana sin planificar queda VACÍA, no en cero', () => {
    // Excel corta la línea en una celda vacía, igual que la corta la pantalla.
    // Un cero dibujaría una caída a cero que nadie planificó.
    const volumen = hojaCurva(conCurva()).find((f) => f[0] === 'Volumen (kg)')!;
    expect(volumen.slice(1)).toEqual([5000, 6000, null, 3000]);
  });

  it('los valores salen COMO SE ESCRIBIERON, sin normalizar', () => {
    // La normalización por serie es un recurso de la pantalla. En una hoja de
    // cálculo, meter porcentajes calculados escondería el dato real.
    const volumen = hojaCurva(conCurva()).find((f) => f[0] === 'Volumen (kg)')!;
    expect(volumen[1]).toBe(5000);
    expect(volumen[1]).not.toBe(100);
  });

  it('lleva la cabecera de semanas para poder graficarla de un tirón', () => {
    const semanas = hojaCurva(conCurva()).find((f) => f[0] === 'Semana')!;
    expect(semanas).toEqual(['Semana', 1, 2, 3, 4]);
  });

  it('va ANTES de los mesociclos', () => {
    // Es lo que se mira primero al abrir el plan, y una hoja que hay que
    // buscar es una hoja que no se usa.
    expect(libroDeMacrociclo(conCurva(), []).SheetNames).toEqual([
      'Macrociclo',
      'Curva de carga',
      'Mesociclos',
    ]);
  });

  it('sin ninguna serie marcada NO se crea la hoja', () => {
    const sinCurva = macro({
      contenido: { ...contenidoVacio(8), filas: [filaNueva('Notas', 8)] },
    });
    expect(hojaCurva(sinCurva)).toEqual([]);
    expect(libroDeMacrociclo(sinCurva, []).SheetNames).toEqual(['Macrociclo', 'Mesociclos']);
  });

  it('el libro con curva se escribe y se vuelve a leer', () => {
    const bytes = XLSX.write(libroDeMacrociclo(conCurva(), []), {
      type: 'buffer',
      bookType: 'xlsx',
    });
    const hoja = XLSX.read(bytes, { type: 'buffer' }).Sheets['Curva de carga'];
    const filas = XLSX.utils.sheet_to_json<unknown[]>(hoja, { header: 1 });
    expect(JSON.stringify(filas)).toContain('Volumen (kg)');
    expect(JSON.stringify(filas)).toContain('5000');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// EL PLAN GRÁFICO COMPLETO EN EXCEL (Sprint MAC-3)
// ════════════════════════════════════════════════════════════════════════════

describe('todas las bandas viajan al Excel', () => {
  function completo(): Macrociclo {
    let c = sembrarPlanGrafico(8);
    c = escribirSemana(c, 0, { tipoMicrociclo: 'choque', sesiones: 9, horas: 14 });
    c = escribirSemana(c, 1, { tipoMicrociclo: 'restablecimiento', sesiones: 4 });
    c = escribirCompetencia(c, {
      semana: 5,
      nombre: 'Nacional',
      categoria: 'fundamental',
      ambito: 'Bogotá',
    });
    return macro({ semanas: 8, fechaInicio: '2026-01-05', contenido: c });
  }

  it('CONTROL POSITIVO · el libro se escribe y se vuelve a leer', () => {
    const bytes = XLSX.write(libroDeMacrociclo(completo(), []), {
      type: 'buffer',
      bookType: 'xlsx',
    });
    expect(bytes.byteLength).toBeGreaterThan(1000);
  });

  it('lleva meses, periodo, etapa y mesociclo, en ese orden', () => {
    const etiquetas = hojaMacrociclo(completo()).datos.map((f) => f[0]);
    for (const e of ['Meses', 'Periodo', 'Etapa', 'Mesociclo', 'Semana', 'Fechas']) {
      expect(etiquetas, e).toContain(e);
    }
    expect(etiquetas.indexOf('Meses')).toBeLessThan(etiquetas.indexOf('Mesociclo'));
    expect(etiquetas.indexOf('Mesociclo')).toBeLessThan(etiquetas.indexOf('Semana'));
  });

  it('sin fecha de inicio NO aparecen meses ni fechas', () => {
    // No son datos: son consecuencias de la fecha. Inventarlos daría un mes
    // que nadie escribió.
    const sinFecha = macro({ semanas: 8, fechaInicio: null, contenido: sembrarPlanGrafico(8) });
    const etiquetas = hojaMacrociclo(sinFecha).datos.map((f) => f[0]);
    expect(etiquetas).not.toContain('Meses');
    expect(etiquetas).not.toContain('Fechas');
    expect(etiquetas).toContain('Semana');
  });

  it('el tipo de microciclo sale con su código del plan gráfico', () => {
    const fila = hojaMacrociclo(completo()).datos.find((f) => f[0] === 'Tipo de microciclo')!;
    expect(fila[1]).toBe('CH');
    expect(fila[2]).toBe('R');
    expect(fila[3]).toBeNull();
  });

  it('las sesiones y las horas salen como NÚMERO, para poder sumarlas', () => {
    const ses = hojaMacrociclo(completo()).datos.find((f) => f[0] === 'Sesiones')!;
    expect(ses[1]).toBe(9);
    expect(typeof ses[1]).toBe('number');
    expect(ses[3]).toBeNull();
  });

  it('la competencia lleva su nombre y su categoría', () => {
    const fila = hojaMacrociclo(completo()).datos.find((f) => f[0] === 'Competencias')!;
    expect(fila[6]).toBe('Nacional (C.F)');
    expect(fila[1]).toBeNull();
  });

  it('sin competencias NO se pinta la fila vacía', () => {
    const sinComp = macro({ semanas: 8, contenido: sembrarPlanGrafico(8) });
    expect(hojaMacrociclo(sinComp).datos.map((f) => f[0])).not.toContain('Competencias');
  });

  it('las capacidades van bajo su encabezado de grupo', () => {
    const etiquetas = hojaMacrociclo(completo()).datos.map((f) => f[0]);
    const i = etiquetas.indexOf('PREPARACIÓN FÍSICA GENERAL');
    expect(i).toBeGreaterThan(-1);
    expect(etiquetas[i + 1]).toBe('Fuerza');
  });

  it('EL «=» NO SE ESCRIBE COMO FÓRMULA', () => {
    // Excel interpreta una celda que empieza por `=` como fórmula y abre el
    // libro con un error de referencia en cada semana marcada. El apóstrofo
    // delante la fuerza a texto.
    let c = sembrarPlanGrafico(4);
    const fuerza = c.filas.find((f) => f.nombre === 'Fuerza')!;
    c = escribirCelda(c, fuerza.id, 0, 'X');
    c = escribirCelda(c, fuerza.id, 1, '=');

    const fila = hojaMacrociclo(macro({ semanas: 4, contenido: c })).datos.find(
      (f) => f[0] === 'Fuerza',
    )!;
    expect(fila[1]).toBe('X');
    expect(fila[2]).toBe("'=");
  });

  it('el libro con el plan completo se relee con todo dentro', () => {
    const bytes = XLSX.write(libroDeMacrociclo(completo(), []), {
      type: 'buffer',
      bookType: 'xlsx',
    });
    const hoja = XLSX.read(bytes, { type: 'buffer' }).Sheets['Macrociclo'];
    const plano = JSON.stringify(XLSX.utils.sheet_to_json<unknown[]>(hoja, { header: 1 }));
    expect(plano).toContain('Enero');
    expect(plano).toContain('Preparación física general'.toUpperCase());
    expect(plano).toContain('Nacional (C.F)');
  });
});
