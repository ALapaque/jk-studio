import { createElement } from "react";
import type { Metadata } from "next";
import { getCategories } from "@/lib/data";
import { getSiteContent, getAppearance } from "@/lib/content";
import { getHomeTemplate } from "@/components/jk/home-templates";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "Accueil",
};

/* Accueil de la refonte.
 *
 * La mise en page est choisie globalement dans Apparence
 * (`appearance.pageTemplates.home`) : on charge le template correspondant
 * depuis le registre `home-templates` (repli `classic`). Aucun texte n'est écrit
 * en dur ; tout vient de `site_content` et des données. */

export default async function AccueilRefontePage() {
  const [cats, content, appearance] = await Promise.all([
    getCategories(),
    getSiteContent(),
    getAppearance(),
  ]);
  const template = getHomeTemplate(appearance.pageTemplates?.home);
  return createElement(template, { cats, content });
}
