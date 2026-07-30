"use server";

import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { createAdminSupabase } from "@/lib/supabase/server";
import { assertUser } from "@/lib/admin";

/* Actions du journal (blog). Réservées aux comptes admin. On revalide le site
 * public (les articles publiés y apparaissent) et les pages admin. */

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
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

/** Étiquettes : séparées par virgule ou retour à la ligne. */
function tags(formData: FormData): string[] {
  return s(formData, "tags")
    .split(/[,\n]/)
    .map((t) => t.trim())
    .filter(Boolean);
}

/** Galerie : le champ « media » est un JSON [{ path, caption }] produit par
 *  l'éditeur client. On revalide la forme avant de l'écrire en base. */
function media(formData: FormData): { path: string; caption: string }[] {
  const raw = s(formData, "media");
  if (!raw) return [];
  try {
    const arr = JSON.parse(raw);
    if (!Array.isArray(arr)) return [];
    return arr
      .filter((m) => m && typeof m.path === "string" && m.path)
      .map((m) => ({
        path: String(m.path),
        caption: typeof m.caption === "string" ? m.caption : "",
      }));
  } catch {
    return [];
  }
}

function revalidatePost(slug?: string) {
  revalidatePath("/journal");
  if (slug) revalidatePath(`/journal/${slug}`);
  revalidatePath("/admin/journal", "layout");
  revalidatePath("/sitemap.xml");
}

/** Crée un brouillon vide et ouvre son éditeur. Le slug est provisoire et
 *  dérivé du titre dès la première sauvegarde. */
export async function createPost() {
  await assertUser();
  const sb = createAdminSupabase();
  const suffix = crypto.randomUUID().slice(0, 8);
  const { data, error } = await sb
    .from("posts")
    .insert({ title: "Nouvel article", slug: `brouillon-${suffix}`, body: "" })
    .select("id")
    .single();
  if (error) throw new Error(error.message);
  revalidatePost();
  redirect(`/admin/journal/${data.id}`);
}

export async function updatePost(formData: FormData) {
  await assertUser();
  const id = s(formData, "id");
  if (!id) throw new Error("Article introuvable");
  const title = s(formData, "title") || "Sans titre";
  const publishing = formData.get("published") === "on";

  const sb = createAdminSupabase();
  // Date de publication : posée à la PREMIÈRE mise en ligne, puis conservée
  // (re-publier ne réécrit pas la date affichée).
  const { data: current } = await sb
    .from("posts")
    .select("published_at")
    .eq("id", id)
    .maybeSingle();
  const currentPublishedAt =
    (current as { published_at: string | null } | null)?.published_at ?? null;
  const publishedAt = publishing
    ? currentPublishedAt ?? new Date().toISOString()
    : currentPublishedAt;

  const { error } = await sb
    .from("posts")
    .update({
      title,
      slug: s(formData, "slug") || slugify(title),
      excerpt: s(formData, "excerpt") || null,
      body: s(formData, "body"),
      tags: tags(formData),
      media: media(formData),
      published: publishing,
      published_at: publishedAt,
      updated_at: new Date().toISOString(),
    })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePost(s(formData, "slug"));
}

// `id` est lié côté page (bind) car ContentImageUploader n'envoie que la clé.
export async function savePostCover(id: string, formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("posts")
    .update({ cover_path: s(formData, "storage_path") })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePost();
}

export async function removePostCover(id: string) {
  await assertUser();
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("posts")
    .update({ cover_path: null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidatePost();
}

export async function deletePost(formData: FormData) {
  await assertUser();
  const sb = createAdminSupabase();
  const { error } = await sb.from("posts").delete().eq("id", s(formData, "id"));
  if (error) throw new Error(error.message);
  revalidatePost();
  redirect("/admin/journal");
}
