// ── Catálogo de plantillas (Sprint PAS-4.0) ────────────────────────────────
// 26 plantillas deterministas. El texto emitido sale SIEMPRE de aquí: no hay
// una sola frase construida en tiempo de ejecución.
//
// Cada plantilla declara sus huecos. `render.ts` falla si falta alguno, en vez
// de emitir una frase con un `{hueco}` a la vista.
//
// Todas describen. Ninguna califica, prescribe ni predice.

export interface Plantilla {
  id: string;
  /** Huecos obligatorios, en el orden en que aparecen. */
  huecos: readonly string[];
  texto: string;
}

function p(id: string, huecos: readonly string[], texto: string): Plantilla {
  return { id, huecos, texto };
}

export const PLANTILLAS: readonly Plantilla[] = [
  // ── Estado de una capacidad ──────────────────────────────────────────────
  p('CAP_CARACTERIZADA', ['capacidad', 'nivel', 'pruebas'],
    'Existe evidencia de nivel {nivel} para caracterizar {capacidad} a partir de {pruebas}.'),

  p('CAP_ALCANCE', ['capacidad', 'alcance'],
    'La caracterización de {capacidad} se limita a {alcance}.'),

  p('CAP_COBERTURA_PARCIAL', ['capacidad'],
    'Las pruebas disponibles cubren {capacidad} solo en parte, según la cobertura declarada en el catálogo.'),

  p('CAP_NO_VIGENTE', ['capacidad', 'fecha'],
    'Los registros disponibles para {capacidad} han dejado de ser elegibles. El último elegible es de {fecha}.'),

  p('CAP_CONFLICTO', ['capacidad', 'registros'],
    'Los registros disponibles para {capacidad} no son conciliables entre sí: {registros}. No se resuelven.'),

  p('CAP_SIN_EVIDENCIA', ['capacidad'],
    'No existe evidencia registrada para caracterizar {capacidad}.'),

  p('CAP_EVIDENCIA_NO_ELEGIBLE', ['capacidad', 'motivos'],
    'Existen registros asociados a {capacidad}, pero ninguno participa en el estado vigente: {motivos}.'),

  p('CAP_RESERVADA', ['capacidad'],
    '{capacidad} permanece fuera del alcance de esta versión y no admite caracterización.'),

  p('CAP_SIN_CORRESPONDENCIA', ['capacidad'],
    'Ninguna prueba del catálogo declara correspondencia respaldada con {capacidad}.'),

  // ── Evidencia y población ────────────────────────────────────────────────
  p('EVIDENCIA_NIVEL_BAJO', ['capacidad', 'nivel'],
    'La correspondencia que sostiene {capacidad} tiene nivel de evidencia {nivel}.'),

  p('EVIDENCIA_POBLACION', ['capacidad', 'poblaciones'],
    'La evidencia disponible para {capacidad} procede de: {poblaciones}. Fuera de esas poblaciones no es aplicable.'),

  p('EVIDENCIA_CONSTRUCTO', ['capacidad'],
    'La correspondencia de {capacidad} se apoya en reproducibilidad de la medida; su validez de constructo no consta verificada.'),

  p('EVIDENCIA_INSUFICIENTE_PKB', ['capacidad'],
    'La base de conocimiento declara evidencia insuficiente para {capacidad}.'),

  p('EVIDENCIA_NO_RECOMENDADA', ['capacidad', 'prueba'],
    'La base de conocimiento desaconseja usar {prueba} para caracterizar {capacidad}.'),

  // ── Dominio ──────────────────────────────────────────────────────────────
  p('DOMINIO_CARACTERIZADO', ['dominio', 'caracterizadas', 'totales'],
    'En el dominio {dominio} se caracterizan {caracterizadas} de {totales} capacidades.'),

  p('DOMINIO_SIN_EVIDENCIA', ['dominio'],
    'El dominio {dominio} permanece sin ninguna capacidad caracterizada.'),

  // ── Cobertura ────────────────────────────────────────────────────────────
  p('COBERTURA_PERFIL', ['caracterizadas', 'activas', 'desconocidas'],
    'El Perfil Funcional caracteriza {caracterizadas} de {activas} capacidades activas; {desconocidas} permanecen desconocidas.'),

  p('COBERTURA_INCOMPLETA', ['motivo'],
    'La cobertura funcional permanece incompleta porque {motivo}.'),

  p('COBERTURA_SIN_CORRESPONDENCIAS', [],
    'El catálogo no declara ninguna correspondencia respaldada, de modo que ninguna capacidad puede caracterizarse.'),

  // ── Consistencia ─────────────────────────────────────────────────────────
  p('CONSISTENCIA_COMPLETA', [],
    'La consistencia del perfil es completa: todas las capacidades activas están caracterizadas y no hay contradicciones.'),

  p('CONSISTENCIA_PARCIAL', ['caracterizadas', 'activas'],
    'La consistencia del perfil es parcial: {caracterizadas} de {activas} capacidades activas están caracterizadas.'),

  p('CONSISTENCIA_INCONSISTENTE', ['conflictos'],
    'La consistencia del perfil es inconsistente: se registran {conflictos} contradicciones en los datos.'),

  p('CONSISTENCIA_SIN_DATOS', [],
    'La consistencia del perfil no puede establecerse: no hay registros elegibles.'),

  // ── Metodología ──────────────────────────────────────────────────────────
  p('METODO_SENSIBILIDAD', ['capacidades'],
    'La sensibilidad al cambio no consta documentada para: {capacidades}. No puede afirmarse que un valor haya variado.'),

  p('METODO_VIGENCIA', ['pruebas'],
    'La vigencia no consta documentada para: {pruebas}. La caducidad de esos registros no puede establecerse.'),

  p('METODO_PESOS', [],
    'Las correspondencias aplicadas no declaran peso relativo, de modo que ninguna aporta más que otra a su capacidad.'),

  // ── Datos ────────────────────────────────────────────────────────────────
  p('DATO_ANULADOS', ['registros'],
    'El histórico contiene registros anulados: {registros}. Dejan de participar, no dejan de existir.'),

  p('DATO_LIMITE_INTERPRETACION', [],
    'La interpretación se limita a describir qué evidencia existe y cuál falta. No se emite ningún juicio sobre el atleta.'),
] as const;

const INDICE = new Map(PLANTILLAS.map((plantilla) => [plantilla.id, plantilla]));

export function plantilla(id: string): Plantilla {
  const encontrada = INDICE.get(id);
  if (!encontrada) throw new Error(`PIE: plantilla desconocida: ${id}`);
  return encontrada;
}

export const TOTAL_PLANTILLAS = PLANTILLAS.length;
