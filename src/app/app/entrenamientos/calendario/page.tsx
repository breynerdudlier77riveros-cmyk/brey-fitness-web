import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { fechaISOLocal } from "@/lib/utils";
import CalendarioGrid, { type CeldaDia, type EstadoDia } from "@/components/app/CalendarioGrid";

export const metadata: Metadata = { title: "Calendario" };

// 5 filas de semanas reales (lunes-domingo) alineadas a hoy — 4 semanas
// pasadas + la semana actual — en vez de una grilla de mes calendario, que
// arrastra días sobrantes del mes anterior/siguiente. Un día SIN fila en
// `workouts` ES el descanso (más normalizado que un estado "descanso"
// explícito) — ver supabase/schema.sql. "Hoy" nunca se persiste: se
// calcula comparando cada fecha contra la fecha actual en CalendarioGrid.
function construirSemanas(hoy: Date): { semanas: Date[][]; inicio: Date; fin: Date } {
  const diaISO = hoy.getDay() === 0 ? 7 : hoy.getDay(); // 1=lunes..7=domingo
  const inicio = new Date(hoy);
  inicio.setDate(inicio.getDate() - (diaISO - 1) - 4 * 7);

  const semanas: Date[][] = [];
  for (let semana = 0; semana < 5; semana++) {
    const fila: Date[] = [];
    for (let dia = 0; dia < 7; dia++) {
      const fecha = new Date(inicio);
      fecha.setDate(fecha.getDate() + semana * 7 + dia);
      fila.push(fecha);
    }
    semanas.push(fila);
  }

  const fin = semanas[4][6];
  return { semanas, inicio, fin };
}

export default async function CalendarioPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);
  const { semanas: fechas, inicio, fin } = construirSemanas(hoy);

  const supabase = await createClient();
  const { data: workouts } = await supabase
    .from("workouts")
    .select("fecha_planificada, nombre, estado")
    .eq("user_id", user.id)
    .gte("fecha_planificada", fechaISOLocal(inicio))
    .lte("fecha_planificada", fechaISOLocal(fin));

  const porFecha = new Map<string, { nombre: string; estado: EstadoDia }>(
    (workouts ?? []).map((w) => [w.fecha_planificada as string, { nombre: w.nombre as string, estado: w.estado as EstadoDia }])
  );

  const semanas: CeldaDia[][] = fechas.map((fila) =>
    fila.map((fecha) => {
      const fechaISO = fechaISOLocal(fecha);
      const match = porFecha.get(fechaISO);
      return { fechaISO, estado: match?.estado ?? "descanso", sesion: match?.nombre ?? null };
    })
  );

  return (
    <div>
      <p className="text-white/50 text-sm mb-6">Últimas 5 semanas</p>
      <CalendarioGrid semanas={semanas} hoyISO={fechaISOLocal(hoy)} />
    </div>
  );
}
