"use client";

import { useEffect, useRef, useState } from "react";
import { getProgramBySlug } from "@/data/programs";
import { motorGuionado } from "@/lib/diagnostico/motor";
import { preguntas } from "@/lib/diagnostico/preguntas";
import type { Opcion, Pregunta, Respuesta, Resultado } from "@/lib/diagnostico/tipos";
import LeadCapture from "@/components/LeadCapture";
import Button from "@/components/ui/Button";
import { ArrowRight, Check } from "@/components/ui/icons";

// ── Diagnóstico BPS · experiencia conversacional (D6 · camino A) ────────────
// La interfaz solo conoce el contrato MotorDiagnostico. Para migrar a
// Claude API: reemplazar `motor` por la implementación remota. Nada más.
const motor = motorGuionado;

interface Mensaje {
  rol: "coach" | "usuario";
  texto: string;
}

interface Snapshot {
  mensajesLen: number;
  pregunta: Pregunta | null;
  progreso: number;
}

function delayLectura(texto: string): number {
  if (typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
    return 0;
  }
  return 350 + Math.min(texto.length * 10, 800);
}

export default function DiagnosticoClient() {
  const [mensajes, setMensajes] = useState<Mensaje[]>([]);
  const [pregunta, setPregunta] = useState<Pregunta | null>(null);
  const [resultado, setResultado] = useState<Resultado | null>(null);
  const [historial, setHistorial] = useState<Respuesta[]>([]);
  const [snapshots, setSnapshots] = useState<Snapshot[]>([]);
  const [escribiendo, setEscribiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const finRef = useRef<HTMLDivElement>(null);
  const vivo = useRef(true);

  useEffect(() => {
    vivo.current = true;
    void reproducir(motor.iniciar());
    return () => {
      vivo.current = false;
    };
  }, []);

  useEffect(() => {
    finRef.current?.scrollIntoView({ behavior: "smooth", block: "end" });
  }, [mensajes, escribiendo, pregunta, resultado]);

  async function reproducir(turnoPromesa: ReturnType<typeof motor.iniciar>) {
    setEscribiendo(true);
    setPregunta(null);
    const turno = await turnoPromesa;
    for (const texto of turno.mensajes) {
      await new Promise((r) => setTimeout(r, delayLectura(texto)));
      if (!vivo.current) return;
      setMensajes((prev) => [...prev, { rol: "coach", texto }]);
    }
    if (!vivo.current) return;
    setProgreso(turno.progreso);
    setPregunta(turno.pregunta ?? null);
    setResultado(turno.resultado ?? null);
    setEscribiendo(false);
  }

  function elegir(opcion: Opcion) {
    if (!pregunta || escribiendo) return;
    setSnapshots((prev) => [
      ...prev,
      { mensajesLen: mensajes.length, pregunta, progreso },
    ]);
    setMensajes((prev) => [...prev, { rol: "usuario", texto: opcion.etiqueta }]);
    const nuevoHistorial = [...historial, { preguntaId: pregunta.id, opcionId: opcion.id }];
    setHistorial(nuevoHistorial);
    void reproducir(motor.responder(nuevoHistorial));
  }

  function corregir() {
    if (snapshots.length === 0 || escribiendo) return;
    const previo = snapshots[snapshots.length - 1];
    setSnapshots((prev) => prev.slice(0, -1));
    setMensajes((prev) => prev.slice(0, previo.mensajesLen));
    setHistorial((prev) => prev.slice(0, -1));
    setPregunta(previo.pregunta);
    setProgreso(previo.progreso);
    setResultado(null);
  }

  function reiniciar() {
    setMensajes([]);
    setPregunta(null);
    setResultado(null);
    setHistorial([]);
    setSnapshots([]);
    setProgreso(0);
    void reproducir(motor.iniciar());
  }

  const programa = resultado ? getProgramBySlug(resultado.programa) : null;

  return (
    <div className="flex-1 flex flex-col">

      {/* Progreso */}
      <div className="sticky top-16 z-10 bg-slate-950/90 backdrop-blur-sm">
        <div className="h-0.5 bg-white/[0.05]">
          <div
            className="h-full bg-orange-500 transition-all duration-500"
            style={{ width: `${progreso}%` }}
          />
        </div>
        {!resultado && (
          <p className="max-w-xl mx-auto px-6 py-2 text-[10px] font-bold tracking-[0.18em] uppercase text-white/40 text-right">
            {Math.min(historial.length + 1, preguntas.length)} / {preguntas.length}
          </p>
        )}
      </div>

      <div className="flex-1 w-full max-w-xl mx-auto px-4 sm:px-6 pb-16">

        {/* Conversación */}
        <div className="flex flex-col gap-3 pt-6" aria-live="polite">
          {mensajes.map((m, i) =>
            m.rol === "coach" ? (
              <div key={i} className="msg-in flex items-end gap-2.5 max-w-[85%]">
                <span
                  aria-hidden
                  className="w-6 h-6 rounded-lg bg-orange-500 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0 mb-0.5"
                >
                  B
                </span>
                <p className="px-4 py-3 rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.04] text-sm text-white/85 leading-relaxed">
                  {m.texto}
                </p>
              </div>
            ) : (
              <div key={i} className="msg-in self-end max-w-[85%]">
                <p className="px-4 py-3 rounded-2xl rounded-br-md bg-orange-500/15 border border-orange-500/30 text-sm text-white leading-relaxed">
                  {m.texto}
                </p>
              </div>
            )
          )}

          {/* Indicador de escritura */}
          {escribiendo && (
            <div className="msg-in flex items-end gap-2.5">
              <span
                aria-hidden
                className="w-6 h-6 rounded-lg bg-orange-500 text-white text-[11px] font-black flex items-center justify-center flex-shrink-0 mb-0.5"
              >
                B
              </span>
              <div className="px-4 py-3.5 rounded-2xl rounded-bl-md border border-white/[0.08] bg-white/[0.04] flex items-center gap-1.5">
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40" />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40" style={{ animationDelay: "0.15s" }} />
                <span className="typing-dot w-1.5 h-1.5 rounded-full bg-white/40" style={{ animationDelay: "0.3s" }} />
              </div>
            </div>
          )}
        </div>

        {/* Opciones de respuesta */}
        {pregunta && !escribiendo && (
          <div className="msg-in mt-6 flex flex-col gap-2">
            {pregunta.opciones.map((opcion) => (
              <button
                key={opcion.id}
                onClick={() => elegir(opcion)}
                className="w-full text-left px-5 py-3.5 rounded-2xl border border-white/[0.09] bg-white/[0.02] hover:border-orange-500/40 hover:bg-orange-500/[0.06] transition-all duration-200 cursor-pointer focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-orange-400"
              >
                <span className="block font-bold text-sm text-white/85">{opcion.etiqueta}</span>
                {opcion.descripcion && (
                  <span className="block text-xs text-white/50 mt-0.5 leading-relaxed">
                    {opcion.descripcion}
                  </span>
                )}
              </button>
            ))}

            {snapshots.length > 0 && (
              <button
                onClick={corregir}
                className="self-start mt-2 text-xs text-white/50 hover:text-white/90 transition-colors cursor-pointer"
              >
                ← Corregir mi respuesta anterior
              </button>
            )}
          </div>
        )}

        {/* Resultado */}
        {resultado && programa && !escribiendo && (
          <div className="msg-in mt-8">
            <div className={`rounded-2xl border border-white/[0.08] bg-gradient-to-br ${programa.color.gradient} p-7 mb-5`}>
              <span className={`text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border ${programa.color.badge} mb-5 inline-block`}>
                BPS · Tu ecosistema
              </span>
              <h2 className="font-black text-3xl sm:text-4xl text-white leading-snug mb-2">
                {programa.nombre}
              </h2>
              <p className="text-white/60 text-sm font-medium">{programa.tagline}</p>
            </div>

            {/* El porqué — personalizado con sus respuestas */}
            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 mb-5">
              <p className="text-[10px] font-bold tracking-[0.18em] uppercase text-orange-400 mb-4">
                Tu porqué
              </p>
              <ul className="flex flex-col gap-2.5 mb-4">
                {resultado.razones.map((razon) => (
                  <li key={razon} className="flex items-start gap-2.5 text-sm text-white/70 leading-relaxed">
                    <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
                    <span className="first-letter:uppercase">{razon}</span>
                  </li>
                ))}
              </ul>
              <p className="text-sm text-white/60 leading-relaxed border-t border-white/[0.06] pt-4">
                {resultado.cierre}
              </p>
              {resultado.notas.map((nota) => (
                <p key={nota} className="text-xs text-white/50 leading-relaxed mt-3 pl-3 border-l-2 border-orange-500/30">
                  {nota}
                </p>
              ))}
            </div>

            <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 mb-6">
              <LeadCapture
                source={`diagnostico-${resultado.programa}`}
                title="Guarda tu resultado: te enviamos el plan de arranque de tu ecosistema por email."
                buttonLabel="Enviarme mi plan"
              />
            </div>

            <div className="flex flex-col gap-3">
              <Button href={`/programas/${resultado.programa}`} size="lg" className="w-full text-sm">
                Ver {programa.nombre} completo
                <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
              </Button>
              <Button href="/programas" variant="outline" size="lg" className="w-full text-sm">
                Ver todos los ecosistemas
              </Button>
              <div className="flex items-center justify-center gap-6 pt-1">
                <button
                  onClick={corregir}
                  className="text-xs text-white/50 hover:text-white/90 transition-colors cursor-pointer"
                >
                  ← Corregir última respuesta
                </button>
                <button
                  onClick={reiniciar}
                  className="text-xs text-white/50 hover:text-white/90 transition-colors cursor-pointer"
                >
                  Repetir el diagnóstico
                </button>
              </div>
            </div>
          </div>
        )}

        <div ref={finRef} />
      </div>

      {/* Nota al pie — honestidad del sistema */}
      {!resultado && (
        <p className="pb-6 px-6 text-center text-[10px] tracking-[0.14em] uppercase text-white/40">
          Diagnóstico BPS · 2 minutos · Sin registro
        </p>
      )}
    </div>
  );
}
