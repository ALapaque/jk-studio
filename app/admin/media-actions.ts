"use server";

import { revalidatePath } from "next/cache";
import { createAdminSupabase } from "@/lib/supabase/server";
import { assertUser } from "@/lib/admin";
import { STORAGE_BUCKET } from "@/lib/env";
import { VARIANT_WIDTHS, variantKey } from "@/lib/image-variants";
import type { PhotoOrientation } from "@/lib/supabase/types";

/* Actions de la médiathèque (banque photo façon drive).
 *
 * Toutes réservées aux comptes admin (assertUser). La médiathèque n'étant
 * jamais publique, on revalide les pages admin, pas le site. */

function s(formData: FormData, key: string): string {
  return String(formData.get(key) ?? "").trim();
}

function revalidateMedia() {
  revalidatePath("/admin/mediatheque", "layout");
}

// ============================================================ DOSSIERS

export async function createFolder(formData: FormData) {
  await assertUser();
  const name = s(formData, "name");
  if (!name) throw new Error("Nom de dossier requis");
  const parentId = s(formData, "parent_id") || null;
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("media_folders")
    .insert({ name, parent_id: parentId });
  if (error) throw new Error(error.message);
  revalidateMedia();
}

export async function renameFolder(formData: FormData) {
  await assertUser();
  const id = s(formData, "id");
  const name = s(formData, "name");
  if (!id || !name) throw new Error("Données manquantes");
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("media_folders")
    .update({ name })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateMedia();
}

/** Déplace un dossier sous un autre parent (ou à la racine si vide).
 *  Refuse de placer un dossier sous lui-même ou l'un de ses descendants —
 *  sinon on créerait un cycle et une branche deviendrait inatteignable. */
export async function moveFolder(formData: FormData) {
  await assertUser();
  const id = s(formData, "id");
  const target = s(formData, "parent_id") || null;
  if (!id) throw new Error("Données manquantes");
  if (target === id) throw new Error("Un dossier ne peut pas être son propre parent");

  const sb = createAdminSupabase();
  if (target) {
    const { data } = await sb.from("media_folders").select("id, parent_id");
    const byId = new Map(
      ((data ?? []) as { id: string; parent_id: string | null }[]).map((f) => [
        f.id,
        f.parent_id,
      ]),
    );
    let cur: string | null = target;
    while (cur) {
      if (cur === id) throw new Error("Déplacement circulaire refusé");
      cur = byId.get(cur) ?? null;
    }
  }

  const { error } = await sb
    .from("media_folders")
    .update({ parent_id: target })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateMedia();
}

export async function deleteFolder(formData: FormData) {
  await assertUser();
  const id = s(formData, "id");
  if (!id) throw new Error("Données manquantes");
  // Les sous-dossiers tombent en cascade (0006) ; les fichiers reviennent à la
  // racine (folder_id → NULL), ils ne sont pas détruits.
  const sb = createAdminSupabase();
  const { error } = await sb.from("media_folders").delete().eq("id", id);
  if (error) throw new Error(error.message);
  revalidateMedia();
}

// ============================================================ FICHIERS

/** Crée la fiche d'un fichier déjà uploadé (avec ses dérivés) côté navigateur,
 *  ou récupère celle qui existe déjà pour ce fichier. Renvoie l'id de l'asset.
 *  Partagé par l'upload en médiathèque et l'upload direct dans une série. */
async function upsertAsset(
  formData: FormData,
  folderId: string | null,
): Promise<{ id: string; storage_path: string } | null> {
  const storagePath = s(formData, "storage_path");
  if (!storagePath) return null;

  const orientation = s(formData, "orientation");
  const rawWidths = s(formData, "variant_widths");
  const variantWidths = rawWidths
    ? rawWidths
        .split(",")
        .map((x) => Number(x.trim()))
        .filter((n) => Number.isFinite(n) && n > 0)
    : null;

  const sb = createAdminSupabase();
  const { data, error } = await sb
    .from("media_assets")
    .insert({
      folder_id: folderId,
      storage_path: storagePath,
      filename: s(formData, "filename") || null,
      alt: s(formData, "alt") || null,
      width: Number(formData.get("width")) || null,
      height: Number(formData.get("height")) || null,
      orientation:
        orientation === "portrait" || orientation === "landscape"
          ? (orientation as PhotoOrientation)
          : null,
      blur_data_url: s(formData, "blur_data_url") || null,
      variant_widths: variantWidths?.length ? variantWidths : null,
    })
    .select("id, storage_path")
    .single();

  if (error) {
    // 23505 = clé unique : le fichier est déjà dans la banque. On récupère la
    // fiche existante plutôt que d'échouer.
    if (error.code === "23505") {
      const { data: existing } = await sb
        .from("media_assets")
        .select("id, storage_path")
        .eq("storage_path", storagePath)
        .single();
      return existing ?? null;
    }
    throw new Error(error.message);
  }
  return data;
}

/** Enregistre une image déposée dans la médiathèque (upload pur). */
export async function saveAsset(formData: FormData) {
  await assertUser();
  await upsertAsset(formData, s(formData, "folder_id") || null);
  revalidateMedia();
}

/** Upload direct dans une série/catégorie : le fichier entre d'abord dans la
 *  médiathèque (à la racine), puis est rattaché — exactement le comportement
 *  demandé (« uploader la met aussi dans la banque »). */
export async function uploadToOwner(formData: FormData) {
  await assertUser();
  const ownerField = s(formData, "owner_field");
  const ownerId = s(formData, "owner_id");
  if (
    (ownerField !== "project_id" && ownerField !== "category_id") ||
    !ownerId
  ) {
    throw new Error("Cible invalide");
  }
  const asset = await upsertAsset(formData, s(formData, "folder_id") || null);
  if (!asset) throw new Error("Fichier manquant");

  const attach = new FormData();
  attach.set("owner_field", ownerField);
  attach.set("owner_id", ownerId);
  attach.set("asset_ids", asset.id);
  await attachAssets(attach);
  revalidateMedia();
}

export async function moveAsset(formData: FormData) {
  await assertUser();
  const id = s(formData, "id");
  if (!id) throw new Error("Données manquantes");
  const sb = createAdminSupabase();
  const { error } = await sb
    .from("media_assets")
    .update({ folder_id: s(formData, "folder_id") || null })
    .eq("id", id);
  if (error) throw new Error(error.message);
  revalidateMedia();
}

/** Supprime une image de la médiathèque.
 *
 *  BLOQUÉ si elle est encore affichée quelque part sur le site : supprimer le
 *  fichier casserait ces emplacements. On renvoie le nombre d'usages pour que
 *  l'admin explique où la photo est utilisée. Le fichier Storage n'est retiré
 *  que si l'asset n'est plus référencé. */
export async function deleteAsset(formData: FormData) {
  await assertUser();
  const id = s(formData, "id");
  const storagePath = s(formData, "storage_path");
  if (!id) throw new Error("Données manquantes");

  const sb = createAdminSupabase();
  const { count } = await sb
    .from("photos")
    .select("id", { count: "exact", head: true })
    .eq("asset_id", id);
  if ((count ?? 0) > 0) {
    throw new Error(
      `Image utilisée à ${count} endroit(s) sur le site — retire-la d'abord de ces séries.`,
    );
  }

  const { error } = await sb.from("media_assets").delete().eq("id", id);
  if (error) throw new Error(error.message);

  // Fichier + dérivés retirés du Storage. Les clés des variantes sont
  // déterministes (`<clé>@<largeur>.webp`), donc pas besoin de lister le
  // bucket : on retire l'original et toutes les largeurs possibles. Retirer
  // une clé absente est sans effet.
  if (storagePath && !/^https?:\/\//i.test(storagePath)) {
    const keys = [
      storagePath,
      ...VARIANT_WIDTHS.map((w) => variantKey(storagePath, w)),
    ];
    await sb.storage.from(STORAGE_BUCKET).remove(keys);
  }
  revalidateMedia();
}

// ============================================================ RATTACHEMENT AU SITE

/** Rattache une image de la médiathèque à une série ou une catégorie.
 *
 *  Modèle « référence » : la ligne `photos` pointe vers le MÊME fichier que
 *  l'asset (aucune copie), et conserve `asset_id` comme lien de provenance.
 *  Le rendu public, qui lit `photos.storage_path`, fonctionne sans changement.
 *
 *  Idempotent : si l'image est déjà rattachée à ce parent, on ne la remet pas
 *  une seconde fois. */
export async function attachAssets(formData: FormData) {
  await assertUser();
  const ownerField = s(formData, "owner_field");
  const ownerId = s(formData, "owner_id");
  if (
    (ownerField !== "project_id" && ownerField !== "category_id") ||
    !ownerId
  ) {
    throw new Error("Cible invalide");
  }
  const assetIds = s(formData, "asset_ids")
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);
  if (!assetIds.length) return;

  const sb = createAdminSupabase();
  const { data: assets, error: readErr } = await sb
    .from("media_assets")
    .select("*")
    .in("id", assetIds);
  if (readErr) throw new Error(readErr.message);

  // Position de départ = à la suite des médias déjà présents.
  const { data: existing } = await sb
    .from("photos")
    .select("position, asset_id")
    .eq(ownerField, ownerId)
    .order("position", { ascending: false });
  const rows = (existing ?? []) as { position: number; asset_id: string | null }[];
  let pos = (rows[0]?.position ?? -1) + 1;
  const already = new Set(rows.map((r) => r.asset_id).filter(Boolean));

  const toInsert = (assets ?? [])
    .filter((a) => !already.has(a.id))
    .map((a) => ({
      project_id: ownerField === "project_id" ? ownerId : null,
      category_id: ownerField === "category_id" ? ownerId : null,
      storage_path: a.storage_path,
      asset_id: a.id,
      alt: a.alt,
      width: a.width,
      height: a.height,
      orientation: a.orientation,
      blur_data_url: a.blur_data_url,
      variant_widths: a.variant_widths,
      position: pos++,
    }));

  if (toInsert.length) {
    const { error } = await sb.from("photos").insert(toInsert);
    if (error) throw new Error(error.message);
  }
  revalidatePath("/", "layout");
}
