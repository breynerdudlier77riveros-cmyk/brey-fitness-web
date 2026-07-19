// Suspense automático de Next.js: layout.tsx hace await de getUser() + perfil
// antes de poder construir Sidebar/Header, así que mientras esa carga real
// ocurre, ni siquiera el shell (sidebar/header) existe todavía — este
// skeleton reconstruye su silueta completa (no solo el contenido) para que
// no haya un salto de layout cuando el shell real aparece. Mismo lenguaje
// visual que DashboardPreview.tsx (bloques animate-pulse, alturas calcadas
// del contenido real, motion-reduce respetado).

function Bar({ className = "" }: { className?: string }) {
  return <div className={`rounded-full bg-white/[0.06] animate-pulse motion-reduce:animate-none ${className}`} />;
}

function CardSkeleton({ className = "" }: { className?: string }) {
  return <div className={`rounded-2xl border border-white/[0.07] bg-white/[0.02] p-5 md:p-7 ${className}`} />;
}

export default function AppLoading() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex flex-col md:flex-row">
      {/* Silueta del sidebar de escritorio */}
      <aside className="hidden md:flex md:w-60 md:flex-shrink-0 md:flex-col md:sticky md:top-0 md:h-screen border-r border-white/[0.06] bg-slate-950/60 px-3 py-6">
        <div className="flex items-center justify-between mb-8 px-1">
          <Bar className="h-4 w-20" />
          <div className="w-7 h-7 rounded-lg bg-white/[0.06] animate-pulse motion-reduce:animate-none" />
        </div>
        <div className="flex flex-col gap-1">
          {Array.from({ length: 7 }).map((_, i) => (
            <div key={i} className="h-10 rounded-xl bg-white/[0.03] flex items-center gap-3 px-3">
              <div className="w-4 h-4 rounded bg-white/[0.06] animate-pulse motion-reduce:animate-none flex-shrink-0" />
              <Bar className="h-2.5 flex-1" />
            </div>
          ))}
        </div>
        <div className="mt-auto pt-6 border-t border-white/[0.06] flex items-center gap-3 px-2">
          <div className="w-8 h-8 rounded-full bg-white/[0.06] animate-pulse motion-reduce:animate-none flex-shrink-0" />
          <div className="min-w-0 flex-1 space-y-1.5">
            <Bar className="h-2.5 w-3/4" />
            <Bar className="h-2 w-1/2" />
          </div>
        </div>
      </aside>

      {/* Silueta de la barra superior móvil */}
      <header className="md:hidden sticky top-0 z-40 flex items-center justify-between px-4 h-14 border-b border-white/[0.06] bg-slate-950/90">
        <Bar className="h-4 w-20" />
        <div className="w-5 h-5 rounded bg-white/[0.06] animate-pulse motion-reduce:animate-none" />
      </header>

      <div className="flex-1 min-w-0 flex flex-col">
        {/* Silueta del header de escritorio */}
        <div className="hidden md:flex items-center justify-between gap-4 h-16 px-6 border-b border-white/[0.06]">
          <Bar className="h-3 w-40" />
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] animate-pulse motion-reduce:animate-none" />
            <div className="w-8 h-8 rounded-lg bg-white/[0.06] animate-pulse motion-reduce:animate-none" />
            <div className="w-8 h-8 rounded-full bg-white/[0.06] animate-pulse motion-reduce:animate-none" />
          </div>
        </div>

        {/* Silueta del contenido — misma cadencia que las 5 secciones del Dashboard */}
        <main className="flex-1">
          <div className="max-w-5xl mx-auto px-4 md:px-8 py-6 md:py-10 space-y-8">
            <div className="space-y-2.5">
              <Bar className="h-2.5 w-32" />
              <Bar className="h-6 w-56" />
            </div>
            <CardSkeleton className="h-40" />
            <div className="grid sm:grid-cols-2 gap-4">
              <CardSkeleton className="h-28" />
              <CardSkeleton className="h-28" />
            </div>
            <CardSkeleton className="h-32" />
          </div>
        </main>
      </div>
    </div>
  );
}
