// ── Identidad y bloqueos de clasificación (Sprint BCS-7.0) ─────────────────
//
// LO QUE ESTOS TESTS PROTEGEN:
//
//   1 · Que la edad se calcule a la fecha DE LA MEDICIÓN. Es el bug que el PAS
//       ya pagó una vez (G-01): interpretar una medición vieja con la edad de
//       hoy mete al cliente en la banda equivocada y produce una clasificación
//       que parece impecable.
//
//   2 · Que «no se puede clasificar» diga cuál de las cuatro cosas falta. Una
//       frase única para cuatro situaciones distintas hace pedirle al
//       profesional un dato que ya tiene, y le esconde el que sí puede dar.
//
//   3 · Que nunca se invente una identidad. Ni el sexo del nombre, ni la edad
//       de nada, ni un rango pediátrico que no existe.

import { describe, expect, it } from 'vitest';

import { bloqueoDe, bloqueosDe, edadEnFecha, sujetoDe, SUJETO_DESCONOCIDO } from '../identidad';
import type { SujetoBCS } from '../identidad';
import type { Medicion } from '../tipos';
import { NORMAS, normaPara } from '../normas';
import { advertenciaDe, poblacionDe, redactarPosicion, situarEnNorma } from '../posicion-normativa';
import { construirContexto } from '../ia/contexto';
import { SISTEMA } from '../ia/contrato';
import { MODELO_POR_DEFECTO } from '../ia/proveedores/anthropic';

const VARON_1990: SujetoBCS = { sexo: 'M', fechaNacimiento: '1990-06-15' };

const medicion = (over: Partial<Medicion> = {}): Medicion =>
  ({
    id: 'm1',
    cliente_id: 'c1',
    estado: 'vigente',
    altura_cm: 178,
    peso_kg: 81,
    imc: 25.6,
    grasa_pct: 22.4,
    masa_grasa_kg: 18.1,
    masa_muscular_kg: 34.2,
    masa_libre_grasa_kg: 62.9,
    agua_total_l: 46.1,
    agua_intracelular_l: null,
    agua_extracelular_l: null,
    proteina_kg: 12.3,
    minerales_kg: null,
    masa_osea_kg: 3.1,
    grasa_visceral_idx: 8,
    angulo_fase_deg: null,
    bmr_kcal: 1740,
    edad_metabolica: 31,
    smi: null,
    circ_cintura_cm: null,
    circ_cadera_cm: null,
    whr: 0.92,
    impedancia_ohm: null,
    fecha: '2026-08-12',
    observaciones: null,
    foto_url: null,
    dispositivo: null,
    ...over,
  }) satisfies Medicion;

// ════════════════════════════════════════════════════════════════════════════
// LA EDAD, A LA FECHA DE LA MEDICIÓN
// ════════════════════════════════════════════════════════════════════════════

describe('la edad se calcula a la fecha de la medición, no a la de hoy', () => {
  it('cuenta años cumplidos', () => {
    expect(edadEnFecha('1990-06-15', '2026-08-12')).toBe(36);
  });

  it('el día antes del cumpleaños todavía no los ha cumplido', () => {
    expect(edadEnFecha('1990-06-15', '2026-06-14')).toBe(35);
    expect(edadEnFecha('1990-06-15', '2026-06-15')).toBe(36);
  });

  it('LA REGRESIÓN QUE IMPORTA · dos mediciones del mismo cliente, dos edades', () => {
    // Si esta función mirase el reloj, las dos darían el mismo número y una de
    // las dos clasificaciones sería la de otra persona.
    const antigua = edadEnFecha('1990-06-15', '2019-01-10');
    const reciente = edadEnFecha('1990-06-15', '2026-08-12');
    expect(antigua).toBe(28);
    expect(reciente).toBe(36);
    expect(antigua).not.toBe(reciente);
  });

  it('sin fecha de nacimiento no hay edad, y no se inventa una', () => {
    expect(edadEnFecha(null, '2026-08-12')).toBeNull();
  });

  it('una fecha malformada devuelve null en vez de un número absurdo', () => {
    expect(edadEnFecha('15/06/1990', '2026-08-12')).toBeNull();
    expect(edadEnFecha('1990-06-15', 'ayer')).toBeNull();
  });

  it('un nacimiento posterior a la medición no produce una edad negativa', () => {
    expect(edadEnFecha('2027-01-01', '2026-08-12')).toBeNull();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// CADA BLOQUEO DICE QUÉ FALTA Y A QUIÉN PEDÍRSELO
// ════════════════════════════════════════════════════════════════════════════

describe('el motivo del bloqueo distingue las cuatro situaciones', () => {
  it('sin sexo: el bloqueo es del cliente y nombra el campo', () => {
    const b = bloqueoDe('grasa_pct', SUJETO_DESCONOCIDO, medicion())!;
    expect(b.origen).toBe('cliente');
    expect(b.falta).toBe('sexo');
    expect(b.detalle).toMatch(/sexo del cliente/);
    expect(b.detalle).toMatch(/anotarlo en su ficha/);
  });

  it('con sexo y sin nacimiento: el bloqueo cambia, no desaparece', () => {
    const b = bloqueoDe('grasa_pct', { sexo: 'M', fechaNacimiento: null }, medicion())!;
    expect(b.origen).toBe('cliente');
    expect(b.falta).toBe('fecha_nacimiento');
  });

  it('con sexo y edad y sin dispositivo: el bloqueo pasa a la medición', () => {
    const b = bloqueoDe('grasa_pct', VARON_1990, medicion())!;
    expect(b.origen).toBe('medicion');
    expect(b.falta).toBe('dispositivo');
    expect(b.detalle).toMatch(/con qué analizador/);
  });

  it('con todo puesto: el bloqueo es del SISTEMA, y se dice así', () => {
    // La diferencia que hace útil todo esto: aquí no falta nada por parte de
    // quien lee. Decírselo evita que busque un dato que ya dio.
    const b = bloqueoDe('grasa_pct', VARON_1990, medicion({ dispositivo: 'InBody 270' }))!;
    expect(b.origen).toBe('sistema');
    expect(b.falta).toBeNull();
    expect(b.detalle).toMatch(/InBody 270/);
    expect(b.detalle).toMatch(/No es un dato que falte por tu parte/);
  });

  it('LOS CUATRO MOTIVOS SON DISTINTOS ENTRE SÍ', () => {
    // Control del control: si `bloqueoDe` devolviera siempre la misma frase,
    // los cuatro tests anteriores podrían pasar por coincidencia de subcadenas.
    const frases = [
      bloqueoDe('grasa_pct', SUJETO_DESCONOCIDO, medicion())!.detalle,
      bloqueoDe('grasa_pct', { sexo: 'M', fechaNacimiento: null }, medicion())!.detalle,
      bloqueoDe('grasa_pct', VARON_1990, medicion())!.detalle,
      bloqueoDe('grasa_pct', VARON_1990, medicion({ dispositivo: 'InBody 270' }))!.detalle,
    ];
    expect(new Set(frases).size).toBe(4);
  });

  it('un dispositivo en blanco no cuenta como declarado', () => {
    expect(bloqueoDe('grasa_pct', VARON_1990, medicion({ dispositivo: '   ' }))!.origen).toBe(
      'medicion',
    );
  });
});

describe('cada variable tiene su propio bloqueo, no uno compartido', () => {
  it('la grasa visceral NO depende del sexo: depende del aparato', () => {
    // Es la comprobación que impide volver a la frase única. Su escala la
    // define el fabricante, así que conocer el sexo no la desbloquea.
    const b = bloqueoDe('grasa_visceral_idx', VARON_1990, medicion())!;
    expect(b.origen).toBe('medicion');
    expect(b.falta).toBe('dispositivo');
  });

  it('el WHR solo depende del sexo, y una vez dado el bloqueo es del sistema', () => {
    expect(bloqueoDe('whr', SUJETO_DESCONOCIDO, medicion())!.falta).toBe('sexo');
    const b = bloqueoDe('whr', VARON_1990, medicion())!;
    expect(b.origen).toBe('sistema');
    expect(b.falta).toBeNull();
  });

  it('y el WHR nombra su fuente, con año, en vez de decir «no disponible»', () => {
    // La referencia existe, está identificada y es recuperable. Lo que falta
    // es transcribir su tabla, y eso es un trabajo concreto, no un vacío.
    const b = bloqueoDe('whr', VARON_1990, medicion())!;
    expect(b.detalle).toMatch(/OMS/);
    expect(b.detalle).toMatch(/2011/);
    expect(b.detalle).toMatch(/todavía no está transcrita/);
  });

  it('el IMC no tiene bloqueo: es la única que sí se clasifica', () => {
    expect(bloqueoDe('imc', SUJETO_DESCONOCIDO, medicion())).toBeNull();
  });

  it('una variable que no se clasifica en la especificación tampoco lo tiene', () => {
    // No tener clasificación no es lo mismo que tenerla bloqueada, y mezclarlas
    // llenaría el informe de limitaciones que nadie puede resolver.
    expect(bloqueoDe('masa_muscular_kg', SUJETO_DESCONOCIDO, medicion())).toBeNull();
    expect(bloqueoDe('peso_kg', VARON_1990, medicion())).toBeNull();
  });
});

// ════════════════════════════════════════════════════════════════════════════
// MENORES: SE DICE, NO SE CLASIFICA CON LA TABLA EQUIVOCADA
// ════════════════════════════════════════════════════════════════════════════

describe('los rangos de adultos no se aplican a un menor', () => {
  const menor: SujetoBCS = { sexo: 'F', fechaNacimiento: '2012-03-01' };

  it('el bloqueo declara la edad y que no hay rangos pediátricos', () => {
    const b = bloqueoDe('grasa_pct', menor, medicion({ dispositivo: 'InBody 270' }))!;
    expect(b.origen).toBe('sin_referencia');
    expect(b.detalle).toMatch(/14 años/);
    expect(b.detalle).toMatch(/población adulta/);
    expect(b.detalle).toMatch(/pediátricos/);
  });

  it('y no se salta aunque el dispositivo esté declarado', () => {
    // El orden importa: si la comprobación del aparato fuera antes, un menor
    // con dispositivo caería en el bloqueo del sistema y algún día alguien
    // cargaría la tabla de adultos y se la aplicaría.
    const conAparato = bloqueoDe('grasa_pct', menor, medicion({ dispositivo: 'InBody 270' }))!;
    expect(conAparato.origen).toBe('sin_referencia');
  });

  it('el día que cumple 18 deja de ser un menor', () => {
    const cumple: SujetoBCS = { sexo: 'F', fechaNacimiento: '2008-08-12' };
    const b = bloqueoDe('grasa_pct', cumple, medicion({ fecha: '2026-08-12', dispositivo: 'X' }))!;
    expect(b.origen).toBe('sistema');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LA LISTA COMPLETA
// ════════════════════════════════════════════════════════════════════════════

describe('bloqueosDe recorre la medición entera', () => {
  it('solo declara bloqueos de variables que la medición trae', () => {
    // `whr` viene con valor y `circ_cintura_cm` no. Anunciar un bloqueo sobre
    // un dato que no existe sería inventarle un problema al informe.
    const ids = bloqueosDe(medicion({ whr: null }), SUJETO_DESCONOCIDO).map((b) => b.variable);
    expect(ids).not.toContain('whr');
    expect(ids).toContain('grasa_pct');
  });

  it('las tres pendientes salen cuando las tres tienen valor', () => {
    const ids = bloqueosDe(medicion(), SUJETO_DESCONOCIDO).map((b) => b.variable);
    expect(new Set(ids)).toEqual(new Set(['grasa_pct', 'whr', 'grasa_visceral_idx']));
  });

  it('rellenar la ficha reduce lo que se le pide al profesional', () => {
    // La medida de que esto sirve para algo: con sexo y nacimiento puestos, no
    // queda ninguna petición dirigida al profesional sobre la ficha.
    const antes = bloqueosDe(medicion(), SUJETO_DESCONOCIDO);
    const despues = bloqueosDe(medicion({ dispositivo: 'InBody 270' }), VARON_1990);

    // Antes hay peticiones dirigidas al profesional; después, ninguna.
    expect(antes.some((b) => b.origen === 'cliente')).toBe(true);
    expect(despues.some((b) => b.origen === 'cliente')).toBe(false);
    expect(despues.every((b) => b.origen === 'sistema')).toBe(true);

    // Y ya antes NO todos eran del cliente: la grasa visceral pedía el
    // aparato, no el sexo. Es la prueba de que cada variable lleva su propio
    // motivo y no uno compartido.
    expect(antes.every((b) => b.origen === 'cliente')).toBe(false);
    expect(antes.find((b) => b.variable === 'grasa_visceral_idx')!.origen).toBe('medicion');
  });
});

describe('sujetoDe traduce, no deduce', () => {
  it('copia lo que hay', () => {
    expect(sujetoDe({ sexo: 'F', fecha_nacimiento: '1995-02-02' })).toEqual({
      sexo: 'F',
      fechaNacimiento: '1995-02-02',
    });
  });

  it('un cliente sin identidad produce un sujeto sin identidad', () => {
    expect(sujetoDe({ sexo: null, fecha_nacimiento: null })).toEqual(SUJETO_DESCONOCIDO);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// NORMAS POBLACIONALES TRANSCRITAS (Sprint BCS-10.0)
// ════════════════════════════════════════════════════════════════════════════
//
// Percentiles publicados, cargados desde su fuente. Lo que estos tests fijan
// no es que la posición se calcule —de eso ya se encarga `situar()`— sino las
// tres cosas que se pueden estropear al transcribir una tabla:
//
//   · que los números dejen de ser los del artículo;
//   · que una celda imposible se «arregle» en silencio;
//   · que la procedencia deje de nombrarse.

describe('la tabla de Amaral 2022 está transcrita, no reinterpretada', () => {
  it('los percentiles son los del artículo, byte a byte', () => {
    const { celda } = normaPara('grasa_pct', 'M', 22)!;
    expect(celda.puntos.map((x) => x.valor)).toEqual([10.2, 12, 15.5, 20.2, 25.8, 31.1, 34.5]);
    expect(celda.n).toBe(371);
  });

  it('y los de mujeres son otros: no se comparte tabla entre sexos', () => {
    const { celda } = normaPara('grasa_pct', 'F', 30)!;
    expect(celda.puntos.map((x) => x.valor)).toEqual([18.5, 20.8, 25, 32.3, 38.8, 44.3, 48]);
    expect(celda.n).toBe(345);
  });

  it('LA CELDA IMPOSIBLE se conserva tal cual y NO se usa', () => {
    // El artículo imprime P10 = 15,0 por debajo de P5 = 18,1, sobre 16
    // personas. Corregirlo sería inventar la fuente; usarlo, situar a alguien
    // en una distribución que no existe.
    const { celda } = normaPara('grasa_pct', 'M', 65)!;
    expect(celda.puntos[0].valor).toBe(18.1);
    expect(celda.puntos[1].valor).toBe(15);
    expect(celda.utilizable).toBe(false);
    expect(celda.motivoNoUtilizable).toMatch(/imposible en una distribución/);
    expect(celda.motivoNoUtilizable).toMatch(/16 personas/);
  });

  it('y quien cae en ella recibe el motivo, no un silencio', () => {
    const pn = situarEnNorma('grasa_pct', 25, { sexo: 'M', fechaNacimiento: '1961-01-15' }, '2026-08-21');
    expect(pn.posicion).toBeNull();
    expect(pn.motivo).toBe('CELDA_NO_UTILIZABLE');
    expect(pn.detalleMotivo).toMatch(/16 personas/);
  });

  it('CONTROL POSITIVO · la celda de al lado sí sitúa', () => {
    // Sin esto, el test anterior pasaría también si la norma entera estuviera
    // rota y nunca situara a nadie.
    const pn = situarEnNorma('grasa_pct', 13.3, { sexo: 'M', fechaNacimiento: '2004-01-15' }, '2026-08-21');
    expect(pn.posicion).not.toBeNull();
    expect(redactarPosicion(pn, poblacionDe(pn.celda!))).toMatch(
      /Entre 10 y 25 de cada 100 varones de 20 a 59 años/,
    );
  });

  it('la procedencia se nombra SIEMPRE que hay posición', () => {
    // La tabla es de otro país y de otro modelo de aparato. Presentarla sin
    // decirlo la convertiría en una norma de aquí — es G-06 otra vez.
    const pn = situarEnNorma('grasa_pct', 13.3, { sexo: 'M', fechaNacimiento: '2004-01-15' }, '2026-08-21');
    const aviso = advertenciaDe(pn)!;
    expect(aviso).toMatch(/Brasil/);
    expect(aviso).toMatch(/InBody S10/);
    expect(aviso).toMatch(/371 personas/);
    expect(aviso).toMatch(/no está demostrado/);
  });

  it('sin identidad no se sitúa, y se dice cuál de los dos datos falta', () => {
    const sinSexo = situarEnNorma('grasa_pct', 13.3, { sexo: null, fechaNacimiento: '2004-01-15' }, '2026-08-21');
    expect(sinSexo.motivo).toBe('SIN_SEXO');
    const sinNac = situarEnNorma('grasa_pct', 13.3, { sexo: 'M', fechaNacimiento: null }, '2026-08-21');
    expect(sinNac.motivo).toBe('SIN_NACIMIENTO');
    expect(sinSexo.detalleMotivo).not.toBe(sinNac.detalleMotivo);
  });

  it('una variable sin tabla cargada dice eso, y no «falta un dato tuyo»', () => {
    const pn = situarEnNorma('proteina_kg', 11.3, { sexo: 'M', fechaNacimiento: '2004-01-15' }, '2026-08-21');
    expect(pn.motivo).toBe('SIN_NORMA');
    expect(pn.detalleMotivo).toMatch(/No es un dato que falte por tu parte/);
  });

  it('la edad se toma a la fecha de la medición, también aquí', () => {
    // Un adolescente medido hace ocho años no se sitúa en la tabla de adultos.
    const antigua = situarEnNorma('grasa_pct', 15, { sexo: 'M', fechaNacimiento: '2004-01-15' }, '2018-08-21');
    expect(poblacionDe(antigua.celda!)).toMatch(/10 a 19 años/);
    const reciente = situarEnNorma('grasa_pct', 15, { sexo: 'M', fechaNacimiento: '2004-01-15' }, '2026-08-21');
    expect(poblacionDe(reciente.celda!)).toMatch(/20 a 59 años/);
  });

  it('toda norma cargada declara su fuente, su país y su aparato', () => {
    for (const n of NORMAS) {
      expect(n.cita.length, n.id).toBeGreaterThan(60);
      expect(n.fuente.length, n.id).toBeGreaterThan(3);
      expect(n.pais.length, n.id).toBeGreaterThan(2);
      expect(n.dispositivo.length, n.id).toBeGreaterThan(3);
      expect(n.limitaciones.length, n.id).toBeGreaterThan(0);
    }
  });

  it('ninguna celda utilizable tiene percentiles desordenados', () => {
    // El auditor que habría cazado la fila de varones ≥60 si nadie la mira.
    for (const n of NORMAS) {
      for (const c of n.celdas.filter((x) => x.utilizable)) {
        const valores = c.puntos.map((x) => x.valor);
        const ordenados = [...valores].sort((a, b) => a - b);
        expect(valores, `${n.id} ${c.sexo} ${c.edadMin}-${c.edadMax}`).toEqual(ordenados);
      }
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LO QUE BREY IA NO PUEDE VER (Sprint BCS-12)
// ════════════════════════════════════════════════════════════════════════════
//
// La restricción más fuerte del módulo no está en el prompt: está en lo que
// NO se le pasa. Una instrucción se puede desobedecer; un dato ausente no.
//
// El modelo recibe las conclusiones que los motores ya sacaron —cada una con
// su fuente y su límite— y nunca la ficha de variables en crudo. Sin la cifra
// suelta no puede clasificarla aunque se lo pidan.

describe('el contexto del modelo excluye las cifras sueltas', () => {
  const entrada = {
    analisis: {
      cantidadMediciones: 1,
      suficiencia: 'insuficiente',
      fechaInicial: '2026-08-01',
      fechaFinal: '2026-08-01',
      resumen: { titulo: 'Primera medición', texto: 'Se registró la primera medición.' },
      hallazgos: [{ titulo: 'Peso se mantuvo', descripcion: 'Sin cambio.' }],
      insights: [],
      avisos: [
        { tipo: 'limitacion', titulo: '% Grasa corporal no puede clasificarse', descripcion: 'No consta el sexo.' },
      ],
    },
    observaciones: { bloques: [] },
    recomendaciones: { recomendaciones: [] },
    lecturas: [
      {
        id: 'composicion-del-peso',
        titulo: 'De qué está hecho tu peso',
        texto: 'De tus 66,0 kg, 8,8 kg son masa grasa.',
        fundamento: 'CKB 10 · relación de composición.',
      },
    ],
    quienPregunta: 'profesional' as const,
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const texto = construirContexto(entrada as any);

  it('CONTROL POSITIVO · el contexto sí lleva las conclusiones', () => {
    // Sin esto, todo lo de abajo pasaría también sobre una cadena vacía.
    expect(texto).toContain('De qué está hecho tu peso');
    expect(texto).toContain('CKB 10');
    expect(texto.length).toBeGreaterThan(500);
  });

  it('NO viaja el nombre de nadie: sale de la máquina hacia un tercero', () => {
    // Los datos de salud sin el nombre no identifican a nadie. Con el nombre
    // al lado, sí — y las capas gratuitas de los proveedores suelen reservarse
    // el derecho a usar lo enviado para entrenar. El modelo tampoco lo
    // necesita: la persona gramatical la decide `quienPregunta`.
    const conNombre = construirContexto({
      ...entrada,
      clienteNombre: 'Ana Ruiz',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } as any);
    expect(conNombre).not.toContain('Ana Ruiz');
    expect(conNombre).not.toContain('Ana');
    // Y el encabezado sigue existiendo: no se ha borrado, se ha despersonalizado.
    expect(conNombre).toContain('# Informe de composición corporal');
  });

  it('las limitaciones van rotuladas para que el modelo no las contradiga', () => {
    expect(texto).toContain('LO QUE NO PUEDE INTERPRETARSE (no lo contradigas)');
    expect(texto).toContain('% Grasa corporal no puede clasificarse');
  });

  it('la orientación por objetivo viaja entera, con sus fuentes', () => {
    // Es lo ÚNICO del contexto que autoriza a hablar de entrenamiento o de
    // ingesta, y va marcado como tal.
    expect(texto).toContain('Orientación por objetivo');
    expect(texto).toMatch(/lo único que autoriza a hablar de entrenamiento/);
    expect(texto).toMatch(/proximidad_fallo_hipertrofia_2023|hipertrofia-muscular/);
    expect(texto).toContain('NO ADMISIBLE');
  });

  it('la persona gramatical cambia según quién pregunta, y nada más', () => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const delCliente = construirContexto({ ...entrada, quienPregunta: 'cliente' } as any);
    expect(texto).toContain('háblale de su cliente en tercera persona');
    expect(delCliente).toContain('háblale de tú');
    // Lo que se puede decir NO cambia: solo la última línea difiere.
    expect(texto.split('\n').slice(0, -1)).toEqual(delCliente.split('\n').slice(0, -1));
  });
});

describe('el contrato del modelo repite las prohibiciones de la CKB', () => {
  it('nombra las ocho, en el mismo lenguaje que el validador', () => {
    for (const regla of [
      'NO diagnosticar',
      'NO emitir juicios de salud',
      'NO prescribir',
      'NO atribuir causas',
      'NO clasificar un valor si el informe no trae ya su clasificación',
    ]) {
      expect(SISTEMA, regla).toContain(regla);
    }
  });

  it('y le dice que «eso no está en el informe» es una respuesta correcta', () => {
    // La instrucción que evita que rellene huecos inventando.
    // El prompt va con saltos de línea: se normalizan antes de buscar.
    const enUnaLinea = SISTEMA.replace(/\s+/g, ' ');
    expect(enUnaLinea).toMatch(/no está en el informe» es una respuesta correcta/);
    expect(enUnaLinea).toMatch(/Inventar para rellenar es el único error que no se puede recuperar/);
  });

  it('usa el modelo que el proyecto declara, en un solo sitio', () => {
    expect(MODELO_POR_DEFECTO).toBe('claude-opus-5');
  });
});
