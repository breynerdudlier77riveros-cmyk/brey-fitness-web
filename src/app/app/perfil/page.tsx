import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile/repository";
import PerfilClient from "./PerfilClient";
import type { Profile } from "@/lib/types";

export const metadata: Metadata = { title: "Mi Perfil" };

// Server puro: una sola query trae la fila completa y se hidrata UNA VEZ
// hacia PerfilClient — nada de useEffect para cargar datos que ya llegan
// del servidor. app/app/layout.tsx ya garantiza que el perfil existe
// (getOrCreateProfile) antes de que cualquier página de /app se renderice
// — el fallback de abajo es un segundo cinturón de seguridad, no la vía
// principal.
export default async function PerfilPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const profile = await getProfile(supabase, user.id);

  const perfil: Profile =
    profile ?? {
      id: user.id,
      email: user.email ?? null,
      nombre: user.email?.split("@")[0] ?? "Atleta",
      avatar_url: null,
      sistema_actual: null,
      nivel_actual: null,
      edad: null,
      sexo: null,
      peso_kg: null,
      altura_cm: null,
      objetivo: null,
      nivel_experiencia: null,
      lugar_entrenamiento: null,
      dias_por_semana: null,
      duracion_sesion_min: null,
      experiencia: null,
      lesiones: null,
      observaciones: null,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

  return (
    <PerfilClient
      profile={perfil}
      email={user.email ?? ""}
      emailConfirmado={Boolean(user.email_confirmed_at)}
    />
  );
}
