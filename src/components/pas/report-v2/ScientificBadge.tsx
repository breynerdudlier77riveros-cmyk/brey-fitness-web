import Badge from "@/components/brand/Badge";

// ── Distintivo de estado científico (PRS v2.0) ─────────────────────────────
//
// El color es INFORMATIVO, nunca valorativo. «Cuestionada» no se pinta en rojo:
// no es un error del atleta ni una alarma, es una propiedad de la evidencia. El
// texto siempre está presente, así que nadie depende del color para leerlo.

type Clase = "calidad" | "estado" | "conflicto" | "tipo";

interface Props {
  /** Qué eje describe. Solo determina el tono, nunca el orden ni el juicio. */
  clase: Clase;
  /** Texto ya rotulado por el modelo de vista. */
  texto: string;
  /** Marca los ejes que piden atención del lector: ES-2 y conflicto. */
  destacado?: boolean;
}

const TONO: Record<Clase, "success" | "neutral" | "crudo" | "fabricante"> = {
  calidad: "neutral",
  estado: "neutral",
  conflicto: "neutral",
  tipo: "neutral",
};

export default function ScientificBadge({ clase, texto, destacado = false }: Props) {
  return (
    <Badge
      variant={destacado ? "fabricante" : TONO[clase]}
      className="prs2-badge px-2 py-0.5 text-[10px]"
    >
      <span className="sr-only">{clase}: </span>
      {texto}
    </Badge>
  );
}
