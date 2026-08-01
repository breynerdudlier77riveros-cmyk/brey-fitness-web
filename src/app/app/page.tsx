import type { Metadata } from "next";
import Link from "next/link";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { getOrCreateProfile } from "@/lib/profile/repository";
import { getWorkoutDelDia, getWorkoutLogsEnRango } from "@/lib/workouts/repository";
import { getDiagnosisVigente } from "@/lib/diagnostico/repository";
import { getEventos } from "@/lib/progression/repository";
import { listarClientesPorEntrenador } from "@/lib/bcs/repository";
import { derivarEstadoBPS } from "@/lib/ciclo/estado";
import { getSistemaBySlug } from "@/data/sistemas";
import { fechaISOLocal } from "@/lib/utils";

import Section from "@/components/app/Section";
import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import ProfileCard from "@/components/app/ProfileCard";
import ProgramCard from "@/components/app/ProgramCard";
import DiagnosisCard from "@/components/app/DiagnosisCard";
import WorkoutCard from "@/components/app/WorkoutCard";
import ProgressCard from "@/components/app/ProgressCard";
import MeasurementCard from "@/components/app/MeasurementCard";
import ModuleStatusCard from "@/components/app/ModuleStatusCard";
import QuickActionsCard, { type QuickAction } from "@/components/app/QuickActionsCard";
import NotificationCard from "@/components/app/NotificationCard";
import { Flag, UserIcon, Calendar, Scale } from "@/components/brand/icons";

export const metadata: Metadata = { title: "Dashboard" };

/** Lunes de la semana de `d`, 00:00 local — mismo cálculo que progreso/page.tsx. */
function inicioSemana(d: Date) {
  const dia = d.getDay() === 0 ? 7 : d.getDay(); // 1=lunes..7=domingo
  const inicio = new Date(d);
  inicio.setDate(inicio.getDate() - (dia - 1));
  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

export default async function DashboardPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const inicioSemanaActual = inicioSemana(new Date());
  const inicioSemanaAnterior = new Date(inicioSemanaActual);
  inicioSemanaAnterior.setDate(inicioSemanaAnterior.getDate() - 7);
  const finSemanaAnterior = new Date(inicioSemanaActual);
  finSemanaAnterior.setDate(finSemanaAnterior.getDate() - 1);

  // Seis lecturas independientes — capa Datos, ninguna requiere las otras.
  const [profile, diagnosticoVigente, eventos, workoutHoy, logsRecientes, clientesBCS] = await Promise.all([
    getOrCreateProfile(supabase, user.id, {
      email: user.email ?? null,
      nombre: user.email?.split("@")[0] ?? "Atleta",
    }),
    getDiagnosisVigente(supabase, user.id),
    getEventos(supabase, user.id),
    getWorkoutDelDia(supabase, user.id, fechaISOLocal()),
    getWorkoutLogsEnRango(supabase, user.id, fechaISOLocal(inicioSemanaAnterior)),
    listarClientesPorEntrenador(supabase, user.id, { estado: "activo" }),
  ]);

  const nombre = profile.nombre ?? user.email?.split("@")[0] ?? "Atleta";
  const sistema = profile.sistema_actual ? getSistemaBySlug(profile.sistema_actual) : undefined;

  // Orquestación pura, capa Application — no reimplementa la FSM del Motor BPS.
  const estadoBPS = derivarEstadoBPS(eventos, profile, Boolean(diagnosticoVigente));

  const inicioActualISO = fechaISOLocal(inicioSemanaActual);
  const inicioAnteriorISO = fechaISOLocal(inicioSemanaAnterior);
  const finAnteriorISO = fechaISOLocal(finSemanaAnterior);

  const logsSemanaActual = logsRecientes.filter((l) => l.fecha >= inicioActualISO);
  const logsSemanaAnterior = logsRecientes.filter(
    (l) => l.fecha >= inicioAnteriorISO && l.fecha <= finAnteriorISO
  );
  const semanaActualKg = Math.round(
    logsSemanaActual.reduce((acc, l) => acc + (l.volumen_total_kg ?? 0), 0)
  );
  const semanaAnteriorKg = Math.round(
    logsSemanaAnterior.reduce((acc, l) => acc + (l.volumen_total_kg ?? 0), 0)
  );
  const entrenamientosCompletados = logsRecientes.filter((l) => l.completado).length;

  const fechaLarga = new Date().toLocaleDateString("es-CO", {
    weekday: "long",
    day: "numeric",
    month: "long",
  });

  const acciones: QuickAction[] = [
    { label: "Diagnóstico", href: "/diagnostico", icon: Flag },
    { label: "Mi Perfil", href: "/app/perfil", icon: UserIcon },
    { label: "Calendario", href: "/app/entrenamientos/calendario", icon: Calendar },
    { label: "Comp. Corporal", href: "/app/composicion-corporal", icon: Scale },
  ];

  return (
    <div className="space-y-10">
      {/* 1. Bienvenida */}
      <div>
        <p className="text-white/50 text-sm capitalize">{fechaLarga}</p>
        <h1 className="font-black text-2xl sm:text-3xl text-white mt-1">Hola, {nombre}.</h1>
      </div>

      {/* 2. Resumen: perfil + estado del programa */}
      <Section label="Resumen">
        <div className="grid sm:grid-cols-2 gap-4">
          <ProfileCard profile={profile} />
          <ProgramCard estado={estadoBPS.estado} />
        </div>
      </Section>

      {/* 3. Sistema asignado + último diagnóstico */}
      <Section label="Sistema y Diagnóstico">
        <div className="grid sm:grid-cols-2 gap-4">
          {sistema ? (
            <Link href="/app/sistema" className="block group h-full">
              <DashboardCard interactive className="h-full">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-11 h-11 rounded-2xl border flex items-center justify-center flex-shrink-0 ${sistema.color.badge}`}
                  >
                    <sistema.icon className="w-5 h-5" strokeWidth={1.75} />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="font-black text-white text-sm truncate">{sistema.nombre}</p>
                    <p className="text-white/50 text-xs mt-0.5 truncate">{sistema.tagline}</p>
                  </div>
                </div>
              </DashboardCard>
            </Link>
          ) : (
            <DashboardCard className="h-full">
              <EmptyState
                icon={Flag}
                title="No tienes un sistema asignado"
                description="El Diagnóstico BPS analiza tu nivel y objetivo para recomendarte el Sistema correcto."
                actionLabel="Realizar Diagnóstico BPS"
                actionHref="/diagnostico"
              />
            </DashboardCard>
          )}
          <DiagnosisCard diagnostico={diagnosticoVigente} />
        </div>
      </Section>

      {/* 4. Entrenamiento de hoy */}
      <Section label="Entrenamiento de hoy">
        <WorkoutCard workout={workoutHoy} />
      </Section>

      {/* 5. Evolución rápida + última medición */}
      <Section label="Progreso">
        <div className="grid sm:grid-cols-2 gap-4">
          <ProgressCard
            semanaActualKg={semanaActualKg}
            semanaAnteriorKg={semanaAnteriorKg}
            entrenamientosCompletados={entrenamientosCompletados}
          />
          <MeasurementCard totalClientesActivos={clientesBCS.length} />
        </div>
      </Section>

      {/* 6. Módulos disponibles */}
      <Section label="Módulos">
        <ModuleStatusCard />
      </Section>

      {/* 7. Accesos rápidos + notificaciones */}
      <Section label="Acciones rápidas">
        <div className="space-y-4">
          <QuickActionsCard actions={acciones} />
          <NotificationCard />
        </div>
      </Section>
    </div>
  );
}
