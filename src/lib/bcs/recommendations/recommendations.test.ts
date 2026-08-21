import { describe, expect, it } from "vitest";
import { analizarComposicionCorporal } from "@/lib/bcs/analysis";
import { generarRecomendaciones } from "./index";
import { REGLAS, reglasSinEvidencia } from "./reglas";
import { PLANTILLAS } from "./plantillas";
import { CATEGORIAS } from "./categorias";
import { PRIORIDADES } from "./prioridad";
import type { Medicion } from "@/lib/bcs/tipos";

// ── Pruebas del Recommendation Engine (Sprint BCS-4.0) ─────────────────────
// Aserciones sobre reglas concretas, nunca snapshots: un snapshot pasaría a
// verde tras un cambio de redacción sin decir qué se rompió.

function medicion(over: Partial<Medicion> & { id: string; fecha: string }): Medicion {
  return {
    cliente_id: "cli-1",
    estado: "vigente",
    altura_cm: null, peso_kg: null, imc: null, grasa_pct: null,
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

const generar = (mediciones: Medicion[], hoyISO?: string) =>
  generarRecomendaciones(analizarComposicionCorporal(mediciones, { hoyISO }));

const ids = (r: ReturnType<typeof generar>) => r.recomendaciones.map((x) => x.regla);

describe("integridad del catálogo", () => {
  it("toda regla apunta a una evidencia existente", () => {
    expect(reglasSinEvidencia()).toEqual([]);
  });

  it("toda regla apunta a una plantilla, categoría y prioridad existentes", () => {
    for (const regla of REGLAS) {
      expect(PLANTILLAS[regla.plantilla], `plantilla de ${regla.id}`).toBeDefined();
      expect(CATEGORIAS[regla.categoria], `categoría de ${regla.id}`).toBeDefined();
      expect(PRIORIDADES[regla.prioridad], `prioridad de ${regla.id}`).toBeDefined();
    }
  });

  it("ningún id de regla está repetido", () => {
    const vistos = REGLAS.map((r) => r.id);
    expect(new Set(vistos).size).toBe(vistos.length);
  });
});

describe("sin mediciones", () => {
  it("recomienda registrar la primera y no emite nada de composición", () => {
    const r = generar([]);
    expect(ids(r)).toContain("R-07-sin-mediciones");
    expect(ids(r)).not.toContain("R-11-cambio-significativo");
    expect(r.recomendaciones[0].prioridad).toBe("alta");
  });
});

describe("una medición", () => {
  it("recomienda una segunda para permitir comparación", () => {
    const r = generar([medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 })]);
    expect(ids(r)).toContain("R-08-una-medicion");
    expect(ids(r)).not.toContain("R-07-sin-mediciones");
    expect(ids(r)).not.toContain("R-09-dos-mediciones");
  });

  it("declara que el sistema no fija el intervalo entre mediciones", () => {
    const r = generar([medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 })]);
    const rec = r.recomendaciones.find((x) => x.regla === "R-08-una-medicion")!;
    expect(rec.limitaciones.join(" ")).toContain("no define un intervalo");
  });
});

describe("dos mediciones", () => {
  it("indica que aún no hay tendencia sostenida", () => {
    const r = generar([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
      medicion({ id: "m2", fecha: "2026-03-01", peso_kg: 77 }),
    ]);
    expect(ids(r)).toContain("R-09-dos-mediciones");
    expect(ids(r)).not.toContain("R-10-seguimiento-activo");
  });
});

describe("hallazgos múltiples", () => {
  const tres = [
    medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 82, grasa_pct: 24, masa_muscular_kg: 34 }),
    medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 80, grasa_pct: 23, masa_muscular_kg: 35 }),
    medicion({ id: "m3", fecha: "2026-03-01", peso_kg: 78, grasa_pct: 22, masa_muscular_kg: 36 }),
  ];

  it("emite composición, seguimiento activo y agrupa por regla", () => {
    const r = generar(tres);
    expect(ids(r)).toContain("R-11-cambio-significativo");
    expect(ids(r)).toContain("R-10-seguimiento-activo");
    // Varios cambios significativos producen UNA recomendación agrupada.
    expect(ids(r).filter((x) => x === "R-11-cambio-significativo")).toHaveLength(1);
  });

  it("las variables relacionadas no se repiten", () => {
    const rec = generar(tres).recomendaciones.find((x) => x.regla === "R-11-cambio-significativo")!;
    expect(new Set(rec.variablesRelacionadas).size).toBe(rec.variablesRelacionadas.length);
  });
});

describe("sin hallazgos relevantes", () => {
  it("dos mediciones idénticas no producen recomendación de cambio significativo", () => {
    const r = generar([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
      medicion({ id: "m2", fecha: "2026-03-01", peso_kg: 80 }),
    ]);
    expect(ids(r)).not.toContain("R-11-cambio-significativo");
    expect(ids(r)).toContain("R-12-cambio-bajo-umbral");
  });
});

describe("control de calidad", () => {
  it("inconsistencia de masas produce prioridad alta", () => {
    const r = generar([
      medicion({
        id: "m1", fecha: "2026-01-01",
        peso_kg: 80, masa_grasa_kg: 20, masa_libre_grasa_kg: 58, // desvío 2 kg
      }),
    ]);
    const rec = r.recomendaciones.find((x) => x.regla === "R-01-inconsistencia-masas");
    expect(rec).toBeDefined();
    expect(rec!.prioridad).toBe("alta");
    expect(rec!.categoria).toBe("control_de_calidad");
    expect(rec!.evidencia.origen).toBe("handbook");
  });

  it("una masa mayor que el peso produce recomendación de corrección", () => {
    const r = generar([medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 70, masa_muscular_kg: 75 })]);
    expect(ids(r)).toContain("R-02-masa-supera-peso");
  });

  it("dos mediciones con la misma fecha se reportan", () => {
    const r = generar([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
      medicion({ id: "m2", fecha: "2026-01-01", peso_kg: 81 }),
    ]);
    expect(ids(r)).toContain("R-05-fecha-duplicada");
  });

  it("una medición anulada que llega al análisis se reporta con prioridad alta", () => {
    const r = generar([medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, estado: "anulada" })]);
    const rec = r.recomendaciones.find((x) => x.regla === "R-06-medicion-anulada")!;
    expect(rec.prioridad).toBe("alta");
  });
});

describe("datos insuficientes para clasificar", () => {
  it("% grasa y WHR generan recomendación de interpretación, no de composición", () => {
    const r = generar([medicion({ id: "m1", fecha: "2026-01-01", grasa_pct: 25, whr: 0.9 })]);
    const bloqueadas = r.recomendaciones.filter((x) => x.regla === "R-14-clasificacion-bloqueada");
    expect(bloqueadas.length).toBeGreaterThanOrEqual(2);
    expect(bloqueadas.every((x) => x.categoria === "interpretacion")).toBe(true);
    expect(bloqueadas.every((x) => x.prioridad === "informativa")).toBe(true);
  });
});

describe("prioridades y orden", () => {
  const conTodo = [
    medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 82, grasa_pct: 24 }),
    medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 80, grasa_pct: 23 }),
    medicion({
      id: "m3", fecha: "2026-03-01",
      peso_kg: 78, grasa_pct: 22, masa_grasa_kg: 20, masa_libre_grasa_kg: 50, // inconsistencia
    }),
  ];

  it("las de prioridad alta salen primero", () => {
    const r = generar(conTodo);
    expect(r.recomendaciones[0].prioridad).toBe("alta");
  });

  it("el orden nunca retrocede en prioridad", () => {
    const peso = { alta: 0, media: 1, baja: 2, informativa: 3 } as const;
    const r = generar(conTodo);
    const secuencia = r.recomendaciones.map((x) => peso[x.prioridad]);
    expect([...secuencia].sort((a, b) => a - b)).toEqual(secuencia);
  });

  it("el resumen cuenta exactamente lo emitido", () => {
    const r = generar(conTodo);
    const total = Object.values(r.resumen).reduce((a, b) => a + b, 0);
    expect(total).toBe(r.recomendaciones.length);
  });
});

describe("duplicados y reglas conflictivas", () => {
  it("ningún id de recomendación se repite", () => {
    const r = generar([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 70, masa_muscular_kg: 75, grasa_pct: 24 }),
      medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 68, masa_muscular_kg: 74, grasa_pct: 22 }),
    ]);
    const vistos = r.recomendaciones.map((x) => x.id);
    expect(new Set(vistos).size).toBe(vistos.length);
  });

  it("dos reglas sobre el mismo hallazgo dejan solo la de mayor prioridad", () => {
    // Un valor imposible dispara R-02 (alta); ninguna otra regla puede
    // quedarse con el mismo origen y menor prioridad.
    const r = generar([medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 70, masa_grasa_kg: 90 })]);
    const porOrigen = new Map<string, string[]>();
    for (const rec of r.recomendaciones) {
      if (rec.origenHallazgos.length === 0) continue;
      const clave = [...rec.origenHallazgos].sort().join("|");
      porOrigen.set(clave, [...(porOrigen.get(clave) ?? []), rec.regla]);
    }
    for (const reglas of porOrigen.values()) {
      expect(reglas).toHaveLength(1);
    }
  });
});

describe("trazabilidad y contrato", () => {
  const r = generar([
    medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 82, grasa_pct: 24 }),
    medicion({ id: "m2", fecha: "2026-03-01", peso_kg: 78, grasa_pct: 22 }),
  ]);

  it("toda recomendación cita regla, evidencia y fundamento", () => {
    for (const rec of r.recomendaciones) {
      expect(rec.regla).toBeTruthy();
      expect(rec.evidencia.referencia).toBeTruthy();
      expect(rec.evidencia.cita).toBeTruthy();
      expect(rec.fundamento).toBeTruthy();
      expect(rec.accionProfesional).toBeTruthy();
    }
  });

  it("no queda ningún marcador de interpolación sin sustituir", () => {
    for (const rec of r.recomendaciones) {
      const textos = [rec.titulo, rec.descripcion, rec.accionProfesional, rec.seguimiento ?? ""];
      for (const t of textos) expect(t).not.toMatch(/\{\w+\}/);
    }
  });

  it("declara los ámbitos sobre los que no puede recomendar", () => {
    const ambitos = r.limitaciones.map((l) => l.ambito.toLowerCase());
    expect(ambitos.some((a) => a.includes("nutrición"))).toBe(true);
    expect(ambitos.some((a) => a.includes("entrenamiento"))).toBe(true);
    expect(ambitos.some((a) => a.includes("derivación"))).toBe(true);
    expect(ambitos.some((a) => a.includes("periodicidad"))).toBe(true);
  });

  it("nunca emite vocabulario prescriptivo ni valorativo en el texto que redacta", () => {
    const prohibidas = [
      "deberías", "deberias", "te recomiendo", "es mejor", "come ", "evita ",
      "ideal", "óptimo", "optimo", "perfecto", "saludable", "riesgoso",
    ];

    // Se revisa SOLO la prosa que el motor redacta. `evidencia.cita` queda
    // fuera a propósito: es una transcripción literal de la fuente, y el
    // BCS Design Handbook 12 dice textualmente "solo evita ruido visual".
    // Alterar una cita para que pase un test sería falsificar la evidencia;
    // la prohibición aplica a lo que el motor afirma, no a lo que reproduce.
    const redactado = r.recomendaciones
      .flatMap((rec) => [
        rec.titulo,
        rec.descripcion,
        rec.fundamento,
        rec.accionProfesional,
        rec.seguimiento ?? "",
        ...rec.limitaciones,
      ])
      .concat(r.limitaciones.map((l) => l.motivo))
      .join(" ")
      .toLowerCase();

    for (const p of prohibidas) {
      expect(redactado, `palabra prohibida: ${p}`).not.toContain(p);
    }
  });
});

describe("determinismo", () => {
  const mediciones = [
    medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 80, grasa_pct: 23 }),
    medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 82, grasa_pct: 24 }),
    medicion({ id: "m3", fecha: "2026-03-01", peso_kg: 78, grasa_pct: 22 }),
  ];

  it("dos ejecuciones producen una salida profundamente idéntica", () => {
    const a = generar(mediciones, "2026-06-01");
    const b = generar(mediciones, "2026-06-01");
    expect(a).toEqual(b);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("no muta el análisis recibido", () => {
    const analisis = analizarComposicionCorporal(mediciones);
    const copia = JSON.parse(JSON.stringify(analisis));
    generarRecomendaciones(analisis);
    expect(analisis).toEqual(copia);
  });
});
