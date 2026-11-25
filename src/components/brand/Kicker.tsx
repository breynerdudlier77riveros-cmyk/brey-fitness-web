import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export default function Kicker({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <p className={cn("flex items-center gap-3 font-display text-sm font-bold uppercase tracking-[0.22em] text-orange-400", className)}>
      <span aria-hidden className="h-[3px] w-8 shrink-0 bg-orange-500" />
      {children}
    </p>
  );
}
