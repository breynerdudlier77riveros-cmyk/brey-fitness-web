"use client";

import { useState } from "react";
import Button from "@/components/brand/Button";
import { Spinner } from "@/components/brand/icons";
import { preguntarABreyIA, type RespuestaIA } from "@/lib/bcs/ia/preguntar";
import type { EntradaContexto } from "@/lib/bcs/ia/contexto";

// ── Preguntar a BREY IA (Sprint BCS-12) ────────────────────────────────────
//
// La única parte conversacional del informe. Todo lo demás sigue siendo
// determinista: esto va ENCIMA de un documento ya cerrado y nada de lo que
// devuelve entra en él ni se guarda.
//
// TRES ESTADOS QUE NO SE COLAPSAN, y es lo que hace usable la función:
//
//   · `sin_configurar` — falta la clave. No es un fallo del sistema ni del
//     usuario: es una función que no está encendida, y se dice cómo encenderla.
//   · `rechazada` — el modelo respondió y el validador tumbó la respuesta. Se
//     enseña QUÉ regla rompió, no un «error» genérico. Que ocurra es el
//     sistema funcionando, no fallando.
//   · `error` — no se pudo hablar con el modelo.
//
// Colapsar los tres en «algo salió mal» convertiría un rechazo por seguridad
// —que es información valiosa— en un fallo indistinguible de una caída de red.
//
// `print:hidden`: una conversación no forma parte del documento que se entrega.

const SUGERENCIAS = [
  "¿Qué es lo más importante de este informe?",
  "Explícame esto como si no supiera nada de composición corporal",
  "¿Qué haría falta para poder decir más?",
];

interface Props {
  contexto: EntradaContexto;
}

export default function PreguntarIA({ contexto }: Props) {
  const [pregunta, setPregunta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [respuesta, setRespuesta] = useState<RespuestaIA | null>(null);

  async function enviar(texto: string) {
    if (texto.trim() === "" || cargando) return;
    setCargando(true);
    setRespuesta(null);
    setRespuesta(await preguntarABreyIA(texto, contexto));
    setCargando(false);
  }

  return (
    <div className="print:hidden border-t border-orange-500/15 px-5 py-4 sm:px-6">
      <p className="mb-2 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
        Pregúntale a BREY IA sobre este informe
      </p>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          void enviar(pregunta);
        }}
        className="flex flex-col gap-2 sm:flex-row"
      >
        <input
          value={pregunta}
          onChange={(e) => setPregunta(e.target.value)}
          maxLength={500}
          placeholder="¿Qué significa mi porcentaje de grasa?"
          disabled={cargando}
          className="h-10 flex-1 rounded-lg border border-white/15 bg-slate-900 px-3 text-sm text-white outline-none placeholder:text-white/25 focus:border-orange-500/40"
        />
        <Button type="submit" size="md" disabled={cargando || pregunta.trim() === ""}>
          {cargando ? (
            <>
              <Spinner className="h-4 w-4 animate-spin" strokeWidth={2.5} />
              Pensando…
            </>
          ) : (
            "Preguntar"
          )}
        </Button>
      </form>

      {respuesta === null && !cargando ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {SUGERENCIAS.map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => {
                setPregunta(s);
                void enviar(s);
              }}
              className="cursor-pointer rounded-full border border-white/[0.10] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/45 transition-colors hover:border-orange-500/30 hover:text-white/70"
            >
              {s}
            </button>
          ))}
        </div>
      ) : null}

      {respuesta?.estado === "ok" ? (
        <div className="mt-4 space-y-2 border-l-2 border-orange-500/40 pl-3">
          {respuesta.texto.split("\n").filter(Boolean).map((p, i) => (
            <p key={i} className="text-sm leading-relaxed text-white/75">
              {p}
            </p>
          ))}
          <p className="pt-1 text-[10px] leading-relaxed text-white/25">
            Respuesta generada sobre las conclusiones de este informe y comprobada contra las
            prohibiciones de la base de conocimiento. No forma parte del documento ni se guarda.
          </p>
        </div>
      ) : null}

      {respuesta?.estado === "rechazada" ? (
        <div className="mt-4 rounded-lg border border-yellow-500/25 bg-yellow-500/[0.05] p-3">
          <p className="text-sm leading-relaxed text-yellow-200/90">
            La respuesta se descartó antes de mostrarla: incumplía una regla de la base de
            conocimiento.
          </p>
          <ul className="mt-2 space-y-0.5">
            {respuesta.violaciones.map((v, i) => (
              <li key={i} className="text-[11px] leading-relaxed text-white/50">
                · {v.detalle}
              </li>
            ))}
          </ul>
          <p className="mt-2 text-[11px] leading-relaxed text-white/40">
            No se muestra una versión recortada: entregar el resto sin la parte censurada daría un
            texto mutilado con apariencia de correcto. Prueba a preguntarlo de otra manera.
          </p>
        </div>
      ) : null}

      {respuesta?.estado === "sin_configurar" ? (
        <p className="mt-4 text-[11px] leading-relaxed text-white/45">
          BREY IA no está habilitada todavía. Falta configurar la clave de API en el servidor
          (variable <code className="text-white/60">ANTHROPIC_API_KEY</code>). Todo lo demás del
          informe funciona sin ella: es determinista y no usa modelo.
        </p>
      ) : null}

      {respuesta?.estado === "error" ? (
        <p className="mt-4 text-[11px] leading-relaxed text-red-300/80">{respuesta.mensaje}</p>
      ) : null}
    </div>
  );
}
