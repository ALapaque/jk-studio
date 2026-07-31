import { createElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/admin";
import { getCategories } from "@/lib/data";
import { getSiteContent } from "@/lib/content";
import { getHomeTemplate } from "@/components/jk/home-templates";
import { getWorksTemplate } from "@/components/jk/works-templates";
import { getCategoryTemplate } from "@/components/jk/category-templates";
import { getAboutTemplate } from "@/components/jk/about-templates";
import { getContactTemplate } from "@/components/jk/contact-templates";

/* Aperçu d'un template de page singleton, pour l'iframe de l'admin (Apparence).
 *
 * Comme `/preview/[kind]/[id]` : hors des groupes (refonte)/admin, coquille
 * refonte (tokens/police) SANS IntroLoader/PageTransition/Nav/Footer, protégée
 * par requireUser() et non indexable. Le contenu `site_content` est toujours
 * « enregistré » (pas de brouillon), donc on lit les getters publics.
 * `slug` = home | works | category | about | contact ; `?tpl=` = clé testée. */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PagePreview({
  params,
  searchParams,
}: {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tpl?: string }>;
}) {
  await requireUser();
  const { slug } = await params;
  const { tpl } = await searchParams;

  let body: React.ReactNode;

  if (slug === "home") {
    const [cats, content] = await Promise.all([
      getCategories(),
      getSiteContent(),
    ]);
    body = createElement(getHomeTemplate(tpl), { cats, content });
  } else if (slug === "works") {
    const [cats, content] = await Promise.all([
      getCategories(),
      getSiteContent(),
    ]);
    body = createElement(getWorksTemplate(tpl), { cats, content });
  } else if (slug === "category") {
    // La mise en page catégorie est partagée : on prévisualise sur une
    // catégorie échantillon (la première publiée).
    const cats = await getCategories();
    const category = cats[0];
    body = category ? (
      createElement(getCategoryTemplate(tpl), { category })
    ) : (
      <PreviewNotice>Aucune catégorie publiée à prévisualiser.</PreviewNotice>
    );
  } else if (slug === "about") {
    const content = await getSiteContent();
    body = createElement(getAboutTemplate(tpl), { about: content.about });
  } else if (slug === "contact") {
    const content = await getSiteContent();
    // `preview` : neutralise l'envoi réel du formulaire dans l'iframe.
    body = createElement(getContactTemplate(tpl), {
      contact: content.contact,
      preview: true,
    });
  } else {
    notFound();
  }

  return (
    <div
      style={{
        background: "var(--jk-bg)",
        color: "var(--jk-ink)",
        fontFamily: "var(--jk-sans)",
        minHeight: "100svh",
      }}
    >
      {body}
    </div>
  );
}

function PreviewNotice({ children }: { children: React.ReactNode }) {
  return (
    <p
      style={{
        padding: "clamp(96px, 20vh, 200px) var(--jk-gap-page)",
        color: "var(--jk-ink-mute)",
        fontFamily: "var(--jk-sans)",
        fontSize: 14,
      }}
    >
      {children}
    </p>
  );
}
