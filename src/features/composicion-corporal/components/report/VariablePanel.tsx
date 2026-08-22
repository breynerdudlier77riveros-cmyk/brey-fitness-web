"use client";

import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/brand/Dialog";
import LineChart from "./LineChart";
import ProcedenciaBadge from "@/features/composicion-corporal/components/ProcedenciaBadge";
import NormPosition from "./NormPosition";
import { formatearValor } from "./formato";
import { significadoDe } from "@/lib/bcs/significados";
import type { FilaVariable, SerieTendencia } from "@/lib/bcs/reporte";

// ── Panel de variable, en diálogo (Sprint BCS-9.0) ─────────────────────────
//
// Sustituye al `<details>` que se desplegaba dentro de la propia tarjeta.
//
// EL MOTIVO NO ES ESTÉTICO. Nueve tarjetas en una rejilla de tres columnas,
// cada una capaz de crecer cuatro párrafos al abrirse, empujaban a las otras
// dos de su fila y descolocaban todo lo de abajo. En un móvil, además, el
// texto quedaba dentro de una columna de la rejilla, es decir en una tira.
//
// Un diálogo saca el contenido del flujo: la rejilla no se mueve, el panel
// tiene el ancho de la pantalla y el texto se lee a un ancho normal. Es la
// misma solución que usa el analizador del que salió la petición.
//
// Client Component, y es el único del informe: necesita estado para abrir y
// cerrar. Todo lo que muestra llega ya resuelto en props — aquí no se calcula
// ni se redacta nada.
//
// El diálogo de `brand/Dialog` ya gestiona foco, Escape, clic fuera y
// `aria-modal`. No se reimplementa nada de eso.
//
// EN PAPEL NO EXISTE. Un diálogo cerrado no se imprime, y forzarlo abierto
// imprimiría los nueve encima del documento. La versión imprimible de esta
// información es la lista completa de variables, que sigue usando `<details>`
// y sí se despliega al imprimir (ver globals.css).

interface Props {
  fila: FilaVariable;
  serie?: SerieTendencia;
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <section>
      <h3 className="mb-1.5 text-[10px] font-bold uppercase tracking-[0.14em] text-white/40">
        {titulo}
      </h3>
      {children}
    </section>
  );
}

export default function VariablePanel({ fila, serie }: Props) {
  const [abierto, setAbierto] = useState(false);
  const info = significadoDe(fila.id);

  const haySerie = serie !== undefined && serie.puntos.length >= 2;
  if (info === null && !haySerie && fila.bloqueoClasificacion === null) return null;

  return (
    <>
      <button
        type="button"
        onClick={() => setAbierto(true)}
        aria-haspopup="dialog"
        className="mt-1 cursor-pointer text-[11px] font-semibold text-orange-400/80 transition-colors hover:text-orange-300"
      >
        Ver detalle
      </button>

      <Dialog open={abierto} onOpenChange={setAbierto}>
        <DialogContent className="max-h-[85vh] overflow-y-auto sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
              <span>{fila.etiqueta}</span>
              <span className="text-2xl font-black tabular-nums text-white">
                {formatearValor(fila.valor, fila.unidad)}
              </span>
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-5 pt-1">
            {info ? (
              <Bloque titulo="Qué es">
                <p className="text-sm leading-relaxed text-white/70">{info.significado}</p>
              </Bloque>
            ) : null}

            {/* Tu propia serie, antes que cualquier lectura poblacional: mismo
                cuerpo, mismo aparato, mismo protocolo es la comparación que
                siempre se sostiene. */}
            {haySerie ? (
              <Bloque titulo="Cómo ha ido">
                <LineChart puntos={serie.puntos} unidad={fila.unidad} etiqueta={fila.etiqueta} />
              </Bloque>
            ) : null}

            {info ? (
              <Bloque titulo="Cómo se lee">
                <p className="text-sm leading-relaxed text-white/70">{info.lectura}</p>
              </Bloque>
            ) : null}

            {fila.posicionNormativa ? (
              <Bloque titulo="Dónde cae, comparado con población">
                <NormPosition
                  posicion={fila.posicionNormativa}
                  valor={fila.valor}
                  unidad={fila.unidad}
                />
              </Bloque>
            ) : null}

            {fila.clasificacion ? (
              <Bloque titulo="Dónde cae">
                <p className="text-sm leading-relaxed text-white/80">{fila.clasificacion.texto}</p>
              </Bloque>
            ) : null}

            {fila.bloqueoClasificacion ? (
              <Bloque titulo="Por qué no lleva una etiqueta">
                <p className="text-sm leading-relaxed text-white/60">
                  {fila.bloqueoClasificacion}
                </p>
              </Bloque>
            ) : null}

            {info ? (
              <Bloque titulo="Qué no dice">
                <p className="text-sm leading-relaxed text-white/55">{info.limite}</p>
              </Bloque>
            ) : null}

            <p className="flex items-center gap-2 border-t border-white/[0.06] pt-3 text-[11px] text-white/35">
              De dónde sale este número: <ProcedenciaBadge procedencia={fila.procedencia} />
            </p>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
}
