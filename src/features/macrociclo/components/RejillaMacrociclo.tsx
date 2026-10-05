"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";

import { toast } from "@/components/brand/Toast";
import {
  alternarGrafico,
  aplicarModeloEnRango,
  borrarCompetencia,
  cambiarTipoFila,
  claveDia,
  escribirCelda,
  escribirCompetencia,
  escribirDia,
  escribirSemana,
  indiceCompetencias,
  indiceDias,
  iniciosDeTramos,
  mesocicloDeSemana,
  redimensionarMesociclo,
  redimensionarTramo,
  renombrarMesociclo,
  renombrarTramo,
  semanasCubiertas,
} from "@/lib/macrociclo/contenido";
import { bandaDeMeses, etiquetaDeRango, rangosDeSemanas } from "@/lib/macrociclo/fechas";
import { MODELOS, modeloDe, modeloDeFase } from "@/lib/macrociclo/modelos";
import {
  CATEGORIAS_COMPETENCIA,
  GRUPOS_CAPACIDADES,
  TIPOS_MICROCICLO,
  categoriaCompetenciaDe,
  tipoMesocicloDe,
  tipoMicrocicloDe,
} from "@/lib/macrociclo/taxonomia";
import type { ContenidoMacrociclo, Macrociclo, TipoFila } from "@/lib/macrociclo/tipos";
import { DIAS_SEMANA } from "@/lib/macrociclo/tipos";
import { accionGuardarContenido } from "@/lib/macrociclo/actions";
import CurvaCarga, { LeyendaCurva } from "./CurvaCarga";

// ── La rejilla del macrociclo (Sprints MAC-1 · MAC-2 · MAC-3) ──────────────
//
// El plan gráfico entero: hasta 104 columnas de semana y una veintena de
// bandas apiladas, en una pantalla de portátil y sin dejar de ser legible.
//
// ── 1 · EL ZOOM NO USA `transform: scale()` ──────────────────────────────
//
//   Escalar con `transform` es la solución obvia y rompe `position: sticky`:
//   la primera columna y la cabecera dejan de quedarse fijas en cuanto el
//   contenedor está transformado. Con veinte bandas y 104 semanas eso
//   significa perder de vista qué fila se lee justo cuando más falta hace.
//
//   Aquí el zoom es una VARIABLE CSS que multiplica anchos, altos y
//   tipografía. El layout se recalcula de verdad, sticky sigue funcionando y
//   el texto se lee nítido a cualquier escala en vez de emborronarse.
//
// ── 2 · SOLO SE MONTA UN `input`: EL DE LA CELDA QUE SE EDITA ────────────
//
//   Veinte filas por 104 semanas, más siete días y seis bandas, pasan de tres
//   mil celdas. Montar un campo en cada una hace que escribir vaya a tirones.
//   Las celdas se pintan como texto y el campo aparece al entrar en ellas,
//   que es como se comporta una hoja de cálculo.
//
// ── 3 · LO QUE SE DERIVA NO SE EDITA ─────────────────────────────────────
//
//   Meses, fechas y número de microciclo salen de `fechaInicio` y del número
//   de semanas. No tienen celda porque no son datos: son consecuencias. Una
//   banda de meses editable podría acabar diciendo «Octubre» sobre una semana
//   de septiembre, y nadie sabría cuál de las dos creer.

interface Props {
  macrociclo: Macrociclo;
  plantillas: readonly { id: string; nombre: string }[];
}

type Edicion =
  | { tipo: "celda"; filaId: string; semana: number }
  | { tipo: "dia"; dia: number; semana: number }
  | { tipo: "semana"; campo: CampoSemana; semana: number }
  | { tipo: "competencia"; semana: number }
  | { tipo: "tramo"; id: string }
  | null;

type CampoSemana = "sesiones" | "horas" | "diasEntrenamiento" | "diasDescanso";

const CAMPOS_SEMANA: readonly { campo: CampoSemana; etiqueta: string }[] = [
  { campo: "sesiones", etiqueta: "Sesiones" },
  { campo: "horas", etiqueta: "Horas" },
  { campo: "diasEntrenamiento", etiqueta: "Días entren." },
  { campo: "diasDescanso", etiqueta: "Días descanso" },
];

/** Lo que se escribe en una celda de marca, en el orden en que se pulsa. */
const CICLO_MARCA = ["X", "=", ""] as const;

/** El tipo de una fila se recorre pulsando, como el resto del vocabulario cerrado. */
const CICLO_TIPO_FILA: readonly TipoFila[] = ["marca", "numero", "porcentaje", "texto"];
const ETIQUETA_TIPO_FILA: Record<TipoFila, string> = {
  marca: "X=",
  numero: "123",
  porcentaje: "%",
  texto: "Abc",
};

/**
 * Código corto para el botón que aplica un modelo a un periodo.
 *
 * Es una etiqueta de la interfaz, no un dato del modelo: `modelos.ts` no
 * declara siglas porque no todas las obras las usan igual, y aquí solo hace
 * falta algo que quepa en una banda de dos rem de alto.
 */
const CODIGO_MODELO: Record<string, string> = {
  clasico: "CLÁS",
  atr: "ATR",
  bloques: "BLOQ",
  ondulatorio: "OND",
  conjugado: "CONJ",
};

/** El ciclo de modelos que recorre el botón de un periodo: ninguno, y los cinco. */
const CICLO_MODELO: readonly (string | null)[] = [null, ...MODELOS.map((m) => m.id)];

const RETARDO_GUARDADO = 900;


// ── Clases compartidas ─────────────────────────────────────────────────────
//
// Los subcomponentes viven AQUÍ y no dentro del render, y no es un detalle de
// estilo: un componente redefinido en cada render es un tipo nuevo para React,
// que desmonta y vuelve a montar el subárbol entero. El campo abierto perdía
// el foco en cada tecla, así que escribir un número de sesiones era imposible.

const CELDA =
  "shrink-0 border-r border-b border-white/[0.07] px-1.5 flex items-center overflow-hidden whitespace-nowrap";
const ETIQUETA = `${CELDA} sticky left-0 z-20 bg-[#0f1115] font-medium text-white/70`;
const ALTO = { height: "var(--alto-fila)" } as React.CSSProperties;
const ANCHO_ETIQUETA = { width: "var(--ancho-etiqueta)" } as React.CSSProperties;
const ANCHO_CELDA = { width: "var(--ancho-celda)" } as React.CSSProperties;

interface TramoDeBanda {
  id: string;
  nombre: string;
  /** Nombre SIN decorar, si `nombre` lleva algo añadido para mostrar (ej. « · MBD»). */
  nombreEdicion?: string;
  semanas: number;
  color: string;
}

/**
 * Una banda de tramos combinados sobre sus semanas.
 *
 * Editable cuando el llamador pasa `onRenombrar` y/o `onRedimensionar`: sin
 * ellos se pinta igual que antes, de solo lectura — es lo que necesita la
 * banda de Meses, que es derivada y no tiene sentido tocar a mano.
 */
function Banda({
  nombre,
  tramos,
  semanas,
  fondo = 0.16,
  editandoId = null,
  onEmpezarRenombrar,
  onRenombrar,
  onRedimensionar,
  medirAnchoCelda,
  modeloDeTramo,
  onAplicarModelo,
}: {
  nombre: string;
  tramos: readonly TramoDeBanda[];
  semanas: number;
  fondo?: number;
  editandoId?: string | null;
  onEmpezarRenombrar?: (id: string) => void;
  onRenombrar?: (id: string, nombre: string) => void;
  onRedimensionar?: (id: string, semanas: number) => void;
  medirAnchoCelda?: () => number;
  modeloDeTramo?: (id: string) => string | null;
  onAplicarModelo?: (id: string, modeloId: string | null) => void;
}) {
  const cubiertas = semanasCubiertas(tramos);
  const alfa = Math.round(fondo * 255).toString(16).padStart(2, "0");
  const arrastre = useRef<{ id: string; xInicial: number; semanasIniciales: number } | null>(null);

  const empezarRedimension = (e: React.PointerEvent, id: string, semanasActuales: number) => {
    if (onRedimensionar === undefined) return;
    e.stopPropagation();
    e.preventDefault();
    const ancho = medirAnchoCelda?.() ?? 0;
    if (ancho <= 0) return;
    arrastre.current = { id, xInicial: e.clientX, semanasIniciales: semanasActuales };

    const mover = (ev: PointerEvent) => {
      const a = arrastre.current;
      if (a === null) return;
      // El delta se calcula SIEMPRE contra el arranque del arrastre, no
      // contra el último movimiento: así no se acumula redondeo semana a
      // semana y el tramo vuelve exactamente a su tamaño si el puntero
      // vuelve al punto de partida.
      const deltaSemanas = Math.round((ev.clientX - a.xInicial) / ancho);
      onRedimensionar(a.id, a.semanasIniciales + deltaSemanas);
    };
    const soltar = () => {
      arrastre.current = null;
      window.removeEventListener("pointermove", mover);
      window.removeEventListener("pointerup", soltar);
    };
    window.addEventListener("pointermove", mover);
    window.addEventListener("pointerup", soltar);
  };

  return (
    <div className="flex">
      <div
        className={`${ETIQUETA} text-[11px] uppercase tracking-wider text-white/35`}
        style={{ ...ANCHO_ETIQUETA, ...ALTO }}
      >
        {nombre}
      </div>
      {tramos.map((t) => {
        const enEdicion = editandoId === t.id && onRenombrar !== undefined;
        const modeloActual = modeloDeTramo?.(t.id) ?? null;
        return (
          <div
            key={t.id}
            className={`${CELDA} relative justify-center text-[11px] font-semibold`}
            style={{
              width: `calc(var(--ancho-celda) * ${t.semanas})`,
              ...ALTO,
              backgroundColor: `${t.color}${alfa}`,
              color: t.color,
              borderLeft: `2px solid ${t.color}`,
            }}
            title={enEdicion ? undefined : t.nombre}
          >
            {enEdicion ? (
              <input
                autoFocus
                defaultValue={t.nombreEdicion ?? t.nombre}
                className="w-full bg-transparent text-center outline-none"
                style={{ color: t.color }}
                onBlur={(e) => onRenombrar(t.id, e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                  if (e.key === "Escape") {
                    e.currentTarget.value = t.nombreEdicion ?? t.nombre;
                    e.currentTarget.blur();
                  }
                }}
              />
            ) : (
              <span
                className={`truncate px-1 ${onEmpezarRenombrar !== undefined ? "cursor-text" : ""}`}
                onClick={onEmpezarRenombrar !== undefined ? () => onEmpezarRenombrar(t.id) : undefined}
              >
                {t.nombre}
              </span>
            )}

            {onAplicarModelo !== undefined ? (
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  const i = CICLO_MODELO.indexOf(modeloActual);
                  const siguiente = CICLO_MODELO[(i + 1) % CICLO_MODELO.length];
                  onAplicarModelo(t.id, siguiente);
                }}
                title={
                  modeloActual === null
                    ? "Sin modelo. Clic para sembrar uno en este periodo."
                    : `Modelo: ${modeloDe(modeloActual)?.nombre}. Clic para cambiarlo. Sustituye los mesociclos de este periodo.`
                }
                className="ml-1 shrink-0 rounded px-1 text-[9px] font-bold opacity-70 hover:bg-black/20 hover:opacity-100"
                style={{ border: `1px solid ${t.color}88` }}
              >
                {modeloActual === null ? "+M" : CODIGO_MODELO[modeloActual]}
              </button>
            ) : null}

            {onRedimensionar !== undefined ? (
              <div
                onPointerDown={(e) => empezarRedimension(e, t.id, t.semanas)}
                title="Arrastra para ampliar o reducir esta semana"
                className="absolute right-0 top-0 h-full w-2 cursor-ew-resize hover:bg-white/25"
              />
            ) : null}
          </div>
        );
      })}
      {/* Las semanas que ningún tramo cubre se ven vacías. No se reparten al
          de al lado: es una decisión que nadie ha tomado. */}
      {cubiertas < semanas ? (
        <div
          className={`${CELDA} justify-center text-[11px] italic text-white/20`}
          style={{ width: `calc(var(--ancho-celda) * ${semanas - cubiertas})`, ...ALTO }}
        >
          sin asignar
        </div>
      ) : null}
    </div>
  );
}

/** Una fila de números por semana: sesiones, horas, días. */
function FilaSemana({
  campo,
  etiqueta,
  semanas,
  contenido,
  editando,
  setEditando,
  aplicar,
}: {
  campo: CampoSemana;
  etiqueta: string;
  semanas: number;
  contenido: ContenidoMacrociclo;
  editando: Edicion;
  setEditando: (e: Edicion) => void;
  aplicar: (c: ContenidoMacrociclo) => void;
}) {
  return (
    <div className="flex">
      <div className={ETIQUETA} style={{ ...ANCHO_ETIQUETA, ...ALTO }}>
        {etiqueta}
      </div>
      {Array.from({ length: semanas }, (_, s) => {
        const v = contenido.semanas[s]?.[campo] ?? null;
        const activa =
          editando?.tipo === "semana" && editando.campo === campo && editando.semana === s;
        return (
          <div
            key={s}
            className={`${CELDA} cursor-text justify-center tabular-nums hover:bg-white/[0.04]`}
            style={{ ...ANCHO_CELDA, ...ALTO }}
            onClick={() => setEditando({ tipo: "semana", campo, semana: s })}
          >
            {activa ? (
              <input
                autoFocus
                defaultValue={v === null ? "" : String(v)}
                inputMode="decimal"
                className="w-full bg-transparent text-center text-white outline-none"
                onBlur={(e) => {
                  setEditando(null);
                  const txt = e.target.value.trim().replace(",", ".");
                  const num = txt === "" ? null : Number(txt);
                  // Lo que no es un número se borra en vez de guardarse: una
                  // celda de sesiones con «muchas» dentro no se puede sumar.
                  const limpio = num !== null && Number.isFinite(num) ? num : null;
                  if (limpio !== v) aplicar(escribirSemana(contenido, s, { [campo]: limpio }));
                }}
                onKeyDown={(e) => {
                  if (e.key === "Enter") e.currentTarget.blur();
                  if (e.key === "Escape") {
                    e.currentTarget.value = v === null ? "" : String(v);
                    e.currentTarget.blur();
                  }
                }}
              />
            ) : (
              <span className={v === null ? "text-white/15" : "text-white/80"}>{v ?? "·"}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

export default function RejillaMacrociclo({ macrociclo, plantillas }: Props) {
  const [contenido, setContenido] = useState<ContenidoMacrociclo>(macrociclo.contenido);
  const [zoom, setZoom] = useState(0.85);
  const [editando, setEditando] = useState<Edicion>(null);
  const [estado, setEstado] = useState<"guardado" | "guardando" | "pendiente" | "error">("guardado");

  const temporizador = useRef<ReturnType<typeof setTimeout> | null>(null);
  const contenedor = useRef<HTMLDivElement>(null);

  const n = macrociclo.semanas;
  const nombrePlantilla = useMemo(
    () => new Map(plantillas.map((p) => [p.id, p.nombre])),
    [plantillas],
  );
  const dias = useMemo(() => indiceDias(contenido.dias), [contenido.dias]);
  const competencias = useMemo(
    () => indiceCompetencias(contenido.competencias),
    [contenido.competencias],
  );
  const meses = useMemo(
    () => bandaDeMeses(macrociclo.fechaInicio, n),
    [macrociclo.fechaInicio, n],
  );
  const rangos = useMemo(
    () => rangosDeSemanas(macrociclo.fechaInicio, n),
    [macrociclo.fechaInicio, n],
  );
  const modelo = macrociclo.modeloId === null ? null : modeloDe(macrociclo.modeloId);

  // ── Guardado ─────────────────────────────────────────────────────────────
  const guardar = useCallback(
    (siguiente: ContenidoMacrociclo) => {
      if (temporizador.current !== null) clearTimeout(temporizador.current);
      setEstado("pendiente");
      temporizador.current = setTimeout(async () => {
        setEstado("guardando");
        const r = await accionGuardarContenido(macrociclo.id, siguiente);
        if (r.ok) {
          setEstado("guardado");
        } else {
          setEstado("error");
          toast.error(`No se pudo guardar: ${r.error}`);
        }
      }, RETARDO_GUARDADO);
    },
    [macrociclo.id],
  );

  const aplicar = useCallback(
    (siguiente: ContenidoMacrociclo) => {
      setContenido(siguiente);
      guardar(siguiente);
    },
    [guardar],
  );

  /**
   * Ancho real, en píxeles, de UNA columna de semana — lo que hace falta para
   * convertir un arrastre en semanas.
   *
   * Se MIDE en vez de calcularse de `--ancho-celda` + el zoom: ese cálculo
   * asumiría que la raíz tiene el tamaño de fuente por defecto del
   * navegador, y un usuario que lo haya cambiado vería el tramo crecer a un
   * ritmo distinto del que arrastra con el ratón.
   */
  const medirAnchoCelda = useCallback((): number => {
    const el = contenedor.current?.querySelector<HTMLElement>("[data-celda-muestra]");
    return el?.getBoundingClientRect().width ?? 0;
  }, []);

  useEffect(() => {
    // Sin esto, salir de la página con un cambio a medias lo perdería y el
    // temporizador seguiría vivo apuntando a un componente desmontado.
    return () => {
      if (temporizador.current !== null) clearTimeout(temporizador.current);
    };
  }, []);

  // ── Zoom con Ctrl + rueda, como en cualquier hoja de cálculo ────────────
  useEffect(() => {
    const el = contenedor.current;
    if (el === null) return;
    const alRodar = (e: WheelEvent) => {
      if (!e.ctrlKey && !e.metaKey) return;
      // `preventDefault` evita que el navegador haga SU zoom encima del
      // nuestro, que dejaría la página a media escala y sin forma de volver.
      e.preventDefault();
      setZoom((z) => Math.min(2, Math.max(0.35, z - e.deltaY * 0.0015)));
    };
    el.addEventListener("wheel", alRodar, { passive: false });
    return () => el.removeEventListener("wheel", alRodar);
  }, []);

  // ── Arrastrar para desplazar ─────────────────────────────────────────────
  const arrastre = useRef<{ x: number; y: number; izq: number; arr: number } | null>(null);

  const empezarArrastre = (e: React.MouseEvent) => {
    // Solo con el botón central o con Alt: el izquierdo tiene que seguir
    // sirviendo para seleccionar y editar celdas.
    if (e.button !== 1 && !e.altKey) return;
    const el = contenedor.current;
    if (el === null) return;
    e.preventDefault();
    arrastre.current = { x: e.clientX, y: e.clientY, izq: el.scrollLeft, arr: el.scrollTop };
  };
  const moverArrastre = (e: React.MouseEvent) => {
    const a = arrastre.current;
    const el = contenedor.current;
    if (a === null || el === null) return;
    el.scrollLeft = a.izq - (e.clientX - a.x);
    el.scrollTop = a.arr - (e.clientY - a.y);
  };
  const soltarArrastre = () => {
    arrastre.current = null;
  };

  // ── Estilo ───────────────────────────────────────────────────────────────
  const estilo = {
    "--z": String(zoom),
    "--ancho-celda": "calc(6.2rem * var(--z))",
    "--ancho-etiqueta": "calc(14rem * var(--z))",
    "--alto-fila": "calc(2rem * var(--z))",
    fontSize: `calc(0.78rem * ${zoom})`,
  } as React.CSSProperties;

  const celda = CELDA;
  const etiqueta = ETIQUETA;
  const alto = ALTO;
  const anchoEtiqueta = ANCHO_ETIQUETA;
  const anchoCelda = ANCHO_CELDA;

  return (
    <div className="rounded-2xl border border-white/[0.08] bg-white/[0.01]">
      {/* ── Barra ──────────────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center gap-3 border-b border-white/[0.08] px-4 py-2.5">
        <span className="text-[11px] font-semibold uppercase tracking-[0.14em] text-white/40">
          {n} {n === 1 ? "semana" : "semanas"}
        </span>
        {modelo !== null ? (
          <span className="text-[11px] text-white/30" title={modelo.atribucion}>
            {modelo.nombre}
          </span>
        ) : null}
        {macrociclo.fechaInicio === null ? (
          <span className="text-[11px] text-yellow-200/50">
            Sin fecha de inicio: no hay meses ni fechas
          </span>
        ) : null}

        <div className="ml-auto flex items-center gap-2">
          <span className="text-[11px] text-white/35">Zoom</span>
          <input
            type="range"
            min={0.35}
            max={2}
            step={0.05}
            value={zoom}
            onChange={(e) => setZoom(Number(e.target.value))}
            aria-label="Nivel de zoom de la rejilla"
            className="w-28 accent-orange-500"
          />
          <button
            type="button"
            onClick={() => setZoom(0.85)}
            className="rounded px-1.5 py-0.5 text-[11px] tabular-nums text-white/45 transition-colors hover:bg-white/[0.06] hover:text-white/80"
          >
            {Math.round(zoom * 100)}%
          </button>
          <span
            className={`ml-2 text-[11px] ${
              estado === "error"
                ? "text-red-300"
                : estado === "guardado"
                  ? "text-white/30"
                  : "text-yellow-200/70"
            }`}
          >
            {estado === "guardado"
              ? "Guardado"
              : estado === "guardando"
                ? "Guardando…"
                : estado === "pendiente"
                  ? "Sin guardar"
                  : "Error al guardar"}
          </span>
        </div>
      </div>

      {/* ── Rejilla ────────────────────────────────────────────────────── */}
      <div
        ref={contenedor}
        onMouseDown={empezarArrastre}
        onMouseMove={moverArrastre}
        onMouseUp={soltarArrastre}
        onMouseLeave={soltarArrastre}
        style={estilo}
        className="max-h-[74vh] overflow-auto overscroll-contain"
      >
        <div className="inline-block min-w-full">
          {/* ── MESES · derivado de la fecha de inicio ──────────────────── */}
          {meses.length > 0 ? (
            <Banda
              nombre="Meses"
              semanas={n}
              fondo={0.1}
              tramos={meses.map((m) => ({
                id: `${m.anio}-${m.mes}`,
                nombre: m.nombre,
                semanas: m.semanas,
                color: "#94a3b8",
              }))}
            />
          ) : null}

          {/* ── BANDAS DEL DOCUMENTO · periodo, etapa, lo que haya ──────── */}
          {contenido.bandas.map((b) => (
            <Banda
              key={b.id}
              nombre={b.nombre}
              tramos={b.tramos}
              semanas={n}
              editandoId={editando?.tipo === "tramo" ? editando.id : null}
              onEmpezarRenombrar={(id) => setEditando({ tipo: "tramo", id })}
              onRenombrar={(id, valor) => {
                setEditando(null);
                aplicar(renombrarTramo(contenido, b.id, id, valor));
              }}
              onRedimensionar={(id, semanas) =>
                aplicar(redimensionarTramo(contenido, b.id, id, semanas))
              }
              medirAnchoCelda={medirAnchoCelda}
              // Combinar dos modelos de periodización SOLO tiene sentido a
              // nivel de periodo: es la banda que el libro liga a los ciclos
              // de la forma deportiva. Ofrecerlo también en Etapa dejaría dos
              // sitios sembrando el mismo mesociclo con reglas distintas.
              modeloDeTramo={
                b.nombre === "Periodo"
                  ? (id) => {
                      const inicios = iniciosDeTramos(b.tramos);
                      const i = b.tramos.findIndex((t) => t.id === id);
                      if (i === -1) return null;
                      const primero = mesocicloDeSemana(contenido.mesociclos, inicios[i]);
                      return primero === null ? null : (modeloDeFase(primero.faseId)?.id ?? null);
                    }
                  : undefined
              }
              onAplicarModelo={
                b.nombre === "Periodo"
                  ? (id, modeloId) => {
                      const inicios = iniciosDeTramos(b.tramos);
                      const i = b.tramos.findIndex((t) => t.id === id);
                      if (i === -1) return;
                      aplicar(aplicarModeloEnRango(contenido, inicios[i], b.tramos[i].semanas, modeloId));
                    }
                  : undefined
              }
            />
          ))}

          {/* ── MESOCICLOS ─────────────────────────────────────────────── */}
          <Banda
            nombre="Mesociclo"
            semanas={n}
            tramos={contenido.mesociclos.map((m) => {
              const t = tipoMesocicloDe(m.tipoId);
              return {
                id: m.id,
                nombre: t === null ? m.nombre : `${m.nombre} · ${t.codigo}`,
                // El código del tipo se añade solo para mostrar; editar tiene
                // que partir del nombre crudo o el código se duplicaría cada
                // vez que se guarda.
                nombreEdicion: m.nombre,
                semanas: m.semanas,
                color: m.color,
              };
            })}
            editandoId={editando?.tipo === "tramo" ? editando.id : null}
            onEmpezarRenombrar={(id) => setEditando({ tipo: "tramo", id })}
            onRenombrar={(id, valor) => {
              setEditando(null);
              aplicar(renombrarMesociclo(contenido, id, valor));
            }}
            onRedimensionar={(id, semanas) => aplicar(redimensionarMesociclo(contenido, id, semanas))}
            medirAnchoCelda={medirAnchoCelda}
          />

          {/* ── SEMANAS ────────────────────────────────────────────────── */}
          <div className="flex sticky top-0 z-30 bg-[#0f1115]">
            <div
              className={`${etiqueta} z-40 text-[11px] uppercase tracking-wider text-white/35`}
              style={{ ...anchoEtiqueta, ...alto }}
            >
              Semana
            </div>
            {Array.from({ length: n }, (_, s) => (
              <div
                key={s}
                // `data-celda-muestra` en la primera: es de donde se mide el
                // ancho real de una columna al arrastrar un borde de tramo.
                {...(s === 0 ? { "data-celda-muestra": true } : {})}
                className={`${celda} justify-center tabular-nums font-semibold text-white/55`}
                style={{ ...anchoCelda, ...alto }}
              >
                {s + 1}
              </div>
            ))}
          </div>

          {/* ── FECHAS · derivadas ─────────────────────────────────────── */}
          {rangos.length > 0 ? (
            <div className="flex">
              <div className={etiqueta} style={{ ...anchoEtiqueta, ...alto }}>
                Fechas
              </div>
              {rangos.map((r) => (
                <div
                  key={r.semana}
                  className={`${celda} justify-center tabular-nums text-white/45`}
                  style={{ ...anchoCelda, ...alto }}
                >
                  {etiquetaDeRango(r)}
                </div>
              ))}
            </div>
          ) : null}

          {/* ── TIPO DE MICROCICLO ─────────────────────────────────────── */}
          <div className="flex">
            <div className={etiqueta} style={{ ...anchoEtiqueta, ...alto }}>
              Tipo de microciclo
            </div>
            {Array.from({ length: n }, (_, s) => {
              const actual = contenido.semanas[s]?.tipoMicrociclo ?? null;
              const t = tipoMicrocicloDe(actual);
              return (
                <button
                  key={s}
                  type="button"
                  className={`${celda} cursor-pointer justify-center text-[11px] font-bold transition-colors hover:brightness-125`}
                  style={{
                    ...anchoCelda,
                    ...alto,
                    backgroundColor: t === null ? undefined : `${t.color}26`,
                    color: t === null ? undefined : t.color,
                  }}
                  title={
                    t === null
                      ? "Sin tipo. Pulsa para recorrer el catálogo."
                      : `${t.nombre} — ${t.descripcion} (Forteza 2009, p. ${t.pagina})`
                  }
                  onClick={() => {
                    // Se recorre el catálogo en vez de abrir un desplegable:
                    // son cinco valores y se asignan de corrido a lo largo de
                    // cincuenta semanas.
                    const i = TIPOS_MICROCICLO.findIndex((x) => x.id === actual);
                    const siguiente =
                      i === TIPOS_MICROCICLO.length - 1 ? null : TIPOS_MICROCICLO[i + 1].id;
                    aplicar(escribirSemana(contenido, s, { tipoMicrociclo: siguiente }));
                  }}
                >
                  {t?.codigo ?? <span className="text-white/15">·</span>}
                </button>
              );
            })}
          </div>

          {/* ── SESIONES, HORAS Y DÍAS ─────────────────────────────────── */}
          {CAMPOS_SEMANA.map((c) => (
            <FilaSemana
              key={c.campo}
              campo={c.campo}
              etiqueta={c.etiqueta}
              semanas={n}
              contenido={contenido}
              editando={editando}
              setEditando={setEditando}
              aplicar={aplicar}
            />
          ))}

          {/* ── COMPETENCIAS ───────────────────────────────────────────── */}
          <div className="flex">
            <div className={etiqueta} style={{ ...anchoEtiqueta, ...alto }}>
              Competencias
            </div>
            {Array.from({ length: n }, (_, s) => {
              const lista = competencias.get(s) ?? [];
              const activa = editando?.tipo === "competencia" && editando.semana === s;
              return (
                <div
                  key={s}
                  className={`${celda} cursor-text gap-1 hover:bg-white/[0.04]`}
                  style={{ ...anchoCelda, ...alto }}
                  onClick={() => setEditando({ tipo: "competencia", semana: s })}
                >
                  {activa ? (
                    <input
                      autoFocus
                      placeholder="Nombre…"
                      className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
                      onBlur={(e) => {
                        setEditando(null);
                        const nombre = e.target.value.trim();
                        if (nombre === "") return;
                        aplicar(
                          escribirCompetencia(contenido, {
                            semana: s,
                            nombre,
                            categoria: "preparatoria",
                            ambito: "",
                          }),
                        );
                      }}
                      onKeyDown={(e) => {
                        if (e.key === "Enter") e.currentTarget.blur();
                        if (e.key === "Escape") {
                          e.currentTarget.value = "";
                          e.currentTarget.blur();
                        }
                      }}
                    />
                  ) : (
                    lista.map((c) => {
                      const cat = categoriaCompetenciaDe(c.categoria);
                      return (
                        <button
                          key={c.id}
                          type="button"
                          className="truncate rounded px-1 text-[10px] font-bold"
                          style={{
                            backgroundColor: `${cat?.color ?? "#64748b"}33`,
                            color: cat?.color ?? "#94a3b8",
                          }}
                          title={`${c.nombre} — ${cat?.nombre ?? "sin categoría"}. Clic: cambia de categoría. Alt+clic: borra.`}
                          onClick={(e) => {
                            e.stopPropagation();
                            if (e.altKey) {
                              aplicar(borrarCompetencia(contenido, c.id));
                              return;
                            }
                            const i = CATEGORIAS_COMPETENCIA.findIndex(
                              (x) => x.id === c.categoria,
                            );
                            const sig =
                              CATEGORIAS_COMPETENCIA[(i + 1) % CATEGORIAS_COMPETENCIA.length];
                            aplicar(escribirCompetencia(contenido, { ...c, categoria: sig.id }));
                          }}
                        >
                          {cat?.codigo ?? "?"} {c.nombre}
                        </button>
                      );
                    })
                  )}
                </div>
              );
            })}
          </div>

          {/* ── FILAS DE PLANIFICACIÓN, AGRUPADAS ──────────────────────── */}
          {contenido.filas.map((f, i) => {
            const grupoPrevio = i === 0 ? undefined : contenido.filas[i - 1].grupo;
            const abre = f.grupo !== null && f.grupo !== grupoPrevio;
            const g = GRUPOS_CAPACIDADES.find((x) => x.id === f.grupo);

            return (
              <div key={f.id}>
                {abre ? (
                  <div className="flex">
                    <div
                      className={`${etiqueta} text-[10px] font-bold uppercase tracking-[0.14em]`}
                      style={{
                        ...anchoEtiqueta,
                        height: "calc(1.5rem * var(--z))",
                        color: g?.color ?? "#94a3b8",
                      }}
                    >
                      {g?.nombre ?? f.grupo}
                    </div>
                    <div
                      className="shrink-0 border-b border-white/[0.07]"
                      style={{
                        width: `calc(var(--ancho-celda) * ${n})`,
                        height: "calc(1.5rem * var(--z))",
                        backgroundColor: `${g?.color ?? "#64748b"}0f`,
                      }}
                    />
                  </div>
                ) : null}

                <div className="flex">
                  <div
                    className={`${etiqueta} gap-1.5`}
                    style={{ ...anchoEtiqueta, ...alto }}
                    title={f.nombre}
                  >
                    {/* El punto mete y saca la fila de la curva. Va pegado a su
                        nombre porque es lo que hace: decidir si ESTA fila se
                        dibuja. Un panel aparte obligaría a recordar cuál se
                        estaba configurando. */}
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const activandola = f.grafico === null;
                        const noEsNumerica = f.tipo !== "numero" && f.tipo !== "porcentaje";
                        // Una «X» o un texto no se leen como número: activar
                        // la curva sobre esa fila dibujaba un punto vacío que
                        // el clic parecía no haber hecho nada. Se convierte el
                        // TIPO (nunca los valores ya escritos) para que la
                        // curva tenga algo que leer en cuanto se escriba un
                        // número encima.
                        const base =
                          activandola && noEsNumerica ? cambiarTipoFila(contenido, f.id, "numero") : contenido;
                        if (activandola && noEsNumerica) {
                          toast.info(
                            `«${f.nombre}» pasa a fila numérica para poder dibujarla. Las marcas ya escritas no cuentan hasta que se reemplacen por números.`,
                          );
                        }
                        aplicar(alternarGrafico(base, f.id));
                      }}
                      aria-label={
                        f.grafico === null
                          ? `Dibujar ${f.nombre} en la curva`
                          : `Quitar ${f.nombre} de la curva`
                      }
                      title={f.grafico === null ? "Dibujar en la curva" : "Quitar de la curva"}
                      className="h-2.5 w-2.5 shrink-0 rounded-full border transition-colors"
                      style={
                        f.grafico === null
                          ? { borderColor: "rgba(255,255,255,0.2)" }
                          : { backgroundColor: f.grafico, borderColor: f.grafico }
                      }
                    />
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        const i = CICLO_TIPO_FILA.indexOf(f.tipo);
                        const siguiente = CICLO_TIPO_FILA[(i + 1) % CICLO_TIPO_FILA.length];
                        aplicar(cambiarTipoFila(contenido, f.id, siguiente));
                      }}
                      title={`Tipo: ${f.tipo}. Clic para cambiarlo. Los valores ya escritos no se convierten.`}
                      className="shrink-0 rounded px-1 text-[9px] font-bold text-white/25 transition-colors hover:bg-white/10 hover:text-white/70"
                    >
                      {ETIQUETA_TIPO_FILA[f.tipo]}
                    </button>
                    <span className="truncate" style={f.grupo !== null ? { paddingLeft: 6 } : undefined}>
                      {f.nombre}
                      {f.unidad !== "" ? (
                        <span className="ml-1 font-normal text-white/30">({f.unidad})</span>
                      ) : null}
                    </span>
                  </div>

                  {f.valores.map((v, s) => {
                    const activa =
                      editando?.tipo === "celda" &&
                      editando.filaId === f.id &&
                      editando.semana === s;
                    const meso = mesocicloDeSemana(contenido.mesociclos, s);

                    // Una fila de marca no abre campo: se recorre pulsando,
                    // porque escribir «X» a mano en cincuenta semanas es
                    // exactamente el trabajo que la rejilla debe ahorrar.
                    if (f.tipo === "marca") {
                      return (
                        <button
                          key={s}
                          type="button"
                          className={`${celda} cursor-pointer justify-center font-bold hover:bg-white/[0.06]`}
                          style={{
                            ...anchoCelda,
                            ...alto,
                            backgroundColor: meso === null ? undefined : `${meso.color}0d`,
                          }}
                          onClick={() => {
                            const i2 = CICLO_MARCA.indexOf(
                              (v ?? "") as (typeof CICLO_MARCA)[number],
                            );
                            const sig = CICLO_MARCA[(i2 + 1) % CICLO_MARCA.length];
                            aplicar(escribirCelda(contenido, f.id, s, sig));
                          }}
                        >
                          <span className={v === null ? "text-white/10" : "text-white/85"}>
                            {v ?? "·"}
                          </span>
                        </button>
                      );
                    }

                    return (
                      <div
                        key={s}
                        className={`${celda} cursor-text hover:bg-white/[0.04]`}
                        style={{
                          ...anchoCelda,
                          ...alto,
                          backgroundColor: meso === null ? undefined : `${meso.color}0d`,
                        }}
                        onClick={() => setEditando({ tipo: "celda", filaId: f.id, semana: s })}
                      >
                        {activa ? (
                          <input
                            autoFocus
                            defaultValue={v ?? ""}
                            inputMode={f.tipo === "texto" ? "text" : "decimal"}
                            className="w-full bg-transparent text-white outline-none"
                            onBlur={(e) => {
                              setEditando(null);
                              if ((v ?? "") !== e.target.value) {
                                aplicar(escribirCelda(contenido, f.id, s, e.target.value));
                              }
                            }}
                            onKeyDown={(e) => {
                              if (e.key === "Enter") e.currentTarget.blur();
                              if (e.key === "Escape") {
                                e.currentTarget.value = v ?? "";
                                e.currentTarget.blur();
                              }
                            }}
                          />
                        ) : (
                          <span className={v === null ? "text-white/20" : "text-white/85"}>
                            {v ?? "—"}
                          </span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </div>
            );
          })}

          {/* ── CALENDARIO ─────────────────────────────────────────────── */}
          <div className="flex">
            <div
              className={`${etiqueta} text-[10px] font-bold uppercase tracking-[0.14em] text-white/30`}
              style={{ ...anchoEtiqueta, height: "calc(1.5rem * var(--z))" }}
            >
              Calendario
            </div>
            <div
              className="shrink-0 border-b border-white/[0.07] bg-white/[0.02]"
              style={{
                width: `calc(var(--ancho-celda) * ${n})`,
                height: "calc(1.5rem * var(--z))",
              }}
            />
          </div>

          {DIAS_SEMANA.map((nombreDia, d) => (
            <div key={d} className="flex">
              <div className={etiqueta} style={{ ...anchoEtiqueta, ...alto }}>
                {nombreDia}
              </div>
              {Array.from({ length: n }, (_, s) => {
                const dia = dias.get(claveDia(s, d));
                const activa = editando?.tipo === "dia" && editando.dia === d && editando.semana === s;
                const meso = mesocicloDeSemana(contenido.mesociclos, s);
                // La etiqueta manda sobre el nombre de la sesión, igual que en
                // el Excel. Dos lecturas del mismo día serían dos documentos
                // que se contradicen.
                const texto =
                  dia?.etiqueta ??
                  (dia?.plantillaId != null ? (nombrePlantilla.get(dia.plantillaId) ?? null) : null);

                return (
                  <div
                    key={s}
                    className={`${celda} cursor-text hover:bg-white/[0.04]`}
                    style={{
                      ...anchoCelda,
                      ...alto,
                      backgroundColor: meso === null ? undefined : `${meso.color}0d`,
                    }}
                    onClick={() => setEditando({ tipo: "dia", dia: d, semana: s })}
                  >
                    {activa ? (
                      <input
                        autoFocus
                        defaultValue={dia?.etiqueta ?? ""}
                        placeholder="Descanso, partido…"
                        className="w-full bg-transparent text-white outline-none placeholder:text-white/20"
                        onBlur={(e) => {
                          setEditando(null);
                          const valor = e.target.value.trim();
                          if ((dia?.etiqueta ?? "") !== valor) {
                            aplicar(
                              escribirDia(contenido, s, d, { etiqueta: valor === "" ? null : valor }),
                            );
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === "Escape") e.currentTarget.blur();
                        }}
                      />
                    ) : (
                      <span
                        className={
                          dia?.plantillaId != null && dia.etiqueta === null
                            ? "truncate text-orange-200/80"
                            : "truncate text-white/70"
                        }
                      >
                        {texto ?? ""}
                      </span>
                    )}
                  </div>
                );
              })}
            </div>
          ))}

          {/* ── LA CURVA, DENTRO DE LA REJILLA ─────────────────────────────
              Comparte `--ancho-celda` con la tabla, así que el pico de la
              semana 14 cae bajo la columna 14 y se desplaza y se acerca con
              ella. Un gráfico aparte obligaría a contar columnas con el dedo. */}
          <div className="border-t border-white/[0.08]">
            <CurvaCarga filas={contenido.filas} semanas={n} />
          </div>
        </div>
      </div>

      <LeyendaCurva filas={contenido.filas} />

      <p className="border-t border-white/[0.08] px-4 py-2 text-[11px] leading-relaxed text-white/30">
        Ctrl + rueda para acercar · Alt + arrastrar o botón central para desplazar · clic en una
        celda para escribir · en «Tipo de microciclo» y en las capacidades, cada clic recorre los
        valores · en Periodo, Etapa y Mesociclo, clic en el nombre para renombrar y arrastra su
        borde derecho para ampliar o reducir la semana · el botón «+M» de un periodo siembra un
        modelo de periodización solo en ese tramo, así que dos periodos pueden llevar modelos
        distintos · el pequeño «123»/«X=»/«%»/«Abc» junto a cada fila cambia cómo se lee, sin tocar
        lo ya escrito · meses y fechas se calculan de la fecha de inicio y no se editan.
      </p>
    </div>
  );
}
