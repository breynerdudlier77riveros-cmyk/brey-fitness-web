import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { getWorkoutLogsEnRango } from "@/lib/workouts/repository";
import { fechaISOLocal } from "@/lib/utils";
import PageHeader from "@/components/app/PageHeader";
import DashboardCard from "@/components/app/DashboardCard";
import MetricCard from "@/components/app/MetricCard";
import EmptyState from "@/components/app/EmptyState";
import ProgresoChart from "@/components/app/ProgresoChart";
import { TrendingUp } from "@/components/brand/icons";

export const metadata: Metadata = { title: "Progreso" };

const SEMANAS = 8;

function inicioSemana(d: Date) {
  const dia = d.getDay() === 0 ? 7 : d.getDay(); // 1=lunes..7=domingo
  const inicio = new Date(d);
  inicio.setDate(inicio.getDate() - (dia - 1));
  inicio.setHours(0, 0, 0, 0);
  return inicio;
}

export default async function ProgresoPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const inicioActual = inicioSemana(new Date());
  const inicioRango = new Date(inicioActual);
  inicioRango.setDate(inicioRango.getDate() - (SEMANAS - 1) * 7);

  const supabase = await createClient();
  // getWorkoutLogsEnRango pasa volumen_total_kg por numOrNull() — antes de
  // este Sprint, este reduce() sumaba el string que devuelve PostgREST para
  // columnas `numeric` (coerción de `+` de JS: 0 + "1000" = "01000", no
  // 1000), un bug real que ya no puede reproducirse desde aquí.
  const logs = await getWorkoutLogsEnRango(supabase, user.id, fechaISOLocal(inicioRango));

  if (logs.length === 0) {
    return (
      <div>
        <PageHeader title="Progreso" description="Tonelaje semanal a lo largo del tiempo." />
        <DashboardCard>
          <EmptyState
            icon={TrendingUp}
            title="Aún no tienes datos de progreso"
            description="Cuando completes tus primeros entrenamientos, tu tonelaje semanal aparecerá aquí."
          />
        </DashboardCard>
      </div>
    );
  }

  const semanas = Array.from({ length: SEMANAS }, (_, i) => {
    const inicio = new Date(inicioRango);
    inicio.setDate(inicio.getDate() + i * 7);
    const fin = new Date(inicio);
    fin.setDate(fin.getDate() + 6);
    const inicioISO = fechaISOLocal(inicio);
    const finISO = fechaISOLocal(fin);
    const kg = logs
      .filter((l) => l.fecha >= inicioISO && l.fecha <= finISO)
      .reduce((acc, l) => acc + (l.volumen_total_kg ?? 0), 0);
    return { etiqueta: `S${i + 1}`, kg: Math.round(kg) };
  });

  const primera = semanas[0].kg || 1;
  const ultima = semanas[semanas.length - 1].kg;
  const tendencia = Math.round(((ultima - primera) / primera) * 100);
  const promedio = Math.round(semanas.reduce((acc, s) => acc + s.kg, 0) / semanas.length);

  return (
    <div>
      <PageHeader title="Progreso" description={`Últimas ${SEMANAS} semanas`} />

      <div className="grid grid-cols-3 gap-3 mb-8">
        <MetricCard label="Tendencia" value={`${tendencia >= 0 ? "+" : ""}${tendencia}%`} />
        <MetricCard label="Promedio semanal" value={`${promedio} kg`} />
        <MetricCard label="Semana actual" value={`${ultima} kg`} />
      </div>

      <ProgresoChart semanas={semanas} />
    </div>
  );
}
