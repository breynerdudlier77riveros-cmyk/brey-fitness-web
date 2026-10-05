"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import { toast } from "@/components/brand/Toast";
import { Spinner } from "@/components/brand/icons";
import { accionActualizarSignosVitales } from "../actions/evaluaciones";

// ── Signos vitales en reposo (Sprint PAS-18) ───────────────────────────────
//
// FRECUENCIA CARDIACA, SATURACIÓN Y TENSIÓN ARTERIAL, del día de la
// evaluación. Van junto a la masa corporal y por el mismo motivo (G-01): son
// de la sesión, no del atleta.
//
// ── NO SON UNA PRUEBA, Y POR ESO NO ESTÁN EN EL CATÁLOGO ──────────────────
//
//   Una prueba se sitúa contra una norma. Estos tres son el contexto en que
//   se midió todo lo demás y, sobre todo, la condición de seguridad que
//   decide si la sesión puede empezar: el protocolo del Senior Fitness Test
//   excluye expresamente a quien tenga una tensión no controlada de 160/100, y
//   el del escalón de Harvard manda tomar tensión y pulso en reposo antes de
//   autorizar la prueba.
//
//   Con clubes y EPS eso deja de ser una recomendación de manual y pasa a ser
//   lo que se documenta.
//
// ── LO QUE ESTE RECUADRO NO HACE, Y ES DELIBERADO ─────────────────────────
//
//   NO INTERPRETA. No dice «hipertensión», ni pinta el número de rojo, ni
//   sugiere derivar. Los rangos que valida son de PLAUSIBILIDAD —rechazan una
//   SpO2 de 950, que es un dedo resbalado en el teclado— y no de normalidad
//   clínica. Poner un semáforo aquí sería emitir un juicio médico que ninguna
//   fuente de este sistema respalda, y el profesional que lee 165/105 ya sabe
//   lo que tiene delante mejor que una barra de color.
//
//   La única frase que aparece es la del propio protocolo, citada, cuando la
//   tensión supera el umbral que ESE protocolo declara como criterio de
//   exclusión. No es un diagnóstico: es recordar lo que el manual exige.
//
// ── Y NO SON LOS PULSOS DEL ESCALÓN ───────────────────────────────────────
//
//   La frecuencia cardiaca que consume el Rockport y los tres pulsos de
//   recuperación del escalón son componentes del resultado de SU prueba y se
//   registran con ella. Meterlos aquí los desligaría de la medición que los
//   produjo.

interface Props {
  evaluacionId: string;
  fcReposoLpm: number | null;
  spo2Pct: number | null;
  taSistolicaMmhg: number | null;
  taDiastolicaMmhg: number | null;
}

const MENSAJE: Record<string, string> = {
  NO_AUTENTICADO: "La sesión ha caducado.",
  NO_ENCONTRADA: "Esta evaluación ya no existe.",
  EVALUACION_CERRADA: "La evaluación ya no admite cambios.",
  FC_FUERA_DE_RANGO: "La frecuencia cardiaca tiene que estar entre 20 y 250 lpm.",
  SPO2_FUERA_DE_RANGO: "La saturación tiene que estar entre 50 y 100 %.",
  TA_FUERA_DE_RANGO: "La tensión está fuera de lo que un tensiómetro puede medir.",
  TA_INVERTIDA: "La sistólica tiene que ser mayor que la diastólica: parecen invertidas.",
  NO_ACTUALIZADA: "No se pudo guardar.",
};

/** Texto → número, o `null` si está vacío, o `undefined` si no es un número. */
function leer(v: string): number | null | undefined {
  const limpio = v.trim().replace(",", ".");
  if (limpio === "") return null;
  const n = Number(limpio);
  return Number.isFinite(n) ? n : undefined;
}

const texto = (v: number | null) => (v === null ? "" : String(v));

export default function SignosVitales({
  evaluacionId,
  fcReposoLpm,
  spo2Pct,
  taSistolicaMmhg,
  taDiastolicaMmhg,
}: Props) {
  const router = useRouter();
  const [fc, setFc] = useState(texto(fcReposoLpm));
  const [spo2, setSpo2] = useState(texto(spo2Pct));
  const [sis, setSis] = useState(texto(taSistolicaMmhg));
  const [dia, setDia] = useState(texto(taDiastolicaMmhg));
  const [guardando, setGuardando] = useState(false);

  // El umbral del propio protocolo, no una opinión del sistema. Se lee de lo
  // que hay escrito en los campos para que aparezca al teclear.
  const s = leer(sis);
  const d = leer(dia);
  const sobreElCorte =
    (typeof s === "number" && s >= 160) || (typeof d === "number" && d >= 100);

  async function guardar() {
    if (guardando) return;

    const valores = { fc: leer(fc), spo2: leer(spo2), sis: leer(sis), dia: leer(dia) };
    if (Object.values(valores).some((v) => v === undefined)) {
      toast.error("Hay algún campo que no es un número.");
      return;
    }

    setGuardando(true);
    const resultado = await accionActualizarSignosVitales(evaluacionId, {
      fcReposoLpm: valores.fc as number | null,
      spo2Pct: valores.spo2 as number | null,
      taSistolicaMmhg: valores.sis as number | null,
      taDiastolicaMmhg: valores.dia as number | null,
    });
    setGuardando(false);

    if (!resultado.ok) {
      toast.error(MENSAJE[resultado.error] ?? resultado.error);
      return;
    }
    toast.success("Signos vitales guardados.");
    router.refresh();
  }

  const campo = (
    etiqueta: string,
    unidad: string,
    valor: string,
    set: (v: string) => void,
    aria: string,
  ) => (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold text-white/60">
        {etiqueta}
        <span className="ml-1.5 font-normal text-white/35">{unidad}</span>
      </span>
      <Input
        value={valor}
        inputMode="numeric"
        placeholder="—"
        aria-label={aria}
        onChange={(e) => set(e.target.value)}
        disabled={guardando}
        className="w-20 text-center tabular-nums"
      />
    </label>
  );

  return (
    <div className="rounded-xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-end gap-3">
        {campo("Frecuencia cardiaca", "lpm", fc, setFc, "Frecuencia cardiaca en reposo")}
        {campo("SpO₂", "%", spo2, setSpo2, "Saturación de oxígeno")}
        {campo("TA sistólica", "mmHg", sis, setSis, "Tensión arterial sistólica")}
        {campo("TA diastólica", "mmHg", dia, setDia, "Tensión arterial diastólica")}

        <Button size="sm" onClick={guardar} disabled={guardando}>
          {guardando ? (
            <>
              <Spinner className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
              Guardando…
            </>
          ) : (
            "Guardar"
          )}
        </Button>
      </div>

      {sobreElCorte ? (
        // La cita, no el juicio. El sistema no dice qué le pasa a esta persona:
        // dice qué exige el protocolo que se va a aplicar.
        <p className="mt-3 text-[12px] leading-relaxed text-yellow-200/80">
          El protocolo del Senior Fitness Test (Rikli y Jones) excluye de la batería a quien
          presente una tensión arterial alta no controlada de 160/100. La decisión de aplicar o
          no las pruebas es del profesional; esto solo recuerda lo que el manual pide.
        </p>
      ) : null}

      <p className="mt-2 text-[11px] leading-relaxed text-white/35">
        En reposo y en esta fecha. Se guardan como contexto de la sesión: el sistema no los
        interpreta ni los clasifica. La frecuencia cardiaca que piden el Rockport y el escalón de
        Harvard es otra —se registra con su prueba, porque es parte de su resultado—.
      </p>
    </div>
  );
}
