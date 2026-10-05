import Link from "next/link";
import { redirect } from "next/navigation";

import PageHeader from "@/components/app/PageHeader";
import Section from "@/components/app/Section";
import EmptyState from "@/components/app/EmptyState";
import { Target } from "@/components/brand/icons";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import { listarMacrociclos } from "@/lib/macrociclo/repository";
import { listarAtletas } from "@/features/performance-workspace/repository";
import { modeloDe } from "@/lib/macrociclo/modelos";
import { semanasCubiertas } from "@/lib/macrociclo/contenido";
import CrearMacrociclo from "@/features/macrociclo/components/CrearMacrociclo";

// ── Macrociclos · listado (Sprint MAC-1) ───────────────────────────────────
//
// La capa de planificación, entre el PAS —que mide— y Plantillas —que
// prescribe la sesión—. Vive bajo `/app/rendimiento` porque un plan se escribe
// a partir de una valoración, y separarlo obligaría a navegar entre dos
// secciones para la misma conversación con el atleta.

export const metadata = { title: "Macrociclos" };

export default async function MacrociclosPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const [macrociclos, atletas] = await Promise.all([
    listarMacrociclos(supabase, user.id),
    listarAtletas(supabase, user.id),
  ]);

  const nombreAtleta = new Map(atletas.map((a) => [a.id, a.nombre]));

  return (
    <div className="space-y-8">
      <PageHeader
        title="Macrociclos"
        description="Planificación por semanas. Cada día apunta a una plantilla de sesión."
        actions={<CrearMacrociclo atletas={atletas.map((a) => ({ id: a.id, nombre: a.nombre }))} />}
      />

      <Section label="Planes">
        {macrociclos.length === 0 ? (
          <EmptyState
            icon={Target}
            title="Todavía no hay ningún macrociclo"
            description="Un macrociclo organiza las semanas en mesociclos y asigna a cada día una sesión. Puedes empezar en blanco o sembrarlo con un modelo de periodización."
          />
        ) : (
          <ul className="grid grid-cols-1 gap-3 md:grid-cols-2 lg:grid-cols-3">
            {macrociclos.map((m) => {
              const modelo = m.modeloId === null ? null : modeloDe(m.modeloId);
              const cubiertas = semanasCubiertas(m.contenido.mesociclos);
              return (
                <li key={m.id}>
                  <Link
                    href={`/app/rendimiento/macrociclo/${m.id}`}
                    className="block rounded-xl border border-white/[0.08] bg-white/[0.02] p-4 transition-colors hover:border-white/20"
                  >
                    <p className="font-semibold text-white">{m.nombre}</p>
                    <p className="mt-1 text-[12px] text-white/45">
                      {m.semanas} {m.semanas === 1 ? "semana" : "semanas"}
                      {m.atletaId !== null && nombreAtleta.has(m.atletaId)
                        ? ` · ${nombreAtleta.get(m.atletaId)}`
                        : ""}
                    </p>
                    {modelo !== null ? (
                      <p className="mt-2 text-[11px] text-white/30">{modelo.nombre}</p>
                    ) : null}
                    {/* El hueco se nombra: una tarjeta que solo dice «12
                        semanas» oculta que ocho de ellas no tienen mesociclo. */}
                    {cubiertas < m.semanas ? (
                      <p className="mt-2 text-[11px] text-yellow-200/60">
                        {m.semanas - cubiertas} sin mesociclo asignado
                      </p>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        )}
      </Section>
    </div>
  );
}
