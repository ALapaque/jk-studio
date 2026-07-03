import "server-only";
import { isSupabaseConfigured } from "./env";
import { createPublicSupabase } from "./supabase/server";
import { publicImageUrl } from "./supabase/storage";
import { CATEGORIES as DEMO } from "./demo-data";
import { Category, Photo, Series, Video } from "./types";
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
  index: number,
): Category {
  const series = projects
    .filter((p) => p.category_id === c.id)
    .sort((a, b) => a.position - b.position)
    .map(mapSeries);
  const nP = series.reduce((n, s) => n + s.photos.length, 0);
  const nV = series.reduce((n, s) => n + s.videos.length, 0);
  return {
    slug: c.slug,
    num: pad(index + 1),
    title: c.title,
    unit: nP === 0 && nV > 0 ? "films" : "photos",
    subtitle: c.subtitle ?? undefined,
    description: c.description,
    location: c.location,
    period: c.period,
    coverSrc: series[0]?.coverSrc || "",
    series,
  };
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
    const [{ data: cats, error: e1 }, { data: projs, error: e2 }] =
      await Promise.all([
        sb.from("categories").select("*").order("position"),
        sb
          .from("projects")
          .select("*, photos(*), videos(*)")
          .eq("published", true)
          .order("position"),
      ]);
    if (e1 || e2) throw e1 || e2;
    const projects = (projs ?? []) as ProjectWithMedia[];
    return (cats ?? []).map((c, i) =>
      mapCategory(c as CategoryRow, projects, i),
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
