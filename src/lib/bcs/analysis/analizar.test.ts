import { describe, expect, it } from "vitest";
import { analizarComposicionCorporal } from "./index";
import { compararMediciones, diasEntre } from "./comparacion";
import { calcularTendencias } from "./tendencias";
import { evaluarCalidad } from "./calidad";
import type { Medicion } from "@/lib/bcs/tipos";

// ── Pruebas de la capa de análisis del BCS (Sprint I-03) ───────────────────
// Aserciones concretas sobre reglas concretas — sin snapshots gigantes, que
// pasan a verde por inercia y no explican qué se rompió.

/** Medición con todas las variables en null salvo lo que el caso necesite. */
function medicion(over: Partial<Medicion> & { id: string; fecha: string }): Medicion {
  return {
    cliente_id: "cli-1",
    estado: "vigente",
    altura_cm: null,
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
    dispositivo: null,
    ...over,
  };
}

const buscar = (comparacion: ReturnType<typeof compararMediciones>, variable: string) =>
  comparacion.find((c) => c.variable === variable)!;

describe("cantidad de mediciones", () => {
  it("0 mediciones — sin datos, sin comparación y con resumen explícito", () => {
    const a = analizarComposicionCorporal([]);
    expect(a.cantidadMediciones).toBe(0);
    expect(a.suficiencia).toBe("sin_datos");
    expect(a.comparacion).toEqual([]);
    expect(a.medicionActualId).toBeNull();
    expect(a.fechaInicial).toBeNull();
    expect(a.hallazgos.map((h) => h.id)).toContain("datos_insuficientes:sin_mediciones");
    expect(a.resumen.suficiencia).toBe("sin_datos");
  });

  it("1 medición — insuficiente, sin comparación, pero con estado actual", () => {
    const a = analizarComposicionCorporal([medicion({ id: "m1", fecha: "2026-01-10", peso_kg: 80 })]);
    expect(a.suficiencia).toBe("insuficiente");
    expect(a.comparacion).toEqual([]);
    expect(a.medicionAnteriorId).toBeNull();
    expect(a.hallazgos.map((h) => h.id)).toContain("datos_insuficientes:una_medicion");
    expect(a.avisos.some((av) => av.id === "historial_insuficiente")).toBe(true);
  });

  it("2 mediciones completas — comparación disponible y suficiencia parcial", () => {
    const a = analizarComposicionCorporal([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, grasa_pct: 25 }),
      medicion({ id: "m2", fecha: "2026-03-01", peso_kg: 78, grasa_pct: 23 }),
    ]);
    expect(a.suficiencia).toBe("parcial");
    expect(a.medicionActualId).toBe("m2");
    expect(a.medicionAnteriorId).toBe("m1");
    expect(buscar(a.comparacion, "peso_kg").deltaAbsoluto).toBe(-2);
  });

  it("3+ mediciones — habilita tendencia con suficiencia plena", () => {
    const a = analizarComposicionCorporal([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
      medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 79 }),
      medicion({ id: "m3", fecha: "2026-03-01", peso_kg: 78 }),
    ]);
    expect(a.suficiencia).toBe("suficiente");
    const peso = a.tendencias.find((t) => t.variable === "peso_kg")!;
    expect(peso.estado).toBe("descendente");
    expect(peso.puntosUsados).toBe(3);
    expect(peso.cambioNeto).toBe(-2);
  });
});

describe("comparación — nulls y división por cero", () => {
  const base = medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 });

  it("null nunca se trata como cero: reporta el motivo de la ausencia", () => {
    const actual = medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 78, grasa_pct: 20 });
    const fila = buscar(compararMediciones(base, actual), "grasa_pct");
    expect(fila.disponibilidad).toBe("dato_anterior_ausente");
    expect(fila.deltaAbsoluto).toBeNull();
    expect(fila.direccion).toBe("indeterminada");
    expect(fila.razon).toContain("medición anterior");
  });

  it("ambos ausentes se reporta explícitamente, no se omite la fila", () => {
    const actual = medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 78 });
    expect(buscar(compararMediciones(base, actual), "smi").disponibilidad).toBe("ambos_ausentes");
  });

  it("valor anterior cero — delta absoluto sí, porcentual null", () => {
    const anterior = medicion({ id: "m1", fecha: "2026-01-01", grasa_visceral_idx: 0 });
    const actual = medicion({ id: "m2", fecha: "2026-02-01", grasa_visceral_idx: 4 });
    const fila = buscar(compararMediciones(anterior, actual), "grasa_visceral_idx");
    expect(fila.deltaAbsoluto).toBe(4);
    expect(fila.deltaPorcentual).toBeNull();
    expect(fila.direccion).toBe("aumento");
  });
});

describe("umbrales de significancia — solo los documentados", () => {
  it("peso: cambio bajo 0.2 kg es insignificante y estable", () => {
    const anterior = medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 });
    const actual = medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 80.1 });
    const fila = buscar(compararMediciones(anterior, actual), "peso_kg");
    expect(fila.significancia).toBe("insignificante");
    expect(fila.direccion).toBe("estable");
    expect(fila.umbralAplicado).toBe(0.2);
  });

  it("peso: cambio sobre 0.2 kg es significativo", () => {
    const anterior = medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 });
    const actual = medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 79 });
    expect(buscar(compararMediciones(anterior, actual), "peso_kg").significancia).toBe("significativa");
  });

  it("% grasa: cambio bajo 0.3 pp es insignificante", () => {
    const anterior = medicion({ id: "m1", fecha: "2026-01-01", grasa_pct: 25 });
    const actual = medicion({ id: "m2", fecha: "2026-02-01", grasa_pct: 25.2 });
    const fila = buscar(compararMediciones(anterior, actual), "grasa_pct");
    expect(fila.significancia).toBe("insignificante");
    expect(fila.umbralAplicado).toBe(0.3);
  });

  it("métrica sin umbral: hay dirección pero la significancia es no_definida", () => {
    const anterior = medicion({ id: "m1", fecha: "2026-01-01", masa_muscular_kg: 32 });
    const actual = medicion({ id: "m2", fecha: "2026-02-01", masa_muscular_kg: 33.3 });
    const fila = buscar(compararMediciones(anterior, actual), "masa_muscular_kg");
    expect(fila.direccion).toBe("aumento");
    expect(fila.significancia).toBe("no_definida");
    expect(fila.umbralAplicado).toBeNull();
    expect(fila.razon).toContain("no hay un umbral definido");
  });

  it("una variable sin umbral nunca se declara estable por ser un cambio pequeño", () => {
    const anterior = medicion({ id: "m1", fecha: "2026-01-01", masa_muscular_kg: 32 });
    const actual = medicion({ id: "m2", fecha: "2026-02-01", masa_muscular_kg: 32.01 });
    expect(buscar(compararMediciones(anterior, actual), "masa_muscular_kg").direccion).toBe("aumento");
  });
});

describe("consistencia masa/peso — tolerancia ±0.5 kg", () => {
  it("dentro de tolerancia no genera alerta", () => {
    const m = medicion({
      id: "m1",
      fecha: "2026-01-01",
      peso_kg: 80,
      masa_grasa_kg: 20,
      masa_libre_grasa_kg: 59.7, // desvío 0.3 kg
    });
    const incidencias = evaluarCalidad({ historicoDesc: [m] });
    expect(incidencias.some((i) => i.id.startsWith("suma_masas"))).toBe(false);
  });

  it("fuera de tolerancia genera alerta", () => {
    const m = medicion({
      id: "m1",
      fecha: "2026-01-01",
      peso_kg: 80,
      masa_grasa_kg: 20,
      masa_libre_grasa_kg: 58, // desvío 2 kg
    });
    const incidencia = evaluarCalidad({ historicoDesc: [m] }).find((i) => i.id.startsWith("suma_masas"));
    expect(incidencia?.clase).toBe("alerta");
    expect(incidencia?.descripcion).toContain("2.0 kg");
  });

  it("una masa mayor que el peso se marca como imposible", () => {
    const m = medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 70, masa_muscular_kg: 75 });
    const ids = evaluarCalidad({ historicoDesc: [m] }).map((i) => i.id);
    expect(ids.some((id) => id.startsWith("valor_imposible:masa_muscular_kg"))).toBe(true);
  });
});

describe("clasificaciones que requieren datos no capturados", () => {
  it("% grasa y WHR emiten limitación por falta de sexo/edad", () => {
    const a = analizarComposicionCorporal([
      medicion({ id: "m1", fecha: "2026-01-01", grasa_pct: 25, whr: 0.9 }),
    ]);
    const limitaciones = a.avisos.filter((av) => av.tipo === "limitacion");
    expect(limitaciones.some((l) => l.id.includes("grasa_pct"))).toBe(true);
    expect(limitaciones.some((l) => l.id.includes("whr"))).toBe(true);
  });

  it("grasa visceral emite limitación por falta de escala del fabricante", () => {
    const a = analizarComposicionCorporal([
      medicion({ id: "m1", fecha: "2026-01-01", grasa_visceral_idx: 8 }),
    ]);
    const limitacion = a.avisos.find((av) => av.id.includes("grasa_visceral_idx"));
    expect(limitacion?.tipo).toBe("limitacion");
    expect(limitacion?.descripcion.toLowerCase()).toContain("escala");
  });
});

describe("orden, inmutabilidad y determinismo", () => {
  const desordenadas = [
    medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 79 }),
    medicion({ id: "m3", fecha: "2026-03-01", peso_kg: 78 }),
    medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
  ];

  it("ordena cronológicamente sin importar el orden de entrada", () => {
    const a = analizarComposicionCorporal(desordenadas);
    expect(a.medicionActualId).toBe("m3");
    expect(a.medicionAnteriorId).toBe("m2");
    expect(a.fechaInicial).toBe("2026-01-01");
    expect(a.fechaFinal).toBe("2026-03-01");
  });

  it("no muta el arreglo recibido ni sus elementos", () => {
    const entrada = [...desordenadas];
    const copiaProfunda = JSON.parse(JSON.stringify(entrada));
    analizarComposicionCorporal(entrada);
    expect(entrada.map((m) => m.id)).toEqual(["m2", "m3", "m1"]);
    expect(entrada).toEqual(copiaProfunda);
  });

  it("dos ejecuciones producen una salida profundamente idéntica", () => {
    const primera = analizarComposicionCorporal(desordenadas, { hoyISO: "2026-06-01" });
    const segunda = analizarComposicionCorporal(desordenadas, { hoyISO: "2026-06-01" });
    expect(primera).toEqual(segunda);
    expect(JSON.stringify(primera)).toBe(JSON.stringify(segunda));
  });
});

describe("tendencias — conservadoras", () => {
  it("0 y 1 punto son insuficientes", () => {
    expect(calcularTendencias([]).find((t) => t.variable === "peso_kg")!.estado).toBe("insuficiente");
    const uno = calcularTendencias([medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 })]);
    expect(uno.find((t) => t.variable === "peso_kg")!.estado).toBe("insuficiente");
  });

  it("2 puntos dan dirección pero no tendencia sostenida", () => {
    const t = calcularTendencias([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
      medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 82 }),
    ]).find((x) => x.variable === "peso_kg")!;
    expect(t.estado).toBe("ascendente");
    expect(t.suficiencia).toBe("parcial");
    expect(t.razon).toContain("no una tendencia sostenida");
  });

  it("serie que sube y baja es variable, nunca una dirección", () => {
    const t = calcularTendencias([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
      medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 84 }),
      medicion({ id: "m3", fecha: "2026-03-01", peso_kg: 79 }),
    ]).find((x) => x.variable === "peso_kg")!;
    expect(t.estado).toBe("variable");
  });

  it("ignora nulls sin convertirlos en cero y cuenta solo los puntos reales", () => {
    const t = calcularTendencias([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
      medicion({ id: "m2", fecha: "2026-02-01" }),
      medicion({ id: "m3", fecha: "2026-03-01", peso_kg: 78 }),
    ]).find((x) => x.variable === "peso_kg")!;
    expect(t.puntosUsados).toBe(2);
    expect(t.cambioNeto).toBe(-2);
  });

  it("no proyecta: la razón de una serie con dirección lo dice explícitamente", () => {
    const t = calcularTendencias([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
      medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 79 }),
      medicion({ id: "m3", fecha: "2026-03-01", peso_kg: 78 }),
    ]).find((x) => x.variable === "peso_kg")!;
    expect(t.razon).toContain("no anticipa");
  });
});

describe("cambios sospechosos — respetan su ventana temporal", () => {
  it("peso: −12 % en 5 días dispara la alerta", () => {
    const incidencias = evaluarCalidad({
      historicoDesc: [
        medicion({ id: "m2", fecha: "2026-01-06", peso_kg: 70 }),
        medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
      ],
    });
    expect(incidencias.some((i) => i.id.startsWith("cambio_sospechoso:peso_kg"))).toBe(true);
  });

  it("peso: el mismo −12 % en 6 meses NO dispara la alerta", () => {
    const incidencias = evaluarCalidad({
      historicoDesc: [
        medicion({ id: "m2", fecha: "2026-07-01", peso_kg: 70 }),
        medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
      ],
    });
    expect(incidencias.some((i) => i.id.startsWith("cambio_sospechoso:peso_kg"))).toBe(false);
  });

  it("fecha futura solo se evalúa si el llamador pasa hoyISO", () => {
    const futura = [medicion({ id: "m1", fecha: "2099-01-01", peso_kg: 80 })];
    expect(evaluarCalidad({ historicoDesc: futura }).some((i) => i.id.startsWith("fecha_futura"))).toBe(false);
    expect(
      evaluarCalidad({ historicoDesc: futura, hoyISO: "2026-01-01" }).some((i) => i.id.startsWith("fecha_futura"))
    ).toBe(true);
  });

  it("dos mediciones con la misma fecha se marcan como duplicado", () => {
    const incidencias = evaluarCalidad({
      historicoDesc: [
        medicion({ id: "m2", fecha: "2026-01-01", peso_kg: 79 }),
        medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
      ],
    });
    expect(incidencias.some((i) => i.id === "fecha_duplicada:2026-01-01")).toBe(true);
  });

  it("una medición anulada que llega al análisis se reporta, no se descarta en silencio", () => {
    const incidencias = evaluarCalidad({
      historicoDesc: [medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, estado: "anulada" })],
    });
    expect(incidencias.some((i) => i.id === "medicion_anulada:m1")).toBe(true);
  });
});

describe("insights — solo combinan hallazgos ya demostrados", () => {
  it("peso y grasa a la baja: constata la coincidencia sin atribuir la pérdida a la grasa", () => {
    const a = analizarComposicionCorporal([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, grasa_pct: 25 }),
      medicion({ id: "m2", fecha: "2026-03-01", peso_kg: 77, grasa_pct: 23 }),
    ]);
    const insight = a.insights.find((i) => i.id === "insight:peso_y_grasa_misma_direccion");
    expect(insight).toBeDefined();
    expect(insight!.hallazgosBase).toEqual(["cambio:peso_kg", "cambio:grasa_pct"]);
    expect(insight!.descripcion).toContain("no permite establecer qué proporción");
  });

  it("nunca afirma que la evolución es favorable, saludable, ideal ni recomendada", () => {
    const a = analizarComposicionCorporal([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, grasa_pct: 25, masa_muscular_kg: 32 }),
      medicion({ id: "m2", fecha: "2026-03-01", peso_kg: 77, grasa_pct: 23, masa_muscular_kg: 33 }),
    ]);
    const texto = JSON.stringify(a).toLowerCase();
    for (const prohibida of ["favorable", "saludable", "ideal", "óptimo", "optimo", "recomendado", "deberías", "riesgo de"]) {
      expect(texto).not.toContain(prohibida);
    }
  });

  it("con datos insuficientes lo dice explícitamente en vez de quedarse vacío", () => {
    const a = analizarComposicionCorporal([medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 })]);
    expect(a.insights.some((i) => i.id === "insight:sin_base_para_interpretar")).toBe(true);
  });

  it("la suficiencia de un insight nunca supera la del hallazgo más débil", () => {
    const a = analizarComposicionCorporal([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, grasa_pct: 25 }),
      medicion({ id: "m2", fecha: "2026-03-01", peso_kg: 77, grasa_pct: 23 }),
    ]);
    const insight = a.insights.find((i) => i.id === "insight:peso_y_grasa_misma_direccion")!;
    const bases = a.hallazgos.filter((h) => insight.hallazgosBase.includes(h.id));
    expect(bases.every((b) => b.suficiencia === "suficiente")).toBe(true);
    expect(insight.suficiencia).toBe("suficiente");
  });
});

describe("resumen ejecutivo", () => {
  it("la insuficiencia de datos manda sobre cualquier otro contenido", () => {
    const a = analizarComposicionCorporal([medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 })]);
    expect(a.resumen.suficiencia).toBe("insuficiente");
    expect(a.resumen.titulo).toContain("Primera medición");
  });

  it("una alerta de consistencia cambia el tono a atención", () => {
    const a = analizarComposicionCorporal([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, masa_grasa_kg: 20, masa_libre_grasa_kg: 58 }),
      medicion({ id: "m2", fecha: "2026-03-01", peso_kg: 78, masa_grasa_kg: 19, masa_libre_grasa_kg: 59 }),
    ]);
    expect(a.resumen.tono).toBe("atencion");
  });

  it("cita los hallazgos que usó", () => {
    const a = analizarComposicionCorporal([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80 }),
      medicion({ id: "m2", fecha: "2026-03-01", peso_kg: 77 }),
    ]);
    expect(a.resumen.hallazgosUsados.length).toBeGreaterThan(0);
    for (const id of a.resumen.hallazgosUsados) {
      expect(a.hallazgos.some((h) => h.id === id)).toBe(true);
    }
  });
});

describe("utilidades puras", () => {
  it("diasEntre cuenta días calendario", () => {
    expect(diasEntre("2026-01-01", "2026-01-08")).toBe(7);
    expect(diasEntre("2026-01-01", "2026-01-01")).toBe(0);
  });

  it("hallazgos e insights nunca repiten id", () => {
    const a = analizarComposicionCorporal([
      medicion({ id: "m1", fecha: "2026-01-01", peso_kg: 80, grasa_pct: 25 }),
      medicion({ id: "m2", fecha: "2026-02-01", peso_kg: 79, grasa_pct: 24 }),
      medicion({ id: "m3", fecha: "2026-03-01", peso_kg: 78, grasa_pct: 23 }),
    ]);
    expect(new Set(a.hallazgos.map((h) => h.id)).size).toBe(a.hallazgos.length);
    expect(new Set(a.insights.map((i) => i.id)).size).toBe(a.insights.length);
  });
});
