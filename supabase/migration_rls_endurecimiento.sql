-- ═══════════════════════════════════════════════════════════════════════════
-- BREY Fitness — Sprint 0: Endurecimiento RLS de workouts/workout_logs (M1)
-- ═══════════════════════════════════════════════════════════════════════════
-- Aplica AR-018 (Architecture Review v1.0) — ya especificado sin aplicar por
-- Architecture Handbook (10), Database Handbook (09) e Implementation
-- Handbook (05, M1 — la primera de las cuatro migraciones ya secuenciadas,
-- antes que cualquier feature nueva, IMP-ADR-04).
--
-- Las políticas reales "CRUD propio" (for all) permiten DELETE sobre
-- historial de entrenamiento, contradiciendo la inmutabilidad exigida
-- (FT-09 / P3 / I-W3). Este archivo las reemplaza por políticas separadas
-- por operación:
--   workouts      → select + insert + update propios (update: transición de
--                   estado; RLS de Postgres no restringe por columna — la
--                   disciplina de "solo estado" es de capa de aplicación,
--                   documentada, no de este archivo)
--   workout_logs  → solo select + insert propios (un log cerrado nunca se
--                   edita, I-W3 — una corrección crea un registro nuevo)
-- Ninguna de las dos conserva DELETE.
--
-- Idempotente de verdad: cada policy se elimina con DROP POLICY IF EXISTS
-- (idempotente nativo de Postgres) antes de recrearse — correr este
-- archivo dos, tres o cien veces produce siempre el mismo estado final,
-- sin error.

-- ── workouts ─────────────────────────────────────────────────────────────

drop policy if exists "workouts: CRUD propio" on public.workouts;
drop policy if exists "workouts: el usuario ve sus propios workouts" on public.workouts;
drop policy if exists "workouts: el usuario crea sus propios workouts" on public.workouts;
drop policy if exists "workouts: el usuario actualiza sus propios workouts" on public.workouts;

create policy "workouts: el usuario ve sus propios workouts"
  on public.workouts for select
  using (auth.uid() = user_id);

create policy "workouts: el usuario crea sus propios workouts"
  on public.workouts for insert
  with check (auth.uid() = user_id);

create policy "workouts: el usuario actualiza sus propios workouts"
  on public.workouts for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

-- Sin política de DELETE, a propósito — el historial de entrenamiento
-- planificado nunca se borra (FT-09).

-- ── workout_logs ─────────────────────────────────────────────────────────

drop policy if exists "workout_logs: CRUD propio" on public.workout_logs;
drop policy if exists "workout_logs: el usuario ve sus propios workout_logs" on public.workout_logs;
drop policy if exists "workout_logs: el usuario crea sus propios workout_logs" on public.workout_logs;

create policy "workout_logs: el usuario ve sus propios workout_logs"
  on public.workout_logs for select
  using (auth.uid() = user_id);

create policy "workout_logs: el usuario crea sus propios workout_logs"
  on public.workout_logs for insert
  with check (auth.uid() = user_id);

-- Sin política de UPDATE ni DELETE, a propósito — un log cerrado es
-- inmutable (Architecture Handbook, 09, I-W3); una corrección crea un
-- registro nuevo, nunca edita el existente.
