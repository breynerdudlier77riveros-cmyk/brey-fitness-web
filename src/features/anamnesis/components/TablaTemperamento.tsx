"use client";

import { TEMPERAMENTO_SITUACIONES, TEMPERAMENTO_RESULTADO } from "@/lib/anamnesis/datos-fijos";

interface Props {
  datos: Record<string, string>;
  onChange: (clave: string, valor: string) => void;
}

/**
 * Test de los 4 temperamentos: 13 situaciones, 4 descripciones largas cada
 * una (A–D). Se elige la que más se parezca; la mayoría de letras al final
 * señala el temperamento dominante (`TEMPERAMENTO_RESULTADO`).
 */
export default function TablaTemperamento({ datos, onChange }: Props) {
  const conteo: Record<"A" | "B" | "C" | "D", number> = { A: 0, B: 0, C: 0, D: 0 };
  for (const situacion of TEMPERAMENTO_SITUACIONES) {
    const elegida = datos[`temperamento.${situacion.id}`];
    if (elegida === "A" || elegida === "B" || elegida === "C" || elegida === "D") conteo[elegida]++;
  }
  const mayoria = (Object.entries(conteo) as [keyof typeof conteo, number][]).reduce(
    (mejor, actual) => (actual[1] > mejor[1] ? actual : mejor),
    ["", 0] as [string, number],
  );

  return (
    <section data-seccion="temperamento" className="break-inside-avoid-page">
      <h2 className="text-lg font-black text-white mb-1.5">Test de los 4 temperamentos</h2>
      <p className="text-sm text-white/50 mb-5">
        Para cada situación, marque la descripción (A, B, C o D) que más se
        parezca a usted.
      </p>

      <div className="space-y-5">
        {TEMPERAMENTO_SITUACIONES.map((situacion) => {
          const clave = `temperamento.${situacion.id}`;
          return (
            <div key={situacion.id} data-fila={situacion.id} className="break-inside-avoid-page">
              <p className="text-sm font-bold text-white/85 mb-2">
                {situacion.id}. {situacion.situacion}
              </p>
              <div className="space-y-2">
                {situacion.opciones.map((opcion) => (
                  <label
                    key={opcion.letra}
                    className="flex items-start gap-2.5 text-[13px] leading-relaxed text-white/65"
                  >
                    <input
                      type="radio"
                      name={clave}
                      value={opcion.letra}
                      checked={(datos[clave] ?? "") === opcion.letra}
                      onChange={() => onChange(clave, opcion.letra)}
                      className="accent-orange-500 w-4 h-4 mt-0.5 shrink-0 cursor-pointer"
                    />
                    <span>
                      <strong className="text-white/80">{opcion.letra}. </strong>
                      {opcion.texto}
                    </span>
                  </label>
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-6 rounded-xl border border-white/10 bg-white/[0.02] p-4 text-sm text-white/70">
        <p className="font-semibold text-white/85 mb-1">Resultado</p>
        <p>
          A: {conteo.A} · B: {conteo.B} · C: {conteo.C} · D: {conteo.D}
          {mayoria[1] > 0 ? (
            <>
              {" "}
              — temperamento dominante:{" "}
              <strong className="text-white">
                {TEMPERAMENTO_RESULTADO[mayoria[0] as "A" | "B" | "C" | "D"].nombre}
              </strong>{" "}
              ({TEMPERAMENTO_RESULTADO[mayoria[0] as "A" | "B" | "C" | "D"].tipo},{" "}
              {TEMPERAMENTO_RESULTADO[mayoria[0] as "A" | "B" | "C" | "D"].fluido.toLowerCase()})
            </>
          ) : null}
        </p>
      </div>
    </section>
  );
}
