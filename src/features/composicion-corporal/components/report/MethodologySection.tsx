import { CATALOGO } from "@/lib/bcs/reporte";
import { TOLERANCIA_SUMA_MASAS_KG, type BodyCompositionAnalysis } from "@/lib/bcs/analysis";

// ── Metodología (BCS Sprint 2.0) ───────────────────────────────────────────
// Describe cómo se produjo este documento y qué NO pudo interpretarse. No
// introduce ninguna regla: los umbrales que cita se leen del propio catálogo
// y de la constante que aplica el motor, de modo que si mañana cambian, este
// texto cambia con ellos en vez de quedarse mintiendo.
//
// Las limitaciones concretas no se enumeran aquí a mano: salen del análisis
// del cliente que se esté viendo.

interface Props {
  analisis: BodyCompositionAnalysis;
}

function Bloque({ titulo, children }: { titulo: string; children: React.ReactNode }) {
  return (
    <div>
      <h4 className="text-[10px] font-bold tracking-[0.12em] uppercase text-white/45 mb-2">{titulo}</h4>
      <div className="text-xs text-white/55 leading-relaxed space-y-2">{children}</div>
    </div>
  );
}

export default function MethodologySection({ analisis }: Props) {
  const umbralPeso = CATALOGO.peso_kg.umbralInsignificante;
  const umbralGrasa = CATALOGO.grasa_pct.umbralInsignificante;
  const limitaciones = analisis.avisos.filter((a) => a.tipo === "limitacion");

  return (
    <div className="space-y-5">
      <Bloque titulo="Cómo se realizó el análisis">
        <p>
          Las mediciones se ordenan cronológicamente y se comparan la más reciente contra la
          inmediatamente anterior. Cada variable se evalúa por separado: una variable ausente en
          cualquiera de las dos mediciones se declara no comparable, nunca se asume en cero ni se
          interpola.
        </p>
        <p>
          Las tendencias son descriptivas, no estadísticas: no se aplica regresión, suavizado ni
          proyección. Con dos registros se describe la diferencia entre ellos; solo a partir de tres
          se habla de una serie con dirección, y siempre sobre lo ya ocurrido, nunca sobre lo que
          vendrá.
        </p>
      </Bloque>

      <Bloque titulo="Reglas aplicadas">
        <ul className="list-disc pl-4 space-y-1">
          <li>
            Un cambio se considera relevante solo si supera el umbral definido para esa variable:{" "}
            {umbralPeso} kg en peso y {umbralGrasa} puntos en porcentaje de grasa. Son criterios de
            producto para reducir ruido, sin base clínica.
          </li>
          <li>
            El resto de variables no tiene umbral documentado: su cambio se describe, pero no se
            afirma que sea relevante ni irrelevante.
          </li>
          <li>
            Se verifica que masa grasa y masa libre de grasa reconstruyan el peso registrado con una
            tolerancia de ±{TOLERANCIA_SUMA_MASAS_KG} kg, y que ninguna masa supere el peso total.
          </li>
          <li>
            Se comprueba que cada valor caiga dentro de su rango físico de referencia y que los
            cambios entre mediciones cercanas sean plausibles en el plazo transcurrido.
          </li>
        </ul>
      </Bloque>

{/* La lista de limitaciones vivía aquí Y en «Qué no puede interpretarse»,
          palabra por palabra. Se conserva el recuento y se apunta al apartado
          que las detalla: repetirlas no las explicaba mejor, alargaba el
          documento. */}
      <Bloque titulo="Qué no pudo interpretarse">
        <p>
          {limitaciones.length === 0
            ? 'No se registraron limitaciones de interpretación para las mediciones incluidas en este reporte.'
            : limitaciones.length === 1
              ? 'Un aspecto no pudo interpretarse. Se detalla en el apartado «Qué no puede interpretarse», con el motivo concreto y qué haría falta para resolverlo.'
              : `${limitaciones.length} aspectos no pudieron interpretarse. Se detallan en el apartado «Qué no puede interpretarse», cada uno con su motivo concreto y qué haría falta para resolverlo.`}
        </p>
      </Bloque>

      <Bloque titulo="Alcance">
        <p>
          Este documento describe la evolución de variables medidas por bioimpedancia. No es un
          diagnóstico médico ni una evaluación del estado de salud, y no establece relaciones de
          causa entre los cambios observados. Las clasificaciones que incluye son posiciones dentro
          de rangos de referencia poblacionales, que no están validados específicamente para personas
          con alta masa muscular.
        </p>
      </Bloque>
    </div>
  );
}
