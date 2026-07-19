import { cn } from "@/lib/utils";

interface Props {
  label: string;
  children: React.ReactNode;
  className?: string;
}

/** Bloque con etiqueta — las 5 secciones del Dashboard home. */
export default function Section({ label, children, className }: Props) {
  return (
    <section className={cn(className)}>
      <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-white/50 mb-3">{label}</p>
      {children}
    </section>
  );
}
