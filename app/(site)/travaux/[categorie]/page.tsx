import Image from "next/image";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCategories, getCategoryBySlug } from "@/lib/data";
import { getSiteContent } from "@/lib/content";
import { countLabel, Series } from "@/lib/types";
import { TransitionLink } from "@/components/motion/TransitionLink";
import { MediaGallery } from "@/components/MediaGallery";

export const revalidate = 60;

export async function generateStaticParams() {
  const cats = await getCategories();
  return cats.map((c) => ({ categorie: c.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ categorie: string }>;
}): Promise<Metadata> {
  const { categorie } = await params;
  const cat = await getCategoryBySlug(categorie);
  if (!cat) return { title: "Catégorie" };
  return { title: cat.title, description: cat.description };
}

function seriesCount(s: Series): string {
  const nP = s.photos.length;
  const nV = s.videos.length;
  if (!nP) return `${nV} ${nV > 1 ? "films" : "film"}`;
  if (!nV) return `${nP} photos`;
  return `${nP} photos · ${nV} ${nV > 1 ? "films" : "film"}`;
}

export default async function CategoryPage({
  params,
}: {
  params: Promise<{ categorie: string }>;
}) {
  const { categorie } = await params;
  const [categories, content] = await Promise.all([
    getCategories(),
    getSiteContent(),
  ]);
  const cat = categories.find((c) => c.slug === categorie);
  if (!cat) notFound();

  const idx = categories.indexOf(cat);
  const prev = categories[(idx - 1 + categories.length) % categories.length];
  const next = categories[(idx + 1) % categories.length];
  const meta = `${countLabel(cat)} · ${cat.location} · ${cat.period}`.toUpperCase();

  return (
    <main
      style={{
        maxWidth: 1560,
        margin: "0 auto",
        padding: "clamp(110px,15vh,160px) clamp(20px,4vw,56px) 0",
      }}
    >
      <TransitionLink
        href="/travaux"
        transitionLabel={content.works.title}
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
        ← {content.works.backToIndex}
      </TransitionLink>

      <div style={{ display: "flex", alignItems: "baseline", gap: 14, margin: "clamp(26px,3vw,40px) 0 10px" }}>
        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 11, color: "var(--accent)" }}>
          ({cat.num})
        </span>
        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10.5, letterSpacing: "0.22em", textTransform: "uppercase", color: "var(--ink2)" }}>
          {content.works.categoryLabel}
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
          fontSize: "clamp(56px,9vw,140px)",
          lineHeight: 0.95,
          letterSpacing: "-0.015em",
        }}
      >
        {cat.title}
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
        <p data-reveal="rise" data-delay="60" style={{ margin: 0, fontSize: 15.5, lineHeight: 1.7, color: "var(--body)", maxWidth: "52ch" }}>
          {cat.description}
        </p>
        <span data-reveal="rise" data-delay="100" style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, letterSpacing: "0.16em", textTransform: "uppercase", color: "var(--ink2)" }}>
          {meta}
        </span>
      </div>

      {/* Galerie de photos rattachées directement à la catégorie */}
      {cat.directMedia && cat.directMedia.length > 0 && (
        <div style={{ marginBottom: "clamp(50px,7vw,90px)" }}>
          <MediaGallery media={cat.directMedia} categoryTitle={cat.title} />
        </div>
      )}

      {/* Séries */}
      <div className="grid12" style={{ gap: "clamp(16px,2vw,28px)" }}>
        {cat.series.map((s, i) => (
          <TransitionLink
            key={s.slug}
            href={`/travaux/${cat.slug}/${s.slug}`}
            transitionLabel={s.title}
            data-cursor="view"
            style={{
              gridColumn: i % 2 === 0 ? "1 / span 6" : "7 / span 6",
              marginTop: i % 2 === 1 ? "clamp(40px,7vw,110px)" : undefined,
              textAlign: "left",
              color: "var(--ink)",
            }}
          >
            <span
              data-reveal="mask"
              style={{
                display: "block",
                position: "relative",
                aspectRatio: "4 / 5",
                overflow: "hidden",
                background: "var(--bg2)",
                boxShadow: "0 0 90px var(--glow)",
              }}
            >
              <Image
                src={s.coverSrc}
                alt={s.title}
                fill
                sizes="(max-width:760px) 100vw, 50vw"
                className="jk-img-zoom"
                style={{ objectFit: "cover", filter: "var(--pf)" }}
              />
            </span>
            <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginTop: 14 }}>
              <span style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(24px,2.6vw,38px)" }}>
                {s.title}
              </span>
              <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "var(--ink2)", flex: "none" }}>
                {seriesCount(s)}
              </span>
            </span>
            <p style={{ margin: "10px 0 0", fontFamily: "var(--font-serif), serif", fontStyle: "italic", fontSize: 16, lineHeight: 1.4, color: "var(--body)" }}>
              {s.description}
            </p>
            <span style={{ display: "block", fontFamily: "var(--font-mono), monospace", fontSize: 9.5, letterSpacing: "0.14em", textTransform: "uppercase", color: "var(--ink2)", marginTop: 8 }}>
              {s.location} — {s.period}
            </span>
          </TransitionLink>
        ))}
      </div>

      {/* Nav prev / next catégorie */}
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
        <TransitionLink href={`/travaux/${prev.slug}`} transitionLabel={prev.title} data-cursor="link" style={{ textAlign: "left", color: "var(--ink)" }}>
          <span style={{ display: "block", fontFamily: "var(--font-mono), monospace", fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink2)", marginBottom: 10 }}>
            ← {content.works.prev}
          </span>
          <span className="jk-link" style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(30px,3.6vw,52px)", lineHeight: 1 }}>
            {prev.title}
          </span>
        </TransitionLink>
        <TransitionLink href={`/travaux/${next.slug}`} transitionLabel={next.title} data-cursor="link" style={{ textAlign: "right", color: "var(--ink)" }}>
          <span style={{ display: "block", fontFamily: "var(--font-mono), monospace", fontSize: 9.5, letterSpacing: "0.18em", textTransform: "uppercase", color: "var(--ink2)", marginBottom: 10 }}>
            {content.works.next} →
          </span>
          <span className="jk-link" style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(30px,3.6vw,52px)", lineHeight: 1 }}>
            {next.title}
          </span>
        </TransitionLink>
      </div>
    </main>
  );
}
