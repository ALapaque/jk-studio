import { ImageResponse } from "next/og";

export const alt = "JKStudio — Studio photo & vidéo, Bruxelles";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

// Carte de partage (Open Graph / Twitter) générée à la volée.
export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background:
            "radial-gradient(circle at 50% 38%, #191510 0%, #0b0a09 62%)",
          color: "#f0ece3",
          padding: 72,
        }}
      >
        <div
          style={{
            fontSize: 24,
            letterSpacing: 8,
            textTransform: "uppercase",
            color: "#8f887b",
          }}
        >
          Studio photo &amp; vidéo — Bruxelles
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 150, fontStyle: "italic", lineHeight: 1 }}>
            JKStudio
          </div>
          <div
            style={{
              marginTop: 20,
              fontSize: 40,
              color: "#b9b2a3",
              fontStyle: "italic",
            }}
          >
            Entrez dans l’image.
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            fontSize: 22,
            letterSpacing: 4,
            textTransform: "uppercase",
            color: "#8f887b",
          }}
        >
          <span style={{ color: "#d6bc8c" }}>
            Portrait · Mariage · Mode · Gaming · Vidéo
          </span>
          <span>50.85° N — 4.35° E</span>
        </div>
      </div>
    ),
    size,
  );
}
