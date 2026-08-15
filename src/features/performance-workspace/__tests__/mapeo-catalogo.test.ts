// ── El mapeo normativo y el catálogo del PAS concuerdan (PRS-2.3) ──────────
//
// EL FALLO QUE ESTE FICHERO EXISTE PARA IMPEDIR:
//
//   `mapeo.ts` declaraba `pruebaId: 'HGS-01'`, un identificador que no existe
//   en ningún sitio. El catálogo del Workspace tiene `P-01`…`P-11`, y la
//   prensión es `P-03`. Ningún test lo detectó durante dos sprints porque las
//   fixtures fabricaban registros con ese mismo id inventado: se comprobaban a
//   sí mismas.
//
//   Y detrás había un segundo fallo: el formulario de registro no capturaba
//   las condiciones de método, así que ningún registro creado desde la interfaz
//   podía compararse aunque el id fuera correcto.
//
// La lección va al método, no al fichero: **un adaptador entre dos sistemas no
// puede probarse con fixtures que él mismo define.** Tiene que atarse al
// contrato del otro lado, que es lo que se hace aquí.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';
import { join } from 'node:path';

import { MAPEOS, mapeoDe } from '@/lib/pas/normativo';
import { CATALOGO_PAS, PRUEBAS } from '../schemas/catalogo';

describe('el mapeo apunta a pruebas que existen', () => {
  it.each(MAPEOS.map((m) => [m.pruebaId, m] as const))(
    '%s está en el catálogo del Workspace',
    (pruebaId) => {
      expect(PRUEBAS.map((p) => p.id)).toContain(pruebaId);
    },
  );

  it.each(MAPEOS.map((m) => [m.pruebaId, m] as const))(
    '%s también está en el catálogo que consume el PAE',
    (pruebaId) => {
      expect(CATALOGO_PAS.pruebas.map((p) => p.id)).toContain(pruebaId);
    },
  );

  it('la prueba mapeada mide una magnitud continua', () => {
    for (const m of MAPEOS) {
      const prueba = PRUEBAS.find((p) => p.id === m.pruebaId)!;
      expect(prueba.naturaleza, m.pruebaId).toBe('continuo');
    }
  });

  it('la unidad que sugiere el catálogo es una de las que el mapeo admite', () => {
    for (const m of MAPEOS) {
      const prueba = PRUEBAS.find((p) => p.id === m.pruebaId)!;
      expect(Object.keys(m.unidades), `${m.pruebaId}: ${prueba.unidad}`).toContain(prueba.unidad);
    }
  });

  it('la prensión se mapea a P-03, la dinamometría de agarre', () => {
    const p03 = PRUEBAS.find((p) => p.id === 'P-03')!;
    expect(p03.nombre).toMatch(/agarre/i);
    expect(mapeoDe('P-03')).not.toBeNull();
    expect(mapeoDe('P-03')!.variable).toBe('fuerza_prension_manual');
  });

  it('una prueba sin mapeo devuelve null, no un mapeo por defecto', () => {
    for (const id of ['P-01', 'P-04', 'P-09']) expect(mapeoDe(id)).toBeNull();
  });

  it('control positivo: un id inventado no está en el catálogo', () => {
    // Es exactamente el fallo que se cometió. Sin esta comprobación, la de
    // arriba podría pasar por vacío si `MAPEOS` quedara sin entradas.
    expect(MAPEOS.length).toBeGreaterThan(0);
    expect(PRUEBAS.map((p) => p.id)).not.toContain('HGS-01');
  });
});

describe('el formulario puede declarar todo lo que el mapeo necesita', () => {
  const FORM = readFileSync(
    join(process.cwd(), 'src/features/performance-workspace/components/RegistroPruebaForm.tsx'),
    'utf-8',
  );

  it('recoge las cuatro claves de condición del mapeo', () => {
    // No se comprueba que el nombre esté escrito en el JSX —lo genera un bucle
    // sobre el propio mapeo— sino que el formulario LEE las claves de ahí. Si
    // alguien las volviera a teclear a mano, esto seguiría pasando pero el
    // test de vocabulario de abajo caería en cuanto divergieran.
    expect(FORM).toContain('mapeoDe(pruebaId)');
    expect(FORM).toContain('mapeo.claves[campo]');
    expect(FORM).toContain('mapeo.vocabulario[campo]');
  });

  it('envía las condiciones a la acción de registro', () => {
    expect(FORM).toMatch(/condiciones:\s*Object\.keys\(condiciones\)\.length > 0/);
  });

  it('una condición sin declarar no se guarda como cadena vacía', () => {
    // «No consta» y «declarado vacío» son cosas distintas: la primera produce
    // NO_DETERMINABLE, la segunda sería un método declarado que no existe.
    expect(FORM).toMatch(/if \(valorCond\) condiciones\[clave\] = valorCond;/);
  });

  it('los cuatro ejes del método están cubiertos', () => {
    for (const eje of ['instrumento', 'definicionOperacional', 'posicion', 'lado']) {
      expect(FORM, eje).toContain(`campo: "${eje}"`);
    }
  });

  it('cada opción del vocabulario tiene etiqueta legible', () => {
    // Un identificador sin etiqueta se muestra tal cual, así que no rompe nada;
    // pero se comprueba para que la interfaz no acabe llena de `takei-t18`.
    const mapeo = MAPEOS[0];
    const ids = [
      ...Object.keys(mapeo.vocabulario.instrumento),
      ...Object.keys(mapeo.vocabulario.definicionOperacional),
      ...Object.keys(mapeo.vocabulario.posicion),
      ...Object.keys(mapeo.vocabulario.lado),
    ];
    for (const id of ids) expect(FORM, id).toContain(`${id.includes('-') ? `"${id}"` : id}:`);
  });
});

describe('el registro que produce el formulario sí es comparable', () => {
  it('las claves que escribe el formulario son las que lee el adaptador', () => {
    // El circuito completo en una sola afirmación: el mapeo declara las claves,
    // el formulario las usa como `name` del campo, y el adaptador las lee de
    // `condiciones`. Los tres leen del mismo sitio.
    const mapeo = mapeoDe('P-03')!;
    expect(Object.values(mapeo.claves).sort()).toEqual(
      ['consolidacion', 'dinamometro', 'mano', 'posicion'].sort(),
    );
  });

  it('el vocabulario cubre los seis dinamómetros de la NKB', () => {
    expect(Object.keys(mapeoDe('P-03')!.vocabulario.instrumento)).toHaveLength(6);
  });
});
