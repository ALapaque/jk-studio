import Image from "next/image";
import { Parallax } from "./Parallax";
import { Reveal } from "./Reveal";

/** Galerie « double page » — deux photos côte à côte (gauche + droite) qui
 *  parallaxent à des vitesses différentes au défilement, comme une double page
 *  de magazine qui respire.
 *
 *  Chaque rangée = une paire d'images ; les amplitudes de parallaxe diffèrent
 *  d'une colonne à l'autre et s'inversent d'une rangée à l'autre, pour que les
 *  deux visuels glissent indépendamment. Nombre impair : la dernière image
 *  passe en pleine largeur. Réempilement en une colonne sous 760px
 *  (`.jk-spread-row`). Neutralisé sous prefers-reduced-motion (via Parallax). */

type Item = { src: string; caption?: string; alt?: string };

function Frame({
  item,
  amplitude,
  ratio,
  sizes,
  priority,
  align = "left",
}: {
  item: Item;
  amplitude: number;
  ratio: string;
  sizes: string;
  priority?: boolean;
  align?: "left" | "right" | "center";
}) {
  return (
    <figure style={{ margin: 0, display: "grid", gap: 12 }}>
      <div
        style={{
          position: "relative",
          width: "100%",
          aspectRatio: ratio,
          overflow: "hidden",
          background: "var(--jk-surface)",
        }}
      >
        <Parallax amplitude={amplitude}>
          <Image
            src={item.src}
            alt={item.alt ?? item.caption ?? ""}
            fill
            sizes={sizes}
            priority={priority}
            style={{ objectFit: "cover" }}
          />
        </Parallax>
      </div>
      {item.caption ? (
        <figcaption
          style={{
            margin: 0,
            fontFamily: "var(--jk-serif)",
            fontStyle: "italic",
            fontSize: "clamp(14px, 1.5vw, 17px)",
            lineHeight: 1.4,
            color: "var(--jk-ink-mute)",
            textAlign: align === "right" ? "right" : "left",
          }}
        >
          <span style={{ color: "var(--jk-brass)" }}>— </span>
          {item.caption}
        </figcaption>
      ) : null}
    </figure>
  );
}

export function SpreadGallery({ items }: { items: Item[] }) {
  const list = items.filter((m) => m.src);
  if (!list.length) return null;

  // Découpe en rangées de deux ; la dernière image esseulée passe en pleine
  // largeur.
  const rows: Item[][] = [];
  for (let i = 0; i < list.length; i += 2) rows.push(list.slice(i, i + 2));

  return (
    <section
      aria-label="Galerie"
      style={{ display: "grid", gap: "clamp(56px, 9vw, 128px)" }}
    >
      {rows.map((row, r) => {
        if (row.length === 1) {
          return (
            <Reveal as="div" key={r}>
              <Frame
                item={row[0]}
                amplitude={0.18}
                ratio="16 / 9"
                sizes="92vw"
                priority={r === 0}
              />
            </Reveal>
          );
        }
        // Amplitudes distinctes par colonne, inversées une rangée sur deux.
        const [aL, aR] = r % 2 === 0 ? [0.14, 0.26] : [0.26, 0.14];
        return (
          <Reveal
            as="div"
            key={r}
            className="jk-spread-row"
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(16px, 3vw, 44px)",
              alignItems: "start",
            }}
          >
            <Frame
              item={row[0]}
              amplitude={aL}
              ratio="4 / 5"
              sizes="(max-width: 760px) 92vw, 46vw"
              priority={r === 0}
              align="left"
            />
            {/* Léger décalage vertical de la colonne droite : renforce l'effet
                de double page désaxée. */}
            <div style={{ marginTop: "clamp(0px, 6vw, 72px)" }}>
              <Frame
                item={row[1]}
                amplitude={aR}
                ratio="4 / 5"
                sizes="(max-width: 760px) 92vw, 46vw"
                align="right"
              />
            </div>
          </Reveal>
        );
      })}
    </section>
  );
}
