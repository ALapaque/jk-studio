/* Génération des dérivés dans le navigateur (Lot 4).
 *
 * `sharp` est Node-only et l'upload va directement du navigateur vers
 * Supabase Storage : les dérivés des NOUVELLES photos sont donc encodés ici,
 * au moment de l'upload. Aucun appel serveur, donc aucune limite de durée de
 * fonction — ce qui compte sur un plan Vercel Hobby.
 *
 * Les photos DÉJÀ en ligne sont traitées par scripts/backfill-variants.ts,
 * qui utilise sharp. Les deux produisent les mêmes largeurs au même format,
 * donc le rendu ne fait aucune différence entre les deux origines. */

import { VARIANT_MIME, VARIANT_WIDTHS } from "@/lib/image-variants";

export interface Derived {
  width: number;
  blob: Blob;
}

/** Qualité WebP. 0.82 est le point où l'artefact devient invisible à l'œil
 *  sur une photo, pour un poids nettement inférieur à 0.9. */
const QUALITY = 0.82;

async function encode(
  bitmap: ImageBitmap,
  width: number,
): Promise<Blob | null> {
  const scale = width / bitmap.width;
  const w = width;
  const h = Math.max(1, Math.round(bitmap.height * scale));

  // OffscreenCanvas quand il existe (n'occupe pas le thread principal du
  // rendu), sinon canvas classique.
  const canvas =
    typeof OffscreenCanvas !== "undefined"
      ? new OffscreenCanvas(w, h)
      : Object.assign(document.createElement("canvas"), {
          width: w,
          height: h,
        });

  const ctx = canvas.getContext("2d") as
    | CanvasRenderingContext2D
    | OffscreenCanvasRenderingContext2D
    | null;
  if (!ctx) return null;
  ctx.drawImage(bitmap, 0, 0, w, h);

  if (canvas instanceof OffscreenCanvas) {
    return canvas.convertToBlob({ type: VARIANT_MIME, quality: QUALITY });
  }
  return new Promise((resolve) =>
    (canvas as HTMLCanvasElement).toBlob(resolve, VARIANT_MIME, QUALITY),
  );
}

/** Produit les dérivés d'un fichier image.
 *
 *  N'agrandit jamais : seules les largeurs inférieures à l'original sont
 *  générées. Upscaler gonflerait le poids sans ajouter un pixel d'information.
 *  Une image plus petite que la plus petite largeur ne produit donc aucun
 *  dérivé, et le rendu retombera sur l'optimiseur Next. */
export async function deriveVariants(file: File): Promise<Derived[]> {
  const bitmap = await createImageBitmap(file);
  try {
    const out: Derived[] = [];
    for (const w of VARIANT_WIDTHS) {
      if (w > bitmap.width) continue;
      const blob = await encode(bitmap, w);
      if (blob) out.push({ width: w, blob });
    }
    return out;
  } finally {
    bitmap.close?.();
  }
}

/** LQIP : WebP de 16 px de large, quelques centaines d'octets, destiné à
 *  `blurDataURL`. Même rôle que celui produit par le backfill. */
export async function deriveLqip(file: File): Promise<string> {
  const bitmap = await createImageBitmap(file);
  try {
    const blob = await encode(bitmap, Math.min(16, bitmap.width));
    if (!blob) return "";
    const buf = await blob.arrayBuffer();
    let bin = "";
    const bytes = new Uint8Array(buf);
    for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
    return `data:${VARIANT_MIME};base64,${btoa(bin)}`;
  } finally {
    bitmap.close?.();
  }
}
