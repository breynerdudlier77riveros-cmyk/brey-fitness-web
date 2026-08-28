"use client";

import { useState } from "react";

// ── Las dos vistas del informe (Sprint PAS-16) ─────────────────────────────
//
// UN SOLO INFORME, DOS PROFUNDIDADES.
//
//   «Resumen» son los recuadros compactos: qué prueba, qué valor, dónde cae.
//   Es la vista de trabajo, la que se mira de un vistazo.
//
//   «Informe completo» lo despliega todo —cada prueba con su posición, su
//   evolución, su objetivo y su detalle técnico— y es la que se guarda en PDF.
//
//   No son dos informes. Los dos se construyen del MISMO modelo y el mismo
//   compositor los dibuja: si divergieran, el resumen y el documento firmado
//   dirían cosas distintas del mismo expediente, que es el fallo que este
//   proyecto lleva tres subsistemas evitando.
//
// ── EL PAPEL SIEMPRE RECIBE EL COMPLETO ───────────────────────────────────
//
//   La pestaña gobierna la PANTALLA, no la impresión. Quien pulse imprimir
//   mientras mira el resumen espera su informe entero, no ocho recuadros: es
//   exactamente el fallo que las plantillas ya pagaron, donde imprimir desde
//   la pestaña de edición producía una hoja en blanco.
//
//   Por eso el completo se renderiza siempre y solo se oculta en pantalla
//   cuando toca. Cuesta unos kilobytes de HTML y ahorra un PDF equivocado.
//
// Este componente NO conoce el informe: recibe los dos árboles ya construidos
// por el servidor y solo decide cuál se ve. Así los dos siguen siendo
// componentes de servidor.

interface Props {
  resumen: React.ReactNode;
  completo: React.ReactNode;
}

export default function VistaInforme({ resumen, completo }: Props) {
  const [vista, setVista] = useState<"resumen" | "completo">("resumen");

  return (
    <div>
      <div className="print:hidden mb-6 flex gap-1 border-b border-white/[0.08]">
        {(
          [
            ["resumen", "Resumen"],
            ["completo", "Informe completo"],
          ] as const
        ).map(([id, etiqueta]) => (
          <button
            key={id}
            type="button"
            onClick={() => setVista(id)}
            aria-pressed={vista === id}
            className={`-mb-px border-b-2 px-3 py-2 text-xs font-bold transition-colors ${
              vista === id
                ? "border-orange-500 text-white"
                : "border-transparent text-white/40 hover:text-white/70"
            }`}
          >
            {etiqueta}
          </button>
        ))}
      </div>

      {/* En pantalla manda la pestaña; en papel, siempre el completo. */}
      <div className={vista === "resumen" ? undefined : "hidden"}>{resumen}</div>
      <div className={vista === "completo" ? "print:block" : "hidden print:block"}>{completo}</div>
    </div>
  );
}
