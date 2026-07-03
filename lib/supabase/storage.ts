import { STORAGE_BUCKET, SUPABASE_URL } from "@/lib/env";

/** URL publique d'une image. Accepte soit une clé Storage, soit une URL
 *  absolue (données de démonstration importées depuis Unsplash). */
export function publicImageUrl(path: string | null | undefined): string {
  if (!path) return "";
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.replace(/^\/+/, "");
  return `${SUPABASE_URL}/storage/v1/object/public/${STORAGE_BUCKET}/${clean}`;
}
