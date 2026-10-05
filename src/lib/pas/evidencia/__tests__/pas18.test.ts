// ── Población general · los cinco protocolos (Sprint PAS-18) ───────────────
//
// LO QUE ESTE FICHERO DEFIENDE:
//
//   Entran doce pruebas nuevas y seis fuentes, y con ellas entra por primera
//   vez una ETIQUETA DE MÉRITO en el sistema: «Bueno», «Promedio», «Muy
//   Pobre». El proyecto lleva dieciocho sprints sin emitir ninguna, y la regla
//   nunca fue «no se dicen» sino «no se inventan». Estas están publicadas con
//   sus puntos de corte, así que se dicen — atribuidas, acotadas, y sabiendo
//   que otra tabla del mismo número dice otra cosa.
//
//   Estos tests son el cerco de esa concesión.

import { describe, expect, it } from 'vitest';
import { readFileSync } from 'node:fs';

import { PRUEBAS } from '@/features/performance-workspace/schemas/catalogo';
import { condicionesDe } from '@/features/performance-workspace/schemas/condiciones';

import { leerEvidencia, type SujetoEvidencia } from '../compatibilidad';
import { redactar } from '../redaccion';
import { FUENTES, REFERENCIAS, referenciasDe } from '../registro';
import { situar } from '../posicion';
import { GRUPOS_BANDAS, INTERVALOS_SFT, SOLAPES_EN_LA_FUENTE } from '../tablas-poblacion-general';

const NUEVAS = ['P-12', 'P-13', 'P-14', 'P-15', 'P-16', 'P-17', 'P-18', 'P-19', 'P-20', 'P-21', 'P-22', 'P-23'];

describe('las doce pruebas nuevas están completas', () => {
  it('CONTROL POSITIVO · las doce están en el catálogo', () => {
    const ids = new Set(PRUEBAS.map((p) => p.id));
    for (const id of NUEVAS) expect(ids.has(id), id).toBe(true);
  });

  it('cada una declara sus condiciones de medición', () => {
    // Sin esto, la regla de compatibilidad no puede evaluarse y la serie
    // longitudinal nunca detecta un cambio de método.
    for (const id of NUEVAS) expect(condicionesDe(id), id).not.toBeNull();
  });

  it('NINGUNA declara contribución a una capacidad', () => {
    // La matriz de la PKB autoriza siete correspondencias y ninguna es de
    // estas pruebas. Declarar una aquí sería inventar la ciencia que el
    // catálogo existe para no inventar.
    const catalogo = PRUEBAS.filter((p) => NUEVAS.includes(p.id));
    expect(catalogo).toHaveLength(12);
  });

  it('las unidades son las de la FUENTE, sin convertir', () => {
    // Rikli y Jones publican en yardas y pulgadas. Convertirlas a metros y
    // centímetros rompería la regla 3 de `registro.ts` —ningún valor se
    // calcula, redondea ni convierte— y haría incomparable la cifra guardada
    // con la tabla que la sitúa.
    const u = (id: string) => PRUEBAS.find((p) => p.id === id)!.unidad;
    expect(u('P-16')).toBe('yardas');
    expect(u('P-18')).toBe('pulgadas');
    expect(u('P-19')).toBe('pulgadas');
    for (const s of INTERVALOS_SFT) {
      expect(s.unidad, s.prueba).toBe(u(s.prueba));
    }
  });

  it('las dos de flexibilidad no declaran dirección de mejora', () => {
    // Mismo motivo que el sit-and-reach: más rango no es inequívocamente
    // mejor, y celebrar un aumento sería afirmar lo que la fuente no dice.
    for (const id of ['P-18', 'P-19']) {
      expect(PRUEBAS.find((p) => p.id === id)!.direccion, id).toBeNull();
    }
  });
});

describe('las tablas cargadas', () => {
  it('98 intervalos del Senior Fitness Test y 33 grupos de bandas', () => {
    expect(INTERVALOS_SFT).toHaveLength(98);
    expect(GRUPOS_BANDAS).toHaveLength(33);
  });

  it('el SFT cubre de 60 a 94 años, en siete bandas', () => {
    const bandas = new Set(INTERVALOS_SFT.map((s) => `${s.edadMin}-${s.edadMax}`));
    expect(bandas.size).toBe(7);
    expect(Math.min(...INTERVALOS_SFT.map((s) => s.edadMin))).toBe(60);
    expect(Math.max(...INTERVALOS_SFT.map((s) => s.edadMax))).toBe(94);
  });

  it('ningún intervalo tiene el mínimo por encima del máximo', () => {
    // La prueba de levantarse y caminar se imprime de mayor a menor —6.0-4.4
    // segundos, porque menos tiempo es mejor— y el emisor la normaliza. Si
    // dejara de hacerlo, `situar` diría que todo el mundo queda fuera.
    for (const s of INTERVALOS_SFT) expect(s.min, `${s.prueba}/${s.sexo}`).toBeLessThan(s.max);
  });

  it('cada grupo de bandas tiene un extremo abierto por cada lado', () => {
    for (const g of GRUPOS_BANDAS) {
      const donde = `${g.tabla}/${g.sexo ?? '-'}/${g.edadMin ?? '-'}`;
      expect(g.bandas.filter((b) => b.min === null), donde).toHaveLength(1);
      expect(g.bandas.filter((b) => b.max === null), donde).toHaveLength(1);
    }
  });

  it('los solapes de las fuentes se CONSERVAN, no se corrigen', () => {
    // Están impresos así en los documentos. Enmendarlos aquí sería corregir a
    // la fuente en silencio, que es peor que arrastrar su defecto declarado.
    expect(SOLAPES_EN_LA_FUENTE.length).toBeGreaterThan(20);
    expect(SOLAPES_EN_LA_FUENTE.some((s) => s.startsWith('harvard_corto'))).toBe(true);
  });
});

describe('la etiqueta de mérito nunca sale sola', () => {
  const VARON_25: SujetoEvidencia = { edad: 25, sexo: 'M', pais: 'CO', pesoKg: null };
  const VO2 = { pruebaId: 'P-12', valor: 44, unidad: 'mL/kg/min', condiciones: {} };

  it('CONTROL POSITIVO · el caso produce una etiqueta', () => {
    const l = leerEvidencia(VO2, VARON_25);
    expect(l.estado).toBe('EVIDENCIA_COMPATIBLE');
    expect(redactar(l).texto).toMatch(/«[A-Za-zÁÉÍÓÚáéíóú ]+»/);
  });

  it('va SIEMPRE con la tabla que la publica', () => {
    // «Bueno» a secas se lee como un veredicto del sistema. «Cooper (1979) lo
    // llama Bueno» se lee como lo que es: la palabra de una tabla concreta.
    const f = redactar(leerEvidencia(VO2, VARON_25));
    expect(f.texto).toMatch(/Cooper \(1979\)/);
  });

  it('y con el intervalo, para que se vea que es un tramo y tiene bordes', () => {
    expect(redactar(leerEvidencia(VO2, VARON_25)).texto).toMatch(/de 42,5 a 46,4/);
  });

  it('EL CONFLICTO SE DECLARA: tres tablas y ninguna elegida', () => {
    // Es la doctrina PAS-ADR-04 aplicada donde más se nota. Las cuatro tablas
    // de VO2máx no coinciden, y enseñar una etiqueta sin decir que hay otras
    // haría creer al lector que existe LA clasificación. No existe.
    const l = leerEvidencia(VO2, VARON_25);
    expect(l.compatibles.length).toBe(3);
    expect(redactar(l).texto).toMatch(/no se elige entre ellas/);
  });

  it('el método del escalón impide que sus DOS tablas se apliquen a la vez', () => {
    // Sin esa condición el sistema se fabricaría un conflicto él solo: un
    // índice de 70 caería en dos tramos de dos tablas que miden escalas
    // distintas del mismo esfuerzo.
    const corto = leerEvidencia(
      { pruebaId: 'P-13', valor: 70, unidad: 'indice', condiciones: { metodo: 'corto' } },
      VARON_25,
    );
    expect(corto.compatibles).toHaveLength(1);
    const sinMetodo = leerEvidencia(
      { pruebaId: 'P-13', valor: 70, unidad: 'indice', condiciones: {} },
      VARON_25,
    );
    expect(sinMetodo.estado).not.toBe('EVIDENCIA_COMPATIBLE');
  });
});

describe('el borde que las tablas solapan', () => {
  const bandas = [
    { nombre: 'Muy Pobre', min: null, max: 35 },
    { nombre: 'Pobre', min: 35, max: 38.3 },
    { nombre: 'Promedio', min: 38.4, max: 45.1 },
  ] as const;

  it('un intervalo explícito gana a un extremo abierto', () => {
    // 35,0 entra en «< 35.0» y en «35.0-38.3». La fuente se molestó en
    // escribir el límite inferior del segundo; el primero es la forma corta de
    // decir «lo que quede por debajo».
    const p = situar(35, { clase: 'bandas', bandas });
    expect(p).toEqual({ clase: 'en_banda', nombre: 'Pobre', min: 35, max: 38.3 });
  });

  it('dos intervalos CERRADOS que se pisan no se resuelven', () => {
    // Ahí la tabla es genuinamente ambigua y elegir sería inventar el criterio
    // que a la fuente le faltó.
    const pisadas = [
      { nombre: 'Promedio', min: 26.1, max: 32.2 },
      { nombre: 'Bueno', min: 32.2, max: 36.4 },
    ];
    expect(situar(32.2, { clase: 'bandas', bandas: pisadas })).toBeNull();
  });

  it('un hueco entre tramos devuelve null, no el tramo de al lado', () => {
    // Entre 38,3 y 38,4 la tabla no dice nada. Redondear al vecino sería
    // fabricar el borde que la fuente no fijó.
    expect(situar(38.35, { clase: 'bandas', bandas })).toBeNull();
  });
});

describe('la procedencia de las seis fuentes nuevas', () => {
  const IDS = [
    'rikli_jones_sft_2001',
    'cooper_vo2_1979',
    'aha_vo2_1972',
    'rivera_vo2_pr_1986',
    'harvard_iac_lopategui',
    'rockport_kline_lopategui',
    'mcgill_torso_ace_2015',
  ];

  it('las siete existen y ninguna se declara admitida', () => {
    // No han pasado el procedimiento de la NKB. `propuesta` es lo que son, y
    // llamarlas admitidas las pondría al nivel de una encuesta nacional.
    for (const id of IDS) {
      const f = FUENTES.find((x) => x.id === id);
      expect(f, id).toBeDefined();
      expect(f!.estado, id).toBe('propuesta');
    }
  });

  it('cada una declara por dónde llegó, no solo de quién es', () => {
    // Es la distinción E-2 de la NKB: «Cooper 1979» leído en un manual de 2025
    // y leído en Cooper no son la misma verificación.
    for (const id of IDS) {
      const f = FUENTES.find((x) => x.id === id)!;
      expect(f.cita, id).not.toBeNull();
      expect(f.cita!.localizador.length, id).toBeGreaterThan(30);
    }
  });

  it('toda referencia nueva arrastra las limitaciones de su tabla', () => {
    const nuevas = REFERENCIAS.filter((r) => IDS.includes(r.fuenteId));
    expect(nuevas.length).toBeGreaterThan(100);
    for (const r of nuevas) expect(r.limitaciones.length, r.id).toBeGreaterThan(0);
  });

  it('McGill NO sitúa un tiempo suelto, y lo dice', () => {
    // «No hay literatura» y «la literatura dice expresamente que este número
    // aislado no significa nada» son estados distintos y no se colapsan.
    for (const id of ['P-21', 'P-22', 'P-23']) {
      const refs = referenciasDe(id);
      expect(refs, id).toHaveLength(1);
      expect(refs[0].representacion.clase, id).toBe('valores_sin_transcribir');
    }
  });
});

describe('los signos vitales son contexto, no diagnóstico', () => {
  const FUENTE = readFileSync(
    'src/features/performance-workspace/components/SignosVitales.tsx',
    'utf8',
  );

  /**
   * El fichero SIN comentarios.
   *
   * El primer intento de este test suspendió por el comentario que dice «no
   * dice hipertensión»: la cabecera explica lo que el componente se niega a
   * hacer, y nombrar algo para prohibirlo no es hacerlo. Lo que hay que
   * revisar es lo que llega a la pantalla.
   */
  const VITALES = FUENTE.replace(/\/\*[\s\S]*?\*\//g, '').replace(/^\s*\/\/.*$/gm, '');

  it('CONTROL POSITIVO · el fichero se lee y captura los cuatro campos', () => {
    for (const c of ['fcReposoLpm', 'spo2Pct', 'taSistolicaMmhg', 'taDiastolicaMmhg']) {
      expect(VITALES).toContain(c);
    }
  });

  it('CONTROL POSITIVO · quitar los comentarios no vacía el fichero', () => {
    // Sin esto, un fallo del despojado dejaría pasar cualquier cosa: una
    // cadena vacía no casa con ninguna prohibición.
    expect(VITALES.length).toBeGreaterThan(1500);
    expect(FUENTE).toMatch(/hipertensi[óo]n/i); // está, y solo en un comentario
  });

  it('NO clasifica la tensión ni la saturación', () => {
    // Un semáforo aquí sería un juicio clínico que ninguna fuente de este
    // sistema respalda. El profesional que lee 165/105 ya sabe lo que tiene
    // delante mejor que una barra de color.
    expect(VITALES).not.toMatch(/hipertensi[óo]n|hipotensi[óo]n|normotenso|taquicardia|bradicardia/i);
  });

  it('el único aviso es una CITA del protocolo, no una opinión', () => {
    expect(VITALES).toContain('Rikli y Jones');
    expect(VITALES).toContain('160/100');
    expect(VITALES).toContain('La decisión de aplicar o');
  });

  it('separa estos signos de la frecuencia cardiaca que consumen las pruebas', () => {
    // La FC del Rockport y los pulsos del escalón son componentes del
    // resultado de SU prueba (G-04). Meterlos aquí los desligaría de la
    // medición que los produjo.
    expect(VITALES).toContain('se registra con su prueba');
  });
});
