import { createElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getSeriesBySlug } from "@/lib/data";
import { seriesTemplateProps } from "@/lib/series-view";
import { getSeriesTemplate } from "@/components/jk/series-templates";

export const revalidate = 60;

/* Page détail d'une série (Lot 4).
 *
 * La mise en page est choisie par série via `series.template` : la page charge
 * le composant correspondant depuis le registre `series-templates` (repli sur
 * `classic`, la mise en page historique). Métadonnées et `generateStaticParams`
 * restent ici — seul le corps visuel est délégué au template. */

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.flatMap((c) =>
    c.series.map((s) => ({ categorie: c.slug, serie: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string; serie: string }>;
}): Promise<Metadata> {
  const { categorie, serie } = await params;
  const found = await getSeriesBySlug(categorie, serie);
  if (!found) return { title: "Série" };
  return {
    title: `${found.series.title} — ${found.category.title}`,
    description: found.series.description,
  };
}

export default async function SeriesStoryPage({
  params,
}: {
  params: Promise<{ categorie: string; serie: string }>;
}) {
  const { categorie, serie } = await params;
  const found = await getSeriesBySlug(categorie, serie);
  if (!found) notFound();
  const { category, series } = found;

  // `createElement` avec une clé résolue dynamiquement : le composant vient du
  // registre (référence stable), on évite la forme `<Tpl/>` que le compilateur
  // React signale comme « composant créé au rendu ».
  const template = getSeriesTemplate(series.template);
  return createElement(template, seriesTemplateProps(category, series));
}
