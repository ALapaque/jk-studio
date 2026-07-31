import { HomeSpotlight } from "./HomeSpotlight";
import type { HomeTemplateProps } from "./types";

/* Accueil « spotlight » — une catégorie à la fois, navigation numérotée. */

export function HomeSpotlightTemplate({ cats, content }: HomeTemplateProps) {
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
      <HomeSpotlight items={items} brand={content.brand.name} />
    </main>
  );
}
