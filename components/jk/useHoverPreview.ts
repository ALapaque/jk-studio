"use client";

import { useEffect, useRef } from "react";

/** Aperçu flottant qui suit le curseur, repris du `MotionProvider` historique.
 *
 *  Mutualise le comportement entre les lignes de catégories (accueil) et les
 *  lignes de séries (index, page catégorie) pour qu'ils ne divergent jamais :
 *  une seule boucle `requestAnimationFrame` lisse la position de l'aperçu vers
 *  le curseur (amortissement 0,12), avec le décalage +28 / −160 px de l'ancien
 *  site et le léger basculement ±5° dérivé de la vitesse. Tout passe par des
 *  refs — aucun état React par frame, donc aucun rendu superflu.
 *
 *  Réservé aux vraies souris (`hover: hover` et `pointer: fine`) et désactivé
 *  sous `prefers-reduced-motion` : l'aperçu, décoratif, n'existe ni au clavier
 *  ni au tactile.
 *
 *  Renvoie la ref à poser sur l'élément d'aperçu (`position: fixed`) et les
 *  gestionnaires de souris à étaler sur la ligne survolée. */
export function useHoverPreview(enabled: boolean, offX = 28, offY = -160) {
  const pvRef = useRef<HTMLSpanElement>(null);
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
    const tx = s.mx + offX;
    const ty = s.my + offY;
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
      s.px = clientX + offX;
      s.py = clientY + offY;
      s.primed = true;
    }
    if (!s.raf) s.raf = requestAnimationFrame(frame);
  }

  const handlers = {
    onMouseEnter(e: React.MouseEvent) {
      const s = S.current;
      if (!enabled || !s.fine || s.reduced) return;
      s.on = true;
      if (pvRef.current) pvRef.current.style.opacity = "1";
      track(e.clientX, e.clientY);
    },
    onMouseMove(e: React.MouseEvent) {
      const s = S.current;
      if (!s.on) return;
      track(e.clientX, e.clientY);
    },
    onMouseLeave() {
      const s = S.current;
      s.on = false;
      if (pvRef.current) pvRef.current.style.opacity = "0";
    },
  };

  return { pvRef, handlers };
}
