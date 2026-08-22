import VariableDetail from "./VariableDetail";
import type { BloqueCategoria, SerieTendencia } from "@/lib/bcs/reporte";
import { formatearValor } from "./formato";

// ── Análisis corporal (BCS Sprint 3.0) ─────────────────────────────────────
// La ficha completa de la medición actual, agrupada por las cuatro categorías
// del catálogo. Complementa a los Indicadores principales: allí se destacan
// nueve variables, aquí están TODAS las registradas, en el mismo orden que el
// entrenador ya memorizó de otras pantallas.
//
// Una variable ausente no se lista con un guion: se omite (el dominio ya la
// filtró en construirFicha). Un hueco vacío se confunde con un cero.
//
// ── CADA CIFRA ABRE SU PANEL (Sprint BCS-8.0) ─────────────────────────────
//
// Antes esto era una rejilla de números y nada más: «Proteína corporal ·
// 12,3 kg». Quien no sabía ya qué es la proteína corporal se quedaba igual
// que antes de abrir el informe, y quien lo sabía no podía averiguar por qué
// el sistema no le ponía una etiqueta al lado.
//
// Ahora cada variable lleva un «Qué significa» que despliega qué es, cómo ha
// evolucionado, cómo se lee y qué NO dice. La rejilla se conserva porque
// escanear veinte cifras de un vistazo sigue siendo útil; lo que cambia es
// que ninguna de ellas es ya un callejón sin salida.
//
// La rejilla pasa a dos columnas como máximo: un panel de texto dentro de una
// celda de cuatro columnas queda en una tira ilegible.

interface Props {
  ficha: BloqueCategoria[];
  /**
   * Series por variable, para dibujar la evolución dentro de cada panel.
   *
   * Opcional: sin ellas los paneles se abren igual y simplemente no muestran
   * gráfica. Nunca se sustituye por una serie vacía, que dibujaría un eje sin
   * datos.
   */
  tendencias?: readonly SerieTendencia[];
}

export default function BodyAnalysisSection({ ficha, tendencias = [] }: Props) {
  const bloques = ficha.filter((b) => b.filas.length > 0);
  const porVariable = new Map(tendencias.map((t) => [t.id, t]));

  return (
    <div className="space-y-6">
      {bloques.map((bloque) => (
        <section key={bloque.categoria} aria-label={bloque.etiqueta}>
          <h3 className="text-[10px] font-bold tracking-[0.14em] uppercase text-white/40 mb-3">
            {bloque.etiqueta}
          </h3>

          <dl className="grid grid-cols-1 sm:grid-cols-2 print:grid-cols-2 gap-x-6 gap-y-4">
            {bloque.filas.map((fila) => (
              <div key={fila.id} className="min-w-0">
                <dt className="mb-0.5">
                  <span className="text-[10px] font-semibold text-white/45">{fila.etiqueta}</span>
                </dt>
                <dd className="text-sm font-black text-white tabular-nums">
                  {formatearValor(fila.valor, fila.unidad)}
                </dd>
                {fila.clasificacion && (
                  <p className="text-[10px] text-white/50 mt-0.5">{fila.clasificacion.etiqueta}</p>
                )}
                <VariableDetail fila={fila} serie={porVariable.get(fila.id)} />
              </div>
            ))}
          </dl>
        </section>
      ))}
    </div>
  );
}
