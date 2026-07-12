import { ImageResponse } from "next/og";

export const alt =
  "Brey Fitness — The Brey Performance System. El fin del entrenamiento a ciegas.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Imagen social del sitio (WhatsApp, Instagram, X). Se genera en build.
export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background:
            "radial-gradient(circle at 15% 0%, rgba(249, 115, 22, 0.22) 0%, rgba(2, 6, 23, 0) 45%), radial-gradient(circle at 100% 100%, rgba(249, 115, 22, 0.10) 0%, rgba(2, 6, 23, 0) 40%), #020617",
          color: "#ffffff",
        }}
      >
        {/* Wordmark */}
        <div style={{ display: "flex", alignItems: "center", gap: 18 }}>
          <div
            style={{
              width: 52,
              height: 52,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: "#f97316",
              borderRadius: 12,
              fontSize: 34,
              color: "#ffffff",
            }}
          >
            B
          </div>
          <div style={{ display: "flex", fontSize: 30, letterSpacing: 4 }}>
            <span style={{ color: "#fb923c" }}>BREY</span>
            <span style={{ color: "#ffffff", marginLeft: 12 }}>FITNESS</span>
          </div>
        </div>

        {/* Headline */}
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 84, lineHeight: 1.1, color: "#ffffff" }}>
            El fin del entrenamiento
          </div>
          <div style={{ fontSize: 84, lineHeight: 1.1, color: "#fb923c" }}>
            a ciegas.
          </div>
        </div>

        {/* Footer */}
        <div
          style={{
            display: "flex",
            fontSize: 26,
            color: "rgba(255, 255, 255, 0.6)",
            letterSpacing: 2,
          }}
        >
          The Brey Performance System · Entrenamiento basado en evidencia
        </div>
      </div>
    ),
    { ...size }
  );
}
