"use client";

import DashboardCard from "@/components/app/DashboardCard";
import PageHeader from "@/components/app/PageHeader";
import EmptyState from "@/components/app/EmptyState";
import { RadioGroup, RadioGroupItem } from "@/components/brand/RadioGroup";
import Select from "@/components/brand/Select";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/brand/Tooltip";
import Button from "@/components/brand/Button";
import { Bell } from "@/components/brand/icons";
import { usePreferences } from "@/components/app/PreferencesProvider";
import { formatPeso, formatAltura, type UnidadSistema } from "@/lib/utils";

// ── Configuración del Workspace (Sprint I-02) ───────────────────────────────
// Unidades/zona horaria: preferencia real y funcional, persistida en
// localStorage vía usePreferences() — no hay columna en `profiles` para
// esto y este Sprint no toca el modelo de dominio (ver PreferencesProvider).
// Idioma: control estático deshabilitado, mismo patrón que los botones de
// Buscar/Notificaciones de Header.tsx — no existe infraestructura de i18n
// en el repo, así que un selector "funcional" que no tradujera nada sería
// una UI deshonesta, no una preferencia real.

const ZONAS_HORARIAS = [
  "America/Bogota",
  "America/Mexico_City",
  "America/Lima",
  "America/Santiago",
  "America/Buenos_Aires",
  "America/Sao_Paulo",
  "America/New_York",
  "America/Chicago",
  "America/Denver",
  "America/Los_Angeles",
  "Europe/Madrid",
  "Europe/London",
  "UTC",
] as const;

interface Props {
  email: string;
  emailConfirmado: boolean;
  pesoKg: number | null;
  alturaCm: number | null;
}

export default function ConfiguracionClient({ email, emailConfirmado, pesoKg, alturaCm }: Props) {
  const { unidades, zonaHoraria, setUnidades, setZonaHoraria } = usePreferences();

  // La zona detectada del navegador puede no estar en la lista curada —
  // se añade dinámicamente para que el Select siempre pueda mostrar el
  // valor real en vez de caer en un placeholder vacío.
  const opcionesZona = Array.from(new Set<string>([...ZONAS_HORARIAS, zonaHoraria]));

  return (
    <div className="max-w-2xl">
      <PageHeader title="Configuración" description="Preferencias del Workspace" />

      <div className="space-y-6">
        <DashboardCard title="Preferencias">
          <div className="space-y-5">
            <div>
              <p className="text-xs font-semibold text-white/60 mb-2">Unidades</p>
              <RadioGroup
                value={unidades}
                onValueChange={(v) => setUnidades(v as UnidadSistema)}
                className="flex flex-wrap gap-6"
              >
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="metrico" id="unidades-metrico" />
                  <label htmlFor="unidades-metrico" className="text-sm text-white/80 cursor-pointer">
                    Métrico (kg, cm)
                  </label>
                </div>
                <div className="flex items-center gap-2">
                  <RadioGroupItem value="imperial" id="unidades-imperial" />
                  <label htmlFor="unidades-imperial" className="text-sm text-white/80 cursor-pointer">
                    Imperial (lb, ft/in)
                  </label>
                </div>
              </RadioGroup>
              {(pesoKg !== null || alturaCm !== null) && (
                <p className="text-white/40 text-xs mt-2">
                  Vista previa: {formatPeso(pesoKg, unidades)} · {formatAltura(alturaCm, unidades)}
                </p>
              )}
            </div>

            <div>
              <label htmlFor="zona-horaria" className="block text-xs font-semibold text-white/60 mb-2">
                Zona horaria
              </label>
              <Select
                id="zona-horaria"
                value={zonaHoraria}
                onValueChange={setZonaHoraria}
                options={opcionesZona}
                aria-label="Zona horaria"
              />
            </div>
          </div>
        </DashboardCard>

        <DashboardCard title="Idioma">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-white text-sm font-semibold">Español</p>
              <p className="text-white/40 text-xs mt-0.5">Único idioma disponible por ahora.</p>
            </div>
            <Tooltip>
              <TooltipTrigger asChild>
                <button
                  aria-disabled="true"
                  aria-label="Cambiar idioma (próximamente)"
                  className="px-4 py-2 rounded-full border border-white/[0.10] text-white/40 text-xs font-bold cursor-not-allowed"
                >
                  Cambiar
                </button>
              </TooltipTrigger>
              <TooltipContent>Próximamente</TooltipContent>
            </Tooltip>
          </div>
        </DashboardCard>

        <DashboardCard title="Notificaciones">
          <EmptyState
            icon={Bell}
            title="Próximamente"
            description="La configuración de notificaciones llega en un próximo Sprint."
          />
        </DashboardCard>

        <DashboardCard title="Cuenta">
          <div className="divide-y divide-white/[0.06]">
            <div className="flex items-center justify-between gap-4 py-3 first:pt-0">
              <span className="text-white/50 text-sm">Email</span>
              <span className="text-white text-sm font-semibold">{email}</span>
            </div>
            <div className="flex items-center justify-between gap-4 py-3 last:pb-0">
              <span className="text-white/50 text-sm">Email verificado</span>
              <span
                className={`text-sm font-semibold ${emailConfirmado ? "text-emerald-400" : "text-white/50"}`}
              >
                {emailConfirmado ? "Sí" : "No"}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <Button href="/app/perfil" size="sm" variant="outline">
              Editar información personal
            </Button>
          </div>
        </DashboardCard>
      </div>
    </div>
  );
}
