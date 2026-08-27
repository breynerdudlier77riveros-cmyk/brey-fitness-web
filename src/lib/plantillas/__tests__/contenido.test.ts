// ── El contenido de una plantilla ──────────────────────────────────────────
//
// LO QUE ESTOS TESTS PROTEGEN:
//
//   1 · LA INVARIANTE DE LAS SEMANAS. Todo ejercicio tiene exactamente tantas
//       entradas como semanas declara el bloque. Si se rompe, la rejilla
//       pinta huecos y un ajuste de cliente apunta al vacío.
//
//   2 · QUE LOS AJUSTES NO SE PIERDAN NI SE PEGUEN AL SITIO EQUIVOCADO. Se
//       direccionan por id de ejercicio, no por posición: reordenar la
//       plantilla no puede cambiar las cargas de nadie.
//
//   3 · QUE «NO PRESCRITO» NO SE CONVIERTA EN CERO. Es la regla que este
//       subsistema comparte con el resto del ecosistema: un dato ausente se
//       queda ausente, nunca se rellena con un valor que parezca una
//       indicación.
//
//   4 · QUE EL TONELAJE NO MIENTA. Solo suma lo que puede sumar, y dice
//       cuántas series dejó fuera.

import { describe, expect, it } from 'vitest';

import {
  aplicarAjustes,
  bloqueNuevo,
  diaNuevo,
  direccion,
  ejercicioNuevo,
  ejerciciosDe,
  esYouTube,
  urlDeVideo,
  podarAjustes,
  problemasDe,
  redimensionar,
  repeticionesNumericas,
  seriesEnSemana,
  seriesQueSePierden,
  serieVacia,
  tonelajeSemana,
} from '../contenido';
import type { Ajustes, Contenido, EjercicioPlantilla, Serie } from '../tipos';

const serie = (over: Partial<Serie> = {}): Serie => ({ ...serieVacia(), ...over });

/** Una plantilla de dos semanas con un ejercicio de dos series. */
function plantilla(semanas = 2): { contenido: Contenido; ejercicio: EjercicioPlantilla } {
  const ejercicio = ejercicioNuevo('Press de Banca con Barra', semanas, 'press-banca-barra');
  ejercicio.semanas = Array.from({ length: semanas }, (_, i) => ({
    series: [
      serie({ reps: '4', pesoKg: 80 + i * 5, rir: 2 }),
      serie({ reps: '4', pesoKg: 80 + i * 5, rir: 2 }),
    ],
  }));

  const bloque = bloqueNuevo('principal');
  bloque.ejercicios = [ejercicio];

  const dia = diaNuevo('Día 1 · Empuje');
  dia.bloques = [bloque];

  return { contenido: { dias: [dia] }, ejercicio };
}

describe('construcción', () => {
  it('un ejercicio nace con una entrada por semana', () => {
    expect(ejercicioNuevo('X', 6).semanas).toHaveLength(6);
  });

  it('nace con UNA serie, no con tres', () => {
    // Tres filas prerrellenadas parecerían una recomendación del sistema, y
    // el sistema no recomienda nada: la plantilla la escribe el entrenador.
    const e = ejercicioNuevo('X', 3);
    expect(e.semanas.every((s) => s.series.length === 1)).toBe(true);
  });

  it('un día nace con calentamiento y trabajo principal', () => {
    // El calentamiento no es un ejercicio con menos peso: es otro bloque, y
    // que esté de serie es lo que enseña la estructura sin escribir nada.
    expect(diaNuevo('Día 1').bloques.map((b) => b.tipo)).toEqual(['calentamiento', 'principal']);
  });

  it('cada elemento nace con un identificador propio', () => {
    const ids = [ejercicioNuevo('A', 1).id, ejercicioNuevo('B', 1).id, diaNuevo('D').id];
    expect(new Set(ids).size).toBe(3);
  });
});

describe('redimensionar el bloque', () => {
  it('ampliar copia la última semana en vez de dejarla vacía', () => {
    // No es una progresión sugerida: es que teclear la semana 3 desde cero
    // cuando difiere de la 2 en un número es trabajo inventado.
    const { contenido } = plantilla(2);
    const ancho = redimensionar(contenido, 4);
    const e = ejerciciosDe(ancho)[0];

    expect(e.semanas).toHaveLength(4);
    expect(e.semanas[2].series[0].pesoKg).toBe(85);
    expect(e.semanas[3].series[0].pesoKg).toBe(85);
  });

  it('la copia es independiente: tocar la semana nueva no altera la vieja', () => {
    const { contenido } = plantilla(1);
    const ancho = redimensionar(contenido, 2);
    const e = ejerciciosDe(ancho)[0];

    e.semanas[1].series[0].pesoKg = 999;
    expect(e.semanas[0].series[0].pesoKg).toBe(80);
  });

  it('recortar corta por el final', () => {
    const { contenido } = plantilla(4);
    const e = ejerciciosDe(redimensionar(contenido, 2))[0];

    expect(e.semanas).toHaveLength(2);
    expect(e.semanas[0].series[0].pesoKg).toBe(80);
  });

  it('no muta la entrada', () => {
    const { contenido } = plantilla(2);
    redimensionar(contenido, 5);
    expect(ejerciciosDe(contenido)[0].semanas).toHaveLength(2);
  });

  it('avisa de cuántas series se perderían al recortar', () => {
    // Existe para poder preguntar ANTES de destruir.
    const { contenido } = plantilla(4);
    expect(seriesQueSePierden(contenido, 2)).toBe(4);
    expect(seriesQueSePierden(contenido, 4)).toBe(0);
    expect(seriesQueSePierden(contenido, 6)).toBe(0);
  });

  it('no avisa por semanas que estaban vacías', () => {
    const contenido = { dias: [diaNuevo('D')] };
    contenido.dias[0].bloques[1].ejercicios = [ejercicioNuevo('X', 4)];
    expect(seriesQueSePierden(contenido, 1)).toBe(0);
  });
});

describe('ajustes por cliente', () => {
  it('sustituye solo lo que el ajuste menciona', () => {
    const { contenido, ejercicio } = plantilla(2);
    const ajustes: Ajustes = { [direccion(ejercicio.id, 0, 0)]: { pesoKg: 70 } };

    const visto = ejerciciosDe(aplicarAjustes(contenido, ajustes))[0];

    expect(visto.semanas[0].series[0].pesoKg).toBe(70);
    // Lo que el ajuste NO menciona sigue viniendo de la plantilla madre. Es
    // lo que permite que una corrección del entrenador llegue a todos.
    expect(visto.semanas[0].series[0].reps).toBe('4');
    expect(visto.semanas[0].series[0].rir).toBe(2);
    expect(visto.semanas[0].series[1].pesoKg).toBe(80);
    expect(visto.semanas[1].series[0].pesoKg).toBe(85);
  });

  it('un ajuste a null QUITA la carga, no la deja como estaba', () => {
    // La diferencia entre «no lo ajustes» y «este cliente va sin carga
    // prescrita». Con `||` en vez de `in`, las dos serían la misma cosa.
    const { contenido, ejercicio } = plantilla(1);
    const ajustes: Ajustes = { [direccion(ejercicio.id, 0, 0)]: { pesoKg: null } };

    const visto = ejerciciosDe(aplicarAjustes(contenido, ajustes))[0];
    expect(visto.semanas[0].series[0].pesoKg).toBeNull();
  });

  it('no muta la plantilla madre', () => {
    const { contenido, ejercicio } = plantilla(1);
    aplicarAjustes(contenido, { [direccion(ejercicio.id, 0, 0)]: { pesoKg: 70 } });
    expect(ejerciciosDe(contenido)[0].semanas[0].series[0].pesoKg).toBe(80);
  });

  it('sin ajustes devuelve el mismo objeto: no hay copia inútil', () => {
    const { contenido } = plantilla(1);
    expect(aplicarAjustes(contenido, {})).toBe(contenido);
  });

  it('reordenar los ejercicios NO mueve las cargas de nadie', () => {
    // La invariante que justifica direccionar por id y no por posición.
    const { contenido, ejercicio } = plantilla(1);
    const otro = ejercicioNuevo('Remo con barra', 1);
    otro.semanas = [{ series: [serie({ reps: '10', pesoKg: 50 })] }];

    const bloque = contenido.dias[0].bloques[0];
    bloque.ejercicios = [ejercicio, otro];
    const ajustes: Ajustes = { [direccion(ejercicio.id, 0, 0)]: { pesoKg: 70 } };

    // Se le da la vuelta al bloque.
    bloque.ejercicios = [otro, ejercicio];
    const visto = aplicarAjustes(contenido, ajustes);
    const porId = new Map(ejerciciosDe(visto).map((e) => [e.id, e]));

    expect(porId.get(ejercicio.id)!.semanas[0].series[0].pesoKg).toBe(70);
    expect(porId.get(otro.id)!.semanas[0].series[0].pesoKg).toBe(50);
  });

  it('poda los ajustes que ya no apuntan a ninguna serie', () => {
    const { contenido, ejercicio } = plantilla(2);
    const ajustes: Ajustes = {
      [direccion(ejercicio.id, 0, 0)]: { pesoKg: 70 },
      [direccion(ejercicio.id, 0, 9)]: { pesoKg: 70 }, // serie que no existe
      [direccion('ejercicio-borrado', 0, 0)]: { pesoKg: 70 },
    };

    expect(Object.keys(podarAjustes(contenido, ajustes))).toEqual([direccion(ejercicio.id, 0, 0)]);
  });

  it('recortar semanas deja huérfanos los ajustes de las que se van', () => {
    const { contenido, ejercicio } = plantilla(4);
    const ajustes: Ajustes = {
      [direccion(ejercicio.id, 0, 0)]: { pesoKg: 70 },
      [direccion(ejercicio.id, 3, 0)]: { pesoKg: 95 },
    };

    const podados = podarAjustes(redimensionar(contenido, 2), ajustes);
    expect(Object.keys(podados)).toEqual([direccion(ejercicio.id, 0, 0)]);
  });
});

describe('repeticiones y tonelaje', () => {
  it('solo cuenta como número lo que es un número', () => {
    expect(repeticionesNumericas('8')).toBe(8);
    expect(repeticionesNumericas('  10 ')).toBe(10);
    // «8-10» NO se resuelve al punto medio ni al extremo bajo: elegir uno
    // sería inventar la prescripción que el entrenador dejó abierta.
    expect(repeticionesNumericas('8-10')).toBeNull();
    expect(repeticionesNumericas('al fallo')).toBeNull();
    expect(repeticionesNumericas('30 s')).toBeNull();
    expect(repeticionesNumericas('')).toBeNull();
    expect(repeticionesNumericas('0')).toBeNull();
  });

  it('suma peso × reps de las series que tienen los dos datos', () => {
    const { contenido } = plantilla(2);
    expect(tonelajeSemana(contenido, 0)).toEqual({
      kg: 640, // 80×4 × 2 series
      seriesContadas: 2,
      seriesSinDatos: 0,
    });
    expect(tonelajeSemana(contenido, 1).kg).toBe(680);
  });

  it('una serie sin carga NO vale cero: se cuenta aparte', () => {
    // Sumarla como cero daría un total que parece bajo cuando en realidad
    // está incompleto, y nadie sabría cuál de las dos cosas está viendo.
    const { contenido } = plantilla(1);
    ejerciciosDe(contenido)[0].semanas[0].series[1].pesoKg = null;

    const t = tonelajeSemana(contenido, 0);
    expect(t.kg).toBe(320);
    expect(t.seriesContadas).toBe(1);
    expect(t.seriesSinDatos).toBe(1);
  });

  it('un rango de repeticiones tampoco entra en el tonelaje', () => {
    const { contenido } = plantilla(1);
    ejerciciosDe(contenido)[0].semanas[0].series[0].reps = '8-10';

    const t = tonelajeSemana(contenido, 0);
    expect(t.seriesSinDatos).toBe(1);
    expect(t.seriesContadas).toBe(1);
  });

  it('cuenta las series de cada semana por separado', () => {
    const { contenido } = plantilla(2);
    expect(seriesEnSemana(contenido, 0)).toBe(2);
    expect(seriesEnSemana(contenido, 5)).toBe(0);
  });
});

describe('validación de la estructura', () => {
  it('una plantilla bien formada no tiene problemas', () => {
    const { contenido } = plantilla(2);
    expect(problemasDe(contenido, 2)).toEqual([]);
  });

  it('CONTROL POSITIVO · sí detecta una estructura rota', () => {
    // Sin esto, el test de arriba pasaría también con una función que
    // devolviera siempre la lista vacía.
    const { contenido } = plantilla(2);
    expect(problemasDe(contenido, 4).length).toBeGreaterThan(0);
  });

  it('detecta el desajuste entre semanas declaradas y reales', () => {
    const { contenido } = plantilla(2);
    expect(problemasDe(contenido, 3)[0]).toMatch(/tiene 2 semanas y el bloque declara 3/);
  });

  it('detecta un identificador repetido', () => {
    // Pasaría al duplicar un ejercicio sin renovar su id, y haría que los
    // ajustes de un cliente cayeran sobre los dos a la vez.
    const { contenido, ejercicio } = plantilla(1);
    const gemelo = { ...ejercicio, nombre: 'Copia' };
    contenido.dias[0].bloques[0].ejercicios.push(gemelo);

    expect(problemasDe(contenido, 1).some((p) => /identificador repetido/.test(p))).toBe(true);
  });

  it('detecta nombres vacíos', () => {
    const { contenido } = plantilla(1);
    contenido.dias[0].bloques[0].ejercicios[0].nombre = '   ';
    expect(problemasDe(contenido, 1).some((p) => /ejercicio sin nombre/.test(p))).toBe(true);
  });

  it('NO opina sobre entrenamiento: un RIR raro se guarda sin comentarios', () => {
    // Es la línea que mantiene coherente al resto del ecosistema. El sistema
    // se niega a clasificar un porcentaje graso sin fuente publicada; no
    // puede a la vez juzgar la prescripción de un profesional.
    const { contenido } = plantilla(1);
    const s = ejerciciosDe(contenido)[0].semanas[0].series[0];
    s.rir = 9;
    s.pesoKg = 500;
    s.reps = '100';

    expect(problemasDe(contenido, 1)).toEqual([]);
  });

  it('rechaza un número de semanas fuera del rango que la rejilla soporta', () => {
    const { contenido } = plantilla(1);
    expect(problemasDe(contenido, 0).length).toBeGreaterThan(0);
    expect(problemasDe(contenido, 25).length).toBeGreaterThan(0);
    expect(problemasDe(contenido, 2.5).length).toBeGreaterThan(0);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// EL ENLACE AL VÍDEO
// ════════════════════════════════════════════════════════════════════════════
//
// LO QUE ESTOS TESTS PROTEGEN, Y NO ES UNA COMODIDAD:
//
//   Este valor termina dentro de un `href` que pulsa un TERCERO desde la
//   página pública. `javascript:alert(1)` es una URL perfectamente válida para
//   `new URL()` y se ejecuta al pulsarla, en el navegador de quien abrió el
//   enlace que le pasó su entrenador.
//
//   El saneado corre en dos sitios —al guardar y al pintar— porque sanear solo
//   al guardar deja fuera todo lo que ya estuviera en la base de datos.

describe('urlDeVideo', () => {
  it('acepta http y https', () => {
    expect(urlDeVideo('https://www.youtube.com/watch?v=abc')).toBe(
      'https://www.youtube.com/watch?v=abc',
    );
    expect(urlDeVideo('http://ejemplo.com/v.mp4')).toBe('http://ejemplo.com/v.mp4');
  });

  it('completa el esquema cuando no lo lleva: nadie teclea https:// de memoria', () => {
    expect(urlDeVideo('youtube.com/watch?v=abc')).toBe('https://youtube.com/watch?v=abc');
    expect(urlDeVideo('  youtu.be/abc  ')).toBe('https://youtu.be/abc');
  });

  it('RECHAZA los esquemas que ejecutan código', () => {
    // El motivo entero de que esta función exista.
    expect(urlDeVideo('javascript:alert(1)')).toBeNull();
    expect(urlDeVideo('JavaScript:alert(1)')).toBeNull();
    expect(urlDeVideo('data:text/html,<script>alert(1)</script>')).toBeNull();
    expect(urlDeVideo('vbscript:msgbox(1)')).toBeNull();
    expect(urlDeVideo('file:///etc/passwd')).toBeNull();
  });

  it('un esquema peligroso NO se cuela por la vía del autocompletado', () => {
    // Si el respaldo se aplicara a todo, `https://javascript:alert(1)` podría
    // llegar a parsear. Con esquema, un fallo es un fallo y no se reintenta.
    expect(urlDeVideo('javascript:void(0)')).toBeNull();
    expect(urlDeVideo('mailto:a@b.c')).toBeNull();
  });

  it('lo vacío o ausente es ausencia, no error', () => {
    expect(urlDeVideo(null)).toBeNull();
    expect(urlDeVideo(undefined)).toBeNull();
    expect(urlDeVideo('')).toBeNull();
    expect(urlDeVideo('   ')).toBeNull();
    // Una fila antigua no tiene la clave: llega `undefined` y no debe romper.
    expect(urlDeVideo(({} as { video?: string }).video)).toBeNull();
  });

  it('lo que no es una dirección se rechaza en vez de guardarse a medias', () => {
    expect(urlDeVideo('no es una url')).toBeNull();
    expect(urlDeVideo('https://')).toBeNull();
  });
});

describe('esYouTube', () => {
  it('reconoce los tres dominios, con y sin www', () => {
    expect(esYouTube('https://www.youtube.com/watch?v=a')).toBe(true);
    expect(esYouTube('https://youtube.com/watch?v=a')).toBe(true);
    expect(esYouTube('https://youtu.be/a')).toBe(true);
    expect(esYouTube('https://m.youtube.com/watch?v=a')).toBe(true);
  });

  it('no confunde un dominio que solo lo contiene', () => {
    // `youtube.com.malo.net` no es YouTube, y etiquetarlo como tal daría al
    // lector una confianza que nadie ha ganado.
    expect(esYouTube('https://youtube.com.malo.net/x')).toBe(false);
    expect(esYouTube('https://noyoutube.com/x')).toBe(false);
    expect(esYouTube('https://vimeo.com/123')).toBe(false);
  });

  it('solo cambia la etiqueta: un enlace que no es de YouTube sigue siendo válido', () => {
    expect(urlDeVideo('https://vimeo.com/123')).toBe('https://vimeo.com/123');
  });
});
