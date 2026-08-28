import Badge from "@/components/brand/Badge";
import AnularRegistro from "./AnularRegistro";
import { nombrePrueba, pruebaRegistrable } from "../schemas/catalogo";
import { FAMILIAS } from "@/lib/pas/capacidades";
import type { FamiliaId } from "@/lib/pas/capacidades";
import type { RegistroWorkspace } from "../schemas/tipos";
import type { ValorRegistro } from "@/lib/pas";

// ── Pruebas registradas (Sprint PAS-7.0 · reordenada en PAS-15) ────────────
//
// Muestra lo registrado, incluidos los anulados: dejan de participar, no dejan
// de existir (PAS I-02). Ocultarlos haría indistinguible «nunca se registró»
// de «se registró y se anuló».
//
// ── POR QUÉ SE AGRUPA POR FAMILIA ─────────────────────────────────────────
//
//   Con dieciocho registros, la lista plana era la que llegaba: un 1RM, una
//   dinamometría, otro 1RM, un salto… en el orden en que se teclearon. Para
//   ver si una capacidad estaba cubierta había que recorrerla entera.
//
//   Agrupada por lo que MIDE cada prueba, la cobertura se lee de un vistazo y
//   coincide con el perfil por dominios del informe. Dentro de cada familia,
//   por prueba y fecha: es el orden en que se consulta, no en el que se
//   escribió.
//
// El patrón se enseña junto al valor y no debajo del nombre: cuatro 1RM de
// levantamientos distintos son cuatro filas que solo se distinguen por él.

interface Props {
  registros: readonly RegistroWorkspace[];
  /** La evaluación a la que pertenecen, para poder anular. */
  evaluacionId?: string;
  /** Si la evaluación admite cambios. Lo decide la máquina de estados, fuera. */
  editable?: boolean;
}

function formatearValor(valor: ValorRegistro): string {
  switch (valor.tipo) {
    case "continuo":
      return `${valor.valor} ${valor.unidad}`.trim();
    case "ordinal":
      return `${valor.valor} / ${valor.escala}`;
    case "binario":
      return valor.valor ? "Sí" : "No";
    case "categorico":
      return valor.valor;
  }
}

/** La familia de una prueba, o un cajón para las que el catálogo no conoce. */
function familiaDe(pruebaId: string): { id: string; nombre: string } {
  const def = pruebaRegistrable(pruebaId);
  if (!def) return { id: "Z", nombre: "Fuera del catálogo" };
  return { id: def.familia, nombre: FAMILIAS[def.familia as FamiliaId] ?? def.familia };
}

export default function RegistrosTabla({ registros, evaluacionId, editable = false }: Props) {
  if (registros.length === 0) {
    return (
      <p className="text-sm text-white/50">Esta evaluación todavía no tiene pruebas registradas.</p>
    );
  }

  const grupos = new Map<string, { nombre: string; filas: RegistroWorkspace[] }>();
  for (const r of registros) {
    const f = familiaDe(r.pruebaId);
    const g = grupos.get(f.id) ?? { nombre: f.nombre, filas: [] };
    g.filas.push(r);
    grupos.set(f.id, g);
  }

  const ordenados = [...grupos.entries()].sort(([a], [b]) => a.localeCompare(b));
  for (const [, g] of ordenados) {
    g.filas.sort(
      (x, y) =>
        x.pruebaId.localeCompare(y.pruebaId) ||
        (x.patron ?? "").localeCompare(y.patron ?? "") ||
        x.fecha.localeCompare(y.fecha),
    );
  }

  return (
    <div className="space-y-6">
      <p className="sr-only">
        {registros.length} pruebas registradas, agrupadas por familia, con prueba, valor, fecha y
        estado.
      </p>

      {ordenados.map(([id, grupo]) => (
        <section key={id} aria-label={grupo.nombre}>
          <h3 className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
            {grupo.nombre}
            <span className="ml-2 font-normal tracking-normal text-white/25">
              {grupo.filas.length}
            </span>
          </h3>

          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">{grupo.nombre}</caption>
            <thead>
              <tr className="border-b border-white/10 text-left text-[10px] uppercase tracking-wider text-white/30">
                <th scope="col" className="py-1.5 pr-3 font-semibold">
                  Prueba
                </th>
                <th scope="col" className="py-1.5 pr-3 font-semibold">
                  Valor
                </th>
                <th scope="col" className="py-1.5 pr-3 font-semibold">
                  Fecha
                </th>
                <th scope="col" className="py-1.5 pr-3 font-semibold">
                  Estado
                </th>
                {editable ? (
                  <th scope="col" className="py-1.5 font-semibold">
                    <span className="sr-only">Acciones</span>
                  </th>
                ) : null}
              </tr>
            </thead>
            <tbody>
              {grupo.filas.map((registro) => (
                <tr
                  key={registro.id}
                  data-registro={registro.id}
                  data-estado={registro.estado}
                  className={`border-b border-white/5 ${
                    registro.estado === "vigente" ? "" : "opacity-45"
                  }`}
                >
                  <th scope="row" className="py-2 pr-3 text-left font-medium">
                    {nombrePrueba(registro.pruebaId)}
                    {registro.patron ? (
                      <span className="ml-2 rounded-full border border-white/[0.10] px-2 py-0.5 text-[11px] font-normal text-white/55">
                        {registro.patron}
                      </span>
                    ) : null}
                  </th>
                  <td className="py-2 pr-3 tabular-nums text-white/70">
                    {formatearValor(registro.valor)}
                  </td>
                  <td className="py-2 pr-3 tabular-nums text-white/60">{registro.fecha}</td>
                  <td className="py-2 pr-3">
                    <Badge
                      variant={registro.estado === "vigente" ? "success" : "neutral"}
                      className="px-2 py-0.5 text-[10px]"
                    >
                      {registro.estado === "vigente" ? "Vigente" : "Anulada"}
                    </Badge>
                  </td>
                  {editable ? (
                    <td className="py-2">
                      {/* Solo los vigentes: anular lo ya anulado no significa
                          nada, y el estado es terminal. */}
                      {registro.estado === "vigente" && evaluacionId ? (
                        <AnularRegistro
                          registroId={registro.id}
                          evaluacionId={evaluacionId}
                          descripcion={`${nombrePrueba(registro.pruebaId)}${
                            registro.patron ? ` · ${registro.patron}` : ""
                          } · ${formatearValor(registro.valor)} · ${registro.fecha}`}
                        />
                      ) : null}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </section>
      ))}
    </div>
  );
}
