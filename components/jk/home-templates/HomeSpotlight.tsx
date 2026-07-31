"use client";

import { useCallback, useState } from "react";
import Link from "next/link";
import Image from "next/image";

/** Accueil « spotlight » : une catégorie à la fois en plein écran, avec une
 *  navigation numérotée (01/05) et des flèches précédent/suivant. Pas d'avance
 *  automatique — on choisit. Cliquer sur le titre entre dans la catégorie. */
export function HomeSpotlight({
  items,
  brand,
}: {
  items: { slug: string; title: string; num: string; count: string; coverSrc: string }[];
  brand: string;
}) {
  const n = items.length;
  const [active, setActive] = useState(0);
  const go = useCallback((d: 1 | -1) => setActive((i) => (i + d + n) % n), [n]);

  if (!n) return null;
  const cur = items[Math.min(active, n - 1)];

  return (
    <section
      onKeyDown={(e) => {
        if (e.key === "ArrowLeft") go(-1);
        else if (e.key === "ArrowRight") go(1);
      }}
      style={{
        position: "relative",
        height: "100svh",
        overflow: "hidden",
        background: "var(--jk-surface)",
        color: "#efe9e1",
      }}
    >
      {items.map((it, i) =>
        it.coverSrc ? (
          <Image
            key={it.slug}
            src={it.coverSrc}
            alt=""
            aria-hidden
            fill
            priority={i === 0}
            sizes="100vw"
            style={{ objectFit: "cover", opacity: i === active ? 1 : 0, transition: "opacity 1s var(--jk-ease, ease)" }}
          />
        ) : null,
      )}
      <span aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(14,12,10,.5) 0%, rgba(14,12,10,.12) 40%, rgba(14,12,10,.8) 100%)" }} />

      {/* Eyebrow */}
      <span style={{ position: "absolute", top: "clamp(96px, 12vh, 140px)", left: "var(--jk-gap-page)", fontSize: 10, letterSpacing: "0.28em", textTransform: "uppercase", color: "rgba(239,233,225,.7)" }}>
        {brand} — Portfolio
      </span>

      {/* Titre actif */}
      <div style={{ position: "absolute", left: "var(--jk-gap-page)", right: "var(--jk-gap-page)", bottom: "clamp(96px, 16vh, 180px)", display: "grid", gap: 18 }}>
        <span style={{ fontSize: 11, letterSpacing: "0.24em", color: "var(--jk-brass)" }}>
          {cur.num} · {cur.count}
        </span>
        <Link
          href={`/travaux/${cur.slug}`}
          data-jk-label={cur.title}
          style={{ fontFamily: "var(--jk-serif)", fontSize: "clamp(52px, 11vw, 156px)", lineHeight: 0.94, letterSpacing: "var(--jk-ls-display)", color: "#efe9e1" }}
        >
          {cur.title}
        </Link>
        <Link
          href={`/travaux/${cur.slug}`}
          data-jk-label={cur.title}
          style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(239,233,225,.82)" }}
        >
          Voir la catégorie
          <span aria-hidden className="jk-cat-link__arrow">→</span>
        </Link>
      </div>

      {/* Flèches */}
      {n > 1 && (
        <>
          <button type="button" onClick={() => go(-1)} aria-label="Précédent" className="jk-hero-arrow" style={{ left: "clamp(12px, 2vw, 26px)" }}>
            <Chevron dir="left" />
          </button>
          <button type="button" onClick={() => go(1)} aria-label="Suivant" className="jk-hero-arrow" style={{ right: "clamp(12px, 2vw, 26px)" }}>
            <Chevron dir="right" />
          </button>

          {/* Navigation numérotée */}
          <div style={{ position: "absolute", right: "var(--jk-gap-page)", bottom: "clamp(40px, 6vw, 64px)", display: "flex", gap: 14 }}>
            {items.map((it, i) => (
              <button
                key={it.slug}
                type="button"
                onClick={() => setActive(i)}
                aria-label={`Aller à ${it.title}`}
                aria-current={i === active ? "true" : undefined}
                style={{
                  appearance: "none",
                  border: 0,
                  background: "none",
                  cursor: "pointer",
                  fontSize: 11,
                  letterSpacing: "0.2em",
                  color: i === active ? "var(--jk-brass)" : "rgba(239,233,225,.55)",
                }}
              >
                {String(i + 1).padStart(2, "0")}
              </button>
            ))}
          </div>
        </>
      )}
    </section>
  );
}

function Chevron({ dir }: { dir: "left" | "right" }) {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden>
      {dir === "left" ? <polyline points="15 18 9 12 15 6" /> : <polyline points="9 18 15 12 9 6" />}
    </svg>
  );
}
