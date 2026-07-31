import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import { deriveHomeData } from "./shared";
import type { HomeTemplateProps } from "./types";

/* Accueil « poster » — l'affiche.
 *
 * Une seule grande image plein écran, le nom/titre en surimpression (accroche +
 * grand titre du hero), et un index de catégories minimal en pied. Déclaration
 * d'ouverture, très peu d'éléments. */

export function HomePoster({ cats, content }: HomeTemplateProps) {
  const { heroSlides, hero } = deriveHomeData(cats, content);
  const cover = heroSlides[0]?.src || hero?.src || "";
  const title = content.hero.titleLines?.filter(Boolean) ?? [];

  return (
    <main>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <section
        style={{
          position: "relative",
          height: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "var(--jk-surface)",
        }}
      >
        {cover && (
          <Parallax amplitude={0.22}>
            <Image src={cover} alt="" aria-hidden fill priority sizes="100vw" style={{ objectFit: "cover" }} />
          </Parallax>
        )}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "radial-gradient(120% 90% at 50% 42%, rgba(14,12,10,.2) 0%, rgba(14,12,10,.5) 60%, rgba(14,12,10,.82) 100%)",
          }}
        />
        <Reveal
          as="div"
          style={{
            position: "relative",
            display: "grid",
            gap: 22,
            justifyItems: "center",
            textAlign: "center",
            padding: "0 var(--jk-gap-page)",
            color: "#efe9e1",
            maxWidth: 1100,
          }}
        >
          <span style={{ fontSize: 10, letterSpacing: "var(--jk-track-label)", textTransform: "uppercase", color: "var(--jk-brass)" }}>
            {content.hero.eyebrow}
          </span>
          {title.length > 0 && (
            <h1
              style={{
                margin: 0,
                fontFamily: "var(--jk-serif)",
                fontWeight: 400,
                fontSize: "clamp(52px, 10vw, 148px)",
                lineHeight: 0.94,
                letterSpacing: "var(--jk-ls-display)",
              }}
            >
              {title.map((l, i) => (
                <span key={i} style={{ display: "block" }}>
                  {l}
                </span>
              ))}
            </h1>
          )}
          {content.hero.categoriesLine && (
            <span style={{ fontSize: 10, letterSpacing: "var(--jk-track-place)", textTransform: "uppercase", color: "rgba(239,233,225,.72)" }}>
              {content.hero.categoriesLine}
            </span>
          )}
        </Reveal>
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: 34,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1,
            height: 56,
            background: "linear-gradient(to bottom, transparent, var(--jk-brass))",
          }}
        />
      </section>

      {/* Index minimal des catégories */}
      <section
        style={{
          padding: "var(--jk-gap-section) var(--jk-gap-page)",
          display: "flex",
          flexWrap: "wrap",
          gap: "clamp(16px, 3vw, 40px)",
          alignItems: "baseline",
        }}
      >
        {cats.map((c) => (
          <Reveal as="span" key={c.slug} style={{ display: "inline-block" }}>
            <Link
              href={`/travaux/${c.slug}`}
              data-jk-label={c.title}
              className="jk-cat-link"
              style={{
                fontFamily: "var(--jk-serif)",
                fontSize: "clamp(28px, 4vw, 52px)",
                letterSpacing: "var(--jk-ls-tight)",
                color: "var(--jk-ink)",
              }}
            >
              {c.title}
              <span aria-hidden className="jk-cat-link__arrow" style={{ color: "var(--jk-brass)", marginLeft: 8, fontSize: "0.5em", verticalAlign: "middle" }}>
                →
              </span>
            </Link>
          </Reveal>
        ))}
      </section>
    </main>
  );
}
