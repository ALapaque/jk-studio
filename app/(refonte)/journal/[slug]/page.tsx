import type { Metadata } from "next";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";
import { getPublishedPosts, getPostBySlug } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { Reveal } from "@/components/jk/Reveal";
import { Markdown } from "@/components/jk/Markdown";

export const revalidate = 60;

export async function generateStaticParams() {
  const posts = await getPublishedPosts();
  return posts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return { title: "Article introuvable" };
  const url = `${SITE_URL}/journal/${post.slug}`;
  return {
    title: post.title,
    description: post.excerpt || undefined,
    alternates: { canonical: url },
    openGraph: {
      type: "article",
      url,
      title: post.title,
      description: post.excerpt || undefined,
      publishedTime: post.date,
      images: post.coverSrc ? [{ url: post.coverSrc }] : undefined,
    },
  };
}

const fmtDate = (iso: string) =>
  new Date(iso).toLocaleDateString("fr-BE", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

export default async function PostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt || undefined,
    datePublished: post.date,
    image: post.coverSrc || undefined,
    url: `${SITE_URL}/journal/${post.slug}`,
    keywords: post.tags.length ? post.tags.join(", ") : undefined,
  };

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
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

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
            <Image
              src={post.coverSrc}
              alt={post.title}
              fill
              priority
              sizes="(max-width: 900px) 100vw, 820px"
              style={{ objectFit: "cover" }}
            />
          </Reveal>
        )}

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
      </article>
    </main>
  );
}
