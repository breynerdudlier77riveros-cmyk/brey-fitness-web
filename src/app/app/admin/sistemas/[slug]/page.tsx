import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { getProfile } from "@/lib/profile/repository";
import { getSistemaBySlug } from "@/lib/systems/repository";
import { obtenerContenido } from "@/lib/cursos/repository";
import PageHeader from "@/components/app/PageHeader";
import Button from "@/components/brand/Button";
import EditorContenido from "@/features/cursos/components/EditorContenido";

export const metadata: Metadata = { title: "Editar contenido del curso" };

interface Props {
  params: Promise<{ slug: string }>;
}

export default async function EditarContenidoPage({ params }: Props) {
  const { slug } = await params;

  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const profile = await getProfile(supabase, user.id);
  if (!profile?.es_admin) redirect("/app");

  const sistema = await getSistemaBySlug(supabase, slug);
  if (!sistema) notFound();

  const contenido = await obtenerContenido(supabase, slug);

  return (
    <div>
      <PageHeader
        title={sistema.nombre}
        description="Módulos, lecciones, video y materiales. Cada cambio se guarda al salir del campo."
        actions={
          <Button href={`/app/admin/sistemas/${slug}/compras`} variant="outline" size="sm">
            Ver accesos otorgados
          </Button>
        }
      />
      <EditorContenido sistemaSlug={slug} contenidoInicial={contenido} />
    </div>
  );
}
