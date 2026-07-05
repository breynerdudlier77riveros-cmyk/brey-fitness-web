interface Props {
  title: string;
  updated: string; // "junio 2026"
  children: React.ReactNode;
}

// Layout compartido de páginas legales: columna de lectura, tipografía sobria.
// Los h2/p/ul del contenido se estilizan aquí para no repetir clases.
export default function LegalShell({ title, updated, children }: Props) {
  return (
    <main className="bg-slate-950 text-white">
      <div className="max-w-2xl mx-auto px-6 py-16 md:py-24">
        <p className="text-[11px] font-semibold tracking-[0.25em] uppercase text-white/25 mb-4">
          Legal
        </p>
        <h1 className="font-black text-3xl sm:text-4xl text-white mb-3">{title}</h1>
        <p className="text-white/25 text-xs mb-12">Última actualización: {updated}</p>

        <div className="space-y-4 [&_h2]:font-black [&_h2]:text-lg [&_h2]:text-white [&_h2]:pt-6 [&_p]:text-white/50 [&_p]:text-sm [&_p]:leading-relaxed [&_ul]:list-disc [&_ul]:pl-5 [&_ul]:space-y-2 [&_li]:text-white/50 [&_li]:text-sm [&_li]:leading-relaxed [&_a]:text-orange-400 [&_a]:underline-offset-2 hover:[&_a]:underline">
          {children}
        </div>
      </div>
    </main>
  );
}
