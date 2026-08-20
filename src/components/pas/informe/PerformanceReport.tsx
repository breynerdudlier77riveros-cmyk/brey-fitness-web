import { Card, CardContent } from "@/components/brand/Card";
import type { InformeHumano } from "@/lib/pas/informe-humano";

import AthleteSummary from "./AthleteSummary";
import GoalCard from "./GoalCard";
import PerformanceProfile from "./PerformanceProfile";
import ResultCard from "./ResultCard";
import TechnicalDetails from "./TechnicalDetails";

// ── Performance Assessment · informe del atleta (Sprint PAS-8) ─────────────
//
// LA JERARQUÍA ES EL PRODUCTO. El orden responde primero «¿cómo estoy?» y solo
// después «¿por qué?»:
//
//   atleta → resumen → objetivos → resultados → BREY AI → detalles
//
// La primera pantalla NO empieza por metodología. Un informe que abre con la
// calidad de la evidencia obliga a entender el sistema antes de entender el
// propio cuerpo, y eso invierte el orden de las preguntas.
//
// COMPONE. No calcula, no interpreta y no redacta: el texto viene del NIE, de
// la NKB o de la capa humana. Sin estado, sin interactividad, sin `"use client"`
// — salvo el `<details>` nativo, que gestiona el navegador.
//
// Móvil: una columna. Los resultados apilan y el resumen conserva su jerarquía;
// dos columnas de tarjeta densa en un teléfono son dos columnas ilegibles.

interface Props {
  informe: InformeHumano;
}

export default function PerformanceReport({ informe }: Props) {
  const { atleta, resultados, dominios, panelObjetivos, advertencias } = informe;

  // Ya viene clasificado desde la capa humana (§9). Antes se recalculaba aquí
  // con un `filter`, y esa segunda definición de «objetivo sin medición» podía
  // divergir de la del resumen sin que nada avisara.
  const objetivosSueltos = panelObjetivos.sinDatos;

  return (
    <article className="pas8-informe space-y-10" aria-label="Performance Assessment">
      {/* ── Atleta ─────────────────────────────────────────────────────── */}
      <header data-seccion="portada" className="space-y-1">
        <p className="text-[11px] uppercase tracking-[0.18em] text-white/40">
          Performance Assessment
        </p>
        <h1 className="text-2xl font-semibold text-white sm:text-3xl">{atleta.nombre}</h1>
        <p className="text-sm text-white/50">
          {[atleta.edad === null ? null : `${atleta.edad} años`, atleta.sexo, informe.fecha]
            .filter(Boolean)
            .join(" · ")}
        </p>
      </header>

      {/* ── Cabecera: qué se midió y qué falta (§22) ────────────────────── */}
      <AthleteSummary resumen={informe.resumen} />

      {/* ── Perfil por dominios (PAS-10F) ──────────────────────────────────
          Sustituye a la rejilla anterior, que solo contaba mediciones. Esta
          dice, prueba por prueba, qué puede concluirse en cada uno de los tres
          ejes — que es lo que un profesional necesita ver de un vistazo. */}
      <PerformanceProfile dominios={dominios} />

      {dominios.length > 0 ? (
        <p className="-mt-6 text-sm text-white/50">{informe.estadoGeneral}</p>
      ) : null}

      {/* ── Objetivos sin medición (§23) ───────────────────────────────── */}
      {objetivosSueltos.length > 0 ? (
        <section data-seccion="objetivos" aria-label="Objetivos activos">
          <h2 className="mb-3 text-[11px] uppercase tracking-wider text-white/40">Objetivos</h2>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {objetivosSueltos.map((o) => (
              <GoalCard key={o.id} objetivo={o} />
            ))}
          </div>
        </section>
      ) : null}

      {/* ── Objetivos pausados y cumplidos (§9) ────────────────────────────
          Van juntos y en segundo plano: no describen esta evaluación, pero
          esconderlos haría desaparecer del informe trabajo que sí ocurrió. */}
      {panelObjetivos.pausados.length > 0 || panelObjetivos.alcanzados.length > 0 ? (
        <section data-seccion="objetivos-historicos" aria-label="Otros objetivos">
          <h2 className="mb-3 text-[11px] uppercase tracking-wider text-white/40">
            Otros objetivos
          </h2>
          <ul className="space-y-1.5">
            {panelObjetivos.alcanzados.map((o) => (
              <li
                key={o.id}
                data-objetivo-estado="cumplido"
                className="border-l-2 border-white/15 pl-3 text-sm text-white/55"
              >
                {o.nombre} · marcado como cumplido
              </li>
            ))}
            {panelObjetivos.pausados.map((o) => (
              <li
                key={o.id}
                data-objetivo-estado="pausado"
                className="border-l-2 border-white/10 pl-3 text-sm text-white/40"
              >
                {o.nombre} · en pausa
              </li>
            ))}
          </ul>
        </section>
      ) : null}

      {/* ── Resultados ─────────────────────────────────────────────────── */}
      <section data-seccion="resultados" aria-label="Resultados">
        <h2 className="mb-3 text-[11px] uppercase tracking-wider text-white/40">Resultados</h2>

        {resultados.length === 0 ? (
          <p className="text-sm text-white/50">
            Esta evaluación todavía no tiene mediciones registradas.
          </p>
        ) : (
          <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2">
            {resultados.map((r, i) => (
              <div key={`${r.pruebaId}-${r.detalles.normaId ?? i}`} className="space-y-2">
                <ResultCard resultado={r} />
                <TechnicalDetails detalles={r.detalles} />
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ── BREY AI · contrato, todavía sin implementar ─────────────────── */}
      <section data-seccion="brey-ai" aria-label="Análisis BREY AI">
        <h2 className="mb-3 text-[11px] uppercase tracking-wider text-white/40">
          Análisis BREY AI
        </h2>
        <Card className="pas8-brey-ai border-white/5 bg-white/[0.02]">
          <CardContent className="p-5">
            <p className="text-sm leading-relaxed text-white/45">
              El análisis personalizado estará disponible cuando la capa de interpretación esté
              habilitada. Cuando llegue, explicará estos mismos resultados: no calculará ninguno.
            </p>
          </CardContent>
        </Card>
      </section>

      {/* ── Advertencias del conjunto ──────────────────────────────────── */}
      {advertencias.length > 0 ? (
        <section data-seccion="advertencias" aria-label="Advertencias">
          <h2 className="mb-3 text-[11px] uppercase tracking-wider text-white/40">
            Advertencias
          </h2>
          <ul className="space-y-1.5">
            {advertencias.map((a) => (
              <li
                key={a}
                className="border-l-2 border-white/20 pl-3 text-sm leading-relaxed text-white/60"
              >
                {a}
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </article>
  );
}
