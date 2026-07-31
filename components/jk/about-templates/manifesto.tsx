import { Reveal } from "@/components/jk/Reveal";
import type { AboutTemplateProps } from "./types";

/* À-propos « manifesto » — parti pris.
 *
 * Pas de portrait : une colonne étroite et calme, le récit puis les principes
 * en gros (champ `about.principles`, inexploité par `classic`), et les faits en
 * pied. Pour une déclaration d'intention. */

export function AboutManifesto({ about }: AboutTemplateProps) {
  return (
    <main
      style={{
        minHeight: "100svh",
        padding:
          "clamp(120px, 18vh, 190px) var(--jk-gap-page) var(--jk-gap-section)",
      }}
    >
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <div style={{ margin: "0 auto", maxWidth: 680, display: "grid", gap: "clamp(48px, 7vw, 88px)" }}>
        <Reveal as="div" style={{ display: "grid", gap: 22 }}>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "var(--jk-track-label)",
              textTransform: "uppercase",
              color: "var(--jk-ink-mute)",
            }}
          >
            <span style={{ color: "var(--jk-brass)" }}>(04)</span> {about.eyebrow}
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(32px, 4.4vw, 52px)",
              lineHeight: 1.06,
              letterSpacing: "var(--jk-ls-tight)",
            }}
          >
            {about.title}
          </h1>
          <div style={{ display: "grid", gap: 18 }}>
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  margin: 0,
                  fontFamily: "var(--jk-sans)",
                  fontSize: "clamp(16px, 1.4vw, 18px)",
                  lineHeight: "var(--jk-lh-body)",
                  color: "var(--jk-ink-mute)",
                }}
              >
                {p}
              </p>
            ))}
          </div>
        </Reveal>

        {about.principles.length > 0 && (
          <Reveal as="div" style={{ display: "grid", gap: 28, borderTop: "1px solid var(--jk-rule)", paddingTop: "clamp(40px, 6vw, 64px)" }}>
            {about.principles.map((pr, i) => (
              <p
                key={i}
                style={{
                  margin: 0,
                  fontFamily: "var(--jk-serif)",
                  fontSize: "clamp(26px, 3.4vw, 44px)",
                  lineHeight: 1.16,
                  letterSpacing: "var(--jk-ls-tight)",
                  textWrap: "pretty",
                }}
              >
                <span style={{ color: "var(--jk-brass)", fontSize: "0.6em" }}>
                  {String(i + 1).padStart(2, "0")}.{" "}
                </span>
                {pr}
              </p>
            ))}
          </Reveal>
        )}

        {about.facts.length > 0 && (
          <Reveal
            as="div"
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(0, 180px))",
              gap: 24,
              borderTop: "1px solid var(--jk-rule)",
              paddingTop: 28,
            }}
          >
            {about.facts.map((f) => (
              <div key={f.k}>
                <div
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "var(--jk-ink-mute)",
                    marginBottom: 8,
                  }}
                >
                  {f.k}
                </div>
                <div style={{ fontSize: 14 }}>{f.v}</div>
              </div>
            ))}
          </Reveal>
        )}
      </div>
    </main>
  );
}
