import type { Metadata } from "next";
import { redirect } from "next/navigation";

import { getUser } from "@/lib/supabase/user";
import { createClient } from "@/lib/supabase/server";
import { listarEnlaces, listarPlantillas } from "@/lib/plantillas/repository";
import ListaPlantillas from "./ListaPlantillas";

export const metadata: Metadata = { title: "Plantillas de sesión" };

// Server puro, mismo criterio que app/composicion-corporal/page.tsx: una
// carga y una hidratación al Client Component.
//
// El conteo de enlaces activos se compone llamando al repositorio por cada
// plantilla en paralelo, en vez de añadir una consulta agregada. Es la misma
// decisión —y la misma limitación— que la lista del BCS ya documenta: sin
// paginación, el número de plantillas de un entrenador cabe de sobra en una
// tanda; si algún día no cupiera, el sitio de arreglarlo es el repositorio.
export default async function PlantillasPage() {
  const user = await getUser();
  if (!user) redirect("/login");

  const supabase = await createClient();
  const plantillas = await listarPlantillas(supabase, user.id);

  const conEnlaces = await Promise.all(
    plantillas.map(async (plantilla) => ({
      plantilla,
      enlacesActivos: (await listarEnlaces(supabase, plantilla.id)).filter(
        (e) => e.estado === "activo",
      ).length,
    })),
  );

  return <ListaPlantillas filas={conEnlaces} />;
}
