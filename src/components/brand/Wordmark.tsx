import { cn } from "@/lib/utils";

export default function Wordmark({ className }: { className?: string }) {
  return (
    <span className={cn("font-display text-2xl font-black uppercase italic leading-none tracking-[-0.01em] text-white", className)}>
      <span className="text-orange-500">Brey</span> Fitness
    </span>
  );
}
