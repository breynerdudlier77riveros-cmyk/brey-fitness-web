"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type { UnidadSistema } from "@/lib/utils";

// ── Contexto de preferencias del Workspace (Sprint I-02, Configuración) ────
// No existe columna en `profiles` para unidades/zona horaria — no forman
// parte del modelo de dominio persistido, y este Sprint no lo modifica.
// Viven en localStorage, mismo patrón que brey-sidebar-collapsed en
// AppShell: se leen en useEffect (nunca en el initializer de useState) para
// no producir un mismatch de hidratación entre el HTML del servidor y el
// del cliente. Alcance por dispositivo, no por cuenta — una limitación
// conocida, no un intento fallido de sincronizar entre dispositivos.

export interface Preferencias {
  unidades: UnidadSistema;
  zonaHoraria: string;
}

interface PreferenciasState extends Preferencias {
  setUnidades: (unidades: UnidadSistema) => void;
  setZonaHoraria: (zonaHoraria: string) => void;
}

const DEFAULT_PREFERENCIAS: Preferencias = { unidades: "metrico", zonaHoraria: "UTC" };
const STORAGE_KEY = "brey-preferencias";

const PreferenciasContext = createContext<PreferenciasState | null>(null);

export function usePreferences() {
  const ctx = useContext(PreferenciasContext);
  if (!ctx) throw new Error("usePreferences debe usarse dentro de AppShell");
  return ctx;
}

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const [preferencias, setPreferencias] = useState<Preferencias>(DEFAULT_PREFERENCIAS);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as Partial<Preferencias>;
        // eslint-disable-next-line react-hooks/set-state-in-effect
        setPreferencias((prev) => ({ ...prev, ...parsed }));
        return;
      } catch {
        // localStorage corrupto — se ignora, sigue al valor detectado abajo.
      }
    }
    // Primera visita sin preferencia guardada: usa la zona horaria real del
    // navegador en vez del "UTC" neutro del render de servidor. Nunca se
    // lee en el initializer (mismatch de hidratación) — solo aquí, una vez,
    // al montar, igual que el localStorage.getItem de arriba.
    const detectada = Intl.DateTimeFormat().resolvedOptions().timeZone;
    setPreferencias((prev) => ({ ...prev, zonaHoraria: detectada }));
  }, []);

  function actualizar(patch: Partial<Preferencias>) {
    setPreferencias((prev) => {
      const next = { ...prev, ...patch };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      return next;
    });
  }

  return (
    <PreferenciasContext.Provider
      value={{
        ...preferencias,
        setUnidades: (unidades) => actualizar({ unidades }),
        setZonaHoraria: (zonaHoraria) => actualizar({ zonaHoraria }),
      }}
    >
      {children}
    </PreferenciasContext.Provider>
  );
}
