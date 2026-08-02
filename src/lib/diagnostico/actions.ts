"use server";

// ── Server Action del Diagnóstico (capa Application, BE-01) ─────────────────
// Persiste un Diagnóstico completado del Usuario autenticado (endpoint
// POST /diagnosticos, API Contract Handbook 07). Sigue el patrón exacto de
// lib/supabase/actions.ts (signOut): "use server", cliente de servidor,
// valida sesión, orquesta — sin SQL, sin JSX, sin React.
//
// Orquestación pura (BE-01): valida sesión → invoca el motor de Diagnóstico
// (motor de dominio YA existente, función pura, BE-05 — NO uno de los motores
// prohibidos de este Sprint) → persiste vía el repositorio → devuelve el DTO
// oficial. Esta acción NO contiene ninguna regla del cuestionario: esa lógica
// vive dentro del motor (src/lib/diagnostico/motor.ts), aquí solo se invoca.

import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import { motorGuionado } from "@/lib/diagnostico/motor";
import { insertDiagnosis, getDiagnosisVigente } from "@/lib/diagnostico/repository";
import type { Respuesta, Diagnostico } from "@/lib/diagnostico/tipos";
import type { ActionResult } from "@/lib/types";

export async function guardarDiagnostico(
  respuestas: Respuesta[]
): Promise<ActionResult<Diagnostico>> {
  const user = await getUser();
  if (!user) return { ok: false, error: "NO_AUTENTICADO" };

  // El motor (función pura) computa el Resultado a partir de las respuestas —
  // determinista, del lado del servidor, sin confiar en un valor del cliente.
  const turno = await motorGuionado.responder(respuestas);
  if (!turno.resultado) return { ok: false, error: "DIAGNOSTICO_INCOMPLETO" };

  const supabase = await createClient();
  await insertDiagnosis(supabase, user.id, turno.resultado, respuestas);

  // insertDiagnosis devuelve void (Architecture Handbook 11); se relee el
  // Diagnóstico recién persistido (el más reciente) para devolver el DTO.
  const diagnostico = await getDiagnosisVigente(supabase, user.id);
  if (!diagnostico) return { ok: false, error: "PERSISTENCIA_FALLIDA" };

  return { ok: true, data: diagnostico };
}
