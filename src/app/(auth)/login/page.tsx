import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  title: "Iniciar sesión",
  robots: { index: false, follow: false },
};

export default async function LoginPage() {
  const user = await getUser();
  if (user) redirect("/app");

  return (
    <div>
      <h1 className="font-black text-2xl text-white mb-1">Inicia sesión</h1>
      <p className="text-white/50 text-sm mb-8">Entra a tu Dashboard de BREY.</p>
      <LoginForm />
    </div>
  );
}
