import PerformanceSection from "./PerformanceSection";
import type { ApendiceInforme } from "@/lib/pas/report";

// ── Apéndice (Sprint PAS-5.0) ──────────────────────────────────────────────
// Pruebas aplicadas y las cuatro coordenadas de versión.
//
// Las versiones no son un detalle técnico: dos informes calculados con
// versiones distintas de catálogo o de base de conocimiento NO son
// directamente comparables, y sin declararlas nadie podría saberlo.

interface Props {
  apendice: ApendiceInforme;
}

function Dato({ etiqueta, valor }: { etiqueta: string; valor: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-white/5 py-1.5">
      <dt className="text-white/50">{etiqueta}</dt>
      <dd className="font-mono text-xs text-white/70">{valor}</dd>
    </div>
  );
}

export default function PerformanceAppendix({ apendice }: Props) {
  const { pruebas, versiones } = apendice;

  return (
    <PerformanceSection id="apendice">
      <h3 className="mb-2 text-xs font-bold uppercase tracking-wider text-white/40">
        Pruebas aplicadas
      </h3>

      {pruebas.length === 0 ? (
        <p className="text-sm text-white/50">
          Ninguna prueba aportó registros elegibles a este perfil.
        </p>
      ) : (
        <div className="prs-tabla">
          <p className="sr-only">
            Tabla de {pruebas.length} pruebas aplicadas, con las capacidades a las que
            contribuyeron y la fecha del registro más reciente.
          </p>

          <table className="w-full border-collapse text-sm">
            <caption className="sr-only">Pruebas aplicadas en este informe</caption>
            <thead>
              <tr className="border-b border-white/10 text-left text-[11px] uppercase tracking-wider text-white/40">
                <th scope="col" className="py-2 pr-3 font-semibold">Prueba</th>
                <th scope="col" className="py-2 pr-3 font-semibold">Capacidades</th>
                <th scope="col" className="py-2 font-semibold">Último registro</th>
              </tr>
            </thead>
            <tbody>
              {pruebas.map((prueba) => (
                <tr
                  key={prueba.pruebaId}
                  data-prueba={prueba.pruebaId}
                  className="prs-fila border-b border-white/5"
                >
                  <th scope="row" className="py-2 pr-3 text-left font-mono text-xs font-medium">
                    {prueba.pruebaId}
                  </th>
                  <td className="py-2 pr-3 text-white/60">{prueba.capacidades.join(", ")}</td>
                  <td className="py-2 tabular-nums text-white/60">
                    {prueba.ultimaFecha ?? "—"}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <h3 className="mb-1 mt-6 text-xs font-bold uppercase tracking-wider text-white/40">
        Versiones
      </h3>

      <dl className="text-sm">
        <Dato etiqueta="Motor de evaluación (PAE)" valor={versiones.pae} />
        <Dato etiqueta="Motor de interpretación (PIE)" valor={versiones.pie} />
        <Dato etiqueta="Base de conocimiento (PKB)" valor={versiones.pkb} />
        <Dato etiqueta="Catálogo de pruebas" valor={versiones.catalogo} />
        <Dato etiqueta="Fecha de cálculo" valor={apendice.fecha} />
      </dl>

      <p className="mt-3 text-[11px] leading-relaxed text-white/40">
        Dos informes calculados con versiones distintas de catálogo o de base de conocimiento no
        son directamente comparables.
      </p>
    </PerformanceSection>
  );
}
