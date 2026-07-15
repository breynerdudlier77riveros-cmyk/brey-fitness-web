import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { iniciales } from "@/lib/utils";

export const metadata: Metadata = { title: "Mi Perfil" };

export default async function PerfilPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase
    .from("profiles")
    .select("nombre, sistema_actual, nivel_actual")
    .eq("id", user.id)
    .single();

  const nombre = profile?.nombre ?? user.email?.split("@")[0] ?? "Atleta";

  return (
    <div className="space-y-8 max-w-lg">
      <div>
        <p className="text-white/50 text-sm">Tu cuenta</p>
        <h1 className="font-black text-2xl sm:text-3xl text-white mt-1">Mi Perfil</h1>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-6 flex items-center gap-4">
        <div className="w-14 h-14 rounded-full bg-gradient-to-br from-orange-600 to-amber-700 flex items-center justify-center flex-shrink-0">
          <span className="text-white font-black text-lg">{iniciales(nombre)}</span>
        </div>
        <div className="min-w-0">
          <p className="font-black text-white text-lg truncate">{nombre}</p>
          <p className="text-white/50 text-sm truncate">{user.email}</p>
        </div>
      </div>

      <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] divide-y divide-white/[0.06]">
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white/50 text-sm">Sistema actual</span>
          <span className="text-white text-sm font-semibold">{profile?.sistema_actual ?? "Sin asignar"}</span>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white/50 text-sm">Nivel</span>
          <span className="text-white text-sm font-semibold">{profile?.nivel_actual ?? "Sin asignar"}</span>
        </div>
        <div className="flex items-center justify-between px-5 py-4">
          <span className="text-white/50 text-sm">Email verificado</span>
          <span className={`text-sm font-semibold ${user.email_confirmed_at ? "text-emerald-400" : "text-white/50"}`}>
            {user.email_confirmed_at ? "Sí" : "No"}
          </span>
        </div>
      </div>

      <p className="text-white/40 text-xs">
        Edición de perfil (nombre, foto) llega en una próxima iteración — hoy es solo lectura.
      </p>
    </div>
  );
}
