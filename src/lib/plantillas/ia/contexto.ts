// ── El plan, tal como lo lee el modelo (Sprint PLS-2) ──────────────────────
//
// LA RESTRICCIÓN FUERTE ESTÁ AQUÍ, NO EN EL PROMPT.
//
//   El modelo recibe el plan y nada más. Ni el historial del cliente, ni su
//   composición corporal, ni internet. Que no pueda inventarse una carga no
//   depende de que obedezca una instrucción —una instrucción se desobedece—
//   sino de que no tiene ninguna otra cifra a mano.
//
//   Es la misma arquitectura que el copiloto del informe: lo que de verdad
//   protege es lo que NO se le da.
//
// ── SE LE DA EL PLAN YA RESUELTO ──────────────────────────────────────────
//
//   Si el enlace es de un cliente concreto, los ajustes de carga ya vienen
//   aplicados por la capa pública. El modelo ve lo mismo que la persona tiene
//   en pantalla, que es la única forma de que sus respuestas coincidan con lo
//   que ella está leyendo.
//
// Módulo puro.

import { ETIQUETA_BLOQUE, type Contenido } from '@/lib/plantillas/tipos';
import { seriesEnSemana, tonelajeSemana, urlDeVideo } from '@/lib/plantillas/contenido';

export interface EntradaPlan {
  nombre: string;
  descripcion: string | null;
  semanas: number;
  contenido: Contenido;
  /** Nombre del destinatario, si el enlace está asignado. Para tutearle bien. */
  para: string | null;
}

/** Coma decimal, como en el documento. */
const n = (v: number): string => String(v).replace('.', ',');

/** 90 → «1 min 30 s». Igual que en la hoja, para que no haya dos verdades. */
function descanso(seg: number): string {
  if (seg < 60) return `${seg} s`;
  const min = Math.floor(seg / 60);
  const resto = seg % 60;
  return resto === 0 ? `${min} min` : `${min} min ${resto} s`;
}

/** Una serie, en una línea. `—` donde el entrenador no prescribió nada. */
function serieEnTexto(reps: string, pesoKg: number | null, rir: number | null): string {
  const partes = [
    reps.trim() === '' ? 'reps sin especificar' : `${reps} reps`,
    pesoKg === null ? 'sin carga prescrita' : `${n(pesoKg)} kg`,
    rir === null ? 'sin RIR prescrito' : `RIR ${rir}`,
  ];
  return partes.join(' · ');
}

export function construirContextoPlan(e: EntradaPlan): string {
  const lineas: string[] = [
    `# Plan de entrenamiento: ${e.nombre}`,
    '',
    `Bloque de ${e.semanas} ${e.semanas === 1 ? 'semana' : 'semanas'}.`,
  ];

  if (e.descripcion) lineas.push(`Descripción del entrenador: ${e.descripcion}`);
  if (e.para) lineas.push(`Preparado para: ${e.para}.`);

  // El resumen por semana, calculado con las MISMAS funciones que pintan la
  // tabla. Si divergieran, el modelo diría un tonelaje y la pantalla otro.
  lineas.push('', '## Resumen por semana');
  for (let i = 0; i < e.semanas; i++) {
    const t = tonelajeSemana(e.contenido, i);
    const series = seriesEnSemana(e.contenido, i);
    const tonelaje =
      t.seriesContadas === 0
        ? 'sin tonelaje calculable'
        : `${t.kg} kg de tonelaje (peso × reps), dejando fuera ${t.seriesSinDatos} series sin carga o con rango de reps`;
    lineas.push(`- Semana ${i + 1}: ${series} series en total, ${tonelaje}.`);
  }

  for (const [iDia, dia] of e.contenido.dias.entries()) {
    lineas.push('', `## Día ${iDia + 1}: ${dia.nombre}`);
    if (dia.notas) lineas.push(`Nota del entrenador: ${dia.notas}`);

    for (const bloque of dia.bloques) {
      if (bloque.ejercicios.length === 0) continue;
      lineas.push('', `### ${ETIQUETA_BLOQUE[bloque.tipo]}`);

      for (const ejercicio of bloque.ejercicios) {
        lineas.push('', `**${ejercicio.nombre || 'Ejercicio sin nombre'}**`);
        if (ejercicio.notas) lineas.push(`Nota: ${ejercicio.notas}`);
        if (ejercicio.descansoSeg !== null) {
          lineas.push(`Descanso entre series: ${descanso(ejercicio.descansoSeg)}`);
        }
        // Solo se dice SI hay vídeo, nunca la dirección: el modelo no tiene
        // por qué reproducir enlaces y podría equivocarse al copiarlos.
        if (urlDeVideo(ejercicio.video) !== null) {
          lineas.push('Tiene un vídeo enlazado en la propia página.');
        }

        ejercicio.semanas.forEach((sem, iSemana) => {
          if (sem.series.length === 0) {
            lineas.push(`- Semana ${iSemana + 1}: este ejercicio no se hace.`);
            return;
          }
          const series = sem.series
            .map((s, i) => `serie ${i + 1}: ${serieEnTexto(s.reps, s.pesoKg, s.rir)}`)
            .join(' | ');
          lineas.push(`- Semana ${iSemana + 1}: ${series}`);
        });
      }
    }
  }

  lineas.push(
    '',
    '## Recordatorio',
    'Esto es TODO lo que sabes. No hay historial, ni medidas corporales, ni nada más.',
    'Si te preguntan algo que no está aquí arriba, di que no está en el plan.',
  );

  return lineas.join('\n');
}
