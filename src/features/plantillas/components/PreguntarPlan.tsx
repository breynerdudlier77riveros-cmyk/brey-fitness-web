"use client";

import { useState } from "react";

import Button from "@/components/brand/Button";
import { Spinner } from "@/components/brand/icons";
import { preguntarSobrePlan, type RespuestaPlan } from "@/lib/plantillas/ia/preguntar";
import type { Turno } from "@/lib/ia/proveedor";

// ── Preguntar sobre el plan (Sprint PLS-2) ─────────────────────────────────
//
// QUIEN PREGUNTA ES EL CLIENTE, no el entrenador. Está en el gimnasio, con el
// móvil, y puede no saber qué es un RIR ni reconocer el nombre de un
// ejercicio. Todo lo de esta pantalla asume eso.
//
// ── LO QUE NO SE LE ENSEÑA, Y ES DELIBERADO ───────────────────────────────
//
//   Cuando el validador tumba una respuesta, al entrenador se le dice QUÉ
//   regla se rompió: lo necesita para juzgar si el modelo le sirve. Al cliente
//   no. Una lista de categorías vetadas no le dice nada y lo que sí le
//   transmite —que el sistema está conteniendo algo— no es cierto ni útil.
//
//   Se le dice lo que le sirve: eso lo decide su entrenador.
//
// ── EL LÍMITE SE CUENTA EN VOZ ALTA ───────────────────────────────────────
//
//   Quince preguntas por hora. No es una restricción escondida que aparece de
//   golpe: cuando quedan pocas se dice, para que nadie se quede a mitad de una
//   conversación sin entender por qué.
//
// `print:hidden`: la conversación no forma parte del plan que se imprime.

const SUGERENCIAS = [
  "¿Qué significa RIR?",
  "Explícame el día 1",
  "¿Cómo cambia el plan de una semana a otra?",
];

const SEGUIMIENTO = ["Desarrolla eso", "¿Y el calentamiento?", "Explícamelo más sencillo"];

export default function PreguntarPlan({ token }: { token: string }) {
  const [pregunta, setPregunta] = useState("");
  const [cargando, setCargando] = useState(false);
  const [hilo, setHilo] = useState<Turno[]>([]);
  const [respuesta, setRespuesta] = useState<RespuestaPlan | null>(null);

  async function enviar(texto: string) {
    const limpio = texto.trim();
    if (limpio === "" || cargando) return;

    setCargando(true);
    setPregunta("");
    const previo = hilo;
    // La pregunta se ve en pantalla mientras el modelo piensa, en vez de
    // desaparecer del campo y dejar la conversación en blanco.
    setHilo([...previo, { rol: "usuario", texto: limpio }]);
    setRespuesta(null);

    const r = await preguntarSobrePlan(token, limpio, previo);
    setCargando(false);
    setRespuesta(r);

    if (r.estado === "ok") {
      setHilo([...previo, { rol: "usuario", texto: limpio }, { rol: "modelo", texto: r.texto }]);
      return;
    }
    // Sin respuesta utilizable la pregunta sale del hilo: dejarla dentro haría
    // que la siguiente petición arrastrara un turno sin contestar.
    setHilo(previo);
  }

  return (
    <section
      aria-label="Preguntar sobre el plan"
      className="print:hidden mt-10 rounded-2xl border border-orange-500/20 bg-white/[0.02] p-4 sm:p-5"
    >
      <div className="mb-1 flex flex-wrap items-center justify-between gap-2">
        <h2 className="text-[10px] font-bold uppercase tracking-[0.14em] text-orange-400/70">
          ¿Alguna duda sobre tu plan?
        </h2>
        {hilo.length > 0 && (
          <button
            type="button"
            onClick={() => {
              setHilo([]);
              setRespuesta(null);
              setPregunta("");
            }}
            className="text-[11px] text-white/35 underline underline-offset-2 transition-colors hover:text-white/70"
          >
            Empezar de nuevo
          </button>
        )}
      </div>

      <p className="mb-3 text-[12px] leading-relaxed text-white/45">
        Te explico lo que pone aquí: qué es un ejercicio, qué significan las siglas, qué toca cada
        día. Lo que el plan deba decir lo decide tu entrenador — yo solo te lo leo.
      </p>

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
          maxLength={400}
          placeholder={hilo.length === 0 ? "¿Qué significa RIR?" : "Sigue preguntando…"}
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
          Generada por {respuesta.modelo} leyendo solo este plan — no consulta internet ni sabe nada
          más de ti. No se guarda.
          {respuesta.restantes <= 5 && (
            <> Te quedan {respuesta.restantes} preguntas en esta hora.</>
          )}
        </p>
      )}

      {respuesta?.estado === "rechazada" && (
        <p className="mt-3 text-[12px] leading-relaxed text-yellow-200/80">
          Esa respuesta se ha descartado antes de enseñártela: se acercaba a algo que solo tu
          entrenador puede decidir. Pregúntale a él, o prueba a preguntarme de otra manera.
        </p>
      )}

      {respuesta?.estado === "limite" && (
        <p className="mt-3 text-[12px] leading-relaxed text-white/50">
          Has hecho muchas preguntas seguidas. Vuelve a intentarlo en{" "}
          {Math.ceil(respuesta.esperaSegundos / 60)} minutos.
        </p>
      )}

      {respuesta?.estado === "sin_configurar" && (
        <p className="mt-3 text-[12px] leading-relaxed text-white/45">
          Esta ayuda no está disponible ahora mismo. El plan se lee igual sin ella.
        </p>
      )}

      {respuesta?.estado === "error" && (
        <p className="mt-3 text-[12px] leading-relaxed text-red-300/80">{respuesta.mensaje}</p>
      )}
    </section>
  );
}
