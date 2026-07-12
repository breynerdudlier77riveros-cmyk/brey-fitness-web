"use client";

import { useState } from "react";
import Link from "next/link";
import { getProgramBySlug } from "@/data/programs";
import type { ProgramSlug } from "@/lib/types";
import LeadCapture from "@/components/LeadCapture";
import { ArrowRight, Check } from "@/components/ui/icons";

type ProgramId = ProgramSlug;

type Scores = Record<ProgramId, number>;

interface Option {
  label: string;
  description: string;
  scores: Scores;
}

interface Question {
  id: number;
  text: string;
  options: Option[];
}

const questions: Question[] = [
  {
    id: 1,
    text: "¿Cuál es tu objetivo principal?",
    options: [
      {
        label: "Ganar músculo y masa",
        description: "Quiero un físico más desarrollado y voluminoso.",
        scores: { "performance-start": 0, "performance-gym": 3, "performance-calisthenics": 0, "performance-hybrid": 1, "performance-elite": 1 },
      },
      {
        label: "Perder grasa y definir",
        description: "Quiero reducir grasa corporal preservando el músculo.",
        scores: { "performance-start": 1, "performance-gym": 2, "performance-calisthenics": 1, "performance-hybrid": 1, "performance-elite": 0 },
      },
      {
        label: "Ganar fuerza máxima",
        description: "Quiero ser más fuerte — levantar más o dominar mi peso corporal.",
        scores: { "performance-start": 0, "performance-gym": 2, "performance-calisthenics": 1, "performance-hybrid": 2, "performance-elite": 0 },
      },
      {
        label: "Dominar habilidades de peso corporal",
        description: "Muscle up, handstand, front lever, planche.",
        scores: { "performance-start": 0, "performance-gym": 0, "performance-calisthenics": 3, "performance-hybrid": 1, "performance-elite": 1 },
      },
      {
        label: "Transformación completa — quiero todo",
        description: "Fuerza, físico, habilidades y rendimiento en un solo sistema.",
        scores: { "performance-start": 0, "performance-gym": 1, "performance-calisthenics": 1, "performance-hybrid": 1, "performance-elite": 3 },
      },
    ],
  },
  {
    id: 2,
    text: "¿Cuál es tu nivel de experiencia?",
    options: [
      {
        label: "Principiante",
        description: "Menos de 1 año entrenando con método o empiezo desde cero.",
        scores: { "performance-start": 4, "performance-gym": 0, "performance-calisthenics": 0, "performance-hybrid": 0, "performance-elite": 0 },
      },
      {
        label: "Intermedio",
        description: "1-3 años entrenando, tengo base pero quiero más estructura.",
        scores: { "performance-start": 0, "performance-gym": 2, "performance-calisthenics": 2, "performance-hybrid": 1, "performance-elite": 0 },
      },
      {
        label: "Avanzado",
        description: "3+ años entrenando, busco el siguiente nivel de rendimiento.",
        scores: { "performance-start": 0, "performance-gym": 1, "performance-calisthenics": 1, "performance-hybrid": 2, "performance-elite": 2 },
      },
    ],
  },
  {
    id: 3,
    text: "¿Dónde prefieres entrenar?",
    options: [
      {
        label: "Gym",
        description: "Pesas, máquinas y equipamiento completo.",
        scores: { "performance-start": 0, "performance-gym": 3, "performance-calisthenics": 0, "performance-hybrid": 1, "performance-elite": 1 },
      },
      {
        label: "Casa o parque",
        description: "Solo con mi peso corporal o equipo mínimo.",
        scores: { "performance-start": 1, "performance-gym": 0, "performance-calisthenics": 3, "performance-hybrid": 0, "performance-elite": 0 },
      },
      {
        label: "Ambos — quiero flexibilidad",
        description: "Acceso a gym y también entreno al aire libre o en casa.",
        scores: { "performance-start": 0, "performance-gym": 1, "performance-calisthenics": 1, "performance-hybrid": 3, "performance-elite": 1 },
      },
    ],
  },
  {
    id: 4,
    text: "¿Cuánto tiempo tienes disponible por sesión?",
    options: [
      {
        label: "30 – 45 minutos",
        description: "Tiempo limitado — necesito sesiones compactas.",
        scores: { "performance-start": 2, "performance-gym": 0, "performance-calisthenics": 0, "performance-hybrid": 0, "performance-elite": 0 },
      },
      {
        label: "45 – 60 minutos",
        description: "Una hora es suficiente para mí.",
        scores: { "performance-start": 1, "performance-gym": 1, "performance-calisthenics": 1, "performance-hybrid": 1, "performance-elite": 0 },
      },
      {
        label: "60 – 90 minutos",
        description: "Puedo dedicar sesiones más largas y completas.",
        scores: { "performance-start": 0, "performance-gym": 2, "performance-calisthenics": 2, "performance-hybrid": 1, "performance-elite": 0 },
      },
      {
        label: "Más de 90 minutos",
        description: "El entrenamiento es mi prioridad — tiempo no es el problema.",
        scores: { "performance-start": 0, "performance-gym": 1, "performance-calisthenics": 1, "performance-hybrid": 2, "performance-elite": 2 },
      },
    ],
  },
  {
    id: 5,
    text: "¿Tienes alguna lesión o limitación activa?",
    options: [
      {
        label: "No, estoy al 100%",
        description: "Sin restricciones físicas — puedo entrenar completamente.",
        scores: { "performance-start": 0, "performance-gym": 2, "performance-calisthenics": 2, "performance-hybrid": 2, "performance-elite": 2 },
      },
      {
        label: "Sí — prefiero empezar con precaución",
        description: "Tengo una lesión o limitación que necesito tener en cuenta.",
        scores: { "performance-start": 3, "performance-gym": 0, "performance-calisthenics": 0, "performance-hybrid": 0, "performance-elite": 0 },
      },
    ],
  },
  {
    id: 6,
    text: "¿Qué describe mejor tu situación actual?",
    options: [
      {
        label: "Empiezo desde cero",
        description: "Nunca entrenado con método. Primeras veces en serio.",
        scores: { "performance-start": 5, "performance-gym": 0, "performance-calisthenics": 0, "performance-hybrid": 0, "performance-elite": 0 },
      },
      {
        label: "He entrenado pero sin estructura real",
        description: "Llevo tiempo yendo al gym o parque pero sin un programa claro.",
        scores: { "performance-start": 2, "performance-gym": 1, "performance-calisthenics": 1, "performance-hybrid": 0, "performance-elite": 0 },
      },
      {
        label: "Tengo método pero llevo meses estancado",
        description: "El progreso se ha detenido y necesito un nuevo sistema.",
        scores: { "performance-start": 0, "performance-gym": 1, "performance-calisthenics": 1, "performance-hybrid": 1, "performance-elite": 2 },
      },
      {
        label: "Quiero el sistema más completo disponible",
        description: "Busco el nivel más alto de personalización y apoyo.",
        scores: { "performance-start": 0, "performance-gym": 1, "performance-calisthenics": 0, "performance-hybrid": 1, "performance-elite": 3 },
      },
    ],
  },
];

function calculateResult(answers: number[]): ProgramId {
  const scores: Scores = {
    "performance-start":        0,
    "performance-gym":          0,
    "performance-calisthenics": 0,
    "performance-hybrid":       0,
    "performance-elite":        0,
  };

  answers.forEach((answerIndex, questionIndex) => {
    const option = questions[questionIndex].options[answerIndex];
    (Object.keys(option.scores) as ProgramId[]).forEach((pid) => {
      scores[pid] += option.scores[pid];
    });
  });

  return (Object.entries(scores).sort((a, b) => b[1] - a[1])[0][0]) as ProgramId;
}

export default function QuizClient() {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<number[]>([]);
  const [selected, setSelected] = useState<number | null>(null);
  const [result, setResult] = useState<ProgramId | null>(null);

  const q = questions[step];
  const progress = ((step) / questions.length) * 100;
  const isLast = step === questions.length - 1;

  function handleNext() {
    if (selected === null) return;
    const newAnswers = [...answers, selected];
    if (isLast) {
      setResult(calculateResult(newAnswers));
    } else {
      setAnswers(newAnswers);
      setSelected(null);
      setStep(step + 1);
    }
  }

  function handleRestart() {
    setStep(0);
    setAnswers([]);
    setSelected(null);
    setResult(null);
  }

  /* ── Results screen ── */
  if (result) {
    const r = getProgramBySlug(result)!;
    return (
      <div className="flex-1 flex flex-col items-center justify-center px-6 py-20">
        <div className="max-w-xl w-full text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/[0.06] text-xs text-emerald-400 font-semibold mb-8">
            <Check className="w-3.5 h-3.5" strokeWidth={2.5} />
            Tu ecosistema ideal
          </div>

          <div className={`rounded-2xl border border-white/[0.08] bg-gradient-to-br ${r.color.gradient} p-8 mb-8 text-left`}>
            <span className={`text-[10px] font-bold tracking-[0.14em] uppercase px-3 py-1.5 rounded-full border ${r.color.badge} mb-5 inline-block`}>
              BPS · Sistema recomendado
            </span>
            <h2 className="font-black text-3xl sm:text-4xl text-white leading-snug mb-3">{r.nombre}</h2>
            <p className="text-white/60 text-sm font-medium mb-5">{r.tagline}</p>
            <p className="text-white/60 text-sm leading-relaxed">{r.descripcion}</p>
          </div>

          <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-6 mb-8 text-left">
            <LeadCapture
              source={`quiz-${result}`}
              title="Guarda tu resultado: te enviamos el plan de arranque de tu ecosistema por email."
              buttonLabel="Enviarme mi plan"
            />
          </div>

          <div className="flex flex-col gap-3">
            <Link
              href={`/programas/${result}`}
              className={`w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full ${r.color.cta} text-white font-bold text-sm transition-all duration-200`}
            >
              Ver {r.nombre} completo
              <ArrowRight className="w-4 h-4" strokeWidth={2.5} />
            </Link>
            <Link
              href="/programas"
              className="w-full inline-flex items-center justify-center gap-2 px-7 py-4 rounded-full border border-white/[0.10] text-white/50 hover:text-white hover:border-white/20 font-bold text-sm transition-all duration-200"
            >
              Ver todos los ecosistemas
            </Link>
            <button
              onClick={handleRestart}
              className="text-xs text-white/50 hover:text-white/90 transition-colors pt-2"
            >
              Repetir el quiz
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* ── Question screen ── */
  return (
    <div className="flex-1 flex flex-col">

      {/* Progress bar */}
      <div className="h-0.5 bg-white/[0.05]">
        <div
          className="h-full bg-orange-500 transition-all duration-500"
          style={{ width: `${progress}%` }}
        />
      </div>

      <div className="flex-1 flex flex-col items-center justify-center px-6 py-16">
        <div className="max-w-xl w-full">

          {/* Step indicator */}
          <p className="text-[11px] font-bold tracking-[0.20em] uppercase text-white/50 mb-8 text-center">
            Pregunta {step + 1} de {questions.length}
          </p>

          {/* Question */}
          <h2 className="font-black text-2xl sm:text-3xl text-white text-center mb-10 leading-snug">
            {q.text}
          </h2>

          {/* Options */}
          <div className="flex flex-col gap-3 mb-10">
            {q.options.map((opt, i) => (
              <button
                key={i}
                onClick={() => setSelected(i)}
                className={`w-full text-left p-5 rounded-2xl border transition-all duration-200 cursor-pointer ${
                  selected === i
                    ? "border-orange-500/50 bg-orange-500/[0.10] ring-1 ring-orange-500/20"
                    : "border-white/[0.07] bg-white/[0.02] hover:border-white/[0.14] hover:bg-white/[0.04]"
                }`}
              >
                <div className="flex items-start gap-4">
                  <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center flex-shrink-0 mt-0.5 transition-all duration-200 ${
                    selected === i ? "border-orange-500 bg-orange-500" : "border-white/20"
                  }`}>
                    {selected === i && (
                      <svg className="w-2.5 h-2.5 text-white" fill="currentColor" viewBox="0 0 20 20">
                        <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                      </svg>
                    )}
                  </div>
                  <div>
                    <p className={`font-bold text-sm transition-colors ${selected === i ? "text-white" : "text-white/70"}`}>
                      {opt.label}
                    </p>
                    <p className="text-xs text-white/55 mt-0.5 leading-relaxed">{opt.description}</p>
                  </div>
                </div>
              </button>
            ))}
          </div>

          {/* Next button */}
          <button
            onClick={handleNext}
            disabled={selected === null}
            className={`w-full py-4 rounded-full font-bold text-sm transition-all duration-200 ${
              selected !== null
                ? "bg-orange-500 hover:bg-orange-400 text-white cursor-pointer"
                : "bg-white/[0.05] text-white/50 cursor-not-allowed"
            }`}
          >
            {isLast ? "Ver mi programa recomendado →" : "Siguiente →"}
          </button>

        </div>
      </div>
    </div>
  );
}
