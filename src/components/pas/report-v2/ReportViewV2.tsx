import type { InformeNormativoV2 } from "@/lib/pas/report-v2";

import NormativeCard from "./NormativeCard";
import SummaryMetric from "./SummaryMetric";
import UnavailableNorm from "./UnavailableNorm";
import WarningBlock from "./WarningBlock";

// ── Performance Clinical Report v2 · ensamblador (PRS v2.0) ────────────────
//
// COMPONE. Recibe el modelo ya resuelto y lo coloca. No calcula, no interpreta
// y no redacta: todo el texto viene del NIE, de la NKB o del modelo de vista.
//
// Es el noveno fichero de la carpeta, y los ocho que pedía el encargo son los
// que hacen el trabajo. Este solo los ordena — sin él, los ocho componentes no
// formarían un informe, y no habría dónde comprobar el orden, la rejilla ni la
// paginación de impresión.
//
// Rejilla: dos columnas desde `md`, una sola en móvil. Las tarjetas normativas
// pueden ser altas, así que la rejilla las alinea arriba y no las estira.
//
// Sin estado, sin interactividad, sin `"use client"`: es un documento.

interface Props {
  informe: InformeNormativoV2;
}

export default function ReportViewV2({ informe }: Props) {
  const { portada, resumen, tarjetas, comparabilidad, sinNorma, advertencias } = informe;

  return (
    <article
      className="reporte-prs2-print space-y-8"
      aria-label="Informe clínico de perfil normativo"
    >
      {/* ── 0 · Portada ───────────────────────────────────────────────── */}
      <header data-seccion-v2="portada" className="prs2-portada space-y-1">
        <h1 className="text-2xl font-semibold text-white">{portada.atleta}</h1>
        <p className="text-sm text-white/50">
          {[
            portada.edad === null ? null : `${portada.edad} años`,
            portada.sexo,
            portada.fecha,
          ]
            .filter(Boolean)
            .join(" · ")}
        </p>
        {portada.profesional ? (
          <p className="text-sm text-white/50">{portada.profesional}</p>
        ) : null}
        <p className="text-[11px] uppercase tracking-wider text-white/35">
          Informe {portada.codigo}
        </p>
        <p className="prs2-estado-cientifico pt-2 text-sm text-white/60">
          {portada.estadoCientifico}
        </p>
      </header>

      {/* ── 1 · Resumen ejecutivo ─────────────────────────────────────── */}
      <section data-seccion-v2="resumen" aria-label="Resumen ejecutivo">
        <h2 className="mb-3 text-[11px] uppercase tracking-wider text-white/40">
          Resumen ejecutivo
        </h2>
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {resumen.map((t) => (
            <SummaryMetric key={t.id} tarjeta={t} />
          ))}
        </div>
      </section>

      {/* ── 2 · Perfil normativo ──────────────────────────────────────── */}
      <section data-seccion-v2="perfil" aria-label="Perfil normativo">
        <h2 className="mb-3 text-[11px] uppercase tracking-wider text-white/40">
          Perfil normativo
        </h2>
        {tarjetas.length === 0 ? (
          <p className="text-sm text-white/50">
            Ninguna medición de este informe dispone de una norma comparable.
          </p>
        ) : (
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            {tarjetas.map((t) => (
              <NormativeCard
                key={t.normaId}
                tarjeta={t}
                panel={comparabilidad[t.registroId]}
              />
            ))}
          </div>
        )}
      </section>

      {/* ── 7 · Capacidades sin norma ─────────────────────────────────── */}
      {sinNorma.length > 0 ? (
        <section data-seccion-v2="sin-norma" aria-label="Capacidades sin norma admisible">
          <h2 className="mb-3 text-[11px] uppercase tracking-wider text-white/40">
            Sin norma admisible
          </h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {sinNorma.map((t) => (
              <UnavailableNorm key={t.id} tarjeta={t} />
            ))}
          </div>
        </section>
      ) : null}

      {/* ── 6 · Advertencias del conjunto ─────────────────────────────── */}
      <section data-seccion-v2="advertencias-globales">
        <WarningBlock advertencias={advertencias} titulo="Advertencias del conjunto" />
      </section>
    </article>
  );
}
