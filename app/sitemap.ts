import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  // `/accueil` n'y figure pas : c'est l'aperçu de la refonte, destiné à
  // remplacer `/` à la bascule. L'indexer créerait un doublon de contenu avec
  // la page d'accueil, ce qui nuirait aux deux.
  const staticPages = [
    "",
    "/travaux",
    "/series",
    "/tirages",
    "/a-propos",
    "/contact",
  ].map((p) => ({
    url: `${SITE_URL}${p}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: p === "" ? 1 : 0.7,
  }));

  const cats = await getCategories();
  const catPages = cats.map((c) => ({
    url: `${SITE_URL}/travaux/${c.slug}`,
    lastModified: now,
    changeFrequency: "monthly" as const,
    priority: 0.6,
  }));
  // Deux entrées par série : la planche contact actuelle et le défilé
  // immersif, qui coexistent jusqu'à la bascule. Le défilé porte une priorité
  // plus haute — c'est la lecture que la refonte met en avant.
  const seriesPages = cats.flatMap((c) =>
    c.series.flatMap((s) => [
      {
        url: `${SITE_URL}/travaux/${c.slug}/${s.slug}`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.5,
      },
      {
        url: `${SITE_URL}/travaux/${c.slug}/${s.slug}/histoire`,
        lastModified: now,
        changeFrequency: "monthly" as const,
        priority: 0.6,
      },
    ]),
  );

  return [...staticPages, ...catPages, ...seriesPages];
}
