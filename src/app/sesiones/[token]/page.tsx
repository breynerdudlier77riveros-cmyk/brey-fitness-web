import type { Metadata } from "next";

import { obtenerPlantillaPublica } from "@/lib/plantillas/actions-publico";
import SessionView from "@/features/plantillas/components/SessionView";
import { Cycle } from "@/components/brand/icons";
import AccionesSesion from "./AccionesSesion";
import PreguntarPlan from "@/features/plantillas/components/PreguntarPlan";

interface Props {
  params: Promise<{ token: string }>;
}

// `noindex`, igual que /reportes/[token]: una ruta pública sin sesión no
// significa «para indexar». Un enlace de entrenamiento en un buscador sería
// exactamente el fallo que el token trata de evitar.
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const resultado = await obtenerPlantillaPublica(token);
  return {
    title: resultado.ok ? resultado.data.nombre : "Sesión",
    robots: { index: false, follow: false },
  };
}

// Server puro y sin sesión. Es el único punto del subsistema que se alcanza
// sin autenticar, y por eso lo único que hace es leer: no hay ninguna acción
// de escritura alcanzable desde esta página.
//
// UN SOLO ESTADO DE FALLO. Token inexistente, revocado, plantilla archivada y
// plantilla en borrador dan exactamente la misma pantalla. Distinguirlos
// confirmaría a quien prueba tokens al azar cuáles existieron alguna vez.
export default async function SesionPublicaPage({ params }: Props) {
  const { token } = await params;
  const resultado = await obtenerPlantillaPublica(token);

  if (!resultado.ok) {
    return (
      <main className="flex min-h-screen flex-col items-center justify-center bg-slate-950 px-6 text-center">
        <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl border border-white/[0.10] bg-white/[0.03]">
          <Cycle className="h-6 w-6 text-white/40" strokeWidth={1.75} />
        </div>
        <p className="mb-2 text-lg font-black text-white">Este enlace ya no está disponible</p>
        <p className="max-w-sm text-sm text-white/50">
          Puede haber caducado o haberse retirado. Pídele a tu entrenador uno nuevo.
        </p>
      </main>
    );
  }

  const plantilla = resultado.data;

  return (
    <main className="min-h-screen bg-slate-950 print:bg-white">
      <div className="hoja-print mx-auto max-w-4xl px-5 py-10 sm:px-8 sm:py-14">
        <header className="mb-8">
          <p className="mb-1 text-[10px] font-bold uppercase tracking-[0.14em] text-orange-400/70">
            Plan de entrenamiento
          </p>
          <h1 className="text-2xl font-black text-white sm:text-3xl">{plantilla.nombre}</h1>

          {plantilla.descripcion && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-white/55">
              {plantilla.descripcion}
            </p>
          )}

          {plantilla.nota && (
            <p className="mt-3 rounded-xl border border-white/[0.08] bg-white/[0.02] px-4 py-2.5 text-sm leading-relaxed text-white/60">
              {plantilla.nota}
            </p>
          )}

          <p className="mt-3 text-xs text-white/35">
            {plantilla.semanas} {plantilla.semanas === 1 ? "semana" : "semanas"} ·{" "}
            {plantilla.contenido.dias.length}{" "}
            {plantilla.contenido.dias.length === 1 ? "día" : "días"} por semana
          </p>
        </header>

        <AccionesSesion />

        <SessionView
          contenido={plantilla.contenido}
          semanas={plantilla.semanas}
          para={plantilla.para}
        />

        <PreguntarPlan token={token} />

        {/* Solo lectura, y se dice. Quien abre esto puede pensar que va a
            poder marcar series hechas; que no pueda no es un fallo, pero
            enterarse a base de pulsar sí lo parecería. */}
        <footer className="mt-12 border-t border-white/[0.08] pt-5">
          <p className="text-[11px] leading-relaxed text-white/30">
            Esta página es una copia de solo lectura. La mantiene tu entrenador: si cambia el plan,
            cambia aquí. No se guarda nada de lo que hagas en ella.
          </p>
        </footer>
      </div>
    </main>
  );
}
