// ── El hilo de conversación (Sprint BCS-15) ────────────────────────────────
//
// LO QUE ESTOS TESTS PROTEGEN:
//
//   1 · QUE EL INFORME VIAJE UNA SOLA VEZ. Es con diferencia la parte más
//       larga del contexto. Repetirlo en cada turno multiplicaría el coste por
//       el número de preguntas —en la capa gratuita, la cuota— y le daría al
//       modelo varias copias del mismo documento entre las que elegir.
//
//   2 · QUE EL HILO EMPIECE SIEMPRE POR EL USUARIO. Las dos APIs rechazan un
//       hilo que arranca con una respuesta del modelo, y ese 400 llegaría a
//       pantalla como «el modelo falló», que es mentira.
//
//   3 · QUE EL RECORTE SE HAGA POR EL PRINCIPIO. Los turnos recientes son los
//       que dan sentido a «eso» y «lo que acabas de decir»: recortar por el
//       final rompería exactamente la función que el hilo existe para dar.

import { describe, expect, it } from 'vitest';

import { construirTurnos, MAX_TURNO, MAX_TURNOS } from '@/lib/ia/hilo';
import type { Turno } from '@/lib/ia/proveedor';

const INFORME = '# Informe de composición corporal\nLecturas y límites.';

const u = (texto: string): Turno => ({ rol: 'usuario', texto });
const m = (texto: string): Turno => ({ rol: 'modelo', texto });

describe('la primera pregunta', () => {
  it('lleva el informe pegado, y es el único turno', () => {
    const turnos = construirTurnos(INFORME, [], '¿Qué dice mi agua corporal?');

    expect(turnos).toHaveLength(1);
    expect(turnos[0].rol).toBe('usuario');
    expect(turnos[0].texto).toContain(INFORME);
    expect(turnos[0].texto).toContain('¿Qué dice mi agua corporal?');
  });
});

describe('una repregunta', () => {
  const historial = [u('¿Qué dice mi agua corporal?'), m('Son 42 litros…')];
  const turnos = construirTurnos(INFORME, historial, 'Desarrolla eso');

  it('conserva el hilo entero y añade la nueva pregunta al final', () => {
    expect(turnos).toHaveLength(3);
    expect(turnos.map((t) => t.rol)).toEqual(['usuario', 'modelo', 'usuario']);
    expect(turnos[2].texto).toBe('Desarrolla eso');
  });

  it('EL INFORME VA SOLO EN EL PRIMER TURNO', () => {
    // Es la comprobación que protege la cuota: si algún día se colara en cada
    // turno, la tercera pregunta de una conversación costaría el triple.
    const conInforme = turnos.filter((t) => t.texto.includes(INFORME));
    expect(conInforme).toHaveLength(1);
    expect(turnos[0].texto).toContain(INFORME);
  });

  it('la pregunta original sigue estando, dentro del primer turno', () => {
    // Se reconstruye: el informe se le pega delante, pero no la sustituye.
    expect(turnos[0].texto).toContain('¿Qué dice mi agua corporal?');
  });
});

describe('el recorte', () => {
  /** Un hilo largo: pares pregunta/respuesta numerados. */
  const largo: Turno[] = Array.from({ length: 12 }, (_, i) =>
    i % 2 === 0 ? u(`pregunta ${i}`) : m(`respuesta ${i}`),
  );

  const turnos = construirTurnos(INFORME, largo, 'y ahora esto');

  it('se queda con los últimos turnos, no con los primeros', () => {
    // `MAX_TURNOS` del historial + la pregunta nueva.
    expect(turnos).toHaveLength(MAX_TURNOS + 1);
    expect(turnos[0].texto).toContain('pregunta 6');
    expect(turnos[0].texto).not.toContain('pregunta 0');
  });

  it('y el resultado sigue empezando por el usuario', () => {
    expect(turnos[0].rol).toBe('usuario');
  });

  it('descarta una respuesta del modelo que quedara arriba tras el recorte', () => {
    // Con un historial impar, el corte deja una respuesta al principio. Sin
    // esta poda, las dos APIs devolverían un 400.
    const impar: Turno[] = [m('huérfana'), u('p1'), m('r1'), u('p2'), m('r2')];
    const t = construirTurnos(INFORME, impar, 'siguiente');

    expect(t[0].rol).toBe('usuario');
    expect(t[0].texto).not.toContain('huérfana');
    expect(t[0].texto).toContain('p1');
  });

  it('un historial que es SOLO respuestas del modelo se descarta entero', () => {
    const t = construirTurnos(INFORME, [m('a'), m('b')], 'pregunta');
    expect(t).toHaveLength(1);
    expect(t[0].texto).toContain(INFORME);
    expect(t[0].texto).toContain('pregunta');
  });

  it('los turnos vacíos no ocupan sitio en el hilo', () => {
    const t = construirTurnos(INFORME, [u('p1'), m('   '), u('p2'), m('r2')], 'nueva');
    expect(t.map((x) => x.rol)).toEqual(['usuario', 'usuario', 'modelo', 'usuario']);
  });

  it('un turno gigantesco se recorta: viene del navegador', () => {
    const enorme = 'x'.repeat(MAX_TURNO * 3);
    const t = construirTurnos(INFORME, [u('p1'), m(enorme)], 'nueva');
    expect(t[1].texto.length).toBe(MAX_TURNO);
  });
});

describe('lo que el hilo NO cambia', () => {
  it('la pregunta nueva viaja tal cual, sin el informe delante', () => {
    // El informe ya está arriba. Repetirlo aquí sería el error que el test de
    // la cuota vigila, visto desde el otro lado.
    const t = construirTurnos(INFORME, [u('p1'), m('r1')], 'Desarrolla eso');
    expect(t[t.length - 1].texto).toBe('Desarrolla eso');
  });
});
