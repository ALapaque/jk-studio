import { publicImageUrl } from "@/lib/supabase/storage";
import type { Category } from "@/lib/types";
import type { SiteContent } from "@/lib/content";

/** Dérive les données d'affichage de l'accueil (hero, portrait studio,
 *  sélection) — partagé par les variantes de template pour ne pas dupliquer la
 *  logique. Même résolution que le template `classic`. */
export function deriveHomeData(cats: Category[], content: SiteContent) {
  const allPhotos = cats.flatMap((c) => c.series.flatMap((s) => s.photos));

  const heroSlides = (content.hero.slides ?? [])
    .map((sl) => ({ src: publicImageUrl(sl.path), caption: sl.caption }))
    .filter((sl) => sl.src);

  const fallbackHero = allPhotos[0];
  const hero = content.hero.heroPath
    ? {
        src: publicImageUrl(content.hero.heroPath),
        alt: content.hero.heroCaption || content.brand.name,
        blurDataURL: "",
        subject: content.hero.heroCaption,
        place: content.hero.heroCaptionLocation,
      }
    : fallbackHero
      ? {
          src: fallbackHero.src,
          alt: fallbackHero.alt,
          blurDataURL: fallbackHero.blurDataURL,
          subject: fallbackHero.subject,
          place: fallbackHero.place,
        }
      : null;

  const studioPortrait = content.about.portraitPath
    ? {
        src: publicImageUrl(content.about.portraitPath),
        alt: content.about.portraitCaption || content.about.title,
        blur: "",
      }
    : allPhotos[1]
      ? {
          src: allPhotos[1].src,
          alt: allPhotos[1].alt,
          blur: allPhotos[1].blurDataURL,
        }
      : null;

  const selection = cats
    .flatMap((c) => c.series.map((s) => ({ cat: c, serie: s })));

  return { allPhotos, heroSlides, hero, studioPortrait, selection };
}
