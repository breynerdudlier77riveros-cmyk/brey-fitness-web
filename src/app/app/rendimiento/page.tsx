import Link from "next/link";
import { redirect } from "next/navigation";
import PageHeader from "@/components/app/PageHeader";
import Section from "@/components/app/Section";
import EmptyState from "@/components/app/EmptyState";
import { Target } from "@/components/brand/icons";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import { listarAtletas } from "@/features/performance-workspace/repository";
import {
  deportesDisponibles,
  filtrarAtletas,
} from "@/features/performance-workspace/services/consultas";
import AtletaCard from "@/features/performance-workspace/components/AtletaCard";
import AtletaForm from "@/features/performance-workspace/components/AtletaForm";
import FiltrosAtletas from "@/features/performance-workspace/components/FiltrosAtletas";
import AtletasDuplicados from "@/features/performance-workspace/components/AtletasDuplicados";
import { gruposDuplicados } from "@/features/performance-workspace/services/duplicados-atleta";

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

  // Se calcula sobre TODOS, no sobre los filtrados: un duplicado que el filtro
  // esconde sigue partiendo el histórico en dos, y avisarlo solo cuando la
  // búsqueda coincide sería avisarlo casi nunca.
  const duplicados = gruposDuplicados(
    todos.map((a) => ({
      id: a.id,
      nombre: a.nombre,
      sexo: a.sexo,
      fechaNacimiento: a.fechaNacimiento,
      pais: a.pais,
      estado: a.estado,
    })),
  );

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

      {/* Antes de la lista: un histórico partido en dos expedientes explica
          por qué una serie parece más corta de lo que es, y descubrirlo
          después de mirar las fichas es descubrirlo tarde. */}
      <AtletasDuplicados grupos={duplicados} />

      <Section label="Atletas">
        {/* Los filtros van ANTES de la lista y siempre se muestran, también
            cuando no hay coincidencias: si desaparecieran al filtrar de más,
            no habría forma de deshacerlo sin editar la URL. */}
        <div className="mb-5">
          <FiltrosAtletas
            valores={{ q, estado, deporte }}
            deportes={deportesDisponibles(todos)}
            total={todos.length}
            visibles={atletas.length}
          />
        </div>

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

      {/* ── MAC-1 · la capa de planificación ────────────────────────────
          Va DESPUÉS de los atletas y antes del formulario de alta: se
          planifica a partir de lo que se ha medido, así que leer primero a
          quién se mide y después qué se le planifica es el orden en que
          ocurre el trabajo. */}
      <Section label="Planificación">
        <Link
          href="/app/rendimiento/macrociclo"
          className="flex flex-wrap items-center gap-4 rounded-2xl border border-white/[0.08] bg-white/[0.02] p-5 transition-colors hover:border-white/20"
        >
          <div className="min-w-0 flex-1">
            <p className="font-semibold text-white">Macrociclos</p>
            <p className="mt-1 text-[13px] leading-relaxed text-white/50">
              Una rejilla de hasta 104 semanas con sus mesociclos, editable y exportable a Excel.
              Cada día apunta a una plantilla de sesión, que conserva su propio editor y su PDF.
            </p>
            <p className="mt-2 text-[11px] text-white/30">
              Se puede sembrar con un modelo de periodización —clásico, ATR, bloques, ondulatorio,
              conjugado—, que aporta la estructura y su vocabulario. Ninguna cifra sale del modelo.
            </p>
          </div>
          <span className="shrink-0 rounded-full border border-white/[0.12] px-4 py-2 text-xs font-bold text-white/70">
            Abrir
          </span>
        </Link>
      </Section>

      <Section label="Nuevo atleta">
        <AtletaForm />
      </Section>
    </div>
  );
}
