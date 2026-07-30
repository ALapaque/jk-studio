import Image from "next/image";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import { SeriesHeader, SeriesEnd, NoScriptReveal } from "./shared";
import type { SeriesTemplateProps } from "./types";

/* Template « cinema » — projection continue.
 *
 * Ouverture plein écran (cover en parallaxe, en-tête posé en bas), puis chaque
 * image en pleine largeur, empilée bord à bord, avec une parallaxe ample et de
 * GRANDES légendes en serif surimprimées. Défilement continu (pas de snap ni de
 * rail de progression) : on descend dans le film. */

export function SeriesCinema({
  category,
  series,
  photos,
  next,
  indexHref,
}: SeriesTemplateProps) {
  return (
    <main style={{ background: "var(--jk-bg)", color: "var(--jk-ink)" }}>
      <NoScriptReveal />

      {/* Ouverture plein écran */}
      <section
        style={{
          position: "relative",
          height: "100svh",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          background: "var(--jk-surface)",
        }}
      >
        {series.coverSrc && (
          <Parallax amplitude={0.24}>
            <Image
              src={series.coverSrc}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              priority
              style={{ objectFit: "cover" }}
            />
          </Parallax>
        )}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(14,12,10,.5) 0%, rgba(14,12,10,.06) 38%, rgba(14,12,10,.82) 100%)",
          }}
        />
        <div style={{ position: "relative", padding: "0 var(--jk-gap-page) 96px" }}>
          <SeriesHeader
            category={category}
            series={series}
            count={photos.length}
            onImage
          />
        </div>
      </section>

      {/* Empilement plein cadre */}
      {photos.map((p, i) => (
        <section
          key={p.id}
          style={{
            position: "relative",
            height: "92svh",
            overflow: "hidden",
            background: "var(--jk-bg)",
            display: "flex",
            alignItems: "flex-end",
          }}
        >
          <Parallax amplitude={0.22}>
            <Image
              src={p.src}
              alt={p.alt}
              fill
              sizes="100vw"
              loading={i === 0 ? "eager" : "lazy"}
              placeholder={p.blurDataURL ? "blur" : "empty"}
              blurDataURL={p.blurDataURL || undefined}
              style={{ objectFit: "cover" }}
            />
          </Parallax>
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to top, rgba(14,12,10,.7) 0%, rgba(14,12,10,0) 46%)",
              pointerEvents: "none",
            }}
          />
          {(p.subject || p.place) && (
            <Reveal
              as="div"
              style={{
                position: "relative",
                padding: "0 var(--jk-gap-page) clamp(40px, 6vw, 76px)",
                maxWidth: "22ch",
              }}
            >
              <span
                aria-hidden
                style={{
                  display: "block",
                  fontSize: 10,
                  letterSpacing: "0.24em",
                  color: "var(--jk-brass)",
                  marginBottom: 16,
                }}
              >
                {String(i + 1).padStart(2, "0")} / {String(photos.length).padStart(2, "0")}
              </span>
              {p.subject && (
                <span
                  style={{
                    display: "block",
                    fontFamily: "var(--jk-serif)",
                    fontSize: "clamp(30px, 4.6vw, 60px)",
                    lineHeight: 1.02,
                    letterSpacing: "var(--jk-ls-tight)",
                    color: "#efe9e1",
                  }}
                >
                  {p.subject}
                </span>
              )}
              {p.place && (
                <span
                  style={{
                    display: "block",
                    marginTop: 14,
                    fontSize: 10,
                    letterSpacing: "0.24em",
                    textTransform: "uppercase",
                    color: "rgba(239,233,225,.72)",
                  }}
                >
                  {p.place}
                </span>
              )}
            </Reveal>
          )}
        </section>
      ))}

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
