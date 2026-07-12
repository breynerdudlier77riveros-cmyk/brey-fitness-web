import { ImageResponse } from "next/og";

export const size = { width: 64, height: 64 };
export const contentType = "image/png";

// Favicon de marca: tile naranja con la B de Brey.
export default function Icon() {
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
          borderRadius: 14,
          color: "#ffffff",
          fontSize: 44,
        }}
      >
        B
      </div>
    ),
    { ...size }
  );
}
