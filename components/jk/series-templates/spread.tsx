import { SpreadGallery } from "@/components/jk/SpreadGallery";
import {
  SeriesCoverBand,
  SeriesHeader,
  SeriesEnd,
  NoScriptReveal,
} from "./shared";
import type { SeriesTemplateProps } from "./types";

/* Template série « spread » — galerie double page.
 *
 * Ouverture en bandeau cover + en-tête, puis les photos en double page : deux
 * par rangée (gauche/droite) qui parallaxent à des vitesses différentes au
 * défilement, façon double page de magazine. Clôture par le pied de série. */

export function SeriesSpread({
  category,
  series,
  photos,
  next,
  indexHref,
}: SeriesTemplateProps) {
  const items = photos.map((p) => ({
    src: p.src,
    alt: p.alt,
    caption: p.subject || undefined,
  }));

  return (
    <main style={{ background: "var(--jk-bg)", color: "var(--jk-ink)" }}>
      <NoScriptReveal />

      <SeriesCoverBand src={series.coverSrc} />

      <section style={{ padding: "clamp(40px, 6vw, 72px) var(--jk-gap-page) 0" }}>
        <SeriesHeader category={category} series={series} count={photos.length} />
      </section>

      <section style={{ padding: "clamp(48px, 8vw, 100px) var(--jk-gap-page) 0" }}>
        <SpreadGallery items={items} />
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
