import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getCategories } from "@/lib/data";
import { getSiteContent } from "@/lib/content";
import { Reveal } from "@/components/jk/Reveal";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { prints } = await getSiteContent();
  return { title: prints.eyebrow, description: prints.lead };
}

/* Tirages / Albums (Lot 6).
 *
 * Page éditoriale, pas une boutique : le §9 exclut explicitement tout tunnel
 * e-commerce et tout prix affiché en v1. Le seul appel à l'action renvoie
 * vers le contact.
 *
 * Les formats viennent de `site_content` et non du code : ils évoluent, et le
 * photographe doit pouvoir les corriger sans redéploiement. */

export default async function TiragesPage() {
  const [content, cats] = await Promise.all([getSiteContent(), getCategories()]);
  const { prints } = content;

  // Visuel d'ambiance : une photo réelle du portfolio plutôt qu'une image
  // décorative importée. Rien n'est codé en dur.
  const visual = cats.flatMap((c) => c.series.flatMap((s) => s.photos))[0];

  return (
    <main
      style={{
        minHeight: "100dvh",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
      }}
    >
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <div
        style={{
          position: "relative",
          minHeight: "42dvh",
          background: "var(--jk-surface)",
          overflow: "hidden",
        }}
      >
        {visual && (
          <Image
            src={visual.src}
            alt=""
            aria-hidden
            fill
            sizes="(max-width: 760px) 100vw, 50vw"
            placeholder={visual.blurDataURL ? "blur" : "empty"}
            blurDataURL={visual.blurDataURL || undefined}
            style={{ objectFit: "cover" }}
          />
        )}
      </div>

      <div
        style={{
          padding: "clamp(64px, 9vh, 96px) var(--jk-gap-page)",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          gap: 56,
        }}
      >
        <Reveal as="div" style={{ display: "grid", gap: 40 }}>
          <span
            style={{
              display: "inline-flex",
              alignItems: "baseline",
              gap: 14,
              fontSize: 10,
              letterSpacing: "var(--jk-track-label)",
              textTransform: "uppercase",
              color: "var(--jk-ink-mute)",
            }}
          >
            <span style={{ color: "var(--jk-brass)" }}>(06)</span>
            {prints.eyebrow}
          </span>

          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(34px, 5vw, 60px)",
              lineHeight: 1.04,
              letterSpacing: "var(--jk-ls-tight)",
              textWrap: "balance",
            }}
          >
            {prints.title}
          </h1>

          <p
            style={{
              margin: 0,
              maxWidth: "46ch",
              fontFamily: "var(--jk-serif)",
              fontSize: "clamp(18px, 2.2vw, 21px)",
              lineHeight: "var(--jk-lh-body)",
              color: "var(--jk-ink-mute)",
            }}
          >
            {prints.lead}
          </p>
        </Reveal>

        <div>
          <ul style={{ listStyle: "none", margin: 0, padding: 0 }}>
            {prints.formats.map((f, i) => (
              <li key={f.name}
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  alignItems: "baseline",
                  gap: 24,
                  padding: "26px 0",
                  borderTop: "1px solid var(--jk-rule)",
                  borderBottom:
                    i === prints.formats.length - 1
                      ? "1px solid var(--jk-rule)"
                      : undefined,
                }}
              >
                <Reveal delay={Math.min(i, 5) * 80}>
                  <span
                    style={{
                      fontSize: 10,
                      letterSpacing: "0.2em",
                      color: "var(--jk-brass)",
                    }}
                  >
                    {String(i + 1).padStart(2, "0")}
                  </span>
                </Reveal>
                <span
                  style={{
                    flex: 1,
                    minWidth: 160,
                    fontFamily: "var(--jk-serif)",
                    fontSize: "clamp(22px, 2.6vw, 30px)",
                    lineHeight: 1.1,
                  }}
                >
                  {f.name}
                </span>
                <span
                  style={{
                    fontSize: 10,
                    letterSpacing: "var(--jk-track-place)",
                    textTransform: "uppercase",
                    color: "var(--jk-ink-mute)",
                  }}
                >
                  {f.spec}
                </span>
              </li>
            ))}
          </ul>

          {/* Unique appel à l'action : vers le contact, pas vers un panier. */}
          <Link
            href="/contact"
            className="jk-cat-row"
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 24,
              paddingTop: 40,
              color: "inherit",
            }}
          >
            <span
              style={{
                fontFamily: "var(--jk-serif)",
                fontSize: "clamp(22px, 2.6vw, 30px)",
              }}
            >
              {prints.cta}
            </span>
            <span
              aria-hidden
              style={{ width: 72, height: 1, background: "var(--jk-brass)" }}
            />
          </Link>
        </div>
      </div>
    </main>
  );
}
