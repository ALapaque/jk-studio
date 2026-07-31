import { CategoryClassic } from "./classic";
import { CategorySplit } from "./split";
import { CategoryGallery } from "./gallery";
import { CategorySpread } from "./spread";
import { CategoryCinema } from "./cinema";
import type { CategoryTemplateEntry, CategoryTemplateProps } from "./types";

export type { CategoryTemplateProps, CategoryTemplateEntry } from "./types";

/** Registre des templates de page catégorie. Premier = défaut. */
export const CATEGORY_TEMPLATES: CategoryTemplateEntry[] = [
  {
    key: "classic",
    label: "Cover & sections",
    description:
      "En-tête en cover, liste des séries puis sélection de médias. La mise en page actuelle.",
    Component: CategoryClassic,
  },
  {
    key: "split",
    label: "Séries en cartes",
    description:
      "En-tête texte, séries en grille de cartes couverture (mini-affiches), puis sélection de médias.",
    Component: CategorySplit,
  },
  {
    key: "gallery",
    label: "Médias d'abord",
    description:
      "Cover en bandeau, sélection de médias directs en tête, liste des séries en pied.",
    Component: CategoryGallery,
  },
  {
    key: "spread",
    label: "Double page",
    description:
      "Cover, médias (photos directes + covers de séries) en galerie double page qui parallaxe, index des séries en pied.",
    Component: CategorySpread,
  },
  {
    key: "cinema",
    label: "Cinéma",
    description:
      "Cover plein écran, médias empilés bord à bord en parallaxe ample avec grandes légendes, défilement continu.",
    Component: CategoryCinema,
  },
];

export const CATEGORY_TEMPLATE_OPTIONS = CATEGORY_TEMPLATES.map(
  ({ key, label, description }) => ({ key, label, description }),
);

export function getCategoryTemplate(
  key: string | null | undefined,
): (props: CategoryTemplateProps) => React.ReactNode {
  const found = CATEGORY_TEMPLATES.find((t) => t.key === key);
  return (found ?? CATEGORY_TEMPLATES[0]).Component;
}
