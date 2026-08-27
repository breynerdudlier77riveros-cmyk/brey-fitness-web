'use server';

// ── Preguntar sobre el plan, sin sesión (Sprint PLS-2) ─────────────────────
//
// La segunda entrada anónima del subsistema, y la primera de todo el
// ecosistema que GASTA una API medida sin que nadie haya iniciado sesión.
//
// ── LAS CUATRO PUERTAS ────────────────────────────────────────────────────
//
//   1 · EL TOKEN. Se resuelve como en la página: si no existe, está revocado o
//       la plantilla no está publicada, no hay plan y no hay pregunta. El
//       plan que se le pasa al modelo es el MISMO que la persona está
//       leyendo, con los ajustes de su enlace ya aplicados.
//
//   2 · EL LÍMITE. Quince preguntas por hora y enlace. Sin él, cualquiera con
//       el enlace puede vaciar la cuota diaria y dejar al entrenador sin BREY
//       IA en su propio informe.
//
//   3 · EL CONTEXTO. El modelo recibe el plan y NADA más: ni historial, ni
//       composición corporal, ni internet. No puede inventarse una carga
//       porque no tiene ninguna otra cifra a mano.
//
//   4 · EL VALIDADOR. `validarTextoPlan`, que NO es el del BCS: allí el
//       vocabulario de entrenamiento está prohibido y aquí es el tema. La
//       línea está movida de sitio, no aflojada.
//
// Una violación rechaza la respuesta ENTERA, igual que en el informe. Y aquí
// con más motivo: quien lee es el cliente, y media respuesta censurada con
// apariencia de completa es exactamente lo que no debe llegarle.

import { createAdminClient } from '@/lib/supabase/admin';
import { construirTurnos } from '@/lib/ia/hilo';
import { proveedorElegido, type Proveedor, type Turno } from '@/lib/ia/proveedor';
import { crearProveedorAnthropic } from '@/lib/ia/proveedores/anthropic';
import { crearProveedorGemini } from '@/lib/ia/proveedores/gemini';

import { aplicarAjustes } from '@/lib/plantillas/contenido';
import { resolverToken } from '@/lib/plantillas/repository';
import { construirContextoPlan } from './contexto';
import { SISTEMA } from './contrato';
import { registrarPregunta } from './limite';
import { validarTextoPlan, type ViolacionPlan } from './validador';

export type RespuestaPlan =
  | { estado: 'ok'; texto: string; modelo: string; restantes: number }
  /** El validador tumbó la respuesta. Se dice, sin detallarle las reglas al cliente. */
  | { estado: 'rechazada' }
  /** Se agotaron las preguntas de esta hora. */
  | { estado: 'limite'; esperaSegundos: number }
  /** La función no está encendida en el servidor. */
  | { estado: 'sin_configurar' }
  | { estado: 'error'; mensaje: string };

const MAX_PREGUNTA = 400;

function resolverProveedor(): Proveedor | null {
  switch (proveedorElegido()) {
    case 'gemini':
      return crearProveedorGemini();
    case 'anthropic':
      return crearProveedorAnthropic();
    default:
      return null;
  }
}

export async function preguntarSobrePlan(
  token: string,
  pregunta: string,
  historial: readonly Turno[] = [],
): Promise<RespuestaPlan> {
  const limpia = pregunta.trim();
  if (limpia === '') return { estado: 'error', mensaje: 'La pregunta está vacía.' };
  if (limpia.length > MAX_PREGUNTA) {
    return { estado: 'error', mensaje: `La pregunta no puede pasar de ${MAX_PREGUNTA} caracteres.` };
  }

  // PUERTA 1. Antes que nada: sin plan no hay nada que preguntar, y comprobarlo
  // primero evita que un token inventado consuma cuota del límite.
  const admin = createAdminClient();
  const resuelto = await resolverToken(admin, token);
  if (!resuelto || resuelto.plantilla.estado !== 'publicada') {
    return { estado: 'error', mensaje: 'Este enlace ya no está disponible.' };
  }

  const proveedor = resolverProveedor();
  if (proveedor === null) return { estado: 'sin_configurar' };

  // PUERTA 2.
  const veredicto = registrarPregunta(token);
  if (!veredicto.permitido) {
    return { estado: 'limite', esperaSegundos: veredicto.esperaSegundos };
  }

  const { enlace, plantilla } = resuelto;

  // El nombre solo se consulta si el enlace es de un cliente. En el genérico no
  // hay a quién nombrar y sería una fila leída sin motivo.
  let para: string | null = null;
  if (enlace.cliente_id !== null) {
    const { data } = await admin
      .from('bcs_clientes')
      .select('nombre')
      .eq('id', enlace.cliente_id)
      .maybeSingle();
    para = (data?.nombre as string | undefined) ?? null;
  }

  // PUERTA 3.
  const informe = construirContextoPlan({
    nombre: plantilla.nombre,
    descripcion: plantilla.descripcion,
    semanas: plantilla.semanas,
    contenido: aplicarAjustes(plantilla.contenido, enlace.ajustes),
    para,
  });

  const resultado = await proveedor.responder(
    SISTEMA,
    construirTurnos(informe, historial, limpia),
  );

  switch (resultado.estado) {
    case 'declinada':
      return { estado: 'error', mensaje: 'No he podido responder a eso.' };

    case 'truncada':
      return {
        estado: 'error',
        mensaje: 'La respuesta se cortó antes de terminar. Prueba con una pregunta más concreta.',
      };

    case 'error':
      return { estado: 'error', mensaje: resultado.mensaje };

    case 'texto': {
      // PUERTA 4. Se comprueba el texto que iba a verse.
      const violaciones: ViolacionPlan[] = validarTextoPlan(resultado.texto);
      // Al cliente NO se le enseñan las reglas rotas. En el informe el
      // profesional necesita ese detalle para juzgar al modelo; aquí solo
      // confundiría a quien viene a entender su entrenamiento.
      if (violaciones.length > 0) return { estado: 'rechazada' };

      return {
        estado: 'ok',
        texto: resultado.texto,
        modelo: proveedor.modelo,
        restantes: veredicto.restantes,
      };
    }
  }
}
