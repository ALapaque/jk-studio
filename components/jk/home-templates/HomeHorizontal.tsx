"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";

/** Accueil « défilement horizontal » : les catégories en panneaux plein écran
 *  qu'on parcourt latéralement (trackpad, tactile, ou molette convertie en
 *  défilement horizontal tant qu'il reste de la course). */
export function HomeHorizontal({
  items,
  hint,
}: {
  items: { slug: string; title: string; num: string; count: string; coverSrc: string }[];
  hint: string;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      if (e.deltaY === 0) return;
      const atStart = el.scrollLeft <= 0;
      const atEnd = el.scrollLeft + el.clientWidth >= el.scrollWidth - 1;
      // On convertit la molette verticale en défilement horizontal, sauf aux
      // extrémités où l'on rend la main au défilement vertical de la page.
      if ((e.deltaY < 0 && atStart) || (e.deltaY > 0 && atEnd)) return;
      e.preventDefault();
      el.scrollLeft += e.deltaY;
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  if (!items.length) return null;

  return (
    <div
      ref={ref}
      style={{
        display: "flex",
        gap: 2,
        height: "100svh",
        overflowX: "auto",
        overflowY: "hidden",
        scrollSnapType: "x proximity",
      }}
    >
      {items.map((it, i) => (
        <Link
          key={it.slug}
          href={`/travaux/${it.slug}`}
          data-jk-label={it.title}
          className="jk-cat-link"
          style={{
            position: "relative",
            flex: "0 0 auto",
            width: "clamp(280px, 64vw, 720px)",
            height: "100%",
            overflow: "hidden",
            background: "var(--jk-surface)",
            color: "#efe9e1",
            scrollSnapAlign: "start",
          }}
        >
          {it.coverSrc && (
            <Image src={it.coverSrc} alt="" aria-hidden fill priority={i === 0} sizes="70vw" className="jk-zoom" style={{ objectFit: "cover" }} />
          )}
          <span aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,12,10,.8) 0%, rgba(14,12,10,0) 46%)" }} />
          <div style={{ position: "absolute", left: "clamp(22px,3vw,40px)", right: "clamp(22px,3vw,40px)", bottom: "clamp(28px,4vw,52px)", display: "grid", gap: 12 }}>
            <span style={{ fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "var(--jk-brass)" }}>
              {it.num} · {it.count}
            </span>
            <span style={{ fontFamily: "var(--jk-serif)", fontSize: "clamp(38px, 5vw, 76px)", lineHeight: 0.98, letterSpacing: "var(--jk-ls-display)" }}>
              {it.title}
            </span>
          </div>
        </Link>
      ))}

      {/* Indice de défilement */}
      <span
        aria-hidden
        style={{
          position: "fixed",
          bottom: 28,
          left: "50%",
          transform: "translateX(-50%)",
          fontSize: 10,
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "var(--jk-ink-mute)",
          pointerEvents: "none",
        }}
      >
        ← {hint} →
      </span>
    </div>
  );
}
