import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

// Icono de pantalla de inicio iOS. Apple aplica sus propias esquinas.
export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f97316",
          color: "#ffffff",
          fontSize: 118,
        }}
      >
        B
      </div>
    ),
    { ...size }
  );
}
