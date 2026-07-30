import Image from "next/image";
import { Reveal } from "@/components/jk/Reveal";
import { Parallax } from "@/components/jk/Parallax";
import { Markdown } from "@/components/jk/Markdown";
import { PostEyebrow, PostBackLink, NoScriptReveal } from "./shared";
import type { PostTemplateProps } from "./types";

/* Template « galleryFirst » — images d'abord.
 *
 * L'article s'ouvre sur une mosaïque (cover pleine largeur puis grille des
 * images), le texte vient ensuite. Pour les histoires où l'image raconte avant
 * les mots. Si l'article n'a pas de galerie, on retombe sur la seule cover. */

export function PostGalleryFirst({ post }: PostTemplateProps) {
  const tiles = post.media;

  return (
    <main style={{ minHeight: "100svh" }}>
      <NoScriptReveal />

      {/* Cover pleine largeur */}
      {post.coverSrc && (
        <div
          style={{
            position: "relative",
            height: "clamp(360px, 66vh, 680px)",
            overflow: "hidden",
            background: "var(--jk-surface)",
          }}
        >
          <Parallax amplitude={0.2}>
            <Image
              src={post.coverSrc}
              alt={post.title}
              fill
              priority
              sizes="100vw"
              style={{ objectFit: "cover" }}
            />
          </Parallax>
        </div>
      )}

      {/* Mosaïque des images de la galerie */}
      {tiles.length > 0 && (
        <section
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fill, minmax(min(100%, 300px), 1fr))",
            gridAutoFlow: "dense",
            gap: "clamp(8px, 1vw, 16px)",
            padding: "clamp(8px, 1vw, 16px) 0",
          }}
        >
          {tiles.map((m, i) => {
            // Un pavé large de temps en temps, pour un rythme de mosaïque.
            const wide = i % 5 === 0;
            return (
              <Reveal
                as="div"
                key={`${m.src}-${i}`}
                style={{
                  position: "relative",
                  gridColumn: wide ? "span 2" : undefined,
                  aspectRatio: wide ? "16 / 10" : "1 / 1",
                  overflow: "hidden",
                  background: "var(--jk-surface)",
                }}
                className="jk-mosaic-tile"
              >
                <Image
                  src={m.src}
                  alt={m.caption}
                  fill
                  sizes="(max-width: 640px) 100vw, 40vw"
                  className="jk-zoom"
                  style={{ objectFit: "cover" }}
                />
              </Reveal>
            );
          })}
        </section>
      )}

      {/* Texte ensuite */}
      <article
        style={{
          margin: "0 auto",
          maxWidth: 720,
          padding: "clamp(64px, 10vw, 130px) var(--jk-gap-page) var(--jk-gap-section)",
        }}
      >
        <Reveal as="div" style={{ display: "grid", gap: 20, marginBottom: 44 }}>
          <PostEyebrow post={post} />
          <h1
            style={{
              margin: 0,
              fontFamily: "var(--jk-serif)",
              fontWeight: 400,
              fontSize: "clamp(36px, 5.4vw, 66px)",
              lineHeight: 1.04,
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

        {post.body.trim() && (
          <Reveal as="div">
            <Markdown>{post.body}</Markdown>
          </Reveal>
        )}

        <div
          style={{
            marginTop: "clamp(56px, 8vw, 96px)",
            borderTop: "1px solid var(--jk-rule)",
            paddingTop: 28,
          }}
        >
          <PostBackLink />
        </div>
      </article>
    </main>
  );
}
