import { SpreadGallery } from "@/components/jk/SpreadGallery";
import { Reveal } from "@/components/jk/Reveal";
import type { WorksTemplateProps } from "./types";

/* Portfolio « spread » — double page.
 *
 * Toutes les séries en galerie double page : deux covers côte à côte (gauche/
 * droite) qui parallaxent à des vitesses différentes au défilement. Légende =
 * titre de la série. */

export function WorksSpread({ cats, content }: WorksTemplateProps) {
  const items = cats
    .flatMap((c) => c.series.map((s) => ({ cat: c, serie: s })))
    .map(({ cat, serie }) => ({
      src: serie.coverSrc || serie.photos[0]?.src || "",
      caption: `${serie.title} — ${cat.title}`,
      alt: serie.title,
    }))
    .filter((it) => it.src);

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

      <Reveal as="div" style={{ marginBottom: "clamp(40px, 6vw, 80px)" }}>
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

      {items.length > 0 ? (
        <SpreadGallery items={items} />
      ) : (
        <p style={{ color: "var(--jk-ink-mute)", fontSize: 14 }}>
          Aucune série publiée pour l&apos;instant.
        </p>
      )}
    </main>
  );
}
