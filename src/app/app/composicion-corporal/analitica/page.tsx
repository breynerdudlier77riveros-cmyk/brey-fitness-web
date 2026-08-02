import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import {
  listarClientesPorEntrenador,
  listarMedicionesPorEntrenador,
  listarEnlacesPorEntrenador,
} from "@/lib/bcs/repository";
import { construirDashboard, contarPorFiltro } from "@/lib/bcs/dashboard";
import { indexarClientes } from "@/lib/bcs/dashboard/clientes";
import { fechaISOLocal } from "@/lib/utils";
import AnaliticaClient from "./AnaliticaClient";

export const metadata: Metadata = { title: "Analítica" };

// Server puro. Tres lecturas en paralelo cubren todo el consultorio: la de
// mediciones y la de enlaces son las agregadas añadidas en este Sprint, que
// evitan el N+1 que tendría llamar por cliente y permiten contar anuladas y
// revocados —los filtros por estado de las funciones anteriores los excluyen
// por contrato.
export default async function AnaliticaPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();

  const [clientes, mediciones, enlaces] = await Promise.all([
    // Sin filtro de estado: la analítica necesita también los archivados.
    listarClientesPorEntrenador(supabase, user.id, { limit: 500 }),
    listarMedicionesPorEntrenador(supabase, user.id),
    listarEnlacesPorEntrenador(supabase, user.id),
  ]);

  const hoyISO = fechaISOLocal();
  const entrada = { clientes, mediciones, enlaces, hoyISO };

  const analytics = construirDashboard(entrada);
  // El recuento por filtro se calcula aquí, no en el cliente: el índice ya
  // está construido en servidor y rehacerlo en el navegador sería trabajo
  // duplicado sobre los mismos datos.
  const conteoFiltros = contarPorFiltro(indexarClientes(entrada));

  return <AnaliticaClient analytics={analytics} conteoFiltros={conteoFiltros} />;
}
