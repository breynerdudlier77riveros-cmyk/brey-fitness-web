import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";
import ResetPasswordForm from "./ResetPasswordForm";

export const metadata: Metadata = {
  title: "Recuperar contraseña",
  robots: { index: false, follow: false },
};

export default async function ResetPasswordPage() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user) redirect("/app");

  return (
    <div>
      <h1 className="font-black text-2xl text-white mb-1">Recupera tu contraseña</h1>
      <p className="text-white/50 text-sm mb-8">Te enviamos un link para restablecerla.</p>
      <ResetPasswordForm />
    </div>
  );
}
