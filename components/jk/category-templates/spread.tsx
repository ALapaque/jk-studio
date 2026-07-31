import Image from "next/image";
import { countLabel } from "@/lib/types";
import { IndexRow } from "@/components/jk/IndexRow";
import { Parallax } from "@/components/jk/Parallax";
import { Reveal } from "@/components/jk/Reveal";
import { SpreadGallery } from "@/components/jk/SpreadGallery";
import type { CategoryTemplateProps } from "./types";

/* Catégorie « spread » — double page.
 *
 * Cover en bandeau, les médias de la catégorie (photos directes + covers de
 * séries) en galerie double page qui parallaxe au défilement, puis un index des
 * séries pour naviguer. */

export function CategorySpread({ category: cat }: CategoryTemplateProps) {
  const items = [
    ...(cat.directMedia ?? [])
      .filter((m) => m.kind === "photo")
      .map((m) => ({ src: m.src, caption: m.subject || undefined, alt: m.alt })),
    ...cat.series.map((s) => ({
      src: s.coverSrc || s.photos[0]?.src || "",
      caption: s.title,
      alt: s.title,
    })),
  ].filter((it) => it.src);

  return (
    <main style={{ background: "var(--jk-bg)", color: "var(--jk-ink)" }}>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      {cat.coverSrc ? (
        <section
          style={{
            position: "relative",
            height: "clamp(380px, 58vh, 600px)",
            display: "flex",
            alignItems: "flex-end",
            overflow: "hidden",
            background: "var(--jk-surface)",
          }}
        >
          <Parallax>
            <Image src={cat.coverSrc} alt="" aria-hidden fill sizes="100vw" priority style={{ objectFit: "cover" }} />
          </Parallax>
          <span aria-hidden style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(14,12,10,.4) 0%, rgba(14,12,10,.06) 44%, rgba(14,12,10,.8) 100%)" }} />
          <Reveal as="div" style={{ position: "relative", padding: "0 var(--jk-gap-page) clamp(36px, 5vw, 64px)", display: "grid", gap: 16, color: "#efe9e1" }}>
            <span style={{ fontSize: 10, letterSpacing: "var(--jk-track-label)", textTransform: "uppercase", color: "var(--jk-brass)" }}>
              ({cat.num}) {countLabel(cat)}
            </span>
            <h1 style={{ margin: 0, fontFamily: "var(--jk-serif)", fontWeight: 400, fontSize: "clamp(44px, 7vw, 96px)", lineHeight: 0.98, letterSpacing: "var(--jk-ls-display)" }}>
              {cat.title}
            </h1>
          </Reveal>
        </section>
      ) : (
        <header style={{ padding: "clamp(96px, 14vh, 140px) var(--jk-gap-page) 0" }}>
          <Reveal as="div" style={{ display: "grid", gap: 16 }}>
            <span style={{ fontSize: 10, letterSpacing: "var(--jk-track-label)", textTransform: "uppercase", color: "var(--jk-ink-mute)" }}>
              <span style={{ color: "var(--jk-brass)" }}>({cat.num})</span> {countLabel(cat)}
            </span>
            <h1 style={{ margin: 0, fontFamily: "var(--jk-serif)", fontWeight: 400, fontSize: "clamp(44px, 7vw, 96px)", lineHeight: 0.98, letterSpacing: "var(--jk-ls-display)" }}>
              {cat.title}
            </h1>
          </Reveal>
        </header>
      )}

      {items.length > 0 && (
        <section style={{ padding: "clamp(48px, 8vw, 100px) var(--jk-gap-page) 0" }}>
          <SpreadGallery items={items} />
        </section>
      )}

      {cat.series.length > 0 && (
        <section style={{ padding: "clamp(56px, 8vw, 96px) var(--jk-gap-page) 0", display: "grid", gap: 32 }}>
          <span style={{ display: "inline-flex", alignItems: "center", gap: 14, fontSize: 10, letterSpacing: "var(--jk-track-label)", textTransform: "uppercase", color: "var(--jk-ink-mute)" }}>
            <span aria-hidden style={{ width: 44, height: 1, background: "var(--jk-brass)" }} />
            Séries
          </span>
          <ul style={{ listStyle: "none", margin: 0, padding: 0, borderBottom: "1px solid var(--jk-rule)" }}>
            {cat.series.map((s, i) => (
              <IndexRow
                key={s.slug}
                href={`/travaux/${cat.slug}/${s.slug}`}
                num={String(i + 1).padStart(2, "0")}
                title={s.title}
                location={s.location}
                period={s.period}
                previewSrc={s.coverSrc || s.photos[0]?.src}
                delay={Math.min(i, 5) * 70}
              />
            ))}
          </ul>
        </section>
      )}

      <div style={{ height: "var(--jk-gap-section)" }} />
    </main>
  );
}
