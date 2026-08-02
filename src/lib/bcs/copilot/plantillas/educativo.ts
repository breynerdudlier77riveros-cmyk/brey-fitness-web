// ── Material educativo (flujo 9) ───────────────────────────────────────────
// Explica los conceptos usando ÚNICAMENTE la Clinical Knowledge Base. A
// diferencia del resto de plantillas, este material no depende del cliente:
// las fichas se leen igual para cualquiera, por eso no recibe `fuentes`.
//
// Cada concepto se explica en tres partes fijas: qué es, cómo se obtiene y qué
// no puede concluirse. La tercera nunca se omite — un material educativo que
// solo explica lo que un valor significa invita a interpretarlo de más.

import { FICHAS_COPILOT, FICHAS_HEREDADAS } from '../conocimiento';
import { Traza } from '../trazabilidad';
import type { Seccion } from '../tipos';

export type ConceptoEducativo = 'imc' | 'grasa' | 'agua' | 'musculo' | 'bmr';

interface Contenido {
  titulo: string;
  queEs: string;
  comoSeObtiene: string;
  limite: string;
  ficha: { fichaCkb: string; referencias: readonly string[] };
}

const CONTENIDOS: Record<ConceptoEducativo, Contenido> = {
  imc: {
    titulo: 'IMC — Índice de masa corporal',
    queEs: FICHAS_COPILOT.imc.llana,
    comoSeObtiene: 'Se calcula dividiendo el peso entre la estatura al cuadrado. No interviene la báscula de bioimpedancia: basta con peso y talla.',
    limite: FICHAS_COPILOT.imc.limite,
    ficha: FICHAS_COPILOT.imc,
  },
  grasa: {
    titulo: 'Grasa corporal',
    queEs: 'Es la reserva de energía del cuerpo, expresada como peso absoluto y también como porcentaje del peso total.',
    comoSeObtiene: 'El aparato la estima a partir de cómo la corriente atraviesa el cuerpo. La masa grasa en kilos suele calcularse a partir del peso y del porcentaje.',
    limite: 'El porcentaje puede bajar porque baje la grasa o porque suba el peso total. Por eso el porcentaje y los kilos se leen juntos, nunca por separado.',
    ficha: FICHAS_HEREDADAS.grasa,
  },
  agua: {
    titulo: 'Agua corporal',
    queEs:
      'Es el total de agua del cuerpo, repartida entre la que está dentro de las células y la que está fuera de ellas.',
    comoSeObtiene: 'Es lo que la bioimpedancia detecta de forma más directa: el agua y las sales conducen la corriente, y la grasa no.',
    limite: 'Es el valor que más se mueve en pocas horas. Beber, sudar, comer o entrenar lo modifican, así que una variación de un día para otro no indica cambio de tejido.',
    ficha: FICHAS_HEREDADAS.agua,
  },
  musculo: {
    titulo: 'Masa muscular',
    queEs: 'Es el peso estimado del tejido muscular. Conviene no confundirla con la masa libre de grasa, que además incluye huesos, órganos y agua.',
    comoSeObtiene: 'La estima el propio aparato. Como el músculo contiene mucha agua, su valor y el del agua corporal se mueven juntos.',
    limite: 'Cambia despacio, en semanas o meses. Una subida entre dos evaluaciones muy próximas se explica mejor por el agua del cuerpo que por músculo nuevo.',
    ficha: FICHAS_HEREDADAS.musculo,
  },
  bmr: {
    titulo: 'Metabolismo basal',
    queEs: FICHAS_COPILOT.metabolismo_basal.llana,
    comoSeObtiene: 'En la mayoría de aparatos no se mide: se calcula con una fórmula a partir de los otros valores, y cada fabricante usa la suya.',
    limite: FICHAS_COPILOT.metabolismo_basal.limite,
    ficha: FICHAS_COPILOT.metabolismo_basal,
  },
};

export const CONCEPTOS: ConceptoEducativo[] = ['imc', 'grasa', 'agua', 'musculo', 'bmr'];

export function componerMaterialEducativo(conceptos: readonly ConceptoEducativo[] = CONCEPTOS) {
  const traza = new Traza('material_educativo');

  const secciones: Seccion[] = conceptos.map((clave) => {
    const c = CONTENIDOS[clave];
    traza.usarFicha({ fichaCkb: c.ficha.fichaCkb, referencias: [...c.ficha.referencias] });
    return {
      titulo: c.titulo,
      contenido: [`Qué es: ${c.queEs}`, `Cómo se obtiene: ${c.comoSeObtiene}`, `Qué no puede concluirse: ${c.limite}`],
    };
  });

  secciones.push({
    titulo: 'Nota común a todos los valores',
    contenido: [
      'La bioimpedancia estima estos valores a partir de una medida eléctrica y de fórmulas validadas en grupos de población concretos.',
      'Su comportamiento está mejor documentado para seguir la evolución de una misma persona que para comparar personas entre sí o aparatos distintos.',
    ],
  });
  traza.usarFicha(FICHAS_HEREDADAS.medicion);

  return { secciones, traza: traza.construir() };
}
