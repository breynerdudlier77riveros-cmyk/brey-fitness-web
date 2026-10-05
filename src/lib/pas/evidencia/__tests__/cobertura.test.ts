// ── Cobertura científica del catálogo (Sprint PAS-11) ──────────────────────
//
// LO QUE ESTOS TESTS PROTEGEN:
//
//   Que la referencia canadiense recién incorporada haga exactamente lo que
//   debe: situar el resultado, y decir SIEMPRE de qué población es la norma
//   cuando no es la del atleta.
//
// ── ESTE FICHERO DEFENDÍA LO CONTRARIO (PAS-13) ────────────────────────────
//
//   Hasta este sprint el país descartaba la norma: un colombiano no se
//   comparaba con la tabla canadiense y se quedaba sin escala. La razón era
//   buena —no inventar una equivalencia poblacional que nadie ha publicado—
//   pero el resultado era peor que el problema: tirar la única referencia
//   publicada que existe para una prueba estandarizada, medida con el mismo
//   protocolo, sobre los mismos seres humanos.
//
//   La decisión que ahora se blinda no es más laxa, es más exigente: **situar
//   sí, pero nombrando la población de origen**. Un percentil presentado a
//   secas se lee como propio. Y el test que lo protege no es que la frase diga
//   «Canadá» —eso pasaría aunque lo dijera siempre— sino que NO lo diga cuando
//   el atleta sí es canadiense.

import { describe, expect, it } from 'vitest';

import { PRUEBAS } from '@/features/performance-workspace/schemas/catalogo';

import { leerEvidencia, type SujetoEvidencia } from '../compatibilidad';
import { redactar } from '../redaccion';
import { FUENTES, REFERENCIAS } from '../registro';

const COLOMBIANO: SujetoEvidencia = { edad: 22, sexo: 'M', pais: 'CO', pesoKg: null };
const CANADIENSE: SujetoEvidencia = { edad: 22, sexo: 'M', pais: 'CA', pesoKg: null };
const CANADIENSE_F: SujetoEvidencia = { edad: 22, sexo: 'F', pais: 'CA', pesoKg: null };

const SALTO = { pruebaId: 'P-04', valor: 44, unidad: 'cm', condiciones: { brazos: 'libres' } };
const FLEX = { pruebaId: 'P-06', valor: 26, unidad: 'cm', condiciones: { version: 'clasico' } };

// ════════════════════════════════════════════════════════════════════════════
// LA REFERENCIA NUEVA SITÚA A QUIEN LE CORRESPONDE
// ════════════════════════════════════════════════════════════════════════════

describe('la norma poblacional canadiense sitúa a un adulto canadiense', () => {
  it('el salto cae entre dos percentiles publicados', () => {
    const l = leerEvidencia(SALTO, CANADIENSE);
    expect(l.estado).toBe('EVIDENCIA_COMPATIBLE');
    const p = l.compatibles[0].posicion!;
    // 44 cm queda entre P30 (44,3 no: 44 < 44,3) → entre P20 (41,2) y P30 (44,3).
    expect(p.clase).toBe('entre_percentiles');
    if (p.clase !== 'entre_percentiles') throw new Error('clase inesperada');
    expect(p.inferior).toBe(20);
    expect(p.superior).toBe(30);
  });

  it('y la frase lo dice sin clasificar', () => {
    const f = redactar(leerEvidencia(SALTO, CANADIENSE));
    expect(f.texto).toMatch(/entre el percentil 20 y el 30/);
    expect(f.texto).not.toMatch(/(?<![-\w])(bueno|malo|alto|bajo|normal)(?![-\w])/i);
  });

  it('el sit-and-reach también, y con la banda de edad correcta', () => {
    const l = leerEvidencia(FLEX, CANADIENSE);
    expect(l.estado).toBe('EVIDENCIA_COMPATIBLE');
    expect(l.compatibles[0].referencia.ambito.edadMin).toBe(20);
    expect(l.compatibles[0].referencia.ambito.edadMax).toBe(24);
  });

  it('la referencia de mujeres NO se aplica a un varón, y viceversa', () => {
    expect(
      leerEvidencia(SALTO, CANADIENSE).compatibles.every((c) => c.referencia.ambito.sexo === 'M'),
    ).toBe(true);
    expect(
      leerEvidencia(SALTO, CANADIENSE_F).compatibles.every((c) => c.referencia.ambito.sexo === 'F'),
    ).toBe(true);
  });

  it('una mujer de 22 se sitúa en su propia tabla', () => {
    const l = leerEvidencia({ ...SALTO, valor: 32 }, CANADIENSE_F);
    expect(l.estado).toBe('EVIDENCIA_COMPATIBLE');
    // 32 cm queda entre P50 (31,8) y P60 (33,3) de la tabla femenina.
    const p = l.compatibles[0].posicion!;
    if (p.clase !== 'entre_percentiles') throw new Error('clase inesperada');
    expect(p.inferior).toBe(50);
  });

  it('nunca se estima un percentil que la fuente no publica', () => {
    // La tabla salta de P30 a P40: entre medias no hay P35.
    const l = leerEvidencia({ ...SALTO, valor: 46 }, CANADIENSE);
    const p = l.compatibles[0].posicion!;
    if (p.clase !== 'entre_percentiles') throw new Error('clase inesperada');
    expect([p.inferior, p.superior]).toEqual([30, 40]);
    expect(JSON.stringify(p)).not.toContain('35');
  });
});

// ════════════════════════════════════════════════════════════════════════════
// Y CON QUIEN NO PERTENECE A ESA POBLACIÓN, LO DICE
// ════════════════════════════════════════════════════════════════════════════

describe('el país deja de bloquear, pero nunca deja de nombrarse', () => {
  it('un atleta colombiano SÍ se sitúa en la norma canadiense', () => {
    const l = leerEvidencia(SALTO, COLOMBIANO);
    expect(l.estado).toBe('EVIDENCIA_COMPATIBLE');
    expect(l.compatibles.length).toBeGreaterThan(0);
    expect(l.compatibles[0].posicion).not.toBeNull();
  });

  it('y la lectura marca que la población de origen no es la suya', () => {
    expect(leerEvidencia(SALTO, COLOMBIANO).compatibles[0].poblacionAjena).toBe(true);
    expect(leerEvidencia(SALTO, CANADIENSE).compatibles[0].poblacionAjena).toBe(false);
  });

  it('la frase nombra el país, en español y sin código de catálogo', () => {
    const f = redactar(leerEvidencia(SALTO, COLOMBIANO));
    expect(f.texto).toMatch(/entre el percentil 20 y el 30/);
    expect(f.texto).toMatch(/de Canadá, no de tu país/);
    // «CA» es un código ISO, no una palabra. Al atleta se le habla en español.
    expect(f.texto).not.toMatch(/(?<![-\w])CA(?![-\w])/);
  });

  it('CONTROL POSITIVO · a un canadiense NO se le advierte de su propia norma', () => {
    // Sin esto, el test anterior pasaría aunque la advertencia se imprimiera
    // siempre, y una advertencia que sale siempre no advierte de nada.
    expect(redactar(leerEvidencia(SALTO, CANADIENSE)).texto).not.toMatch(/no de tu país/);
  });

  it('situar en otra población no autoriza a clasificar', () => {
    const f = redactar(leerEvidencia(SALTO, COLOMBIANO));
    expect(f.texto).not.toMatch(/(?<![-\w])(bueno|malo|alto|bajo|normal|excelente)(?![-\w])/i);
  });

  it('lo que el país NO arrastra: el sexo y la edad siguen descartando', () => {
    // Abrir la puerta al país no la abre a todo lo demás. La tabla de mujeres
    // sigue constando como descartada para un varón, con su motivo.
    const l = leerEvidencia(SALTO, COLOMBIANO);
    expect(l.descartadas.some((d) => d.referencia.fuenteId === 'hoffmann_chms_2019')).toBe(true);
    expect(l.compatibles.every((c) => c.referencia.ambito.sexo === 'M')).toBe(true);
  });

  it('la edad fuera de banda también descarta, con su motivo', () => {
    // La fuente publica de 8 a 69 años. A los 75 NO hay banda, y NO se
    // extrapola desde la de 65-69: una norma se aplica donde se midió.
    //
    // Este test miraba a un adulto de 45 hasta el Sprint PAS-17, cuando solo
    // estaban transcritas las bandas 20-24 y 25-29. Ya no: 45 tiene su banda
    // (ver más abajo), así que el invariante se comprueba donde sigue siendo
    // cierto, que es fuera del rango PUBLICADO y no fuera del transcrito.
    const mayor: SujetoEvidencia = { edad: 75, sexo: 'M', pais: 'CA', pesoKg: null };
    const l = leerEvidencia(SALTO, mayor);
    expect(l.compatibles).toEqual([]);
    expect(l.descartadas.some((d) => /rango de edad/.test(d.motivo))).toBe(true);
  });

  it('el protocolo distinto descarta: brazos en la cadera no es la prueba publicada', () => {
    const l = leerEvidencia(
      { ...SALTO, condiciones: { brazos: 'en_cadera' } },
      CANADIENSE,
    );
    expect(l.compatibles).toEqual([]);
    expect(l.descartadas.some((d) => d.motivo.includes('protocolos distintos'))).toBe(true);
  });

  it('sin declarar el protocolo no se compara a ciegas', () => {
    const l = leerEvidencia({ ...SALTO, condiciones: {} }, CANADIENSE);
    expect(l.estado).toBe('NO_COMPARABLE');
    expect(l.compatibles).toEqual([]);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// TRAZABILIDAD DE LA FUENTE (§10)
// ════════════════════════════════════════════════════════════════════════════

describe('la fuente nueva es rastreable', () => {
  const chms = FUENTES.find((f) => f.id === 'hoffmann_chms_2019')!;

  it('está registrada y verificada', () => {
    expect(chms).toBeDefined();
    expect(chms.estado).toBe('propuesta');
    expect(chms.cita!.localizador).toMatch(/doi:|PMID/);
  });

  it('declara su población con el tamaño muestral', () => {
    expect(chms.poblacion).toMatch(/5188/);
    expect(chms.poblacion).toMatch(/Canadian Health Measures Survey/);
  });

  it('declara qué NO sostiene, incluida la advertencia de los autores', () => {
    expect(chms.noSostiene).toMatch(/fuera de Canadá/);
    expect(chms.noSostiene).toMatch(/no equivale a un punto de corte/);
  });

  it('cada referencia suya transporta la calibración o el protocolo', () => {
    const suyas = REFERENCIAS.filter((r) => r.fuenteId === 'hoffmann_chms_2019');
    expect(suyas.length).toBeGreaterThanOrEqual(8);
    for (const r of suyas) {
      expect(r.limitaciones.join(' '), r.id).toMatch(/CANADÁ/);
      expect(Object.keys(r.ambito.protocolo).length, r.id).toBeGreaterThan(0);
    }
  });

  it('la calibración del cero viaja con el sit-and-reach', () => {
    // Hallazgo de este sprint: un alcance de 24 cm es casi tocar los dedos en
    // un cajón calibrado a 26 y un estiramiento enorme en uno calibrado a 0.
    const sr = REFERENCIAS.find((r) => r.id === 'P-06/chms/m-20-24')!;
    expect(sr.limitaciones.join(' ')).toMatch(/tocar los dedos equivale a 26 cm/);
  });

  it('declara cuántas bandas se transcribieron de cuántas', () => {
    // Hasta PAS-17 esto decía «Solo se han transcrito las bandas de 20 a 29
    // años», que era la deuda declarada honestamente. La deuda está pagada y
    // la frase cambia: lo que no puede es desaparecer, porque el lector tiene
    // que saber si mira la fuente entera o un recorte de ella.
    const suyas = REFERENCIAS.filter((r) => r.fuenteId === 'hoffmann_chms_2019');
    for (const r of suyas) {
      expect(r.limitaciones.join(' '), r.id).toMatch(/Se han transcrito las \d+ bandas/);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LAS 66 NORMAS CANADIENSES (Sprint PAS-17)
// ════════════════════════════════════════════════════════════════════════════
//
// EL FALLO QUE ESTOS TESTS EXISTEN PARA IMPEDIR:
//
//   Las fichas `CMJ-CA-TN1-percentiles.md` y `SAR-CA-TN1-percentiles.md`
//   llevaban desde PAS-12 con sus 32 y 34 normas transcritas y verificadas. De
//   las 66, llegaban OCHO al motor: varones y mujeres de 20 a 24 y de 25 a 29,
//   tecleadas a mano. Las otras 58 estaban en el repositorio sin situar a
//   nadie, y un niño de 12 o una mujer de 60 salían sin posición en dos de las
//   cinco pruebas que la tienen.
//
//   Es la diferencia entre vender valoraciones a un club —que mide menores— o
//   a una EPS —que mide adultos y mayores— y no poder situar a ninguno.

describe('la cobertura por edad del CHMS', () => {
  const chms = REFERENCIAS.filter((r) => r.fuenteId === 'hoffmann_chms_2019');

  it('CONTROL POSITIVO · son 66 y no 8', () => {
    expect(chms.filter((r) => r.pruebaId === 'P-04')).toHaveLength(32);
    expect(chms.filter((r) => r.pruebaId === 'P-06')).toHaveLength(34);
  });

  it('el salto cubre de 8 a 69 años y el sit-and-reach de 6 a 69', () => {
    // Los dos rangos NO coinciden, y la ficha del salto lo advierte
    // expresamente: el salto se midió desde los 8 y el sit-and-reach desde los
    // 6. Darlos por equivalentes inventaría dos bandas infantiles.
    const rango = (id: string) => {
      const suyas = chms.filter((r) => r.pruebaId === id);
      return [
        Math.min(...suyas.map((r) => r.ambito.edadMin!)),
        Math.max(...suyas.map((r) => r.ambito.edadMax!)),
      ];
    };
    expect(rango('P-04')).toEqual([8, 69]);
    expect(rango('P-06')).toEqual([6, 69]);
  });

  it('un adulto de 45 y un menor de 12 SÍ se sitúan', () => {
    for (const edad of [12, 45, 62]) {
      const s: SujetoEvidencia = { edad, sexo: 'M', pais: 'CA', pesoKg: null };
      expect(leerEvidencia(SALTO, s).estado, `salto a los ${edad}`).toBe('EVIDENCIA_COMPATIBLE');
      expect(leerEvidencia(FLEX, s).estado, `flexión a los ${edad}`).toBe('EVIDENCIA_COMPATIBLE');
    }
  });

  it('y un colombiano de 45 también, con su población nombrada', () => {
    // Es el caso real del negocio: el atleta no es canadiense. La norma se
    // aplica —PAS-13— y la frase tiene que decir de dónde es.
    const s: SujetoEvidencia = { edad: 45, sexo: 'M', pais: 'CO', pesoKg: null };
    const f = redactar(leerEvidencia(SALTO, s));
    expect(f.texto).toMatch(/Canad/);
    expect(f.texto).not.toMatch(/(?<![-\w])(bueno|malo|alto|bajo|normal)(?![-\w])/i);
  });

  it('cada banda cae en UNA sola referencia por sexo: no se solapan', () => {
    // Dos bandas que se pisen darían dos posiciones distintas del mismo valor,
    // y el informe tendría que elegir una — que es justo lo que no hace.
    for (const id of ['P-04', 'P-06']) {
      for (const sexo of ['M', 'F']) {
        const suyas = chms
          .filter((r) => r.pruebaId === id && r.ambito.sexo === sexo)
          .sort((a, b) => a.ambito.edadMin! - b.ambito.edadMin!);
        for (let i = 1; i < suyas.length; i++) {
          expect(
            suyas[i].ambito.edadMin!,
            `${id}/${sexo}: ${suyas[i - 1].id} y ${suyas[i].id}`,
          ).toBeGreaterThan(suyas[i - 1].ambito.edadMax!);
        }
      }
    }
  });

  it('las dos celdas perdidas salen con diez percentiles y lo dicen', () => {
    // `CMJ-CA-F-60_64/P95` y `SAR-CA-F-50_54/P95` se perdieron en la
    // extracción del PDF. Las fichas prohíben reconstruirlos. Una banda de
    // diez percentiles que lo declara es honesta; una de once con un número
    // estimado sería una invención con aspecto de dato.
    const huecos = chms.filter(
      (r) => r.representacion.clase === 'percentiles' && r.representacion.puntos.length !== 11,
    );
    expect(huecos.map((r) => r.id).sort()).toEqual(['P-04/chms/f-60-64', 'P-06/chms/f-50-54']);
    for (const r of huecos) {
      expect(r.limitaciones.join(' '), r.id).toMatch(/prohíbe estimarla/);
    }
  });

  it('y las otras 64 NO llevan ese aviso', () => {
    // CONTROL POSITIVO del test anterior: si el aviso saliera en todas, no
    // avisaría de nada.
    const completas = chms.filter(
      (r) => r.representacion.clase === 'percentiles' && r.representacion.puntos.length === 11,
    );
    expect(completas).toHaveLength(64);
    for (const r of completas) {
      expect(r.limitaciones.join(' '), r.id).not.toMatch(/prohíbe estimarla/);
    }
  });

  it('ninguna banda tiene percentiles que bajen', () => {
    // El fichero generado ya lo verifica, pero el generador no se ejecuta en
    // CI: si alguien edita `percentiles-chms.ts` a mano —que el encabezado
    // prohíbe— esto lo dice.
    for (const r of chms) {
      if (r.representacion.clase !== 'percentiles') continue;
      const p = r.representacion.puntos;
      for (let i = 1; i < p.length; i++) {
        expect(p[i].valor, `${r.id} P${p[i].p} < P${p[i - 1].p}`).toBeGreaterThanOrEqual(
          p[i - 1].valor,
        );
      }
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// ESTADO DE COBERTURA DE LAS ONCE (§13)
// ════════════════════════════════════════════════════════════════════════════

describe('las once pruebas tienen una respuesta explícita', () => {
  it('ninguna lanza y ninguna queda sin estado', () => {
    for (const p of PRUEBAS) {
      for (const sujeto of [COLOMBIANO, CANADIENSE]) {
        const l = leerEvidencia(
          { pruebaId: p.id, valor: 10, unidad: p.unidad ?? '—', condiciones: {} },
          sujeto,
        );
        expect(l.estado, `${p.id}/${sujeto.pais}`).toBeTruthy();
        expect(redactar(l).texto.length, p.id).toBeGreaterThan(30);
      }
    }
  });

  it('«sin evidencia utilizable» es excepcional, no la respuesta por defecto', () => {
    const estados = PRUEBAS.map(
      (p) =>
        leerEvidencia(
          { pruebaId: p.id, valor: 10, unidad: p.unidad ?? '—', condiciones: {} },
          CANADIENSE,
        ).estado,
    );
    const sinEvidencia = estados.filter((e) => e === 'SIN_EVIDENCIA_UTILIZABLE').length;
    // Con once pruebas, la mayoría debe tener algo que decir.
    expect(sinEvidencia).toBeLessThan(PRUEBAS.length / 2);
  });

  it('el registro no contiene ninguna fuente sin verificar activa', () => {
    const sinVerificar = new Set(
      FUENTES.filter((f) => f.estado === 'sin_verificar').map((f) => f.id),
    );
    // Pueden estar registradas —para poder decir «existe literatura»— pero
    // ninguna puede tener una referencia normativa colgando.
    for (const r of REFERENCIAS) {
      if (sinVerificar.has(r.fuenteId)) {
        expect(r.tipo, r.id).not.toBe('NORMATIVA');
      }
    }
  });
});
