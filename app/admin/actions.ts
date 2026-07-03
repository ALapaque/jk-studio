"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabase, createServerSupabase } from "@/lib/supabase/server";
import { assertUser } from "@/lib/admin";
import { STORAGE_BUCKET } from "@/lib/env";
import { parseVideoUrl } from "@/lib/video";

function revalidateAll() {
  revalidatePath("/", "layout");
}

function slugify(input: string): string {
  return input
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

async function nextPosition(
  table: string,
  scope?: { col: string; val: string },
): Promise<number> {
  const sb = createAdminSupabase();
  let q = sb.from(table).select("position");
  if (scope) q = q.eq(scope.col, scope.val);
  const { data } = await q.order("position", { ascending: false }).limit(1);
  const rows = (data ?? []) as { position: number }[];
  return (rows[0]?.position ?? -1) + 1;
}

async function swap(
  table: string,
  id: string,
  dir: string,
  scope?: { col: string; val: string },
) {
  const sb = createAdminSupabase();
  let q = sb.from(table).select("id, position");
  if (scope) q = q.eq(scope.col, scope.val);
  const { data } = await q.order("position");
  const arr = (data ?? []) as { id: string; position: number }[];
  const i = arr.findIndex((x) => x.id === id);
  const j = dir === "up" ? i - 1 : i + 1;
  if (i < 0 || j < 0 || j >= arr.length) return;
  const a = arr[i];
  const b = arr[j];
  await sb.from(table).update({ position: b.position }).eq("id", a.id);
  await sb.from(table).update({ position: a.position }).eq("id", b.id);
}

// ============================================================ AUTH

export async function signOut() {
  const sb = await createServerSupabase();
  await sb.auth.signOut();
  redirect("/admin/login");
}

// ============================================================ CATEGORIES

export async function createCategory(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const title = s(formData, "title");
  if (!title) throw new Error("Titre requis");
  const slug = s(formData, "slug") || slugify(title);
  const { error } = await sb.from("categories").insert({
    title,
    slug,
    subtitle: s(formData, "subtitle") || null,
    description: s(formData, "description"),
    location: s(formData, "location"),
    period: s(formData, "period"),
    position: await nextPosition("categories"),
  });
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function updateCategory(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const id = s(formData, "id");
  const title = s(formData, "title");
  const { error } = await sb
    .from("categories")
    .update({
      title,
      slug: s(formData, "slug") || slugify(title),
      subtitle: s(formData, "subtitle") || null,
      description: s(formData, "description"),
      location: s(formData, "location"),
      period: s(formData, "period"),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteCategory(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const { error } = await sb.from("categories").delete().eq("id", s(formData, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function moveCategory(formData: FormData) {
  await assertUser();
  await swap("categories", s(formData, "id"), s(formData, "dir"));
  revalidateAll();
}

// ============================================================ PROJECTS (séries)

export async function createProject(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const categoryId = s(formData, "category_id");
  const title = s(formData, "title");
  if (!categoryId || !title) throw new Error("Catégorie et titre requis");
  const { error } = await sb.from("projects").insert({
    category_id: categoryId,
    title,
    slug: s(formData, "slug") || slugify(title),
    description: s(formData, "description"),
    location: s(formData, "location"),
    period: s(formData, "period"),
    published: formData.get("published") === "on",
    position: await nextPosition("projects", { col: "category_id", val: categoryId }),
  });
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function updateProject(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const id = s(formData, "id");
  const title = s(formData, "title");
  const { error } = await sb
    .from("projects")
    .update({
      category_id: s(formData, "category_id"),
      title,
      slug: s(formData, "slug") || slugify(title),
      description: s(formData, "description"),
      location: s(formData, "location"),
      period: s(formData, "period"),
      published: formData.get("published") === "on",
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteProject(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const { error } = await sb.from("projects").delete().eq("id", s(formData, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
  redirect("/admin/series");
}

export async function moveProject(formData: FormData) {
  await assertUser();
  await swap("projects", s(formData, "id"), s(formData, "dir"), {
    col: "category_id",
    val: s(formData, "category_id"),
  });
  revalidateAll();
}

// ============================================================ PHOTOS

// Le fichier est envoyé directement du navigateur vers Supabase Storage
// (voir PhotoUploader) pour contourner la limite de taille des Server Actions /
// des fonctions Vercel. Ici on n'enregistre que la fiche photo (petit payload).
export async function savePhoto(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const projectId = s(formData, "project_id");
  const storagePath = s(formData, "storage_path");
  if (!projectId || !storagePath) throw new Error("Données manquantes");
  const width = Number(formData.get("width")) || null;
  const height = Number(formData.get("height")) || null;
  const { error } = await sb.from("photos").insert({
    project_id: projectId,
    storage_path: storagePath,
    alt: s(formData, "alt") || null,
    caption: s(formData, "caption") || null,
    width,
    height,
    position: await nextPosition("photos", { col: "project_id", val: projectId }),
  });
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function updatePhoto(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("photos")
    .update({
      alt: s(formData, "alt") || null,
      caption: s(formData, "caption") || null,
    })
    .eq("id", s(formData, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deletePhoto(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const path = s(formData, "storage_path");
  // Supprime le fichier Storage seulement s'il s'agit d'une clé (pas d'une URL démo).
  if (path && !/^https?:\/\//i.test(path)) {
    await sb.storage.from(STORAGE_BUCKET).remove([path]);
  }
  const { error } = await sb.from("photos").delete().eq("id", s(formData, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function movePhoto(formData: FormData) {
  await assertUser();
  await swap("photos", s(formData, "id"), s(formData, "dir"), {
    col: "project_id",
    val: s(formData, "project_id"),
  });
  revalidateAll();
}

export async function setProjectCover(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("projects")
    .update({ cover_path: s(formData, "storage_path") })
    .eq("id", s(formData, "project_id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function setCategoryCover(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("categories")
    .update({ cover_path: s(formData, "storage_path") })
    .eq("id", s(formData, "category_id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

/** Marque/retire une photo « à la une » (cartes flottantes de l'accueil). */
export async function toggleFeatured(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const id = s(formData, "id");
  const featured = formData.get("featured") === "true";
  let featured_position = 0;
  if (featured) {
    const { data } = await sb
      .from("photos")
      .select("featured_position")
      .eq("featured", true)
      .order("featured_position", { ascending: false })
      .limit(1);
    featured_position =
      ((data ?? [])[0]?.featured_position ?? -1) + 1;
  }
  const { error } = await sb
    .from("photos")
    .update({ featured, featured_position })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateAll();
}

// ============================================================ VIDEOS

export async function addVideo(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const projectId = s(formData, "project_id");
  const url = s(formData, "url");
  const parsed = parseVideoUrl(url);
  if (!projectId) throw new Error("Projet requis");
  if (!parsed) throw new Error("URL YouTube ou Vimeo non reconnue");
  const { error } = await sb.from("videos").insert({
    project_id: projectId,
    provider: parsed.provider,
    video_id: parsed.videoId,
    title: s(formData, "title") || null,
    position: await nextPosition("videos", { col: "project_id", val: projectId }),
  });
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function deleteVideo(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const { error } = await sb.from("videos").delete().eq("id", s(formData, "id"));
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function moveVideo(formData: FormData) {
  await assertUser();
  await swap("videos", s(formData, "id"), s(formData, "dir"), {
    col: "project_id",
    val: s(formData, "project_id"),
  });
  revalidateAll();
}

// ============================================================ CONTENU / APPARENCE

export async function saveContent(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const key = s(formData, "key");
  const raw = s(formData, "value");
  let value: unknown;
  try {
    value = JSON.parse(raw);
  } catch {
    throw new Error("JSON invalide");
  }
  const { error } = await sb
    .from("site_content")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidateAll();
}

function lines(formData: FormData, key: string): string[] {
  return s(formData, key)
    .split("\n")
    .map((l) => l.trim())
    .filter(Boolean);
}

function facts(formData: FormData, key: string): { k: string; v: string }[] {
  return lines(formData, key).map((l) => {
    const [k, ...rest] = l.split("|");
    return { k: (k ?? "").trim(), v: rest.join("|").trim() };
  });
}

async function upsertContent(key: string, value: unknown) {
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("site_content")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) throw new Error(error.message);
  revalidateAll();
}

export async function saveHero(formData: FormData) {
  await assertUser();
  await upsertContent("hero", {
    eyebrow: s(formData, "eyebrow"),
    titleLines: lines(formData, "titleLines"),
    coords: s(formData, "coords"),
    categoriesLine: s(formData, "categoriesLine"),
  });
}

export async function saveStudio(formData: FormData) {
  await assertUser();
  await upsertContent("studio", {
    lead: s(formData, "lead"),
    leadEm: s(formData, "leadEm"),
    paragraph: s(formData, "paragraph"),
    facts: facts(formData, "facts"),
  });
}

export async function saveAbout(formData: FormData) {
  await assertUser();
  await upsertContent("about", {
    title: s(formData, "title"),
    portraitCaption: s(formData, "portraitCaption"),
    portraitYear: s(formData, "portraitYear"),
    paragraphs: lines(formData, "paragraphs"),
    facts: facts(formData, "facts"),
    principles: lines(formData, "principles"),
  });
}

export async function saveContact(formData: FormData) {
  await assertUser();
  await upsertContent("contact", {
    title: s(formData, "title"),
    lead: s(formData, "lead"),
    email: s(formData, "email"),
    facts: facts(formData, "facts"),
    response: s(formData, "response"),
    projectTypes: lines(formData, "projectTypes"),
  });
}

export async function saveFooter(formData: FormData) {
  await assertUser();
  await upsertContent("footer", {
    copyright: s(formData, "copyright"),
    location: s(formData, "location"),
    socials: lines(formData, "socials"),
  });
}

export async function saveAppearance(formData: FormData) {
  await assertUser();
  const theme = s(formData, "defaultTheme");
  await upsertContent("appearance", {
    defaultTheme: theme === "light" ? "light" : "dark",
    accent: s(formData, "accent") || "#d6bc8c",
    grain: formData.get("grain") === "on",
    glow: Number(formData.get("glow")) || 1,
  });
}

// ============================================================ MESSAGES

export async function toggleMessageRead(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("messages")
    .update({ read: formData.get("read") === "true" })
    .eq("id", s(formData, "id"));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}

export async function deleteMessage(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const { error } = await sb.from("messages").delete().eq("id", s(formData, "id"));
  if (error) throw new Error(error.message);
  revalidatePath("/admin/messages");
}
