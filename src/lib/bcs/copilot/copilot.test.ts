import { describe, expect, it } from "vitest";
import { analizarComposicionCorporal } from "@/lib/bcs/analysis";
import { generarRecomendaciones } from "@/lib/bcs/recommendations";
import { generarObservaciones } from "@/lib/bcs/observation";
import { construirReporte, type ClienteDelReporte } from "@/lib/bcs/reporte";
import {
  generarEntregables, validarTexto, contarPalabras, CONTRATOS, renderizarContrato,
  CLAVES_PREGUNTA, CONCEPTOS, COMPOSICION_IMPRESION, EXTENSIONES, MINUTOS,
  type EntradaCopilot, type Entregable,
} from "./index";
import { normalizar } from "./fuentes";
import { recortarAPalabras, dividirOraciones } from "./render";
import type { Medicion } from "@/lib/bcs/tipos";

// ── Pruebas del AI Clinical Copilot (Sprint BCS-6.0) ───────────────────────

const HOY = "2026-08-01";

function medicion(over: Partial<Medicion> & { id: string; fecha: string }): Medicion {
  return {
    cliente_id: "c1", estado: "vigente",
    altura_cm: 178, peso_kg: null, imc: null, grasa_pct: null,
    masa_grasa_kg: null, masa_muscular_kg: null, masa_libre_grasa_kg: null,
    agua_total_l: null, agua_intracelular_l: null, agua_extracelular_l: null,
    proteina_kg: null, minerales_kg: null, masa_osea_kg: null,
    grasa_visceral_idx: null, angulo_fase_deg: null, bmr_kcal: null,
    edad_metabolica: null, smi: null, circ_cintura_cm: null,
    circ_cadera_cm: null, whr: null, impedancia_ohm: null,
    observaciones: null, foto_url: null, dispositivo: null,
    ...over,
  };
}

const CLIENTE: ClienteDelReporte = {
  id: "c1",
  nombre: "Ana Ruiz",
  estado: "activo",
  // Sin sexo ni nacimiento a propósito: es el estado real de los cuatro
  // clientes registrados, y el copiloto tiene que redactar bien con él.
  sexo: null,
  fecha_nacimiento: null,
  rangos_dispositivo: null,
  dispositivo_referencia: null,
};

function entrada(mediciones: Medicion[], profesional?: string): EntradaCopilot {
  const desc = [...mediciones].sort((a, b) => b.fecha.localeCompare(a.fecha));
  const reporte = construirReporte(CLIENTE, desc)!;
  const analisis = analizarComposicionCorporal(desc, { hoyISO: HOY });
  const recomendaciones = generarRecomendaciones(analisis);
  const observaciones = generarObservaciones({ analisis, recomendaciones });
  return { reporte, analisis, recomendaciones, observaciones, hoyISO: HOY, profesional };
}

const SERIE = [
  medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 82, grasa_pct: 24, masa_muscular_kg: 34, masa_grasa_kg: 19.7 }),
  medicion({ id: "m2", fecha: "2026-03-01", peso_kg: 80, grasa_pct: 23, masa_muscular_kg: 35, masa_grasa_kg: 18.4 }),
  medicion({ id: "m3", fecha: "2026-06-01", peso_kg: 78, grasa_pct: 22, masa_muscular_kg: 36, masa_grasa_kg: 17.2 }),
];
const UNA = [medicion({ id: "m1", fecha: "2026-06-01", peso_kg: 80, grasa_pct: 24 })];

const R = generarEntregables(entrada(SERIE, "Dra. López"));
const buscar = (r: typeof R, tipo: string, variante?: string): Entregable | undefined =>
  r.entregables.find((e) => e.tipo === tipo && (variante === undefined || e.variante === variante));
const textoTodo = (r: typeof R) => r.entregables.map((e) => e.texto).join(" ").toLowerCase();

// ── Contrato y lote ────────────────────────────────────────────────────────

describe("contrato del orquestador", () => {
  it("el lote completo emite los diez tipos de entregable", () => {
    const tipos = new Set(R.entregables.map((e) => e.tipo));
    for (const t of [
      "resumen_ejecutivo", "explicacion_paciente", "guion_consulta", "faq", "correo",
      "whatsapp", "nota_soap", "presentacion", "material_educativo", "documento_impresion",
    ]) {
      expect(tipos.has(t as never), t).toBe(true);
    }
  });

  it("no rechaza ningún entregable del lote completo", () => {
    expect(R.rechazados).toEqual([]);
    expect(R.meta.emitidos).toBe(R.meta.solicitados);
  });

  it("permite pedir un subconjunto", () => {
    const r = generarEntregables(entrada(SERIE), { resumen: ["30"] });
    expect(r.entregables).toHaveLength(1);
    expect(r.entregables[0].variante).toBe("30");
  });

  it("una petición vacía no emite nada y no falla", () => {
    const r = generarEntregables(entrada(SERIE), {});
    expect(r.entregables).toEqual([]);
    expect(r.meta.solicitados).toBe(0);
  });

  it("todo entregable lleva id, título, secciones y texto", () => {
    for (const e of R.entregables) {
      expect(e.id).toBeTruthy();
      expect(e.titulo).toBeTruthy();
      expect(e.secciones.length).toBeGreaterThan(0);
      expect(e.texto.length).toBeGreaterThan(0);
      expect(e.palabras).toBeGreaterThan(0);
    }
  });

  it("ningún id de entregable se repite", () => {
    const ids = R.entregables.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });

  it("meta refleja la fecha suministrada", () => {
    expect(R.meta.hoyISO).toBe(HOY);
  });
});

// ── Resumen ejecutivo ──────────────────────────────────────────────────────

describe("resumen ejecutivo", () => {
  it("emite las tres extensiones", () => {
    for (const v of ["30", "100", "300"]) expect(buscar(R, "resumen_ejecutivo", v)).toBeDefined();
  });

  it("la versión de 30 palabras es más corta que la de 100 y esta que la de 300", () => {
    const p = (v: string) => buscar(R, "resumen_ejecutivo", v)!.palabras;
    expect(p("30")).toBeLessThanOrEqual(p("100"));
    expect(p("100")).toBeLessThanOrEqual(p("300"));
  });

  it("respeta el presupuesto salvo por la primera oración indivisible", () => {
    const e = buscar(R, "resumen_ejecutivo", "30")!;
    const primera = dividirOraciones(e.texto)[0];
    expect(e.palabras).toBeLessThanOrEqual(Math.max(EXTENSIONES["30"], contarPalabras(primera)));
  });

  it("las versiones largas contienen a las cortas: no añaden material nuevo", () => {
    const corta = buscar(R, "resumen_ejecutivo", "30")!;
    const larga = buscar(R, "resumen_ejecutivo", "300")!;
    for (const o of dividirOraciones(corta.texto)) expect(larga.texto).toContain(o);
  });

  it("cita el nombre del cliente y el número de mediciones", () => {
    const e = buscar(R, "resumen_ejecutivo", "100")!;
    expect(e.texto).toContain("Ana Ruiz");
    expect(e.texto).toContain("3");
  });

  it("traza los hallazgos que resume", () => {
    expect(buscar(R, "resumen_ejecutivo", "300")!.traza.hallazgoIds.length).toBeGreaterThan(0);
  });

  it("con una sola medición declara ausencia de cambios en lugar de inventarlos", () => {
    const r = generarEntregables(entrada(UNA), { resumen: ["100"] });
    expect(r.entregables[0].texto.toLowerCase()).toContain("no se registran cambios");
  });
});

// ── Explicación para el paciente ───────────────────────────────────────────

describe("explicación para el paciente", () => {
  const e = buscar(R, "explicacion_paciente")!;

  it("traduce el umbral a lenguaje llano sin perder el sentido", () => {
    expect(e.texto.toLowerCase()).toContain("cambio real");
    expect(e.texto.toLowerCase()).toContain("aparato");
  });

  it("no emplea la palabra umbral, que es técnica", () => {
    expect(e.texto.toLowerCase()).not.toContain("umbral documentado");
  });

  it("incluye qué no dice el informe", () => {
    expect(e.texto.toLowerCase()).toContain("no es una valoración médica");
  });

  it("explica que la báscula estima y no mide directamente", () => {
    expect(e.texto.toLowerCase()).toContain("no mide");
  });

  it("cita fichas de la base de conocimiento", () => {
    expect(e.traza.fichasCkb.length).toBeGreaterThan(0);
    expect(e.traza.referenciaIds.length).toBeGreaterThan(0);
  });

  it("con UNA medición no explica el margen: explica que no hay con qué comparar", () => {
    // Este test decía «sin cambios significativos explica el margen en lugar
    // de callarlo», y pasaba — sobre un fixture de UNA medición. Fijaba el
    // bug: con un solo dato no hay «cambios no significativos», hay ausencia
    // de comparación, y el margen del aparato no viene al caso.
    const r = generarEntregables(entrada(UNA), { explicacionPaciente: true });
    expect(r.entregables[0].texto).toContain("Todavía no hay con qué comparar");
    expect(r.entregables[0].texto.toLowerCase()).not.toContain("margen");
  });

  it("con DOS mediciones y sin cambios sí explica el margen, en vez de callarlo", () => {
    // La intención original del test anterior, aplicada donde sí corresponde.
    const dos = [
      medicion({ id: "p1", fecha: "2026-06-01", peso_kg: 80, imc: 25.2 }),
      medicion({ id: "p2", fecha: "2026-07-01", peso_kg: 80, imc: 25.2 }),
    ];
    const r = generarEntregables(entrada(dos), { explicacionPaciente: true });
    expect(r.entregables[0].texto.toLowerCase()).toContain("margen");
  });
});

// ── Guion de consulta ──────────────────────────────────────────────────────

describe("guion de consulta", () => {
  it("emite las tres duraciones", () => {
    for (const v of ["2min", "5min", "10min"]) expect(buscar(R, "guion_consulta", v)).toBeDefined();
  });

  it("toda duración conserva las cuatro partes", () => {
    for (const v of ["2min", "5min", "10min"]) {
      const titulos = buscar(R, "guion_consulta", v)!.secciones.map((s) => s.titulo);
      expect(titulos).toEqual(["Saludo", "Explicación", "Cierre", "Seguimiento"]);
    }
  });

  it("una duración mayor no produce un guion más corto", () => {
    expect(buscar(R, "guion_consulta", "10min")!.palabras).toBeGreaterThanOrEqual(
      buscar(R, "guion_consulta", "2min")!.palabras
    );
  });

  it("el seguimiento nunca fija un plazo concreto", () => {
    for (const v of ["2min", "5min", "10min"]) {
      const seg = buscar(R, "guion_consulta", v)!.secciones.find((s) => s.titulo === "Seguimiento")!;
      const texto = seg.contenido.join(" ").toLowerCase();
      expect(texto).toContain("no fija un intervalo");
      for (const p of ["en 4 semanas", "en un mes", "en 3 meses", "dentro de"]) {
        expect(texto).not.toContain(p);
      }
    }
  });

  it("el cierre declara que no explica causas", () => {
    const cierre = buscar(R, "guion_consulta", "5min")!.secciones.find((s) => s.titulo === "Cierre")!;
    expect(cierre.contenido.join(" ").toLowerCase()).toContain("no puedo decirte");
  });

  it("MINUTOS declara las tres duraciones", () => {
    expect(Object.keys(MINUTOS)).toEqual(["2min", "5min", "10min"]);
  });
});

// ── Preguntas frecuentes ───────────────────────────────────────────────────

describe("preguntas frecuentes", () => {
  const e = buscar(R, "faq")!;

  it("cubre las seis preguntas declaradas", () => {
    expect(e.secciones).toHaveLength(CLAVES_PREGUNTA.length);
    expect(CLAVES_PREGUNTA.length).toBe(6);
  });

  it("toda respuesta incluye su límite", () => {
    for (const s of e.secciones) expect(s.contenido.length).toBe(2);
  });

  it("cada pregunta está formulada como pregunta", () => {
    for (const s of e.secciones) expect(s.titulo).toMatch(/^¿.+\?$/);
  });

  it("toda la sección se sustenta en fichas de la base de conocimiento", () => {
    expect(e.traza.fichasCkb.length).toBeGreaterThanOrEqual(6);
    expect(e.traza.referenciaIds.length).toBeGreaterThan(0);
  });

  it("la respuesta sobre grasa declara que no puede saber la causa", () => {
    const grasa = e.secciones.find((s) => s.titulo.includes("grasa"))!;
    expect(grasa.contenido.join(" ").toLowerCase()).toContain("no puede saber qué lo produjo");
  });

  it("la respuesta sobre ángulo de fase declara la población de la evidencia", () => {
    const ang = e.secciones.find((s) => s.titulo.includes("ángulo"))!;
    expect(ang.contenido.join(" ").toLowerCase()).toContain("hospitalizados");
  });

  it("admite un subconjunto de preguntas", () => {
    const r = generarEntregables(entrada(SERIE), { faq: ["agua"] });
    expect(r.entregables[0].secciones).toHaveLength(1);
  });
});

// ── Correo ─────────────────────────────────────────────────────────────────

describe("correo profesional", () => {
  it("emite las cuatro variantes", () => {
    for (const v of ["consulta_inicial", "seguimiento", "nueva_medicion", "recordatorio"]) {
      expect(buscar(R, "correo", v)).toBeDefined();
    }
  });

  it("toda variante lleva asunto y cuerpo", () => {
    for (const e of R.entregables.filter((x) => x.tipo === "correo")) {
      expect(e.secciones.map((s) => s.titulo)).toEqual(["Asunto", "Cuerpo"]);
      expect(e.secciones[0].contenido[0].length).toBeGreaterThan(5);
    }
  });

  it("saluda por el nombre del cliente", () => {
    expect(buscar(R, "correo", "seguimiento")!.texto).toContain("Ana Ruiz");
  });

  it("firma con el profesional cuando se conoce", () => {
    expect(buscar(R, "correo", "seguimiento")!.texto).toContain("Dra. López");
  });

  it("sin nombre de profesional firma de forma neutra, sin inventarlo", () => {
    const r = generarEntregables(entrada(SERIE), { correo: ["seguimiento"] });
    expect(r.entregables[0].texto).toContain("Un saludo.");
    expect(r.entregables[0].texto).not.toContain("Dra.");
  });

  it("no reproduce hallazgos clínicos concretos", () => {
    const texto = R.entregables.filter((e) => e.tipo === "correo").map((e) => e.texto).join(" ").toLowerCase();
    expect(texto).not.toContain("umbral");
    expect(texto).not.toContain("disminuyó");
  });
});

// ── WhatsApp ───────────────────────────────────────────────────────────────

describe("mensaje de WhatsApp", () => {
  it("emite las tres variantes", () => {
    for (const v of ["breve", "normal", "formal"]) expect(buscar(R, "whatsapp", v)).toBeDefined();
  });

  it("la variante breve es la más corta", () => {
    const p = (v: string) => buscar(R, "whatsapp", v)!.palabras;
    expect(p("breve")).toBeLessThan(p("normal"));
    expect(p("normal")).toBeLessThan(p("formal"));
  });

  it("la variante formal trata de usted", () => {
    expect(buscar(R, "whatsapp", "formal")!.texto.toLowerCase()).toContain("le comparto");
  });

  it("no contiene emojis de ningún tipo", () => {
    const emoji = /[\u{1F300}-\u{1FAFF}\u{2600}-\u{27BF}]/u;
    for (const e of R.entregables.filter((x) => x.tipo === "whatsapp")) {
      expect(emoji.test(e.texto), e.variante).toBe(false);
    }
  });

  it("no reproduce hallazgos clínicos", () => {
    const texto = R.entregables.filter((e) => e.tipo === "whatsapp").map((e) => e.texto).join(" ").toLowerCase();
    expect(texto).not.toContain("umbral");
  });
});

// ── SOAP ───────────────────────────────────────────────────────────────────

describe("nota SOAP", () => {
  const e = buscar(R, "nota_soap")!;

  it("tiene exactamente los cuatro apartados", () => {
    expect(e.secciones.map((s) => s.titulo)).toEqual([
      "S · Subjective", "O · Objective", "A · Assessment", "P · Plan",
    ]);
  });

  it("Subjective declara que no hay relato registrado en lugar de inventarlo", () => {
    expect(e.secciones[0].contenido.join(" ")).toContain("No registrado");
  });

  it("Assessment declara que solo resume el motor de análisis", () => {
    expect(e.secciones[2].contenido.join(" ")).toContain("resume exclusivamente la salida del motor");
  });

  it("Assessment declara que no constituye juicio clínico", () => {
    expect(e.secciones[2].contenido.join(" ").toLowerCase()).toContain("no constituye juicio clínico");
  });

  it("Assessment reproduce el resumen del Analysis Engine sin alterarlo", () => {
    const f = normalizar(entrada(SERIE));
    expect(e.secciones[2].contenido[0]).toContain(f.textoResumen);
  });

  it("Plan solo contiene acciones administrativas", () => {
    const plan = e.secciones[3].contenido.join(" ").toLowerCase();
    expect(plan).toContain("registro");
    for (const p of ["dieta", "entrenamiento de", "suplement", "medicac"]) {
      expect(plan).not.toContain(p);
    }
  });

  it("Plan declara que el sistema no establece periodicidad", () => {
    expect(e.secciones[3].contenido.join(" ").toLowerCase()).toContain("no establece periodicidad");
  });
});

// ── Presentación, educativo e impresión ────────────────────────────────────

describe("presentación", () => {
  it("emite las tres variantes", () => {
    for (const v of ["pantalla", "tablet", "pdf"]) expect(buscar(R, "presentacion", v)).toBeDefined();
  });

  it("el contenido es idéntico en los tres soportes", () => {
    const t = (v: string) => buscar(R, "presentacion", v)!.texto;
    expect(t("pantalla")).toBe(t("tablet"));
    expect(t("tablet")).toBe(t("pdf"));
  });

  it("incluye siempre qué no dice el informe", () => {
    expect(buscar(R, "presentacion", "pdf")!.texto.toLowerCase()).toContain("no es una valoración médica");
  });
});

describe("material educativo", () => {
  const e = buscar(R, "material_educativo")!;

  it("cubre los cinco conceptos más la nota común", () => {
    expect(CONCEPTOS).toHaveLength(5);
    expect(e.secciones).toHaveLength(6);
  });

  it("cada concepto declara qué no puede concluirse", () => {
    for (const s of e.secciones.slice(0, 5)) {
      expect(s.contenido.some((c) => c.startsWith("Qué no puede concluirse:"))).toBe(true);
    }
  });

  it("cada concepto explica qué es y cómo se obtiene", () => {
    for (const s of e.secciones.slice(0, 5)) {
      expect(s.contenido.some((c) => c.startsWith("Qué es:"))).toBe(true);
      expect(s.contenido.some((c) => c.startsWith("Cómo se obtiene:"))).toBe(true);
    }
  });

  it("no menciona a ninguna persona concreta", () => {
    expect(e.texto).not.toContain("Ana Ruiz");
  });

  it("se sustenta en la base de conocimiento", () => {
    expect(e.traza.fichasCkb.length).toBeGreaterThanOrEqual(5);
  });
});

describe("documentos de impresión", () => {
  it("emite las tres variantes", () => {
    for (const v of ["una_pagina", "dos_paginas", "completo"]) {
      expect(buscar(R, "documento_impresion", v)).toBeDefined();
    }
  });

  it("el completo remite al reporte sin alterarlo", () => {
    expect(COMPOSICION_IMPRESION.completo[0]).toContain("sin modificación");
  });

  it("dos páginas incluye más secciones que una", () => {
    expect(COMPOSICION_IMPRESION.dos_paginas.length).toBeGreaterThan(COMPOSICION_IMPRESION.una_pagina.length);
  });
});

// ── Seguridad ──────────────────────────────────────────────────────────────

describe("validador de seguridad", () => {
  const permitidas = normalizar(entrada(SERIE)).variablesDisponibles;

  it("rechaza diagnósticos", () => {
    const v = validarTexto("El paciente presenta un cuadro compatible con sarcopenia.", permitidas);
    expect(v.some((x) => x.categoria === "diagnostico")).toBe(true);
  });

  it("rechaza tratamientos y prescripciones", () => {
    expect(validarTexto("Se indica tratamiento durante ocho semanas.", permitidas).some((x) => x.categoria === "tratamiento")).toBe(true);
    expect(validarTexto("Se prescribe una pauta diaria.", permitidas).some((x) => x.categoria === "prescripcion")).toBe(true);
  });

  it("rechaza medicación y suplementos", () => {
    expect(validarTexto("Añadir un suplemento de proteína.", permitidas).some((x) => x.categoria === "medicacion")).toBe(true);
  });

  it("rechaza atribuciones causales", () => {
    expect(validarTexto("El descenso se debe a la dieta seguida.", permitidas).some((x) => x.categoria === "causalidad")).toBe(true);
  });

  it("rechaza recomendaciones nutricionales", () => {
    expect(validarTexto("Conviene ajustar el deficit calorico.", permitidas).some((x) => x.categoria === "nutricion")).toBe(true);
  });

  it("rechaza recomendaciones deportivas", () => {
    expect(validarTexto("Seguir un plan de entrenamiento progresivo.", permitidas).some((x) => x.categoria === "deporte")).toBe(true);
  });

  it("rechaza afirmaciones fuera de evidencia", () => {
    expect(validarTexto("Esta demostrado que el valor mejora.", permitidas).some((x) => x.categoria === "fuera_de_evidencia")).toBe(true);
    expect(validarTexto("El resultado es normal.", permitidas).some((x) => x.categoria === "fuera_de_evidencia")).toBe(true);
  });

  it("detecta la mención de variables ausentes del reporte", () => {
    const v = validarTexto("Se observa el ángulo de fase estable.", permitidas);
    expect(v.some((x) => x.categoria === "variable_inexistente")).toBe(true);
  });

  it("no marca variables que sí están en el reporte", () => {
    const v = validarTexto("La masa muscular se registró en la evaluación.", permitidas);
    expect(v.some((x) => x.categoria === "variable_inexistente")).toBe(false);
  });

  it("es insensible a acentos y mayúsculas", () => {
    expect(validarTexto("DIAGNÓSTICO confirmado.", permitidas).length).toBeGreaterThan(0);
    expect(validarTexto("diagnostico confirmado.", permitidas).length).toBeGreaterThan(0);
  });

  it("un texto conforme no produce violaciones", () => {
    expect(validarTexto("Se registran variaciones entre las dos evaluaciones comparadas.", permitidas)).toEqual([]);
  });

  it("ningún entregable emitido contiene vocabulario prohibido", () => {
    const texto = textoTodo(R);
    for (const p of [
      "diagnostic", "tratamiento", "prescrib", "medicament", "suplement",
      "se debe a", "causado por", "dieta", "plan de entrenamiento",
      "es normal", "es anormal", "es saludable", "garantiza",
    ]) {
      expect(texto, `término prohibido: ${p}`).not.toContain(p);
    }
  });

  it("ningún entregable atribuye causa", () => {
    const texto = textoTodo(R);
    for (const p of ["gracias a", "por culpa de", "es consecuencia de", "a causa de"]) {
      expect(texto, p).not.toContain(p);
    }
  });

  it("ningún entregable menciona una variable ausente del reporte", () => {
    const permitidas2 = normalizar(entrada(SERIE)).variablesDisponibles;
    for (const e of R.entregables) {
      // El material educativo es genérico y no depende del reporte del cliente.
      if (e.tipo === "material_educativo" || e.tipo === "faq") continue;
      const v = validarTexto(e.texto, permitidas2);
      expect(v.filter((x) => x.categoria === "variable_inexistente"), e.id).toEqual([]);
    }
  });
});

// ── Trazabilidad ───────────────────────────────────────────────────────────

describe("trazabilidad", () => {
  it("todo entregable declara la plantilla que lo compuso", () => {
    for (const e of R.entregables) expect(e.traza.plantillaId).toBeTruthy();
  });

  it("los hallazgos citados existen en el análisis de origen", () => {
    const analisis = analizarComposicionCorporal([...SERIE].reverse(), { hoyISO: HOY });
    const validos = new Set([
      ...analisis.hallazgos.map((h) => h.id),
      ...analisis.avisos.map((a) => a.id),
    ]);
    for (const e of R.entregables) {
      for (const id of e.traza.hallazgoIds) expect(validos.has(id), `${e.id} → ${id}`).toBe(true);
    }
  });

  it("las recomendaciones citadas existen en el informe de origen", () => {
    const analisis = analizarComposicionCorporal([...SERIE].reverse(), { hoyISO: HOY });
    const validos = new Set(generarRecomendaciones(analisis).recomendaciones.map((r) => r.id));
    for (const e of R.entregables) {
      for (const id of e.traza.recomendacionIds) expect(validos.has(id), `${e.id} → ${id}`).toBe(true);
    }
  });

  it("toda ficha citada trae al menos una referencia", () => {
    for (const e of R.entregables) {
      if (e.traza.fichasCkb.length > 0) expect(e.traza.referenciaIds.length, e.id).toBeGreaterThan(0);
    }
  });

  it("las trazas están ordenadas, para que dos ejecuciones coincidan", () => {
    for (const e of R.entregables) {
      expect([...e.traza.hallazgoIds].sort()).toEqual(e.traza.hallazgoIds);
      expect([...e.traza.referenciaIds].sort()).toEqual(e.traza.referenciaIds);
    }
  });
});

// ── Consistencia con el reporte ────────────────────────────────────────────

describe("consistencia entre el reporte y los entregables", () => {
  const f = normalizar(entrada(SERIE, "Dra. López"));

  it("el resumen no cita más cambios de los que el análisis emitió", () => {
    const e = buscar(R, "resumen_ejecutivo", "300")!;
    expect(e.traza.hallazgoIds.length).toBeLessThanOrEqual(
      f.cambiosSignificativos.length + f.cambiosSinUmbral.length + f.tendencias.length + f.alertas.length
    );
  });

  it("todo entregable que cita una variable la tiene en el reporte", () => {
    for (const e of R.entregables) {
      for (const v of e.traza.variables) {
        expect(f.variablesDisponibles, `${e.id} → ${v}`).toContain(v);
      }
    }
  });

  it("el número de mediciones es el mismo en resumen, guion y SOAP", () => {
    for (const e of [buscar(R, "resumen_ejecutivo", "100")!, buscar(R, "nota_soap")!]) {
      expect(e.texto).toContain(String(f.cantidadMediciones));
    }
  });

  it("el nombre del cliente es idéntico en todos los entregables que lo usan", () => {
    for (const e of R.entregables) {
      if (e.texto.includes("Ana")) expect(e.texto).toContain("Ana Ruiz");
    }
  });
});

// ── Determinismo y utilidades ──────────────────────────────────────────────

describe("determinismo y no mutación", () => {
  it("dos ejecuciones producen una salida profundamente idéntica", () => {
    const a = generarEntregables(entrada(SERIE, "Dra. López"));
    const b = generarEntregables(entrada(SERIE, "Dra. López"));
    expect(a).toEqual(b);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("no muta los DTO recibidos", () => {
    const e = entrada(SERIE);
    const copia = JSON.parse(JSON.stringify(e));
    generarEntregables(e);
    expect(e).toEqual(copia);
  });

  it("no consulta el reloj: hoyISO gobierna la salida", () => {
    const e = { ...entrada(SERIE), hoyISO: "2030-01-01" };
    expect(generarEntregables(e, { presentacion: ["pdf"] }).entregables[0].texto).toContain("2030-01-01");
  });
});

describe("utilidades de render", () => {
  it("contarPalabras ignora espacios múltiples", () => {
    expect(contarPalabras("  una   dos  tres ")).toBe(3);
  });

  it("dividirOraciones conserva la puntuación", () => {
    expect(dividirOraciones("Una. Dos? Tres!")).toEqual(["Una.", "Dos?", "Tres!"]);
  });

  it("recortarAPalabras no parte oraciones", () => {
    const r = recortarAPalabras(["Una oración corta.", "Otra oración bastante más larga que la anterior."], 5);
    expect(r).toEqual(["Una oración corta."]);
  });

  it("recortarAPalabras devuelve la primera oración aunque exceda el máximo", () => {
    expect(recortarAPalabras(["Una oración larguísima que excede el presupuesto."], 2)).toHaveLength(1);
  });

  it("recortarAPalabras con lista vacía devuelve vacío", () => {
    expect(recortarAPalabras([], 10)).toEqual([]);
  });
});

// ── Contratos de prompt ────────────────────────────────────────────────────

describe("contratos de prompt", () => {
  it("hay un contrato por tipo de entregable", () => {
    expect(Object.keys(CONTRATOS)).toHaveLength(10);
  });

  it("todo contrato declara rol, fuentes cerradas, restricciones y formato", () => {
    for (const [tipo, c] of Object.entries(CONTRATOS)) {
      expect(c.rol, tipo).toBeTruthy();
      expect(c.fuentesPermitidas.length, tipo).toBeGreaterThan(0);
      expect(c.restricciones.length, tipo).toBeGreaterThan(5);
      expect(c.formato, tipo).toBeTruthy();
    }
  });

  it("ningún contrato describe al modelo como experto clínico", () => {
    for (const c of Object.values(CONTRATOS)) {
      expect(c.rol.toLowerCase()).not.toContain("experto clínico");
      expect(c.rol.toLowerCase()).not.toContain("médico");
    }
  });

  it("toda restricción común prohíbe diagnóstico y causalidad", () => {
    for (const c of Object.values(CONTRATOS)) {
      const texto = c.restricciones.join(" ").toLowerCase();
      expect(texto).toContain("diagnóstico");
      expect(texto).toContain("causa");
    }
  });

  it("el contrato serializado incluye las restricciones", () => {
    const s = renderizarContrato("nota_soap");
    expect(s).toContain("ROL:");
    expect(s).toContain("RESTRICCIONES");
    expect(s).toContain("Assessment");
  });

  it("faq y material educativo limitan sus fuentes a la base de conocimiento", () => {
    expect(CONTRATOS.faq.fuentesPermitidas).toEqual(["Clinical Knowledge Base exclusivamente"]);
    expect(CONTRATOS.material_educativo.fuentesPermitidas).toEqual(["Clinical Knowledge Base exclusivamente"]);
  });
});

// ── Casos límite ───────────────────────────────────────────────────────────

describe("casos límite", () => {
  it("una sola medición produce el lote completo sin rechazos", () => {
    const r = generarEntregables(entrada(UNA));
    expect(r.rechazados).toEqual([]);
    expect(r.entregables.length).toBe(r.meta.solicitados);
  });

  it("con una medición el guion dice que no hay anterior, no habla del margen", () => {
    // Mismo cambio que en la explicación al paciente, y por lo mismo.
    const r = generarEntregables(entrada(UNA), { guion: ["5min"] });
    expect(r.entregables[0].texto).toMatch(/primera evaluación registrada/);
    expect(r.entregables[0].texto.toLowerCase()).not.toContain("margen propio del aparato");
  });

  it("un reporte con pocas variables no hace mencionar las ausentes", () => {
    const minimo = [medicion({ id: "m1", fecha: "2026-06-01", peso_kg: 80 })];
    const r = generarEntregables(entrada(minimo));
    expect(r.rechazados).toEqual([]);
  });

  it("todo entregable rechazado explica el motivo", () => {
    for (const x of R.rechazados) {
      expect(x.motivo.length).toBeGreaterThan(20);
    }
  });
});

// ════════════════════════════════════════════════════════════════════════════
// CONCORDANCIA DE NÚMERO (Sprint BCS-7.0)
// ════════════════════════════════════════════════════════════════════════════
//
// Estos fallos vivieron desde BCS-6.0 sin que nadie los viera, por dos razones
// que se sumaron: ningún componente pedía estos textos, y ninguna prueba
// ejercitaba el caso de UNA sola medición. Las suites usaban series de tres,
// donde todas las frases van en plural y todas salen bien.
//
// Con una medición —el estado real de tres de los cuatro clientes— el
// documento decía «Se registraron 1 evaluación». Un informe que no sabe contar
// hasta uno no invita a creerse el resto.

describe("los documentos concuerdan en número, también con un solo dato", () => {
  const UNA = entrada([
    medicion({ id: "u1", fecha: "2026-07-31", peso_kg: 81, imc: 25.6, grasa_pct: 22.4 }),
  ]);

  const textoDe = (tipo: string): string => {
    const r = generarEntregables(UNA);
    const e = r.entregables.find((x) => x.tipo === tipo);
    return e ? e.texto : "";
  };

  it("CONTROL POSITIVO · con una medición sí se emiten documentos", () => {
    // Sin esto, todas las comprobaciones de abajo pasarían sobre cadenas
    // vacías y no demostrarían nada.
    const r = generarEntregables(UNA);
    expect(r.entregables.length).toBeGreaterThan(5);
    expect(textoDe("explicacion_paciente").length).toBeGreaterThan(200);
  });

  it("«Se registró 1 evaluación», no «Se registraron 1»", () => {
    const t = textoDe("explicacion_paciente");
    expect(t).toContain("Se registró 1 evaluación de composición corporal.");
    expect(t).not.toContain("Se registraron 1");
  });

  it("ninguna cifra 1 va seguida de un sustantivo en plural", () => {
    // Auditor transversal sobre TODOS los entregables a la vez: coge los
    // fallos que aún no se han escrito, no solo los cuatro conocidos.
    const plurales = /\b1 (evaluaciones|valores|variables|incidencias|registros|cambios|mediciones|documentos)\b/;
    for (const e of generarEntregables(UNA).entregables) {
      expect(e.texto, e.id).not.toMatch(plurales);
    }
  });

  it("CONTROL POSITIVO · ese auditor reconoce la infracción cuando existe", () => {
    const plurales = /\b1 (evaluaciones|valores|variables|incidencias|registros|cambios|mediciones|documentos)\b/;
    expect(plurales.test("Se registraron 1 evaluaciones de composición.")).toBe(true);
    expect(plurales.test("Otros 1 valores también se movieron.")).toBe(true);
    // Y no confunde otras cifras.
    expect(plurales.test("Se registraron 21 evaluaciones.")).toBe(false);
  });

  it("con varias mediciones el plural sigue estando bien", () => {
    // La otra mitad del arreglo: corregir el singular no puede haber roto el
    // plural, que es el camino que sí estaban probando las suites.
    const varias = entrada([
      medicion({ id: "v1", fecha: "2026-05-01", peso_kg: 79, imc: 24.9, grasa_pct: 21.0 }),
      medicion({ id: "v2", fecha: "2026-06-15", peso_kg: 80, imc: 25.2, grasa_pct: 21.8 }),
      medicion({ id: "v3", fecha: "2026-07-31", peso_kg: 81, imc: 25.6, grasa_pct: 22.4 }),
    ]);
    const e = generarEntregables(varias).entregables.find(
      (x) => x.tipo === "explicacion_paciente",
    )!;
    expect(e.texto).toContain("Se registraron 3 evaluaciones de composición corporal.");
  });
});

// ════════════════════════════════════════════════════════════════════════════
// NO SE AFIRMA UNA COMPARACIÓN QUE NO OCURRIÓ (Sprint BCS-7.0)
// ════════════════════════════════════════════════════════════════════════════
//
// Con una sola medición, la explicación al cliente decía «Comparando con la
// evaluación anterior, las diferencias quedan dentro del margen del aparato».
// No hay evaluación anterior. La rama se disparaba por «no hay cambios
// significativos» sin comprobar que hubiera algo con lo que comparar.
//
// «Medí dos veces y salió casi igual» y «solo he medido una vez» son
// situaciones opuestas. La segunda contada como la primera es una afirmación
// falsa sobre el propio historial del cliente — y tres de los cuatro clientes
// reales tienen exactamente una medición.

describe("con una sola medición no se habla de la anterior", () => {
  const UNA = entrada([
    medicion({ id: "u1", fecha: "2026-07-31", peso_kg: 81, imc: 25.6, grasa_pct: 22.4 }),
  ]);

  /** Toda mención a una medición previa, en cualquier forma. */
  const MENCION_PREVIA = /(evaluación|medición) anterior|respecto a la anterior|comparación con la/i;

  it("CONTROL POSITIVO · el auditor reconoce la mención cuando existe", () => {
    expect(MENCION_PREVIA.test("Comparando con la evaluación anterior, todo igual.")).toBe(true);
    expect(MENCION_PREVIA.test("El informe incluye la comparación con la anterior.")).toBe(true);
    expect(MENCION_PREVIA.test("Se registró 1 evaluación.")).toBe(false);
  });

  it("ningún entregable menciona una medición previa que no existe", () => {
    for (const e of generarEntregables(UNA).entregables) {
      expect(e.texto, e.id).not.toMatch(MENCION_PREVIA);
    }
  });

  it("y la explicación lo dice en positivo: qué llegará con la segunda", () => {
    const e = generarEntregables(UNA).entregables.find(
      (x) => x.tipo === "explicacion_paciente",
    )!;
    expect(e.texto).toContain("Todavía no hay con qué comparar");
    expect(e.texto).toMatch(/A partir de la segunda/);
  });

  it("CONTROL POSITIVO · con dos mediciones sí se compara, y se dice", () => {
    // La otra mitad: el arreglo no puede haber apagado la comparación real.
    const dos = entrada([
      medicion({ id: "d1", fecha: "2026-05-01", peso_kg: 79, imc: 24.9, grasa_pct: 21.0 }),
      medicion({ id: "d2", fecha: "2026-07-31", peso_kg: 81, imc: 25.6, grasa_pct: 22.4 }),
    ]);
    const e = dos && generarEntregables(dos).entregables.find(
      (x) => x.tipo === "explicacion_paciente",
    )!;
    expect(e.texto).toMatch(MENCION_PREVIA);
    expect(e.texto).not.toContain("Todavía no hay con qué comparar");
  });
});
