import type { LecturaTransversal } from "@/lib/bcs/lectura-transversal";

// ── Lectura de esta medición (Sprint BCS-8.0) ──────────────────────────────
//
// Abre el apartado de Interpretación, delante de todo lo demás, porque es lo
// único de ese apartado que habla del CUERPO del cliente y no del análisis.
//
// Lo que iba antes —«el análisis se apoya en una única medición», «tres
// variables no admiten clasificación»— sigue estando, detrás. Es cierto y hace
// falta, pero como marco de lo que se afirma, no como sustituto de afirmar
// algo.
//
// El fundamento de cada lectura se muestra en pequeño debajo. No es adorno:
// es lo que permite comprobar una a una que ninguna se inventó.

interface Props {
  lecturas: readonly LecturaTransversal[];
}

export default function CrossSectionalReading({ lecturas }: Props) {
  if (lecturas.length === 0) return null;

  return (
    <div className="space-y-4">
      {lecturas.map((l) => (
        <article
          key={l.id}
          data-lectura={l.id}
          className="rounded-xl border border-white/[0.06] bg-white/[0.02] p-4"
        >
          <h4 className="mb-1.5 text-sm font-bold text-white/85">{l.titulo}</h4>
          <p className="max-w-3xl text-sm leading-relaxed text-white/70">{l.texto}</p>
          <p className="mt-2.5 text-[9px] leading-relaxed text-white/25">{l.fundamento}</p>
        </article>
      ))}
    </div>
  );
}
