// ── Guion de devolución oral y presentación (flujos 3 y 8) ─────────────────
// El guion tiene cuatro partes fijas —saludo, explicación, cierre y
// seguimiento— y tres duraciones. La duración solo cambia cuánto se dice en la
// explicación: saludo, cierre y seguimiento se mantienen, porque son los que
// enmarcan la conversación.
//
// La parte de seguimiento NUNCA fija un plazo: ninguna fuente del ecosistema
// documenta periodicidad, y el Recommendation Engine ya declara ese ámbito
// como no cubierto.

import type { FuentesNormalizadas } from '../fuentes';
import { Traza } from '../trazabilidad';
import { palabrasParaMinutos, recortarAPalabras } from '../render';
import type { Seccion } from '../tipos';
import { segunNumero } from '../render';

export type VarianteGuion = '2min' | '5min' | '10min';

export const MINUTOS: Record<VarianteGuion, number> = { '2min': 2, '5min': 5, '10min': 10 };

export function componerGuion(f: FuentesNormalizadas, variante: VarianteGuion) {
  const traza = new Traza(`guion_consulta:${variante}`);
  const presupuesto = palabrasParaMinutos(MINUTOS[variante]);

  const saludo = [
    `Vamos a revisar juntos los resultados de ${f.cantidadMediciones === 1 ? 'tu evaluación' : 'tus evaluaciones'} de composición corporal.`,
    'Antes de empezar: esto describe medidas y cómo evolucionan, no es una valoración médica.',
  ];

  const explicacion: string[] = [];

  explicacion.push(
    'La báscula no mide grasa ni músculo directamente: los calcula a partir de cómo una corriente muy suave atraviesa el cuerpo. Por eso comparamos siempre contigo mismo, no con otras personas.'
  );

  if (f.alertas.length > 0) {
    explicacion.push(
      `Antes de entrar en los resultados: hay ${f.alertas.length} ${f.alertas.length === 1 ? 'registro' : 'registros'} que conviene verificar, así que algunos valores los leemos con cautela.`
    );
    f.alertas.forEach((a) => traza.usarHallazgo(a.id));
  }

  if (f.cambiosSignificativos.length > 0) {
    explicacion.push(
      `Respecto a la evaluación anterior hay ${f.cambiosSignificativos.length === 1 ? 'un cambio' : `${f.cambiosSignificativos.length} cambios`} suficientemente grandes como para considerarlos reales:`
    );
    f.cambiosSignificativos.forEach((c) => {
      explicacion.push(`${c.titulo}.`);
      traza.usarHallazgo(c.id).usarVariable(c.variable);
    });
  } else {
    explicacion.push(
      f.cantidadMediciones < 2
        ? 'Es la primera evaluación registrada, así que todavía no hay una anterior con la que contrastarla. La comparación aparece a partir de la segunda.'
        : 'Respecto a la evaluación anterior, las diferencias quedan dentro del margen propio del aparato. Eso no quiere decir que nada haya cambiado, sino que un cambio de ese tamaño no se distingue del margen de la medición.'
    );
  }

  if (f.tendencias.length > 0) {
    explicacion.push(
      `Mirando el conjunto de las evaluaciones: ${f.tendencias.map((t) => t.titulo.toLowerCase()).join('; ')}. Describe lo ya registrado, no una previsión.`
    );
    f.tendencias.forEach((t) => traza.usarHallazgo(t.id).usarVariable(t.variable));
  }

  if (f.cambiosSinUmbral.length > 0) {
    explicacion.push(
      f.cambiosSinUmbral.length === 1
        ? 'Hay otro valor que también se movió, pero para él no existe una cifra establecida que permita decir si el movimiento importa. Lo anotamos y lo seguimos.'
        : `Hay otros ${f.cambiosSinUmbral.length} valores que también se movieron, pero para ellos no existe una cifra establecida que permita decir si el movimiento importa. Los anotamos y los seguimos.`
    );
  }

  if (f.limitaciones.length > 0) {
    explicacion.push(
      `Hay ${f.limitaciones.length} ${f.limitaciones.length === 1 ? 'cosa' : 'cosas'} que estos datos no permiten saber, y prefiero decírtelo antes que dejarlo implícito.`
    );
  }

  const cierre = [
    'Ese es el resumen de lo que muestran los datos.',
    'Lo que no puedo decirte a partir de esta medición es por qué ocurrió cada cambio: el informe describe qué pasó, no qué lo produjo.',
  ];

  const seguimiento = [
    'Cada nueva evaluación permite comparar y, a partir de la tercera, describir la evolución del conjunto.',
    'El momento de repetirla lo decidimos según tu caso: el sistema no fija un intervalo.',
    '¿Hay algo de lo que hemos visto que quieras que repasemos?',
  ];

  // El presupuesto de palabras solo recorta la explicación. Saludo, cierre y
  // seguimiento se mantienen íntegros: son la estructura de la conversación.
  const fijas = [...saludo, ...cierre, ...seguimiento].join(' ').split(/\s+/).length;
  const explicacionAjustada = recortarAPalabras(explicacion, Math.max(presupuesto - fijas, 40));

  const secciones: Seccion[] = [
    { titulo: 'Saludo', contenido: saludo },
    { titulo: 'Explicación', contenido: explicacionAjustada },
    { titulo: 'Cierre', contenido: cierre },
    { titulo: 'Seguimiento', contenido: seguimiento },
  ];

  return { secciones, traza: traza.construir() };
}

// ── Presentación para consulta (flujo 8) ───────────────────────────────────

export type VariantePresentacion = 'pantalla' | 'tablet' | 'pdf';

/**
 * Diapositivas de apoyo. El contenido es idéntico en las tres variantes: lo que
 * cambia es la densidad recomendada por diapositiva, que consume la capa de
 * presentación. Cambiar el contenido según el soporte produciría tres versiones
 * del mismo mensaje destinadas a divergir.
 */
export function componerPresentacion(f: FuentesNormalizadas, variante: VariantePresentacion) {
  const traza = new Traza(`presentacion:${variante}`);

  const secciones: Seccion[] = [
    {
      titulo: f.clienteNombre,
      contenido: [
        `Composición corporal · ${segunNumero(f.cantidadMediciones, 'evaluación', 'evaluaciones')}`,
        `Emitido el ${f.hoyISO}`,
      ],
    },
    { titulo: 'Qué se midió', contenido: ['Estimación por bioimpedancia', 'Comparación contigo mismo a lo largo del tiempo'] },
  ];

  if (f.cambiosSignificativos.length > 0) {
    secciones.push({
      titulo: 'Cambios por encima del umbral',
      contenido: f.cambiosSignificativos.map((c) => c.titulo),
    });
    f.cambiosSignificativos.forEach((c) => traza.usarHallazgo(c.id).usarVariable(c.variable));
  }

  if (f.tendencias.length > 0) {
    secciones.push({ titulo: 'Evolución del conjunto', contenido: f.tendencias.map((t) => t.titulo) });
    f.tendencias.forEach((t) => traza.usarHallazgo(t.id).usarVariable(t.variable));
  }

  secciones.push({
    titulo: 'Qué no dice este informe',
    contenido: [
      'No es una valoración médica',
      'No establece por qué ocurrió cada cambio',
      ...f.limitaciones.slice(0, 2).map((l) => l.titulo),
    ],
  });

  return { secciones, traza: traza.construir() };
}
