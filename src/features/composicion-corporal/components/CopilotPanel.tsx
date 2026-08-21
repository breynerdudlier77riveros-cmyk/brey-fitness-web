"use client";

import { useState } from "react";
import Button from "@/components/brand/Button";
import { toast } from "@/components/brand/Toast";
import { Copy } from "@/components/brand/icons";
import type { Entregable, ResultadoCopilot, TipoEntregable } from "@/lib/bcs/copilot";

// ── Panel del copiloto (Sprint BCS-7.0) ────────────────────────────────────
//
// QUÉ ES ESTO, Y QUÉ NO ES.
//
//   `src/lib/bcs/copilot/` son 1711 líneas con diez tipos de entregable y 705
//   líneas de test, escritas en BCS-6.0. Hasta este sprint **ningún componente
//   las importaba**: código correcto, probado y completamente inalcanzable
//   desde la aplicación. Esto es el cable.
//
//   NO es «una IA». El propio módulo lo dice en su cabecera: la composición es
//   determinista, cada frase sale de una plantilla que cita su fuente, y
//   `prompts.ts` deja preparados los contratos para el día en que un modelo de
//   lenguaje sustituya el render. Mientras tanto, misma entrada → mismo texto,
//   siempre. Llamarlo «generado por IA» prometería una variedad que no hay, y
//   escondería la propiedad que lo hace usable en clínica: es auditable.
//
// LO QUE NO SE ENSEÑA AQUÍ: la explicación para el cliente. Esa vive dentro
// del informe, que es donde el cliente la va a leer. Duplicarla en un panel de
// herramientas del profesional la convertiría en algo que hay que enviar
// aparte, cuando ya está enviada.
//
// LOS RECHAZADOS SE MUESTRAN. Un entregable que el validador tumbó no
// desaparece en silencio: si el panel enseñara solo lo que salió bien, un
// documento ausente parecería un documento no pedido.

interface Props {
  resultado: ResultadoCopilot;
}

/** Cómo se agrupan en pantalla. El orden es el de uso en una consulta. */
const GRUPOS: readonly { tipos: TipoEntregable[]; etiqueta: string; para: string }[] = [
  {
    etiqueta: "Para la consulta",
    para: "Lo que se dice en voz alta delante del cliente.",
    tipos: ["resumen_ejecutivo", "guion_consulta", "presentacion"],
  },
  {
    etiqueta: "Para enviar",
    para: "Mensajes listos para copiar, con el tono de cada canal.",
    tipos: ["correo", "whatsapp"],
  },
  {
    etiqueta: "Para la historia",
    para: "Documentación clínica y material imprimible.",
    tipos: ["nota_soap", "documento_impresion"],
  },
  {
    etiqueta: "Para explicar",
    para: "Preguntas frecuentes y conceptos, sin datos de este cliente.",
    tipos: ["faq", "material_educativo"],
  },
];

/** El único tipo que no se lista: ya está dentro del informe. */
const EN_EL_INFORME: TipoEntregable = "explicacion_paciente";

function Documento({ entregable }: { entregable: Entregable }) {
  const [abierto, setAbierto] = useState(false);

  function copiar() {
    navigator.clipboard.writeText(entregable.texto);
    toast.success("Texto copiado.");
  }

  return (
    <div className="rounded-xl border border-white/[0.07] bg-white/[0.02]">
      <div className="flex items-center justify-between gap-3 p-3">
        <button
          type="button"
          onClick={() => setAbierto((v) => !v)}
          className="flex-1 text-left"
          aria-expanded={abierto}
        >
          <p className="text-sm font-semibold text-white/85">{entregable.titulo}</p>
          <p className="text-[11px] text-white/35">
            {entregable.palabras} palabras · {abierto ? "ocultar" : "ver texto"}
          </p>
        </button>
        <Button type="button" variant="outline" size="sm" onClick={copiar}>
          <Copy className="h-3.5 w-3.5" strokeWidth={2} />
          Copiar
        </Button>
      </div>

      {abierto ? (
        <div className="space-y-4 border-t border-white/[0.06] p-4">
          {entregable.secciones.map((s, i) => (
            <div key={s.titulo || `s-${i}`}>
              {s.titulo ? (
                <p className="mb-1 text-[11px] uppercase tracking-wider text-white/40">{s.titulo}</p>
              ) : null}
              {s.contenido.map((linea, j) => (
                <p key={`${i}-${j}`} className="text-sm leading-relaxed text-white/70">
                  {linea}
                </p>
              ))}
            </div>
          ))}

          {/* La traza. Es lo que separa esto de un texto generado: cada
              documento declara de qué hallazgos y recomendaciones salió, y
              puede comprobarse contra el informe. */}
          <p className="border-t border-white/[0.06] pt-3 text-[11px] leading-relaxed text-white/30">
            Compuesto a partir de {entregable.traza.hallazgoIds.length} hallazgos,{" "}
            {entregable.traza.recomendacionIds.length} recomendaciones y{" "}
            {entregable.traza.observacionIds.length} observaciones del análisis. Plantilla{" "}
            {entregable.traza.plantillaId}.
          </p>
        </div>
      ) : null}
    </div>
  );
}

export default function CopilotPanel({ resultado }: Props) {
  const disponibles = resultado.entregables.filter((e) => e.tipo !== EN_EL_INFORME);

  if (disponibles.length === 0 && resultado.rechazados.length === 0) return null;

  return (
    <section aria-labelledby="copiloto" className="space-y-5">
      <div>
        <h2 id="copiloto" className="font-black text-lg text-white">
          Documentos a partir de este informe
        </h2>
        <p className="mt-1 max-w-2xl text-sm leading-relaxed text-white/50">
          {disponibles.length} documentos compuestos con lo que el análisis ya concluyó. No añaden
          ninguna afirmación nueva: reordenan los mismos hallazgos para cada uso, y cada uno declara
          de cuáles salió.
        </p>
      </div>

      {GRUPOS.map((grupo) => {
        const delGrupo = disponibles.filter((e) => grupo.tipos.includes(e.tipo));
        if (delGrupo.length === 0) return null;

        return (
          <div key={grupo.etiqueta}>
            <p className="text-[11px] uppercase tracking-wider text-white/40">{grupo.etiqueta}</p>
            <p className="mb-2 text-[11px] text-white/30">{grupo.para}</p>
            <div className="grid grid-cols-1 gap-2 lg:grid-cols-2">
              {delGrupo.map((e) => (
                <Documento key={e.id} entregable={e} />
              ))}
            </div>
          </div>
        );
      })}

      {resultado.rechazados.length > 0 ? (
        <div>
          <p className="text-[11px] uppercase tracking-wider text-white/40">No se compusieron</p>
          <ul className="mt-1 space-y-1">
            {resultado.rechazados.map((r) => (
              <li
                key={`${r.tipo}-${r.variante}`}
                className="border-l-2 border-white/10 pl-3 text-[11px] leading-relaxed text-white/40"
              >
                <span className="text-white/55">
                  {r.tipo.replace(/_/g, " ")} · {r.variante}
                </span>{" "}
                — {r.motivo}
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}
