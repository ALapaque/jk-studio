import { createElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getPublishedPosts, getPostBySlug } from "@/lib/data";
import { SITE_URL } from "@/lib/site";
import { getPostTemplate } from "@/components/jk/post-templates";

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

  // La mise en page est choisie par article via `post.template` (repli
  // `classic`). Le JSON-LD reste ici, hors du template, comme les métadonnées.
  // `createElement` (clé dynamique du registre) évite le faux positif du
  // compilateur React sur les composants « créés au rendu ».
  const template = getPostTemplate(post.template);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      {createElement(template, { post })}
    </>
  );
}
