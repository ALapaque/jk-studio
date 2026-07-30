import Link from "next/link";
import { getSiteContent } from "@/lib/content";

/* 404 — layout racine (hors groupe refonte), donc sans nav ni voile. On
 * utilise les tokens --jk-* de la refonte, désormais la seule direction. */

export default async function NotFound() {
  const { notFound } = await getSiteContent();
  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        placeItems: "center",
        textAlign: "center",
        padding: "0 20px",
        background: "var(--jk-bg)",
        color: "var(--jk-ink)",
        fontFamily: "var(--jk-sans)",
      }}
    >
      <div>
        <div
          style={{
            fontSize: 10.5,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "var(--jk-ink-mute)",
            marginBottom: 20,
          }}
        >
          {notFound.eyebrow}
        </div>
        <h1
          style={{
            margin: "0 0 28px",
            fontFamily: "var(--jk-serif)",
            fontStyle: "italic",
            fontWeight: 400,
            fontSize: "clamp(48px,9vw,120px)",
            lineHeight: 0.95,
            letterSpacing: "-0.015em",
          }}
        >
          {notFound.title}
        </h1>
        <Link
          href="/"
          style={{
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--jk-brass)",
            borderBottom: "1px solid var(--jk-brass)",
            paddingBottom: 3,
          }}
        >
          {notFound.cta}
        </Link>
      </div>
    </main>
  );
}
