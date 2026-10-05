// ── Anamnesis · secciones de campo simple ──────────────────────────────────
//
// Cada sección es una lista de `CampoDef` en el orden en que aparecen en el
// formulario original. Las secciones "tabulares" (alimentos, motivos,
// estrés, temperamento, laboratorio) NO están aquí — tienen su propio
// componente de tabla en `features/anamnesis/components/` y su contenido
// fijo en `datos-fijos.ts`.

import type { CampoDef } from './tipos';

export interface Seccion {
  id: string;
  titulo: string;
  campos: CampoDef[];
}

export const SECCION_DEMOGRAFICOS: Seccion = {
  id: 'demograficos',
  titulo: 'Aspectos demográficos',
  campos: [
    { tipo: 'texto', clave: 'demo.nombre', etiqueta: 'Nombre' },
    { tipo: 'texto', clave: 'demo.apellido', etiqueta: 'Apellido' },
    { tipo: 'numero', clave: 'demo.edad', etiqueta: 'Edad' },
    { tipo: 'opciones', clave: 'demo.genero', etiqueta: 'Género', opciones: ['Femenino', 'Masculino'] },
    { tipo: 'texto', clave: 'demo.campoDesempeno', etiqueta: 'Campo de desempeño (ocupación)' },
    { tipo: 'texto', clave: 'demo.deporte', etiqueta: 'Deporte que practica' },
    { tipo: 'texto', clave: 'demo.deporteTiempo', etiqueta: 'Tiempo practicándolo' },
    { tipo: 'texto', clave: 'demo.institucion', etiqueta: 'Institución (si estudia)' },
    { tipo: 'texto', clave: 'demo.gradoSemestre', etiqueta: 'Grado o semestre' },
    { tipo: 'texto', clave: 'demo.programaAcademico', etiqueta: 'Programa académico' },
    {
      tipo: 'opciones',
      clave: 'demo.nivelEducativo',
      etiqueta: 'Nivel educativo',
      opciones: ['Bachiller', 'Técnico', 'Tecnólogo', 'Profesional', 'Especialista', 'Magister', 'Phd', 'Otro'],
      otraClave: 'demo.nivelEducativoOtro',
    },
    {
      tipo: 'opciones',
      clave: 'demo.estadoCivil',
      etiqueta: 'Estado civil',
      opciones: ['Soltero (a)', 'Casado (a)', 'Unión libre', 'Otro'],
      otraClave: 'demo.estadoCivilOtro',
    },
    { tipo: 'siNo', clave: 'demo.hijos', etiqueta: '¿Tiene hijos?' },
    { tipo: 'numero', clave: 'demo.hijosCantidad', etiqueta: '¿Cuántos?' },
    { tipo: 'numero', clave: 'demo.hijoEdad1', etiqueta: 'Edad hijo 1' },
    { tipo: 'numero', clave: 'demo.hijoEdad2', etiqueta: 'Edad hijo 2' },
    { tipo: 'numero', clave: 'demo.hijoEdad3', etiqueta: 'Edad hijo 3' },
    { tipo: 'numero', clave: 'demo.hijoEdad4', etiqueta: 'Edad hijo 4' },
    { tipo: 'numero', clave: 'demo.hijoEdad5', etiqueta: 'Edad hijo 5' },
    { tipo: 'numero', clave: 'demo.estrato', etiqueta: 'Estrato de los servicios públicos del hogar' },
  ],
};

export const SECCION_ANTECEDENTES: Seccion = {
  id: 'antecedentes',
  titulo: 'Antecedentes',
  campos: [
    { tipo: 'textoLargo', clave: 'ant.patologicos', etiqueta: 'Patológicos' },
    { tipo: 'textoLargo', clave: 'ant.quirurgicos', etiqueta: 'Quirúrgicos' },
    { tipo: 'textoLargo', clave: 'ant.alergicos', etiqueta: 'Alérgicos' },
    { tipo: 'textoLargo', clave: 'ant.farmacologicos', etiqueta: 'Farmacológicos' },
    { tipo: 'textoLargo', clave: 'ant.traumaticos', etiqueta: 'Traumáticos' },
    { tipo: 'textoLargo', clave: 'ant.toxicos', etiqueta: 'Tóxicos' },
    { tipo: 'textoLargo', clave: 'ant.familiares', etiqueta: 'Familiares' },
    { tipo: 'textoLargo', clave: 'ant.otros', etiqueta: 'Otros' },
  ],
};

export const PARQ_PREGUNTAS: { clave: string; etiqueta: string }[] = [
  { clave: 'parq.problemaCardiaco', etiqueta: '¿Alguna vez su médico le ha dicho que tiene problemas cardiacos y que solamente puede realizar actividad física prescrita?' },
  { clave: 'parq.dolorPecho', etiqueta: '¿Siente dolor en el pecho cuando realiza actividad física?' },
  { clave: 'parq.perdidaEquilibrio', etiqueta: '¿Ha perdido el equilibrio debido a vértigo o alguna vez ha perdido la conciencia?' },
  { clave: 'parq.medicamentoHipertension', etiqueta: '¿Está su médico actualmente prescribiéndole algún medicamento para la hipertensión u otro problema cardiaco?' },
  { clave: 'parq.problemaOseo', etiqueta: '¿Tiene algún problema óseo o de articulaciones que pueda empeorar con la actividad física?' },
  { clave: 'parq.otraRazon', etiqueta: '¿Conoce alguna otra razón por la que no deba realizar actividad física?' },
  { clave: 'parq.dolorPechoReposo', etiqueta: '¿En el último mes ha tenido dolor en el pecho cuando no estaba haciendo actividad física?' },
];

export const AHA_ANTECEDENTES: { clave: string; etiqueta: string }[] = [
  { clave: 'aha.ataqueCardiaco', etiqueta: 'Ataque cardiaco' },
  { clave: 'aha.enfermedadValvular', etiqueta: 'Enfermedad valvular cardiaca' },
  { clave: 'aha.cirugiaCorazon', etiqueta: 'Cirugía del corazón' },
  { clave: 'aha.fallaCardiaca', etiqueta: 'Falla cardiaca' },
  { clave: 'aha.cateterismo', etiqueta: 'Cateterismo cardiaco' },
  { clave: 'aha.transplante', etiqueta: 'Transplante cardiaco' },
  { clave: 'aha.angioplastia', etiqueta: 'Angioplastia coronaria' },
  { clave: 'aha.enfermedadCongenita', etiqueta: 'Enfermedad congénita del corazón' },
];

export const AHA_SINTOMAS: { clave: string; etiqueta: string; conDetalle?: string }[] = [
  { clave: 'aha.malestarPecho', etiqueta: '¿Siente malestar en el pecho con el ejercicio?' },
  { clave: 'aha.asfixia', etiqueta: '¿Siente asfixia inexplicable?' },
  { clave: 'aha.vertigoDesmayo', etiqueta: '¿Siente vértigo, desmayo o pérdida del conocimiento?' },
  { clave: 'aha.medicamentosCorazon', etiqueta: '¿Toma medicamentos para el corazón?' },
  { clave: 'aha.problemasMusculoesqueleticos', etiqueta: '¿Tiene problemas músculo esqueléticos?' },
  { clave: 'aha.preocupacionSeguridad', etiqueta: '¿Tiene preocupaciones sobre la seguridad del ejercicio?' },
  { clave: 'aha.medicacionPrescrita', etiqueta: '¿Está tomando alguna medicación prescrita por un médico?' },
  { clave: 'aha.embarazada', etiqueta: 'Si es mujer: ¿está embarazada?' },
  { clave: 'aha.hombreMayor45', etiqueta: '¿Es hombre mayor de 45 años?' },
  { clave: 'aha.mujerMayor55', etiqueta: '¿Es mujer mayor de 55 años, tiene histerectomía o es postmenopáusica?' },
  { clave: 'aha.fuma', etiqueta: '¿Fuma?' },
  { clave: 'aha.presionAlta', etiqueta: '¿Su presión arterial es mayor de 140/90 (hipertenso)?' },
  { clave: 'aha.medicamentosPara', etiqueta: '¿Toma medicamentos para...?', conDetalle: 'aha.medicamentosParaDetalle' },
  { clave: 'aha.colesterolAlto', etiqueta: '¿Su colesterol es mayor de 240 mg/dl?' },
  { clave: 'aha.noConoceColesterolPresion', etiqueta: '¿No conoce su nivel de colesterol o de presión arterial?' },
  { clave: 'aha.familiarAtaqueCardiaco', etiqueta: '¿Tiene un familiar cercano que haya tenido un ataque cardiaco antes de los 55 años (padre o hermano) o mayor de 65 (madre o hermana)?' },
  { clave: 'aha.diabetes', etiqueta: '¿Es diabético o está tomando medicinas para el control del azúcar?' },
];

export const SECCION_HABITOS_ALIMENTACION: { clave: string; etiqueta: string }[] = [
  { clave: 'habito.comidas3veces', etiqueta: 'Come usted tres veces al día: desayuno, almuerzo y comida.' },
  { clave: 'habito.variedadGrupos', etiqueta: 'Todos los días consume alimentos que incluyan vegetales, carne, cereales y granos.' },
  { clave: 'habito.aguaDiaria', etiqueta: 'Consume de 4 a 8 vasos de agua al día.' },
  { clave: 'habito.frutasEntreComidas', etiqueta: 'Incluye entre comidas el consumo de frutas.' },
  { clave: 'habito.sinQuimicos', etiqueta: 'Escoge comidas que no tengan ingredientes artificiales o químicos para conservar la comida.' },
  { clave: 'habito.leeEtiquetas', etiqueta: 'Lee usted las etiquetas de comidas para identificar ingredientes.' },
];

export const ESCALA_HABITOS = [
  { valor: 'nunca', etiqueta: 'Nunca' },
  { valor: 'a_veces', etiqueta: 'A veces' },
  { valor: 'siempre', etiqueta: 'Siempre' },
];

export const SECCION_FACTOR_IMPIDE: CampoDef[] = [
  { tipo: 'casilla', clave: 'factor.faltaTiempo', etiqueta: 'Falta de tiempo' },
  { tipo: 'casilla', clave: 'factor.faltaEscenarios', etiqueta: 'Falta de escenarios' },
  { tipo: 'casilla', clave: 'factor.faltaVoluntad', etiqueta: 'Falta de voluntad, disciplina o pereza' },
  { tipo: 'casilla', clave: 'factor.problemasSalud', etiqueta: 'Problemas de salud' },
  { tipo: 'casilla', clave: 'factor.faltaCompania', etiqueta: 'Falta de compañía' },
  { tipo: 'casilla', clave: 'factor.faltaImplementos', etiqueta: 'Falta de implementos' },
  { tipo: 'casilla', clave: 'factor.noLeGusta', etiqueta: 'No le gusta' },
  { tipo: 'casilla', clave: 'factor.faltaConocimiento', etiqueta: 'Falta de conocimiento' },
  { tipo: 'casilla', clave: 'factor.otro', etiqueta: 'Otra razón' },
  { tipo: 'texto', clave: 'factor.otroDetalle', etiqueta: '¿Cuál?' },
];

export const SECCION_COMPORTAMIENTO: Seccion = {
  id: 'comportamiento',
  titulo: 'Aspectos de comportamiento',
  campos: [
    {
      tipo: 'opciones',
      clave: 'comport.percepcionPeso',
      etiqueta: 'En cuanto a su peso, usted cree que se encuentra',
      opciones: ['Rangos normales para su estatura y edad', 'Un poco pasado (o) de peso', 'Muy pasado (o) de peso', 'Por debajo de los parámetros normales'],
    },
    {
      tipo: 'opciones',
      clave: 'comport.percepcionImagen',
      etiqueta: 'Con respecto a su cuerpo e imagen corporal, actualmente se siente',
      opciones: ['Orgulloso (a)', 'Conforme', 'Inconforme, bajar o subir unos kilos mejorarían notablemente su imagen', 'Le es indiferente, pues para usted es lo de menos'],
    },
    {
      tipo: 'opciones',
      clave: 'comport.estadoActividad',
      etiqueta: '¿Cuál de las siguientes frases identifica su estado actual respecto a la actividad física?',
      opciones: [
        'No hago actividad física, no me interesa, no la necesito.',
        'No hago actividad física, pero me interesa y quiero hacerla.',
        'Hago actividad física y me interesa mantenerla.',
        'Hago actividad física y me interesa aumentarla.',
      ],
    },
    { tipo: 'siNo', clave: 'comport.importanciaEjercicio', etiqueta: '¿Considera que la actividad física y el ejercicio en dosis adecuadas son importantes para la salud?' },
    { tipo: 'siNo', clave: 'comport.leGustaEjercicio', etiqueta: '¿Le gusta el ejercicio?' },
    { tipo: 'textoLargo', clave: 'comport.motivacion', etiqueta: '¿Qué lo (a) motivaría a ser físicamente más activo (a)?' },
    { tipo: 'textoLargo', clave: 'comport.porQue', etiqueta: '¿Por qué?' },
    {
      tipo: 'opciones',
      clave: 'comport.tiempoLibreActividad',
      etiqueta: '¿Qué tipo de actividad realiza en su tiempo libre? (marque solo una)',
      opciones: ['Leer', 'Cine', 'Dormir', 'Pasear', 'Otra'],
      otraClave: 'comport.tiempoLibreOtra',
    },
    { tipo: 'casilla', clave: 'comport.familiaPadres', etiqueta: 'Padres' },
    { tipo: 'casilla', clave: 'comport.familiaHermanos', etiqueta: 'Hermanos' },
    { tipo: 'casilla', clave: 'comport.familiaHijos', etiqueta: 'Hijos' },
    { tipo: 'casilla', clave: 'comport.familiaConyuge', etiqueta: 'Cónyuge' },
    { tipo: 'casilla', clave: 'comport.familiaOtros', etiqueta: 'Otros' },
    { tipo: 'texto', clave: 'comport.familiaOtrosDetalle', etiqueta: '¿Cuáles?' },
    {
      tipo: 'opciones',
      clave: 'comport.horasLibres',
      etiqueta: '¿Cuántas horas de tiempo libre tiene al día entre semana?',
      opciones: ['Más de 2', 'Entre 1 y 2', 'Menos de 1', 'Otra'],
      otraClave: 'comport.horasLibresOtra',
    },
    {
      tipo: 'opciones',
      clave: 'comport.preferenciaActividad',
      etiqueta: 'En su tiempo libre prefiere realizar actividades',
      opciones: ['Grupales', 'Individuales'],
    },
    { tipo: 'siNo', clave: 'comport.dispuestoTrabajo', etiqueta: '¿Estaría dispuesto (a) a realizar actividad física en su lugar de trabajo?' },
    { tipo: 'texto', clave: 'comport.diasDisponibles', etiqueta: '¿Cuántos días a la semana estaría dispuesto (a) a realizar ejercicio o actividad física?' },
    {
      tipo: 'opciones',
      clave: 'comport.horarioPreferido',
      etiqueta: '¿En qué horario preferiría practicar ejercicio?',
      opciones: ['Mañana', 'Tarde', 'Noche'],
    },
    { tipo: 'textoLargo', clave: 'comport.actividadPreferida', etiqueta: '¿Qué tipo de actividad física, ejercicio o deporte preferiría practicar?' },
  ],
};
