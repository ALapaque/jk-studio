import type { MetadataRoute } from "next";
import { getCategories, getPublishedPosts } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  // URLs canoniques après la bascule (la refonte est le site). Les anciennes
  // URLs de coexistence (/accueil, /series, …/histoire) sont redirigées en 301
  // via next.config.ts et n'ont donc pas leur place ici.
  const staticPages = [
    "",
    "/travaux",
    "/tirages",
    "/journal",
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
  // Une entrée par série (le défilé, désormais à l'URL canonique).
  const seriesPages = cats.flatMap((c) =>
    c.series.map((s) => ({
      url: `${SITE_URL}/travaux/${c.slug}/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.6,
    })),
  );

  // Une entrée par article publié du journal.
  const posts = await getPublishedPosts();
  const postPages = posts.map((p) => ({
    url: `${SITE_URL}/journal/${p.slug}`,
    lastModified: p.date ? new Date(p.date) : now,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...catPages, ...seriesPages, ...postPages];
}
