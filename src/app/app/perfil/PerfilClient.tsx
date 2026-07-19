"use client";

import { useState } from "react";
import PageHeader from "@/components/app/PageHeader";
import DashboardCard from "@/components/app/DashboardCard";
import Button from "@/components/brand/Button";
import PerfilForm from "./PerfilForm";
import { iniciales } from "@/lib/utils";
import type { Profile } from "@/lib/types";

// ── Perfil Persistente (Sprint 4) ───────────────────────────────────────────
// Único estado real de la página: `editing` + `profile` (sembrado UNA VEZ
// desde props que ya trajo el Server Component — sin useEffect). El bloque
// Sistema/Nivel BPS/Email verificado es EXACTAMENTE el de antes de este
// Sprint: lo asigna el Diagnóstico, no es parte del formulario editable.

interface Props {
  profile: Profile;
  email: string;
  emailConfirmado: boolean;
}

const SIN_ESPECIFICAR = "Sin especificar";

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between gap-4 py-3 first:pt-0 last:pb-0">
      <span className="text-white/50 text-sm">{label}</span>
      <span className="text-white text-sm font-semibold text-right">{value}</span>
    </div>
  );
}

export default function PerfilClient({ profile: profileInicial, email, emailConfirmado }: Props) {
  const [profile, setProfile] = useState(profileInicial);
  const [editing, setEditing] = useState(false);

  const nombre = profile.nombre ?? email.split("@")[0] ?? "Atleta";

  return (
    <div className="max-w-2xl">
      <PageHeader
        title="Mi Perfil"
        description="Tu cuenta"
        actions={
          !editing && (
            <Button size="sm" variant="outline" onClick={() => setEditing(true)}>
              Editar
            </Button>
          )
        }
      />

      <div className="space-y-6">
        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 flex items-center gap-4">
          {profile.avatar_url ? (
            // eslint-disable-next-line @next/next/no-img-element -- URL arbitraria pegada por el usuario (avatar como texto, sin Storage/dominio fijo este Sprint)
            <img src={profile.avatar_url} alt="" className="w-14 h-14 rounded-full object-cover flex-shrink-0" />
          ) : (
            <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center flex-shrink-0">
              <span className="text-white font-black text-lg">{iniciales(nombre)}</span>
            </div>
          )}
          <div className="min-w-0">
            <p className="font-black text-white text-lg truncate">{nombre}</p>
            <p className="text-white/50 text-sm truncate">{email}</p>
          </div>
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.06]">
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-white/50 text-sm">Sistema actual</span>
            <span className="text-white text-sm font-semibold">{profile.sistema_actual ?? "Sin asignar"}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-white/50 text-sm">Nivel</span>
            <span className="text-white text-sm font-semibold">{profile.nivel_actual ?? "Sin asignar"}</span>
          </div>
          <div className="flex items-center justify-between px-5 py-4">
            <span className="text-white/50 text-sm">Email verificado</span>
            <span className={`text-sm font-semibold ${emailConfirmado ? "text-emerald-400" : "text-white/50"}`}>
              {emailConfirmado ? "Sí" : "No"}
            </span>
          </div>
        </div>

        {editing ? (
          <PerfilForm
            profile={profile}
            onCancel={() => setEditing(false)}
            onSaved={(actualizado) => {
              setProfile(actualizado);
              setEditing(false);
            }}
          />
        ) : (
          <div className="grid sm:grid-cols-2 gap-4">
            <DashboardCard title="Información personal">
              <div className="divide-y divide-white/[0.06]">
                <Row label="Edad" value={profile.edad ? String(profile.edad) : SIN_ESPECIFICAR} />
                <Row label="Sexo" value={profile.sexo ?? SIN_ESPECIFICAR} />
              </div>
            </DashboardCard>

            <DashboardCard title="Información física">
              <div className="divide-y divide-white/[0.06]">
                <Row label="Peso" value={profile.peso_kg ? `${profile.peso_kg} kg` : SIN_ESPECIFICAR} />
                <Row label="Altura" value={profile.altura_cm ? `${profile.altura_cm} cm` : SIN_ESPECIFICAR} />
              </div>
            </DashboardCard>

            <DashboardCard title="Información deportiva" className="sm:col-span-2">
              <div className="grid sm:grid-cols-2 gap-x-8">
                <div className="divide-y divide-white/[0.06]">
                  <Row label="Objetivo" value={profile.objetivo ?? SIN_ESPECIFICAR} />
                  <Row label="Nivel" value={profile.nivel_experiencia ?? SIN_ESPECIFICAR} />
                  <Row label="Lugar de entrenamiento" value={profile.lugar_entrenamiento ?? SIN_ESPECIFICAR} />
                  <Row label="Experiencia" value={profile.experiencia ?? SIN_ESPECIFICAR} />
                </div>
                <div className="divide-y divide-white/[0.06]">
                  <Row
                    label="Días por semana"
                    value={profile.dias_por_semana ? String(profile.dias_por_semana) : SIN_ESPECIFICAR}
                  />
                  <Row
                    label="Duración por sesión"
                    value={profile.duracion_sesion_min ? `${profile.duracion_sesion_min} min` : SIN_ESPECIFICAR}
                  />
                  <Row label="Lesiones" value={profile.lesiones || SIN_ESPECIFICAR} />
                  <Row label="Observaciones" value={profile.observaciones || SIN_ESPECIFICAR} />
                </div>
              </div>
            </DashboardCard>
          </div>
        )}
      </div>
    </div>
  );
}
