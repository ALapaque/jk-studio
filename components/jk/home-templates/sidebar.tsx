import Link from "next/link";
import Image from "next/image";
import { Caption } from "@/components/jk/Caption";
import { Reveal } from "@/components/jk/Reveal";
import { deriveHomeData } from "./shared";
import type { HomeTemplateProps } from "./types";

/* Accueil « sidebar » — navigation en barre latérale fixe.
 *
 * Une colonne de navigation qui reste à gauche (marque + catégories + liens),
 * la galerie de sélection défile à droite. Structure de site de portfolio. */

export function HomeSidebar({ cats, content }: HomeTemplateProps) {
  const { selection } = deriveHomeData(cats, content);

  return (
    <main>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <div
        className="jk-studio-grid"
        style={{
          display: "grid",
          gridTemplateColumns: "minmax(0, 300px) minmax(0, 1fr)",
          gap: "clamp(2.5rem, 5vw, 5rem)",
          padding:
            "clamp(96px, 12vh, 140px) var(--jk-gap-page) var(--jk-gap-section)",
          alignItems: "start",
        }}
      >
        {/* Barre latérale */}
        <aside style={{ position: "sticky", top: "clamp(96px, 12vh, 140px)", display: "grid", gap: 40 }}>
          <div style={{ display: "grid", gap: 10 }}>
            <span style={{ fontFamily: "var(--jk-serif)", fontSize: "clamp(28px, 3vw, 40px)", lineHeight: 1 }}>
              {content.brand.name}
            </span>
            {content.brand.tagline && (
              <span style={{ fontSize: 11, letterSpacing: "0.06em", color: "var(--jk-ink-mute)" }}>
                {content.brand.tagline}
              </span>
            )}
          </div>

          <nav style={{ display: "grid", gap: 12, borderTop: "1px solid var(--jk-rule)", paddingTop: 24 }}>
            {cats.map((c) => {
              const n =
                c.series.reduce((acc, s) => acc + s.photos.length, 0) +
                (c.directMedia?.filter((m) => m.kind === "photo").length ?? 0);
              return (
                <Link
                  key={c.slug}
                  href={`/travaux/${c.slug}`}
                  data-jk-label={c.title}
                  className="jk-cat-link"
                  style={{ display: "flex", alignItems: "baseline", justifyContent: "space-between", gap: 12, color: "var(--jk-ink)" }}
                >
                  <span style={{ fontFamily: "var(--jk-serif)", fontSize: "clamp(20px, 2vw, 26px)" }}>
                    {c.title}
                  </span>
                  <span style={{ fontSize: 9, letterSpacing: "0.2em", textTransform: "uppercase", color: "var(--jk-ink-mute)" }}>
                    {n} {c.unit}
                  </span>
                </Link>
              );
            })}
          </nav>

          <div style={{ display: "flex", gap: 18, borderTop: "1px solid var(--jk-rule)", paddingTop: 24, fontSize: 10, letterSpacing: "0.2em", textTransform: "uppercase" }}>
            <Link href="/a-propos" data-jk-label={content.nav.about} style={{ color: "var(--jk-ink-mute)" }}>
              {content.nav.about}
            </Link>
            <Link href="/contact" data-jk-label={content.nav.contact} style={{ color: "var(--jk-brass)" }}>
              {content.nav.contact}
            </Link>
          </div>
        </aside>

        {/* Galerie de sélection */}
        <ul
          style={{
            listStyle: "none",
            margin: 0,
            padding: 0,
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(min(100%, 320px), 1fr))",
            gap: "clamp(24px, 3vw, 44px)",
          }}
        >
          {selection.slice(0, 8).map(({ cat, serie }, i) => {
            const photo = serie.photos[0];
            return (
              <li key={`${cat.slug}/${serie.slug}`}>
                <Reveal as="div" delay={Math.min(i, 6) * 70}>
                  <Link href={`/travaux/${cat.slug}/${serie.slug}`} data-jk-label={serie.title} style={{ display: "grid", gap: 14, color: "inherit" }}>
                    <span style={{ position: "relative", display: "block", aspectRatio: "4 / 5", overflow: "hidden", background: "var(--jk-surface)" }}>
                      {(serie.coverSrc || photo) && (
                        <Image src={serie.coverSrc || photo.src} alt={photo?.alt ?? serie.title} fill sizes="(max-width: 760px) 100vw, 40vw" className="jk-zoom" style={{ objectFit: "cover" }} />
                      )}
                    </span>
                    <Caption subject={serie.title} location={cat.title} variant="thumbnail" />
                  </Link>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </div>
    </main>
  );
}
