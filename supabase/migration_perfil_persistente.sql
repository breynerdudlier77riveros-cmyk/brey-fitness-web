-- ═══════════════════════════════════════════════════════════════════════════
-- BREY Fitness — Sprint 4: Perfil Persistente
-- ═══════════════════════════════════════════════════════════════════════════
-- A diferencia de schema.sql (solo para un proyecto NUEVO desde cero), este
-- archivo es para pegar en el SQL Editor del proyecto YA EN PRODUCCIÓN
-- (twqdssnpffteabkzdvkc.supabase.co) — trae únicamente el delta de este
-- Sprint sobre la tabla `profiles` que ya existe con datos reales.
--
-- Seguro de pegar más de una vez: cada columna usa IF NOT EXISTS.
--
-- No toca `sistema_actual` ni `nivel_actual` — esas las asigna el
-- Diagnóstico BPS y no son parte de este Sprint. `nivel_experiencia` es
-- una columna DISTINTA, autorreportada por el usuario (ver comentario en
-- la tabla, más abajo) — no la sobrescribas pensando que es lo mismo.
--
-- CHECK sobre columna nullable: en SQL estándar (y Postgres) un CHECK solo
-- se evalúa cuando el valor no es NULL, así que estas 12 columnas aceptan
-- "sin especificar" sin necesitar una cláusula `is null or` explícita.
-- ═══════════════════════════════════════════════════════════════════════════

alter table public.profiles
  -- Información personal
  add column if not exists edad int,
  add column if not exists sexo text check (sexo in ('Masculino', 'Femenino', 'Prefiero no decirlo')),

  -- Información física
  add column if not exists peso_kg numeric check (peso_kg > 20),
  add column if not exists altura_cm numeric check (altura_cm > 80),

  -- Información deportiva. objetivo/experiencia/lugar_entrenamiento reusan
  -- las mismas etiquetas visibles del Diagnóstico BPS (src/lib/diagnostico/
  -- preguntas.ts) para que el vocabulario sea idéntico en toda la app.
  add column if not exists objetivo text check (objetivo in (
    'Ganar músculo y masa', 'Perder grasa y definir', 'Ganar fuerza máxima',
    'Dominar habilidades de peso corporal', 'Transformación completa'
  )),
  -- Nivel AUTOPERCIBIDO y general — NO es sistema_actual/nivel_actual (esos
  -- son asignados por el Diagnóstico y están acoplados a un Sistema
  -- específico, p. ej. "Skills" solo existe dentro de Calistenia).
  add column if not exists nivel_experiencia text check (nivel_experiencia in ('Principiante', 'Intermedio', 'Avanzado')),
  add column if not exists lugar_entrenamiento text check (lugar_entrenamiento in ('Gym', 'Casa o parque', 'Ambos')),
  add column if not exists dias_por_semana int check (dias_por_semana between 1 and 7),
  add column if not exists duracion_sesion_min int check (duracion_sesion_min > 0),
  add column if not exists experiencia text check (experiencia in ('Menos de 1 año', '1 – 3 años', 'Más de 3 años')),
  add column if not exists lesiones text,
  add column if not exists observaciones text;

-- Sin cambios de RLS: la policy "profiles: el usuario edita su propio
-- perfil" (USING/WITH CHECK auth.uid() = id, sin restricción por columna)
-- ya cubre estas 12 columnas nuevas automáticamente.
