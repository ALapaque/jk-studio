import Image from "next/image";
import { publicImageUrl } from "@/lib/supabase/storage";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import type { AboutTemplateProps } from "./types";

/* À-propos « columns » — magazine.
 *
 * Grand titre, portrait en bandeau large, puis le récit en deux colonnes de
 * texte (comme une page de magazine) et les faits en pied. */

export function AboutColumns({ about }: AboutTemplateProps) {
  const portrait = publicImageUrl(about.portraitPath);

  return (
    <main
      style={{
        minHeight: "100svh",
        padding:
          "clamp(96px, 14vh, 140px) var(--jk-gap-page) var(--jk-gap-section)",
      }}
    >
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <Reveal as="div" style={{ display: "grid", gap: 18, marginBottom: "clamp(32px, 5vw, 56px)", maxWidth: "24ch" }}>
        <span style={{ fontSize: 10, letterSpacing: "var(--jk-track-label)", textTransform: "uppercase", color: "var(--jk-ink-mute)" }}>
          <span style={{ color: "var(--jk-brass)" }}>(04)</span> {about.eyebrow}
        </span>
        <h1 style={{ margin: 0, fontFamily: "var(--jk-serif)", fontWeight: 400, fontSize: "clamp(44px, 7vw, 92px)", lineHeight: 0.98, letterSpacing: "var(--jk-ls-display)" }}>
          {about.title}
        </h1>
      </Reveal>

      {portrait && (
        <Reveal
          as="div"
          style={{
            position: "relative",
            height: "clamp(360px, 56vh, 560px)",
            overflow: "hidden",
            background: "var(--jk-surface)",
            marginBottom: "clamp(40px, 6vw, 72px)",
          }}
        >
          <Parallax>
            <Image src={portrait} alt={about.portraitCaption || about.title} fill priority sizes="100vw" style={{ objectFit: "cover" }} />
          </Parallax>
        </Reveal>
      )}

      <Reveal
        as="div"
        style={{
          columns: "2 300px",
          columnGap: "clamp(28px, 4vw, 56px)",
          maxWidth: 1100,
        }}
      >
        {about.paragraphs.map((p, i) => (
          <p
            key={i}
            style={{
              margin: "0 0 1.1em",
              breakInside: "avoid",
              fontFamily: "var(--jk-sans)",
              fontSize: "clamp(15px, 1.3vw, 17px)",
              lineHeight: "var(--jk-lh-body)",
              color: "var(--jk-ink)",
            }}
          >
            {p}
          </p>
        ))}
      </Reveal>

      {about.facts.length > 0 && (
        <Reveal
          as="div"
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(0, 180px))",
            gap: 24,
            borderTop: "1px solid var(--jk-rule)",
            paddingTop: 28,
            marginTop: "clamp(40px, 6vw, 64px)",
          }}
        >
          {about.facts.map((f) => (
            <div key={f.k}>
              <div style={{ fontSize: 9, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--jk-ink-mute)", marginBottom: 8 }}>
                {f.k}
              </div>
              <div style={{ fontSize: 14 }}>{f.v}</div>
            </div>
          ))}
        </Reveal>
      )}
    </main>
  );
}
