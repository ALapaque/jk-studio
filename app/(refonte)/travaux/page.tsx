import { createElement } from "react";
import type { Metadata } from "next";
import { getCategories } from "@/lib/data";
import { getSiteContent, getAppearance } from "@/lib/content";
import { getWorksTemplate } from "@/components/jk/works-templates";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Séries",
  description:
    "L'ensemble des séries photographiques, par univers — Nightlife, mariages, événements.",
};

/* Index portfolio. La mise en page vient d'Apparence
 * (`appearance.pageTemplates.works`), résolue via le registre `works-templates`
 * (repli `classic`). */

export default async function SeriesIndexPage() {
  const [cats, content, appearance] = await Promise.all([
    getCategories(),
    getSiteContent(),
    getAppearance(),
  ]);
  const template = getWorksTemplate(appearance.pageTemplates?.works);
  return createElement(template, { cats, content });
}
