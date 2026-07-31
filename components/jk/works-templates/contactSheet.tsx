import Link from "next/link";
import Image from "next/image";
import { Caption } from "@/components/jk/Caption";
import { Reveal } from "@/components/jk/Reveal";
import type { WorksTemplateProps } from "./types";

/* Portfolio « contactSheet » — planche de tout le studio.
 *
 * Une grille dense de toutes les séries (une vignette de cover par série, toutes
 * catégories confondues), zoom au survol, légende sujet/catégorie. Vue d'ensemble
 * du portfolio d'un seul coup d'œil. */

export function WorksContactSheet({ cats, content }: WorksTemplateProps) {
  const items = cats.flatMap((c) =>
    c.series.map((s) => ({ cat: c, serie: s })),
  );

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

      <Reveal as="div" style={{ marginBottom: "clamp(32px, 5vw, 56px)" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--jk-serif)",
            fontWeight: 400,
            fontSize: "clamp(44px, 7vw, 92px)",
            lineHeight: 0.98,
            letterSpacing: "var(--jk-ls-display)",
          }}
        >
          {content.home.categoriesTitle}
        </h1>
      </Reveal>

      {items.length > 0 ? (
        <ul
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 220px), 1fr))",
            gap: "clamp(16px, 2vw, 30px)",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {items.map(({ cat, serie }, i) => {
            const photo = serie.photos[0];
            return (
              <li key={`${cat.slug}/${serie.slug}`}>
                <Reveal as="div" delay={Math.min(i, 8) * 55}>
                  <Link
                    href={`/travaux/${cat.slug}/${serie.slug}`}
                    data-jk-label={serie.title}
                    style={{ display: "grid", gap: 12, color: "inherit" }}
                  >
                    <span
                      style={{
                        position: "relative",
                        display: "block",
                        aspectRatio: "4 / 5",
                        overflow: "hidden",
                        background: "var(--jk-surface)",
                      }}
                    >
                      {(serie.coverSrc || photo) && (
                        <Image
                          src={serie.coverSrc || photo.src}
                          alt={photo?.alt ?? serie.title}
                          fill
                          sizes="(max-width: 760px) 50vw, 220px"
                          className="jk-zoom"
                          style={{ objectFit: "cover" }}
                        />
                      )}
                      <span
                        aria-hidden
                        style={{
                          position: "absolute",
                          top: 10,
                          left: 12,
                          fontSize: 9,
                          letterSpacing: "0.2em",
                          textTransform: "uppercase",
                          color: "rgba(239,233,225,.85)",
                          mixBlendMode: "difference",
                        }}
                      >
                        {cat.title}
                      </span>
                    </span>
                    <Caption
                      subject={serie.title}
                      location={serie.period || cat.title}
                      variant="thumbnail"
                    />
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      ) : (
        <p style={{ color: "var(--jk-ink-mute)", fontSize: 14 }}>
          Aucune série publiée pour l&apos;instant.
        </p>
      )}
    </main>
  );
}
