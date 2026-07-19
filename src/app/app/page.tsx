import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile/repository";
import { getWorkoutDelDia, getWorkoutLogs } from "@/lib/workouts/repository";
import { getSistemaBySlug } from "@/data/sistemas";
import { fechaISOLocal } from "@/lib/utils";
import Section from "@/components/app/Section";
import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import Button from "@/components/brand/Button";
import { Flag, Bolt, Target, TrendingUp, ArrowRight } from "@/components/brand/icons";

export const metadata: Metadata = { title: "Dashboard" };

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const [profile, hoy, logs] = await Promise.all([
    getProfile(supabase, user.id),
    getWorkoutDelDia(supabase, user.id, fechaISOLocal()),
    getWorkoutLogs(supabase, user.id, { limit: 5 }),
  ]);

  const nombre = profile?.nombre ?? user.email?.split("@")[0] ?? "Atleta";
  const sistema = profile?.sistema_actual ? getSistemaBySlug(profile.sistema_actual) : undefined;

  const fechaLarga = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  return (
    <div className="space-y-10">
      {/* 1. Bienvenida */}
      <div>
        <p className="text-white/50 text-sm capitalize">{fechaLarga}</p>
        <h1 className="font-black text-2xl sm:text-3xl text-white mt-1">Hola, {nombre}.</h1>
      </div>

      {/* 2. Sistema actual */}
      <Section label="Mi Sistema">
        {sistema ? (
          <Link href="/app/sistema" className="block group">
            <DashboardCard className="hover:border-white/[0.14] hover:bg-white/[0.04] transition-all duration-300">
              <div className="flex items-center gap-4">
                <div className={`w-11 h-11 rounded-2xl border flex items-center justify-center flex-shrink-0 ${sistema.color.badge}`}>
                  <sistema.icon className="w-5 h-5" strokeWidth={1.75} />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-black text-white text-sm truncate">{sistema.nombre}</p>
                  <p className="text-white/50 text-xs mt-0.5 truncate">{sistema.tagline}</p>
                </div>
                <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-orange-400 transition-colors flex-shrink-0" strokeWidth={2.5} />
              </div>
            </DashboardCard>
          </Link>
        ) : (
          <DashboardCard>
            <EmptyState
              icon={Flag}
              title="No tienes un sistema asignado"
              description="El Diagnóstico BPS analiza tu nivel y objetivo para recomendarte el Sistema correcto."
              actionLabel="Realizar Diagnóstico BPS"
              actionHref="/diagnostico"
            />
          </DashboardCard>
        )}
      </Section>

      {/* 3. Entrenamiento de hoy */}
      <Section label="Entrenamiento de hoy">
        {hoy ? (
          <DashboardCard>
            <div className="flex items-center justify-between gap-4 mb-1">
              <p className="font-black text-white text-sm">{hoy.nombre}</p>
              {hoy.duracion_estimada_min && (
                <span className="text-white/50 text-xs flex-shrink-0">{hoy.duracion_estimada_min} min</span>
              )}
            </div>
            {hoy.semana && hoy.semana_total && (
              <p className="text-white/50 text-xs mb-4">
                Semana {hoy.semana} de {hoy.semana_total}
              </p>
            )}
            <p className="text-white/40 text-xs">{hoy.ejercicios.length} ejercicios planificados</p>
          </DashboardCard>
        ) : (
          <DashboardCard>
            <EmptyState icon={Bolt} title="Aún no tienes un entrenamiento programado" />
          </DashboardCard>
        )}
      </Section>

      <div className="grid sm:grid-cols-2 gap-4">
        {/* 4. Objetivo */}
        <Section label="Objetivo">
          <DashboardCard className="h-full">
            <EmptyState
              icon={Target}
              title="Completar perfil"
              description="Define tu objetivo principal para hacerle seguimiento aquí."
              actionLabel="Ir a Mi Perfil"
              actionHref="/app/perfil"
            />
          </DashboardCard>
        </Section>

        {/* 5. Actividad reciente */}
        <Section label="Actividad reciente">
          <DashboardCard className="h-full">
            {logs.length > 0 ? (
              <div className="divide-y divide-white/[0.06] -my-2">
                {logs.map((log) => (
                  <div key={log.id} className="flex items-center justify-between gap-3 py-2.5 first:pt-0 last:pb-0">
                    <span className="text-white/70 text-xs">
                      {new Date(log.fecha).toLocaleDateString("es-CO", { day: "numeric", month: "short" })}
                    </span>
                    <span className="text-white text-xs font-semibold">
                      {log.completado ? "Completado" : "Incompleto"}
                    </span>
                  </div>
                ))}
              </div>
            ) : (
              <EmptyState icon={TrendingUp} title="Aún no hay actividad reciente" />
            )}
          </DashboardCard>
        </Section>
      </div>

      <div>
        <Button href="/diagnostico" variant="outline" size="sm">
          Comenzar Diagnóstico BPS
          <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
        </Button>
      </div>
    </div>
  );
}
