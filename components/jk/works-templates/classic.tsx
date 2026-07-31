import Link from "next/link";
import Image from "next/image";
import { countLabel } from "@/lib/types";
import { Reveal } from "@/components/jk/Reveal";
import type { WorksTemplateProps } from "./types";

/* Template « classic » de l'index Portfolio — grille d'affiches de catégories
 * (cover plein cadre, numéro fantôme, titre, décompte). Extrait tel quel. */

export function WorksClassic({ cats, content }: WorksTemplateProps) {
  const totalPhotos = cats.reduce(
    (acc, c) =>
      acc +
      c.series.reduce((n, s) => n + s.photos.length, 0) +
      (c.directMedia?.filter((m) => m.kind === "photo").length ?? 0),
    0,
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

      {/* ---- en-tête ---- */}
      <Reveal
        as="div"
        style={{
          display: "grid",
          gap: 20,
          marginBottom: "clamp(40px, 6vw, 72px)",
          maxWidth: "70ch",
        }}
      >
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            fontSize: 10,
            letterSpacing: "var(--jk-track-label)",
            textTransform: "uppercase",
            color: "var(--jk-ink-mute)",
          }}
        >
          <span
            aria-hidden
            style={{ width: 44, height: 1, background: "var(--jk-brass)" }}
          />
          {cats.length} univers · {totalPhotos} image{totalPhotos > 1 ? "s" : ""}
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--jk-serif)",
            fontWeight: 400,
            fontSize: "clamp(48px, 8vw, 104px)",
            lineHeight: 0.98,
            letterSpacing: "var(--jk-ls-display)",
          }}
        >
          {content.home.categoriesTitle}
        </h1>
      </Reveal>

      {/* ---- affiches de catégories ---- */}
      {cats.length > 0 ? (
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 460px), 1fr))",
            gap: "clamp(16px, 2vw, 28px)",
          }}
        >
          {cats.map((c, i) => (
            <li key={c.slug}>
              <Reveal as="div" delay={Math.min(i, 6) * 90}>
                <Link
                  href={`/travaux/${c.slug}`}
                  data-jk-label={c.title}
                  className="jk-cat-link"
                  style={{
                    position: "relative",
                    display: "block",
                    height: "clamp(440px, 60vh, 660px)",
                    overflow: "hidden",
                    background: "var(--jk-surface)",
                    color: "#efe9e1",
                  }}
                >
                  {c.coverSrc && (
                    <Image
                      src={c.coverSrc}
                      alt=""
                      aria-hidden
                      fill
                      sizes="(max-width: 900px) 100vw, 50vw"
                      className="jk-zoom"
                      style={{ objectFit: "cover" }}
                    />
                  )}

                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      inset: 0,
                      background:
                        "linear-gradient(to bottom, rgba(14,12,10,.5) 0%, rgba(14,12,10,0) 30%, rgba(14,12,10,0) 46%, rgba(14,12,10,.82) 100%)",
                    }}
                  />

                  <span
                    aria-hidden
                    style={{
                      position: "absolute",
                      top: "clamp(18px, 3vw, 34px)",
                      right: "clamp(20px, 3vw, 38px)",
                      fontFamily: "var(--jk-serif)",
                      fontSize: "clamp(40px, 6vw, 88px)",
                      lineHeight: 1,
                      color: "rgba(239,233,225,.28)",
                      letterSpacing: "var(--jk-ls-display)",
                    }}
                  >
                    {c.num}
                  </span>

                  <div
                    style={{
                      position: "absolute",
                      left: "clamp(22px, 3vw, 44px)",
                      right: "clamp(22px, 3vw, 44px)",
                      bottom: "clamp(24px, 3vw, 40px)",
                      display: "grid",
                      gap: 14,
                    }}
                  >
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 12,
                        fontSize: 10,
                        letterSpacing: "var(--jk-track-label)",
                        textTransform: "uppercase",
                        color: "var(--jk-brass)",
                      }}
                    >
                      {countLabel(c)}
                      {c.series.length > 0 && (
                        <span style={{ color: "rgba(239,233,225,.6)" }}>
                          · {c.series.length} série{c.series.length > 1 ? "s" : ""}
                        </span>
                      )}
                    </span>

                    <span
                      style={{
                        fontFamily: "var(--jk-serif)",
                        fontWeight: 400,
                        fontSize: "clamp(38px, 5vw, 72px)",
                        lineHeight: 0.98,
                        letterSpacing: "var(--jk-ls-display)",
                      }}
                    >
                      {c.title}
                    </span>

                    {c.subtitle && (
                      <span
                        style={{
                          fontFamily: "var(--jk-serif)",
                          fontStyle: "italic",
                          fontSize: "clamp(15px, 1.8vw, 19px)",
                          color: "rgba(239,233,225,.78)",
                          maxWidth: "46ch",
                        }}
                      >
                        {c.subtitle}
                      </span>
                    )}

                    <span
                      style={{
                        marginTop: 6,
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 10,
                        fontSize: 10,
                        letterSpacing: "0.24em",
                        textTransform: "uppercase",
                        color: "rgba(239,233,225,.82)",
                      }}
                    >
                      Voir la catégorie
                      <span aria-hidden className="jk-cat-link__arrow">
                        →
                      </span>
                    </span>
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "var(--jk-ink-mute)", fontSize: 14 }}>
          Aucune catégorie publiée pour l&apos;instant.
        </p>
      )}
    </main>
  );
}
