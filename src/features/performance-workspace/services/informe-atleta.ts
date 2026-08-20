// ── Orquestación del informe del atleta (Sprint PAS-8) ─────────────────────
//
// ENCADENA. El informe normativo ya existía y no se toca: esto lo envuelve y le
// añade los dos ejes que le faltaban —historial y objetivos— para producir el
// informe humano.
//
// NO recalcula ninguna ciencia. `construirInformeNormativo` sigue siendo quien
// habla con el NIE; aquí solo se le pasa lo que produce a la capa humana, junto
// con las mediciones anteriores del atleta y sus objetivos declarados.
//
// Los estados técnicos de PRS-2.4 se conservan tal cual: un fallo al leer la
// NKB o los registros sigue siendo un fallo técnico y no se disfraza de «este
// atleta no tiene mediciones».

import type { NormaNKB } from '@/lib/nie';
import {
  componerInformeHumano,
  type InformeHumano,
  type MedicionPrevia,
  type ObjetivoAtleta,
} from '@/lib/pas/informe-humano';
import type { CatalogoPruebas } from '@/lib/pas';

import { CATALOGO_PAS, PRUEBAS } from '../schemas/catalogo';
import { construirInformeNormativo } from './informe-normativo';
import type { Atleta, RegistroWorkspace } from '../schemas/tipos';

export type ResultadoInformeAtleta =
  | { estado: 'DISPONIBLE'; informe: InformeHumano }
  | { estado: 'ERROR_TECNICO'; origen: 'NKB' | 'REGISTROS'; detalle: string }
  | { estado: 'SUJETO_INCOMPLETO'; ausentes: readonly string[]; detalle: string }
  | { estado: 'SIN_MEDICIONES'; detalle: string };

export interface EntradaInformeAtleta {
  atleta: Atleta;
  registros: Parameters<typeof construirInformeNormativo>[0]['registros'];
  /**
   * Mediciones de evaluaciones ANTERIORES del mismo atleta.
   *
   * Se reciben ya leídas: la capa humana no consulta la base. Quien las aporte
   * debe excluir la evaluación actual, o el resultado se compararía consigo
   * mismo y la tendencia siempre daría cero.
   */
  previas: readonly MedicionPrevia[];
  objetivos: readonly ObjetivoAtleta[];
  hoyISO: string;
  fecha: string;
  codigo: string;
  edad: number | null;
  sexo: string | null;
  /**
   * Masa corporal de ESTA evaluacion, en kg (G-01, cerrado en PAS-12).
   *
   * Quien llame debe pasar `evaluacion.pesoKg`, no el peso actual del atleta ni
   * el de otra evaluacion. `null` es la respuesta correcta cuando no consta.
   */
  pesoKg: number | null;
  catalogo?: CatalogoPruebas;
  normas?: readonly NormaNKB[];
}

/** Las mediciones continuas de la evaluación, tal como se registraron. */
function medicionesDe(registros: readonly RegistroWorkspace[]) {
  return registros
    .filter((r) => r.estado === 'vigente' && r.valor.tipo === 'continuo')
    .map((r) => {
      const v = r.valor as Extract<RegistroWorkspace['valor'], { tipo: 'continuo' }>;
      return {
        registroId: r.id,
        pruebaId: r.pruebaId,
        valor: v.valor,
        unidad: v.unidad,
        fecha: r.fecha,
        condiciones: r.condiciones,
      };
    });
}

export function construirInformeAtleta(
  entrada: EntradaInformeAtleta,
): ResultadoInformeAtleta {
  const normativo = construirInformeNormativo({
    atleta: entrada.atleta,
    registros: entrada.registros,
    hoyISO: entrada.hoyISO,
    portada: {
      atleta: entrada.atleta.nombre,
      edad: entrada.edad,
      sexo: entrada.sexo,
      fecha: entrada.fecha,
      profesional: null,
      codigo: entrada.codigo,
    },
    normas: entrada.normas,
  });

  // Los estados que no son «disponible» se propagan tal cual: ya los resolvió
  // PRS-2.4 y volver a decidirlos aquí crearía una segunda verdad.
  if (normativo.estado !== 'DISPONIBLE') {
    return normativo as ResultadoInformeAtleta;
  }

  const registros: readonly RegistroWorkspace[] = Array.isArray(entrada.registros)
    ? entrada.registros
    : 'registros' in entrada.registros
      ? entrada.registros.registros
      : [];

  return {
    estado: 'DISPONIBLE',
    informe: componerInformeHumano({
      informe: normativo.informe,
      catalogo: entrada.catalogo ?? CATALOGO_PAS,
      // Los nombres visibles salen del catálogo del Workspace, que es quien los
      // declara. La capa humana no los busca: los recibe.
      nombres: Object.fromEntries(PRUEBAS.map((p) => [p.id, p.nombre])),
      // Y la direccion de mejora tambien: es una propiedad declarada de cada
      // prueba, con respaldo PKB, no algo que la capa humana pueda deducir del
      // objetivo que alguien escribio.
      direcciones: Object.fromEntries(PRUEBAS.map((p) => [p.id, p.direccion])),
      // Las coordenadas que la capa de evidencia puede exigir. El peso llega
      // desde `pas_evaluaciones.peso_kg` de ESTA evaluación (G-01): es el único
      // que corresponde a la fecha en que se midió.
      sujeto: {
        edad: entrada.edad,
        sexo: entrada.atleta.sexo,
        pais: entrada.atleta.pais,
        pesoKg: entrada.pesoKg,
      },
      mediciones: medicionesDe(registros),
      previas: entrada.previas,
      objetivos: entrada.objetivos,
      atleta: { nombre: entrada.atleta.nombre, edad: entrada.edad, sexo: entrada.sexo },
    }),
  };
}
