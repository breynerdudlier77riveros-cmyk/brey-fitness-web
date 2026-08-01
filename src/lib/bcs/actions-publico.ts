"use server";

// ── Server Action pública del BCS — UC-09 VisualizarReportePúblico ────────
// Único caso de uso invocable SIN autenticación (BCS Handbook 13). Vive en
// un archivo separado de src/lib/bcs/actions.ts (que ya existe, congelado
// de Sprint 3, y del que UC-01..08 son deliberadamente entrenador-only) —
// misma separación que exige IN-A1: "el panel del entrenador y la vista
// pública nunca comparten el mismo endpoint ni el mismo componente de
// presentación". Extiende esa misma frontera al propio Server Action.
//
// Usa el cliente admin (Service Role, ver src/lib/supabase/admin.ts) para
// resolver token→Cliente sin sesión, saltándose la RLS que exige
// auth.uid() = entrenador_id — el único mecanismo de este ecosistema con
// ese privilegio, usado exclusivamente aquí. Reutiliza SIN modificar los
// repositorios ya congelados de Sprint 2 (obtenerEnlacePorToken,
// obtenerClientePorId, listarMedicionesVigentesPorCliente): son funciones
// puras de `SupabaseClient → dato`, y un cliente admin sigue siendo un
// SupabaseClient válido.
//
// Los códigos TOKEN_INVALIDO / TOKEN_REVOCADO se distinguen aquí (fieles al
// contrato UC-09 y a los eventos de seguridad token_invalido_intentado /
// token_revocado_intentado del BCS Handbook 08) pero la vista pública NUNCA
// debe mostrar mensajes distintos para ambos — mismo tratamiento visual
// ("Este enlace ya no está disponible", Design Handbook 13) para no revelar
// si el token existió alguna vez. Esa fusión ocurre en el componente de
// página, no aquí.

import { createAdminClient } from "@/lib/supabase/admin";
import { obtenerEnlacePorToken, obtenerClientePorId, listarMedicionesVigentesPorCliente } from "@/lib/bcs/repository";
import { construirReporte, type Reporte } from "@/lib/bcs/reporte";
import type { ActionResult } from "@/lib/types";

// ── UC-09 · VisualizarReportePúblico ───────────────────────────────────────
export async function obtenerReportePublico(token: string): Promise<ActionResult<Reporte>> {
  if (!token.trim()) return { ok: false, error: "TOKEN_INVALIDO" };

  const supabase = createAdminClient();

  const enlace = await obtenerEnlacePorToken(supabase, token);
  if (!enlace) return { ok: false, error: "TOKEN_INVALIDO" };
  if (enlace.estado === "revocado") return { ok: false, error: "TOKEN_REVOCADO" };

  const cliente = await obtenerClientePorId(supabase, enlace.cliente_id);
  // No debería ocurrir (integridad referencial de bcs_enlaces_publicos),
  // pero un Cliente ausente no es un caso previsto por el contrato UC-09 —
  // se trata como token inválido en vez de lanzar.
  if (!cliente) return { ok: false, error: "TOKEN_INVALIDO" };

  const historico = await listarMedicionesVigentesPorCliente(supabase, cliente.id);
  const reporte = construirReporte(cliente, historico);
  // Cliente sin ninguna Medición (BCS Handbook 04, casos límite): el
  // Reporte es null — no es un error de token, es un estado "Vacío" (13)
  // que resuelve el componente de página, no esta acción.
  if (!reporte) return { ok: false, error: "SIN_MEDICIONES" };

  return { ok: true, data: reporte };
}
