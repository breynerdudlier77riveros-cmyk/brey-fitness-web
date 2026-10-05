"use client";

import { useEffect, useRef, useState } from "react";

import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { toast } from "@/components/brand/Toast";
import { accionGuardar } from "@/lib/anamnesis/actions";
import { nombreDe, type AnamnesisDatos } from "@/lib/anamnesis/tipos";
import {
  SECCION_DEMOGRAFICOS,
  SECCION_ANTECEDENTES,
  SECCION_COMPORTAMIENTO,
  SECCION_FACTOR_IMPIDE,
  PARQ_PREGUNTAS,
  AHA_ANTECEDENTES,
  AHA_SINTOMAS,
  SECCION_HABITOS_ALIMENTACION,
  ESCALA_HABITOS,
} from "@/lib/anamnesis/secciones";
import { MOTIVOS, ESCALA_MOTIVOS, ESTRES_ITEMS, ESCALA_ESTRES } from "@/lib/anamnesis/datos-fijos";
import { SeccionCampos, CampoRenderizado } from "./Campos";
import ListaSiNo from "./ListaSiNo";
import TablaAlimentos from "./TablaAlimentos";
import TablaEscala from "./TablaEscala";
import TablaLaboratorio from "./TablaLaboratorio";
import TablaTemperamento from "./TablaTemperamento";

// ── Editor de anamnesis (Sprint ANAMNESIS-1) ───────────────────────────────
//
// GUARDADO DIFERIDO, NO AL SALIR DE CADA CAMPO.
//
//   Esta ficha tiene ~250 campos — guardar en cada blur (como `cursos`)
//   saturaría la red mientras se recorre el formulario con Tab. Se guarda
//   900ms después del último cambio (como la rejilla del macrociclo), y
//   SIEMPRE se fuerza un guardado antes de imprimir: lo que sale en el PDF
//   tiene que ser exactamente lo que hay guardado, nunca un estado a medio
//   debatir.

interface Props {
  id: string;
  contenidoInicial: AnamnesisDatos;
}

export default function EditorAnamnesis({ id, contenidoInicial }: Props) {
  const [datos, setDatos] = useState<AnamnesisDatos>(contenidoInicial);
  const [guardando, setGuardando] = useState(false);
  const datosRef = useRef(datos);
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    datosRef.current = datos;
  }, [datos]);

  async function guardarAhora() {
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    setGuardando(true);
    const r = await accionGuardar(id, datosRef.current);
    setGuardando(false);
    if (!r.ok) toast.error(`No se pudo guardar: ${r.error}`);
  }

  function onChange(clave: string, valor: string) {
    setDatos((d) => ({ ...d, [clave]: valor }));
    if (timeoutRef.current) clearTimeout(timeoutRef.current);
    timeoutRef.current = setTimeout(guardarAhora, 900);
  }

  // Si el admin cierra la pestaña con un cambio pendiente, igual se guarda.
  useEffect(() => {
    return () => {
      if (timeoutRef.current) clearTimeout(timeoutRef.current);
    };
  }, []);

  async function imprimir() {
    await guardarAhora();
    window.print();
  }

  return (
    <div>
      <div className="flex items-center justify-between gap-4 mb-6 print:hidden">
        <span className={`text-[11px] ${guardando ? "text-amber-300/70" : "text-white/30"}`}>
          {guardando ? "Guardando…" : "Guardado"}
        </span>
        <Button onClick={imprimir}>Imprimir / Exportar PDF</Button>
      </div>

      <article className="anamnesis-print space-y-10">
        <header className="flex items-end justify-between gap-6 pb-4 border-b border-white/10">
          <div>
            <p className="text-[11px] uppercase tracking-[0.25em] text-white/40">
              Brey Fitness — Ficha de anamnesis
            </p>
            <h1 className="text-2xl font-black text-white mt-1">{nombreDe(datos)}</h1>
          </div>
          <div className="text-right text-[11px] text-white/40 anamnesis-fecha">
            <label className="block mb-1">Fecha</label>
            <Input
              type="date"
              value={datos["meta.fecha"] ?? ""}
              onChange={(e) => onChange("meta.fecha", e.target.value)}
              className="h-8 py-1 text-sm w-40"
            />
          </div>
        </header>

        <SeccionCampos seccion={SECCION_DEMOGRAFICOS} datos={datos} onChange={onChange} />
        <SeccionCampos seccion={SECCION_ANTECEDENTES} datos={datos} onChange={onChange} />

        <ListaSiNo
          id="parq"
          titulo="Cuestionario PAR-Q"
          descripcion="Responda Sí o No frente a cada pregunta."
          items={PARQ_PREGUNTAS}
          datos={datos}
          onChange={onChange}
        />

        <section data-seccion="aha" className="break-inside-avoid-page">
          <h2 className="text-lg font-black text-white mb-1.5">
            Cuestionario de monitoreo preparticipación AHA/ACSM
          </h2>
          <p className="text-sm text-white/50 mb-4">¿Ha sufrido o le han realizado alguna vez?</p>
          <ListaSiNo id="aha-antecedentes" titulo="" items={AHA_ANTECEDENTES} datos={datos} onChange={onChange} />
          <p className="text-sm text-white/50 mt-5 mb-1">¿Tiene alguno de estos síntomas o antecedentes?</p>
          <ListaSiNo id="aha-sintomas" titulo="" items={AHA_SINTOMAS} datos={datos} onChange={onChange} />
        </section>

        <TablaAlimentos datos={datos} onChange={onChange} />

        <section data-seccion="habitos-alimentacion" className="break-inside-avoid-page">
          <h2 className="text-lg font-black text-white mb-3">Alimentación</h2>
          <div>
            {SECCION_HABITOS_ALIMENTACION.map((item) => (
              <div
                key={item.clave}
                className="flex flex-wrap items-center justify-between gap-3 py-2 border-b border-white/[0.06]"
              >
                <p className="text-sm text-white/75 flex-1 min-w-[16rem]">{item.etiqueta}</p>
                <div className="flex gap-4 shrink-0">
                  {ESCALA_HABITOS.map((o) => (
                    <label key={o.valor} className="flex items-center gap-1.5 text-sm text-white/70">
                      <input
                        type="radio"
                        name={item.clave}
                        value={o.valor}
                        checked={(datos[item.clave] ?? "") === o.valor}
                        onChange={() => onChange(item.clave, o.valor)}
                        className="accent-orange-500 w-4 h-4 cursor-pointer"
                      />
                      {o.etiqueta}
                    </label>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        <section data-seccion="actividad-fisica" className="break-inside-avoid-page">
          <h2 className="text-lg font-black text-white mb-1.5">Nivel de actividad física</h2>
          <p className="text-sm text-white/50 mb-4">
            Durante los últimos siete (7) días, considerando solo actividades
            de al menos 10 minutos seguidos.
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { titulo: "Vigorosa", dias: "af.vigorosaDias", min: "af.vigorosaMinutos" },
              { titulo: "Moderada", dias: "af.moderadaDias", min: "af.moderadaMinutos" },
              { titulo: "Sedentaria", dias: "af.sedentariaDias", min: "af.sedentariaMinutos" },
            ].map((fila) => (
              <div key={fila.titulo} className="rounded-xl border border-white/10 p-3">
                <p className="text-sm font-bold text-white/85 mb-2">{fila.titulo}</p>
                <div className="space-y-2">
                  <div>
                    <label className="block text-[11px] text-white/45 mb-1">Días/semana</label>
                    <Input
                      type="number"
                      min={0}
                      max={7}
                      value={datos[fila.dias] ?? ""}
                      onChange={(e) => onChange(fila.dias, e.target.value)}
                      className="h-8 py-1 text-sm"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] text-white/45 mb-1">Minutos/día</label>
                    <Input
                      type="number"
                      min={0}
                      value={datos[fila.min] ?? ""}
                      onChange={(e) => onChange(fila.min, e.target.value)}
                      className="h-8 py-1 text-sm"
                    />
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section data-seccion="factor-impide" className="break-inside-avoid-page">
          <h2 className="text-lg font-black text-white mb-3">
            ¿Qué factor le impide con mayor frecuencia realizar actividad física o ejercicio?
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3">
            {SECCION_FACTOR_IMPIDE.map((campo) => (
              <CampoRenderizado
                key={"clave" in campo ? campo.clave : campo.texto}
                campo={campo}
                datos={datos}
                onChange={onChange}
              />
            ))}
          </div>
        </section>

        <SeccionCampos seccion={SECCION_COMPORTAMIENTO} datos={datos} onChange={onChange} />

        <TablaEscala
          tituloSeccion="Cuestionario auto-informe de motivos para la práctica de ejercicio físico"
          descripcion="Qué tan verdadero es cada motivo para usted, en una escala de 1 (nada) a 10 (totalmente)."
          prefijoClave="motivo"
          items={MOTIVOS}
          opciones={ESCALA_MOTIVOS}
          datos={datos}
          onChange={onChange}
        />

        <TablaLaboratorio datos={datos} onChange={onChange} />

        <TablaEscala
          tituloSeccion="Escala de estrés percibido"
          descripcion="En cada caso, indique con qué frecuencia se ha sentido o ha pensado así durante el último mes."
          prefijoClave="estres"
          items={ESTRES_ITEMS}
          opciones={ESCALA_ESTRES}
          datos={datos}
          onChange={onChange}
        />

        <TablaTemperamento datos={datos} onChange={onChange} />
      </article>
    </div>
  );
}
