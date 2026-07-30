"use client";

import { Reveal } from "./Reveal";

/** Rendu d'une image insérée dans le corps Markdown d'un article.
 *
 *  Chaque image devient un bloc pleine largeur qui se révèle à l'entrée dans le
 *  viewport (fondu + translation). Le texte alternatif, s'il est présent, sert
 *  de légende en serif italique — cohérent avec la direction éditoriale.
 *
 *  Uniquement des `<span>` en `display:block` : react-markdown place les images
 *  dans un `<p>`, où un `<figure>`/`<div>` serait invalide et provoquerait un
 *  décalage d'hydratation. <img> natif : la source vient du Markdown. */
export function ProseImage({ src, alt }: { src?: string; alt?: string }) {
  if (!src) return null;
  return (
    <Reveal as="span">
      <span style={{ display: "block", margin: "2.4em 0" }}>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={src}
          alt={alt ?? ""}
          loading="lazy"
          style={{ display: "block", width: "100%", height: "auto" }}
        />
        {alt ? (
          <span
            style={{
              display: "block",
              marginTop: 12,
              fontFamily: "var(--jk-serif)",
              fontStyle: "italic",
              fontSize: 15,
              color: "var(--jk-ink-mute)",
            }}
          >
            {alt}
          </span>
        ) : null}
      </span>
    </Reveal>
  );
}
