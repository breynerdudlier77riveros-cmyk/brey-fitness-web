// ── Estructura del informe de composición corporal (Sprint BCS-7.0) ────────
//
// LO QUE ESTE FICHERO PROTEGE:
//
//   Que el informe siga teniendo UN apartado por pregunta.
//
//   Tenía catorce de primer nivel, y varios grupos contestaban lo mismo con
//   distinta forma: tres para «¿cómo está?», tres para «¿cómo cambió?» y cinco
//   para «¿qué significa?». Tres encabezados sobre los mismos datos no dan tres
//   respuestas: dan una respuesta troceada que el lector tiene que recomponer.
//
//   Volver a añadir una sección de primer nivel es fácil y se hace con buena
//   intención —«esto merece su propio apartado»—, así que el número va fijado
//   con una cifra que hay que cambiar a mano. Ese roce es el test.
//
// Y que NADA se haya perdido por el camino: los antiguos títulos siguen
// existiendo como rótulos internos, y se comprueba uno a uno.

import { describe, expect, it } from "vitest";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { analizarComposicionCorporal } from "@/lib/bcs/analysis";
import { generarRecomendaciones } from "@/lib/bcs/recommendations";
import { generarObservaciones } from "@/lib/bcs/observation";
import { generarEntregables } from "@/lib/bcs/copilot";
import { construirReporte, type ClienteDelReporte } from "@/lib/bcs/reporte";
import { sujetoDe } from "@/lib/bcs/identidad";
import type { Medicion } from "@/lib/bcs/tipos";

import { TooltipProvider } from "@/components/brand/Tooltip";

import ReportView from "../components/ReportView";

const HOY = "2026-08-20";

const CLIENTE: ClienteDelReporte = {
  id: "c1",
  nombre: "Ana Ruiz",
  estado: "activo",
  sexo: "F",
  fecha_nacimiento: "1994-03-10",
};

function medicion(over: Partial<Medicion> & { id: string; fecha: string }): Medicion {
  return {
    cliente_id: "c1",
    estado: "vigente",
    altura_cm: 165,
    peso_kg: null,
    imc: null,
    grasa_pct: null,
    masa_grasa_kg: null,
    masa_muscular_kg: null,
    masa_libre_grasa_kg: null,
    agua_total_l: null,
    agua_intracelular_l: null,
    agua_extracelular_l: null,
    proteina_kg: null,
    minerales_kg: null,
    masa_osea_kg: null,
    grasa_visceral_idx: null,
    angulo_fase_deg: null,
    bmr_kcal: null,
    edad_metabolica: null,
    smi: null,
    circ_cintura_cm: null,
    circ_cadera_cm: null,
    whr: null,
    impedancia_ohm: null,
    observaciones: null,
    foto_url: null,
    dispositivo: "InBody 270",
    ...over,
  };
}

/** Renderiza el informe completo pasando por todos los motores reales. */
function render(mediciones: Medicion[]): string {
  const desc = [...mediciones].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const reporte = construirReporte(CLIENTE, desc)!;
  const analisis = analizarComposicionCorporal(desc, { hoyISO: HOY, sujeto: sujetoDe(CLIENTE) });
  const recomendaciones = generarRecomendaciones(analisis);
  const observaciones = generarObservaciones({ analisis, recomendaciones });
  const copiloto = generarEntregables(
    { reporte, analisis, recomendaciones, observaciones, hoyISO: HOY },
    { explicacionPaciente: true },
  );

  // `TooltipProvider` porque los badges de procedencia usan Radix Tooltip, y
  // en la aplicación lo monta `app/layout.tsx`. Aquí se replica ese contexto
  // en vez de sustituir el badge por un doble: el informe se prueba tal como
  // se sirve, o no se está probando el informe.
  return renderToStaticMarkup(
    createElement(
      TooltipProvider,
      null,
      createElement(ReportView, {
        reporte,
        analisis,
        recomendaciones,
        observaciones,
        generadoEl: HOY,
        explicacionPaciente: copiloto.entregables[0] ?? null,
      }),
    ),
  );
}

const SERIE = [
  medicion({ id: "m1", fecha: "2026-04-01", peso_kg: 62, imc: 22.8, grasa_pct: 27.1, masa_muscular_kg: 24.1 }),
  medicion({ id: "m2", fecha: "2026-06-01", peso_kg: 63, imc: 23.1, grasa_pct: 26.4, masa_muscular_kg: 25.0 }),
  medicion({ id: "m3", fecha: "2026-08-01", peso_kg: 63.4, imc: 23.3, grasa_pct: 25.6, masa_muscular_kg: 25.8 }),
];

/** Los encabezados de primer nivel: los `CardTitle` de cada Section Card. */
const titulos = (html: string): string[] =>
  [...html.matchAll(/data-slot="card-title"[^>]*>([^<]+)</g)].map((m) => m[1].trim());

// ════════════════════════════════════════════════════════════════════════════
// UN APARTADO POR PREGUNTA
// ════════════════════════════════════════════════════════════════════════════

describe("el informe no vuelve a trocear la misma pregunta", () => {
  const html = render(SERIE);

  it("CONTROL POSITIVO · el extractor de títulos encuentra algo", () => {
    // Sin esto, cada comprobación de abajo pasaría sobre una lista vacía.
    expect(titulos(html).length).toBeGreaterThan(4);
  });

  it("los apartados de primer nivel son los previstos, en orden", () => {
    // Lista a mano, deliberadamente: añadir una sección de primer nivel debe
    // costar tocar este test y justificar por qué es una pregunta nueva.
    //
    // «Datos a revisar», «Qué no puede interpretarse» y «Fotografías de
    // progreso» son condicionales: aparecen solo cuando tienen contenido. Este
    // fixture tiene limitaciones —el sujeto está completo, así que los
    // bloqueos que quedan son del sistema— y por eso sale la segunda.
    expect(titulos(html)).toEqual([
      "Indicadores",
      "Evolución",
      "Interpretación",
      "Recomendaciones profesionales",
      "Historial de mediciones",
      "Calidad del análisis",
      "Qué no puede interpretarse",
      "Metodología",
      "Conclusión",
    ]);
  });

  it("y ninguno de ellos supera la decena: eran catorce", () => {
    // El número redondo importa menos que la dirección. Catorce apartados de
    // primer nivel es un índice; nueve es un documento.
    expect(titulos(html).length).toBeLessThan(11);
  });

  it("ningún título de primer nivel se repite", () => {
    const t = titulos(html);
    expect(new Set(t).size).toBe(t.length);
  });

  it("«qué significa» ocupa UN apartado, no cinco", () => {
    const t = titulos(html);
    const interpretativos = t.filter((x) =>
      /interpretaci|observacion|hallazgo|insight/i.test(x),
    );
    expect(interpretativos).toEqual(["Interpretación"]);
  });

  it("«cómo cambió» ocupa UN apartado, no tres", () => {
    const t = titulos(html);
    expect(t.filter((x) => /evoluci|comparaci|tendencia|gráfica/i.test(x))).toEqual(["Evolución"]);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// NADA SE HA PERDIDO
// ════════════════════════════════════════════════════════════════════════════

describe("agrupar no es borrar: el contenido sigue entero", () => {
  const html = render(SERIE);

  it("los antiguos títulos siguen presentes, como rótulos internos", () => {
    for (const rotulo of [
      "Principales",
      "Todas las variables registradas",
      "Posición dentro del rango",
      "Respecto a la medición anterior",
      "Gráficas",
      "Tendencia por variable",
      "Observaciones clínicas",
    ]) {
      expect(html, rotulo).toContain(rotulo);
    }
  });

  it("los hallazgos siguen ahí, plegados y contados en el propio rótulo", () => {
    expect(html).toMatch(/Ver los \d+ hechos en los que se apoya/);
    expect(html).toContain("<details");
  });

  it("la explicación al cliente aparece en el documento", () => {
    expect(html).toContain("Qué dicen tus resultados");
    expect(html).toContain("La báscula no mide la grasa ni el músculo directamente");
  });

  it("la explicación va ARRIBA, antes de la primera sección profesional", () => {
    // Si quedara al final, el cliente tendría que atravesar todo el informe
    // para llegar a la única parte escrita para él.
    expect(html.indexOf("Qué dicen tus resultados")).toBeLessThan(html.indexOf("Interpretación"));
  });
});

// ════════════════════════════════════════════════════════════════════════════
// CON UNA SOLA MEDICIÓN NO SE DIBUJAN APARTADOS VACÍOS
// ════════════════════════════════════════════════════════════════════════════

describe("sin evolución, el apartado de evolución no existe", () => {
  const html = render([SERIE[2]]);

  it("«Evolución» desaparece en vez de mostrar tres vacíos con título", () => {
    expect(titulos(html)).not.toContain("Evolución");
  });

  it("pero el informe sigue en pie, con lo que sí puede decirse", () => {
    expect(titulos(html)).toContain("Indicadores");
    expect(titulos(html)).toContain("Interpretación");
  });

  it("y se dice explícitamente que hace falta una segunda medición", () => {
    // Callar el apartado no puede convertirse en callar el motivo.
    expect(html).toContain("Todavía no hay con qué comparar");
  });
});
