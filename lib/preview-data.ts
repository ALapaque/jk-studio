import "server-only";
import { createAdminSupabase } from "./supabase/server";
import { getProjectFull, getPost } from "./admin";
import { seriesFromProjectRow, postFromRow } from "./data";
import type { ProjectRow, PhotoRow, VideoRow } from "./supabase/types";
import type { Post } from "./types";
import type { SeriesTemplateProps } from "@/components/jk/series-templates/types";

/* Chargement des données pour l'aperçu admin des templates (`/preview`).
 *
 * Contrairement au rendu public, on lit via les fonctions admin (service role) :
 * les BROUILLONS sont donc prévisualisables. On reconstruit ensuite les mêmes
 * props que le rendu public pour nourrir les templates à l'identique. */

const pad = (n: number) => String(n).padStart(2, "0");

type ProjectWithMedia = ProjectRow & {
  photos: PhotoRow[] | null;
  videos: VideoRow[] | null;
};

/** Props d'un template de série pour un projet donné (brouillon compris).
 *  `next` et le numéro de catégorie sont dérivés des séries sœurs, comme en
 *  public — mais sans filtre `published`, pour rester fidèle en aperçu. */
export async function getSeriesPreviewProps(
  id: string,
): Promise<SeriesTemplateProps | null> {
  const p = await getProjectFull(id);
  if (!p) return null;
  const series = seriesFromProjectRow(p);
  const cat = p.categories;

  let num = "01";
  let next: SeriesTemplateProps["next"] = null;
  if (cat) {
    const sb = createAdminSupabase();
    const [{ data: cats }, { data: sibs }] = await Promise.all([
      sb.from("categories").select("id").order("position"),
      sb
        .from("projects")
        .select("*, photos(*), videos(*)")
        .eq("category_id", cat.id)
        .order("position"),
    ]);
    const catIdx = (cats ?? []).findIndex(
      (c) => (c as { id: string }).id === cat.id,
    );
    if (catIdx >= 0) num = pad(catIdx + 1);

    const siblings = ((sibs ?? []) as ProjectWithMedia[]).map(
      seriesFromProjectRow,
    );
    const idx = siblings.findIndex((s) => s.slug === series.slug);
    if (idx >= 0 && siblings.length > 1) {
      next = siblings[(idx + 1) % siblings.length];
    }
  }

  return {
    category: { num, title: cat?.title ?? "", slug: cat?.slug ?? "" },
    series,
    photos: series.photos,
    next,
    indexHref: cat ? `/travaux/${cat.slug}` : "/travaux",
  };
}

/** Article normalisé pour l'aperçu (brouillon compris), ou `null`. */
export async function getPostPreview(id: string): Promise<Post | null> {
  const row = await getPost(id);
  return row ? postFromRow(row) : null;
}
