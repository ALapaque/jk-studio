import Image from "next/image";
import type { Media } from "@/lib/types";
import { VideoEmbed } from "@/components/VideoEmbed";
import { Caption } from "./Caption";
import { Reveal } from "./Reveal";

/** Médias rattachés directement à une catégorie (hors séries) : une grille de
 *  photos + les vidéos embarquées. Affiché sur la page détail d'une catégorie.
 *
 *  `directMedia` arrive déjà ordonné photos-puis-vidéos (voir `mapCategory`) :
 *  on sépare les deux pour deux grilles adaptées (vignettes 4/5 verticales pour
 *  les photos, 16/9 pour les vidéos). Rien n'est rendu si une sous-liste est
 *  vide. Cohérent avec la planche contact et l'univers éditorial du site. */
export function CategoryMedia({ media }: { media: Media[] }) {
  const photos = media.filter((m) => m.kind === "photo");
  const videos = media.filter((m) => m.kind === "video");
  if (!photos.length && !videos.length) return null;

  return (
    <div style={{ display: "grid", gap: "clamp(56px, 8vw, 96px)" }}>
      {photos.length > 0 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns:
              "repeat(auto-fill, minmax(min(100%, 240px), 1fr))",
            gap: "clamp(20px, 2.4vw, 34px)",
          }}
        >
          {photos.map((p, i) => (
            <Reveal as="div" key={p.id} delay={Math.min(i, 8) * 60}>
              <figure
                className="jk-media-tile"
                style={{ margin: 0, display: "grid", gap: 12 }}
              >
                <div
                  style={{
                    position: "relative",
                    aspectRatio: "4 / 5",
                    overflow: "hidden",
                    background: "var(--jk-surface)",
                  }}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes="(max-width: 760px) 50vw, 240px"
                    className="jk-zoom"
                    placeholder={p.blurDataURL ? "blur" : "empty"}
                    blurDataURL={p.blurDataURL || undefined}
                    style={{ objectFit: "cover" }}
                  />
                </div>
                <figcaption>
                  <Caption
                    subject={p.subject}
                    location={p.place}
                    variant="thumbnail"
                  />
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
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
