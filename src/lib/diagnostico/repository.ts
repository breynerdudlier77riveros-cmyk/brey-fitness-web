// ── Repositorio de diagnoses — único punto de acceso a esta tabla ──────────
// Encapsula la tabla `diagnoses`. Conecta el flujo autenticado del
// Diagnóstico BPS a la persistencia (Architecture Handbook 11: insertDiagnosis
// "conecta el flujo autenticado"). Sirve a los endpoints POST /diagnosticos,
// GET /diagnosticos, GET /diagnosticos/{id}, GET /diagnosticos/vigente
// (API Contract Handbook 07).
//
// Registros históricos e inmutables (P3, DM-ADR-07): solo insert + lecturas,
// nunca update/delete — un Usuario puede tener varios Diagnósticos, retomar
// siempre crea uno nuevo. Este repositorio no decide NADA: recibe el
// Resultado ya computado por el motor (src/lib/diagnostico/motor.ts) y lo
// persiste tal cual. La lógica del cuestionario vive en el motor, no aquí.

import type { SupabaseClient } from '@supabase/supabase-js';
import { mapDiagnostico } from '@/lib/database/mappers';
import type { Diagnostico, Resultado, Respuesta } from '@/lib/diagnostico/tipos';

/**
 * Persiste un Diagnóstico completado. Traduce el `Resultado` del motor a la
 * fila de `diagnoses`; `respuestas` (auditoría del cuestionario, columna real
 * de la tabla, Database Handbook 04) se pasa aparte porque el `Resultado` no
 * la contiene. Devuelve void (Architecture Handbook 11) — el call site
 * consulta si necesita la fila creada.
 */
export async function insertDiagnosis(
  supabase: SupabaseClient,
  userId: string,
  resultado: Resultado,
  respuestas: Respuesta[]
): Promise<void> {
  await supabase.from('diagnoses').insert({
    user_id: userId,
    sistema_recomendado: resultado.sistema,
    nivel_entrada: resultado.nivelEntrada,
    disponible: resultado.disponible,
    razones: resultado.razones,
    notas: resultado.notas,
    respuestas,
  });
}

/** Todos los Diagnósticos del Usuario, más recientes primero. */
export async function getDiagnoses(
  supabase: SupabaseClient,
  userId: string
): Promise<Diagnostico[]> {
  const { data } = await supabase
    .from('diagnoses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false });

  return (data ?? []).map(mapDiagnostico);
}

export async function getDiagnosisById(
  supabase: SupabaseClient,
  userId: string,
  id: string
): Promise<Diagnostico | null> {
  const { data } = await supabase
    .from('diagnoses')
    .select('*')
    .eq('user_id', userId)
    .eq('id', id)
    .maybeSingle();

  return data ? mapDiagnostico(data) : null;
}

/** El Diagnóstico más reciente del Usuario, o null si nunca hizo uno. */
export async function getDiagnosisVigente(
  supabase: SupabaseClient,
  userId: string
): Promise<Diagnostico | null> {
  const { data } = await supabase
    .from('diagnoses')
    .select('*')
    .eq('user_id', userId)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  return data ? mapDiagnostico(data) : null;
}
