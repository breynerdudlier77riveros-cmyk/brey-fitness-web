import { redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import HoyClient from "./HoyClient";

export default async function HoyPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const { data: profile } = await supabase.from("profiles").select("nombre").eq("id", user.id).single();

  return <HoyClient nombre={profile?.nombre ?? user.email?.split("@")[0] ?? "Atleta"} />;
}
