import Image from "next/image";
import type { Metadata } from "next";
import { getCategories } from "@/lib/data";
import { countLabel, Category } from "@/lib/types";
import { getSiteContent } from "@/lib/content";
import { TransitionLink } from "@/components/motion/TransitionLink";

export async function generateMetadata(): Promise<Metadata> {
  const { works, nav } = await getSiteContent();
  return {
    title: works.title || nav.work,
    description: "Index des travaux photo & vidéo — 2024 → 2026.",
  };
}

export const revalidate = 60;

interface CardLayout {
  gridColumn: string;
  marginTop?: string;
  aspect: string;
  video?: boolean;
}

const LAYOUTS: CardLayout[] = [
  { gridColumn: "1 / span 6", aspect: "3 / 4" },
  { gridColumn: "8 / span 5", marginTop: "clamp(60px,10vw,160px)", aspect: "4 / 5" },
  { gridColumn: "2 / span 5", marginTop: "clamp(50px,8vw,120px)", aspect: "3 / 4" },
  { gridColumn: "8 / span 5", marginTop: "clamp(70px,11vw,180px)", aspect: "16 / 11" },
  { gridColumn: "3 / span 8", marginTop: "clamp(60px,9vw,140px)", aspect: "21 / 10", video: true },
];

function WorkCard({ cat, layout }: { cat: Category; layout: CardLayout }) {
  return (
    <TransitionLink
      href={`/travaux/${cat.slug}`}
      transitionLabel={cat.title}
      data-cursor="view"
      data-cursor-label={layout.video ? "LIRE" : "VOIR"}
      style={{
        gridColumn: layout.gridColumn,
        marginTop: layout.marginTop,
        textAlign: "left",
        color: "var(--ink)",
      }}
    >
      <span
        data-reveal="mask"
        style={{
          display: "block",
          position: "relative",
          aspectRatio: layout.aspect,
          overflow: "hidden",
          background: "var(--bg2)",
          boxShadow: "0 0 90px var(--glow)",
        }}
      >
        <Image
          src={cat.coverSrc}
          alt={cat.title}
          fill
          sizes="(max-width:760px) 100vw, 50vw"
          className="jk-img-zoom"
          style={{ objectFit: "cover", filter: "var(--pf)" }}
        />
        <span
          style={{
            position: "absolute",
            top: 14,
            left: 16,
            fontFamily: "var(--font-mono), monospace",
            fontSize: 9,
            color: "#fff",
            mixBlendMode: "difference",
          }}
        >
          {cat.num}
        </span>
        {layout.video && (
          <span style={{ position: "absolute", inset: 0, display: "grid", placeItems: "center" }}>
            <span
              style={{
                width: 56,
                height: 56,
                border: "1px solid rgba(240,236,227,0.85)",
                borderRadius: "50%",
                display: "grid",
                placeItems: "center",
                color: "#f0ece3",
                fontSize: 15,
                background: "rgba(11,10,9,0.25)",
                backdropFilter: "blur(3px)",
              }}
            >
              ▶
            </span>
          </span>
        )}
      </span>
      <span style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 12, marginTop: 14 }}>
        <span style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(28px,3vw,44px)" }}>
          {cat.title}
        </span>
        <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "var(--ink2)" }}>
          {countLabel(cat)}
        </span>
      </span>
      <span
        style={{
          display: "block",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ink2)",
          marginTop: 6,
        }}
      >
        {cat.period}
      </span>
    </TransitionLink>
  );
}

export default async function TravauxPage() {
  const [categories, content] = await Promise.all([
    getCategories(),
    getSiteContent(),
  ]);
  return (
    <main
      style={{
        maxWidth: 1560,
        margin: "0 auto",
        padding: "clamp(120px,16vh,170px) clamp(20px,4vw,56px) 0",
      }}
    >
      <div
        data-reveal="rise"
        style={{
          fontFamily: "var(--font-mono), monospace",
          fontSize: 10.5,
          letterSpacing: "0.26em",
          textTransform: "uppercase",
          color: "var(--ink2)",
          marginBottom: 18,
        }}
      >
        {content.works.eyebrow}
      </div>
      <h1
        data-reveal="rise"
        data-delay="60"
        style={{
          margin: "0 0 clamp(50px,7vw,100px)",
          fontFamily: "var(--font-serif), serif",
          fontStyle: "italic",
          fontWeight: 400,
          fontSize: "clamp(64px,10vw,150px)",
          lineHeight: 0.93,
          letterSpacing: "-0.015em",
        }}
      >
        {content.works.title || content.nav.work}
      </h1>
      <div className="grid12" style={{ gap: "clamp(16px,2vw,28px)" }}>
        {categories.map((cat, i) => (
          <WorkCard key={cat.slug} cat={cat} layout={LAYOUTS[i] ?? LAYOUTS[0]} />
        ))}
      </div>
    </main>
  );
}
