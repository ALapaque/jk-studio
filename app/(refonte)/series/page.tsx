import type { Metadata } from "next";
import { getCategories } from "@/lib/data";
import { getSiteContent } from "@/lib/content";
import { IndexRow } from "@/components/jk/IndexRow";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Séries",
  description:
    "L'ensemble des séries photographiques, par univers — Nightlife, mariages, événements.",
};

/* Index portfolio de la refonte (Lot 6).
 *
 * Route SÉPARÉE de `/travaux` : coexistence jusqu'à la bascule finale (§2).
 *
 * Format éditorial dense — grands numéros, filets fins, révélation d'image au
 * survol. Il doit rester rapide à parcourir : c'est le contrepoint de
 * l'immersion du défilé, pas une seconde galerie. Aucune vignette n'est donc
 * chargée d'emblée, seulement au survol. */

export default async function SeriesIndexPage() {
  const [cats, content] = await Promise.all([getCategories(), getSiteContent()]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        padding: "clamp(96px, 14vh, 140px) var(--jk-gap-page) var(--jk-gap-section)",
      }}
    >
      <header
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 26,
          alignItems: "flex-end",
          justifyContent: "space-between",
          marginBottom: 56,
        }}
      >
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--jk-serif)",
            fontWeight: 400,
            fontSize: "clamp(40px, 6vw, 64px)",
            lineHeight: 1,
          }}
        >
          {content.home.categoriesTitle}
        </h1>
      </header>

      {cats.map((c) => {
        const n =
          c.series.reduce((acc, s) => acc + s.photos.length, 0) +
          (c.directMedia?.filter((m) => m.kind === "photo").length ?? 0);
        return (
          <section key={c.slug} style={{ marginBottom: 44 }}>
            <h2
              style={{
                margin: "0 0 18px",
                fontSize: 10,
                fontWeight: 500,
                letterSpacing: "var(--jk-track-label)",
                textTransform: "uppercase",
                color: "var(--jk-brass)",
              }}
            >
              {/* Compte calculé, jamais écrit en dur (§12). */}
              {c.num} {c.title} — {n} {c.unit}
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
                  href={`/travaux/${c.slug}/${s.slug}/histoire`}
                  num={String(i + 1).padStart(2, "0")}
                  title={s.title}
                  location={s.location}
                  period={s.period}
                  previewSrc={s.coverSrc || s.photos[0]?.src}
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
        );
      })}
    </main>
  );
}
