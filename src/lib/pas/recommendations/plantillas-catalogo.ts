// ── Catálogo de plantillas del PPRE (Sprint PAS-6.0) ───────────────────────
// Las 20 plantillas, separadas del acceso por tamaño. Todo el texto emitido
// sale de aquí; ninguna frase se construye en tiempo de ejecución.
//
// Las capacidades se nombran por CÓDIGO, nunca por su nombre: varios nombres
// del catálogo del PAS son término prohibido en este motor. Ver
// `vocabulario.ts`.

export interface Plantilla {
  id: string;
  huecos: readonly string[];
  titulo: string;
  descripcion: string;
  accion: string;
  seguimiento: string | null;
}

function p(
  id: string,
  huecos: readonly string[],
  titulo: string,
  descripcion: string,
  accion: string,
  seguimiento: string | null = null
): Plantilla {
  return { id, huecos, titulo, descripcion, accion, seguimiento };
}

export const PLANTILLAS: readonly Plantilla[] = [
  p('SIN_EVIDENCIA', ['capacidades'],
    'Capacidades sin evidencia registrada',
    'El perfil no contiene registros elegibles para {capacidades}.',
    'Documentar si esas capacidades entran en el alcance de la valoración.',
    'Revisar la cobertura en la siguiente sesión de valoración.'),

  p('RESERVADA', ['capacidades'],
    'Capacidades fuera del alcance de esta versión',
    'Las capacidades {capacidades} no admiten valoración en la versión vigente del catálogo.',
    'Registrar su exclusión en el expediente para que no se lea como ausencia de datos.',
    null),

  p('COBERTURA_PARCIAL', ['capacidades'],
    'Cobertura incompleta según el catálogo',
    'Las capacidades {capacidades} cuentan con registros elegibles que no cubren su definición completa.',
    'Comprobar qué pruebas de la cobertura declarada faltan por aplicar.',
    'Verificar la cobertura tras la siguiente sesión de valoración.'),

  p('PERFIL_SIN_COBERTURA', [],
    'Ninguna capacidad caracterizada',
    'El perfil no caracteriza ninguna capacidad activa.',
    'Comprobar si el catálogo aplicado declara correspondencias respaldadas.',
    'Repetir la derivación tras actualizar el catálogo.'),

  p('CONFLICTO', ['capacidades', 'registros'],
    'Registros no conciliables',
    'Las capacidades {capacidades} presentan registros no conciliables entre sí: {registros}.',
    'Documentar el desacuerdo y obtener un registro nuevo en una sesión de revisión.',
    'La divergencia se resuelve con dato nuevo, nunca eligiendo entre los existentes.'),

  p('PERFIL_INCONSISTENTE', ['conflictos'],
    'Perfil con contradicciones registradas',
    'La derivación registra {conflictos} contradicciones en los datos de entrada.',
    'Revisar el listado de contradicciones antes de dar por válida cualquier lectura del perfil.',
    'Repetir la derivación una vez depurados los datos de entrada.'),

  p('REGISTROS_NO_VIGENTES', ['capacidades', 'fecha'],
    'Registros fuera de vigencia',
    'Las capacidades {capacidades} solo cuentan con registros anteriores a {fecha}, ya no elegibles.',
    'Programar una sesión de revalidación para esas capacidades.',
    'Comprobar la vigencia declarada en el catálogo antes de repetir la toma.'),

  p('EVIDENCIA_INSUFICIENTE', ['capacidades'],
    'Correspondencias con respaldo insuficiente',
    'La base de conocimiento declara respaldo insuficiente para las correspondencias de {capacidades}.',
    'Abstenerse de sostener afirmaciones sobre esas capacidades en el expediente.',
    'Revisar la base de conocimiento cuando se publique una versión nueva.'),

  p('EVIDENCIA_DESACONSEJADA', ['capacidades', 'pruebas'],
    'Correspondencias desaconsejadas por la base',
    'La base desaconseja emplear {pruebas} para caracterizar {capacidades}.',
    'Retirar esas correspondencias del catálogo aplicado o dejar constancia de su exclusión.',
    null),

  p('NIVEL_BAJO', ['capacidades'],
    'Correspondencias con nivel de evidencia bajo',
    'Las correspondencias que sostienen {capacidades} tienen nivel de evidencia bajo.',
    'Acompañar toda afirmación sobre esas capacidades de su nivel declarado.',
    null),

  p('CONSTRUCTO_NO_VERIFICADO', ['capacidades'],
    'Validez de constructo no verificada',
    'Las correspondencias de {capacidades} se apoyan en reproducibilidad de la medida; su validez de constructo no consta verificada.',
    'Limitar el enunciado a la magnitud registrada por la prueba.',
    null),

  p('ALCANCE_RESTRINGIDO', ['capacidades'],
    'Alcance restringido de la correspondencia',
    'Las correspondencias de {capacidades} autorizan un enunciado más estrecho que la capacidad completa.',
    'Reproducir el alcance autorizado junto a cada afirmación.',
    null),

  p('POBLACION_RESTRINGIDA', ['capacidades', 'poblaciones'],
    'Poblaciones de estudio restringidas',
    'La evidencia de {capacidades} procede de: {poblaciones}.',
    'Comprobar que la persona valorada pertenece a alguna de esas poblaciones antes de aplicar la correspondencia.',
    null),

  p('SIN_SENSIBILIDAD', ['pruebas'],
    'Sensibilidad al cambio no documentada',
    'La base no documenta sensibilidad al cambio para: {pruebas}.',
    'Abstenerse de sostener que un valor ha variado entre dos valoraciones.',
    'Revisar la base cuando publique cambio mínimo detectable por prueba.'),

  p('SIN_VIGENCIA', ['pruebas'],
    'Vigencia no documentada',
    'La base no documenta vigencia para: {pruebas}.',
    'Dejar constancia de que la caducidad de esos registros no puede establecerse.',
    null),

  p('SIN_PESOS', [],
    'Correspondencias sin peso relativo',
    'Ninguna correspondencia aplicada declara peso relativo.',
    'Tratar todas las correspondencias como equivalentes y dejarlo documentado.',
    null),

  p('REGISTROS_EXCLUIDOS', ['capacidades', 'motivos'],
    'Registros excluidos de la derivación',
    'Las capacidades {capacidades} tienen registros que no participan: {motivos}.',
    'Revisar los motivos de exclusión antes de dar el perfil por completo.',
    'Atender al origen de la exclusión en la siguiente toma.'),

  p('ANULADOS', ['registros'],
    'Registros anulados en el histórico',
    'El histórico contiene registros anulados: {registros}.',
    'Conservarlos en el expediente: dejan de participar, no dejan de existir.',
    null),

  p('CATALOGO_SIN_CORRESPONDENCIAS', [],
    'Catálogo sin correspondencias respaldadas',
    'El catálogo aplicado no declara ninguna correspondencia respaldada.',
    'Actualizar el catálogo con las correspondencias autorizadas por la base de conocimiento.',
    'Repetir la derivación tras la actualización.'),

  p('TRAZABILIDAD_DISPONIBLE', ['total'],
    'Trazabilidad completa disponible',
    'Las {total} interpretaciones del perfil declaran su origen hasta la referencia científica.',
    'Adjuntar la trazabilidad al expediente cuando el informe se comparta.',
    null),
] as const;
