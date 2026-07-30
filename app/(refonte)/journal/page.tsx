import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { getPublishedPosts } from "@/lib/data";
import { getSiteContent } from "@/lib/content";
import { Reveal } from "@/components/jk/Reveal";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { nav } = await getSiteContent();
  return {
    title: nav.journal,
    description:
      "Le journal du studio — mariages, événements et coulisses récents.",
  };
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-BE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

/* Journal (blog) — liste des articles publiés. Éditorial : couverture, titre en
 * serif, chapô et date. Vide tant qu'aucun article n'est publié. */

export default async function JournalPage() {
  const [posts, content] = await Promise.all([
    getPublishedPosts(),
    getSiteContent(),
  ]);

  return (
    <main
      style={{
        minHeight: "100dvh",
        padding:
          "clamp(96px, 14vh, 140px) var(--jk-gap-page) var(--jk-gap-section)",
      }}
    >
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <Reveal as="div" style={{ display: "grid", gap: 18, marginBottom: 64 }}>
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
          {content.nav.journal}
        </span>
        <h1
          style={{
            margin: 0,
            fontFamily: "var(--jk-serif)",
            fontWeight: 400,
            fontSize: "clamp(44px, 7vw, 88px)",
            lineHeight: 1,
            letterSpacing: "var(--jk-ls-display)",
          }}
        >
          Histoires récentes
        </h1>
      </Reveal>

      {posts.length ? (
        <ul
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(320px, 1fr))",
            gap: "56px var(--jk-gap-grid)",
            listStyle: "none",
            margin: 0,
            padding: 0,
          }}
        >
          {posts.map((p, i) => (
            <li key={p.slug}>
              <Reveal as="div" delay={Math.min(i, 6) * 70}>
                <Link
                  href={`/journal/${p.slug}`}
                  style={{ display: "grid", gap: 18, color: "inherit" }}
                >
                  {p.coverSrc && (
                    <span
                      style={{
                        position: "relative",
                        display: "block",
                        aspectRatio: "3 / 2",
                        overflow: "hidden",
                        background: "var(--jk-surface)",
                      }}
                    >
                      <Image
                        src={p.coverSrc}
                        alt={p.title}
                        fill
                        sizes="(max-width: 760px) 100vw, 33vw"
                        className="jk-zoom"
                        style={{ objectFit: "cover" }}
                      />
                    </span>
                  )}
                  <div style={{ display: "grid", gap: 10 }}>
                    <span
                      style={{
                        fontSize: 10,
                        letterSpacing: "var(--jk-track-place)",
                        textTransform: "uppercase",
                        color: "var(--jk-ink-mute)",
                      }}
                    >
                      {fmtDate(p.date)}
                      {p.tags.length ? ` · ${p.tags.join(" · ")}` : ""}
                    </span>
                    <h2
                      style={{
                        margin: 0,
                        fontFamily: "var(--jk-serif)",
                        fontWeight: 400,
                        fontSize: "clamp(24px, 2.8vw, 32px)",
                        lineHeight: 1.1,
                        letterSpacing: "var(--jk-ls-tight)",
                      }}
                    >
                      {p.title}
                    </h2>
                    {p.excerpt && (
                      <p
                        style={{
                          margin: 0,
                          maxWidth: "42ch",
                          fontSize: 15,
                          lineHeight: 1.5,
                          color: "var(--jk-ink-mute)",
                        }}
                      >
                        {p.excerpt}
                      </p>
                    )}
                  </div>
                </Link>
              </Reveal>
            </li>
          ))}
        </ul>
      ) : (
        <p style={{ color: "var(--jk-ink-mute)", fontSize: 16 }}>
          Les premières histoires arrivent bientôt.
        </p>
      )}
    </main>
  );
}
