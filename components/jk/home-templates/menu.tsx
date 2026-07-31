import { Reveal } from "@/components/jk/Reveal";
import { MenuItem } from "./MenuItem";
import type { HomeTemplateProps } from "./types";

/* Accueil « menu » — sommaire typographique.
 *
 * Peu d'images : les catégories en très grands noms, l'aperçu de la cover suit
 * le curseur au survol. Navigation d'abord, l'image se dévoile au geste. */

export function HomeMenu({ cats, content }: HomeTemplateProps) {
  return (
    <main
      style={{
        minHeight: "100svh",
        padding:
          "clamp(120px, 18vh, 200px) var(--jk-gap-page) var(--jk-gap-section)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
      }}
    >
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <Reveal as="div" style={{ marginBottom: "clamp(40px, 6vw, 72px)" }}>
        <span style={{ fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "var(--jk-ink-mute)" }}>
          {content.brand.name} — {content.home.categoriesTitle}
        </span>
      </Reveal>

      <ul style={{ listStyle: "none", margin: 0, padding: 0, display: "grid", gap: "clamp(4px, 0.8vw, 12px)" }}>
        {cats.map((c) => {
          const n =
            c.series.reduce((acc, s) => acc + s.photos.length, 0) +
            (c.directMedia?.filter((m) => m.kind === "photo").length ?? 0);
          return (
            <MenuItem
              key={c.slug}
              slug={c.slug}
              title={c.title}
              num={c.num}
              count={`${n} ${c.unit}`}
              coverSrc={c.coverSrc}
            />
          );
        })}
      </ul>
    </main>
  );
}
