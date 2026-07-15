import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import UpdatePasswordForm from "./UpdatePasswordForm";

export const metadata: Metadata = {
  title: "Nueva contraseña",
  robots: { index: false, follow: false },
};

export default async function UpdatePasswordPage() {
  const user = await getUser();

  // Sin sesión de recuperación, no tiene sentido mostrar el formulario —
  // "nunca un formulario que finge enviar" (mismo principio que ya sigue
  // api/contacto/route.ts en este proyecto).
  if (!user) redirect("/login");

  return (
    <div>
      <h1 className="font-black text-2xl text-white mb-1">Elige tu nueva contraseña</h1>
      <p className="text-white/50 text-sm mb-8">Ya casi — solo falta esto.</p>
      <UpdatePasswordForm />
    </div>
  );
}
