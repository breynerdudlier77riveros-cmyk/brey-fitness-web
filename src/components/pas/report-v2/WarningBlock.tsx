// ── Bloque de advertencias (PRS v2.0) ──────────────────────────────────────
//
// Renderiza LITERALMENTE lo que emitieron el NIE y las fichas de la NKB. No
// resume, no acorta, no reordena y no reformula.
//
// El motivo no es estilístico: esos textos son la parte del informe que
// sostiene lo que no puede afirmarse. «Difieren hasta 4,5 kg en el P50» es un
// dato; «hay cierta discrepancia» sería una opinión nuestra sobre ese dato.

interface Props {
  advertencias: readonly string[];
  titulo?: string;
}

export default function WarningBlock({ advertencias, titulo = "Advertencias" }: Props) {
  if (advertencias.length === 0) return null;

  return (
    <section className="prs2-advertencias" data-seccion-v2="advertencias" aria-label={titulo}>
      <h4 className="text-[11px] uppercase tracking-wider text-white/40">{titulo}</h4>
      <ul className="mt-2 space-y-1.5">
        {advertencias.map((a) => (
          <li key={a} className="border-l-2 border-white/20 pl-3 text-sm leading-relaxed text-white/70">
            {a}
          </li>
        ))}
      </ul>
    </section>
  );
}
