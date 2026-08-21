// ── Resumen ejecutivo profesional (flujo 1) ────────────────────────────────
// Tres extensiones: 30, 100 y 300 palabras. NINGUNA añade contenido: las tres
// se construyen del mismo material y se diferencian en cuánto incluyen.
//
// El orden de inclusión es el de prioridad clínica del ecosistema: primero lo
// que condiciona la lectura (alertas), luego los cambios comprobados, luego
// las tendencias y al final las limitaciones. Recortar por longitud descarta
// siempre desde el final, nunca desde el principio.

import type { FuentesNormalizadas } from '../fuentes';
import { Traza } from '../trazabilidad';
import { contarPalabras, dividirOraciones, recortarAPalabras } from '../render';
import type { Seccion } from '../tipos';

export type VarianteResumen = '30' | '100' | '300';

export const EXTENSIONES: Record<VarianteResumen, number> = { '30': 30, '100': 100, '300': 300 };

interface Composicion {
  secciones: Seccion[];
  traza: ReturnType<Traza['construir']>;
}

export function componerResumen(f: FuentesNormalizadas, variante: VarianteResumen): Composicion {
  const traza = new Traza(`resumen_ejecutivo:${variante}`);
  const oraciones: string[] = [];

  // 1 · Alcance. Siempre primero: delimita qué puede afirmarse.
  oraciones.push(
    `${f.clienteNombre}: análisis sobre ${f.cantidadMediciones} ${f.cantidadMediciones === 1 ? 'medición vigente' : 'mediciones vigentes'}.`
  );

  // 2 · Lo que condiciona la lectura.
  if (f.alertas.length > 0) {
    oraciones.push(
      f.alertas.length === 1
        ? 'Hay 1 registro pendiente de verificación que condiciona la lectura.'
        : `Hay ${f.alertas.length} registros pendientes de verificación que condicionan la lectura.`
    );
    f.alertas.forEach((a) => traza.usarHallazgo(a.id));
  }

  // 3 · Cambios comprobados.
  if (f.cambiosSignificativos.length > 0) {
    const lista = f.cambiosSignificativos.map((c) => c.titulo.toLowerCase()).join('; ');
    oraciones.push(`Cambios por encima del umbral definido: ${lista}.`);
    f.cambiosSignificativos.forEach((c) => {
      traza.usarHallazgo(c.id).usarVariable(c.variable);
    });
  } else {
    oraciones.push('No se registran cambios por encima del umbral definido para su variable.');
  }

  // 4 · Tendencias del histórico.
  if (f.tendencias.length > 0) {
    oraciones.push(`En el histórico completo: ${f.tendencias.map((t) => t.titulo.toLowerCase()).join('; ')}.`);
    f.tendencias.forEach((t) => traza.usarHallazgo(t.id).usarVariable(t.variable));
  }

  // 5 · Variación sin umbral.
  if (f.cambiosSinUmbral.length > 0) {
    oraciones.push(
      f.cambiosSinUmbral.length === 1
        ? 'Otra variable presenta variación sin umbral documentado que permita calificarla.'
        : `Otras ${f.cambiosSinUmbral.length} variables presentan variación sin umbral documentado que permita calificarla.`
    );
    f.cambiosSinUmbral.forEach((c) => traza.usarHallazgo(c.id).usarVariable(c.variable));
  }

  // 6 · Acciones pendientes, resumidas por prioridad.
  const altas = f.recomendaciones.filter((r) => r.prioridad === 'alta');
  if (altas.length > 0) {
    oraciones.push(
      `El análisis identifica ${altas.length} ${altas.length === 1 ? 'punto' : 'puntos'} de prioridad alta sobre la consistencia del dato.`
    );
    altas.forEach((r) => traza.usarRecomendacion(r.id));
  }

  // 7 · Límite explícito. Última en entrar, primera en descartarse.
  if (f.limitaciones.length > 0) {
    oraciones.push(
      `La interpretación permanece limitada en ${f.limitaciones.length} ${f.limitaciones.length === 1 ? 'aspecto' : 'aspectos'} por datos que el sistema no registra.`
    );
  }

  const recortadas = recortarAPalabras(oraciones, EXTENSIONES[variante]);

  return {
    secciones: [{ titulo: '', contenido: recortadas }],
    traza: traza.construir(),
  };
}

/** Extensión real obtenida, para verificar el ajuste sin recomponer. */
export function palabrasDe(secciones: readonly Seccion[]): number {
  return contarPalabras(secciones.flatMap((s) => s.contenido).join(' '));
}

export { dividirOraciones };
