import DashboardCard from "@/components/app/DashboardCard";

interface Props {
  label: string;
  value: string | number;
  hint?: string;
}

export default function MetricCard({ label, value, hint }: Props) {
  return (
    <DashboardCard>
      <p className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/50 mb-2">{label}</p>
      <p className="font-black text-2xl text-white tabular-nums">{value}</p>
      {hint && <p className="text-white/50 text-xs mt-1">{hint}</p>}
    </DashboardCard>
  );
}
