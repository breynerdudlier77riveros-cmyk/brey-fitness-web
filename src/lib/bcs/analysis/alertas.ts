// ── Avisos: alerta ≠ limitación ≠ nota (Sprint I-03) ───────────────────────
// La distinción es deliberada y se preserva hasta la UI:
//
//   · alerta     — hay una condición verificable en el dato que merece
//                  revisión (un valor imposible, una suma que no cuadra).
//   · limitación — el sistema NO puede interpretar por falta de información
//                  o de regla. No es un fallo del dato ni del cliente.
//   · nota       — información descriptiva que no señala ningún problema.
//
// Mezclarlas convertiría "no puedo clasificar tu % de grasa porque no
// registro tu sexo" en algo que se lee como un problema de salud. Nunca se
// usa lenguaje médico ni se menciona riesgo, enfermedad o diagnóstico.

import type { Incidencia } from './calidad';
import type { Aviso, TipoAviso } from './tipos';

export function construirAvisos(incidencias: readonly Incidencia[]): Aviso[] {
  const avisos = incidencias.map<Aviso>((incidencia) => ({
    id: incidencia.id,
    tipo: incidencia.clase as TipoAviso,
    titulo: incidencia.titulo,
    descripcion: incidencia.descripcion,
    variables: incidencia.variables,
    mediciones: incidencia.mediciones,
  }));

  // Las limitaciones de clasificación y la de agua se emiten una vez por
  // medición revisada; al usuario le sirve una sola por motivo.
  const vistos = new Set<string>();
  const deduplicados = avisos.filter((aviso) => {
    const clave = aviso.tipo === 'limitacion' ? aviso.titulo : aviso.id;
    if (vistos.has(clave)) return false;
    vistos.add(clave);
    return true;
  });

  // Orden estable y útil de leer: primero lo accionable, al final lo
  // meramente descriptivo.
  const PRIORIDAD: Record<TipoAviso, number> = { alerta: 0, limitacion: 1, nota: 2 };
  return deduplicados.sort((a, b) => PRIORIDAD[a.tipo] - PRIORIDAD[b.tipo]);
}
