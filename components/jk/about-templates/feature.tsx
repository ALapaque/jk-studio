import Image from "next/image";
import { publicImageUrl } from "@/lib/supabase/storage";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import type { AboutTemplateProps } from "./types";

/* À-propos « feature » — grand format.
 *
 * Portrait plein cadre en ouverture, titre en surimpression, puis le récit en
 * colonne de lecture. Plus cinématographique que `classic`. */

export function AboutFeature({ about }: AboutTemplateProps) {
  const portrait = publicImageUrl(about.portraitPath);

  return (
    <main style={{ minHeight: "100svh" }}>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <section
        style={{
          position: "relative",
          height: portrait ? "clamp(480px, 82vh, 820px)" : "auto",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          background: "var(--jk-surface)",
          padding: portrait ? undefined : "clamp(120px, 18vh, 180px) var(--jk-gap-page) 0",
        }}
      >
        {portrait && (
          <Parallax amplitude={0.22}>
            <Image
              src={portrait}
              alt={about.portraitCaption || about.title}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </Parallax>
        )}
        {portrait && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(14,12,10,.4) 0%, rgba(14,12,10,0) 40%, rgba(14,12,10,.84) 100%)",
            }}
          />
        )}
        <Reveal
          as="div"
          style={{
            position: "relative",
            padding: portrait ? "0 var(--jk-gap-page) clamp(40px, 6vw, 80px)" : undefined,
            display: "grid",
            gap: 18,
            color: portrait ? "#efe9e1" : "var(--jk-ink)",
            maxWidth: 1000,
          }}
        >
          <span
            style={{
              fontSize: 10,
              letterSpacing: "var(--jk-track-label)",
              textTransform: "uppercase",
              color: "var(--jk-brass)",
            }}
          >
            (04) {about.eyebrow}
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(44px, 8vw, 104px)",
              lineHeight: 0.98,
              letterSpacing: "var(--jk-ls-display)",
            }}
          >
            {about.title}
          </h1>
        </Reveal>
      </section>

      <section
        style={{
          margin: "0 auto",
          maxWidth: 760,
          padding: "clamp(64px, 10vw, 130px) var(--jk-gap-page) var(--jk-gap-section)",
          display: "grid",
          gap: 28,
        }}
      >
        {about.paragraphs.map((p, i) => (
          <Reveal as="div" key={i} delay={Math.min(i, 5) * 60}>
            <p
              style={{
                margin: 0,
                fontFamily: "var(--jk-serif)",
                fontSize: "clamp(20px, 2.6vw, 30px)",
                lineHeight: 1.42,
                letterSpacing: "var(--jk-ls-tight)",
                textWrap: "pretty",
              }}
            >
              {p}
            </p>
          </Reveal>
        ))}
        {(about.portraitCaption || about.portraitYear) && (
          <span
            style={{
              marginTop: 8,
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--jk-ink-mute)",
            }}
          >
            {[about.portraitCaption, about.portraitYear].filter(Boolean).join(" — ")}
          </span>
        )}
      </section>
    </main>
  );
}
