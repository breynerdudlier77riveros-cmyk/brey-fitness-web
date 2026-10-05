// ── Matriz maestra de cobertura (Sprint PAS-11 §4, §13, §16) ───────────────
//
// Un solo test que imprime el estado de las once pruebas y comprueba la
// invariante del sprint: que ninguna quede sin respuesta explícita.
//
// Se ejecuta como test —y no como script suelto— porque así la matriz no puede
// quedarse desactualizada en silencio: si alguien añade una prueba al catálogo
// sin darle cobertura, esto lo dice.

import { describe, expect, it } from 'vitest';

import { PRUEBAS } from '@/features/performance-workspace/schemas/catalogo';
import { condicionesDe } from '@/features/performance-workspace/schemas/condiciones';

import { leerEvidencia, type SujetoEvidencia } from '../compatibilidad';
import { referenciasDe } from '../registro';

/** El atleta real del expediente: 22 años, varón, Colombia. */
const REAL: SujetoEvidencia = { edad: 22, sexo: 'M', pais: 'CO', pesoKg: null };

/** Qué clase de cobertura tiene una prueba, según lo que hay registrado. */
function coberturaDe(pruebaId: string): string {
  const refs = referenciasDe(pruebaId);
  if (refs.length === 0) return 'SIN_EVIDENCIA_UTILIZABLE';

  // Una referencia NORMATIVA cuyos valores no están cargados NO es cobertura
  // normativa (PAS-18). Es el caso de McGill: la fuente existe, se ha leído, y
  // dice expresamente que no publica norma para el tiempo aislado de cada
  // prueba —solo cocientes entre las tres—. Contarla como cobertura afirmaría
  // que el sistema puede situar un tiempo suelto, y no puede.
  const conValores = refs.filter((r) => r.representacion.clase !== 'valores_sin_transcribir');
  const tipos = new Set(conValores.map((r) => r.tipo));
  if (tipos.has('NORMATIVA')) return 'COBERTURA_NORMATIVA';
  if (tipos.has('BENCHMARK')) return 'COBERTURA_REFERENCIAL';
  if (tipos.has('ERROR_MEDICION')) return 'COBERTURA_CRITERIO';
  if (tipos.has('FIABILIDAD')) return 'COBERTURA_FIABILIDAD';
  return 'COBERTURA_PARCIAL';
}

describe('matriz maestra de cobertura', () => {
  it('las once pruebas tienen cobertura declarada y condiciones declaradas', () => {
    const filas: string[] = [];

    for (const p of PRUEBAS) {
      const cond = condicionesDe(p.id);
      expect(cond, `${p.id} sin condiciones declaradas`).not.toBeNull();

      const lectura = leerEvidencia(
        {
          pruebaId: p.id,
          valor: 1,
          unidad: p.unidad ?? '—',
          condiciones: Object.fromEntries(
            cond!.requeridas.map((c) => [c.clave, c.vocabulario[0]]),
          ),
        },
        REAL,
      );

      filas.push(
        [
          p.id.padEnd(5),
          coberturaDe(p.id).padEnd(24),
          lectura.estado.padEnd(24),
          `refs=${referenciasDe(p.id).length}`.padEnd(8),
          `req=${cond!.requeridas.length}`,
        ].join(' '),
      );
    }

    // Se imprime para que la matriz quede en la salida del sprint sin tener
    // que ejecutar un script aparte.
    console.log('\n' + filas.join('\n') + '\n');

    expect(filas).toHaveLength(30);
  });

  it('ninguna prueba del catálogo se queda fuera del registro de condiciones', () => {
    for (const p of PRUEBAS) {
      expect(condicionesDe(p.id), p.id).not.toBeNull();
    }
  });

  it('las pruebas con norma poblacional son exactamente las esperadas', () => {
    // Cambiar esta lista exige haber añadido una fuente normativa verificada,
    // que es justamente la decisión que no debe pasar desapercibida.
    const conNorma = PRUEBAS.filter((p) => coberturaDe(p.id) === 'COBERTURA_NORMATIVA').map(
      (p) => p.id,
    );
    expect(conNorma.sort()).toEqual([
      'P-04', 'P-06',
      // P-07 ESTABA EN ESTA LISTA Y SALE EN PAS-18, sin que se le haya quitado
      // nada: al mirar la representación se ve que su única referencia es
      // `valores_sin_transcribir`. La fuente FUPRECOL está verificada y
      // publica P3 a P97 por edad y sexo, pero la tabla nunca se cargó, así
      // que el course-navette no sitúa a nadie —ni a un escolar bogotano—.
      // Aparecía como cobertura normativa porque el clasificador solo miraba
      // el tipo. Queda como deuda declarada, abajo.

      // PAS-18 · las doce de población general. P-12 y P-13 traen bandas con
      // nombre; P-14 a P-20, los intervalos del Senior Fitness Test.
      'P-12', 'P-13', 'P-14', 'P-15', 'P-16', 'P-17', 'P-18', 'P-19', 'P-20',
      // P-21 a P-23 NO aparecen, y hace falta mirar la REPRESENTACIÓN para que
      // no aparezcan: sus referencias son de tipo NORMATIVA pero sin valores
      // cargados, porque McGill no publica norma para el tiempo suelto, solo
      // cocientes entre las tres pruebas. Que se note la diferencia entre «no
      // hay literatura» y «la literatura dice que este número aislado no
      // significa nada» es el sentido de esta lista.
    ].sort());
  });

  it('DEUDA · el course-navette tiene fuente verificada y tabla sin cargar', () => {
    // Este test existe para que el hueco no se olvide. No es «no hay
    // literatura»: la hay, está verificada, y lo que falta es transcribirla.
    // Son dos situaciones opuestas para quien planifica el trabajo, y el
    // sistema tiene un estado distinto para cada una precisamente por eso.
    const refs = referenciasDe('P-07');
    expect(refs).toHaveLength(1);
    expect(refs[0].representacion.clase).toBe('valores_sin_transcribir');
    expect(refs[0].fuenteId).toBe('ramirez_velez_fuprecol_2017');
  });
});
