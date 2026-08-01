import type { BodyCompositionAnalysis, Hallazgo } from "@/lib/bcs/analysis";

// ── Interpretación profesional (BCS Sprint 3.0) ────────────────────────────
// Redacta en lenguaje clínico lo que el motor YA concluyó. No añade ninguna
// regla: cada frase se construye a partir de campos del DTO (categoría,
// dirección, significancia, suficiencia) y de textos que el propio motor
// produjo. Si el DTO no lo dice, aquí no se escribe.
//
// Prohibido por contrato, y por eso no existe ningún vocabulario para ello:
// "deberías", "conviene", "es recomendable", "ideal", "óptimo", "riesgo",
// "saludable". El BCS describe evolución, nunca prescribe ni evalúa salud
// (BCS Handbook 06, regla no negociable).
//
// La diferencia con la sección de Hallazgos: allí cada regla se lista por
// separado, con su explicación técnica. Aquí se redactan en prosa continua y
// agrupada, que es como un profesional lee y dicta un informe.

interface Props {
  analisis: BodyCompositionAnalysis;
}

/** Frase para un grupo de cambios con umbral documentado. */
function redactarSignificativos(hallazgos: Hallazgo[]): string | null {
  if (hallazgos.length === 0) return null;
  const nombres = hallazgos.map((h) => h.titulo.toLowerCase());
  return `Respecto a la medición anterior se registran cambios que superan el umbral documentado de significancia: ${nombres.join("; ")}.`;
}

/** Frase para cambios reales pero sin umbral que permita valorarlos. */
function redactarSinUmbral(hallazgos: Hallazgo[]): string | null {
  if (hallazgos.length === 0) return null;
  const nombres = hallazgos.map((h) => h.titulo.toLowerCase());
  return `Las siguientes variables presentan variación respecto a la medición anterior, sin que exista un umbral documentado que permita calificarla como relevante: ${nombres.join("; ")}.`;
}

function redactarEstabilidad(hallazgos: Hallazgo[]): string | null {
  if (hallazgos.length === 0) return null;
  const etiquetas = hallazgos.map((h) => h.titulo.toLowerCase());
  return `Sin variación entre las dos mediciones comparadas: ${etiquetas.join("; ")}.`;
}

function redactarTendencias(hallazgos: Hallazgo[]): string | null {
  if (hallazgos.length === 0) return null;
  const frases = hallazgos.map((h) => h.titulo.toLowerCase());
  return `Considerando el histórico completo, la serie describe: ${frases.join("; ")}. La descripción corresponde a lo ya registrado y no constituye una proyección.`;
}

export default function ProfessionalInterpretation({ analisis }: Props) {
  const { hallazgos, avisos, suficiencia, cantidadMediciones } = analisis;

  const cambios = hallazgos.filter((h) => h.id.startsWith("cambio:"));
  const significativos = cambios.filter((h) => h.suficiencia === "suficiente");
  const sinUmbral = cambios.filter((h) => h.suficiencia === "parcial");
  const estables = hallazgos.filter((h) => h.id.startsWith("estabilidad:"));
  const tendencias = hallazgos.filter((h) => h.id.startsWith("tendencia:"));
  const calidad = hallazgos.filter((h) => h.categoria === "calidad_de_dato");
  const limitaciones = avisos.filter((a) => a.tipo === "limitacion");

  const parrafos: string[] = [];

  // 1 · Alcance de lo que puede afirmarse, antes que cualquier afirmación.
  if (suficiencia === "sin_datos") {
    parrafos.push("No se dispone de mediciones registradas, por lo que no procede ninguna interpretación.");
  } else if (suficiencia === "insuficiente") {
    parrafos.push(
      "El análisis se apoya en una única medición: permite describir el estado actual, pero no la evolución. La comparación y las tendencias requieren al menos una medición adicional."
    );
  } else if (suficiencia === "parcial") {
    parrafos.push(
      "El análisis se apoya en dos mediciones: permite describir la diferencia entre ambas, pero no establecer una tendencia sostenida, que requiere un mínimo de tres registros."
    );
  } else {
    parrafos.push(
      `El análisis se apoya en ${cantidadMediciones} mediciones vigentes, suficientes para describir tanto la comparación con el registro anterior como la evolución del histórico.`
    );
  }

  // 2 · Cambios comprobados.
  const significativa = redactarSignificativos(significativos);
  if (significativa) parrafos.push(significativa);

  const estabilidad = redactarEstabilidad(estables);
  if (estabilidad) parrafos.push(estabilidad);

  const sinUmbralTexto = redactarSinUmbral(sinUmbral);
  if (sinUmbralTexto) parrafos.push(sinUmbralTexto);

  // 3 · Evolución del histórico.
  const tendenciaTexto = redactarTendencias(tendencias);
  if (tendenciaTexto) parrafos.push(tendenciaTexto);

  // 4 · Calidad del dato, si compromete la lectura.
  if (calidad.length > 0) {
    parrafos.push(
      `Se identifican ${calidad.length === 1 ? "una incidencia" : `${calidad.length} incidencias`} en la consistencia del dato registrado. Su detalle figura en el apartado de datos a revisar y condiciona la lectura de las variables implicadas.`
    );
  }

  // 5 · Límite explícito de la interpretación.
  if (limitaciones.length > 0) {
    parrafos.push(
      `La interpretación permanece limitada en ${limitaciones.length === 1 ? "un aspecto" : `${limitaciones.length} aspectos`}, detallados en el apartado de Metodología. Las variables afectadas se presentan únicamente como valor y evolución, sin clasificación.`
    );
  }

  if (parrafos.length === 0) return null;

  return (
    <div className="space-y-3 max-w-3xl">
      {parrafos.map((texto, i) => (
        <p key={i} className="text-sm text-white/70 leading-relaxed">
          {texto}
        </p>
      ))}
    </div>
  );
}
