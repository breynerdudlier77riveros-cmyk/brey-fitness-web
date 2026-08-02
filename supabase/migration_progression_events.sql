-- ═══════════════════════════════════════════════════════════════════════════
-- BREY Fitness — Sprint 1 (M2): tabla progression_events
-- ═══════════════════════════════════════════════════════════════════════════
-- Aplica la migración M2 del Implementation Handbook (05). Origen del diseño:
-- Architecture Handbook (10, tabla REQUERIDA) + Engineering Handbook (07,
-- consolidación de 25 valores de `tipo`) + Database Handbook (04 columnas,
-- 07 constraints, 08 eventos, 09 RLS).
--
-- Tabla única de eventos de TODO el ecosistema (ENG-ADR-03) — cada motor
-- declara su propio `origen`; nunca se crea una tabla de eventos paralela.
-- Append-only (P3/FT-09/DM-ADR-06): RLS permite solo select+insert propios,
-- nunca update ni delete.
--
-- El CHECK de `tipo` incluye los 25 valores consolidados desde el primer
-- CREATE TABLE (DB-ADR-03), no solo los 14 originales del Architecture
-- Handbook — para que Motor BPS y Progression Engine puedan persistir
-- cualquier tipo ya especificado sin una segunda migración de CHECK.
--
-- Idempotente: `create table if not exists`, `drop policy if exists` antes
-- de cada `create policy`. Correr N veces produce el mismo estado final.

create table if not exists public.progression_events (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users(id) on delete cascade,

  -- 25 valores consolidados (Database Handbook 08 — matriz Productor→Tipos):
  --   motor_bps (7), progression_engine (12), recovery_engine (3),
  --   workout_generator (2), usuario (1). `coach` es un origen reservado
  --   sin ningún tipo asociado todavía (AR-011, DB-ADR-04).
  tipo text not null check (tipo in (
    -- motor_bps
    'activacion', 'pausa', 'reanudacion', 'sistema_completado',
    'gate_fallado', 'transicion_estado', 'anomalia',
    -- progression_engine
    'avanza', 'sostiene', 'retrocede', 'prescripcion_actualizada',
    'escalon_avanzado', 'escalon_retrocedido', 'estancamiento_confirmado',
    'estancamiento_resuelto', 'deload_aplicado', 'deload_cancelado',
    'conflicto_resuelto', 'error_invocacion',
    -- recovery_engine
    'descarga_reactiva', 'dolor_reportado', 'restriccion_zona',
    -- workout_generator
    'semana_generada', 'descarga_programada',
    -- usuario
    'override_usuario'
  )),

  origen text not null check (origen in (
    'motor_bps', 'progression_engine', 'recovery_engine',
    'workout_generator', 'usuario', 'coach'
  )),

  -- Sin razón no hay evento válido (Architecture Handbook P2) — NOT NULL con
  -- dientes, no una convención de código.
  razones jsonb not null,

  -- Métricas/umbrales al momento de la decisión — habilita el replay
  -- determinista (P1). Nullable: su esquema por tipo sigue sin definir
  -- (AR-013/AR-026, pregunta abierta), así que la fila no lo exige todavía.
  contexto jsonb,

  -- FK opcional al log que originó la evaluación. On delete sin cláusula
  -- explícita en el Database Handbook (05, "No especificado"): se usa
  -- `set null` siguiendo el mismo precedente que workout_logs.workout_id
  -- (única otra FK opcional entre filas del esquema), para que el evento
  -- de auditoría sobreviva aunque su log fuese removido.
  workout_log_id uuid references public.workout_logs(id) on delete set null,

  created_at timestamptz not null default now()
);

alter table public.progression_events enable row level security;

-- RLS: select + insert propios; sin update ni delete (append-only, P3).
-- Cada motor escribe solo los tipos de su propio `origen` (Database
-- Handbook 05), pero esa restricción por-motor es de capa de aplicación —
-- RLS de Postgres solo puede acotar por fila (user_id), no por columna.

drop policy if exists "progression_events: el usuario ve sus propios eventos" on public.progression_events;
drop policy if exists "progression_events: el usuario crea sus propios eventos" on public.progression_events;

create policy "progression_events: el usuario ve sus propios eventos"
  on public.progression_events for select
  using (auth.uid() = user_id);

create policy "progression_events: el usuario crea sus propios eventos"
  on public.progression_events for insert
  with check (auth.uid() = user_id);

-- Sin política de UPDATE ni DELETE, a propósito — un evento insertado nunca
-- se edita ni se borra (DM-ADR-06, IN-20). Una corrección es un evento
-- compensatorio nuevo, nunca una mutación del anterior.
