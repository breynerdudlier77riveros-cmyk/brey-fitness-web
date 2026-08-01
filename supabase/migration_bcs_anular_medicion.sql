-- ═══════════════════════════════════════════════════════════════════════════
-- Sprint BCS-1.1 · Corrección funcional — habilitar la anulación de Medición
-- ═══════════════════════════════════════════════════════════════════════════
--
-- PROBLEMA QUE CORRIGE
-- `bcs_mediciones` se creó (migration_bcs.sql) solo con políticas SELECT e
-- INSERT, fiel al Database Handbook 09 ("append-only"). Pero el BCS Handbook
-- 13 (UC-06 CorregirMedición) y el Domain Model 10 (FSM Vigente→Anulada)
-- exigen la transición a `anulada`. Con la RLS actual ese UPDATE queda
-- bloqueado en runtime: `anularMedicion` no afecta ninguna fila y
-- `corregirMedicion` deja DOS mediciones vigentes para la misma fecha,
-- duplicando el histórico y corrompiendo el Reporte.
--
-- Ambas fuentes se contradicen; esta migración resuelve la contradicción a
-- favor del comportamiento que el producto necesita, SIN renunciar a la
-- inmutabilidad de los valores medidos (P3 / IN-D1):
--
--   · La RLS acota QUÉ FILAS puede tocar el entrenador (solo las de sus
--     clientes) y HACIA QUÉ ESTADO (solo → 'anulada', nunca de vuelta a
--     'vigente'), igual que la política de revocación que bcs_enlaces_publicos
--     ya tiene desde el inicio.
--   · El GRANT a nivel de COLUMNA acota QUÉ COLUMNAS puede tocar: solo
--     `estado`. Ninguna variable medida puede modificarse jamás vía UPDATE
--     — una corrección sigue siendo "anular + insertar", nunca una edición
--     en sitio. Esto no se puede expresar en una policy (las policies operan
--     por fila, no por columna), por eso van las dos cosas juntas.
--
-- IDEMPOTENTE: se puede ejecutar varias veces sin efecto adicional.
--
-- CÓMO APLICARLA: Supabase Dashboard → SQL Editor → pegar y ejecutar.

-- ── 1 · Política de fila: solo mis mediciones, solo hacia 'anulada' ────────
drop policy if exists "bcs_mediciones: el entrenador anula mediciones de sus clientes"
  on public.bcs_mediciones;

create policy "bcs_mediciones: el entrenador anula mediciones de sus clientes"
  on public.bcs_mediciones for update
  using (
    -- Solo mediciones de sus propios clientes, y solo si siguen vigentes:
    -- una medición ya anulada es terminal y no se vuelve a tocar.
    estado = 'vigente'
    and exists (
      select 1 from public.bcs_clientes c
      where c.id = cliente_id and c.entrenador_id = auth.uid()
    )
  )
  with check (
    -- El único destino permitido. Impide reactivar una anulada (IN-D1).
    estado = 'anulada'
    and exists (
      select 1 from public.bcs_clientes c
      where c.id = cliente_id and c.entrenador_id = auth.uid()
    )
  );

-- ── 2 · Privilegio de columna: `estado` y nada más ─────────────────────────
-- Supabase concede UPDATE sobre toda la tabla a `authenticated` por defecto y
-- delega el control en la RLS. Aquí se estrecha a una sola columna, para que
-- los 22 valores medidos queden fuera del alcance de cualquier UPDATE.
revoke update on public.bcs_mediciones from authenticated;
grant update (estado) on public.bcs_mediciones to authenticated;

-- `anon` nunca actualiza esta tabla: la vista pública es de solo lectura y
-- se resuelve con Service Role en la capa de aplicación (UC-09).
revoke update on public.bcs_mediciones from anon;
