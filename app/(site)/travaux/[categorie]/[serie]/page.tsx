import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getSeriesBySlug } from "@/lib/data";
import { getSiteContent } from "@/lib/content";
import { seriesMedia } from "@/lib/types";
import { MediaGallery } from "@/components/MediaGallery";
import { TransitionLink } from "@/components/motion/TransitionLink";

export const revalidate = 60;

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

export default async function SeriesPage({
  params,
}: {
  params: Promise<{ categorie: string; serie: string }>;
}) {
  const { categorie, serie } = await params;
  const [found, content] = await Promise.all([
    getSeriesBySlug(categorie, serie),
    getSiteContent(),
  ]);
  if (!found) notFound();
  const { category, series } = found;

  const media = seriesMedia(series);
  const idx = category.series.indexOf(series);
  const prev =
    category.series[(idx - 1 + category.series.length) % category.series.length];
  const next = category.series[(idx + 1) % category.series.length];

  const nP = series.photos.length;
  const nV = series.videos.length;
  const count =
    (nP ? `${nP} photos` : "") +
    (nP && nV ? " · " : "") +
    (nV ? `${nV} ${nV > 1 ? "films" : "film"}` : "");
  const meta = `${count} · ${series.location} · ${series.period}`.toUpperCase();

  return (
    <main
      style={{
        maxWidth: 1560,
        margin: "0 auto",
        padding: "clamp(110px,15vh,160px) clamp(20px,4vw,56px) 0",
      }}
    >
      <TransitionLink
        href={`/travaux/${category.slug}`}
        transitionLabel={category.title}
        data-cursor="link"
        className="jk-link"
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10,
          letterSpacing: "0.16em",
          color: "var(--ink2)",
          textTransform: "uppercase",
        }}
      >
        ← {category.title}
      </TransitionLink>

      <div style={{ display: "flex", alignItems: "baseline", gap: 14, margin: "clamp(26px,3vw,40px) 0 10px" }}>
        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "var(--accent)" }}>
          ({category.num})
        </span>
        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ink2)" }}>
          {category.title} — série
        </span>
        <span style={{ flex: 1, height: 1, background: "var(--line)", alignSelf: "center" }} />
      </div>

      <h1
        data-reveal="rise"
        style={{
          margin: 0,
          fontFamily: "var(--font-serif), serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(48px,8vw,120px)",
          lineHeight: 0.95,
          letterSpacing: "-0.015em",
        }}
      >
        {series.title}
      </h1>

      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          alignItems: "baseline",
          gap: 16,
          margin: "clamp(18px,2.4vw,30px) 0 clamp(44px,6vw,80px)",
        }}
      >
        <p data-reveal="rise" data-delay="60" style={{ margin: 0, fontFamily: "var(--font-serif), serif", fontStyle: "italic", fontSize: "clamp(18px,2vw,26px)", lineHeight: 1.4, color: "var(--body)", maxWidth: "40ch" }}>
          {series.description}
        </p>
        <span data-reveal="rise" data-delay="100" style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink2)" }}>
          {meta}
        </span>
      </div>

      <MediaGallery media={media} categoryTitle={category.title} />

      {/* Nav prev / next série */}
      {category.series.length > 1 && (
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            gap: 20,
            borderTop: "1px solid var(--line)",
            marginTop: "clamp(50px,7vw,90px)",
            padding: "clamp(28px,3.6vw,48px) 0 clamp(40px,6vw,80px)",
          }}
        >
          <TransitionLink href={`/travaux/${category.slug}/${prev.slug}`} transitionLabel={prev.title} data-cursor="link" style={{ textAlign: "left", color: "var(--ink)" }}>
            <span style={{ display: "block", fontFamily: "var(--font-mono), monospace", fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink2)", marginBottom: 10 }}>
              ← {content.works.prev}
            </span>
            <span className="jk-link" style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(26px,3.2vw,44px)", lineHeight: 1 }}>
              {prev.title}
            </span>
          </TransitionLink>
          <TransitionLink href={`/travaux/${category.slug}/${next.slug}`} transitionLabel={next.title} data-cursor="link" style={{ textAlign: "right", color: "var(--ink)" }}>
            <span style={{ display: "block", fontFamily: "var(--font-mono), monospace", fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink2)", marginBottom: 10 }}>
              {content.works.next} →
            </span>
            <span className="jk-link" style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(26px,3.2vw,44px)", lineHeight: 1 }}>
              {next.title}
            </span>
          </TransitionLink>
        </div>
      )}
    </main>
  );
}
