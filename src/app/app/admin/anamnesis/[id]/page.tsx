import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile/repository";
import { obtener } from "@/lib/anamnesis/repository";
import EditorAnamnesis from "@/features/anamnesis/components/EditorAnamnesis";
import "@/features/anamnesis/print.css";

export const metadata: Metadata = { title: "Ficha de anamnesis" };

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditarAnamnesisPage({ params }: Props) {
  const { id } = await params;

  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const profile = await getProfile(supabase, user.id);
  if (!profile?.es_admin) redirect("/app");

  const registro = await obtener(supabase, id);
  if (!registro) notFound();

  return <EditorAnamnesis id={id} contenidoInicial={registro.contenido} />;
}
