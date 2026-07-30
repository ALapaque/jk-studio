import Image from "next/image";
import { Reveal } from "@/components/jk/Reveal";
import { SeriesCoverBand, SeriesHeader, SeriesEnd, NoScriptReveal } from "./shared";
import type { SeriesTemplateProps } from "./types";

/* Template « split » — colonnes alternées.
 *
 * Chaque image occupe une moitié de la page, sa légende l'autre moitié, côté
 * alterné d'une image à l'autre — une double page de magazine. L'image garde son
 * ratio naturel (jamais croppée), le texte est centré verticalement en regard.
 * Sur mobile, tout se réempile proprement. */

export function SeriesSplit({
  category,
  series,
  photos,
  next,
  indexHref,
}: SeriesTemplateProps) {
  return (
    <main style={{ background: "var(--jk-bg)", color: "var(--jk-ink)" }}>
      <NoScriptReveal />

      <SeriesCoverBand src={series.coverSrc} height="clamp(300px, 48vh, 520px)" />

      <section style={{ padding: "clamp(40px, 6vw, 72px) var(--jk-gap-page) 0" }}>
        <SeriesHeader category={category} series={series} count={photos.length} />
      </section>

      <section
        style={{
          padding: "clamp(56px, 9vw, 120px) var(--jk-gap-page) 0",
          display: "grid",
          gap: "clamp(72px, 11vw, 160px)",
        }}
      >
        {photos.map((p, i) => {
          const textFirst = i % 2 === 1;
          return (
            <Reveal
              as="div"
              key={p.id}
              className="jk-split-row"
              style={{
                display: "grid",
                gridTemplateColumns: "minmax(0, 1.35fr) minmax(0, 1fr)",
                gap: "clamp(28px, 5vw, 72px)",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  aspectRatio: p.ar.replace(" / ", "/"),
                  overflow: "hidden",
                  background: "var(--jk-surface)",
                  order: textFirst ? 2 : 1,
                }}
              >
                <Image
                  src={p.src}
                  alt={p.alt}
                  fill
                  sizes="(max-width: 900px) 92vw, 55vw"
                  placeholder={p.blurDataURL ? "blur" : "empty"}
                  blurDataURL={p.blurDataURL || undefined}
                  style={{ objectFit: "cover" }}
                />
              </div>

              <div
                style={{
                  order: textFirst ? 1 : 2,
                  display: "flex",
                  flexDirection: "column",
                  gap: 18,
                }}
              >
                <span
                  aria-hidden
                  style={{
                    fontSize: 11,
                    letterSpacing: "0.24em",
                    color: "var(--jk-brass)",
                  }}
                >
                  {String(i + 1).padStart(2, "0")} —{" "}
                  {String(photos.length).padStart(2, "0")}
                </span>
                <span
                  aria-hidden
                  style={{ width: 48, height: 1, background: "var(--jk-rule)" }}
                />
                {p.subject ? (
                  <span
                    style={{
                      fontFamily: "var(--jk-serif)",
                      fontSize: "clamp(24px, 3vw, 40px)",
                      lineHeight: 1.14,
                      letterSpacing: "var(--jk-ls-tight)",
                    }}
                  >
                    {p.subject}
                  </span>
                ) : (
                  <span
                    style={{
                      fontFamily: "var(--jk-serif)",
                      fontStyle: "italic",
                      fontSize: "clamp(20px, 2.4vw, 30px)",
                      color: "var(--jk-ink-mute)",
                    }}
                  >
                    {series.title}
                  </span>
                )}
                {p.place && (
                  <span
                    style={{
                      fontSize: 10,
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

      <div style={{ height: "clamp(72px, 11vw, 140px)" }} />
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
