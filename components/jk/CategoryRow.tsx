"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Reveal } from "./Reveal";

/** Ligne de catégorie de l'accueil.
 *
 *  Reprend le survol de l'ancien site, demandé explicitement : glissement de
 *  18 px vers la droite et aperçu de la cover. La maquette, elle, ne prévoit
 *  qu'un passage au laiton (`transition: color 400ms`) — les deux cohabitent
 *  ici, le laiton restant le signal de survol principal.
 *
 *  L'ancien effet passait par le `MotionProvider`, dont l'aperçu suivait le
 *  curseur. Ce provider a été retiré avec `SiteChrome` : l'aperçu est donc
 *  reconstruit localement et ancré à droite de la ligne, comme sur l'index des
 *  séries — plus sobre, et surtout sans réintroduire les 214 Ko du moteur
 *  historique pour un seul effet.
 *
 *  L'aperçu est décoratif : il double le titre de la catégorie, d'où
 *  `aria-hidden` et un `alt` vide. Il n'existe ni au clavier ni au tactile, et
 *  rien d'essentiel n'y est attaché. */
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
          className="jk-cat-row jk-row-slide"
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

      {coverSrc && hovered && (
        <span
          aria-hidden
          style={{
            position: "absolute",
            right: 0,
            top: "50%",
            transform: "translateY(-50%)",
            width: 220,
            height: 290,
            pointerEvents: "none",
            boxShadow: "0 40px 90px rgba(0,0,0,.5)",
            zIndex: 5,
          }}
        >
          <Image
            src={coverSrc}
            alt=""
            fill
            sizes="220px"
            style={{ objectFit: "cover" }}
          />
        </span>
      )}
    </li>
  );
}
