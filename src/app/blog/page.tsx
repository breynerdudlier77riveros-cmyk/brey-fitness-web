import BlogGrid from "@/components/BlogGrid";
import Publicacion from "@/components/Publicacion";
import { publicaciones } from "@/data/publicaciones";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Brey Fitness",
  description:
    "Artículos sobre entrenamiento, nutrición y mentalidad, y la investigación publicada de Breyner Riveros.",
};

export default function BlogPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
      <div className="mb-14">
        <p className="text-[11px] tracking-[0.22em] uppercase text-white/50 mb-3 font-medium">
          Contenido
        </p>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
          Blog
        </h1>
        <p className="text-white/55 max-w-lg leading-relaxed">
          Artículos sobre entrenamiento, nutrición y mentalidad atlética.
        </p>
      </div>

      {/* ── Investigación publicada ───────────────────────────────────────
          Encabeza el blog a propósito: es lo único de esta página que no es
          opinión propia sino evidencia revisable por cualquiera. Aparece
          sola si data/publicaciones.ts tiene entradas. El rótulo va en <p>,
          no en un encabezado, para que el <h2> de la ficha siga colgando
          directo del <h1> de la página. */}
      {publicaciones.length > 0 && (
        <section className="mb-16">
          <p className="text-[11px] tracking-[0.22em] uppercase text-orange-400 mb-5 font-medium">
            Investigación
          </p>
          <div className="space-y-5">
            {publicaciones.map((p, i) => (
              <Publicacion key={p.doi} p={p} retardo={i * 120} />
            ))}
          </div>
        </section>
      )}

      <BlogGrid />
    </main>
  );
}
