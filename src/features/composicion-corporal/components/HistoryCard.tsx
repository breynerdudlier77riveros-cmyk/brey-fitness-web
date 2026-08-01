import { AccordionItem, AccordionTrigger, AccordionContent } from "@/components/brand/Accordion";
import Badge from "@/components/brand/Badge";
import Button from "@/components/brand/Button";
import { CATALOGO, type VariableId } from "@/lib/bcs/reporte";
import type { Medicion } from "@/lib/bcs/tipos";

// ── BCS-C03 · History Card (BCS Design Handbook 06) ────────────────────────
// "Fila compacta fecha + 3-4 variables clave + ícono de expansión; al
// expandir muestra la Ficha completa de esa Medición. Clicable. Nunca
// muestra una Medición anulada — solo vigentes." Se implementa como
// AccordionItem — pensado para vivir dentro de un único
// <Accordion type="single" collapsible> por lista (ver HistorialList),
// no un Accordion por fila.

const VARIABLES_CLAVE: VariableId[] = ["peso_kg", "grasa_pct", "masa_muscular_kg", "imc"];

function formatearFecha(iso: string) {
  return new Date(`${iso}T00:00:00`).toLocaleDateString("es", { day: "2-digit", month: "short", year: "numeric" });
}

interface Props {
  medicion: Medicion;
  corregida?: boolean;
  /**
   * Presente SOLO en el panel del Entrenador (BCS-ADR-05: la paridad es de
   * contenido informativo, no de controles de edición — ausente en la
   * vista pública, nunca en ReportView cuando la invoca /reportes/[token]).
   */
  onCorregir?: (medicion: Medicion) => void;
}

export default function HistoryCard({ medicion, corregida, onCorregir }: Props) {
  const claves = VARIABLES_CLAVE
    .map((id) => ({ id, valor: medicion[id], def: CATALOGO[id] }))
    .filter((v) => v.valor !== null && v.valor !== undefined);

  return (
    <AccordionItem value={medicion.id}>
      <AccordionTrigger>
        <div className="flex items-center gap-4 flex-wrap w-full pr-2">
          <span className="font-bold text-white text-sm flex-shrink-0">{formatearFecha(medicion.fecha)}</span>
          {corregida && (
            <Badge variant="neutral" className="text-[10px] px-2 py-0.5">
              Corregida
            </Badge>
          )}
          <div className="flex items-center gap-3 flex-wrap text-xs text-white/55 font-semibold">
            {claves.map(({ id, valor, def }) => (
              <span key={id} className="tabular-nums">
                {def.etiqueta}: {(valor as number).toFixed(1)}
                {def.unidad ? ` ${def.unidad}` : ""}
              </span>
            ))}
          </div>
        </div>
      </AccordionTrigger>
      <AccordionContent>
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          {(Object.keys(CATALOGO) as VariableId[])
            .map((id) => ({ id, valor: medicion[id], def: CATALOGO[id] }))
            .filter((v) => v.valor !== null && v.valor !== undefined)
            .map(({ id, valor, def }) => (
              <div key={id}>
                <p className="text-[10px] font-bold tracking-[0.10em] uppercase text-white/40">{def.etiqueta}</p>
                <p className="text-sm font-bold text-white tabular-nums">
                  {(valor as number).toFixed(1)}
                  {def.unidad ? ` ${def.unidad}` : ""}
                </p>
              </div>
            ))}
        </div>
        {medicion.observaciones && (
          <p className="text-xs text-white/50 mt-4 leading-relaxed">{medicion.observaciones}</p>
        )}
        {onCorregir && (
          <Button type="button" variant="outline" size="sm" className="mt-4" onClick={() => onCorregir(medicion)}>
            Corregir esta medición
          </Button>
        )}
      </AccordionContent>
    </AccordionItem>
  );
}
