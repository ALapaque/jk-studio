import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  // URLs canoniques après la bascule (la refonte est le site). Les anciennes
  // URLs de coexistence (/accueil, /series, …/histoire) sont redirigées en 301
  // via next.config.ts et n'ont donc pas leur place ici.
  const staticPages = ["", "/travaux", "/tirages", "/a-propos", "/contact"].map(
    (p) => ({
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
  // Une entrée par série (le défilé, désormais à l'URL canonique).
  const seriesPages = cats.flatMap((c) =>
    c.series.map((s) => ({
      url: `${SITE_URL}/travaux/${c.slug}/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  return [...staticPages, ...catPages, ...seriesPages];
}
