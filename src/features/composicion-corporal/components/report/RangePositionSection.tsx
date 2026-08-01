import RangeBar, { type Zona } from "@/features/composicion-corporal/components/RangeBar";
import ProcedenciaBadge from "@/features/composicion-corporal/components/ProcedenciaBadge";
import type { FilaVariable } from "@/lib/bcs/reporte";

// ── Posición dentro del rango (BCS Sprint 2.0) ─────────────────────────────
// Hoy solo el IMC es clasificable con los datos que el modelo captura: %
// grasa y WHR exigen sexo y edad, y grasa visceral la escala del fabricante
// (BCS Handbook 06). No se dibuja una barra para una variable sin rango de
// referencia citado — sería sugerir una posición que nadie ha validado.
//
// El texto de la clasificación viene del dominio, con su aviso poblacional
// incluido; aquí no se reescribe ni se resume.

const ZONAS_IMC: Zona[] = [
  { hasta: 18.5, etiqueta: "Bajo peso", color: "bg-sky-500" },
  { hasta: 25, etiqueta: "Normal", color: "bg-emerald-500" },
  { hasta: 30, etiqueta: "Sobrepeso", color: "bg-amber-500" },
  { hasta: 40, etiqueta: "Obesidad", color: "bg-red-500" },
];

interface Props {
  imc: number;
  /** Filas de la ficha — traen la clasificación ya calculada por el dominio. */
  filas: FilaVariable[];
}

export default function RangePositionSection({ imc, filas }: Props) {
  const clasificadas = filas.filter((f) => f.clasificacion);

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <p className="text-sm font-bold text-white">IMC</p>
        <ProcedenciaBadge procedencia="validacion" />
      </div>

      <RangeBar valor={imc} min={10} max={40} zonas={ZONAS_IMC} unidad="kg/m²" />

      {clasificadas.map((f) => (
        <p key={f.id} className="text-xs text-white/55 leading-relaxed mt-4">
          {f.clasificacion!.texto}
        </p>
      ))}
    </>
  );
}
