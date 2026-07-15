import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import SignupForm from "./SignupForm";

export const metadata: Metadata = {
  title: "Crear cuenta",
  robots: { index: false, follow: false },
};

export default async function SignupPage() {
  const user = await getUser();
  if (user) redirect("/app");

  return (
    <div>
      <h1 className="font-black text-2xl text-white mb-1">Crea tu cuenta</h1>
      <p className="text-white/50 text-sm mb-8">Empieza tu Sistema BPS.</p>
      <SignupForm />
    </div>
  );
}
