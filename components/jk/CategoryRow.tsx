"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { useHoverPreview } from "./useHoverPreview";

/** Ligne de catégorie de l'accueil.
 *
 *  Reprend le survol de l'ancien site, demandé explicitement : glissement de
 *  18 px vers la droite (`jk-row-slide`) et aperçu flottant de la cover qui
 *  **suit le curseur** — comportement mutualisé dans `useHoverPreview`, partagé
 *  avec les lignes de séries pour ne jamais diverger.
 *
 *  L'aperçu est décoratif : il double le titre de la catégorie, d'où
 *  `aria-hidden` et un `alt` vide. Il n'existe ni au clavier ni au tactile. */
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
  const { pvRef, handlers } = useHoverPreview(Boolean(coverSrc));

  return (
    <li style={{ position: "relative" }} {...handlers}>
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
