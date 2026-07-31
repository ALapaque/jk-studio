"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Parallax } from "./Parallax";
import { Caption } from "./Caption";

/** Diaporama plein écran du hero de l'accueil.
 *
 *  Images empilées en calques absolus, fondu enchaîné piloté par un intervalle,
 *  la légende de la slide active se croisant avec l'image. Enveloppé dans la
 *  parallaxe (un seul transform sur le wrapper) ; le dégradé de lisibilité et la
 *  légende sont rendus ICI, hors de la parallaxe, pour un empilement correct
 *  (image → dégradé → légende) et pour que la légende ne parallaxe pas.
 *
 *  Sous `prefers-reduced-motion`, l'intervalle ne démarre pas : seule la
 *  première image (et sa légende) reste affichée, figée — comme le reste du
 *  site. Une seule slide ⇒ pas de rotation. */
export function HeroSlideshow({
  slides,
  intervalMs = 5000,
}: {
  slides: { src: string; caption: string }[];
  intervalMs?: number;
}) {
  const [active, setActive] = useState(0);

  useEffect(() => {
    if (slides.length < 2) return;
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let timer: ReturnType<typeof setInterval> | undefined;

    const start = () => {
      if (timer || media.matches) return;
      timer = setInterval(() => {
        setActive((i) => (i + 1) % slides.length);
      }, intervalMs);
    };
    const stop = () => {
      if (timer) clearInterval(timer);
      timer = undefined;
    };
    // Neutralisé sous reduced-motion, réévalué si l'utilisateur bascule le
    // réglage en cours de route (même idiome que Parallax).
    const apply = () => {
      if (media.matches) {
        stop();
        setActive(0);
      } else {
        start();
      }
    };
    apply();
    media.addEventListener("change", apply);
    return () => {
      media.removeEventListener("change", apply);
      stop();
    };
  }, [slides.length, intervalMs]);

  if (!slides.length) return null;
  const current = slides[Math.min(active, slides.length - 1)];

  return (
    <>
      <Parallax>
        {slides.map((s, i) => (
          <Image
            key={`${s.src}-${i}`}
            src={s.src}
            alt=""
            aria-hidden
            fill
            sizes="100vw"
            priority={i === 0}
            style={{
              objectFit: "cover",
              opacity: i === active ? 1 : 0,
              transition: "opacity 1.2s var(--jk-ease, ease)",
            }}
            className="jk-hero-slide"
          />
        ))}
      </Parallax>

      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(14,12,10,.62) 0%, rgba(14,12,10,0) 34%, rgba(14,12,10,0) 58%, rgba(14,12,10,.72) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          left: "var(--jk-gap-page)",
          bottom: 52,
        }}
      >
        {/* La légende change avec la slide ; `key` la remonte pour un léger
            fondu d'entrée synchronisé avec l'image. */}
        <span key={active} className="jk-hero-caption">
          <Caption subject={current.caption} variant="hero" tone="onImage" />
        </span>
      </div>
    </>
  );
}
