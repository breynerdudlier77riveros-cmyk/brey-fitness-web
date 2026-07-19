-- ═══════════════════════════════════════════════════════════════════════════
-- BREY Fitness — Sprint 4.1: Integridad de profiles.edad
-- ═══════════════════════════════════════════════════════════════════════════
-- Archivo separado de migration_perfil_persistente.sql a propósito: no hay
-- certeza de que ese ya se haya pegado en el proyecto en producción.
--
-- Único gap real de integridad en profiles: peso_kg/altura_cm/dias_por_semana/
-- duracion_sesion_min ya tienen CHECK desde Sprint 4 — edad se quedó sin
-- ninguno.
--
-- Idempotente de verdad: ADD CONSTRAINT no tiene una forma "IF NOT EXISTS"
-- nativa en Postgres (a diferencia de ADD COLUMN), así que se verifica
-- pg_constraint explícitamente antes de agregarlo — correr este archivo
-- dos, tres o cien veces no produce ningún error.

do $$
begin
  if not exists (
    select 1
    from pg_constraint
    where conname = 'profiles_edad_check'
      and conrelid = 'public.profiles'::regclass
  ) then
    alter table public.profiles
      add constraint profiles_edad_check check (edad is null or (edad > 0 and edad < 120));
  end if;
end
$$;
