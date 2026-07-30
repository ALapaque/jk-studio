import Image from "next/image";
import { Reveal } from "@/components/jk/Reveal";
import { SeriesHeader, SeriesEnd, NoScriptReveal } from "./shared";
import type { SeriesTemplateProps } from "./types";

/* Template « frames » — mur de galerie.
 *
 * Beaucoup de vide, chaque image encadrée d'un filet laiton et posée sur un
 * passe-partout, avec un cartel centré dessous (façon accrochage d'exposition).
 * Les portraits sont plus étroits que les paysages ; rien n'est croppé. Lecture
 * lente, contemplative — l'opposé de la planche contact. */

export function SeriesFrames({
  category,
  series,
  photos,
  next,
  indexHref,
}: SeriesTemplateProps) {
  return (
    <main
      style={{
        background: "var(--jk-bg)",
        color: "var(--jk-ink)",
        padding: "clamp(96px, 15vh, 160px) var(--jk-gap-page) 0",
      }}
    >
      <NoScriptReveal />

      <div style={{ maxWidth: 720, margin: "0 auto clamp(72px, 12vw, 150px)" }}>
        <SeriesHeader
          category={category}
          series={series}
          count={photos.length}
          align="center"
        />
      </div>

      <section style={{ display: "grid", gap: "clamp(96px, 15vw, 200px)" }}>
        {photos.map((p, i) => {
          const portrait = p.orientation === "portrait";
          return (
            <Reveal
              as="div"
              key={p.id}
              style={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                gap: 22,
              }}
            >
              <div
                style={{
                  width: portrait
                    ? "min(92vw, 480px)"
                    : "min(94vw, 900px)",
                  padding: "clamp(10px, 1.4vw, 18px)",
                  background: "var(--jk-surface)",
                  border: "1px solid color-mix(in srgb, var(--jk-brass) 55%, transparent)",
                  boxShadow: "0 30px 80px -40px rgba(0,0,0,.7)",
                }}
              >
                <div
                  style={{
                    position: "relative",
                    width: "100%",
                    aspectRatio: p.ar.replace(" / ", "/"),
                    overflow: "hidden",
                    background: "var(--jk-bg)",
                  }}
                >
                  <Image
                    src={p.src}
                    alt={p.alt}
                    fill
                    sizes={portrait ? "(max-width: 520px) 92vw, 480px" : "(max-width: 940px) 94vw, 900px"}
                    placeholder={p.blurDataURL ? "blur" : "empty"}
                    blurDataURL={p.blurDataURL || undefined}
                    style={{ objectFit: "cover" }}
                  />
                </div>
              </div>

              {/* Cartel */}
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  gap: 8,
                  textAlign: "center",
                }}
              >
                <span
                  aria-hidden
                  style={{
                    fontSize: 10,
                    letterSpacing: "0.24em",
                    color: "var(--jk-brass)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")}
                </span>
                {p.subject && (
                  <span
                    style={{
                      fontFamily: "var(--jk-serif)",
                      fontStyle: "italic",
                      fontSize: "clamp(17px, 2vw, 22px)",
                      color: "var(--jk-ink)",
                    }}
                  >
                    {p.subject}
                  </span>
                )}
                {p.place && (
                  <span
                    style={{
                      fontSize: 9,
                      letterSpacing: "0.24em",
                      textTransform: "uppercase",
                      color: "var(--jk-ink-mute)",
                    }}
                  >
                    {p.place}
                  </span>
                )}
              </div>
            </Reveal>
          );
        })}
      </section>

      <div style={{ height: "clamp(96px, 15vw, 180px)" }} />
      <SeriesEnd
        category={category}
        series={series}
        next={next}
        count={photos.length}
        indexHref={indexHref}
      />
    </main>
  );
}
