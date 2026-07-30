import Image from "next/image";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import { Markdown } from "@/components/jk/Markdown";
import { PostGallery } from "@/components/jk/PostGallery";
import { PostEyebrow, PostBackLink, NoScriptReveal } from "./shared";
import type { PostTemplateProps } from "./types";

/* Template « feature » — grand format.
 *
 * Cover plein écran (100svh) avec titre centré en surimpression, indice de
 * défilement, puis corps de lecture centré et galerie large en fin. Le plus
 * spectaculaire des articles — pour une histoire phare. */

export function PostFeature({ post }: PostTemplateProps) {
  return (
    <main style={{ minHeight: "100svh" }}>
      <NoScriptReveal />

      <section
        style={{
          position: "relative",
          height: "100svh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "var(--jk-surface)",
        }}
      >
        {post.coverSrc && (
          <Parallax amplitude={0.24}>
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
              "radial-gradient(120% 90% at 50% 40%, rgba(14,12,10,.2) 0%, rgba(14,12,10,.5) 60%, rgba(14,12,10,.82) 100%)",
          }}
        />
        <Reveal
          as="div"
          style={{
            position: "relative",
            display: "grid",
            gap: 24,
            justifyItems: "center",
            textAlign: "center",
            padding: "0 var(--jk-gap-page)",
            maxWidth: 1000,
            color: "#efe9e1",
          }}
        >
          <PostEyebrow post={post} onImage />
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(46px, 8.5vw, 128px)",
              lineHeight: 0.98,
              letterSpacing: "var(--jk-ls-display)",
            }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p
              style={{
                margin: 0,
                maxWidth: "48ch",
                fontFamily: "var(--jk-serif)",
                fontStyle: "italic",
                fontSize: "clamp(19px, 2.4vw, 28px)",
                lineHeight: 1.36,
                color: "rgba(239,233,225,.85)",
              }}
            >
              {post.excerpt}
            </p>
          )}
        </Reveal>
        <span
          aria-hidden
          style={{
            position: "absolute",
            bottom: 34,
            left: "50%",
            transform: "translateX(-50%)",
            width: 1,
            height: 56,
            background:
              "linear-gradient(to bottom, transparent, var(--jk-brass))",
          }}
        />
      </section>

      <article
        style={{
          margin: "0 auto",
          maxWidth: 760,
          padding: "clamp(72px, 11vw, 150px) var(--jk-gap-page) 0",
        }}
      >
        {post.body.trim() && (
          <Reveal as="div">
            <Markdown>{post.body}</Markdown>
          </Reveal>
        )}
      </article>

      <div
        style={{
          margin: "0 auto",
          width: "min(100%, 1280px)",
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
