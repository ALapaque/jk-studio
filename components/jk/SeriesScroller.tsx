"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Photo } from "@/lib/types";
import { variantFallbackUrl, variantSrcSet } from "@/lib/image-variants";
import { Caption } from "./Caption";
import { Reveal } from "./Reveal";

/** Rend une photo du défilé.
 *
 *  Deux chemins, choisis par la présence de dérivés :
 *  - **avec variantes** : <img> natif et `srcSet` explicite pointant vers le
 *    bucket. Le CDN Supabase sert les fichiers directement — aucune
 *    transformation Vercel n'est consommée, et il n'y a pas de latence de
 *    conversion à froid au premier visiteur (ce qui pèse sur le LCP).
 *  - **sans variantes** : <Image> comme avant. Les photos antérieures au
 *    backfill, et les URLs externes des données de démo, continuent donc de
 *    s'afficher normalement. La bascule est progressive, photo par photo.
 *
 *  `loading`, `fetchPriority` et `sizes` existent nativement sur <img> : rien
 *  n'est perdu par rapport à next/image sur ce chemin. */
function ScreenImage({
  photo,
  first,
  fit,
  sizes,
}: {
  photo: Photo;
  first: boolean;
  fit: "cover" | "contain";
  sizes: string;
}) {
  const srcSet = variantSrcSet(photo.storagePath, photo.variantWidths);

  if (srcSet) {
    return (
      /* Les dérivés sont déjà optimisés et servis par le CDN Supabase : les
         repasser dans next/image consommerait le quota de transformations
         pour ré-encoder une image qui n'en a pas besoin. C'est précisément
         ce que ce lot cherche à éviter. */
      // eslint-disable-next-line @next/next/no-img-element
      <img
        src={variantFallbackUrl(photo.storagePath, photo.variantWidths)}
        srcSet={srcSet}
        sizes={sizes}
        alt={photo.alt}
        loading={first ? "eager" : "lazy"}
        fetchPriority={first ? "high" : "auto"}
        decoding={first ? "sync" : "async"}
        style={{
          position: "absolute",
          inset: 0,
          width: "100%",
          height: "100%",
          objectFit: fit,
        }}
      />
    );
  }

  return (
    <Image
      src={photo.src}
      alt={photo.alt}
      fill
      sizes={sizes}
      priority={first}
      loading={first ? undefined : "lazy"}
      placeholder={photo.blurDataURL ? "blur" : "empty"}
      blurDataURL={photo.blurDataURL || undefined}
      style={{ objectFit: fit }}
    />
  );
}

/** Défilé plein écran d'une série : un écran par photo.
 *
 *  Comportements imposés par le brief (§7) :
 *  - sections en `100svh` (small viewport height), jamais `100vh` ni `100dvh` :
 *    `svh` est STABLE (hauteur barre d'adresse visible), donc les écrans ne se
 *    redimensionnent pas quand la barre mobile se rétracte au scroll — c'est ce
 *    qui provoquait un « saut » de mise à l'échelle. `100vh` couperait sur iOS,
 *    `100dvh` suivrait la barre en direct (d'où le glitch) ;
 *  - `scroll-snap-type: y proximity` en CSS pur, jamais `mandatory` (effet
 *    collant sur mobile, casse le flick rapide) ;
 *  - cadrage par orientation : paysage en plein cadre (`cover`), portrait
 *    centré avec marges (`contain`) — on ne crope jamais une verticale ;
 *  - flèches haut/bas entre photos, `Échap` pour revenir à l'index ;
 *  - sous `prefers-reduced-motion`, snap et animations sont neutralisés et la
 *    page redevient un scroll classique parfaitement lisible. */
export function SeriesScroller({
  photos,
  indexHref,
  onIndexChange,
}: {
  photos: Photo[];
  indexHref: string;
  onIndexChange?: (i: number) => void;
}) {
  const refs = useRef<(HTMLElement | null)[]>([]);
  // Couche image de chaque écran (paysage ou portrait), translatée en parallaxe.
  const layerRefs = useRef<(HTMLElement | null)[]>([]);
  const [current, setCurrent] = useState(0);
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(m.matches);
    apply();
    m.addEventListener("change", apply);
    return () => m.removeEventListener("change", apply);
  }, []);

  // Position courante : sert l'indicateur de progression et le préchargement
  // de n+1. Seuil à 55 % pour que l'écran « majoritairement visible » gagne.
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) {
            const i = Number((e.target as HTMLElement).dataset.i);
            if (!Number.isNaN(i)) {
              setCurrent(i);
              onIndexChange?.(i);
            }
          }
        }
      },
      { threshold: 0.55 },
    );
    for (const el of refs.current) if (el) io.observe(el);
    return () => io.disconnect();
  }, [photos.length, onIndexChange]);

  /* Préchargement de n+1 SEULEMENT (§7) : la photo suivante est déjà en cache
     quand on l'atteint, sans précharger toute la série — ce qui reviendrait à
     annuler le `lazy` et à télécharger vingt visuels d'un coup.
     `new window.Image()` déclenche la requête sans monter de nœud ; le
     navigateur réutilise ensuite l'entrée de cache pour le <img> réel. */
  useEffect(() => {
    const nextPhoto = photos[current + 1];
    if (!nextPhoto) return;
    const img = new window.Image();
    const srcSet = variantSrcSet(nextPhoto.storagePath, nextPhoto.variantWidths);
    if (srcSet) {
      img.srcset = srcSet;
      img.sizes = "100vw";
      img.src = variantFallbackUrl(
        nextPhoto.storagePath,
        nextPhoto.variantWidths,
      );
    } else {
      img.src = nextPhoto.src;
    }
  }, [current, photos]);

  // Parallaxe : chaque image glisse plus lentement que le défilé, dans la limite
  // de son overscan (paysage : couche 136 %, calée en -18 % → ±18 % ; portrait :
  // ±10 % dans ses marges), donc les bords ne se découvrent jamais. Une seule
  // boucle rAF pilotée au scroll, neutralisée sous prefers-reduced-motion.
  useEffect(() => {
    if (reduced) {
      for (const el of layerRefs.current) if (el) el.style.transform = "";
      return;
    }
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      for (let i = 0; i < layerRefs.current.length; i++) {
        const layer = layerRefs.current[i];
        const section = refs.current[i];
        if (!layer || !section) continue;
        const rect = section.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) continue; // hors écran : on saute
        // Amplitude par image (fraction de la hauteur d'écran), portée sur la
        // couche via data-amp : forte en paysage (débord large), plus mesurée
        // en portrait (limitée par ses marges).
        const amp = parseFloat(layer.dataset.amp || "0.1");
        const over = rect.height * amp;
        // progress ≈ -1 (écran sous le pli) … 0 (centré) … 1 (au-dessus).
        const progress = (rect.top + rect.height / 2 - vh / 2) / vh;
        const ty = Math.max(-over, Math.min(over, -progress * over));
        layer.style.transform = `translate3d(0, ${ty.toFixed(1)}px, 0)`;
      }
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
    };
  }, [reduced, photos.length]);

  const goTo = useCallback((i: number) => {
    const el = refs.current[i];
    if (!el) return;
    el.scrollIntoView({
      behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "auto"
        : "smooth",
      block: "start",
    });
  }, []);

  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      // Ne pas voler les flèches à un champ de saisie ou à un élément
      // interactif qui les utilise déjà.
      const t = e.target as HTMLElement | null;
      if (t && /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName)) return;

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        e.preventDefault();
        goTo(Math.min(current + 1, photos.length - 1));
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        e.preventDefault();
        goTo(Math.max(current - 1, 0));
      } else if (e.key === "Escape") {
        window.location.href = indexHref;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [current, goTo, photos.length, indexHref]);

  if (!photos.length) return null;

  return (
    <>
      {/* Indicateur de progression — filet fin sur le côté. */}
      <div
        className="jk-progress"
        aria-hidden
        style={{
          position: "fixed",
          right: 34,
          top: "50%",
          transform: "translateY(-50%)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 10,
          zIndex: 20,
          pointerEvents: "none",
        }}
      >
        <span style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--jk-brass)" }}>
          {String(current + 1).padStart(2, "0")}
        </span>
        <span
          style={{
            position: "relative",
            width: 1,
            height: 180,
            background: "var(--jk-rule)",
          }}
        >
          <span
            style={{
              position: "absolute",
              left: 0,
              width: 1,
              height: `${100 / photos.length}%`,
              top: `${(current * 100) / photos.length}%`,
              background: "var(--jk-brass)",
              transition: reduced
                ? "none"
                : "top var(--jk-dur-hover) var(--jk-ease)",
            }}
          />
        </span>
        <span
          style={{ fontSize: 9, letterSpacing: "0.2em", color: "var(--jk-ink-mute)" }}
        >
          {String(photos.length).padStart(2, "0")}
        </span>
      </div>

      {photos.map((p, i) => {
        const portrait = p.orientation === "portrait";
        return (
          <section
            key={p.id}
            data-i={i}
            ref={(el) => {
              refs.current[i] = el;
            }}
            className="jk-screen"
            aria-label={`Image ${i + 1} sur ${photos.length}`}
            style={{
              position: "relative",
              // 100svh, pas 100vh : la barre d'adresse iOS décalerait tout.
              height: "100svh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: portrait ? "var(--jk-surface)" : "var(--jk-bg)",
              overflow: "hidden",
            }}
          >
            {portrait ? (
              // Verticale : jamais croppée. La parallaxe la fait flotter dans
              // ses marges — hauteur ramenée à 72svh (≈14 % de marge de chaque
              // côté) pour autoriser ±10 % de translation sans débordement.
              <span
                ref={(el) => {
                  layerRefs.current[i] = el;
                }}
                data-amp="0.1"
                style={{
                  position: "relative",
                  height: "min(72svh, 100%)",
                  aspectRatio: p.ar.replace(" / ", "/"),
                  maxWidth: "min(92vw, 720px)",
                  willChange: "transform",
                }}
              >
                {/* priority sur la première image uniquement (§7). */}
                <ScreenImage
                  photo={p}
                  first={i === 0}
                  fit="contain"
                  sizes="(max-width: 760px) 92vw, 720px"
                />
              </span>
            ) : (
              // Couche parallaxe paysage : nettement plus haute que l'écran
              // (136 %, calée en -18 %) pour une translation ample (±18 %) sans
              // jamais découvrir de bord — au diapason de la parallaxe de la cover.
              <div
                ref={(el) => {
                  layerRefs.current[i] = el;
                }}
                data-amp="0.18"
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  top: "-18%",
                  height: "136%",
                  overflow: "hidden",
                  willChange: "transform",
                }}
              >
                <ScreenImage photo={p} first={i === 0} fit="cover" sizes="100vw" />
              </div>
            )}

            {/* Voile de lisibilité, uniquement là où la légende se pose. */}
            {!portrait && (
              <span
                aria-hidden
                style={{
                  position: "absolute",
                  inset: 0,
                  background:
                    "linear-gradient(to top, rgba(14,12,10,.66) 0%, rgba(14,12,10,0) 42%)",
                  pointerEvents: "none",
                }}
              />
            )}

            {/* Le positionnement est porté par ce conteneur, la translation
                de révélation par <Reveal> : deux éléments distincts, donc
                aucun conflit entre le centrage et le `transform` animé.
                Le centrage se fait en flex, sans transform, exprès. */}
            <span
              style={{
                position: "absolute",
                left: portrait ? 0 : "var(--jk-gap-page)",
                right: portrait ? 0 : undefined,
                bottom: portrait ? 74 : 56,
                display: "flex",
                justifyContent: portrait ? "center" : "flex-start",
                pointerEvents: "none",
              }}
            >
              {/* La légende s'observe elle-même : elle se révèle à SON entrée
                  dans le viewport, pas selon l'index de l'écran courant. */}
              <Reveal>
                <Caption
                  subject={p.subject}
                  location={p.place}
                  variant="fullscreen"
                  tone={portrait ? "default" : "onImage"}
                />
              </Reveal>
            </span>
          </section>
        );
      })}
    </>
  );
}
