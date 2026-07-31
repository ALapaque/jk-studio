import { createElement } from "react";
import type { Metadata } from "next";
import { getSiteContent, getAppearance } from "@/lib/content";
import { getAboutTemplate } from "@/components/jk/about-templates";

export const revalidate = 60;

export async function generateMetadata(): Promise<Metadata> {
  const { about } = await getSiteContent();
  return { title: about.eyebrow, description: about.title };
}

/* À propos. La mise en page vient d'Apparence
 * (`appearance.pageTemplates.about`), résolue via `about-templates`. */

export default async function AProposPage() {
  const [content, appearance] = await Promise.all([
    getSiteContent(),
    getAppearance(),
  ]);
  const template = getAboutTemplate(appearance.pageTemplates?.about);
  return createElement(template, { about: content.about });
}
