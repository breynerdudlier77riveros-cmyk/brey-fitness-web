interface Props {
  href: string;
  className?: string;
}

function IconLock() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75m-.75 11.25h10.5a2.25 2.25 0 0 0 2.25-2.25v-6.75a2.25 2.25 0 0 0-2.25-2.25H6.75a2.25 2.25 0 0 0-2.25 2.25v6.75a2.25 2.25 0 0 0 2.25 2.25Z" />
    </svg>
  );
}

function IconArrow() {
  return (
    <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" strokeWidth={2.5} viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
    </svg>
  );
}

export default function CheckoutButton({ href, className = "" }: Props) {
  return (
    <div className="flex flex-col items-center gap-5">
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className={`checkout-btn inline-flex items-center justify-center gap-3 bg-emerald-500 hover:bg-emerald-400 text-white font-black text-base sm:text-lg px-8 sm:px-12 py-4 sm:py-5 rounded-2xl shadow-lg shadow-emerald-500/20 transition-colors duration-300 active:scale-[0.97] ${className}`}
      >
        <IconLock />
        ¡Sí, quiero empezar mi transformación hoy!
        <IconArrow />
      </a>
      <p className="text-slate-500 text-[11px] tracking-[0.18em] uppercase">
        Pago 100% seguro · Encriptación SSL · Garantía 30 días
      </p>
    </div>
  );
}
