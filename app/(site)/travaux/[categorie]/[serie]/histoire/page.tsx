import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { getCategories, getSeriesBySlug } from "@/lib/data";
import { Caption } from "@/components/jk/Caption";
import { SeriesScroller } from "@/components/jk/SeriesScroller";

export const revalidate = 60;

/* Défilé immersif d'une série (Lot 4, sous-étapes 1 et 2).
 *
 * Route SÉPARÉE de `/travaux/[categorie]/[serie]` à dessein : le site tourne
 * en production et le §2 impose que les nouvelles routes coexistent avec les
 * anciennes jusqu'à la bascule finale. La planche contact actuelle reste donc
 * la page par défaut ; ce défilé est relisible et validable à côté, sans
 * risque. À la bascule, il prendra la place de la page série et le basculeur
 * « histoire / planche contact » (bonus du §7) fera le lien entre les deux. */

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.flatMap((c) =>
    c.series.map((s) => ({ categorie: c.slug, serie: s.slug })),
  );
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string; serie: string }>;
}): Promise<Metadata> {
  const { categorie, serie } = await params;
  const found = await getSeriesBySlug(categorie, serie);
  if (!found) return { title: "Série" };
  return {
    title: `${found.series.title} — ${found.category.title}`,
    description: found.series.description,
  };
}

export default async function SeriesStoryPage({
  params,
}: {
  params: Promise<{ categorie: string; serie: string }>;
}) {
  const { categorie, serie } = await params;
  const found = await getSeriesBySlug(categorie, serie);
  if (!found) notFound();
  const { category, series } = found;

  const photos = series.photos;
  const idx = category.series.indexOf(series);
  const next = category.series[(idx + 1) % category.series.length];
  const indexHref = `/travaux/${category.slug}`;

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
      {/* ---- écran d'ouverture ---- */}
      <section
        style={{
          position: "relative",
          height: "100dvh",
          display: "flex",
          alignItems: "flex-end",
          background: "var(--jk-surface)",
          scrollSnapAlign: "start",
          overflow: "hidden",
        }}
      >
        {series.coverSrc && (
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              backgroundImage: `url(${series.coverSrc})`,
              backgroundSize: "cover",
              backgroundPosition: "center",
            }}
          />
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
        <div
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
        </div>
      </section>

      {/* ---- le défilé ---- */}
      <SeriesScroller photos={photos} indexHref={indexHref} />

      {/* ---- écran de fin ---- */}
      <section
        style={{
          minHeight: "76dvh",
          padding: "96px var(--jk-gap-page)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 64,
          background: "var(--jk-bg)",
          scrollSnapAlign: "start",
        }}
      >
        <div
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
            style={{
              color: "var(--jk-ink-mute)",
              borderBottom: "1px solid var(--jk-brass)",
              paddingBottom: 3,
            }}
          >
            Revenir à l&apos;index
          </Link>
        </div>

        {next && next.slug !== series.slug && (
          <Link
            href={`/travaux/${category.slug}/${next.slug}/histoire`}
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
        )}
      </section>
    </main>
  );
}
