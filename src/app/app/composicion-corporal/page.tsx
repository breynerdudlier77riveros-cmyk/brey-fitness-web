import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { listarClientesPorEntrenador, listarMedicionesVigentesPorCliente, obtenerEnlaceActivoPorCliente } from "@/lib/bcs/repository";
import DashboardClient from "./DashboardClient";

export const metadata: Metadata = { title: "Composición Corporal" };

const DIAS_ACTIVIDAD_RECIENTE = 30;
const MAX_RECIENTES = 6;

// Server puro (mismo criterio que app/app/perfil/page.tsx): una carga de
// datos, hidratada una sola vez hacia el Client Component. La "actividad
// reciente" y el conteo de "mediciones esta semana" (Zona 1/07) exigen la
// última Medición de cada Cliente — no existe una consulta agregada en el
// repositorio (Sprint 2, congelado: solo listarMedicionesVigentesPorCliente
// por UN cliente a la vez) y este Sprint no puede añadirla ahí. Se resuelve
// componiendo llamadas ya existentes en paralelo, acotado a los clientes que
// ya trae la página (límite 50 del propio repositorio) — ver limitación de
// paginación en el informe del Sprint.
export default async function ComposicionCorporalPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const clientes = await listarClientesPorEntrenador(supabase, user.id, { estado: "activo" });

  const conUltimaMedicion = await Promise.all(
    clientes.map(async (cliente) => {
      const [ultima] = await listarMedicionesVigentesPorCliente(supabase, cliente.id, { limit: 1 });
      return { cliente, ultimaFecha: ultima?.fecha ?? null };
    })
  );

  const hoy = new Date();
  const haceNDias = (n: number) => {
    const d = new Date(hoy);
    d.setDate(d.getDate() - n);
    return d.toISOString().slice(0, 10);
  };
  const inicioSemana = haceNDias(7);
  const inicioVentanaActividad = haceNDias(DIAS_ACTIVIDAD_RECIENTE);

  const medicionesEstaSemana = conUltimaMedicion.filter((c) => c.ultimaFecha && c.ultimaFecha >= inicioSemana).length;

  const ordenados = [...conUltimaMedicion].sort((a, b) => {
    if (!a.ultimaFecha && !b.ultimaFecha) return 0;
    if (!a.ultimaFecha) return 1;
    if (!b.ultimaFecha) return -1;
    return b.ultimaFecha.localeCompare(a.ultimaFecha);
  });

  const recientes = ordenados.filter((c) => c.ultimaFecha && c.ultimaFecha >= inicioVentanaActividad).slice(0, MAX_RECIENTES);
  const recientesIds = new Set(recientes.map((c) => c.cliente.id));
  const resto = ordenados.filter((c) => !recientesIds.has(c.cliente.id));

  const enlacesActivos = await Promise.all(
    recientes.map(async ({ cliente }) => {
      const enlace = await obtenerEnlaceActivoPorCliente(supabase, cliente.id);
      return [cliente.id, Boolean(enlace)] as const;
    })
  );
  const enlaceActivoPorCliente = Object.fromEntries(enlacesActivos);

  return (
    <DashboardClient
      totalActivos={clientes.length}
      medicionesEstaSemana={medicionesEstaSemana}
      recientes={recientes.map((r) => r.cliente)}
      resto={resto.map((r) => r.cliente)}
      enlaceActivoPorCliente={enlaceActivoPorCliente}
    />
  );
}
