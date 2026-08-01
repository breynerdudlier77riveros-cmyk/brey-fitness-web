// ── Fotografías de progreso (BCS Sprint 3.0) ───────────────────────────────
// Galería cronológica ascendente (BCS Handbook 04, sección 8). El orden ya
// llega resuelto desde construirReporte; aquí solo se dispone.

interface Props {
  fotografias: { url: string; fecha: string }[];
}

export default function PhotoGallery({ fotografias }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 print:grid-cols-4 gap-3">
      {fotografias.map((f) => (
        <figure key={f.url} className="m-0">
          {/* eslint-disable-next-line @next/next/no-img-element -- URL de Storage externa, sin dominio conocido para next/image */}
          <img
            src={f.url}
            alt={`Fotografía de progreso — ${f.fecha}`}
            className="w-full aspect-square object-cover rounded-xl border border-white/[0.07]"
          />
          <figcaption className="text-[10px] text-white/40 mt-1.5 text-center">{f.fecha}</figcaption>
        </figure>
      ))}
    </div>
  );
}
