"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";

/** Accueil « galerie » (interactif) : de grandes images plein écran empilées,
 *  une liste de catégories en surimpression à gauche. Survoler/focaliser une
 *  catégorie change l'image affichée ; cliquer entre dans la catégorie. La
 *  navigation devient une galerie qu'on parcourt. */
export function HomeGallery({
  items,
  brand,
}: {
  items: { slug: string; title: string; num: string; count: string; coverSrc: string }[];
  brand: string;
}) {
  const [active, setActive] = useState(0);
  if (!items.length) return null;

  return (
    <section
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
            style={{
              objectFit: "cover",
              opacity: i === active ? 1 : 0,
              transition: "opacity 0.9s var(--jk-ease, ease)",
            }}
          />
        ) : null,
      )}
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to right, rgba(14,12,10,.82) 0%, rgba(14,12,10,.35) 42%, rgba(14,12,10,.1) 100%)",
        }}
      />

      <div
        style={{
          position: "absolute",
          inset: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "clamp(96px, 12vh, 140px) var(--jk-gap-page) clamp(40px, 6vw, 64px)",
        }}
      >
        <span
          style={{
            fontSize: 10,
            letterSpacing: "0.28em",
            textTransform: "uppercase",
            color: "rgba(239,233,225,.7)",
          }}
        >
          {brand} — Portfolio
        </span>

        <nav style={{ display: "grid", gap: "clamp(2px, 0.6vw, 8px)" }}>
          {items.map((it, i) => {
            const on = i === active;
            return (
              <Link
                key={it.slug}
                href={`/travaux/${it.slug}`}
                data-jk-label={it.title}
                onMouseEnter={() => setActive(i)}
                onFocus={() => setActive(i)}
                style={{
                  display: "flex",
                  alignItems: "baseline",
                  gap: 18,
                  color: on ? "#efe9e1" : "rgba(239,233,225,.5)",
                  transition: "color .3s ease, transform .3s ease",
                  transform: on ? "translateX(14px)" : "none",
                }}
              >
                <span style={{ fontSize: 11, letterSpacing: "0.2em", color: "var(--jk-brass)" }}>
                  {it.num}
                </span>
                <span
                  style={{
                    fontFamily: "var(--jk-serif)",
                    fontSize: "clamp(34px, 6vw, 76px)",
                    lineHeight: 1.02,
                    letterSpacing: "var(--jk-ls-display)",
                  }}
                >
                  {it.title}
                </span>
                <span
                  style={{
                    fontSize: 9,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "rgba(239,233,225,.55)",
                  }}
                >
                  {it.count}
                </span>
              </Link>
            );
          })}
        </nav>
      </div>
    </section>
  );
}
