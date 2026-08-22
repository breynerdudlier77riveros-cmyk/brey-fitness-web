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

/**
 * Una medición como las que da el aparato de verdad, no cuatro campos.
 *
 * El fixture anterior traía peso, IMC, % graso y músculo, y con eso ninguna de
 * las lecturas transversales podía dispararse: la identidad del peso necesita
 * la masa grasa, el metabolismo basal necesita el BMR, el reparto de agua
 * necesita los tres compartimentos. Un fixture más pobre que el dato real hace
 * pasar tests sobre un informe que nadie va a ver.
 */
const completa = (
  id: string,
  fecha: string,
  peso: number,
  imc: number,
  graso: number,
  musculo: number,
) =>
  medicion({
    id,
    fecha,
    peso_kg: peso,
    imc,
    grasa_pct: graso,
    masa_grasa_kg: Number(((peso * graso) / 100).toFixed(1)),
    masa_libre_grasa_kg: Number((peso - (peso * graso) / 100).toFixed(1)),
    masa_muscular_kg: musculo,
    agua_total_l: Number((peso * 0.55).toFixed(1)),
    agua_intracelular_l: Number((peso * 0.34).toFixed(1)),
    agua_extracelular_l: Number((peso * 0.21).toFixed(1)),
    proteina_kg: Number((musculo * 0.35).toFixed(1)),
    masa_osea_kg: 2.6,
    bmr_kcal: 1420,
    grasa_visceral_idx: 4,
  });

const SERIE = [
  completa("m1", "2026-04-01", 62, 22.8, 27.1, 24.1),
  completa("m2", "2026-06-01", 63, 23.1, 26.4, 25.0),
  completa("m3", "2026-08-01", 63.4, 23.3, 25.6, 25.8),
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
      "Recomendaciones",
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

// ════════════════════════════════════════════════════════════════════════════
// EL INFORME HABLA DEL CUERPO, NO SOLO DE SÍ MISMO (Sprint BCS-8.0)
// ════════════════════════════════════════════════════════════════════════════
//
// La queja que lo originó, literal: «en el apartado de interpretación sigue
// vacío, no me da nada, no me dice nada».
//
// Y era exacto. Los cuatro párrafos que había hablaban del ANÁLISIS —cuántas
// mediciones lo sostienen, cuántas variables no admiten clasificación— y
// ninguno de la persona. Un informe que solo sabe hablar de sus propias
// limitaciones no es cauto: está vacío y suena cauto.

describe("con UNA sola medición el informe dice algo del cuerpo", () => {
  const html = render([SERIE[2]]);

  it("CONTROL POSITIVO · sigue sin haber evolución que mostrar", () => {
    // Si este fixture tuviera histórico, todo lo de abajo pasaría por el
    // camino fácil y no demostraría nada.
    expect(titulos(html)).not.toContain("Evolución");
  });

  it("dice de qué está hecho el peso, que es una identidad exacta", () => {
    expect(html).toContain("De qué está hecho tu peso");
    expect(html).toContain('data-lectura="composicion-del-peso"');
  });

  it("junta el IMC con el porcentaje graso, en vez de dejarlos separados", () => {
    // El aviso del handbook dice literalmente «considerar junto al % de grasa
    // corporal registrado». El informe clasificaba el IMC en una tarjeta y
    // mostraba la grasa en otra, sin juntarlos nunca.
    expect(html).toContain('data-lectura="imc-vs-grasa"');
    expect(html).toMatch(/El IMC solo conoce tu peso y tu estatura/);
  });

  it("declara que el metabolismo basal no se midió", () => {
    expect(html).toContain('data-lectura="bmr-derivado"');
    expect(html).toMatch(/no se midieron/);
  });

  it("cada lectura muestra de dónde sale, para poder comprobarla", () => {
    // Sin el fundamento a la vista, estas frases serían indistinguibles de
    // texto generado. Con él, cualquiera puede ir al módulo y contrastarlas.
    expect(html).toMatch(/CKB 10/);
    expect(html).toMatch(/BCS Handbook 03|BCS Handbook 06/);
  });

  it("y el alcance del análisis sigue estando, DETRÁS y no delante", () => {
    // No se ha quitado: se ha movido. Iba primero y, siendo lo único que
    // había, convertía el apartado entero en una disculpa.
    expect(html).toContain("Alcance de este análisis");
    expect(html.indexOf("Lo que dicen tus cifras")).toBeLessThan(
      html.indexOf("Alcance de este análisis"),
    );
  });

  it("NINGUNA lectura clasifica ni recomienda", () => {
    const seccion = html.slice(
      html.indexOf("Lo que dicen tus cifras"),
      html.indexOf("Alcance de este análisis"),
    );
    expect(seccion).not.toMatch(/(?<![-\w])(deberías|conviene|se recomienda|riesgo|saludable)(?![-\w])/i);
  });

  it("CONTROL POSITIVO · ese auditor reconoce una recomendación cuando la hay", () => {
    const prohibidas = /(?<![-\w])(deberías|conviene|se recomienda|riesgo|saludable)(?![-\w])/i;
    expect(prohibidas.test("Se recomienda un déficit calórico.")).toBe(true);
    expect(prohibidas.test("Esto supone un riesgo metabólico.")).toBe(true);
    expect(prohibidas.test("Tus 42,0 L de agua son el 63,6 % de tu peso.")).toBe(false);
  });
});

describe("cada variable abre su ficha, en los dos sitios donde aparece", () => {
  const html = render(SERIE);

  it("las tarjetas de indicadores abren un DIÁLOGO, no un desplegable", () => {
    // El `<details>` crecía dentro de la tarjeta, empujaba a las otras dos de
    // su fila y en móvil dejaba el texto en una tira de una columna.
    const rejilla = html.slice(html.indexOf("bcs-indicadores"));
    expect(rejilla.slice(0, 8000)).toContain("Ver detalle");
    expect(rejilla.slice(0, 8000)).toContain('aria-haspopup="dialog"');
  });

  it("y la lista completa de variables también", () => {
    expect((html.match(/bcs-variable/g) ?? []).length).toBeGreaterThan(10);
  });

  it("el ángulo de fase declara que su evidencia es de otra población", () => {
    // Es la corrección de fondo: la CKB tiene la fisiología Y la frontera, y
    // el texto anterior se quedaba en un aviso de electrodos.
    const conAngulo = render([
      medicion({ id: "a1", fecha: "2026-08-01", peso_kg: 63, angulo_fase_deg: 6.1 }),
    ]);
    expect(conAngulo).toMatch(/pacientes críticos, oncológicos/);
    expect(conAngulo).toMatch(/salto que la base de conocimiento clínica declara no admisible/);
  });
});

// ════════════════════════════════════════════════════════════════════════════
// LA ORIENTACIÓN SE INDEXA POR OBJETIVO, NUNCA POR VALOR (Sprint BCS-9.0)
// ════════════════════════════════════════════════════════════════════════════
//
// La petición fue «no me recomienda nada», con este ejemplo:
//
//   «grasa visceral alta → problemas metabólicos → se recomienda déficit»
//
// Esa cadena clasifica con un rango que no existe, emite un juicio de salud
// que el handbook prohíbe, y atribuye al dato una causa que el dato no
// contiene. La que sí se sostiene —y es la que un profesional usa— es «para
// este objetivo, esto es lo que la evidencia señala».
//
// El test que importa no es que aparezcan las recomendaciones: es que NO
// dependan de ninguna cifra del cliente.

describe("qué hacer se organiza por objetivo, no se deduce de una cifra", () => {
  it("las tres orientaciones aparecen, con sus palancas", () => {
    const html = render(SERIE);
    expect(html).toContain('data-objetivo="ganar_musculo"');
    expect(html).toContain('data-objetivo="recomposicion"');
    expect(html).toContain('data-objetivo="perder_peso"');
    expect(html).toMatch(/Tensión mecánica/);
    expect(html).toMatch(/Ingesta proteica/);
  });

  it("cada una cita su ficha, su nivel de evidencia y sus referencias", () => {
    const html = render(SERIE);
    expect(html).toMatch(/ficha hipertrofia-muscular/);
    expect(html).toMatch(/proximidad_fallo_hipertrofia_2023/);
    expect(html).toMatch(/barakat_recomposicion_2020/);
  });

  it("y declara lo que NO puede concluirse, dentro y no al pie", () => {
    const html = render(SERIE);
    expect(html).toContain("Qué no puede concluirse");
    expect(html).toMatch(/el dato no contiene la causa/);
    expect(html).toMatch(/no autoriza|no puede concluirse|sarcopenia/i);
  });

  it("LA COMPROBACIÓN DE FONDO · el texto es idéntico con cifras opuestas", () => {
    // Si la orientación dependiera de un valor, dos clientes distintos verían
    // textos distintos. Es la única forma mecánica de demostrar que no se
    // está recomendando a partir de una cifra.
    const magro = render([completa("x1", "2026-08-01", 60, 19.5, 8.0, 30)]);
    const graso = render([completa("x2", "2026-08-01", 95, 31.0, 34.0, 28)]);

    const seccion = (h: string) =>
      h.slice(h.indexOf('data-objetivo="ganar_musculo"'), h.indexOf("Historial de mediciones"));

    expect(seccion(magro)).toBe(seccion(graso));
    expect(seccion(magro).length).toBeGreaterThan(500);
  });

  it("y no clasifica al cliente en ninguna parte de esa sección", () => {
    const html = render(SERIE);
    const seccion = html.slice(
      html.indexOf('data-objetivo="ganar_musculo"'),
      html.indexOf("Historial de mediciones"),
    );
    expect(seccion).not.toMatch(/tu (grasa|peso|músculo) es (alto|alta|bajo|baja|excesiv)/i);
  });
});
