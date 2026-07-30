import Link from "next/link";
import Image from "next/image";
import { Caption } from "@/components/jk/Caption";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import type { SeriesTemplateProps } from "./types";

/* Éléments partagés entre les templates de série : l'en-tête éditorial compact
 * et le pied de série (retour à l'index + série suivante). Mutualisés pour que
 * les variantes ne diffèrent que par le CORPS (la planche d'images), en gardant
 * une ouverture et une clôture cohérentes d'un template à l'autre. */

const noscriptReveal = `.jk-reveal{opacity:1;transform:none;transition:none}`;

export function NoScriptReveal() {
  return (
    <noscript>
      <style>{noscriptReveal}</style>
    </noscript>
  );
}

/** Bandeau de cover éditorial : plus contenu qu'un plein écran, avec parallaxe
 *  et un dégradé de lisibilité. Utilisé par les variantes qui ouvrent sur un
 *  visuel sans occuper toute la hauteur. */
export function SeriesCoverBand({
  src,
  height = "clamp(360px, 62vh, 640px)",
}: {
  src: string;
  height?: string;
}) {
  if (!src) return null;
  return (
    <div
      style={{
        position: "relative",
        height,
        overflow: "hidden",
        background: "var(--jk-surface)",
      }}
    >
      <Parallax>
        <Image
          src={src}
          alt=""
          aria-hidden
          fill
          sizes="100vw"
          priority
          style={{ objectFit: "cover" }}
        />
      </Parallax>
      <span
        aria-hidden
        style={{
          position: "absolute",
          inset: 0,
          background:
            "linear-gradient(to bottom, rgba(14,12,10,.32) 0%, rgba(14,12,10,0) 44%, rgba(14,12,10,.72) 100%)",
        }}
      />
    </div>
  );
}

/** En-tête éditorial : eyebrow « NN Catégorie », titre serif, ligne de méta. */
export function SeriesHeader({
  category,
  series,
  count,
  onImage = false,
  align = "left",
}: {
  category: SeriesTemplateProps["category"];
  series: SeriesTemplateProps["series"];
  count: number;
  onImage?: boolean;
  align?: "left" | "center";
}) {
  const muted = onImage ? "rgba(239,233,225,.66)" : "var(--jk-ink-mute)";
  const ink = onImage ? "#efe9e1" : "var(--jk-ink)";
  return (
    <Reveal
      as="div"
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 22,
        alignItems: align === "center" ? "center" : "flex-start",
        textAlign: align === "center" ? "center" : "left",
        color: ink,
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
          fontSize: "clamp(44px, 7vw, 96px)",
          lineHeight: 0.96,
          letterSpacing: "var(--jk-ls-display)",
        }}
      >
        {series.title}
      </h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 30,
          fontSize: 10,
          letterSpacing: "var(--jk-track-place)",
          textTransform: "uppercase",
          color: muted,
        }}
      >
        {series.location && <span>{series.location}</span>}
        {series.period && <span>{series.period}</span>}
        <span>
          {count} image{count > 1 ? "s" : ""}
        </span>
      </div>
    </Reveal>
  );
}

/** Pied de série : filet « fin de série » + retour à l'index + série suivante. */
export function SeriesEnd({
  category,
  series,
  next,
  count,
  indexHref,
}: {
  category: SeriesTemplateProps["category"];
  series: SeriesTemplateProps["series"];
  next: SeriesTemplateProps["next"];
  count: number;
  indexHref: string;
}) {
  return (
    <section
      style={{
        minHeight: "60svh",
        padding: "clamp(64px, 10vw, 120px) var(--jk-gap-page)",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
        gap: 56,
        background: "var(--jk-bg)",
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
          Fin de série — {count} image{count > 1 ? "s" : ""}
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
              gap: 20,
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
  );
}
