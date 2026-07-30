import Link from "next/link";
import Image from "next/image";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import { Markdown } from "@/components/jk/Markdown";
import { PostGallery } from "@/components/jk/PostGallery";
import type { PostTemplateProps } from "./types";

/* Template « classic » d'un article — mise en page historique du journal,
 * extraite telle quelle : header éditorial, cover parallaxe, corps Markdown,
 * puis galerie large hors colonne de lecture. C'est le défaut. */

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-BE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export function PostClassic({ post }: PostTemplateProps) {
  return (
    <main
      style={{
        minHeight: "100svh",
        padding:
          "clamp(96px, 14vh, 140px) var(--jk-gap-page) var(--jk-gap-section)",
      }}
    >
      <noscript>
        <style>{`.jk-reveal{opacity:1;transform:none;transition:none}`}</style>
      </noscript>

      <article style={{ margin: "0 auto", maxWidth: 820 }}>
        <Reveal as="div" style={{ display: "grid", gap: 18, marginBottom: 40 }}>
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
            {fmtDate(post.date)}
            {post.tags.length ? ` · ${post.tags.join(" · ")}` : ""}
          </span>
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(38px, 6vw, 72px)",
              lineHeight: 1.02,
              letterSpacing: "var(--jk-ls-display)",
            }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p
              style={{
                margin: 0,
                maxWidth: "52ch",
                fontFamily: "var(--jk-serif)",
                fontSize: "clamp(19px, 2.2vw, 24px)",
                lineHeight: 1.4,
                color: "var(--jk-ink-mute)",
              }}
            >
              {post.excerpt}
            </p>
          )}
        </Reveal>

        {post.coverSrc && (
          <Reveal
            as="div"
            style={{
              position: "relative",
              aspectRatio: "16 / 9",
              overflow: "hidden",
              background: "var(--jk-surface)",
              margin: "0 0 clamp(40px, 6vw, 72px)",
            }}
          >
            {/* Parallaxe sur la cover, comme l'ouverture d'une série. */}
            <Parallax>
              <Image
                src={post.coverSrc}
                alt={post.title}
                fill
                priority
                sizes="(max-width: 900px) 100vw, 820px"
                style={{ objectFit: "cover" }}
              />
            </Parallax>
          </Reveal>
        )}

        {post.body.trim() && (
          <Reveal as="div">
            <Markdown>{post.body}</Markdown>
          </Reveal>
        )}
      </article>

      {/* Galerie média — hors de la colonne de lecture (820px) pour respirer
          plus large, façon planche éditoriale. Séquence animée. */}
      <div style={{ margin: "0 auto", width: "min(100%, 1180px)" }}>
        <PostGallery media={post.media} />
      </div>

      <div
        style={{
          margin: "clamp(56px, 8vw, 96px) auto 0",
          maxWidth: 820,
          borderTop: "1px solid var(--jk-rule)",
          paddingTop: 28,
        }}
      >
        <Link
          href="/journal"
          style={{
            fontSize: 11,
            letterSpacing: "0.16em",
            textTransform: "uppercase",
            color: "var(--jk-brass)",
            borderBottom: "1px solid var(--jk-brass)",
            paddingBottom: 3,
          }}
        >
          ← Toutes les histoires
        </Link>
      </div>
    </main>
  );
}
