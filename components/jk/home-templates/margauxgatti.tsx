import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import { deriveHomeData } from "./shared";
import type { HomeTemplateProps } from "./types";

/* Template « margauxgatti » de l'accueil.
 *
 * Reprend la composition de margauxgatti.fr : hero éditorial deux colonnes
 * (intitulé de services + « Photographe » à gauche, portrait à droite), une
 * courte présentation centrée, une rangée « Mes dernières histoires » (trois
 * cartes), puis chaque catégorie en grande section pleine largeur avec image
 * et texte qui alternent de côté. Nourri par le contenu de JKStudio (aucune
 * donnée du site d'origine) et rendu avec les jetons du thème. */

export function HomeMargauxGatti({ cats, content }: HomeTemplateProps) {
  const { hero, heroSlides, studioPortrait, selection } = deriveHomeData(
    cats,
    content,
  );
  const heroImg = heroSlides[0]?.src
    ? { src: heroSlides[0].src, alt: heroSlides[0].caption || content.brand.name }
    : hero
      ? { src: hero.src, alt: hero.alt }
      : studioPortrait
        ? { src: studioPortrait.src, alt: studioPortrait.alt }
        : null;

  const stories = selection.slice(0, 3);
  const tagline =
    content.hero.categoriesLine || content.hero.titleLines.join(" ");

  return (
    <main style={{ background: "var(--jk-bg)" }}>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      {/* ---- hero éditorial deux colonnes ---- */}
      <section
        className="jk-studio-grid"
        style={{
          minHeight: "92svh",
          padding:
            "clamp(120px, 16vh, 200px) var(--jk-gap-page) var(--jk-gap-section)",
          display: "grid",
          gridTemplateColumns: "minmax(0, 1fr) minmax(0, 46%)",
          gap: "var(--jk-gap-col)",
          alignItems: "center",
        }}
      >
        <Reveal as="div" style={{ display: "grid", gap: "clamp(24px, 3vw, 40px)" }}>
          <span
            style={{
              fontSize: 11,
              letterSpacing: "var(--jk-track-label)",
              textTransform: "uppercase",
              color: "var(--jk-brass)",
            }}
          >
            {content.hero.eyebrow}
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(40px, 6.4vw, 88px)",
              lineHeight: 1.02,
              letterSpacing: "var(--jk-ls-display)",
              textWrap: "balance",
            }}
          >
            {tagline}
          </h1>
          <p
            style={{
              margin: 0,
              fontSize: 13,
              letterSpacing: "0.42em",
              textTransform: "uppercase",
              color: "var(--jk-ink-mute)",
            }}
          >
            {content.nav.portfolio || content.brand.name}
          </p>
        </Reveal>

        {heroImg && (
          <Reveal
            as="div"
            style={{
              position: "relative",
              height: "clamp(440px, 74vh, 780px)",
              overflow: "hidden",
              background: "var(--jk-surface)",
            }}
          >
            <Parallax amplitude={0.12}>
              <Image
                src={heroImg.src}
                alt={heroImg.alt}
                fill
                sizes="(max-width: 900px) 100vw, 46vw"
                priority
                style={{ objectFit: "cover" }}
              />
            </Parallax>
          </Reveal>
        )}
      </section>

      {/* ---- présentation centrée ---- */}
      <section
        style={{
          padding: "var(--jk-gap-section) var(--jk-gap-page)",
          display: "grid",
          justifyItems: "center",
          textAlign: "center",
          gap: 28,
        }}
      >
        <Reveal as="div" style={{ display: "grid", justifyItems: "center", gap: 28 }}>
          <p
            style={{
              margin: 0,
              maxWidth: "34ch",
              fontFamily: "var(--jk-serif)",
              fontSize: "clamp(22px, 3vw, 34px)",
              lineHeight: 1.4,
              letterSpacing: "var(--jk-ls-tight)",
              textWrap: "pretty",
            }}
          >
            {content.studio.lead}
            <em style={{ color: "var(--jk-brass)" }}>{content.studio.leadEm}</em>
          </p>
          <p
            style={{
              margin: 0,
              maxWidth: "58ch",
              fontSize: 15,
              lineHeight: 1.7,
              color: "var(--jk-ink-mute)",
            }}
          >
            {content.studio.paragraph}
          </p>
        </Reveal>
      </section>

      {/* ---- « Mes dernières histoires » ---- */}
      {stories.length > 0 && (
        <section
          style={{
            padding: "0 var(--jk-gap-page) var(--jk-gap-section)",
            display: "grid",
            gap: 44,
          }}
        >
          <Reveal as="div" style={{ textAlign: "center" }}>
            <h2
              style={{
                margin: 0,
                fontFamily: "var(--jk-serif)",
                fontWeight: 400,
                fontStyle: "italic",
                fontSize: "clamp(26px, 3.6vw, 44px)",
                letterSpacing: "var(--jk-ls-tight)",
              }}
            >
              {content.home.selectionTitle}
            </h2>
          </Reveal>

          <ul
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "48px var(--jk-gap-grid)",
              listStyle: "none",
              margin: 0,
              padding: 0,
            }}
          >
            {stories.map(({ cat, serie }, i) => {
              const photo = serie.photos[0];
              const src = serie.coverSrc || photo?.src;
              return (
                <li key={`${cat.slug}/${serie.slug}`}>
                  <Reveal as="div" delay={Math.min(i, 3) * 90}>
                    <Link
                      href={`/travaux/${cat.slug}/${serie.slug}`}
                      data-jk-label={serie.title}
                      style={{ display: "grid", gap: 18, color: "inherit" }}
                    >
                      <span
                        style={{
                          position: "relative",
                          display: "block",
                          height: 380,
                          overflow: "hidden",
                          background: "var(--jk-surface)",
                        }}
                      >
                        {src && (
                          <Image
                            src={src}
                            alt={photo?.alt ?? serie.title}
                            fill
                            sizes="(max-width: 760px) 100vw, 33vw"
                            className="jk-zoom"
                            style={{ objectFit: "cover" }}
                          />
                        )}
                      </span>
                      <span style={{ display: "grid", gap: 6, textAlign: "center" }}>
                        <span
                          style={{
                            fontSize: 10,
                            letterSpacing: "0.24em",
                            textTransform: "uppercase",
                            color: "var(--jk-ink-mute)",
                          }}
                        >
                          {cat.title}
                        </span>
                        <span
                          style={{
                            fontFamily: "var(--jk-serif)",
                            fontSize: 22,
                            letterSpacing: "var(--jk-ls-tight)",
                          }}
                        >
                          {serie.title}
                        </span>
                      </span>
                    </Link>
                  </Reveal>
                </li>
              );
            })}
          </ul>
        </section>
      )}

      {/* ---- catégories : grandes sections alternées image / texte ---- */}
      {cats.map((c, i) => {
        const n =
          c.series.reduce((acc, s) => acc + s.photos.length, 0) +
          (c.directMedia?.filter((m) => m.kind === "photo").length ?? 0);
        const imageLeft = i % 2 === 0;
        return (
          <section
            key={c.slug}
            className="jk-split-row"
            style={{
              display: "grid",
              gridTemplateColumns: "minmax(0, 1fr) minmax(0, 1fr)",
              alignItems: "center",
              gap: "var(--jk-gap-col)",
              padding: "0 var(--jk-gap-page) var(--jk-gap-section)",
            }}
          >
            <Reveal
              as="div"
              style={{
                position: "relative",
                height: "clamp(380px, 60vh, 660px)",
                overflow: "hidden",
                background: "var(--jk-surface)",
                order: imageLeft ? 0 : 1,
              }}
            >
              {c.coverSrc && (
                <Parallax amplitude={0.1}>
                  <Image
                    src={c.coverSrc}
                    alt={c.title}
                    fill
                    sizes="(max-width: 900px) 100vw, 50vw"
                    style={{ objectFit: "cover" }}
                  />
                </Parallax>
              )}
            </Reveal>

            <Reveal
              as="div"
              style={{
                display: "grid",
                gap: 24,
                justifyItems: "start",
                padding: "0 clamp(0px, 3vw, 48px)",
                order: imageLeft ? 1 : 0,
              }}
            >
              <span
                style={{
                  fontSize: 11,
                  letterSpacing: "var(--jk-track-label)",
                  textTransform: "uppercase",
                  color: "var(--jk-brass)",
                }}
              >
                {c.num} — {n} {c.unit}
              </span>
              <h2
                style={{
                  margin: 0,
                  fontFamily: "var(--jk-serif)",
                  fontWeight: 400,
                  fontSize: "clamp(30px, 4.4vw, 58px)",
                  lineHeight: 1.04,
                  letterSpacing: "var(--jk-ls-display)",
                }}
              >
                {c.title}
              </h2>
              {(c.subtitle || c.description) && (
                <p
                  style={{
                    margin: 0,
                    maxWidth: "42ch",
                    fontSize: 15,
                    lineHeight: 1.7,
                    color: "var(--jk-ink-mute)",
                  }}
                >
                  {c.subtitle || c.description}
                </p>
              )}
              <Link
                href={`/travaux/${c.slug}`}
                style={{
                  fontSize: 11,
                  letterSpacing: "0.24em",
                  textTransform: "uppercase",
                  color: "var(--jk-ink)",
                  borderBottom: "1px solid var(--jk-brass)",
                  paddingBottom: 4,
                }}
              >
                {content.home.categoriesLink}
              </Link>
            </Reveal>
          </section>
        );
      })}
    </main>
  );
}
