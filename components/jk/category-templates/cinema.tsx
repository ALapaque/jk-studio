import Image from "next/image";
import Link from "next/link";
import { countLabel } from "@/lib/types";
import { Parallax } from "@/components/jk/Parallax";
import { Reveal } from "@/components/jk/Reveal";
import type { CategoryTemplateProps } from "./types";

/* Catégorie « cinema » — projection.
 *
 * Ouverture cover plein écran, puis les médias (photos directes + covers de
 * séries) empilés bord à bord avec une parallaxe ample et de grandes légendes
 * surimprimées, défilement continu. Les covers de séries sont cliquables. */

export function CategoryCinema({ category: cat }: CategoryTemplateProps) {
  const slides = [
    ...(cat.directMedia ?? [])
      .filter((m) => m.kind === "photo")
      .map((m) => ({ src: m.src, label: m.subject || "", href: undefined as string | undefined })),
    ...cat.series.map((s) => ({
      src: s.coverSrc || s.photos[0]?.src || "",
      label: s.title,
      href: `/travaux/${cat.slug}/${s.slug}`,
    })),
  ].filter((s) => s.src);

  return (
    <main style={{ background: "var(--jk-bg)", color: "var(--jk-ink)" }}>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      {/* ouverture */}
      <section
        style={{
          position: "relative",
          height: "100svh",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          background: "var(--jk-surface)",
        }}
      >
        {cat.coverSrc && (
          <Parallax amplitude={0.24}>
            <Image src={cat.coverSrc} alt="" aria-hidden fill priority sizes="100vw" style={{ objectFit: "cover" }} />
          </Parallax>
        )}
        <span aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(14,12,10,.5) 0%, rgba(14,12,10,.06) 38%, rgba(14,12,10,.82) 100%)" }} />
        <Reveal as="div" style={{ position: "relative", padding: "0 var(--jk-gap-page) clamp(40px, 6vw, 80px)", display: "grid", gap: 18, color: "#efe9e1" }}>
          <span style={{ fontSize: 10, letterSpacing: "var(--jk-track-label)", textTransform: "uppercase", color: "var(--jk-brass)" }}>
            ({cat.num}) {countLabel(cat)}
          </span>
          <h1 style={{ margin: 0, fontFamily: "var(--jk-serif)", fontWeight: 400, fontSize: "clamp(48px, 8vw, 110px)", lineHeight: 0.96, letterSpacing: "var(--jk-ls-display)" }}>
            {cat.title}
          </h1>
        </Reveal>
      </section>

      {/* empilement plein cadre */}
      {slides.map((s, i) => {
        const inner = (
          <>
            <Parallax amplitude={0.22}>
              <Image src={s.src} alt={s.label} fill sizes="100vw" loading="lazy" style={{ objectFit: "cover" }} />
            </Parallax>
            <span aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to top, rgba(14,12,10,.7) 0%, rgba(14,12,10,0) 46%)", pointerEvents: "none" }} />
            {s.label && (
              <Reveal as="div" style={{ position: "relative", padding: "0 var(--jk-gap-page) clamp(40px, 6vw, 76px)", maxWidth: "22ch" }}>
                <span aria-hidden style={{ display: "block", fontSize: 10, letterSpacing: "0.24em", color: "var(--jk-brass)", marginBottom: 14 }}>
                  {String(i + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
                </span>
                <span style={{ display: "block", fontFamily: "var(--jk-serif)", fontSize: "clamp(30px, 4.6vw, 60px)", lineHeight: 1.02, letterSpacing: "var(--jk-ls-tight)", color: "#efe9e1" }}>
                  {s.label}
                </span>
              </Reveal>
            )}
          </>
        );
        const style: React.CSSProperties = {
          position: "relative",
          height: "92svh",
          overflow: "hidden",
          background: "var(--jk-bg)",
          display: "flex",
          alignItems: "flex-end",
          color: "#efe9e1",
        };
        return s.href ? (
          <Link key={i} href={s.href} data-jk-label={s.label} style={style}>
            {inner}
          </Link>
        ) : (
          <section key={i} style={style}>
            {inner}
          </section>
        );
      })}

      <div style={{ height: "var(--jk-gap-section)" }} />
    </main>
  );
}
