import Badge from "@/components/brand/Badge";
import { nombrePrueba } from "../schemas/catalogo";
import type { RegistroWorkspace } from "../schemas/tipos";
import type { ValorRegistro } from "@/lib/pas";

// ── Pruebas registradas (Sprint PAS-7.0) ───────────────────────────────────
// Muestra lo registrado, incluidos los anulados: dejan de participar, no dejan
// de existir (PAS I-02). Ocultarlos haría indistinguible «nunca se registró»
// de «se registró y se anuló».

interface Props {
  registros: readonly RegistroWorkspace[];
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

export default function RegistrosTabla({ registros }: Props) {
  if (registros.length === 0) {
    return (
      <p className="text-sm text-white/50">
        Esta evaluación todavía no tiene pruebas registradas.
      </p>
    );
  }

  return (
    <div className="overflow-x-auto">
      <p className="sr-only">
        Tabla de {registros.length} pruebas registradas, con prueba, valor, fecha y estado.
      </p>

      <table className="w-full border-collapse text-sm">
        <caption className="sr-only">Pruebas registradas en esta evaluación</caption>
        <thead>
          <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/40">
            <th scope="col" className="py-2 pr-3 font-semibold">Prueba</th>
            <th scope="col" className="py-2 pr-3 font-semibold">Valor</th>
            <th scope="col" className="py-2 pr-3 font-semibold">Fecha</th>
            <th scope="col" className="py-2 font-semibold">Estado</th>
          </tr>
        </thead>
        <tbody>
          {registros.map((registro) => (
            <tr
              key={registro.id}
              data-registro={registro.id}
              data-estado={registro.estado}
              className="border-b border-white/5"
            >
              <th scope="row" className="py-2 pr-3 text-left font-medium">
                {nombrePrueba(registro.pruebaId)}
                <span className="ml-1.5 font-mono text-[11px] font-normal text-white/40">
                  {registro.pruebaId}
                </span>
                {registro.patron ? (
                  <span className="block text-[11px] font-normal text-white/40">
                    {registro.patron}
                  </span>
                ) : null}
              </th>
              <td className="py-2 pr-3 tabular-nums text-white/70">
                {formatearValor(registro.valor)}
              </td>
              <td className="py-2 pr-3 tabular-nums text-white/60">{registro.fecha}</td>
              <td className="py-2">
                <Badge
                  variant={registro.estado === "vigente" ? "success" : "neutral"}
                  className="px-2 py-0.5 text-[10px]"
                >
                  {registro.estado === "vigente" ? "Vigente" : "Anulada"}
                </Badge>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
