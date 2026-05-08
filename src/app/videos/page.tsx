import VideoGrid from "@/components/VideoGrid";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Videos | Brey Fitness",
  description: "Tutoriales, rutinas y consejos en video.",
};

export default function VideosPage() {
  return (
    <main className="max-w-6xl mx-auto px-4 md:px-6 py-10 md:py-14">
      <div className="mb-14">
        <p className="text-[11px] tracking-[0.22em] uppercase text-white/25 mb-3 font-medium">
          Biblioteca
        </p>
        <h1 className="font-display font-black text-4xl sm:text-5xl text-white mb-3">
          Videos
        </h1>
        <p className="text-white/35 max-w-lg leading-relaxed">
          Tutoriales, rutinas completas y consejos para todos los niveles.
        </p>
      </div>
      <VideoGrid />
    </main>
  );
}
