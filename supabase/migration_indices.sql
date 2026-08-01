-- ═══════════════════════════════════════════════════════════════════════════
-- BREY Fitness — Sprint 1 (M4): índices oficiales
-- ═══════════════════════════════════════════════════════════════════════════
-- Aplica la migración M4 del Implementation Handbook (05). Origen del diseño:
-- Architecture Handbook (10 — ya especificados, nunca aplicados) +
-- Database Handbook (06 — cada índice sirve a una consulta ya especificada,
-- nunca por anticipación).
--
-- Precondición: M1–M3 aplicadas (los índices cubren tablas de las tres
-- migraciones anteriores). Solo estos cinco — ninguno especulativo
-- (Database Handbook 06 lista los índices prohibidos y los futuros aparte).
--
-- CONCURRENTLY (Implementation Handbook 05): no bloquea escrituras en
-- producción. NOTA OPERATIVA: `CREATE INDEX CONCURRENTLY` no puede correr
-- dentro de un bloque de transacción — en el SQL Editor de Supabase, ejecuta
-- cada sentencia por separado (o desactiva el modo transacción). Sobre las
-- tablas recién creadas en M2/M3 (vacías) el modo es indiferente; sobre
-- workouts/workout_logs con datos reales, CONCURRENTLY es lo que evita el
-- lock de escritura.
--
-- Idempotente: `if not exists` en cada índice. `DROP INDEX` es el rollback,
-- siempre seguro (un índice nunca cambia el resultado de una consulta).

-- Sesión del día (GET /workouts/hoy) y rango del calendario.
create index if not exists idx_workouts_user_fecha_planificada
  on public.workouts (user_id, fecha_planificada);

-- Historial reciente y ventanas de evaluación de Progression Engine.
create index if not exists idx_workout_logs_user_fecha
  on public.workout_logs (user_id, fecha desc);

-- Timeline de decisiones y estado vigente de la máquina de Motor BPS
-- (replay determinista, IN-5).
create index if not exists idx_progression_events_user_created
  on public.progression_events (user_id, created_at desc);

-- Restricciones de zona activas y cualquier filtro por tipo de evento.
create index if not exists idx_progression_events_user_tipo_created
  on public.progression_events (user_id, tipo, created_at desc);

-- Historial de Mediciones por Cliente, con paginación sobre >50
-- (BCS Handbook 12) — por analogía directa con workout_logs.
create index if not exists idx_bcs_mediciones_cliente_fecha
  on public.bcs_mediciones (cliente_id, fecha desc);
