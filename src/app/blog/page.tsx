import BlogGrid from "@/components/BlogGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog | Brey Fitness",
  description: "Artículos sobre entrenamiento, nutrición y mentalidad.",
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
      <BlogGrid />
    </main>
  );
}
