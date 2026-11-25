import type { Publicacion as Datos } from "@/data/publicaciones";
import { ArrowRight, Download } from "@/components/brand/icons";
import { cn } from "@/lib/utils";

// ── Ficha de una publicación científica ─────────────────────────────────────
// Dos vistas de los mismos datos (data/publicaciones.ts):
//   completa → /blog, con autores, descripción, temas, PDF, DOI y licencia.
//   compacta → "Tu entrenador" en la home, solo el titular y la referencia.
// Nunca dice "revisada por pares" ni "indexada": la revista no lo declara en
// la página del artículo y aquí no se afirma nada que no esté verificado.
// El enlace sale del sitio, así que lo avisa a los lectores de pantalla.

const MESES = [
  "enero", "febrero", "marzo", "abril", "mayo", "junio",
  "julio", "agosto", "septiembre", "octubre", "noviembre", "diciembre",
];

// A mano y no con toLocaleDateString: sin depender de los datos de idioma
// del servidor, el mismo texto sale igual en build, en servidor y en cliente.
function fechaLarga(iso: string): string {
  const [anio, mes, dia] = iso.split("-").map(Number);
  return `${dia} de ${MESES[mes - 1]} de ${anio}`;
}

function Referencia({ p, className }: { p: Datos; className?: string }) {
  return (
    <p className={cn("text-sm text-white/60", className)}>
      <cite className="not-italic font-semibold text-white/80">{p.revista}</cite> · {p.numero} ·{" "}
      <time dateTime={p.fecha}>{fechaLarga(p.fecha)}</time>
    </p>
  );
}

export default function Publicacion({
  p,
  variante = "completa",
  retardo = 0,
}: {
  p: Datos;
  variante?: "completa" | "compacta";
  retardo?: number;
}) {
  const estilo = { "--retardo": `${retardo}ms` } as React.CSSProperties;

  if (variante === "compacta") {
    return (
      <a
        href={p.url}
        target="_blank"
        rel="noopener noreferrer"
        data-reveal="up"
        style={estilo}
        className="group mt-8 flex items-start gap-4 rounded-2xl border border-white/10 bg-neutral-900/60 p-5 transition-colors duration-300 hover:border-orange-500/60"
      >
        <span className="min-w-0 flex-1">
          <span className="block font-display text-xs font-bold uppercase tracking-[0.18em] text-orange-400">
            Publicación científica
          </span>
          <span className="mt-2 block font-semibold leading-snug text-white">{p.titulo}</span>
          <span className="mt-1.5 block text-sm text-white/60">
            {p.revista} · {p.anio} · Primer autor
          </span>
        </span>
        <ArrowRight
          className="mt-1 h-5 w-5 shrink-0 text-orange-400 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1"
          strokeWidth={2.5}
        />
        <span className="sr-only">(se abre en una pestaña nueva)</span>
      </a>
    );
  }

  return (
    <article
      data-reveal="up"
      style={estilo}
      className="rounded-3xl border border-orange-500/25 bg-[linear-gradient(135deg,rgba(255,105,0,0.07),transparent_55%)] p-7 md:p-10"
    >
      <p className="font-display text-xs font-bold uppercase tracking-[0.22em] text-orange-400">
        Publicación científica
      </p>
      <h2 className="mt-5 font-display text-[length:clamp(1.75rem,3.4vw,2.75rem)] font-black normal-case leading-[1.08] text-white">
        {p.titulo}
      </h2>
      <p className="mt-5 text-sm leading-relaxed text-white/70">
        {p.autores.map((autor, i) => (
          <span key={autor}>
            {i > 0 && ", "}
            {i === 0 ? <strong className="font-bold text-white">{autor}</strong> : autor}
          </span>
        ))}
      </p>
      <Referencia p={p} className="mt-2" />
      <p className="mt-6 max-w-2xl leading-relaxed text-white/75">{p.descripcion}</p>

      <ul className="mt-6 flex flex-wrap gap-2">
        {p.temas.map((tema) => (
          <li
            key={tema}
            className="rounded-full border border-white/10 bg-white/[0.04] px-3 py-1 text-xs font-medium text-white/65"
          >
            {tema}
          </li>
        ))}
      </ul>

      <div className="mt-8 flex flex-wrap items-center gap-3">
        <a
          href={p.url}
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex min-h-11 items-center gap-2 rounded-full bg-orange-500 px-6 font-display text-[15px] font-bold uppercase tracking-[0.06em] text-neutral-950 transition-colors duration-200 hover:bg-orange-400"
        >
          Leer el artículo
          <ArrowRight
            className="h-4 w-4 motion-safe:transition-transform motion-safe:duration-300 motion-safe:group-hover:translate-x-1"
            strokeWidth={2.5}
          />
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </a>
        <a
          href={p.pdf}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex min-h-11 items-center gap-2 rounded-full border border-white/25 px-6 font-display text-[15px] font-bold uppercase tracking-[0.06em] text-white transition-colors duration-200 hover:border-white hover:bg-white/[0.06]"
        >
          <Download className="h-4 w-4" strokeWidth={2.5} />
          PDF
          <span className="sr-only">(se abre en una pestaña nueva)</span>
        </a>
      </div>

      <p className="mt-6 text-xs leading-relaxed text-white/45">
        DOI{" "}
        <a
          href={p.doi}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-white/70"
        >
          {p.doi.replace("https://doi.org/", "")}
        </a>{" "}
        · Publicado bajo licencia{" "}
        <a
          href={p.licencia.url}
          target="_blank"
          rel="noopener noreferrer"
          className="underline underline-offset-2 transition-colors hover:text-white/70"
        >
          {p.licencia.nombre}
        </a>
      </p>
    </article>
  );
}
