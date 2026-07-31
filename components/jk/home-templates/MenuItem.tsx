"use client";

import Link from "next/link";
import Image from "next/image";
import { useHoverPreview } from "@/components/jk/useHoverPreview";

/** Entrée du menu d'accueil : nom de catégorie en très grand, aperçu de la
 *  cover qui suit le curseur au survol (mutualise `useHoverPreview`). */
export function MenuItem({
  slug,
  title,
  num,
  count,
  coverSrc,
}: {
  slug: string;
  title: string;
  num: string;
  count: string;
  coverSrc: string;
}) {
  const { pvRef, handlers } = useHoverPreview(Boolean(coverSrc));

  return (
    <li style={{ position: "relative" }} {...handlers}>
      <Link
        href={`/travaux/${slug}`}
        data-jk-label={title}
        className="jk-cat-row"
        style={{
          display: "flex",
          alignItems: "baseline",
          gap: "clamp(14px, 2vw, 28px)",
          padding: "clamp(8px, 1.2vw, 16px) 0",
          color: "inherit",
        }}
      >
        <span style={{ fontSize: 12, letterSpacing: "0.22em", color: "var(--jk-brass)" }}>
          {num}
        </span>
        <span
          style={{
            fontFamily: "var(--jk-serif)",
            fontWeight: 400,
            fontSize: "clamp(44px, 9vw, 128px)",
            lineHeight: 0.98,
            letterSpacing: "var(--jk-ls-display)",
          }}
        >
          {title}
        </span>
        <span style={{ fontSize: 10, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--jk-ink-mute)" }}>
          {count}
        </span>
      </Link>

      {coverSrc && (
        <span
          ref={pvRef}
          aria-hidden
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: 260,
            height: 330,
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
          <Image src={coverSrc} alt="" fill sizes="260px" style={{ objectFit: "cover" }} />
        </span>
      )}
    </li>
  );
}
