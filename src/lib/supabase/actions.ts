"use server";

import { redirect } from "next/navigation";
import { createClient } from "@/lib/supabase/server";

// Se importa directo desde AppSidebar.tsx (Client Component) y se usa como
// <form action={signOut}> — patrón nativo de Server Actions en React 19,
// sin necesitar que Button.tsx sepa nada de esto.
export async function signOut() {
  const supabase = await createClient();
  await supabase.auth.signOut();
  redirect("/login");
}
