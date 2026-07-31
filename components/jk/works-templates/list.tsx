import Link from "next/link";
import { countLabel } from "@/lib/types";
import { IndexRow } from "@/components/jk/IndexRow";
import { Reveal } from "@/components/jk/Reveal";
import type { WorksTemplateProps } from "./types";

/* Portfolio « list » — index typographique dense.
 *
 * Chaque catégorie est un titre cliquable, ses séries listées en dessous (aperçu
 * de la cover au survol du curseur). Contrepoint des affiches : rapide à
 * parcourir, très éditorial. */

export function WorksList({ cats, content }: WorksTemplateProps) {
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

      <Reveal
        as="div"
        style={{
          marginBottom: "clamp(40px, 6vw, 72px)",
        }}
      >
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

      {cats.map((c) => (
        <section key={c.slug} style={{ marginBottom: "clamp(40px, 6vw, 64px)" }}>
          <h2 style={{ margin: "0 0 14px" }}>
            <Link
              href={`/travaux/${c.slug}`}
              data-jk-label={c.title}
              className="jk-cat-link"
              style={{
                display: "inline-flex",
                alignItems: "baseline",
                gap: 10,
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "var(--jk-track-label)",
                textTransform: "uppercase",
                color: "var(--jk-brass)",
              }}
            >
              <span>
                {c.num} {c.title} — {countLabel(c)}
              </span>
              <span aria-hidden className="jk-cat-link__arrow">
                →
              </span>
            </Link>
          </h2>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              borderBottom: "1px solid var(--jk-rule)",
            }}
          >
            {c.series.map((s, i) => (
              <IndexRow
                key={s.slug}
                href={`/travaux/${c.slug}/${s.slug}`}
                num={String(i + 1).padStart(2, "0")}
                title={s.title}
                location={s.location}
                period={s.period}
                previewSrc={s.coverSrc || s.photos[0]?.src}
                delay={Math.min(i, 5) * 60}
              />
            ))}
            {c.series.length === 0 && (
              <li
                style={{
                  padding: "22px 0",
                  borderTop: "1px solid var(--jk-rule)",
                  fontSize: 13,
                  color: "var(--jk-ink-mute)",
                }}
              >
                Aucune série publiée pour l&apos;instant.
              </li>
            )}
          </ul>
        </section>
      ))}
    </main>
  );
}
