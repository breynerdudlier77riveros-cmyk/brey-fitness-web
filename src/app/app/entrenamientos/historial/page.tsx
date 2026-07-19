import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import { Check, Close, Clock } from "@/components/brand/icons";
import type { WorkoutLog } from "@/lib/types";

export const metadata: Metadata = { title: "Historial" };

export default async function HistorialPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data } = await supabase
    .from("workout_logs")
    .select("id, fecha, duracion_real_min, volumen_total_kg, completado")
    .eq("user_id", user.id)
    .order("fecha", { ascending: false })
    .limit(30);

  const sesiones = (data ?? []) as Pick<
    WorkoutLog,
    "id" | "fecha" | "duracion_real_min" | "volumen_total_kg" | "completado"
  >[];
  const completadas = sesiones.filter((s) => s.completado).length;

  if (sesiones.length === 0) {
    return (
      <DashboardCard>
        <EmptyState icon={Clock} title="Aún no has completado ningún entrenamiento" />
      </DashboardCard>
    );
  }

  return (
    <div>
      <p className="text-white/50 text-xs mb-6">
        <span className="text-white font-bold">{completadas}</span> de {sesiones.length} completadas
      </p>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.06] overflow-hidden">
        {sesiones.map((s) => (
          <div key={s.id} className="flex items-center gap-4 px-5 py-4">
            <span
              className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 border ${
                s.completado ? "bg-emerald-500/15 border-emerald-500/25" : "bg-red-500/10 border-red-500/25"
              }`}
            >
              {s.completado ? (
                <Check className="w-4 h-4 text-emerald-400" strokeWidth={3} />
              ) : (
                <Close className="w-4 h-4 text-red-400" strokeWidth={2.5} />
              )}
            </span>

            <div className="min-w-0 flex-1">
              <p className={`text-sm font-bold ${s.completado ? "text-white" : "text-white/50"}`}>
                {new Date(`${s.fecha}T00:00:00`).toLocaleDateString("es-CO", {
                  weekday: "short",
                  day: "numeric",
                  month: "short",
                })}
              </p>
            </div>

            <div className="text-right flex-shrink-0 hidden sm:block">
              <p className="font-mono text-xs text-white/70 tabular-nums">
                {s.duracion_real_min ? `${s.duracion_real_min} min` : "—"}
              </p>
              <p className="font-mono text-[10px] text-white/45 tabular-nums mt-0.5">
                {s.volumen_total_kg ? `${s.volumen_total_kg} kg` : "—"}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
