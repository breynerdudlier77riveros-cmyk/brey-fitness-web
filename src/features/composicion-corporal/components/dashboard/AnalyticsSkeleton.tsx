// ── Esqueleto del dashboard (Sprint BCS-5.0) ───────────────────────────────
// Reproduce la silueta real: seis métricas, dos gráficos y una lista. Un
// esqueleto con otra forma produce salto de layout al llegar el contenido.

function Bloque({ className = "" }: { className?: string }) {
  return (
    <div
      className={`rounded-2xl border border-white/[0.07] bg-white/[0.02] animate-pulse motion-reduce:animate-none ${className}`}
    />
  );
}

export default function AnalyticsSkeleton() {
  return (
    <div aria-busy="true" className="space-y-8">
      <div className="space-y-2">
        <div className="h-6 w-52 rounded-full bg-white/[0.06] animate-pulse motion-reduce:animate-none" />
        <div className="h-3 w-72 rounded-full bg-white/[0.06] animate-pulse motion-reduce:animate-none" />
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-3 gap-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <Bloque key={i} className="h-28" />
        ))}
      </div>

      <div className="grid lg:grid-cols-2 gap-4">
        <Bloque className="h-56" />
        <Bloque className="h-56" />
      </div>

      <Bloque className="h-64" />
    </div>
  );
}
