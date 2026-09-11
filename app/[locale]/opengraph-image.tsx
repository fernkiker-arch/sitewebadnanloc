import { ImageResponse } from "next/og";

export const alt = "SwiftXpress — Livraison locale à Montréal";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          position: "relative",
          overflow: "hidden",
          background: "#09243a",
          color: "#fff",
          padding: "76px 84px",
          fontFamily: "Arial, sans-serif",
        }}
      >
        <div
          style={{
            position: "absolute",
            width: 500,
            height: 500,
            right: -120,
            top: -110,
            borderRadius: 999,
            border: "90px solid #ff5a36",
            opacity: 0.95,
          }}
        />
        <div
          style={{
            position: "absolute",
            width: 420,
            height: 14,
            right: 60,
            bottom: 115,
            background: "#ffd85c",
            transform: "rotate(-20deg)",
          }}
        />
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            justifyContent: "space-between",
          }}
        >
          <div style={{ display: "flex", fontSize: 44, fontWeight: 800 }}>
            Swift<span style={{ color: "#ff5a36" }}>Xpress</span>
          </div>
          <div style={{ display: "flex", flexDirection: "column", gap: 18 }}>
            <div
              style={{
                display: "flex",
                color: "#ffd85c",
                fontSize: 24,
                fontWeight: 700,
                letterSpacing: 3,
                textTransform: "uppercase",
              }}
            >
              Montréal et environs
            </div>
            <div
              style={{
                display: "flex",
                maxWidth: 780,
                fontSize: 68,
                fontWeight: 800,
                lineHeight: 1.03,
              }}
            >
              Livraison locale. Local delivery.
            </div>
            <div style={{ display: "flex", fontSize: 26, opacity: 0.78 }}>
              438-227-6337 · swiftxpress.ca
            </div>
          </div>
        </div>
      </div>
    ),
    size,
  );
}
