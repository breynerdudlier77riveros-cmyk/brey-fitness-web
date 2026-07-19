import { redirect } from "next/navigation";

// "Entrenamientos" en el Sidebar no tiene contenido propio — Calendario es
// la vista por defecto.
export default function EntrenamientosPage() {
  redirect("/app/entrenamientos/calendario");
}
