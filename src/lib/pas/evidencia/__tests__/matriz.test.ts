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

  const tipos = new Set(refs.map((r) => r.tipo));
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

    expect(filas).toHaveLength(11);
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
    expect(conNorma.sort()).toEqual(['P-04', 'P-06', 'P-07']);
  });
});
