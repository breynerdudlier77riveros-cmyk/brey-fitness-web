"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import Button from "@/components/brand/Button";
import Select from "@/components/brand/Select";
import { toast } from "@/components/brand/Toast";
import { Copy, LinkIcon, Spinner, Trash } from "@/components/brand/icons";

import { crearEnlacePlantilla, revocarEnlacePlantilla } from "@/lib/plantillas/actions";
import type { EnlacePlantilla, Plantilla } from "@/lib/plantillas/tipos";

// ── Compartir ──────────────────────────────────────────────────────────────
//
// LAS DOS FORMAS SON LA MISMA MECÁNICA.
//
//   · Enlace GENÉRICO: uno por plantilla, para mandarlo a quien sea.
//   · Enlace por CLIENTE: uno por persona, y admite cargas propias encima de
//     la plantilla madre.
//
//   Por dentro son filas de la misma tabla: `cliente_id` nulo o puesto. Por
//   eso hay una sola ruta pública y una sola resolución de token — dos
//   mecanismos serían dos sitios donde equivocarse con la seguridad, y la
//   seguridad de un enlace anónimo no admite dos sitios.
//
// ── REGENERAR REVOCA, Y SE DICE ANTES ─────────────────────────────────────
//
//   Emitir un enlace nuevo mata el anterior. Es lo correcto —si se regenera
//   suele ser porque el viejo se filtró— pero es destructivo para quien lo
//   tenía guardado, así que se pregunta.
//
//   Lo que NO se pierde son los ajustes del cliente: rotar el token por
//   seguridad no debería costar volver a teclear sus cargas.
//
// ── SOLO SE COMPARTE LO PUBLICADO ─────────────────────────────────────────
//
//   En borrador no hay botón. Un borrador es material a medias, y un enlace
//   que apunta a él enseña una sesión incompleta como si fuera la definitiva.

interface Props {
  plantilla: Plantilla;
  enlaces: EnlacePlantilla[];
  clientes: readonly { id: string; nombre: string }[];
  baseUrl: string;
}

export default function CompartirPanel({ plantilla, enlaces, clientes, baseUrl }: Props) {
  const router = useRouter();
  const [ocupado, setOcupado] = useState<string | null>(null);
  const [clienteElegido, setClienteElegido] = useState("");

  const activos = enlaces.filter((e) => e.estado === "activo");
  const generico = activos.find((e) => e.cliente_id === null) ?? null;
  const porCliente = activos.filter((e) => e.cliente_id !== null);

  const nombreDe = (id: string): string =>
    clientes.find((c) => c.id === id)?.nombre ?? "Cliente";

  const urlDe = (token: string): string => `${baseUrl}/sesiones/${token}`;

  async function copiar(token: string) {
    try {
      await navigator.clipboard.writeText(urlDe(token));
      toast.success("Enlace copiado.");
    } catch {
      // Sin permiso de portapapeles (o sin HTTPS): no se finge que funcionó.
      toast.error("No se pudo copiar. Selecciona el enlace y cópialo a mano.");
    }
  }

  async function emitir(clienteId: string | null, etiqueta: string) {
    const clave = clienteId ?? "generico";
    if (ocupado) return;

    const existente = activos.find((e) => e.cliente_id === clienteId);
    if (existente && !window.confirm(`El enlace actual de ${etiqueta} dejará de funcionar.\n\n¿Generar uno nuevo?`)) {
      return;
    }

    setOcupado(clave);
    const resultado = await crearEnlacePlantilla(plantilla.id, clienteId);
    setOcupado(null);

    if (!resultado.ok) {
      toast.error(MENSAJE[resultado.error] ?? resultado.error);
      return;
    }
    toast.success("Enlace generado.");
    router.refresh();
  }

  async function revocar(enlace: EnlacePlantilla, etiqueta: string) {
    if (ocupado) return;
    if (!window.confirm(`El enlace de ${etiqueta} dejará de funcionar para siempre.\n\n¿Revocarlo?`)) {
      return;
    }

    setOcupado(enlace.id);
    const resultado = await revocarEnlacePlantilla(enlace.id);
    setOcupado(null);

    if (!resultado.ok) {
      toast.error(MENSAJE[resultado.error] ?? resultado.error);
      return;
    }
    toast.success("Enlace revocado.");
    router.refresh();
  }

  if (plantilla.estado !== "publicada") {
    return (
      <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
        <h2 className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
          Compartir
        </h2>
        <p className="text-[12px] leading-relaxed text-white/45">
          {plantilla.estado === "borrador"
            ? "Esta plantilla está en borrador. Publícala para poder generar enlaces: un borrador enseñaría una sesión a medias como si fuera la definitiva."
            : "Esta plantilla está archivada. Sus enlaces no resuelven mientras lo esté."}
        </p>
      </section>
    );
  }

  const sinAsignar = clientes.filter((c) => !porCliente.some((e) => e.cliente_id === c.id));

  return (
    <section className="rounded-2xl border border-white/[0.08] bg-white/[0.02] p-4">
      <h2 className="mb-3 text-[10px] font-bold uppercase tracking-[0.14em] text-white/35">
        Compartir
      </h2>

      {/* ── Enlace genérico ── */}
      <div className="mb-5">
        <p className="mb-1.5 text-xs font-semibold text-white/70">Enlace público</p>
        {generico ? (
          <FilaEnlace
            url={urlDe(generico.token)}
            ocupado={ocupado === "generico" || ocupado === generico.id}
            onCopiar={() => copiar(generico.token)}
            onRegenerar={() => emitir(null, "esta plantilla")}
            onRevocar={() => revocar(generico, "esta plantilla")}
          />
        ) : (
          <div className="flex flex-wrap items-center gap-3">
            <Button size="sm" onClick={() => emitir(null, "esta plantilla")} disabled={ocupado !== null}>
              {ocupado === "generico" ? (
                <Spinner className="h-3.5 w-3.5 animate-spin" strokeWidth={2.5} />
              ) : (
                <LinkIcon className="h-3.5 w-3.5" strokeWidth={2} />
              )}
              Generar enlace
            </Button>
            <p className="text-[11px] text-white/35">
              Cualquiera con el enlace verá la plantilla, en solo lectura.
            </p>
          </div>
        )}
      </div>

      {/* ── Enlaces por cliente ── */}
      <div className="border-t border-white/[0.06] pt-4">
        <p className="mb-1 text-xs font-semibold text-white/70">Asignada a un cliente</p>
        <p className="mb-3 text-[11px] leading-relaxed text-white/35">
          Cada cliente recibe su propio enlace y puede llevar cargas distintas sin tocar la
          plantilla madre. Lo que no ajustes sigue viniendo de ella, así que corregirla aquí llega
          a todos.
        </p>

        <div className="space-y-2">
          {porCliente.map((enlace) => (
            <div key={enlace.id}>
              <p className="mb-1 text-[11px] font-semibold text-white/55">
                {nombreDe(enlace.cliente_id!)}
                {Object.keys(enlace.ajustes).length > 0 && (
                  <span className="ml-2 font-normal text-white/30">
                    {Object.keys(enlace.ajustes).length} serie
                    {Object.keys(enlace.ajustes).length === 1 ? "" : "s"} ajustada
                    {Object.keys(enlace.ajustes).length === 1 ? "" : "s"}
                  </span>
                )}
              </p>
              <FilaEnlace
                url={urlDe(enlace.token)}
                ocupado={ocupado === enlace.id || ocupado === enlace.cliente_id}
                onCopiar={() => copiar(enlace.token)}
                onRegenerar={() => emitir(enlace.cliente_id, nombreDe(enlace.cliente_id!))}
                onRevocar={() => revocar(enlace, nombreDe(enlace.cliente_id!))}
              />
            </div>
          ))}
        </div>

        {clientes.length === 0 ? (
          <p className="mt-3 text-[11px] text-white/30">
            Todavía no tienes clientes registrados en Composición Corporal.
          </p>
        ) : sinAsignar.length > 0 ? (
          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Select
              value={clienteElegido}
              onValueChange={setClienteElegido}
              options={sinAsignar.map((c) => c.nombre)}
              placeholder="Elegir cliente"
              aria-label="Cliente al que asignar la plantilla"
              className="min-w-48"
            />
            <Button
              size="sm"
              variant="outline"
              disabled={clienteElegido === "" || ocupado !== null}
              onClick={() => {
                const cliente = sinAsignar.find((c) => c.nombre === clienteElegido);
                if (!cliente) return;
                void emitir(cliente.id, cliente.nombre);
                setClienteElegido("");
              }}
            >
              <LinkIcon className="h-3.5 w-3.5" strokeWidth={2} />
              Asignar
            </Button>
          </div>
        ) : null}
      </div>
    </section>
  );
}

function FilaEnlace({
  url,
  ocupado,
  onCopiar,
  onRegenerar,
  onRevocar,
}: {
  url: string;
  ocupado: boolean;
  onCopiar: () => void;
  onRegenerar: () => void;
  onRevocar: () => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {/* `readOnly` y no `disabled`: se tiene que poder seleccionar a mano
          cuando el portapapeles no está disponible. */}
      <input
        readOnly
        value={url}
        aria-label="Enlace público"
        onFocus={(e) => e.currentTarget.select()}
        className="min-w-0 flex-1 rounded-lg border border-white/[0.10] bg-slate-900 px-3 py-1.5 font-mono text-[11px] text-white/60 outline-none focus:border-orange-500/40"
      />
      <button
        type="button"
        onClick={onCopiar}
        aria-label="Copiar el enlace"
        title="Copiar"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-white/45 transition-colors hover:border-white/20 hover:text-white"
      >
        <Copy className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
      <button
        type="button"
        onClick={onRegenerar}
        disabled={ocupado}
        className="rounded-full border border-white/[0.08] px-2.5 py-1 text-[11px] font-semibold text-white/45 transition-colors hover:border-white/20 hover:text-white disabled:opacity-40"
      >
        {ocupado ? "…" : "Regenerar"}
      </button>
      <button
        type="button"
        onClick={onRevocar}
        disabled={ocupado}
        aria-label="Revocar el enlace"
        title="Revocar"
        className="flex h-8 w-8 items-center justify-center rounded-lg border border-white/[0.08] text-white/30 transition-colors hover:border-red-500/30 hover:text-red-400 disabled:opacity-40"
      >
        <Trash className="h-3.5 w-3.5" strokeWidth={2} />
      </button>
    </div>
  );
}

const MENSAJE: Record<string, string> = {
  NO_AUTENTICADO: "La sesión ha caducado.",
  PLANTILLA_NO_ENCONTRADA: "Esta plantilla ya no existe.",
  PLANTILLA_EN_BORRADOR: "Publica la plantilla antes de compartirla.",
  PLANTILLA_ARCHIVADA: "Esta plantilla está archivada.",
  ENLACE_NO_CREADO: "No se pudo generar el enlace.",
  ENLACE_NO_ENCONTRADO: "Ese enlace ya no existe.",
};
