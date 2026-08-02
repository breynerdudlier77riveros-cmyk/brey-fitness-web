// ── Insights deterministas (Sprint I-03) ───────────────────────────────────
// Un insight combina hallazgos YA demostrados; nunca vuelve a mirar las
// Mediciones ni la comparación. El flujo es de una sola dirección:
// datos → comparación → tendencias → hallazgos → insights.
//
// Techo estricto de lo que un insight puede afirmar. Está PROHIBIDO decir:
//   · "perdiste principalmente grasa" — exigiría demostrar la proporción
//     entre pérdida de grasa y de masa magra, y ninguna regla la define.
//   · "no hay pérdida muscular" — la estabilidad solo es demostrable donde
//     hay umbral documentado (Peso, % grasa); masa muscular no lo tiene.
//   · "evolución favorable" — favorable respecto a qué objetivo. El BCS no
//     conoce el objetivo del cliente (BCS Handbook 05).
//   · cualquier "riesgo", "saludable", "ideal", "óptimo", "recomendado",
//     "deberías" (BCS Handbook 06, regla no negociable).
//
// Lo que sí puede hacer: constatar la coincidencia de dos hechos ya
// probados, sin atribuirles causa ni valor.

import type { Hallazgo, Insight, Suficiencia } from './tipos';

/** La suficiencia de un insight nunca supera la del hallazgo más débil que lo sostiene. */
const ORDEN_SUFICIENCIA: Record<Suficiencia, number> = {
  sin_datos: 0,
  insuficiente: 1,
  parcial: 2,
  suficiente: 3,
};

function suficienciaCombinada(hallazgos: Hallazgo[]): Suficiencia {
  return hallazgos.reduce<Suficiencia>(
    (peor, h) => (ORDEN_SUFICIENCIA[h.suficiencia] < ORDEN_SUFICIENCIA[peor] ? h.suficiencia : peor),
    'suficiente'
  );
}

export function construirInsights(hallazgos: readonly Hallazgo[]): Insight[] {
  const porId = new Map(hallazgos.map((h) => [h.id, h]));
  const insights: Insight[] = [];

  const peso = porId.get('cambio:peso_kg') ?? porId.get('estabilidad:peso_kg');
  const grasa = porId.get('cambio:grasa_pct') ?? porId.get('estabilidad:grasa_pct');
  const musculo = porId.get('cambio:masa_muscular_kg') ?? porId.get('estabilidad:masa_muscular_kg');

  // Peso y % de grasa se movieron en la misma dirección — coincidencia de
  // dos hechos, sin afirmar que uno explique al otro.
  if (peso && grasa && peso.direccion && grasa.direccion) {
    const mismosSentidos =
      peso.direccion === grasa.direccion &&
      (peso.direccion === 'aumento' || peso.direccion === 'disminucion');

    if (mismosSentidos) {
      const verbo = peso.direccion === 'disminucion' ? 'disminuyeron' : 'aumentaron';
      const base = [peso, grasa];
      insights.push({
        id: 'insight:peso_y_grasa_misma_direccion',
        titulo: `El peso y el porcentaje de grasa ${verbo} en el mismo periodo`,
        descripcion: `Entre las dos mediciones comparadas, ambos valores se movieron en la misma dirección. Es la coincidencia de dos cambios registrados; no permite establecer qué proporción del cambio de peso corresponde a tejido graso.`,
        hallazgosBase: base.map((h) => h.id),
        suficiencia: suficienciaCombinada(base),
      });
    } else if (
      (peso.direccion === 'aumento' || peso.direccion === 'disminucion') &&
      (grasa.direccion === 'aumento' || grasa.direccion === 'disminucion')
    ) {
      const base = [peso, grasa];
      insights.push({
        id: 'insight:peso_y_grasa_direcciones_opuestas',
        titulo: 'El peso y el porcentaje de grasa se movieron en direcciones opuestas',
        descripcion: `${peso.direccion === 'aumento' ? 'El peso aumentó mientras el porcentaje de grasa disminuyó' : 'El peso disminuyó mientras el porcentaje de grasa aumentó'} entre las dos mediciones comparadas. Es la constatación de dos cambios registrados, sin conclusión sobre su causa.`,
        hallazgosBase: base.map((h) => h.id),
        suficiencia: suficienciaCombinada(base),
      });
    }
  }

  // Peso cambió y masa muscular se mantuvo. Solo se emite si la estabilidad
  // fue realmente demostrable (hallazgo de estabilidad, no ausencia de
  // hallazgo de cambio) — "no cambió" y "no lo sé" no son lo mismo.
  if (peso && musculo && peso.direccion && musculo.direccion === 'estable') {
    if (peso.direccion === 'aumento' || peso.direccion === 'disminucion') {
      const base = [peso, musculo];
      insights.push({
        id: 'insight:peso_cambio_musculo_estable',
        titulo: `El peso ${peso.direccion === 'aumento' ? 'aumentó' : 'disminuyó'} y la masa muscular registró el mismo valor`,
        descripcion:
          'La masa muscular no tiene un umbral de cambio mínimo definido, así que "mismo valor" significa exactamente eso: las dos mediciones coinciden. No implica ausencia de cambio real entre ellas.',
        hallazgosBase: base.map((h) => h.id),
        suficiencia: suficienciaCombinada(base),
      });
    }
  }

  // Sin datos suficientes — se dice explícitamente, nunca se deja vacío.
  const insuficiente =
    porId.get('datos_insuficientes:sin_mediciones') ?? porId.get('datos_insuficientes:una_medicion');
  if (insuficiente) {
    insights.push({
      id: 'insight:sin_base_para_interpretar',
      titulo: 'Todavía no hay base suficiente para interpretar',
      descripcion:
        'El análisis necesita al menos dos mediciones para comparar y tres para describir una tendencia. Con lo registrado hasta ahora solo puede mostrarse el estado actual.',
      hallazgosBase: [insuficiente.id],
      suficiencia: insuficiente.suficiencia,
    });
  }

  // Cambios reales pero sin umbral que permita valorarlos — es información
  // útil por sí misma, y evita que el silencio se lea como "todo normal".
  const sinUmbral = hallazgos.filter((h) => h.id.startsWith('cambio:') && h.suficiencia === 'parcial');
  if (sinUmbral.length > 0) {
    insights.push({
      id: 'insight:cambios_sin_umbral_definido',
      titulo: 'Hay cambios registrados sin umbral de relevancia definido',
      descripcion: `${sinUmbral.length === 1 ? 'Una variable cambió' : `${sinUmbral.length} variables cambiaron`} entre las dos mediciones, pero no existe un umbral documentado que permita decir si esos cambios son relevantes o simple variación de la medición. Se muestran como descriptivos.`,
      hallazgosBase: sinUmbral.map((h) => h.id),
      suficiencia: 'parcial',
    });
  }

  return insights;
}
