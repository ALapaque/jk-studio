import Image from "next/image";
import { Parallax } from "./Parallax";
import { Reveal } from "./Reveal";

/** Galerie média d'un article — séquence éditoriale animée.
 *
 *  Rythme asymétrique : les images alternent entre pleine largeur (paysage) et
 *  format resserré, calé à gauche puis à droite. Chaque image parallaxe dans son
 *  cadre au défilement et se révèle à son entrée dans le viewport ; la légende,
 *  en serif italique, apparaît avec elle. Cohérent avec la direction
 *  cinématographique du site. */
export function PostGallery({
  media,
}: {
  media: { src: string; caption: string }[];
}) {
  if (!media.length) return null;

  return (
    <section
      aria-label="Galerie"
      style={{
        marginTop: "clamp(72px, 12vw, 160px)",
        display: "grid",
        gap: "clamp(56px, 9vw, 130px)",
      }}
    >
      <Reveal as="div">
        <span
          style={{
            display: "inline-flex",
            alignItems: "center",
            gap: 14,
            fontSize: 10,
            letterSpacing: "var(--jk-track-label)",
            textTransform: "uppercase",
            color: "var(--jk-ink-mute)",
          }}
        >
          <span
            aria-hidden
            style={{ width: 44, height: 1, background: "var(--jk-brass)" }}
          />
          Galerie
        </span>
      </Reveal>

      {media.map((m, i) => {
        // Rythme : une pleine largeur toutes les trois, sinon resserré et
        // aligné en alternance — pour casser la monotonie d'une pile centrée.
        const wide = i % 3 === 0;
        const alignRight = !wide && i % 2 === 0;
        return (
          <Reveal
            as="div"
            key={`${m.src}-${i}`}
            style={{
              display: "grid",
              gap: 16,
              justifyItems: alignRight ? "end" : "start",
            }}
          >
            <div
              style={{
                position: "relative",
                width: wide ? "100%" : "min(100%, 760px)",
                aspectRatio: wide ? "16 / 9" : "4 / 5",
                overflow: "hidden",
                background: "var(--jk-surface)",
              }}
            >
              <Parallax>
                <Image
                  src={m.src}
                  alt={m.caption}
                  fill
                  sizes={wide ? "92vw" : "(max-width: 820px) 92vw, 760px"}
                  style={{ objectFit: "cover" }}
                />
              </Parallax>
            </div>
            {m.caption ? (
              <p
                style={{
                  margin: 0,
                  maxWidth: "48ch",
                  textAlign: alignRight ? "right" : "left",
                  fontFamily: "var(--jk-serif)",
                  fontStyle: "italic",
                  fontSize: "clamp(15px, 1.6vw, 18px)",
                  lineHeight: 1.4,
                  color: "var(--jk-ink-mute)",
                }}
              >
                <span style={{ color: "var(--jk-brass)" }}>— </span>
                {m.caption}
              </p>
            ) : null}
          </Reveal>
        );
      })}
    </section>
  );
}
