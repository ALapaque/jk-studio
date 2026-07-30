import Link from "next/link";
import Image from "next/image";
import { Caption } from "@/components/jk/Caption";
import { Reveal } from "@/components/jk/Reveal";
import { SeriesScroller } from "@/components/jk/SeriesScroller";
import { Parallax } from "@/components/jk/Parallax";
import type { SeriesTemplateProps } from "./types";

/* Template « classic » — défilé immersif d'une série (Lot 4).
 *
 * C'est la mise en page historique, extraite telle quelle de la page détail :
 * cover parallaxe plein écran + défilé `SeriesScroller` (un écran par photo) +
 * écran de fin (retour à l'index et série suivante). Aucun changement de
 * comportement ni de pixel par rapport à l'existant — c'est le défaut. */

export function SeriesClassic({
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
        fontFamily: "var(--jk-sans)",
        // `proximity`, jamais `mandatory` : mandatory rend le défilé collant
        // sur mobile et casse le flick rapide (§7).
        scrollSnapType: "y proximity",
      }}
      className="jk-scroller"
    >
      {/* `.jk-reveal` démarre à opacity:0 et c'est l'IntersectionObserver qui
          le révèle. Sans JavaScript, les légendes resteraient donc invisibles
          alors que la page est rendue côté serveur : ce repli les affiche
          d'emblée, sans transition. */}
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      {/* ---- écran d'ouverture ---- */}
      <section
        style={{
          position: "relative",
          height: "100svh",
          display: "flex",
          alignItems: "flex-end",
          background: "var(--jk-surface)",
          scrollSnapAlign: "start",
          overflow: "hidden",
        }}
      >
        {/* <Image> et non une background-image CSS : une image de fond n'est
            pas vue par le scanner de préchargement du navigateur, ne peut pas
            être marquée `priority` et ne reçoit pas de `srcset`. Elle se
            chargeait donc tard, alors que c'est le visuel d'ouverture. */}
        {series.coverSrc && (
          <Parallax>
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
              "linear-gradient(to bottom, rgba(14,12,10,.58) 0%, rgba(14,12,10,.12) 40%, rgba(14,12,10,.78) 100%)",
          }}
        />
        <Reveal
          as="div"
          style={{
            position: "relative",
            padding: "0 var(--jk-gap-page) 110px",
            display: "flex",
            flexDirection: "column",
            gap: 26,
            color: "#efe9e1",
          }}
        >
          <span
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 14,
              fontSize: 10,
              letterSpacing: "var(--jk-track-label)",
              textTransform: "uppercase",
              color: "var(--jk-brass)",
            }}
          >
            {category.num} {category.title}
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(52px, 8vw, 104px)",
              lineHeight: 0.94,
              letterSpacing: "var(--jk-ls-display)",
            }}
          >
            {series.title}
          </h1>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 34,
              fontSize: 10,
              letterSpacing: "var(--jk-track-place)",
              textTransform: "uppercase",
              color: "rgba(239,233,225,.66)",
            }}
          >
            {series.location && <span>{series.location}</span>}
            {series.period && <span>{series.period}</span>}
            <span>
              {photos.length} image{photos.length > 1 ? "s" : ""}
            </span>
          </div>
        </Reveal>
      </section>

      {/* ---- le défilé ---- */}
      <SeriesScroller photos={photos} indexHref={indexHref} />

      {/* ---- écran de fin ---- */}
      <section
        style={{
          minHeight: "76svh",
          padding: "96px var(--jk-gap-page)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 64,
          background: "var(--jk-bg)",
          scrollSnapAlign: "start",
        }}
      >
        <Reveal
          as="div"
          style={{
            display: "flex",
            flexWrap: "wrap",
            gap: 16,
            justifyContent: "space-between",
            alignItems: "baseline",
            borderBottom: "1px solid var(--jk-rule)",
            paddingBottom: 26,
            fontSize: 10,
            letterSpacing: "var(--jk-track-label)",
            textTransform: "uppercase",
            color: "var(--jk-ink-mute)",
          }}
        >
          <span>
            Fin de série — {photos.length} image{photos.length > 1 ? "s" : ""}
          </span>
          <Link
            href={indexHref}
            data-jk-label={category.title}
            style={{
              color: "var(--jk-ink-mute)",
              borderBottom: "1px solid var(--jk-brass)",
              paddingBottom: 3,
            }}
          >
            Revenir à l&apos;index
          </Link>
        </Reveal>

        {next && next.slug !== series.slug && (
          <Reveal as="div" delay={120}>
            <Link
              href={`/travaux/${category.slug}/${next.slug}`}
              data-jk-label={next.title}
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 22,
                color: "var(--jk-ink)",
              }}
            >
              <span
                style={{
                  fontSize: 10,
                  letterSpacing: "var(--jk-track-label)",
                  textTransform: "uppercase",
                  color: "var(--jk-brass)",
                }}
              >
                Série suivante
              </span>
              <span
                style={{
                  fontFamily: "var(--jk-serif)",
                  fontSize: "clamp(40px, 6vw, 88px)",
                  lineHeight: 0.96,
                  letterSpacing: "var(--jk-ls-display)",
                }}
              >
                {next.title}
              </span>
              <Caption
                subject={next.location}
                location={next.period}
                variant="thumbnail"
              />
            </Link>
          </Reveal>
        )}
      </section>
    </main>
  );
}
