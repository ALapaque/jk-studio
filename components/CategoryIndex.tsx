"use client";

import { TransitionLink } from "./motion/TransitionLink";
import { useMotion } from "./motion/MotionProvider";

export interface CatRow {
  slug: string;
  num: string;
  title: string;
  count: string;
  coverSrc: string;
}

export function CategoryIndex({ items }: { items: CatRow[] }) {
  const { showPreview, hidePreview } = useMotion();
  return (
    <div>
      {items.map((c) => (
        <TransitionLink
          key={c.slug}
          href={`/travaux/${c.slug}`}
          transitionLabel={c.title}
          data-cursor="view"
          className="jk-row-btn"
          onMouseEnter={() => showPreview(c.coverSrc)}
          onMouseLeave={() => hidePreview()}
          style={{
            display: "block",
            width: "100%",
            borderTop: "1px solid var(--line)",
            textAlign: "left",
            color: "var(--ink)",
          }}
        >
          <span
            data-reveal="rise"
            className="jk-row"
            style={{
              display: "flex",
              alignItems: "baseline",
              gap: "clamp(14px,2.5vw,32px)",
              padding: "clamp(20px,2.6vw,34px) 4px",
            }}
          >
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                color: "var(--ink2)",
                width: 32,
                flex: "none",
              }}
            >
              {c.num}
            </span>
            <span
              style={{
                fontFamily: "var(--font-serif), serif",
                fontSize: "clamp(34px,4.6vw,64px)",
                lineHeight: 1,
                flex: 1,
              }}
            >
              {c.title}
            </span>
            <span
              style={{
                fontFamily: "var(--font-mono), monospace",
                fontSize: 10,
                color: "var(--ink2)",
                flex: "none",
              }}
            >
              {c.count}
            </span>
            <span
              style={{
                fontFamily: "var(--font-serif), serif",
                fontStyle: "italic",
                fontSize: 22,
                color: "var(--accent)",
                flex: "none",
              }}
            >
              →
            </span>
          </span>
        </TransitionLink>
      ))}
      <div style={{ borderTop: "1px solid var(--line)" }} />
    </div>
  );
}
