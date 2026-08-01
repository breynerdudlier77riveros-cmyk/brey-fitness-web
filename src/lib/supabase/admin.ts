import { createClient as createSupabaseClient } from "@supabase/supabase-js";

// ── Cliente de Supabase con Service Role Key — acceso de servidor sin RLS ──
//
// Uso EXCLUSIVO: resolver el único acceso anónimo de todo el ecosistema
// (UC-09 VisualizarReportePúblico del BCS — BCS Handbook 13, IN-A2: "el
// dominio nunca conoce el token del enlace público; su resolución vive en
// la capa de aplicación"). La RLS de bcs_clientes/bcs_mediciones/
// bcs_enlaces_publicos exige `auth.uid() = entrenador_id` (supabase/
// migration_bcs.sql) — no existe ninguna policy para un visitante sin
// sesión, así que el portador de un token válido no puede leer estas
// filas con el cliente normal. Ningún handbook fija el mecanismo técnico
// exacto (Database Handbook 09 y BCS Handbook IN-A2 solo dicen "capa de
// aplicación", "fuera de RLS" — nunca "Service Role Key"); esta es la
// elección de implementación de este Sprint, la más directa disponible
// con lo ya provisionado (SUPABASE_SERVICE_ROLE_KEY ya existe en .env.local).
//
// REGLA DE ORO (Security Handbook 08 / Architecture Review AR-019, ya
// citada en .env.example): esta clave NUNCA lleva prefijo NEXT_PUBLIC_ y
// nunca es alcanzable desde código de cliente. Este archivo se importa
// ÚNICAMENTE desde Server Components o Server Actions — nunca desde un
// archivo "use client". No existe hoy un guardrail técnico (lint rule,
// paquete `server-only`) que lo impida automáticamente: es disciplina
// manual, documentada aquí como la propia AR-019 anticipa.
//
// Nunca se cachea ni se reexporta un singleton: cada llamada crea un
// cliente nuevo, igual que server.ts/client.ts — el costo de construcción
// es trivial y evita compartir estado entre requests.

export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL!;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!serviceRoleKey) {
    throw new Error(
      "SUPABASE_SERVICE_ROLE_KEY no está configurada — requerida para resolver un EnlacePúblico sin sesión (UC-09)."
    );
  }

  return createSupabaseClient(url, serviceRoleKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
