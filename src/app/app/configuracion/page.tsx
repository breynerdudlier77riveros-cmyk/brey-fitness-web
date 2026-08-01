import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile/repository";
import ConfiguracionClient from "./ConfiguracionClient";

export const metadata: Metadata = { title: "Configuración" };

export default async function ConfiguracionPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const profile = await getProfile(supabase, user.id);

  return (
    <ConfiguracionClient
      email={user.email ?? ""}
      emailConfirmado={Boolean(user.email_confirmed_at)}
      pesoKg={profile?.peso_kg ?? null}
      alturaCm={profile?.altura_cm ?? null}
    />
  );
}
