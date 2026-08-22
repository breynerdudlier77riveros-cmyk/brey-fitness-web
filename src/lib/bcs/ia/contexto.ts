// ── Lo que el modelo recibe del informe (Sprint BCS-12) ────────────────────
//
// Convierte los DTO de los motores en el texto que se le pasa al modelo.
//
// LA REGLA QUE GOBIERNA ESTE FICHERO: aquí se decide qué NO ve el modelo, y
// esa es su función principal.
//
//   Ve: hallazgos, observaciones, lecturas transversales, orientación,
//       limitaciones — todo ya redactado por los motores, con su fuente.
//
//   NO ve: la ficha de variables en crudo. Nada de «grasa_pct: 13.3».
//
// Sin las cifras sueltas, el modelo no puede clasificarlas aunque quisiera:
// no las tiene. Lo que sí tiene son las conclusiones que el sistema ya sacó de
// ellas, cada una con su límite pegado. Es una restricción de diseño, no una
// omisión — y es más fuerte que cualquier instrucción del prompt, porque una
// instrucción se puede desobedecer y un dato ausente no.
//
// Los VALORES que el informe ya publica con su lectura (el porcentaje graso
// junto a su posición percentil, por ejemplo) sí entran: llegan dentro de la
// frase que los interpreta, no como número suelto.
//
// Módulo puro.

import type { BodyCompositionAnalysis } from '@/lib/bcs/analysis';
import type { ClinicalObservationReport } from '@/lib/bcs/observation';
import type { RecommendationReport } from '@/lib/bcs/recommendations';
import type { LecturaTransversal } from '@/lib/bcs/lectura-transversal';
import { ORIENTACIONES } from '@/lib/bcs/orientacion';

export interface EntradaContexto {
  clienteNombre: string;
  analisis: BodyCompositionAnalysis;
  observaciones: ClinicalObservationReport;
  recomendaciones: RecommendationReport;
  lecturas: readonly LecturaTransversal[];
  /** Quién pregunta. Cambia la persona gramatical, no lo que se puede decir. */
  quienPregunta: 'profesional' | 'cliente';
}

const bloque = (titulo: string, lineas: readonly string[]): string =>
  lineas.length === 0 ? '' : `\n## ${titulo}\n${lineas.map((l) => `- ${l}`).join('\n')}\n`;

/** El informe, tal como lo lee el modelo. */
export function construirContexto(e: EntradaContexto): string {
  const { analisis: a } = e;

  const partes: string[] = [
    `# Informe de ${e.clienteNombre}`,
    '',
    `Mediciones vigentes: ${a.cantidadMediciones}. Suficiencia de la base: ${a.suficiencia}.`,
    `Periodo: ${a.fechaInicial ?? 'sin fecha'} a ${a.fechaFinal ?? 'sin fecha'}.`,
    '',
    `Resumen que el sistema emitió: «${a.resumen.titulo}» — ${a.resumen.texto}`,
  ];

  partes.push(
    bloque(
      'Lo que dicen sus cifras (lectura de esta medición)',
      e.lecturas.map((l) => `${l.titulo}: ${l.texto} [Fuente: ${l.fundamento}]`),
    ),
  );

  partes.push(
    bloque(
      'Hallazgos verificados',
      a.hallazgos.map((h) => `${h.titulo}: ${h.descripcion}`),
    ),
  );

  partes.push(
    bloque(
      'Observaciones clínicas del motor',
      e.observaciones.bloques.flatMap((b) =>
        b.observaciones.map(
          (o) => `[${b.titulo}] ${o.texto} (regla ${o.trazabilidad.ruleId}, evidencia ${o.trazabilidad.evidenceLevel})`,
        ),
      ),
    ),
  );

  partes.push(
    bloque(
      'Combinaciones observadas',
      a.insights.map((i) => `${i.titulo}: ${i.descripcion}`),
    ),
  );

  // Las limitaciones van con un rótulo explícito: son la parte que el modelo
  // debe respetar aunque le pidan lo contrario.
  partes.push(
    bloque(
      'LO QUE NO PUEDE INTERPRETARSE (no lo contradigas)',
      a.avisos
        .filter((x) => x.tipo === 'limitacion')
        .map((x) => `${x.titulo}: ${x.descripcion}`),
    ),
  );

  partes.push(
    bloque(
      'Datos a revisar',
      a.avisos.filter((x) => x.tipo === 'alerta').map((x) => `${x.titulo}: ${x.descripcion}`),
    ),
  );

  partes.push(
    bloque(
      'Recomendaciones sobre el registro',
      e.recomendaciones.recomendaciones.map(
        (r) => `${r.titulo}: ${r.descripcion} Acción: ${r.accionProfesional} [${r.evidencia.referencia}]`,
      ),
    ),
  );

  // La orientación por objetivo no depende del cliente: es la misma para
  // todos, y por eso puede citarse entera. Es lo único del contexto que
  // autoriza a hablar de entrenamiento o de ingesta.
  partes.push(
    bloque(
      'Orientación por objetivo (lo único que autoriza a hablar de entrenamiento o alimentación, y siempre citando la ficha)',
      ORIENTACIONES.flatMap((o) => [
        `${o.titulo} — ${o.definicion}`,
        ...o.palancas.map((p) => `  · ${p}`),
        `  Qué esperar: ${o.expectativa}`,
        `  Fuente: ${o.fuente.modulo}, ficha ${o.fuente.ficha}, evidencia ${o.fuente.nivelEvidencia}`,
        ...o.noAdmisible.map((x) => `  NO ADMISIBLE: ${x}`),
      ]),
    ),
  );

  partes.push(
    '',
    e.quienPregunta === 'cliente'
      ? 'Quien pregunta es el propio cliente sobre su cuerpo: háblale de tú.'
      : 'Quien pregunta es el profesional sobre su cliente: háblale de su cliente en tercera persona.',
  );

  return partes.filter((x) => x !== '').join('\n');
}
