// ── El asistente del plan (Sprint PLS-2) ───────────────────────────────────
//
// LO QUE ESTOS TESTS PROTEGEN:
//
//   1 · QUE LA LÍNEA ESTÉ MOVIDA, NO AFLOJADA. El validador del BCS prohíbe
//       «series», «rutina» y «entrena» porque en un informe de composición
//       corporal serían una prescripción sin respaldo. Aquí son el tema: un
//       asistente que explica un plan y no puede decir «series» no dice nada.
//       Lo que aquí se prohíbe es otra cosa — añadir, cambiar y opinar.
//
//   2 · QUE EL CONTEXTO NO DÉ NADA MÁS QUE EL PLAN. Es la restricción fuerte:
//       el modelo no puede inventarse una carga porque no tiene ninguna otra
//       cifra a mano. Una instrucción se desobedece; un dato ausente no.
//
//   3 · QUE EL LÍMITE EXISTA. Es la primera puerta anónima del ecosistema que
//       gasta una API medida. Sin él, cualquiera con el enlace vacía la cuota
//       diaria y deja al entrenador sin BREY IA en su propio informe.

import { beforeEach, describe, expect, it } from 'vitest';

import { validarTextoPlan } from '../ia/validador';
import { construirContextoPlan } from '../ia/contexto';
import {
  MAX_POR_VENTANA,
  VENTANA_MS,
  registrarPregunta,
  reiniciarLimite,
} from '../ia/limite';
import { bloqueNuevo, diaNuevo, ejercicioNuevo } from '../contenido';
import type { Contenido } from '../tipos';

// ════════════════════════════════════════════════════════════════════════════
// EL VALIDADOR
// ════════════════════════════════════════════════════════════════════════════

describe('lo que el asistente SÍ puede decir', () => {
  it('el vocabulario de entrenamiento pasa: es de lo que va a hablar', () => {
    // Reutilizar el validador del BCS habría rechazado las cuatro. Es la
    // razón entera por la que este fichero existe.
    const admisibles = [
      'En la semana 3 tienes 4 series de 6 repeticiones.',
      'El RIR es cuántas repeticiones te habrías dejado sin hacer.',
      'Tu rutina de empuje empieza con un calentamiento de movilidad.',
      'Este plan de entrenamiento tiene dos días por semana.',
      'Entrena el press de banca con 75 kg según lo que pone aquí.',
    ];
    for (const texto of admisibles) {
      expect(validarTextoPlan(texto), texto).toEqual([]);
    }
  });

  it('CONTROL POSITIVO · el validador sí detecta algo', () => {
    // Sin esto, lo de arriba pasaría también con una función que devolviera
    // siempre la lista vacía.
    expect(validarTextoPlan('Te recomiendo subir el peso.').length).toBeGreaterThan(0);
  });
});

describe('lo que el asistente NO puede decir', () => {
  const casos: readonly [string, string][] = [
    ['prescripcion_propia', 'Te recomiendo empezar con menos carga.'],
    ['prescripcion_propia', 'Deberías añadir una serie más el jueves.'],
    ['prescripcion_propia', 'Sube el peso si lo notas fácil.'],
    ['prescripcion_propia', 'Cambia el ejercicio por una variante más sencilla.'],
    ['juicio_del_plan', 'Es un buen plan para empezar.'],
    ['juicio_del_plan', 'Le falta volumen a la parte de tirón.'],
    ['juicio_del_plan', 'Sería mejor repartirlo en tres días.'],
    ['medico', 'Eso suena a tendinitis del manguito.'],
    ['medico', 'Con ese dolor necesitas fisioterapia.'],
    ['nutricion', 'Acompáñalo de una dieta con superávit calórico.'],
    ['nutricion', 'Un suplemento de creatina te ayudaría.'],
    ['certeza', 'Sin duda vas a ganar fuerza con esto.'],
    ['certeza', 'Este esquema garantiza resultados.'],
  ];

  it.each(casos)('rechaza (%s) «%s»', (categoria, texto) => {
    const v = validarTextoPlan(texto);
    expect(v.length).toBeGreaterThan(0);
    expect(v.some((x) => x.categoria === categoria)).toBe(true);
  });

  it('detecta aunque falten los acentos, que es como se teclea deprisa', () => {
    expect(validarTextoPlan('Te recomiendo mas descanso').length).toBeGreaterThan(0);
    expect(validarTextoPlan('TE RECOMIENDO parar').length).toBeGreaterThan(0);
  });

  it('devuelve TODAS las violaciones, no la primera', () => {
    // Que un texto rompa tres reglas dice algo distinto de que rompa una.
    const v = validarTextoPlan('Te recomiendo una dieta y sin duda es un buen plan.');
    expect(v.length).toBeGreaterThanOrEqual(3);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// EL CONTEXTO
// ════════════════════════════════════════════════════════════════════════════

function plan(): Contenido {
  const press = ejercicioNuevo('Press de Banca con Barra', 2, 'press-banca-barra');
  press.descansoSeg = 150;
  press.notas = 'Baja controlado.';
  press.video = 'https://youtu.be/abc';
  press.semanas = [
    { series: [{ reps: '4-6', pesoKg: 75, rir: 2, notas: null }] },
    { series: [{ reps: '4-6', pesoKg: 80, rir: 1, notas: null }] },
  ];

  const bloque = bloqueNuevo('principal');
  bloque.ejercicios = [press];

  const dia = diaNuevo('Día 1 · Empuje');
  dia.bloques = [bloque];
  return { dias: [dia] };
}

describe('el contexto del plan', () => {
  const texto = construirContextoPlan({
    nombre: 'Hipertrofia · Bloque 1',
    descripcion: 'Dos días por semana.',
    semanas: 2,
    contenido: plan(),
    para: 'Juan',
  });

  it('CONTROL POSITIVO · lleva el plan', () => {
    expect(texto).toContain('Press de Banca con Barra');
    expect(texto).toContain('Día 1 · Empuje');
    expect(texto).toContain('Juan');
  });

  it('describe cada serie con sus tres datos', () => {
    expect(texto).toContain('4-6 reps');
    expect(texto).toContain('75 kg');
    expect(texto).toContain('RIR 2');
  });

  it('el descanso va en minutos, igual que en la pantalla', () => {
    // Si divergieran, el asistente diría una cosa y la hoja otra.
    expect(texto).toContain('2 min 30 s');
  });

  it('un dato no prescrito se dice, no se rellena con un cero', () => {
    const sinNada = plan();
    sinNada.dias[0].bloques[0].ejercicios[0].semanas[0].series[0] = {
      reps: '',
      pesoKg: null,
      rir: null,
      notas: null,
    };
    const t = construirContextoPlan({
      nombre: 'x',
      descripcion: null,
      semanas: 2,
      contenido: sinNada,
      para: null,
    });
    expect(t).toContain('sin carga prescrita');
    expect(t).toContain('sin RIR prescrito');
  });

  it('dice QUE hay vídeo, pero no la dirección', () => {
    // El modelo no tiene por qué reproducir enlaces, y al copiarlos se
    // equivoca: quien quiere el vídeo lo tiene en la página, pulsable.
    expect(texto).toContain('vídeo enlazado');
    expect(texto).not.toContain('youtu.be');
  });

  it('LO CIERRA: declara que eso es todo lo que sabe', () => {
    // Es la instrucción que acompaña a la restricción real —no tener más
    // datos— y la que convierte «no lo sé» en una respuesta esperada.
    expect(texto).toContain('Esto es TODO lo que sabes');
    expect(texto).toContain('no está en el plan');
  });

  it('no cuela ninguna cifra que no esté en el plan', () => {
    // El tonelaje se calcula con las mismas funciones que pintan la tabla.
    // 75 × 5 no es calculable (4-6 es un rango), así que no debe aparecer.
    expect(texto).toContain('sin tonelaje calculable');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// EL LÍMITE
// ════════════════════════════════════════════════════════════════════════════

describe('el límite por enlace', () => {
  beforeEach(reiniciarLimite);

  it('deja pasar hasta el tope y luego corta', () => {
    const t0 = 1_000_000;
    for (let i = 0; i < MAX_POR_VENTANA; i++) {
      expect(registrarPregunta('tok', t0 + i).permitido).toBe(true);
    }
    expect(registrarPregunta('tok', t0 + MAX_POR_VENTANA).permitido).toBe(false);
  });

  it('va contando cuántas quedan', () => {
    const v = registrarPregunta('tok', 1_000_000);
    expect(v.restantes).toBe(MAX_POR_VENTANA - 1);
  });

  it('cada enlace tiene su propia cuenta', () => {
    const t0 = 1_000_000;
    for (let i = 0; i < MAX_POR_VENTANA; i++) registrarPregunta('a', t0 + i);

    expect(registrarPregunta('a', t0).permitido).toBe(false);
    expect(registrarPregunta('b', t0).permitido).toBe(true);
  });

  it('la ventana se desliza: una hora después vuelve a haber sitio', () => {
    const t0 = 1_000_000;
    for (let i = 0; i < MAX_POR_VENTANA; i++) registrarPregunta('tok', t0 + i);
    expect(registrarPregunta('tok', t0 + 1000).permitido).toBe(false);

    expect(registrarPregunta('tok', t0 + VENTANA_MS + 1).permitido).toBe(true);
  });

  it('cuando corta, dice cuánto falta y nunca menos de un segundo', () => {
    const t0 = 1_000_000;
    for (let i = 0; i < MAX_POR_VENTANA; i++) registrarPregunta('tok', t0);

    const v = registrarPregunta('tok', t0 + 1);
    expect(v.permitido).toBe(false);
    expect(v.esperaSegundos).toBeGreaterThan(0);
    expect(v.esperaSegundos).toBeLessThanOrEqual(VENTANA_MS / 1000);
  });
});
