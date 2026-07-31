import Image from "next/image";
import { countLabel } from "@/lib/types";
import { IndexRow } from "@/components/jk/IndexRow";
import { Parallax } from "@/components/jk/Parallax";
import { Reveal } from "@/components/jk/Reveal";
import { CategoryMedia } from "@/components/jk/CategoryMedia";
import type { CategoryTemplateProps } from "./types";

/* Template « classic » de la page catégorie — en-tête cover + section Séries +
 * section Sélection (médias directs). Extrait tel quel de la page. */

/** Étiquette de section : filet laiton + libellé, comme la galerie d'article. */
function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 14,
        fontSize: 10,
        letterSpacing: "var(--jk-track-label)",
        textTransform: "uppercase",
        color: "var(--jk-ink-mute)",
      }}
    >
      <span
        aria-hidden
        style={{ width: 44, height: 1, background: "var(--jk-brass)" }}
      />
      {children}
    </span>
  );
}

export function CategoryClassic({ category: cat }: CategoryTemplateProps) {
  const count = countLabel(cat);
  const hasMedia = (cat.directMedia?.length ?? 0) > 0;

  return (
    <main style={{ background: "var(--jk-bg)", color: "var(--jk-ink)" }}>
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      {/* ---- en-tête ---- */}
      {cat.coverSrc ? (
        <section
          style={{
            position: "relative",
            height: "clamp(420px, 68vh, 700px)",
            display: "flex",
            alignItems: "flex-end",
            overflow: "hidden",
            background: "var(--jk-surface)",
          }}
        >
          <Parallax>
            <Image
              src={cat.coverSrc}
              alt=""
              aria-hidden
              fill
              sizes="100vw"
              priority
              style={{ objectFit: "cover" }}
            />
          </Parallax>
          <span
            aria-hidden
            style={{
              position: "absolute",
              inset: 0,
              background:
                "linear-gradient(to bottom, rgba(14,12,10,.44) 0%, rgba(14,12,10,.08) 42%, rgba(14,12,10,.8) 100%)",
            }}
          />
          <Reveal
            as="div"
            style={{
              position: "relative",
              padding: "0 var(--jk-gap-page) clamp(40px, 6vw, 76px)",
              display: "grid",
              gap: 20,
              color: "#efe9e1",
            }}
          >
            <CategoryEyebrow num={cat.num} count={count} onImage />
            <CategoryTitle>{cat.title}</CategoryTitle>
            {cat.description && (
              <CategoryDescription onImage>{cat.description}</CategoryDescription>
            )}
          </Reveal>
        </section>
      ) : (
        <header
          style={{
            padding: "clamp(96px, 14vh, 140px) var(--jk-gap-page) 0",
          }}
        >
          <Reveal as="div" style={{ display: "grid", gap: 18 }}>
            <CategoryEyebrow num={cat.num} count={count} />
            <CategoryTitle>{cat.title}</CategoryTitle>
            {cat.description && (
              <CategoryDescription>{cat.description}</CategoryDescription>
            )}
          </Reveal>
        </header>
      )}

      {/* ---- séries ---- */}
      {cat.series.length > 0 && (
        <section
          style={{
            padding: "clamp(56px, 8vw, 96px) var(--jk-gap-page) 0",
            display: "grid",
            gap: 32,
          }}
        >
          <SectionLabel>Séries</SectionLabel>
          <ul
            style={{
              listStyle: "none",
              margin: 0,
              padding: 0,
              borderBottom: "1px solid var(--jk-rule)",
            }}
          >
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

      {/* ---- médias directs de la catégorie ---- */}
      {hasMedia && (
        <section
          style={{
            padding: "clamp(56px, 8vw, 96px) var(--jk-gap-page) 0",
            display: "grid",
            gap: 40,
          }}
        >
          <Reveal as="div">
            <SectionLabel>Sélection</SectionLabel>
          </Reveal>
          <CategoryMedia media={cat.directMedia ?? []} />
        </section>
      )}

      {cat.series.length === 0 && !hasMedia && (
        <p
          style={{
            padding: "clamp(48px, 7vw, 80px) var(--jk-gap-page)",
            color: "var(--jk-ink-mute)",
            fontSize: 14,
          }}
        >
          Aucune série ni média publié dans cet univers pour l&apos;instant.
        </p>
      )}

      <div style={{ height: "var(--jk-gap-section)" }} />
    </main>
  );
}

/* --- blocs d'en-tête partagés entre les deux variantes (cover / plein) --- */

function CategoryEyebrow({
  num,
  count,
  onImage = false,
}: {
  num: string;
  count: string;
  onImage?: boolean;
}) {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "baseline",
        gap: 14,
        fontSize: 10,
        letterSpacing: "var(--jk-track-label)",
        textTransform: "uppercase",
        color: onImage ? "rgba(239,233,225,.7)" : "var(--jk-ink-mute)",
      }}
    >
      <span style={{ color: "var(--jk-brass)" }}>({num})</span>
      {count}
    </span>
  );
}

function CategoryTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1
      style={{
        margin: 0,
        fontFamily: "var(--jk-serif)",
        fontWeight: 400,
        fontSize: "clamp(44px, 7vw, 96px)",
        lineHeight: 0.98,
        letterSpacing: "var(--jk-ls-display)",
      }}
    >
      {children}
    </h1>
  );
}

function CategoryDescription({
  children,
  onImage = false,
}: {
  children: React.ReactNode;
  onImage?: boolean;
}) {
  return (
    <p
      style={{
        margin: 0,
        maxWidth: "48ch",
        fontFamily: "var(--jk-serif)",
        fontSize: "clamp(18px, 2.2vw, 21px)",
        lineHeight: "var(--jk-lh-body)",
        color: onImage ? "rgba(239,233,225,.82)" : "var(--jk-ink-mute)",
      }}
    >
      {children}
    </p>
  );
}
