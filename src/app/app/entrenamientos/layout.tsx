import type { Metadata } from "next";
import PageHeader from "@/components/app/PageHeader";
import EntrenamientosNav from "@/components/app/EntrenamientosNav";

export const metadata: Metadata = { title: "Entrenamientos" };

export default function EntrenamientosLayout({ children }: { children: React.ReactNode }) {
  return (
    <div>
      <PageHeader title="Entrenamientos" description="Tu calendario y tu historial de sesiones." />
      <EntrenamientosNav />
      {children}
    </div>
  );
}
