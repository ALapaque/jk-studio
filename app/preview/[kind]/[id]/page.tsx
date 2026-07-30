import { createElement } from "react";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { requireUser } from "@/lib/admin";
import { getSeriesPreviewProps, getPostPreview } from "@/lib/preview-data";
import { getSeriesTemplate } from "@/components/jk/series-templates";
import { getPostTemplate } from "@/components/jk/post-templates";

/* Aperçu d'un template de page détail, destiné à l'iframe de l'éditeur admin.
 *
 * Hors des groupes (refonte) et admin/(app) à dessein : on veut la coquille
 * visuelle de la refonte (tokens, polices, thème du layout racine) MAIS sans
 * IntroLoader ni PageTransition, gênants en iframe. La route est protégée par
 * requireUser() (brouillons inclus via les fonctions admin) et non indexable. */

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  robots: { index: false, follow: false },
};

export default async function PreviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ kind: string; id: string }>;
  searchParams: Promise<{ tpl?: string }>;
}) {
  await requireUser();
  const { kind, id } = await params;
  const { tpl } = await searchParams;

  let body: React.ReactNode;
  if (kind === "series") {
    const props = await getSeriesPreviewProps(id);
    if (!props) notFound();
    body = createElement(getSeriesTemplate(tpl), props);
  } else if (kind === "post") {
    const post = await getPostPreview(id);
    if (!post) notFound();
    body = createElement(getPostTemplate(tpl), { post });
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
