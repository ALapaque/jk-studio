import "server-only";
import { redirect } from "next/navigation";
import { createAdminSupabase, createServerSupabase } from "./supabase/server";
import {
  CategoryRow,
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
