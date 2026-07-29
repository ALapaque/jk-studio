/* Backfill de la migration 0004 — orientation & LQIP des photos existantes.
 *
 *   npm run backfill:0004            # écrit en base
 *   npm run backfill:0004 -- --dry   # simulation, aucune écriture
 *
 * Lit .env.local (via --env-file). Idempotent : ne traite que les photos dont
 * `orientation` ou `blur_data_url` est encore vide, et peut être relancé après
 * une interruption.
 *
 * Ne touche JAMAIS à `subject` / `location` : les légendes éditoriales sont
 * une saisie humaine (Lot 2), pas une donnée dérivable d'un nom de fichier.
 * Les inventer ici produirait exactement le texte générique que la refonte
 * cherche à supprimer.
 *
 * `project_id` n'est pas rattaché non plus : le schéma réel autorise déjà une
 * photo rattachée soit à une série, soit à une catégorie (contrainte
 * `photos_one_parent` de 0003). Réaffecter ces photos changerait l'affichage
 * du site, ce qu'interdit le critère d'acceptation du Lot 1. */

import { createClient } from "@supabase/supabase-js";
import sharp from "sharp";
import type { PhotoOrientation } from "../lib/supabase/types";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucket = process.env.NEXT_PUBLIC_SUPABASE_BUCKET || "portfolio";
const dryRun = process.argv.includes("--dry");

if (!url || !key) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis (.env.local).",
  );
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

/** Résout une clé Storage ou une URL absolue (données de démo) en URL
 *  téléchargeable — même logique que lib/supabase/storage.ts. */
function imageUrl(path: string): string {
  if (/^https?:\/\//i.test(path)) return path;
  const clean = path.replace(/^\/+/, "");
  return `${url}/storage/v1/object/public/${bucket}/${clean}`;
}

interface Derived {
  orientation: PhotoOrientation;
  blur_data_url: string;
  width: number;
  height: number;
}

/** Télécharge l'image et en dérive orientation + LQIP.
 *  Le LQIP est un WebP de 16 px de large : quelques centaines d'octets,
 *  suffisant pour un flou de fond, assez léger pour tenir en base. */
async function derive(src: string): Promise<Derived> {
  const res = await fetch(src);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const input = Buffer.from(await res.arrayBuffer());

  const meta = await sharp(input).metadata();
  // `rotate()` applique l'orientation EXIF : sans ça, une verticale prise au
  // boîtier ressort en paysage et serait croppée à tort dans le défilé.
  const norm = await sharp(input).rotate().toBuffer({ resolveWithObject: true });
  const width = norm.info.width;
  const height = norm.info.height;

  const lqip = await sharp(input)
    .rotate()
    .resize(16, null, { fit: "inside" })
    .webp({ quality: 40 })
    .toBuffer();

  return {
    orientation: height > width ? "portrait" : "landscape",
    blur_data_url: `data:image/webp;base64,${lqip.toString("base64")}`,
    width: width ?? meta.width ?? 0,
    height: height ?? meta.height ?? 0,
  };
}

async function main() {
  const { data: photos, error } = await sb
    .from("photos")
    .select("id, storage_path, width, height, orientation, blur_data_url")
    .or("orientation.is.null,blur_data_url.is.null");

  if (error) {
    console.error("Lecture des photos impossible :", error.message);
    process.exit(1);
  }
  if (!photos?.length) {
    console.log("Rien à faire — toutes les photos sont déjà renseignées.");
    return;
  }

  console.log(
    `${photos.length} photo(s) à traiter${dryRun ? " (simulation)" : ""}.`,
  );

  let ok = 0;
  const failures: { id: string; path: string; reason: string }[] = [];

  for (const p of photos) {
    try {
      const d = await derive(imageUrl(p.storage_path));

      if (!dryRun) {
        const { error: ue } = await sb
          .from("photos")
          .update({
            orientation: d.orientation,
            blur_data_url: d.blur_data_url,
            // Ne comble les dimensions que si elles manquaient : on ne
            // réécrit pas une donnée déjà saisie.
            width: p.width ?? d.width,
            height: p.height ?? d.height,
          })
          .eq("id", p.id);
        if (ue) throw new Error(ue.message);
      }

      ok++;
      console.log(`  ✓ ${p.storage_path} — ${d.orientation}`);
    } catch (err) {
      const reason = err instanceof Error ? err.message : String(err);
      failures.push({ id: p.id, path: p.storage_path, reason });
      console.warn(`  ✗ ${p.storage_path} — ${reason}`);
    }
  }

  console.log(`\n${ok}/${photos.length} traitée(s).`);

  if (failures.length) {
    // Sortie non nulle : une photo sans orientation sera cadrée par défaut en
    // paysage dans le défilé, donc l'échec doit être visible en CI, pas avalé.
    console.error(`\n${failures.length} échec(s) :`);
    for (const f of failures) console.error(`  - ${f.path} : ${f.reason}`);
    process.exit(1);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
