"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "./Reveal";

/** Ligne de catégorie de l'accueil.
 *
 *  Reprend le survol de l'ancien site, demandé explicitement : glissement de
 *  18 px vers la droite (`jk-row-slide`) et aperçu flottant de la cover qui
 *  **suit le curseur**, comme le faisait le `MotionProvider` historique.
 *
 *  Ce provider a été retiré avec `SiteChrome` ; l'effet est donc reconstruit
 *  localement, à l'identique mais sans réintroduire les 214 Ko du moteur : une
 *  seule boucle `requestAnimationFrame` lisse la position de l'aperçu vers le
 *  curseur (amortissement 0,12), avec le même décalage +28 / −160 px et le
 *  léger basculement ±5° dérivé de la vitesse. Tout passe par des refs — aucun
 *  état React par frame, donc aucun rendu superflu.
 *
 *  L'aperçu est décoratif : il double le titre de la catégorie, d'où
 *  `aria-hidden` et un `alt` vide. Réservé aux vraies souris (`hover: hover` et
 *  `pointer: fine`), désactivé si `prefers-reduced-motion` — il n'existe ni au
 *  clavier ni au tactile, et rien d'essentiel n'y est attaché. */
export function CategoryRow({
  href,
  num,
  title,
  count,
  coverSrc,
  last,
  delay = 0,
}: {
  href: string;
  num: string;
  title: string;
  count: string;
  coverSrc?: string;
  last?: boolean;
  delay?: number;
}) {
  const pvRef = useRef<HTMLSpanElement>(null);
  // État mutable de la boucle — pas de re-render.
  const S = useRef({
    on: false,
    raf: 0,
    mx: 0,
    my: 0,
    px: 0,
    py: 0,
    primed: false,
    reduced: false,
    fine: false,
  });

  // Décalage de l'aperçu par rapport au curseur (repris de l'ancien moteur).
  const OFF_X = 28;
  const OFF_Y = -160;

  useEffect(() => {
    const s = S.current;
    s.reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    // Curseur fin + survol : exclut le tactile, plus fiable que pointer:fine seul.
    s.fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
    return () => {
      if (s.raf) cancelAnimationFrame(s.raf);
    };
  }, []);

  function frame() {
    const s = S.current;
    const pv = pvRef.current;
    if (!pv) {
      s.raf = 0;
      return;
    }
    const tx = s.mx + OFF_X;
    const ty = s.my + OFF_Y;
    s.px += (tx - s.px) * 0.12;
    s.py += (ty - s.py) * 0.12;
    // Basculement dérivé du retard horizontal (vitesse), borné à ±5°.
    const rot = Math.max(-5, Math.min(5, (tx - s.px) * 0.05));
    pv.style.transform = `translate3d(${s.px.toFixed(1)}px,${s.py.toFixed(
      1,
    )}px,0) rotate(${rot.toFixed(2)}deg)`;
    // On continue tant que survolé, ou jusqu'à ce que l'aperçu ait rattrapé sa
    // cible (pour qu'il se stabilise en douceur après un mouvement).
    if (s.on || Math.abs(tx - s.px) > 0.4 || Math.abs(ty - s.py) > 0.4) {
      s.raf = requestAnimationFrame(frame);
    } else {
      s.raf = 0;
    }
  }

  function track(clientX: number, clientY: number) {
    const s = S.current;
    s.mx = clientX;
    s.my = clientY;
    if (!s.primed) {
      // Première position : on pose l'aperçu directement, sans glissement depuis
      // le coin de l'écran.
      s.px = clientX + OFF_X;
      s.py = clientY + OFF_Y;
      s.primed = true;
    }
    if (!s.raf) s.raf = requestAnimationFrame(frame);
  }

  function handleEnter(e: React.MouseEvent) {
    const s = S.current;
    if (!coverSrc || !s.fine || s.reduced) return;
    s.on = true;
    if (pvRef.current) pvRef.current.style.opacity = "1";
    track(e.clientX, e.clientY);
  }

  function handleMove(e: React.MouseEvent) {
    const s = S.current;
    if (!s.on) return;
    track(e.clientX, e.clientY);
  }

  function handleLeave() {
    const s = S.current;
    s.on = false;
    if (pvRef.current) pvRef.current.style.opacity = "0";
  }

  return (
    <li
      style={{ position: "relative" }}
      onMouseEnter={handleEnter}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
    >
      <Reveal as="div" delay={delay}>
        <Link
          href={href}
          className="jk-cat-row jk-row-slide"
          data-jk-label={title}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: 36,
            padding: "34px 0",
            borderTop: "1px solid var(--jk-rule)",
            borderBottom: last ? "1px solid var(--jk-rule)" : undefined,
            color: "inherit",
          }}
        >
          <span
            style={{
              width: 36,
              fontSize: 11,
              letterSpacing: "0.24em",
              color: "var(--jk-brass)",
            }}
          >
            {num}
          </span>
          <span
            style={{
              flex: 1,
              minWidth: 180,
              fontFamily: "var(--jk-serif)",
              fontSize: "clamp(32px, 5vw, 56px)",
              lineHeight: 1,
            }}
          >
            {title}
          </span>
          <span
            style={{
              fontSize: 10,
              letterSpacing: "0.24em",
              textTransform: "uppercase",
              color: "var(--jk-ink-mute)",
            }}
          >
            {count}
          </span>
        </Link>
      </Reveal>

      {coverSrc && (
        <span
          ref={pvRef}
          aria-hidden
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: 250,
            height: 320,
            pointerEvents: "none",
            overflow: "hidden",
            opacity: 0,
            transform: "translate3d(-999px,-999px,0)",
            transition: "opacity .3s ease",
            boxShadow: "0 40px 90px rgba(0,0,0,.5)",
            background: "var(--jk-surface)",
            zIndex: 930,
          }}
        >
          <Image
            src={coverSrc}
            alt=""
            fill
            sizes="250px"
            style={{ objectFit: "cover" }}
          />
        </span>
      )}
    </li>
  );
}
