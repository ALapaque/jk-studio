import Link from "next/link";
import Image from "next/image";
import { Caption } from "@/components/jk/Caption";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import { ProofBand } from "@/components/jk/ProofBand";
import { HeroSlideshow } from "@/components/jk/HeroSlideshow";
import { CategoryRow } from "@/components/jk/CategoryRow";
import { deriveHomeData } from "./shared";
import type { HomeTemplateProps } from "./types";

/* Accueil « showcase » — la vitrine.
 *
 * Hero plein écran, puis une grande mosaïque « sélection » (tuiles de tailles
 * variées, bord à bord) comme pièce maîtresse, le studio et les catégories
 * ensuite. Pour mettre le travail en avant, image d'abord. */

export function HomeShowcase({ cats, content }: HomeTemplateProps) {
  const { heroSlides, hero, selection } = deriveHomeData(cats, content);

  return (
    <main>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      {/* ---- hero plein écran ---- */}
      <section
        style={{
          position: "relative",
          height: "100svh",
          background: "var(--jk-surface)",
          overflow: "hidden",
        }}
      >
        {heroSlides.length > 0 ? (
          <HeroSlideshow slides={heroSlides} />
        ) : (
          <>
            {hero && (
              <Parallax>
                <Image
                  src={hero.src}
                  alt={hero.alt}
                  fill
                  sizes="100vw"
                  priority
                  placeholder={hero.blurDataURL ? "blur" : "empty"}
                  blurDataURL={hero.blurDataURL || undefined}
                  style={{ objectFit: "cover" }}
                />
              </Parallax>
            )}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(14,12,10,.6) 0%, rgba(14,12,10,0) 34%, rgba(14,12,10,0) 58%, rgba(14,12,10,.72) 100%)",
              }}
            />
            <div style={{ position: "absolute", left: "var(--jk-gap-page)", bottom: 52 }}>
              <Reveal>
                <Caption
                  subject={hero?.subject}
                  location={hero?.place}
                  variant="hero"
                  tone="onImage"
                />
              </Reveal>
            </div>
          </>
        )}
        <span
          style={{
            position: "absolute",
            right: "var(--jk-gap-page)",
            bottom: 52,
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            fontSize: 10,
            letterSpacing: "0.24em",
            textTransform: "uppercase",
            color: "rgba(239,233,225,.6)",
          }}
        >
          {content.hero.scrollHint}
          <span aria-hidden style={{ width: 52, height: 1, background: "var(--jk-brass)" }} />
        </span>
      </section>

      {/* ---- (01) vitrine — grande mosaïque ---- */}
      {selection.length > 0 && (
        <section style={{ padding: "var(--jk-gap-section) var(--jk-gap-page) 0", display: "grid", gap: 40 }}>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 16,
              alignItems: "baseline",
              justifyContent: "space-between",
            }}
          >
            <SectionEyebrow num="01">{content.home.selectionTitle}</SectionEyebrow>
            <Link
              href="/travaux"
              style={{
                fontSize: 10,
                letterSpacing: "0.24em",
                textTransform: "uppercase",
                color: "var(--jk-ink-mute)",
                borderBottom: "1px solid var(--jk-brass)",
                paddingBottom: 3,
              }}
            >
              {content.home.categoriesLink}
            </Link>
          </div>

          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
              gridAutoFlow: "dense",
              gap: "clamp(10px, 1.2vw, 20px)",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {selection.slice(0, 9).map(({ cat, serie }, i) => {
              const photo = serie.photos[0];
              const wide = i % 4 === 0;
              return (
                <li key={`${cat.slug}/${serie.slug}`} style={{ gridColumn: wide ? "span 2" : undefined }}>
                  <Reveal as="div" delay={Math.min(i, 6) * 70}>
                    <Link
                      href={`/travaux/${cat.slug}/${serie.slug}`}
                      data-jk-label={serie.title}
                      style={{ display: "grid", gap: 12, color: "inherit" }}
                    >
                      <span
                        style={{
                          position: "relative",
                          display: "block",
                          aspectRatio: wide ? "16 / 10" : "3 / 4",
                          overflow: "hidden",
                          background: "var(--jk-surface)",
                        }}
                      >
                        {(serie.coverSrc || photo) && (
                          <Image
                            src={serie.coverSrc || photo.src}
                            alt={photo?.alt ?? serie.title}
                            fill
                            sizes={wide ? "66vw" : "33vw"}
                            className="jk-zoom"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </span>
                      <Caption
                        subject={photo?.subject || serie.title}
                        location={photo?.place || cat.title}
                        variant="thumbnail"
                      />
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ---- (02) le studio ---- */}
      <section style={{ padding: "var(--jk-gap-section) var(--jk-gap-page)", display: "grid", gap: 32, maxWidth: "60ch" }}>
        <SectionEyebrow num="02">{content.home.studioTitle}</SectionEyebrow>
        <Reveal as="div">
          <p
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontSize: "clamp(24px, 3.4vw, 38px)",
              lineHeight: 1.32,
              letterSpacing: "var(--jk-ls-tight)",
              textWrap: "pretty",
            }}
          >
            {content.studio.lead}
          </p>
        </Reveal>
      </section>

      {content.proof.enabled && (
        <ProofBand label={content.proof.label} clients={content.proof.clients} />
      )}

      {/* ---- (03) catégories ---- */}
      <section style={{ padding: "var(--jk-gap-section) var(--jk-gap-page)", display: "grid", gap: 40 }}>
        <SectionEyebrow num="03">{content.home.categoriesTitle}</SectionEyebrow>
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {cats.map((c, i) => {
            const n =
              c.series.reduce((acc, s) => acc + s.photos.length, 0) +
              (c.directMedia?.filter((m) => m.kind === "photo").length ?? 0);
            return (
              <CategoryRow
                key={c.slug}
                href={`/travaux/${c.slug}`}
                num={c.num}
                title={c.title}
                count={`${n} ${c.unit}`}
                coverSrc={c.coverSrc}
                last={i === cats.length - 1}
                delay={Math.min(i, 5) * 80}
              />
            );
          })}
        </ul>
      </section>
    </main>
  );
}

function SectionEyebrow({ num, children }: { num: string; children: React.ReactNode }) {
  return (
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
      <span style={{ color: "var(--jk-brass)" }}>({num})</span>
      {children}
    </span>
  );
}
