import type { Metadata } from "next";
import { obtenerReportePublico } from "@/lib/bcs/actions-publico";
import { analizarComposicionCorporal } from "@/lib/bcs/analysis";
import { generarRecomendaciones } from "@/lib/bcs/recommendations";
import { generarObservaciones } from "@/lib/bcs/observation";
import { generarEntregables } from "@/lib/bcs/copilot";
import { sujetoDe } from "@/lib/bcs/identidad";
import ReportView from "@/features/composicion-corporal/components/ReportView";
import { EstadoSinPermiso } from "@/features/composicion-corporal/components/EstadosVacios";
import { fechaISOLocal } from "@/lib/utils";
import { Scale } from "@/components/brand/icons";
import AccionesReporte from "./AccionesReporte";

interface Props {
  params: Promise<{ token: string }>;
}

// noindex — mismo patrón que app/(auth)/login/page.tsx y app/app/layout.tsx
// (ambos ya usan metadata.robots a nivel de página, no en robots.ts global):
// una ruta pública sin sesión no significa "para indexar" (BCS Handbook 10).
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { token } = await params;
  const resultado = await obtenerReportePublico(token);
  return {
    title: resultado.ok ? `Reporte de ${resultado.data.cliente.nombre}` : "Reporte",
    robots: { index: false, follow: false },
  };
}

// Server puro. UC-09 es el único caso de uso de todo el ecosistema
// invocable sin sesión (BCS Handbook 13) — obtenerReportePublico resuelve
// el token con el cliente admin (Service Role), fuera de la RLS normal.
//
// TOKEN_INVALIDO y TOKEN_REVOCADO reciben EXACTAMENTE el mismo tratamiento
// visual (EstadoSinPermiso) — nunca se revela cuál de los dos ocurrió
// (BCS Design Handbook 13, por seguridad). SIN_MEDICIONES es un estado
// distinto: el token es válido, pero el Cliente aún no tiene historial.
export default async function ReportePublicoPage({ params }: Props) {
  const { token } = await params;
  const resultado = await obtenerReportePublico(token);

  if (!resultado.ok) {
    if (resultado.error === "SIN_MEDICIONES") {
      return (
        <main className="min-h-screen flex flex-col items-center justify-center text-center px-6 bg-slate-950">
          <div className="w-12 h-12 rounded-2xl border border-white/[0.10] bg-white/[0.03] flex items-center justify-center mb-5">
            <Scale className="w-6 h-6 text-white/40" strokeWidth={1.75} />
          </div>
          <p className="font-black text-white text-lg mb-2">Todavía no hay mediciones registradas</p>
          <p className="text-white/50 text-sm max-w-sm">
            Cuando tu entrenador registre tu primera medición, tu reporte aparecerá aquí.
          </p>
        </main>
      );
    }
    return <EstadoSinPermiso />;
  }

  const reporte = resultado.data;
  // El análisis es derivado y se recomputa aquí — nunca viaja persistido.
  // `hoyISO` se pasa explícito porque la capa pura no consulta el reloj.
  const hoy = new Date();
  const hoyISO = fechaISOLocal(hoy);
  // `sujeto` llega desde el propio Reporte (BCS-7.0). Sin él, la vista
  // pública decía «no consta el sexo del cliente» aunque constara — el mismo
  // dato produciendo dos respuestas distintas según la ruta.
  const analisis = analizarComposicionCorporal(reporte.historico, {
    hoyISO,
    sujeto: sujetoDe(reporte.cliente),
  });
  const recomendaciones = generarRecomendaciones(analisis);
  const observaciones = generarObservaciones({ analisis, recomendaciones });

  // Solo la explicación al cliente: el resto del lote son herramientas del
  // profesional —nota SOAP, borradores de correo— y no pintan nada en la
  // pantalla de la persona evaluada.
  const copiloto = generarEntregables(
    { reporte, analisis, recomendaciones, observaciones, hoyISO },
    { explicacionPaciente: true },
  );
  const explicacion = copiloto.entregables[0] ?? null;
  const generadoEl = hoy.toLocaleDateString("es", { day: "2-digit", month: "long", year: "numeric" });

  return (
    <main className="min-h-screen bg-slate-950 text-white">
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="flex items-start justify-between gap-4 flex-wrap mb-8">
          <div>
            <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mb-1">Reporte de composición corporal</p>
            <h1 className="font-black text-2xl sm:text-3xl text-white">{reporte.cliente.nombre}</h1>
          </div>
          <AccionesReporte />
        </div>

        {/* Sin `entrenador`: UC-09 resuelve por token y su DTO no incluye al
            profesional. La portada omite la fila antes que inventar un nombre. */}
        <ReportView
          reporte={reporte}
          analisis={analisis}
          recomendaciones={recomendaciones}
          explicacionPaciente={explicacion}
          observaciones={observaciones}
          generadoEl={hoyISO}
        />

        <footer className="mt-12 pt-6 border-t border-white/[0.06] text-xs text-white/40 flex items-center justify-between">
          <span>{reporte.cliente.nombre}</span>
          <span>
            {generadoEl} · Generado con <span className="text-orange-400 font-bold">Brey</span>
          </span>
        </footer>
      </div>
    </main>
  );
}
