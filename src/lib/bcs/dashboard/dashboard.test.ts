import { describe, expect, it } from "vitest";
import {
  construirDashboard,
  contarPorFiltro,
  escalar,
  etiquetaMes,
  filtrarSeguimiento,
  FILTROS,
  ORDEN_FILTROS,
  segmentosDonut,
  ALERTAS_NO_IMPLEMENTADAS,
} from "./index";
import { indexarClientes } from "./clientes";
import { diasEntre, mesDe, ultimosMeses } from "./fechas";
import { medicionesEnVentana } from "./metricas";
import type { Cliente, EnlacePublico, Medicion } from "@/lib/bcs/tipos";

// ── Pruebas del Dashboard Analytics (Sprint BCS-5.0) ───────────────────────

const HOY = "2026-08-01";

function cliente(over: Partial<Cliente> & { id: string; nombre: string }): Cliente {
  return {
    entrenador_id: "e1",
    estado: "activo",
    created_at: "2026-01-15T10:00:00Z",
    sexo: null,
    fecha_nacimiento: null,
    rangos_dispositivo: null,
    dispositivo_referencia: null,
    ...over,
  };
}

function medicion(over: Partial<Medicion> & { id: string; cliente_id: string; fecha: string }): Medicion {
  return {
    estado: "vigente",
    altura_cm: null, peso_kg: 80, imc: null, grasa_pct: null,
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

function enlace(over: Partial<EnlacePublico> & { id: string; cliente_id: string }): EnlacePublico {
  return {
    token: `t-${over.id}`,
    estado: "activo",
    created_at: "2026-06-10T10:00:00Z",
    ...over,
  };
}

/** Consultorio de referencia: cubre todos los estados posibles. */
function consultorio() {
  const clientes = [
    cliente({ id: "c1", nombre: "Ana", created_at: "2026-08-01T09:00:00Z" }),
    cliente({ id: "c2", nombre: "Bruno", created_at: "2026-03-01T09:00:00Z" }),
    cliente({ id: "c3", nombre: "Carla", estado: "archivado", created_at: "2026-02-01T09:00:00Z" }),
    cliente({ id: "c4", nombre: "Diego", created_at: "2026-01-01T09:00:00Z" }),
    cliente({ id: "c5", nombre: "Elena", estado: "eliminado", created_at: "2026-01-01T09:00:00Z" }),
  ];
  const mediciones = [
    // c1: una sola medición, reciente
    medicion({ id: "m1", cliente_id: "c1", fecha: "2026-08-01" }),
    // c2: seguimiento, tres mediciones
    medicion({ id: "m2", cliente_id: "c2", fecha: "2026-06-01" }),
    medicion({ id: "m3", cliente_id: "c2", fecha: "2026-07-01" }),
    medicion({ id: "m4", cliente_id: "c2", fecha: "2026-07-20" }),
    // c3: archivada, una medición antigua + una anulada
    medicion({ id: "m5", cliente_id: "c3", fecha: "2026-02-10" }),
    medicion({ id: "m6", cliente_id: "c3", fecha: "2026-02-15", estado: "anulada" }),
    // c4: sin mediciones
  ];
  const enlaces = [
    enlace({ id: "e1", cliente_id: "c2" }),
    enlace({ id: "e2", cliente_id: "c3" }), // archivado CON enlace activo
    enlace({ id: "e3", cliente_id: "c4", estado: "revocado" }),
  ];
  return { clientes, mediciones, enlaces, hoyISO: HOY };
}

const D = construirDashboard(consultorio());

// ── Utilidades de fecha ────────────────────────────────────────────────────

describe("utilidades de fecha", () => {
  it("mesDe extrae yyyy-mm de una fecha y de un timestamp", () => {
    expect(mesDe("2026-07-20")).toBe("2026-07");
    expect(mesDe("2026-07-20T10:00:00Z")).toBe("2026-07");
  });

  it("diasEntre cuenta días calendario", () => {
    expect(diasEntre("2026-01-01", "2026-01-08")).toBe(7);
    expect(diasEntre("2026-01-01", "2026-01-01")).toBe(0);
  });

  it("diasEntre acepta timestamps completos", () => {
    expect(diasEntre("2026-01-01T23:00:00Z", "2026-01-02T01:00:00Z")).toBe(1);
  });

  it("ultimosMeses devuelve n meses ascendentes terminando en el actual", () => {
    const m = ultimosMeses("2026-03-15", 4);
    expect(m).toEqual(["2025-12", "2026-01", "2026-02", "2026-03"]);
  });

  it("ultimosMeses cruza el cambio de año correctamente", () => {
    expect(ultimosMeses("2026-01-05", 2)).toEqual(["2025-12", "2026-01"]);
  });

  it("etiquetaMes traduce el número de mes", () => {
    expect(etiquetaMes("2026-01")).toBe("ene");
    expect(etiquetaMes("2026-12")).toBe("dic");
  });
});

// ── Índice ─────────────────────────────────────────────────────────────────

describe("índice de clientes", () => {
  const indice = indexarClientes(consultorio());

  it("indexa un elemento por cliente", () => {
    expect(indice).toHaveLength(5);
  });

  it("separa mediciones vigentes de anuladas", () => {
    const c3 = indice.find((c) => c.cliente.id === "c3")!;
    expect(c3.medicionesVigentes).toHaveLength(1);
    expect(c3.medicionesAnuladas).toHaveLength(1);
  });

  it("ordena las mediciones vigentes de más reciente a más antigua", () => {
    const c2 = indice.find((c) => c.cliente.id === "c2")!;
    expect(c2.medicionesVigentes.map((m) => m.fecha)).toEqual(["2026-07-20", "2026-07-01", "2026-06-01"]);
  });

  it("calcula la última medición y los días transcurridos", () => {
    const c2 = indice.find((c) => c.cliente.id === "c2")!;
    expect(c2.ultimaMedicion).toBe("2026-07-20");
    expect(c2.diasSinMedicion).toBe(12);
  });

  it("un cliente sin mediciones no tiene antigüedad", () => {
    const c4 = indice.find((c) => c.cliente.id === "c4")!;
    expect(c4.ultimaMedicion).toBeNull();
    expect(c4.diasSinMedicion).toBeNull();
  });

  it("separa enlaces activos de revocados", () => {
    const c4 = indice.find((c) => c.cliente.id === "c4")!;
    expect(c4.enlacesActivos).toHaveLength(0);
    expect(c4.enlacesRevocados).toHaveLength(1);
    expect(c4.tieneEnlaceActivo).toBe(false);
  });

  it("seguimiento exige dos o más mediciones vigentes", () => {
    expect(indice.find((c) => c.cliente.id === "c1")!.tieneSeguimiento).toBe(false);
    expect(indice.find((c) => c.cliente.id === "c2")!.tieneSeguimiento).toBe(true);
  });
});

// ── Métricas ───────────────────────────────────────────────────────────────

describe("resumen general", () => {
  it("cuenta clientes por estado", () => {
    expect(D.resumen.clientesActivos).toBe(3);
    expect(D.resumen.clientesArchivados).toBe(1);
    expect(D.resumen.clientesEliminados).toBe(1);
  });

  it("el total de clientes excluye a los eliminados", () => {
    expect(D.resumen.totalClientes).toBe(4);
  });

  it("cuenta mediciones vigentes y anuladas por separado", () => {
    expect(D.resumen.medicionesVigentes).toBe(5);
    expect(D.resumen.medicionesAnuladas).toBe(1);
    expect(D.resumen.totalMediciones).toBe(6);
  });

  it("promedia mediciones vigentes entre clientes no eliminados", () => {
    // 5 vigentes / 4 clientes contables = 1.3 (redondeado a un decimal)
    expect(D.resumen.promedioMediciones).toBe(1.3);
  });

  it("cuenta mediciones del mes en curso", () => {
    expect(D.resumen.medicionesEsteMes).toBe(1);
  });

  it("cuenta clientes creados este mes", () => {
    expect(D.resumen.clientesNuevosEsteMes).toBe(1);
  });

  it("un consultorio vacío no produce NaN en el promedio", () => {
    const vacio = construirDashboard({ clientes: [], mediciones: [], enlaces: [], hoyISO: HOY });
    expect(vacio.resumen.promedioMediciones).toBe(0);
    expect(vacio.resumen.totalClientes).toBe(0);
  });
});

describe("estado del consultorio", () => {
  it("cuenta las ocho categorías declaradas", () => {
    const c = D.consultorio;
    expect(c.activos).toBe(3);
    expect(c.archivados).toBe(1);
    expect(c.sinMediciones).toBe(1);
    expect(c.conUnaMedicion).toBe(2);
    expect(c.conSeguimiento).toBe(1);
    expect(c.conEnlacePublico).toBe(2);
  });

  it("con y sin seguimiento suman el total contable", () => {
    expect(D.consultorio.conSeguimiento + D.consultorio.sinSeguimiento).toBe(D.resumen.totalClientes);
  });

  it("conMasDeCinco es 0 cuando nadie supera cinco mediciones", () => {
    expect(D.consultorio.conMasDeCinco).toBe(0);
  });

  it("medicionesEnVentana acota por días", () => {
    const indice = indexarClientes(consultorio());
    // Ventana de 30 días desde 2026-08-01 → límite 2026-07-02. Entran la del
    // 08-01 y la del 07-20; la del 07-01 queda un día fuera.
    expect(medicionesEnVentana(indice, HOY, 30)).toBe(2);
    expect(medicionesEnVentana(indice, HOY, 1)).toBe(1);
  });

  it("medicionesEnVentana incluye el borde exacto de la ventana", () => {
    const indice = indexarClientes(consultorio());
    // 31 días → límite 2026-07-01, que es justo la fecha de m3.
    expect(medicionesEnVentana(indice, HOY, 31)).toBe(3);
  });
});

// ── Seguimiento ────────────────────────────────────────────────────────────

describe("seguimiento", () => {
  it("excluye a los eliminados", () => {
    expect(D.seguimiento.map((f) => f.clienteId)).not.toContain("c5");
    expect(D.seguimiento).toHaveLength(4);
  });

  it("ordena de mayor a menor antigüedad", () => {
    const dias = D.seguimiento.map((f) => f.diasSinMedicion).filter((d): d is number => d !== null);
    expect([...dias].sort((a, b) => b - a)).toEqual(dias);
  });

  it("coloca al cliente sin mediciones al final, no al principio", () => {
    expect(D.seguimiento[D.seguimiento.length - 1].clienteId).toBe("c4");
    expect(D.seguimiento[0].clienteId).toBe("c3");
  });

  it("cada fila lleva su total de mediciones y su estado de enlace", () => {
    const c2 = D.seguimiento.find((f) => f.clienteId === "c2")!;
    expect(c2.totalMediciones).toBe(3);
    expect(c2.tieneEnlaceActivo).toBe(true);
  });

  it("nunca sugiere cuándo medir: no existe campo de próxima medición", () => {
    for (const f of D.seguimiento) {
      expect(Object.keys(f)).not.toContain("proximaMedicion");
      expect(Object.keys(f)).not.toContain("urgencia");
    }
  });
});

// ── Actividad ──────────────────────────────────────────────────────────────

describe("actividad mensual", () => {
  it("cubre doce meses por defecto", () => {
    expect(D.actividadMensual).toHaveLength(12);
    expect(D.meta.mesesCubiertos).toBe(12);
  });

  it("termina en el mes de hoy y nunca lo supera", () => {
    expect(D.actividadMensual[D.actividadMensual.length - 1].mes).toBe("2026-08");
    for (const m of D.actividadMensual) expect(m.mes <= "2026-08").toBe(true);
  });

  it("incluye meses sin actividad con ceros en lugar de omitirlos", () => {
    const abril = D.actividadMensual.find((m) => m.mes === "2026-04")!;
    expect(abril).toBeDefined();
    expect(abril.mediciones).toBe(0);
  });

  it("cuenta mediciones en su mes", () => {
    expect(D.actividadMensual.find((m) => m.mes === "2026-07")!.mediciones).toBe(2);
  });

  it("cuenta clientes nuevos en su mes", () => {
    expect(D.actividadMensual.find((m) => m.mes === "2026-08")!.clientesNuevos).toBe(1);
  });

  it("respeta un número de meses personalizado", () => {
    const corto = construirDashboard(consultorio(), { meses: 3 });
    expect(corto.actividadMensual).toHaveLength(3);
  });
});

describe("actividad reciente", () => {
  it("ordena del evento más reciente al más antiguo", () => {
    const fechas = D.actividadReciente.map((e) => e.fecha);
    expect([...fechas].sort((a, b) => b.localeCompare(a))).toEqual(fechas);
  });

  it("incluye los cinco tipos de evento cuando existen", () => {
    const tipos = new Set(D.actividadReciente.map((e) => e.tipo));
    expect(tipos.has("medicion_registrada")).toBe(true);
    expect(tipos.has("cliente_creado")).toBe(true);
    expect(tipos.has("enlace_generado")).toBe(true);
    expect(tipos.has("enlace_revocado")).toBe(true);
    expect(tipos.has("medicion_anulada")).toBe(true);
  });

  it("respeta el límite de eventos", () => {
    const corto = construirDashboard(consultorio(), { eventosRecientes: 3 });
    expect(corto.actividadReciente).toHaveLength(3);
  });

  it("ningún id de evento se repite", () => {
    const ids = D.actividadReciente.map((e) => e.id);
    expect(new Set(ids).size).toBe(ids.length);
  });
});

// ── Alertas ────────────────────────────────────────────────────────────────

describe("alertas administrativas", () => {
  const tipos = D.alertas.map((a) => a.tipo);

  it("detecta un cliente archivado con enlace activo", () => {
    expect(tipos).toContain("archivado_con_enlace_activo");
    expect(D.alertas.find((a) => a.tipo === "archivado_con_enlace_activo")!.clienteId).toBe("c3");
  });

  it("detecta clientes sin mediciones", () => {
    expect(D.alertas.find((a) => a.tipo === "sin_mediciones")!.clienteId).toBe("c4");
  });

  it("detecta clientes con mediciones anuladas", () => {
    expect(D.alertas.find((a) => a.tipo === "con_mediciones_anuladas")!.clienteId).toBe("c3");
  });

  it("detecta múltiples enlaces activos simultáneos", () => {
    const base = consultorio();
    const conDos = {
      ...base,
      enlaces: [...base.enlaces, enlace({ id: "e4", cliente_id: "c2" })],
    };
    const r = construirDashboard(conDos);
    expect(r.alertas.some((a) => a.tipo === "multiples_enlaces_activos")).toBe(true);
  });

  it("delega la detección de inconsistencias en el Analysis Engine", () => {
    const base = consultorio();
    const inconsistente = {
      ...base,
      mediciones: [
        ...base.mediciones,
        medicion({
          id: "m9", cliente_id: "c1", fecha: "2026-08-01",
          peso_kg: 80, masa_grasa_kg: 20, masa_libre_grasa_kg: 50,
        }),
      ],
    };
    const r = construirDashboard(inconsistente);
    expect(r.alertas.some((a) => a.tipo === "con_inconsistencias")).toBe(true);
  });

  it("los eliminados no generan alertas", () => {
    expect(D.alertas.every((a) => a.clienteId !== "c5")).toBe(true);
  });

  it("toda alerta enuncia un hecho, nunca una recomendación", () => {
    const PRESCRIPTIVO = ["debería", "conviene", "recomend", "urgente", "hay que"];
    for (const a of D.alertas) {
      for (const p of PRESCRIPTIVO) {
        expect(a.hecho.toLowerCase(), `${a.tipo}`).not.toContain(p);
      }
    }
  });

  it("documenta las alertas que no se implementan y por qué", () => {
    expect(ALERTAS_NO_IMPLEMENTADAS.length).toBe(3);
    for (const a of ALERTAS_NO_IMPLEMENTADAS) {
      expect(a.motivo.length).toBeGreaterThan(50);
    }
  });

  it("el orden de las alertas es estable", () => {
    const otra = construirDashboard(consultorio());
    expect(otra.alertas.map((a) => a.id)).toEqual(D.alertas.map((a) => a.id));
  });
});

// ── Distribuciones y gráficos ──────────────────────────────────────────────

describe("distribuciones", () => {
  it("por estado suma el total contable", () => {
    const total = D.distribuciones.porEstado.reduce((n, s) => n + s.valor, 0);
    expect(total).toBe(D.resumen.totalClientes);
  });

  it("por número de mediciones suma el total contable", () => {
    const total = D.distribuciones.porNumeroDeMediciones.reduce((n, s) => n + s.valor, 0);
    expect(total).toBe(D.resumen.totalClientes);
  });

  it("por enlace suma el total contable", () => {
    const total = D.distribuciones.porEnlace.reduce((n, s) => n + s.valor, 0);
    expect(total).toBe(D.resumen.totalClientes);
  });
});

describe("series y escalado", () => {
  it("las series mensuales tienen un punto por mes", () => {
    expect(D.series.medicionesPorMes).toHaveLength(12);
    expect(D.series.sparklineMediciones).toHaveLength(12);
  });

  it("escalar devuelve null con serie vacía o toda a cero", () => {
    expect(escalar([], 100, 10)).toBeNull();
    expect(escalar([0, 0, 0], 100, 10)).toBeNull();
  });

  it("escalar sitúa el máximo en el borde superior útil", () => {
    const r = escalar([0, 5, 10], 100, 10)!;
    expect(r.maximo).toBe(10);
    expect(r.puntos[2]).toBe(10);
    expect(r.puntos[0]).toBe(90);
  });

  it("segmentosDonut acumula porcentajes hasta 100", () => {
    const s = segmentosDonut([{ etiqueta: "a", valor: 1 }, { etiqueta: "b", valor: 3 }]);
    expect(s).toHaveLength(2);
    expect(s[0].porcentaje).toBe(25);
    expect(s[1].desde).toBe(25);
    expect(s[1].desde + s[1].porcentaje).toBe(100);
  });

  it("segmentosDonut omite segmentos vacíos y total cero", () => {
    expect(segmentosDonut([{ etiqueta: "a", valor: 0 }])).toEqual([]);
    expect(segmentosDonut([]).length).toBe(0);
  });
});

// ── Filtros ────────────────────────────────────────────────────────────────

describe("filtros", () => {
  it("declara los siete filtros exigidos", () => {
    expect(ORDEN_FILTROS).toHaveLength(7);
    for (const f of ORDEN_FILTROS) expect(FILTROS[f]).toBeDefined();
  });

  it("cuenta correctamente por filtro", () => {
    const indice = indexarClientes(consultorio());
    const conteo = contarPorFiltro(indice);
    expect(conteo.todos).toBe(4);
    expect(conteo.activos).toBe(3);
    expect(conteo.archivados).toBe(1);
    expect(conteo.con_seguimiento).toBe(1);
    expect(conteo.sin_seguimiento).toBe(3);
    expect(conteo.con_enlace).toBe(2);
    expect(conteo.sin_enlace).toBe(2);
  });

  it("activos y archivados suman todos", () => {
    const conteo = contarPorFiltro(indexarClientes(consultorio()));
    expect(conteo.activos + conteo.archivados).toBe(conteo.todos);
  });

  it("filtrarSeguimiento aplica el mismo criterio que el índice", () => {
    expect(filtrarSeguimiento(D.seguimiento, "con_seguimiento")).toHaveLength(1);
    expect(filtrarSeguimiento(D.seguimiento, "sin_enlace")).toHaveLength(2);
    expect(filtrarSeguimiento(D.seguimiento, "todos")).toHaveLength(4);
  });

  it("filtrarSeguimiento no muta el arreglo recibido", () => {
    const copia = [...D.seguimiento];
    filtrarSeguimiento(D.seguimiento, "activos");
    expect(D.seguimiento).toEqual(copia);
  });
});

// ── Contrato y determinismo ────────────────────────────────────────────────

describe("determinismo y no mutación", () => {
  it("dos ejecuciones producen una salida profundamente idéntica", () => {
    const a = construirDashboard(consultorio());
    const b = construirDashboard(consultorio());
    expect(a).toEqual(b);
    expect(JSON.stringify(a)).toBe(JSON.stringify(b));
  });

  it("no muta los arreglos recibidos", () => {
    const entrada = consultorio();
    const copia = JSON.parse(JSON.stringify(entrada));
    construirDashboard(entrada);
    expect(entrada).toEqual(copia);
  });

  it("no reordena el arreglo de mediciones de entrada", () => {
    const entrada = consultorio();
    const ordenOriginal = entrada.mediciones.map((m) => m.id);
    construirDashboard(entrada);
    expect(entrada.mediciones.map((m) => m.id)).toEqual(ordenOriginal);
  });

  it("no consulta el reloj: hoyISO gobierna todo el cálculo", () => {
    const futuro = construirDashboard({ ...consultorio(), hoyISO: "2027-01-01" });
    expect(futuro.meta.hoyISO).toBe("2027-01-01");
    expect(futuro.resumen.medicionesEsteMes).toBe(0);
    expect(futuro.actividadMensual[futuro.actividadMensual.length - 1].mes).toBe("2027-01");
  });

  it("el DTO expone las ocho secciones del contrato", () => {
    for (const clave of [
      "resumen", "consultorio", "actividadMensual", "seguimiento",
      "alertas", "distribuciones", "actividadReciente", "series",
    ]) {
      expect(D, clave).toHaveProperty(clave);
    }
  });

  it("marca el consultorio vacío cuando no hay clientes contables", () => {
    const vacio = construirDashboard({ clientes: [], mediciones: [], enlaces: [], hoyISO: HOY });
    expect(vacio.meta.consultorioVacio).toBe(true);
    expect(D.meta.consultorioVacio).toBe(false);
  });

  it("un consultorio con solo eliminados se considera vacío", () => {
    const soloEliminados = construirDashboard({
      clientes: [cliente({ id: "x", nombre: "X", estado: "eliminado" })],
      mediciones: [], enlaces: [], hoyISO: HOY,
    });
    expect(soloEliminados.meta.consultorioVacio).toBe(true);
    expect(soloEliminados.resumen.totalClientes).toBe(0);
  });

  it("tolera mediciones de clientes inexistentes sin romperse", () => {
    const r = construirDashboard({
      clientes: [cliente({ id: "c1", nombre: "Ana" })],
      mediciones: [medicion({ id: "m1", cliente_id: "fantasma", fecha: "2026-07-01" })],
      enlaces: [], hoyISO: HOY,
    });
    expect(r.resumen.medicionesVigentes).toBe(0);
    expect(r.resumen.totalClientes).toBe(1);
  });
});
