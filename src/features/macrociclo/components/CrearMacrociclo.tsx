"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/brand/Button";
import Input from "@/components/brand/Input";
import SelectNativo from "@/components/brand/SelectNativo";
import { toast } from "@/components/brand/Toast";
import { Spinner } from "@/components/brand/icons";
import { accionCrearMacrociclo } from "@/lib/macrociclo/actions";
import { MODELOS } from "@/lib/macrociclo/modelos";
import { MAX_SEMANAS } from "@/lib/macrociclo/tipos";

// ── Crear un macrociclo (Sprint MAC-1) ─────────────────────────────────────
//
// EL MODELO SE ELIGE AQUÍ Y SOLO SIEMBRA.
//
//   Elegir «ATR» crea tres mesociclos con sus nombres y su orden, y cuatro
//   filas con sus renglones. Ni una celda sale rellena.
//
//   Esa es la diferencia entre una estructura documentada y una prescripción
//   inventada, y se explica en pantalla en vez de dejarla implícita: quien
//   elige un modelo esperando que le reparta las cargas tiene que descubrir
//   aquí que no, no al llegar a una rejilla vacía.
//
// Cada modelo declara a quién se atribuye Y que la obra original no se ha
// consultado en este proyecto. Las dos cosas juntas, porque una atribución
// sin esa advertencia se lee como una cita comprobada.

interface Props {
  atletas: readonly { id: string; nombre: string }[];
}

const MENSAJE: Record<string, string> = {
  NO_AUTENTICADO: "La sesión ha caducado.",
  NOMBRE_VACIO: "Ponle un nombre al macrociclo.",
  SEMANAS_FUERA_DE_RANGO: `Las semanas tienen que estar entre 1 y ${MAX_SEMANAS}.`,
  MODELO_DESCONOCIDO: "Ese modelo de periodización no existe.",
  NO_CREADO: "No se pudo crear.",
};

export default function CrearMacrociclo({ atletas }: Props) {
  const router = useRouter();
  const [abierto, setAbierto] = useState(false);
  const [nombre, setNombre] = useState("");
  const [semanas, setSemanas] = useState("12");
  const [modeloId, setModeloId] = useState<string>("");
  const [atletaId, setAtletaId] = useState<string>("");
  const [fechaInicio, setFechaInicio] = useState("");
  const [plantilla, setPlantilla] = useState<"plan_grafico" | "vacio">("plan_grafico");
  const [creando, setCreando] = useState(false);

  const modelo = MODELOS.find((m) => m.id === modeloId) ?? null;

  async function crear() {
    if (creando) return;
    const n = Number(semanas);
    if (!Number.isFinite(n)) {
      toast.error("Las semanas tienen que ser un número.");
      return;
    }

    setCreando(true);
    const r = await accionCrearMacrociclo({
      nombre,
      semanas: n,
      modeloId: modeloId === "" ? null : modeloId,
      atletaId: atletaId === "" ? null : atletaId,
      objetivo: null,
      fechaInicio: fechaInicio === "" ? null : fechaInicio,
      plantilla,
    });
    setCreando(false);

    if (!r.ok) {
      toast.error(MENSAJE[r.error] ?? r.error);
      return;
    }
    toast.success("Macrociclo creado.");
    router.push(`/app/rendimiento/macrociclo/${r.data.id}`);
  }

  if (!abierto) {
    return (
      <Button size="sm" onClick={() => setAbierto(true)}>
        Nuevo macrociclo
      </Button>
    );
  }

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
      <div className="flex flex-wrap items-end gap-3">
        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Nombre</span>
          <Input
            value={nombre}
            autoFocus
            placeholder="Pretemporada 2026"
            onChange={(e) => setNombre(e.target.value)}
            disabled={creando}
            className="w-56"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Semanas</span>
          <Input
            value={semanas}
            inputMode="numeric"
            onChange={(e) => setSemanas(e.target.value)}
            disabled={creando}
            className="w-20 text-center tabular-nums"
          />
        </label>

        <label className="block">
          {/* Sin fecha no hay banda de meses ni fechas de microciclo: la
              rejilla se lee entonces por número de semana, que es lo normal en
              una plantilla que aún no tiene calendario. */}
          <span className="mb-1 block text-xs font-semibold text-white/60">
            Inicio <span className="font-normal text-white/30">lunes de la semana 1</span>
          </span>
          <Input
            type="date"
            value={fechaInicio}
            onChange={(e) => setFechaInicio(e.target.value)}
            disabled={creando}
            className="w-40 [color-scheme:dark]"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Atleta</span>
          <SelectNativo
            value={atletaId}
            onChange={setAtletaId}
            disabled={creando}
            placeholder="Sin atleta"
            options={atletas.map((a) => ({ value: a.id, label: a.nombre }))}
            className="w-48"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Modelo</span>
          <SelectNativo
            value={modeloId}
            onChange={setModeloId}
            disabled={creando}
            placeholder="Empezar en blanco"
            options={MODELOS.map((m) => ({ value: m.id, label: m.nombre }))}
            className="w-72"
          />
        </label>

        <label className="block">
          <span className="mb-1 block text-xs font-semibold text-white/60">Estructura</span>
          <SelectNativo
            value={plantilla}
            onChange={(v) => setPlantilla(v === "vacio" ? "vacio" : "plan_grafico")}
            disabled={creando}
            options={[
              { value: "plan_grafico", label: "Plan gráfico completo" },
              { value: "vacio", label: "En blanco" },
            ]}
            className="w-52"
          />
        </label>

        <Button size="sm" onClick={crear} disabled={creando}>
          {creando ? (
            <>
              <Spinner className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
              Creando…
            </>
          ) : (
            "Crear"
          )}
        </Button>
        <Button size="sm" variant="outline" onClick={() => setAbierto(false)} disabled={creando}>
          Cancelar
        </Button>
      </div>

      {plantilla === "plan_grafico" ? (
        <p className="mt-3 text-[11px] leading-relaxed text-white/40">
          El plan gráfico siembra las bandas de <strong className="text-white/60">periodo</strong> y{" "}
          <strong className="text-white/60">etapa</strong>, y una fila por cada contenido de
          preparación —física general y especial, técnico-táctica, teórica y psicológica—, además de
          volumen e intensidad para la curva. Todo con su taxonomía tomada de Forteza (2009),
          citada por página.
        </p>
      ) : null}

      {modelo !== null ? (
        <div className="mt-4 rounded-xl border border-white/[0.08] bg-white/[0.02] p-3">
          <p className="text-[12px] leading-relaxed text-white/65">{modelo.descripcion}</p>
          <p className="mt-2 flex flex-wrap gap-1.5">
            {modelo.fases.map((f) => (
              <span
                key={f.id}
                className="rounded px-1.5 py-0.5 text-[11px] font-medium"
                style={{ backgroundColor: `${f.color}22`, color: f.color }}
                title={f.proposito}
              >
                {f.nombre}
              </span>
            ))}
          </p>
          <p className="mt-2.5 text-[11px] leading-relaxed text-white/35">
            {modelo.atribucion}. La obra original no se ha consultado en este proyecto, así que
            esto es una atribución y no una cita comprobada.
          </p>
          <p className="mt-1.5 text-[11px] leading-relaxed text-yellow-200/70">
            El modelo crea los mesociclos con su nombre y su orden, y las filas vacías.{" "}
            <strong className="font-semibold">Ninguna cifra sale rellena</strong>: el volumen, la
            intensidad y las cargas los escribes tú.
          </p>
        </div>
      ) : null}
    </div>
  );
}
