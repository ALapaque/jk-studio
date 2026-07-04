import "server-only";
import { isSupabaseConfigured } from "./env";
import { createPublicSupabase } from "./supabase/server";
import { publicImageUrl } from "./supabase/storage";
import { CATEGORIES as DEMO } from "./demo-data";
import { Category, Media, Photo, Series, Video } from "./types";
import {
  CategoryRow,
  PhotoRow,
  ProjectRow,
  VideoRow,
} from "./supabase/types";

const pad = (n: number) => String(n).padStart(2, "0");

function mapPhoto(p: PhotoRow, period: string): Photo {
  const ar =
    p.width && p.height ? `${p.width} / ${p.height}` : "3 / 4";
  return {
    id: p.id,
    src: publicImageUrl(p.storage_path),
    width: p.width ?? 900,
    height: p.height ?? 1200,
    ar,
    alt: p.alt ?? p.caption ?? "",
    caption: p.caption ?? "",
    meta: period,
  };
}

function mapVideo(v: VideoRow, period: string): Video {
  return {
    id: v.id,
    provider: v.provider,
    videoId: v.video_id,
    title: v.title ?? "",
    meta: period,
  };
}

type ProjectWithMedia = ProjectRow & {
  photos: PhotoRow[] | null;
  videos: VideoRow[] | null;
};

function mapSeries(p: ProjectWithMedia): Series {
  const photos = [...(p.photos ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((x) => mapPhoto(x, p.period));
  const videos = [...(p.videos ?? [])]
    .sort((a, b) => a.position - b.position)
    .map((x) => mapVideo(x, p.period));
  return {
    slug: p.slug,
    title: p.title,
    description: p.description,
    location: p.location,
    period: p.period,
    coverSrc:
      publicImageUrl(p.cover_path) || photos[0]?.src || "",
    photos,
    videos,
  };
}

function mapCategory(
  c: CategoryRow,
  projects: ProjectWithMedia[],
  directPhotos: PhotoRow[],
  directVideos: VideoRow[],
  index: number,
): Category {
  const series = projects
    .filter((p) => p.category_id === c.id)
    .sort((a, b) => a.position - b.position)
    .map(mapSeries);
  const directMedia: Media[] = [
    ...directPhotos
      .filter((p) => p.category_id === c.id)
      .sort((a, b) => a.position - b.position)
      .map((x) => ({ kind: "photo" as const, ...mapPhoto(x, c.period) })),
    ...directVideos
      .filter((v) => v.category_id === c.id)
      .sort((a, b) => a.position - b.position)
      .map((x) => ({ kind: "video" as const, ...mapVideo(x, c.period) })),
  ];
  const nP =
    series.reduce((n, s) => n + s.photos.length, 0) +
    directMedia.filter((m) => m.kind === "photo").length;
  const nV =
    series.reduce((n, s) => n + s.videos.length, 0) +
    directMedia.filter((m) => m.kind === "video").length;
  const firstDirectPhoto = directMedia.find((m) => m.kind === "photo");
  return {
    slug: c.slug,
    num: pad(index + 1),
    title: c.title,
    unit: nP === 0 && nV > 0 ? "films" : "photos",
    subtitle: c.subtitle ?? undefined,
    description: c.description,
    location: c.location,
    period: c.period,
    coverSrc:
      publicImageUrl(c.cover_path) ||
      series[0]?.coverSrc ||
      firstDirectPhoto?.src ||
      "",
    series,
    directMedia,
  };
}

export interface HeroItem {
  src: string;
  href: string;
  label: string;
}

/** Photos « à la une » pour les cartes flottantes de l'accueil (max 8). */
export async function getHeroItems(): Promise<HeroItem[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const sb = createPublicSupabase();
    const { data, error } = await sb
      .from("photos")
      .select(
        "storage_path, featured_position, project:projects(slug, published, categories(slug, title)), category:categories(slug, title)",
      )
      .eq("featured", true)
      .order("featured_position")
      .limit(24);
    if (error) throw error;
    const out: HeroItem[] = [];
    for (const row of (data ?? []) as Record<string, unknown>[]) {
      const src = publicImageUrl(row.storage_path as string);
      const project = row.project as
        | { slug: string; published: boolean; categories: { slug: string; title: string } }
        | null;
      const category = row.category as { slug: string; title: string } | null;
      if (project) {
        if (!project.published) continue; // série en brouillon → on ignore
        out.push({
          src,
          href: `/travaux/${project.categories.slug}/${project.slug}`,
          label: project.categories.title,
        });
      } else if (category) {
        out.push({ src, href: `/travaux/${category.slug}`, label: category.title });
      }
      if (out.length >= 8) break;
    }
    return out;
  } catch (err) {
    console.error("[data] getHeroItems échoué:", err);
    return [];
  }
}

let warned = false;
function fallback(): Category[] {
  return DEMO;
}

/** Toutes les catégories (avec séries publiées + médias). */
export async function getCategories(): Promise<Category[]> {
  if (!isSupabaseConfigured()) return fallback();
  try {
    const sb = createPublicSupabase();
    const [
      { data: cats, error: e1 },
      { data: projs, error: e2 },
      { data: dphotos, error: e3 },
      { data: dvideos, error: e4 },
    ] = await Promise.all([
      sb.from("categories").select("*").order("position"),
      sb
        .from("projects")
        .select("*, photos(*), videos(*)")
        .eq("published", true)
        .order("position"),
      sb.from("photos").select("*").not("category_id", "is", null),
      sb.from("videos").select("*").not("category_id", "is", null),
    ]);
    // Seules les catégories/séries sont critiques. Les médias directs (migration
    // 0003) sont optionnels : s'ils échouent (colonne absente), on les ignore
    // pour ne pas faire basculer tout le site sur les données de démo.
    if (e1 || e2) throw e1 || e2;
    const projects = (projs ?? []) as ProjectWithMedia[];
    const directPhotos = e3 ? [] : ((dphotos ?? []) as PhotoRow[]);
    const directVideos = e4 ? [] : ((dvideos ?? []) as VideoRow[]);
    return (cats ?? []).map((c, i) =>
      mapCategory(c as CategoryRow, projects, directPhotos, directVideos, i),
    );
  } catch (err) {
    if (!warned) {
      warned = true;
      console.error(
        "[data] lecture Supabase échouée, repli sur les données de démo:",
        err,
      );
    }
    return fallback();
  }
}

export interface SelectionItem {
  title: string;
  description: string;
  categoryTitle: string;
  period: string;
  href: string;
  coverSrc: string;
}

/** Dernières séries publiées, pour la section « Sélection » de l'accueil. */
export async function getSelection(limit = 3): Promise<SelectionItem[]> {
  if (!isSupabaseConfigured()) return [];
  try {
    const sb = createPublicSupabase();
    const { data, error } = await sb
      .from("projects")
      .select(
        "slug, title, description, period, cover_path, created_at, categories!inner(slug, title), photos(storage_path, position)",
      )
      .eq("published", true)
      .order("created_at", { ascending: false })
      .limit(limit);
    if (error) throw error;
    return (data ?? []).map((row: Record<string, unknown>) => {
      const cat = row.categories as { slug: string; title: string };
      const photos = [
        ...((row.photos as { storage_path: string; position: number }[]) ?? []),
      ].sort((a, b) => a.position - b.position);
      return {
        title: row.title as string,
        description: (row.description as string) || "",
        categoryTitle: cat.title,
        period: (row.period as string) || "",
        href: `/travaux/${cat.slug}/${row.slug}`,
        coverSrc:
          publicImageUrl(row.cover_path as string) ||
          publicImageUrl(photos[0]?.storage_path) ||
          "",
      };
    });
  } catch (err) {
    console.error("[data] getSelection échoué:", err);
    return [];
  }
}

export async function getCategoryBySlug(
  slug: string,
): Promise<Category | undefined> {
  const cats = await getCategories();
  return cats.find((c) => c.slug === slug);
}

export async function getSeriesBySlug(
  catSlug: string,
  seriesSlug: string,
): Promise<{ category: Category; series: Series } | undefined> {
  const category = await getCategoryBySlug(catSlug);
  const series = category?.series.find((s) => s.slug === seriesSlug);
  if (category && series) return { category, series };
  return undefined;
}
