import Image from "next/image";
import { publicImageUrl } from "@/lib/supabase/storage";
import { Reveal } from "@/components/jk/Reveal";
import type { AboutTemplateProps } from "./types";

/* À-propos « centered » — colonne centrée.
 *
 * Portrait centré en tête, puis le récit dans une colonne étroite centrée. Très
 * calme, symétrique. */

export function AboutCentered({ about }: AboutTemplateProps) {
  const portrait = publicImageUrl(about.portraitPath);

  return (
    <main
      style={{
        minHeight: "100svh",
        padding:
          "clamp(96px, 14vh, 150px) var(--jk-gap-page) var(--jk-gap-section)",
      }}
    >
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <div style={{ margin: "0 auto", maxWidth: 680, display: "grid", gap: "clamp(36px, 5vw, 60px)", justifyItems: "center", textAlign: "center" }}>
        {portrait && (
          <Reveal
            as="div"
            style={{
              position: "relative",
              width: "min(100%, 360px)",
              aspectRatio: "4 / 5",
              overflow: "hidden",
              background: "var(--jk-surface)",
            }}
          >
            <Image src={portrait} alt={about.portraitCaption || about.title} fill priority sizes="360px" className="jk-zoom" style={{ objectFit: "cover" }} />
          </Reveal>
        )}

        <Reveal as="div" style={{ display: "grid", gap: 18, justifyItems: "center" }}>
          <span style={{ fontSize: 10, letterSpacing: "var(--jk-track-label)", textTransform: "uppercase", color: "var(--jk-ink-mute)" }}>
            <span style={{ color: "var(--jk-brass)" }}>(04)</span> {about.eyebrow}
          </span>
          <h1 style={{ margin: 0, fontFamily: "var(--jk-serif)", fontWeight: 400, fontSize: "clamp(32px, 4.4vw, 52px)", lineHeight: 1.06, letterSpacing: "var(--jk-ls-tight)" }}>
            {about.title}
          </h1>
        </Reveal>

        <Reveal as="div" style={{ display: "grid", gap: 22 }}>
          {about.paragraphs.map((p, i) => (
            <p
              key={i}
              style={{
                margin: 0,
                fontFamily: "var(--jk-serif)",
                fontSize: "clamp(19px, 2.2vw, 26px)",
                lineHeight: 1.44,
                letterSpacing: "var(--jk-ls-tight)",
                textWrap: "pretty",
              }}
            >
              {p}
            </p>
          ))}
        </Reveal>

        {(about.portraitCaption || about.portraitYear) && (
          <span style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--jk-ink-mute)" }}>
            {[about.portraitCaption, about.portraitYear].filter(Boolean).join(" — ")}
          </span>
        )}
      </div>
    </main>
  );
}
