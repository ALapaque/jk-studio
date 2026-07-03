"use client";

import { usePathname } from "next/navigation";
import { TransitionLink } from "./motion/TransitionLink";

const socialBtn: React.CSSProperties = {
  background: "none",
  border: "none",
  padding: 0,
  color: "var(--ink2)",
  font: "inherit",
  letterSpacing: "inherit",
  textTransform: "inherit",
  transition: "color .25s ease",
};

export interface FooterContent {
  copyright: string;
  location: string;
  socials: string[];
}

export function Footer({ footer }: { footer: FooterContent }) {
  const pathname = usePathname();
  const showCta = !pathname.startsWith("/contact");

  return (
    <footer style={{ marginTop: "clamp(80px,11vw,150px)" }}>
      {showCta && (
        <div
          style={{
            borderTop: "1px solid var(--line)",
            textAlign: "center",
            padding: "clamp(80px,11vw,160px) clamp(20px,4vw,56px)",
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
              marginBottom: 26,
            }}
          >
            Un projet en tête ?
          </div>
          <TransitionLink
            href="/contact"
            transitionLabel="Contact"
            data-cursor="link"
            data-magnet="1"
            data-reveal="rise"
            data-delay="80"
            className="jk-cta"
            style={{
              display: "inline-block",
              fontFamily: "var(--font-serif), serif",
              fontStyle: "italic",
              fontWeight: 400,
              fontSize: "clamp(44px,7vw,110px)",
              lineHeight: 0.95,
              letterSpacing: "-0.015em",
              color: "var(--ink)",
            }}
          >
            Écrivons-le
            <br />
            en images.
          </TransitionLink>
        </div>
      )}
      <div
        style={{
          borderTop: "1px solid var(--line)",
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "space-between",
          gap: 14,
          padding: "20px clamp(20px,4vw,56px)",
          fontFamily: "var(--font-mono), monospace",
          fontSize: 9.5,
          letterSpacing: "0.14em",
          textTransform: "uppercase",
          color: "var(--ink2)",
        }}
      >
        <span>{footer.copyright}</span>
        <span style={{ display: "flex", gap: 24 }}>
          {footer.socials.map((s) => (
            <button key={s} data-cursor="link" className="jk-link" style={socialBtn}>
              {s}
            </button>
          ))}
        </span>
        <span>{footer.location}</span>
      </div>
    </footer>
  );
}
