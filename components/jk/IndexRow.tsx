"use client";

import Link from "next/link";
import Image from "next/image";
import { Reveal } from "./Reveal";
import { useHoverPreview } from "./useHoverPreview";

/** Ligne de série dans l'index portfolio (et les pages catégorie).
 *
 *  Aperçu flottant de la cover au survol qui **suit le curseur**, comme les
 *  lignes de catégories de l'accueil — comportement mutualisé dans
 *  `useHoverPreview`. L'aperçu n'est monté que si une source existe.
 *
 *  Il est purement décoratif : il double une information déjà portée par le
 *  titre, d'où `aria-hidden` et un `alt` vide. Le survol n'existe pas au
 *  clavier ni au tactile, et rien d'essentiel n'y est attaché. */
export function IndexRow({
  href,
  num,
  title,
  location,
  period,
  previewSrc,
  delay = 0,
}: {
  href: string;
  num: string;
  title: string;
  location: string;
  period: string;
  previewSrc?: string;
  delay?: number;
}) {
  const { pvRef, handlers } = useHoverPreview(Boolean(previewSrc));

  return (
    <li style={{ position: "relative" }} {...handlers}>
      <Reveal as="div" delay={delay}>
        <Link
          href={href}
          className="jk-cat-row"
          data-jk-label={title}
          style={{
            display: "flex",
            flexWrap: "wrap",
            alignItems: "baseline",
            gap: 32,
            padding: "22px 0",
            borderTop: "1px solid var(--jk-rule)",
            color: "inherit",
          }}
        >
          <span
            style={{
              width: 30,
              fontSize: 10,
              letterSpacing: "0.2em",
              color: "var(--jk-ink-mute)",
            }}
          >
            {num}
          </span>
          <span
            style={{
              flex: 1,
              minWidth: 200,
              fontFamily: "var(--jk-serif)",
              fontSize: "clamp(24px, 3vw, 34px)",
              lineHeight: 1.1,
            }}
          >
            {title}
          </span>
          {location && (
            <span
              style={{
                width: 200,
                fontSize: 10,
                letterSpacing: "var(--jk-track-place)",
                textTransform: "uppercase",
                color: "var(--jk-ink-mute)",
              }}
            >
              {location}
            </span>
          )}
          {period && (
            <span
              style={{
                width: 110,
                textAlign: "right",
                fontSize: 10,
                letterSpacing: "var(--jk-track-place)",
                color: "var(--jk-ink-mute)",
              }}
            >
              {period}
            </span>
          )}
        </Link>
      </Reveal>

      {previewSrc && (
        <span
          ref={pvRef}
          aria-hidden
          className="jk-index-preview"
          style={{
            position: "fixed",
            left: 0,
            top: 0,
            width: 240,
            height: 315,
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
            src={previewSrc}
            alt=""
            fill
            sizes="240px"
            style={{ objectFit: "cover" }}
          />
        </span>
      )}
    </li>
  );
}
