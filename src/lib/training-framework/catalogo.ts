// ── Catálogo del Training Framework ─────────────────────────────────────────
// El handbook 03 dice que el Bloque "Formaliza las fases[] del catálogo
// actual" — así que las fases reales de src/data/sistemas.ts (contenido ya
// autorizado y en producción) se materializan como Bloques. Eso es traducción
// de contenido existente, no invención.
//
// Lo que NO se rellena, porque `fases[]` no lo contiene y ningún handbook lo
// publica: énfasis, defaults de descanso/intensidad, y sobre todo los
// Mesociclos y Microciclos. El propio handbook lo declara: "Deuda —
// plantillas de Bloque/Mesociclo/Microciclo no existen aún… el contenido real
// (con criterio de entrenador) es el bloqueante #1 del Roadmap". Rellenarlos
// sería fabricar programación deportiva (P14).

import { sistemas, getSistemaBySlug } from "@/data/sistemas";
import { PERIODIZACION_V1 } from "./vocabularios";
import type { Bloque, NivelPlantilla } from "./tipos";

function idDeBloque(sistemaSlug: string, indice: number, nombre: string): string {
  const normalizado = nombre
    .toLowerCase()
    .normalize("NFD")
    .replace(/\p{M}/gu, "") // marcas diacriticas combinantes (Unicode property, fuente ASCII)
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
  return `${sistemaSlug}-b${indice + 1}-${normalizado}`;
}

/**
 * Bloques de un Sistema, derivados de sus `fases[]`. Los Mesociclos quedan
 * vacíos: sin ellos el Bloque no es generable, y esa es exactamente la
 * situación real del producto (bloqueante #1), no un defecto de este código.
 */
export function obtenerBloquesDeSistema(sistemaSlug: string): Bloque[] {
  const sistema = getSistemaBySlug(sistemaSlug);
  if (!sistema) return [];

  return sistema.fases.map((fase, indice) => ({
    id: idDeBloque(sistema.slug, indice, fase.nombre),
    nombre: fase.nombre,
    descripcion: fase.descripcion,
    enfasis: null, // `fases[]` no declara énfasis — pendiente de autorización editorial
    duracionSemanas: fase.semanas,
    sesionesSemanales: fase.sesionesSemanales, // R-1: IDEAL, nunca mínimo
    tipoPeriodizacion: PERIODIZACION_V1,
    descansoDefaultSegundos: null,
    intensidadDefault: null,
    mesociclos: [], // bloqueante #1 del Roadmap
  }));
}

/**
 * Niveles de un Sistema (capa 3). Los Bloques que cada Nivel habilita NO están
 * declarados en ningún sitio: `sistemas.ts` lista niveles y fases como
 * colecciones independientes, sin mapeo entre ellas. Se devuelven los Niveles
 * con `bloques: []` en lugar de asumir un reparto — ver informe.
 */
export function obtenerNivelesDeSistema(sistemaSlug: string): NivelPlantilla[] {
  const sistema = getSistemaBySlug(sistemaSlug);
  if (!sistema) return [];

  return sistema.niveles.map((nivel) => ({
    nombre: nivel.nombre,
    descripcion: nivel.descripcion,
    bloques: [],
  }));
}

/** Elite declara jerarquía vacía — es coaching 1:1 (ADR-012), rechazo explícito en generación. */
export function tieneJerarquiaDeEntrenamiento(sistemaSlug: string): boolean {
  return obtenerBloquesDeSistema(sistemaSlug).length > 0;
}

/** Todos los Sistemas con su jerarquía derivada, para inspección/validación. */
export function obtenerJerarquiaCompleta(): Array<{ sistema: string; bloques: Bloque[]; niveles: NivelPlantilla[] }> {
  return sistemas.map((s) => ({
    sistema: s.slug,
    bloques: obtenerBloquesDeSistema(s.slug),
    niveles: obtenerNivelesDeSistema(s.slug),
  }));
}
