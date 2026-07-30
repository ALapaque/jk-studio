"use client";

import { useEffect, useRef } from "react";

/* Loader d'entrée de la refonte — joué une fois par chargement de page.
 *
 * Porté de l'ancien `IntroLoader` (retiré avec le moteur historique) mais aux
 * tokens `--jk-*` et à la serif de la maquette : le nom du studio se remplit en
 * clip-path, puis le voile glisse vers le haut pour révéler le site.
 *
 * Le drapeau `PLAYED` est au niveau module : il survit aux navigations client
 * de la même session (le layout reste monté), donc l'intro ne rejoue pas en
 * naviguant dans le site — seulement au (re)chargement complet, comme avant.
 *
 * Piloté par refs et styles inline : aucun state React, donc aucun rendu
 * superflu et la règle `react-hooks/set-state-in-effect` du projet est
 * respectée. Neutralisé sous `prefers-reduced-motion`, et masqué sans JS
 * (`<noscript>`) pour ne jamais laisser le voile couvrir le site. */

let PLAYED = false;

export function IntroLoader({
  brandName,
  tagline,
}: {
  brandName: string;
  tagline?: string;
}) {
  const rootRef = useRef<HTMLDivElement>(null);
  const fillRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    // Déjà joué dans la session, ou animation désactivée : on découvre le site
    // immédiatement, sans voile.
    if (PLAYED || reduced) {
      root.style.display = "none";
      document.body.style.overflow = "";
      return;
    }

    PLAYED = true;
    document.body.style.overflow = "hidden";
    const t1 = setTimeout(() => {
      if (fillRef.current) fillRef.current.style.clipPath = "inset(0 0% 0 0)";
    }, 300);
    const t2 = setTimeout(() => {
      root.style.transform = "translateY(-101%)";
    }, 1900);
    const t3 = setTimeout(() => {
      root.style.display = "none";
      document.body.style.overflow = "";
    }, 2700);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      document.body.style.overflow = "";
    };
  }, []);

  return (
    <>
      <noscript>
        <style>{`.jk-intro{display:none!important}`}</style>
      </noscript>
      <div
        ref={rootRef}
        className="jk-intro"
        aria-hidden
        style={{
          position: "fixed",
          inset: 0,
          zIndex: 995,
          background: "var(--jk-bg)",
          display: "grid",
          placeItems: "center",
          transform: "translateY(0%)",
          transition: "transform .75s cubic-bezier(.76,0,.24,1)",
        }}
      >
        <div style={{ textAlign: "center", padding: "0 20px" }}>
          <div
            style={{
              position: "relative",
              display: "inline-block",
              fontFamily: "var(--jk-serif)",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(52px,10vw,140px)",
              lineHeight: 1,
              letterSpacing: "-0.015em",
              whiteSpace: "nowrap",
              color: "var(--jk-ink)",
            }}
          >
            {/* Nom en filigrane + calque qui se remplit de gauche à droite. */}
            <span style={{ opacity: 0.16 }}>{brandName}</span>
            <span
              ref={fillRef}
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                color: "var(--jk-ink)",
                clipPath: "inset(0 100% 0 0)",
                transition: "clip-path 1.5s cubic-bezier(.65,0,.35,1)",
              }}
            >
              {brandName}
            </span>
          </div>
          {tagline && (
            <div
              style={{
                marginTop: 24,
                fontFamily: "var(--jk-sans)",
                fontSize: 10,
                letterSpacing: "0.3em",
                textTransform: "uppercase",
                color: "var(--jk-ink-mute)",
              }}
            >
              {tagline}
            </div>
          )}
        </div>
      </div>
    </>
  );
}
