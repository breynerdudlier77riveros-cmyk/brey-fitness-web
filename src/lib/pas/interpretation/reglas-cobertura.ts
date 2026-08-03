// ── Reglas de dominio y cobertura, PIE-15…PIE-19 (Sprint PAS-4.0) ──────────
// Lo que se dice del perfil en conjunto por agrupación: dominios y cobertura.
// Ninguna mira una capacidad aislada.

import type { DominioId } from '../capacidades';
import { CAPACIDADES_ACTIVAS, DOMINIOS } from '../capacidades';
import type { EstadoCapacidad } from '../resultado';
import { etiquetaDominio } from './etiquetas';
import { cantidad, render } from './render';
import { construirInterpretacion } from './trazabilidad';
import type { CoberturaPerfil, ConocimientoPKB, Interpretacion } from './tipos';

const esActiva = (id: string) => CAPACIDADES_ACTIVAS.some((c) => c.id === id);

export function interpretarDominios(estados: readonly EstadoCapacidad[]): Interpretacion[] {
  const salida: Interpretacion[] = [];

  for (const dominio of Object.keys(DOMINIOS) as DominioId[]) {
    const delDominio = estados.filter((e) => e.dominio === dominio && esActiva(e.capacidad));
    if (delDominio.length === 0) continue;

    const caracterizadas = delDominio.filter((e) => e.estado === 'evaluada');
    const comun = {
      clave: dominio,
      bloque: 'dominio' as const,
      capacidades: delDominio.map((e) => e.capacidad),
    };

    if (caracterizadas.length === 0) {
      salida.push(
        construirInterpretacion({
          ...comun, regla: 'PIE-16', prioridad: 'alta', plantilla: 'DOMINIO_SIN_EVIDENCIA',
          texto: render('DOMINIO_SIN_EVIDENCIA', { dominio: etiquetaDominio(dominio) }),
        })
      );
      continue;
    }

    salida.push(
      construirInterpretacion({
        ...comun, regla: 'PIE-15', prioridad: 'media', plantilla: 'DOMINIO_CARACTERIZADO',
        texto: render('DOMINIO_CARACTERIZADO', {
          dominio: etiquetaDominio(dominio),
          caracterizadas: cantidad(caracterizadas.length),
          totales: cantidad(delDominio.length),
        }),
      })
    );
  }

  return salida;
}

export function calcularCobertura(
  estados: readonly EstadoCapacidad[],
  correspondenciasAplicadas: number
): CoberturaPerfil {
  const activas = estados.filter((e) => esActiva(e.capacidad));
  const contar = (estado: string) => activas.filter((e) => e.estado === estado).length;

  return {
    capacidadesTotales: estados.length,
    capacidadesActivas: activas.length,
    caracterizadas: contar('evaluada'),
    parciales: contar('parcialmente_evaluada'),
    desactualizadas: contar('desactualizada'),
    enConflicto: contar('en_conflicto'),
    desconocidas: contar('desconocida'),
    reservadas: estados.length - activas.length,
    correspondenciasAplicadas,
  };
}

export function interpretarCobertura(
  cobertura: CoberturaPerfil,
  pkb: ConocimientoPKB
): Interpretacion[] {
  const salida: Interpretacion[] = [];
  const comun = { clave: 'global', bloque: 'cobertura' as const };

  const respaldadas = pkb.fichas.filter(
    (f) => f.estado === 'respaldada' || f.estado === 'parcialmente_respaldada'
  );

  if (respaldadas.length === 0) {
    salida.push(
      construirInterpretacion({
        ...comun, regla: 'PIE-19', prioridad: 'estructural',
        plantilla: 'COBERTURA_SIN_CORRESPONDENCIAS',
        texto: render('COBERTURA_SIN_CORRESPONDENCIAS'),
      })
    );
  }

  salida.push(
    construirInterpretacion({
      ...comun, regla: 'PIE-17', prioridad: 'alta', plantilla: 'COBERTURA_PERFIL',
      texto: render('COBERTURA_PERFIL', {
        caracterizadas: cantidad(cobertura.caracterizadas),
        activas: cantidad(cobertura.capacidadesActivas),
        desconocidas: cantidad(cobertura.desconocidas),
      }),
    })
  );

  if (cobertura.caracterizadas < cobertura.capacidadesActivas) {
    const motivo =
      respaldadas.length === 0
        ? 'el catálogo no declara correspondencias respaldadas'
        : 'no todas las capacidades activas cuentan con registros elegibles';

    salida.push(
      construirInterpretacion({
        ...comun, regla: 'PIE-18', prioridad: 'alta', plantilla: 'COBERTURA_INCOMPLETA',
        texto: render('COBERTURA_INCOMPLETA', { motivo }),
      })
    );
  }

  return salida;
}
