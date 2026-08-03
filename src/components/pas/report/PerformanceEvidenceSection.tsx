import PerformanceSection from "./PerformanceSection";
import type { GrupoEvidencia } from "@/lib/pas/report";

// ── Nivel de evidencia (Sprint PAS-5.0) ────────────────────────────────────
// Agrupa las capacidades por el nivel que el PIE declaró. NO resume
// literatura, NO explica qué significa cada nivel más allá de nombrarlo y NO
// cita fuentes aquí: las referencias viajan con cada interpretación, en su
// propia sección.
//
// «No documentado» es un nivel de pleno derecho y aparece como los demás.
// Ocultarlo daría a entender que toda capacidad tiene un nivel asignado.

interface Props {
  grupos: readonly GrupoEvidencia[];
}

export default function PerformanceEvidenceSection({ grupos }: Props) {
  if (grupos.length === 0) {
    return (
      <PerformanceSection id="evidencia">
        <p className="text-sm text-white/50">
          Ninguna capacidad tiene nivel de evidencia declarado.
        </p>
      </PerformanceSection>
    );
  }

  return (
    <PerformanceSection
      id="evidencia"
      nota="Nivel declarado por la base de conocimiento para cada correspondencia aplicada."
    >
      <p className="sr-only">
        Distribución de capacidades por nivel de evidencia, en {grupos.length} grupos.
      </p>

      <div className="space-y-4">
        {grupos.map((grupo) => (
          <div key={grupo.nivel} data-nivel={grupo.nivel} className="prs-bloque">
            <h3 className="flex items-baseline justify-between gap-3 border-b border-white/10 pb-1.5">
              <span className="text-sm font-bold">{grupo.etiqueta}</span>
              <span className="text-xs tabular-nums text-white/40">
                {grupo.capacidades.length}
              </span>
            </h3>

            <ul className="mt-1.5 flex flex-wrap gap-x-3 gap-y-1">
              {grupo.capacidades.map((capacidad) => (
                <li key={capacidad.capacidad} className="text-sm text-white/70">
                  {capacidad.nombre}
                  <span className="ml-1 text-[11px] text-white/40">{capacidad.capacidad}</span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </PerformanceSection>
  );
}
