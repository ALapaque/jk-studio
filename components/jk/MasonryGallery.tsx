"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { Caption } from "./Caption";
import { Reveal } from "./Reveal";

/** Photo minimale nécessaire à la galerie (sérialisable vers le client). */
export interface GalleryPhoto {
  id: string;
  src: string;
  alt: string;
  subject?: string;
  place?: string;
  blurDataURL?: string;
  /** Ratio « L / H », ex. « 900 / 1200 ». */
  ar: string;
}

/** Galerie mosaïque cliquable : mise en page « masonry » (colonnes plafonnées à
 *  4 via `.jk-masonry`), chaque vignette ouvre une visionneuse plein écran
 *  (lightbox) avec navigation précédent/suivant, Échap et clic sur le fond pour
 *  fermer. `numbered` ajoute la numérotation façon planche contact. */
export function MasonryGallery({
  photos,
  numbered = false,
}: {
  photos: GalleryPhoto[];
  numbered?: boolean;
}) {
  const [open, setOpen] = useState<number | null>(null);

  const close = useCallback(() => setOpen(null), []);
  const prev = useCallback(
    () =>
      setOpen((o) => (o === null ? o : (o - 1 + photos.length) % photos.length)),
    [photos.length],
  );
  const next = useCallback(
    () => setOpen((o) => (o === null ? o : (o + 1) % photos.length)),
    [photos.length],
  );

  useEffect(() => {
    if (open === null) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") close();
      else if (e.key === "ArrowLeft") prev();
      else if (e.key === "ArrowRight") next();
    };
    window.addEventListener("keydown", onKey);
    // Fige le défilement de la page sous la visionneuse.
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [open, close, prev, next]);

  const active = open === null ? null : photos[open];

  return (
    <>
      <div className="jk-masonry">
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
            <figure
              className="jk-media-tile"
              style={{ margin: 0, display: "grid", gap: 12 }}
            >
              <button
                type="button"
                onClick={() => setOpen(i)}
                aria-label={`Agrandir la photo${
                  p.subject ? ` : ${p.subject}` : ""
                }`}
                className="jk-tile-btn"
                style={{
                  position: "relative",
                  display: "block",
                  width: "100%",
                  padding: 0,
                  border: 0,
                  aspectRatio: p.ar.replace(" / ", "/"),
                  overflow: "hidden",
                  background: "var(--jk-surface)",
                }}
              >
                {numbered && (
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
                )}
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, (max-width: 1280px) 33vw, 25vw"
                  className="jk-zoom"
                  placeholder={p.blurDataURL ? "blur" : "empty"}
                  blurDataURL={p.blurDataURL || undefined}
                  style={{ objectFit: "cover" }}
                />
              </button>
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

      {active && (
        <div
          className="jk-lightbox"
          role="dialog"
          aria-modal="true"
          aria-label="Photo en grand"
          onClick={close}
        >
          <button
            type="button"
            className="jk-lightbox__btn"
            style={{ top: 22, right: 22 }}
            aria-label="Fermer"
            onClick={close}
          >
            <X className="size-5" />
          </button>

          {photos.length > 1 && (
            <>
              <button
                type="button"
                className="jk-lightbox__btn"
                style={{ left: 22, top: "50%", transform: "translateY(-50%)" }}
                aria-label="Photo précédente"
                onClick={(e) => {
                  e.stopPropagation();
                  prev();
                }}
              >
                <ChevronLeft className="size-5" />
              </button>
              <button
                type="button"
                className="jk-lightbox__btn"
                style={{ right: 22, top: "50%", transform: "translateY(-50%)" }}
                aria-label="Photo suivante"
                onClick={(e) => {
                  e.stopPropagation();
                  next();
                }}
              >
                <ChevronRight className="size-5" />
              </button>
            </>
          )}

          <figure
            onClick={(e) => e.stopPropagation()}
            style={{
              margin: 0,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 16,
            }}
          >
            <div
              style={{
                position: "relative",
                width: "min(92vw, 1600px)",
                height: "82vh",
              }}
            >
              <Image
                src={active.src}
                alt={active.alt}
                fill
                sizes="92vw"
                priority
                style={{ objectFit: "contain" }}
              />
            </div>
            {(active.subject || active.place) && (
              <figcaption>
                <Caption
                  subject={active.subject}
                  location={active.place}
                  variant="thumbnail"
                  tone="onImage"
                />
              </figcaption>
            )}
          </figure>
        </div>
      )}
    </>
  );
}
