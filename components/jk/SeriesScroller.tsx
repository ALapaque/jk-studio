"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import type { Photo } from "@/lib/types";
import { Caption } from "./Caption";

/** Défilé plein écran d'une série : un écran par photo.
 *
 *  Comportements imposés par le brief (§7) :
 *  - sections en `100dvh`, jamais `100vh` — sinon la barre d'adresse iOS
 *    décale tout le défilé ;
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
              // 100dvh, pas 100vh : la barre d'adresse iOS décalerait tout.
              height: "100dvh",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              background: portrait ? "var(--jk-surface)" : "var(--jk-bg)",
              overflow: "hidden",
            }}
          >
            {portrait ? (
              // Verticale : marges généreuses, jamais croppée.
              <span
                style={{
                  position: "relative",
                  height: "min(80dvh, 100%)",
                  aspectRatio: p.ar.replace(" / ", "/"),
                  maxWidth: "min(92vw, 720px)",
                }}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 760px) 92vw, 720px"
                  // priority sur la première image uniquement (§7).
                  priority={i === 0}
                  loading={i === 0 ? undefined : "lazy"}
                  placeholder={p.blurDataURL ? "blur" : "empty"}
                  blurDataURL={p.blurDataURL || undefined}
                  style={{ objectFit: "contain" }}
                />
              </span>
            ) : (
              <Image
                src={p.src}
                alt={p.alt}
                fill
                sizes="100vw"
                priority={i === 0}
                loading={i === 0 ? undefined : "lazy"}
                placeholder={p.blurDataURL ? "blur" : "empty"}
                blurDataURL={p.blurDataURL || undefined}
                style={{ objectFit: "cover" }}
              />
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

            <Caption
              subject={p.subject}
              location={p.place}
              variant="fullscreen"
              tone={portrait ? "default" : "onImage"}
              className="jk-reveal"
              data-visible={current >= i ? "true" : undefined}
              style={{
                position: "absolute",
                left: portrait ? "50%" : "var(--jk-gap-page)",
                bottom: portrait ? 74 : 56,
                transform: portrait ? "translateX(-50%)" : undefined,
              }}
            />
          </section>
        );
      })}
    </>
  );
}
