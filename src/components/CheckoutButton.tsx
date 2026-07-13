import Button from "@/components/brand/Button";
import { ArrowLong, Lock } from "@/components/brand/icons";

interface Props {
  href: string;
  label: string;
  className?: string;
}

export default function CheckoutButton({ href, label, className = "" }: Props) {
  return (
    <div className="flex flex-col items-center gap-5">
      <Button
        href={href}
        variant="buy"
        size="lg"
        className={`font-black sm:px-12 sm:py-5 sm:text-lg ${className}`}
      >
        <Lock className="w-5 h-5 shrink-0" strokeWidth={2} />
        {label}
        <ArrowLong className="w-5 h-5 shrink-0" strokeWidth={2.5} />
      </Button>
      <p className="text-slate-400 text-[11px] tracking-[0.18em] uppercase">
        Pago 100% seguro · Encriptación SSL · Garantía 30 días
      </p>
    </div>
  );
}
