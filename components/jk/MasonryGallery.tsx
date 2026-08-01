"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { X, ChevronLeft, ChevronRight } from "lucide-react";
import { BLUR_FALLBACK, blurProps } from "@/lib/blur";
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

/** Une vignette de la mosaïque. L'aperçu flou (LQIP par photo, sinon repli) est
 *  posé en FOND de la tuile et reste visible tant que l'image n'a pas fini de
 *  charger ; l'image nette apparaît ensuite en fondu par-dessus. C'est ce fondu
 *  qui rend le flou perceptible, même quand le chargement est très rapide —
 *  contrairement au placeholder natif de next/image, retiré d'un coup. */
function GalleryTile({
  photo,
  index,
  numbered,
  onOpen,
}: {
  photo: GalleryPhoto;
  index: number;
  numbered: boolean;
  onOpen: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const ref = useRef<HTMLImageElement>(null);

  useEffect(() => {
    // Image déjà en cache : `onLoad` peut ne pas se déclencher après
    // l'hydratation — on lit alors `complete` directement.
    if (ref.current?.complete) setLoaded(true);
    // Filet de sécurité : jamais d'image bloquée invisible si `onLoad` rate.
    const t = setTimeout(() => setLoaded(true), 4000);
    return () => clearTimeout(t);
  }, []);

  const delay = Math.min(index, 8) * 70;
  const blur = photo.blurDataURL || BLUR_FALLBACK;

  return (
    <Reveal
      as="div"
      className="jk-gallery-reveal"
      delay={delay}
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
          onClick={onOpen}
          aria-label={`Agrandir la photo${
            photo.subject ? ` : ${photo.subject}` : ""
          }`}
          className="jk-tile-btn"
          style={{
            position: "relative",
            display: "block",
            width: "100%",
            padding: 0,
            border: 0,
            aspectRatio: photo.ar.replace(" / ", "/"),
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
              {String(index + 1).padStart(2, "0")}
            </span>
          )}
          {/* Couche « pose » : porte l'aperçu flou en fond + le dézoom de
              révélation, séparée de l'image pour ne pas entrer en conflit avec
              le zoom au survol (qui reste sur .jk-zoom). */}
          <span
            className="jk-reveal-media"
            style={{
              transitionDelay: `${delay}ms`,
              backgroundImage: `url("${blur}")`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          >
            <Image
              ref={ref}
              src={photo.src}
              alt={photo.alt}
              fill
              sizes="(max-width: 560px) 100vw, (max-width: 900px) 50vw, (max-width: 1280px) 33vw, 25vw"
              className="jk-zoom jk-fade-img"
              onLoad={() => setLoaded(true)}
              onError={() => setLoaded(true)}
              style={{
                objectFit: "cover",
                opacity: loaded ? 1 : 0,
                transition: "opacity var(--jk-dur-zoom) var(--jk-ease)",
              }}
            />
          </span>
        </button>
        <figcaption>
          <Caption
            subject={photo.subject}
            location={photo.place}
            variant="thumbnail"
          />
        </figcaption>
      </figure>
    </Reveal>
  );
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
      <noscript>
        {/* Sans JS, `onLoad` ne s'exécute pas : on force l'image visible. */}
        <style>{`.jk-fade-img{opacity:1 !important}`}</style>
      </noscript>
      <div className="jk-masonry">
        {photos.map((p, i) => (
          <GalleryTile
            key={p.id}
            photo={p}
            index={i}
            numbered={numbered}
            onOpen={() => setOpen(i)}
          />
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
                {...blurProps(active.blurDataURL)}
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
