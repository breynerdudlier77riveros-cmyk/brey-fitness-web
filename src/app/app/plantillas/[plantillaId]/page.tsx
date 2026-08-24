import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";

import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { listarClientesPorEntrenador } from "@/lib/bcs/repository";
import { listarEnlaces, obtenerPlantillaPorId } from "@/lib/plantillas/repository";
import { ejercicios as CATALOGO } from "@/data/exercises";
import { SITE_URL } from "@/lib/site";
import PlantillaEditorClient from "./PlantillaEditorClient";

interface Props {
  params: Promise<{ plantillaId: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { plantillaId } = await params;
  const user = await getUser();
  if (!user) return { title: "Plantilla" };

  const supabase = await createClient();
  const plantilla = await obtenerPlantillaPorId(supabase, plantillaId);
  return { title: plantilla?.nombre ?? "Plantilla" };
}

// Server puro. El ownership NO se comprueba aquí: la RLS de `plantillas`
// acota la lectura a `auth.uid() = entrenador_id`, así que el id de otro
// devuelve null y sale 404. Repetir el chequeo en TypeScript añadiría una
// segunda fuente de verdad que podría discrepar de la primera (FT-01/BE-04).
export default async function PlantillaPage({ params }: Props) {
  const { plantillaId } = await params;

  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const plantilla = await obtenerPlantillaPorId(supabase, plantillaId);
  if (!plantilla) notFound();

  // Los clientes se leen para poder asignarles la plantilla. Es la única
  // dependencia entre este subsistema y el BCS, y va en un solo sentido:
  // plantillas lee la lista de clientes, el BCS no sabe que esto existe.
  const [enlaces, clientes] = await Promise.all([
    listarEnlaces(supabase, plantilla.id),
    listarClientesPorEntrenador(supabase, user.id, { estado: "activo" }),
  ]);

  return (
    <PlantillaEditorClient
      plantilla={plantilla}
      enlaces={enlaces}
      clientes={clientes.map((c) => ({ id: c.id, nombre: c.nombre }))}
      catalogo={CATALOGO.map((e) => ({ nombre: e.nombre, slug: e.slug }))}
      baseUrl={SITE_URL}
    />
  );
}
