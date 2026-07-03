import type { MetadataRoute } from "next";
import { getCategories } from "@/lib/data";
import { SITE_URL } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const now = new Date();
  const staticPages = ["", "/travaux", "/a-propos", "/contact"].map((p) => ({
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
  const seriesPages = cats.flatMap((c) =>
    c.series.map((s) => ({
      url: `${SITE_URL}/travaux/${c.slug}/${s.slug}`,
      lastModified: now,
      changeFrequency: "monthly" as const,
      priority: 0.5,
    })),
  );

  return [...staticPages, ...catPages, ...seriesPages];
}
