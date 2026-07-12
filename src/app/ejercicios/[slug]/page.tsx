import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ejercicios, getEjercicioBySlug } from "@/data/exercises";
import type { ExerciseLevel, ExerciseType } from "@/lib/types";
import { ArrowRight, Close } from "@/components/ui/icons";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return ejercicios.map((e) => ({ slug: e.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const e = getEjercicioBySlug(slug);
  if (!e) return { title: "Ejercicio no encontrado" };
  return {
    title: `${e.nombre} — Técnica, errores y variantes`,
    description: e.descripcion.slice(0, 155),
  };
}

const levelLabels: Record<ExerciseLevel, { label: string; class: string }> = {
  principiante: { label: "Principiante", class: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
  intermedio: { label: "Intermedio", class: "text-orange-400 bg-orange-500/10 border-orange-500/20" },
  avanzado: { label: "Avanzado", class: "text-red-400 bg-red-500/10 border-red-500/20" },
};

const typeLabels: Record<ExerciseType, string> = {
  compuesto: "Compuesto",
  aislamiento: "Aislamiento",
  "peso-corporal": "Peso Corporal",
};

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <h2 className="font-black text-sm uppercase tracking-[0.15em] text-white/50 mb-4">{title}</h2>
      {children}
    </div>
  );
}

export default async function EjercicioPage({ params }: Props) {
  const { slug } = await params;
  const e = getEjercicioBySlug(slug);
  if (!e) notFound();

  const lvl = levelLabels[e.nivel];

  return (
    <main className="bg-slate-950 text-white">
      {/* Breadcrumb */}
      <div className="max-w-4xl mx-auto px-6 pt-8">
        <nav className="flex items-center gap-2 text-xs text-white/50 mb-8">
          <Link href="/ejercicios" className="hover:text-white/90 transition-colors">Ejercicios</Link>
          <span>/</span>
          <span className="text-white/60">{e.nombre}</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-6 pb-12 border-b border-white/[0.05]">
        <div className="flex flex-wrap gap-2 mb-5">
          <span className={`inline-flex px-3 py-1 rounded-full border text-xs font-bold ${lvl.class}`}>
            {lvl.label}
          </span>
          <span className="inline-flex px-3 py-1 rounded-full border border-white/[0.08] text-xs text-white/60">
            {typeLabels[e.tipo]}
          </span>
          {e.equipo.map((eq) => (
            <span key={eq} className="inline-flex px-3 py-1 rounded-full border border-white/[0.06] text-xs text-white/55">
              {eq}
            </span>
          ))}
        </div>

        <h1 className="font-black text-3xl sm:text-4xl md:text-5xl text-white leading-[1.1] tracking-tight mb-2">
          {e.nombre}
        </h1>
        {e.nombreIngles && (
          <p className="text-white/50 text-sm mb-6">{e.nombreIngles}</p>
        )}
        <p className="text-white/50 leading-relaxed max-w-2xl">{e.descripcion}</p>

        {/* Muscle groups */}
        <div className="flex flex-wrap gap-6 mt-8">
          <div>
            <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Músculo principal</p>
            <p className="text-sm font-bold text-orange-400 capitalize">{e.musculoPrincipal}</p>
          </div>
          {e.musculosSecundarios.length > 0 && (
            <div>
              <p className="text-[10px] uppercase tracking-widest text-white/50 mb-1">Secundarios</p>
              <p className="text-sm font-semibold text-white/50 capitalize">
                {e.musculosSecundarios.join(", ")}
              </p>
            </div>
          )}
        </div>
      </section>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-6 py-12 grid md:grid-cols-[1fr_320px] gap-12">
        {/* Main column */}
        <div className="space-y-10">
          <Section title="Ejecución técnica">
            <ol className="space-y-3">
              {e.instrucciones.map((inst, i) => (
                <li key={i} className="flex gap-4 p-4 rounded-xl border border-white/[0.06] bg-white/[0.02]">
                  <span className="flex-shrink-0 w-6 h-6 rounded-full bg-orange-500/15 border border-orange-500/20 flex items-center justify-center text-[11px] font-black text-orange-400">
                    {i + 1}
                  </span>
                  <p className="text-sm text-white/70 leading-relaxed">{inst}</p>
                </li>
              ))}
            </ol>
          </Section>

          <Section title="Errores comunes">
            <div className="space-y-2.5">
              {e.erroresComunes.map((err, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl border border-red-500/10 bg-red-500/[0.03]">
                  <Close className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" strokeWidth={2.5} />
                  <p className="text-sm text-white/50 leading-relaxed">{err}</p>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Beneficios clave">
            <div className="space-y-2.5">
              {e.beneficios.map((b, i) => (
                <div key={i} className="flex gap-3 p-4 rounded-xl border border-emerald-500/10 bg-emerald-500/[0.03]">
                  <svg className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 12.75 6 6 9-13.5" />
                  </svg>
                  <p className="text-sm text-white/50 leading-relaxed">{b}</p>
                </div>
              ))}
            </div>
          </Section>
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Variants */}
          <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
            <h3 className="font-black text-sm uppercase tracking-[0.15em] text-white/50 mb-4">Variantes</h3>
            <div className="space-y-2">
              {e.variantes.map((v, i) => (
                <div key={i} className="flex gap-3 items-start text-sm text-white/60 leading-snug">
                  <span className="w-1 h-1 rounded-full bg-orange-400/40 mt-2 flex-shrink-0" />
                  {v}
                </div>
              ))}
            </div>
          </div>

          {/* Linked programs */}
          {e.programasVinculados.length > 0 && (
            <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5">
              <h3 className="font-black text-sm uppercase tracking-[0.15em] text-white/50 mb-4">
                Programas que incluyen este ejercicio
              </h3>
              <div className="space-y-2">
                {e.programasVinculados.map((slug) => (
                  <Link
                    key={slug}
                    href={`/programas/${slug}`}
                    className="flex items-center justify-between p-3 rounded-xl border border-white/[0.06] bg-white/[0.02] hover:border-white/[0.12] hover:bg-white/[0.04] transition-all group"
                  >
                    <span className="text-xs text-white/50 group-hover:text-white/90 transition-colors capitalize">
                      {slug.replace(/-/g, " ")}
                    </span>
                    <ArrowRight className="w-3.5 h-3.5 text-white/50 group-hover:text-white/90 transition-colors" strokeWidth={2} />
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* CTA */}
          <div className="rounded-2xl border border-orange-500/15 bg-orange-500/[0.04] p-5">
            <p className="text-xs text-white/55 mb-2">¿Quieres un programa con este ejercicio?</p>
            <h3 className="font-black text-white text-sm mb-3 leading-snug">
              El quiz de 2 min te recomienda el ecosistema exacto.
            </h3>
            <Link
              href="/quiz"
              className="inline-flex w-full items-center justify-center gap-2 px-4 py-3 rounded-xl bg-orange-500 hover:bg-orange-400 text-white font-bold text-xs transition-all"
            >
              Tomar el quiz
              <ArrowRight className="w-3.5 h-3.5" strokeWidth={2.5} />
            </Link>
          </div>
        </aside>
      </div>

      {/* Back nav */}
      <div className="max-w-4xl mx-auto px-6 pb-16">
        <Link
          href="/ejercicios"
          className="inline-flex items-center gap-2 text-sm text-white/55 hover:text-white/90 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5L8.25 12l7.5-7.5" />
          </svg>
          Volver a la biblioteca
        </Link>
      </div>
    </main>
  );
}
