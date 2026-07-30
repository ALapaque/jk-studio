import { Reveal } from "@/components/jk/Reveal";
import { Markdown } from "@/components/jk/Markdown";
import { PostGallery } from "@/components/jk/PostGallery";
import { PostEyebrow, PostBackLink, NoScriptReveal } from "./shared";
import type { PostTemplateProps } from "./types";

/* Template « minimal » — colonne calme.
 *
 * Pas de hero : la lecture prime. Colonne étroite, typographie sobre, beaucoup
 * d'air. La cover, si elle existe, n'apparaît pas en grand — l'article s'ouvre
 * directement sur le titre. La galerie reste en fin, plus discrète. Idéal pour
 * un texte long ou une note d'intention. */

export function PostMinimal({ post }: PostTemplateProps) {
  return (
    <main
      style={{
        minHeight: "100svh",
        padding:
          "clamp(120px, 18vh, 180px) var(--jk-gap-page) var(--jk-gap-section)",
      }}
    >
      <NoScriptReveal />

      <article style={{ margin: "0 auto", maxWidth: 620 }}>
        <Reveal as="div" style={{ display: "grid", gap: 20, marginBottom: 48 }}>
          <PostEyebrow post={post} />
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(30px, 4vw, 46px)",
              lineHeight: 1.1,
              letterSpacing: "var(--jk-ls-tight)",
            }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p
              style={{
                margin: 0,
                fontFamily: "var(--jk-serif)",
                fontStyle: "italic",
                fontSize: "clamp(17px, 2vw, 20px)",
                lineHeight: 1.5,
                color: "var(--jk-ink-mute)",
              }}
            >
              {post.excerpt}
            </p>
          )}
          <span
            aria-hidden
            style={{ width: 40, height: 1, background: "var(--jk-brass)" }}
          />
        </Reveal>

        {post.body.trim() && (
          <Reveal as="div">
            <Markdown>{post.body}</Markdown>
          </Reveal>
        )}
      </article>

      {post.media.length > 0 && (
        <div style={{ margin: "0 auto", width: "min(100%, 820px)" }}>
          <PostGallery media={post.media} />
        </div>
      )}

      <div
        style={{
          margin: "clamp(56px, 8vw, 96px) auto 0",
          maxWidth: 620,
          borderTop: "1px solid var(--jk-rule)",
          paddingTop: 28,
        }}
      >
        <PostBackLink />
      </div>
    </main>
  );
}
