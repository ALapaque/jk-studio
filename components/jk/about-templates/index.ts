import { AboutClassic } from "./classic";
import { AboutFeature } from "./feature";
import { AboutManifesto } from "./manifesto";
import type { AboutTemplateEntry, AboutTemplateProps } from "./types";

export type { AboutTemplateProps, AboutTemplateEntry } from "./types";

/** Registre des templates de la page À-propos. Premier = défaut ; clé inconnue
 *  → repli sur `[0]`. */
export const ABOUT_TEMPLATES: AboutTemplateEntry[] = [
  {
    key: "classic",
    label: "Portrait & récit",
    description:
      "Portrait en situation à gauche, texte à la première personne à droite. La mise en page actuelle.",
    Component: AboutClassic,
  },
  {
    key: "feature",
    label: "Grand portrait",
    description:
      "Portrait plein cadre en ouverture, titre en surimpression, récit en colonne. Cinématographique.",
    Component: AboutFeature,
  },
  {
    key: "manifesto",
    label: "Manifeste",
    description:
      "Sans portrait : colonne étroite, récit puis principes en gros et faits en pied. Une déclaration.",
    Component: AboutManifesto,
  },
];

export const ABOUT_TEMPLATE_OPTIONS = ABOUT_TEMPLATES.map(
  ({ key, label, description }) => ({ key, label, description }),
);

export function getAboutTemplate(
  key: string | null | undefined,
): (props: AboutTemplateProps) => React.ReactNode {
  const found = ABOUT_TEMPLATES.find((t) => t.key === key);
  return (found ?? ABOUT_TEMPLATES[0]).Component;
}
