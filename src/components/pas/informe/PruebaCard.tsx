import { lecturaLlanaDe } from "@/lib/pas/informe-humano";
import type { ResultadoHumano } from "@/lib/pas/informe-humano";

// ── Recuadro compacto de una prueba (Sprint PAS-16) ────────────────────────
//
// LA VISTA DE RESUMEN, CALCADA DEL BCS.
//
//   `ResultCard` es una tarjeta completa: valor, posición, evolución, objetivo
//   y su detalle técnico plegado debajo. Once de ellas en rejilla son un muro
//   —y era la queja— porque cada una pide leerse entera antes de pasar a la
//   siguiente.
//
//   Este recuadro contesta solo lo que se mira de un vistazo: qué prueba, qué
//   valor y dónde cae. Lo demás vive en la pestaña «Informe completo», que es
//   la que se guarda en PDF.
//
// ── LO QUE NO HACE ────────────────────────────────────────────────────────
//
//   No inventa la lectura corta. `lecturaLlanaDe` es el mismo dueño que usa la
//   tarjeta completa: si dijeran cosas distintas, el resumen y el informe
//   serían dos documentos que se contradicen.
//
//   Y cuando no hay lectura, lo dice en vez de dejar el hueco. Una tarjeta con
//   un número y nada debajo se lee como «esto está bien», que es justo lo que
//   el sistema no afirma.
//
// Componente de servidor.

interface Props {
  resultado: ResultadoHumano;
}

/** Coma decimal, sin decimales inútiles. */
const num = (v: number): string =>
  (Number.isInteger(v) ? String(v) : v.toFixed(1)).replace(".", ",");

export default function PruebaCard({ resultado: r }: Props) {
  const llano = lecturaLlanaDe(r);

  return (
    <article
      data-prueba={r.pruebaId}
      className="pas16-recuadro flex flex-col rounded-xl border border-white/[0.08] bg-white/[0.02] p-4"
    >
      <p className="text-[11px] font-semibold uppercase tracking-wider text-white/45">
        {r.nombre}
      </p>
      {r.dominio ? <p className="text-[10px] text-white/25">{r.dominio}</p> : null}

      <p className="mt-3 text-3xl font-semibold leading-none tabular-nums text-white">
        {num(r.valorObservado)}
        <span className="ml-1.5 text-base font-normal text-white/45">{r.unidad}</span>
      </p>

      <div className="mt-3 border-t border-white/[0.06] pt-3">
        {llano !== null ? (
          <p className="text-[12px] leading-relaxed text-white/65">{llano.texto}</p>
        ) : (
          // El hueco se nombra. Una tarjeta con un número y nada debajo se lee
          // como una aprobación, y el sistema no aprueba nada.
          <p className="text-[12px] leading-relaxed text-white/35">
            Sin posición: no hay una referencia comparable para esta prueba con este perfil.
          </p>
        )}
      </div>

      {r.tendencia.disponible && r.tendencia.cambioAbsoluto !== null ? (
        <p className="mt-2 text-[11px] tabular-nums text-white/45">
          {r.tendencia.cambioAbsoluto > 0 ? "+" : ""}
          {num(r.tendencia.cambioAbsoluto)} {r.unidad}
          <span className="ml-1.5 text-white/25">desde {r.tendencia.fechaAnterior}</span>
        </p>
      ) : null}
    </article>
  );
}
