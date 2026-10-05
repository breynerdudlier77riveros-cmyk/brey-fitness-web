import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { getSistemaBySlug } from "@/data/sistemas";
import { compraActivaDe, leccionesVistas, obtenerContenido } from "@/lib/cursos/repository";
import { tieneContenidoVendible } from "@/lib/cursos/contenido";
import PageHeader from "@/components/app/PageHeader";
import DashboardCard from "@/components/app/DashboardCard";
import EmptyState from "@/components/app/EmptyState";
import { Book } from "@/components/brand/icons";
import VisorCurso from "@/features/cursos/components/VisorCurso";

interface Props {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const sistema = getSistemaBySlug(slug);
  return { title: sistema?.nombre ?? "Curso" };
}

// ── El curso, para quien ya lo compró (Sprint CURSO-1) ─────────────────────
//
// GATE POR COMPRA ACTIVA, NO POR `sistema_actual`. Esa columna es la
// recomendación del Diagnóstico —una intención—, no un acceso pagado.
// Confundirlas dejaría entrar sin haber comprado a cualquiera que el
// Diagnóstico recomendó este Sistema, y es exactamente el agujero que este
// gate existe para cerrar.

export default async function CursoPage({ params }: Props) {
  const { slug } = await params;

  const sistema = getSistemaBySlug(slug);
  if (!sistema) notFound();

  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const compra = await compraActivaDe(supabase, slug, user.id);
  if (!compra) redirect(`/sistemas/${slug}`);

  const contenido = await obtenerContenido(supabase, slug);
  const vistas = await leccionesVistas(supabase, compra.id);

  return (
    <div>
      <PageHeader title={sistema.nombre} description={sistema.tagline} />

      {!tieneContenidoVendible(contenido) ? (
        <DashboardCard>
          <EmptyState
            icon={Book}
            title="El contenido está por publicarse"
            description="Ya tienes acceso — en cuanto se suban las primeras lecciones aparecerán aquí."
          />
        </DashboardCard>
      ) : (
        <VisorCurso sistemaSlug={slug} contenido={contenido} leccionesVistasIds={[...vistas]} />
      )}
    </div>
  );
}
