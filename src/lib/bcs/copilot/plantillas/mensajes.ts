// ── Correo y WhatsApp profesionales (flujos 5 y 6) ─────────────────────────
// Mensajes de coordinación, no informes. Anuncian que existe un documento y
// remiten a él; no reproducen su contenido clínico.
//
// Esa decisión no es de estilo: un mensaje asíncrono se lee sin contexto y sin
// posibilidad de preguntar. Enviar hallazgos por WhatsApp los deja sin las
// limitaciones que los acompañan en el informe.

import type { FuentesNormalizadas } from '../fuentes';
import { Traza } from '../trazabilidad';
import type { Seccion } from '../tipos';

export type VarianteCorreo = 'consulta_inicial' | 'seguimiento' | 'nueva_medicion' | 'recordatorio';

const ASUNTO: Record<VarianteCorreo, string> = {
  consulta_inicial: 'Tu primera evaluación de composición corporal',
  seguimiento: 'Informe de seguimiento de composición corporal',
  nueva_medicion: 'Nueva evaluación registrada',
  recordatorio: 'Tu informe de composición corporal',
};

function firma(f: FuentesNormalizadas): string[] {
  // Sin nombre de profesional no se inventa uno: se firma de forma neutra.
  return f.profesional ? ['Un saludo,', f.profesional] : ['Un saludo.'];
}

export function componerCorreo(f: FuentesNormalizadas, variante: VarianteCorreo) {
  const traza = new Traza(`correo:${variante}`);
  const cuerpo: string[] = [`Hola ${f.clienteNombre},`];

  switch (variante) {
    case 'consulta_inicial':
      cuerpo.push(
        'Te comparto el informe de tu primera evaluación de composición corporal.',
        'Con una sola evaluación se puede describir el estado registrado, pero todavía no su evolución: eso llega a partir de la segunda.'
      );
      break;
    case 'seguimiento':
      cuerpo.push(
        `Te comparto tu informe de composición corporal, elaborado sobre ${f.cantidadMediciones} evaluaciones.`,
        'Incluye la comparación con la evaluación anterior y la evolución del conjunto.'
      );
      break;
    case 'nueva_medicion':
      cuerpo.push(
        `He registrado tu nueva evaluación${f.fechaActual ? ` del ${f.fechaActual}` : ''}.`,
        'El informe ya está actualizado con la comparación respecto a la anterior.'
      );
      break;
    case 'recordatorio':
      cuerpo.push('Te reenvío el enlace a tu informe de composición corporal, por si te resulta más cómodo tenerlo a mano.');
      break;
  }

  if (f.alertas.length > 0) {
    cuerpo.push(
      'Hay algún registro que quiero revisar contigo antes de dar los valores por definitivos; lo comentamos cuando nos veamos.'
    );
    f.alertas.forEach((a) => traza.usarHallazgo(a.id));
  }

  cuerpo.push(
    'El informe describe las medidas y cómo evolucionan. Cualquier duda sobre tu caso concreto la vemos en consulta.',
    ...firma(f)
  );

  const secciones: Seccion[] = [
    { titulo: 'Asunto', contenido: [ASUNTO[variante]] },
    { titulo: 'Cuerpo', contenido: cuerpo },
  ];

  return { secciones, traza: traza.construir() };
}

// ── WhatsApp ───────────────────────────────────────────────────────────────

export type VarianteWhatsapp = 'breve' | 'normal' | 'formal';

/**
 * Sin emojis de ningún tipo. El encargo veta los «emojis médicos», y la línea
 * entre uno médico y uno de ánimo es demasiado fina en un mensaje sobre el
 * cuerpo de alguien: se excluyen todos.
 */
export function componerWhatsapp(f: FuentesNormalizadas, variante: VarianteWhatsapp) {
  const traza = new Traza(`whatsapp:${variante}`);
  const lineas: string[] = [];

  switch (variante) {
    case 'breve':
      lineas.push(
        `Hola ${f.clienteNombre}, ya tienes disponible tu informe de composición corporal.`,
        'Lo vemos en la próxima consulta.'
      );
      break;
    case 'normal':
      lineas.push(
        `Hola ${f.clienteNombre}, ya está listo tu informe de composición corporal${f.cantidadMediciones > 1 ? `, con la comparación respecto a la evaluación anterior` : ''}.`,
        'Describe las medidas y su evolución; lo comentamos con calma cuando nos veamos.',
        'Si al leerlo te surge alguna duda, apúntala y la resolvemos en consulta.'
      );
      break;
    case 'formal':
      lineas.push(
        `Buenos días, ${f.clienteNombre}.`,
        `Le comparto su informe de composición corporal, elaborado sobre ${f.cantidadMediciones} ${f.cantidadMediciones === 1 ? 'evaluación registrada' : 'evaluaciones registradas'}.`,
        'El documento describe las medidas obtenidas y su evolución en el tiempo, junto con los límites de lo que puede interpretarse a partir de ellas.',
        'Quedo a su disposición para revisarlo en la próxima consulta.'
      );
      break;
  }

  return { secciones: [{ titulo: '', contenido: lineas }] as Seccion[], traza: traza.construir() };
}
