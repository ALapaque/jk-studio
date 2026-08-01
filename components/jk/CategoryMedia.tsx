import type { Media } from "@/lib/types";
import { VideoEmbed } from "@/components/VideoEmbed";
import { Reveal } from "./Reveal";
import { MasonryGallery } from "./MasonryGallery";

/** Médias rattachés directement à une catégorie (hors séries) : une galerie de
 *  photos + les vidéos embarquées. Affiché sur la page détail d'une catégorie.
 *
 *  `directMedia` arrive déjà ordonné photos-puis-vidéos (voir `mapCategory`) :
 *  on sépare les deux. Les photos passent dans `MasonryGallery` (mosaïque
 *  cliquable, orientation préservée, lightbox) ; les vidéos gardent leur grille
 *  16/9. Rien n'est rendu si une sous-liste est vide. */
export function CategoryMedia({ media }: { media: Media[] }) {
  const photos = media.filter((m) => m.kind === "photo");
  const videos = media.filter((m) => m.kind === "video");
  if (!photos.length && !videos.length) return null;

  return (
    <div style={{ display: "grid", gap: "clamp(56px, 8vw, 96px)" }}>
      {photos.length > 0 && (
        <MasonryGallery
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
      )}

      {videos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fit, minmax(min(100%, 480px), 1fr))",
            gap: "clamp(24px, 3vw, 44px)",
          }}
        >
          {videos.map((v, i) => (
            <Reveal as="div" key={v.id} delay={Math.min(i, 6) * 70}>
              <figure style={{ margin: 0, display: "grid", gap: 12 }}>
                <VideoEmbed
                  provider={v.provider}
                  videoId={v.videoId}
                  title={v.title || "Vidéo"}
                />
                {v.title && (
                  <figcaption
                    style={{
                      fontSize: 11,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: "var(--jk-ink-mute)",
                    }}
                  >
                    {v.title}
                  </figcaption>
                )}
              </figure>
            </Reveal>
          ))}
        </div>
      )}
    </div>
  );
}
