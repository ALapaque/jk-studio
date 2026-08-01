import Image from "next/image";
import { Caption } from "@/components/jk/Caption";
import { Reveal } from "@/components/jk/Reveal";
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

      <section
        style={{
          padding: "clamp(48px, 7vw, 88px) var(--jk-gap-page) 0",
          // Mosaïque « masonry » : colonnes de largeur égale, images empilées
          // selon leur hauteur réelle. Chaque image garde son orientation
          // (portrait/paysage) sans recadrage, et les paysages ne laissent plus
          // de blanc sous eux. Largeur en px simple : les fonctions math dans
          // `column-width` sont ignorées par Safari (→ une seule colonne pleine
          // largeur, photos étirées/pixelisées).
          columnWidth: "300px",
          columnGap: "clamp(20px, 2.4vw, 34px)",
        }}
      >
        {photos.map((p, i) => (
          <Reveal
            as="div"
            key={p.id}
            delay={Math.min(i, 8) * 60}
            style={{
              breakInside: "avoid",
              marginBottom: "clamp(20px, 2.4vw, 34px)",
            }}
          >
            <figure style={{ margin: 0, display: "grid", gap: 12 }}>
              <div
                style={{
                  position: "relative",
                  aspectRatio: p.ar.replace(" / ", "/"),
                  overflow: "hidden",
                  background: "var(--jk-surface)",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    position: "absolute",
                    top: 10,
                    left: 12,
                    zIndex: 2,
                    fontSize: 10,
                    letterSpacing: "0.2em",
                    color: "var(--jk-brass)",
                    mixBlendMode: "difference",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 760px) 100vw, 400px"
                  className="jk-zoom"
                  placeholder={p.blurDataURL ? "blur" : "empty"}
                  blurDataURL={p.blurDataURL || undefined}
                  style={{ objectFit: "cover" }}
                />
              </div>
              <figcaption>
                <Caption subject={p.subject} location={p.place} variant="thumbnail" />
              </figcaption>
            </figure>
          </Reveal>
        ))}
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
