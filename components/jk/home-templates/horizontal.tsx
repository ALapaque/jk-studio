import { HomeHorizontal } from "./HomeHorizontal";
import type { HomeTemplateProps } from "./types";

/* Accueil « horizontal » — parcours latéral des catégories. */

export function HomeHorizontalTemplate({ cats, content }: HomeTemplateProps) {
  const items = cats.map((c) => {
    const n =
      c.series.reduce((acc, s) => acc + s.photos.length, 0) +
      (c.directMedia?.filter((m) => m.kind === "photo").length ?? 0);
    return { slug: c.slug, title: c.title, num: c.num, count: `${n} ${c.unit}`, coverSrc: c.coverSrc };
  });

  return (
    <main>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>
      <HomeHorizontal items={items} hint={content.hero.scrollHint || "faites défiler"} />
    </main>
  );
}
