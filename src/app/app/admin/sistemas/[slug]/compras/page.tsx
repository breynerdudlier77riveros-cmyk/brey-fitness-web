import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getProfile } from "@/lib/profile/repository";
import { getSistemaBySlug } from "@/lib/systems/repository";
import { comprasDelSistema } from "@/lib/cursos/repository";
import PageHeader from "@/components/app/PageHeader";
import GestionCompras from "@/features/cursos/components/GestionCompras";

export const metadata: Metadata = { title: "Accesos otorgados" };

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function ComprasPage({ params }: Props) {
  const { slug } = await params;

  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const profile = await getProfile(supabase, user.id);
  if (!profile?.es_admin) redirect("/app");

  const sistema = await getSistemaBySlug(supabase, slug);
  if (!sistema) notFound();

  // Vista de admin sobre TODAS las compras del Sistema, incluidas las que
  // todavía no tienen usuario_id vinculado — la política de RLS de
  // `compras` solo deja ver la propia con el cliente normal.
  const compras = await comprasDelSistema(createAdminClient(), slug);

  return (
    <div>
      <PageHeader
        title={`Accesos · ${sistema.nombre}`}
        description="Quién tiene acceso a este Sistema, de Hotmart o otorgado a mano."
      />
      <GestionCompras sistemaSlug={slug} comprasIniciales={compras} />
    </div>
  );
}
