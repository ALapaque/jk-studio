import { MasonryGallery } from "@/components/jk/MasonryGallery";
import { SeriesCoverBand, SeriesHeader, SeriesEnd, NoScriptReveal } from "./shared";
import type { SeriesTemplateProps } from "./types";

/* Template « contactSheet » — planche contact éditoriale.
 *
 * Ouverture sur un bandeau de cover contenu, en-tête posé dessous, puis une
 * grille dense et numérotée de toutes les images (façon planche de tirage),
 * chacune numérotée au laiton, zoom au survol, légende sous la vignette. Les
 * vignettes se révèlent en cascade. Rythme régulier, lecture d'archive. */

export function SeriesContactSheet({
  category,
  series,
  photos,
  next,
  indexHref,
}: SeriesTemplateProps) {
  return (
    <main style={{ background: "var(--jk-bg)", color: "var(--jk-ink)" }}>
      <NoScriptReveal />

      <SeriesCoverBand src={series.coverSrc} />

      <section
        style={{
          padding: "clamp(40px, 6vw, 72px) var(--jk-gap-page) 0",
        }}
      >
        <SeriesHeader category={category} series={series} count={photos.length} />
      </section>

      <section style={{ padding: "clamp(48px, 7vw, 88px) var(--jk-gap-page) 0" }}>
        <MasonryGallery
          numbered
          photos={photos.map((p) => ({
            id: p.id,
            src: p.src,
            alt: p.alt,
            subject: p.subject,
            place: p.place,
            blurDataURL: p.blurDataURL,
            ar: p.ar,
          }))}
        />
      </section>

      <div style={{ height: "clamp(64px, 9vw, 120px)" }} />
      <SeriesEnd
        category={category}
        series={series}
        next={next}
        count={photos.length}
        indexHref={indexHref}
      />
    </main>
  );
}
