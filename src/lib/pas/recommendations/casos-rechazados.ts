// ── Casos rechazados (Sprint PAS-6.0) ──────────────────────────────────────
// Lo que el PPRE JAMÁS producirá. Se declaran en código —y no solo en la
// documentación— para que una prueba compruebe que ninguno aparece en la
// salida. Un catálogo de prohibiciones que solo vive en un README no impide
// nada.
//
// Mismo patrón que `CASOS_RECHAZADOS` del COG y del PIE.

export interface CasoRechazado {
  id: string;
  /** El texto que no se emitirá, tal como se formularía. */
  ejemplo: string;
  motivo: string;
  /** Límite del PAS o módulo de la PKB que lo prohíbe. */
  fundamento: string;
  /** Ficha o sección de la base asociada, cuando existe. */
  pkb: string | null;
}

/**
 * Los ejemplos se escriben **tal como se formularían de verdad**, con el
 * vocabulario prohibido incluido. Es su función: sirven de referencia de qué
 * NO puede emitirse, y suavizarlos los volvería inútiles.
 *
 * No contaminan la salida porque este catálogo no forma parte del
 * `PerformanceRecommendationReport`: la guarda léxica audita el informe, no
 * la lista de prohibiciones.
 */
export const CASOS_RECHAZADOS: readonly CasoRechazado[] = [
  { id: 'PPRE-CR-01', ejemplo: 'Debe entrenar más fuerza.', motivo: 'Prescribe contenido de entrenamiento.', fundamento: 'PAS L-01 e I-12.', pkb: 'PKB §08 grupo 4' },
  { id: 'PPRE-CR-02', ejemplo: 'Conviene mejorar la potencia.', motivo: 'Fija un objetivo de mejora sobre una capacidad.', fundamento: 'PAS L-01: el sistema no conoce el objetivo.', pkb: 'PKB §08 grupo 4' },
  { id: 'PPRE-CR-03', ejemplo: 'Trabajar la velocidad dos días por semana.', motivo: 'Prescribe cualidad y frecuencia.', fundamento: 'PAS L-01.', pkb: 'PKB §08 grupo 4' },
  { id: 'PPRE-CR-04', ejemplo: 'Aumentar la movilidad de cadera.', motivo: 'Prescribe una dirección de cambio.', fundamento: 'PAS L-01 y L-05.', pkb: 'PKB §08 grupo 4' },
  { id: 'PPRE-CR-05', ejemplo: 'Reducir el riesgo de lesión.', motivo: 'Afirmación clínica y predictiva.', fundamento: 'PAS L-03 y L-05.', pkb: 'PKB §08 grupo 1' },
  { id: 'PPRE-CR-06', ejemplo: 'Corregir la técnica de sentadilla.', motivo: 'Prescribe intervención técnica sobre un ejercicio.', fundamento: 'PAS L-01. Corresponde al Training System.', pkb: 'PKB §01 E-01' },
  { id: 'PPRE-CR-07', ejemplo: 'Programar 4 series de 8 repeticiones.', motivo: 'Programación deportiva.', fundamento: 'PAS L-01.', pkb: null },
  { id: 'PPRE-CR-08', ejemplo: 'Enviar al fisioterapeuta para tratamiento.', motivo: 'Derivación asistencial.', fundamento: 'PAS L-03: fuera del ecosistema.', pkb: 'PKB §08 grupo 1' },
  { id: 'PPRE-CR-09', ejemplo: 'Entrenar equilibrio en la próxima rutina.', motivo: 'Prescribe contenido.', fundamento: 'PAS L-01.', pkb: 'PKB §08 grupo 4' },
  { id: 'PPRE-CR-10', ejemplo: 'Aumentar el VO₂ máximo con trabajo interválico.', motivo: 'Fija un objetivo fisiológico y su método.', fundamento: 'PAS L-01 y L-05.', pkb: 'PKB §02 P-07' },
  { id: 'PPRE-CR-11', ejemplo: 'Cambiar la rutina semanal.', motivo: 'Decide programación.', fundamento: 'PAS L-01.', pkb: null },
  { id: 'PPRE-CR-12', ejemplo: 'Descansar una semana antes de repetir.', motivo: 'Decide recuperación.', fundamento: 'PAS L-01. Corresponde al Recovery Engine.', pkb: null },
  { id: 'PPRE-CR-13', ejemplo: 'Modificar la carga, el volumen y la intensidad.', motivo: 'Prescribe dosificación.', fundamento: 'PAS L-01.', pkb: null },
  { id: 'PPRE-CR-14', ejemplo: 'Este perfil es mejor que el de otros deportistas.', motivo: 'Compara con otras personas.', fundamento: 'PAS L-04 e I-13.', pkb: 'PKB §08 grupo 3' },
  { id: 'PPRE-CR-15', ejemplo: 'Perfil situado en el percentil 75 del ranking.', motivo: 'Emite ranking.', fundamento: 'PAS L-04.', pkb: 'PKB §08 grupo 3' },
  { id: 'PPRE-CR-16', ejemplo: 'Puntuación funcional global: 72 sobre 100.', motivo: 'Emite puntuación.', fundamento: 'PAS-ADR-03: entidad descartada.', pkb: 'PKB §09' },
  { id: 'PPRE-CR-17', ejemplo: 'El perfil ha mejorado respecto al anterior.', motivo: 'Afirma cambio sin cambio mínimo detectable.', fundamento: 'PKB §06: ninguna fuente aporta MDC ni SEM.', pkb: 'PKB §06 V-01' },
  { id: 'PPRE-CR-18', ejemplo: 'Debería repetirse la valoración en ocho semanas.', motivo: 'Fija periodicidad.', fundamento: 'PAS §07: ninguna fuente la documenta.', pkb: 'PKB §04 V-02' },
];

export const TOTAL_CASOS_RECHAZADOS = CASOS_RECHAZADOS.length;

/**
 * Ámbitos sobre los que este motor NO puede pronunciarse, con su motivo. Se
 * devuelven junto a las recomendaciones: el silencio se explica, no se deja
 * en blanco.
 */
export const LIMITACIONES_DE_ALCANCE: readonly {
  id: string;
  ambito: string;
  motivo: string;
}[] = [
  {
    id: 'PPRE-LIM-01',
    ambito: 'Contenido de la sesión',
    motivo: 'El PAS no decide contenido (L-01). Corresponde al futuro Training System.',
  },
  {
    id: 'PPRE-LIM-02',
    ambito: 'Dosificación y progresión',
    motivo: 'Fuera del alcance del sistema de valoración.',
  },
  {
    id: 'PPRE-LIM-03',
    ambito: 'Estado de salud y derivación asistencial',
    motivo: 'El PAS no clasifica clínicamente (L-03).',
  },
  {
    id: 'PPRE-LIM-04',
    ambito: 'Comparación con otras personas',
    motivo: 'La unidad de análisis es el sujeto consigo mismo (L-04).',
  },
  {
    id: 'PPRE-LIM-05',
    ambito: 'Evolución entre valoraciones',
    motivo: 'Sin cambio mínimo detectable documentado, no puede afirmarse variación (PKB §06).',
  },
  {
    id: 'PPRE-LIM-06',
    ambito: 'Periodicidad de la valoración',
    motivo: 'Ninguna fuente del ecosistema documenta cada cuánto repetirla.',
  },
];
