// ── Catálogo de pruebas registrables (Sprint PAS-7.0) ──────────────────────
// Traslado MANUAL de las 11 pruebas de `docs/performance-knowledge-base/02-pruebas.md`
// a un `CatalogoPruebas` que el PAE pueda consumir, con las correspondencias
// que la matriz autoriza (§09).
//
// ⚠ QUÉ APORTA ESTE ARCHIVO Y QUÉ NO
//
// Las correspondencias, sus referencias y su respaldo vienen de la PKB: aquí
// no se inventa ni una. Lo que la PKB NO publica y este catálogo sí declara es
// la **naturaleza del resultado** de cada prueba —si produce un número, un
// booleano o una categoría— y su unidad. No es una afirmación científica: es
// la escala de medida del instrumento, y sin ella no puede registrarse nada.
// Queda declarado como deuda para que la PKB lo publique en su ficha.
//
// `vigenciaDias: null` en todas: la base no documenta vigencia (PKB §04, V-02).
// El PAE emitirá `vigencia_no_declarada`, que es la conducta correcta.

import type { CapacidadId, CatalogoPruebas, Contribucion, DefinicionPrueba, FamiliaId, NaturalezaResultado } from '@/lib/pas';

export const VERSION_CATALOGO = 'pas-catalogo-1.0.0';

/**
 * Hacia dónde crece el atributo que la prueba mide (PAS-10).
 *
 * NO es un juicio sobre la persona: es una propiedad del instrumento. En una
 * prueba cronometrada, menos tiempo significa más velocidad; en una de carga,
 * más kilos significan más fuerza. Eso lo dice el protocolo, no una opinión.
 *
 * `null` = **NO_DETERMINADO**, y es una respuesta legítima. Hay pruebas donde
 * «más» no significa inequívocamente «más de lo que se busca», y declararlo
 * igualmente sería inventar la semántica que este campo existe para documentar.
 */
export type DireccionMejora = 'mayor_mejor' | 'menor_mejor';

export interface PruebaRegistrable {
  id: string;
  nombre: string;
  familia: FamiliaId;
  naturaleza: NaturalezaResultado;
  /** Unidad sugerida al profesional. Solo para naturaleza continua. */
  unidad: string | null;
  requierePatron: boolean;
  /**
   * Dirección del atributo medido. `null` cuando el protocolo no la sostiene.
   *
   * Sin ella no se calcula progreso hacia un objetivo: la fórmula necesita
   * saber qué lado del recorrido es avance, y suponerlo produciría un
   * porcentaje que puede estar exactamente invertido.
   */
  direccion: DireccionMejora | null;
}

/**
 * Las 11 pruebas documentadas en la PKB, con su escala de medida y su dirección.
 *
 * TRES QUEDAN EN `direccion: null`, y no por descuido:
 *
 *   · **P-06 · Sit-and-reach** — mide distancia alcanzada. Más distancia es más
 *     rango, pero más rango no es inequívocamente mejor: la hipermovilidad
 *     existe y el protocolo no fija un óptimo. Declarar `mayor_mejor` haría que
 *     el sistema celebrara un aumento que puede no serlo.
 *
 *   · **P-08 · Y-Balance** — el valor absoluto informa menos que la asimetría
 *     entre lados, y el catálogo registra un solo número. Sin el par, la
 *     dirección de una pierna aislada no significa lo que parece.
 *
 *   · **P-09 · FMS** — puntuación ordinal compuesta y sin unidad. Sumar o restar
 *     sus puntos no equivale a sumar o restar kilos, y el PAS ya la excluye del
 *     seguimiento continuo por eso mismo.
 *
 * Las ocho restantes sí la declaran, y en todas sale del protocolo: una prueba
 * de carga mide cuánto se levanta, una cronometrada mide cuánto se tarda.
 */
export const PRUEBAS: readonly PruebaRegistrable[] = [
  { id: 'P-01', nombre: '1RM (una repetición máxima)', familia: 'F-A', naturaleza: 'continuo', unidad: 'kg', requierePatron: true, direccion: 'mayor_mejor' },
  { id: 'P-02', nombre: 'Tracción isométrica a media altura del muslo', familia: 'F-A', naturaleza: 'continuo', unidad: 'N', requierePatron: false, direccion: 'mayor_mejor' },
  { id: 'P-03', nombre: 'Dinamometría de agarre', familia: 'F-C', naturaleza: 'continuo', unidad: 'kg', requierePatron: false, direccion: 'mayor_mejor' },
  { id: 'P-04', nombre: 'Salto con contramovimiento', familia: 'F-B', naturaleza: 'continuo', unidad: 'cm', requierePatron: false, direccion: 'mayor_mejor' },
  { id: 'P-05', nombre: 'Drop jump · índice de fuerza reactiva', familia: 'F-B', naturaleza: 'continuo', unidad: 'ratio', requierePatron: false, direccion: 'mayor_mejor' },
  { id: 'P-06', nombre: 'Sit-and-reach', familia: 'F-E', naturaleza: 'continuo', unidad: 'cm', requierePatron: false, direccion: null },
  { id: 'P-07', nombre: 'Course-navette (20 m)', familia: 'F-D', naturaleza: 'continuo', unidad: 'estadios', requierePatron: false, direccion: 'mayor_mejor' },
  { id: 'P-08', nombre: 'Y-Balance Test (cuadrante inferior)', familia: 'F-F', naturaleza: 'continuo', unidad: '% long. pierna', requierePatron: false, direccion: null },
  { id: 'P-09', nombre: 'Functional Movement Screen', familia: 'F-G', naturaleza: 'ordinal', unidad: null, requierePatron: false, direccion: null },
  { id: 'P-10', nombre: 'Test de cambio de dirección', familia: 'F-D', naturaleza: 'continuo', unidad: 's', requierePatron: false, direccion: 'menor_mejor' },
  { id: 'P-11', nombre: 'Esprint lineal', familia: 'F-D', naturaleza: 'continuo', unidad: 's', requierePatron: false, direccion: 'menor_mejor' },
];

/**
 * Las 7 correspondencias autorizadas por la matriz de la PKB (§09).
 *
 * Ni una más. Las 5 insuficientes y las 4 desaconsejadas NO entran: el PAE
 * las rechazaría igualmente, pero incluirlas daría a entender que el catálogo
 * las contempla.
 */
const CORRESPONDENCIAS: Readonly<Record<string, readonly [CapacidadId, string][]>> = {
  'P-01': [['A-01', 'grgic_1rm_2020']],
  'P-02': [['A-01', 'grgic_imtp_2022']],
  'P-03': [['A-05', 'soysal_hgs_2021']],
  'P-05': [['A-04', 'rsi_metaanalisis_2021']],
  'P-06': [['B-02', 'mayorga_sit_reach_2014']],
  'P-07': [['C-01', 'mayorga_20msr_2015']],
  'P-08': [['D-04', 'plisky_ybt_2021']],
};

function contribuciones(pruebaId: string): Contribucion[] {
  return (CORRESPONDENCIAS[pruebaId] ?? []).map(([capacidad, referencia]) => ({
    capacidad,
    // El peso queda sin determinar: la PKB no publica ponderación
    // (PKB-ADR-06). Uniforme no es «sin peso», pero es lo único que el
    // contrato del PAE admite, y el PPRE lo declara en cada informe.
    peso: 1,
    referencia,
  }));
}

function definicion(prueba: PruebaRegistrable): DefinicionPrueba {
  return {
    id: prueba.id,
    familia: prueba.familia,
    naturaleza: prueba.naturaleza,
    vigenciaDias: null,
    condicionesRequeridas: [],
    exigePrecondiciones: false,
    requierePatron: prueba.requierePatron,
    repetible: true,
    contribuciones: contribuciones(prueba.id),
  };
}

export const CATALOGO_PAS: CatalogoPruebas = {
  version: VERSION_CATALOGO,
  pruebas: PRUEBAS.map(definicion),
};

const INDICE = new Map(PRUEBAS.map((p) => [p.id, p]));

export function esPruebaRegistrable(id: string): boolean {
  return INDICE.has(id);
}

export function pruebaRegistrable(id: string): PruebaRegistrable | undefined {
  return INDICE.get(id);
}

export function nombrePrueba(id: string): string {
  return INDICE.get(id)?.nombre ?? id;
}
