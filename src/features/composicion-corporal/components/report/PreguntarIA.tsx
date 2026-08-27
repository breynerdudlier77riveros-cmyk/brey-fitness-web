"use client";

import { useState } from "react";
import Button from "@/components/brand/Button";
import { Spinner } from "@/components/brand/icons";
import { preguntarABreyIA, type RespuestaIA } from "@/lib/bcs/ia/preguntar";
import type { Turno } from "@/lib/bcs/ia/proveedor";
import type { EntradaContexto } from "@/lib/bcs/ia/contexto";

// ── Preguntar a BREY IA (Sprint BCS-12 / BCS-15) ───────────────────────────
//
// La única parte conversacional del informe. Todo lo demás sigue siendo
// determinista: esto va ENCIMA de un documento ya cerrado y nada de lo que
// devuelve entra en él ni se guarda.
//
// ── AHORA ES UN HILO, Y ESE ERA EL PROBLEMA ───────────────────────────────
//
//   Cada pregunta empezaba de cero, así que «explícame más eso» no tenía
//   antecedente: el modelo respondía otro resumen del informe entero en vez de
//   desarrollar lo que acababa de decir. Profundizar es, sobre todo, poder
//   repreguntar.
//
//   El hilo vive SOLO en esta pantalla. No se guarda en ninguna parte y se
//   pierde al recargar, que es lo correcto para una conversación sobre un
//   documento: el documento es el entregable, esto es la charla alrededor.
//
// ── TRES ESTADOS QUE NO SE COLAPSAN ───────────────────────────────────────
//
//   · `sin_configurar` — falta la clave. No es un fallo del sistema ni del
//     usuario: es una función que no está encendida, y se dice cómo encenderla
//     nombrando la variable exacta: hay dos proveedores posibles y «falta una
//     clave» no le dice a nadie cuál.
//   · `rechazada` — el modelo respondió y el validador tumbó la respuesta. Se
//     enseña QUÉ regla rompió, no un «error» genérico. Que ocurra es el
//     sistema funcionando, no fallando.
//   · `error` — no se pudo hablar con el modelo.
//
// Colapsar los tres en «algo salió mal» convertiría un rechazo por seguridad
// —que es información valiosa— en un fallo indistinguible de una caída de red.
//
// EL MODELO QUE CONTESTÓ VA FIRMADO. Desde que hay dos proveedores con calidad
// de seguimiento distinta, cuál habló es la variable que más explica lo que se
// está leyendo — y por qué una respuesta fue rechazada.
//
// `print:hidden`: una conversación no forma parte del documento que se entrega.

const SUGERENCIAS = [
  "¿Qué es lo más importante de este informe?",
  "Explícame esto como si no supiera nada de composición corporal",
  "¿Qué haría falta para poder decir más?",
];

/** Lo que se ofrece tras una respuesta: el hilo solo sirve si se usa. */
const SEGUIMIENTO = ["Desarrolla eso", "¿Por qué?", "¿Qué NO se puede concluir de esto?"];

interface Props {
  contexto: EntradaContexto;
}

export default function PreguntarIA({ contexto }: Props) {
  const [pregunta, setPregunta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [hilo, setHilo] = useState<Turno[]>([]);
  const [respuesta, setRespuesta] = useState<RespuestaIA | null>(null);

  async function enviar(texto: string) {
    const limpio = texto.trim();
    if (limpio === "" || cargando) return;

    setCargando(true);
    setPregunta("");
    // La pregunta entra al hilo antes de saber la respuesta: así se ve en
    // pantalla mientras el modelo piensa, en vez de desaparecer del campo y
    // dejar la conversación en blanco durante unos segundos.
    const previo = hilo;
    setHilo([...previo, { rol: "usuario", texto: limpio }]);
    setRespuesta(null);

    const r = await preguntarABreyIA(limpio, contexto, previo);
    setCargando(false);
    setRespuesta(r);

    if (r.estado === "ok") {
      setHilo([...previo, { rol: "usuario", texto: limpio }, { rol: "modelo", texto: r.texto }]);
      return;
    }
    // Sin respuesta utilizable, la pregunta sale del hilo: dejarla dentro haría
    // que la siguiente petición arrastrara un turno sin contestar, y las dos
    // APIs esperan que a cada pregunta le siga una respuesta.
    setHilo(previo);
  }

  const nuevaConversacion = () => {
    setHilo([]);
    setRespuesta(null);
    setPregunta("");
  };

  return (
    <div className="print:hidden border-t border-orange-500/15 px-5 py-4 sm:px-6">
      <div className="mb-2 flex items-center justify-between gap-3">
        <p className="text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
          Pregúntale a BREY IA sobre este informe
        </p>
        {hilo.length > 0 && (
          <button
            type="button"
            onClick={nuevaConversacion}
            className="text-[11px] text-white/35 underline underline-offset-2 transition-colors hover:text-white/70"
          >
            Empezar de nuevo
          </button>
        )}
      </div>

      {/* ── El hilo ── */}
      {hilo.length > 0 && (
        <div className="mb-3 space-y-3">
          {hilo.map((turno, i) =>
            turno.rol === "usuario" ? (
              <p key={i} className="text-sm font-semibold text-white/80">
                {turno.texto}
              </p>
            ) : (
              <div key={i} className="space-y-2 border-l-2 border-orange-500/40 pl-3">
                {turno.texto
                  .split("\n")
                  .filter(Boolean)
                  .map((p, j) => (
                    <p key={j} className="text-sm leading-relaxed text-white/75">
                      {p}
                    </p>
                  ))}
              </div>
            ),
          )}
          {cargando && (
            <p className="flex items-center gap-2 text-sm text-white/40">
              <Spinner className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
              Pensando…
            </p>
          )}
        </div>
      )}

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
          placeholder={
            hilo.length === 0 ? "¿Qué significa mi porcentaje de grasa?" : "Sigue preguntando…"
          }
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

      {!cargando && (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {(hilo.length === 0 ? SUGERENCIAS : SEGUIMIENTO).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => void enviar(s)}
              className="cursor-pointer rounded-full border border-white/[0.10] bg-white/[0.03] px-2.5 py-1 text-[11px] text-white/45 transition-colors hover:border-orange-500/30 hover:text-white/70"
            >
              {s}
            </button>
          ))}
        </div>
      )}

      {respuesta?.estado === "ok" && (
        <p className="mt-3 text-[10px] leading-relaxed text-white/25">
          Generada por {respuesta.modelo} sobre las conclusiones de este informe y la base de
          conocimiento del sistema, y comprobada contra sus prohibiciones. No consulta internet, no
          forma parte del documento y no se guarda.
        </p>
      )}

      {respuesta?.estado === "rechazada" && (
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
            texto mutilado con apariencia de correcto. Prueba a preguntarlo de otra manera. La
            respondió {respuesta.modelo}; si se repite a menudo, es que ese modelo no sigue bien
            este contrato.
          </p>
        </div>
      )}

      {respuesta?.estado === "sin_configurar" && (
        <p className="mt-4 text-[11px] leading-relaxed text-white/45">
          BREY IA no está habilitada todavía. Falta configurar la clave de API en el servidor
          (variable <code className="text-white/60">{respuesta.variable}</code>). Todo lo demás del
          informe funciona sin ella: es determinista y no usa modelo.
        </p>
      )}

      {respuesta?.estado === "error" && (
        <p className="mt-4 text-[11px] leading-relaxed text-red-300/80">{respuesta.mensaje}</p>
      )}
    </div>
  );
}
