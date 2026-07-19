"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import { updateProfile } from "@/lib/profile/repository";
import DashboardCard from "@/components/app/DashboardCard";
import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import Select from "@/components/brand/Select";
import Textarea from "@/components/brand/Textarea";
import { toast } from "@/components/brand/Toast";
import { Spinner } from "@/components/brand/icons";
import {
  SEXO_OPCIONES,
  OBJETIVO_OPCIONES,
  NIVEL_OPCIONES,
  LUGAR_OPCIONES,
  EXPERIENCIA_OPCIONES,
  validarPerfil,
  buildUpdatePayload,
  type PerfilFormValues,
  type PerfilErrores,
} from "@/lib/perfil/perfil";
import type { Profile } from "@/lib/types";

// Mismo patrón de estado que ContactoForm.tsx (useState por campo + enum de
// estado) — sin useActionState: no hay precedente de eso en el repo y este
// Sprint pide seguir exactamente la arquitectura existente. La escritura va
// directo al cliente-browser de Supabase (mismo camino que LoginForm/
// SignupForm) vía el repositorio de perfil — RLS ya es la barrera real y
// los CHECK constraints de Postgres son la barrera real de integridad.

interface Props {
  profile: Profile;
  onCancel: () => void;
  onSaved: (profile: Profile) => void;
}

type Estado = "idle" | "guardando" | "error";

function aFormValues(p: Profile): PerfilFormValues {
  return {
    nombre: p.nombre ?? "",
    avatar_url: p.avatar_url ?? "",
    edad: p.edad?.toString() ?? "",
    sexo: p.sexo ?? "",
    peso_kg: p.peso_kg?.toString() ?? "",
    altura_cm: p.altura_cm?.toString() ?? "",
    objetivo: p.objetivo ?? "",
    nivel_experiencia: p.nivel_experiencia ?? "",
    lugar_entrenamiento: p.lugar_entrenamiento ?? "",
    dias_por_semana: p.dias_por_semana?.toString() ?? "",
    duracion_sesion_min: p.duracion_sesion_min?.toString() ?? "",
    experiencia: p.experiencia ?? "",
    lesiones: p.lesiones ?? "",
    observaciones: p.observaciones ?? "",
  };
}

interface FieldProps {
  label: string;
  htmlFor?: string;
  error?: string;
  children: React.ReactNode;
}

function Field({ label, htmlFor, error, children }: FieldProps) {
  return (
    <div>
      <label htmlFor={htmlFor} className="block text-xs font-semibold text-white/60 mb-1.5">
        {label}
      </label>
      {children}
      {error && <p className="text-red-400 text-xs mt-1">{error}</p>}
    </div>
  );
}

export default function PerfilForm({ profile, onCancel, onSaved }: Props) {
  const router = useRouter();
  const [values, setValues] = useState<PerfilFormValues>(() => aFormValues(profile));
  const [errores, setErrores] = useState<PerfilErrores>({});
  const [estado, setEstado] = useState<Estado>("idle");

  function set<K extends keyof PerfilFormValues>(campo: K, valor: string) {
    setValues((prev) => ({ ...prev, [campo]: valor }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (estado === "guardando") return;

    const erroresValidacion = validarPerfil(values);
    setErrores(erroresValidacion);
    if (Object.keys(erroresValidacion).length > 0) return;

    setEstado("guardando");

    const supabase = createClient();
    const actualizado = await updateProfile(supabase, profile.id, buildUpdatePayload(values));

    if (!actualizado) {
      setEstado("error");
      toast.error("No se pudo guardar tu perfil.");
      return;
    }

    setEstado("idle");
    toast.success("Perfil actualizado.");
    // Sidebar/Header leen nombre/avatar desde app/app/layout.tsx (Server
    // Component ya cacheado) — refresh() los sincroniza también, no solo
    // esta página (que ya se actualiza vía onSaved, sin esperar la red).
    router.refresh();
    onSaved(actualizado);
  }

  const guardando = estado === "guardando";

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <DashboardCard title="Información personal">
          <div className="space-y-4">
            <Field label="Nombre" htmlFor="nombre" error={errores.nombre}>
              <Input id="nombre" required value={values.nombre} onChange={(e) => set("nombre", e.target.value)} />
            </Field>
            <Field label="Avatar (URL de imagen)" htmlFor="avatar_url">
              <Input
                id="avatar_url"
                type="url"
                placeholder="https://…"
                value={values.avatar_url}
                onChange={(e) => set("avatar_url", e.target.value)}
              />
            </Field>
            <Field label="Edad" htmlFor="edad">
              <Input id="edad" type="number" value={values.edad} onChange={(e) => set("edad", e.target.value)} />
            </Field>
            <Field label="Sexo" htmlFor="sexo">
              <Select
                id="sexo"
                value={values.sexo}
                onValueChange={(v) => set("sexo", v)}
                options={[...SEXO_OPCIONES]}
                placeholder="Seleccionar"
                aria-label="Sexo"
              />
            </Field>
          </div>
        </DashboardCard>

        <DashboardCard title="Información física">
          <div className="space-y-4">
            <Field label="Peso (kg)" htmlFor="peso_kg" error={errores.peso_kg}>
              <Input
                id="peso_kg"
                type="number"
                step="0.1"
                value={values.peso_kg}
                onChange={(e) => set("peso_kg", e.target.value)}
              />
            </Field>
            <Field label="Altura (cm)" htmlFor="altura_cm" error={errores.altura_cm}>
              <Input
                id="altura_cm"
                type="number"
                step="0.1"
                value={values.altura_cm}
                onChange={(e) => set("altura_cm", e.target.value)}
              />
            </Field>
          </div>
        </DashboardCard>

        <DashboardCard title="Información deportiva" className="sm:col-span-2">
          <div className="grid sm:grid-cols-2 gap-4">
            <Field label="Objetivo" htmlFor="objetivo">
              <Select
                id="objetivo"
                value={values.objetivo}
                onValueChange={(v) => set("objetivo", v)}
                options={[...OBJETIVO_OPCIONES]}
                placeholder="Seleccionar"
                aria-label="Objetivo"
              />
            </Field>
            <Field label="Nivel" htmlFor="nivel_experiencia">
              <Select
                id="nivel_experiencia"
                value={values.nivel_experiencia}
                onValueChange={(v) => set("nivel_experiencia", v)}
                options={[...NIVEL_OPCIONES]}
                placeholder="Seleccionar"
                aria-label="Nivel"
              />
            </Field>
            <Field label="Lugar de entrenamiento" htmlFor="lugar_entrenamiento">
              <Select
                id="lugar_entrenamiento"
                value={values.lugar_entrenamiento}
                onValueChange={(v) => set("lugar_entrenamiento", v)}
                options={[...LUGAR_OPCIONES]}
                placeholder="Seleccionar"
                aria-label="Lugar de entrenamiento"
              />
            </Field>
            <Field label="Experiencia" htmlFor="experiencia">
              <Select
                id="experiencia"
                value={values.experiencia}
                onValueChange={(v) => set("experiencia", v)}
                options={[...EXPERIENCIA_OPCIONES]}
                placeholder="Seleccionar"
                aria-label="Experiencia"
              />
            </Field>
            <Field label="Días por semana" htmlFor="dias_por_semana" error={errores.dias_por_semana}>
              <Input
                id="dias_por_semana"
                type="number"
                value={values.dias_por_semana}
                onChange={(e) => set("dias_por_semana", e.target.value)}
              />
            </Field>
            <Field label="Duración por sesión (min)" htmlFor="duracion_sesion_min" error={errores.duracion_sesion_min}>
              <Input
                id="duracion_sesion_min"
                type="number"
                value={values.duracion_sesion_min}
                onChange={(e) => set("duracion_sesion_min", e.target.value)}
              />
            </Field>
            <Field label="Lesiones" htmlFor="lesiones">
              <Textarea
                id="lesiones"
                rows={2}
                placeholder="Ninguna"
                value={values.lesiones}
                onChange={(e) => set("lesiones", e.target.value)}
              />
            </Field>
            <Field label="Observaciones" htmlFor="observaciones">
              <Textarea
                id="observaciones"
                rows={2}
                value={values.observaciones}
                onChange={(e) => set("observaciones", e.target.value)}
              />
            </Field>
          </div>
        </DashboardCard>
      </div>

      {estado === "error" && (
        <p className="text-red-400 text-xs">No pudimos guardar los cambios. Inténtalo de nuevo.</p>
      )}

      <div className="flex items-center gap-3">
        <Button type="submit" size="md" disabled={guardando}>
          {guardando ? (
            <>
              <Spinner className="w-4 h-4 animate-spin" strokeWidth={2.5} />
              Guardando…
            </>
          ) : (
            "Guardar cambios"
          )}
        </Button>
        <Button type="button" variant="outline" size="md" onClick={onCancel} disabled={guardando}>
          Cancelar
        </Button>
      </div>
    </form>
  );
}
