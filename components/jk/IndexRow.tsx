"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "./Reveal";

/** Ligne de série dans l'index portfolio.
 *
 *  Révélation de l'aperçu au survol, en fondu 400ms (maquette). L'image n'est
 *  montée qu'au premier survol : monter vingt aperçus d'emblée alourdirait
 *  une page dont tout l'intérêt est d'être rapide à parcourir — c'est le
 *  contrepoint de l'immersion du défilé.
 *
 *  L'aperçu est purement décoratif : il double une information déjà portée
 *  par le titre, d'où `aria-hidden` et un `alt` vide. Le survol n'existe pas
 *  au clavier ni au tactile, et rien d'essentiel n'y est attaché. */
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
  const [hovered, setHovered] = useState(false);

  return (
    <li
      style={{ position: "relative" }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
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

      {previewSrc && hovered && (
        <span
          aria-hidden
          className="jk-index-preview"
          style={{
            position: "absolute",
            right: 96,
            top: "50%",
            transform: "translateY(-50%)",
            width: 240,
            height: 315,
            pointerEvents: "none",
            boxShadow: "0 40px 90px rgba(0,0,0,.5)",
            zIndex: 5,
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
