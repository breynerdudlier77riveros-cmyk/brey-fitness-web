// ── El conflicto tiene que VERSE (Sprint PAS-14) ───────────────────────────
//
// EL FALLO QUE ESTE FICHERO EXISTE PARA IMPEDIR:
//
//   El motor detectaba desde siempre que cuatro valores de 1RM del mismo día
//   son hechos incompatibles (REG-05, `resultado_divergente`). Lo que no
//   ocurría es que llegara a la pantalla: `medicionesDe` mapea todos los
//   registros vigentes sin agrupar, así que el informe del atleta pintaba
//   CUATRO tarjetas de 1RM —100, 120, 150 y 50 kg— como si fueran cuatro
//   hallazgos normales, y nada decía que se contradicen.
//
//   El único sitio que lo mostraba era la rejilla de capacidades del informe
//   funcional, que al fundir los tres informes pasó al detalle plegado. Es
//   decir: la reorganización lo empeoró, y por eso el aviso se subió arriba
//   del todo.
//
// LOS TRES INVARIANTES:
//
//   1 · El aviso va ANTES de las cifras. Leído después llega tarde: para
//       entonces las cuatro tarjetas ya se han leído como cuatro resultados.
//   2 · Dice QUÉ valores chocan. «Hay un conflicto en 1RM» obliga a abrir
//       cuatro tarjetas; «100, 120, 150 y 50 kg» hace obvio cuál sobra.
//   3 · NO resuelve. El motor tampoco (PAS-ADR-04): se reportan, no se elige.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

const COMPOSITOR = readFileSync('src/components/pas/informe/InformeEvaluacion.tsx', 'utf8');

describe('el aviso de conflicto está en el compositor', () => {
  it('CONTROL POSITIVO · el fichero se lee', () => {
    expect(COMPOSITOR.length).toBeGreaterThan(1000);
  });

  it('recibe los conflictos y los pinta', () => {
    expect(COMPOSITOR).toContain('conflictos');
    expect(COMPOSITOR).toContain('ConflictosDeDatos');
  });

  it('VA ANTES de los resultados', () => {
    // Si alguien lo mueve debajo de la rejilla, el aviso llega tarde.
    const iAviso = COMPOSITOR.indexOf('<ConflictosDeDatos');
    const iResultados = COMPOSITOR.indexOf('<ResultCard');
    expect(iAviso).toBeGreaterThan(-1);
    expect(iResultados).toBeGreaterThan(-1);
    expect(iAviso).toBeLessThan(iResultados);
  });

  it('solo asciende los conflictos que invalidan una lectura', () => {
    // Una fecha futura o un id repetido son higiene del expediente y ya viven
    // en el detalle técnico. Subirlos aquí convertiría el aviso en ruido.
    expect(COMPOSITOR).toContain('resultado_divergente');
    expect(COMPOSITOR).toContain('duplicado_exacto');
    expect(COMPOSITOR).toContain('repeticion_no_admitida');
    expect(COMPOSITOR).not.toContain('fecha_futura');
  });

  it('dice explícitamente que el sistema NO elige', () => {
    // Es la doctrina del motor (PAS-ADR-04) y el lector tiene que saberlo:
    // si creyera que el sistema ya descartó los valores malos, leería la
    // tarjeta que tiene delante como si fuera la buena.
    expect(COMPOSITOR).toContain('el sistema no elige entre ellos');
  });
});

// ── El formateo de los valores ─────────────────────────────────────────────
//
// La función es interna al componente, así que se prueba su comportamiento a
// través de la forma canónica que produce el motor, comprobada contra los
// datos reales que la destaparon:
//
//   "continuo:100:kg | continuo:120:kg | continuo:150:kg | continuo:50:kg"

describe('la forma canónica del motor', () => {
  it('es la que el compositor sabe leer', () => {
    // Si el motor cambiara el separador o el orden de los campos, el aviso
    // caería al modo crudo sin avisar. Esto fija el contrato entre los dos.
    expect(COMPOSITOR).toContain('"continuo"');
    expect(COMPOSITOR).toContain('split("|")');
  });

  it('ante un formato que no entiende, enseña lo crudo en vez de inventar', () => {
    expect(COMPOSITOR).toContain('return crudo');
  });

  it('no mezcla unidades distintas en una misma lista', () => {
    // Dos valores en unidades distintas son otro problema; fingir que
    // comparten escala sería afirmar algo que nadie comprobó.
    expect(COMPOSITOR).toContain('unidad !== trozos[2]');
  });
});

// ── El orden del informe y de la página (Sprint PAS-15) ────────────────────
//
// EL PROBLEMA: la página abría con dos formularios y una tabla de dieciocho
// filas planas, y había que pasarlos enteros para llegar a lo que se viene a
// leer. Las herramientas arriba, el producto al final del scroll.
//
// Y dentro del informe, tres cosas chirriaban: la primera sección era la única
// sin título, una tarjeta ocupaba un apartado para decir que la función no
// existe, y las once tarjetas de resultado salían en orden de tecleo.

describe('el informe se lee antes que las herramientas', () => {
  const PAGINA = readFileSync(
    'src/app/app/rendimiento/evaluacion/[evaluacionId]/page.tsx',
    'utf8',
  );

  it('el informe va ANTES del bloque de registrar y corregir', () => {
    const iInforme = PAGINA.indexOf('<InformeEvaluacion');
    const iHerramientas = PAGINA.indexOf('Registrar y corregir datos');
    expect(iInforme).toBeGreaterThan(-1);
    expect(iHerramientas).toBeGreaterThan(-1);
    expect(iInforme).toBeLessThan(iHerramientas);
  });

  it('las herramientas van plegadas, no en otra página', () => {
    // Corregir un dato y volver a mirar el informe es el gesto más frecuente;
    // partirlo en dos vistas obligaría a navegar en cada corrección.
    expect(PAGINA).toContain('<details');
    expect(PAGINA).toContain('RegistroPruebaForm');
    expect(PAGINA).toContain('MasaCorporal');
  });
});

describe('las cuatro secciones tienen título', () => {
  it('incluida la primera, que era la única sin él', () => {
    for (const titulo of ['Qué se midió', 'Dónde cae', 'Qué falta', 'Hacia dónde']) {
      expect(COMPOSITOR, titulo).toContain(`>${titulo}</h2>`);
    }
  });

  it('los resultados se agrupan por dominio, no por orden de tecleo', () => {
    expect(COMPOSITOR).toContain('porDominio(');
  });

  it('un resultado sin dominio no se reparte entre los demás', () => {
    // Colocarlo bajo uno cualquiera afirmaría que mide algo que nadie ha
    // dicho que mida.
    expect(COMPOSITOR).toContain('Sin dominio asignado');
  });

  it('ya no hay una tarjeta que prometa una función inexistente', () => {
    // Un informe profesional o enseña algo o no ocupa sitio.
    expect(COMPOSITOR).not.toContain('estará disponible cuando la capa');
  });
});
