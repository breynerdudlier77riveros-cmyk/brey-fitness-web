import type { Metadata } from "next";
import QuizClient from "./QuizClient";

export const metadata: Metadata = {
  title: "¿Cuál es mi programa? — Quiz de 2 minutos",
  description:
    "Responde 6 preguntas sobre tu objetivo, nivel y equipo disponible. El sistema te recomienda el ecosistema del BPS exacto para ti.",
};

export default function QuizPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col">
      <QuizClient />
    </main>
  );
}
