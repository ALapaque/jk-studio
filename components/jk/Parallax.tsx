"use client";

import { useEffect, useRef } from "react";
import type { ReactNode } from "react";

/** Parallaxe verticale sur une image de fond.
 *
 *  ÉCART ASSUMÉ AVEC LA MAQUETTE : son bloc « Motion » (écran 00) ne prévoit
 *  ni parallaxe ni transition de page — le parti-pris y est volontairement
 *  sobre. Cet effet a été demandé explicitement par le photographe, en
 *  connaissance de cet écart.
 *
 *  Trois précautions, parce qu'une parallaxe mal faite coûte cher :
 *
 *  1. **Aucun state React.** Le `transform` est écrit directement sur le nœud.
 *     Un state re-rendrait l'arbre à chaque pixel de défilement, ce qui serait
 *     ruineux sur une page qui enchaîne vingt écrans.
 *  2. **Une seule écriture par frame**, via `requestAnimationFrame`. Le
 *     handler de scroll ne fait qu'armer la frame suivante ; sans ça, le
 *     navigateur recalcule à chaque événement de scroll.
 *  3. **`translate3d` seul**, jamais `top`/`margin` : c'est composité par le
 *     GPU, donc sans recalcul de mise en page.
 *
 *  L'enfant doit déborder de son cadre (voir `overscan`), sinon la translation
 *  découvrirait un bord vide. Le cadre parent doit porter `overflow: hidden`.
 *
 *  Neutralisé sous `prefers-reduced-motion` : l'élément reste alors
 *  strictement immobile, comme l'exige la maquette pour toute animation. */
export function Parallax({
  children,
  /** Amplitude, en fraction de la hauteur du cadre. 0.12 = ±6 % autour du
   *  centre. Au-delà de ~0.2 l'effet devient voyant et trahit le sujet. */
  amplitude = 0.12,
  /** Débord de l'enfant, en % — doit rester supérieur à l'amplitude pour
   *  qu'aucun bord ne se découvre en fin de course. */
  overscan = 14,
  className,
}: {
  children: ReactNode;
  amplitude?: number;
  overscan?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    let raf = 0;
    let running = false;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Progression du cadre dans le viewport, ramenée à −1 … 1 :
      // −1 = le cadre entre par le bas, 0 = il est centré, 1 = il sort en haut.
      const center = r.top + r.height / 2;
      const p = Math.max(-1, Math.min(1, (center - vh / 2) / (vh / 2 + r.height / 2)));
      el.style.transform = `translate3d(0, ${(p * amplitude * r.height).toFixed(1)}px, 0)`;
    };

    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    const start = () => {
      if (running) return;
      running = true;
      update();
      window.addEventListener("scroll", onScroll, { passive: true });
      window.addEventListener("resize", onScroll, { passive: true });
    };

    const stop = () => {
      running = false;
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      if (raf) cancelAnimationFrame(raf);
      raf = 0;
      // Remise à zéro : sans ça, l'élément resterait figé sur son dernier
      // décalage si l'utilisateur active la réduction d'animations en cours
      // de route.
      el.style.transform = "";
    };

    const apply = () => (media.matches ? stop() : start());
    apply();
    media.addEventListener("change", apply);

    return () => {
      media.removeEventListener("change", apply);
      stop();
    };
  }, [amplitude]);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        position: "absolute",
        left: 0,
        right: 0,
        top: `-${overscan / 2}%`,
        height: `${100 + overscan}%`,
        willChange: "transform",
      }}
    >
      {children}
    </div>
  );
}
