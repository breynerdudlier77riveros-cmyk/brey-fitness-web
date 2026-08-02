"use client";

import { useEffect, useState } from "react";
import Button from "@/components/brand/Button";
import { Scale, AlertTriangle, WifiOff } from "@/components/brand/icons";

// ── Los 7 estados no felices (BCS Design Handbook 13) ──────────────────────
// Carga → Skeleton.tsx. Sin datos suficientes (una variable ausente) → la
// Metric Card correspondiente simplemente no se renderiza (ya lo hace
// construirFicha en reporte.ts, filtrando null/undefined) — no hay
// componente propio para ese caso, es ausencia de renderizado.

/** Vacío — "Cliente sin ninguna Medición registrada". */
export function EstadoVacioMediciones({ onRegistrar }: { onRegistrar: () => void }) {
  return (
    <div className="flex flex-col items-center justify-center text-center py-14 px-6">
      <div className="w-11 h-11 rounded-2xl border border-white/[0.10] bg-white/[0.03] flex items-center justify-center mb-4">
        <Scale className="w-5 h-5 text-white/40" strokeWidth={1.75} />
      </div>
      <p className="font-bold text-white text-sm mb-1">Sin mediciones registradas</p>
      <p className="text-white/50 text-xs leading-relaxed max-w-xs mb-5">
        Este cliente todavía no tiene ninguna medición de composición corporal.
      </p>
      <Button size="sm" onClick={onRegistrar}>
        Registrar la primera medición
      </Button>
    </div>
  );
}

/** Sin permiso — token de EnlacePúblico inválido o revocado (pantalla dedicada, página completa). Mismo tratamiento para ambos casos, por seguridad (no revela cuál de los dos ocurrió). */
export function EstadoSinPermiso() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-950">
      <div className="w-12 h-12 rounded-2xl border border-white/[0.10] bg-white/[0.03] flex items-center justify-center mb-5">
        <AlertTriangle className="w-6 h-6 text-white/40" strokeWidth={1.75} />
      </div>
      <p className="font-black text-white text-lg mb-2">Este enlace ya no está disponible</p>
      <p className="text-white/50 text-sm max-w-sm">
        Contacta a tu entrenador para obtener un enlace vigente.
      </p>
    </div>
  );
}

/** Error — validación fallida o error de red al guardar. El formulario que la muestra conserva los datos ya ingresados (responsabilidad del call site). */
export function EstadoError({ mensaje }: { mensaje: string }) {
  return (
    <div role="alert" className="flex gap-3 rounded-2xl border border-red-500/25 bg-red-500/[0.06] border-l-4 border-l-red-500 p-4">
      <AlertTriangle className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" strokeWidth={2} />
      <p className="text-sm text-red-100/80 leading-relaxed">{mensaje}</p>
    </div>
  );
}

/** Offline — banner persistente en la parte superior; el resto de la pantalla sigue mostrando el último estado conocido, marcado "posiblemente desactualizado". */
export function OfflineBanner() {
  const [offline, setOffline] = useState(false);

  useEffect(() => {
    // navigator.onLine no existe durante el render en servidor — leerlo en
    // el initializer de useState produciría un mismatch de hidratación
    // (mismo criterio que useSidebarCollapse en AppShell.tsx). Única
    // sincronización de arranque con ese sistema externo, una sola vez.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setOffline(!navigator.onLine);
    const on = () => setOffline(false);
    const off = () => setOffline(true);
    window.addEventListener("online", on);
    window.addEventListener("offline", off);
    return () => {
      window.removeEventListener("online", on);
      window.removeEventListener("offline", off);
    };
  }, []);

  if (!offline) return null;

  return (
    <div className="sticky top-0 z-50 flex items-center justify-center gap-2 py-2 px-4 bg-yellow-500/90 text-slate-950 text-xs font-bold">
      <WifiOff className="w-3.5 h-3.5" strokeWidth={2.5} />
      Sin conexión — mostrando la última información disponible, posiblemente desactualizada.
    </div>
  );
}

/** Sin historial — se omite la sección específica (Comparación/tendencias) con una nota, nunca toda la pantalla. */
export function NotaSinHistorial({ children }: { children: React.ReactNode }) {
  return <p className="text-xs text-white/40 italic py-2">{children}</p>;
}
