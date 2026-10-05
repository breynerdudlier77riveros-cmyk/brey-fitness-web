import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile/repository";
import { listar } from "@/lib/anamnesis/repository";
import PageHeader from "@/components/app/PageHeader";
import ListaAnamnesis from "@/features/anamnesis/components/ListaAnamnesis";

export const metadata: Metadata = { title: "Anamnesis" };

export default async function AdminAnamnesisPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const profile = await getProfile(supabase, user.id);
  if (!profile?.es_admin) redirect("/app");

  const registros = await listar(supabase, user.id);

  return (
    <div>
      <PageHeader
        title="Anamnesis"
        description="Una ficha por cliente. Lo que no se llene en pantalla queda en blanco en el PDF, listo para completar a mano."
      />
      <ListaAnamnesis registrosIniciales={registros} />
    </div>
  );
}
