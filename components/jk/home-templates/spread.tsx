import Link from "next/link";
import { CategoryRow } from "@/components/jk/CategoryRow";
import { SpreadGallery } from "@/components/jk/SpreadGallery";
import { HomeHero } from "./HomeHero";
import { deriveHomeData } from "./shared";
import type { HomeTemplateProps } from "./types";

/* Accueil « spread » — double page.
 *
 * Hero plein écran, puis la sélection présentée en galerie double page (deux
 * covers gauche/droite qui parallaxent au défilement), les catégories en pied.
 * Met le travail en scène façon magazine. */

export function HomeSpread({ cats, content }: HomeTemplateProps) {
  const { heroSlides, hero, selection } = deriveHomeData(cats, content);
  const items = selection
    .map(({ cat, serie }) => ({
      src: serie.coverSrc || serie.photos[0]?.src || "",
      caption: serie.title || cat.title,
      alt: serie.title,
    }))
    .filter((it) => it.src)
    .slice(0, 8);

  return (
    <main>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <HomeHero heroSlides={heroSlides} hero={hero} scrollHint={content.hero.scrollHint} />

      {items.length > 0 && (
        <section style={{ padding: "var(--jk-gap-section) var(--jk-gap-page) 0", display: "grid", gap: 48 }}>
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
          <SpreadGallery items={items} />
        </section>
      )}

      <section style={{ padding: "var(--jk-gap-section) var(--jk-gap-page)", display: "grid", gap: 40 }}>
        <SectionEyebrow num="02">{content.home.categoriesTitle}</SectionEyebrow>
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
