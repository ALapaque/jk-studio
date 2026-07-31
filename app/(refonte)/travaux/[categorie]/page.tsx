import { createElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug } from "@/lib/data";
import { getAppearance } from "@/lib/content";
import { getCategoryTemplate } from "@/components/jk/category-templates";

export const revalidate = 60;

/* Page détail d'une catégorie. La mise en page vient d'Apparence
 * (`appearance.pageTemplates.category`), résolue via le registre
 * `category-templates` (repli `classic`). Métadonnées et `generateStaticParams`
 * restent ici. */

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ categorie: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string }>;
}): Promise<Metadata> {
  const { categorie } = await params;
  const cat = await getCategoryBySlug(categorie);
  if (!cat) return { title: "Catégorie" };
  return { title: cat.title, description: cat.description };
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const [cat, appearance] = await Promise.all([
    getCategoryBySlug(categorie),
    getAppearance(),
  ]);
  if (!cat) notFound();
  const template = getCategoryTemplate(appearance.pageTemplates?.category);
  return createElement(template, { category: cat });
}
