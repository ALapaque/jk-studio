import type { Metadata } from "next";
import Image from "next/image";
import { getSiteContent } from "@/lib/content";
import { publicImageUrl } from "@/lib/supabase/storage";
import { Caption } from "@/components/jk/Caption";
import { Reveal } from "@/components/jk/Reveal";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getSiteContent();
  return { title: about.eyebrow, description: about.title };
}

/* À propos (refonte). Portrait du photographe en situation + texte à la
 * première personne — maquette écran 04. */

export default async function AProposPage() {
  const { about } = await getSiteContent();
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

      <div
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 400px) minmax(0, 1fr)",
          gap: "clamp(2.5rem, 6vw, 5rem)",
          alignItems: "start",
        }}
        className="jk-studio-grid"
      >
        {/* Portrait en situation — pas une réalisation (§9). */}
        <Reveal
          as="div"
          style={{
            position: "relative",
            height: "clamp(440px, 70vh, 760px)",
            overflow: "hidden",
            background: "var(--jk-surface)",
          }}
        >
          {portrait && (
            <Image
              src={portrait}
              alt={about.portraitCaption || about.title}
              fill
              sizes="(max-width: 900px) 100vw, 400px"
              className="jk-zoom"
              style={{ objectFit: "cover" }}
            />
          )}
        </Reveal>

        <Reveal
          as="div"
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 40,
            paddingTop: 6,
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: 14,
              fontSize: 10,
              letterSpacing: "var(--jk-track-label)",
              textTransform: "uppercase",
              color: "var(--jk-ink-mute)",
            }}
          >
            <span style={{ color: "var(--jk-brass)" }}>(04)</span>
            {about.eyebrow}
          </span>

          <div style={{ display: "grid", gap: 24 }}>
            {about.paragraphs.map((p, i) => (
              <p
                key={i}
                style={{
                  margin: 0,
                  maxWidth: "52ch",
                  fontFamily: "var(--jk-serif)",
                  fontSize: "clamp(20px, 2.6vw, 30px)",
                  lineHeight: 1.42,
                  letterSpacing: "var(--jk-ls-tight)",
                  textWrap: "pretty",
                }}
              >
                {p}
              </p>
            ))}
          </div>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: 16,
              borderTop: "1px solid var(--jk-rule)",
              paddingTop: 24,
            }}
          >
            <Caption
              subject={about.portraitCaption}
              location={about.portraitYear}
              variant="fullscreen"
            />
          </div>
        </Reveal>
      </div>
    </main>
  );
}
