import Image from "next/image";
import type { Metadata } from "next";
import { getSiteContent } from "@/lib/content";
import { TransitionLink } from "@/components/motion/TransitionLink";

export const metadata: Metadata = {
  title: "À propos",
  description: "Derrière l’objectif — la démarche de JKStudio.",
};

export default async function AboutPage() {
  const { about } = await getSiteContent();

  return (
    <main
      style={{
        maxWidth: 1560,
        margin: "0 auto",
        padding: "clamp(120px,16vh,170px) clamp(20px,4vw,56px) 0",
      }}
    >
      <div className="two-col two-col--about">
        {/* portrait sticky */}
        <div style={{ position: "sticky", top: 110 }}>
          <span
            data-reveal="mask"
            style={{
              display: "block",
              position: "relative",
              aspectRatio: "4 / 5",
              overflow: "hidden",
              background: "var(--bg2)",
              boxShadow: "0 0 110px var(--glow)",
            }}
          >
            <Image
              src="https://images.unsplash.com/photo-1554048612-b6a482bc67e5?q=80&w=1000&h=1250&fit=crop&auto=format"
              alt="JK — autoportrait"
              fill
              sizes="(max-width:760px) 100vw, 45vw"
              style={{ objectFit: "cover", filter: "var(--pf)" }}
            />
          </span>
          <span style={{ display: "flex", justifyContent: "space-between", gap: 10, marginTop: 10, fontFamily: "var(--font-mono), monospace", fontSize: 9.5, color: "var(--ink2)" }}>
            <span>{about.portraitCaption}</span>
            <span>{about.portraitYear}</span>
          </span>
        </div>

        {/* texte */}
        <div>
          <div data-reveal="rise" style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10.5, letterSpacing: "0.26em", textTransform: "uppercase", color: "var(--ink2)", marginBottom: 18 }}>
            À propos
          </div>
          <h1
            data-reveal="rise"
            data-delay="60"
            style={{
              margin: "0 0 clamp(28px,3.4vw,44px)",
              fontFamily: "var(--font-serif), serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(48px,6vw,96px)",
              lineHeight: 0.95,
              letterSpacing: "-0.015em",
            }}
          >
            {about.title}
          </h1>

          {about.paragraphs.map((p, i) => (
            <p
              key={i}
              data-reveal="rise"
              style={{
                margin: i === about.paragraphs.length - 1 ? "0 0 clamp(36px,4.4vw,56px)" : "0 0 20px",
                fontSize: 15.5,
                lineHeight: 1.8,
                color: "var(--body)",
                maxWidth: "56ch",
              }}
            >
              {p}
            </p>
          ))}

          <div
            data-reveal="rise"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10,
              letterSpacing: "0.12em",
              textTransform: "uppercase",
              color: "var(--ink2)",
              marginBottom: "clamp(36px,4.4vw,56px)",
            }}
          >
            {about.facts.map((f, i, arr) => (
              <div
                key={f.k}
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  gap: 12,
                  padding: "13px 0",
                  borderTop: "1px solid var(--line)",
                  borderBottom: i === arr.length - 1 ? "1px solid var(--line)" : undefined,
                }}
              >
                <span>{f.k}</span>
                <span style={{ color: "var(--ink)" }}>{f.v}</span>
              </div>
            ))}
          </div>

          <div data-reveal="rise" style={{ display: "grid", gap: 18, marginBottom: "clamp(36px,4.4vw,56px)" }}>
            {about.principles.map((p, i) => (
              <div key={i} style={{ display: "flex", gap: 18, alignItems: "baseline" }}>
                <span style={{ fontFamily: "var(--font-mono), monospace", fontSize: 10, color: "var(--accent)", flex: "none" }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span style={{ fontFamily: "var(--font-serif), serif", fontSize: "clamp(19px,1.8vw,24px)", lineHeight: 1.35 }}>
                  {p}
                </span>
              </div>
            ))}
          </div>

          <TransitionLink
            href="/contact"
            transitionLabel="Contact"
            data-cursor="link"
            data-reveal="rise"
            style={{
              fontFamily: "var(--font-mono), monospace",
              fontSize: 10.5,
              letterSpacing: "0.16em",
              color: "var(--accent)",
              textTransform: "uppercase",
            }}
          >
            Discutons de votre projet →
          </TransitionLink>
        </div>
      </div>
    </main>
  );
}
