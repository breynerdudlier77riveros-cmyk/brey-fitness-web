import Link from "next/link";
import { notFound, redirect } from "next/navigation";

import PageHeader from "@/components/app/PageHeader";
import Section from "@/components/app/Section";
import { createClient } from "@/lib/supabase/server";
import { getUser } from "@/lib/supabase/user";
import { obtenerMacrociclo } from "@/lib/macrociclo/repository";
import { listarPlantillas } from "@/lib/plantillas/repository";
import { plantillasUsadas } from "@/lib/macrociclo/contenido";
import { modeloDe } from "@/lib/macrociclo/modelos";
import RejillaMacrociclo from "@/features/macrociclo/components/RejillaMacrociclo";
import ExportarExcel from "@/features/macrociclo/components/ExportarExcel";

// ── Un macrociclo (Sprint MAC-1) ───────────────────────────────────────────
//
// Componente de servidor: lee el plan y SUS plantillas una vez, y se las pasa
// a la rejilla ya resueltas. La rejilla no vuelve a preguntar a nadie.
//
// ── POR QUÉ SE CARGAN TODAS LAS PLANTILLAS Y NO SOLO LAS USADAS ──────────
//
//   Porque el editor tiene que poder ASIGNAR una sesión a un día, y para eso
//   necesita la lista completa. Cargar solo las usadas dejaría la rejilla sin
//   nada que ofrecer en el momento en que el entrenador va a asignar.
//
//   Al exportador, en cambio, solo viajan las usadas: una hoja por sesión que
//   el plan no usa llenaría el Excel de pestañas vacías.

interface Props {
  params: Promise<{ macrocicloId: string }>;
}

export default async function MacrocicloPage({ params }: Props) {
  const user = await getUser();
  if (!user) redirect("/login");

  const { macrocicloId } = await params;
  const supabase = await createClient();

  const macrociclo = await obtenerMacrociclo(supabase, macrocicloId);
  if (!macrociclo) notFound();

  const plantillas = await listarPlantillas(supabase, user.id);

  const usadas = new Set(plantillasUsadas(macrociclo.contenido));
  const paraExportar = plantillas
    .filter((p) => usadas.has(p.id))
    .map((p) => ({ id: p.id, nombre: p.nombre, semanas: p.semanas, contenido: p.contenido }));

  const modelo = macrociclo.modeloId === null ? null : modeloDe(macrociclo.modeloId);

  return (
    <div className="space-y-6">
      <PageHeader
        title={macrociclo.nombre}
        description={macrociclo.objetivo ?? `${macrociclo.semanas} semanas`}
        actions={
          <div className="flex flex-wrap items-center gap-2">
            <ExportarExcel macrociclo={macrociclo} plantillas={paraExportar} />
            <Link
              href="/app/rendimiento/macrociclo"
              className="rounded-full border border-white/[0.12] px-4 py-2 text-xs font-bold text-white/70 transition-colors hover:border-white/25 hover:text-white"
            >
              Volver
            </Link>
          </div>
        }
      />

      <RejillaMacrociclo
        macrociclo={macrociclo}
        plantillas={plantillas.map((p) => ({ id: p.id, nombre: p.nombre }))}
      />

      {modelo !== null ? (
        <Section label="Modelo de periodización">
          <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
            <p className="font-semibold text-white">{modelo.nombre}</p>
            <p className="mt-1.5 text-[13px] leading-relaxed text-white/65">{modelo.descripcion}</p>

            <ul className="mt-3 space-y-1.5">
              {modelo.fases.map((f) => (
                <li key={f.id} className="flex items-baseline gap-2 text-[12px]">
                  <span
                    className="mt-0.5 h-2 w-2 shrink-0 rounded-full"
                    style={{ backgroundColor: f.color }}
                  />
                  <span className="font-medium text-white/80">{f.nombre}</span>
                  <span className="text-white/40">{f.proposito}</span>
                </li>
              ))}
            </ul>

            {/* La atribución y su límite van JUNTOS. Separarlos dejaría una
                cita que parece comprobada, y no lo está: la obra original no
                se ha abierto en este proyecto. */}
            <p className="mt-4 border-t border-white/[0.06] pt-3 text-[11px] leading-relaxed text-white/35">
              {modelo.atribucion}. La obra original no se ha consultado aquí, así que esto es una
              atribución y no una cita verificada. El modelo aporta la estructura y su vocabulario;{" "}
              <strong className="font-semibold text-white/50">
                ninguna cifra de esta rejilla sale de él
              </strong>
              .
            </p>
          </div>
        </Section>
      ) : null}

      <Section label="Sesiones del plan">
        {paraExportar.length === 0 ? (
          <p className="text-sm text-white/45">
            Todavía no hay ninguna sesión asignada a un día.{" "}
            <Link href="/app/plantillas" className="text-orange-300 hover:underline">
              Crea una plantilla
            </Link>{" "}
            y asígnala desde el calendario de la rejilla.
          </p>
        ) : (
          <ul className="flex flex-wrap gap-2">
            {paraExportar.map((p) => (
              <li key={p.id}>
                <Link
                  href={`/app/plantillas/${p.id}`}
                  className="inline-block rounded-lg border border-white/[0.1] px-3 py-1.5 text-[12px] text-white/70 transition-colors hover:border-white/25 hover:text-white"
                >
                  {p.nombre}
                </Link>
              </li>
            ))}
          </ul>
        )}
      </Section>
    </div>
  );
}
