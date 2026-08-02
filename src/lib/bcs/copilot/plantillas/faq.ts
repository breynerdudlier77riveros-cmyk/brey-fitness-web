// ── Preguntas frecuentes (flujo 4) ─────────────────────────────────────────
// Toda respuesta procede de una ficha de la Clinical Knowledge Base y va
// siempre acompañada de su límite. Separado de la explicación para el
// paciente porque su contenido es GENÉRICO: no depende del reporte de nadie,
// y por eso el pipeline lo marca como material sin comprobación de variables.

import { FICHAS_COPILOT, FICHAS_HEREDADAS } from '../conocimiento';
import { Traza } from '../trazabilidad';
import type { Seccion } from '../tipos';


export type ClavePregunta = 'grasa' | 'agua' | 'musculo' | 'metabolismo' | 'angulo_fase' | 'imc';

const PREGUNTAS: Record<ClavePregunta, { pregunta: string; ficha: { fichaCkb: string; referencias: string[]; llana: string; limite: string } }> = {
  grasa: {
    pregunta: '¿Por qué cambió mi grasa corporal?',
    ficha: {
      fichaCkb: FICHAS_HEREDADAS.grasa.fichaCkb,
      referencias: [...FICHAS_HEREDADAS.grasa.referencias],
      llana:
        'La grasa corporal es la reserva de energía del cuerpo. Cuando el balance de energía se mantiene por debajo de lo que se gasta durante un tiempo, esa reserva se moviliza.',
      limite:
        'El informe no puede saber qué lo produjo en tu caso: no contiene información sobre lo que comes, entrenas o descansas.',
    },
  },
  agua: {
    pregunta: '¿Qué significa el agua corporal?',
    ficha: {
      fichaCkb: FICHAS_HEREDADAS.agua.fichaCkb,
      referencias: [...FICHAS_HEREDADAS.agua.referencias],
      llana:
        'Es el total de agua del cuerpo, repartida entre la que está dentro de las células y la que está fuera. El músculo contiene mucha agua, así que ambas cosas van juntas.',
      limite:
        'Es el valor que más se mueve en pocas horas: beber, sudar, comer o entrenar lo cambian. Por eso una variación de un día para otro no indica cambio de tejido.',
    },
  },
  musculo: {
    pregunta: '¿Qué significa la masa muscular?',
    ficha: {
      fichaCkb: FICHAS_HEREDADAS.musculo.fichaCkb,
      referencias: [...FICHAS_HEREDADAS.musculo.referencias],
      llana:
        'Es el peso estimado del tejido muscular. Crece cuando el estímulo de fuerza y la disponibilidad de material se mantienen a lo largo de semanas.',
      limite:
        'Cambia despacio. Una subida entre dos evaluaciones muy próximas se explica mejor por el agua del cuerpo que por músculo nuevo.',
    },
  },
  metabolismo: {
    pregunta: '¿Por qué cambió mi metabolismo?',
    ficha: {
      fichaCkb: FICHAS_COPILOT.metabolismo_basal.fichaCkb,
      referencias: [...FICHAS_COPILOT.metabolismo_basal.referencias],
      llana: FICHAS_COPILOT.metabolismo_basal.llana,
      limite: FICHAS_COPILOT.metabolismo_basal.limite,
    },
  },
  angulo_fase: {
    pregunta: '¿Qué significa el ángulo de fase?',
    ficha: {
      fichaCkb: FICHAS_COPILOT.angulo_fase.fichaCkb,
      referencias: [...FICHAS_COPILOT.angulo_fase.referencias],
      llana: FICHAS_COPILOT.angulo_fase.llana,
      limite: FICHAS_COPILOT.angulo_fase.limite,
    },
  },
  imc: {
    pregunta: '¿Qué significa el IMC?',
    ficha: {
      fichaCkb: FICHAS_COPILOT.imc.fichaCkb,
      referencias: [...FICHAS_COPILOT.imc.referencias],
      llana: FICHAS_COPILOT.imc.llana,
      limite: FICHAS_COPILOT.imc.limite,
    },
  },
};

export const CLAVES_PREGUNTA = Object.keys(PREGUNTAS) as ClavePregunta[];

export function componerFaq(claves: readonly ClavePregunta[] = CLAVES_PREGUNTA) {
  const traza = new Traza('faq');
  const secciones: Seccion[] = claves.map((clave) => {
    const { pregunta, ficha } = PREGUNTAS[clave];
    traza.usarFicha({ fichaCkb: ficha.fichaCkb, referencias: ficha.referencias });
    return { titulo: pregunta, contenido: [ficha.llana, ficha.limite] };
  });

  return { secciones, traza: traza.construir() };
}
