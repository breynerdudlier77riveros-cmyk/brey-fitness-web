// ── Fallos hallados al ejecutar el flujo real (Sprint PRS-2.3) ─────────────
//
// Cada bloque de este fichero corresponde a algo que **falló de verdad** al
// pasar una medición real por el sistema, no a una hipótesis. Los tests que ya
// existen en el NIE no se repiten aquí: esto cubre la costura entre capas, que
// es donde estaban los fallos.
//
// El caso base reproduce la evaluación real que los destapó: varón colombiano
// de 22 años, 46 kg de prensión medidos con Takei T-18, media de ambas manos,
// de pie, ambas manos.

import { describe, expect, it } from 'vitest';

import { MAPEOS } from '@/lib/pas/normativo';

import {
  COND_UNI,
  NORMAS,
  PORTADA,
  informe,
  registro,
  registroSinNorma,
} from './fixtures';
import type { SujetoNormativo } from '@/lib/pas/normativo';

const CO22: SujetoNormativo = { edad: 22, sexo: 'M', estaturaM: 1.62, pais: 'CO' };
const PRUEBA = MAPEOS[0].pruebaId;

/** El caso real: 46 kg con el método declarado. */
const caso = (valor = 46, condiciones: Record<string, string> = COND_UNI) =>
  informe([registro('r1', valor, 'kg', condiciones)], CO22, PORTADA);

// ════════════════════════════════════════════════════════════════════════════
// FALLO 1 · el mapeo apuntaba a una prueba inexistente
// ════════════════════════════════════════════════════════════════════════════

describe('fallo 1 · la prueba mapeada existe en el catálogo', () => {
  it('el id del mapeo no es inventado', () => {
    // `HGS-01` no existía en ningún catálogo. La comprobación estructural vive
    // en `mapeo-catalogo.test.ts`; aquí se fija el efecto: un registro con el
    // id real llega hasta una comparación.
    expect(PRUEBA).toBe('P-03');
    expect(caso().tarjetas.length).toBeGreaterThan(0);
  });

  it('un registro con un id que no está mapeado no se consulta', () => {
    const i = informe([registroSinNorma('x', 'P-04')], CO22, PORTADA);
    expect(i.tarjetas).toHaveLength(0);
    expect(i.sinNorma).toHaveLength(1);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// FALLO 2 · sin método declarado no hay comparación, y hay que decirlo
// ════════════════════════════════════════════════════════════════════════════

describe('fallo 2 · el método declarado es lo que habilita la comparación', () => {
  it('con las cuatro condiciones, hay dos normas comparables', () => {
    const i = caso();
    expect(i.tarjetas).toHaveLength(2);
    expect(i.tarjetas.map((t) => t.tipo).sort()).toEqual(['TN-1', 'TN-2']);
  });

  it('sin condiciones, ninguna: es lo que ocurría con los registros reales', () => {
    const i = caso(46, {});
    expect(i.tarjetas).toHaveLength(0);
  });

  it('y con una sola condición ausente, tampoco', () => {
    const sinPosicion = { ...COND_UNI };
    delete (sinPosicion as Record<string, string>).posicion;
    expect(caso(46, sinPosicion).tarjetas).toHaveLength(0);
  });

  it('las claves que espera el mapeo son las que trae el registro real', () => {
    expect(Object.keys(COND_UNI).sort()).toEqual(
      Object.values(MAPEOS[0].claves).sort(),
    );
  });
});

// ════════════════════════════════════════════════════════════════════════════
// FALLO 3 · «no aplica» se comía «falta información»
// ════════════════════════════════════════════════════════════════════════════

describe('fallo 3 · los descartes distinguen por qué se descartó', () => {
  it('sin método, las normas de la edad correcta quedan «sin determinar»', () => {
    const panel = caso(46, {}).comparabilidad.r1;
    const falta = panel.descartes.find((d) => d.naturaleza === 'sin determinar')!;
    expect(falta).toBeDefined();
    expect(falta.motivoCorto).toContain('falta información');
    expect(falta.motivo).toContain('NO_DETERMINABLE');
    // Y son las de su edad: las que sí corresponderían si supiéramos el método.
    expect(falta.ejemplos.join(' ')).toContain('22 años');
  });

  it('y las de otra edad quedan «no aplicables», que es distinto', () => {
    const panel = caso(46, {}).comparabilidad.r1;
    const noAplica = panel.descartes.find((d) => d.naturaleza === 'no aplicables')!;
    expect(noAplica.motivo).toContain('NO_APLICABLE');
    expect(noAplica.total).toBeGreaterThan(falta(panel));
  });

  it('con método declarado aparece EQ-3 como grupo propio', () => {
    const panel = caso().comparabilidad.r1;
    const eq3 = panel.descartes.find((d) => d.motivoCorto === 'método EQ-3')!;
    expect(eq3).toBeDefined();
    expect(eq3.naturaleza).toBe('no comparables');
  });

  it('la suma de los grupos cuadra siempre con las evaluadas', () => {
    for (const cond of [COND_UNI, {}]) {
      const panel = caso(46, cond).comparabilidad.r1;
      const suma = panel.comparables.length + panel.descartes.reduce((a, d) => a + d.total, 0);
      expect(suma).toBe(panel.evaluadas);
    }
  });

  it('ninguna naturaleza es un juicio de calidad', () => {
    const JUICIO = /(mala|peor|deficiente|baja calidad|por calidad)/i;
    for (const cond of [COND_UNI, {}]) {
      for (const d of caso(46, cond).comparabilidad.r1.descartes) {
        expect(`${d.naturaleza} ${d.motivoCorto}`).not.toMatch(JUICIO);
      }
    }
    expect('descartada por calidad').toMatch(JUICIO);
  });
});

/** Total del grupo «sin determinar», para comparar tamaños. */
function falta(panel: ReturnType<typeof caso>['comparabilidad'][string]): number {
  return panel.descartes.find((d) => d.naturaleza === 'sin determinar')?.total ?? 0;
}

// ════════════════════════════════════════════════════════════════════════════
// FALLO 4 · «puntuación tipificada» invitaba a leer un percentil
// ════════════════════════════════════════════════════════════════════════════

describe('fallo 4 · la lectura de TN-2 no empuja hacia el percentil', () => {
  const tn2 = () => caso().tarjetas.find((t) => t.tipo === 'TN-2')!;
  const tn1 = () => caso().tarjetas.find((t) => t.tipo === 'TN-1')!;

  it('la situación es una distancia, no una puntuación', () => {
    expect(tn2().situacion).toBe('Distancia respecto a la media');
    expect(tn2().situacion).not.toMatch(/puntuaci[óo]n/i);
  });

  it('el resumen muestra la z con signo', () => {
    expect(tn2().resumenResultado).toMatch(/^z = [+−]\d+,\d+$/);
  });

  it('la explicación dice la distancia y niega el percentil', () => {
    const e = tn2().explicacion!;
    expect(e).toMatch(/desviaciones típicas/);
    // «por encima de», no «sobre»: la reescritura evita `bajo` en el caso
    // negativo, que es una de las categorías prohibidas aunque ahí fuera
    // preposición.
    expect(e).toMatch(/por encima de la media publicada/);
    expect(e).toMatch(/No representa un percentil/);
  });

  it('la z que se muestra es la que calculó el NIE, no una recalculada', () => {
    const t = tn2();
    const norma = NORMAS.find((n) => n.id === t.normaId)!;
    if (norma.valores.tipo !== 'media_dispersion') throw new Error('tipo inesperado');
    const esperada = (46 - norma.valores.media) / norma.valores.desviacionTipica;
    // El texto lleva la z redondeada a dos decimales; el redondeo es de
    // presentación y el valor exacto sigue en el resultado del NIE.
    expect(t.resumenResultado).toContain(esperada.toFixed(2).replace('.', ','));
  });

  it('TN-1 también trae su lectura, sin inventar un percentil intermedio', () => {
    const t = tn1();
    expect(t.resumenResultado).toMatch(/^entre P\d+ y P\d+$/);
    expect(t.explicacion).toMatch(/no se interpola/);
  });

  it('el rótulo accesible lleva la explicación, no solo el estado', () => {
    expect(tn2().aria).toContain('desviaciones típicas');
    expect(tn1().aria).toContain('percentiles');
  });

  it('ninguna lectura contiene una categoría', () => {
    const JUICIO = /\b(bajo|alto|normal|anormal|deficiente|insuficiente|adecuado|excelente)\b/i;
    for (const t of caso().tarjetas) {
      const texto = `${t.situacion} ${t.resumenResultado} ${t.explicacion}`;
      // Se descuentan las negaciones: «No representa un percentil» es una
      // prohibición, no una categoría (H-02).
      expect(texto.replace(/\bNo\s+\w+[^.]*/g, '')).not.toMatch(JUICIO);
    }
    expect('el resultado es alto').toMatch(JUICIO);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// FALLO 5 · dos candidatas de la misma población parecían la misma
// ════════════════════════════════════════════════════════════════════════════

describe('fallo 5 · las comparables se distinguen entre sí', () => {
  it('cada comparable lleva su tipo junto a la población', () => {
    const panel = caso().comparabilidad.r1;
    expect(panel.comparables).toHaveLength(2);
    expect(panel.comparables.map((c) => c.tipo).sort()).toEqual(['TN-1', 'TN-2']);
    // Misma población, distinto tipo: sin el tipo se leerían como una repetida.
    expect(new Set(panel.comparables.map((c) => c.identidad)).size).toBe(1);
    expect(new Set(panel.comparables.map((c) => c.normaId)).size).toBe(2);
  });

  it('ninguna elimina a la otra, y el orden es el de la NKB', () => {
    const i = caso();
    const enNkb = NORMAS.filter((n) => i.tarjetas.some((t) => t.normaId === n.id)).map((n) => n.id);
    expect(i.tarjetas.map((t) => t.normaId)).toEqual(enNkb);
  });

  it('el informe advierte que no elige entre ellas', () => {
    expect(caso().advertencias.join(' ')).toContain('no elige entre ellas');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// INVARIANTES DEL FLUJO REAL
// ════════════════════════════════════════════════════════════════════════════

describe('lo que el flujo real no puede alterar', () => {
  it('el valor observado llega intacto a las dos tarjetas', () => {
    for (const t of caso(46).tarjetas) {
      expect(t.valor).toBe(46);
      expect(t.unidad).toBe('kg');
    }
  });

  it('los valores normativos siguen siendo los de la ficha', () => {
    const t = caso().tarjetas.find((x) => x.tipo === 'TN-1')!;
    const norma = NORMAS.find((n) => n.id === t.normaId)!;
    if (norma.valores.tipo !== 'percentiles') throw new Error('tipo inesperado');
    expect(t.escala!.marcas.map((m) => m.valor)).toEqual(
      norma.valores.percentiles.map((p) => p.valor),
    );
  });

  it('la NKB no se modifica al componer el informe', () => {
    const antes = JSON.stringify(NORMAS.map((n) => n.valores));
    caso();
    caso(1);
    caso(500);
    expect(JSON.stringify(NORMAS.map((n) => n.valores))).toBe(antes);
  });

  it('cambiar el valor no cambia qué normas son comparables', () => {
    const ids = (v: number) => caso(v).tarjetas.map((t) => t.normaId);
    expect(ids(20)).toEqual(ids(46));
    expect(ids(46)).toEqual(ids(60));
  });

  it('el informe es determinista con el caso real', () => {
    expect(JSON.stringify(caso())).toBe(JSON.stringify(caso()));
  });
});
