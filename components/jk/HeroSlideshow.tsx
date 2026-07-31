"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Parallax } from "./Parallax";
import { Caption } from "./Caption";

/** Diaporama plein écran du hero de l'accueil — version navigable.
 *
 *  Images empilées en calques absolus, fondu enchaîné. Contrôles : flèches
 *  précédent/suivant sur les bords, rang d'indicateurs cliquables avec barre de
 *  progression minutée (le temps avant le changement automatique), compteur
 *  « 01 / 04 ». Pause au survol et quand l'onglet est masqué. La légende de la
 *  slide active se croise avec l'image.
 *
 *  Enveloppé dans la parallaxe (un seul transform sur le wrapper) ; dégradé,
 *  légende et contrôles sont rendus ICI, hors de la parallaxe, pour un
 *  empilement correct (image → dégradé → légende/contrôles) et pour ne pas
 *  parallaxer l'interface.
 *
 *  Sous `prefers-reduced-motion` : pas d'avance automatique ni de barre animée
 *  (une seule image reste, figée), mais la navigation manuelle reste possible —
 *  elle est déclenchée par l'utilisateur, donc légitime. */
export function HeroSlideshow({
  slides,
  intervalMs = 5500,
}: {
  slides: { src: string; caption: string }[];
  intervalMs?: number;
}) {
  const n = slides.length;
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const [reduced, setReduced] = useState(false);

  // Détection reduced-motion en état (pilote le rendu de la barre), avec
  // réévaluation live — même idiome que SeriesScroller.
  useEffect(() => {
    const m = window.matchMedia("(prefers-reduced-motion: reduce)");
    const apply = () => setReduced(m.matches);
    apply();
    m.addEventListener("change", apply);
    return () => m.removeEventListener("change", apply);
  }, []);

  // Pause quand l'onglet passe en arrière-plan (économise, et évite un saut au
  // retour).
  useEffect(() => {
    const onVis = () => setPaused(document.hidden);
    document.addEventListener("visibilitychange", onVis);
    return () => document.removeEventListener("visibilitychange", onVis);
  }, []);

  const go = useCallback(
    (dir: 1 | -1) => setActive((i) => (i + dir + n) % n),
    [n],
  );
  const goTo = useCallback((i: number) => setActive(i), []);

  // Avance automatique : un timer ré-armé à chaque changement de slide (donc
  // remis à zéro après une navigation manuelle). Neutralisé si réduit, en
  // pause, ou s'il n'y a qu'une image.
  useEffect(() => {
    if (reduced || paused || n < 2) return;
    const t = setTimeout(() => setActive((i) => (i + 1) % n), intervalMs);
    return () => clearTimeout(t);
  }, [active, paused, reduced, n, intervalMs]);

  // Flèches clavier quand le hero a le focus (ou globalement, sans voler la
  // saisie d'un champ).
  const onKey = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "ArrowLeft") {
        e.preventDefault();
        go(-1);
      } else if (e.key === "ArrowRight") {
        e.preventDefault();
        go(1);
      }
    },
    [go],
  );

  const rootRef = useRef<HTMLDivElement>(null);

  if (!n) return null;
  const current = slides[Math.min(active, n - 1)];
  const multi = n > 1;

  return (
    <div
      ref={rootRef}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onKeyDown={onKey}
      role="group"
      aria-roledescription="diaporama"
      aria-label="Diaporama du studio"
      style={{ position: "absolute", inset: 0 }}
    >
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
            "linear-gradient(to bottom, rgba(14,12,10,.62) 0%, rgba(14,12,10,0) 34%, rgba(14,12,10,0) 54%, rgba(14,12,10,.82) 100%)",
        }}
      />

      {/* Flèches de navigation, sur les bords, centrées verticalement. */}
      {multi && (
        <>
          <button
            type="button"
            onClick={() => go(-1)}
            aria-label="Image précédente"
            className="jk-hero-arrow"
            style={{ left: "clamp(12px, 2vw, 26px)" }}
          >
            <Chevron dir="left" />
          </button>
          <button
            type="button"
            onClick={() => go(1)}
            aria-label="Image suivante"
            className="jk-hero-arrow"
            style={{ right: "clamp(12px, 2vw, 26px)" }}
          >
            <Chevron dir="right" />
          </button>
        </>
      )}

      {/* Bloc bas-gauche : légende active + contrôles (compteur + indicateurs). */}
      <div
        style={{
          position: "absolute",
          left: "var(--jk-gap-page)",
          right: "var(--jk-gap-page)",
          bottom: 52,
          display: "grid",
          gap: 20,
        }}
      >
        <span key={active} className="jk-hero-caption">
          <Caption subject={current.caption} variant="hero" tone="onImage" />
        </span>

        {multi && (
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 18,
              flexWrap: "wrap",
            }}
          >
            <span
              aria-hidden
              style={{
                fontSize: 10,
                letterSpacing: "0.24em",
                color: "rgba(239,233,225,.75)",
              }}
            >
              <span style={{ color: "var(--jk-brass)" }}>
                {String(active + 1).padStart(2, "0")}
              </span>
              {" / "}
              {String(n).padStart(2, "0")}
            </span>

            <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
              {slides.map((s, i) => (
                <button
                  key={`${s.src}-${i}`}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Aller à l'image ${i + 1}`}
                  aria-current={i === active ? "true" : undefined}
                  className="jk-hero-dot"
                >
                  <span className="jk-hero-dot__track" aria-hidden>
                    <span
                      className="jk-hero-dot__fill"
                      style={{
                        // Slide active : barre qui se remplit sur la durée (mise
                        // en pause au survol). Slides passées : pleines. À venir :
                        // vides. Sous reduced-motion, l'active est pleine (repère
                        // de position, sans animation).
                        transform:
                          i < active || (i === active && reduced)
                            ? "scaleX(1)"
                            : i === active
                              ? undefined
                              : "scaleX(0)",
                        animation:
                          i === active && !reduced
                            ? `jk-hero-progress ${intervalMs}ms linear forwards`
                            : "none",
                        animationPlayState: paused ? "paused" : "running",
                      }}
                    />
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden
    >
      {dir === "left" ? (
        <polyline points="15 18 9 12 15 6" />
      ) : (
        <polyline points="9 18 15 12 9 6" />
      )}
    </svg>
  );
}
