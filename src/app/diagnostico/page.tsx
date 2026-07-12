import type { Metadata } from "next";
import DiagnosticoClient from "./DiagnosticoClient";

export const metadata: Metadata = {
  title: "Diagnóstico BPS — Encuentra tu ecosistema",
  description:
    "Una conversación de 2 minutos con el sistema: tu objetivo, nivel, equipo y situación — y el ecosistema exacto del Brey Performance System para ti, con su porqué.",
};

export default function DiagnosticoPage() {
  return (
    <main className="bg-slate-950 text-white min-h-[calc(100vh-4rem)] flex flex-col">
      <DiagnosticoClient />
    </main>
  );
}
