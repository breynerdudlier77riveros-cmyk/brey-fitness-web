import { redirect } from "next/navigation";
import PageHeader from "@/components/app/PageHeader";
import Section from "@/components/app/Section";
import EmptyState from "@/components/app/EmptyState";
import { Target } from "@/components/brand/icons";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import { listarAtletas } from "@/features/performance-workspace/repository";
import { filtrarAtletas } from "@/features/performance-workspace/services/consultas";
import AtletaCard from "@/features/performance-workspace/components/AtletaCard";
import AtletaForm from "@/features/performance-workspace/components/AtletaForm";

// ── Performance Assessment · listado de atletas (Sprint PAS-7.0) ───────────
// Server Component: la lectura ocurre aquí, una vez. La búsqueda y los filtros
// se aplican con las funciones puras del servicio, no con lógica en el JSX.

export const metadata = { title: "Performance Assessment" };

interface Props {
  searchParams: Promise<{ q?: string; estado?: string; deporte?: string }>;
}

export default async function RendimientoPage({ searchParams }: Props) {
  const user = await getUser();
  if (!user) redirect("/login");

  const { q, estado, deporte } = await searchParams;
  const supabase = await createClient();
  const todos = await listarAtletas(supabase, user.id);

  const atletas = filtrarAtletas(todos, {
    busqueda: q,
    estado: estado as never,
    deporte,
  });

  return (
    <div className="space-y-8">
      <PageHeader
        title="Performance Assessment"
        description="Valoración funcional: atletas, evaluaciones e informes."
      />

      <Section label="Atletas">
        {atletas.length === 0 ? (
          <EmptyState
            icon={Target}
            title={todos.length === 0 ? "Todavía no tienes atletas" : "Ningún atleta coincide"}
            description={
              todos.length === 0
                ? "Crea el primero para empezar a registrar evaluaciones."
                : "Prueba con otro término de búsqueda o cambia los filtros."
            }
          />
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {atletas.map((atleta) => (
              <AtletaCard key={atleta.id} atleta={atleta} />
            ))}
          </div>
        )}
      </Section>

      <Section label="Nuevo atleta">
        <AtletaForm />
      </Section>
    </div>
  );
}
