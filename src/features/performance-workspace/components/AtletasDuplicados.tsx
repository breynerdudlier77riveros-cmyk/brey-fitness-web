"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/brand/Button";
import { toast } from "@/components/brand/Toast";
import { Merge, Spinner } from "@/components/brand/icons";
import { accionFusionarAtletas } from "../actions/atletas";
import {
  masCompleta,
  type AtletaComparable,
  type GrupoDuplicado,
} from "../services/duplicados-atleta";

// ── Fichas que parecen la misma persona (Sprint PAS-14) ────────────────────
//
// EL CASO REAL: dos fichas «breyner dudlier riveros», una con sexo y país y
// otra con los dos en blanco, y las evaluaciones repartidas entre las dos. El
// histórico partido en dos expedientes que no se ven entre sí, y ninguna
// pantalla lo decía.
//
// ── SOSPECHA, NO DECIDE ───────────────────────────────────────────────────
//
//   El sistema no puede saber si dos homónimos son la misma persona. Dos
//   hermanos, un padre y un hijo, o dos clientes que se llaman igual son
//   perfectamente posibles. Así que esto AVISA y ofrece el botón; la
//   afirmación «son la misma persona» la hace quien pulsa.
//
// ── CUANDO LA IDENTIDAD SE CONTRADICE, NO SE OFRECE FUSIONAR ──────────────
//
//   Si una ficha dice varón y la otra mujer, o dan fechas de nacimiento
//   distintas, casi seguro NO son la misma persona. Ahí el aviso se queda en
//   aviso: ofrecer el botón invitaría a un error irreversible.
//
//   Un dato ausente en una y presente en otra no cuenta como contradicción —
//   es justo lo que la fusión arregla.

interface Props {
  grupos: readonly GrupoDuplicado[];
}

const MENSAJE: Record<string, string> = {
  NO_AUTENTICADO: "La sesión ha caducado.",
  MISMO_ATLETA: "Son la misma ficha.",
  ATLETA_NO_ENCONTRADO: "Una de las fichas ya no existe.",
  ATLETA_ELIMINADO: "No se puede fusionar una ficha eliminada.",
  NO_REASIGNADAS: "No se pudieron mover las evaluaciones. No se ha cambiado nada.",
  NO_ARCHIVADO: "Las evaluaciones se movieron, pero la ficha vacía no se archivó.",
};

/** Los datos de identidad, en una línea. `—` donde no consta. */
function identidad(a: AtletaComparable): string {
  return [a.sexo ?? "sin sexo", a.fechaNacimiento ?? "sin fecha de nacimiento", a.pais ?? "sin país"].join(
    " · ",
  );
}

export default function AtletasDuplicados({ grupos }: Props) {
  const router = useRouter();
  const [ocupado, setOcupado] = useState<string | null>(null);

  if (grupos.length === 0) return null;

  async function fusionar(desde: AtletaComparable, hasta: AtletaComparable) {
    if (ocupado) return;
    if (
      !window.confirm(
        `Vas a afirmar que estas dos fichas son la MISMA persona:\n\n` +
          `  · ${desde.nombre} (${identidad(desde)})\n` +
          `  · ${hasta.nombre} (${identidad(hasta)})\n\n` +
          `Sus evaluaciones pasarán a la segunda y la primera se archivará.\n\n` +
          `Las evaluaciones se interpretan con la identidad de su ficha, así que sus lecturas ` +
          `pueden cambiar. El traslado NO se puede deshacer.\n\n¿Continuar?`,
      )
    ) {
      return;
    }

    setOcupado(desde.id);
    const resultado = await accionFusionarAtletas(desde.id, hasta.id);
    setOcupado(null);

    if (!resultado.ok) {
      toast.error(MENSAJE[resultado.error] ?? resultado.error);
      return;
    }
    toast.success(
      resultado.data.movidas === 0
        ? "Ficha archivada. No tenía evaluaciones que mover."
        : `${resultado.data.movidas} evaluaciones movidas.`,
    );
    router.refresh();
  }

  return (
    <section
      aria-label="Fichas que parecen duplicadas"
      className="space-y-3 rounded-xl border border-yellow-500/25 bg-yellow-500/[0.04] p-4"
    >
      <div>
        <p className="text-sm font-semibold text-yellow-200/90">
          {grupos.length === 1
            ? "Hay dos fichas con el mismo nombre"
            : `Hay ${grupos.length} nombres repetidos entre tus fichas`}
        </p>
        <p className="mt-1 text-[12px] leading-relaxed text-white/55">
          Si son la misma persona, su histórico está partido en expedientes que no se ven entre sí:
          cada uno se interpreta con su propia identidad y ninguno tiene la serie completa.
        </p>
      </div>

      {grupos.map((grupo) => {
        const sugerida = masCompleta(grupo.atletas);
        return (
          <div key={grupo.clave} className="rounded-lg border border-white/[0.08] p-3">
            <ul className="space-y-1">
              {grupo.atletas.map((a) => (
                <li key={a.id} className="text-[13px] text-white/75">
                  <span className="font-semibold">{a.nombre}</span>
                  <span className="ml-2 text-white/40">{identidad(a)}</span>
                  {sugerida?.id === a.id && !grupo.identidadEnConflicto ? (
                    <span className="ml-2 text-[11px] text-emerald-300/70">
                      la más completa
                    </span>
                  ) : null}
                </li>
              ))}
            </ul>

            {grupo.identidadEnConflicto ? (
              <p className="mt-3 text-[12px] leading-relaxed text-white/50">
                Sus datos de identidad se contradicen, así que probablemente NO sean la misma
                persona y no se ofrece unirlas. Si de verdad lo son, corrige primero la ficha
                equivocada.
              </p>
            ) : (
              <div className="mt-3 flex flex-wrap items-center gap-2">
                {grupo.atletas
                  .filter((a) => a.id !== sugerida?.id)
                  .map((a) => (
                    <Button
                      key={a.id}
                      size="sm"
                      variant="outline"
                      disabled={ocupado !== null || !sugerida}
                      onClick={() => sugerida && void fusionar(a, sugerida)}
                    >
                      {ocupado === a.id ? (
                        <Spinner className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
                      ) : (
                        <Merge className="h-3.5 w-3.5" strokeWidth={2} />
                      )}
                      Mover sus evaluaciones a la ficha completa
                    </Button>
                  ))}
              </div>
            )}
          </div>
        );
      })}
    </section>
  );
}
