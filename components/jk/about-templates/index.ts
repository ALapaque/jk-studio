import { AboutClassic } from "./classic";
import { AboutFeature } from "./feature";
import { AboutManifesto } from "./manifesto";
import { AboutColumns } from "./columns";
import { AboutCentered } from "./centered";
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
  {
    key: "columns",
    label: "Magazine",
    description:
      "Grand titre, portrait en bandeau large, récit en deux colonnes de texte, faits en pied.",
    Component: AboutColumns,
  },
  {
    key: "centered",
    label: "Centré",
    description:
      "Portrait centré en tête, récit dans une colonne étroite centrée. Calme et symétrique.",
    Component: AboutCentered,
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
