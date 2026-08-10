import Image from "next/image";
import type { Reference } from "@/lib/content";

/**
 * Renderiza el cuerpo de un artículo del blog.
 *
 * Formato de línea (todo opcional, retrocompatible con los artículos antiguos
 * que solo usaban "### " y párrafos sueltos):
 *
 *   ### Título          → encabezado de sección
 *   #### Subtítulo      → encabezado menor
 *   > Texto             → cita destacada
 *   - Item              → lista (líneas consecutivas se agrupan)
 *   | a | b |           → tabla (líneas consecutivas; la primera es cabecera)
 *   [IMG:ruta|pie]      → figura; si `ruta` está vacía se pinta un hueco marcado
 *   [DATO:valor|texto]  → dato destacado
 *
 * En línea: **negrita**, [texto](url) y marcadores de cita [1], [2]…
 */

// ─── Inline: **negrita**, [texto](url) y marcadores de cita ──────────────────
function inline(text: string, key: string): React.ReactNode[] {
  const out: React.ReactNode[] = [];
  const re = /\*\*(.+?)\*\*|\[([^\]]+)\]\((https?:\/\/[^)]+)\)|\[(\d+)\]/g;
  let last = 0;
  let m: RegExpExecArray | null;
  let i = 0;

  while ((m = re.exec(text)) !== null) {
    if (m.index > last) out.push(text.slice(last, m.index));
    if (m[1] !== undefined) {
      out.push(
        <strong key={`${key}-b${i}`} className="font-semibold text-white">
          {m[1]}
        </strong>
      );
    } else if (m[2] !== undefined) {
      out.push(
        <a
          key={`${key}-a${i}`}
          href={m[3]}
          target="_blank"
          rel="noopener noreferrer"
          className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 hover:decoration-orange-400 transition-colors"
        >
          {m[2]}
        </a>
      );
    } else {
      out.push(
        <a
          key={`${key}-c${i}`}
          href={`#ref-${m[4]}`}
          className="align-super text-[0.7em] font-semibold text-orange-400 hover:text-orange-300 ml-0.5"
        >
          [{m[4]}]
        </a>
      );
    }
    last = m.index + m[0].length;
    i++;
  }
  if (last < text.length) out.push(text.slice(last));
  return out;
}

// ─── Figura ──────────────────────────────────────────────────────────────────
function Figure({ src, caption, k }: { src: string; caption: string; k: string }) {
  return (
    <figure className="my-10">
      {src ? (
        <div className="relative w-full overflow-hidden rounded-2xl border border-white/[0.08] bg-white/[0.02]">
          <Image
            src={src}
            alt={caption}
            width={1200}
            height={800}
            className="h-auto w-full object-cover"
            sizes="(max-width: 768px) 100vw, 42rem"
          />
        </div>
      ) : (
        <div className="flex min-h-[13rem] items-center justify-center rounded-2xl border border-dashed border-white/[0.14] bg-white/[0.02] px-6 py-10 text-center">
          <span className="text-sm leading-relaxed text-white/40">
            Imagen pendiente
            <span className="mt-1 block text-white/30">{caption}</span>
          </span>
        </div>
      )}
      <figcaption className="mt-3 text-center text-sm leading-relaxed text-white/45">
        {inline(caption, `fig-${k}`)}
      </figcaption>
    </figure>
  );
}

// ─── Cuerpo ──────────────────────────────────────────────────────────────────
export default function ArticleBody({
  body,
  references,
}: {
  body: string[];
  references?: Reference[];
}) {
  const nodes: React.ReactNode[] = [];
  let i = 0;

  while (i < body.length) {
    const line = body[i];

    // Lista
    if (line.startsWith("- ")) {
      const items: string[] = [];
      while (i < body.length && body[i].startsWith("- ")) {
        items.push(body[i].slice(2));
        i++;
      }
      nodes.push(
        <ul key={`ul-${i}`} className="space-y-2.5 pl-1">
          {items.map((it, n) => (
            <li key={n} className="flex gap-3 text-[1.05rem] leading-relaxed text-white/70">
              <span aria-hidden className="mt-[0.6em] h-1 w-1 shrink-0 rounded-full bg-orange-400/70" />
              <span>{inline(it, `li-${i}-${n}`)}</span>
            </li>
          ))}
        </ul>
      );
      continue;
    }

    // Tabla
    if (line.startsWith("|")) {
      const rows: string[][] = [];
      while (i < body.length && body[i].startsWith("|")) {
        const cells = body[i].split("|").slice(1, -1).map((c) => c.trim());
        if (!cells.every((c) => /^-{2,}$/.test(c))) rows.push(cells);
        i++;
      }
      const [head, ...rest] = rows;
      nodes.push(
        <div key={`tb-${i}`} className="my-8 overflow-x-auto rounded-2xl border border-white/[0.08]">
          <table className="w-full border-collapse text-left text-sm">
            <thead>
              <tr className="bg-white/[0.04]">
                {head.map((c, n) => (
                  <th key={n} className="whitespace-nowrap px-4 py-3 font-semibold text-white/80">
                    {inline(c, `th-${i}-${n}`)}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rest.map((r, rn) => (
                <tr key={rn} className="border-t border-white/[0.06]">
                  {r.map((c, cn) => (
                    <td key={cn} className="px-4 py-3 text-white/65">
                      {inline(c, `td-${i}-${rn}-${cn}`)}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      );
      continue;
    }

    i++;

    // Figura
    const img = line.match(/^\[IMG:([^|\]]*)\|?([^\]]*)\]$/);
    if (img) {
      nodes.push(<Figure key={`im-${i}`} src={img[1].trim()} caption={img[2].trim()} k={String(i)} />);
      continue;
    }

    // Dato destacado
    const dato = line.match(/^\[DATO:([^|\]]+)\|([^\]]+)\]$/);
    if (dato) {
      nodes.push(
        <div
          key={`dt-${i}`}
          className="my-8 rounded-2xl border border-orange-500/20 bg-orange-500/[0.06] px-6 py-6 text-center"
        >
          <p className="font-display text-4xl font-black leading-none text-orange-400">{dato[1]}</p>
          <p className="mt-2 text-sm leading-relaxed text-white/60">{inline(dato[2], `dt-${i}`)}</p>
        </div>
      );
      continue;
    }

    // Cita destacada
    if (line.startsWith("> ")) {
      nodes.push(
        <blockquote
          key={`bq-${i}`}
          className="my-8 border-l-2 border-orange-400/50 bg-white/[0.02] py-4 pl-5 pr-4 text-[1.05rem] italic leading-relaxed text-white/75"
        >
          {inline(line.slice(2), `bq-${i}`)}
        </blockquote>
      );
      continue;
    }

    // Encabezados
    if (line.startsWith("#### ")) {
      nodes.push(
        <h3 key={`h3-${i}`} className="pt-4 text-lg font-bold text-white/90">
          {inline(line.slice(5), `h3-${i}`)}
        </h3>
      );
      continue;
    }
    if (line.startsWith("### ")) {
      nodes.push(
        <h2 key={`h2-${i}`} className="pt-6 text-xl font-black text-white">
          {inline(line.slice(4), `h2-${i}`)}
        </h2>
      );
      continue;
    }

    // Párrafo
    nodes.push(
      <p key={`p-${i}`} className="text-[1.05rem] leading-relaxed text-white/70">
        {inline(line, `p-${i}`)}
      </p>
    );
  }

  return (
    <>
      <article className="space-y-6">{nodes}</article>

      {references && references.length > 0 && (
        <section className="mt-16 border-t border-white/[0.08] pt-10">
          <h2 className="mb-2 text-xl font-black text-white">Referencias</h2>
          <p className="mb-6 text-sm leading-relaxed text-white/45">
            Cada fuente fue localizada y leída directamente. Ninguna cita procede de
            resúmenes de terceros.
          </p>
          <ol className="space-y-4">
            {references.map((r) => (
              <li
                key={r.id}
                id={`ref-${r.id}`}
                className="scroll-mt-24 text-sm leading-relaxed text-white/55"
              >
                <span className="mr-2 font-semibold text-orange-400">[{r.id}]</span>
                <span className="text-white/70">{r.authors}</span> {r.title}{" "}
                <em className="text-white/60">{r.source}</em>
                {r.doi && (
                  <>
                    {" · "}
                    <a
                      href={`https://doi.org/${r.doi}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-orange-400 underline decoration-orange-400/30 underline-offset-2 hover:decoration-orange-400 transition-colors"
                    >
                      doi:{r.doi}
                    </a>
                  </>
                )}
                {r.note && <span className="mt-1 block text-white/40">{r.note}</span>}
              </li>
            ))}
          </ol>
        </section>
      )}
    </>
  );
}
