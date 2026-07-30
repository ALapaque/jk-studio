"use client";

/* Upload d'une image depuis le navigateur vers Supabase Storage, avec
 * génération des dérivés WebP et du LQIP. Partagé par l'uploader de la
 * médiathèque et l'upload direct dans une série — pour qu'aucun des deux ne
 * puisse diverger sur le format des fichiers produits.
 *
 * sharp étant Node-only et l'upload allant directement du navigateur au
 * Storage, les dérivés sont encodés ici (canvas → WebP), comme au Lot 4. */

import { createClient } from "@/lib/supabase/client";
import { STORAGE_BUCKET } from "@/lib/env";
import { deriveLqip, deriveVariants } from "@/lib/image-resize";
import { VARIANT_MIME, variantKey } from "@/lib/image-variants";

export interface UploadedImage {
  storagePath: string;
  filename: string;
  width: number;
  height: number;
  orientation: "portrait" | "landscape";
  variantWidths: number[];
  blurDataURL: string;
}

const slugExt = (name: string) =>
  (name.split(".").pop() || "jpg").toLowerCase().replace(/[^a-z0-9]/g, "") ||
  "jpg";

function readDimensions(file: File): Promise<{ w: number; h: number }> {
  return new Promise((resolve) => {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      resolve({ w: img.naturalWidth, h: img.naturalHeight });
      URL.revokeObjectURL(url);
    };
    img.onerror = () => {
      resolve({ w: 0, h: 0 });
      URL.revokeObjectURL(url);
    };
    img.src = url;
  });
}

/** Uploade un fichier et renvoie ses métadonnées. `prefix` range le fichier
 *  dans un sous-chemin du bucket (ex. `library`, ou l'id d'une série). */
export async function uploadImage(
  file: File,
  prefix: string,
): Promise<UploadedImage> {
  const sb = createClient();
  const { w, h } = await readDimensions(file);
  const key = `${prefix}/${crypto.randomUUID()}.${slugExt(file.name)}`;

  const { error: upErr } = await sb.storage
    .from(STORAGE_BUCKET)
    .upload(key, file, { contentType: file.type || undefined, upsert: false });
  if (upErr) throw upErr;

  // Dérivés + LQIP. Un échec d'encodage n'annule pas l'upload : la photo reste
  // exploitable, le rendu retombe sur l'optimiseur Next, et le backfill
  // rattrape.
  let widths: number[] = [];
  let blur = "";
  try {
    const [variants, lqip] = await Promise.all([
      deriveVariants(file),
      deriveLqip(file),
    ]);
    blur = lqip;
    const uploaded = await Promise.all(
      variants.map(async (v) => {
        const { error } = await sb.storage
          .from(STORAGE_BUCKET)
          .upload(variantKey(key, v.width), v.blob, {
            contentType: VARIANT_MIME,
            upsert: true,
          });
        return error ? null : v.width;
      }),
    );
    widths = uploaded.filter((x): x is number => x !== null);
  } catch {
    widths = [];
  }

  return {
    storagePath: key,
    filename: file.name,
    width: w,
    height: h,
    orientation: h > w ? "portrait" : "landscape",
    variantWidths: widths,
    blurDataURL: blur,
  };
}

/** Reporte les métadonnées d'un upload dans un FormData, pour une Server
 *  Action (saveAsset, uploadToOwner…). */
export function appendUpload(fd: FormData, u: UploadedImage): void {
  fd.set("storage_path", u.storagePath);
  fd.set("filename", u.filename);
  fd.set("width", String(u.width));
  fd.set("height", String(u.height));
  fd.set("orientation", u.orientation);
  if (u.variantWidths.length) fd.set("variant_widths", u.variantWidths.join(","));
  if (u.blurDataURL) fd.set("blur_data_url", u.blurDataURL);
}
