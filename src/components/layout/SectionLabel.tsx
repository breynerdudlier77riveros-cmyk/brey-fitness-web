export default function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex items-center gap-4 mb-16">
      <div className="h-px flex-1 bg-gradient-to-r from-transparent to-white/15" />
      <span className="font-display text-sm font-bold tracking-[0.25em] uppercase text-orange-400">
        {children}
      </span>
      <div className="h-px flex-1 bg-gradient-to-l from-transparent to-white/15" />
    </div>
  );
}
