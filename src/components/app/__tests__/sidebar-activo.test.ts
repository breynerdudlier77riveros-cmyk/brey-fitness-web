// ── Una sola entrada marcada a la vez (Sprint MAC-1) ───────────────────────
//
// EL FALLO QUE ESTE FICHERO IMPIDE:
//
//   `isActive` marcaba cualquier entrada cuyo `href` fuera prefijo de la ruta
//   actual. Con el menú plano eso nunca chocaba. Al añadir «Macrociclos» en
//   `/app/rendimiento/macrociclo` —que cuelga de «Performance Assessment» en
//   `/app/rendimiento`— las dos empezaron a encajar, y el menú resaltaba las
//   dos a la vez.
//
//   Dos entradas marcadas no dicen dónde estás: dicen que el menú no lo sabe.

import { describe, expect, it } from 'vitest';

import { isActive } from '../Sidebar';

/** Las rutas del menú, como las declara el componente. */
const HREFS = [
  '/app',
  '/app/sistema',
  '/app/entrenamientos',
  '/app/progreso',
  '/app/biblioteca',
  '/app/composicion-corporal',
  '/app/plantillas',
  '/app/rendimiento',
  '/app/rendimiento/macrociclo',
  '/app/perfil',
  '/app/configuracion',
];

const marcadas = (ruta: string) => HREFS.filter((h) => isActive(ruta, h));

describe('el menú marca una entrada y solo una', () => {
  it('CONTROL POSITIVO · en una ruta del menú se marca la suya', () => {
    expect(marcadas('/app/rendimiento')).toEqual(['/app/rendimiento']);
    expect(marcadas('/app/plantillas')).toEqual(['/app/plantillas']);
  });

  it('EL CASO QUE LO DESTAPÓ · en un macrociclo NO se marca también el assessment', () => {
    expect(marcadas('/app/rendimiento/macrociclo')).toEqual(['/app/rendimiento/macrociclo']);
    expect(marcadas('/app/rendimiento/macrociclo/abc-123')).toEqual([
      '/app/rendimiento/macrociclo',
    ]);
  });

  it('pero una ruta hija SIN entrada propia sigue marcando a su padre', () => {
    // Una evaluación no tiene entrada de menú: debe marcar «Performance
    // Assessment», que es de donde cuelga.
    expect(marcadas('/app/rendimiento/evaluacion/abc')).toEqual(['/app/rendimiento']);
    expect(marcadas('/app/rendimiento/atleta-1')).toEqual(['/app/rendimiento']);
    expect(marcadas('/app/plantillas/p1')).toEqual(['/app/plantillas']);
  });

  it('el dashboard solo se marca en el dashboard', () => {
    // `/app` es prefijo de TODAS. Sin su caso especial se marcaría siempre.
    expect(marcadas('/app')).toEqual(['/app']);
    expect(marcadas('/app/perfil')).toEqual(['/app/perfil']);
  });

  it('ninguna ruta del menú deja el menú sin marcar', () => {
    for (const h of HREFS) {
      expect(marcadas(h), h).toHaveLength(1);
    }
  });

  it('una ruta ajena no marca nada', () => {
    expect(marcadas('/login')).toEqual([]);
  });

  it('un prefijo parcial NO cuenta como coincidencia', () => {
    // `/app/rendimientos` no cuelga de `/app/rendimiento`: es otra ruta que
    // empieza igual. Sin la barra en la comparación, marcaría la de al lado.
    expect(marcadas('/app/rendimiento-otro')).toEqual([]);
  });
});
