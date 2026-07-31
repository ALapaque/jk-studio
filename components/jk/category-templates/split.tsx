import Link from "next/link";
import Image from "next/image";
import { countLabel } from "@/lib/types";
import { Reveal } from "@/components/jk/Reveal";
import { CategoryMedia } from "@/components/jk/CategoryMedia";
import type { CategoryTemplateProps } from "./types";

/* Catégorie « split » — séries en cartes, médias en planche.
 *
 * En-tête texte (sans grande cover), les séries en grille de cartes couverture
 * (mini-affiches cliquables) plutôt qu'en liste, puis la sélection de médias
 * directs. Plus visuel que `classic` pour les séries. */

export function CategorySplit({ category: cat }: CategoryTemplateProps) {
  const hasMedia = (cat.directMedia?.length ?? 0) > 0;

  return (
    <main
      style={{
        minHeight: "100svh",
        padding:
          "clamp(96px, 14vh, 140px) var(--jk-gap-page) var(--jk-gap-section)",
        background: "var(--jk-bg)",
        color: "var(--jk-ink)",
      }}
    >
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <Reveal as="div" style={{ display: "grid", gap: 18, marginBottom: "clamp(40px, 6vw, 72px)" }}>
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
          <span style={{ color: "var(--jk-brass)" }}>({cat.num})</span>
          {countLabel(cat)}
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--jk-serif)",
            fontWeight: 400,
            fontSize: "clamp(44px, 7vw, 96px)",
            lineHeight: 0.98,
            letterSpacing: "var(--jk-ls-display)",
          }}
        >
          {cat.title}
        </h1>
        {cat.description && (
          <p
            style={{
              margin: 0,
              maxWidth: "52ch",
              fontFamily: "var(--jk-serif)",
              fontSize: "clamp(18px, 2.2vw, 22px)",
              lineHeight: "var(--jk-lh-body)",
              color: "var(--jk-ink-mute)",
            }}
          >
            {cat.description}
          </p>
        )}
      </Reveal>

      {/* Séries en cartes couverture */}
      {cat.series.length > 0 && (
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(18px, 2.4vw, 32px)",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {cat.series.map((s, i) => {
            const photo = s.photos[0];
            return (
              <li key={s.slug}>
                <Reveal as="div" delay={Math.min(i, 6) * 70}>
                  <Link
                    href={`/travaux/${cat.slug}/${s.slug}`}
                    data-jk-label={s.title}
                    style={{
                      position: "relative",
                      display: "block",
                      height: "clamp(360px, 46vh, 480px)",
                      overflow: "hidden",
                      background: "var(--jk-surface)",
                      color: "#efe9e1",
                    }}
                  >
                    {(s.coverSrc || photo) && (
                      <Image
                        src={s.coverSrc || photo.src}
                        alt=""
                        aria-hidden
                        fill
                        sizes="(max-width: 760px) 100vw, 33vw"
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
                          "linear-gradient(to bottom, rgba(14,12,10,.15) 0%, rgba(14,12,10,0) 40%, rgba(14,12,10,.8) 100%)",
                      }}
                    />
                    <div
                      style={{
                        position: "absolute",
                        left: 22,
                        right: 22,
                        bottom: 22,
                        display: "grid",
                        gap: 8,
                      }}
                    >
                      <span
                        style={{
                          fontFamily: "var(--jk-serif)",
                          fontSize: "clamp(24px, 3vw, 34px)",
                          lineHeight: 1.02,
                        }}
                      >
                        {s.title}
                      </span>
                      <span
                        style={{
                          fontSize: 9,
                          letterSpacing: "0.24em",
                          textTransform: "uppercase",
                          color: "rgba(239,233,225,.72)",
                        }}
                      >
                        {[s.location, s.period].filter(Boolean).join(" · ")}
                      </span>
                    </div>
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      )}

      {hasMedia && (
        <div style={{ marginTop: "clamp(64px, 9vw, 120px)", display: "grid", gap: 40 }}>
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
            <span aria-hidden style={{ width: 44, height: 1, background: "var(--jk-brass)" }} />
            Sélection
          </span>
          <CategoryMedia media={cat.directMedia ?? []} />
        </div>
      )}

      {cat.series.length === 0 && !hasMedia && (
        <p style={{ color: "var(--jk-ink-mute)", fontSize: 14 }}>
          Aucune série ni média publié dans cet univers pour l&apos;instant.
        </p>
      )}
    </main>
  );
}
