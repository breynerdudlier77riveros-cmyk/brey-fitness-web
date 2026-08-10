/**
 * Diagramas del artículo de full planche.
 *
 * Obra original: se dibujan en SVG en lugar de usar fotografías, de modo que
 * no dependen de licencias de terceros y escalan sin pérdida.
 *
 * Los valores numéricos proceden del cálculo de torque descrito en el artículo
 * (parámetros inerciales de segmento de de Leva, 1996) y de los datos de
 * electromiografía de Rosaci et al., 2025.
 */

const NARANJA = "#fb923c";
const TENUE = "rgba(255,255,255,0.28)";
const TRAZO = "rgba(255,255,255,0.75)";

// ─── 1 · Brazo de palanca: pino frente a planche ─────────────────────────────
export function DiagramaPalanca() {
  return (
    <svg
      viewBox="0 0 760 330"
      className="h-auto w-full"
      role="img"
      aria-label="Comparación del brazo de palanca entre el pino y la planche. En el pino la masa se apila sobre el hombro y el torque es casi nulo; en la planche la masa se proyecta 46 cm por delante y genera 286 N·m."
    >
      <defs>
        <marker id="pf" markerWidth="9" markerHeight="9" refX="8" refY="4.5" orient="auto">
          <path d="M0,0 L9,4.5 L0,9 z" fill={NARANJA} />
        </marker>
      </defs>

      {/* ── Panel izquierdo · pino ── */}
      <text x="30" y="28" fill="rgba(255,255,255,0.9)" fontSize="15" fontWeight="700">
        PINO A PULSO
      </text>
      <line x1="30" y1="275" x2="330" y2="275" stroke={TENUE} strokeWidth="2" />

      {/* cuerpo apilado */}
      <g stroke={TRAZO} strokeWidth="7" strokeLinecap="round" fill="none">
        <line x1="180" y1="275" x2="180" y2="205" />
        <line x1="180" y1="205" x2="180" y2="140" />
        <line x1="180" y1="140" x2="180" y2="75" />
      </g>
      <circle cx="180" cy="62" r="12" fill="none" stroke={TRAZO} strokeWidth="6" />

      {/* eje del hombro y centro de masas */}
      <line x1="180" y1="60" x2="180" y2="295" stroke={NARANJA} strokeWidth="1.5" strokeDasharray="5 5" opacity="0.75" />
      <circle cx="180" cy="150" r="7" fill={NARANJA} />
      <text x="196" y="148" fill={NARANJA} fontSize="12" fontWeight="700">
        centro de masas
      </text>
      <text x="196" y="164" fill="rgba(255,255,255,0.5)" fontSize="11">
        apilado sobre el hombro
      </text>

      <circle cx="180" cy="205" r="5.5" fill="#fff" />
      <text x="120" y="228" fill="rgba(255,255,255,0.55)" fontSize="11">
        hombro
      </text>

      <text x="82" y="308" fill={NARANJA} fontSize="15" fontWeight="800">
        d ≈ 0 cm → torque ≈ 0
      </text>

      {/* ── Separador ── */}
      <line x1="380" y1="20" x2="380" y2="310" stroke="rgba(255,255,255,0.1)" strokeWidth="1" />

      {/* ── Panel derecho · planche ── */}
      <text x="425" y="28" fill="rgba(255,255,255,0.9)" fontSize="15" fontWeight="700">
        FULL PLANCHE
      </text>
      <line x1="425" y1="275" x2="740" y2="275" stroke={TENUE} strokeWidth="2" />

      {/* brazo vertical + cuerpo horizontal */}
      <g stroke={TRAZO} strokeWidth="7" strokeLinecap="round" fill="none">
        <line x1="470" y1="275" x2="470" y2="185" />
        <line x1="470" y1="185" x2="580" y2="182" />
        <line x1="580" y1="182" x2="700" y2="180" />
      </g>
      <circle cx="450" cy="172" r="12" fill="none" stroke={TRAZO} strokeWidth="6" />
      <circle cx="470" cy="185" r="5.5" fill="#fff" />
      <text x="432" y="212" fill="rgba(255,255,255,0.55)" fontSize="11">
        hombro
      </text>

      {/* eje vertical del hombro */}
      <line x1="470" y1="120" x2="470" y2="295" stroke={NARANJA} strokeWidth="1.5" strokeDasharray="5 5" opacity="0.75" />

      {/* centro de masas desplazado */}
      <circle cx="604" cy="182" r="7" fill={NARANJA} />
      <line x1="604" y1="120" x2="604" y2="196" stroke={NARANJA} strokeWidth="1.5" strokeDasharray="5 5" opacity="0.75" />
      <text x="560" y="112" fill={NARANJA} fontSize="12" fontWeight="700">
        centro de masas
      </text>

      {/* cota del brazo de palanca */}
      <line x1="470" y1="132" x2="604" y2="132" stroke={NARANJA} strokeWidth="2" markerEnd="url(#pf)" />
      <text x="497" y="126" fill={NARANJA} fontSize="14" fontWeight="800">
        d = 46 cm
      </text>

      {/* vector peso */}
      <line x1="604" y1="196" x2="604" y2="240" stroke={NARANJA} strokeWidth="2.5" markerEnd="url(#pf)" />
      <text x="614" y="232" fill="rgba(255,255,255,0.6)" fontSize="11">
        peso
      </text>

      <text x="470" y="308" fill={NARANJA} fontSize="15" fontWeight="800">
        286 N·m sobre el hombro
      </text>
    </svg>
  );
}

// ─── 2 · Comparativa de progresiones ─────────────────────────────────────────
type Prog = {
  nombre: string;
  pct: number;
  nm: string;
  brazo: string;
  /** polilínea de las piernas, desde la cadera */
  piernas: string;
  destacada?: boolean;
};

const PROGRESIONES: Prog[] = [
  { nombre: "Tuck planche", pct: 59, nm: "168 N·m", brazo: "27 cm", piernas: "50,30 44,46 56,52" },
  { nombre: "Advanced tuck", pct: 70, nm: "201 N·m", brazo: "33 cm", piernas: "54,30 54,52 36,47" },
  { nombre: "Straddle planche", pct: 85, nm: "242–260 N·m", brazo: "39–42 cm", piernas: "54,30 80,22 100,16" },
  { nombre: "Half lay planche", pct: 92, nm: "249–265 N·m", brazo: "40–43 cm", piernas: "54,30 82,30 82,8", destacada: true },
  { nombre: "Full planche", pct: 100, nm: "286 N·m", brazo: "46 cm", piernas: "54,30 80,30 106,30" },
];

function MiniFigura({ piernas, destacada }: { piernas: string; destacada?: boolean }) {
  const c = destacada ? NARANJA : TRAZO;
  return (
    <g>
      <line x1="14" y1="66" x2="120" y2="66" stroke="rgba(255,255,255,0.14)" strokeWidth="1.5" />
      <g stroke={c} strokeWidth="5" strokeLinecap="round" strokeLinejoin="round" fill="none">
        {/* brazo vertical */}
        <line x1="28" y1="66" x2="28" y2="30" />
        {/* tronco */}
        <line x1="28" y1="30" x2="54" y2="30" />
        {/* piernas */}
        <polyline points={piernas} />
      </g>
      <circle cx="17" cy="23" r="6" fill="none" stroke={c} strokeWidth="4" />
      <circle cx="28" cy="30" r="3.5" fill="#fff" />
    </g>
  );
}

export function DiagramaProgresiones() {
  const filaAlto = 84;
  const alto = PROGRESIONES.length * filaAlto + 46;
  const x0 = 210;
  const anchoBarra = 380;

  return (
    <svg
      viewBox={`0 0 700 ${alto}`}
      className="h-auto w-full"
      role="img"
      aria-label="Comparativa de las progresiones de planche ordenadas por el torque que exigen, del tuck planche (59%) a la full planche (100%). La half lay planche alcanza el 92%."
    >
      <text x="8" y="18" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="600" letterSpacing="1">
        TORQUE EXIGIDO SOBRE EL HOMBRO · % DE LA FULL PLANCHE
      </text>

      {PROGRESIONES.map((p, i) => {
        const y = 44 + i * filaAlto;
        const w = (p.pct / 100) * anchoBarra;
        const col = p.destacada ? NARANJA : "rgba(255,255,255,0.34)";
        return (
          <g key={p.nombre}>
            <g transform={`translate(8, ${y - 20})`}>
              <MiniFigura piernas={p.piernas} destacada={p.destacada} />
            </g>

            <text
              x={x0 - 62}
              y={y + 16}
              fill={p.destacada ? "#fff" : "rgba(255,255,255,0.8)"}
              fontSize="13"
              fontWeight={p.destacada ? 800 : 600}
              textAnchor="end"
            >
              {p.nombre}
            </text>
            <text x={x0 - 62} y={y + 33} fill="rgba(255,255,255,0.4)" fontSize="11" textAnchor="end">
              brazo {p.brazo}
            </text>

            {/* pista + barra */}
            <rect x={x0} y={y} width={anchoBarra} height="26" rx="13" fill="rgba(255,255,255,0.05)" />
            <rect x={x0} y={y} width={w} height="26" rx="13" fill={col} />

            <text
              x={x0 + w + 12}
              y={y + 18}
              fill={p.destacada ? NARANJA : "rgba(255,255,255,0.75)"}
              fontSize="14"
              fontWeight="800"
            >
              {p.pct}%
            </text>
            <text x={x0 + 14} y={y + 45} fill="rgba(255,255,255,0.38)" fontSize="11">
              {p.nm}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

// ─── 3 · Mapa anatómico con activación EMG ───────────────────────────────────
const MUSCULOS = [
  { nombre: "Deltoides anterior", uv: "2043 µV", papel: "Motor principal de la flexión de hombro", op: 1 },
  { nombre: "Bíceps braquial", uv: "1738 µV", papel: "Estabiliza hombro y codo con el brazo bloqueado", op: 0.72 },
  { nombre: "Serrato anterior", uv: "1442 µV", papel: "Sostiene la protracción escapular", op: 0.5 },
];

export function DiagramaAnatomia() {
  return (
    <svg
      viewBox="0 0 700 380"
      className="h-auto w-full"
      role="img"
      aria-label="Los tres músculos con mayor activación durante la planche medidos por electromiografía: deltoides anterior 2043 microvoltios, bíceps braquial 1738 y serrato anterior 1442."
    >
      <text x="8" y="18" fill="rgba(255,255,255,0.5)" fontSize="11" fontWeight="600" letterSpacing="1">
        ACTIVACIÓN MEDIDA POR ELECTROMIOGRAFÍA · ROSACI ET AL., 2025
      </text>

      {/* silueta en planche */}
      <line x1="40" y1="300" x2="360" y2="300" stroke="rgba(255,255,255,0.14)" strokeWidth="2" />
      <g stroke="rgba(255,255,255,0.5)" strokeWidth="9" strokeLinecap="round" fill="none">
        <line x1="120" y1="300" x2="120" y2="180" />
        <line x1="120" y1="180" x2="230" y2="176" />
        <line x1="230" y1="176" x2="330" y2="172" />
      </g>
      <circle cx="98" cy="166" r="14" fill="none" stroke="rgba(255,255,255,0.5)" strokeWidth="7" />

      {/* zonas musculares */}
      <circle cx="120" cy="182" r="17" fill={NARANJA} opacity="1" />
      <circle cx="120" cy="235" r="14" fill={NARANJA} opacity="0.72" />
      <circle cx="168" cy="181" r="15" fill={NARANJA} opacity="0.5" />

      {/* guías */}
      <g stroke={NARANJA} strokeWidth="1.2" opacity="0.5">
        <line x1="137" y1="182" x2="392" y2="92" />
        <line x1="134" y1="235" x2="392" y2="184" />
        <line x1="183" y1="181" x2="392" y2="276" />
      </g>

      {/* leyenda */}
      {MUSCULOS.map((m, i) => {
        const y = 66 + i * 92;
        return (
          <g key={m.nombre}>
            <circle cx="404" cy={y + 26} r="9" fill={NARANJA} opacity={m.op} />
            <text x="424" y={y + 20} fill="#fff" fontSize="15" fontWeight="800">
              {m.nombre}
            </text>
            <text x="424" y={y + 40} fill={NARANJA} fontSize="14" fontWeight="700">
              {m.uv}
            </text>
            <text x="424" y={y + 60} fill="rgba(255,255,255,0.45)" fontSize="12">
              {m.papel}
            </text>
          </g>
        );
      })}
    </svg>
  );
}
