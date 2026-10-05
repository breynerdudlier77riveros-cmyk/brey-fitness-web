"use client";

import Input from "@/components/brand/Input";
import { ALIMENTOS } from "@/lib/anamnesis/datos-fijos";

interface Props {
  datos: Record<string, string>;
  onChange: (clave: string, valor: string) => void;
}

/** Frecuencia de consumo de alimentos: 4 columnas editables por alimento fijo. */
export default function TablaAlimentos({ datos, onChange }: Props) {
  return (
    <section data-seccion="alimentos" className="break-inside-avoid-page">
      <h2 className="text-lg font-black text-white mb-1.5">
        Frecuencia de consumo de alimentos
      </h2>
      <p className="text-sm text-white/50 mb-4">
        Días/semana (0–7), veces/día y cantidad por porción — ver la porción de
        referencia de cada alimento en la última columna.
      </p>
      <div className="overflow-x-auto">
        <table className="w-full text-sm border-collapse">
          <thead>
            <tr className="text-left text-[11px] uppercase tracking-wider text-white/45 border-b border-white/10">
              <th className="py-2 pr-2 font-semibold">Alimento</th>
              <th className="py-2 px-2 font-semibold w-24">Días/semana</th>
              <th className="py-2 px-2 font-semibold w-24">Veces/día</th>
              <th className="py-2 px-2 font-semibold w-40">Cantidad semanal</th>
              <th className="py-2 px-2 font-semibold w-40">Cantidad mensual</th>
              <th className="py-2 pl-2 font-semibold text-white/30">Porción de referencia</th>
            </tr>
          </thead>
          <tbody>
            {ALIMENTOS.map((alimento) => (
              <tr key={alimento.id} className="border-b border-white/[0.06]" data-fila={alimento.id}>
                <td className="py-1.5 pr-2 text-white/80">{alimento.etiqueta}</td>
                <td className="py-1.5 px-2">
                  <Input
                    type="number"
                    min={0}
                    max={7}
                    value={datos[`alim.${alimento.id}.diasSemana`] ?? ""}
                    onChange={(e) => onChange(`alim.${alimento.id}.diasSemana`, e.target.value)}
                    className="h-8 py-1 text-sm"
                  />
                </td>
                <td className="py-1.5 px-2">
                  <Input
                    type="number"
                    min={0}
                    value={datos[`alim.${alimento.id}.vecesDia`] ?? ""}
                    onChange={(e) => onChange(`alim.${alimento.id}.vecesDia`, e.target.value)}
                    className="h-8 py-1 text-sm"
                  />
                </td>
                <td className="py-1.5 px-2">
                  <Input
                    value={datos[`alim.${alimento.id}.cantidadSemanal`] ?? ""}
                    onChange={(e) => onChange(`alim.${alimento.id}.cantidadSemanal`, e.target.value)}
                    className="h-8 py-1 text-sm"
                  />
                </td>
                <td className="py-1.5 px-2">
                  <Input
                    value={datos[`alim.${alimento.id}.cantidadMensual`] ?? ""}
                    onChange={(e) => onChange(`alim.${alimento.id}.cantidadMensual`, e.target.value)}
                    className="h-8 py-1 text-sm"
                  />
                </td>
                <td className="py-1.5 pl-2 text-white/30 text-[12px]">{alimento.porcion}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  );
}
