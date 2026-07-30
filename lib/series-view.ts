import type { Category, Series } from "./types";
import type { SeriesTemplateProps } from "@/components/jk/series-templates/types";

/** Dérive les props normalisées d'un template de série depuis une catégorie et
 *  la série visée. Logique unique, partagée entre le rendu public
 *  (`travaux/[categorie]/[serie]`) et l'aperçu admin (`/preview/series/[id]`),
 *  pour qu'ils nourrissent les templates exactement de la même façon. */
export function seriesTemplateProps(
  category: Category,
  series: Series,
): SeriesTemplateProps {
  const idx = category.series.findIndex((s) => s.slug === series.slug);
  const next =
    idx >= 0 && category.series.length > 1
      ? category.series[(idx + 1) % category.series.length]
      : null;
  return {
    category: {
      num: category.num,
      title: category.title,
      slug: category.slug,
    },
    series,
    photos: series.photos,
    next,
    indexHref: `/travaux/${category.slug}`,
  };
}
