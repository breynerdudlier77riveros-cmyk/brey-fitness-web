import Link from "next/link";
import type { ComponentType } from "react";
import { Card } from "@/components/brand/Card";

export interface QuickAction {
  label: string;
  href: string;
  icon: ComponentType<{ className?: string; strokeWidth?: number }>;
}

interface Props {
  actions: QuickAction[];
}

export default function QuickActionsCard({ actions }: Props) {
  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {actions.map(({ label, href, icon: Icon }) => (
        <Link key={href} href={href} className="block group">
          <Card interactive className="flex flex-col items-center justify-center gap-2 py-5 text-center">
            <Icon
              className="w-5 h-5 text-white/60 group-hover:text-orange-400 transition-colors"
              strokeWidth={1.75}
            />
            <span className="text-white/70 text-xs font-semibold">{label}</span>
          </Card>
        </Link>
      ))}
    </div>
  );
}
