import type { Metadata } from "next";
import Button from "@/components/ui/Button";
import { ArrowRight } from "@/components/ui/icons";

export const metadata: Metadata = {
  title: "Página no encontrada",
};

export default function NotFound() {
  return (
    <main className="bg-slate-950 text-white flex-1 flex items-center justify-center px-6 py-24">
      <div className="relative max-w-xl text-center">
        <div aria-hidden className="absolute inset-0 pointer-events-none">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-orange-600/6 blur-[100px] rounded-full" />
        </div>

        <div className="relative">
          <p className="font-mono text-[11px] font-bold tracking-[0.25em] uppercase text-orange-400/70 mb-6">
            Error 404
          </p>
          <h1 className="font-black text-4xl sm:text-5xl text-white leading-snug tracking-tight mb-5">
            Esta página no existe.
          </h1>
          <p className="text-white/60 leading-relaxed mb-10 max-w-md mx-auto">
            El enlace puede estar mal escrito o la página fue movida. Lo que sí
            existe: el sistema completo, a un clic.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Button href="/" size="md">
              Volver al inicio
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Button>
            <Button href="/sistemas" variant="outline" size="md">
              Ver los 5 Sistemas
            </Button>
          </div>
        </div>
      </div>
    </main>
  );
}
