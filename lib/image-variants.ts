/* Convention unique des dérivés d'images (Lot 4).
 *
 * Partagée par les trois producteurs/consommateurs — l'uploader navigateur,
 * le script de backfill (Node/sharp) et le rendu — pour qu'aucun d'eux ne
 * puisse diverger sur les largeurs ou les chemins. */

import { STORAGE_BUCKET, SUPABASE_URL } from "@/lib/env";

/** Largeurs générées, en px.
 *
 * Choisies pour un défilé plein écran plutôt que pour une grille : 640 couvre
 * les mobiles à 1×, 1080 les mobiles à 2× et les petits portables, 1600 la
 * plupart des écrans de bureau, 2400 le plein écran rétina. Au-delà, le gain
 * visuel ne compense plus le poids sur une page qui enchaîne vingt images. */
export const VARIANT_WIDTHS = [640, 1080, 1600, 2400] as const;

/** WebP partout : bien supporté, nettement plus léger que JPEG, et — à la
 *  différence d'AVIF — encodable aussi bien par `canvas` dans le navigateur
 *  que par sharp côté Node, donc un seul format à produire des deux côtés. */
export const VARIANT_EXT = "webp";
export const VARIANT_MIME = "image/webp";

/** Clé Storage d'un dérivé : `<clé originale>@<largeur>.webp`.
 *  Le `@` évite toute collision avec un nom de fichier existant. */
export function variantKey(storagePath: string, width: number): string {
  return `${storagePath}@${width}.${VARIANT_EXT}`;
}

/** URL publique d'un dérivé (même forme que lib/supabase/storage.ts). */
export function variantUrl(storagePath: string, width: number): string {
  const clean = variantKey(storagePath, width).replace(/^\/+/, "");
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${clean}`;
}

/** `srcSet` prêt à poser sur un <img>, ou "" si aucun dérivé n'existe.
 *
 *  Ne liste QUE les largeurs réellement présentes en Storage (colonne
 *  `variant_widths`) : annoncer une largeur absente ferait tomber le
 *  navigateur sur un 404, précisément au moment du LCP. */
export function variantSrcSet(
  storagePath: string,
  widths: number[] | null | undefined,
): string {
  if (!widths?.length) return "";
  // Une URL absolue (donnée de démo Unsplash) n'a pas de dérivé dans notre
  // bucket : on ne fabrique pas de chemin qui n'existe pas.
  if (/^https?:\/\//i.test(storagePath)) return "";
  return [...widths]
    .sort((a, b) => a - b)
    .map((w) => `${variantUrl(storagePath, w)} ${w}w`)
    .join(", ");
}

/** Dérivé à utiliser comme `src` de repli : la largeur médiane, pour ne
 *  pénaliser ni les petits écrans ni les grands si `srcSet` est ignoré. */
export function variantFallbackUrl(
  storagePath: string,
  widths: number[] | null | undefined,
): string {
  if (!widths?.length || /^https?:\/\//i.test(storagePath)) return "";
  const sorted = [...widths].sort((a, b) => a - b);
  return variantUrl(storagePath, sorted[Math.floor(sorted.length / 2)]);
}
