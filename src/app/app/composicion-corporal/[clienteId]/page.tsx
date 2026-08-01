import type { Metadata } from "next";
import { redirect, notFound } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { obtenerClientePorId, listarMedicionesVigentesPorCliente, obtenerEnlaceActivoPorCliente } from "@/lib/bcs/repository";
import { getProfile } from "@/lib/profile/repository";
import { construirReporte } from "@/lib/bcs/reporte";
import { analizarComposicionCorporal } from "@/lib/bcs/analysis";
import { fechaISOLocal } from "@/lib/utils";
import ClienteDetailClient from "./ClienteDetailClient";

interface Props {
  params: Promise<{ clienteId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { clienteId } = await params;
  const supabase = await createClient();
  const cliente = await obtenerClientePorId(supabase, clienteId);
  return { title: cliente?.nombre ?? "Cliente" };
}

// Server puro: la RLS de bcs_clientes (auth.uid() = entrenador_id) ya
// garantiza que obtenerClientePorId devuelve null si el cliente no es del
// entrenador autenticado — notFound() cubre tanto "no existe" como "no es
// tuyo", sin distinguirlos (mismo criterio de no revelar de más que UC-09).
export default async function ClienteDetailPage({ params }: Props) {
  const user = await getUser();
  if (!user) redirect("/login");

  const { clienteId } = await params;
  const supabase = await createClient();

  const cliente = await obtenerClientePorId(supabase, clienteId);
  if (!cliente) notFound();

  const [historico, enlaceActivo] = await Promise.all([
    listarMedicionesVigentesPorCliente(supabase, clienteId),
    obtenerEnlaceActivoPorCliente(supabase, clienteId),
  ]);

  const reporte = construirReporte(cliente, historico);
  // Derivado, nunca persistido — se recomputa en cada render, igual que el
  // Reporte. `hoyISO` explícito: la capa de análisis no consulta el reloj.
  const hoyISO = fechaISOLocal();
  const analisis = reporte ? analizarComposicionCorporal(historico, { hoyISO }) : null;

  // Nombre del profesional para la portada del reporte impreso. Es identidad
  // del propio entrenador (su fila de `profiles`), no un dato de Core
  // Training: no cruza el límite de contexto con el BCS.
  const perfil = await getProfile(supabase, user.id);
  const entrenador = perfil?.nombre ?? user.email ?? undefined;

  return (
    <ClienteDetailClient
      cliente={cliente}
      reporte={reporte}
      analisis={analisis}
      enlaceActivo={enlaceActivo}
      generadoEl={hoyISO}
      entrenador={entrenador}
    />
  );
}
