import Image from "next/image";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import { Markdown } from "@/components/jk/Markdown";
import { PostGallery } from "@/components/jk/PostGallery";
import { PostEyebrow, PostBackLink, NoScriptReveal } from "./shared";
import type { PostTemplateProps } from "./types";

/* Template « magazine » — ouverture de magazine.
 *
 * Titre surimprimé sur la cover en parallaxe, corps de lecture confortable
 * ouvert par une lettrine serif, galerie large en fin. Plus affirmé que
 * `classic` : le titre vit dans l'image plutôt qu'au-dessus. */

export function PostMagazine({ post }: PostTemplateProps) {
  return (
    <main style={{ minHeight: "100svh" }}>
      <NoScriptReveal />

      {/* Cover avec titre surimprimé */}
      <section
        style={{
          position: "relative",
          height: "clamp(460px, 78vh, 760px)",
          display: "flex",
          alignItems: "flex-end",
          overflow: "hidden",
          background: "var(--jk-surface)",
        }}
      >
        {post.coverSrc && (
          <Parallax amplitude={0.22}>
            <Image
              src={post.coverSrc}
              alt=""
              aria-hidden
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </Parallax>
        )}
        <span
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            background:
              "linear-gradient(to bottom, rgba(14,12,10,.4) 0%, rgba(14,12,10,0) 40%, rgba(14,12,10,.84) 100%)",
          }}
        />
        <Reveal
          as="div"
          style={{
            position: "relative",
            padding: "0 var(--jk-gap-page) clamp(40px, 6vw, 80px)",
            display: "grid",
            gap: 20,
            maxWidth: 1100,
            color: "#efe9e1",
          }}
        >
          <PostEyebrow post={post} onImage />
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(40px, 7vw, 92px)",
              lineHeight: 1.0,
              letterSpacing: "var(--jk-ls-display)",
            }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p
              style={{
                margin: 0,
                maxWidth: "54ch",
                fontFamily: "var(--jk-serif)",
                fontStyle: "italic",
                fontSize: "clamp(19px, 2.2vw, 26px)",
                lineHeight: 1.36,
                color: "rgba(239,233,225,.85)",
              }}
            >
              {post.excerpt}
            </p>
          )}
        </Reveal>
      </section>

      <article
        style={{
          margin: "0 auto",
          maxWidth: 760,
          padding: "clamp(56px, 9vw, 120px) var(--jk-gap-page) 0",
        }}
      >
        {post.body.trim() && (
          <Reveal as="div" className="jk-dropcap">
            <Markdown>{post.body}</Markdown>
          </Reveal>
        )}
      </article>

      <div
        style={{
          margin: "0 auto",
          width: "min(100%, 1180px)",
          padding: "0 var(--jk-gap-page)",
        }}
      >
        <PostGallery media={post.media} />
      </div>

      <div
        style={{
          margin: "clamp(56px, 8vw, 96px) auto 0",
          maxWidth: 760,
          padding: "0 var(--jk-gap-page) var(--jk-gap-section)",
        }}
      >
        <div style={{ borderTop: "1px solid var(--jk-rule)", paddingTop: 28 }}>
          <PostBackLink />
        </div>
      </div>
    </main>
  );
}
