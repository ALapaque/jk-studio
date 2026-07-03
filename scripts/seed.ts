/* Seed Supabase depuis les données de démonstration.
 *
 *   npm run seed
 *
 * Lit .env.local (via --env-file). Idempotent : ré-exécutable sans doublon
 * (upsert des catégories/séries, remplacement des médias). Les images pointent
 * vers les URLs de démo (Unsplash) ; le photographe les remplacera par ses
 * propres fichiers via l'admin. */

import { createClient } from "@supabase/supabase-js";
import { CATEGORIES } from "../lib/demo-data";

const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
const key = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!url || !key) {
  console.error(
    "NEXT_PUBLIC_SUPABASE_URL et SUPABASE_SERVICE_ROLE_KEY sont requis (.env.local).",
  );
  process.exit(1);
}

const sb = createClient(url, key, {
  auth: { persistSession: false, autoRefreshToken: false },
});

async function main() {
  for (let ci = 0; ci < CATEGORIES.length; ci++) {
    const c = CATEGORIES[ci];
    const { data: cat, error: ce } = await sb
      .from("categories")
      .upsert(
        {
          slug: c.slug,
          title: c.title,
          subtitle: c.subtitle ?? null,
          description: c.description,
          location: c.location,
          period: c.period,
          position: ci,
        },
        { onConflict: "slug" },
      )
      .select("id")
      .single();
    if (ce || !cat) throw ce ?? new Error("catégorie non créée");
    console.log(`Catégorie: ${c.title}`);

    for (let si = 0; si < c.series.length; si++) {
      const s = c.series[si];
      const { data: proj, error: pe } = await sb
        .from("projects")
        .upsert(
          {
            category_id: cat.id,
            slug: s.slug,
            title: s.title,
            description: s.description,
            location: s.location,
            period: s.period,
            cover_path: s.coverSrc,
            published: true,
            position: si,
          },
          { onConflict: "category_id,slug" },
        )
        .select("id")
        .single();
      if (pe || !proj) throw pe ?? new Error("série non créée");

      // médias : on remplace intégralement
      await sb.from("photos").delete().eq("project_id", proj.id);
      await sb.from("videos").delete().eq("project_id", proj.id);

      if (s.photos.length) {
        const { error } = await sb.from("photos").insert(
          s.photos.map((p, i) => ({
            project_id: proj.id,
            storage_path: p.src,
            alt: p.alt,
            caption: p.caption,
            width: p.width,
            height: p.height,
            position: i,
          })),
        );
        if (error) throw error;
      }
      if (s.videos.length) {
        const { error } = await sb.from("videos").insert(
          s.videos.map((v, i) => ({
            project_id: proj.id,
            provider: v.provider,
            video_id: v.videoId,
            title: v.title,
            position: i,
          })),
        );
        if (error) throw error;
      }
      console.log(
        `  série: ${s.title} — ${s.photos.length} photos, ${s.videos.length} vidéos`,
      );
    }
  }
  console.log("\nSeed terminé.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
