// ── Explicación para el paciente (flujo 2) ─────────────────────────────────
// Traduce el lenguaje técnico a lenguaje llano SIN perder precisión. La regla
// que gobierna este archivo: simplificar la forma, nunca el contenido.
//
// Ejemplo del propio encargo:
//   técnico → «la disminución supera el umbral documentado»
//   llano   → «un cambio suficientemente grande para considerarlo real y no
//              una variación del instrumento»
//
// Ambas dicen lo mismo. Lo que NO se admite es pasar de ahí a «has mejorado»,
// que añade un juicio que el dato no contiene.

import type { FuentesNormalizadas } from '../fuentes';
import { FICHAS_HEREDADAS } from '../conocimiento';
import { Traza } from '../trazabilidad';
import type { Seccion } from '../tipos';

export function componerExplicacionPaciente(f: FuentesNormalizadas) {
  const traza = new Traza('explicacion_paciente');
  const secciones: Seccion[] = [];

  secciones.push({
    titulo: 'Qué se midió',
    contenido: [
      `Se registraron ${f.cantidadMediciones} ${f.cantidadMediciones === 1 ? 'evaluación' : 'evaluaciones'} de composición corporal.`,
      'La báscula no mide la grasa ni el músculo directamente: hace pasar una corriente muy suave por el cuerpo y calcula el resto a partir de cómo la atraviesa.',
      'Por eso los valores se comparan siempre contigo mismo a lo largo del tiempo, y no con los de otra persona.',
    ],
  });
  traza.usarFicha(FICHAS_HEREDADAS.medicion);

  if (f.cambiosSignificativos.length > 0) {
    secciones.push({
      titulo: 'Qué cambió',
      contenido: [
        `Comparando con la evaluación anterior, ${f.cambiosSignificativos.length === 1 ? 'hay un valor que cambió' : `hay ${f.cambiosSignificativos.length} valores que cambiaron`} lo suficiente como para considerarlo un cambio real y no una variación del propio aparato.`,
        ...f.cambiosSignificativos.map((c) => `· ${c.titulo}.`),
      ],
    });
    f.cambiosSignificativos.forEach((c) => traza.usarHallazgo(c.id).usarVariable(c.variable));
  } else {
    secciones.push({
      titulo: 'Qué cambió',
      contenido: [
        'Comparando con la evaluación anterior, las diferencias quedan dentro del margen que el propio aparato puede variar de una vez a otra.',
        'Eso no significa que no haya cambiado nada: significa que un cambio de ese tamaño no puede distinguirse del margen de la medición.',
      ],
    });
    traza.usarFicha(FICHAS_HEREDADAS.calidad);
  }

  if (f.cambiosSinUmbral.length > 0) {
    secciones.push({
      titulo: 'Qué se observa, con cautela',
      contenido: [
        `Otros ${f.cambiosSinUmbral.length} valores también se movieron, pero para ellos no existe una cifra establecida que permita decir si ese movimiento es importante.`,
        'Se anotan para poder seguirlos, sin sacar conclusiones todavía.',
      ],
    });
    f.cambiosSinUmbral.forEach((c) => traza.usarHallazgo(c.id).usarVariable(c.variable));
  }

  if (f.limitaciones.length > 0) {
    secciones.push({
      titulo: 'Qué no se puede saber con estos datos',
      contenido: [
        ...f.limitaciones.slice(0, 3).map((l) => `· ${l.titulo}.`),
        'Estos límites se indican para que quede claro hasta dónde llega la información, no porque falte algo en tu evaluación.',
      ],
    });
  }

  secciones.push({
    titulo: 'Qué no dice este informe',
    contenido: [
      'Este documento describe medidas y cómo evolucionan. No es una valoración médica ni explica por qué ocurrió cada cambio.',
      'Cualquier duda sobre tu situación concreta corresponde comentarla en consulta.',
    ],
  });

  return { secciones, traza: traza.construir() };
}
