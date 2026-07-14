"use client";

import { useState } from "react";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/brand/Tabs";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/brand/Tooltip";
import { Bolt, Flame, UserIcon, ChartBar, Heart, TrendingUp } from "@/components/brand/icons";

/* ─── shared input ─────────────────────────────────────── */
function Field({
  label,
  unit,
  value,
  onChange,
  min = 0,
  max = 9999,
  step = 1,
}: {
  label: string;
  unit?: string;
  value: number | string;
  onChange: (v: number) => void;
  min?: number;
  max?: number;
  step?: number;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
        {label}
      </label>
      <div className="flex rounded-xl border border-white/[0.08] bg-white/[0.03] overflow-hidden focus-within:border-orange-500/40">
        <input
          type="number"
          value={value}
          min={min}
          max={max}
          step={step}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 bg-transparent px-4 py-3 text-white text-sm outline-none tabular-nums"
        />
        {unit && (
          <span className="flex items-center px-4 text-xs text-white/50 border-l border-white/[0.06] select-none">
            {unit}
          </span>
        )}
      </div>
    </div>
  );
}

function Select({
  label,
  value,
  onChange,
  options,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  options: { value: string; label: string }[];
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">
        {label}
      </label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="rounded-xl border border-white/[0.08] bg-slate-900 px-4 py-3 text-white text-sm outline-none focus:border-orange-500/40 appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>
            {o.label}
          </option>
        ))}
      </select>
    </div>
  );
}

function ResultBox({
  label,
  value,
  unit,
  sub,
  accent,
}: {
  label: string;
  value: string | number;
  unit?: string;
  sub?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`rounded-2xl p-5 border ${
        accent
          ? "border-orange-500/25 bg-orange-500/[0.06]"
          : "border-white/[0.07] bg-white/[0.02]"
      }`}
    >
      <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55 mb-1">
        {label}
      </p>
      <p className={`font-black text-2xl tabular-nums ${accent ? "text-orange-400" : "text-white"}`}>
        {value}
        {unit && <span className="text-base font-semibold text-white/55 ml-1">{unit}</span>}
      </p>
      {sub && <p className="text-xs text-white/50 mt-1">{sub}</p>}
    </div>
  );
}

/* ─── 1. 1RM ───────────────────────────────────────────── */
function Calc1RM() {
  const [weight, setWeight] = useState<number>(100);
  const [reps, setReps] = useState<number>(5);
  const [unit, setUnit] = useState<"kg" | "lb">("kg");

  const brzycki = weight * (36 / (37 - Math.min(reps, 36)));
  const epley = weight * (1 + reps / 30);
  const oneRM = Math.round((brzycki + epley) / 2);

  const pcts = [100, 95, 90, 85, 80, 75, 70, 65].map((p) => ({
    pct: p,
    kg: Math.round((oneRM * p) / 100),
    reps: [1, 2, 3, 4, 5, 6, 7, 8][100 - p < 40 ? (100 - p) / 5 : 7],
  }));

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <p className="text-xs text-white/55 leading-relaxed">
          Promedio de Brzycki y Epley. Más preciso entre 1–10 repeticiones.
        </p>
        <div className="flex gap-3">
          {(["kg", "lb"] as const).map((u) => (
            <button
              key={u}
              onClick={() => setUnit(u)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                unit === u
                  ? "bg-orange-500/15 border border-orange-500/30 text-orange-400"
                  : "border border-white/[0.07] text-white/55 hover:text-white/90"
              }`}
            >
              {u.toUpperCase()}
            </button>
          ))}
        </div>
        <Field label="Peso levantado" unit={unit} value={weight} onChange={setWeight} min={1} max={500} />
        <Field label="Repeticiones" unit="reps" value={reps} onChange={setReps} min={1} max={36} />
        <ResultBox label="Tu 1RM estimado" value={oneRM} unit={unit} accent sub="Promedio Brzycki + Epley" />
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-3">
          Tabla de porcentajes
        </p>
        <div className="rounded-2xl border border-white/[0.07] overflow-hidden">
          <table className="w-full text-sm tabular-nums">
            <thead>
              <tr className="border-b border-white/[0.06]">
                <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-widest text-white/50 font-semibold">%1RM</th>
                <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-widest text-white/50 font-semibold">{unit}</th>
                <th className="px-4 py-2.5 text-left text-[10px] uppercase tracking-widest text-white/50 font-semibold">Reps aprox.</th>
              </tr>
            </thead>
            <tbody>
              {pcts.map((row, i) => (
                <tr key={row.pct} className={`border-b border-white/[0.04] ${i === 0 ? "bg-orange-500/[0.05]" : "hover:bg-white/[0.02]"}`}>
                  <td className={`px-4 py-2.5 font-bold ${i === 0 ? "text-orange-400" : "text-white/60"}`}>{row.pct}%</td>
                  <td className="px-4 py-2.5 text-white">{row.kg}</td>
                  <td className="px-4 py-2.5 text-white/60">{row.reps}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/* ─── 2. TDEE ──────────────────────────────────────────── */
const activityLevels = [
  { value: "1.2", label: "Sedentario — sin ejercicio" },
  { value: "1.375", label: "Ligero — 1-3 días/semana" },
  { value: "1.55", label: "Moderado — 3-5 días/semana" },
  { value: "1.725", label: "Activo — 6-7 días/semana" },
  { value: "1.9", label: "Muy activo — 2 sesiones/día" },
];

function CalcTDEE() {
  const [sex, setSex] = useState<"m" | "f">("m");
  const [weight, setWeight] = useState<number>(80);
  const [height, setHeight] = useState<number>(175);
  const [age, setAge] = useState<number>(25);
  const [activity, setActivity] = useState<string>("1.55");

  const bmr =
    sex === "m"
      ? 10 * weight + 6.25 * height - 5 * age + 5
      : 10 * weight + 6.25 * height - 5 * age - 161;
  const tdee = Math.round(bmr * Number(activity));

  const goals = [
    { label: "Déficit agresivo", cal: tdee - 500, note: "-500 kcal/día ≈ -0.5 kg/semana" },
    { label: "Déficit moderado", cal: tdee - 250, note: "-250 kcal/día ≈ -0.25 kg/semana" },
    { label: "Mantenimiento", cal: tdee, note: "Peso estable", accent: true },
    { label: "Superávit moderado", cal: tdee + 250, note: "+250 kcal/día ≈ +0.25 kg/semana" },
    { label: "Superávit agresivo", cal: tdee + 500, note: "+500 kcal/día ≈ +0.5 kg/semana" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <p className="text-xs text-white/55 leading-relaxed">
          Mifflin-St Jeor × factor de actividad. La fórmula más validada para población general.
        </p>
        <div className="flex gap-3">
          {(["m", "f"] as const).map((s) => (
            <button
              key={s}
              onClick={() => setSex(s)}
              className={`flex-1 py-2.5 rounded-xl text-sm font-bold transition-all ${
                sex === s
                  ? "bg-orange-500/15 border border-orange-500/30 text-orange-400"
                  : "border border-white/[0.07] text-white/55 hover:text-white/90"
              }`}
            >
              {s === "m" ? "Hombre" : "Mujer"}
            </button>
          ))}
        </div>
        <Field label="Peso" unit="kg" value={weight} onChange={setWeight} min={30} max={300} />
        <Field label="Altura" unit="cm" value={height} onChange={setHeight} min={100} max={250} />
        <Field label="Edad" unit="años" value={age} onChange={setAge} min={15} max={99} />
        <Select label="Nivel de actividad" value={activity} onChange={setActivity} options={activityLevels} />
        <ResultBox label="Tu TDEE" value={tdee.toLocaleString()} unit="kcal/día" accent sub={`TMB: ${Math.round(bmr)} kcal`} />
      </div>
      <div className="space-y-3">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-3">
          Objetivos calóricos
        </p>
        {goals.map((g) => (
          <div
            key={g.label}
            className={`p-4 rounded-xl border ${
              g.accent ? "border-orange-500/20 bg-orange-500/[0.05]" : "border-white/[0.06] bg-white/[0.02]"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className={`text-sm font-semibold ${g.accent ? "text-orange-400" : "text-white/60"}`}>{g.label}</span>
              <span className={`font-black tabular-nums ${g.accent ? "text-orange-400" : "text-white"}`}>{g.cal.toLocaleString()}</span>
            </div>
            <p className="text-xs text-white/50 mt-0.5">{g.note}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ─── 3. IMC ───────────────────────────────────────────── */
function CalcIMC() {
  const [weight, setWeight] = useState<number>(80);
  const [height, setHeight] = useState<number>(175);

  const imc = weight / Math.pow(height / 100, 2);
  const imcR = Math.round(imc * 10) / 10;

  const categories = [
    { min: 0, max: 18.5, label: "Bajo peso", color: "text-sky-400" },
    { min: 18.5, max: 25, label: "Normal", color: "text-emerald-400" },
    { min: 25, max: 30, label: "Sobrepeso", color: "text-yellow-400" },
    { min: 30, max: 35, label: "Obesidad I", color: "text-orange-400" },
    { min: 35, max: 40, label: "Obesidad II", color: "text-red-400" },
    { min: 40, max: 999, label: "Obesidad III", color: "text-red-600" },
  ];

  const cat = categories.find((c) => imc >= c.min && imc < c.max) ?? categories[categories.length - 1];
  const pct = Math.min(Math.max(((imc - 10) / (45 - 10)) * 100, 0), 100);

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <p className="text-xs text-white/55 leading-relaxed">
          El IMC es un indicador de referencia, no un diagnóstico. Atletas con alta masa muscular tendrán valores elevados sin exceso de grasa.
        </p>
        <Field label="Peso" unit="kg" value={weight} onChange={setWeight} min={30} max={300} />
        <Field label="Altura" unit="cm" value={height} onChange={setHeight} min={100} max={250} />

        <div className="rounded-2xl border border-orange-500/25 bg-orange-500/[0.06] p-5">
          <p className="text-[11px] font-semibold uppercase tracking-[0.18em] text-white/55 mb-1">Tu IMC</p>
          <p className="font-black text-4xl tabular-nums text-orange-400 mb-1">{imcR}</p>
          <p className={`text-sm font-bold ${cat.color}`}>{cat.label}</p>
        </div>

        {/* Bar */}
        <div>
          <div className="h-2 rounded-full bg-white/[0.06] overflow-hidden">
            <div
              className="h-full rounded-full bg-gradient-to-r from-sky-400 via-emerald-400 via-yellow-400 via-orange-400 to-red-600 transition-all duration-300"
              style={{ width: `${pct}%` }}
            />
          </div>
          <div className="flex justify-between text-[10px] text-white/50 mt-1 tabular-nums">
            <span>10</span><span>18.5</span><span>25</span><span>30</span><span>40+</span>
          </div>
        </div>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-3">Categorías OMS</p>
        <div className="space-y-2">
          {categories.map((c) => (
            <div
              key={c.label}
              className={`flex items-center justify-between p-3.5 rounded-xl border transition-all ${
                cat.label === c.label
                  ? "border-white/15 bg-white/[0.05]"
                  : "border-white/[0.04] bg-transparent"
              }`}
            >
              <div className="flex items-center gap-3">
                <div className={`w-2 h-2 rounded-full ${c.color.replace("text-", "bg-")}`} />
                <span className={`text-sm ${cat.label === c.label ? "text-white font-bold" : "text-white/60"}`}>{c.label}</span>
              </div>
              <span className="text-xs text-white/50 tabular-nums">
                {c.max < 999 ? `${c.min} – ${c.max}` : `≥ ${c.min}`}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ─── 4. Macros ────────────────────────────────────────── */
const macroGoals = [
  { value: "gain", label: "Ganancia muscular" },
  { value: "loss", label: "Pérdida de grasa" },
  { value: "maintain", label: "Mantenimiento" },
  { value: "recomp", label: "Recomposición" },
];

function CalcMacros() {
  const [calories, setCalories] = useState<number>(2500);
  const [goal, setGoal] = useState<string>("gain");
  const [weight, setWeight] = useState<number>(80);

  const presets: Record<string, { prot: number; fat: number; carb: number }> = {
    gain: { prot: 0.3, fat: 0.25, carb: 0.45 },
    loss: { prot: 0.35, fat: 0.3, carb: 0.35 },
    maintain: { prot: 0.25, fat: 0.3, carb: 0.45 },
    recomp: { prot: 0.35, fat: 0.28, carb: 0.37 },
  };

  const p = presets[goal];
  const protG = Math.round((calories * p.prot) / 4);
  const fatG = Math.round((calories * p.fat) / 9);
  const carbG = Math.round((calories * p.carb) / 4);
  const protKg = Math.round((protG / weight) * 10) / 10;

  const bars = [
    { label: "Proteína", g: protG, pct: Math.round(p.prot * 100), color: "bg-orange-500" },
    { label: "Carbohidratos", g: carbG, pct: Math.round(p.carb * 100), color: "bg-sky-500" },
    { label: "Grasa", g: fatG, pct: Math.round(p.fat * 100), color: "bg-violet-500" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <p className="text-xs text-white/55 leading-relaxed">
          Distribución de macronutrientes según objetivo. La proteína se ajusta por kg de peso corporal.
        </p>
        <Field label="Calorías totales" unit="kcal" value={calories} onChange={setCalories} min={800} max={6000} step={50} />
        <Field label="Peso corporal" unit="kg" value={weight} onChange={setWeight} min={30} max={200} />
        <Select label="Objetivo" value={goal} onChange={setGoal} options={macroGoals} />

        <div className="grid grid-cols-3 gap-3">
          {bars.map((b) => (
            <ResultBox key={b.label} label={b.label} value={b.g} unit="g" sub={`${b.pct}%`} />
          ))}
        </div>
        <div className="text-xs text-white/55 p-3 rounded-xl border border-white/[0.05] bg-white/[0.02]">
          Proteína: <span className="text-white/60 font-bold">{protKg} g/kg</span> de peso corporal
          {protKg < 1.6 && " — considera aumentar calorías totales para mayor síntesis muscular"}
          {protKg >= 2.5 && " — nivel muy alto, considera redistribuir hacia carbohidratos"}
        </div>
      </div>

      <div className="space-y-4">
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55">Distribución visual</p>
        <div className="space-y-3">
          {bars.map((b) => (
            <div key={b.label}>
              <div className="flex justify-between text-sm mb-1.5">
                <span className="text-white/50">{b.label}</span>
                <span className="text-white font-bold tabular-nums">{b.g} g</span>
              </div>
              <div className="h-2.5 rounded-full bg-white/[0.06] overflow-hidden">
                <div
                  className={`h-full rounded-full ${b.color} transition-all duration-500`}
                  style={{ width: `${b.pct}%` }}
                />
              </div>
              <p className="text-right text-[10px] text-white/50 mt-0.5">{b.pct}%</p>
            </div>
          ))}
        </div>

        <div className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4 mt-4">
          <p className="text-[11px] text-white/50 uppercase tracking-widest mb-3">Verificación calórica</p>
          <div className="space-y-1.5 text-sm tabular-nums">
            <div className="flex justify-between">
              <span className="text-white/60">Proteína ({protG}g × 4)</span>
              <span className="text-white">{protG * 4} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Carbohidratos ({carbG}g × 4)</span>
              <span className="text-white">{carbG * 4} kcal</span>
            </div>
            <div className="flex justify-between">
              <span className="text-white/60">Grasa ({fatG}g × 9)</span>
              <span className="text-white">{fatG * 9} kcal</span>
            </div>
            <div className="flex justify-between border-t border-white/[0.06] pt-1.5 font-bold">
              <span className="text-white/60">Total</span>
              <span className="text-orange-400">{protG * 4 + carbG * 4 + fatG * 9} kcal</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── 5. Frecuencia Cardíaca ───────────────────────────── */
function CalcFC() {
  const [age, setAge] = useState<number>(25);
  const [restHR, setRestHR] = useState<number>(60);

  const maxHR = 220 - age;
  const hrr = maxHR - restHR;

  const zones = [
    { name: "Zona 1", label: "Recuperación activa", pct: "50–60%", karvonen: [0.5, 0.6], color: "bg-sky-400", textColor: "text-sky-400" },
    { name: "Zona 2", label: "Base aeróbica", pct: "60–70%", karvonen: [0.6, 0.7], color: "bg-emerald-400", textColor: "text-emerald-400" },
    { name: "Zona 3", label: "Aeróbico moderado", pct: "70–80%", karvonen: [0.7, 0.8], color: "bg-yellow-400", textColor: "text-yellow-400" },
    { name: "Zona 4", label: "Umbral anaeróbico", pct: "80–90%", karvonen: [0.8, 0.9], color: "bg-orange-400", textColor: "text-orange-400" },
    { name: "Zona 5", label: "Máxima intensidad", pct: "90–100%", karvonen: [0.9, 1.0], color: "bg-red-400", textColor: "text-red-400" },
  ];

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <p className="text-xs text-white/55 leading-relaxed">
          Fórmula de Karvonen (frecuencia cardíaca de reserva). Más precisa que el método de % simple porque incorpora la FC en reposo.
        </p>
        <Field label="Edad" unit="años" value={age} onChange={setAge} min={15} max={99} />
        <Field label="FC en reposo" unit="bpm" value={restHR} onChange={setRestHR} min={30} max={100} />
        <div className="grid grid-cols-2 gap-3">
          <ResultBox label="FC Máxima" value={maxHR} unit="bpm" accent />
          <ResultBox label="FC Reserva" value={hrr} unit="bpm" />
        </div>
        <p className="text-[10px] text-white/50 leading-relaxed">
          Mide tu FC en reposo por la mañana antes de levantarte, durante al menos 3 días, y promedia los valores.
        </p>
      </div>

      <div>
        <p className="text-[11px] font-semibold uppercase tracking-[0.2em] text-white/55 mb-3">Zonas de entrenamiento</p>
        <div className="space-y-2">
          {zones.map((z) => {
            const low = Math.round(z.karvonen[0] * hrr + restHR);
            const high = Math.round(z.karvonen[1] * hrr + restHR);
            return (
              <div key={z.name} className="flex items-center gap-4 p-3.5 rounded-xl border border-white/[0.05] bg-white/[0.02] hover:bg-white/[0.04] transition-all">
                <div className={`w-1.5 h-10 rounded-full ${z.color} flex-shrink-0`} />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className={`text-xs font-bold ${z.textColor}`}>{z.name}</span>
                    <span className="text-xs text-white/50">{z.label}</span>
                  </div>
                  <p className="text-white/55 text-[10px] mt-0.5">{z.pct} FC máx · Karvonen</p>
                </div>
                <div className="text-right">
                  <p className="text-white font-black text-sm tabular-nums">{low}–{high}</p>
                  <p className="text-white/50 text-[10px]">bpm</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─── 6. Volumen Semanal ───────────────────────────────── */
const muscleGroups = [
  { id: "pecho", label: "Pecho", mev: 8, mrv: 20 },
  { id: "espalda", label: "Espalda", mev: 10, mrv: 25 },
  { id: "hombros", label: "Hombros", mev: 8, mrv: 20 },
  { id: "biceps", label: "Bíceps", mev: 6, mrv: 20 },
  { id: "triceps", label: "Tríceps", mev: 6, mrv: 18 },
  { id: "cuadriceps", label: "Cuádriceps", mev: 8, mrv: 20 },
  { id: "femoral", label: "Femoral/Glúteo", mev: 6, mrv: 20 },
  { id: "pantorrilla", label: "Pantorrilla", mev: 8, mrv: 16 },
  { id: "abs", label: "Abdomen", mev: 8, mrv: 20 },
];

function CalcVolumen() {
  const [sets, setSets] = useState<Record<string, number>>(
    Object.fromEntries(muscleGroups.map((g) => [g.id, g.mev]))
  );

  const update = (id: string, val: number) =>
    setSets((prev) => ({ ...prev, [id]: Math.max(0, Math.min(val, 40)) }));

  const status = (id: string, v: number) => {
    const g = muscleGroups.find((x) => x.id === id)!;
    if (v < g.mev) return { label: "Por debajo del MEV", color: "text-sky-400", bar: "bg-sky-400" };
    if (v >= g.mev && v < g.mrv * 0.75) return { label: "Volumen mínimo efectivo", color: "text-emerald-400", bar: "bg-emerald-400" };
    if (v >= g.mrv * 0.75 && v <= g.mrv) return { label: "Rango óptimo", color: "text-orange-400", bar: "bg-orange-400" };
    return { label: "Sobre el MRV — riesgo de sobreentrenamiento", color: "text-red-400", bar: "bg-red-400" };
  };

  const totalSets = Object.values(sets).reduce((a, b) => a + b, 0);

  return (
    <div>
      <div className="flex items-start justify-between mb-6 gap-4 flex-wrap">
        <p className="text-xs text-white/55 leading-relaxed max-w-lg">
          Basado en{" "}
          <Tooltip>
            <TooltipTrigger className="underline decoration-dotted underline-offset-2 cursor-help">
              MEV
            </TooltipTrigger>
            <TooltipContent>Volumen Mínimo Efectivo — el mínimo de series semanales para seguir progresando.</TooltipContent>
          </Tooltip>{" "}
          y{" "}
          <Tooltip>
            <TooltipTrigger className="underline decoration-dotted underline-offset-2 cursor-help">
              MRV
            </TooltipTrigger>
            <TooltipContent>Volumen Máximo Recuperable — el techo de series que tu cuerpo aún puede recuperar en la semana.</TooltipContent>
          </Tooltip>{" "}
          según Israetel et al., 2019. Ajusta las series directas semanales por grupo muscular.
        </p>
        <div className="rounded-xl border border-orange-500/20 bg-orange-500/[0.06] px-4 py-2 text-right flex-shrink-0">
          <p className="text-[10px] text-white/55 uppercase tracking-widest">Total semanal</p>
          <p className="text-orange-400 font-black text-xl tabular-nums">{totalSets} series</p>
        </div>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {muscleGroups.map((g) => {
          const v = sets[g.id];
          const s = status(g.id, v);
          const pct = Math.min((v / g.mrv) * 100, 110);
          return (
            <div key={g.id} className="rounded-2xl border border-white/[0.07] bg-white/[0.02] p-4">
              <div className="flex items-center justify-between mb-3">
                <span className="text-sm font-bold text-white">{g.label}</span>
                <div className="flex items-center gap-1">
                  <button
                    onClick={() => update(g.id, v - 1)}
                    aria-label={`Restar serie — ${g.label}`}
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-white/[0.1] text-white/60 hover:text-white hover:border-white/20 text-sm font-bold transition-all"
                  >
                    −
                  </button>
                  <span className="text-white font-black text-base tabular-nums w-6 text-center">{v}</span>
                  <button
                    onClick={() => update(g.id, v + 1)}
                    aria-label={`Sumar serie — ${g.label}`}
                    className="w-8 h-8 flex items-center justify-center rounded-md border border-white/[0.1] text-white/60 hover:text-white hover:border-white/20 text-sm font-bold transition-all"
                  >
                    +
                  </button>
                </div>
              </div>
              <div className="h-1.5 rounded-full bg-white/[0.05] overflow-hidden mb-2">
                <div
                  className={`h-full rounded-full ${s.bar} transition-all duration-300`}
                  style={{ width: `${Math.min(pct, 100)}%` }}
                />
              </div>
              <div className="flex items-center justify-between text-[10px]">
                <span className={`font-semibold ${s.color}`}>{s.label}</span>
                <span className="text-white/50">MEV {g.mev} · MRV {g.mrv}</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ─── Main hub ─────────────────────────────────────────── */
const tabs = [
  { id: "1rm", label: "1RM", sub: "Fuerza máxima", icon: Bolt },
  { id: "tdee", label: "TDEE", sub: "Calorías", icon: Flame },
  { id: "imc", label: "IMC", sub: "Índice corporal", icon: UserIcon },
  { id: "macros", label: "Macros", sub: "Nutrición", icon: ChartBar },
  { id: "fc", label: "Frecuencia Cardíaca", sub: "Zonas", icon: Heart },
  { id: "volumen", label: "Volumen Semanal", sub: "Series", icon: TrendingUp },
];

export default function CalculadorasClient() {
  const [active, setActive] = useState("1rm");

  return (
    <Tabs value={active} onValueChange={setActive} className="gap-0 max-w-5xl mx-auto px-6 pb-24">
      {/* Tab bar */}
      <TabsList className="pb-2 mb-8">
        {tabs.map((t) => (
          <TabsTrigger key={t.id} value={t.id}>
            <t.icon className="w-5 h-5" strokeWidth={1.75} />
            <span className="mt-1.5">{t.label}</span>
            <span className="text-[10px] font-normal opacity-60">{t.sub}</span>
          </TabsTrigger>
        ))}
      </TabsList>

      {/* Panel */}
      <div className="rounded-3xl border border-white/[0.07] bg-white/[0.015] p-6 sm:p-8">
        <div className="mb-6 pb-5 border-b border-white/[0.06]">
          <h2 className="font-black text-xl text-white">
            {tabs.find((t) => t.id === active)?.label}
          </h2>
          <p className="text-xs text-white/55 mt-1">
            {tabs.find((t) => t.id === active)?.sub}
          </p>
        </div>

        <TabsContent value="1rm"><Calc1RM /></TabsContent>
        <TabsContent value="tdee"><CalcTDEE /></TabsContent>
        <TabsContent value="imc"><CalcIMC /></TabsContent>
        <TabsContent value="macros"><CalcMacros /></TabsContent>
        <TabsContent value="fc"><CalcFC /></TabsContent>
        <TabsContent value="volumen"><CalcVolumen /></TabsContent>
      </div>

      {/* Footer note */}
      <p className="text-center text-[11px] text-white/50 mt-6 leading-relaxed max-w-lg mx-auto">
        Las calculadoras producen estimaciones basadas en fórmulas validadas por la literatura científica.
        No reemplazan la evaluación individual ni el asesoramiento profesional.
      </p>
    </Tabs>
  );
}
