import { describe, expect, it } from "vitest";
import { analizarComposicionCorporal } from "@/lib/bcs/analysis";
import { generarRecomendaciones } from "@/lib/bcs/recommendations";
import { generarObservaciones, PLANTILLAS, CASOS_RECHAZADOS } from "./index";
import { EVALUADORES } from "./motor";
import { CONOCIMIENTO } from "./conocimiento";
import { PRIORIDAD_POR_PLANTILLA } from "./prioridad";
import { MAX_ORACIONES, MIN_ORACIONES } from "./constructor";
import type { Medicion } from "@/lib/bcs/tipos";

// ── Pruebas del Clinical Observation Generator (COG v1.0) ──────────────────

function medicion(over: Partial<Medicion> & { id: string; fecha: string }): Medicion {
  return {
    cliente_id: "cli-1", estado: "vigente",
    altura_cm: null, peso_kg: null, imc: null, grasa_pct: null,
    masa_grasa_kg: null, masa_muscular_kg: null, masa_libre_grasa_kg: null,
    agua_total_l: null, agua_intracelular_l: null, agua_extracelular_l: null,
    proteina_kg: null, minerales_kg: null, masa_osea_kg: null,
    grasa_visceral_idx: null, angulo_fase_deg: null, bmr_kcal: null,
    edad_metabolica: null, smi: null, circ_cintura_cm: null,
    circ_cadera_cm: null, whr: null, impedancia_ohm: null,
    observaciones: null, foto_url: null,
    ...over,
  };
}

function generar(mediciones: Medicion[], hoyISO?: string) {
  const analisis = analizarComposicionCorporal(mediciones, { hoyISO });
  const recomendaciones = generarRecomendaciones(analisis);
  return generarObservaciones({ analisis, recomendaciones });
}

const todasLasObservaciones = (r: ReturnType<typeof generar>) =>
  r.bloques.flatMap((b) => b.observaciones);

const reglas = (r: ReturnType<typeof generar>) =>
  todasLasObservaciones(r).map((o) => o.trazabilidad.ruleId);

// Serie de tres mediciones con evolución clara.
const SERIE_TRES = [
  medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 82, grasa_pct: 24, masa_muscular_kg: 34, masa_grasa_kg: 19.7 }),
  medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 80, grasa_pct: 23, masa_muscular_kg: 35, masa_grasa_kg: 18.4 }),
  medicion({ id: "m3", fecha: "2026-03-01", peso_kg: 78, grasa_pct: 22, masa_muscular_kg: 36, masa_grasa_kg: 17.2 }),
];

describe("integridad del catálogo", () => {
  it("toda plantilla tiene evaluador, prioridad y conocimiento resoluble", () => {
    for (const [id, p] of Object.entries(PLANTILLAS)) {
      expect(EVALUADORES[id], `evaluador de ${id}`).toBeDefined();
      expect(PRIORIDAD_POR_PLANTILLA[id], `prioridad de ${id}`).toBeDefined();
      for (const clave of p.conocimiento) {
        expect(CONOCIMIENTO[clave], `conocimiento ${clave} de ${id}`).toBeDefined();
      }
    }
  });

  it("no hay evaluadores huérfanos sin plantilla declarada", () => {
    for (const id of Object.keys(EVALUADORES)) {
      expect(PLANTILLAS[id], `plantilla de ${id}`).toBeDefined();
    }
  });

  it("los casos rechazados están documentados con su motivo", () => {
    expect(CASOS_RECHAZADOS.length).toBeGreaterThan(0);
    for (const c of CASOS_RECHAZADOS) {
      expect(c.caso).toBeTruthy();
      expect(c.motivo.length).toBeGreaterThan(30);
    }
  });
});

describe("sin mediciones", () => {
  const r = generar([]);

  it("emite el alcance pero ninguna observación de composición ni evolución", () => {
    expect(reglas(r)).toContain("E-01-alcance-analisis");
    expect(r.porBloque.body_composition.estado).toBe("sin_datos");
    expect(r.porBloque.trend.observaciones.every((o) => o.trazabilidad.ruleId !== "T-01-serie-con-direccion")).toBe(true);
  });

  it("no inventa calidad de medición sobre un registro inexistente", () => {
    expect(reglas(r)).not.toContain("MQ-03-sin-incidencias");
  });
});

describe("medición única", () => {
  const r = generar([medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, grasa_pct: 22 })]);

  it("declara que no hay evolución y no emite comparación", () => {
    expect(reglas(r)).toContain("E-01-alcance-analisis");
    expect(reglas(r)).toContain("T-03-historico-insuficiente");
    expect(reglas(r)).not.toContain("BC-01-cambio-significativo");
    expect(reglas(r)).not.toContain("BC-04-coocurrencia-peso-grasa");
  });
});

describe("múltiples mediciones", () => {
  const r = generar(SERIE_TRES);

  it("emite composición, evolución e interpretación", () => {
    expect(reglas(r)).toContain("BC-01-cambio-significativo");
    expect(reglas(r)).toContain("T-01-serie-con-direccion");
    expect(r.porBloque.interpretation.estado).toBe("emitido");
  });

  it("describe la coincidencia peso/grasa sin afirmar proporción", () => {
    const obs = todasLasObservaciones(r).find((o) => o.trazabilidad.ruleId === "BC-04-coocurrencia-peso-grasa");
    expect(obs).toBeDefined();
    expect(obs!.texto).toContain("no permite establecer qué proporción");
  });

  it("el patrón de recomposición se enuncia como compatibilidad, nunca como confirmación", () => {
    const obs = todasLasObservaciones(r).find((o) => o.trazabilidad.ruleId === "I-02-patron-recomposicion");
    expect(obs).toBeDefined();
    expect(obs!.texto).toContain("compatible");
    expect(obs!.texto).toContain("no equivale a su confirmación");
  });
});

describe("extensión y estilo", () => {
  const informes = [generar([]), generar([medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 })]), generar(SERIE_TRES)];

  it("cada observación tiene entre 2 y 5 oraciones", () => {
    for (const r of informes) {
      for (const o of todasLasObservaciones(r)) {
        expect(o.oraciones.length, `${o.id}`).toBeGreaterThanOrEqual(MIN_ORACIONES);
        expect(o.oraciones.length, `${o.id}`).toBeLessThanOrEqual(MAX_ORACIONES);
      }
    }
  });

  it("el texto es la unión exacta de sus oraciones", () => {
    for (const r of informes) {
      for (const o of todasLasObservaciones(r)) {
        expect(o.texto).toBe(o.oraciones.join(" "));
      }
    }
  });

  it("no repite la misma variable en dos observaciones del mismo bloque", () => {
    for (const r of informes) {
      for (const bloque of r.bloques) {
        const vistas = new Set<string>();
        for (const o of bloque.observaciones) {
          for (const v of o.variables) {
            expect(vistas.has(v), `${v} repetida en ${bloque.bloque}`).toBe(false);
            vistas.add(v);
          }
        }
      }
    }
  });
});

describe("auditoría de vocabulario", () => {
  // Incluye toda forma deóntica del verbo «deber», incluidas las
  // impersonales («las cifras deben leerse»): aunque no se dirijan a nadie,
  // siguen imponiendo una conducta, y este motor solo describe.
  const PROHIBIDAS = [
    "debería", "deberia", "debes", "debe ", "deben ", "conviene",
    "es recomendable", "ideal", "óptimo", "optimo", "riesgo de", "saludable",
    "correcto", "incorrecto", "preocupante", "grave", "patológico",
    "patologico", "normal", "anormal",
  ];

  const informes = [
    generar([]),
    generar([medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, grasa_pct: 25, whr: 0.9 })]),
    generar(SERIE_TRES),
    generar([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, masa_grasa_kg: 20, masa_libre_grasa_kg: 58 }),
      medicion({ id: "m2", fecha: "2026-01-05", peso_kg: 70, masa_grasa_kg: 18, masa_libre_grasa_kg: 52 }),
    ]),
  ];

  it("ningún texto emitido contiene vocabulario prohibido", () => {
    for (const r of informes) {
      const texto = todasLasObservaciones(r).map((o) => o.texto).join(" ").toLowerCase();
      for (const p of PROHIBIDAS) {
        expect(texto, `palabra prohibida: ${p}`).not.toContain(p);
      }
    }
  });

  it("no emite lenguaje diagnóstico, prescriptivo ni motivacional", () => {
    const VETADAS = [
      "diagnóstic", "pronóstic", "tratamiento", "prescrib", "sarcopenia",
      "enfermedad", "patolog", "felicidades", "excelente", "enhorabuena",
    ];
    for (const r of informes) {
      const texto = todasLasObservaciones(r).map((o) => o.texto).join(" ").toLowerCase();
      for (const p of VETADAS) {
        expect(texto, `término vetado: ${p}`).not.toContain(p);
      }
    }
  });

  it("no emite recomendaciones nutricionales ni deportivas", () => {
    for (const r of informes) {
      const texto = todasLasObservaciones(r).map((o) => o.texto).join(" ").toLowerCase();
      for (const p of ["dieta", "caloría", "caloria", "proteína al día", "entrena ", "ejercicio de"]) {
        expect(texto, `término vetado: ${p}`).not.toContain(p);
      }
    }
  });

  it("nunca afirma causalidad", () => {
    for (const r of informes) {
      const texto = todasLasObservaciones(r).map((o) => o.texto).join(" ").toLowerCase();
      for (const p of ["se debe a", "causado por", "porque el cliente", "gracias a"]) {
        expect(texto, `causalidad: ${p}`).not.toContain(p);
      }
    }
  });
});

describe("trazabilidad", () => {
  const r = generar(SERIE_TRES);

  it("toda observación cita su regla y su conocimiento de origen", () => {
    for (const o of todasLasObservaciones(r)) {
      expect(o.trazabilidad.ruleId).toBeTruthy();
      expect(PLANTILLAS[o.trazabilidad.ruleId]).toBeDefined();
      expect(o.trazabilidad.evidenceLevel).toBeTruthy();
      expect(o.trazabilidad.population).toBeTruthy();
    }
  });

  it("toda observación con conocimiento declarado cita referencias y prohibiciones", () => {
    for (const o of todasLasObservaciones(r)) {
      const plantilla = PLANTILLAS[o.trazabilidad.ruleId];
      if (plantilla.conocimiento.length === 0) continue;
      expect(o.trazabilidad.referenceIds.length, `${o.id}`).toBeGreaterThan(0);
      expect(o.trazabilidad.knowledgeIds.length, `${o.id}`).toBeGreaterThan(0);
      expect(o.trazabilidad.prohibitedInterpretations.length, `${o.id}`).toBeGreaterThan(0);
    }
  });

  it("los hallazgos citados existen en el análisis de origen", () => {
    const analisis = analizarComposicionCorporal(SERIE_TRES);
    const idsValidos = new Set([
      ...analisis.hallazgos.map((h) => h.id),
      ...analisis.avisos.map((a) => a.id),
      ...analisis.avisos.map((a) => `calidad:${a.id}`),
      ...analisis.comparacion.map((c) => `estabilidad:${c.variable}`),
      ...analisis.tendencias.map((t) => `tendencia:${t.variable}`),
    ]);
    for (const o of todasLasObservaciones(r)) {
      for (const f of o.trazabilidad.findingIds) {
        expect(idsValidos.has(f), `hallazgo inexistente: ${f}`).toBe(true);
      }
    }
  });

  it("el nivel de evidencia nunca supera al del conocimiento más débil invocado", () => {
    const orden = { alto: 0, moderado: 1, bajo: 2, bajo_para_poblacion_brey: 3, insuficiente: 4 };
    for (const o of todasLasObservaciones(r)) {
      const claves = PLANTILLAS[o.trazabilidad.ruleId].conocimiento;
      if (claves.length === 0) continue;
      const peor = Math.max(...claves.map((c) => orden[CONOCIMIENTO[c].nivelEvidencia as keyof typeof orden]));
      expect(orden[o.trazabilidad.evidenceLevel as keyof typeof orden]).toBe(peor);
    }
  });
});

describe("calidad de medición", () => {
  it("una inconsistencia de masas produce observación crítica y condiciona la lectura", () => {
    const r = generar([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, masa_grasa_kg: 20, masa_libre_grasa_kg: 58 }),
    ]);
    const obs = todasLasObservaciones(r).find((o) => o.trazabilidad.ruleId === "MQ-01-inconsistencia-interna");
    expect(obs).toBeDefined();
    expect(obs!.texto).toContain("sin identificar cuál");
  });

  it("sin incidencias declara coherencia interna, no exactitud", () => {
    const r = generar(SERIE_TRES);
    const obs = todasLasObservaciones(r).find((o) => o.trazabilidad.ruleId === "MQ-03-sin-incidencias");
    expect(obs).toBeDefined();
    expect(obs!.texto).toContain("no que los valores sean exactos");
  });
});

describe("hallazgos contradictorios y limitaciones", () => {
  it("peso y grasa en direcciones opuestas no activa la coocurrencia", () => {
    const r = generar([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 78, grasa_pct: 22 }),
      medicion({ id: "m2", fecha: "2026-03-01", peso_kg: 82, grasa_pct: 20 }),
    ]);
    expect(reglas(r)).not.toContain("BC-04-coocurrencia-peso-grasa");
  });

  it("declara las clasificaciones no disponibles", () => {
    const r = generar([medicion({ id: "m1", fecha: "2026-01-01", grasa_pct: 25, whr: 0.9 })]);
    expect(reglas(r)).toContain("I-03-clasificacion-no-disponible");
  });

  it("declara los ámbitos sobre los que no se pronuncia", () => {
    const r = generar(SERIE_TRES);
    const obs = todasLasObservaciones(r).find((o) => o.trazabilidad.ruleId === "SL-01-ambitos-no-cubiertos");
    expect(obs).toBeDefined();
    expect(obs!.texto.toLowerCase()).toContain("nutrición");
  });
});

describe("recomendaciones", () => {
  it("resume las de prioridad alta sin citar su texto literal", () => {
    const r = generar([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, masa_grasa_kg: 20, masa_libre_grasa_kg: 58 }),
    ]);
    const obs = todasLasObservaciones(r).find((o) => o.trazabilidad.ruleId === "RS-01-acciones-prioritarias");
    expect(obs).toBeDefined();
    expect(obs!.trazabilidad.recommendationIds.length).toBeGreaterThan(0);
    // El Recommendation Engine usa «conviene»; el COG no puede reproducirlo.
    expect(obs!.texto.toLowerCase()).not.toContain("conviene");
  });

  it("con recomendaciones emitidas no activa la plantilla de ausencia", () => {
    const r = generar(SERIE_TRES);
    expect(reglas(r)).not.toContain("RS-03-sin-recomendaciones");
  });
});

describe("determinismo y no mutación", () => {
  const desordenadas = [
    medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 80, grasa_pct: 23 }),
    medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 82, grasa_pct: 24 }),
    medicion({ id: "m3", fecha: "2026-03-01", peso_kg: 78, grasa_pct: 22 }),
  ];

  it("dos ejecuciones producen una salida profundamente idéntica", () => {
    const a = generar(desordenadas, "2026-06-01");
    const b = generar(desordenadas, "2026-06-01");
    expect(a).toEqual(b);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("no muta el análisis ni las recomendaciones recibidas", () => {
    const analisis = analizarComposicionCorporal(desordenadas);
    const recomendaciones = generarRecomendaciones(analisis);
    const copiaA = JSON.parse(JSON.stringify(analisis));
    const copiaR = JSON.parse(JSON.stringify(recomendaciones));

    generarObservaciones({ analisis, recomendaciones });

    expect(analisis).toEqual(copiaA);
    expect(recomendaciones).toEqual(copiaR);
  });

  it("los bloques salen siempre en el mismo orden editorial", () => {
    const orden = generar(SERIE_TRES).bloques.map((b) => b.bloque);
    expect(orden[0]).toBe("executive");
    expect(orden[1]).toBe("measurement_quality");
    expect(orden[orden.length - 1]).toBe("overall_summary");
  });

  it("los bloques sin datos se declaran en meta", () => {
    const r = generar([]);
    expect(r.meta.bloquesSinDatos).toContain("body_composition");
    expect(r.meta.plantillasEvaluadas).toBe(Object.keys(PLANTILLAS).length);
  });
});
