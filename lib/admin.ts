import "server-only";
import { redirect } from "next/navigation";
import { createAdminSupabase, createServerSupabase } from "./supabase/server";
import {
  CategoryRow,
  MediaAssetRow,
  MediaFolderRow,
  MessageRow,
  PhotoRow,
  ProjectRow,
  VideoRow,
} from "./supabase/types";

/** Vérifie qu'un utilisateur est connecté (sinon redirige vers le login). */
export async function requireUser() {
  const sb = await createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) redirect("/admin/login");
  return user;
}

/** Variante pour les Server Actions : lève au lieu de rediriger. */
export async function assertUser() {
  const sb = await createServerSupabase();
  const {
    data: { user },
  } = await sb.auth.getUser();
  if (!user) throw new Error("Non autorisé");
  return user;
}

export async function getAllCategories(): Promise<CategoryRow[]> {
  const sb = createAdminSupabase();
  const { data } = await sb.from("categories").select("*").order("position");
  return (data ?? []) as CategoryRow[];
}

export type ProjectWithCounts = ProjectRow & {
  categories: { slug: string; title: string } | null;
  photos: { count: number }[];
  videos: { count: number }[];
};

export async function getAllProjects(): Promise<ProjectWithCounts[]> {
  const sb = createAdminSupabase();
  const { data } = await sb
    .from("projects")
    .select(
      "*, categories(slug, title), photos(count), videos(count)",
    )
    .order("position");
  return (data ?? []) as unknown as ProjectWithCounts[];
}

export type ProjectFull = ProjectRow & {
  categories: CategoryRow | null;
  photos: PhotoRow[];
  videos: VideoRow[];
};

export async function getProjectFull(id: string): Promise<ProjectFull | null> {
  const sb = createAdminSupabase();
  const { data } = await sb
    .from("projects")
    .select("*, categories(*), photos(*), videos(*)")
    .eq("id", id)
    .single();
  if (!data) return null;
  const p = data as unknown as ProjectFull;
  p.photos = [...(p.photos ?? [])].sort((a, b) => a.position - b.position);
  p.videos = [...(p.videos ?? [])].sort((a, b) => a.position - b.position);
  return p;
}

export type CategoryFull = CategoryRow & {
  photos: PhotoRow[];
  videos: VideoRow[];
};

export async function getCategoryFull(id: string): Promise<CategoryFull | null> {
  const sb = createAdminSupabase();
  const { data } = await sb
    .from("categories")
    .select("*, photos(*), videos(*)")
    .eq("id", id)
    .single();
  if (!data) return null;
  const c = data as unknown as CategoryFull;
  c.photos = [...(c.photos ?? [])].sort((a, b) => a.position - b.position);
  c.videos = [...(c.videos ?? [])].sort((a, b) => a.position - b.position);
  return c;
}

/** Contenu d'un dossier de la médiathèque : sous-dossiers + fiches d'images.
 *  `folderId` null = racine. Réservé à l'admin (jamais appelé côté public). */
export async function getFolderContents(folderId: string | null): Promise<{
  folder: MediaFolderRow | null;
  breadcrumb: MediaFolderRow[];
  subfolders: MediaFolderRow[];
  assets: (MediaAssetRow & { usage: number })[];
}> {
  const sb = createAdminSupabase();

  const [foldersRes, assetsRes] = await Promise.all([
    sb.from("media_folders").select("*").order("name"),
    folderId
      ? sb.from("media_assets").select("*").eq("folder_id", folderId)
      : sb.from("media_assets").select("*").is("folder_id", null),
  ]);
  const allFolders = (foldersRes.data ?? []) as MediaFolderRow[];
  const assets = [...((assetsRes.data ?? []) as MediaAssetRow[])].sort((a, b) =>
    b.created_at.localeCompare(a.created_at),
  );

  // Nombre d'emplacements où chaque image est affichée sur le site : sert à
  // signaler « utilisée » et à protéger la suppression.
  const ids = assets.map((a) => a.id);
  const usageMap = new Map<string, number>();
  if (ids.length) {
    const { data: used } = await sb
      .from("photos")
      .select("asset_id")
      .in("asset_id", ids);
    for (const r of (used ?? []) as { asset_id: string | null }[]) {
      if (r.asset_id)
        usageMap.set(r.asset_id, (usageMap.get(r.asset_id) ?? 0) + 1);
    }
  }

  const folder = folderId
    ? allFolders.find((f) => f.id === folderId) ?? null
    : null;
  const subfolders = allFolders.filter((f) => f.parent_id === (folderId ?? null));

  // Fil d'Ariane : on remonte les parents jusqu'à la racine.
  const breadcrumb: MediaFolderRow[] = [];
  let cur = folder;
  const byId = new Map(allFolders.map((f) => [f.id, f]));
  while (cur) {
    breadcrumb.unshift(cur);
    cur = cur.parent_id ? byId.get(cur.parent_id) ?? null : null;
  }

  return {
    folder,
    breadcrumb,
    subfolders,
    assets: assets.map((a) => ({ ...a, usage: usageMap.get(a.id) ?? 0 })),
  };
}

/** Toutes les fiches de la médiathèque, pour le sélecteur « depuis la
 *  médiathèque » (recherche/parcours côté client). */
export async function getAllAssets(): Promise<MediaAssetRow[]> {
  const sb = createAdminSupabase();
  const { data } = await sb
    .from("media_assets")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as MediaAssetRow[];
}

export async function getAllFolders(): Promise<MediaFolderRow[]> {
  const sb = createAdminSupabase();
  const { data } = await sb.from("media_folders").select("*").order("name");
  return (data ?? []) as MediaFolderRow[];
}

export async function getMessages(): Promise<MessageRow[]> {
  const sb = createAdminSupabase();
  const { data } = await sb
    .from("messages")
    .select("*")
    .order("created_at", { ascending: false });
  return (data ?? []) as MessageRow[];
}

export async function getContentMap(): Promise<Record<string, unknown>> {
  const sb = createAdminSupabase();
  const { data } = await sb.from("site_content").select("key, value");
  const map: Record<string, unknown> = {};
  for (const row of (data ?? []) as { key: string; value: unknown }[]) {
    map[row.key] = row.value;
  }
  return map;
}

export async function countsSummary() {
  const sb = createAdminSupabase();
  const [cats, projs, photos, videos, unread] = await Promise.all([
    sb.from("categories").select("id", { count: "exact", head: true }),
    sb.from("projects").select("id", { count: "exact", head: true }),
    sb.from("photos").select("id", { count: "exact", head: true }),
    sb.from("videos").select("id", { count: "exact", head: true }),
    sb
      .from("messages")
      .select("id", { count: "exact", head: true })
      .eq("read", false),
  ]);
  return {
    categories: cats.count ?? 0,
    projects: projs.count ?? 0,
    photos: photos.count ?? 0,
    videos: videos.count ?? 0,
    unread: unread.count ?? 0,
  };
}
