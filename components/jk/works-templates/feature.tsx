import Link from "next/link";
import Image from "next/image";
import { countLabel } from "@/lib/types";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import { CategoryRow } from "@/components/jk/CategoryRow";
import type { WorksTemplateProps } from "./types";

/* Portfolio « feature » — une catégorie mise en avant.
 *
 * La première catégorie occupe une grande affiche plein cadre en tête, les
 * autres suivent en index de lignes. Pour donner un point d'entrée fort. */

export function WorksFeature({ cats, content }: WorksTemplateProps) {
  const [lead, ...rest] = cats;

  return (
    <main
      style={{
        minHeight: "100svh",
        padding: "clamp(96px, 14vh, 140px) var(--jk-gap-page) var(--jk-gap-section)",
      }}
    >
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <Reveal as="div" style={{ marginBottom: "clamp(32px, 5vw, 56px)" }}>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--jk-serif)",
            fontWeight: 400,
            fontSize: "clamp(44px, 7vw, 92px)",
            lineHeight: 0.98,
            letterSpacing: "var(--jk-ls-display)",
          }}
        >
          {content.home.categoriesTitle}
        </h1>
      </Reveal>

      {lead && (
        <Reveal as="div" style={{ marginBottom: "clamp(48px, 7vw, 88px)" }}>
          <Link
            href={`/travaux/${lead.slug}`}
            data-jk-label={lead.title}
            className="jk-cat-link"
            style={{
              position: "relative",
              display: "block",
              height: "clamp(460px, 72vh, 760px)",
              overflow: "hidden",
              background: "var(--jk-surface)",
              color: "#efe9e1",
            }}
          >
            {lead.coverSrc && (
              <Parallax>
                <Image src={lead.coverSrc} alt="" aria-hidden fill priority sizes="100vw" style={{ objectFit: "cover" }} />
              </Parallax>
            )}
            <span
              aria-hidden
              style={{
                position: "absolute",
                inset: 0,
                background:
                  "linear-gradient(to bottom, rgba(14,12,10,.4) 0%, rgba(14,12,10,0) 40%, rgba(14,12,10,.82) 100%)",
              }}
            />
            <div style={{ position: "absolute", left: "clamp(24px, 4vw, 56px)", right: "clamp(24px, 4vw, 56px)", bottom: "clamp(28px, 4vw, 52px)", display: "grid", gap: 14 }}>
              <span style={{ fontSize: 10, letterSpacing: "var(--jk-track-label)", textTransform: "uppercase", color: "var(--jk-brass)" }}>
                {lead.num} · {countLabel(lead)}
              </span>
              <span style={{ fontFamily: "var(--jk-serif)", fontSize: "clamp(44px, 6vw, 88px)", lineHeight: 0.98, letterSpacing: "var(--jk-ls-display)" }}>
                {lead.title}
              </span>
              <span style={{ display: "inline-flex", alignItems: "center", gap: 10, fontSize: 10, letterSpacing: "0.24em", textTransform: "uppercase", color: "rgba(239,233,225,.82)" }}>
                Voir la catégorie
                <span aria-hidden className="jk-cat-link__arrow">→</span>
              </span>
            </div>
          </Link>
        </Reveal>
      )}

      {rest.length > 0 && (
        <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
          {rest.map((c, i) => {
            const n =
              c.series.reduce((acc, s) => acc + s.photos.length, 0) +
              (c.directMedia?.filter((m) => m.kind === "photo").length ?? 0);
            return (
              <CategoryRow
                key={c.slug}
                href={`/travaux/${c.slug}`}
                num={c.num}
                title={c.title}
                count={`${n} ${c.unit}`}
                coverSrc={c.coverSrc}
                last={i === rest.length - 1}
                delay={Math.min(i, 5) * 80}
              />
            );
          })}
        </ul>
      )}
    </main>
  );
}
